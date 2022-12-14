// const path = require('path');
const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const { Role, User, Student } = require('../models/User');
const { Task } = require('../models/Task');
const async = require('async');

const getAdmissions = asyncHandler(async (req, res) => {
  const { user } = req;

  const students = await Student.find()
    .select(
      '-applications.doc_modification_thread -applications.uni_assist -email -birthday -applying_program_count -agents -editors -profile -isAccountActivated -updatedAt -generaldocs_threads -taigerai -notification -checklist -academic_background'
    )
    .populate('applications.programId', 'school program_name semester');
  res.status(200).send({ success: true, data: students });
});

const getAdmissionsYear = asyncHandler(async (req, res) => {
  const { applications_year } = req.params;
  const tasks = await Task.find({ student_id: applications_year })
    .populate('student_id', 'firstname lastname')
    .lean()
    .exec();
  res.status(200).send({ success: true, data: tasks });
});

module.exports = {
  getAdmissions,
  getAdmissionsYear
};
