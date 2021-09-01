const _ = require("lodash");

const { asyncHandler } = require("../middlewares/error-handler");
const { Role } = require("../models/User");
const Student = require("../models/Students");

const getUsers = asyncHandler(async (req, res) => {
  const users = await Student.find();
  res.send({ data: users });
});

const updateUser = asyncHandler(async (req, res) => {
  const fields = _.pick(req.body, [
    "firstname_",
    "lastname_",
    "emailaddress_",
    "role_",
  ]);
  // TODO: check if email in use already and if role is valid

  const user = await Student.findByIdAndUpdate(req.params.id, fields, {
    new: true,
    runValidators: true,
  });

  return res.status(200).send({ data: user });
});

const deleteUser = asyncHandler(async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.status(200).send({ data: "success" });
});

const getAgents = asyncHandler(async (req, res, next) => {
  const agents = await Student.find({ role_: Role.Agent });
  res.status(200).send({ data: agents });
});

const getEditors = asyncHandler(async (req, res, next) => {
  const editors = await Student.find({ role_: Role.Editor });
  res.status(200).send({ data: editors });
});

module.exports = {
  getUsers,
  updateUser,
  deleteUser,
  getAgents,
  getEditors,
};
