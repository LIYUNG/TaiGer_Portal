const path = require('path');
const async = require('async');

const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const { Role, User, Agent, Student, Editor } = require('../models/User');
const { Program } = require('../models/Program');
const { Documentthread } = require('../models/Documentthread');
const { Basedocumentationslink } = require('../models/Basedocumentationslink');
const { add_portals_registered_status } = require('../utils/utils_function');
const logger = require('../services/logger');

const { RLs_CONSTANT, isNotArchiv } = require('../constants');
const Permission = require('../models/Permission');
const Course = require('../models/Course');

const getStudentUniAssist = asyncHandler(async (req, res) => {
  const {
    user,
    params: { studentId }
  } = req;
  if (user.role === Role.Student) {
    const obj = user.notification; // create object
    obj['isRead_uni_assist_task_assigned'] = true; // set value
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
  getStudentUniAssist
};
