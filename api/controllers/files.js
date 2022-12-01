const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const aws = require('aws-sdk');
const { asyncHandler } = require('../middlewares/error-handler');
const { Role, Student, User } = require('../models/User');
const { Template } = require('../models/Template');
const Course = require('../models/Course');
const { UPLOAD_PATH } = require('../config');
const { ErrorResponse } = require('../common/errors');
const { DocumentStatus, profile_name_list } = require('../constants');
const {
  deleteTemplateSuccessEmail,
  uploadTemplateSuccessEmail,
  sendUploadedProfileFilesEmail,
  sendAgentUploadedProfileFilesForStudentEmail,
  sendUploadedProfileFilesRemindForAgentEmail,
  sendChangedProfileFileStatusEmail,
  updateAcademicBackgroundEmail,
  updateLanguageSkillEmail,
  updateLanguageSkillEmailFromTaiGer,
  updateApplicationPreferenceEmail,
  updatePersonalDataEmail,
  UpdateStudentApplicationsEmail,
  NewMLRLEssayTasksEmail,
  NewMLRLEssayTasksEmailFromTaiGer,
  assignDocumentTaskToEditorEmail,
  assignDocumentTaskToStudentEmail
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
  const student = await User.findById(user._id);
  if (!student) {
    logger.error('getMyfiles: Invalid student id');
    throw new ErrorResponse(400, 'Invalid student id');
  }

  return res.status(201).send({ success: true, data: student });
});

const getTemplates = asyncHandler(async (req, res) => {
  const { user } = req;

  if (user.role === Role.Guest) {
    logger.error('getTemplates: Invalid operation');
    throw new ErrorResponse(400, 'Invalid operation');
  }

  const templates = await Template.find({});

  return res.status(201).send({ success: true, data: templates });
});

// (O) email admin delete template
const deleteTemplate = asyncHandler(async (req, res) => {
  const { user } = req;
  const { category_name } = req.params;

  if (user.role !== Role.Admin) {
    logger.error('deleteTemplate: Invalid operation');
    throw new ErrorResponse(400, 'Invalid operation');
  }
  const template = await Template.findOne({ category_name });

  let document_split = template.path.replace(/\\/g, '/');
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
        logger.error('deleteObject');
        logger.error(error);
      }
    });
  } catch (err) {
    if (err) {
      logger.error('deleteTemplate: ', err);
      throw new ErrorResponse(500, 'Error occurs while deleting');
    }
  }
  await Template.findOneAndDelete({ category_name });
  const templates = await Template.find({});
  res.status(200).send({ success: true, data: templates });
  await deleteTemplateSuccessEmail(
    {
      firstname: user.firstname,
      lastname: user.lastname,
      address: user.email
    },
    {
      category_name,
      updatedAt: new Date()
    }
  );
});

// (O) email admin uploaded template successfully
const uploadTemplate = asyncHandler(async (req, res) => {
  const { user } = req;
  const { category_name } = req.params;
  if (user.role !== Role.Admin) {
    logger.error('uploadTemplate: Invalid operation');
    throw new ErrorResponse(403, 'Invalid operation');
  }
  let template = await Template.findOne({ category_name });
  if (!template) {
    template = await Template.create({
      name: req.file.key,
      category_name,
      path: path.join(req.file.metadata.path, req.file.key),
      updatedAt: new Date()
    });
  } else {
    template.name = req.file.key;
    template.category_name = category_name;
    template.path = path.join(req.file.metadata.path, req.file.key);
    template.updatedAt = new Date();
    await template.save();
  }
  const updated_templates = await Template.find({});
  res.status(201).send({ success: true, data: updated_templates });

  await uploadTemplateSuccessEmail(
    {
      firstname: user.firstname,
      lastname: user.lastname,
      address: user.email
    },
    {
      category_name,
      updatedAt: new Date()
    }
  );
});

const downloadTemplateFile = asyncHandler(async (req, res, next) => {
  const {
    user,
    params: { category_name }
  } = req;
  // Check authorized role
  if (user.role === Role.Guest) {
    logger.error('downloadTemplateFile: Invalid role!');
    throw new ErrorResponse(400, 'Invalid role');
  }
  const template = await Template.findOne({ category_name });
  // AWS S3
  // download the file via aws s3 here
  // var fileKey = path.join(UPLOAD_PATH, document.path);
  let document_split = template.path.replace(/\\/g, '/');
  document_split = document_split.split('/');
  const fileKey = document_split[1];
  let directory = document_split[0];
  logger.info('Trying to download template file', fileKey);
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
        logger.error('downloadTemplateFile: ', error);
      }
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    });
});

