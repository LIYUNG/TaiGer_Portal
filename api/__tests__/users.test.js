const request = require('supertest');

const db = require('./fixtures/db');
const { app } = require('../app');
const { Role, User } = require('../models/User');
const { generateUser } = require('./fixtures/users');
const { protect } = require('../middlewares/auth');

jest.mock('../middlewares/auth', () => {
  const passthrough = async (req, res, next) => next();

  return Object.assign({}, jest.requireActual('../middlewares/auth'), {
    protect: jest.fn().mockImplementation(passthrough),
    permit: jest.fn().mockImplementation((...roles) => passthrough)
  });
});
const admins = [...Array(2)].map(() => generateUser(Role.Admin));
const agents = [...Array(3)].map(() => generateUser(Role.Agent));
const editors = [...Array(3)].map(() => generateUser(Role.Editor));
const students = [...Array(5)].map(() => generateUser(Role.Student));
const guests = [...Array(5)].map(() => generateUser(Role.Guest));
const users = [...admins, ...agents, ...editors, ...students, ...guests];

beforeAll(async () => {
  await db.connect();
  await User.deleteMany();
  await User.insertMany(users);
});
afterAll(async () => await db.clearDatabase());

describe('GET /api/users', () => {
  protect.mockImplementation(async (req, res, next) => {
    // req.user = await User.findById(agentId);
    const admin = admins[0];
    req.user = admin;
    next();
  });

  it('should return all users', async () => {
    const resp = await request(app).get('/api/users');
    const { success, data } = resp.body;

    expect(resp.status).toBe(200);
    expect(success).toBe(true);
    expect(data).toEqual(expect.any(Array));
    expect(data.length).toBe(users.length);
  });
});

// TODO: move below to their own files?
describe('GET /api/agents', () => {
  it('should return all agents', async () => {
    const resp = await request(app).get('/api/agents');
    const { success, data } = resp.body;

    const agentIds = agents.map(({ _id }) => _id).sort();
    const receivedIds = data.map(({ _id }) => _id).sort();

    expect(resp.status).toBe(200);
    expect(success).toBe(true);
    expect(receivedIds).toEqual(agentIds);
  });
});

describe('GET /api/editors', () => {
  it('should return all editors', async () => {
    const resp = await request(app).get('/api/editors');
    const { success, data } = resp.body;

    const editorIds = editors.map(({ _id }) => _id).sort();
    const receivedIds = data.map(({ _id }) => _id).sort();

    expect(resp.status).toBe(200);
    expect(success).toBe(true);
    expect(receivedIds).toEqual(editorIds);
  });
});

describe('GET /api/students/all', () => {
  it('should return all students', async () => {
    const resp = await request(app).get('/api/students/all');
    const { success, data } = resp.body;
    expect(resp.status).toBe(200);
    expect(success).toBe(true);

    const studentIds = students.map(({ _id }) => _id).sort();
    const receivedIds = data.map(({ _id }) => _id).sort();
    expect(receivedIds).toEqual(studentIds);
  });
});

describe('POST /api/users/:id', () => {
  it('should update user role', async () => {
    const { _id } = users[3];
    const { email, role } = generateUser(Role.Editor);

    const resp = await request(app)
      .post(`/api/users/${_id}`)
      .send({ email, role });
    const { success, data } = resp.body;

    expect(resp.status).toBe(200);
    expect(success).toBe(true);
    expect(data).toMatchObject({
      role: Role.Editor,
      email
    });

    const updatedUser = await User.findById(_id);
    expect(updatedUser).toMatchObject({
      role: Role.Editor,
      email
    });
  });

  it('should not update Admin role', async () => {
    const { _id } = users[5];
    const { email, role } = generateUser(Role.Admin);

    const resp = await request(app)
      .post(`/api/users/${_id}`)
      .send({ email, role });
    const { success } = resp.body;

    expect(resp.status).toBe(409);
    expect(success).toBe(false);
  });
});

describe('DELETE /api/users/:id', () => {
  it('should delete a user', async () => {
    const { _id } = users[0];

    const resp = await request(app).delete(`/api/users/${_id}`);

    expect(resp.status).toBe(200);
    expect(resp.body.success).toBe(true);

    const deletedUser = await User.findById(_id);
    expect(deletedUser).toBe(null);
  });
});

// //TODO: token-specific API!!!
// describe("GET /api/students", () => {
//   it("should return role-specific students", async () => {
//     const resp = await request(app).get("/api/students");
//     const { success, data } = resp.body;

//     const studentIds = students.map(({ _id }) => _id).sort();
//     // const receivedIds = data.map(({ _id }) => _id).sort();

//     expect(resp.status).toBe(200);
//     expect(success).toBe(true);
//     // expect(receivedIds).toEqual(studentIds);
//   });
// });

// TODO: token-specific API!!!
// describe("GET /api/students/archiv", () => {
//   it("should return all archiv students", async () => {
//     const resp = await request(app).get("/api/students/archiv");
//     const { success, data } = resp.body;

//     const studentIds = students.map(({ _id }) => _id).sort();
//     const receivedIds = data.map(({ _id }) => _id).sort();

//     expect(resp.status).toBe(200);
//     expect(success).toBe(true);
//     expect(receivedIds).toEqual(studentIds);
//   });
// });
