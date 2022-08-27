const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const aws = require('aws-sdk');
const { asyncHandler } = require('../middlewares/error-handler');
const { Role, Student, User } = require('../models/User');
const { UPLOAD_PATH } = require('../config');
const { ErrorResponse } = require('../common/errors');
const { DocumentStatus } = require('../constants');
const {
  sendUploadedProgramSpecificFilesEmail,
  sendEditorOutputProgramSpecificFilesEmailToStudent,
  sendEditorOutputProgramSpecificFilesEmailToAgent,
  sendUploadedProfileFilesEmail,
  sendAgentUploadedProfileFilesForStudentEmail,
  sendUploadedProfileFilesRemindForAgentEmail,
  sendUploadedProgramSpecificFilesRemindForEditorEmail,
  sendUploadedProgramSpecificFilesRemindForAgentEmail,
  sendChangedProfileFileStatusEmail,
  sendSetAsFinalProgramSpecificFileForStudentEmail,
  sendSetAsFinalProgramSpecificFileForAgentEmail,
  sendStudentFeedbackProgramSpecificFileForEditorEmail
  // sendSomeReminderEmail,
} = require('../services/email');
const {
  AWS_S3_ACCESS_KEY_ID,
  AWS_S3_ACCESS_KEY,
  AWS_S3_BUCKET_NAME
} = require('../config');
const logger = require('../services/logger');

const s3 = new aws.S3({
  accessKeyId: AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: AWS_S3_ACCESS_KEY
});

const getMyfiles = asyncHandler(async (req, res) => {
  const { user } = req;
  // console.log('getMyfiles API');
  const student = await User.findById(user._id);
  // if (!student) throw new ErrorResponse(400, "Invalid student id");

  // await student.save();
  return res.status(201).send({ success: true, data: student });
});

const saveProfileFilePath = asyncHandler(async (req, res) => {
  const {
    user,
    params: { studentId, category }
  } = req;
  // retrieve studentId differently depend on if student or Admin/Agent uploading the file
  const student =
    user.role === Role.Student
      ? user
      : await Student.findById(studentId).populate('applications.programId');
  if (!student) {
    logger.error('saveProfileFilePath: Invalid student id!');
    throw new ErrorResponse(400, 'Invalid student id');
  }
  // console.log(student);
  let document = student.profile.find(({ name }) => name === category);
  if (!document) {
    document = student.profile.create({ name: category });
    document.status = DocumentStatus.Uploaded;
    document.required = true;
    document.updatedAt = new Date();
    // console.log(req.file);
    document.path = path.join(req.file.metadata.path, req.file.key);
    // console.log(document.path);
    student.profile.push(document);
    await student.save();
    res.status(201).send({ success: true, data: student });
    if (user.role == Role.Student) {
      await sendUploadedProfileFilesEmail(
        {
          firstname: student.firstname,
          lastname: student.lastname,
          address: student.email
        },
        {
          uploaded_documentname: document.name.replace(/_/g, ' '),
          uploaded_updatedAt: document.updatedAt
        }
      );

      for (let i = 0; i < student.agents.length; i++) {
        // console.log(i);
        await sendUploadedProfileFilesRemindForAgentEmail(
          {
            firstname: student.agents[i].firstname,
            lastname: student.agents[i].lastname,
            address: student.agents[i].email
          },
          {
            student_firstname: student.firstname,
            student_lastname: student.lastname,
            uploaded_documentname: document.name.replace(/_/g, ' '),
            uploaded_updatedAt: document.updatedAt
          }
        );
      }
    } else {
      await sendAgentUploadedProfileFilesForStudentEmail(
        {
          firstname: student.firstname,
          lastname: student.lastname,
          address: student.email
        },
        {
          agent_firstname: user.firstname,
          agent_lastname: user.lastname,
          uploaded_documentname: document.name.replace(/_/g, ' '),
          uploaded_updatedAt: document.updatedAt
        }
      );
    }
    return;
  }
  document.status = DocumentStatus.Uploaded;
  document.required = true;
  document.updatedAt = new Date();
  // console.log(req.file);
  document.path = path.join(req.file.metadata.path, req.file.key);
  // console.log(document.path);
  await student.save();

  // retrieve studentId differently depend on if student or Admin/Agent uploading the file
  res.status(201).send({ success: true, data: student });
  if (user.role == Role.Student) {
    await sendUploadedProfileFilesEmail(
      {
        firstname: student.firstname,
        lastname: student.lastname,
        address: student.email
      },
      {
        uploaded_documentname: document.name.replace(/_/g, ' '),
        uploaded_updatedAt: document.updatedAt
      }
    );
    // Reminder for Agent:
    for (let i = 0; i < student.agents.length; i++) {
      // console.log(i);
      await sendUploadedProfileFilesRemindForAgentEmail(
        {
          firstname: student.agents[i].firstname,
          lastname: student.agents[i].lastname,
          address: student.agents[i].email
        },
        {
          student_firstname: student.firstname,
          student_lastname: student.lastname,
          uploaded_documentname: document.name.replace(/_/g, ' '),
          uploaded_updatedAt: document.updatedAt
        }
      );
    }
  } else {
    await sendAgentUploadedProfileFilesForStudentEmail(
      {
        firstname: student.firstname,
        lastname: student.lastname,
        address: student.email
      },
      {
        agent_firstname: user.firstname,
        agent_lastname: user.lastname,
        uploaded_documentname: document.name.replace(/_/g, ' '),
        uploaded_updatedAt: document.updatedAt
      }
    );
  }
});

