const _ = require('lodash');

const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const { User, Agent, Editor, Student, Role } = require('../models/User');
const { Program } = require('../models/Program');
const { Documentthread } = require('../models/Documentthread');
const logger = require('../services/logger');
const Permission = require('../models/Permission');
const { getStudentsByProgram } = require('./programs');
const { findStudentDelta } = require('../utils/modelHelper/programChange');

const getActivePrograms = async () => {
  const activePrograms = await User.aggregate([
    {
      $match: {
        role: 'Student',
        archiv: {
          $ne: true
        }
      }
    },
    {
      $project: {
        applications: 1
      }
    },
    {
      $unwind: {
        path: '$applications'
      }
    },
    {
      $match: {
        'applications.decided': 'O',
        'applications.closed': '-'
      }
    },
    {
      $group: {
        _id: '$applications.programId',
        count: {
          $sum: 1
        }
      }
    },
    {
      $sort: {
        count: -1
      }
    }
  ]);

  return activePrograms;
};

const getStudentDeltas = async (student, program, options) => {
  const deltas = await findStudentDelta(student._id, program, options || {});
  if (deltas?.add?.length === 0 && deltas?.remove?.length === 0) {
    return;
  }
  const studentDelta = {
    _id: student._id,
    firstname: student.firstname,
    lastname: student.lastname,
    deltas
  };
  return studentDelta;
};

const getApplicationDeltaByProgram = async (programId) => {
  const students = await getStudentsByProgram(programId);
  const program = await Program.findById(programId);
  const studentDeltaPromises = [];
  const options = { skipCompleted: true };
  for (let student of students) {
    if (!student.application || student.application.closed !== '-') {
      continue;
    }
    const studentDelta = getStudentDeltas(student, program, options);
    studentDeltaPromises.push(studentDelta);
  }
  let studentDeltas = await Promise.all(studentDeltaPromises);
  studentDeltas = studentDeltas.filter((student) => student);
  const { _id, school, program_name, degree, semester } = program;
  return studentDeltas.length !== 0
    ? {
        program: { _id, school, program_name, degree, semester },
        students: studentDeltas
      }
    : {};
};

const getApplicationDeltas = asyncHandler(async (req, res) => {
  const activePrograms = await getActivePrograms();
  const deltaPromises = [];
  for (let program of activePrograms) {
    const programDeltaPromise = getApplicationDeltaByProgram(program._id);
    deltaPromises.push(programDeltaPromise);
  }
  const deltas = await Promise.all(deltaPromises);
  res.status(200).send({
    success: true,
    data: deltas.filter((obj) => Object.keys(obj).length !== 0)
  });
});

