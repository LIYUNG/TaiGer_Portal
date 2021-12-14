const { ErrorResponse } = require("../common/errors");
const { asyncHandler } = require("../middlewares/error-handler");
const { Role, Agent, Student, Editor } = require("../models/User");
const { Program } = require("../models/Program");

const getStudents = asyncHandler(async (req, res) => {
  // const { userId } = req.params;
  // const user = await Student.findById(userId);
  const {
    user,
    // params: { userId },
  } = req;

  // console.log(user);
  // console.log(req.params);

  if (user.role === "Admin") {
    const students = await Student.find()
      .populate("applications.programId")
      .lean();
    res.status(200).send({ success: true, data: students });
  } else if (user.role === "Agent") {
    const students = await Student.find({
      _id: { $in: user.students },
    })
      .populate("applications.programId")
      .lean()
      .exec();
    // console.log(Object.entries(students[0].applications[0].programId)); // looks ok!
    // console.log(students[0].applications[0].programId); // looks ok!
    // console.log(students[0].applications[0].programId.University_);

    res.status(200).send({ success: true, data: students });
  } else if (user.role === "Editor") {
    const students = await Student.find({
      _id: { $in: user.students },
    }).populate("applications.programId");
    res.status(200).send({ success: true, data: students });
  } else if (user.role === "Student") {
    const student = await Student.findById(user._id)
      .populate("applications.programId")
      .populate("agents")
      .populate("editors")
      .lean()
      .exec();
    res.status(200).send({ success: true, data: [student] });
  } else {
    // Guest
    res.status(200).send({ success: true, data: [user] });
  }
});

const assignAgentToStudent = asyncHandler(async (req, res, next) => {
  // TODO: update student's agent ang agent's student view
  const {
    params: { id: studentId },
    body: agentsId, // agentsId is json (or agentsId array with boolean)
  } = req;
  console.log(agentsId);
  const keys = Object.keys(agentsId);
  console.log(keys);
  let updated_agent_id = [];
  for (let i = 0; i < keys.length; i++) {
    // const agent = await Agent.findById(({ agentsId }) => agentsId);
    if (agentsId[keys[i]]) {
      updated_agent_id.push(keys[i]);
      await Agent.findByIdAndUpdate(keys[i], {
        $push: { students: studentId },
      });
    } else {
      await Agent.findByIdAndUpdate(keys[i], {
        $pull: { students: studentId },
      });
    }
  }
  console.log(updated_agent_id);
  // console.log(agentIds);
  // if (!agentIds) throw new ErrorResponse(400, "Invalid AgentId");

  // TODO: transaction?
  // await Student.findByIdAndUpdate(studentId, {
  //   $push: { agents: agentsId },
  // });

  await Student.findByIdAndUpdate(studentId, {
    agents: updated_agent_id,
  });
  res.status(200).send({ success: true });
});

const removeAgentFromStudent = asyncHandler(async (req, res, next) => {
  const { studentId, agentId } = req.params;

  // TODO: transaction?
  await Student.findByIdAndUpdate(studentId, {
    $pull: { agents: agentId },
  });

  await Agent.findByIdAndUpdate(agentId, {
    $pull: { students: studentId },
  });

  res.status(200).send({ success: true });
});

const assignEditorToStudent = asyncHandler(async (req, res, next) => {
  const {
    params: { id: studentId },
    body: editorsId,
  } = req;
  console.log(editorsId);
  const keys = Object.keys(editorsId);
  console.log(keys);
  let updated_editor_id = [];
  for (let i = 0; i < keys.length; i++) {
    // const agent = await Agent.findById(({ editorsId }) => editorsId);
    if (editorsId[keys[i]]) {
      updated_editor_id.push(keys[i]);
      await Editor.findByIdAndUpdate(keys[i], {
        $push: { students: studentId },
      });
    } else {
      await Editor.findByIdAndUpdate(keys[i], {
        $pull: { students: studentId },
      });
    }
  }
  console.log(updated_editor_id);
  // TODO: check studentId and editorsId are valid
  // const editorsIds = await Editor.findById(({ editorsId }) => editorsId);
  // if (!editorsIds) throw new ErrorResponse(400, "Invalid editorsId");

  // // TODO: transaction?
  // await Student.findByIdAndUpdate(studentId, {
  //   $push: { editors: editorsId },
  // });

  await Student.findByIdAndUpdate(studentId, {
    editors: updated_editor_id,
  });
  res.status(200).send({ success: true });
});

const removeEditorFromStudent = asyncHandler(async (req, res, next) => {
  const { studentId, editorId } = req.params;

  // TODO: transaction?
  await Student.findByIdAndUpdate(studentId, {
    $pull: { editors: editorId },
  });

  await Editor.findByIdAndUpdate(editorId, {
    $pull: { students: studentId },
  });

  res.status(200).send({ success: true });
});

const createApplication = asyncHandler(async (req, res) => {
  const {
    user,
    params: { studentId },
    body: { programId },
  } = req;
  const student =
    user.role == Role.Student ? user : await Student.findById(studentId);
  const programIds = student.applications.map(({ programId }) => programId);
  if (programIds.includes(programId))
    throw new ErrorResponse(400, "Duplicate program");
  const program = await Program.findById(programId);
  const { requiredDocuments, optionalDocuments } = program;
  const now = new Date();
  const application = student.applications.create({ programId });
  application.documents = [
    ...requiredDocuments.map((name) => ({
      name,
      required: true,
      updatedAt: now,
    })),
    ...optionalDocuments.map((name) => ({
      name,
      required: false,
      updatedAt: now,
    })),
  ];
  student.applications.push(application);
  await student.save();

  res.status(201).send({ success: true, data: application });
});

const deleteApplication = asyncHandler(async (req, res, next) => {
  const { studentId, applicationId } = req.params;
  await Student.findByIdAndUpdate(studentId, {
    $pull: { applications: { _id: applicationId } },
  });
  // TODO: remove uploaded files
  // Not to remove common files like CV, Bachelor degree etc. (applications independent)
  res.status(200).send({ success: true });
});

module.exports = {
  getStudents,
  assignAgentToStudent,
  removeAgentFromStudent,
  assignEditorToStudent,
  removeEditorFromStudent,
  createApplication,
  deleteApplication,
};
