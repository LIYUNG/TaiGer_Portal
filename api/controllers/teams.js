const _ = require('lodash');
const aws = require('aws-sdk');

const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const { User, Agent, Editor, Student, Role } = require('../models/User');
const Course = require('../models/Course');
const { Documentthread } = require('../models/Documentthread');
const { updateNotificationEmail } = require('../services/email');
const logger = require('../services/logger');

const {
  AWS_S3_ACCESS_KEY_ID,
  AWS_S3_ACCESS_KEY,
  AWS_S3_BUCKET_NAME
} = require('../config');

const s3 = new aws.S3({
  accessKeyId: AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: AWS_S3_ACCESS_KEY
});

const getTeamMembers = asyncHandler(async (req, res) => {
  const users = await User.find({
    role: { $in: ['Admin', 'Agent', 'Editor'] }
  }).lean();
  res.status(200).send({ success: true, data: users });
});

const getStatistics = asyncHandler(async (req, res) => {
  const documents = await Documentthread.find({ isFinalVersion: false });
  const agents = await Agent.find();
  const editors = await Editor.find();
  const students = await Student.find();
  const users = await User.find({
    role: { $in: ['Admin', 'Agent', 'Editor'] }
  }).lean();
  res.status(200).send({
    success: true,
    data: users,
    documents: documents.length,
    students: {
      isClose: students.filter((student) => student.archiv === true).length,
      isOpen: students.filter((student) => student.archiv !== true).length
    },
    agents: agents.length,
    editors: editors.length
  });
});

const getAgents = asyncHandler(async (req, res, next) => {
  const agents = await Agent.find().select('firstname lastname');
  res.status(200).send({ success: true, data: agents });
});

const getSingleAgent = asyncHandler(async (req, res, next) => {
  const { agent_id } = req.params;
  const agent = await Agent.findById(agent_id).select('firstname lastname');
  // query by agents field: student.agents include agent_id
  const students = await Student.find({
    agents: agent_id,
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
  res.status(200).send({ success: true, data: { students, agent } });
});

const getEditors = asyncHandler(async (req, res, next) => {
  const editors = await Editor.find().select('firstname lastname');
  res.status(200).send({ success: true, data: editors });
});

const getSingleEditor = asyncHandler(async (req, res, next) => {
  const { editor_id } = req.params;
  const editor = await Editor.findById(editor_id).select('firstname lastname');
  // query by agents field: student.editors include editor_id
  const students = await Student.find({
    editors: editor_id,
    $or: [{ archiv: { $exists: false } }, { archiv: false }]
  })
    .populate('agents editors', 'firstname lastname email')
    .populate('applications.programId')
    .populate(
      'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
      '-messages'
    )
    .select('-notification');
  res.status(200).send({ success: true, data: { students, editor } });
});

const getArchivStudents = asyncHandler(async (req, res) => {
  const { TaiGerStaffId } = req.params;
  const user = await User.findById(TaiGerStaffId);
  if (user.role === Role.Admin) {
    const students = await Student.find({ archiv: true }).exec();
    res.status(200).send({ success: true, data: students });
  } else if (user.role === Role.Agent) {
    const students = await Student.find({
      agents: TaiGerStaffId,
      archiv: true
    })
      .populate('applications.programId')
      .lean()
      .exec();

    res.status(200).send({ success: true, data: students });
  } else if (user.role === Role.Editor) {
    const students = await Student.find({
      editors: TaiGerStaffId,
      archiv: true
    }).populate('applications.programId');
    res.status(200).send({ success: true, data: students });
  } else {
    // Guest
    res.status(200).send({ success: true, data: [] });
  }
});

module.exports = {
  getTeamMembers,
  getStatistics,
  getAgents,
  getSingleAgent,
  getEditors,
  getSingleEditor,
  getArchivStudents
};
