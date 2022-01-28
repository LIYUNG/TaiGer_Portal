const _ = require("lodash");

const { asyncHandler } = require("../middlewares/error-handler");
const { User, Agent, Editor, Student } = require("../models/User");

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).send({ success: true, data: users });
});

const updateUser = asyncHandler(async (req, res) => {
  const fields = _.pick(req.body, ["name", "email", "role"]);
  // TODO: check if email in use already and if role is valid
  console.log(fields);
  const user = await User.findByIdAndUpdate(req.params.id, fields, {
    new: true,
    runValidators: true,
  });

  return res.status(200).send({ success: true, data: user });
  //TODO: Email inform Guest, the updated status 
});

const deleteUser = asyncHandler(async (req, res) => {
  // TODO: also remove the relationships and data users have
  await User.findByIdAndDelete(req.params.id);
  res.status(200).send({ success: true });
});

const getAgents = asyncHandler(async (req, res, next) => {
  const agents = await Agent.find().populate("students", "_id name");
  res.status(200).send({ success: true, data: agents });
});

const getEditors = asyncHandler(async (req, res, next) => {
  const editors = await Editor.find().populate("students", "_id name");
  res.status(200).send({ success: true, data: editors });
});

module.exports = {
  getUsers,
  updateUser,
  deleteUser,
  getAgents,
  getEditors,
};
