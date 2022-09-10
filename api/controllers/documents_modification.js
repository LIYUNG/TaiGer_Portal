const aws = require('aws-sdk');
const async = require('async');
const path = require('path');
const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const { Role, Agent, Student, Editor } = require('../models/User');
const { Documentthread } = require('../models/Documentthread');
const {
  sendNewApplicationMessageInThreadToEditorEmail,
  sendNewApplicationMessageInThreadToStudentEmail,
  sendNewGeneraldocMessageInThreadToEditorEmail,
  sendNewGeneraldocMessageInThreadToStudentEmail,
  sendSetAsFinalGeneralFileForAgentEmail,
  sendSetAsFinalGeneralFileForStudentEmail,
  sendSetAsFinalProgramSpecificFileForStudentEmail,
  sendSetAsFinalProgramSpecificFileForAgentEmail
  // sendSomeReminderEmail,
} = require('../services/email');
const logger = require('../services/logger');

const {
  AWS_S3_ACCESS_KEY_ID,
  AWS_S3_ACCESS_KEY,
  AWS_S3_BUCKET_NAME
} = require('../config');

const s3 = new aws.S3({
  accessKeyId: AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: AWS_S3_ACCESS_KEY
});

const getCVMLRLOverview = asyncHandler(async (req, res) => {
  const {
    user
    // params: { userId },
  } = req;
  if (user.role === Role.Admin) {
    const students = await Student.find({
      $or: [{ archiv: { $exists: false } }, { archiv: false }]
    })
      .populate('applications.programId generaldocs_threads.doc_thread_id')
      .populate(
        'applications.doc_modification_thread.doc_thread_id',
        'file_type updatedAt'
      )
      .lean();
    res.status(200).send({ success: true, data: students });
  } else if (user.role === Role.Agent) {
    const students = await Student.find({
      _id: { $in: user.students },
      $or: [{ archiv: { $exists: false } }, { archiv: false }]
    })
      .populate('applications.programId generaldocs_threads.doc_thread_id')
      .populate(
        'applications.doc_modification_thread.doc_thread_id',
        'file_type updatedAt'
      )
      .lean()
      .exec();
    // console.log(Object.entries(students[0].applications[0].programId)); // looks ok!
    // console.log(students[0].applications[0].programId); // looks ok!
    // console.log(students[0].applications[0].programId.school);

    res.status(200).send({ success: true, data: students });
  } else if (user.role === Role.Editor) {
    const students = await Student.find({
      _id: { $in: user.students },
      $or: [{ archiv: { $exists: false } }, { archiv: false }]
    })
      .populate('applications.programId generaldocs_threads.doc_thread_id')
      .populate(
        'applications.doc_modification_thread.doc_thread_id',
        'file_type updatedAt'
      );

    res.status(200).send({ success: true, data: students });
  } else if (user.role === Role.Student) {
    const student = await Student.findById(user._id)
      .populate('applications.programId generaldocs_threads.doc_thread_id')
      .populate(
        'applications.doc_modification_thread.doc_thread_id',
        'file_type updatedAt'
      )
      .lean()
      .exec();
    res.status(200).send({ success: true, data: [student] });
  } else {
    // Guest
    res.status(200).send({ success: true, data: [user] });
  }
});

const initGeneralMessagesThread = asyncHandler(async (req, res) => {
  const {
    params: { studentId, document_category }
  } = req;

  const student = await Student.findById(studentId)
    .populate('generaldocs_threads.doc_thread_id')
    .exec();

  if (!student) {
    logger.info('initGeneralMessagesThread: Invalid student id');
    throw new ErrorResponse(400, 'Invalid student id');
  }

  const doc_thread_existed = await Documentthread.findOne({
    student_id: studentId,
    file_type: document_category
  });

  if (doc_thread_existed) {
    // should add the existing one thread to student generaldocs
    const thread_in_student_generaldoc_existed =
      student.generaldocs_threads.find(
        ({ doc_thread_id }) =>
          doc_thread_id._id.toString() == doc_thread_existed._id.toString()
      );
    // if thread existed but not in student application thread, then add it.
    if (!thread_in_student_generaldoc_existed) {
      // console.log('Pass 1.1');
      const app = student.generaldocs_threads.create({
        doc_thread_id: doc_thread_existed._id,
        updatedAt: new Date(),
        createdAt: new Date()
      });
      student.generaldocs_threads.push(app);
      await student.save();
      const student_updated = await Student.findById(studentId)
        .populate('applications.programId generaldocs_threads.doc_thread_id')
        .populate(
          'applications.doc_modification_thread.doc_thread_id',
          'file_type updatedAt'
        );
      return res.status(200).send({ success: true, data: student_updated });
    }
    logger.info('initGeneralMessagesThread: Document Thread already existed!');
    throw new ErrorResponse(400, 'Document Thread already existed!');
  }
  const new_doc_thread = new Documentthread({
    student_id: studentId,
    file_type: document_category,
    program_id: null,
    updatedAt: new Date()
  });

  const temp = student.generaldocs_threads.create({
    doc_thread_id: new_doc_thread._id,
    updatedAt: new Date(),
    createdAt: new Date()
  });

  temp.student_id = studentId;
  student.generaldocs_threads.push(temp);
  await student.save();
  await new_doc_thread.save();

  const student2 = await Student.findById(studentId)
    .populate('applications.programId generaldocs_threads.doc_thread_id')
    .populate(
      'applications.doc_modification_thread.doc_thread_id',
      'file_type updatedAt'
    );
  res.status(200).send({ success: true, data: student2 });
  // TODO: Email notification
});

