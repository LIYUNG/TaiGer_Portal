const { ErrorResponse } = require("../common/errors");
const path = require("path");
const { asyncHandler } = require("../middlewares/error-handler");
const { Role, Agent, Student, Editor } = require("../models/User");
const { Task } = require("../models/Task");
var async = require("async");
const fs = require("fs");
const {
  informAgentNewStudentEmail,
  informStudentTheirAgentEmail,
  informEditorNewStudentEmail,
  informStudentTheirEditorEmail,
} = require("../services/email");

const getTasks = asyncHandler(async (req, res) => {
  const { user } = req;

  if (user.role === "Admin") {
    const tasks = await Student.find({
      $or: [{ archiv: { $exists: false } }, { archiv: false }],
    });
    res.status(200).send({ success: true, data: tasks });
  } else if (user.role === "Agent" || user.role === "Editor") {
    const tasks = await Task.find({
      student_id: { $in: user.students },
    });
    res.status(200).send({ success: true, data: tasks });
  } else if (user.role === "Student") {
    const tasks = await Task.findById(user._id);
    res.status(200).send({ success: true, data: [tasks] });
  } else {
    // Guest
    res.status(200).send({ success: true, data: [user] });
  }
});

const initTasks = asyncHandler(async (req, res) => {
  const {
    user,
    params: { studentId },
  } = req;
  const existed_tasks = await Task.find({ student_id: studentId });
  console.log(existed_tasks.length);
  if (existed_tasks.length > 0)
    throw new ErrorResponse(400, "Tasks are already initialized.");
  const new_tasks = await Task.create({ student_id: studentId });
  res.status(200).send({ success: true, data: [new_tasks] });
});

const updateTasks = asyncHandler(async (req, res) => {
  const {
    user,
    params: { studentId },
  } = req;
  const existed_tasks = await Task.findById(studentId);
  if (!existed_tasks)
    throw new ErrorResponse(400, "Tasks are not initialized yet.");
  res.status(200).send({ success: true, data: [existed_tasks] });
});

module.exports = {
  getTasks,
  initTasks,
  updateTasks,
};
