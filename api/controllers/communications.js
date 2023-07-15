const aws = require('aws-sdk');
const async = require('async');
const { ObjectId } = require('mongodb');

const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const { Role, Agent, Student, Editor, User } = require('../models/User');
const { Communication } = require('../models/Communication');
const { sendAssignEditorReminderEmail } = require('../services/email');
const logger = require('../services/logger');
const { isNotArchiv } = require('../constants');

const pageSize = 5;

const getMyMessages = asyncHandler(async (req, res) => {
  const {
    user,
    params: { taiger_user_id }
  } = req;
  const the_user = await User.findById(taiger_user_id).select(
    'firstname lastname role'
  );
  if (
    user.role !== Role.Admin &&
    user.role !== Role.Agent &&
    user.role !== Role.Editor
  ) {
    logger.error('getMyMessages: not TaiGer user!');
    throw new ErrorResponse(401, 'Invalid TaiGer user');
  }
  // Get only the last communication
  const studentsWithCommunications = await Student.aggregate([
    {
      $lookup: {
        from: 'communications',
        localField: '_id',
        foreignField: 'student_id',
        as: 'communications'
      }
    },
    {
      $project: {
        firstname: 1,
        lastname: 1,
        role: 1,
        latestCommunication: {
          $arrayElemAt: ['$communications', -1]
        }
        // communications: {
        //   _id: 1,
        //   user_id: 1,
        //   message: 1,
        //   readBy: 1
        //   // Include only the fields you want to retrieve
        // }
      }
    }
  ]);
  if (user.role === 'Admin') {
    const students = await Student.find({
      $or: [{ archiv: { $exists: false } }, { archiv: false }]
    })
      .select('firstname lastname role')
      .lean();
    // Merge the results
    const mergedResults = students.map((student) => {
      const aggregateData = studentsWithCommunications.find(
        (item) => item._id.toString() === student._id.toString()
      );
      return { ...aggregateData, ...student };
    });

    return res
      .status(200)
      .send({ success: true, data: { students: mergedResults, user } });
  }
  const students = await Student.find({
    agents: user._id.toString(),
    $or: [{ archiv: { $exists: false } }, { archiv: false }]
  })
    .select('firstname lastname role')
    .lean();
  // Merge the results
  const mergedResults = students.map((student) => {
    const aggregateData = studentsWithCommunications.find(
      (item) => item._id.toString() === student._id.toString()
    );
    return { ...aggregateData, ...student };
  });

  return res
    .status(200)
    .send({ success: true, data: { students: mergedResults, user } });
});

const loadMessages = asyncHandler(async (req, res) => {
  const {
    user,
    params: { studentId, pageNumber }
  } = req;

  const student = await Student.findById(studentId).select(
    'firstname lastname'
  );
  if (!student) {
    logger.error('getMessages: Invalid student id!');
    throw new ErrorResponse(403, 'Invalid student id');
  }
  const skipAmount = (pageNumber - 1) * pageSize;
  const communication_thread = await Communication.find({
    student_id: studentId
  })
    .populate('student_id user_id', 'firstname lastname role agents editors')
    .sort({ createdAt: -1 })
    .skip(skipAmount) // skip first x items.
    .limit(pageSize); // show only first y limit items after skip.

  // Multitenant-filter: Check student can only access their own thread!!!!

  return res
    .status(200)
    .send({ success: true, data: communication_thread, student });
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
  let communication_thread;
  communication_thread = await Communication.find({
    student_id: studentId
  })
    .populate('student_id user_id', 'firstname lastname role agents editors')
    .sort({ createdAt: -1 }) // 0: latest!
    .limit(pageSize); // show only first y limit items after skip.

  // Multitenant-filter: Check student can only access their own thread!!!!
  if (communication_thread.length > 0) {
    const lastElement = communication_thread[0];
    if (!lastElement.readBy.includes(new ObjectId(user._id.toString()))) {
      lastElement.readBy.push(new ObjectId(user._id.toString()));
      await lastElement.save();
    }
  }
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
  const communication_latest = await Communication.find({
    student_id: studentId
  })
    .populate('student_id user_id', 'firstname lastname')
    .sort({ createdAt: -1 }) // 0: latest!
    .limit(1);
  res.status(200).send({ success: true, data: communication_latest });

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
    params: { messageId }
  } = req;

  const thread = await Communication.findById(messageId);
  if (!thread) {
    logger.error('updateAMessageInThread : Invalid message thread id');
    throw new ErrorResponse(403, 'Invalid message thread id');
  }

  const msg = thread.messages.find(
    (message) => message._id.toString() === messageId
  );

  if (!msg) {
    logger.error('updateAMessageInThread : Invalid message id');
    throw new ErrorResponse(403, 'Invalid message id');
  }
  // Prevent multitenant
  if (msg.user_id.toString() !== user._id.toString()) {
    logger.error(
      'updateAMessageInThread : You can only delete your own message.'
    );
    throw new ErrorResponse(409, 'You can only delete your own message.');
  }

  // TODO: update message
  //   await Communication.findByIdAndUpdate(studentId, {
  //     $pull: {
  //       messages: { _id: messageId }
  //     }
  //   });

  res.status(200).send({ success: true });
});

// (-) TODO email : no notification needed
const deleteAMessageInCommunicationThread = asyncHandler(async (req, res) => {
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
  loadMessages,
  getMessages,
  postMessages,
  updateAMessageInThread,
  deleteAMessageInCommunicationThread
};
