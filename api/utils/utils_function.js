/* eslint-disable no-await-in-loop */
const async = require('async');
const path = require('path');
const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const { Agent, Student, Editor, User } = require('../models/User');
const { Documentthread } = require('../models/Documentthread');
const Documentation = require('../models/Documentation');
const {
  StudentTasksReminderEmail,
  AgentTasksReminderEmail,
  EditorTasksReminderEmail,
  StudentApplicationsDeadline_Within30Days_DailyReminderEmail,
  StudentCVMLRLEssay_NoReplyAfter3Days_DailyReminderEmail,
  EditorCVMLRLEssay_NoReplyAfter7Days_DailyReminderEmail,
  AgentCVMLRLEssay_NoReplyAfterXDays_DailyReminderEmail,
  AgentApplicationsDeadline_Within30Days_DailyReminderEmail,
  EditorCVMLRLEssayDeadline_Within30Days_DailyReminderEmail,
  StudentCourseSelectionReminderEmail,
  AgentCourseSelectionReminderEmail
} = require('../services/regular_system_emails');
const logger = require('../services/logger');
const {
  does_editor_have_pending_tasks,
  is_deadline_within30days_needed,
  is_cv_ml_rl_reminder_needed,
  isNotArchiv,
  needUpdateCourseSelection
} = require('../constants');

const { AWS_S3_MONGODB_BACKUP_SNAPSHOT } = require('../config');
const { Program } = require('../models/Program');
const { Template } = require('../models/Template');
const Expense = require('../models/Expense');
const Course = require('../models/Course');
const { Basedocumentationslink } = require('../models/Basedocumentationslink');
const Docspage = require('../models/Docspage');
const Internaldoc = require('../models/Internaldoc');
const Note = require('../models/Note');
const {
  sendAssignEditorReminderEmail,
  MeetingReminderEmail,
  UnconfirmedMeetingReminderEmail
} = require('../services/email');
const Permission = require('../models/Permission');
const { Communication } = require('../models/Communication');
const { s3 } = require('../aws/index');
const Event = require('../models/Event');

const emptyS3Directory = async (bucket, dir) => {
  const listParams = {
    Bucket: bucket,
    Prefix: dir
  };

  const listedObjects = await s3.listObjectsV2(listParams).promise();

  if (listedObjects.Contents.length === 0) return;

  const deleteParams = {
    Bucket: bucket,
    Delete: { Objects: [] }
  };

  listedObjects.Contents.forEach(({ Key }) => {
    deleteParams.Delete.Objects.push({ Key });
  });
  logger.warn(JSON.stringify(deleteParams));
  await s3.deleteObjects(deleteParams).promise();

  if (listedObjects.IsTruncated) await emptyS3Directory(bucket, dir);
};

const TasksReminderEmails_Editor_core = async () => {
  // Only inform active student
  // TODO: deactivate or change email frequency (default 1 week.)
  const editors = await Editor.find();

  for (let j = 0; j < editors.length; j += 1) {
    const editor_students = await Student.find({
      editors: editors[j]._id,
      $or: [{ archiv: { $exists: false } }, { archiv: false }]
    })
      .populate('agents editors', 'firstname lastname email')
      .populate('applications.programId')
      .populate(
        'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
        '-messages'
      )
      .select('-notification');
    if (editor_students.length > 0) {
      if (does_editor_have_pending_tasks(editor_students, editors[j])) {
        if (isNotArchiv(editors[j])) {
          await EditorTasksReminderEmail(
            {
              firstname: editors[j].firstname,
              lastname: editors[j].lastname,
              address: editors[j].email
            },
            { students: editor_students, editor: editors[j] }
          );
        }
      }
    }
  }
  logger.info('Editor reminder email sent');
};

const TasksReminderEmails_Agent_core = async () => {
  // Only inform active student
  // TODO: deactivate or change email frequency (default 1 week.)
  const agents = await Agent.find();

  for (let j = 0; j < agents.length; j += 1) {
    const agent_students = await Student.find({
      agents: agents[j]._id,
      $or: [{ archiv: { $exists: false } }, { archiv: false }]
    })
      .populate('agents editors', 'firstname lastname email')
      .populate('applications.programId')
      .populate(
        'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
        '-messages'
      )
      .select('-notification')
      .lean()
      .exec();
    if (agent_students.length > 0) {
      if (isNotArchiv(agents[j])) {
        await AgentTasksReminderEmail(
          {
            firstname: agents[j].firstname,
            lastname: agents[j].lastname,
            address: agents[j].email
          },
          { students: agent_students, agent: agents[j] }
        );
      }
    }
  }
  logger.info('Agent reminder email sent');
};