// (O) email : student notification
// (O) email : agent notification
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
  let document = student.profile.find(({ name }) => name === category);
  if (!document) {
    document = student.profile.create({ name: category });
    document.status = DocumentStatus.Uploaded;
    document.required = true;
    document.updatedAt = new Date();
    document.path = path.join(req.file.metadata.path, req.file.key);
    student.profile.push(document);
    await student.save();
    res.status(201).send({ success: true, data: student });
    if (user.role === Role.Student) {
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
  document.path = path.join(req.file.metadata.path, req.file.key);
  await student.save();

  // retrieve studentId differently depend on if student or Admin/Agent uploading the file
  res.status(201).send({ success: true, data: student });
  if (user.role === Role.Student) {
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

// () email:

const updateVPDFileNecessity = asyncHandler(async (req, res) => {
  const {
    user,
    params: { studentId, program_id }
  } = req;
  let student;
  if (user.role === Role.Student) {
    student = await Student.findById(user._id.toString()).populate(
      'applications.programId'
    );
  } else {
    student = await Student.findById(studentId).populate(
      'applications.programId'
    );
  }

  if (!student) {
    logger.error('updateVPDFileNecessity: Invalid student id!');
    throw new ErrorResponse(400, 'Invalid student id');
  }
  let app = student.applications.find(
    (application) => application.programId._id.toString() === program_id
  );
  if (!app) {
    logger.error('updateVPDFileNecessity: Invalid student id!');
    throw new ErrorResponse(400, 'Invalid program_id id');
  }
  // TODO: set bot notneeded and resume needed
  if (app.uni_assist.status !== DocumentStatus.NotNeeded) {
    app.uni_assist.status = DocumentStatus.NotNeeded;
  } else {
    app.uni_assist.status = DocumentStatus.Missing;
  }
  app.uni_assist.updatedAt = new Date();
  app.uni_assist.vpd_file_path = '';
  await student.save();

  // retrieve studentId differently depend on if student or Admin/Agent uploading the file
  res.status(201).send({ success: true, data: student });
});

// () email : student notification
// () email : agent notification
const saveVPDFilePath = asyncHandler(async (req, res) => {
  const {
    user,
    params: { studentId, program_id }
  } = req;
  // retrieve studentId differently depend on if student or Admin/Agent uploading the file
  let student;
  if (user.role === Role.Student) {
    student = await Student.findById(user._id.toString()).populate(
      'applications.programId'
    );
  } else {
    student = await Student.findById(studentId).populate(
      'applications.programId'
    );
  }

  if (!student) {
    logger.error('saveVPDFilePath: Invalid student id!');
    throw new ErrorResponse(400, 'Invalid student id');
  }
  let app = student.applications.find(
    (application) => application.programId._id.toString() === program_id
  );
  if (!app) {
    app.uni_assist.status = DocumentStatus.Uploaded;
    app.uni_assist.updatedAt = new Date();
    app.uni_assist.vpd_file_path = path.join(
      req.file.metadata.path,
      req.file.key
    );
    await student.save();
    res.status(201).send({ success: true, data: student });
    // if (user.role === Role.Student) {
    //   await sendUploadedProfileFilesEmail(
    //     {
    //       firstname: student.firstname,
    //       lastname: student.lastname,
    //       address: student.email
    //     },
    //     {
    //       uploaded_documentname: document.name.replace(/_/g, ' '),
    //       uploaded_updatedAt: document.updatedAt
    //     }
    //   );

    //   for (let i = 0; i < student.agents.length; i++) {
    //     await sendUploadedProfileFilesRemindForAgentEmail(
    //       {
    //         firstname: student.agents[i].firstname,
    //         lastname: student.agents[i].lastname,
    //         address: student.agents[i].email
    //       },
    //       {
    //         student_firstname: student.firstname,
    //         student_lastname: student.lastname,
    //         uploaded_documentname: document.name.replace(/_/g, ' '),
    //         uploaded_updatedAt: document.updatedAt
    //       }
    //     );
    //   }
    // } else {
    //   await sendAgentUploadedProfileFilesForStudentEmail(
    //     {
    //       firstname: student.firstname,
    //       lastname: student.lastname,
    //       address: student.email
    //     },
    //     {
    //       agent_firstname: user.firstname,
    //       agent_lastname: user.lastname,
    //       uploaded_documentname: document.name.replace(/_/g, ' '),
    //       uploaded_updatedAt: document.updatedAt
    //     }
    //   );
    // }
    return;
  }
  app.uni_assist.status = DocumentStatus.Uploaded;
  app.uni_assist.updatedAt = new Date();
  app.uni_assist.vpd_file_path = path.join(
    req.file.metadata.path,
    req.file.key
  );
  await student.save();

  // retrieve studentId differently depend on if student or Admin/Agent uploading the file
  res.status(201).send({ success: true, data: student });
  // if (user.role === Role.Student) {
  //   await sendUploadedProfileFilesEmail(
  //     {
  //       firstname: student.firstname,
  //       lastname: student.lastname,
  //       address: student.email
  //     },
  //     {
  //       uploaded_documentname: document.name.replace(/_/g, ' '),
  //       uploaded_updatedAt: document.updatedAt
  //     }
  //   );
  //   // Reminder for Agent:
  //   for (let i = 0; i < student.agents.length; i++) {
  //     await sendUploadedProfileFilesRemindForAgentEmail(
  //       {
  //         firstname: student.agents[i].firstname,
  //         lastname: student.agents[i].lastname,
  //         address: student.agents[i].email
  //       },
  //       {
  //         student_firstname: student.firstname,
  //         student_lastname: student.lastname,
  //         uploaded_documentname: document.name.replace(/_/g, ' '),
  //         uploaded_updatedAt: document.updatedAt
  //       }
  //     );
  //   }
  // } else {
  //   await sendAgentUploadedProfileFilesForStudentEmail(
  //     {
  //       firstname: student.firstname,
  //       lastname: student.lastname,
  //       address: student.email
  //     },
  //     {
  //       agent_firstname: user.firstname,
  //       agent_lastname: user.lastname,
  //       uploaded_documentname: document.name.replace(/_/g, ' '),
  //       uploaded_updatedAt: document.updatedAt
  //     }
  //   );
  // }
});

const downloadVPDFile = asyncHandler(async (req, res, next) => {
  const {
    user,
    params: { studentId, program_id }
  } = req;

  // AWS S3
  // download the file via aws s3 here
  const student =
    user.role == Role.Student ? user : await Student.findById(studentId);
  if (!student) {
    logger.error('downloadVPDFile: Invalid student id!');
    throw new ErrorResponse(400, 'Invalid student id');
  }

  const app = student.applications.find(
    (application) => application.programId.toString() === program_id
  );
  if (!app) {
    logger.error('downloadVPDFile: Invalid app name!');
    throw new ErrorResponse(400, 'Invalid app name');
  }
  if (!app.uni_assist.vpd_file_path) {
    logger.error('downloadVPDFile: File not uploaded yet!');
    throw new ErrorResponse(400, 'File not uploaded yet');
  }

  // var fileKey = path.join(UPLOAD_PATH, document.path);
  let document_split = app.uni_assist.vpd_file_path.replace(/\\/g, '/');
  document_split = document_split.split('/');
  const fileKey = document_split[2];
  let directory = path.join(
    AWS_S3_BUCKET_NAME,
    document_split[0],
    document_split[1]
  );
  logger.info('Trying to download profile file', fileKey);

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
        logger.error('downloadVPDFile: ', error);
      }
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    });
});

