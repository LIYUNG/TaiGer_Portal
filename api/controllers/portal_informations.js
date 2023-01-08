const _ = require('lodash');
const { ErrorResponse } = require('../common/errors');
const path = require('path');

const { asyncHandler } = require('../middlewares/error-handler');
const Course = require('../models/Course');
const { Role, Student, User } = require('../models/User');
const logger = require('../services/logger');

const getPortalCredentials = asyncHandler(async (req, res) => {
  const {
    params: { studentId }
  } = req;

  const student = await Student.findById(studentId)
    .populate('agents editors', 'firstname lastname email')
    .populate('applications.programId')
    .populate(
      'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
      '-messages'
    )
    .lean();
  res.status(200).send({ success: true, data: student });
});

const createPortalCredentials = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const fields = req.body;
  const courses = await Course.findOne({ student_id: studentId });
  fields.updatedAt = new Date();
  if (!courses) {
    const newDoc = await Course.create(fields);
    const courses3 = await Course.findOne({
      student_id: studentId
    }).populate('student_id', 'firstname lastname');
    return res.send({ success: true, data: courses3 });
  }
  const courses2 = await Course.findOneAndUpdate(studentId, fields, {
    new: true
  }).populate('student_id', 'firstname lastname');
  return res.send({ success: true, data: courses2 });
});

module.exports = {
  getPortalCredentials,
  createPortalCredentials
};