const TasksReminderEmails_Student_core = async () => {
  // Only inform active student
  // TODO: deactivate or change email frequency (default 1 week.)
  const students = await Student.find({
    $or: [{ archiv: { $exists: false } }, { archiv: false }]
  })
    .populate('agents editors', 'firstname lastname email')
    .populate('applications.programId')
    .populate(
      'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
      '-messages'
    )
    .select('-notification')
    .lean(); // Only active student, not archiv

  for (let j = 0; j < students.length; j += 1) {
    await StudentTasksReminderEmail(
      {
        firstname: students[j].firstname,
        lastname: students[j].lastname,
        address: students[j].email
      },
      { student: students[j] }
    );
  }
  logger.info('Student reminder email sent');
};

// Weekly called.
const TasksReminderEmails = async () => {
  await TasksReminderEmails_Editor_core();
  await TasksReminderEmails_Student_core();
  await TasksReminderEmails_Agent_core();
};

const events_transformer = (events) => {
  const transformedDocuments = events.map((event) => ({
    ...event,
    _id: { $oid: event._id.toString() },
    requester_id:
      event.requester_id &&
      event.requester_id.map((req_id) => ({ $oid: req_id.toString() })),
    receiver_id:
      event.receiver_id &&
      event.receiver_id.map((rev_id) => ({ $oid: rev_id.toString() })),
    start: event.start && { $date: event.start },
    end: event.end && { $date: event.end },
    updatedAt: event.updatedAt && { $date: event.updatedAt },
    createdAt: event.createdAt && { $date: event.createdAt }
  }));
  return transformedDocuments;
};
const users_transformer = (users) => {
  const transformedDocuments = users.map((user) => ({
    ...user,
    _id: { $oid: user._id.toString() },
    lastLoginAt: user.lastLoginAt && { $date: user.lastLoginAt },
    updatedAt: user.updatedAt && { $date: user.updatedAt },
    createdAt: user.createdAt && { $date: user.createdAt },
    // students are Deprecated
    students:
      user.students &&
      user.students.map((agent) => ({ $oid: agent.toString() })),
    agents:
      user.agents && user.agents.map((agent) => ({ $oid: agent.toString() })),
    agent_notification: user.agent_notification && {
      ...user.agent_notification,
      isRead_new_base_docs_uploaded:
        user.agent_notification.isRead_new_base_docs_uploaded.map(
          (is_new_bd_uploaded) => ({
            ...is_new_bd_uploaded,
            _id: { $oid: is_new_bd_uploaded._id.toString() }
          })
        )
    },
    editors:
      user.editors &&
      user.editors.map((editor) => ({
        $oid: editor.toString()
      })),
    academic_background: user.academic_background && {
      ...user.academic_background,
      university: user.academic_background.university && {
        ...user.academic_background.university,
        updatedAt: user.academic_background.university.updatedAt && {
          $date: user.academic_background.university.updatedAt
        }
      },
      language: user.academic_background.language && {
        ...user.academic_background.language,
        updatedAt: user.academic_background.language.updatedAt && {
          $date: user.academic_background.language.updatedAt
        }
      }
    },
    application_preference: user.application_preference && {
      ...user.application_preference,
      updatedAt: user.application_preference.updatedAt && {
        $date: user.application_preference.updatedAt
      }
    },
    applications:
      user.applications &&
      user.applications.map((application) => ({
        ...application,
        _id: { $oid: application._id.toString() },
        programId: { $oid: application.programId.toString() },
        uni_assist: {
          ...application.uni_assist,
          updatedAt: application.uni_assist.updatedAt && {
            $date: application.uni_assist.updatedAt
          }
        },
        doc_modification_thread: application.doc_modification_thread.map(
          (thread) => ({
            ...thread,
            _id: { $oid: thread._id.toString() },
            doc_thread_id: { $oid: thread.doc_thread_id.toString() },
            updatedAt: thread.updatedAt && { $date: thread.updatedAt },
            createdAt: thread.createdAt && { $date: thread.createdAt }
          })
        )
      })),
    generaldocs_threads:
      user.generaldocs_threads &&
      user.generaldocs_threads.map((general_doc) => ({
        ...general_doc,
        _id: { $oid: general_doc._id.toString() },
        doc_thread_id: { $oid: general_doc.doc_thread_id.toString() },
        updatedAt: general_doc.updatedAt && { $date: general_doc.updatedAt },
        createdAt: general_doc.createdAt && { $date: general_doc.createdAt }
      })),
    profile:
      user.profile &&
      user.profile.map((prof) => ({
        ...prof,
        _id: { $oid: prof._id.toString() },
        updatedAt: prof.updatedAt && { $date: prof.updatedAt }
      }))
  }));
  return transformedDocuments;
};

const communications_transformer = (communications) => {
  const transformedDocuments = communications.map((communication) => ({
    ...communication,
    _id: { $oid: communication._id.toString() },
    student_id: { $oid: communication.student_id.toString() },
    user_id: { $oid: communication.user_id.toString() },
    readBy:
      communication.readBy &&
      communication.readBy.map((rb) => ({ $oid: rb.toString() })),
    updatedAt: communication.updatedAt && { $date: communication.updatedAt },
    createdAt: communication.createdAt && { $date: communication.createdAt }
  }));
  return transformedDocuments;
};