const initApplicationMessagesThread = asyncHandler(async (req, res) => {
  const {
    params: { studentId, program_id, document_category }
  } = req;

  const student = await Student.findById(studentId)
    .populate('applications.programId')
    .populate('agents editors', 'firstname lastname email')
    .exec();

  if (!student) {
    logger.info('initApplicationMessagesThread: Invalid student id!');
    throw new ErrorResponse(400, 'Invalid student id');
  }
  const application = student.applications.find(
    ({ programId }) => programId._id == program_id
  );

  if (!application) {
    logger.info('initApplicationMessagesThread: Invalid application id!');
    throw new ErrorResponse(400, 'Invalid application id');
  }

  const doc_thread_existed = await Documentthread.findOne({
    student_id: studentId,
    file_type: document_category,
    program_id
  });

  if (doc_thread_existed) {
    // should add the existing one thread to student application
    const thread_in_student_application_existed =
      application.doc_modification_thread.find(
        ({ doc_thread_id }) =>
          doc_thread_id.toString() == doc_thread_existed._id.toString()
      );
    // if thread existed but not in student application thread, then add it.
    if (!thread_in_student_application_existed) {
      // console.log('Pass 1.1');
      const app = application.doc_modification_thread.create({
        doc_thread_id: doc_thread_existed._id,
        updatedAt: new Date(),
        createdAt: new Date()
      });
      application.doc_modification_thread.push(app);
      await student.save();
      const student_updated = await Student.findById(studentId)
        .populate('applications.programId generaldocs_threads.doc_thread_id')
        .populate(
          'applications.doc_modification_thread.doc_thread_id',
          'file_type updatedAt'
        );
      return res.status(200).send({ success: true, data: student_updated });
    }
    // console.log('Pass 1.2');
    logger.error(
      'initApplicationMessagesThread: Document Thread already existed!'
    );
    throw new ErrorResponse(400, 'Document Thread already existed!');
  }

  // minor TODO: if thread not existed but some deprecated one in doc_modification_thread?

  const new_doc_thread = new Documentthread({
    student_id: studentId,
    file_type: document_category,
    program_id,
    updatedAt: new Date()
  });

  const idx = student.applications.findIndex(
    ({ programId }) => programId._id == program_id
  );
  const temp = student.applications[idx].doc_modification_thread.create({
    doc_thread_id: new_doc_thread._id,
    updatedAt: new Date(),
    createdAt: new Date()
  });

  temp.student_id = studentId;
  student.applications[idx].doc_modification_thread.push(temp);
  await student.save();
  await new_doc_thread.save();

  const student2 = await Student.findById(studentId)
    .populate('applications.programId generaldocs_threads.doc_thread_id')
    .populate(
      'applications.doc_modification_thread.doc_thread_id',
      'file_type updatedAt'
    );
  res.status(200).send({ success: true, data: student2 });
});

const getMessages = asyncHandler(async (req, res) => {
  const {
    params: { messagesThreadId }
  } = req;
  const document_thread = await Documentthread.findById(messagesThreadId)
    .populate('student_id messages.user_id')
    .populate('program_id')
    .lean()
    .exec();

  if (!document_thread) {
    logger.error('getMessages: Invalid message thread id!');
    throw new ErrorResponse(400, 'Invalid message thread id');
  }

  res.status(200).send({ success: true, data: document_thread });
});

