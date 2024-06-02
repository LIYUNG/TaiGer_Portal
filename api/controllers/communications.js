const async = require('async');
const { ObjectId } = require('mongodb');

const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const { Role, Student } = require('../models/User');
const { Communication } = require('../models/Communication');
const {
  sendAgentNewMessageReminderEmail,
  sendStudentNewMessageReminderEmail
} = require('../services/email');
const logger = require('../services/logger');
const { isNotArchiv } = require('../constants');
const Permission = require('../models/Permission');

const pageSize = 5;

// TODO
const getSearchUserMessages = asyncHandler(async (req, res, next) => {
  const { user } = req;

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

  const permissions = await Permission.findOne({ user_id: user._id });
  if (
    user.role === 'Admin' ||
    (user.role === 'Agent' && permissions?.canAccessAllChat)
  ) {
    const students = await Student.find(
      {
        $text: { $search: req.query.q }
      },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(10)
      .select('firstname lastname firstname_chinese lastname_chinese role')
      .lean();
    // Merge the results
    const mergedResults = students.map((student) => {
      const aggregateData = studentsWithCommunications.find(
        (item) => item._id.toString() === student._id.toString()
      );
      return { ...aggregateData, ...student };
    });

    res
      .status(200)
      .send({ success: true, data: { students: mergedResults, user } });
  } else {
    const students_search = await Student.find(
      {
        $text: { $search: req.query.q },
        agents: user._id.toString()
      },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(10)
      .select('firstname lastname firstname_chinese lastname_chinese role')
      .lean();
    const students = await Student.find({
      agents: user._id.toString(),
      $or: [{ archiv: { $exists: false } }, { archiv: false }]
    })
      .select('firstname lastname role')
      .lean();
    // Merge the results
    const mergedResults = students_search.map((student) => {
      const aggregateData = studentsWithCommunications.find(
        (item) => item._id.toString() === student._id.toString()
      );
      return { ...aggregateData, ...student };
    });

    res
      .status(200)
      .send({ success: true, data: { students: mergedResults, user } });
  }
  next();
});
const getSearchMessageKeywords = asyncHandler(async (req, res) => {
  const { user } = req;

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
      .select('firstname lastname firstname_chinese lastname_chinese role')
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
  const students_search = await Student.find(
    {
      $text: { $search: req.query.q },
      agents: user._id.toString()
    },
    { score: { $meta: 'textScore' } }
  )
    .sort({ score: { $meta: 'textScore' } })
    .limit(10)
    .select('firstname lastname firstname_chinese lastname_chinese role')
    .lean();
  // Merge the results
  const mergedResults = students_search.map((student) => {
    const aggregateData = studentsWithCommunications.find(
      (item) => item._id.toString() === student._id.toString()
    );
    return { ...aggregateData, ...student };
  });

  return res
    .status(200)
    .send({ success: true, data: { students: mergedResults, user } });
});

const getUnreadNumberMessages = asyncHandler(async (req, res) => {
  const { user } = req;
  if (user.role === Role.Student) {
    const latestMessage = await Communication.findOne({
      student_id: user._id.toString()
    })
      .sort({ createdAt: -1 })
      .exec();
    return res.status(200).send({
      success: true,
      data: latestMessage.readBy?.includes(user._id.toString()) ? 0 : 1
    });
  }
  if (
    user.role !== Role.Admin &&
    user.role !== Role.Agent &&
    user.role !== Role.Editor
  ) {
    logger.error('getMyMessages: not TaiGer user!');
    throw new ErrorResponse(401, 'Invalid TaiGer user');
  }
  const permissions = await Permission.findOne({ user_id: user._id });
  if (
    user.role === 'Admin' ||
    (user.role === 'Agent' && permissions?.canAccessAllChat)
  ) {
    const students = await Student.find({
      $or: [{ archiv: { $exists: false } }, { archiv: false }]
    })
      .select('firstname lastname role')
      .lean();
    // Get only the last communication
    const student_ids = students.map((stud, i) => stud._id);
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
          firstname_chinese: 1,
          lastname_chinese: 1,
          role: 1,
          latestCommunication: {
            $arrayElemAt: ['$communications', -1]
          }
        }
      },
      {
        $match: {
          'latestCommunication.student_id': { $in: student_ids },
          'latestCommunication.readBy': { $nin: [user._id] }
        }
      }
    ]);

    return res.status(200).send({
      success: true,
      data: studentsWithCommunications.length
    });
  }
  const students = await Student.find({
    agents: user._id.toString(),
    $or: [{ archiv: { $exists: false } }, { archiv: false }]
  })
    .select('firstname lastname role')
    .lean();
  const student_ids = students.map((stud, i) => stud._id);
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
        firstname_chinese: 1,
        lastname_chinese: 1,
        role: 1,
        latestCommunication: {
          $arrayElemAt: ['$communications', -1]
        }
      }
    },
    {
      $match: {
        'latestCommunication.student_id': { $in: student_ids },
        'latestCommunication.readBy': { $nin: [user._id] }
      }
    }
  ]);

  return res.status(200).send({
    success: true,
    data: studentsWithCommunications.length
  });
});

