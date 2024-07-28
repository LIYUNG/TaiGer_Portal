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

const connections = {};

const getTenantFromRequest = (req) => {
  const { tenantid } = req.headers; // Get the host from the request headers
  return tenantid;
};

const connectToDatabase = (tenant) => {
  if (!connections[tenant]) {
    const dbUri = `${mongoDb(tenant)}`;
    const connection = mongoose.createConnection(dbUri, {});
    connections[tenant] = connection;

    connection.model('Basedocumentationslink', basedocumentationslinksSchema);
    connection.model('Communication', communicationsSchema);
    connection.model('Course', coursesSchema);
    connection.model('Documentthread', documentThreadsSchema);
    connection.model('Event', EventSchema);
    // connection.model('Program', programSchema);
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
  }
  return connections[tenant];
};

const tenantMiddleware = (req, res, next) => {
  const tenant = getTenantFromRequest(req);
  if (!tenant) {
    return res.status(400).send('Tenant not identified');
  }
  req.db = connectToDatabase(tenant);
  req.VCModel = req.db.model('VC');
  //   req.tenant = tenant;
  next();
};

module.exports = { tenantMiddleware };
