const { default: mongoose } = require('mongoose');

const {
  AWS_S3_MONGODB_BACKUP_SNAPSHOT,
  isProd,
  AWS_S3_DATAPIPELINE_TENFOLDAI_SNAPSHOT
} = require('../config');
const logger = require('../services/logger');
const { putS3Object } = require('../aws/s3');
const { asyncHandler } = require('../middlewares/error-handler');
const { connectToDatabase } = require('../middlewares/tenantMiddleware');

const TENFOLD_AI_FOLDER = 'tenfold-ai-folder';
// Function to recursively transform Mongoose/MongoDB special types
function transformDocument(doc) {
  if (Array.isArray(doc)) {
    return doc.map(transformDocument); // Recursively process arrays
  } else if (doc instanceof mongoose.Types.ObjectId) {
    return { $oid: doc.toString() }; // Transform ObjectId
  } else if (doc instanceof Date) {
    return { $date: doc.toISOString() }; // Transform Date to ISO format
  } else if (typeof doc === 'object' && doc !== null) {
    const transformed = {};
    for (let key in doc) {
      if (doc.hasOwnProperty(key)) {
        transformed[key] = transformDocument(doc[key]); // Recursively process objects
      }
    }
    return transformed;
  }
  return doc; // Return primitive types as is
}

const MongoDBDataBaseDailySnapshotV2 = asyncHandler(async () => {
  const tenantId = isProd() ? 'TaiGer_Prod' : 'TaiGer';
  const currentDateTime = new Date();

  const year = currentDateTime.getUTCFullYear();
  const month = currentDateTime.getUTCMonth() + 1; // Months are zero-based, so we add 1
  const day = currentDateTime.getUTCDate();
  const hours = currentDateTime.getUTCHours();
  const minutes = currentDateTime.getUTCMinutes();
  const seconds = currentDateTime.getUTCSeconds();
  const req = {};
  req.db = connectToDatabase(tenantId);
  // Get all collections in the database
  let modelNames = Object.keys(req.db.models);

  // Upload JSON data to S3
  logger.info('database snapshot starts');
  modelNames = modelNames.filter(
    (modelName) =>
      !['Admin', 'Editor', 'Agent', 'Student', 'Guest', 'Userlog'].includes(
        modelName
      )
  );

  const promises = modelNames.map(async (modelName) => {
    // Fetch all documents from the collection
    let documents;
    if (modelName === 'User') {
      documents = await req.db.model(modelName).find({}).select('+password');
    } else {
      documents = await req.db.model(modelName).find({});
    }
    // Transform each document
    const transformedData = documents.map((doc) =>
      transformDocument(doc.toObject())
    );
    // Convert JSON to string
    const jsonString = JSON.stringify(transformedData, null, 2);

    const params = {
      bucketName: AWS_S3_MONGODB_BACKUP_SNAPSHOT,
      key: `${year}-${month}-${day}/${hours}-${minutes}-${seconds}/${modelName}.json`,
      Body: jsonString,
      ContentType: 'application/json'
    };
    await putS3Object(params);
    logger.info(
      `Uploaded ${modelName} collection in S3 ${AWS_S3_MONGODB_BACKUP_SNAPSHOT}`
    );
  });

  // Wait for all promises to resolve
  await Promise.all(promises);
});

const MongoDBDataPipelineDailySnapshot = asyncHandler(async () => {
  const tenantId = isProd() ? 'TaiGer_Prod' : 'TaiGer';
  const currentDateTime = new Date();

  const year = currentDateTime.getUTCFullYear();
  const month = currentDateTime.getUTCMonth() + 1; // Months are zero-based, so we add 1
  const day = currentDateTime.getUTCDate();

  const req = {};
  req.db = connectToDatabase(tenantId);
  // Get all collections in the database
  let modelNames = Object.keys(req.db.models);

  // Upload JSON data to S3
  logger.info('database snapshot starts');
  modelNames = modelNames.filter(
    (modelName) =>
      ![
        'Admin',
        'Editor',
        'Agent',
        'Student',
        'Guest',
        'Audit',
        'Basedocumentationslink',
        'Complaint',
        'Docspage',
        'Event',
        'Expense',
        'Incom',
        'Internaldoc',
        'InterviewSurveyResponse',
        'Interval',
        'KeywordSet',
        'Note',
        'Permission',
        'ProgramRequirement',
        'ResponseTime',
        'surveyInput',
        'Ticket',
        'Token',
        'Userlog',
        'VC'
      ].includes(modelName)
  );

  const promises = modelNames.map(async (modelName) => {
    // Fetch all documents from the collection
    const documents = await req.db.model(modelName).find({});

    // Transform each document
    const transformedData = documents.map((doc) =>
      transformDocument(doc.toObject())
    );
    // Convert JSON to string
    const jsonString = JSON.stringify(transformedData, null, 2);

    const params = {
      bucketName: AWS_S3_DATAPIPELINE_TENFOLDAI_SNAPSHOT,
      key: `${TENFOLD_AI_FOLDER}/${year}-${month}-${day}/${modelName}.json`,
      Body: jsonString,
      ContentType: 'application/json'
    };
    await putS3Object(params);
    logger.info(
      `Uploaded ${modelName} collection in S3 ${AWS_S3_DATAPIPELINE_TENFOLDAI_SNAPSHOT}/${TENFOLD_AI_FOLDER}`
    );
  });

  // Wait for all promises to resolve
  await Promise.all(promises);
});

module.exports = {
  MongoDBDataBaseDailySnapshotV2,
  MongoDBDataPipelineDailySnapshot
};