const getTeamMembers = asyncHandler(async (req, res) => {
  const users = await User.aggregate([
    {
      $match: {
        role: { $in: ['Admin', 'Agent', 'Editor'] },
        $or: [{ archiv: { $exists: false } }, { archiv: false }]
      }
    },
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

const getFileTypeCount = async () => {
  const counts = await Documentthread.aggregate([
    { $match: { isFinalVersion: false } },
    { $group: { _id: '$file_type', count: { $sum: 1 } } }
  ]);
  const fileTypeCounts = {};
  counts.forEach((count) => {
    if (
      count._id.includes('RL_') ||
      count._id.includes('Recommendation_Letter_')
    ) {
      fileTypeCounts['RL'] = {
        count: (fileTypeCounts['RL']?.count || 0) + count.count
      };
    } else {
      fileTypeCounts[count._id.toUpperCase()] = {
        count: count.count
      };
    }
  });
  return fileTypeCounts;
};

const getAgentData = async (agent) => {
  const agentStudents = await Student.find({
    agents: agent._id,
    $or: [{ archiv: { $exists: false } }, { archiv: false }]
  }).lean();
  const student_num_with_offer = agentStudents.filter((std) =>
    std.applications.some((application) => application.admission === 'O')
  ).length;
  const agentData = {};
  agentData._id = agent._id.toString();
  agentData.firstname = agent.firstname;
  agentData.lastname = agent.lastname;
  agentData.student_num_no_offer =
    agentStudents.length - student_num_with_offer;
  agentData.student_num_with_offer = student_num_with_offer;
  return agentData;
};

const getEditorData = async (editor) => {
  const editorData = {};
  editorData._id = editor._id.toString();
  editorData.firstname = editor.firstname;
  editorData.lastname = editor.lastname;
  editorData.student_num = await Student.find({
    editors: editor._id,
    $or: [{ archiv: { $exists: false } }, { archiv: false }]
  }).count();
  return editorData;
};

const getStatistics = asyncHandler(async (req, res) => {
  const agents = await Agent.find({
    $or: [{ archiv: { $exists: false } }, { archiv: false }]
  });
  const editors = await Editor.find({
    $or: [{ archiv: { $exists: false } }, { archiv: false }]
  });

  const agentsPromises = Promise.all(
    agents.map((agent) => getAgentData(agent))
  );
  const editorsPromises = Promise.all(
    editors.map((editor) => getEditorData(editor))
  );

  const documentsPromise = getFileTypeCount();
  const finDocsPromise = Documentthread.find({
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

  const studentsPromise = Student.find()
    .populate('agents editors', 'firstname lastname')
    .populate('applications.programId')
    .populate(
      'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
      '-messages'
    );

  const usersPromise = User.find({
    role: { $in: ['Admin', 'Agent', 'Editor'] }
  }).lean();

  const archivCountPromise = Student.aggregate([
    {
      $group: {
        _id: '$archiv',
        count: { $sum: 1 }
      }
    }
  ]);

  const [
    agents_data,
    editors_data,
    documentsData,
    finishedDocs,
    students,
    users,
    archivCount
  ] = await Promise.all([
    agentsPromises,
    editorsPromises,
    documentsPromise,
    finDocsPromise,
    studentsPromise,
    usersPromise,
    archivCountPromise
  ]);

  res.status(200).send({
    success: true,
    data: users,
    documents: documentsData,
    students: {
      isClose: archivCount.find((count) => count._id === true)?.count || 0,
      isOpen: archivCount.find((count) => count._id === false)?.count || 0
    },
    finished_docs: finishedDocs,
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
      const agents = await Agent.find({
        $or: [{ archiv: { $exists: false } }, { archiv: false }]
      }).select('firstname lastname');
      res.status(200).send({ success: true, data: agents });
    } else {
      logger.error('getAgents: no permission');
      throw new ErrorResponse(
        403,
        'You do not have the permission to do this action'
      );
    }
  } else {
    const agents = await Agent.find({
      $or: [{ archiv: { $exists: false } }, { archiv: false }]
    }).select('firstname lastname');
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

const putAgentProfile = asyncHandler(async (req, res, next) => {
  const { agent_id } = req.params;
  const agent = await Agent.findById(agent_id).select(
    'firstname lastname email selfIntroduction'
  );

  res.status(200).send({ success: true, data: agent });
});

const getAgentProfile = asyncHandler(async (req, res, next) => {
  const { agent_id } = req.params;
  const agent = await Agent.findById(agent_id).select(
    'firstname lastname email selfIntroduction officehours timezone'
  );

  res.status(200).send({ success: true, data: agent });
});

const getEditors = asyncHandler(async (req, res, next) => {
  const { user } = req;
  if (user.role === 'Editor') {
    const permissions = await Permission.findOne({
      user_id: user._id.toString()
    });
    if (permissions && permissions.canAssignEditors) {
      const editors = await Editor.find({
        $or: [{ archiv: { $exists: false } }, { archiv: false }]
      }).select('firstname lastname');
      res.status(200).send({ success: true, data: editors });
    } else {
      logger.error('getEditors: no permission');
      throw new ErrorResponse(
        403,
        'You do not have the permission to do this action'
      );
    }
  } else {
    const editors = await Editor.find({
      $or: [{ archiv: { $exists: false } }, { archiv: false }]
    }).select('firstname lastname');
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

const getEssayWriters = asyncHandler(async (req, res, next) => {
  const { user } = req;
  if (user.role === 'Editor') {
    const permissions = await Permission.findOne({
      user_id: user._id.toString()
    });
    // if (permissions && permissions.canAssignEditors && permissions.isEssayWriters) {
    if (permissions && permissions.canAssignEditors) {
      const editors = await Editor.find({
        $or: [{ archiv: { $exists: false } }, { archiv: false }]
      }).select('firstname lastname');
      res.status(200).send({ success: true, data: editors });
    } else {
      logger.error('getEssayWriters: no permission');
      throw new ErrorResponse(
        403,
        'You do not have the permission to do this action'
      );
    }
  } else {
    const editors = await Editor.find({
      $or: [{ archiv: { $exists: false } }, { archiv: false }]
    }).select('firstname lastname');
    res.status(200).send({ success: true, data: editors });
  }
});

module.exports = {
  getTeamMembers,
  getStatistics,
  getAgents,
  getSingleAgent,
  putAgentProfile,
  getAgentProfile,
  getEditors,
  getSingleEditor,
  getArchivStudents,
  getEssayWriters,
  getApplicationDeltas
};