const getMyMessages = asyncHandler(async (req, res, next) => {
  const { user } = req;

  if (
    user.role !== Role.Admin &&
    user.role !== Role.Agent &&
    user.role !== Role.Editor
  ) {
    logger.error('getMyMessages: not TaiGer user!');
    throw new ErrorResponse(401, 'Invalid TaiGer user');
  }

  const permissions = await Permission.findOne({ user_id: user._id });

  if (
    user.role === 'Admin' ||
    (user.role === 'Agent' && permissions?.canAccessAllChat)
  ) {
    const students = await Student.find({
      $or: [{ archiv: { $exists: false } }, { archiv: false }]
    })
      .select('firstname lastname role')
      .lean();
    // Get only the last communication
    const student_ids = students.map((stud, i) => stud._id);
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
          firstname_chinese: 1,
          lastname_chinese: 1,
          role: 1,
          latestCommunication: {
            $arrayElemAt: ['$communications', -1]
          }
        }
      },
      {
        $match: {
          'latestCommunication.student_id': { $in: student_ids }
        }
      },
      {
        $sort: {
          'latestCommunication.createdAt': -1
        }
      }
    ]);

    res.status(200).send({
      success: true,
      data: {
        students: studentsWithCommunications,
        user
      }
    });
  } else {
    const students = await Student.find({
      agents: user._id.toString(),
      $or: [{ archiv: { $exists: false } }, { archiv: false }]
    })
      .select('firstname lastname role')
      .lean();
    const student_ids = students.map((stud, i) => stud._id);
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
          firstname_chinese: 1,
          lastname_chinese: 1,
          role: 1,
          latestCommunication: {
            $arrayElemAt: ['$communications', -1]
          }
        }
      },
      {
        $match: {
          'latestCommunication.student_id': { $in: student_ids }
        }
      },
      {
        $sort: {
          'latestCommunication.createdAt': -1
        }
      }
    ]);

    res.status(200).send({
      success: true,
      data: {
        students: studentsWithCommunications,
        user
      }
    });
  }

  next();
});

const loadMessages = asyncHandler(async (req, res, next) => {
  const {
    user,
    params: { studentId, pageNumber }
  } = req;

  const student = await Student.findById(studentId)
    .select(
      'firstname lastname firstname_chinese lastname_chinese agents archiv'
    )
    .populate('agents', 'firstname lastname email role');
  if (!student) {
    logger.error('getMessages: Invalid student id!');
    throw new ErrorResponse(404, 'Student tot found');
  }
  const skipAmount = (pageNumber - 1) * pageSize;
  const communication_thread = await Communication.find({
    student_id: studentId
  })
    .populate(
      'student_id user_id',
      'firstname lastname firstname_chinese lastname_chinese role agents editors'
    )
    .sort({ createdAt: -1 })
    .skip(skipAmount) // skip first x items.
    .limit(pageSize); // show only first y limit items after skip.

  // Multitenant-filter: Check student can only access their own thread!!!!

  res.status(200).send({ success: true, data: communication_thread, student });
  next();
});

const getMessages = asyncHandler(async (req, res, next) => {
  const {
    user,
    params: { studentId }
  } = req;

  const student = await Student.findById(studentId)
    .select(
      'firstname lastname firstname_chinese lastname_chinese agents archiv'
    )
    .populate('agents', 'firstname lastname email role');
  if (!student) {
    logger.error('getMessages: Invalid student id!');
    throw new ErrorResponse(404, 'Student not found');
  }
  let communication_thread;
  communication_thread = await Communication.find({
    student_id: studentId
  })
    .populate('student_id user_id', 'firstname lastname role')
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
  res.status(200).send({ success: true, data: communication_thread, student });
  next();
});

