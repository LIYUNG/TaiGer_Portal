const _ = require('lodash');
const { spawn } = require('child_process');
const axios = require('axios');
const path = require('path');
const { is_TaiGer_Student, is_TaiGer_Guest } = require('@taiger-common/core');

const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const logger = require('../services/logger');
const {
  updateCoursesDataAgentEmail,
  AnalysedCoursesDataStudentEmail
} = require('../services/email');
const { one_month_cache } = require('../cache/node-cache');
const { AWS_S3_BUCKET_NAME, isProd } = require('../config');
const { isNotArchiv } = require('../constants');
const { getTemporaryCredentials, callApiGateway } = require('../aws');
const { getS3Object } = require('../aws/s3');
const {
  roleToAssumeForCourseAnalyzerAPIG,
  apiGatewayUrl
} = require('../aws/constants');

const getCourse = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const student = await req.db.model('Student').findById(studentId);
  if (!student) {
    logger.info('getCourse: no student found');
    throw new ErrorResponse(500, 'Invalid student');
  }
  const courses = await req.db
    .model('Course')
    .findOne({
      student_id: studentId
    })
    .populate('student_id', 'firstname lastname agents editors archiv');

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
  await req.db
    .model('Course')
    .findOneAndUpdate({ student_id: studentId }, fields, {
      new: false
    })
    .populate('student_id', 'firstname lastname');
  res.send({ success: true });
});

const createCourse = asyncHandler(async (req, res) => {
  const { user } = req;
  const { studentId } = req.params;
  const fields = req.body;
  fields.updatedAt = new Date();

  const courses2 = await req.db
    .model('Course')
    .findOneAndUpdate({ student_id: studentId }, fields, {
      upsert: true,
      new: true
    })
    .populate('student_id', 'firstname lastname');
  res.send({ success: true, data: courses2 });
  if (is_TaiGer_Student(user)) {
    // TODO: send course update to Agent
    const student = await req.db
      .model('Student')
      .findById(studentId)
      .populate('agents', 'firstname lastname email')
      .exec();
    for (let i = 0; i < student.agents.length; i += 1) {
      if (isNotArchiv(student)) {
        updateCoursesDataAgentEmail(
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
  const courses = await req.db
    .model('Course')
    .findOne({ student_id: studentId })
    .populate('student_id');
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
    logger.info(`${data}`);
  });
  python.on('error', (err) => {
    logger.error('error');
    logger.error(err);
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
  const student = await req.db
    .model('Student')
    .findById(studentId)
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
  const courses = await req.db
    .model('Course')
    .findOne({ student_id: studentId })
    .populate('student_id');
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
  const student = await req.db
    .model('Student')
    .findById(studentId)
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

const processTranscript_api_gatway = asyncHandler(async (req, res, next) => {
  const {
    params: { category, studentId, language },
    body: { requirementIds }
  } = req;

  try {
    const { Credentials } = await getTemporaryCredentials(
      roleToAssumeForCourseAnalyzerAPIG
    );

    const courses = await req.db
      .model('Course')
      .findOne({ student_id: studentId })
      .populate('student_id');
    if (!courses) {
      logger.error('no course for this student!');
      return res.send({ success: true, data: {} });
    }
    const stringified_courses = JSON.stringify(courses.table_data_string);
    const stringified_courses_taiger_guided = JSON.stringify(
      courses.table_data_string_taiger_guided
    );

    let student_name = `${courses.student_id.firstname}_${courses.student_id.lastname}`;
    student_name = student_name.replace(/ /g, '-');
    const response = await callApiGateway(Credentials, apiGatewayUrl, 'POST', {
      courses: stringified_courses,
      student_id: studentId,
      student_name,
      language,
      courses_taiger_guided: stringified_courses_taiger_guided,
      requirement_ids: JSON.stringify(requirementIds)
    });

    courses.analysis.isAnalysed = true;
    courses.analysis.path = path.join(
      studentId,
      `analysed_transcript_${student_name}.xlsx`
    );
    courses.analysis.updatedAt = new Date();
    courses.save();

    const fileKey = `analysed_transcript_${studentId}.json`;

    const success = one_month_cache.del(fileKey);
    if (success === 1) {
      logger.info('cache key deleted successfully');
    }

    res.status(200).send({ success: true, data: courses.analysis });
  } catch (err) {
    logger.info(err);
    throw new ErrorResponse(500, 'Error occurs while analyzing courses');
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
    is_TaiGer_Student(user) || is_TaiGer_Guest(user) ? user._id : studentId;
  const course = await req.db.model('Course').findOne({
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

  const fileKey = course.analysis.path.replace(/\\/g, '/');

  logger.info(`Trying to download transcript excel file ${fileKey}`);

  const url_split = req.originalUrl.split('/');
  // const cache_key = `${url_split[1]}/${url_split[2]}/${url_split[3]}/${url_split[4]}`;
  // const value = one_month_cache.get(cache_key);
  // if (value === undefined) {
  const response = await getS3Object(AWS_S3_BUCKET_NAME, fileKey);
  // Convert Body from a Buffer to a String
  const fileKey_converted = encodeURIComponent(fileKey); // Use the encoding necessary

  // const success = one_month_cache.set(cache_key, Buffer.from(response));
  // if (success) {
  //   logger.info('cache set successfully');
  // }

  res.attachment(fileKey_converted);
  res.end(response);
  next();
  // } else {
  //   logger.info('cache hit');
  //   const fileKey_converted = encodeURIComponent(fileKey); // Use the encoding necessary
  //   res.attachment(fileKey_converted);
  //   res.end(value);
  //   next();
  // }
});

const deleteCourse = asyncHandler(async (req, res) => {
  const course = await req.db.model('Course').findById(req.params.id);
  if (!course) {
    return res.status(404).send({ error: 'Course not found' });
  }
  await req.db.model('Course').findByIdAndDelete(req.params.id);
  return res.send({ success: true });
});

module.exports = {
  getCourse,
  putCourse,
  createCourse,
  processTranscript_test,
  processTranscript_api,
  processTranscript_api_gatway,
  downloadXLSX,
  deleteCourse
};