const courses_transformer = (courses) => {
  const transformedDocuments = courses.map((course) => ({
    ...course,
    _id: { $oid: course._id.toString() },
    student_id: { $oid: course.student_id.toString() },
    analysis: course.analysis && {
      ...course.analysis,
      updatedAt: course.analysis.updatedAt && {
        $date: course.analysis.updatedAt
      }
    },
    updatedAt: course.updatedAt && { $date: course.updatedAt }
  }));
  return transformedDocuments;
};

const notes_transformer = (notes) => {
  const transformedDocuments = notes.map((note) => ({
    ...note,
    _id: { $oid: note._id.toString() },
    student_id: { $oid: note.student_id.toString() },
    updatedAt: note.updatedAt && { $date: note.updatedAt }
  }));
  return transformedDocuments;
};

const permissions_transformer = (permissions) => {
  const transformedDocuments = permissions.map((permission) => ({
    ...permission,
    _id: { $oid: permission._id.toString() },
    user_id: { $oid: permission.user_id.toString() },
    updatedAt: permission.updatedAt && { $date: permission.updatedAt },
    createdAt: permission.createdAt && { $date: permission.createdAt }
  }));
  return transformedDocuments;
};

const basedocumentationslinks_transformer = (basedocumentationslinks) => {
  const transformedDocuments = basedocumentationslinks.map(
    (basedocumentationslink) => ({
      ...basedocumentationslink,
      _id: { $oid: basedocumentationslink._id.toString() },
      updatedAt: basedocumentationslink.updatedAt && {
        $date: basedocumentationslink.updatedAt
      }
    })
  );
  return transformedDocuments;
};

const docspages_transformer = (docspages) => {
  const transformedDocuments = docspages.map((docspage) => ({
    ...docspage,
    _id: { $oid: docspage._id.toString() },
    updatedAt: docspage.updatedAt && {
      $date: docspage.updatedAt
    }
  }));
  return transformedDocuments;
};

const programs_transformer = (programs) => {
  const transformedDocuments = programs.map((program) => ({
    ...program,
    _id: { $oid: program._id.toString() },
    updatedAt: program.updatedAt && {
      $date: program.updatedAt
    }
  }));
  return transformedDocuments;
};

const documentthreads_transformer = (documentthreads) => {
  const transformedDocuments = documentthreads.map((documentthread) => ({
    ...documentthread,
    _id: { $oid: documentthread._id.toString() },
    student_id: { $oid: documentthread.student_id.toString() },
    program_id: documentthread.program_id && {
      $oid: documentthread.program_id.toString()
    },
    messages:
      documentthread.messages &&
      documentthread.messages.map((message) => ({
        ...message,
        _id: {
          $oid: message._id.toString()
        },
        user_id: {
          $oid: message.user_id.toString()
        },
        file:
          message.file &&
          message.file.map((f) => ({
            ...f,
            _id: {
              $oid: f._id.toString()
            }
          })),
        createdAt: message.createdAt && {
          $date: message.createdAt
        }
      })),
    updatedAt: documentthread.updatedAt && {
      $date: documentthread.updatedAt
    }
  }));
  return transformedDocuments;
};
// Daily called.
const MongoDBDataBaseDailySnapshot = async () => {
  logger.info('database snapshot');
  const data_category = [
    'users',
    'courses',
    'communications',
    'basedocumentationslinks',
    'docspages',
    'events',
    'programs',
    'documentthreads',
    'documentations',
    'internaldocs',
    'notes',
    'permissions',
    'templates'
    // 'expenses'
  ];
  const events_raw = await Event.find().lean();
  const users_raw = await User.find()
    .lean()
    .select(
      '+password +applications.portal_credentials.application_portal_a +applications.portal_credentials.application_portal_b'
    );
  const courses_raw = await Course.find().lean();
  const basedocumentationslinks_raw =
    await Basedocumentationslink.find().lean();
  const communications_raw = await Communication.find().lean();
  const docspages_raw = await Docspage.find().lean();
  const programs_raw = await Program.find().lean();
  const documentthreads_raw = await Documentthread.find().lean();
  const documentations_raw = await Documentation.find().lean();
  const internaldocs_raw = await Internaldoc.find().lean();
  const notes_raw = await Note.find().lean();
  const permissions_raw = await Permission.find().lean();
  const templates_raw = await Template.find().lean();
  const expenses_raw = await Expense.find().lean();

  const events = events_transformer(events_raw);
  const users = users_transformer(users_raw);
  const communications = communications_transformer(communications_raw);
  const courses = courses_transformer(courses_raw);
  const basedocumentationslinks = basedocumentationslinks_transformer(
    basedocumentationslinks_raw
  );
  const docspages = docspages_transformer(docspages_raw);
  const programs = programs_transformer(programs_raw);
  const documentthreads = documentthreads_transformer(documentthreads_raw);
  const documentations = docspages_transformer(documentations_raw);
  const internaldocs = docspages_transformer(internaldocs_raw);
  const notes = notes_transformer(notes_raw);
  const permissions = permissions_transformer(permissions_raw);
  const templates = docspages_transformer(templates_raw);
  const data_json = {
    events,
    users,
    courses,
    communications,
    basedocumentationslinks,
    docspages,
    programs,
    documentthreads,
    documentations,
    internaldocs,
    notes,
    permissions,
    templates
    // expenses
  };

  const currentDateTime = new Date();

  const year = currentDateTime.getUTCFullYear();
  const month = currentDateTime.getUTCMonth() + 1; // Months are zero-based, so we add 1
  const day = currentDateTime.getUTCDate();
  const hours = currentDateTime.getUTCHours();
  const minutes = currentDateTime.getUTCMinutes();
  const seconds = currentDateTime.getUTCSeconds();

  // Upload JSON data to S3
  for (let i = 0; i < data_category.length; i += 1) {
    // Replace `jsonObject` with your actual JSON data
    const jsonObject = data_json[data_category[i]];

    // Convert JSON to string
    const jsonString = JSON.stringify(jsonObject);
    s3.putObject(
      {
        Bucket: `${AWS_S3_MONGODB_BACKUP_SNAPSHOT}/${year}-${month}-${day}/${hours}-${minutes}-${seconds}`,
        Key: `${data_category[i]}.json`,
        Body: jsonString,
        ContentType: 'application/json'
      },
      (error, data) => {
        if (error) {
          logger.error(`Error uploading ${data_category[i]}.json:`, error);
        } else {
          logger.info(`${data_category[i]}.json uploaded successfully`);
        }
      }
    );
  }
};