const downloadProfileFile = asyncHandler(async (req, res, next) => {
  const {
    user,
    params: { studentId, category }
  } = req;

  // AWS S3
  // download the file via aws s3 here
  const student =
    user.role == Role.Student ? user : await Student.findById(studentId);
  if (!student) {
    logger.error('downloadProfileFile: Invalid student id!');
    throw new ErrorResponse(400, 'Invalid student id');
  }

  const document = student.profile.find(({ name }) => name === category);
  if (!document) {
    logger.error('downloadProfileFile: Invalid document name!');
    throw new ErrorResponse(400, 'Invalid document name');
  }
  if (!document.path) {
    logger.error('downloadProfileFile: File not uploaded yet!');
    throw new ErrorResponse(400, 'File not uploaded yet');
  }

  // var fileKey = path.join(UPLOAD_PATH, document.path);
  let document_split = document.path.replace(/\\/g, '/');
  document_split = document_split.split('/');
  const fileKey = document_split[1];
  let directory = document_split[0];
  console.log('Trying to download profile file', fileKey);
  directory = path.join(AWS_S3_BUCKET_NAME, directory);
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
      let fileStream = s3.getObject(options).createReadStream();
      fileStream.pipe(res);
    })
    .catch((error) => {
      if (error.statusCode === 404) {
        // Catching NoSuchKey
        logger.error('downloadProfileFile: ', error);
      }
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    });
});

const downloadTemplateFile = asyncHandler(async (req, res, next) => {
  const {
    params: { category }
  } = req;
  const filePath = path.join(UPLOAD_PATH, 'TaiGer_Template', category);
  // TODO: S3 bucket
  // FIXME: clear the filePath for consistency?
  if (!fs.existsSync(filePath))
    throw new ErrorResponse(400, 'File does not exist');

  res.status(200).download(filePath, (err) => {
    if (err) throw new ErrorResponse(500, 'Error occurs while downloading');
  });
});

const downloadGeneralFile = asyncHandler(async (req, res, next) => {
  const {
    params: { studentId, docName, whoupdate }
  } = req;
  try {
    // retrieve studentId differently depend on if student or Admin/Agent uploading the file
    const student = await Student.findById(studentId).populate(
      'applications.programId'
    );
    if (!student) {
      logger.error('downloadGeneralFile: Invalid student id!');
      throw new ErrorResponse(400, 'Invalid student id');
    }
    // TODO: flag for differenciate students input or edited file
    let document;
    if (whoupdate === 'Student') {
      document = student.generaldocs.studentinputs.find(
        ({ name }) => name === docName
      );
    } else {
      document = student.generaldocs.editoroutputs.find(
        ({ name }) => name === docName
      );
    }
    if (!document) {
      logger.error('downloadGeneralFile: Invalid document name!');
      throw new ErrorResponse(400, 'Invalid document name');
    }
    if (!document.path) {
      logger.error('downloadGeneralFile: File not uploaded yet!');
      throw new ErrorResponse(400, 'File not uploaded yet');
    }
    // console.log(document);
    // const filePath = path.join(UPLOAD_PATH, document.path);
    // // const filePath = document.path;
    // // FIXME: clear the filePath for consistency?
    // if (!fs.existsSync(filePath))
    //   throw new ErrorResponse(400, "File does not exist");
    // console.log(filePath);
    // res.status(200).download(filePath, (err) => {
    //   if (err) throw new ErrorResponse(500, "Error occurs while downloading");
    // });
    let document_split = document.path.replace(/\\/g, '/');
    document_split = document_split.split('/');
    let str_len = document_split.length;
    let fileKey = document_split[str_len - 1];
    let directory = path.join(document_split[0], document_split[1]);
    console.log('Trying to download file', fileKey);
    directory = path.join(AWS_S3_BUCKET_NAME, directory);
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
        let fileStream = s3.getObject(options).createReadStream();
        fileStream.pipe(res);
      })
      .catch((error) => {
        if (error.statusCode === 404) {
          // Catching NoSuchKey
        }
        return res
          .status(error.statusCode)
          .json({ success: false, message: error.message });
      });

    // res.attachment(fileKey);
    // var fileStream = s3.getObject(options).createReadStream();
    // fileStream.pipe(res);
  } catch (err) {
    logger.error('downloadGeneralFile: ', err);
    return new ErrorResponse(400, 'Strange error!');
  }
});

