const _ = require('lodash');
const { ErrorResponse } = require('../common/errors');

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
  if (!item) {
    // TODO create
    const fields = _.omit(req.body, '_id');
    const newDoc = await Checklist.create(fields);
    return res.send({ success: true, data: newDoc });
  }

  // TODO udpate
  await Checklist.findOneAndUpdate({ prop: msg.prop }, msg, { new: true });
  const updated_doc = await Checklist.findOne({ prop: msg.prop });
  return res.send({ success: true, data: updated_doc });
});

const updateChecklist = asyncHandler(async (req, res) => {
  await Checklist.findByIdAndUpdate(req.params.id, req.body);
  const updated_doc = await Checklist.findById(req.params.id);
  return res.status(201).send({ success: true, data: updated_doc });
});

const deleteChecklist = asyncHandler(async (req, res) => {
  await Checklist.findByIdAndDelete(req.params.id);
  return res.send({ success: true });
});

module.exports = {
  getChecklists,
  createChecklists,
  updateChecklist,
  deleteChecklist
};
