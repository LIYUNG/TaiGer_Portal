const fs = require('fs');
const path = require('path');
const request = require('supertest');

const { UPLOAD_PATH } = require('../config');
const db = require('./fixtures/db');
const { app } = require('../app');
const { connectToDatabase, disconnectFromDatabase } = require('../database');
const { Role, User, Agent, Editor, Student } = require('../models/User');
const { Program } = require('../models/Program');
const { Documentthread } = require('../models/Documentthread');
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

beforeAll(async () => await db.connect());
afterAll(async () => await db.clearDatabase());

beforeEach(async () => {
  await User.deleteMany();
  await User.insertMany(users);

  await Program.deleteMany();
  await Program.create(program);
});

afterEach(() => {
  fs.rmSync(UPLOAD_PATH, { recursive: true, force: true });
});

describe('POST /api/document-threads/:category', () => {
  const thread = {
    student_id: '1234',
    file_type: 'ML',
    program_id: null,
    updatedAt: new Date()
  };
  const new_thread = {
    student_id: '1234',
    file_type: 'ML',
    program_id: null,
    updatedAt: new Date()
  };
  var article_id;

  beforeEach(async () => {
    protect.mockImplementation(async (req, res, next) => {
      req.user = await User.findById(student._id);
      next();
    });
  });

  it('should save /get/update/delete the new documentation in db', async () => {
    const resp = await request(app)
      .post(`/api/document-threads/${thread_id}`)
      .send(article);
    const { status, body } = resp;
    expect(status).toBe(200);
    expect(body.success).toBe(true);
    var new_article = body.data;
    expect(new_article.title).toBe(article.title);
    expect(new_article.text).toBe(article.text);
    article_id = new_article._id.toString();

    // Test Get Article:
    const resp2 = await request(app)
      .get(`/api/document-threads/${category_uniassist}`)
      .buffer();
    expect(resp2.status).toBe(200);

    // test delete
    const resp4 = await request(app).delete(
      `/api/document-threads/${article_id}`
    );
    expect(resp4.status).toBe(200);
    expect(resp4.body.success).toBe(true);
  });
});
