const _ = require('lodash');
const { spawn } = require('child_process');
const aws = require('aws-sdk');

const { ErrorResponse } = require('../common/errors');
const path = require('path');

const { asyncHandler } = require('../middlewares/error-handler');
const Course = require('../models/Course');
const { Role, Student, User } = require('../models/User');
const logger = require('../services/logger');
const { updateCoursesDataAgentEmail } = require('../services/email');
const { one_month_cache, two_month_cache } = require('../cache/node-cache');
const {
  AWS_S3_ACCESS_KEY_ID,
  AWS_S3_ACCESS_KEY,
  AWS_S3_BUCKET_NAME,
  AWS_S3_PUBLIC_BUCKET_NAME
} = require('../config');
const s3 = new aws.S3({
  accessKeyId: AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: AWS_S3_ACCESS_KEY
});

const getCourse = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const student = await Student.findById(studentId);
  if (!student) {
    logger.info('getCourse: no student found');
    throw new ErrorResponse(500, 'Invalid student');
  }
  const courses = await Course.findOne({
    student_id: studentId
  }).populate('student_id', 'firstname lastname agents editors');

  if (!courses) {
    return res.send({
      success: true,
      data: {
        student_id: {
          _id: student._id,
          firstname: student.firstname,
          lastname: student.lastname,
          agents: student.agents,
          editors: student.editors
        },
        table_data_string:
          '[{"course_chinese":"(Example)物理一","course_english":null,"credits":"2","grades":"73"},{"course_chinese":"(Example)微積分一","course_english":null,"credits":"2","grades":"44"}]'
      }
    });
  }
  return res.send({ success: true, data: courses });
});

const createCourse = asyncHandler(async (req, res) => {
  const { user } = req;
  const { studentId } = req.params;
  const fields = req.body;
  fields.updatedAt = new Date();

  const courses2 = await Course.findOneAndUpdate(
    { student_id: studentId },
    fields,
    { upsert: true, new: true }
  ).populate('student_id', 'firstname lastname');
  res.send({ success: true, data: courses2 });
  if (user.role === 'Student') {
    // TODO: send course update to Agent
    const student = await Student.findById(studentId)
      .populate('agents', 'firstname lastname email')
      .exec();
    for (let i = 0; i < student.agents.length; i += 1) {
      await updateCoursesDataAgentEmail(
        {
          firstname: student.agents[i].firstname,
          lastname: student.agents[i].lastname,
          address: student.agents[i].email
        },
        {
          student_id: studentId,
          student_firstname: courses2.student_id.firstname,
          student_lastname: courses2.student_id.lastname
        }
      );
    }
  }
});

const processTranscript_test = asyncHandler(async (req, res, next) => {
  const {
    params: { category, studentId, language }
  } = req;
  const courses = await Course.findOne({ student_id: studentId }).populate(
    'student_id'
  );
  if (!courses) {
    logger.error('no course for this student!');
    return res.send({ success: true, data: {} });
  }
  const stringified_courses = JSON.stringify(courses.table_data_string);
  console.log(stringified_courses);
  let exitCode_Python = -1;
  // TODO: multitenancy studentId?
  let student_name = `${courses.student_id.firstname}_${courses.student_id.lastname}`;
  student_name = student_name.replace(/ /g, '-');
  const python = spawn(
    'python',
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
      studentId,
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
      courses.analysis.isAnalysed = true;
      courses.analysis.path = path.join(
        studentId,
        `analysed_transcript_${student_name}.xlsx`
      );
      courses.analysis.updatedAt = new Date();
      courses.save();

      const url_split = req.originalUrl.split('/');
      const cache_key = `${url_split[1]}/${url_split[2]}/${url_split[3]}/${url_split[4]}`;
      const success = one_month_cache.del(cache_key);
      if (success === 1) {
        console.log('cache key deleted successfully');
      }
      exitCode_Python = 0;
      res.status(200).send({ success: true, data: courses.analysis });
    } else {
      res.status(404).send({ message: code });
    }
  });
});

// Download original transcript excel
const downloadXLSX = asyncHandler(async (req, res, next) => {
  const {
    user,
    params: { studentId }
  } = req;

  const studentIdToUse =
    user.role === Role.Student || user.role === 'Guest' ? user._id : studentId;
  const course = await Course.findOne({
    student_id: studentIdToUse.toString()
  });
  if (!course) {
    logger.error('downloadXLSX: Invalid student id');
    throw new ErrorResponse(404, 'Invalid student id');
  }

  if (!course.analysis.isAnalysed || !course.analysis.path) {
    logger.error('downloadXLSX: not analysed yet');
    throw new ErrorResponse(404, 'Transcript not analysed yet');
  }

  const fileKey = course.analysis.path.replace(/\\/g, '/').split('/')[1];
  const directory = path
    .join(
      AWS_S3_BUCKET_NAME,
      course.analysis.path.replace(/\\/g, '/').split('/')[0]
    )
    .replace(/\\/g, '/');
  logger.info(`Trying to download transcript excel file ${fileKey}`);

  const url_split = req.originalUrl.split('/');
  const cache_key = `${url_split[1]}/${url_split[2]}/${url_split[3]}/${url_split[4]}`;
  const value = one_month_cache.get(cache_key);
  if (value === undefined) {
    const options = {
      Key: fileKey,
      Bucket: directory
    };
    s3.getObject(options, (err, data) => {
      // Handle any error and exit
      if (err) return err;
      // Convert Body from a Buffer to a String
      const fileKey_converted = encodeURIComponent(fileKey); // Use the encoding necessary

      const success = one_month_cache.set(cache_key, data.Body);
      if (success) {
        console.log('cache set successfully');
      }

      res.attachment(fileKey_converted);
      // return res.send({ data: data.Body, lastModifiedDate: data.LastModified });
      return res.end(data.Body);
    });
  } else {
    console.log('cache hit');
    const fileKey_converted = encodeURIComponent(fileKey); // Use the encoding necessary
    res.attachment(fileKey_converted);
    return res.end(value);
  }
});

const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return res.status(404).send({ error: 'Course not found' });
  }
  await Course.findByIdAndDelete(req.params.id);
  return res.send({ success: true });
});

module.exports = {
  getCourse,
  createCourse,
  processTranscript_test,
  downloadXLSX,
  deleteCourse
};