const updateProfileDocumentStatus = asyncHandler(async (req, res, next) => {
  const { studentId, category } = req.params;
  const { status, feedback } = req.body;

  if (!Object.values(DocumentStatus).includes(status)) {
    throw new ErrorResponse(400, 'Invalid document status');
  }

  const student = await Student.findOne({
    _id: studentId
  });
  if (!student) {
    logger.error(
      'updateProfileDocumentStatus: Invalid student Id or application Id'
    );
    throw new ErrorResponse(400, 'Invalid student Id or application Id');
  }
  var document = student.profile.find(({ name }) => name === category);
  try {
    if (!document) {
      document = student.profile.create({ name: category });
      document.status = DocumentStatus.NotNeeded;
      document.feedback = feedback;
      document.required = true;
      document.updatedAt = new Date();
      document.path = '';
      student.profile.push(document);
      await student.save();
      return res.status(201).send({ success: true, data: student });
    }
  } catch (err) {
    logger.error('updateProfileDocumentStatus: ', err);
  }
  // TODO: left reject image
  if (status == DocumentStatus.Rejected) {
    document.feedback = feedback;
  }
  if (status == DocumentStatus.Accepted) {
    document.feedback = '';
  }
  // TODO: validate status, ex: can't be accepted if document.path is empty

  document.status = status;
  document.updatedAt = new Date();

  await student.save();
  res.status(201).send({ success: true, data: student });
  // Reminder for Student:
  await sendChangedProfileFileStatusEmail(
    {
      firstname: student.firstname,
      lastname: student.lastname,
      address: student.email
    },
    {
      message: feedback,
      status,
      category: category.replace(/_/g, ' ')
    }
  );
});

const UpdateStudentApplications = asyncHandler(async (req, res, next) => {
  const {
    params: { studentId },
    body: { applications }
  } = req;
  // retrieve studentId differently depend on if student or Admin/Agent uploading the file
  const student = await Student.findById(studentId).exec();

  if (!student) {
    logger.error('UpdateStudentApplications: Invalid student id');
    throw new ErrorResponse(400, 'Invalid student id');
  }

  for (let i = 0; i < applications.length; i += 1) {
    const application = student.applications.find(
      (app) => app._id == applications[i]._id
    );
    application.decided = applications[i].decided;
    application.closed = applications[i].closed;
    application.admission = applications[i].admission;
  }
  await student.save();
  // await Student.findByIdAndUpdate(
  //   studentId,
  //   {
  //     $set: { applications }
  //     // applications // TODO: how to update sub schema partially
  //   },
  //   { upsert: true }
  // );
  const student_updated = await Student.findById(studentId)
    .populate('applications.programId')
    .populate('agents editors', 'firstname lastname email')
    .lean();
  res.status(201).send({ success: true, data: student_updated });
  // TODO: feedback added email
});