const UrgentTasksReminderEmails_Student_core = async () => {
  // Only inform active student
  // TODO: deactivate or change email frequency (default 1 week.)
  const trigger_days = 3;
  const students = await Student.find({
    $or: [{ archiv: { $exists: false } }, { archiv: false }]
  })
    .populate('agents editors', 'firstname lastname email')
    .populate('applications.programId')
    .populate(
      'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
      '-messages'
    )
    .select('-notification')
    .lean(); // Only active student, not archiv

  // (O): Check if student applications deadline within 30 days
  for (let j = 0; j < students.length; j += 1) {
    if (is_deadline_within30days_needed(students[j])) {
      logger.info(`Escalate: ${students[j].firstname} ${students[j].lastname}`);
      await StudentApplicationsDeadline_Within30Days_DailyReminderEmail(
        {
          firstname: students[j].firstname,
          lastname: students[j].lastname,
          address: students[j].email
        },
        { student: students[j], trigger_days }
      );
      logger.info(
        `Daily urgent emails sent to ${students[j].firstname} ${students[j].lastname}`
      );
    }
    // (O): Check if student threads no reply (need to response) more than 3 days (Should configurable)
    if (is_cv_ml_rl_reminder_needed(students[j], students[j], trigger_days)) {
      logger.info(`Escalate: ${students[j].firstname} ${students[j].lastname}`);
      await StudentCVMLRLEssay_NoReplyAfter3Days_DailyReminderEmail(
        {
          firstname: students[j].firstname,
          lastname: students[j].lastname,
          address: students[j].email
        },
        { student: students[j], trigger_days }
      );
      logger.info(
        `Daily2 urgent emails sent to ${students[j].firstname} ${students[j].lastname}`
      );
    }
  }
};

const UrgentTasksReminderEmails_Agent_core = async () => {
  // Only inform active student
  // TODO: deactivate or change email frequency (default 1 week.)
  const escalation_trigger_10days = 10;
  const escalation_trigger_3days = 3;
  const agents = await Agent.find();

  for (let j = 0; j < agents.length; j += 1) {
    const agent_students = await Student.find({
      agents: agents[j]._id,
      $or: [{ archiv: { $exists: false } }, { archiv: false }]
    })
      .populate('agents editors', 'firstname lastname email')
      .populate('applications.programId')
      .populate(
        'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
        '-messages'
      )
      .select('-notification');
    if (agent_students.length > 0) {
      let cv_ml_rl_10days_flag = false;
      let cv_ml_rl_3days_flag = false;
      let deadline_within30days_flag = false;
      // (O) check any program within 30 days from agent's students?
      for (let x = 0; x < agent_students.length; x += 1) {
        deadline_within30days_flag |= is_deadline_within30days_needed(
          agent_students[x]
        );
        cv_ml_rl_10days_flag |= is_cv_ml_rl_reminder_needed(
          agent_students[x],
          agents[j],
          escalation_trigger_10days
        );
        cv_ml_rl_3days_flag |= is_cv_ml_rl_reminder_needed(
          agent_students[x],
          agents[j],
          escalation_trigger_3days
        );
      }
      if (deadline_within30days_flag) {
        if (cv_ml_rl_3days_flag) {
          logger.info(`Escalate: ${agents[j].firstname} ${agents[j].lastname}`);
          await AgentApplicationsDeadline_Within30Days_DailyReminderEmail(
            {
              firstname: agents[j].firstname,
              lastname: agents[j].lastname,
              address: agents[j].email
            },
            {
              students: agent_students,
              agent: agents[j],
              trigger_days: escalation_trigger_3days
            }
          );
          // (O): Check if student/editor no reply (need to response) more than 7 days (Should configurable)
          await AgentCVMLRLEssay_NoReplyAfterXDays_DailyReminderEmail(
            {
              firstname: agents[j].firstname,
              lastname: agents[j].lastname,
              address: agents[j].email
            },
            {
              students: agent_students,
              agent: agents[j],
              trigger_days: escalation_trigger_3days
            }
          );
          logger.info(
            `Deadline urgent emails sent to ${agents[j].firstname} ${agents[j].lastname}`
          );
        }
      } else if (cv_ml_rl_10days_flag) {
        // (O): Check if student/editor no reply (need to response) more than 7 days (Should configurable)
        await AgentCVMLRLEssay_NoReplyAfterXDays_DailyReminderEmail(
          {
            firstname: agents[j].firstname,
            lastname: agents[j].lastname,
            address: agents[j].email
          },
          {
            students: agent_students,
            agent: agents[j],
            trigger_days: escalation_trigger_10days
          }
        );
      }
    }
  }
};

