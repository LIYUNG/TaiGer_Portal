const fs = require('fs');
const path = require('path');
const request = require('supertest');

const { UPLOAD_PATH } = require('../config');
const { app } = require('../app');
const { connectToDatabase, disconnectFromDatabase } = require('../database');
const { Role, User, Agent, Editor, Student } = require('../models/User');
const { Program } = require('../models/Program');
const { DocumentStatus } = require('../constants');
const { generateUser } = require('./fixtures/users');
const { generateProgram } = require('./fixtures/programs');
const { protect } = require('../middlewares/auth');

jest.mock('../middlewares/auth', () => {
  const passthrough = async (req, res, next) => next();

  return Object.assign({}, jest.requireActual('../middlewares/auth'), {
    protect: jest.fn().mockImplementation(passthrough),
    permit: jest.fn().mockImplementation((...roles) => passthrough)
  });
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

const programs = [...Array(3)].map(() =>
  generateProgram(requiredDocuments, optionalDocuments)
);
beforeAll(async () => {
  jest.spyOn(console, 'log').mockImplementation(jest.fn());
  await connectToDatabase(global.__MONGO_URI__);
});

afterAll(disconnectFromDatabase);

beforeEach(async () => {
  await User.deleteMany();
  await User.insertMany(users);

  await Program.deleteMany();
  await Program.create(program);
});

afterEach(() => {
  fs.rmSync(UPLOAD_PATH, { recursive: true, force: true });
});

describe('POST /api/docs/:category', () => {
  const category_uniassist = 'uniassist';
  const category_visa = 'visa';
  const category_certification = 'certification';
  const category_application = 'application';
  const article = {
    Titel_: 'article.Titel_',
    Content_: 'article.Content_',
    Category_: 'uniassist',
    LastUpdate_: 'article.LastUpdate_'
  };
  const Newarticle = {
    Titel_: 'Newarticle.Titel_',
    Content_: 'Newarticle.Content_',
    Category_: 'uniassist',
    LastUpdate_: 'article.LastUpdate_'
  };
  var article_id;

  beforeEach(async () => {
    protect.mockImplementation(async (req, res, next) => {
      req.user = await User.findById(admin._id);
      next();
    });
  });

  it('should save/get/update/delete the new documentation in db', async () => {
    const resp = await request(app).post(`/api/docs`).send(article);
    const resp_cert = await request(app).post(`/api/docs`).send(article);
    const resp_app = await request(app).post(`/api/docs`).send(article);
    const resp_visa = await request(app).post(`/api/docs`).send(article);

    const { status, body } = resp;
    expect(status).toBe(200);
    expect(body.success).toBe(true);
    var new_article = body.data;
    expect(new_article).toMatchObject(article);
    article_id = new_article._id;

    // Test Get Article:
    const resp2 = await request(app)
      .get(`/api/docs/${category_uniassist}`)
      .buffer();
    expect(resp2.status).toBe(200);
    const resp2_cert = await request(app)
      .get(`/api/docs/${category_certification}`)
      .buffer();
    expect(resp2_cert.status).toBe(200);
    const resp2_app = await request(app)
      .get(`/api/docs/${category_application}`)
      .buffer();
    expect(resp2_app.status).toBe(200);
    const resp2_visa = await request(app)
      .get(`/api/docs/${category_visa}`)
      .buffer();
    expect(resp2_visa.status).toBe(200);

    // test update profile status
    const feedback_str = 'too blurred';
    const resp5 = await request(app)
      .post(`/api/docs/${article_id}`)
      .send(Newarticle);
    expect(resp5.status).toBe(201);
    var new_article = resp5.body.data;

    expect(resp5.body.success).toBe(true);
    expect(new_article).toMatchObject(Newarticle);

    // test delete
    const resp4 = await request(app).delete(`/api/docs/${article_id}`);
    expect(resp4.status).toBe(200);
    expect(resp4.body.success).toBe(true);
  });
});
