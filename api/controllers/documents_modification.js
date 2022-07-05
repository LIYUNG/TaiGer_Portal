const aws = require('aws-sdk');
const async = require('async');
const path = require('path');
const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const { Student } = require('../models/User');
const { Documentthread } = require('../models/Documentthread');

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
  if (user.role === 'Admin') {
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
  } else if (user.role === 'Agent') {
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
  } else if (user.role === 'Editor') {
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
  } else if (user.role === 'Student') {
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
    params: { studentId, document_catgory }
  } = req;
  const student = await Student.findById(studentId).populate(
    'generaldocs_threads.doc_thread_id'
  );

  if (!student) throw new ErrorResponse(400, 'Invalid student id');
  // TODO: what if same file_type and same student_id? (ex. ML for 2 programs)
  const doc_thread_existed = await Documentthread.find({
    student_id: studentId,
    file_type: document_catgory
  });

  if (doc_thread_existed.length > 0) {
    // TODO: should push the existing one to student
    throw new ErrorResponse(400, 'Document Thread already existed!');
    // const application = student.generaldocs_threads.find(
    //   ({ doc_thread_id }) => doc_thread_id._id == studentId
    // );

    // var temp;
    // temp = student.generaldocs_threads.create({
    //   doc_thread_id: doc_thread_existed._id,
    // });
    // temp.student_id = studentId;
    // student.generaldocs_threads.push(temp);
    // await student.save();
    // const student2 = await Student.findById(studentId)
    //   .populate("generaldocs_threads.doc_thread_id")
    //   .populate("applications.programId");
    // return res.status(200).send({ success: true, data: student2 });
  }
  const new_doc_thread = new Documentthread({
    student_id: studentId,
    file_type: document_catgory,
    program_id: null,
    updatedAt: new Date() // TODO
  });
  await new_doc_thread.save();
  const temp = student.generaldocs_threads.create({
    doc_thread_id: new_doc_thread._id
  });
  temp.student_id = studentId;
  student.generaldocs_threads.push(temp);
  await student.save();
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
    user,
    params: { studentId, program_id, document_catgory }
  } = req;

  const student = await Student.findById(studentId)
    .populate('applications.programId')
    .populate('students agents editors', 'firstname lastname email')
    .exec();

  if (!student) {
    throw new ErrorResponse(400, 'Invalid student id');
  }
  // TODO: what if same file_type and same student_id? (ex. ML for 2 programs)
  const doc_thread_existed = await Documentthread.find({
    student_id: studentId,
    file_type: document_catgory,
    program_id
  });

  if (doc_thread_existed.length > 0) {
    // TODO: should push the existing one to student
    throw new ErrorResponse(400, 'Document Thread already existed!');
    // const application = student.generaldocs_threads.find(
    //   ({ doc_thread_id }) => doc_thread_id._id == studentId
    // );

    // var temp;
    // temp = student.generaldocs_threads.create({
    //   doc_thread_id: doc_thread_existed._id,
    // });
    // temp.student_id = studentId;
    // student.generaldocs_threads.push(temp);
    // await student.save();
    // const student2 = await Student.findById(studentId)
    //   .populate("generaldocs_threads.doc_thread_id")
    //   .populate("applications.programId");
    // return res.status(200).send({ success: true, data: student2 });
  }

  const application = student.applications.find(
    ({ programId }) => programId._id == program_id
  );
  const idx = student.applications.findIndex(
    ({ programId }) => programId._id == program_id
  );
  if (!application) {
    throw new ErrorResponse(400, 'Invalid application id');
  }
  const student_input_doc = application.doc_modification_thread.find(
    (doc_thread_id) => doc_thread_id._id == doc_thread_existed._id
  );
  if (student_input_doc) {
    throw new ErrorResponse(400, 'Thread already existed in student database!');
  }

  const new_doc_thread = new Documentthread({
    student_id: studentId,
    file_type: document_catgory,
    program_id: program_id,
    updatedAt: new Date()
  });

  await new_doc_thread.save();
  let temp;
  temp = student.applications[idx].doc_modification_thread.create({
    doc_thread_id: new_doc_thread._id,
    createdAt: new Date()
  });
  temp.student_id = studentId;
  student.applications[idx].doc_modification_thread.push(temp);
  await student.save();

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
    throw new ErrorResponse(400, 'Invalid message thread id');
  }

  res.status(200).send({ success: true, data: document_thread });
});

const postMessages = asyncHandler(async (req, res) => {
  const {
    user,
    params: { messagesThreadId }
  } = req;
  const { message } = req.body;

  const document_thread = await Documentthread.findById(messagesThreadId);
  // console.log(JSON.parse(message));
  if (!document_thread)
    throw new ErrorResponse(400, 'Invalid message thread id');

  var newfile = [];
  // console.log(req.file);
  if (req.file) {
    newfile = [
      {
        name: req.file.key,
        path: path.join(req.file.metadata.path, req.file.key)
      }
    ];
  }

  // TODO: to save file when file attached
  const new_message = {
    user_id: user._id,
    message,
    createdAt: new Date(),
    file: newfile
  };
  document_thread.messages.push(new_message);
  await document_thread.save();
  const document_thread2 = await Documentthread.findById(
    messagesThreadId
  ).populate('student_id program_id messages.user_id');
  res.status(200).send({ success: true, data: document_thread2 });
});

