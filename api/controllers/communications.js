const aws = require('aws-sdk');
const async = require('async');
const path = require('path');
const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const { Role, Agent, Student, Editor } = require('../models/User');
const { one_month_cache } = require('../cache/node-cache');
const { Communication } = require('../models/Communication');
const {
  sendNewApplicationMessageInThreadEmail,
  sendAssignEditorReminderEmail,
  sendNewGeneraldocMessageInThreadEmail
} = require('../services/email');
const logger = require('../services/logger');
const {
  General_Docs,
  application_deadline_calculator,
  isNotArchiv,
  CVDeadline_Calculator
} = require('../constants');

const Permission = require('../models/Permission');

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
    {},
    { new: true, upsert: true }
  )
    .populate('student_id', 'firstname lastname role agents editors')
    .populate('messages.user_id', 'firstname lastname role')
    .lean()
    .exec();

  // Multitenant-filter: Check student can only access their own thread!!!!
  if (user.role === Role.Student) {
    if (communication_thread.student_id._id.toString() !== user._id.toString()) {
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
    params: { communicationThreadId }
  } = req;
  const { message } = req.body;

  const communication_thread = await Communication.findById(
    communicationThreadId
  ).populate('student_id program_id');
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
  await communication_thread.save();
  const communication_thread2 = await Communication.findById(
    communicationThreadId
  ).populate('student_id messages.user_id');
  // in student (User) collections.
  const student = await Student.findById(communication_thread.student_id)
    .populate('applications.programId')
    .populate('editors agents', 'firstname lastname email archiv');

  await student.save();
  res.status(200).send({ success: true, data: communication_thread2 });

  if (user.role === Role.Student) {
    // If no editor, inform agent to assign
    if (!student.editors || student.editors.length === 0) {
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
      // inform editor-lead
      const permissions = await Permission.find({
        canAssignEditors: true
      })
        .populate('user_id', 'firstname lastname email')
        .lean();
      if (permissions) {
        for (let x = 0; x < permissions.length; x += 1) {
          sendAssignEditorReminderEmail(
            {
              firstname: permissions[x].user_id.firstname,
              lastname: permissions[x].user_id.lastname,
              address: permissions[x].user_id.email
            },
            {
              student_firstname: student.firstname,
              student_id: student._id.toString(),
              student_lastname: student.lastname
            }
          );
        }
      }
    } else {
      // Inform Editor
      for (let i = 0; i < student.editors.length; i += 1) {
        if (communication_thread.program_id) {
          if (isNotArchiv(student)) {
            if (isNotArchiv(student.editors[i])) {
              sendNewApplicationMessageInThreadEmail(
                {
                  firstname: student.editors[i].firstname,
                  lastname: student.editors[i].lastname,
                  address: student.editors[i].email
                },
                {
                  writer_firstname: user.firstname,
                  writer_lastname: user.lastname,
                  student_firstname: student.firstname,
                  student_lastname: student.lastname,
                  uploaded_documentname: communication_thread.file_type,
                  school: communication_thread.program_id.school,
                  program_name: communication_thread.program_id.program_name,
                  thread_id: communication_thread._id.toString(),
                  uploaded_updatedAt: new Date(),
                  message
                }
              );
            }
          }
        } else {
          if (isNotArchiv(student)) {
            if (isNotArchiv(student.editors[i])) {
              sendNewGeneraldocMessageInThreadEmail(
                {
                  firstname: student.editors[i].firstname,
                  lastname: student.editors[i].lastname,
                  address: student.editors[i].email
                },
                {
                  writer_firstname: user.firstname,
                  writer_lastname: user.lastname,
                  student_firstname: student.firstname,
                  student_lastname: student.lastname,
                  thread_id: communication_thread._id.toString(),
                  uploaded_updatedAt: new Date(),
                  message
                }
              );
            }
          }
        }
      }
    }
  }
  if (user.role === Role.Editor) {
    // Inform student
    if (communication_thread.program_id) {
      if (isNotArchiv(communication_thread.student_id)) {
        sendNewApplicationMessageInThreadEmail(
          {
            firstname: communication_thread.student_id.firstname,
            lastname: communication_thread.student_id.lastname,
            address: communication_thread.student_id.email
          },
          {
            writer_firstname: user.firstname,
            writer_lastname: user.lastname,
            student_firstname: student.firstname,
            student_lastname: student.lastname,
            uploaded_documentname: communication_thread.file_type,
            school: communication_thread.program_id.school,
            thread_id: communication_thread._id.toString(),
            program_name: communication_thread.program_id.program_name,
            uploaded_updatedAt: new Date(),
            message
          }
        );
      }
    } else {
      if (isNotArchiv(communication_thread.student_id)) {
        sendNewGeneraldocMessageInThreadEmail(
          {
            firstname: communication_thread.student_id.firstname,
            lastname: communication_thread.student_id.lastname,
            address: communication_thread.student_id.email
          },
          {
            writer_firstname: user.firstname,
            writer_lastname: user.lastname,
            student_firstname: student.firstname,
            student_lastname: student.lastname,
            uploaded_documentname: communication_thread.file_type,
            thread_id: communication_thread._id.toString(),
            uploaded_updatedAt: new Date(),
            message
          }
        );
      }
    }
  }
  if (user.role === Role.Agent || user.role === Role.Admin) {
    // Inform Editor
    // const student = user;
    for (let i = 0; i < student.editors.length; i += 1) {
      if (communication_thread.program_id) {
        if (isNotArchiv(student)) {
          if (isNotArchiv(student.editors[i])) {
            sendNewApplicationMessageInThreadEmail(
              {
                firstname: student.editors[i].firstname,
                lastname: student.editors[i].lastname,
                address: student.editors[i].email
              },
              {
                writer_firstname: user.firstname,
                writer_lastname: user.lastname,
                student_firstname: student.firstname,
                student_lastname: student.lastname,
                uploaded_documentname: communication_thread.file_type,
                school: communication_thread.program_id.school,
                program_name: communication_thread.program_id.program_name,
                thread_id: communication_thread._id.toString(),
                uploaded_updatedAt: new Date(),
                message
              }
            );
          }
        }
      } else {
        if (isNotArchiv(student)) {
          if (isNotArchiv(student.editors[i])) {
            sendNewGeneraldocMessageInThreadEmail(
              {
                firstname: student.editors[i].firstname,
                lastname: student.editors[i].lastname,
                address: student.editors[i].email
              },
              {
                writer_firstname: user.firstname,
                writer_lastname: user.lastname,
                student_firstname: student.firstname,
                student_lastname: student.lastname,
                uploaded_documentname: communication_thread.file_type,
                thread_id: communication_thread._id.toString(),
                uploaded_updatedAt: new Date(),
                message
              }
            );
          }
        }
      }
    }
    // Inform student
    if (communication_thread.program_id) {
      if (isNotArchiv(communication_thread.student_id)) {
        sendNewApplicationMessageInThreadEmail(
          {
            firstname: communication_thread.student_id.firstname,
            lastname: communication_thread.student_id.lastname,
            address: communication_thread.student_id.email
          },
          {
            writer_firstname: user.firstname,
            writer_lastname: user.lastname,
            student_firstname: student.firstname,
            student_lastname: student.lastname,
            uploaded_documentname: communication_thread.file_type,
            school: communication_thread.program_id.school,
            thread_id: communication_thread._id.toString(),
            program_name: communication_thread.program_id.program_name,
            uploaded_updatedAt: new Date(),
            message
          }
        );
      }
    } else {
      if (isNotArchiv(communication_thread.student_id)) {
        sendNewGeneraldocMessageInThreadEmail(
          {
            firstname: communication_thread.student_id.firstname,
            lastname: communication_thread.student_id.lastname,
            address: communication_thread.student_id.email
          },
          {
            writer_firstname: user.firstname,
            writer_lastname: user.lastname,
            student_firstname: student.firstname,
            student_lastname: student.lastname,
            uploaded_documentname: communication_thread.file_type,
            thread_id: communication_thread._id.toString(),
            uploaded_updatedAt: new Date(),
            message
          }
        );
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
  if (thread.isFinalVersion) {
    logger.error('deleteAMessageInThread : FinalVersion is read only');
    throw new ErrorResponse(423, 'FinalVersion is read only');
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

  // Messageid + extension (because extension is unique per message id)
  for (let i = 0; i < msg.file.length; i += 1) {
    const cache_key = `${messageId}${encodeURIComponent(
      msg.file[i].name.split('.')[1]
    )}`;
    // console.log(cache_key);
    const value = one_month_cache.del(cache_key);
    // console.log(value);
    if (value === 1) {
      console.log('file cache key deleted successfully');
    }
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
  getMessages,
  postMessages,
  updateAMessageInThread,
  deleteAMessageInThread
};
