const _ = require('lodash');
const { ErrorResponse } = require('../common/errors');
const path = require('path');

const { asyncHandler } = require('../middlewares/error-handler');
const Course = require('../models/Course');
const logger = require('../services/logger');
const {
  AWS_S3_ACCESS_KEY_ID,
  UPLOAD_PATH,
  AWS_S3_ACCESS_KEY,
  AWS_S3_BUCKET_NAME
} = require('../config');

const getCourse = asyncHandler(async (req, res) => {
  const courses = await Course.findOne({ student_id: req.params.student_id });
  if (!courses) {
    return res.send({ success: true, data: { table_data_string: '[{}]' } });
  }
  return res.send({ success: true, data: courses });
});

const createCourse = asyncHandler(async (req, res) => {
  const fields = req.body;
  const courses = await Course.findOne({ student_id: req.params.student_id });
  fields.updatedAt = new Date();
  if (!courses) {
    const newDoc = await Course.create(fields);
    return res.send({ success: true, data: newDoc });
  }
  const courses2 = await Course.findOneAndUpdate(
    req.params.student_id,
    fields,
    { new: true }
  );
  return res.send({ success: true, data: courses2 });
});

const deleteCourse = asyncHandler(async (req, res) => {
  await Course.findByIdAndDelete(req.params.id);
  return res.send({ success: true });
});

module.exports = {
  getCourse,
  createCourse,
  deleteCourse
};