const downloadProfileFileURL = asyncHandler(async (req, res, next) => {
  const {
    user,
    params: { studentId, file_key }
  } = req;

  // AWS S3
  // download the file via aws s3 here
  let student;
  if (user.role === Role.Student) {
    student = user;
  } else if (
    user.role === Role.Admin ||
    user.role === Role.Agent ||
    user.role === Role.Editor
  ) {
    student = await Student.findById(studentId);
  } else {
    logger.error('downloadProfileFileURL: Invalid access from the public!');
    throw new ErrorResponse(400, 'Invalid access from the public');
  }

  if (!student) {
    logger.error('downloadProfileFileURL: Invalid student id!');
    throw new ErrorResponse(400, 'Invalid student id');
  }

  const document = student.profile.find((profile) =>
    profile.path.includes(file_key)
  );
  if (!document) {
    logger.error('downloadProfileFileURL: Invalid document name!');
    throw new ErrorResponse(400, 'Invalid document name');
  }
  if (!document.path) {
    logger.error('downloadProfileFileURL: File not uploaded yet!');
    throw new ErrorResponse(400, 'File not uploaded yet');
  }

  // var fileKey = path.join(UPLOAD_PATH, document.path);
  let document_split = document.path.replace(/\\/g, '/');
  document_split = document_split.split('/');
  const fileKey = document_split[1];
  let directory = document_split[0];
  logger.info('Trying to download profile file', fileKey);
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
        logger.error('downloadProfileFileURL: ', error);
      }
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    });
});

