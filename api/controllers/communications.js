const aws = require('aws-sdk');
const async = require('async');
const path = require('path');
const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const { Role, Agent, Student, Editor, User } = require('../models/User');
const { one_month_cache } = require('../cache/node-cache');
const { Communication } = require('../models/Communication');
const { sendAssignEditorReminderEmail } = require('../services/email');
const logger = require('../services/logger');
const { isNotArchiv } = require('../constants');
const { ObjectId } = require('mongodb');

const getMyMessages = asyncHandler(async (req, res) => {
  const {
    params: { taiger_user_id }
  } = req;
  const the_user = await User.findById(taiger_user_id).select(
    'firstname lastname role'
  );
  if (
    the_user.role !== 'Admin' &&
    the_user.role !== 'Agent' &&
    the_user.role !== 'Editor'
  ) {
    logger.error('getMyMessages: not TaiGer user!');
    throw new ErrorResponse(401, 'Invalid TaiGer user');
  }
  const studentsWithExpenses = await Student.aggregate([
    {
      $lookup: {
        from: 'communications',
        localField: '_id',
        foreignField: 'student_id',
        as: 'communications'
      }
    }
  ]);

  const students = await Student.find({
    agents: the_user._id.toString(),
    $or: [{ archiv: { $exists: false } }, { archiv: false }]
  })
    .populate('agents editors', 'firstname lastname email')
    .populate('applications.programId')
    .populate(
      'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
      '-messages'
    )
    .select('-notification')
    .lean();
  // Merge the results
  const mergedResults = students.map((student) => {
    const aggregateData = studentsWithExpenses.find(
      (item) => item._id.toString() === student._id.toString()
    );
    return { ...aggregateData, ...student };
  });

  return res
    .status(200)
    .send({ success: true, data: { students: mergedResults, the_user } });
});

const getMessages = asyncHandler(async (req, res) => {
  const {
    user,
    params: { studentId }
  } = req;

  const student = await Student.findById(studentId).select(
    'firstname lastname'
  );
  if (!student) {
    logger.error('getMessages: Invalid student id!');
    throw new ErrorResponse(403, 'Invalid student id');
  }
  const pageSize = 5;
  const pageNumber = 1;
  const skipAmount = (pageNumber - 1) * pageSize;
  let communication_thread;
  communication_thread = await Communication.find({
    student_id: studentId
  })
    .populate('student_id user_id', 'firstname lastname role agents editors')
    .sort({ timestamp: -1 })
    .skip(skipAmount)
    .limit(pageSize);

  // Multitenant-filter: Check student can only access their own thread!!!!

  return res
    .status(200)
    .send({ success: true, data: communication_thread, student });
});

// (O) notification email works
const postMessages = asyncHandler(async (req, res) => {
  const {
    user,
    params: { studentId }
  } = req;
  const { message } = req.body;
  console.log(message);

  try {
    JSON.parse(message);
  } catch (e) {
    throw new ErrorResponse(400, 'message collapse');
  }
  // [TODO] Check student can only access their own thread!!!!

  const new_message = new Communication({
    student_id: studentId,
    user_id: user._id,
    message,
    readBy: [new ObjectId(user._id.toString())],
    createdAt: new Date()
  });

  // TODO: prevent abuse! if communication_thread.messages.length > 30, too much message in a thread!

  await new_message.save();
  const communication_thread = await Communication.find({
    student_id: studentId
  }).populate('student_id user_id', 'firstname lastname');

  res.status(200).send({ success: true, data: communication_thread });

  const student = await Student.findById(studentId).populate(
    'editors agents',
    'firstname lastname email archiv'
  );

  if (user.role === Role.Student) {
    // If no editor, inform agent to assign
    for (let i = 0; i < student.agents.length; i += 1) {
      // inform active-agent
      if (isNotArchiv(student)) {
        if (isNotArchiv(student.agents[i])) {
          sendAssignEditorReminderEmail(
            {
              firstname: student.agents[i].firstname,
              lastname: student.agents[i].lastname,
              address: student.agents[i].email
            },
            {
              student_firstname: student.firstname,
              student_id: student._id.toString(),
              student_lastname: student.lastname
            }
          );
        }
      }
    }
  }
});

// (-) TODO email : no notification needed
const updateAMessageInThread = asyncHandler(async (req, res) => {
  const {
    user,
    params: { communicationThreadId, messageId }
  } = req;

  const thread = await Communication.findById(communicationThreadId);
  if (!thread) {
    logger.error('deleteAMessageInThread : Invalid message thread id');
    throw new ErrorResponse(403, 'Invalid message thread id');
  }

  const msg = thread.messages.find(
    (message) => message._id.toString() === messageId
  );

  if (!msg) {
    logger.error('deleteAMessageInThread : Invalid message id');
    throw new ErrorResponse(403, 'Invalid message id');
  }
  // Prevent multitenant
  if (msg.user_id.toString() !== user._id.toString()) {
    logger.error(
      'deleteAMessageInThread : You can only delete your own message.'
    );
    throw new ErrorResponse(409, 'You can only delete your own message.');
  }

  // TODO: update message
  //   await Communication.findByIdAndUpdate(communicationThreadId, {
  //     $pull: {
  //       messages: { _id: messageId }
  //     }
  //   });

  res.status(200).send({ success: true });
});

// (-) TODO email : no notification needed
const deleteAMessageInThread = asyncHandler(async (req, res) => {
  const {
    user,
    params: { messageId }
  } = req;

  // Prevent multitenant
  try {
    await Communication.findByIdAndDelete(messageId);
    res.status(200).send({ success: true });
  } catch (e) {
    throw new ErrorResponse(400, 'message collapse');
  }
});

module.exports = {
  getMyMessages,
  getMessages,
  postMessages,
  updateAMessageInThread,
  deleteAMessageInThread
};