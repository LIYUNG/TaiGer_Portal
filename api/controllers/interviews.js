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
  const interview = await Interview.find(interview_id).lean();
  // .populate("applications.programId agents editors");
  // .lean();
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
  // .populate("applications.programId agents editors");
  // .lean();
  if (!interviews) {
    logger.info('createInterview: this interview is already existed!');
    throw new ErrorResponse(400, 'this interview is already existed!');
  }
  res.status(200).send({ success: true, data: interviews });
});

// () TODO: inform editor
// () TODO: business logic
const createInterview = asyncHandler(async (req, res) => {
  const {
    user,
    params: { program_id, student_id }
  } = req;
  const student = await Student.findById(student_id)
    .populate('applications.programId')
    .populate('agents editors', 'firstname lastname email')
    .exec();
  if (!student) {
    logger.info('createInterview: Invalid student id!');
    throw new ErrorResponse(400, 'Invalid student id');
  }
  const interview = await Interview.findOne({
    student_id,
    program_id
  });

  if (interview) {
    logger.info('createInterview: this interview is already existed!');
    throw new ErrorResponse(400, 'this interview is already existed!');
  }
  // const new_interview = new Interview();
  await Interview.create({ student_id, program_id });
  const new_interviews = await Interview.find({})
    .populate('student_id', 'firstname lastname email')
    .populate('program_id', 'school program_name')
    .lean();
  // console.log(new_interview);
  res.status(200).send({ success: true, data: new_interviews });
});

module.exports = {
  getAllInterviews,
  getMyInterview,
  getInterview,
  createInterview
};
