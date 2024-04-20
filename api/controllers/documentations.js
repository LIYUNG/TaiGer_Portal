const _ = require('lodash');
const path = require('path');
const { ErrorResponse } = require('../common/errors');
const { Role } = require('../models/User');

const { asyncHandler } = require('../middlewares/error-handler');
const Documentation = require('../models/Documentation');
const Internaldoc = require('../models/Internaldoc');
const Docspage = require('../models/Docspage');
const { one_month_cache } = require('../cache/node-cache');
const logger = require('../services/logger');
const { getNumberOfDays } = require('../constants');
const { API_ORIGIN, AWS_S3_PUBLIC_BUCKET_NAME } = require('../config');

const { s3 } = require('../aws/index');

const valid_categories = [
  'howtostart',
  'application',
  'base-documents',
  'cv-ml-rl',
  'portal-instruction',
  'certification',
  'uniassist',
  'visa',
  'enrolment'
];
const DocumentationS3GarbageCollector = async () => {
  const doc = await Documentation.find();
  const listParamsPublic = {
    Bucket: AWS_S3_PUBLIC_BUCKET_NAME,
    Delimiter: '/',
    Prefix: 'Documentations/'
  };
  const listedObjectsPublic = await s3
    .listObjectsV2(listParamsPublic)
    .promise();

  const temp_date = new Date();
  if (listedObjectsPublic.Contents.length > 0) {
    const deleteParams = {
      Bucket: AWS_S3_PUBLIC_BUCKET_NAME,
      Delete: { Objects: [] }
    };
    listedObjectsPublic.Contents.forEach((Obj) => {
      for (let i = 0; i < doc.length; i += 1) {
        const file_name = encodeURIComponent(Obj.Key.split('/')[1]);
        if (doc[i].text.includes(file_name)) {
          break;
        }

        if (i === doc.length - 1) {
          // if until last doc still not found, add the Key to the delete list
          if (!doc[i].text.includes(file_name)) {
            // Delete only older than 2 week
            if (getNumberOfDays(Obj.LastModified, temp_date) > 14) {
              deleteParams.Delete.Objects.push({ Key: Obj.Key });
            }
          }
        }
      }
      // logger.info('Deleting ', Key);
    });
    // TODO: there are something mixed in Documentations/ folder:
    // 1. documentation
    if (deleteParams.Delete.Objects.length > 0) {
      await s3.deleteObjects(deleteParams).promise();
      logger.info('Deleted redundant files and image for documentation.');
      logger.info(deleteParams.Delete.Objects);
    } else {
      logger.info('Nothing to be deleted for documentation.');
    }

    // if (listedObjectsPublic.IsTruncated) await emptyS3Directory(bucket, dir);
  }
};

const updateInternalDocumentationPage = asyncHandler(async (req, res) => {
  const fields = _.omit(req.body, '_id');

  fields.author = `${req.user.firstname} ${req.user.lastname}`;
  const interna_doc_page_existed = await Docspage.findOneAndUpdate(
    { category: 'internal' },
    fields,
    { upsert: true, new: true }
  );

  return res
    .status(201)
    .send({ success: true, data: interna_doc_page_existed });
});

const getInternalDocumentationsPage = asyncHandler(async (req, res) => {
  const docspage = await Docspage.findOne({
    category: 'internal'
  });
  return res.send({ success: true, data: !docspage ? {} : docspage });
});