// (O) email : student notification
const updateProfileDocumentStatus = asyncHandler(async (req, res, next) => {
  const { studentId, category } = req.params;
  const { status, feedback } = req.body;

  if (!Object.values(DocumentStatus).includes(status)) {
    logger.error('updateProfileDocumentStatus: Invalid document status');
    throw new ErrorResponse(400, 'Invalid document status');
  }

  const student = await Student.findOne({
    _id: studentId
  })
    .populate('applications.programId')
    .populate('agents editors', 'firstname lastname email');
  if (!student) {
    logger.error(
      'updateProfileDocumentStatus: Invalid student Id or application Id'
    );
    throw new ErrorResponse(400, 'Invalid student Id or application Id');
  }
  let document = student.profile.find(({ name }) => name === category);
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

  if (status === DocumentStatus.Rejected) {
    document.feedback = feedback;
  }
  if (status === DocumentStatus.Accepted) {
    document.feedback = '';
  }

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

// () TODO: notification student email works includding tasks if decided
// (O) notification agent email works
// () TODO: notification editor email works includding tasks if decided
const UpdateStudentApplications = asyncHandler(async (req, res, next) => {
  const {
    user,
    params: { studentId },
    body: { applications, applying_program_count }
  } = req;
  // retrieve studentId differently depend on if student or Admin/Agent uploading the file
  const student = await Student.findById(studentId)
    .populate('applications.programId')
    .populate('agents editors', 'firstname lastname email')
    .exec();

  let new_task_flag = false;
  if (!student) {
    logger.error('UpdateStudentApplications: Invalid student id');
    throw new ErrorResponse(400, 'Invalid student id');
  }
  const new_app_decided_idx = [];
  for (let i = 0; i < applications.length; i += 1) {
    const application_idx = student.applications.findIndex(
      (app) => app._id == applications[i]._id
    );
    const application = student.applications.find(
      (app) => app._id == applications[i]._id
    );
    if (
      applications[i].decided === 'O' &&
      application.decided !== applications[i].decided
    ) {
      // if applications[i].decided === 'yes', send ML/RL/Essay Tasks link in Email for eidtor, student
      // Add new tasks and send to email
      new_app_decided_idx.push(application_idx);
      if (
        application.programId.uni_assist &&
        application.programId.uni_assist.includes('Yes')
      ) {
        student.notification.isRead_uni_assist_task_assigned = false;
      }
      // add reminder banner
      student.notification.isRead_new_cvmlrl_tasks_created = false;
      new_task_flag = true;
    }
    application.decided = applications[i].decided;
    application.closed = applications[i].closed;
    application.admission = applications[i].admission;
  }
  if (user.role === Role.Admin) {
    student.applying_program_count = parseInt(applying_program_count);
  }
  await student.save();

  const student_updated = await Student.findById(studentId)
    .populate('applications.programId')
    .populate('agents editors', 'firstname lastname email')
    .lean();
  res.status(201).send({ success: true, data: student_updated });
  if (user.role === Role.Student) {
    for (let i = 0; i < student.agents.length; i += 1) {
      await UpdateStudentApplicationsEmail(
        {
          firstname: student.agents[i].firstname,
          lastname: student.agents[i].lastname,
          address: student.agents[i].email
        },
        {
          sender_firstname: student.firstname,
          sender_lastname: student.lastname,
          student_applications: student_updated.applications,
          new_app_decided_idx: new_app_decided_idx
        }
      );
    }

    await UpdateStudentApplicationsEmail(
      {
        firstname: student.firstname,
        lastname: student.lastname,
        address: student.email
      },
      {
        sender_firstname: user.firstname,
        sender_lastname: user.lastname,
        student_applications: student_updated.applications,
        new_app_decided_idx: new_app_decided_idx
      }
    );
    if (new_task_flag) {
      for (let i = 0; i < student.editors.length; i += 1) {
        await NewMLRLEssayTasksEmail(
          {
            firstname: student.editors[i].firstname,
            lastname: student.editors[i].lastname,
            address: student.editors[i].email
          },
          {
            sender_firstname: student.firstname,
            sender_lastname: student.lastname,
            student_applications: student_updated.applications,
            new_app_decided_idx: new_app_decided_idx
          }
        );
      }
    }
  } else {
    await UpdateStudentApplicationsEmail(
      {
        firstname: student.firstname,
        lastname: student.lastname,
        address: student.email
      },
      {
        sender_firstname: user.firstname,
        sender_lastname: user.lastname,
        student_applications: student_updated.applications,
        new_app_decided_idx: new_app_decided_idx
      }
    );
    if (new_task_flag) {
      for (let i = 0; i < student.editors.length; i += 1) {
        await NewMLRLEssayTasksEmailFromTaiGer(
          {
            firstname: student.editors[i].firstname,
            lastname: student.editors[i].lastname,
            address: student.editors[i].email
          },
          {
            student_firstname: student.firstname,
            student_lastname: student.lastname,
            sender_firstname: user.firstname,
            sender_lastname: user.lastname,
            student_applications: student_updated.applications,
            new_app_decided_idx: new_app_decided_idx
          }
        );
      }
    }
  }
});

const deleteProfileFile = asyncHandler(async (req, res, next) => {
  const { studentId, category } = req.params;
  const { user } = req;
  if (user.role === Role.Student) {
    if (studentId !== user._id.toString()) {
      logger.error('deleteProfileFile: Invalid operation for student');
      throw new ErrorResponse(403, 'Invalid operation for student');
    }
  }

  const student = await Student.findOne({
    _id: studentId
  });

  if (!student) {
    logger.error('deleteProfileFile: Invalid student Id or application Id');
    throw new ErrorResponse(400, 'Invalid student Id or application Id');
  }

  const document = student.profile.find(({ name }) => name === category);
  if (!document) {
    logger.error('deleteProfileFile: Invalid document name');
    throw new ErrorResponse(400, 'Invalid document name');
  }
  if (!document.path) {
    logger.error('deleteProfileFile: File not exist');
    throw new ErrorResponse(400, 'File not exist');
  }

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
        logger.error(error);
      } else {
        document.status = DocumentStatus.Missing;
        document.path = '';
        document.updatedAt = new Date();

        student.save();
        res.status(200).send({ success: true, data: document });
      }
    });
  } catch (err) {
    if (err) {
      logger.error('deleteProfileFile: ', err);
      throw new ErrorResponse(500, 'Error occurs while deleting');
    }
  }
});

