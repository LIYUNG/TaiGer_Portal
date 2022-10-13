const _ = require('lodash');

const { asyncHandler } = require('../middlewares/error-handler');
const Documentation = require('../models/Documentation');

const getCategoryDocumentations = asyncHandler(async (req, res) => {
  const documents = await Documentation.find({
    category: req.params.category
  });
  return res.send({ success: true, data: documents });
});

const getDocumentation = asyncHandler(async (req, res) => {
  const document = await Documentation.findById(req.params.doc_id);
  return res.send({ success: true, data: document });
});

const createDocumentation = asyncHandler(async (req, res) => {
  const fields = _.omit(req.body, '_id');
  console.log(fields);
  const newDoc = await Documentation.create(fields);
  return res.send({ success: true, data: newDoc });
});

const updateDocumentation = asyncHandler(async (req, res) => {
  await Documentation.findByIdAndUpdate(req.params.id, req.body);
  const updated_doc = await Documentation.findById(req.params.id);
  return res.status(201).send({ success: true, data: updated_doc });
});

const deleteDocumentation = asyncHandler(async (req, res) => {
  await Documentation.findByIdAndDelete(req.params.id);
  return res.send({ success: true });
});

module.exports = {
  getCategoryDocumentations,
  getDocumentation,
  createDocumentation,
  updateDocumentation,
  deleteDocumentation
};
