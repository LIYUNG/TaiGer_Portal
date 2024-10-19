const async = require('async');
const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const logger = require('../services/logger');
const { two_month_cache } = require('../cache/node-cache');
const { AWS_S3_BUCKET_NAME } = require('../config');
const { getS3Object } = require('../aws/s3');

const getAdmissions = asyncHandler(async (req, res) => {
  const students = await req.db
    .model('Student')
    .find()
    .select(
      '-applications.doc_modification_thread -applications.uni_assist -birthday -applying_program_count -profile -isAccountActivated -updatedAt -generaldocs_threads -taigerai -notification -academic_background'
    )
    .populate(
      'agents editors',
      'firstname lastname firstname_firstname lastname_lastname'
    )
    .populate('applications.programId', 'school program_name semester degree');
  res.status(200).send({ success: true, data: students });
});

const getAdmissionLetter = asyncHandler(async (req, res, next) => {
  const {
    params: { studentId, fileName }
  } = req;

  // AWS S3
  // download the file via aws s3 here
  const fileKey = `${studentId}/admission/${fileName}`;
  logger.info(`Trying to download admission letter: ${fileKey}`);
  const value = two_month_cache.get(fileKey);
  if (value === undefined) {
    const response = await getS3Object(AWS_S3_BUCKET_NAME, fileKey);
    const success = two_month_cache.set(fileKey, Buffer.from(response));
    if (success) {
      logger.info('Admission letter cache set successfully');
    }
    res.attachment(fileKey);
    res.end(response);
    next();
  } else {
    logger.info('Admission letter cache hit');
    res.attachment(fileKey);
    res.end(value);
    next();
  }
});

const getAdmissionsYear = asyncHandler(async (req, res) => {
  const { applications_year } = req.params;
  const tasks = await req.db
    .model('Student')
    .find({ student_id: applications_year });
  res.status(200).send({ success: true, data: tasks });
});

module.exports = {
  getAdmissions,
  getAdmissionLetter,
  getAdmissionsYear
};