// (O) notification email works
const postMessages = asyncHandler(async (req, res) => {
  const {
    user,
    params: { messagesThreadId }
  } = req;
  const { message } = req.body;

  const document_thread = await Documentthread.findById(messagesThreadId)
    .populate('student_id program_id')
    .exec();

  if (!document_thread) {
    logger.info('postMessages: Invalid message thread id');
    throw new ErrorResponse(400, 'Invalid message thread id');
  }

  let newfile = [];
  if (req.file) {
    newfile = [
      {
        name: req.file.key,
        path: path.join(req.file.metadata.path, req.file.key)
      }
    ];
  }

  const new_message = {
    user_id: user._id,
    message,
    createdAt: new Date(),
    file: newfile
  };
  document_thread.messages.push(new_message);
  await document_thread.save();
  const document_thread2 = await Documentthread.findById(messagesThreadId)
    .populate('student_id program_id messages.user_id')
    .exec();
  res.status(200).send({ success: true, data: document_thread2 });
  // update StudentRead, EditorRead, isReceivedEditorFeedback and isReceivedStudentFeedback
  // in student (User) collections.
  const student = await Student.findById(document_thread.student_id)
    .populate('applications.programId')
    .exec();
  if (document_thread.program_id) {
    const application = student.applications.find(
      ({ programId }) =>
        programId.toString() === document_thread.program_id.toString()
    );
    const doc_thread = application.doc_modification_thread.find(
      ({ doc_thread_id }) =>
        doc_thread_id._id.toString() === document_thread._id.toString()
    );
    if (user.role === Role.Student) {
      doc_thread.isReceivedEditorFeedback = false;
      doc_thread.isReceivedStudentFeedback = true;
      doc_thread.StudentRead = true;
      doc_thread.EditorRead = false;
    }
    if (user.role === Role.Editor) {
      doc_thread.isReceivedEditorFeedback = true;
      doc_thread.isReceivedStudentFeedback = false;
      doc_thread.StudentRead = false;
      doc_thread.EditorRead = true;
    }
    doc_thread.updatedAt = new Date();
  } else {
    const general_thread = student.generaldocs_threads.find(
      ({ doc_thread_id }) =>
        doc_thread_id.toString() == document_thread._id.toString()
    );
    if (user.role === Role.Student) {
      general_thread.isReceivedStudentFeedback = true;
      general_thread.isReceivedEditorFeedback = false;
      general_thread.StudentRead = true;
      general_thread.EditorRead = false;
    }
    if (user.role === Role.Editor) {
      general_thread.isReceivedStudentFeedback = false;
      general_thread.isReceivedEditorFeedback = true;
      general_thread.StudentRead = false;
      general_thread.EditorRead = true;
    }
    general_thread.updatedAt = new Date();
  }

  await student.save();

  if (user.role === Role.Student) {
    // Inform Editor
    const student = user;
    for (let i = 0; i < student.editors.length; i++) {
      if (document_thread.program_id) {
        sendNewApplicationMessageInThreadToEditorEmail(
          {
            firstname: student.editors[i].firstname,
            lastname: student.editors[i].lastname,
            address: student.editors[i].email
          },
          {
            student_firstname: user.firstname,
            student_lastname: user.lastname,
            uploaded_documentname: document_thread.file_type,
            school: document_thread.program_id.school,
            program_name: document_thread.program_id.program_name,
            uploaded_updatedAt: new Date(),
            message
          }
        );
      } else {
        sendNewGeneraldocMessageInThreadToEditorEmail(
          {
            firstname: student.editors[i].firstname,
            lastname: student.editors[i].lastname,
            address: student.editors[i].email
          },
          {
            student_firstname: user.firstname,
            student_lastname: user.lastname,
            uploaded_documentname: document_thread.file_type,
            uploaded_updatedAt: new Date(),
            message
          }
        );
      }
    }
  } else {
    // Inform student
    if (document_thread.program_id) {
      sendNewApplicationMessageInThreadToStudentEmail(
        {
          firstname: document_thread.student_id.firstname,
          lastname: document_thread.student_id.lastname,
          address: document_thread.student_id.email
        },
        {
          editor_firstname: user.firstname,
          editor_lastname: user.lastname,
          uploaded_documentname: document_thread.file_type,
          school: document_thread.program_id.school,
          program_name: document_thread.program_id.program_name,
          uploaded_updatedAt: new Date(),
          message
        }
      );
    } else {
      sendNewGeneraldocMessageInThreadToStudentEmail(
        {
          firstname: document_thread.student_id.firstname,
          lastname: document_thread.student_id.lastname,
          address: document_thread.student_id.email
        },
        {
          editor_firstname: user.firstname,
          editor_lastname: user.lastname,
          uploaded_documentname: document_thread.file_type,
          uploaded_updatedAt: new Date(),
          message
        }
      );
    }
  }
});

