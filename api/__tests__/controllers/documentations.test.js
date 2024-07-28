const fs = require('fs');
const request = require('supertest');

const { connect, closeDatabase, clearDatabase } = require('../fixtures/db');
const { app } = require('../../app');
const { Role } = require('../../constants');
const { User, UserSchema } = require('../../models/User');
const { Program, programSchema } = require('../../models/Program');
const { generateUser } = require('../fixtures/users');
const { generateProgram } = require('../fixtures/programs');
const { protect } = require('../../middlewares/auth');
const { TENANT_ID } = require('../fixtures/constants');
const { connectToDatabase } = require('../../middlewares/tenantMiddleware');

jest.mock('../../middlewares/auth', () => {
  const passthrough = async (req, res, next) => next();

  return {
    ...jest.requireActual('../../middlewares/auth'),
    protect: jest.fn().mockImplementation(passthrough),
    permit: jest.fn().mockImplementation((...roles) => passthrough)
  };
});

const admin = generateUser(Role.Admin);
const agents = [...Array(3)].map(() => generateUser(Role.Agent));
const agent = generateUser(Role.Agent);
const editors = [...Array(3)].map(() => generateUser(Role.Editor));
const editor = generateUser(Role.Editor);
const students = [...Array(3)].map(() => generateUser(Role.Student));
const student = generateUser(Role.Student);
const student2 = generateUser(Role.Student);
const users = [
  admin,
  ...agents,
  agent,
  ...editors,
  editor,
  ...students,
  student,
  student2
];

const requiredDocuments = ['transcript', 'resume'];
const optionalDocuments = ['certificate', 'visa'];
const program = generateProgram(requiredDocuments, optionalDocuments);
let dbUri;

beforeAll(async () => {
  dbUri = await connect();
});
afterAll(async () => await clearDatabase());

beforeEach(async () => {
  const db = connectToDatabase(TENANT_ID, dbUri);

  const UserModel = db.model('User', UserSchema);
  const ProgramModel = db.model('Program', programSchema);

  await UserModel.deleteMany();
  await UserModel.insertMany(users);
  await ProgramModel.deleteMany();
  await ProgramModel.create(program);
  // await User.deleteMany();
  // await User.insertMany(users);

  // await Program.deleteMany();
  // await Program.create(program);
});

describe('/api/docs/:category', () => {
  const category_uniassist = 'uniassist';
  const category_visa = 'visa';
  const category_certification = 'certification';
  const category_application = 'application';
  const article = {
    name: 'article.name',
    title: 'article.title',
    text: 'article.text',
    updatedAt: new Date().toString(),
    country: 'article.updatedAt'
  };
  const Newarticle = {
    name: 'article.name',
    title: 'Newarticle.title',
    text: 'Newarticle.text',
    updatedAt: new Date().toString(),
    country: 'article.updatedAt'
  };
  let article_id;

  beforeEach(async () => {
    protect.mockImplementation(async (req, res, next) => {
      req.user = await User.findById(admin._id);
      next();
    });
  });

  test('POST should create a new documentation in db', async () => {
    const resp = await request(app)
      .post('/api/docs')
      .set('tenantId', TENANT_ID)
      .send(article);
    const { status, body } = resp;
    expect(status).toBe(200);
    expect(body.success).toBe(true);
    const new_article = body.data;
    expect(new_article.title).toBe(article.title);
    expect(new_article.text).toBe(article.text);
    article_id = new_article._id.toString();
  });

  test('GET uni-assist documentation in db', async () => {
    // Test Get Article:
    const resp2 = await request(app)
      .get(`/api/docs/${category_uniassist}`)
      .set('tenantId', TENANT_ID)
      .buffer();
    expect(resp2.status).toBe(200);
  });

  test('GET certification documentation in db', async () => {
    const resp2_cert = await request(app)
      .get(`/api/docs/${category_certification}`)
      .set('tenantId', TENANT_ID)
      .buffer();
    expect(resp2_cert.status).toBe(200);
  });

  test('GET application documentation in db', async () => {
    const resp2_app = await request(app)
      .get(`/api/docs/${category_application}`)
      .set('tenantId', TENANT_ID)
      .buffer();
    expect(resp2_app.status).toBe(200);
  });

  test('GET visa documentation in db', async () => {
    const resp2_visa = await request(app)
      .get(`/api/docs/${category_visa}`)
      .set('tenantId', TENANT_ID)
      .buffer();
    expect(resp2_visa.status).toBe(200);
  });

  test('PUT update documentation in db', async () => {
    // test update doc status
    const resp5 = await request(app)
      .put(`/api/docs/${article_id}`)
      .set('tenantId', TENANT_ID)
      .send(Newarticle);
    expect(resp5.status).toBe(201);
    const new_article = resp5.body.data;
    expect(resp5.body.success).toBe(true);
    expect(new_article.title).toBe(Newarticle.title);
    expect(new_article.text).toBe(Newarticle.text);
  });

  test('GET all documentation in db', async () => {
    const resp4 = await request(app)
      .get('/api/docs/all')
      .set('tenantId', TENANT_ID);
    expect(resp4.body.success).toBe(true);
  });

  test('GET all internal documentation in db', async () => {
    const resp4 = await request(app)
      .get('/api/docs/internal/all')
      .set('tenantId', TENANT_ID);
    expect(resp4.body.success).toBe(true);
  });

  test('DELETE documentation in db', async () => {
    // test delete
    const resp4 = await request(app)
      .delete(`/api/docs/${article_id}`)
      .set('tenantId', TENANT_ID);
    expect(resp4.status).toBe(200);
    expect(resp4.body.success).toBe(true);
  });
});