const SetAsFinalProgramSpecificFile = asyncHandler(async (req, res, next) => {
  const {
    user,
    params: { studentId, applicationId, docName, whoupdate }
  } = req;

  if (user.role === 'Student') {
    // if (studentId !== user._id.toString()) {
    logger.error(
      'SetAsFinalProgramSpecificFile: Invalid operation for student'
    );
    throw new ErrorResponse(401, 'Invalid operation for student');
    // }
  }

  // retrieve studentId differently depend on if student or Admin/Agent uploading the file
  const student = await Student.findById(studentId)
    .populate('applications.programId')
    .populate('students agents editors', 'firstname lastname email')
    .exec();

  if (!student) {
    logger.error('SetAsFinalProgramSpecificFile: Invalid student id');
    throw new ErrorResponse(400, 'Invalid student id');
  }

  const application = student.applications.find(
    ({ programId }) => programId._id == applicationId
  );

  if (!application) {
    logger.error('SetAsFinalProgramSpecificFile: Invalid application id');
    throw new ErrorResponse(400, 'Invalid application id');
  }
  let editor_output_doc;
  let student_input_doc;
  let SetFinal_Flag = 0;
  let doc_name = '';
  let doc_updateAt = '';
  if (whoupdate == Role.Student) {
    // throw new ErrorResponse(400, "Can only mark by editor!");
    student_input_doc = application.student_inputs.find(
      ({ name }) => name === docName
    );
    if (!student_input_doc) {
      logger.error('SetAsFinalProgramSpecificFile: Document not existed!');
      throw new ErrorResponse(400, 'Document not existed!');
    }
    if (
      student_input_doc.isFinalVersion === undefined ||
      student_input_doc.isFinalVersion === false
    ) {
      student_input_doc.isFinalVersion = true;
      SetFinal_Flag = 1;
      doc_name = student_input_doc.name;
      doc_updateAt = student_input_doc.updatedAt;
    } else {
      student_input_doc.isFinalVersion = false;
      SetFinal_Flag = 2;
    }
    student_input_doc.updatedAt = new Date();
    // TODO: set flag student document(filetype, feedback) isReceivedFeedback
    await student.save();
    res.status(201).send({ success: true, data: student });
  } else {
    editor_output_doc = application.documents.find(
      ({ name }) => name === docName
    );
    if (!editor_output_doc) {
      logger.error('SetAsFinalProgramSpecificFile: Document not existed!');
      throw new ErrorResponse(400, 'Document not existed!');
    }
    if (
      editor_output_doc.isFinalVersion === undefined ||
      editor_output_doc.isFinalVersion === false
    ) {
      editor_output_doc.isFinalVersion = true;
      SetFinal_Flag = 1;
      doc_name = editor_output_doc.name;
      doc_updateAt = editor_output_doc.updatedAt;
    } else {
      editor_output_doc.isFinalVersion = false;
      SetFinal_Flag = 2;
    }
    editor_output_doc.updatedAt = new Date();
    // TODO: set flag student document(filetype, feedback) isReceivedFeedback
    await student.save();
    res.status(201).send({ success: true, data: student });
    //TODO: feedback added email
  }

  if (SetFinal_Flag === 1) {
    await sendSetAsFinalProgramSpecificFileForStudentEmail(
      {
        firstname: student.firstname,
        lastname: student.lastname,
        address: student.email
      },
      {
        editor_firstname: user.firstname,
        editor_lastname: user.lastname,
        uploaded_documentname: doc_name,
        uploaded_updatedAt: doc_updateAt
      }
    );
    // TODO: Inform Agent also
  }
});