const UrgentTasksReminderEmails_Editor_core = async () => {
  // Only inform active student
  // TODO: deactivate or change email frequency (default 1 week.)
  const editor_trigger_7days = 7;
  const editor_trigger_3days = 3;
  const editors = await Editor.find();

  // (O): Check if editor no reply (need to response) more than 3 days (Should configurable)
  for (let j = 0; j < editors.length; j += 1) {
    const editor_students = await Student.find({
      editors: editors[j]._id,
      $or: [{ archiv: { $exists: false } }, { archiv: false }]
    })
      .populate('agents editors', 'firstname lastname email')
      .populate('applications.programId')
      .populate(
        'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
        '-messages'
      )
      .select('-notification');
    if (editor_students.length > 0) {
      let cv_ml_rl_7days_flag = false;
      let cv_ml_rl_3days_flag = false;
      let deadline_within30days_flag = false;
      for (let x = 0; x < editor_students.length; x += 1) {
        deadline_within30days_flag |= is_deadline_within30days_needed(
          editor_students[x]
        );
        cv_ml_rl_7days_flag |= is_cv_ml_rl_reminder_needed(
          editor_students[x],
          editors[j],
          editor_trigger_7days
        );
        cv_ml_rl_3days_flag |= is_cv_ml_rl_reminder_needed(
          editor_students[x],
          editors[j],
          editor_trigger_3days
        );
      }

      if (deadline_within30days_flag) {
        if (cv_ml_rl_3days_flag) {
          logger.info(
            `Escalate: ${editors[j].firstname} ${editors[j].lastname}`
          );
          await EditorCVMLRLEssayDeadline_Within30Days_DailyReminderEmail(
            {
              firstname: editors[j].firstname,
              lastname: editors[j].lastname,
              address: editors[j].email
            },
            { students: editor_students }
          );
          logger.info(
            `Daily urgent emails sent to ${editors[j].firstname} ${editors[j].lastname}`
          );
        }
      } else if (cv_ml_rl_7days_flag) {
        logger.info(`Escalate: ${editors[j].firstname} ${editors[j].lastname}`);
        await EditorCVMLRLEssay_NoReplyAfter7Days_DailyReminderEmail(
          {
            firstname: editors[j].firstname,
            lastname: editors[j].lastname,
            address: editors[j].email
          },
          {
            students: editor_students,
            editor: editors[j],
            trigger_days: editor_trigger_7days
          }
        );
      }
    }
  }
};

