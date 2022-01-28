const { ErrorResponse } = require("../common/errors");
const { asyncHandler } = require("../middlewares/error-handler");
const { Role, Agent, Student, Editor } = require("../models/User");
const { Program } = require("../models/Program");
var async = require("async");
const fs = require("fs");

const getStudents = asyncHandler(async (req, res) => {
  // const { userId } = req.params;
  // const user = await Student.findById(userId);
  const {
    user,
    // params: { userId },
  } = req;
  if (user.role === "Admin") {
    const students = await Student.find({
      $or: [{ archiv: { $exists: false } }, { archiv: false }],
    })
      .populate("applications.programId agents editors")
      .lean();
    res.status(200).send({ success: true, data: students });
  } else if (user.role === "Agent") {
    const students = await Student.find({
      _id: { $in: user.students },
      $or: [{ archiv: { $exists: false } }, { archiv: false }],
    })
      .populate("applications.programId agents editors")
      .lean()
      .exec();
    // console.log(Object.entries(students[0].applications[0].programId)); // looks ok!
    // console.log(students[0].applications[0].programId); // looks ok!
    // console.log(students[0].applications[0].programId.University_);

    res.status(200).send({ success: true, data: students });
  } else if (user.role === "Editor") {
    const students = await Student.find({
      _id: { $in: user.students },
      $or: [{ archiv: { $exists: false } }, { archiv: false }],
    }).populate("applications.programId agents editors");
    res.status(200).send({ success: true, data: students });
  } else if (user.role === "Student") {
    const student = await Student.findById(user._id)
      .populate("applications.programId")
      .populate("agents", "-students")
      .populate("editors", "-students")
      .lean()
      .exec();
    res.status(200).send({ success: true, data: [student] });
  } else {
    // Guest
    res.status(200).send({ success: true, data: [user] });
  }
});

const getArchivStudents = asyncHandler(async (req, res) => {
  const {
    user,
    // params: { userId },
  } = req;

  if (user.role === "Admin") {
    const students = await Student.find({ archiv: true })
      .populate("applications.programId")
      .lean();
    res.status(200).send({ success: true, data: students });
  } else if (user.role === "Agent") {
    const students = await Student.find({
      _id: { $in: user.students },
      archiv: true,
    })
      .populate("applications.programId")
      .lean()
      .exec();

    res.status(200).send({ success: true, data: students });
  } else if (user.role === "Editor") {
    const students = await Student.find({
      _id: { $in: user.students },
      archiv: true,
    }).populate("applications.programId");
    res.status(200).send({ success: true, data: students });
  } else {
    // Guest
    res.status(200).send({ success: true, data: [] });
  }
});

const updateStudentsArchivStatus = asyncHandler(async (req, res) => {
  const {
    user,
    params: { studentId },
    body: { isArchived },
  } = req;
  if (
    user.role === "Admin" ||
    user.role === "Agent" ||
    user.role === "Editor"
  ) {
    let student = await Student.findByIdAndUpdate(
      studentId,
      {
        archiv: isArchived,
      },
      { strict: false }
    );
    if (isArchived) {
      // return dashboard students
      if (user.role === "Admin") {
        const students = await Student.find({
          $or: [{ archiv: { $exists: false } }, { archiv: false }],
        })
          .populate("applications.programId agents editors")
          .lean();
        // console.log(students);
        res.status(200).send({ success: true, data: students });
      } else if (user.role === "Agent") {
        const students = await Student.find({
          _id: { $in: user.students },
          $or: [{ archiv: { $exists: false } }, { archiv: false }],
        })
          .populate("applications.programId agents editors")
          .lean()
          .exec();
        res.status(200).send({ success: true, data: students });
      } else if (user.role === "Editor") {
        const students = await Student.find({
          _id: { $in: user.students },
          $or: [{ archiv: { $exists: false } }, { archiv: false }],
        }).populate("applications.programId agents editors");
        res.status(200).send({ success: true, data: students });
      }
    } else {
      if (user.role === "Admin") {
        const students = await Student.find({ archiv: true })
          .populate("applications.programId agents editors")
          .lean();
        res.status(200).send({ success: true, data: students });
      } else if (user.role === "Agent") {
        const students = await Student.find({
          _id: { $in: user.students },
          archiv: true,
        })
          .populate("applications.programId agents editors")
          .lean()
          .exec();

        res.status(200).send({ success: true, data: students });
      } else if (user.role === "Editor") {
        const students = await Student.find({
          _id: { $in: user.students },
          archiv: true,
        }).populate("applications.programId");
        res.status(200).send({ success: true, data: students });
      } else {
        // Guest
        res.status(200).send({ success: true, data: [] });
      }
    }
  } else {
    // Guest
    res.status(200).send({ success: true, data: [] });
  }
});

