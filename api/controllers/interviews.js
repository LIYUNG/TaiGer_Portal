const async = require('async');
const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const { Student } = require('../models/User');
const { Interview } = require('../models/Interview');
const logger = require('../services/logger');

const getAllInterviews = asyncHandler(async (req, res) => {
  const { user } = req;

  const interviews = await Interview.find()
    .populate('student_id', 'firstname lastname email')
    .populate('program_id', 'school program_name degree')
    .lean();

  res.status(200).send({ success: true, data: interviews });
});

const getInterview = asyncHandler(async (req, res) => {
  const {
    user,
    params: { interview_id }
  } = req;
  const interview = await Interview.findById(interview_id)
    .populate('student_id', 'firstname lastname email')
    .populate('program_id', 'school program_name degree')
    .lean();

  if (!interview) {
    logger.info('createInterview: this interview is already existed!');
    throw new ErrorResponse(400, 'this interview is already existed!');
  }
  res.status(200).send({ success: true, data: interview });
});

const deleteInterview = asyncHandler(async (req, res) => {
  const {
    user,
    params: { interview_id }
  } = req;
  await Interview.findByIdAndDelete(interview_id);

  res.status(200).send({ success: true });
});

const assignInterviewTrainer = asyncHandler(async (req, res) => {
  const {
    params: { interview_id, trainer_id }
  } = req;

  const interview = await Interview.findByIdAndUpdate(
    interview_id,
    { trainer_id },
    {
      new: true
    }
  )
    .populate('student_id trainer_id', 'firstname lastname email')
    .populate('program_id', 'school program_name degree semester')
    .lean();

  res.status(200).send({ success: true, data: interview });
});

const updateInterview = asyncHandler(async (req, res) => {
  const {
    params: { interview_id },
    body: payload
  } = req;

  const interview = await Interview.findByIdAndUpdate(interview_id, payload, {
    upsert: true,
    new: true
  })
    .populate('student_id', 'firstname lastname email')
    .populate('program_id', 'school program_name degree semester')
    .lean();

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

  res.status(200).send({ success: true, data: interview });
});

module.exports = {
  getAllInterviews,
  getMyInterview,
  getInterview,
  assignInterviewTrainer,
  updateInterview,
  deleteInterview,
  createInterview
};
