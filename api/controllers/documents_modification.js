const mongoose = require('mongoose');
const async = require('async');
const path = require('path');
const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const { one_month_cache } = require('../cache/node-cache');
const { informOnSurveyUpdate } = require('../utils/informEditor');
const {
  sendNewApplicationMessageInThreadEmail,
  sendAssignEditorReminderEmail,
  sendNewGeneraldocMessageInThreadEmail,
  sendSetAsFinalGeneralFileForAgentEmail,
  sendSetAsFinalGeneralFileForStudentEmail,
  sendSetAsFinalProgramSpecificFileForStudentEmail,
  sendSetAsFinalProgramSpecificFileForAgentEmail,
  assignDocumentTaskToEditorEmail,
  assignDocumentTaskToStudentEmail,
  sendAssignEssayWriterReminderEmail,
  assignEssayTaskToEditorEmail,
  sendAssignTrainerReminderEmail,
  sendNewInterviewMessageInThreadEmail
} = require('../services/email');
const logger = require('../services/logger');
const {
  getNumberOfDays,
  General_Docs,
  application_deadline_calculator,
  isNotArchiv,
  CVDeadline_Calculator,
  EDITOR_SCOPE,
  ESSAY_WRITER_SCOPE,
  Role
} = require('../constants');
const {
  informEssayWriterNewEssayEmail,
  informStudentTheirEssayWriterEmail,
  informAgentEssayAssignedEmail
} = require('../services/email');

const { AWS_S3_BUCKET_NAME, API_ORIGIN } = require('../config');
const { deleteS3Objects } = require('../aws/s3');
const {
  deleteApplicationThread,
  createApplicationThread,
  emptyS3Directory
} = require('../utils/modelHelper/versionControl');
const { threadS3GarbageCollector } = require('../utils/utils_function');
const { getS3Object } = require('../aws/s3');

const getAllCVMLRLOverview = asyncHandler(async (req, res) => {
  const students = await req.db
    .model('Student')
    .find({
      $or: [{ archiv: { $exists: false } }, { archiv: false }]
    })
    .populate(
      'applications.programId',
      'school program_name degree application_deadline semester lang'
    )
    .populate({
      path: 'generaldocs_threads.doc_thread_id',
      select:
        'file_type flag_by_user_id isFinalVersion updatedAt messages.file',
      populate: {
        path: 'messages.user_id',
        select: 'firstname lastname'
      }
    })
    .populate({
      path: 'applications.doc_modification_thread.doc_thread_id',
      select:
        'file_type flag_by_user_id outsourced_user_id isFinalVersion updatedAt messages.file',
      populate: {
        path: 'outsourced_user_id messages.user_id',
        select: 'firstname lastname'
      }
    })
    .populate('editors agents', 'firstname lastname')
    .select(
      'applications generaldocs_threads firstname lastname application_preference attributes'
    )
    .lean();
  res.status(200).send({ success: true, data: students });
});

const getSurveyInputDocuments = asyncHandler(
  async (req, studentId, programId, fileType) => {
    const document = await req.db
      .model('surveyInput')
      .find({
        studentId,
        ...(fileType ? { fileType } : {}),
        ...(programId ? { programId: { $in: [programId, null] } } : {})
      })
      .select(
        'programId fileType surveyType surveyContent isFinalVersion createdAt updatedAt'
      )
      .lean()
      .exec();

    const surveys = {
      general: document.find((doc) => !doc.programId),
      specific: programId && document.find((doc) => doc.programId)
    };

    return surveys;
  }
);

const getSurveyInputs = asyncHandler(async (req, res, next) => {
  const {
    params: { messagesThreadId }
  } = req;
  const threadDocument = await req.db
    .model('Documentthread')
    .findById(messagesThreadId)
    .populate('student_id', 'firstname lastname email')
    .populate('program_id', 'school program_name degree lang')
    .lean()
    .exec();

  if (!threadDocument) {
    logger.error(
      `getSurveyInputs: Invalid message thread id! (${messagesThreadId})`
    );
    throw new ErrorResponse(400, 'Invalid message thread id');
  }

  const surveyDocument = await getSurveyInputDocuments(
    req,
    threadDocument.student_id._id.toString(),
    threadDocument?.program_id && threadDocument?.program_id._id.toString(),
    threadDocument.file_type
  );

  document = {
    ...threadDocument,
    surveyInputs: surveyDocument
  };

  res.status(200).send({ success: true, data: document });
});

const postSurveyInput = asyncHandler(async (req, res, next) => {
  const { user } = req;
  const { input, informEditor } = req.body;
  const SurveyInput = req.db.model('surveyInput');
  const newSurvey = new SurveyInput({
    ...input,
    createdAt: new Date()
  });
  await newSurvey.save();
  res.status(200).send({ success: true, data: newSurvey });

  if (informEditor) {
    const thread = await req.db
      .model('Documentthread')
      .findOne({
        student_id: newSurvey.studentId,
        program_id: newSurvey.programId,
        file_type: newSurvey.fileType
      })
      .populate('program_id')
      .lean();
    informOnSurveyUpdate(req, user, newSurvey, thread);
  }
});

const putSurveyInput = asyncHandler(async (req, res, next) => {
  const {
    user,
    params: { surveyInputId }
  } = req;
  const { input, informEditor } = req.body;
  const updatedSurvey = await req.db
    .model('surveyInput')
    .findByIdAndUpdate(
      surveyInputId,
      {
        ...input,
        updatedAt: new Date()
      },
      { upsert: false, new: true }
    )
    .lean();

  res.status(200).send({ success: true, data: updatedSurvey });

  if (informEditor) {
    const thread = await req.db
      .model('Documentthread')
      .findOne({
        student_id: updatedSurvey.studentId,
        program_id: updatedSurvey.programId,
        file_type: updatedSurvey.fileType
      })
      .populate('program_id')
      .lean();
    informOnSurveyUpdate(req, user, updatedSurvey, thread);
  }
});

const resetSurveyInput = asyncHandler(async (req, res, next) => {
  const { user } = req;
  const {
    params: { surveyInputId }
  } = req;
  const { informEditor } = req.body;
  const updatedSurvey = await req.db.model('surveyInput').findByIdAndUpdate(
    surveyInputId,
    {
      $unset: {
        'surveyContent.$[].answer': 1
      }
    },
    { upsert: false, new: true }
  );
  res.status(200).send({ success: true, data: updatedSurvey });
  if (informEditor) {
    const thread = await req.db
      .model('Documentthread')
      .findOne({
        student_id: updatedSurvey.studentId,
        program_id: updatedSurvey.programId,
        file_type: updatedSurvey.fileType
      })
      .populate('program_id')
      .lean();
    informOnSurveyUpdate(req, user, updatedSurvey, thread);
  }
});

