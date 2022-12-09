const aws = require('aws-sdk');
const async = require('async');
const path = require('path');
const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const { Role, Agent, Student, Editor } = require('../models/User');
const { AWS_S3_PUBLIC_BUCKET, API_ORIGIN } = require('../config');
const { Documentthread } = require('../models/Documentthread');
const {
  StudentTasksReminderEmail,
  AgentTasksReminderEmail,
  EditorTasksReminderEmail
} = require('../services/email');
const logger = require('../services/logger');
const { getNumberOfDays } = require('../constants');

const {
  AWS_S3_ACCESS_KEY_ID,
  AWS_S3_ACCESS_KEY,
  AWS_S3_BUCKET_NAME,
  AWS_S3_PUBLIC_BUCKET_NAME
} = require('../config');

const s3 = new aws.S3({
  accessKeyId: AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: AWS_S3_ACCESS_KEY
});

const TasksReminderEmails = async () => {
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
  const agents = await Agent.find().populate('students');
  const editors = await Editor.find().populate('students');
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
    await AgentTasksReminderEmail(
      {
        firstname: agents[j].firstname,
        lastname: agents[j].lastname,
        address: agents[j].email
      },
      { students: agents[j].students }
    );
  }
  for (let j = 0; j < editors.length; j += 1) {
    await EditorTasksReminderEmail(
      {
        firstname: editors[j].firstname,
        lastname: editors[j].lastname,
        address: editors[j].email
      },
      { students: editors[j].students }
    );
  }
  console.log('Reminder email sent');
};

module.exports = {
  TasksReminderEmails
};
