const path = require('path');
const async = require('async');
const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const { Student } = require('../models/User');
const logger = require('../services/logger');
const { two_month_cache } = require('../cache/node-cache');
const { AWS_S3_BUCKET_NAME } = require('../config');
const { s3 } = require('../aws');

const getAdmissions = asyncHandler(async (req, res) => {
  const students = await Student.find()
    .select(
      '-applications.doc_modification_thread -applications.uni_assist -email -birthday -applying_program_count -agents -editors -profile -isAccountActivated -updatedAt -generaldocs_threads -taigerai -notification -academic_background'
    )
    .populate('agents editors', 'firstname lastname')
    .populate('applications.programId', 'school program_name semester degree');
  res.status(200).send({ success: true, data: students });
});

const getAdmissionLetter = asyncHandler(async (req, res, next) => {
  const {
    params: { studentId, fileName }
  } = req;

  // AWS S3
  // download the file via aws s3 here
  const fileKey = fileName;
  let directory = `${studentId}/admission`;
  logger.info(`Trying to download admission letter: ${fileKey}`);
  directory = path.join(AWS_S3_BUCKET_NAME, directory);
  directory = directory.replace(/\\/g, '/');
  const options = {
    Key: fileKey,
    Bucket: directory
  };
  const value = two_month_cache.get(fileKey);
  if (value === undefined) {
    s3.getObject(options, (err, data) => {
      // Handle any error and exit
      if (!data || !data.Body) {
        logger.error('File not found in S3');
        throw new ErrorResponse(404, 'File not found.');
      }

      // No error happened
      const success = two_month_cache.set(fileKey, data.Body);
      if (success) {
        logger.info('Admission letter cache set successfully');
      }
      res.attachment(fileKey);
      res.end(data.Body);
      next();
    });
  } else {
    logger.info('Admission letter cache hit');
    res.attachment(fileKey);
    res.end(value);
    next();
  }
});

const getAdmissionsYear = asyncHandler(async (req, res) => {
  const { applications_year } = req.params;
  const tasks = await Student.find({ student_id: applications_year });
  res.status(200).send({ success: true, data: tasks });
});

module.exports = {
  getAdmissions,
  getAdmissionLetter,
  getAdmissionsYear
};