const assignAgentToStudent = asyncHandler(async (req, res, next) => {
  const {
    params: { id: studentId },
    body: agentsId, // agentsId is json (or agentsId array with boolean)
  } = req;
  const keys = Object.keys(agentsId);
  // console.log(keys);
  let updated_agent_id = [];
  for (let i = 0; i < keys.length; i++) {
    if (agentsId[keys[i]]) {
      updated_agent_id.push(keys[i]);
      await Agent.findByIdAndUpdate(keys[i], {
        $addToSet: { students: studentId },
      });
    } else {
      await Agent.findByIdAndUpdate(keys[i], {
        $pull: { students: studentId },
      });
    }
  }

  console.log(updated_agent_id);
  // if (!agentIds) throw new ErrorResponse(400, "Invalid AgentId");

  // TODO: transaction?
  // await Student.findByIdAndUpdate(studentId, {
  //   $push: { agents: agentsId },
  // });
  await Student.findByIdAndUpdate(studentId, {
    agents: updated_agent_id,
  });
  const student = await Student.findById(studentId)
    .populate("applications.programId agents editors")
    .exec();
  res.status(200).send({ success: true, data: student });

  //TODO: email inform Student for(assigned agent) and inform Agent for (your new student)
});

const assignEditorToStudent = asyncHandler(async (req, res, next) => {
  const {
    params: { id: studentId },
    body: editorsId,
  } = req;
  const keys = Object.keys(editorsId);
  // console.log(keys);
  let updated_editor_id = [];
  for (let i = 0; i < keys.length; i++) {
    // const agent = await Agent.findById(({ editorsId }) => editorsId);
    if (editorsId[keys[i]]) {
      updated_editor_id.push(keys[i]);
      await Editor.findByIdAndUpdate(keys[i], {
        $addToSet: { students: studentId },
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
  const student = await Student.findById(studentId)
    .populate("applications.programId agents editors")
    .exec();
  // console.log(student);
  res.status(200).send({ success: true, data: student });

  //TODO: email inform Student for(assigned editor) and inform editor for (your new student)
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
  const {
    user,
    params: { studentId, applicationId, docName },
  } = req;
  // TODO: remove uploaded files before remove program

  // retrieve studentId differently depend on if student or Admin/Agent uploading the file
  let student = await Student.findById(studentId).populate(
    "applications.programId"
  );
  if (!student) throw new ErrorResponse(400, "Invalid student id");

  // console.log(student.applications);
  // console.log(applicationId);
  const idx = student.applications.findIndex(({ _id }) => _id == applicationId);
  // console.log(idx);

  const application = student.applications.find(
    ({ _id }) => _id == applicationId
  );
  // console.log(application);
  if (!application) throw new ErrorResponse(400, "Invalid application id");

  // TODO: iteratively to remove files
  for (let i = 0; i < application.documents.length; i++) {
    let document = application.documents[i];
    if (!document) throw new ErrorResponse(400, "docName not existed");
    if (document.path !== "") {
      const filePath = document.path; //tmp\files_development\studentId\\<bachelorTranscript_>
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
  }

  //////// update DB
  await Student.findByIdAndUpdate(studentId, {
    $pull: { applications: { _id: applicationId } },
  });
  res.status(200).send({ success: true });
});

module.exports = {
  getStudents,
  getArchivStudents,
  updateStudentsArchivStatus,
  assignAgentToStudent,
  assignEditorToStudent,
  createApplication,
  deleteApplication,
};