// (O) notification email works
const postMessages = asyncHandler(async (req, res, next) => {
  const {
    user,
    params: { studentId }
  } = req;
  const { message } = req.body;
  // TODO: check if consecutive post?
  if (user.role === Role.Student) {
    const communication_thread = await Communication.find({
      student_id: studentId
    })
      .populate('student_id user_id', 'firstname lastname role')
      .sort({ createdAt: -1 }) // 0: latest!
      .limit(3); // show only first 3 limit items after skip.

    if (communication_thread.length === 3) {
      let flag = true;
      for (let i = 0; i < communication_thread.length; i += 1) {
        if (communication_thread[i]?.user_id?._id.toString() === studentId) {
          flag =
            flag &&
            communication_thread[i]?.user_id?._id.toString() === studentId;
        } else {
          flag = false;
          break;
        }
      }
      if (flag) {
        logger.error(`Too much message by ${studentId}`);
        throw new ErrorResponse(
          429,
          '您至多只能發連續三條訊息！請整理好您的問題一次發問，方便 Agent 一次回復。若 Agent 尚未回覆當前留言，請把問題集中於最新一次的留言，該留言右上角鉛筆可以編輯。您的 Agent 會盡速回復您！'
        );
      }
    }
  }
  try {
    JSON.parse(message);
  } catch (e) {
    logger.error(`message collapse ${message}`);
    throw new ErrorResponse(400, 'message collapse');
  }

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

  // TODO inform agent/student
  if (user.role === Role.Student) {
    // If no editor, inform agent to assign
    for (let i = 0; i < student.agents.length; i += 1) {
      // inform active-agent
      if (isNotArchiv(student)) {
        if (isNotArchiv(student.agents[i])) {
          // inform agent
          sendAgentNewMessageReminderEmail(
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
  } else {
    sendStudentNewMessageReminderEmail(
      {
        firstname: student.firstname,
        lastname: student.lastname,
        address: student.email
      },
      {
        taiger_user_firstname: user.firstname,
        student_id: student._id.toString(),
        taiger_user_lastname: user.lastname
      }
    );
  }
  next();
});

// (-) TODO email : no notification needed
const updateAMessageInThread = asyncHandler(async (req, res, next) => {
  const {
    params: { messageId }
  } = req;
  const { message } = req.body;
  try {
    const thread = await Communication.findByIdAndUpdate(
      messageId,
      { message },
      { new: true }
    ).populate('student_id user_id', 'firstname lastname');
    if (!thread) {
      logger.error('updateAMessageInThread : Invalid message thread id');
      throw new ErrorResponse(404, 'Thread not found');
    }
    res.status(200).send({ success: true, data: thread });
  } catch (e) {
    logger.error(`updateAMessageInThread error for messageId ${messageId}`);
    throw new ErrorResponse(400, 'message collapse');
  }
  next();
});

// (-) TODO email : no notification needed
const deleteAMessageInCommunicationThread = asyncHandler(
  async (req, res, next) => {
    const {
      params: { messageId }
    } = req;

    // Prevent multitenant
    try {
      await Communication.findByIdAndDelete(messageId);
      res.status(200).send({ success: true });
      next();
    } catch (e) {
      logger.error(`Delete error for messageId ${messageId}`);
      throw new ErrorResponse(400, 'message collapse');
    }
  }
);

const IgnoreMessage = asyncHandler(async (req, res, next) => {
  const {
    params: { communication_messageId, ignoreMessageState }
  } = req;

  try {
    await Communication.findByIdAndUpdate(
      communication_messageId,
      { ignore_message: ignoreMessageState },
      {}
    );
  } catch (e) {
    logger.error(
      `IgnoreMessage error for messageId ${communication_messageId}, state: ${ignoreMessageState}`
    );
    throw new ErrorResponse(400, 'message collapse');
  }

  logger.info('IgnoreMessage : save succeeds');
  res.status(200).send({ success: true });
  next();
});

module.exports = {
  getSearchUserMessages,
  getSearchMessageKeywords,
  getUnreadNumberMessages,
  getMyMessages,
  loadMessages,
  getMessages,
  postMessages,
  updateAMessageInThread,
  deleteAMessageInCommunicationThread,
  IgnoreMessage
};
