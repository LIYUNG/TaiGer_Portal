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

const getAgents = asyncHandler(async (req, res, next) => {
  const agents = await Agent.find().populate('students', '_id name');
  // if (!agents) {
  //   logger.error('getAgents : no agents');
  //   throw new ErrorResponse(400, 'no agents');
  // }
  res.status(200).send({ success: true, data: agents });
});

const getSingleAgent = asyncHandler(async (req, res, next) => {
  const { agent_id } = req.params;
  const agent = await Agent.findById(agent_id).populate(
    'students',
    '_id firstname lastname'
  );
  // if (!agents) {
  //   logger.error('getAgents : no agents');
  //   throw new ErrorResponse(400, 'no agents');
  // }
  res.status(200).send({ success: true, data: agent });
});

const getEditors = asyncHandler(async (req, res, next) => {
  const editors = await Editor.find().populate('students', '_id name firstname lastname');
  // if (!editors) {
  //   logger.error('getgetEditorsAgents : no editors');
  //   throw new ErrorResponse(400, 'no editors');
  // }
  res.status(200).send({ success: true, data: editors });
});

const getSingleEditor = asyncHandler(async (req, res, next) => {
  const { editor_id } = req.params;
  const editor = await Editor.findById(editor_id).populate(
    'students',
    '_id firstname lastname'
  );
  // if (!editors) {
  //   logger.error('getgetEditorsAgents : no editors');
  //   throw new ErrorResponse(400, 'no editors');
  // }
  res.status(200).send({ success: true, data: editor });
});

module.exports = {
  getTeamMembers,
  getAgents,
  getSingleAgent,
  getEditors,
  getSingleEditor
};