// FIXME: Deprecated, but look at syntax for threads deletion.
const deleteProgramSpecificFile = asyncHandler(async (req, res, next) => {
  const {
    user,
    params: { studentId, applicationId, docName, whoupdate }
  } = req;

  if (user.role === 'Student') {
    if (studentId !== user._id.toString()) {
      logger.error('deleteProgramSpecificFile: Invalid operation for student');
      throw new ErrorResponse(401, 'Invalid operation for student');
    }
  }
  // retrieve studentId differently depend on if student or Admin/Agent uploading the file
  let student = await Student.findById(studentId).populate(
    'applications.programId'
  );
  if (!student) {
    logger.error('deleteProgramSpecificFile: Invalid student id');
    throw new ErrorResponse(400, 'Invalid student id');
  }

  const application = student.applications.find(
    ({ programId }) => programId._id == applicationId
  );
  if (!application) {
    logger.error('deleteProgramSpecificFile: Invalid application id');
    throw new ErrorResponse(400, 'Invalid application id');
  }

  const idx = student.applications.findIndex(
    ({ programId }) => programId._id == applicationId
  );

  let document;
  let student_input;
  if (whoupdate === 'Editor') {
    document = application.documents.find(({ name }) => name === docName);
    if (!document) {
      logger.error('deleteProgramSpecificFile: docName not existed');
      throw new ErrorResponse(400, 'docName not existed');
    }
    if (document.path !== '') {
      let document_split = document.path.replace(/\\/g, '/');
      document_split = document_split.split('/');
      const fileKey = document_split[2];
      let directory = path.join(document_split[0], document_split[1]);
      logger.info('Trying to delete file', fileKey);
      directory = path.join(AWS_S3_BUCKET_NAME, directory);
      directory = directory.replace(/\\/g, '/');

      const options = {
        Key: fileKey,
        Bucket: directory
      };

      s3.deleteObject(options, (error, data) => {
        if (error) {
          logger.error('deleteProgramSpecificFile: docName not existed', error);
        } else {
          // console.log("Successfully deleted file from bucket");
        }
      });
    }
    await Student.findOneAndUpdate(
      { _id: studentId, 'applications._id': application._id },
      {
        $pull: {
          'applications.$.documents': { name: docName }
        }
      }
    );
  } else {
    student_input = application.student_inputs.find(
      ({ name }) => name === docName
    );
    if (!student_input) {
      throw new ErrorResponse(400, 'docName not existed');
    }
    if (student_input.path !== '') {
      // const filePath = path.join(UPLOAD_PATH, student_input.path);
      // const filePath = student_input.path; // tmp\files_development\studentId\\<bachelorTranscript_>
      // console.log(filePath);
      // if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      let document_split = student_input.path.replace(/\\/g, '/');
      document_split = document_split.split('/');
      let fileKey = document_split[2];
      let directory = path.join(document_split[0], document_split[1]);
      logger.info('Trying to delete file', fileKey);
      directory = path.join(AWS_S3_BUCKET_NAME, directory);
      directory = directory.replace(/\\/g, '/');

      const options = {
        Key: fileKey,
        Bucket: directory
      };

      s3.deleteObject(options, (error, data) => {
        if (error) {
          logger.error('deleteProgramSpecificFile: docName not existed', error);
        } else {
          // console.log("Successfully deleted file from bucket");
        }
      });
    }
    await Student.findOneAndUpdate(
      { _id: studentId, 'applications._id': application._id },
      {
        $pull: {
          'applications.$.student_inputs': { name: docName }
        }
      }
    );
  }
  student = await Student.findById(studentId).populate(
    'applications.programId'
  );
  await student.save();
  return res.status(200).send({ success: true, data: student });
});
const SetAsFinalGeneralFile = asyncHandler(async (req, res, next) => {
  const {
    user,
    params: { studentId, docName, whoupdate }
  } = req;

  if (user.role === 'Student') {
    // if (studentId !== user._id.toString()) {
    logger.error('Invalid operation for student');
    throw new ErrorResponse(401, 'Invalid operation for student');
    // }
  }

  // retrieve studentId differently depend on if student or Admin/Agent uploading the file
  const student = await Student.findById(studentId)
    .populate('applications.programId')
    .populate('students agents editors', 'firstname lastname email')
    .exec();

  if (!student) {
    logger.error('Invalid student id');
    throw new ErrorResponse(400, 'Invalid student id');
  }
  let editor_output_doc;
  let student_input_doc;
  let SetFinal_Flag = 0;
  let doc_name = '';
  let doc_updateAt = '';
  if (whoupdate == Role.Student) {
    // throw new ErrorResponse(400, "Can only marked by editor");
    student_input_doc = student.generaldocs.studentinputs.find(
      ({ name }) => name === docName
    );
    if (!student_input_doc) {
      logger.error('Document not existed!');
      throw new ErrorResponse(400, 'Document not existed!');
    }
    if (
      student_input_doc.isFinalVersion === undefined ||
      student_input_doc.isFinalVersion === false
    ) {
      student_input_doc.isFinalVersion = true;
      SetFinal_Flag = 1;
      doc_name = student_input_doc.name;
      doc_updateAt = student_input_doc.updatedAt;
    } else {
      student_input_doc.isFinalVersion = false;
      SetFinal_Flag = 2;
    }
    student_input_doc.updatedAt = new Date();
    await student.save();
    res.status(201).send({ success: true, data: student });
    // TODO: feedback added email
  } else {
    editor_output_doc = student.generaldocs.editoroutputs.find(
      ({ name }) => name === docName
    );
    if (!editor_output_doc) {
      logger.error('Document not existed!');
      throw new ErrorResponse(400, 'Document not existed!');
    }
    if (
      editor_output_doc.isFinalVersion === undefined ||
      editor_output_doc.isFinalVersion === false
    ) {
      editor_output_doc.isFinalVersion = true;
      SetFinal_Flag = 1;
      doc_name = editor_output_doc.name;
      doc_updateAt = editor_output_doc.updatedAt;
    } else {
      editor_output_doc.isFinalVersion = false;
      SetFinal_Flag = 2;
    }
    editor_output_doc.updatedAt = new Date();
    await student.save();
    res.status(201).send({ success: true, data: student });
    // TODO: feedback added email
  }

  if (SetFinal_Flag === 1) {
    // TODO: feedback added email
    await sendSetAsFinalProgramSpecificFileForStudentEmail(
      {
        firstname: student.firstname,
        lastname: student.lastname,
        address: student.email
      },
      {
        editor_firstname: user.firstname,
        editor_lastname: user.lastname,
        uploaded_documentname: doc_name,
        uploaded_updatedAt: doc_updateAt
      }
    );
    for (let i = 0; i < student.agents.length; i++) {
      await sendSetAsFinalProgramSpecificFileForAgentEmail(
        {
          firstname: student.agents[i].firstname,
          lastname: student.agents[i].lastname,
          address: student.agents[i].email
        },
        {
          student_firstname: student.firstname,
          student_lastname: student.lastname,
          editor_firstname: user.firstname,
          editor_lastname: user.lastname,
          uploaded_documentname: doc_name,
          uploaded_updatedAt: doc_updateAt
        }
      );
    }
  }
});

