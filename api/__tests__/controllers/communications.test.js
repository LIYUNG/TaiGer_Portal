const request = require('supertest');
const { Role } = require('@taiger-common/core');

const { connect, clearDatabase } = require('../fixtures/db');
const { app } = require('../../app');
const { UserSchema } = require('../../models/User');
const {
  generateUser,
  generateCommunicationMessage
} = require('../fixtures/faker');
const { protect } = require('../../middlewares/auth');
const { TENANT_ID } = require('../fixtures/constants');
const { connectToDatabase } = require('../../middlewares/tenantMiddleware');
const { complaintSchema } = require('../../models/Complaint');
const { generateComlaintTicket } = require('../fixtures/faker');
const { communicationsSchema } = require('../../models/Communication');

jest.mock('../../middlewares/tenantMiddleware', () => {
  const passthrough = async (req, res, next) => {
    req.tenantId = 'test';
    next();
  };

  return {
    ...jest.requireActual('../../middlewares/tenantMiddleware'),
    checkTenantDBMiddleware: jest.fn().mockImplementation(passthrough)
  };
});

jest.mock('../../middlewares/decryptCookieMiddleware', () => {
  const passthrough = async (req, res, next) => next();

  return {
    ...jest.requireActual('../../middlewares/decryptCookieMiddleware'),
    decryptCookieMiddleware: jest.fn().mockImplementation(passthrough)
  };
});

jest.mock('../../middlewares/InnerTaigerMultitenantFilter', () => {
  const passthrough = async (req, res, next) => next();

  return {
    ...jest.requireActual('../../middlewares/permission-filter'),
    InnerTaigerMultitenantFilter: jest.fn().mockImplementation(passthrough)
  };
});

jest.mock('../../middlewares/permission-filter', () => {
  const passthrough = async (req, res, next) => next();

  return {
    ...jest.requireActual('../../middlewares/permission-filter'),
    permission_canAccessStudentDatabase_filter: jest
      .fn()
      .mockImplementation(passthrough)
  };
});

jest.mock('../../middlewares/auth', () => {
  const passthrough = async (req, res, next) => next();

  return {
    ...jest.requireActual('../../middlewares/auth'),
    protect: jest.fn().mockImplementation(passthrough),
    localAuth: jest.fn().mockImplementation(passthrough),
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
const messages = [...Array(3)].map(() =>
  generateCommunicationMessage({ studnet_id: student._id, user_id: agent._id })
);

const testMessage =
  '{"time":1709234667356,"blocks":[{"id":"PYUnoHKB47","type":"paragraph","data":{"text":"tes"}}],"version":"2.29.0"}';
let dbUri;

beforeAll(async () => {
  dbUri = await connect();
});
afterAll(async () => await clearDatabase());

beforeEach(async () => {
  const db = connectToDatabase(TENANT_ID, dbUri);

  const UserModel = db.model('User', UserSchema);
  const CommunicationSchema = db.model('Communication', communicationsSchema);

  await CommunicationSchema.deleteMany();
  await CommunicationSchema.insertMany([...messages]);

  await UserModel.deleteMany();
  await UserModel.insertMany(users);

  protect.mockImplementation(async (req, res, next) => {
    req.user = await UserModel.findById(admin._id);
    next();
  });
});

describe('getMessages Controller', () => {
  it('should get messages from a student', async () => {
    const resp = await request(app)
      .get(`/api/communications/${student._id.toString()}`)
      .set('tenantId', TENANT_ID);

    expect(resp.status).toBe(200);
    expect(resp.body.success).toEqual(true);
  });
});

describe('postMessages Controller', () => {
  it('should create a new message', async () => {
    const resp = await request(app)
      .post(`/api/communications/${student._id.toString()}`)
      .set('tenantId', TENANT_ID)
      .send({ message: testMessage });
    const newMessage = resp.body.data;
    expect(resp.status).toBe(200);
    expect(newMessage[0].message).toEqual(testMessage);
  });
});

// describe('updateAMessageInThread Controller', () => {
//   it('should update a message', async () => {
//     const resp = await request(app)
//       .put(`/api/communications/${student._id.toString()}`)
//       .set('tenantId', TENANT_ID)
//       .send({ description: 'new information' });
//     const updatedTicket = resp.body.data;
//     expect(resp.status).toBe(200);
//     expect(updatedTicket.description).toEqual('new information');
//   });
// });

// describe('deleteComplaint Controller', () => {
//   it('should delete a message', async () => {
//     const resp = await request(app)
//       .delete(`/api/communications/${student._id.toString()}`)
//       .set('tenantId', TENANT_ID);

//     expect(resp.status).toBe(200);
//     expect(resp.body.success).toEqual(true);
//   });
// });