const AssignEditorTasksReminderEmails = async () => {
  const students = await Student.find({
    $or: [{ archiv: { $exists: false } }, { archiv: false }]
  })
    .populate('agents editors', 'firstname lastname email archiv')
    .populate('applications.programId')
    .populate(
      'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
      '-messages'
    )
    .select('-notification')
    .lean(); // Only active student, not archiv
  for (let i = 0; i < students.length; i += 1) {
    if (!students[i].editors || students[i].editors.length === 0) {
      for (let j = 0; j < students[i].agents.length; j += 1) {
        // inform active-agent
        if (isNotArchiv(students[i])) {
          if (isNotArchiv(students[i].agents[j])) {
            if (students[i].needEditor) {
              sendAssignEditorReminderEmail(
                {
                  firstname: students[i].agents[j].firstname,
                  lastname: students[i].agents[j].lastname,
                  address: students[i].agents[j].email
                },
                {
                  student_firstname: students[i].firstname,
                  student_id: students[i]._id.toString(),
                  student_lastname: students[i].lastname
                }
              );
            }
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
          if (students[i].needEditor) {
            sendAssignEditorReminderEmail(
              {
                firstname: permissions[x].user_id.firstname,
                lastname: permissions[x].user_id.lastname,
                address: permissions[x].user_id.email
              },
              {
                student_firstname: students[i].firstname,
                student_id: students[i]._id.toString(),
                student_lastname: students[i].lastname
              }
            );
          }
        }
      }
    }
  }
  logger.info('Assign editor reminded');
};

const UrgentTasksReminderEmails = async () => {
  await UrgentTasksReminderEmails_Editor_core();
  await UrgentTasksReminderEmails_Student_core();
  await UrgentTasksReminderEmails_Agent_core();
};

const NextSemesterCourseSelectionStudentReminderEmails = async () => {
  // Only inform active student
  const studentsWithCourses = await Student.aggregate([
    {
      $match: {
        archiv: { $ne: true } // Filter out students where 'archiv' is not equal to true
      }
    },
    {
      $lookup: {
        from: 'courses',
        localField: '_id',
        foreignField: 'student_id',
        as: 'courses'
      }
    },
    {
      $project: {
        firstname: 1,
        lastname: 1,
        email: 1,
        role: 1,
        archiv: 1,
        academic_background: 1,
        courses: 1
      }
    }
  ]);

  for (let j = 0; j < studentsWithCourses.length; j += 1) {
    if (isNotArchiv(studentsWithCourses[j])) {
      if (needUpdateCourseSelection(studentsWithCourses[j])) {
        // Inform student
        await StudentCourseSelectionReminderEmail(
          {
            firstname: studentsWithCourses[j].firstname,
            lastname: studentsWithCourses[j].lastname,
            address: studentsWithCourses[j].email
          },
          { student: studentsWithCourses[j] }
        );
      }
    }
  }
};

const NextSemesterCourseSelectionAgentReminderEmails = async () => {
  // Only inform active student
  const studentsWithCourses = await Student.aggregate([
    {
      $match: {
        archiv: { $ne: true } // Filter out students where 'archiv' is not equal to true
      }
    },
    {
      $lookup: {
        from: 'courses',
        localField: '_id',
        foreignField: 'student_id',
        as: 'courses'
      }
    },
    {
      $lookup: {
        from: 'users', // Replace 'users' with the actual name of the User collection
        localField: 'agents',
        foreignField: '_id',
        as: 'agentsInfo'
      }
    },
    {
      $project: {
        firstname: 1,
        lastname: 1,
        email: 1,
        role: 1,
        archiv: 1,
        agents: {
          $map: {
            input: '$agents',
            as: 'agentId',
            in: {
              $let: {
                vars: {
                  agentInfo: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: '$agentsInfo',
                          cond: { $eq: ['$$this._id', '$$agentId'] }
                        }
                      },
                      0
                    ]
                  }
                },
                in: {
                  firstname: '$$agentInfo.firstname',
                  lastname: '$$agentInfo.lastname',
                  archiv: '$$agentInfo.archiv',
                  email: '$$agentInfo.email'
                }
              }
            }
          }
        },
        academic_background: 1,
        courses: 1
      }
    }
  ]);
  for (let j = 0; j < studentsWithCourses.length; j += 1) {
    if (isNotArchiv(studentsWithCourses[j])) {
      if (needUpdateCourseSelection(studentsWithCourses[j])) {
        // TODO: move informing Agent to another function so that all students needing update in 1 email for agents.
        for (let x = 0; x < studentsWithCourses[j].agents.length; x += 1) {
          if (isNotArchiv(studentsWithCourses[j].agents[x])) {
            // TODO: inform Agent
            await AgentCourseSelectionReminderEmail(
              {
                firstname: studentsWithCourses[j].agents[x].firstname,
                lastname: studentsWithCourses[j].agents[x].lastname,
                address: studentsWithCourses[j].agents[x].email
              },
              { student: studentsWithCourses[j] }
            );
          }
        }
      }
    }
  }
};

const NextSemesterCourseSelectionReminderEmails = async () => {
  await NextSemesterCourseSelectionStudentReminderEmails();
  // await NextSemesterCourseSelectionAgentReminderEmails();
};