const deleteGeneralFile = asyncHandler(async (req, res, next) => {
  const {
    user,
    params: { studentId, docName, whoupdate }
  } = req;

  if (user.role === 'Student') {
    if (studentId !== user._id.toString()) {
      logger.error('deleteGeneralFile: Invalid operation for student');
      throw new ErrorResponse(401, 'Invalid operation for student');
    }
  }

  // retrieve studentId differently depend on if student or Admin/Agent uploading the file
  let student = await Student.findById(studentId).populate(
    'applications.programId'
  );
  if (!student) {
    logger.error('deleteGeneralFile: Invalid student id');
    throw new ErrorResponse(400, 'Invalid student id');
  }

  let document;
  let student_input;
  try {
    if (whoupdate === 'Editor') {
      document = student.generaldocs.editoroutputs.find(
        ({ name }) => name === docName
      );

      if (!document) {
        logger.error('deleteGeneralFile: Document not existed');
        throw new ErrorResponse(400, 'Document not existed');
      }
      if (document.path !== '') {
        // const filePath = path.join(UPLOAD_PATH, document.path);
        // const filePath = document.path; //tmp\files_development\studentId\\<bachelorTranscript_>
        // console.log(filePath);
        // if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        let document_split = document.path.replace(/\\/g, '/');
        document_split = document_split.split('/');
        const fileKey = document_split[2];
        let directory = path.join(document_split[0], document_split[1]);
        logger.info('Trying to delete file', fileKey);
        directory = path.join(AWS_S3_BUCKET_NAME, directory);
        directory = directory.replace(/\\/g, '/');

        const options = {
          Key: fileKey,
          Bucket: directory
        };

        s3.deleteObject(options, (error, data) => {
          if (error) {
            logger.error('deleteGeneralFile: ', error);
          } else {
            // console.log("Successfully deleted file from bucket");
          }
        });
      }
      await Student.findOneAndUpdate(
        { _id: studentId },
        {
          $pull: {
            'generaldocs.editoroutputs': { name: docName }
          }
        }
      );
    } else {
      student_input = student.generaldocs.studentinputs.find(
        ({ name }) => name === docName
      );

      if (!student_input) {
        logger.error('deleteGeneralFile: docName not existed');
        throw new ErrorResponse(400, 'docName not existed');
      }
      if (student_input.path !== '') {
        // const filePath = path.join(UPLOAD_PATH, student_input.path);
        // // const filePath = student_input.path; //tmp\files_development\studentId\\<bachelorTranscript_>
        // console.log(filePath);
        // if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        let document_split = student_input.path.replace(/\\/g, '/');
        document_split = document_split.split('/');
        const fileKey = document_split[2];
        let directory = path.join(document_split[0], document_split[1]);
        logger.info('Trying to delete file', fileKey);
        directory = path.join(AWS_S3_BUCKET_NAME, directory);
        directory = directory.replace(/\\/g, '/');

        const options = {
          Key: fileKey,
          Bucket: directory
        };

        s3.deleteObject(options, (error, data) => {
          if (error) {
            logger.error(error);
            //   console.log(err);
          } else {
            //   console.log("Successfully deleted file from bucket");
          }
        });
      }
      await Student.findOneAndUpdate(
        { _id: studentId },
        {
          $pull: {
            'generaldocs.studentinputs': { name: docName }
          }
        }
      );
    }
  } catch (err) {
    console.log(err);
  }
  student = await Student.findById(studentId).populate(
    'applications.programId'
  );
  await student.save();
  return res.status(200).send({ success: true, data: student });
});

const deleteProfileFile = asyncHandler(async (req, res, next) => {
  const { studentId, category } = req.params;
  const { user } = req;
  if (user.role === 'Student') {
    if (studentId !== user._id.toString()) {
      throw new ErrorResponse(401, 'Invalid operation for student');
    }
  }

  const student = await Student.findOne({
    _id: studentId
  });

  if (!student) {
    throw new ErrorResponse(400, 'Invalid student Id or application Id');
  }

  const document = student.profile.find(({ name }) => name === category);
  // console.log(document);
  if (!document) throw new ErrorResponse(400, 'Invalid document name');
  if (!document.path) throw new ErrorResponse(400, 'File not exist');

  // const filePath = path.join(UPLOAD_PATH, document.path);
  // const filePath = document.path; //tmp\files_development\studentId\\<bachelorTranscript_>
  // console.log(filePath);
  // if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  let document_split = document.path.replace(/\\/g, '/');
  document_split = document_split.split('/');
  const fileKey = document_split[1];
  let directory = document_split[0];
  logger.info('Trying to delete file', fileKey);
  directory = path.join(AWS_S3_BUCKET_NAME, directory);
  directory = directory.replace(/\\/g, '/');

  const options = {
    Key: fileKey,
    Bucket: directory
  };
  try {
    s3.deleteObject(options, (error, data) => {
      if (error) {
        console.log(err);
      } else {
        // console.log("Successfully deleted file from bucket");
        // console.log(data);
        document.status = DocumentStatus.Missing;
        document.path = '';
        document.updatedAt = new Date();

        student.save();
        res.status(200).send({ success: true, data: document });
      }
    });
  } catch (err) {
    if (err) throw new ErrorResponse(500, 'Error occurs while deleting');
  }

  // await Student.findByIdAndUpdate(studentId, {
  //   $pull: { profile: document._id },
  // });
});