// Download file in a message in a thread
const getMessageFile = asyncHandler(async (req, res) => {
  const {
    user,
    params: { messagesThreadId, messageId, fileId }
  } = req;

  const document_thread = await Documentthread.findById(messagesThreadId);
  if (!document_thread) {
    logger.error('getMessageFile: thread not found!');
    throw new ErrorResponse(400, 'thread not found');
  }

  if (
    user.role === Role.Student &&
    document_thread.student_id.toString() !== user._id.toString()
  ) {
    logger.error('getMessageFile: Not authorized!');
    throw new ErrorResponse(400, 'Not authorized');
  }

  const message = document_thread.messages.find(
    (message) => message._id == messageId
  );
  if (!message) {
    logger.error('getMessageFile: message not found!');
    throw new ErrorResponse(400, 'message not found');
  }

  const file = message.file.find((file) => file._id == fileId);
  if (!file) {
    logger.error('getMessageFile: file not found!');
    throw new ErrorResponse(400, 'file not found');
  }

  let path_split = file.path.replace(/\\/g, '/');
  path_split = path_split.split('/');
  const fileKey = path_split[2];
  logger.info('Trying to download message file', fileKey);
  let directory = path.join(AWS_S3_BUCKET_NAME, path_split[0], path_split[1]);
  directory = directory.replace(/\\/g, '/');
  const options = {
    Key: fileKey,
    Bucket: directory
  };

  s3.headObject(options)
    .promise()
    .then(() => {
      // This will not throw error anymore
      res.attachment(fileKey);
      const fileStream = s3.getObject(options).createReadStream();
      fileStream.pipe(res);
    })
    .catch((error) => {
      if (error.statusCode === 404) {
        // Catching NoSuchKey
        logger.error(error);
      }
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    });
});

