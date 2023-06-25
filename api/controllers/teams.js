const _ = require('lodash');
const aws = require('aws-sdk');

const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const { User, Agent, Editor, Student, Role } = require('../models/User');
const { Documentthread } = require('../models/Documentthread');
const logger = require('../services/logger');

const {
  AWS_S3_ACCESS_KEY_ID,
  AWS_S3_ACCESS_KEY,
  AWS_S3_BUCKET_NAME
} = require('../config');
const Permission = require('../models/Permission');

const s3 = new aws.S3({
  accessKeyId: AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: AWS_S3_ACCESS_KEY
});

const getTeamMembers = asyncHandler(async (req, res) => {
  const users = await User.aggregate([
    { $match: { role: { $in: ['Admin', 'Agent', 'Editor'] } } },
    {
      $lookup: {
        from: 'permissions',
        localField: '_id',
        foreignField: 'user_id',
        as: 'permissions'
      }
    }
  ]);
  res.status(200).send({ success: true, data: users });
});

const getStatistics = asyncHandler(async (req, res) => {
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
  const agents = await Agent.find();
  const editors = await Editor.find();
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

  const users = await User.find({
    role: { $in: ['Admin', 'Agent', 'Editor'] }
  }).lean();
  res.status(200).send({
    success: true,
    data: users,
    // documents_all_open,
    documents: documents_data,
    students: {
      isClose: students.filter((student) => student.archiv === true).length,
      isOpen: students.filter((student) => student.archiv !== true).length
    },
    agents: agents_data,
    editors: editors_data,
    students_details: students,
    applications: []
  });
});

const getAgents = asyncHandler(async (req, res, next) => {
  const { user } = req;
  if (user.role === 'Agent') {
    const permissions = await Permission.findOne({
      user_id: user._id.toString()
    });
    if (permissions && permissions.canAssignAgents) {
      const agents = await Agent.find().select('firstname lastname');
      res.status(200).send({ success: true, data: agents });
    } else {
      logger.error('getAgents: no permission');
      throw new ErrorResponse(
        403,
        'You do not have the permission to do this action'
      );
    }
  } else {
    const agents = await Agent.find().select('firstname lastname');
    res.status(200).send({ success: true, data: agents });
  }
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
  const { user } = req;
  if (user.role === 'Editor') {
    const permissions = await Permission.findOne({
      user_id: user._id.toString()
    });
    if (permissions && permissions.canAssignEditors) {
      const editors = await Editor.find().select('firstname lastname');
      res.status(200).send({ success: true, data: editors });
    } else {
      logger.error('getEditors: no permission');
      throw new ErrorResponse(
        403,
        'You do not have the permission to do this action'
      );
    }
  } else {
    const editors = await Editor.find().select('firstname lastname');
    res.status(200).send({ success: true, data: editors });
  }
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
    .populate({
      path: 'generaldocs_threads.doc_thread_id',
      select: 'file_type isFinalVersion updatedAt',
      populate: {
        path: 'messages.user_id',
        select: 'firstname lastname'
      }
    })
    .populate({
      path: 'applications.doc_modification_thread.doc_thread_id',
      select: 'file_type isFinalVersion updatedAt',
      populate: {
        path: 'messages.user_id',
        select: 'firstname lastname'
      }
    })
    .select('-notification');
  res.status(200).send({ success: true, data: { students, editor } });
});

const getArchivStudents = asyncHandler(async (req, res) => {
  const { TaiGerStaffId } = req.params;
  const user = await User.findById(TaiGerStaffId);
  if (user.role === Role.Admin) {
    const students = await Student.find({ archiv: true })
      .populate('agents editors', 'firstname lastname')
      .exec();
    res.status(200).send({ success: true, data: students });
  } else if (user.role === Role.Agent) {
    const students = await Student.find({
      agents: TaiGerStaffId,
      archiv: true
    })
      .populate('agents editors', 'firstname lastname')
      .populate('applications.programId')
      .lean()
      .exec();

    res.status(200).send({ success: true, data: students });
  } else if (user.role === Role.Editor) {
    const students = await Student.find({
      editors: TaiGerStaffId,
      archiv: true
    })
      .populate('agents editors', 'firstname lastname')
      .populate('applications.programId');
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
