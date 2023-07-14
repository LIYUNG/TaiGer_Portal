const path = require('path');
const aws = require('aws-sdk');
const { asyncHandler } = require('../middlewares/error-handler');
const { one_month_cache, two_month_cache } = require('../cache/node-cache');
const { Role, Student, User, Agent } = require('../models/User');
const { Template } = require('../models/Template');
const { Basedocumentationslink } = require('../models/Basedocumentationslink');
const { Documentthread } = require('../models/Documentthread');
const { ErrorResponse } = require('../common/errors');
const {
  DocumentStatus,
  profile_name_list,
  isNotArchiv
} = require('../constants');
const {
  deleteTemplateSuccessEmail,
  uploadTemplateSuccessEmail,
  sendUploadedProfileFilesEmail,
  sendUploadedVPDEmail,
  sendAgentUploadedProfileFilesForStudentEmail,
  sendAgentUploadedVPDForStudentEmail,
  sendUploadedProfileFilesRemindForAgentEmail,
  sendUploadedVPDRemindForAgentEmail,
  sendChangedProfileFileStatusEmail,
  updateAcademicBackgroundEmail,
  updateLanguageSkillEmail,
  updateLanguageSkillEmailFromTaiGer,
  updateApplicationPreferenceEmail,
  updatePersonalDataEmail,
  UpdateStudentApplicationsEmail,
  NewMLRLEssayTasksEmail,
  NewMLRLEssayTasksEmailFromTaiGer
  // sendSomeReminderEmail,
} = require('../services/email');
const {
  AWS_S3_ACCESS_KEY_ID,
  AWS_S3_ACCESS_KEY,
  AWS_S3_BUCKET_NAME,
  AWS_S3_PUBLIC_BUCKET_NAME
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
    throw new ErrorResponse(403, 'Invalid student id');
  }

  return res.status(201).send({ success: true, data: student });
});