// (O) notification student email works
// (O) notification agent email works
const SetStatusMessagesThread = asyncHandler(async (req, res) => {
  const {
    user,
    params: { messagesThreadId, studentId },
    body: { program_id }
  } = req;

  const document_thread = await Documentthread.findById(messagesThreadId);
  const student = await Student.findById(studentId)
    .populate('applications.programId generaldocs_threads.doc_thread_id')
    .populate(
      'applications.doc_modification_thread.doc_thread_id',
      'file_type updatedAt'
    );
  if (!document_thread) {
    logger.error('SetStatusMessagesThread: Invalid message thread id');
    throw new ErrorResponse(400, 'Invalid message thread id');
  }
  if (!student) {
    logger.error('SetStatusMessagesThread: Invalid student id');
    throw new ErrorResponse(400, 'Invalid student id id');
  }
  logger.info('program_id ', program_id);
  if (program_id) {
    const student_application = student.applications.find(
      (application) => application.programId._id == program_id
    );
    if (!student_application) {
      logger.error('SetStatusMessagesThread: application not foun');
      throw new ErrorResponse(400, 'application not found');
    }

    const application_thread = student_application.doc_modification_thread.find(
      (thread) => thread.doc_thread_id._id == messagesThreadId
    );
    if (!application_thread) {
      logger.error('SetStatusMessagesThread: application thread not found');
      throw new ErrorResponse(400, 'thread not found');
    }
    application_thread.isFinalVersion = !application_thread.isFinalVersion;
    await student.save();
    const student2 = await Student.findById(studentId)
      .populate('applications.programId generaldocs_threads.doc_thread_id')
      .populate(
        'applications.doc_modification_thread.doc_thread_id',
        'file_type updatedAt'
      );
    res.status(200).send({ success: true, data: student2 });
    await sendSetAsFinalProgramSpecificFileForStudentEmail(
      {
        firstname: student2.firstname,
        lastname: student2.lastname,
        address: student.email
      },
      {
        editor_firstname: user.firstname,
        editor_lastname: user.lastname,
        school: student_application.programId.school,
        program_name: student_application.programId.program_name,
        uploaded_documentname: application_thread.doc_thread_id.file_type,
        uploaded_updatedAt: new Date(),
        isFinalVersion: application_thread.isFinalVersion
      }
    );
    const student3 = await Student.findById(studentId).populate(
      'agents',
      'firstname lastname email'
    );

    for (let i = 0; i < student.agents.length; i++) {
      await sendSetAsFinalProgramSpecificFileForAgentEmail(
        {
          firstname: student3.agents[i].firstname,
          lastname: student3.agents[i].lastname,
          address: student3.agents[i].email
        },
        {
          student_firstname: student3.firstname,
          student_lastname: student3.lastname,
          editor_firstname: user.firstname,
          editor_lastname: user.lastname,
          school: student_application.programId.school,
          program_name: student_application.programId.program_name,
          uploaded_documentname: application_thread.doc_thread_id.file_type,
          uploaded_updatedAt: new Date(),
          isFinalVersion: application_thread.isFinalVersion
        }
      );
    }
  } else {
    const generaldocs_thread = student.generaldocs_threads.find(
      (thread) => thread.doc_thread_id._id == messagesThreadId
    );
    if (!generaldocs_thread) {
      logger.error('SetStatusMessagesThread: generaldoc thread not found');
      throw new ErrorResponse(400, 'thread not found');
    }
    generaldocs_thread.isFinalVersion = !generaldocs_thread.isFinalVersion;
    await student.save();
    const student2 = await Student.findById(studentId)
      .populate('applications.programId generaldocs_threads.doc_thread_id')
      .populate(
        'applications.doc_modification_thread.doc_thread_id',
        'file_type updatedAt'
      );
    res.status(200).send({ success: true, data: student2 });
    await sendSetAsFinalGeneralFileForStudentEmail(
      {
        firstname: student.firstname,
        lastname: student.lastname,
        address: student.email
      },
      {
        editor_firstname: user.firstname,
        editor_lastname: user.lastname,
        uploaded_documentname: generaldocs_thread.doc_thread_id.file_type,
        uploaded_updatedAt: new Date(),
        isFinalVersion: generaldocs_thread.isFinalVersion
      }
    );

    const student3 = await Student.findById(studentId).populate(
      'agents',
      'firstname lastname email'
    );

    for (let i = 0; i < student.agents.length; i++) {
      await sendSetAsFinalGeneralFileForAgentEmail(
        {
          firstname: student3.agents[i].firstname,
          lastname: student3.agents[i].lastname,
          address: student3.agents[i].email
        },
        {
          student_firstname: student3.firstname,
          student_lastname: student3.lastname,
          editor_firstname: user.firstname,
          editor_lastname: user.lastname,
          uploaded_documentname: generaldocs_thread.doc_thread_id.file_type,
          uploaded_updatedAt: new Date(),
          isFinalVersion: generaldocs_thread.isFinalVersion
        }
      );
    }
  }
});

// () TODO email : notification
const deleteGeneralMessagesThread = asyncHandler(async (req, res) => {
  const {
    params: { messagesThreadId, studentId }
  } = req;

  const to_be_delete_thread = await Documentthread.findById(messagesThreadId);
  const student = await Student.findById(studentId);

  if (!to_be_delete_thread) {
    logger.error('deleteGeneralMessagesThread: Invalid message thread id');
    throw new ErrorResponse(400, 'Invalid message thread id');
  }
  if (!student) {
    logger.error('deleteGeneralMessagesThread: Invalid student id id');
    throw new ErrorResponse(400, 'Invalid student id id');
  }

  // Delete folder
  let directory = path.join(studentId, messagesThreadId);
  logger.info('Trying to delete message thread and folder');
  directory = directory.replace(/\\/g, '/');

  const listParams = {
    Bucket: AWS_S3_BUCKET_NAME,
    Prefix: directory
  };
  const listedObjects = await s3.listObjectsV2(listParams).promise();

  if (listedObjects.Contents.length > 0) {
    const deleteParams = {
      Bucket: AWS_S3_BUCKET_NAME,
      Delete: { Objects: [] }
    };

    listedObjects.Contents.forEach(({ Key }) => {
      deleteParams.Delete.Objects.push({ Key });
      logger.info('Deleting ', Key);
    });

    await s3.deleteObjects(deleteParams).promise();

    // if (listedObjects.IsTruncated) await emptyS3Directory(bucket, dir);
  }
  await Documentthread.findByIdAndDelete(messagesThreadId);
  await Student.findByIdAndUpdate(studentId, {
    $pull: {
      generaldocs_threads: { doc_thread_id: { _id: messagesThreadId } }
    }
  });

  const student2 = await Student.findById(studentId)
    .populate('applications.programId generaldocs_threads.doc_thread_id')
    .populate(
      'applications.doc_modification_thread.doc_thread_id',
      'file_type updatedAt'
    );
  res.status(200).send({ success: true, data: student2 });
});

