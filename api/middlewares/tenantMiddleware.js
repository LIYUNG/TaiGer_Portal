const mongoose = require('mongoose');
const { mongoDb } = require('../database');
const {
  UserSchema,
  Agent,
  Editor,
  Student,
  Admin,
  Guest
} = require('../models/User');
const { EventSchema } = require('../models/Event');
const { documentThreadsSchema } = require('../models/Documentthread');
const { programSchema } = require('../models/Program');
const { coursesSchema } = require('../models/Course');
const {
  basedocumentationslinksSchema
} = require('../models/Basedocumentationslink');
const { communicationsSchema } = require('../models/Communication');
const { versionControlSchema } = require('../models/VersionControl');
const { ticketSchema } = require('../models/Ticket');
const { tokenSchema } = require('../models/Token');
const { templatesSchema } = require('../models/Template');
const { documentationsSchema } = require('../models/Documentation');
const { internaldocsSchema } = require('../models/Internaldoc');
const { enableVersionControl } = require('../utils/modelHelper/versionControl');
const { docspagesSchema } = require('../models/Docspage');
const { expensesSchema } = require('../models/Expense');
const { incomesSchema } = require('../models/Income');
const { interviewsSchema } = require('../models/Interview');
const { intervalSchema } = require('../models/Interval');
const {
  interviewSurveyResponseSchema
} = require('../models/InterviewSurveyResponse');
const { notesSchema } = require('../models/Note');
const { userlogSchema } = require('../models/Userlog');
const { ResponseTimeSchema } = require('../models/ResponseTime');
const { surveyInputSchema } = require('../models/SurveyInput');
const { permissionSchema } = require('../models/Permission');
const { handleProgramChanges } = require('../utils/modelHelper/programChange');
const { tenantsSchema } = require('../models/Tenant');
const logger = require('../services/logger');
const { asyncHandler } = require('./error-handler');

const connections = {};
const tenantDb = 'Tenant';

const applyProgramSchema = (
  db,
  VCModel,
  StudentModel,
  DocumentthreadModel,
  surveyInputModel
) => {
  programSchema.plugin(handleProgramChanges, {
    StudentModel,
    DocumentthreadModel,
    surveyInputModel
  });
  programSchema.plugin(enableVersionControl, { VCModel });
  return db.model('Program', programSchema);
};

const getTenantFromRequest = (req) => {
  const { tenantid } = req.headers; // Get the host from the request headers
  return tenantid;
};

const connectToDatabase = (tenant, uri = null) => {
  if (!connections[tenant]) {
    const dbUri = uri || `${mongoDb(tenant)}`;
    const connection = mongoose.createConnection(dbUri, {});
    connections[tenant] = connection;

    connection.model('Basedocumentationslink', basedocumentationslinksSchema);
    connection.model('Communication', communicationsSchema);
    connection.model('Course', coursesSchema);
    connection.model('Documentation', documentationsSchema);
    connection.model('Documentthread', documentThreadsSchema);
    connection.model('Docspage', docspagesSchema);
    connection.model('Event', EventSchema);
    connection.model('Expense', expensesSchema);
    connection.model('Incom', incomesSchema);
    connection.model('Internaldoc', internaldocsSchema);
    connection.model('Interval', intervalSchema);
    connection.model('Interview', interviewsSchema);

    connection.model('InterviewSurveyResponse', interviewSurveyResponseSchema);
    connection.model('Note', notesSchema);
    connection.model('Permission', permissionSchema);
    connection.model('ResponseTime', ResponseTimeSchema);

    surveyInputSchema.index(
      { studentId: 1, programId: 1, fileType: 1 },
      { unique: true }
    );

    connection.model('surveyInput', surveyInputSchema);
    connection.model('Template', templatesSchema);
    connection.model('Ticket', ticketSchema);
    connection.model('Token', tokenSchema);
    // Register base models
    connection.model('User', UserSchema);

    // Register discriminators
    connection.model('User').discriminator('Agent', Agent.schema);
    connection.model('User').discriminator('Editor', Editor.schema);
    connection.model('User').discriminator('Student', Student.schema);
    connection.model('User').discriminator('Admin', Admin.schema);
    connection.model('User').discriminator('Guest', Guest.schema);

    connection.model('VC', versionControlSchema);
    applyProgramSchema(
      connection,
      connection.model('VC'),
      connection.model('Student'),
      connection.model('Documentthread'),
      connection.model('surveyInput')
    );
    connection.model('Userlog', userlogSchema);
  }
  return connections[tenant];
};

const checkTenantDBMiddleware = asyncHandler(async (req, res, next) => {
  const tenentIdHeader = getTenantFromRequest(req);
  const { tenantId } = req.decryptedToken;
  const dbUri = `${mongoDb(tenantDb)}`;
  if (!connections[tenantDb]) {
    const connection = mongoose.createConnection(dbUri, {});
    connection.model(tenantDb, tenantsSchema);
    connections[tenantDb] = connection;
  }

  // 0.
  const tenentid = tenentIdHeader || tenantId;
  logger.info(`tenentid: ${tenentid}`);
  logger.info(`req.hostname: ${req.hostname}`); // prod: ec2...amazon.com
  logger.info(`req.headers['origin']: ${req.headers['origin']}`); // prod:
  const origin = req.headers.origin;
  const url = new URL(origin);
  const { hostname } = url;
  logger.info(`hostname: ${hostname}`); // prod:
  let tenantExisted;
  tenantExisted = await connections[tenantDb]
    .model(tenantDb)
    .findOne({ tenantId: tenentid });
  if (!tenantExisted) {
    tenantExisted = await connections[tenantDb]
      .model(tenantDb)
      .findOne({ domainName: hostname });
  }
  logger.info(`tenantExisted: ${tenantExisted}`);

  if (!tenantExisted) {
    logger.error(
      `tenantMiddleware : Tenant not identified, req.decryptedToken: ${JSON.stringify(
        req.decryptedToken
      )}`
    );
    return res.status(400).send('Tenant not identified');
  }

  req.tenantId = tenantExisted.tenantId;
  next();
});

const tenantMiddleware = asyncHandler(async (req, res, next) => {
  req.db = connectToDatabase(req.tenantId);
  req.VCModel = req.db.model('VC');
  next();
});

module.exports = {
  tenantMiddleware,
  checkTenantDBMiddleware,
  connectToDatabase
};
