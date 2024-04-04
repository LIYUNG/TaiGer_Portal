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

  it('todo', async () => {
    expect(200).toBe(200);
  });
});