// Download file in a message in a thread
const getMessageFile = asyncHandler(async (req, res) => {
  const {
    user,
    params: { messagesThreadId, messageId, fileId }
  } = req;

  const document_thread = await Documentthread.findById(messagesThreadId);
  if (!document_thread) throw new ErrorResponse(400, 'thread not found');

  if (
    user.role === 'Student' &&
    document_thread.student_id.toString() !== user._id.toString()
  ) {
    throw new ErrorResponse(400, 'Not authorized');
  }

  const message = document_thread.messages.find(
    (message) => message._id == messageId
  );
  if (!message) throw new ErrorResponse(400, 'message not found');

  const file = message.file.find((file) => file._id == fileId);
  if (!file) throw new ErrorResponse(400, 'file not found');

  let path_split = file.path.replace(/\\/g, '/');
  path_split = path_split.split('/');
  const fileKey = path_split[2];
  console.log('Trying to download message file', fileKey);
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
        console.log(error);
      }
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    });
});

const SetStatusMessagesThread = asyncHandler(async (req, res) => {
  const {
    params: { messagesThreadId, studentId }
  } = req;

  const document_thread = await Documentthread.findById(messagesThreadId);
  const student = await Student.findById(studentId);

  if (!document_thread) {
    throw new ErrorResponse(400, 'Invalid message thread id');
  }
  if (!student) throw new ErrorResponse(400, 'Invalid student id id');
  // TODO: before delete the thread, please delete all of the files in the thread!!
  await Documentthread.findByIdAndDelete(messagesThreadId);
  // await Student.findByIdAndUpdate(studentId, {
  //   $pull: {
  //     generaldocs_threads: { doc_thread_id: { _id: messagesThreadId } },
  //   },
  // });

  const student2 = await Student.findById(studentId)
    .populate('applications.programId generaldocs_threads.doc_thread_id')
    .populate(
      'applications.doc_modification_thread.doc_thread_id',
      'file_type updatedAt'
    );
  res.status(200).send({ success: true, data: student2 });
});

const deleteMessagesThread = asyncHandler(async (req, res) => {
  const {
    params: { messagesThreadId, studentId }
  } = req;

  const document_thread = await Documentthread.findById(messagesThreadId);
  const student = await Student.findById(studentId);

  if (!document_thread) {
    throw new ErrorResponse(400, 'Invalid message thread id');
  }
  if (!student) throw new ErrorResponse(400, 'Invalid student id id');
  // TODO: before delete the thread, please delete all of the files in the thread!!

  const to_be_delete_thread = await Documentthread.findById(messagesThreadId);
  if (!to_be_delete_thread) {
    throw new ErrorResponse(400, 'Invalid message thread id');
  }

  // Delete folder
  let directory = path.join(studentId, messagesThreadId);
  console.log('Trying to delete message thread and folder');
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
      console.log('Deleting ' + Key);
    });

    await s3.deleteObjects(deleteParams).promise();

    if (listedObjects.IsTruncated) await emptyS3Directory(bucket, dir);
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

const deleteProgramSpecificMessagesThread = asyncHandler(async (req, res) => {
  const {
    params: { messagesThreadId, program_id, studentId }
  } = req;

  const to_be_delete_thread = await Documentthread.findById(messagesThreadId);
  const student = await Student.findById(studentId);

  if (!to_be_delete_thread) {
    throw new ErrorResponse(400, 'Invalid message thread id');
  }
  if (!student) throw new ErrorResponse(400, 'Invalid student id id');

  // TODO: before delete the thread, please delete all of the files in the thread!!
  // Delete folder
  let directory = path.join(studentId, messagesThreadId);
  console.log('Trying to delete message thread and folder');
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
      console.log('Deleting ' + Key);
    });

    await s3.deleteObjects(deleteParams).promise();

    if (listedObjects.IsTruncated) await emptyS3Directory(bucket, dir);
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

const deleteAMessageInThread = asyncHandler(async (req, res) => {
  const {
    user,
    params: { messagesThreadId, messageId, studentId }
  } = req;

  const student = await Student.findById(studentId);
  if (!student) throw new ErrorResponse(400, 'Invalid student id id');

  const thread = await Documentthread.findById(messagesThreadId);
  if (!thread) throw new ErrorResponse(400, 'Invalid message thread id');

  if (thread) {
    const deleteParams = {
      Bucket: AWS_S3_BUCKET_NAME,
      Delete: { Objects: [] }
    };
    const message = thread.messages.find((message) => message._id == messageId);
    message.file.forEach(({ path }) => {
      deleteParams.Delete.Objects.push({ Key: path });
      console.log(path);
    });

    await s3.deleteObject(deleteParams).promise();
    // s3.deleteObject(options, (error, data) => {
    //   if (error) {
    //     console.log(err);
    //   } else {
    //     // console.log("Successfully deleted file from bucket");
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
  deleteMessagesThread,
  deleteProgramSpecificMessagesThread,
  deleteAMessageInThread
};