const getCVMLRLOverview = asyncHandler(async (req, res) => {
  const {
    user
    // params: { userId },
  } = req;
  if (user.role === Role.Admin) {
    const students = await req.db
      .model('Student')
      .find({
        $or: [{ archiv: { $exists: false } }, { archiv: false }]
      })
      .populate(
        'applications.programId',
        'school program_name degree application_deadline semester lang'
      )
      .populate({
        path: 'generaldocs_threads.doc_thread_id',
        select:
          'file_type isFinalVersion outsourced_user_id flag_by_user_id updatedAt messages.file',
        populate: {
          path: 'messages.user_id',
          select: 'firstname lastname'
        }
      })
      .populate({
        path: 'applications.doc_modification_thread.doc_thread_id',
        select:
          'file_type isFinalVersion outsourced_user_id flag_by_user_id updatedAt messages.file',
        populate: {
          path: 'messages.user_id',
          select: 'firstname lastname'
        }
      })
      .select(
        'applications generaldocs_threads firstname lastname application_preference attributes'
      )
      .lean();
    res.status(200).send({ success: true, data: students });
  } else if (user.role === Role.Agent) {
    const students = await req.db
      .model('Student')
      .find({
        agents: user._id,
        $or: [{ archiv: { $exists: false } }, { archiv: false }]
      })
      .populate(
        'applications.programId',
        'school program_name degree application_deadline semester lang'
      )
      .populate({
        path: 'generaldocs_threads.doc_thread_id',
        select:
          'file_type isFinalVersion outsourced_user_id flag_by_user_id updatedAt messages.file',
        populate: {
          path: 'messages.user_id',
          select: 'firstname lastname'
        }
      })
      .populate({
        path: 'applications.doc_modification_thread.doc_thread_id',
        select:
          'file_type isFinalVersion outsourced_user_id flag_by_user_id updatedAt messages.file',
        populate: {
          path: 'messages.user_id',
          select: 'firstname lastname'
        }
      })
      .select(
        'applications applications generaldocs_threads firstname lastname application_preference attributes'
      )
      .lean()
      .exec();

    res.status(200).send({ success: true, data: students });
  } else if (user.role === Role.Editor) {
    const students = await req.db
      .model('Student')
      .find({
        editors: user._id,
        $or: [{ archiv: { $exists: false } }, { archiv: false }]
      })
      .populate(
        'applications.programId',
        'school program_name degree application_deadline semester lang'
      )
      .populate({
        path: 'generaldocs_threads.doc_thread_id',
        select:
          'file_type isFinalVersion updatedAt flag_by_user_id messages.file',
        populate: {
          path: 'messages.user_id outsourced_user_id',
          select: 'firstname lastname'
        }
      })
      .populate({
        path: 'applications.doc_modification_thread.doc_thread_id',
        select:
          'file_type isFinalVersion updatedAt flag_by_user_id messages.file',
        populate: {
          path: 'messages.user_id outsourced_user_id',
          select: 'firstname lastname'
        }
      })
      .select(
        'applications applications generaldocs_threads firstname lastname application_preference attributes'
      );
    res.status(200).send({ success: true, data: students });
  } else if (user.role === Role.Student) {
    const obj = user.notification; // create object
    obj['isRead_new_cvmlrl_messsage'] = true; // set value
    obj['isRead_new_cvmlrl_tasks_created'] = true;
    await req.db
      .model('Student')
      .findByIdAndUpdate(user._id.toString(), { notification: obj }, {});
    const student = await req.db
      .model('Student')
      .findById(user._id)
      .populate(
        'applications.programId',
        'school program_name degree application_deadline semester lang'
      )
      .populate({
        path: 'generaldocs_threads.doc_thread_id',
        select:
          'file_type isFinalVersion outsourced_user_id flag_by_user_id updatedAt messages.file',
        populate: {
          path: 'messages.user_id',
          select: 'firstname lastname'
        }
      })
      .populate({
        path: 'applications.doc_modification_thread.doc_thread_id',
        select:
          'file_type isFinalVersion outsourced_user_id flag_by_user_id updatedAt messages.file',
        populate: {
          path: 'messages.user_id',
          select: 'firstname lastname'
        }
      })
      .select(
        'applications applications generaldocs_threads firstname lastname application_preference'
      )
      .lean()
      .exec();
    res.status(200).send({ success: true, data: [student] });
  } else {
    // Guest
    res.status(200).send({ success: true, data: [user] });
  }
});

// (O) email inform student
// (O) email inform editors.
const initGeneralMessagesThread = asyncHandler(async (req, res) => {
  const {
    params: { studentId, document_category }
  } = req;
  const Documentthread = req.db.model('Documentthread');
  const student = await req.db
    .model('Student')
    .findById(studentId)
    .populate('generaldocs_threads.doc_thread_id')
    .populate('agents editors', 'firstname lastname email')
    .exec();

  if (!student) {
    logger.info('initGeneralMessagesThread: Invalid student id');
    throw new ErrorResponse(404, 'Student Id not found');
  }

  const doc_thread_existed = await Documentthread.findOne({
    student_id: studentId,
    program_id: null,
    file_type: document_category
  });

  if (doc_thread_existed) {
    // should add the existing one thread to student generaldocs
    const thread_in_student_generaldoc_existed =
      student.generaldocs_threads.find(
        ({ doc_thread_id }) =>
          doc_thread_id._id.toString() === doc_thread_existed._id.toString()
      );
    // if thread existed but not in student application thread, then add it.
    if (!thread_in_student_generaldoc_existed) {
      const app = student.generaldocs_threads.create({
        doc_thread_id: doc_thread_existed,
        updatedAt: new Date(),
        createdAt: new Date()
      });
      student.generaldocs_threads.push(app);
      student.notification.isRead_new_cvmlrl_tasks_created = false;
      await student.save();
      return res.status(200).send({ success: true, data: app });
    }
    logger.info('initGeneralMessagesThread: Document Thread already existed!');
    throw new ErrorResponse(409, 'Document Thread already existed!');
  }
  const new_doc_thread = new Documentthread({
    student_id: studentId,
    file_type: document_category,
    program_id: null,
    updatedAt: new Date()
  });

  const temp = student.generaldocs_threads.create({
    doc_thread_id: new_doc_thread,
    updatedAt: new Date(),
    createdAt: new Date()
  });
  student.generaldocs_threads.push(temp);
  student.notification.isRead_new_cvmlrl_tasks_created = false;
  await student.save();
  await new_doc_thread.save();

  res.status(200).send({ success: true, data: temp });
  // TODO: Email notification
  const documentname = document_category;
  for (let i = 0; i < student.editors.length; i += 1) {
    if (isNotArchiv(student)) {
      assignDocumentTaskToEditorEmail(
        {
          firstname: student.editors[i].firstname,
          lastname: student.editors[i].lastname,
          address: student.editors[i].email
        },
        {
          student_firstname: student.firstname,
          student_lastname: student.lastname,
          thread_id: new_doc_thread._id,
          documentname,
          updatedAt: new Date()
        }
      );
    }
  }
  if (isNotArchiv(student)) {
    await assignDocumentTaskToStudentEmail(
      {
        firstname: student.firstname,
        lastname: student.lastname,
        address: student.email
      },
      { documentname, updatedAt: new Date(), thread_id: new_doc_thread._id }
    );
  }
});

