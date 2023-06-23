const aws = require('aws-sdk');
const async = require('async');
const path = require('path');
const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const { Role, Agent, Student, Editor } = require('../models/User');
const { Interview } = require('../models/Interview');
const {
  sendNewApplicationMessageInThreadToEditorEmail
  // sendSomeReminderEmail,
} = require('../services/email');
const logger = require('../services/logger');

const getAllInterviews = asyncHandler(async (req, res) => {
  const { user } = req;

  const interviews = await Interview.find()
    .populate('student_id', 'firstname lastname email')
    .populate('program_id', 'school program_name')
    .lean();
  // .populate("applications.programId agents editors");
  // .lean();
  res.status(200).send({ success: true, data: interviews });
});

const getInterview = asyncHandler(async (req, res) => {
  const {
    user,
    params: { interview_id }
  } = req;
  const interview = await Interview.find(interview_id)
    .populate('student_id', 'firstname lastname email')
    .populate('program_id', 'school program_name')
    .lean();

  if (!interview) {
    logger.info('createInterview: this interview is already existed!');
    throw new ErrorResponse(400, 'this interview is already existed!');
  }
  res.status(200).send({ success: true, data: interview });
});

const getMyInterview = asyncHandler(async (req, res) => {
  const { user } = req;
  const interviews = await Interview.find({
    student_id: user._id.toString()
  })
    .populate('student_id', 'firstname lastname email')
    .populate('program_id', 'school program_name')
    .lean();

  const student = await Student.findById(user._id.toString())
    .populate('applications.programId', 'school program_name degree semester')
    .lean();
  if (!student) {
    logger.info('getMyInterview: this student is not existed!');
    throw new ErrorResponse(400, 'this student is not existed!');
  }

  res.status(200).send({ success: true, data: interviews, student });
});

// () TODO: inform editor
// () TODO: business logic
const createInterview = asyncHandler(async (req, res) => {
  const {
    user,
    params: { program_id, studentId },
    body: payload
  } = req;
  const student = await Student.findById(studentId)
    .populate('applications.programId')
    .populate('agents editors', 'firstname lastname email')
    .exec();
  if (!student) {
    logger.info('createInterview: Invalid student id!');
    throw new ErrorResponse(400, 'Invalid student id');
  }
  const interview = await Interview.findOneAndUpdate(
    {
      student_id: studentId,
      program_id
    },
    payload,
    { upsert: true, new: true }
  )
    .populate('student_id', 'firstname lastname email')
    .populate('program_id', 'school program_name degree semester')
    .lean();

  console.log(interview);
  // const new_interview = new Interview();
  // await Interview.create({ student_id: studentId, program_id });
  // const new_interviews = await Interview.find({ student_id: studentId })
  //   .populate('student_id', 'firstname lastname email')
  //   .populate('program_id', 'school program_name degree semester')
  //   .lean();
  // console.log(new_interview);
  res.status(200).send({ success: true, data: interview });
});

module.exports = {
  getAllInterviews,
  getMyInterview,
  getInterview,
  createInterview
};
