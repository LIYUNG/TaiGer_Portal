const _ = require("lodash");

const { asyncHandler } = require("../middlewares/error-handler");
const Documentation = require("../models/Documentation");

const getDocumentations = asyncHandler(async (req, res) => {
  const documents = await Documentation.find({
    Category_: req.params.category,
  });
  return res.send({ success: true, data: documents, role: req.user.role_ });
});

const createDocumentation = asyncHandler(async (req, res) => {
  const fields = _.omit(req.body, "_id");
  const newDoc = await Documentation.create(fields);
  return res.send({ success: true, data: newDoc });
});

const updateDocumentation = asyncHandler(async (req, res) => {
  await Documentation.findByIdAndUpdate(req.params.id, req.body);
  return res.send({ success: true });
});

const deleteDocumentation = asyncHandler(async (req, res) => {
  await Documentation.findByIdAndDelete(req.params.id);
  return res.send({ success: true });
});

module.exports = {
  getDocumentations,
  createDocumentation,
  updateDocumentation,
  deleteDocumentation,
};
