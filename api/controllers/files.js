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
const { DocumentStatus } = require('../constants');
const {
  deleteTemplateSuccessEmail,
  uploadTemplateSuccessEmail,
  sendUploadedProfileFilesEmail,
  sendAgentUploadedProfileFilesForStudentEmail,
  sendUploadedProfileFilesRemindForAgentEmail,
  sendChangedProfileFileStatusEmail,
  updateAcademicBackgroundEmail,
  updateLanguageSkillEmail,
  updatePersonalDataEmail,
  updateCredentialsEmail,
  UpdateStudentApplicationsEmail
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
    logger.error('downloadProfileFile: Invalid role!');
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
        logger.error('downloadProfileFile: ', error);
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

// (O) notification student email works
// (O) notification agent email works
const UpdateStudentApplications = asyncHandler(async (req, res, next) => {
  const {
    user,
    params: { studentId },
    body: { applications, applying_program_count }
  } = req;
  console.log(req.body);
  // retrieve studentId differently depend on if student or Admin/Agent uploading the file
  const student = await Student.findById(studentId)
    .populate('agents', 'firstname lastname email')
    .exec();

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
  student.applying_program_count = parseInt(applying_program_count);
  await student.save();

  const student_updated = await Student.findById(studentId)
    .populate('applications.programId')
    .populate('agents editors', 'firstname lastname email')
    .lean();
  res.status(201).send({ success: true, data: student_updated });
  if (user.role === Role.Student) {
    for (let i = 0; i < student.agents.length; i++) {
      await UpdateStudentApplicationsEmail(
        {
          firstname: student.agents[i].firstname,
          lastname: student.agents[i].lastname,
          address: student.agents[i].email
        },
        {
          sender_firstname: student.firstname,
          sender_lastname: student.lastname
        }
      );
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
        sender_lastname: user.lastname
      }
    );
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

const processTranscript_test = asyncHandler(async (req, res, next) => {
  const {
    params: { category, studentId }
  } = req;
  const courses = await Course.findOne({ student_id: studentId });
  console.log('processTranscript_test');
  if (!courses) {
    console.log('no course for this student!');
    return res.send({ success: true, data: {} });
  }
  const stringified_courses = JSON.stringify(courses.table_data_string);
  // const filename = req.file.key; // key is updated file name
  // const filePath = path.join(req.file.metadata.path, req.file.key);
  // logger.info(
  //   path.join(
  //     __dirname,
  //     '..',
  //     'python',
  //     'TaiGer_Transcript-Program_Comparer',
  //     'main.py'
  //   )
  // );
  // FIXME: better pass output filepath as argument to python script instead of hard code value
  // const output = `analyzed_${filename}`;
  // const output_filePath = path.join(req.file.metadata.path, 'output', output);
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
        category
      ],
      { stdio: 'inherit' }
    );
    python.on('data', (data) => {
      test_var = data;
      process.stdout.write('python script output', data);
    });
    // console.log(test_var);
    python.on('close', (code) => {
      if (code === 0) {
        return res.status(200).send({ success: true, data: {} });
      }

      return new ErrorResponse(
        500,
        'Error occurs while trying to produce analyzed report'
      );
    });
  } catch (err) {
    console.log(err);
    return new ErrorResponse(
      500,
      'Error occurs while trying to produce analyzed report'
    );
  }

  // await User.findByIdAndUpdate(
  //   studentId,
  //   {
  //     'taigerai.input.name': filename,
  //     'taigerai.input.path': filePath,
  //     'taigerai.input.status': 'uploaded',
  //     'taigerai.output.name': output,
  //     'taigerai.output.path': output_filePath,
  //     'taigerai.output.status': 'uploaded'
  //   },
  //   { upsert: true, new: true, setDefaultsOnInsert: true }
  // );
  // const student = await User.findById(studentId);
  // return res.status(200).send({ success: true, data: {} });
});

const processTranscript = asyncHandler(async (req, res, next) => {
  const {
    params: { category, studentId }
  } = req;
  const filename = req.file.key; // key is updated file name
  const filePath = path.join(req.file.metadata.path, req.file.key);
  logger.info(
    path.join(
      __dirname,
      '..',
      'python',
      'TaiGer_Transcript-Program_Comparer',
      'main.py'
    )
  );
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
  if (user.role === Role.Student || user.role === 'Guest') {
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
    student_id = user._id;
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
    res.status(200).send({ success: true, data: university });

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
    student_id = user._id;
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
  // const updatedStudent = await User.findById(_id);
  res
    .status(200)
    .send({ success: true, data: updatedStudent.academic_background.language });

  await updateLanguageSkillEmail(
    {
      firstname: updatedStudent.firstname,
      lastname: updatedStudent.lastname,
      address: updatedStudent.email
    },
    {}
  );
});

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

// (O) email : self notification
const updateCredentials = asyncHandler(async (req, res, next) => {
  const {
    user,
    body: { credentials }
  } = req;
  const user_me = await User.findOne({ _id: user._id });
  if (!user_me) {
    logger.error('updateCredentials: Invalid user');
    throw new ErrorResponse(400, 'Invalid user');
  }

  user_me.password = credentials.new_password;
  await user_me.save();
  res.status(200).send({
    success: true
  });
  await updateCredentialsEmail(
    {
      firstname: user.firstname,
      lastname: user.lastname,
      address: user.email
    },
    {}
  );
});

module.exports = {
  getMyfiles,
  getTemplates,
  deleteTemplate,
  uploadTemplate,
  saveProfileFilePath,
  downloadProfileFile,
  downloadTemplateFile,
  updateProfileDocumentStatus,
  UpdateStudentApplications,
  deleteProfileFile,
  processTranscript_test,
  processTranscript,
  downloadXLSX,
  getMyAcademicBackground,
  updateAcademicBackground,
  updateLanguageSkill,
  updatePersonalData,
  updateCredentials
};
