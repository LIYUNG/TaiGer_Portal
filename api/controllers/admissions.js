// const path = require('path');
const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const { Role, User, Student } = require('../models/User');
const async = require('async');

const getAdmissions = asyncHandler(async (req, res) => {
  const { user } = req;

  const students = await Student.find()
    .select(
      '-applications.doc_modification_thread -applications.uni_assist -email -birthday -applying_program_count -agents -editors -profile -isAccountActivated -updatedAt -generaldocs_threads -taigerai -notification -academic_background'
    )
    .populate('agents editors', 'firstname lastname')
    .populate('applications.programId', 'school program_name semester degree');
  res.status(200).send({ success: true, data: students });
});

const getAdmissionsYear = asyncHandler(async (req, res) => {
  const { applications_year } = req.params;
  const tasks = await Student.find({ student_id: applications_year });
  res.status(200).send({ success: true, data: tasks });
});

module.exports = {
  getAdmissions,
  getAdmissionsYear
};