const deleteVPDFile = asyncHandler(async (req, res, next) => {
  const { studentId, program_id } = req.params;
  const { user } = req;
  if (user.role === Role.Student) {
    if (studentId !== user._id.toString()) {
      logger.error('deleteVPDFile: Invalid operation for student');
      throw new ErrorResponse(403, 'Invalid operation for student');
    }
  }

  const student = await Student.findOne({
    _id: studentId
  })
    .populate('applications.programId')
    .populate('agents editors', 'firstname lastname email');

  if (!student) {
    logger.error('deleteVPDFile: Invalid student Id or application Id');
    throw new ErrorResponse(400, 'Invalid student Id or application Id');
  }

  const app = student.applications.find(
    (application) => application.programId._id.toString() === program_id
  );
  if (!app) {
    logger.error('deleteVPDFile: Invalid applications name');
    throw new ErrorResponse(400, 'Invalid applications name');
  }
  if (!app.uni_assist.vpd_file_path) {
    logger.error('deleteVPDFile: File not exist');
    throw new ErrorResponse(400, 'File not exist');
  }

  let document_split = app.uni_assist.vpd_file_path.replace(/\\/g, '/');
  document_split = document_split.split('/');
  const fileKey = document_split[2];
  let directory = path.join(
    AWS_S3_BUCKET_NAME,
    document_split[0],
    document_split[1]
  );
  logger.info('Trying to delete file', fileKey);
  directory = directory.replace(/\\/g, '/');

  const options = {
    Key: fileKey,
    Bucket: directory
  };
  try {
    s3.deleteObject(options, (error, data) => {
      if (error) {
        logger.error(error);
      } else {
        app.uni_assist.status = DocumentStatus.Missing;
        app.uni_assist.vpd_file_path = '';
        app.uni_assist.updatedAt = new Date();

        student.save();
        res.status(200).send({ success: true, data: student });
      }
    });
  } catch (err) {
    if (err) {
      logger.error('deleteVPDFile: ', err);
      throw new ErrorResponse(500, 'Error occurs while deleting');
    }
  }
});

const processTranscript_test = asyncHandler(async (req, res, next) => {
  const {
    params: { category, studentId }
  } = req;
  const courses = await Course.findOne({ student_id: studentId }).populate(
    'student_id'
  );
  if (!courses) {
    logger.error('no course for this student!');
    return res.send({ success: true, data: {} });
  }
  const stringified_courses = JSON.stringify(courses.table_data_string);

  // TODO: multitenancy studentId?
  let student_name = `${courses.student_id.firstname}_${courses.student_id.lastname}`;
  student_name = student_name.replace(/ /g, '-');
  try {
    let test_var;
    const python = spawn(
      'python',
      [
        path.join(
          __dirname,
          '..',
          'python',
          'TaiGerTranscriptAnalyzerJS',
          'main.py'
        ),
        stringified_courses,
        category,
        studentId,
        student_name
      ],
      { stdio: 'inherit' }
    );
    python.on('data', (data) => {
      test_var = data;
      process.stdout.write('python script output', data);
    });
    python.on('close', (code) => {
      if (code === 0) {
        courses.analysis.isAnalysed = true;
        courses.analysis.path = path.join(
          studentId,
          `analysed_transcript_${student_name}.xlsx`
        );
        courses.analysis.updatedAt = new Date();
        courses.save();
        return res.status(200).send({ success: true, data: courses.analysis });
      } else {
        logger.error('Error occurs while trying to produce analyzed report');
        return res.status(500).send({ success: false });
      }
    });
  } catch (err) {
    logger.error(err);
    throw new ErrorResponse(
      500,
      'Error occurs while trying to produce analyzed report2'
    );
  }
});