// (O) email inform Editor
// (O) email inform Student
// (O) Tested
const initApplicationMessagesThread = asyncHandler(async (req, res) => {
  const {
    params: { studentId, program_id, document_category }
  } = req;

  const newAppRecord = await createApplicationThread(
    {
      StudentModel: req.db.model('Student'),
      DocumentthreadModel: req.db.model('Documentthread')
    },
    studentId,
    program_id,
    document_category
  );
  res.status(200).send({ success: true, data: newAppRecord });

  const student = await req.db
    .model('Student')
    .findById(studentId)
    .populate('applications.programId')
    .populate('agents editors', 'firstname lastname email archiv')
    .exec();
  const program = student.applications.find(
    (app) => app.programId._id.toString() === program_id
  )?.programId;
  const Essay_Writer_Scope = Object.keys(ESSAY_WRITER_SCOPE);
  const program_name = `${program.school} - ${program.program_name}`;
  if (Essay_Writer_Scope.includes(document_category)) {
    const permissions = await req.db
      .model('Permission')
      .find({
        canAssignEditors: true
      })
      .populate('user_id', 'firstname lastname email archiv')
      .lean();
    if (permissions) {
      for (let x = 0; x < permissions.length; x += 1) {
        if (isNotArchiv(permissions[x].user_id)) {
          assignEssayTaskToEditorEmail(
            {
              firstname: permissions[x].user_id.firstname,
              lastname: permissions[x].user_id.lastname,
              address: permissions[x].user_id.email
            },
            {
              student_firstname: student.firstname,
              student_lastname: student.lastname,
              student_id: student._id.toString(),
              thread_id: newAppRecord.doc_thread_id._id,
              document_category,
              program_name,
              updatedAt: new Date()
            }
          );
        }
      }
    }
  }
  const documentname = document_category;

  for (let i = 0; i < student.editors.length; i += 1) {
    if (isNotArchiv(student.editors[i])) {
      if (!Essay_Writer_Scope.includes(document_category)) {
        assignDocumentTaskToEditorEmail(
          {
            firstname: student.editors[i].firstname,
            lastname: student.editors[i].lastname,
            address: student.editors[i].email
          },
          {
            student_firstname: student.firstname,
            student_lastname: student.lastname,
            thread_id: newAppRecord.doc_thread_id._id,
            documentname,
            updatedAt: new Date()
          }
        );
      }
    }
  }
  if (isNotArchiv(student)) {
    assignDocumentTaskToStudentEmail(
      {
        firstname: student.firstname,
        lastname: student.lastname,
        address: student.email
      },
      {
        documentname,
        updatedAt: new Date(),
        thread_id: newAppRecord.doc_thread_id._id
      }
    );
  }
});

const putThreadFavorite = asyncHandler(async (req, res, next) => {
  const {
    user,
    params: { messagesThreadId }
  } = req;
  const thread = await req.db
    .model('Documentthread')
    .findById(messagesThreadId);
  if (!thread) {
    logger.error('putThreadFavorite: Invalid message thread id!');
    throw new ErrorResponse(404, 'Thread not found');
  }

  if (thread.flag_by_user_id?.includes(user._id.toString())) {
    await req.db.model('Documentthread').findByIdAndUpdate(
      messagesThreadId,
      {
        $pull: { flag_by_user_id: user._id.toString() } // Remove user id if already present
      },
      {}
    );
  } else {
    await req.db.model('Documentthread').findByIdAndUpdate(
      messagesThreadId,
      {
        $addToSet: { flag_by_user_id: user._id.toString() } // Add user id if not already present
      },
      {}
    );
  }

  res.status(200).send({
    success: true
  });
});

const getMessages = asyncHandler(async (req, res) => {
  const {
    user,
    params: { messagesThreadId }
  } = req;
  const document_thread = await req.db
    .model('Documentthread')
    .findById(messagesThreadId)
    .populate(
      'student_id',
      'firstname lastname firstname_chinese lastname_chinese role agents editors application_preference'
    )
    .populate('messages.user_id', 'firstname lastname role')
    .populate('program_id')
    .populate('outsourced_user_id', 'firstname lastname role')
    .lean()
    .exec();

  const agents = await req.db
    .model('Agent')
    .find({
      _id: document_thread.student_id.agents
    })
    .select('firstname lastname');
  const editors = await req.db
    .model('Editor')
    .find({
      _id: document_thread.student_id.editors
    })
    .select('firstname lastname');
  const student = await req.db
    .model('Student')
    .findById(document_thread.student_id._id.toString())
    .populate('applications.programId');
  let deadline = 'x';
  if (General_Docs.includes(document_thread.file_type)) {
    deadline = CVDeadline_Calculator(student);
  } else {
    const application = student.applications.find(
      (app) =>
        app.programId._id.toString() ===
        document_thread.program_id._id.toString()
    );
    deadline = application_deadline_calculator(student, application);
  }
  // Find conflict list:
  let conflict_list = [];
  if (
    user.role === Role.Admin ||
    user.role === Role.Agent ||
    user.role === Role.Editor
  ) {
    conflict_list = await req.db
      .model('Student')
      .find({
        _id: { $ne: document_thread.student_id._id.toString() },
        applications: {
          $elemMatch: {
            programId: document_thread.program_id?._id.toString(),
            decided: 'O'
          }
        },
        'application_preference.expected_application_date':
          document_thread.student_id?.application_preference
            ?.expected_application_date
      })
      .select(
        'firstname lastname applications application_preference.expected_application_date'
      );
  }
  res.status(200).send({
    success: true,
    data: document_thread,
    agents,
    editors,
    deadline,
    conflict_list
  });
});

const postImageInThread = asyncHandler(async (req, res) => {
  const {
    params: { messagesThreadId, studentId }
  } = req;
  const filePath = req.file.key.split('/');
  const fileName = filePath[3];
  let imageurl = new URL(
    `/api/document-threads/image/${messagesThreadId}/${studentId}/${fileName}`,
    API_ORIGIN
  ).href;
  imageurl = imageurl.replace(/\\/g, '/');
  return res.send({ success: true, data: imageurl });
});

