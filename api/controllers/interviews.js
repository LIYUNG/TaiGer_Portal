const async = require('async');
const path = require('path');
const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const { Student } = require('../models/User');
const { Interview } = require('../models/Interview');
const Event = require('../models/Event');
const logger = require('../services/logger');
const { Documentthread } = require('../models/Documentthread');
const { emptyS3Directory } = require('../utils/utils_function');
const { AWS_S3_BUCKET_NAME } = require('../config');

const getAllInterviews = asyncHandler(async (req, res) => {
  const interviews = await Interview.find()
    .populate('student_id trainer_id', 'firstname lastname email')
    .populate('program_id', 'school program_name degree semester')
    .populate('event_id')
    .lean();

  res.status(200).send({ success: true, data: interviews });
});

const getMyInterview = asyncHandler(async (req, res) => {
  const { user } = req;
  const interviews = await Interview.find({
    student_id: user._id.toString()
  })
    .populate('student_id trainer_id', 'firstname lastname email')
    .populate('program_id', 'school program_name degree semester')
    .populate('thread_id event_id')
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

const getInterview = asyncHandler(async (req, res) => {
  const {
    params: { interview_id }
  } = req;
  const interview = await Interview.findById(interview_id)
    .populate('student_id trainer_id', 'firstname lastname email')
    .populate('program_id', 'school program_name degree')
    .populate({
      path: 'thread_id',
      select:
        'file_type isFinalVersion outsourced_user_id flag_by_user_id updatedAt messages.file messages.message messages.createdAt messages._id',
      populate: {
        path: 'messages.user_id',
        select: 'firstname lastname'
      }
    })
    .populate('event_id')
    .lean();

  if (!interview) {
    logger.info('getInterview: this interview is not found!');
    throw new ErrorResponse(404, 'this interview is not found!');
  }
  res.status(200).send({ success: true, data: interview });
});

const deleteInterview = asyncHandler(async (req, res) => {
  const {
    params: { interview_id }
  } = req;
  const interview = await Interview.findById(interview_id);
  // Delete files in S3
  if (
    interview.thread_id?.toString() &&
    interview.thread_id?.toString() !== ''
  ) {
    let directory = path.join(
      interview.student_id?.toString(),
      interview.thread_id?.toString() || ''
    );
    logger.info('Trying to delete interview thread and folder');
    directory = directory.replace(/\\/g, '/');
    emptyS3Directory(AWS_S3_BUCKET_NAME, directory);
    // Delete event
    if (interview.event_id) {
      await Event.findByIdAndDelete(interview.event_id);
    }
    // Delete interview thread in mongoDB
    await Documentthread.findByIdAndDelete(interview.thread_id);
  }

  // Delete interview  in mongoDB
  await Interview.findByIdAndDelete(interview_id);

  res.status(200).send({ success: true });
});

const addInterviewTrainingDateTime = asyncHandler(async (req, res, next) => {
  const { user } = req;
  const {
    params: { interview_id }
  } = req;
  const oldEvent = req.body;
  try {
    oldEvent.isConfirmedReceiver = true;
    oldEvent.isConfirmedRequester = true;
    oldEvent.meetingLink = 'dummy_meeting_link';
    if (oldEvent._id) {
      await Event.findByIdAndUpdate(oldEvent._id, { ...oldEvent }, {});
      await Interview.findByIdAndUpdate(
        interview_id,
        { event_id: oldEvent._id, status: 'Scheduled' },
        {}
      );
    } else {
      const write_NewEvent = await Event.create(oldEvent);
      await write_NewEvent.save();
      await Interview.findByIdAndUpdate(
        interview_id,
        { event_id: write_NewEvent._id?.toString(), status: 'Scheduled' },
        {}
      );
    }

    res.status(200).send({
      success: true
    });
    // const updatedEvent = await Event.findById(write_NewEvent._id)
    //   .populate('requester_id receiver_id', 'firstname lastname email')
    //   .lean();
    // updatedEvent.requester_id.forEach((requester) => {
    //   meetingConfirmationReminder(requester, user, updatedEvent.start);
    // });
    next();
  } catch (err) {
    logger.error(`postEvent: ${err.message}`);
    throw new ErrorResponse(500, err.message);
  }
});

const updateInterview = asyncHandler(async (req, res) => {
  const {
    params: { interview_id }
  } = req;
  const payload = req.body;
  const interview = await Interview.findByIdAndUpdate(interview_id, payload, {
    new: true
  })
    .populate('student_id trainer_id', 'firstname lastname email')
    .populate('program_id', 'school program_name degree semester')
    .populate('thread_id event_id')
    .lean();

  res.status(200).send({ success: true, data: interview });
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

  const interview_existed = await Interview.findOne({
    student_id: studentId,
    program_id
  })
    .populate('student_id trainer_id', 'firstname lastname email')
    .populate('program_id', 'school program_name degree semester')
    .lean();
  if (interview_existed) {
    try {
      await Interview.findOneAndUpdate(
        {
          student_id: studentId,
          program_id
        },
        payload,
        { upsert: true }
      )
        .populate('student_id trainer_id', 'firstname lastname email')
        .populate('program_id', 'school program_name degree semester')
        .lean();
    } catch (err) {
      logger.error(err);
      throw new ErrorResponse(404, err);
    }
    res.status(200).send({ success: true });
  } else {
    try {
      const createdDocument = await Documentthread.create({
        student_id: studentId,
        program_id,
        file_type: 'Interview'
      });

      payload.thread_id = createdDocument._id?.toString();

      await Interview.findOneAndUpdate(
        {
          student_id: studentId,
          program_id
        },
        payload,
        { upsert: true }
      )
        .populate('student_id trainer_id', 'firstname lastname email')
        .populate('program_id', 'school program_name degree semester')
        .lean();
    } catch (err) {
      logger.error(err);
      throw new ErrorResponse(404, err);
    }
    res.status(200).send({ success: true });
  }

  res.status(200).send({ success: true });
});

module.exports = {
  getAllInterviews,
  getMyInterview,
  getInterview,
  addInterviewTrainingDateTime,
  updateInterview,
  deleteInterview,
  createInterview
};
