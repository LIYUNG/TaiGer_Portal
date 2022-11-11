const _ = require('lodash');
const { ErrorResponse } = require('../common/errors');
const path = require('path');
const { Role, Agent, Student, Editor } = require('../models/User');

const { asyncHandler } = require('../middlewares/error-handler');
const Documentation = require('../models/Documentation');
const Internaldoc = require('../models/Internaldoc');
const Docspage = require('../models/Docspage');
const logger = require('../services/logger');
const {
  AWS_S3_ACCESS_KEY_ID,
  UPLOAD_PATH,
  AWS_S3_ACCESS_KEY,
  AWS_S3_BUCKET_NAME
} = require('../config');
const valid_categories = [
  'application',
  'base-documents',
  'cv-ml-rl',
  'portal-instruction',
  'certification',
  'uniassist',
  'visa'
];

const updateInternalDocumentationPage = asyncHandler(async (req, res) => {
  const { user } = req;
  const fields = _.omit(req.body, '_id');
  if (
    user.role !== Role.Admin &&
    user.role !== Role.Agent &&
    user.role !== Role.Editor
  ) {
    logger.error('updateInternalDocumentationPage : Not authorized');
    throw new ErrorResponse(403, 'Not authorized');
  }
  const interna_doc_page_existed = await Docspage.findOneAndUpdate(
    { category: 'internal' },
    req.body,
    { new: true }
  );
  let newDocPage;
  if (!interna_doc_page_existed) {
    newDocPage = await Docspage.create(fields);
    return res.status(201).send({ success: true, data: newDocPage });
  }
  return res
    .status(201)
    .send({ success: true, data: interna_doc_page_existed });
});

const getInternalDocumentationsPage = asyncHandler(async (req, res) => {
  const { user } = req;
  if (
    user.role !== Role.Admin &&
    user.role !== Role.Agent &&
    user.role !== Role.Editor
  ) {
    logger.error('getCategoryDocumentationsPage : Not authorized');
    throw new ErrorResponse(403, 'Not authorized');
  }
  const docspage = await Docspage.findOne({
    category: 'internal'
  });
  return res.send({ success: true, data: !docspage ? {} : docspage });
});

const updateDocumentationPage = asyncHandler(async (req, res) => {
  const fields = _.omit(req.body, '_id');
  const doc_page_existed = await Docspage.findOneAndUpdate(
    { category: req.params.category },
    req.body,
    { new: true }
  );
  let newDocPage;
  if (!doc_page_existed) {
    newDocPage = await Docspage.create(fields);
    return res.status(201).send({ success: true, data: newDocPage });
  }
  return res.status(201).send({ success: true, data: doc_page_existed });
});

const getCategoryDocumentationsPage = asyncHandler(async (req, res) => {
  const { user } = req;
  // TODO: validate req.params.category
  if (
    valid_categories.findIndex(
      (category) => category === req.params.category
    ) === -1
  ) {
    logger.error('getCategoryDocumentationsPage : invalid category');
    throw new ErrorResponse(400, 'invalid category');
  }

  if (req.params.category === 'internal') {
    if (
      user.role !== Role.Admin &&
      user.role !== Role.Agent &&
      user.role !== Role.Editor
    ) {
      logger.error('getCategoryDocumentationsPage : Not authorized');
      throw new ErrorResponse(403, 'Not authorized');
    }
  }

  const docspage = await Docspage.findOne({
    category: req.params.category
  });
  return res.send({ success: true, data: !docspage ? {} : docspage });
});

const getCategoryDocumentations = asyncHandler(async (req, res) => {
  // TODO: validate req.params.category
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

const getAllDocumentations = asyncHandler(async (req, res) => {
  const document = await Documentation.find();
  return res.send({ success: true, data: document });
});

const getAllInternalDocumentations = asyncHandler(async (req, res) => {
  const document = await Internaldoc.find();
  return res.send({ success: true, data: document });
});

const getDocumentation = asyncHandler(async (req, res) => {
  const document = await Documentation.findById(req.params.doc_id);
  return res.send({ success: true, data: document });
});

const getInternalDocumentation = asyncHandler(async (req, res) => {
  const document = await Internaldoc.findById(req.params.doc_id);
  return res.send({ success: true, data: document });
});

const createDocumentation = asyncHandler(async (req, res) => {
  const fields = _.omit(req.body, '_id');
  const newDoc = await Documentation.create(fields);
  return res.send({ success: true, data: newDoc });
});

const createInternalDocumentation = asyncHandler(async (req, res) => {
  const fields = _.omit(req.body, '_id');
  const newDoc = await Internaldoc.create(fields);
  return res.send({ success: true, data: newDoc });
});

const uploadDocImage = asyncHandler(async (req, res) => {
  let imageurl = new URL(`/Documentations/${req.file.key}`, UPLOAD_PATH).href;
  imageurl = imageurl.replace(/\\/g, '/');
  return res.send({ success: true, data: imageurl });
});

const updateDocumentation = asyncHandler(async (req, res) => {
  const updated_doc = await Documentation.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  return res.status(201).send({ success: true, data: updated_doc });
});

const updateInternalDocumentation = asyncHandler(async (req, res) => {
  const updated_doc = await Internaldoc.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  return res.status(201).send({ success: true, data: updated_doc });
});

const deleteDocumentation = asyncHandler(async (req, res) => {
  await Documentation.findByIdAndDelete(req.params.id);
  // TODO: delete documents images
  return res.send({ success: true });
});

const deleteInternalDocumentation = asyncHandler(async (req, res) => {
  await Internaldoc.findByIdAndDelete(req.params.id);
  // TODO: delete documents images
  return res.send({ success: true });
});

module.exports = {
  updateInternalDocumentationPage,
  getInternalDocumentationsPage,
  updateDocumentationPage,
  getCategoryDocumentationsPage,
  getCategoryDocumentations,
  getAllDocumentations,
  getAllInternalDocumentations,
  getDocumentation,
  getInternalDocumentation,
  createDocumentation,
  createInternalDocumentation,
  uploadDocImage,
  updateDocumentation,
  updateInternalDocumentation,
  deleteDocumentation,
  deleteInternalDocumentation
};
