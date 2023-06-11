const aws = require('aws-sdk');
// const EJSON = require('ejson');
const async = require('async');
const path = require('path');
const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const { Role, Agent, Student, Editor, User } = require('../models/User');
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
  EditorCVMLRLEssayDeadline_Within30Days_DailyReminderEmail
} = require('../services/regular_system_emails');
const logger = require('../services/logger');
const {
  getNumberOfDays,
  does_editor_have_pending_tasks,
  is_deadline_within30days_needed,
  is_cv_ml_rl_reminder_needed,
  application_deadline_calculator,
  isNotArchiv
} = require('../constants');

const {
  AWS_S3_ACCESS_KEY_ID,
  AWS_S3_ACCESS_KEY,
  AWS_S3_MONGODB_BACKUP_SNAPSHOT
} = require('../config');
const { Program } = require('../models/Program');
const { Template } = require('../models/Template');
const Expense = require('../models/Expense');
const Course = require('../models/Course');
const { Basedocumentationslink } = require('../models/Basedocumentationslink');
const Docspage = require('../models/Docspage');

const s3 = new aws.S3({
  accessKeyId: AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: AWS_S3_ACCESS_KEY
});

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
  console.log('Editor reminder email sent');
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
  console.log('Agent reminder email sent');
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
  console.log('Student reminder email sent');
};

// Weekly called.
const TasksReminderEmails = async () => {
  await TasksReminderEmails_Editor_core();
  await TasksReminderEmails_Student_core();
  await TasksReminderEmails_Agent_core();
};

// Daily called.
const MongoDBDataBaseDailySnapshot = async () => {
  console.log('database snapshot');
  const data_category = [
    'users',
    'courses',
    'basedocumentationslinks',
    'docspages',
    'programs',
    'documentthreads',
    'documentations',
    'templates',
    'expenses'
  ];
  const users = await User.find()
    .lean()
    .select(
      '+password +applications.portal_credentials.application_portal_a +applications.portal_credentials.application_portal_b'
    );
  const courses = await Course.find();
  const basedocumentationslinks = await Basedocumentationslink.find();
  const docspages = await Docspage.find();
  const programs = await Program.find();
  const documentthreads = await Documentthread.find();
  const documentations = await Documentation.find();
  const templates = await Template.find();
  const expenses = await Expense.find();
  console.log(users[0]);
  const data_json = {
    users,
    courses,
    basedocumentationslinks,
    docspages,
    programs,
    documentthreads,
    documentations,
    templates,
    expenses
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
    console.log(data_category[i]);
    const jsonString = EJSON.stringify(jsonObject);
    s3.putObject(
      {
        Bucket: `${AWS_S3_MONGODB_BACKUP_SNAPSHOT}/${year}-${month}-${day}/${hours}-${minutes}-${seconds}`,
        Key: `${data_category[i]}.json`,
        Body: jsonString,
        ContentType: 'application/json'
      },
      (error, data) => {
        if (error) {
          console.log(`Error uploading ${data_category[i]}.json:`, error);
        } else {
          console.log(`${data_category[i]}.json uploaded successfully`);
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
      console.log(`Escalate: ${students[j].firstname} ${students[j].lastname}`);
      await StudentApplicationsDeadline_Within30Days_DailyReminderEmail(
        {
          firstname: students[j].firstname,
          lastname: students[j].lastname,
          address: students[j].email
        },
        { student: students[j], trigger_days }
      );
      console.log(
        `Daily urgent emails sent to ${students[j].firstname} ${students[j].lastname}`
      );
    }
    // (O): Check if student threads no reply (need to response) more than 3 days (Should configurable)
    if (is_cv_ml_rl_reminder_needed(students[j], students[j], trigger_days)) {
      console.log(`Escalate: ${students[j].firstname} ${students[j].lastname}`);
      await StudentCVMLRLEssay_NoReplyAfter3Days_DailyReminderEmail(
        {
          firstname: students[j].firstname,
          lastname: students[j].lastname,
          address: students[j].email
        },
        { student: students[j], trigger_days }
      );
      console.log(
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
          console.log(`Escalate: ${agents[j].firstname} ${agents[j].lastname}`);
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
          console.log(
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
          console.log(
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
          console.log(
            `Daily urgent emails sent to ${editors[j].firstname} ${editors[j].lastname}`
          );
        }
      } else if (cv_ml_rl_7days_flag) {
        console.log(`Escalate: ${editors[j].firstname} ${editors[j].lastname}`);
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

const UrgentTasksReminderEmails = async () => {
  await UrgentTasksReminderEmails_Editor_core();
  await UrgentTasksReminderEmails_Student_core();
  await UrgentTasksReminderEmails_Agent_core();
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

module.exports = {
  emptyS3Directory,
  TasksReminderEmails,
  MongoDBDataBaseDailySnapshot,
  UrgentTasksReminderEmails,
  add_portals_registered_status
};