// (-) TODO email : notification
const deleteProgramSpecificMessagesThread = asyncHandler(async (req, res) => {
  const {
    params: { messagesThreadId, program_id, studentId }
  } = req;

  const to_be_delete_thread = await Documentthread.findById(messagesThreadId);
  const student = await Student.findById(studentId);

  if (!to_be_delete_thread) {
    logger.error(
      'deleteProgramSpecificMessagesThread: Invalid message thread id!'
    );
    throw new ErrorResponse(400, 'Invalid message thread id');
  }

  if (!student) {
    logger.error('deleteProgramSpecificMessagesThread: Invalid student id!');
    throw new ErrorResponse(400, 'Invalid student id');
  }

  // Before delete the thread, please delete all of the files in the thread!!
  // Delete folder
  let directory = path.join(studentId, messagesThreadId);
  logger.info('Trying to delete message thread and folder');
  directory = directory.replace(/\\/g, '/');

  const listParams = {
    Bucket: AWS_S3_BUCKET_NAME,
    Prefix: directory
  };
  const listedObjects = await s3.listObjectsV2(listParams).promise();

  if (listedObjects.Contents.length > 0) {
    const deleteParams = {
      Bucket: AWS_S3_BUCKET_NAME,
      Delete: { Objects: [] }
    };

    listedObjects.Contents.forEach(({ Key }) => {
      deleteParams.Delete.Objects.push({ Key });
      logger.info('Deleting ', Key);
    });

    await s3.deleteObjects(deleteParams).promise();

    // if (listedObjects.IsTruncated) await emptyS3Directory(bucket, dir);
  }

  await Student.findOneAndUpdate(
    { _id: studentId, 'applications.programId': program_id },
    {
      $pull: {
        'applications.$.doc_modification_thread': {
          doc_thread_id: { _id: messagesThreadId }
        }
      }
    }
  );
  await Documentthread.findByIdAndDelete(messagesThreadId);

  const student2 = await Student.findById(studentId)
    .populate('applications.programId generaldocs_threads.doc_thread_id')
    .populate(
      'applications.doc_modification_thread.doc_thread_id',
      'file_type updatedAt'
    );
  res.status(200).send({ success: true, data: student2 });
});

// (-) TODO email : notification
const deleteAMessageInThread = asyncHandler(async (req, res) => {
  const {
    user,
    params: { messagesThreadId, messageId, studentId }
  } = req;

  const student = await Student.findById(studentId);
  if (!student) {
    logger.error('deleteAMessageInThread : Invalid student id');
    throw new ErrorResponse(400, 'Invalid student id');
  }

  const thread = await Documentthread.findById(messagesThreadId);
  if (!thread) {
    logger.error('deleteAMessageInThread : Invalid message thread id');
    throw new ErrorResponse(400, 'Invalid message thread id');
  }

  if (thread) {
    const deleteParams = {
      Bucket: AWS_S3_BUCKET_NAME,
      Delete: { Objects: [] }
    };
    const message = thread.messages.find((msg) => msg._id == messageId);
    message.file.forEach(({ path }) => {
      deleteParams.Delete.Objects.push({ Key: path });
      logger.info(path);
    });

    await s3.deleteObject(deleteParams).promise();
    // s3.deleteObject(options, (error, data) => {
    //   if (error) {
    //     console.log(err);
    //   } else {
    //    console.log("Successfully deleted file from bucket");
    //   }
    // });
    // TODO: To be test
    await Documentthread.findByIdAndUpdate(messagesThreadId, {
      $pull: {
        messages: { _id: messageId }
      }
    });
    // if (listedObjects.IsTruncated) await emptyS3Directory(bucket, dir);
  }

  const student2 = await Student.findById(studentId)
    .populate('applications.programId generaldocs_threads.doc_thread_id')
    .populate(
      'applications.doc_modification_thread.doc_thread_id',
      'file_type updatedAt'
    );
  res.status(200).send({ success: true, data: student2 });
});

module.exports = {
  getCVMLRLOverview,
  initGeneralMessagesThread,
  initApplicationMessagesThread,
  getMessages,
  getMessageFile,
  postMessages,
  SetStatusMessagesThread,
  deleteGeneralMessagesThread,
  deleteProgramSpecificMessagesThread,
  deleteAMessageInThread
};
