const aws = require('aws-sdk');
const async = require('async');
const path = require('path');
const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const { Role, Agent, Student, Editor } = require('../models/User');
const { Documentthread } = require('../models/Documentthread');
const {
  AgentTasksReminderEmail,
  EditorTasksReminderEmail
} = require('../services/email');
const {
  StudentTasksReminderEmail
} = require('../services/regular_system_emails');
const logger = require('../services/logger');
const { getNumberOfDays } = require('../constants');

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
  // TODO: Check if student threads no reply (need to response) more than 3 days (Should configurable)
  // TODO: Check if student applications able to submit but not yet more than 3 days (Should configurable)
  // TODO: Check if student applications deadline within 30 days
  for (let j = 0; j < students.length; j += 1) {
    for (let k = 0; k < students[j].length; k += 1) {
      
    }
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
  console.log('Daily urgent emails sent');
};

module.exports = {
  emptyS3Directory,
  TasksReminderEmails,
  UrgentTasksReminderEmails
};
