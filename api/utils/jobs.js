const { AWS_S3_MONGODB_BACKUP_SNAPSHOT, isProd } = require('../config');
const logger = require('../services/logger');
const {
  events_transformer,
  users_transformer,
  communications_transformer,
  courses_transformer,
  basedocumentationslinks_transformer,
  docspages_transformer,
  programs_transformer,
  documentthreads_transformer,
  notes_transformer,
  permissions_transformer
} = require('./utils_function');
const { s3 } = require('../aws');
const { asyncHandler } = require('../middlewares/error-handler');
const { connectToDatabase } = require('../middlewares/tenantMiddleware');

const MongoDBDataBaseDailySnapshot = asyncHandler(async () => {
  const tenantId = isProd() ? 'TaiGer_Prod' : 'TaiGer';
  const req = {};
  req.db = connectToDatabase(tenantId);
  req.VCModel = req.db.model('VC');

  logger.info('database snapshot');
  const data_category = [
    'users',
    'courses',
    'communications',
    'basedocumentationslinks',
    'docspages',
    'events',
    'programs',
    'documentthreads',
    'documentations',
    'internaldocs',
    'notes',
    'permissions',
    'templates'
    // 'expenses'
  ];
  const programsPromise = req.db.model('Program').find().lean(); // Handle undefined Program
  const eventsPromise = req.db.model('Event').find().lean();
  const usersPromise = req.db
    .model('User')
    .find()
    .lean()
    .select(
      '+password +applications.portal_credentials.application_portal_a +applications.portal_credentials.application_portal_b'
    );
  const coursesPromise = req.db.model('Course').find().lean();
  const basedocumentationslinksPromise = req.db
    .model('Basedocumentationslink')
    .find()
    .lean();
  const communicationsPromise = req.db.model('Communication').find().lean();
  const docspagesPromise = req.db.model('Docspage').find().lean();
  const documentthreadsPromise = req.db.model('Documentthread').find().lean();
  const documentationsPromise = req.db.model('Documentation').find().lean();
  const internaldocsPromise = req.db.model('Internaldoc').find().lean();
  const notesPromise = req.db.model('Note').find().lean();
  const permissionsPromise = req.db.model('Permission').find().lean();
  const templatesPromise = req.db.model('Template').find().lean();
  const expensesPromise = req.db.model('Expense').find().lean();

  const [
    events_raw,
    users_raw,
    courses_raw,
    basedocumentationslinks_raw,
    communications_raw,
    docspages_raw,
    programs_raw,
    documentthreads_raw,
    documentations_raw,
    internaldocs_raw,
    notes_raw,
    permissions_raw,
    templates_raw,
    expenses_raw
  ] = await Promise.all([
    eventsPromise,
    usersPromise,
    coursesPromise,
    basedocumentationslinksPromise,
    communicationsPromise,
    docspagesPromise,
    programsPromise,
    documentthreadsPromise,
    documentationsPromise,
    internaldocsPromise,
    notesPromise,
    permissionsPromise,
    templatesPromise,
    expensesPromise
  ]);

  const events = events_transformer(events_raw);
  const users = users_transformer(users_raw);
  const communications = communications_transformer(communications_raw);
  const courses = courses_transformer(courses_raw);
  const basedocumentationslinks = basedocumentationslinks_transformer(
    basedocumentationslinks_raw
  );
  const docspages = docspages_transformer(docspages_raw);
  const programs = programs_transformer(programs_raw);
  const documentthreads = documentthreads_transformer(documentthreads_raw);
  const documentations = docspages_transformer(documentations_raw);
  const internaldocs = docspages_transformer(internaldocs_raw);
  const notes = notes_transformer(notes_raw);
  const permissions = permissions_transformer(permissions_raw);
  const templates = docspages_transformer(templates_raw);
  const data_json = {
    events,
    users,
    courses,
    communications,
    basedocumentationslinks,
    docspages,
    programs,
    documentthreads,
    documentations,
    internaldocs,
    notes,
    permissions,
    templates
    // expenses
  };

  const currentDateTime = new Date();

  const year = currentDateTime.getUTCFullYear();
  const month = currentDateTime.getUTCMonth() + 1; // Months are zero-based, so we add 1
  const day = currentDateTime.getUTCDate();
  const hours = currentDateTime.getUTCHours();
  const minutes = currentDateTime.getUTCMinutes();
  const seconds = currentDateTime.getUTCSeconds();

  // Upload JSON data to S3
  for (let i = 0; i < data_category.length; i += 1) {
    // Replace `jsonObject` with your actual JSON data
    const jsonObject = data_json[data_category[i]];

    // Convert JSON to string
    const jsonString = JSON.stringify(jsonObject);
    s3.putObject(
      {
        Bucket: `${AWS_S3_MONGODB_BACKUP_SNAPSHOT}/${year}-${month}-${day}/${hours}-${minutes}-${seconds}`,
        Key: `${data_category[i]}.json`,
        Body: jsonString,
        ContentType: 'application/json'
      },
      (error, data) => {
        if (error) {
          logger.error(`Error uploading ${data_category[i]}.json:`, error);
        } else {
          logger.info(`${data_category[i]}.json uploaded successfully`);
        }
      }
    );
  }
});

module.exports = {
  MongoDBDataBaseDailySnapshot
};