// (O) notification email works
const postMessages = asyncHandler(async (req, res) => {
  const {
    user,
    params: { messagesThreadId }
  } = req;
  const { message } = req.body;

  const document_thread = await req.db
    .model('Documentthread')
    .findById(messagesThreadId)
    .populate('student_id program_id outsourced_user_id');
  if (!document_thread) {
    logger.info('postMessages: Invalid message thread id');
    throw new ErrorResponse(404, 'Thread Id not found');
  }

  if (document_thread.isFinalVersion) {
    logger.info('postMessages: thread is closed! Please refresh!');
    throw new ErrorResponse(403, ' thread is closed! Please refresh!');
  }
  try {
    JSON.parse(message);
  } catch (e) {
    logger.error(`Thread message collapse ${message}`);
    throw new ErrorResponse(400, 'message collapse');
  }
  // Check student can only access their own thread!!!!
  if (user.role === Role.Student) {
    if (document_thread.student_id._id.toString() !== user._id.toString()) {
      logger.error('getMessages: Unauthorized request!');
      throw new ErrorResponse(403, 'Unauthorized request');
    }
  }
  let newfile = [];
  if (req.files) {
    for (let i = 0; i < req.files.length; i += 1) {
      const filePath = req.files[i].key.split('/');
      const fileName = filePath[2];

      newfile.push({
        name: fileName,
        path: req.files[i].key
      });
      // Check for duplicate file extensions
      const fileExtensions = req.files.map(
        (file) => file.mimetype.split('/')[1]
      );
      const uniqueFileExtensions = new Set(fileExtensions);
      if (fileExtensions.length !== uniqueFileExtensions.size) {
        logger.error('Error: Duplicate file extensions found!');
        throw new ErrorResponse(
          423,
          'Error: Duplicate file extensions found. Due to the system automatical naming mechanism, the files with same extension (said .pdf) will be overwritten. You can not upload 2 same files extension (2 .pdf or 2 .docx) at the same message. But 1 .pdf and 1 .docx are allowed.'
        );
      }
    }
  }

  const new_message = {
    user_id: user._id,
    message,
    createdAt: new Date(),
    file: newfile
  };
  // TODO: prevent abuse! if document_thread.messages.length > 30, too much message in a thread!
  document_thread.messages.push(new_message);
  document_thread.updatedAt = new Date();
  await document_thread.save();
  const document_thread2 = await req.db
    .model('Documentthread')
    .findById(messagesThreadId)
    .populate('student_id program_id messages.user_id');
  // in student (User) collections.
  const student = await req.db
    .model('Student')
    .findById(document_thread.student_id)
    .populate('applications.programId')
    .populate('editors agents', 'firstname lastname email archiv');

  if (document_thread.program_id) {
    const application = student.applications.find(
      ({ programId }) =>
        programId._id.toString() === document_thread.program_id._id.toString()
    );
    const doc_thread = application.doc_modification_thread.find(
      ({ doc_thread_id }) =>
        doc_thread_id.toString() === document_thread._id.toString()
    );
    if (doc_thread) {
      if (user.role === Role.Student) {
      }
      if (user.role !== Role.Student) {
        student.notification.isRead_new_cvmlrl_messsage = false;
      }
      doc_thread.latest_message_left_by_id = user._id.toString();
      doc_thread.updatedAt = new Date();
    }
  } else {
    const general_thread = student.generaldocs_threads.find(
      ({ doc_thread_id }) =>
        doc_thread_id.toString() === document_thread._id.toString()
    );
    if (general_thread) {
      if (user.role === Role.Student) {
      }
      if (user.role !== Role.Student) {
        student.notification.isRead_new_cvmlrl_messsage = false;
      }
      general_thread.latest_message_left_by_id = user._id.toString();
      general_thread.updatedAt = new Date();
    }
  }

  await student.save();
  res.status(200).send({ success: true, data: document_thread2 });

  if (user.role === Role.Student) {
    if (
      [
        'Supplementary_Form',
        'Curriculum_Analysis',
        'Form_A',
        'Form_B',
        'Others'
      ].includes(document_thread.file_type)
    ) {
      // Inform Agent
      if (isNotArchiv(student)) {
        for (let i = 0; i < student.agents.length; i += 1) {
          // Inform Agent
          if (isNotArchiv(student.agents[i])) {
            const agent_recipent = {
              firstname: student.agents[i].firstname,
              lastname: student.agents[i].lastname,
              address: student.agents[i].email
            };
            const agent_payload = {
              writer_firstname: user.firstname,
              writer_lastname: user.lastname,
              student_firstname: student.firstname,
              student_lastname: student.lastname,
              uploaded_documentname: document_thread.file_type,
              thread_id: document_thread._id.toString(),
              uploaded_updatedAt: new Date()
            };
            if (document_thread.program_id) {
              // if supplementary form, inform Agent.
              agent_payload.school = document_thread.program_id.school;
              agent_payload.program_name =
                document_thread.program_id.program_name;
              sendNewApplicationMessageInThreadEmail(
                agent_recipent,
                agent_payload
              );
            } else {
              // if supplementary form, inform Agent.
              sendNewGeneraldocMessageInThreadEmail(
                agent_recipent,
                agent_payload
              );
            }
          }
        }
      }
    }

    // If no editor, inform agent and editor lead to assign (Exclude Essay tasks)
    const Editor_Scope = Object.keys(EDITOR_SCOPE);
    if (Editor_Scope.includes(document_thread.file_type)) {
      if (!student.editors || student.editors.length === 0) {
        await req.db
          .model('Student')
          .findByIdAndUpdate(user._id, { needEditor: true }, {});
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
        const permissions = await req.db
          .model('Permission')
          .find({
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
          const editor_recipient = {
            firstname: student.editors[i].firstname,
            lastname: student.editors[i].lastname,
            address: student.editors[i].email
          };
          const editor_payload = {
            writer_firstname: user.firstname,
            writer_lastname: user.lastname,
            student_firstname: student.firstname,
            student_lastname: student.lastname,
            uploaded_documentname: document_thread.file_type,
            thread_id: document_thread._id.toString(),
            uploaded_updatedAt: new Date()
          };
          if (isNotArchiv(student) && isNotArchiv(student.editors[i])) {
            if (document_thread.program_id) {
              editor_payload.school = document_thread.program_id.school;
              editor_payload.program_name =
                document_thread.program_id.program_name;
              sendNewApplicationMessageInThreadEmail(
                editor_recipient,
                editor_payload
              );
            } else {
              sendNewGeneraldocMessageInThreadEmail(
                editor_recipient,
                editor_payload
              );
            }
          }
        }
      }
    }
    // Essay-related only notification: if no essay writer: infor agent and editor lead
    const Essay_Writer_Scope = Object.keys(ESSAY_WRITER_SCOPE);
    if (Essay_Writer_Scope.includes(document_thread.file_type)) {
      if (
        !document_thread.outsourced_user_id ||
        document_thread.outsourced_user_id.length === 0
      ) {
        await req.db
          .model('Student')
          .findByIdAndUpdate(user._id, { needEditor: true }, {});
        const payload = {
          student_firstname: student.firstname,
          student_id: student._id.toString(),
          student_lastname: student.lastname
        };
        for (let i = 0; i < student.agents.length; i += 1) {
          // inform active-agent
          if (isNotArchiv(student)) {
            sendAssignEssayWriterReminderEmail(
              {
                firstname: student.agents[i].firstname,
                lastname: student.agents[i].lastname,
                address: student.agents[i].email
              },
              payload
            );
          }
        }
        // inform editor-lead
        const permissions = await req.db
          .model('Permission')
          .find({
            canAssignEditors: true
          })
          .populate('user_id', 'firstname lastname email')
          .lean();
        if (permissions) {
          for (let x = 0; x < permissions.length; x += 1) {
            sendAssignEssayWriterReminderEmail(
              {
                firstname: permissions[x].user_id.firstname,
                lastname: permissions[x].user_id.lastname,
                address: permissions[x].user_id.email
              },
              payload
            );
          }
        }
      } else {
        // Inform outsourcer
        for (let i = 0; i < document_thread.outsourced_user_id.length; i += 1) {
          const outsourcer_recipient = {
            firstname: document_thread.outsourced_user_id[i].firstname,
            lastname: document_thread.outsourced_user_id[i].lastname,
            address: document_thread.outsourced_user_id[i].email
          };
          const outsourcer_payload = {
            writer_firstname: user.firstname,
            writer_lastname: user.lastname,
            student_firstname: student.firstname,
            student_lastname: student.lastname,
            uploaded_documentname: document_thread.file_type,
            thread_id: document_thread._id.toString(),
            uploaded_updatedAt: new Date()
          };
          if (
            isNotArchiv(student) &&
            isNotArchiv(document_thread.outsourced_user_id[i])
          ) {
            if (document_thread.program_id) {
              outsourcer_payload.school = document_thread.program_id.school;
              outsourcer_payload.program_name =
                document_thread.program_id.program_name;
              sendNewApplicationMessageInThreadEmail(
                outsourcer_recipient,
                outsourcer_payload
              );
            } else {
              sendNewGeneraldocMessageInThreadEmail(
                outsourcer_recipient,
                outsourcer_payload
              );
            }
          }
        }
      }
    }
    if (['Interview'].includes(document_thread.file_type)) {
      const interview = await req.db
        .model('Interview')
        .findOne({
          student_id: document_thread.student_id._id.toString(),
          program_id: document_thread.program_id._id.toString()
        })
        .populate('student_id trainer_id', 'firstname lastname email')
        .populate('program_id', 'school program_name degree semester')
        .lean();

      if (!interview.trainer_id || interview.trainer_id?.length === 0) {
        const permissions = await req.db
          .model('Permission')
          .find({
            canAssignEditors: true
          })
          .populate('user_id', 'firstname lastname email')
          .lean();
        if (permissions) {
          for (let x = 0; x < permissions.length; x += 1) {
            sendAssignTrainerReminderEmail(
              {
                firstname: permissions[x].user_id.firstname,
                lastname: permissions[x].user_id.lastname,
                address: permissions[x].user_id.email
              },
              {
                student_firstname: student.firstname,
                student_id: student._id.toString(),
                student_lastname: student.lastname,
                interview_id: interview._id.toString(),
                program: interview.program_id
              }
            );
          }
        }
      } else {
        for (let i = 0; i < interview.trainer_id?.length; i += 1) {
          // inform active-trainer
          if (isNotArchiv(student)) {
            if (isNotArchiv(interview.trainer_id[i])) {
              sendNewInterviewMessageInThreadEmail(
                {
                  firstname: interview.trainer_id[i].firstname,
                  lastname: interview.trainer_id[i].lastname,
                  address: interview.trainer_id[i].email
                },
                {
                  writer_firstname: user.firstname,
                  writer_lastname: user.lastname,
                  student_firstname: interview.student_id.firstname,
                  student_id: student._id.toString(),
                  student_lastname: student.lastname,
                  program: interview.program_id,
                  interview_id: interview._id.toString(),
                  uploaded_updatedAt: new Date()
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
    const student_recipient = {
      firstname: document_thread.student_id.firstname,
      lastname: document_thread.student_id.lastname,
      address: document_thread.student_id.email
    };
    const student_payload = {
      writer_firstname: user.firstname,
      writer_lastname: user.lastname,
      student_firstname: student.firstname,
      student_lastname: student.lastname,
      uploaded_documentname: document_thread.file_type,
      thread_id: document_thread._id.toString(),
      uploaded_updatedAt: new Date()
    };
    if (isNotArchiv(document_thread.student_id)) {
      if (document_thread.program_id) {
        student_payload.school = document_thread.program_id.school;
        student_payload.program_name = document_thread.program_id.program_name;
        student_payload.program = document_thread.program_id;
        if (['Interview'].includes(document_thread.file_type)) {
          const interview = await req.db.model('Interview').findOne({
            student_id: document_thread.student_id._id.toString(),
            program_id: document_thread.program_id._id.toString()
          });
          student_payload.interview_id = interview._id.toString();
          await sendNewInterviewMessageInThreadEmail(
            student_recipient,
            student_payload
          );
        } else {
          await sendNewApplicationMessageInThreadEmail(
            student_recipient,
            student_payload
          );
        }
      } else {
        await sendNewGeneraldocMessageInThreadEmail(
          student_recipient,
          student_payload
        );
      }
    }
  }

  if (user.role === Role.Agent || user.role === Role.Admin) {
    // Inform Editor
    const Essay_Writer_Scope = Object.keys(ESSAY_WRITER_SCOPE);
    if (Essay_Writer_Scope.includes(document_thread.file_type)) {
      for (let i = 0; i < document_thread.outsourced_user_id.length; i += 1) {
        const recepient = {
          firstname: document_thread.outsourced_user_id[i].firstname,
          lastname: document_thread.outsourced_user_id[i].lastname,
          address: document_thread.outsourced_user_id[i].email
        };
        const emailContent = {
          writer_firstname: user.firstname,
          writer_lastname: user.lastname,
          student_firstname: student.firstname,
          student_lastname: student.lastname,
          uploaded_documentname: document_thread.file_type,
          thread_id: document_thread._id.toString(),
          uploaded_updatedAt: new Date(),
          message
        };
        if (isNotArchiv(student)) {
          if (isNotArchiv(document_thread.outsourced_user_id[i])) {
            if (document_thread.program_id) {
              emailContent.school = document_thread.program_id.school;
              emailContent.program_name =
                document_thread.program_id.program_name;
              sendNewApplicationMessageInThreadEmail(recepient, emailContent);
            } else {
              sendNewGeneraldocMessageInThreadEmail(recepient, emailContent);
            }
          }
        }
      }
    }

    const Editor_Scope = Object.keys(EDITOR_SCOPE);
    if (Editor_Scope.includes(document_thread.file_type)) {
      for (let i = 0; i < student.editors.length; i += 1) {
        const recipient = {
          firstname: student.editors[i].firstname,
          lastname: student.editors[i].lastname,
          address: student.editors[i].email
        };
        const payload = {
          writer_firstname: user.firstname,
          writer_lastname: user.lastname,
          student_firstname: student.firstname,
          student_lastname: student.lastname,
          uploaded_documentname: document_thread.file_type,
          thread_id: document_thread._id.toString(),
          uploaded_updatedAt: new Date(),
          message
        };
        if (isNotArchiv(student)) {
          if (isNotArchiv(student.editors[i])) {
            if (document_thread.program_id) {
              payload.school = document_thread.program_id.school;
              payload.program_name = document_thread.program_id.program_name;
              sendNewApplicationMessageInThreadEmail(recipient, payload);
            } else {
              sendNewGeneraldocMessageInThreadEmail(recipient, payload);
            }
          }
        }
      }
    }

    if (['Interview'].includes(document_thread.file_type)) {
      const interview = await req.db
        .model('Interview')
        .findOne({
          student_id: document_thread.student_id._id.toString(),
          program_id: document_thread.program_id._id.toString()
        })
        .populate('student_id trainer_id', 'firstname lastname email')
        .populate('program_id', 'school program_name degree semester')
        .lean();
      for (let i = 0; i < interview.trainer_id?.length; i += 1) {
        // inform active-trainer
        if (isNotArchiv(student)) {
          if (isNotArchiv(interview.trainer_id[i])) {
            sendNewInterviewMessageInThreadEmail(
              {
                firstname: interview.trainer_id[i].firstname,
                lastname: interview.trainer_id[i].lastname,
                address: interview.trainer_id[i].email
              },
              {
                writer_firstname: user.firstname,
                writer_lastname: user.lastname,
                student_firstname: interview.student_id.firstname,
                student_id: student._id.toString(),
                student_lastname: student.lastname,
                program: interview.program_id,
                interview_id: interview._id.toString(),
                uploaded_updatedAt: new Date()
              }
            );
          }
        }
      }
    }

    // Inform student
    if (isNotArchiv(document_thread.student_id)) {
      const student_recipient = {
        firstname: document_thread.student_id.firstname,
        lastname: document_thread.student_id.lastname,
        address: document_thread.student_id.email
      };
      const student_payload = {
        writer_firstname: user.firstname,
        writer_lastname: user.lastname,
        student_firstname: student.firstname,
        student_lastname: student.lastname,
        uploaded_documentname: document_thread.file_type,
        thread_id: document_thread._id.toString(),
        uploaded_updatedAt: new Date()
      };
      if (document_thread.program_id) {
        student_payload.school = document_thread.program_id.school;
        student_payload.program_name = document_thread.program_id.program_name;
        student_payload.program = document_thread.program_id;
        if (['Interview'].includes(document_thread.file_type)) {
          const interview = await req.db.model('Interview').findOne({
            student_id: document_thread.student_id._id.toString(),
            program_id: document_thread.program_id._id.toString()
          });
          student_payload.interview_id = interview._id.toString();
          sendNewInterviewMessageInThreadEmail(
            student_recipient,
            student_payload
          );
        } else {
          sendNewApplicationMessageInThreadEmail(
            student_recipient,
            student_payload
          );
        }
      } else {
        await sendNewGeneraldocMessageInThreadEmail(
          student_recipient,
          student_payload
        );
      }
    }
  }
});

const getMessageImageDownload = asyncHandler(async (req, res) => {
  const {
    params: { messagesThreadId, studentId, file_name }
  } = req;

  const fileKey = path
    .join(studentId, messagesThreadId, 'img', file_name)
    .replace(/\\/g, '/');

  const cache_key = `${studentId}${req.originalUrl.split('/')[6]}`;
  const value = one_month_cache.get(cache_key); // image name
  if (value === undefined) {
    const response = await getS3Object(AWS_S3_BUCKET_NAME, fileKey);
    const success = one_month_cache.set(cache_key, Buffer.from(response));
    if (success) {
      logger.info('image cache set successfully');
    }
    res.attachment(file_name);
    res.end(response);
  } else {
    logger.info('cache hit');
    res.attachment(file_name);
    return res.end(value);
  }
});

// Download file in a message in a thread
const getMessageFileDownload = asyncHandler(async (req, res) => {
  const {
    user,
    params: { studentId, messagesThreadId, file_key }
  } = req;

  const document_thread = await req.db
    .model('Documentthread')
    .findById(messagesThreadId);
  if (!document_thread) {
    logger.error('getMessageFileDownload: thread not found!');
    throw new ErrorResponse(404, 'Thread Id not found');
  }

  if (
    user.role === Role.Student &&
    document_thread.file_type === 'Essay' &&
    !document_thread.isOriginAuthorDeclarationConfirmedByStudent
  ) {
    logger.error(
      'getMessageFileDownload: Please declare origin author and condition term.'
    );
    throw new ErrorResponse(
      403,
      'Please declare origin author and condition term.'
    );
  }

  // (O) Multitenancy check
  if (
    user.role === Role.Student &&
    document_thread.student_id.toString() !== user._id.toString()
  ) {
    logger.error('getMessageFileDownload: Not authorized!');
    throw new ErrorResponse(403, 'Not authorized');
  }

  const fileKey = path
    .join(studentId, messagesThreadId, file_key)
    .replace(/\\/g, '/');
  logger.info('Trying to download message file', fileKey);

  // messageid + extension
  const cache_key = `${encodeURIComponent(fileKey)}`;
  const value = one_month_cache.get(cache_key); // file name
  if (value === undefined) {
    const response = await getS3Object(AWS_S3_BUCKET_NAME, fileKey);
    const success = one_month_cache.set(cache_key, Buffer.from(response));
    if (success) {
      logger.info('thread file cache set successfully');
    }
    res.attachment(file_key);
    return res.end(response);
  }

  logger.info('thread file cache hit');
  res.attachment(file_key);
  return res.end(value);
});

const putOriginAuthorConfirmedByStudent = asyncHandler(async (req, res) => {
  const {
    params: { messagesThreadId },
    body: { checked }
  } = req;

  const document_thread = await req.db
    .model('Documentthread')
    .findByIdAndUpdate(
      messagesThreadId,
      {
        isOriginAuthorDeclarationConfirmedByStudent: checked,
        isOriginAuthorDeclarationConfirmedByStudentTimestamp: new Date()
      },
      { new: true }
    );

  if (!document_thread) {
    logger.error(
      'putOriginAuthorConfirmedByStudent: Invalid message thread id'
    );
    throw new ErrorResponse(404, 'Thread Id not found');
  }

  res.status(200).send({
    success: true
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

  const document_thread = await req.db
    .model('Documentthread')
    .findById(messagesThreadId);
  const student = await req.db
    .model('Student')
    .findById(studentId)
    .populate('applications.programId generaldocs_threads.doc_thread_id')
    .populate(
      'applications.doc_modification_thread.doc_thread_id',
      'file_type updatedAt'
    );
  if (!document_thread) {
    logger.error('SetStatusMessagesThread: Invalid message thread id');
    throw new ErrorResponse(404, 'Thread not found');
  }
  if (!student) {
    logger.error('SetStatusMessagesThread: Invalid student id');
    throw new ErrorResponse(404, 'Student not found');
  }
  logger.info('program_id ', program_id);
  if (program_id) {
    const student_application = student.applications.find(
      (application) => application.programId._id.toString() === program_id
    );
    if (!student_application) {
      logger.error('SetStatusMessagesThread: application not found');
      throw new ErrorResponse(404, 'Application not found');
    }

    const application_thread = student_application.doc_modification_thread.find(
      (thread) => thread.doc_thread_id._id.toString() === messagesThreadId
    );
    if (!application_thread) {
      logger.error('SetStatusMessagesThread: application thread not found');
      throw new ErrorResponse(404, 'Thread not found');
    }

    application_thread.isFinalVersion = !application_thread.isFinalVersion;
    application_thread.updatedAt = new Date();
    document_thread.isFinalVersion = application_thread.isFinalVersion;
    document_thread.updatedAt = new Date();
    await document_thread.save();
    await student.save();

    res.status(200).send({
      success: true,
      data: {
        isFinalVersion: document_thread.isFinalVersion,
        updatedAt: document_thread.updatedAt
      }
    });
    if (document_thread.isFinalVersion) {
      // cleanup
      logger.info('cleanup prgraom thread');
      const collection = 'Documentthread';
      const userFolder = 'student_id';
      await threadS3GarbageCollector(
        req,
        collection,
        userFolder,
        messagesThreadId
      );
    }
    if (isNotArchiv(student)) {
      await sendSetAsFinalProgramSpecificFileForStudentEmail(
        {
          firstname: student.firstname,
          lastname: student.lastname,
          address: student.email
        },
        {
          editor_firstname: user.firstname,
          editor_lastname: user.lastname,
          school: student_application.programId.school,
          program_name: student_application.programId.program_name,
          uploaded_documentname: application_thread.doc_thread_id.file_type,
          uploaded_updatedAt: new Date(),
          thread_id: messagesThreadId,
          isFinalVersion: application_thread.isFinalVersion
        }
      );
    }

    const student3 = await req.db
      .model('Student')
      .findById(studentId)
      .populate('agents', 'firstname lastname email archiv');

    const validAgents = student3.agents.filter(
      (agent) => isNotArchiv(student3) && isNotArchiv(agent)
    );
    // Create an array of promises for sending emails
    const emailPromises = validAgents.map((agent) =>
      sendSetAsFinalProgramSpecificFileForAgentEmail(
        {
          firstname: agent.firstname,
          lastname: agent.lastname,
          address: agent.email
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
          thread_id: messagesThreadId,
          isFinalVersion: application_thread.isFinalVersion
        }
      )
    );

    // Wait for all email promises to be resolved
    await Promise.all(emailPromises);
  } else {
    const generaldocs_thread = student.generaldocs_threads.find(
      (thread) => thread.doc_thread_id._id == messagesThreadId
    );
    if (!generaldocs_thread) {
      logger.error('SetStatusMessagesThread: generaldoc thread not found');
      throw new ErrorResponse(404, 'Thread not found');
    }
    generaldocs_thread.isFinalVersion = !generaldocs_thread.isFinalVersion;
    generaldocs_thread.updatedAt = new Date();
    document_thread.isFinalVersion = generaldocs_thread.isFinalVersion;
    document_thread.updatedAt = new Date();
    await document_thread.save();
    await student.save();
    res.status(200).send({
      success: true,
      data: {
        isFinalVersion: document_thread.isFinalVersion,
        updatedAt: document_thread.updatedAt
      }
    });
    if (document_thread.isFinalVersion) {
      // cleanup
      logger.info('cleanup cv');
      const collection = 'Documentthread';
      const userFolder = 'student_id';
      await threadS3GarbageCollector(
        req,
        collection,
        userFolder,
        messagesThreadId
      );
    }
    if (isNotArchiv(student)) {
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
          thread_id: generaldocs_thread.doc_thread_id._id?.toString(),
          isFinalVersion: generaldocs_thread.isFinalVersion
        }
      );
    }

    const student3 = await req.db
      .model('Student')
      .findById(studentId)
      .populate('agents', 'firstname lastname email archiv');

    for (let i = 0; i < student.agents.length; i += 1) {
      if (isNotArchiv(student3)) {
        if (isNotArchiv(student3.agents[i])) {
          await sendSetAsFinalGeneralFileForAgentEmail(
            {
              firstname: student3.agents[i].firstname,
              lastname: student3.agents[i].lastname,
              address: student3.agents[i].email
            },
            {
              student_firstname: student3.firstname,
              student_lastname: student3.lastname,
              student_id: student3._id.toString(),
              editor_firstname: user.firstname,
              editor_lastname: user.lastname,
              thread_id: generaldocs_thread.doc_thread_id._id?.toString(),
              uploaded_documentname: generaldocs_thread.doc_thread_id.file_type,
              uploaded_updatedAt: new Date(),
              isFinalVersion: generaldocs_thread.isFinalVersion
            }
          );
        }
      }
    }
  }
});

const deleteGeneralThread = asyncHandler(async (req, studentId, threadId) => {
  // Delete folder
  let directory = path.join(studentId, threadId);
  logger.info('Trying to delete message thread and folder');
  directory = directory.replace(/\\/g, '/');

  await emptyS3Directory(AWS_S3_BUCKET_NAME, directory);

  // Start a session for the transaction
  const session = await req.db.startSession();
  session.startTransaction();

  try {
    await req.db.model('Documentthread').findByIdAndDelete(threadId);
    await req.db.model('Student').findByIdAndUpdate(studentId, {
      $pull: {
        generaldocs_threads: { doc_thread_id: { _id: threadId } }
      }
    });

    // Commit the transaction
    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    // If any operation fails, abort the transaction
    await session.abortTransaction();
    await session.endSession();
    logger.error('Failed to delete message thread and folder', error);
    throw error;
  }
});

// () TODO email : notification
const handleDeleteGeneralThread = asyncHandler(async (req, res) => {
  const {
    params: { messagesThreadId, studentId }
  } = req;

  const to_be_delete_thread = await req.db
    .model('Documentthread')
    .findById(messagesThreadId);
  const student = await req.db.model('Student').findById(studentId);

  if (!to_be_delete_thread) {
    logger.error('handleDeleteGeneralThread: Invalid message thread id');
    throw new ErrorResponse(404, 'Message not found');
  }
  if (!student) {
    logger.error('handleDeleteGeneralThread: Invalid student id id');
    throw new ErrorResponse(404, 'Student not found');
  }

  await deleteGeneralThread(req, studentId, messagesThreadId);
  res.status(200).send({ success: true });
});

// (-) TODO email : notification
const handleDeleteProgramThread = asyncHandler(async (req, res) => {
  const {
    params: { messagesThreadId, program_id, studentId }
  } = req;

  const to_be_delete_thread = await req.db
    .model('Documentthread')
    .findById(messagesThreadId);
  if (!to_be_delete_thread) {
    logger.error('handleDeleteProgramThread: Invalid message thread id!');
    throw new ErrorResponse(404, 'Message not found');
  }

  const student = await req.db.model('Student').findById(studentId);
  if (!student) {
    logger.error('handleDeleteProgramThread: Invalid student id!');
    throw new ErrorResponse(404, 'Student not found');
  }

  await deleteApplicationThread(
    {
      StudentModel: req.db.model('Student'),
      DocumentthreadModel: req.db.model('Documentthread'),
      surveyInputModel: req.db.model('surveyInput')
    },
    studentId,
    program_id,
    messagesThreadId
  );
  res.status(200).send({ success: true });
});

// (-) TODO email : no notification needed
const deleteAMessageInThread = asyncHandler(async (req, res) => {
  const {
    user,
    params: { messagesThreadId, messageId }
  } = req;

  const thread = await req.db
    .model('Documentthread')
    .findById(messagesThreadId);
  if (!thread) {
    logger.error('deleteAMessageInThread : Invalid message thread id');
    throw new ErrorResponse(404, 'Thread not found');
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
    throw new ErrorResponse(404, 'Message not found');
  }
  // Prevent multitenant
  if (msg.user_id.toString() !== user._id.toString()) {
    logger.error(
      'deleteAMessageInThread : You can only delete your own message.'
    );
    throw new ErrorResponse(409, 'You can only delete your own message.');
  }

  // Messageid + extension (because extension is unique per message id)
  try {
    if (msg.file.filter((file) => file.path !== '')?.length > 0) {
      await deleteS3Objects({
        bucketName: AWS_S3_BUCKET_NAME,
        objectKeys: msg.file
          .filter((file) => file.path !== '')
          .map((file) => ({ Key: file.path }))
      });
    }
  } catch (err) {
    if (err) {
      logger.error('delete thread files: ', err);
      throw new ErrorResponse(500, 'Error occurs while deleting thread files');
    }
  }

  for (let i = 0; i < msg.file.length; i += 1) {
    const cache_key = `${encodeURIComponent(msg.file[i].path)}`;
    const value = one_month_cache.del(cache_key);
    if (value === 1) {
      logger.info('file cache key deleted successfully');
    }
  }
  // Don't need so delete in S3 , will delete by garbage collector
  await req.db.model('Documentthread').findByIdAndUpdate(messagesThreadId, {
    $pull: {
      messages: { _id: messageId }
    }
  });

  res.status(200).send({ success: true });

  // update latest_message_left_by_id
  const updated_thread = await req.db
    .model('Documentthread')
    .findById(messagesThreadId);

  const student = await req.db.model('Student').findById(thread.student_id);
  const application = student.applications.find((application) =>
    application.doc_modification_thread.some(
      (thread) => thread.doc_thread_id.toString() === messagesThreadId
    )
  );
  if (!application) {
    const t = student.generaldocs_threads.find(
      (tt) => tt.doc_thread_id.toString() === messagesThreadId
    );
    if (t) {
      if (updated_thread.messages.length > 0) {
        t.latest_message_left_by_id =
          updated_thread.messages[
            updated_thread.messages.length - 1
          ].user_id.toString();
        t.updatedAt =
          updated_thread.messages[updated_thread.messages.length - 1].updatedAt;
      } else {
        t.latest_message_left_by_id = '';
      }
    }
  } else {
    const t = application.doc_modification_thread.find(
      (tt) => tt.doc_thread_id.toString() === messagesThreadId
    );
    if (t) {
      if (updated_thread.messages.length > 0) {
        t.latest_message_left_by_id =
          updated_thread.messages[
            updated_thread.messages.length - 1
          ].user_id.toString();
        t.updatedAt =
          updated_thread.messages[updated_thread.messages.length - 1].updatedAt;
      } else {
        t.latest_message_left_by_id = '';
      }
    }
  }
  await student.save();
});

const assignEssayWritersToEssayTask = asyncHandler(async (req, res, next) => {
  const {
    params: { messagesThreadId },
    body: editorsId
  } = req;
  const keys = Object.keys(editorsId);
  const essayDocumentThreads = await req.db
    .model('Documentthread')
    .findById(messagesThreadId)
    .populate('student_id')
    .populate({
      path: 'student_id',
      populate: {
        path: 'agents',
        model: 'User'
      }
    })
    .populate(
      'program_id',
      'school program_name degree semester application_deadline'
    )
    .select('-messages');
  // TODO: data validation for studentId, editorsId
  let updated_essay_writer_id = [];
  let before_change_essay_writer_arr = essayDocumentThreads.outsourced_user_id;
  let to_be_informed_essay_writer = [];
  let updated_editor = [];
  for (let i = 0; i < keys.length; i += 1) {
    if (editorsId[keys[i]]) {
      updated_essay_writer_id.push(keys[i]);

      const editor = await req.db.model('Editor').findById(keys[i]);
      updated_editor.push({
        firstname: editor.firstname,
        lastname: editor.lastname,
        email: editor.email
      });
      if (
        before_change_essay_writer_arr &&
        !before_change_essay_writer_arr.includes(keys[i])
      ) {
        to_be_informed_essay_writer.push({
          firstname: editor.firstname,
          lastname: editor.lastname,
          archiv: editor.archiv,
          email: editor.email
        });
      } else if (!before_change_essay_writer_arr) {
        to_be_informed_essay_writer.push({
          firstname: editor.firstname,
          lastname: editor.lastname,
          archiv: editor.archiv,
          email: editor.email
        });
      }
    }
  }
  // student.notification.isRead_new_editor_assigned = false;
  // Update the outsourced_user_id field for each document
  essayDocumentThreads.outsourced_user_id = updated_essay_writer_id;
  // Save the changes to the document
  await essayDocumentThreads.save();

  const studentId = essayDocumentThreads.student_id;
  const student = await req.db.model('Student').findById(studentId);
  const student_upated = await req.db
    .model('Student')
    .findById(studentId)
    .populate('applications.programId agents editors')
    .populate(
      'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
      '-messages'
    )
    .exec();
  const essayDocumentThreads_Updated = await req.db
    .model('Documentthread')
    .findById(messagesThreadId)
    .populate('student_id outsourced_user_id')
    .populate({
      path: 'student_id',
      populate: {
        path: 'agents',
        model: 'User'
      }
    })
    .populate(
      'program_id',
      'school program_name degree semester application_deadline'
    )
    .select('-messages')
    .lean();
  res.status(200).send({ success: true, data: essayDocumentThreads_Updated });

  for (let i = 0; i < to_be_informed_essay_writer.length; i += 1) {
    if (isNotArchiv(student)) {
      if (isNotArchiv(to_be_informed_essay_writer[i])) {
        await informEssayWriterNewEssayEmail(
          {
            firstname: to_be_informed_essay_writer[i].firstname,
            lastname: to_be_informed_essay_writer[i].lastname,
            address: to_be_informed_essay_writer[i].email
          },
          {
            std_firstname: student.firstname,
            std_lastname: student.lastname,
            std_id: student._id.toString(),
            thread_id: essayDocumentThreads._id.toString(),
            file_type: essayDocumentThreads.file_type,
            program: essayDocumentThreads.program_id
          }
        );
      }
    }
  }
  // TODO: inform Agent for assigning editor.
  for (let i = 0; i < student_upated.agents.length; i += 1) {
    if (isNotArchiv(student)) {
      if (isNotArchiv(student_upated.agents[i])) {
        await informAgentEssayAssignedEmail(
          {
            firstname: student_upated.agents[i].firstname,
            lastname: student_upated.agents[i].lastname,
            address: student_upated.agents[i].email
          },
          {
            std_firstname: student.firstname,
            std_lastname: student.lastname,
            std_id: student._id.toString(),
            thread_id: essayDocumentThreads._id.toString(),
            file_type: essayDocumentThreads.file_type,
            essay_writers: to_be_informed_essay_writer,
            program: essayDocumentThreads.program_id
          }
        );
      }
    }
  }

  if (updated_editor.length !== 0) {
    if (isNotArchiv(student)) {
      await informStudentTheirEssayWriterEmail(
        {
          firstname: student.firstname,
          lastname: student.lastname,
          address: student.email
        },
        {
          program: essayDocumentThreads.program_id,
          thread_id: essayDocumentThreads._id.toString(),
          file_type: essayDocumentThreads.file_type,
          editors: updated_editor
        }
      );
    }
  }
  next();
});

const clearEssayWriters = asyncHandler(async (req, res, next) => {
  await req.db.model('Documentthread').updateMany(
    // Match documents where outsourced_user_id field exists
    { outsourced_user_id: { $exists: true } },
    { $set: { outsourced_user_id: [] } } // Set outsourced_user_id field to an empty array
  );
  res.status(200).send({ success: true });
  next();
});

const getAllActiveEssays = asyncHandler(async (req, res, next) => {
  try {
    const matchingDocuments = [];
    const { user } = req;
    if (user.role === Role.Student) {
      const essayDocumentThreads = await req.db
        .model('Documentthread')
        .find(
          { student_id: user._id, file_type: 'Essay' },
          { messages: { $slice: -1 } }
        )
        .populate('student_id outsourced_user_id')
        .populate({
          path: 'student_id messages.user_id',
          select: '-attributes',
          populate: {
            path: 'agents',
            model: 'User'
          }
        })
        .populate('messages.user_id', 'firstname lastname role')
        .populate(
          'program_id',
          'school program_name degree application_deadline semester lang'
        )
        .lean();

      for (const doc of essayDocumentThreads) {
        if (doc.student_id && !doc.student_id.archiv) {
          for (const application of doc.student_id?.applications || []) {
            if (application.decided === 'O') {
              for (const thread of application?.doc_modification_thread || []) {
                if (doc._id.toString() === thread.doc_thread_id.toString()) {
                  matchingDocuments.push(doc);
                  break;
                }
              }
            }
          }
        }
      }
      res.status(200).send({ success: true, data: matchingDocuments });
    } else {
      const essayDocumentThreads = await req.db
        .model('Documentthread')
        .find(
          {
            file_type: 'Essay'
          },
          { messages: { $slice: -1 } }
        )
        .populate('student_id outsourced_user_id')
        .populate({
          path: 'student_id messages.user_id',
          populate: {
            path: 'agents editors',
            model: 'User'
          }
        })
        .populate('messages.user_id', 'firstname lastname role')
        .populate(
          'program_id',
          'school program_name degree application_deadline semester'
        )
        .lean();

      for (const doc of essayDocumentThreads) {
        if (doc.student_id && !doc.student_id.archiv) {
          for (const application of doc.student_id?.applications || []) {
            if (application.decided === 'O') {
              for (const thread of application?.doc_modification_thread || []) {
                if (doc._id.toString() === thread.doc_thread_id.toString()) {
                  matchingDocuments.push(doc);
                  break;
                }
              }
            }
          }
        }
      }
      res.status(200).send({ success: true, data: matchingDocuments });
    }
    next();
    // Handle matched data
  } catch (error) {
    logger.error(error);
    throw new ErrorResponse(403, 'Invalid ThreadId');
  }
});

const IgnoreMessageInDocumentThread = asyncHandler(async (req, res, next) => {
  const {
    params: { messagesThreadId, messageId, ignoreMessageState }
  } = req;
  const { message } = req.body;
  const thread = await req.db
    .model('Documentthread')
    .updateOne(
      { 'messages._id': new mongoose.Types.ObjectId(messageId) },
      { $set: { 'messages.$.ignore_message': ignoreMessageState } }
    );
  res.status(200).send({ success: true, data: thread });
  next();
});

module.exports = {
  getAllCVMLRLOverview,
  getSurveyInputs,
  postSurveyInput,
  putSurveyInput,
  resetSurveyInput,
  getCVMLRLOverview,
  initGeneralMessagesThread,
  initApplicationMessagesThread,
  getMessages,
  getMessageImageDownload,
  getMessageFileDownload,
  postImageInThread,
  postMessages,
  putThreadFavorite,
  putOriginAuthorConfirmedByStudent,
  SetStatusMessagesThread,
  handleDeleteGeneralThread,
  handleDeleteProgramThread,
  deleteAMessageInThread,
  getAllActiveEssays,
  assignEssayWritersToEssayTask,
  clearEssayWriters,
  IgnoreMessageInDocumentThread
};