const UpdateStatisticsData = async () => {
  const documents_cv = await Documentthread.find({
    isFinalVersion: false,
    file_type: 'CV'
  }).count();
  // TODO: this include the tasks that created by not shown, because the programs are not decided.
  // So that is why the number is more than what we actually see in UI.
  // Case 2: if student in Archiv, but the tasks are still open!! then the number is not correct!
  const documents_ml = await Documentthread.find({
    isFinalVersion: false,
    file_type: 'ML'
  }).count();
  const documents_rl = await Documentthread.find({
    isFinalVersion: false,
    $or: [
      { file_type: 'RL_A' },
      { file_type: 'RL_B' },
      { file_type: 'RL_C' },
      { file_type: 'Recommendation_Letter_A' },
      { file_type: 'Recommendation_Letter_B' },
      { file_type: 'Recommendation_Letter_C' }
    ]
  }).count();
  const documents_essay = await Documentthread.find({
    isFinalVersion: false,
    file_type: 'Essay'
  }).count();
  const documents_data = {};
  documents_data.CV = { count: documents_cv };
  documents_data.ML = { count: documents_ml };
  documents_data.RL = { count: documents_rl };
  documents_data.ESSAY = { count: documents_essay };
  const agents = await Agent.find({
    $or: [{ archiv: { $exists: false } }, { archiv: false }]
  });
  const editors = await Editor.find({
    $or: [{ archiv: { $exists: false } }, { archiv: false }]
  });
  const students = await Student.find()
    .populate('agents editors', 'firstname lastname')
    .populate('applications.programId')
    .populate(
      'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
      '-messages'
    );
  const agents_data = [];
  const editors_data = [];
  for (let i = 0; i < agents.length; i += 1) {
    const Obj = {};
    Obj._id = agents[i]._id.toString();
    Obj.firstname = agents[i].firstname;
    Obj.lastname = agents[i].lastname;
    Obj.student_num = await Student.find({
      agents: agents[i]._id,
      $or: [{ archiv: { $exists: false } }, { archiv: false }]
    }).count();
    agents_data.push(Obj);
  }
  for (let i = 0; i < editors.length; i += 1) {
    const Obj = {};
    Obj._id = editors[i]._id.toString();
    Obj.firstname = editors[i].firstname;
    Obj.lastname = editors[i].lastname;
    Obj.student_num = await Student.find({
      editors: editors[i]._id,
      $or: [{ archiv: { $exists: false } }, { archiv: false }]
    }).count();
    editors_data.push(Obj);
  }
  const finished_docs = await Documentthread.find({
    isFinalVersion: true,
    $or: [
      { file_type: 'CV' },
      { file_type: 'ML' },
      { file_type: 'RL_A' },
      { file_type: 'RL_B' },
      { file_type: 'RL_C' },
      { file_type: 'Recommendation_Letter_A' },
      { file_type: 'Recommendation_Letter_B' },
      { file_type: 'Recommendation_Letter_C' }
    ]
  })
    .populate('student_id', 'firstname lastname')
    .select('file_type messages.createdAt');
  const users = await User.find({
    role: { $in: ['Admin', 'Agent', 'Editor'] }
  }).lean();
  const result = {
    success: true,
    data: users,
    // documents_all_open,
    documents: documents_data,
    students: {
      isClose: students.filter((student) => student.archiv === true).length,
      isOpen: students.filter((student) => student.archiv !== true).length
    },
    finished_docs,
    agents: agents_data,
    editors: editors_data,
    students_details: students,
    applications: []
  };
};

const add_portals_registered_status = (student_input) => {
  const student = student_input;
  for (let i = 0; i < student.applications.length; i += 1) {
    if (student.applications[i].decided === 'O') {
      if (student.applications[i].programId.application_portal_a) {
        if (
          student.applications[i].portal_credentials &&
          student.applications[i].portal_credentials.application_portal_a &&
          student.applications[i].portal_credentials.application_portal_a
            .account &&
          student.applications[i].portal_credentials.application_portal_a
            .password
        ) {
          student.applications[i].credential_a_filled = true;
        } else {
          student.applications[i].credential_a_filled = false;
        }
      } else {
        student.applications[i].credential_a_filled = true;
      }
      if (student.applications[i].programId.application_portal_b) {
        if (
          student.applications[i].portal_credentials &&
          student.applications[i].portal_credentials.application_portal_b &&
          student.applications[i].portal_credentials.application_portal_b
            .account &&
          student.applications[i].portal_credentials.application_portal_b
            .password
        ) {
          student.applications[i].credential_b_filled = true;
        } else {
          student.applications[i].credential_b_filled = false;
        }
      } else {
        student.applications[i].credential_b_filled = true;
      }
    } else {
      student.applications[i].credential_a_filled = true;
      student.applications[i].credential_b_filled = true;
    }

    delete student.applications[i].portal_credentials;
  }
  return student;
};

const MeetingDailyReminderChecker = async () => {
  const currentDate = new Date();
  const twentyFourHoursLater = new Date(currentDate);
  twentyFourHoursLater.setHours(currentDate.getHours() + 24);

  // Only future meeting within 24 hours, not past
  const upcomingEvents = await Event.find({
    $and: [
      {
        end: {
          $gte: currentDate,
          $lt: twentyFourHoursLater
        }
      },
      { isConfirmedReceiver: true },
      { isConfirmedRequester: true }
    ]
  }).populate('requester_id receiver_id', 'firstname lastname email');
  if (upcomingEvents) {
    for (let j = 0; j < upcomingEvents.length; j += 1) {
      // eslint-disable-next-line no-await-in-loop
      await MeetingReminderEmail(
        {
          firstname: upcomingEvents[j].requester_id[0].firstname,
          lastname: upcomingEvents[j].requester_id[0].lastname,
          address: upcomingEvents[j].requester_id[0].email
        },
        {
          event: upcomingEvents[j]
        }
      );
      await MeetingReminderEmail(
        {
          firstname: upcomingEvents[j].receiver_id[0].firstname,
          lastname: upcomingEvents[j].receiver_id[0].lastname,
          address: upcomingEvents[j].receiver_id[0].email
        },
        {
          event: upcomingEvents[j]
        }
      );
    }
  }

  logger.info('Meeting attendees reminded');
};

