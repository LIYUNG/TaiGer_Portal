const path = require('path');
const async = require('async');

const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const { Role, User, Student } = require('../models/User');

const logger = require('../services/logger');

const getApplicationStudent = asyncHandler(async (req, res) => {
  const {
    user,
    params: { studentId }
  } = req;
  if (user.role === Role.Student) {
    const obj = user.notification; // create object
    obj['isRead_new_programs_assigned'] = true; // set value
    await Student.findByIdAndUpdate(
      user._id.toString(),
      { notification: obj },
      {}
    );
  }
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

module.exports = {
  getApplicationStudent
};
