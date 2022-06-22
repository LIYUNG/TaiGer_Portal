const { ErrorResponse } = require("../common/errors");
const path = require("path");
const { asyncHandler } = require("../middlewares/error-handler");
const { Role, Agent, Student, Editor } = require("../models/User");
const { Program } = require("../models/Program");
const { UPLOAD_PATH } = require("../config");
var async = require("async");
const fs = require("fs");
const {
  informAgentNewStudentEmail,
  informStudentTheirAgentEmail,
  informEditorNewStudentEmail,
  informStudentTheirEditorEmail,
} = require("../services/email");

const getStudent = asyncHandler(async (req, res) => {
  const {
    user,
    params: { studentId },
  } = req;

  const student = await Student.findById(studentId)
    .populate("applications.programId agents editors")
    .lean();
  res.status(200).send({ success: true, data: student });
});

const getAllStudents = asyncHandler(async (req, res) => {
  const {
    user,
    // params: { userId },
  } = req;
  const students = await Student.find();
    // .populate("applications.programId agents editors");
    // .lean();
  res.status(200).send({ success: true, data: students });
});

const getStudents = asyncHandler(async (req, res) => {
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
    // console.log(students[0].applications[0].programId.school);

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
const getArchivStudent = asyncHandler(async (req, res) => {
  const {
    user,
    params: { studentId },
  } = req;

  if (user.role === "Guest" || user.role === "Student") {
    throw new ErrorResponse(400, "Unauthorized access.");
  }
  const students = await Student.find({ _id: studentId, archiv: true })
    .populate("applications.programId agents editors");
    // .lean();
  res.status(200).send({ success: true, data: students[0] });
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
    params: { studentId },
    body: agentsId, // agentsId is json (or agentsId array with boolean)
  } = req;
  const keys = Object.keys(agentsId);
  // console.log(keys);
  var updated_agent_id = [];
  var updated_agent = [];
  for (let i = 0; i < keys.length; i++) {
    if (agentsId[keys[i]]) {
      updated_agent_id.push(keys[i]);
      await Agent.findByIdAndUpdate(keys[i], {
        $addToSet: { students: studentId },
      });
      const agent = await Agent.findById(keys[i]);
      updated_agent.push({
        firstname: agent.firstname,
        lastname: agent.lastname,
        email: agent.email,
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
  console.log(updated_agent);
  for (let i = 0; i < updated_agent.length; i++) {
    await informAgentNewStudentEmail(
      {
        firstname: updated_agent[i].firstname,
        lastname: updated_agent[i].lastname,
        address: updated_agent[i].email,
      },
      {
        std_firstname: student.firstname,
        std_lastname: student.lastname,
      }
    );
  }
  await informStudentTheirAgentEmail(
    {
      firstname: student.firstname,
      lastname: student.lastname,
      address: student.email,
    },
    {
      agents: updated_agent,
    }
  );
  //TODO: email inform Student for(assigned agent) and inform Agent for (your new student)
});

const assignEditorToStudent = asyncHandler(async (req, res, next) => {
  const {
    params: { studentId },
    body: editorsId,
  } = req;
  const keys = Object.keys(editorsId);
  // console.log(keys);
  var updated_editor_id = [];
  var updated_editor = [];
  for (let i = 0; i < keys.length; i++) {
    // const agent = await Agent.findById(({ editorsId }) => editorsId);
    if (editorsId[keys[i]]) {
      updated_editor_id.push(keys[i]);
      await Editor.findByIdAndUpdate(keys[i], {
        $addToSet: { students: studentId },
      });
      const editor = await Editor.findById(keys[i]);
      updated_editor.push({
        firstname: editor.firstname,
        lastname: editor.lastname,
        email: editor.email,
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
  console.log(updated_editor);
  for (let i = 0; i < updated_editor.length; i++) {
    await informEditorNewStudentEmail(
      {
        firstname: updated_editor[i].firstname,
        lastname: updated_editor[i].lastname,
        address: updated_editor[i].email,
      },
      {
        std_firstname: student.firstname,
        std_lastname: student.lastname,
      }
    );
  }
  await informStudentTheirEditorEmail(
    {
      firstname: student.firstname,
      lastname: student.lastname,
      address: student.email,
    },
    {
      editors: updated_editor,
    }
  );
  // for()
  //TODO: email inform Student for(assigned editor) and inform editor for (your new student)
});

const createApplication = asyncHandler(async (req, res) => {
  const {
    user,
    params: { studentId },
    body: { program_id_set },
  } = req;
  const student = await Student.findById(studentId);
  try {
    for (var i = 0; i < program_id_set.length; i++) {
      const programIds = student.applications.map(({ programId }) => programId);
      if (programIds.includes(program_id_set[i])) continue;
      const program = await Program.findById(program_id_set[i]);
      // const { requiredDocuments, optionalDocuments } = program;
      const now = new Date();
      const application = student.applications.create({
        programId: program_id_set[i],
      });
      // application.documents = [
      //   ...requiredDocuments.map((name) => ({
      //     name,
      //     required: true,
      //     updatedAt: now,
      //   })),
      //   ...optionalDocuments.map((name) => ({
      //     name,
      //     required: false,
      //     updatedAt: now,
      //   })),
      // ];
      student.applications.push(application);
      await student.save();
    }
  } catch (err) {
    console.log(err);
    throw new ErrorResponse(400, err);
  }

  res.status(201).send({ success: true, data: program_id_set });
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
  const idx = student.applications.findIndex(
    ({ programId }) => programId._id == applicationId
  );
  // console.log(idx);

  const application = student.applications.find(
    ({ programId }) => programId._id == applicationId
  );
  // console.log(application);
  if (!application) throw new ErrorResponse(400, "Invalid application id");

  // TODO: iteratively to remove files
  if (application.documents)
    for (let i = 0; i < application.documents.length; i++) {
      var document = application.documents[i];
      if (!document) throw new ErrorResponse(400, "docName not existed");
      if (document.path)
        if (document.path !== "") {
          const filePath = path.join(UPLOAD_PATH, document.path);
          // const filePath = document.path; //tmp\files_development\studentId\\<bachelorTranscript_>
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
    }
  //Delete student inputs
  if (application.student_inputs)
    for (let i = 0; i < application.student_inputs.length; i++) {
      var student_input = application.student_inputs[i];
      if (!student_input) throw new ErrorResponse(400, "docName not existed");
      if (student_input.path)
        if (student_input.path !== "") {
          const filePath = path.join(UPLOAD_PATH, student_input.path);
          // const filePath = document.path; //tmp\files_development\studentId\\<bachelorTranscript_>
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
    }

  await Student.findByIdAndUpdate(studentId, {
    $pull: { applications: { programId: { _id: applicationId } } },
  });
  const folderPath = path.join(UPLOAD_PATH, studentId, applicationId);
  try {
    //TODO: better implementation is to find all document in that folder and remove recursively and finally rmdirSync
    // See:　https://stackoverflow.com/questions/49025244/error-eperm-operation-not-permitted-while-remove-directory-not-emty/49025300
    if (fs.existsSync(folderPath)) fs.rmdirSync(folderPath); //failed when folder not empty:EPERM: operation not permitted, unlink 'tmp\files_development\60a116ba6f221e768c0803c7\60a138f6c355006b00684620'
  } catch (err) {
    throw new ErrorResponse(500, "Your Application folder not empty!");
  }
  //////// update DB

  res.status(200).send({ success: true });
});

module.exports = {
  getStudent,
  getAllStudents,
  getStudents,
  getArchivStudent,
  getArchivStudents,
  updateStudentsArchivStatus,
  assignAgentToStudent,
  assignEditorToStudent,
  createApplication,
  deleteApplication,
};
