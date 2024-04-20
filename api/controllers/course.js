const _ = require('lodash');
const { spawn } = require('child_process');

const axios = require('axios');
const path = require('path');

const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const Course = require('../models/Course');
const { Role, Student } = require('../models/User');
const logger = require('../services/logger');
const {
  updateCoursesDataAgentEmail,
  AnalysedCoursesDataStudentEmail
} = require('../services/email');
const { one_month_cache } = require('../cache/node-cache');
const { AWS_S3_BUCKET_NAME, isProd } = require('../config');
const { isNotArchiv } = require('../constants');
const { s3 } = require('../aws/index');

const getCourse = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const student = await Student.findById(studentId);
  if (!student) {
    logger.info('getCourse: no student found');
    throw new ErrorResponse(500, 'Invalid student');
  }
  const courses = await Course.findOne({
    student_id: studentId
  }).populate('student_id', 'firstname lastname agents editors archiv');

  if (!courses) {
    return res.send({
      success: true,
      data: {
        student_id: {
          _id: student._id,
          firstname: student.firstname,
          lastname: student.lastname,
          agents: student.agents,
          editors: student.editors,
          archiv: student.archiv
        },
        table_data_string_locked: false,
        table_data_string:
          '[{"course_chinese":"(Example)物理一","course_english":null,"credits":"2","grades":"73"},{"course_chinese":"(Example)微積分一","course_english":null,"credits":"2","grades":"77"},{"course_chinese":"(Example)微積分二","course_english":null,"credits":"3","grades":"88"}]',
        table_data_string_taiger_guided:
          '[{"course_chinese":"","course_english":"","credits":"0","grades":""}]'
      }
    });
  }
  return res.send({ success: true, data: courses });
});

const putCourse = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const fields = req.body;
  fields.updatedAt = new Date();
  await Course.findOneAndUpdate({ student_id: studentId }, fields, {
    new: false
  }).populate('student_id', 'firstname lastname');
  res.send({ success: true });
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
      if (isNotArchiv(student)) {
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
  const stringified_courses_taiger_guided = JSON.stringify(
    courses.table_data_string_taiger_guided
  );

  let exitCode_Python = -1;
  // TODO: multitenancy studentId?
  let student_name = `${courses.student_id.firstname}_${courses.student_id.lastname}`;
  student_name = student_name.replace(/ /g, '-');
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
      studentId,
      student_name,
      language,
      stringified_courses_taiger_guided
    ],
    { stdio: 'inherit' }
  );
  python.on('data', (data) => {
    logger.log(`${data}`);
  });
  python.on('error', (err) => {
    logger.log('error');
    logger.log(err);
    exitCode_Python = err;
  });

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
        logger.info('cache key deleted successfully');
      }
      exitCode_Python = 0;
      res.status(200).send({ success: true, data: courses.analysis });
      // TODO: send analysed link email to student
    } else {
      res.status(403).send({ message: code });
    }
  });

  // TODO: information student
  const student = await Student.findById(studentId)
    .populate('agents', 'firstname lastname email')
    .exec();

  if (isNotArchiv(student)) {
    await AnalysedCoursesDataStudentEmail(
      {
        firstname: student.firstname,
        lastname: student.lastname,
        address: student.email
      },
      {
        student_id: studentId
      }
    );
  }
  next();
});

const processTranscript_api = asyncHandler(async (req, res, next) => {
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
  const stringified_courses_taiger_guided = JSON.stringify(
    courses.table_data_string_taiger_guided
  );

  // TODO: multitenancy studentId?
  let student_name = `${courses.student_id.firstname}_${courses.student_id.lastname}`;
  student_name = student_name.replace(/ /g, '-');
  try {
    const result = await axios.post(
      'http://127.0.0.1:8000/analyze-transcript',
      {
        courses: stringified_courses,
        category: category,
        student_id: studentId,
        student_name: student_name,
        language: language,
        courses_taiger_guided: stringified_courses_taiger_guided
      }
    );
    courses.analysis.isAnalysed = true;
    courses.analysis.path = path.join(
      studentId,
      `analysed_transcript_${student_name}.xlsx`
    );
    courses.analysis.updatedAt = new Date();
    courses.save();

    const url_split = req.originalUrl.split('/');

    // temporary workaround before full migration
    // const cache_key = `${url_split[1]}/${url_split[2]}/${url_split[3]}/${url_split[4]}`;
    const cache_key = `${url_split[1]}/${url_split[2]}/transcript/${url_split[4]}`;

    const success = one_month_cache.del(cache_key);
    if (success === 1) {
      logger.info('cache key deleted successfully');
    }
    res.status(200).send({ success: true, data: courses.analysis });
    // TODO: send analysed link email to student
  } catch (err) {
    logger.info(err);
    res.status(403).send({ message: 'analyze failed' });
  }

  // TODO: information student
  const student = await Student.findById(studentId)
    .populate('agents', 'firstname lastname email')
    .exec();

  if (isNotArchiv(student)) {
    await AnalysedCoursesDataStudentEmail(
      {
        firstname: student.firstname,
        lastname: student.lastname,
        address: student.email
      },
      {
        student_id: studentId
      }
    );
  }
  next();
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
    throw new ErrorResponse(404, 'Course not found');
  }

  if (!course.analysis.isAnalysed || !course.analysis.path) {
    logger.error('downloadXLSX: not analysed yet');
    throw new ErrorResponse(403, 'Transcript not analysed yet');
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
      if (!data || !data.Body) {
        logger.info('File not found in S3');
        // You can handle this case as needed, e.g., send a 404 response
        return res.status(404).send(err);
      }
      // Convert Body from a Buffer to a String
      const fileKey_converted = encodeURIComponent(fileKey); // Use the encoding necessary

      const success = one_month_cache.set(cache_key, data.Body);
      if (success) {
        logger.info('cache set successfully');
      }

      res.attachment(fileKey_converted);
      // return res.send({ data: data.Body, lastModifiedDate: data.LastModified });
      res.end(data.Body);
      next();
    });
  } else {
    logger.info('cache hit');
    const fileKey_converted = encodeURIComponent(fileKey); // Use the encoding necessary
    res.attachment(fileKey_converted);
    res.end(value);
    next();
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
  putCourse,
  createCourse,
  processTranscript_test,
  processTranscript_api,
  downloadXLSX,
  deleteCourse
};