const processTranscript = asyncHandler(async (req, res, next) => {
  const {
    params: { category, studentId }
  } = req;
  const filename = req.file.key; // key is updated file name
  let filePath = path.join(req.file.metadata.path, req.file.key);
  console.log(
    path.join(
      __dirname,
      '..',
      'python',
      'TaiGer_Transcript-Program_Comparer',
      'main.py'
    )
  );
  console.log(filePath);
  // FIXME: better pass output filepath as argument to python script instead of hard code value
  const output = `analyzed_${filename}`;
  const output_filePath = path.join(req.file.metadata.path, 'output', output);
  const python = spawn('python', [
    path.join(
      __dirname,
      '..',
      'python',
      'TaiGer_Transcript-Program_Comparer',
      'main.py'
    ),
    filePath,
    category
  ]);

  await User.findByIdAndUpdate(
    studentId,
    {
      'taigerai.input.name': filename,
      'taigerai.input.path': filePath,
      'taigerai.input.status': 'uploaded',
      'taigerai.output.name': output,
      'taigerai.output.path': output_filePath,
      'taigerai.output.status': 'uploaded'
      // $push: {
      //   taigerai: updatedPathAndName,
      // },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  const student = await User.findById(studentId);
  // const student = await Student.findById(studentId);
  // student.taigerai.input.name = filePath;
  // student.taigerai.input.path = req.file.path.replace(UPLOAD_PATH, "");
  // student.taigerai.input.status = "uploaded";
  // student.taigerai.output.name = output;
  // student.taigerai.output.path = path.join(`${student._id}`, "output", output);
  // student.taigerai.output.status = "uploaded";
  // await student.save();
  python.on('close', (code) => {
    if (code === 0) {
      return res.status(200).send({ success: true, data: student });
    }

    next(
      new ErrorResponse(
        500,
        'Error occurs while trying to produce analyzed report'
      )
    );
  });
});

// FIXME: refactor this
// Download original transcript excel
const downloadXLSX = asyncHandler(async (req, res, next) => {
  const {
    user,
    params: { studentId }
  } = req;

  let student;
  if (user.role === 'Student' || user.role === 'Guest') {
    student = await Student.findById(user._id);
  } else {
    student = await Student.findById(studentId);
  }
  if (!student) {
    logger.error('downloadXLSX: Invalid student id');
    throw new ErrorResponse(400, 'Invalid student id');
  }

  const input_transcript_excel = student.taigerai.input;
  if (!input_transcript_excel) {
    logger.error('downloadXLSX: Invalid input_transcript_excel name');
    throw new ErrorResponse(400, 'Invalid input_transcript_excel name');
  }
  if (!input_transcript_excel.path) {
    logger.error('downloadXLSX: File not uploaded yet');
    throw new ErrorResponse(400, 'File not uploaded yet');
  }

  // var fileKey = path.join(UPLOAD_PATH, document.path);
  let input_transcript_excel_split = input_transcript_excel.path.replace(
    /\\/g,
    '/'
  );
  input_transcript_excel_split = input_transcript_excel_split.split('/');
  const fileKey = input_transcript_excel_split[1];
  let directory = input_transcript_excel_split[0];
  logger.info('Trying to download transcript excel file', fileKey);
  directory = path.join(AWS_S3_BUCKET_NAME, directory);
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
        logger.error('downloadXLSX: ', error);
      }
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    });
});

const getMyAcademicBackground = asyncHandler(async (req, res, next) => {
  const { user: student } = req;
  const { _id } = student;
  const me = await User.findById(_id);
  if (me.academic_background === undefined) me.academic_background = {};
  await me.save();
  res.status(200).send({ success: true, data: me.academic_background });
});

const updateAcademicBackground = asyncHandler(async (req, res, next) => {
  const {
    user: student,
    body: { university }
  } = req;
  const { firstname, lastname, _id } = student;
  university['updatedAt'] = new Date();
  await User.findByIdAndUpdate(
    _id,
    {
      'academic_background.university': university
      // $addToSet: {
      //   academic_background: { university: university },
      // },
    },
    { upsert: true, new: true }
  );
  res.status(200).send({ success: true, data: university });
});