// every day reminder
const UnconfirmedMeetingDailyReminderChecker = async () => {
  const currentDate = new Date();

  // Only future meeting within 24 hours, not past
  const upcomingEvents = await Event.find({
    $and: [
      {
        end: {
          $gte: currentDate
        }
      },
      {
        $or: [{ isConfirmedReceiver: false }, { isConfirmedRequester: false }]
      }
    ]
  }).populate('requester_id receiver_id', 'firstname lastname role email');
  if (upcomingEvents) {
    for (let j = 0; j < upcomingEvents.length; j += 1) {
      // eslint-disable-next-line no-await-in-loop
      if (!upcomingEvents[j].isConfirmedRequester) {
        await UnconfirmedMeetingReminderEmail(
          {
            firstname: upcomingEvents[j].requester_id[0].firstname,
            lastname: upcomingEvents[j].requester_id[0].lastname,
            address: upcomingEvents[j].requester_id[0].email
          },
          {
            event: upcomingEvents[j],
            firstname: upcomingEvents[j].receiver_id[0].firstname,
            lastname: upcomingEvents[j].receiver_id[0].lastname,
            id: upcomingEvents[j].requester_id[0]._id.toString(),
            role: upcomingEvents[j].requester_id[0].role
          }
        );
      }
      if (!upcomingEvents[j].isConfirmedReceiver) {
        await UnconfirmedMeetingReminderEmail(
          {
            firstname: upcomingEvents[j].receiver_id[0].firstname,
            lastname: upcomingEvents[j].receiver_id[0].lastname,
            address: upcomingEvents[j].receiver_id[0].email
          },
          {
            event: upcomingEvents[j],
            firstname: upcomingEvents[j].requester_id[0].firstname,
            lastname: upcomingEvents[j].requester_id[0].lastname,
            id: upcomingEvents[j].receiver_id[0]._id.toString(),
            role: upcomingEvents[j].receiver_id[0].role
          }
        );
      }
    }
  }

  logger.info('Unconfirmed Meeting attendee reminded');
};

const GroupCommunicationByStudent = async () => {
  try {
    const communications = await Communication.find()
    .populate('student_id user_id')
    .populate('student_id','archiv')
    .lean();
    let groupCommunication = {};
    for (const singleCommunicaiton of communications){
      if (singleCommunicaiton.student_id && singleCommunicaiton.student_id.archiv !== true){
        if (!groupCommunication[singleCommunicaiton.student_id._id.toString()]){
          groupCommunication[singleCommunicaiton.student_id._id.toString()] = [singleCommunicaiton];
        } else {
          groupCommunication[singleCommunicaiton.student_id._id.toString()].push(singleCommunicaiton);
        };
      };
    };
    return groupCommunication
  } catch (error){
    logger.error('error grouping communications');
    return null;
  };
};

const FindIntervalInCommunications = async () => {
  // group communications by student
  try {
    const groupCommunication = await GroupCommunicationByStudent();
    Object.entries(groupCommunication).forEach(async ([student, messages]) => {
      // sort messages chronically
      messages.sort((a, b) => {
        return a.updatedAt - b.updatedAt;
      });
      // find valid interval
      if (messages.length > 1){
        let msg_1;
        let msg_2;
        for (const msg of messages){
          if (msg.user_id?.role === "Student") {
            msg_1 = msg;
          } else {
            msg_2 = msg;
          }
          //calculate interval, store values into Interval Collection
          if ( msg_1 !== undefined && msg_2 != undefined ){
            try {
              const interval = calculateInterval(msg_1, msg_2);
              const newInterval = new Interval({
                student_id: student,
                message_1_id: msg_1,
                message_2_id: msg_2,
                interval_type: 'communication',
                interval: interval,
                updatedAt: new Date()
              });
              await newInterval.save();
              msg_1 = undefined;
              msg_2 = undefined;
            } catch (error){
              logger.error("Error creating interval collection:", error);
            };
          };
        };
      };
    });
  } catch (error){
    logger.error('error find valid interval');
  };
};

module.exports = {
  emptyS3Directory,
  TasksReminderEmails,
  MongoDBDataBaseDailySnapshot,
  AssignEditorTasksReminderEmails,
  UrgentTasksReminderEmails,
  NextSemesterCourseSelectionReminderEmails,
  UpdateStatisticsData,
  add_portals_registered_status,
  MeetingDailyReminderChecker,
  UnconfirmedMeetingDailyReminderChecker,
  FindIntervalInCommunications
};
