const aws = require('aws-sdk');
const async = require('async');
const path = require('path');
const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const { Role, Agent, Student, Editor } = require('../models/User');
const { Documentthread } = require('../models/Documentthread');
const {
  StudentTasksReminderEmail,
  AgentTasksReminderEmail,
  EditorTasksReminderEmail,
  StudentApplicationsDeadline_Within30Days_DailyReminderEmail,
  StudentCVMLRLEssay_NoReplyAfter3Days_DailyReminderEmail,
  EditorCVMLRLEssay_NoReplyAfter3Days_DailyReminderEmail,
  AgentCVMLRLEssay_NoReplyAfter7Days_DailyReminderEmail,
  AgentApplicationsDeadline_Within30Days_DailyReminderEmail
} = require('../services/regular_system_emails');
const logger = require('../services/logger');
const {
  getNumberOfDays,
  does_editor_have_pending_tasks,
  is_deadline_within30days_needed,
  is_cv_ml_rl_reminder_needed,
  application_deadline_calculator
} = require('../constants');

const { AWS_S3_ACCESS_KEY_ID, AWS_S3_ACCESS_KEY } = require('../config');

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

const TasksReminderEmails = async () => {
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
  const agents = await Agent.find();
  const editors = await Editor.find();

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
  console.log('Reminder email sent');
};

const UrgentTasksReminderEmails = async () => {
  // Only inform active student
  // TODO: deactivate or change email frequency (default 1 week.)
  const trigger_days = 3;
  const escalation_trigger_days = 7;
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
  const agents = await Agent.find();
  const editors = await Editor.find();
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
        { student: students[j] }
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
      let temp_flag = false;
      let temp_flag2 = false;
      // (O): Check if student/editor no reply (need to response) more than 7 days (Should configurable)
      for (let x = 0; x < agent_students.length; x += 1) {
        temp_flag |= is_cv_ml_rl_reminder_needed(
          agent_students[x],
          agents[j],
          escalation_trigger_days
        );
      }
      if (temp_flag) {
        await AgentCVMLRLEssay_NoReplyAfter7Days_DailyReminderEmail(
          {
            firstname: agents[j].firstname,
            lastname: agents[j].lastname,
            address: agents[j].email
          },
          {
            students: agent_students,
            agent: agents[j],
            trigger_days: escalation_trigger_days
          }
        );
      }
      // (O) check any program within 30 days from agent's students?
      for (let x = 0; x < agent_students.length; x += 1) {
        temp_flag2 |= is_deadline_within30days_needed(agent_students[x]);
      }
      if (temp_flag2) {
        console.log(`Escalate: ${agents[j].firstname} ${agents[j].lastname}`);
        await AgentApplicationsDeadline_Within30Days_DailyReminderEmail(
          {
            firstname: agents[j].firstname,
            lastname: agents[j].lastname,
            address: agents[j].email
          },
          { students: agent_students }
        );
        console.log(
          `Daily urgent emails sent to ${agents[j].firstname} ${agents[j].lastname}`
        );
      }
    }
  }

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
      let temp_flag = false;
      for (let x = 0; x < editor_students.length; x += 1) {
        temp_flag |= is_cv_ml_rl_reminder_needed(
          editor_students[x],
          editors[j],
          trigger_days
        );
      }
      if (temp_flag) {
        console.log(`Escalate: ${editors[j].firstname} ${editors[j].lastname}`);
        await EditorCVMLRLEssay_NoReplyAfter3Days_DailyReminderEmail(
          {
            firstname: editors[j].firstname,
            lastname: editors[j].lastname,
            address: editors[j].email
          },
          { students: editor_students, editor: editors[j], trigger_days }
        );
      }
    }
  }
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
  UrgentTasksReminderEmails,
  add_portals_registered_status
};
