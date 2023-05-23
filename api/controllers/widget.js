const _ = require('lodash');
const { spawn } = require('child_process');
const aws = require('aws-sdk');

const { ErrorResponse } = require('../common/errors');
const path = require('path');

const { asyncHandler } = require('../middlewares/error-handler');
const logger = require('../services/logger');
const {
  AWS_S3_ACCESS_KEY_ID,
  AWS_S3_ACCESS_KEY,
  AWS_S3_BUCKET_NAME,
  AWS_S3_PUBLIC_BUCKET_NAME,
  isProd
} = require('../config');
const s3 = new aws.S3({
  accessKeyId: AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: AWS_S3_ACCESS_KEY
});
const student_name = 'PreCustomer';

const WidgetProcessTranscript = asyncHandler(async (req, res, next) => {
  const {
    params: { category, language },
    body: { courses }
  } = req;
  const stringified_courses = JSON.stringify(JSON.stringify(courses));
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
      language
    ],
    { stdio: 'inherit' }
  );
  python.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });
  python.on('error', (err) => {
    console.log('error');
    console.log(err);
    exitCode_Python = err;
    // res.sendStatus(500);
    // res.status(500).send({ success: false });
  });
  // python.on('data', (data) => {
  //   console.error(`stderr: ${data}`);
  // });
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
    user,
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
    if (err) return err;
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
