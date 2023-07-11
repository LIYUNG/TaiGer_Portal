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

  const student = await Student.findById(studentId).populate(
    'applications.programId'
  );
  if (!student) {
    logger.error('getMessages: Invalid student id!');
    throw new ErrorResponse(403, 'Invalid student id');
  }
  let communication_thread;
  communication_thread = await Communication.findOne({
    student_id: studentId
  })
    .populate('student_id', 'firstname lastname role agents editors')
    .populate('messages.user_id', 'firstname lastname role')
    .lean()
    .exec();

  if (communication_thread) {
    // Thread already exists, return it
    return res.status(200).send({ success: true, data: communication_thread });
  }
  // Initialize a new communication thread

  communication_thread = await Communication.findOneAndUpdate(
    {
      student_id: studentId
    },
    {
      $push: {
        readBy: user._id.toString()
      }
    },
    { new: true, upsert: true }
  )
    .populate('student_id', 'firstname lastname role agents editors')
    .populate('messages.user_id', 'firstname lastname role')
    .lean()
    .exec();

  // Multitenant-filter: Check student can only access their own thread!!!!
  if (user.role === Role.Student) {
    if (
      communication_thread.student_id._id.toString() !== user._id.toString()
    ) {
      logger.error('getMessages: Unauthorized request!');
      throw new ErrorResponse(403, 'Unauthorized request');
    }
  }
  return res.status(200).send({ success: true, data: communication_thread });
});

// (O) notification email works
const postMessages = asyncHandler(async (req, res) => {
  const {
    user,
    params: { communicationThreadId, studentId }
  } = req;
  const { message } = req.body;
  console.log(message);
  const communication_thread = await Communication.findById(
    communicationThreadId
  ).populate('student_id messages.user_id', 'firstname lastname');
  if (!communication_thread) {
    logger.info('postMessages: Invalid message thread id');
    throw new ErrorResponse(403, 'Invalid message thread id');
  }

  try {
    JSON.parse(message);
  } catch (e) {
    throw new ErrorResponse(400, 'message collapse');
  }
  // Check student can only access their own thread!!!!
  if (user.role === Role.Student) {
    if (
      communication_thread.student_id._id.toString() !== user._id.toString()
    ) {
      logger.error('getMessages: Unauthorized request!');
      throw new ErrorResponse(403, 'Unauthorized request');
    }
  }
  const new_message = {
    user_id: user._id,
    message,
    createdAt: new Date()
  };
  // TODO: prevent abuse! if communication_thread.messages.length > 30, too much message in a thread!
  communication_thread.messages.push(new_message);
  communication_thread.updatedAt = new Date();
  communication_thread.readBy = [user._id.toString()];
  await communication_thread.save();
  const communication_thread2 = await Communication.findById(
    communicationThreadId
  ).populate('student_id messages.user_id', 'firstname lastname');
  const student = await Student.findById(communication_thread.student_id)
    .populate('applications.programId')
    .populate('editors agents', 'firstname lastname email archiv');

  await student.save();
  res.status(200).send({ success: true, data: communication_thread2 });

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

  // Don't need so delete in S3 , will delete by garbage collector
  await Communication.findByIdAndUpdate(communicationThreadId, {
    $pull: {
      messages: { _id: messageId }
    }
  });

  res.status(200).send({ success: true });
});

module.exports = {
  getMyMessages,
  getMessages,
  postMessages,
  updateAMessageInThread,
  deleteAMessageInThread
};
