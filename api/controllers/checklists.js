const _ = require('lodash');
const { ErrorResponse } = require('../common/errors');
const { CheckListStatus } = require('../constants');

const { asyncHandler } = require('../middlewares/error-handler');
const { Role, Agent, Student, Editor } = require('../models/User');
const Checklist = require('../models/Checklist');
const logger = require('../services/logger');

const getChecklists = asyncHandler(async (req, res) => {
  const checklists = await Checklist.find();

  if (!checklists) {
    logger.error('getChecklists : no getChecklists');
    throw new ErrorResponse(400, 'no getChecklists');
  }

  return res.status(200).send({ success: true, data: checklists });
});

const createChecklists = asyncHandler(async (req, res) => {
  const { msg } = req.body;
  const item = await Checklist.findOne({ prop: msg.prop });
  msg.updatedAt = new Date();
  if (!item) {
    const newDoc = await Checklist.create(msg);
    return res.send({ success: true, data: newDoc });
  }

  // TODO udpate
  const updated_doc = await Checklist.findOneAndUpdate(
    { prop: msg.prop },
    msg,
    { new: true }
  );
  return res.send({ success: true, data: updated_doc });
});

const updateChecklistStatus = asyncHandler(async (req, res) => {
  const { student_id, item } = req.params;
  const student = await Student.findById(student_id);
  if (student.checklist[item].status !== CheckListStatus.Finished) {
    student.checklist[item].status = CheckListStatus.Finished;
  } else {
    student.checklist[item].status = CheckListStatus.NotStarted;
  }
  await student.save();
  return res.status(201).send({ success: true, data: student });
});

const deleteChecklist = asyncHandler(async (req, res) => {
  await Checklist.findByIdAndDelete(req.params.id);
  return res.send({ success: true });
});

module.exports = {
  getChecklists,
  createChecklists,
  updateChecklistStatus,
  deleteChecklist
};
