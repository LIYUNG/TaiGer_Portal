const _ = require('lodash');
const { ErrorResponse } = require('../common/errors');

const { asyncHandler } = require('../middlewares/error-handler');
const Documentation = require('../models/Documentation');
const logger = require('../services/logger');

const getCategoryDocumentations = asyncHandler(async (req, res) => {
  // TODO: validate req.params.category
  const valid_categories = [
    'application',
    'portal-instruction',
    'certification',
    'uniassist',
    'visa'
  ];
  if (
    valid_categories.findIndex(
      (category) => category === req.params.category
    ) === -1
  ) {
    logger.error('getCategoryDocumentations : invalid category');
    throw new ErrorResponse(400, 'invalid category');
  }
  const documents = await Documentation.find(
    {
      category: req.params.category
    },
    { text: 0 } // exclude text field
  );
  return res.send({ success: true, data: documents });
});

const getDocumentation = asyncHandler(async (req, res) => {
  const document = await Documentation.findById(req.params.doc_id);
  return res.send({ success: true, data: document });
});

const createDocumentation = asyncHandler(async (req, res) => {
  const fields = _.omit(req.body, '_id');
  const newDoc = await Documentation.create(fields);
  return res.send({ success: true, data: newDoc });
});

const updateDocumentation = asyncHandler(async (req, res) => {
  const updated_doc = await Documentation.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
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