// FIXME: refactor this
// Download original transcript excel
const downloadXLSX = asyncHandler(async (req, res, next) => {
  const {
    user,
    params: { studentId }
  } = req;

  let course;
  if (user.role === Role.Student || user.role === 'Guest') {
    course = await Course.findOne({ student_id: user._id.toString() });
  } else {
    course = await Course.findOne({ student_id: studentId });
  }
  if (!course) {
    logger.error('downloadXLSX: Invalid student id');
    throw new ErrorResponse(400, 'Invalid student id');
  }

  if (course.analysis.path === '' || !course.analysis.isAnalysed) {
    logger.error('downloadXLSX: not analysed yet');
    throw new ErrorResponse(400, 'Transcript not analysed  yet');
  }

  let analysed_transcript_excel_split = course.analysis.path.replace(
    /\\/g,
    '/'
  );
  analysed_transcript_excel_split = analysed_transcript_excel_split.split('/');
  const fileKey = analysed_transcript_excel_split[1];
  let directory = analysed_transcript_excel_split[0];
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

const removeNotification = asyncHandler(async (req, res, next) => {
  const { user } = req;
  const { notification_key } = req.body;
  const me = await User.findById(user._id.toString())
    .populate('applications.programId agents editors')
    .populate(
      'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id'
    );
  me.notification[`${notification_key}`] = true;
  await me.save();
  res.status(200).send({
    success: true,
    data: me
  });
});

const getMyAcademicBackground = asyncHandler(async (req, res, next) => {
  const { user: student } = req;
  const { _id } = student;
  const me = await User.findById(_id);
  if (me.academic_background === undefined) me.academic_background = {};
  await me.save();
  res.status(200).send({
    success: true,
    data: {
      academic_background: me.academic_background,
      application_preference: me.application_preference
    }
  });
});

// (O)  email : self notification
// () TODO: agent update email
const updateAcademicBackground = asyncHandler(async (req, res, next) => {
  const {
    user,
    body: { university }
  } = req;
  const { studentId } = req.params;
  // const { _id } = student;
  let student_id;
  if (user.role === Role.Student || user.role === Role.Guest) {
    student_id = user._id.toString();
  } else {
    student_id = studentId;
  }
  try {
    university['updatedAt'] = new Date();
    const updatedStudent = await User.findByIdAndUpdate(
      student_id,
      {
        'academic_background.university': university
        // $addToSet: {
        //   academic_background: { university: university },
        // },
      },
      { upsert: true, new: true }
    );

    // TODO: update base documents needed or not:

    // no need university doc
    if (
      updatedStudent.academic_background.university.high_school_isGraduated ===
      'pending'
    ) {
      // make sure if existing uploaded file
      let bachelor_diploma_doc = updatedStudent.profile.find(
        (doc) => doc.name === profile_name_list.Bachelor_Certificate
      );
      if (!bachelor_diploma_doc) {
        // Set not needed
        bachelor_diploma_doc = updatedStudent.profile.create({
          name: profile_name_list.Bachelor_Certificate
        });
        bachelor_diploma_doc.status = DocumentStatus.NotNeeded;
        bachelor_diploma_doc.required = true;
        bachelor_diploma_doc.updatedAt = new Date();
        bachelor_diploma_doc.path = '';
        updatedStudent.profile.push(bachelor_diploma_doc);
      } else {
        if (bachelor_diploma_doc.status === DocumentStatus.Missing) {
          bachelor_diploma_doc.status = DocumentStatus.NotNeeded;
        }
      }

      let bachelor_transcript_doc = updatedStudent.profile.find(
        (doc) => doc.name === profile_name_list.Bachelor_Transcript
      );
      if (!bachelor_transcript_doc) {
        // Set not needed
        bachelor_transcript_doc = updatedStudent.profile.create({
          name: profile_name_list.Bachelor_Transcript
        });
        bachelor_transcript_doc.status = DocumentStatus.NotNeeded;
        bachelor_transcript_doc.required = true;
        bachelor_transcript_doc.updatedAt = new Date();
        bachelor_transcript_doc.path = '';
        updatedStudent.profile.push(bachelor_transcript_doc);
      } else {
        if (bachelor_transcript_doc.status === DocumentStatus.Missing) {
          bachelor_transcript_doc.status = DocumentStatus.NotNeeded;
        }
      }
      await updatedStudent.save();
    } else {
      let bachelor_diploma_doc = updatedStudent.profile.find(
        (doc) => doc.name === profile_name_list.Bachelor_Certificate
      );
      if (!bachelor_diploma_doc) {
        // Set not needed
        bachelor_diploma_doc = updatedStudent.profile.create({
          name: profile_name_list.Bachelor_Certificate
        });
        bachelor_diploma_doc.status = DocumentStatus.Missing;
        bachelor_diploma_doc.required = true;
        bachelor_diploma_doc.updatedAt = new Date();
        bachelor_diploma_doc.path = '';
        updatedStudent.profile.push(bachelor_diploma_doc);
      } else {
        if (bachelor_diploma_doc.status === DocumentStatus.NotNeeded) {
          bachelor_diploma_doc.status = DocumentStatus.Missing;
        }
      }

      let bachelor_transcript_doc = updatedStudent.profile.find(
        (doc) => doc.name === profile_name_list.Bachelor_Transcript
      );
      if (!bachelor_transcript_doc) {
        // Set not needed
        bachelor_transcript_doc = updatedStudent.profile.create({
          name: profile_name_list.Bachelor_Transcript
        });
        bachelor_transcript_doc.status = DocumentStatus.Missing;
        bachelor_transcript_doc.required = true;
        bachelor_transcript_doc.updatedAt = new Date();
        bachelor_transcript_doc.path = '';
        updatedStudent.profile.push(bachelor_transcript_doc);
      } else {
        if (bachelor_transcript_doc.status === DocumentStatus.NotNeeded) {
          bachelor_transcript_doc.status = DocumentStatus.Missing;
        }
      }
      await updatedStudent.save();
    }

    // TODO: minor: profile field not used for student.
    res.status(200).send({
      success: true,
      data: university,
      profile: updatedStudent.profile
    });

    await updateAcademicBackgroundEmail(
      {
        firstname: updatedStudent.firstname,
        lastname: updatedStudent.lastname,
        address: updatedStudent.email
      },
      {}
    );
  } catch (err) {
    logger.error(err);
    throw new ErrorResponse(400, JSON.stringify(err));
  }
});

// (O) email : self notification
// () TODO email: notify agents
const updateLanguageSkill = asyncHandler(async (req, res, next) => {
  const {
    user,
    body: { language }
  } = req;
  const { studentId } = req.params;
  // const { _id } = student;
  let student_id;
  if (user.role === Role.Student || user.role === Role.Guest) {
    student_id = user._id.toString();
  } else {
    student_id = studentId;
  }
  language['updatedAt'] = new Date();
  const updatedStudent = await User.findByIdAndUpdate(
    student_id,
    {
      'academic_background.language': language
      // $set: {
      //   'academic_background.language': language
      // }
    },
    { upsert: true, new: true }
  );

  // German not needed
  let german_certificate_doc = updatedStudent.profile.find(
    (doc) => doc.name === profile_name_list.German_Certificate
  );
  let english_certificate_doc = updatedStudent.profile.find(
    (doc) => doc.name === profile_name_list.Englisch_Certificate
  );
  if (updatedStudent.academic_background.language.german_isPassed === '--') {
    if (!german_certificate_doc) {
      // Set not needed
      german_certificate_doc = updatedStudent.profile.create({
        name: profile_name_list.German_Certificate
      });
      german_certificate_doc.status = DocumentStatus.NotNeeded;
      german_certificate_doc.required = true;
      german_certificate_doc.updatedAt = new Date();
      german_certificate_doc.path = '';
      updatedStudent.profile.push(german_certificate_doc);
    } else {
      if (german_certificate_doc.status === DocumentStatus.Missing) {
        german_certificate_doc.status = DocumentStatus.NotNeeded;
      }
    }
  } else {
    if (!german_certificate_doc) {
      // Set not needed
      german_certificate_doc = updatedStudent.profile.create({
        name: profile_name_list.German_Certificate
      });
      german_certificate_doc.status = DocumentStatus.Missing;
      german_certificate_doc.required = true;
      german_certificate_doc.updatedAt = new Date();
      german_certificate_doc.path = '';
      updatedStudent.profile.push(german_certificate_doc);
    } else {
      if (german_certificate_doc.status === DocumentStatus.NotNeeded) {
        german_certificate_doc.status = DocumentStatus.Missing;
      }
    }
  }

  if (updatedStudent.academic_background.language.english_isPassed === '--') {
    if (!english_certificate_doc) {
      // Set not needed
      english_certificate_doc = updatedStudent.profile.create({
        name: profile_name_list.Englisch_Certificate
      });
      english_certificate_doc.status = DocumentStatus.NotNeeded;
      english_certificate_doc.required = true;
      english_certificate_doc.updatedAt = new Date();
      english_certificate_doc.path = '';
      updatedStudent.profile.push(english_certificate_doc);
    } else if (english_certificate_doc.status === DocumentStatus.Missing) {
      english_certificate_doc.status = DocumentStatus.NotNeeded;
    }
  } else if (!english_certificate_doc) {
    // Set not needed
    english_certificate_doc = updatedStudent.profile.create({
      name: profile_name_list.Englisch_Certificate
    });
    english_certificate_doc.status = DocumentStatus.Missing;
    english_certificate_doc.required = true;
    english_certificate_doc.updatedAt = new Date();
    english_certificate_doc.path = '';
    updatedStudent.profile.push(english_certificate_doc);
  } else if (english_certificate_doc.status === DocumentStatus.NotNeeded) {
    english_certificate_doc.status = DocumentStatus.Missing;
  }

  await updatedStudent.save();
  // TODO: minor: profile field not used for student.
  res.status(200).send({
    success: true,
    data: updatedStudent.academic_background.language,
    profile: updatedStudent.profile
  });
  if (user.role === Role.Student) {
    await updateLanguageSkillEmail(
      {
        firstname: updatedStudent.firstname,
        lastname: updatedStudent.lastname,
        address: updatedStudent.email
      },
      {}
    );
  } else {
    await updateLanguageSkillEmailFromTaiGer(
      {
        firstname: updatedStudent.firstname,
        lastname: updatedStudent.lastname,
        address: updatedStudent.email
      },
      {
        sender_firstname: user.firstname,
        sender_lastname: user.lastname
      }
    );
  }
});

// (O) email : self notification
// () TODO email: notify agents
const updateApplicationPreferenceSkill = asyncHandler(
  async (req, res, next) => {
    const {
      user,
      body: { application_preference }
    } = req;
    const { studentId } = req.params;
    // const { _id } = student;
    let student_id;
    if (user.role === Role.Student || user.role === Role.Guest) {
      student_id = user._id;
    } else {
      student_id = studentId;
    }
    application_preference['updatedAt'] = new Date();
    const updatedStudent = await User.findByIdAndUpdate(
      student_id,
      {
        application_preference
      },
      { upsert: true, new: true }
    );
    // const updatedStudent = await User.findById(_id);
    res.status(200).send({
      success: true,
      data: updatedStudent.application_preference
    });
    if (user.role === Role.Student) {
      await updateApplicationPreferenceEmail(
        {
          firstname: updatedStudent.firstname,
          lastname: updatedStudent.lastname,
          address: updatedStudent.email
        },
        {}
      );
    }
  }
);

// (O) email : self notification
const updatePersonalData = asyncHandler(async (req, res, next) => {
  const {
    user,
    body: { personaldata }
  } = req;
  const { _id } = user;
  try {
    const updatedStudent = await User.findByIdAndUpdate(
      _id,
      {
        firstname: personaldata.firstname,
        lastname: personaldata.lastname
      },
      { upsert: true, new: true }
    );
    // const updatedStudent = await User.findById(_id);
    res.status(200).send({
      success: true,
      data: {
        firstname: updatedStudent.firstname,
        lastname: updatedStudent.lastname
      }
    });
    await updatePersonalDataEmail(
      {
        firstname: personaldata.firstname,
        lastname: personaldata.lastname,
        address: user.email
      },
      {}
    );
  } catch (err) {
    logger.error(err);
  }
});

module.exports = {
  getMyfiles,
  getTemplates,
  deleteTemplate,
  uploadTemplate,
  saveProfileFilePath,
  saveVPDFilePath,
  downloadVPDFile,
  downloadProfileFileURL,
  downloadTemplateFile,
  updateProfileDocumentStatus,
  UpdateStudentApplications,
  deleteProfileFile,
  updateVPDFileNecessity,
  deleteVPDFile,
  processTranscript_test,
  downloadXLSX,
  removeNotification,
  getMyAcademicBackground,
  updateAcademicBackground,
  updateLanguageSkill,
  updateApplicationPreferenceSkill,
  updatePersonalData
};