const updateLanguageSkill = asyncHandler(async (req, res, next) => {
  const {
    user: student,
    body: { language }
  } = req;
  const { _id } = student;
  language['updatedAt'] = new Date();
  await User.findByIdAndUpdate(
    _id,
    {
      'academic_background.language': language
      // $set: {
      //   "academic_background.language": language,
      // },
    },
    { upsert: true, new: true }
  );
  const updatedStudent = await User.findById(_id);
  res
    .status(200)
    .send({ success: true, data: updatedStudent.academic_background.language });
});

const updatePersonalData = asyncHandler(async (req, res, next) => {
  const {
    user,
    body: { personaldata }
  } = req;
  const { _id } = user;
  await User.findByIdAndUpdate(
    _id,
    {
      firstname: personaldata.firstname,
      lastname: personaldata.lastname
    },
    { upsert: true, new: true }
  );
  const updatedStudent = await User.findById(_id);
  res.status(200).send({
    success: true,
    data: {
      firstname: updatedStudent.firstname,
      lastname: updatedStudent.lastname
    }
  });
});

const updateCredentials = asyncHandler(async (req, res, next) => {
  const {
    user,
    body: { credentials }
  } = req;
  const user_me = await User.findOne({ _id: user._id });
  if (!user_me) {
    throw new ErrorResponse(400, 'Invalid user');
  }

  user_me.password = credentials.new_password;
  await user_me.save();
  // const updatedStudent = await User.findById(_id);
  res.status(200).send({
    success: true
    // data: {
    //   firstname: updatedStudent.firstname,
    //   lastname: updatedStudent.lastname
    // }
  });
});

const PostMessageInThread = asyncHandler(async (req, res) => {
  const {
    user,
    params: { studentId, applicationId, fileCategory }
  } = req;

  // retrieve studentId differently depend on if student or Admin/Agent uploading the file
  const student = await Student.findById(studentId)
    .populate('applications.programId')
    .populate('students agents editors', 'firstname lastname email')
    .exec();

  if (!student) throw new ErrorResponse(400, 'Invalid student id');
  // console.log(student);
  const application = student.applications.find(
    ({ programId }) => programId._id == applicationId
  );
  const idx = student.applications.findIndex(
    ({ programId }) => programId._id == applicationId
  );
  if (!application) throw new ErrorResponse(400, 'Invalid application id');

  let student_input_doc;
  let editor_output_doc;
  if (user.role === Role.Student) {
    student_input_doc = application.student_inputs.find(
      ({ name }) => name === req.file.key
    );
    if (student_input_doc) {
      throw new ErrorResponse(400, 'Document already existed!');
    }
    student_input_doc = application.student_inputs.create({
      name: req.file.key
    });
    student_input_doc.status = DocumentStatus.Uploaded;
    student_input_doc.path = path.join(req.file.metadata.path, req.file.key);
    student_input_doc.required = true;
    student_input_doc.updatedAt = new Date();
    student.applications[idx].student_inputs.push(student_input_doc);

    // TODO: set flag editors document(filetype) isReceivedFeedback
    await student.save();
    res.status(201).send({ success: true, data: student });
    // TODO: Inform editor themselves as well?
  } else {
    editor_output_doc = application.documents.find(
      ({ name }) => name === req.file.key
    );
    if (editor_output_doc) {
      throw new ErrorResponse(400, 'Document already existed!');
    }
    editor_output_doc = application.documents.create({
      name: req.file.key
    });
    editor_output_doc.status = DocumentStatus.Uploaded;
    // console.log(req.file);
    editor_output_doc.path = path.join(req.file.metadata.path, req.file.key);
    editor_output_doc.required = true;
    editor_output_doc.updatedAt = new Date();
    student.applications[idx].documents.push(editor_output_doc);
    // TODO: set flag student document(filetype, feedback) isReceivedFeedback
    await student.save();
    res.status(201).send({ success: true, data: student });

    // TODO: Inform editor themselves as well?
  }
});

module.exports = {
  getMyfiles,
  saveProfileFilePath,
  downloadProfileFile,
  downloadTemplateFile,
  downloadGeneralFile,
  updateProfileDocumentStatus,
  SetAsFinalProgramSpecificFile,
  UpdateStudentApplications,
  deleteProgramSpecificFile,
  SetAsFinalGeneralFile,
  deleteGeneralFile,
  deleteProfileFile,
  processTranscript,
  downloadXLSX,
  getMyAcademicBackground,
  updateAcademicBackground,
  updateLanguageSkill,
  updatePersonalData,
  updateCredentials,
  PostMessageInThread
};
