const _ = require('lodash');
const { ErrorResponse } = require('../common/errors');
const path = require('path');

const { asyncHandler } = require('../middlewares/error-handler');
const Course = require('../models/Course');
const { Role, Student, User } = require('../models/User');
const logger = require('../services/logger');
const { updateCoursesDataAgentEmail } = require('../services/email');

const getCourse = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const courses = await Course.findOne({
    student_id: studentId
  });
  if (!courses) {
    const student = await Student.findById(studentId);
    if (!student) {
      logger.info('getCourse: no student found');
      throw new ErrorResponse(500, 'Invalid student');
    }
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
        table_data_string: '[{}]'
      }
    });
  }
  const courses2 = await Course.findOne({
    student_id: studentId
  }).populate('student_id', 'firstname lastname agents editors');
  return res.send({ success: true, data: courses2 });
});

const createCourse = asyncHandler(async (req, res) => {
  const { user } = req;
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
  res.send({ success: true, data: courses2 });
  if (user.role === 'Student') {
    // TODO: send course update to Agent
    const student = await Student.findById(studentId)
      .populate('agents', 'firstname lastname email')
      .exec();
    for (let i = 0; i < student.agents.length; i += 1) {
      console.log(student.agents[i].firstname);
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

const deleteCourse = asyncHandler(async (req, res) => {
  await Course.findByIdAndDelete(req.params.id);
  return res.send({ success: true });
});

module.exports = {
  getCourse,
  createCourse,
  deleteCourse
};
