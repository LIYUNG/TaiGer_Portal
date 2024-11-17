const async = require('async');
const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const logger = require('../services/logger');
const { two_month_cache } = require('../cache/node-cache');
const { AWS_S3_BUCKET_NAME } = require('../config');
const { getS3Object } = require('../aws/s3');

const getProgramApplicationCounts = asyncHandler(async (req) => {
  try {
    const result = await req.db.model('User').aggregate([
      // Unwind applications array to have one document per application
      { $unwind: '$applications' },

      // Match applications with decided and closed fields set to "O"
      {
        $match: {
          'applications.decided': 'O',
          'applications.closed': 'O'
        }
      },

      // Group by programId and count occurrences
      {
        $group: {
          _id: '$applications.programId',
          applicationCount: { $sum: 1 }, // Total count of applications
          admissionCount: {
            $sum: {
              $cond: [{ $eq: ['$applications.admission', 'O'] }, 1, 0] // Count only admissions with "O"
            }
          },
          rejectionCount: {
            $sum: {
              $cond: [{ $eq: ['$applications.admission', 'X'] }, 1, 0] // Count only admissions with "O"
            }
          },
          pendingResultCount: {
            $sum: {
              $cond: [{ $eq: ['$applications.admission', '-'] }, 1, 0] // Count only admissions with "O"
            }
          }
        }
      },

      // Sort by count in descending order
      { $sort: { applicationCount: -1 } },

      // Lookup to populate program details
      {
        $lookup: {
          from: 'programs', // Ensure this matches the name of your Program collection
          localField: '_id',
          foreignField: '_id',
          as: 'programDetails'
        }
      },

      // Unwind programDetails array for easier access
      { $unwind: '$programDetails' },
      // Project only specific fields from programDetails
      {
        $project: {
          applicationCount: 1,
          admissionCount: 1,
          rejectionCount: 1,
          pendingResultCount: 1,
          id: '$programDetails._id',
          school: '$programDetails.school',
          program_name: '$programDetails.program_name',
          semester: '$programDetails.semester',
          degree: '$programDetails.degree'
        }
      }
    ]);

    return result; // Result will contain programId, count, and populated programDetails
  } catch (error) {
    logger.error('Error fetching program application counts:', error);
    throw error;
  }
});

// TODO: can flatten the result, so that frontend can render in table directly.
const getAdmissions = asyncHandler(async (req, res) => {
  const [result, students] = await Promise.all([
    getProgramApplicationCounts(req),
    req.db
      .model('Student')
      .find()
      .select(
        '-applications.doc_modification_thread -applications.uni_assist -birthday -applying_program_count -profile -isAccountActivated -updatedAt -generaldocs_threads -taigerai -notification -academic_background'
      )
      .populate(
        'agents editors',
        'firstname lastname firstname_firstname lastname_lastname'
      )
      .populate('applications.programId', 'school program_name semester degree')
  ]);
  res.status(200).send({ success: true, data: students, result });
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