const getTemplates = asyncHandler(async (req, res) => {
  const { user } = req;

  if (user.role === Role.Guest) {
    logger.error('getTemplates: Invalid operation');
    throw new ErrorResponse(403, 'Invalid operation');
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
    throw new ErrorResponse(403, 'Invalid operation');
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
      const value = two_month_cache.del(fileKey);
      if (value === 1) {
        console.log('Template cache key deleted successfully');
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
  const updated_templates = await Template.findOneAndUpdate(
    { category_name },
    {
      name: req.file.key,
      category_name,
      path: path.join(req.file.metadata.path, req.file.key),
      updatedAt: new Date()
    },
    { upsert: true, new: true }
  );
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
    throw new ErrorResponse(403, 'Invalid role');
  }
  const template = await Template.findOne({ category_name });
  // AWS S3
  // download the file via aws s3 here
  let document_split = template.path.replace(/\\/g, '/');
  document_split = document_split.split('/');
  const fileKey = document_split[1];
  let directory = document_split[0];
  logger.info('Trying to download template file', fileKey);
  directory = path.join(AWS_S3_PUBLIC_BUCKET_NAME, directory);
  directory = directory.replace(/\\/g, '/');
  const options = {
    Key: fileKey,
    Bucket: directory
  };

  console.log(fileKey);
  const value = two_month_cache.get(fileKey); // vpd name
  if (value === undefined) {
    s3.getObject(options, (err, data) => {
      // Handle any error and exit
      if (err) return err;

      // No error happened
      const success = two_month_cache.set(fileKey, data.Body);
      if (success) {
        console.log('Template file cache set successfully');
      }

      res.attachment(fileKey);
      return res.end(data.Body);
    });
  } else {
    console.log('Template file cache hit');
    res.attachment(fileKey);
    return res.end(value);
  }
});

// (O) email : student notification
// (O) email : agent notification
const saveProfileFilePath = asyncHandler(async (req, res) => {
  const {
    user,
    params: { studentId, category }
  } = req;
  // retrieve studentId differently depend on if student or Admin/Agent uploading the file
  const student = await Student.findById(studentId)
    .populate('agents editors', 'firstname lastname email archiv')
    .populate('applications.programId');
  if (!student) {
    logger.error('saveProfileFilePath: Invalid student id!');
    throw new ErrorResponse(403, 'Invalid student id');
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
      // TODO: add notification for agents
      for (let i = 0; i < student.agents.length; i += 1) {
        // console.log(student.agents[i]._id.toString());
        const agent = await Agent.findById(student.agents[i]._id.toString());
        if (agent.agent_notification) {
          const temp_student =
            agent.agent_notification.isRead_new_base_docs_uploaded.find(
              (std_obj) => std_obj.student_id === student._id.toString()
            );
          // if not notified yet:
          if (!temp_student) {
            agent.agent_notification.isRead_new_base_docs_uploaded.push({
              student_id: student._id.toString(),
              student_firstname: student.firstname,
              student_lastname: student.lastname
            });
          }
          // else: nothing to do as there was a notification before.
        }
        await agent.save();
      }
      if (isNotArchiv(student)) {
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
      }

      for (let i = 0; i < student.agents.length; i += 1) {
        if (isNotArchiv(student.agents[i])) {
          await sendUploadedProfileFilesRemindForAgentEmail(
            {
              firstname: student.agents[i].firstname,
              lastname: student.agents[i].lastname,
              address: student.agents[i].email
            },
            {
              student_firstname: student.firstname,
              student_lastname: student.lastname,
              student_id: student._id.toString(),
              uploaded_documentname: document.name.replace(/_/g, ' '),
              uploaded_updatedAt: document.updatedAt
            }
          );
        }
      }
    } else {
      if (isNotArchiv(student)) {
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
    // TODO: notify agents
    for (let i = 0; i < student.agents.length; i += 1) {
      // console.log(student.agents[i]._id.toString());
      const agent = await Agent.findById(student.agents[i]._id.toString());
      if (agent.agent_notification) {
        const temp_student =
          agent.agent_notification.isRead_new_base_docs_uploaded.find(
            (std_obj) => std_obj.student_id === student._id.toString()
          );
        // if not notified yet:
        if (!temp_student) {
          agent.agent_notification.isRead_new_base_docs_uploaded.push({
            // eslint-disable-next-line no-underscore-dangle
            student_id: student._id.toString(),
            student_firstname: student.firstname,
            student_lastname: student.lastname
          });
        }
        // else: nothing to do as there was a notification before.
      }
      await agent.save();
    }
    if (isNotArchiv(student)) {
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
    }

    // Reminder for Agent:
    for (let i = 0; i < student.agents.length; i += 1) {
      if (isNotArchiv(student.agents[i])) {
        await sendUploadedProfileFilesRemindForAgentEmail(
          {
            firstname: student.agents[i].firstname,
            lastname: student.agents[i].lastname,
            address: student.agents[i].email
          },
          {
            student_firstname: student.firstname,
            student_lastname: student.lastname,
            student_id: student._id.toString(),
            uploaded_documentname: document.name.replace(/_/g, ' '),
            uploaded_updatedAt: document.updatedAt
          }
        );
      }
    }
  } else {
    if (isNotArchiv(student)) {
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
  }
});

const updateVPDPayment = asyncHandler(async (req, res) => {
  const {
    params: { studentId, program_id },
    body: { isPaid }
  } = req;

  const student = await Student.findById(studentId).populate(
    'applications.programId'
  );

  if (!student) {
    logger.error('updateVPDPayment: Invalid student id!');
    throw new ErrorResponse(403, 'Invalid student id');
  }
  const app = student.applications.find(
    (application) => application.programId._id.toString() === program_id
  );
  if (!app) {
    logger.error('updateVPDPayment: Invalid student id!');
    throw new ErrorResponse(403, 'Invalid program_id id');
  }

  app.uni_assist.isPaid = isPaid;
  app.uni_assist.updatedAt = new Date();
  await student.save();

  // retrieve studentId differently depend on if student or Admin/Agent uploading the file
  res.status(201).send({ success: true, data: student });
});
// () email:

const updateVPDFileNecessity = asyncHandler(async (req, res) => {
  const {
    params: { studentId, program_id }
  } = req;

  const student = await Student.findById(studentId).populate(
    'applications.programId'
  );

  if (!student) {
    logger.error('updateVPDFileNecessity: Invalid student id!');
    throw new ErrorResponse(403, 'Invalid student id');
  }
  const app = student.applications.find(
    (application) => application.programId._id.toString() === program_id
  );
  if (!app) {
    logger.error('updateVPDFileNecessity: Invalid student id!');
    throw new ErrorResponse(403, 'Invalid program_id id');
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

// (O) email : student notification
// (O) email : agent notification
const saveVPDFilePath = asyncHandler(async (req, res) => {
  const {
    user,
    params: { studentId, program_id }
  } = req;

  const student = await Student.findById(studentId).populate(
    'applications.programId'
  );

  if (!student) {
    logger.error('saveVPDFilePath: Invalid student id!');
    throw new ErrorResponse(403, 'Invalid student id');
  }
  const app = student.applications.find(
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

  const student_updated = await Student.findById(studentId).populate(
    'agents',
    'firstname lastname email archiv'
  );

  if (user.role === Role.Student) {
    if (isNotArchiv(student_updated)) {
      await sendUploadedVPDEmail(
        {
          firstname: student_updated.firstname,
          lastname: student_updated.lastname,
          address: student_updated.email
        },
        {
          uploaded_documentname: req.file.key.replace(/_/g, ' '),
          uploaded_updatedAt: app.uni_assist.updatedAt
        }
      );
    }

    // Reminder for Agent:
    for (let i = 0; i < student_updated.agents.length; i += 1) {
      if (isNotArchiv(student_updated.agents[i])) {
        await sendUploadedVPDRemindForAgentEmail(
          {
            firstname: student_updated.agents[i].firstname,
            lastname: student_updated.agents[i].lastname,
            address: student_updated.agents[i].email
          },
          {
            student_firstname: student_updated.firstname,
            student_lastname: student_updated.lastname,
            student_id: student_updated._id.toString(),
            uploaded_documentname: req.file.key.replace(/_/g, ' '),
            uploaded_updatedAt: app.uni_assist.updatedAt
          }
        );
      }
    }
  } else {
    if (isNotArchiv(student_updated)) {
      await sendAgentUploadedVPDForStudentEmail(
        {
          firstname: student_updated.firstname,
          lastname: student_updated.lastname,
          address: student_updated.email
        },
        {
          agent_firstname: user.firstname,
          agent_lastname: user.lastname,
          uploaded_documentname: req.file.key.replace(/_/g, ' '),
          uploaded_updatedAt: app.uni_assist.updatedAt
        }
      );
    }
  }
});

const downloadVPDFile = asyncHandler(async (req, res, next) => {
  const {
    user,
    params: { studentId, program_id }
  } = req;

  // AWS S3
  // download the file via aws s3 here
  const student = await Student.findById(studentId);
  if (!student) {
    logger.error('downloadVPDFile: Invalid student id!');
    throw new ErrorResponse(403, 'Invalid student id');
  }

  const app = student.applications.find(
    (application) => application.programId.toString() === program_id
  );
  if (!app) {
    logger.error('downloadVPDFile: Invalid app name!');
    throw new ErrorResponse(403, 'Invalid app name');
  }
  if (!app.uni_assist.vpd_file_path) {
    logger.error('downloadVPDFile: File not uploaded yet!');
    throw new ErrorResponse(403, 'File not uploaded yet');
  }

  let document_split = app.uni_assist.vpd_file_path.replace(/\\/g, '/');
  document_split = document_split.split('/');
  const fileKey = document_split[1];
  let directory = path.join(AWS_S3_BUCKET_NAME, document_split[0]);
  logger.info('Trying to download VPD file', fileKey);

  directory = directory.replace(/\\/g, '/');
  const options = {
    Key: fileKey,
    Bucket: directory
  };

  console.log(fileKey);
  const cache_key = `${studentId}${fileKey}`;
  const value = one_month_cache.get(cache_key); // vpd name
  if (value === undefined) {
    s3.getObject(options, (err, data) => {
      // Handle any error and exit
      if (err) return err;

      // No error happened
      const success = one_month_cache.set(cache_key, data.Body);
      if (success) {
        console.log('VPD file cache set successfully');
      }

      res.attachment(fileKey);
      return res.end(data.Body);
    });
  } else {
    console.log('VPD file cache hit');
    res.attachment(fileKey);
    return res.end(value);
  }
});

const downloadProfileFileURL = asyncHandler(async (req, res, next) => {
  const {
    params: { studentId, file_key }
  } = req;

  // AWS S3
  // download the file via aws s3 here
  const student = await Student.findById(studentId);

  if (!student) {
    logger.error('downloadProfileFileURL: Invalid student id!');
    throw new ErrorResponse(403, 'Invalid student id');
  }

  const document = student.profile.find((profile) =>
    profile.path.includes(file_key)
  );
  if (!document) {
    logger.error('downloadProfileFileURL: Invalid document name!');
    throw new ErrorResponse(403, 'Invalid document name');
  }
  if (!document.path) {
    logger.error('downloadProfileFileURL: File not uploaded yet!');
    throw new ErrorResponse(403, 'File not uploaded yet');
  }

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

  console.log(fileKey);
  const cache_key = `${studentId}${fileKey}`;
  const value = one_month_cache.get(cache_key); // vpd name
  if (value === undefined) {
    s3.getObject(options, (err, data) => {
      // Handle any error and exit
      if (err) return err;

      // No error happened
      const success = one_month_cache.set(cache_key, data.Body);
      if (success) {
        console.log('Profile file cache set successfully');
      }

      res.attachment(fileKey);
      return res.end(data.Body);
    });
  } else {
    console.log('Profile file cache hit');
    res.attachment(fileKey);
    return res.end(value);
  }
});

// (O) email : student notification
const updateProfileDocumentStatus = asyncHandler(async (req, res, next) => {
  const { studentId, category } = req.params;
  const { status, feedback } = req.body;

  if (!Object.values(DocumentStatus).includes(status)) {
    logger.error('updateProfileDocumentStatus: Invalid document status');
    throw new ErrorResponse(403, 'Invalid document status');
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
    throw new ErrorResponse(403, 'Invalid student Id or application Id');
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
    // rejected file notification set
    student.notification.isRead_base_documents_rejected = false;
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
  if (isNotArchiv(student)) {
    if (
      status !== DocumentStatus.NotNeeded &&
      status !== DocumentStatus.Missing
    ) {
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
    }
  }
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
    .populate('applications', 'doc_modification_thread.doc_thread_id')
    .exec();

  let new_task_flag = false;
  if (!student) {
    logger.error('UpdateStudentApplications: Invalid student id');
    throw new ErrorResponse(403, 'Invalid student id');
  }
  const new_app_decided_idx = [];
  for (let i = 0; i < applications.length; i += 1) {
    const application_idx = student.applications.findIndex(
      (app) => app._id == applications[i]._id
    );
    const application = student.applications.find(
      (app) => app._id == applications[i]._id
    );
    if (!application) {
      logger.error('UpdateStudentApplications: Invalid document status');
      throw new ErrorResponse(
        403,
        'Invalid application. Please refresh the page and try updating again.'
      );
    }
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
    // TODO: any faster way to query one time and write back once?!
    if (application.closed === 'O') {
      for (let k = 0; k < application.doc_modification_thread.length; k += 1) {
        application.doc_modification_thread[k].updatedAt = new Date();
        const document_thread = await Documentthread.findById(
          application.doc_modification_thread[k].doc_thread_id
        );
        document_thread.isFinalVersion = true;
        document_thread.updatedAt = new Date();
        await document_thread.save();
      }
    }
    application.admission = applications[i].admission;
  }
  if (user.role === Role.Admin) {
    student.applying_program_count = parseInt(applying_program_count);
  }
  await student.save();

  const student_updated = await Student.findById(studentId)
    .populate('applications.programId')
    .populate(
      'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
      '-messages'
    )
    .populate('agents editors', 'firstname lastname email archiv')
    .select('-profile -notification -application_preference')
    .lean();

  res.status(201).send({ success: true, data: student_updated });
  if (user.role === Role.Student) {
    for (let i = 0; i < student_updated.agents.length; i += 1) {
      if (isNotArchiv(student_updated.agents[i])) {
        await UpdateStudentApplicationsEmail(
          {
            firstname: student_updated.agents[i].firstname,
            lastname: student_updated.agents[i].lastname,
            address: student_updated.agents[i].email
          },
          {
            sender_firstname: student_updated.firstname,
            sender_lastname: student_updated.lastname,
            student_applications: student_updated.applications,
            new_app_decided_idx: new_app_decided_idx
          }
        );
      }
    }
    if (isNotArchiv(student_updated)) {
      await UpdateStudentApplicationsEmail(
        {
          firstname: student_updated.firstname,
          lastname: student_updated.lastname,
          address: student_updated.email
        },
        {
          sender_firstname: student_updated.firstname,
          sender_lastname: student_updated.lastname,
          student_applications: student_updated.applications,
          new_app_decided_idx: new_app_decided_idx
        }
      );
    }

    if (new_task_flag) {
      for (let i = 0; i < student_updated.editors.length; i += 1) {
        if (isNotArchiv(student_updated.editors[i])) {
          if (isNotArchiv(student_updated)) {
            await NewMLRLEssayTasksEmail(
              {
                firstname: student_updated.editors[i].firstname,
                lastname: student_updated.editors[i].lastname,
                address: student_updated.editors[i].email
              },
              {
                sender_firstname: student_updated.firstname,
                sender_lastname: student_updated.lastname,
                student_applications: student_updated.applications,
                new_app_decided_idx: new_app_decided_idx
              }
            );
          }
        }
      }
    }
  } else {
    if (isNotArchiv(student_updated)) {
      await UpdateStudentApplicationsEmail(
        {
          firstname: student_updated.firstname,
          lastname: student_updated.lastname,
          address: student_updated.email
        },
        {
          sender_firstname: user.firstname,
          sender_lastname: user.lastname,
          student_applications: student_updated.applications,
          new_app_decided_idx
        }
      );
    }

    if (new_task_flag) {
      for (let i = 0; i < student_updated.editors.length; i += 1) {
        if (isNotArchiv(student_updated.editors[i])) {
          if (isNotArchiv(student_updated)) {
            await NewMLRLEssayTasksEmailFromTaiGer(
              {
                firstname: student_updated.editors[i].firstname,
                lastname: student_updated.editors[i].lastname,
                address: student_updated.editors[i].email
              },
              {
                student_firstname: student_updated.firstname,
                student_lastname: student_updated.lastname,
                sender_firstname: user.firstname,
                sender_lastname: user.lastname,
                student_applications: student_updated.applications,
                new_app_decided_idx: new_app_decided_idx
              }
            );
          }
        }
      }
    }
  }
});

const deleteProfileFile = asyncHandler(async (req, res, next) => {
  const { studentId, category } = req.params;

  const student = await Student.findOne({
    _id: studentId
  });

  if (!student) {
    logger.error('deleteProfileFile: Invalid student Id or application Id');
    throw new ErrorResponse(403, 'Invalid student Id or application Id');
  }

  const document = student.profile.find(({ name }) => name === category);
  if (!document) {
    logger.error('deleteProfileFile: Invalid document name');
    throw new ErrorResponse(403, 'Invalid document name');
  }
  if (!document.path) {
    logger.error('deleteProfileFile: File not exist');
    throw new ErrorResponse(403, 'File not exist');
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
  const cache_key = `${studentId}${fileKey}`;
  try {
    s3.deleteObject(options, (error, data) => {
      if (error) {
        logger.error(error);
      } else {
        document.status = DocumentStatus.Missing;
        document.path = '';
        document.updatedAt = new Date();

        student.save();
        const value = one_month_cache.del(cache_key);
        if (value === 1) {
          console.log('Profile cache key deleted successfully');
        }
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

  const student = await Student.findOne({
    _id: studentId
  })
    .populate('applications.programId')
    .populate('agents editors', 'firstname lastname email');

  if (!student) {
    logger.error('deleteVPDFile: Invalid student Id or application Id');
    throw new ErrorResponse(403, 'Invalid student Id or application Id');
  }

  const app = student.applications.find(
    (application) => application.programId._id.toString() === program_id
  );
  if (!app) {
    logger.error('deleteVPDFile: Invalid applications name');
    throw new ErrorResponse(403, 'Invalid applications name');
  }
  if (!app.uni_assist.vpd_file_path) {
    logger.error('deleteVPDFile: File not exist');
    throw new ErrorResponse(403, 'File not exist');
  }

  let document_split = app.uni_assist.vpd_file_path.replace(/\\/g, '/');
  document_split = document_split.split('/');
  const fileKey = document_split[1];
  let directory = path.join(AWS_S3_BUCKET_NAME, document_split[0]);
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
        const cache_key = `${studentId}${fileKey}`;
        const value = one_month_cache.del(cache_key);
        if (value === 1) {
          console.log('VPD cache key deleted successfully');
        }
        res.status(200).send({ success: true });
      }
    });
  } catch (err) {
    if (err) {
      logger.error('deleteVPDFile: ', err);
      throw new ErrorResponse(500, 'Error occurs while deleting');
    }
  }
});

const removeNotification = asyncHandler(async (req, res, next) => {
  const { user } = req;
  const { notification_key } = req.body;
  // eslint-disable-next-line no-underscore-dangle
  const me = await User.findById(user._id.toString());
  const obj = me.notification; // create object
  obj[`${notification_key}`] = true; // set value
  await User.findByIdAndUpdate(user._id.toString(), { notification: obj }, {});
  res.status(200).send({
    success: true
  });
});

const removeAgentNotification = asyncHandler(async (req, res, next) => {
  const { user } = req;
  const { notification_key, student_id } = req.body;
  // eslint-disable-next-line no-underscore-dangle
  const me = await Agent.findById(user._id.toString());
  const idx = me.agent_notification[`${notification_key}`].findIndex(
    (student_obj) => student_obj.student_id === student_id
  );
  if (idx === -1) {
    logger.error('removeAgentNotification: student id not existed');
    throw new ErrorResponse(403, 'student id not existed');
  }
  me.agent_notification[`${notification_key}`].splice(idx, 1);
  await me.save();
  res.status(200).send({
    success: true
  });
});

const getMyAcademicBackground = asyncHandler(async (req, res, next) => {
  const { user: student } = req;
  const { _id } = student;
  const me = await User.findById(_id);
  if (me.academic_background === undefined) me.academic_background = {};
  await me.save();
  // TODO: mix with base-docuement link??
  const survey_docs_link = await Basedocumentationslink.find({
    category: 'survey'
  });

  res.status(200).send({
    success: true,
    data: {
      agents: me.agents,
      editors: me.editors,
      academic_background: me.academic_background,
      application_preference: me.application_preference
    },
    survey_link: survey_docs_link
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
    // eslint-disable-next-line no-underscore-dangle
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

      let course_description_doc = updatedStudent.profile.find(
        (doc) => doc.name === profile_name_list.Course_Description
      );
      if (!course_description_doc) {
        // Set not needed
        course_description_doc = updatedStudent.profile.create({
          name: profile_name_list.Course_Description
        });
        course_description_doc.status = DocumentStatus.NotNeeded;
        course_description_doc.required = true;
        course_description_doc.updatedAt = new Date();
        course_description_doc.path = '';
        updatedStudent.profile.push(course_description_doc);
      } else {
        if (course_description_doc.status === DocumentStatus.Missing) {
          course_description_doc.status = DocumentStatus.NotNeeded;
        }
      }

      let employment_certificate_doc = updatedStudent.profile.find(
        (doc) => doc.name === profile_name_list.Employment_Certificate
      );
      if (!employment_certificate_doc) {
        // Set not needed
        employment_certificate_doc = updatedStudent.profile.create({
          name: profile_name_list.Employment_Certificate
        });
        employment_certificate_doc.status = DocumentStatus.NotNeeded;
        employment_certificate_doc.required = true;
        employment_certificate_doc.updatedAt = new Date();
        employment_certificate_doc.path = '';
        updatedStudent.profile.push(employment_certificate_doc);
      } else {
        if (employment_certificate_doc.status === DocumentStatus.Missing) {
          employment_certificate_doc.status = DocumentStatus.NotNeeded;
        }
      }
      let ects_conversion_doc = updatedStudent.profile.find(
        (doc) => doc.name === profile_name_list.ECTS_Conversion
      );
      if (!ects_conversion_doc) {
        // Set not needed
        ects_conversion_doc = updatedStudent.profile.create({
          name: profile_name_list.ECTS_Conversion
        });
        ects_conversion_doc.status = DocumentStatus.NotNeeded;
        ects_conversion_doc.required = true;
        ects_conversion_doc.updatedAt = new Date();
        ects_conversion_doc.path = '';
        updatedStudent.profile.push(ects_conversion_doc);
      } else {
        if (ects_conversion_doc.status === DocumentStatus.Missing) {
          ects_conversion_doc.status = DocumentStatus.NotNeeded;
        }
      }
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

      let course_description_doc = updatedStudent.profile.find(
        (doc) => doc.name === profile_name_list.Course_Description
      );
      if (!course_description_doc) {
        // Set not needed
        course_description_doc = updatedStudent.profile.create({
          name: profile_name_list.Course_Description
        });
        course_description_doc.status = DocumentStatus.Missing;
        course_description_doc.required = true;
        course_description_doc.updatedAt = new Date();
        course_description_doc.path = '';
        updatedStudent.profile.push(course_description_doc);
      } else {
        if (course_description_doc.status === DocumentStatus.NotNeeded) {
          course_description_doc.status = DocumentStatus.Missing;
        }
      }

      let employment_certificate_doc = updatedStudent.profile.find(
        (doc) => doc.name === profile_name_list.Employment_Certificate
      );
      if (!employment_certificate_doc) {
        // Set not needed
        employment_certificate_doc = updatedStudent.profile.create({
          name: profile_name_list.Employment_Certificate
        });
        employment_certificate_doc.status = DocumentStatus.Missing;
        employment_certificate_doc.required = true;
        employment_certificate_doc.updatedAt = new Date();
        employment_certificate_doc.path = '';
        updatedStudent.profile.push(employment_certificate_doc);
      } else {
        if (employment_certificate_doc.status === DocumentStatus.NotNeeded) {
          employment_certificate_doc.status = DocumentStatus.Missing;
        }
      }

      let ects_conversion_doc = updatedStudent.profile.find(
        (doc) => doc.name === profile_name_list.ECTS_Conversion
      );
      if (!ects_conversion_doc) {
        // Set not needed
        ects_conversion_doc = updatedStudent.profile.create({
          name: profile_name_list.ECTS_Conversion
        });
        ects_conversion_doc.status = DocumentStatus.Missing;
        ects_conversion_doc.required = true;
        ects_conversion_doc.updatedAt = new Date();
        ects_conversion_doc.path = '';
        updatedStudent.profile.push(ects_conversion_doc);
      } else if (ects_conversion_doc.status === DocumentStatus.NotNeeded) {
        ects_conversion_doc.status = DocumentStatus.Missing;
      }
    }

    if (
      updatedStudent.academic_background.university.Has_Exchange_Experience ===
      'Yes'
    ) {
      // make sure if existing uploaded file
      let exchange_certificate = updatedStudent.profile.find(
        (doc) => doc.name === profile_name_list.Exchange_Student_Certificate
      );
      if (!exchange_certificate) {
        // Set not needed
        exchange_certificate = updatedStudent.profile.create({
          name: profile_name_list.Exchange_Student_Certificate
        });
        exchange_certificate.status = DocumentStatus.Missing;
        exchange_certificate.required = true;
        exchange_certificate.updatedAt = new Date();
        exchange_certificate.path = '';
        updatedStudent.profile.push(exchange_certificate);
      } else {
        if (exchange_certificate.status === DocumentStatus.NotNeeded) {
          exchange_certificate.status = DocumentStatus.Missing;
        }
      }
    } else {
      // make sure if existing uploaded file
      let exchange_certificate = updatedStudent.profile.find(
        (doc) => doc.name === profile_name_list.Exchange_Student_Certificate
      );
      if (!exchange_certificate) {
        // Set not needed
        exchange_certificate = updatedStudent.profile.create({
          name: profile_name_list.Exchange_Student_Certificate
        });
        exchange_certificate.status = DocumentStatus.NotNeeded;
        exchange_certificate.required = true;
        exchange_certificate.updatedAt = new Date();
        exchange_certificate.path = '';
        updatedStudent.profile.push(exchange_certificate);
      } else {
        if (exchange_certificate.status === DocumentStatus.Missing) {
          exchange_certificate.status = DocumentStatus.NotNeeded;
        }
      }
    }
    await updatedStudent.save();

    // TODO: minor: profile field not used for student.
    res.status(200).send({
      success: true,
      data: university,
      profile: updatedStudent.profile
    });

    if (isNotArchiv(updatedStudent)) {
      await updateAcademicBackgroundEmail(
        {
          firstname: updatedStudent.firstname,
          lastname: updatedStudent.lastname,
          address: updatedStudent.email
        },
        {}
      );
    }
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
    } else if (german_certificate_doc.status === DocumentStatus.Missing) {
      german_certificate_doc.status = DocumentStatus.NotNeeded;
    }
  } else if (!german_certificate_doc) {
    // Set not needed
    german_certificate_doc = updatedStudent.profile.create({
      name: profile_name_list.German_Certificate
    });
    german_certificate_doc.status = DocumentStatus.Missing;
    german_certificate_doc.required = true;
    german_certificate_doc.updatedAt = new Date();
    german_certificate_doc.path = '';
    updatedStudent.profile.push(german_certificate_doc);
  } else if (german_certificate_doc.status === DocumentStatus.NotNeeded) {
    german_certificate_doc.status = DocumentStatus.Missing;
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
    if (isNotArchiv(updatedStudent)) {
      await updateLanguageSkillEmail(
        {
          firstname: updatedStudent.firstname,
          lastname: updatedStudent.lastname,
          address: updatedStudent.email
        },
        {}
      );
    }

    // TODO : inform agents
  } else {
    if (isNotArchiv(updatedStudent)) {
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
      // eslint-disable-next-line no-underscore-dangle
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
      if (isNotArchiv(updatedStudent)) {
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
  }
);

// (O) email : self notification
const updatePersonalData = asyncHandler(async (req, res, next) => {
  const {
    params: { user_id },
    user,
    body: { personaldata }
  } = req;
  try {
    const updatedStudent = await User.findByIdAndUpdate(user_id, personaldata, {
      upsert: true,
      new: true
    });
    // const updatedStudent = await User.findById(_id);
    res.status(200).send({
      success: true,
      data: {
        firstname: updatedStudent.firstname,
        firstname_chinese: updatedStudent.firstname_chinese,
        lastname: updatedStudent.lastname,
        lastname_chinese: updatedStudent.lastname_chinese,
        birthday: personaldata.birthday
      }
    });
    if (isNotArchiv(updatedStudent)) {
      await updatePersonalDataEmail(
        {
          firstname: personaldata.firstname,
          lastname: personaldata.lastname,
          address: user.email
        },
        {}
      );
    }
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
  updateVPDPayment,
  updateVPDFileNecessity,
  deleteVPDFile,
  removeNotification,
  removeAgentNotification,
  getMyAcademicBackground,
  updateAcademicBackground,
  updateLanguageSkill,
  updateApplicationPreferenceSkill,
  updatePersonalData
};