const updateDocumentationPage = asyncHandler(async (req, res) => {
  const fields = _.omit(req.body, '_id');
  fields.author = `${req.user.firstname} ${req.user.lastname}`;
  const doc_page_existed = await Docspage.findOneAndUpdate(
    { category: req.params.category },
    fields,
    { upsert: true, new: true }
  );
  const success = one_month_cache.set(req.url, doc_page_existed);
  if (success) {
    logger.info('cache set update successfully');
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

  // Use redis/cache
  const value = one_month_cache.get(req.url);
  if (value === undefined) {
    // cache miss
    logger.info('cache miss');
    const docspage = await Docspage.findOne({
      category: req.params.category
    });
    const success = one_month_cache.set(req.url, docspage);
    if (success) {
      logger.info('cache set successfully');
    }
    return res.send({ success: true, data: !docspage ? {} : docspage });
  }
  logger.info('cache hit');
  return res.send({ success: true, data: !value ? {} : value });
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
  const document = await Documentation.find().select('title category');
  return res.send({ success: true, data: document });
});

const getAllInternalDocumentations = asyncHandler(async (req, res) => {
  const document = await Internaldoc.find().select('title internal category');
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
  let imageurl = new URL(`/api/docs/file/${req.file.key}`, API_ORIGIN).href;
  imageurl = imageurl.replace(/\\/g, '/');
  // TODO: to overwrite cache image, pdf, docs, file here.
  return res.send({ success: true, data: imageurl });
});

const getDocFile = asyncHandler(async (req, res) => {
  const {
    params: { object_key }
  } = req;

  let directory = path.join(AWS_S3_PUBLIC_BUCKET_NAME, 'Documentations');
  directory = directory.replace(/\\/g, '/');
  const options = {
    Key: object_key,
    Bucket: directory
  };
  // Use redis/cache
  // TODO: need to update when new uploaded file with same key name!
  const value = one_month_cache.get(req.originalUrl);
  if (value === undefined) {
    // cache miss
    logger.info(`cache miss: ${req.originalUrl}`);
    s3.getObject(options, (err, data) => {
      // Handle any error and exit
      if (!data || !data.Body) {
        logger.info('File not found in S3');
        // You can handle this case as needed, e.g., send a 404 response
        return res.status(404).send(err);
      }
      // No error happened
      // Convert Body from a Buffer to a String
      const objectData = data.Body.toString('utf-8'); // Use the encoding necessary
      const success = one_month_cache.set(req.originalUrl, data.Body);
      if (success) {
        logger.info('cache set successfully');
      }
      res.attachment(object_key);
      return res.end(data.Body);
    });
  } else {
    logger.info('cache hit');
    res.attachment(object_key);
    return res.end(value);
  }
});

const uploadDocDocs = asyncHandler(async (req, res) => {
  let imageurl = new URL(
    `/api/docs/file/${encodeURIComponent(req.file.key)}`,
    API_ORIGIN
  ).href;
  imageurl = imageurl.replace(/\\/g, '/');
  let extname = path.extname(req.file.key);
  extname = extname.replace('.', '');
  // TODO: to delete cache key for image, pdf, docs, file here.
  const value = one_month_cache.del(
    `/api/docs/file/${encodeURIComponent(req.file.key)}`
  );
  // encodeURIComponent convert chinese to url match charater %E7%94%B3%E8%AB%8 etc.
  if (value === 1) {
    logger.info('cache key deleted successfully');
  }
  return res.send({
    success: true,
    url: imageurl,
    title: req.file.key,
    extension: extname
  });
});

const updateDocumentation = asyncHandler(async (req, res) => {
  const fields = req.body;
  fields.author = `${req.user.firstname} ${req.user.lastname}`;
  const updated_doc = await Documentation.findByIdAndUpdate(
    req.params.id,
    fields,
    { new: true }
  );
  return res.status(201).send({ success: true, data: updated_doc });
});

const updateInternalDocumentation = asyncHandler(async (req, res) => {
  const fields = req.body;
  fields.author = `${req.user.firstname} ${req.user.lastname}`;
  const updated_doc = await Internaldoc.findByIdAndUpdate(
    req.params.id,
    fields,
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
  DocumentationS3GarbageCollector,
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
  getDocFile,
  uploadDocDocs,
  updateDocumentation,
  updateInternalDocumentation,
  deleteDocumentation,
  deleteInternalDocumentation
};
