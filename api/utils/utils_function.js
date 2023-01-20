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
  StudentCVMLRLEssay_NoReplyAfter3Days_DailyReminderEmail
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
      // TODO: if nothing to send?
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
    if (is_cv_ml_rl_reminder_needed(students[j], students[j], 3)) {
      console.log(`Escalate: ${students[j].firstname} ${students[j].lastname}`);
      await StudentCVMLRLEssay_NoReplyAfter3Days_DailyReminderEmail(
        {
          firstname: students[j].firstname,
          lastname: students[j].lastname,
          address: students[j].email
        },
        { student: students[j] }
      );
      console.log(
        `Daily2 urgent emails sent to ${students[j].firstname} ${students[j].lastname}`
      );
    }
  }

  // for (let j = 0; j < agents.length; j += 1) {
  //   const agent_students = await Student.find({
  //     agents: agents[j]._id,
  //     $or: [{ archiv: { $exists: false } }, { archiv: false }]
  //   })
  //     .populate('agents editors', 'firstname lastname email')
  //     .populate('applications.programId')
  //     .populate(
  //       'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
  //       '-messages'
  //     )
  //     .select('-notification')
  //     .lean()
  //     .exec();
  //   if (agent_students.length > 0) {
  //     await AgentUrgentTasksReminderEmail(
  //       {
  //         firstname: agents[j].firstname,
  //         lastname: agents[j].lastname,
  //         address: agents[j].email
  //       },
  //       { students: agent_students, agent: agents[j] }
  //     );
  //   }
  // }

  // TODO (): Check if editor no reply (need to response) more than 3 days (Should configurable)

  // for (let j = 0; j < editors.length; j += 1) {
  //   const editor_students = await Student.find({
  //     editors: editors[j]._id,
  //     $or: [{ archiv: { $exists: false } }, { archiv: false }]
  //   })
  //     .populate('agents editors', 'firstname lastname email')
  //     .populate('applications.programId')
  //     .populate(
  //       'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
  //       '-messages'
  //     )
  //     .select('-notification');
  //   if (editor_students.length > 0) {
  //     await EditorTasksReminderEmail(
  //       {
  //         firstname: editors[j].firstname,
  //         lastname: editors[j].lastname,
  //         address: editors[j].email
  //       },
  //       { students: editor_students, editor: editors[j] }
  //     );
  //   }
  // }
};

module.exports = {
  emptyS3Directory,
  TasksReminderEmails,
  UrgentTasksReminderEmails
};
