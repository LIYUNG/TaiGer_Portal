const _ = require('lodash');
const { spawn } = require('child_process');
const path = require('path');

const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const logger = require('../services/logger');
const { AWS_S3_BUCKET_NAME, isProd } = require('../config');
const { s3 } = require('../aws/index');

const student_name = 'PreCustomer';

const WidgetProcessTranscript = asyncHandler(async (req, res, next) => {
  const {
    params: { category, language },
    body: { courses, table_data_string_taiger_guided }
  } = req;
  const stringified_courses = JSON.stringify(JSON.stringify(courses));
  const stringified_courses_taiger_guided = JSON.stringify(
    JSON.stringify(table_data_string_taiger_guided)
  );
  let exitCode_Python = -1;
  const studentId = req.user._id.toString();
  const python_command = isProd() ? 'python3' : 'python';
  const python = spawn(
    python_command,
    [
      path.join(
        __dirname,
        '..',
        'python',
        'TaiGerTranscriptAnalyzerJS',
        'main.py'
      ),
      stringified_courses,
      category,
      studentId, // TODO: put in local or in Admin?
      student_name,
      language,
      stringified_courses_taiger_guided
    ],
    { stdio: 'inherit' }
  );
  python.on('data', (data) => {
    logger.info(`stdout: ${data}`);
  });
  python.on('error', (err) => {
    logger.error('error');
    logger.error(err);
    exitCode_Python = err;
  });

  python.on('close', (code) => {
    if (code === 0) {
      const metadata = {
        analysis: { isAnalysed: false, path: '', updatedAt: new Date() }
      };
      metadata.analysis.isAnalysed = true;
      metadata.analysis.path = path.join(
        studentId,
        `analysed_transcript_${student_name}.xlsx`
      );

      exitCode_Python = 0;
      res.status(200).send({ success: true, data: metadata.analysis });
    } else {
      res.status(403).send({ message: code });
    }
  });
});

// Download original transcript excel
const WidgetdownloadXLSX = asyncHandler(async (req, res, next) => {
  const {
    params: { adminId }
  } = req;

  const fileKey = path
    .join(adminId, `analysed_transcript_${student_name}.xlsx`)
    .replace(/\\/g, '/')
    .split('/')[1];
  const directory = path
    .join(
      AWS_S3_BUCKET_NAME,
      path
        .join(adminId, `analysed_transcript_${student_name}.xlsx`)
        .replace(/\\/g, '/')
        .split('/')[0]
    )
    .replace(/\\/g, '/');
  logger.info(`Trying to download transcript excel file ${fileKey}`);

  const options = {
    Key: fileKey,
    Bucket: directory
  };
  s3.getObject(options, (err, data) => {
    // Handle any error and exit
    if (!data || !data.Body) {
      logger.error('File not found in S3');
      // You can handle this case as needed, e.g., send a 404 response
      return res.status(404).send(err);
    }
    // Convert Body from a Buffer to a String
    const fileKey_converted = encodeURIComponent(fileKey); // Use the encoding necessary
    res.attachment(fileKey_converted);
    // return res.send({ data: data.Body, lastModifiedDate: data.LastModified });
    return res.end(data.Body);
  });
});

module.exports = {
  WidgetProcessTranscript,
  WidgetdownloadXLSX
};
