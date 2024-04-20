const request = require('supertest');

const db = require('./fixtures/db');
const { app } = require('../app');
const { Program } = require('../models/Program');
const { generateProgram } = require('./fixtures/programs');
const { generateUser } = require('./fixtures/users');
const { protect } = require('../middlewares/auth');
const { Role } = require('../models/User');

const admins = [...Array(2)].map(() => generateUser(Role.Admin));
const agents = [...Array(3)].map(() => generateUser(Role.Agent));
const editors = [...Array(3)].map(() => generateUser(Role.Editor));
const students = [...Array(5)].map(() => generateUser(Role.Student));
const users = [...admins, ...agents, ...editors, ...students];

jest.mock('../middlewares/auth', () => {
  const passthrough = async (req, res, next) => next();

  return Object.assign({}, jest.requireActual('../middlewares/auth'), {
    protect: jest.fn().mockImplementation(passthrough),
    permit: jest.fn().mockImplementation((...roles) => passthrough)
  });
});
const programs = [...Array(5)].map(() => generateProgram());

beforeAll(async () => {
  await db.connect();
  await Program.deleteMany();
  await Program.insertMany(programs);
});
afterAll(async () => await db.clearDatabase());

describe('GET /api/programs', () => {
  protect.mockImplementation(async (req, res, next) => {
    const admin = admins[0];
    req.user = admin;
    next();
  });
  it('should return all programs', async () => {
    const resp = await request(app).get('/api/programs');
    const { success, data } = resp.body;

    expect(resp.status).toBe(200);
    expect(success).toBe(true);
    expect(data).toEqual(expect.any(Array));
    expect(data.length).toBe(programs.length);
  });
});

// describe("POST /api/programs", () => {
//   it("should create a program", async () => {
//     const { _id, ...fields } = generateProgram();
//     const resp = await request(app).post("/api/programs").send(fields);
//     const { success, data } = resp.body;

//     expect(resp.status).toBe(201);
//     expect(success).toBe(true);
//     expect({
//       ...data,
//       applicationAvailable: new Date(data.applicationAvailable),
//       application_deadline: new Date(data.application_deadline),
//     }).toMatchObject(fields);

//     const createdProgram = await Program.findById(data._id).lean();
//     expect(createdProgram).toMatchObject(fields);
//   });
// });

// describe("PUT /api/programs/:id", () => {
//   it("should update a program", async () => {
//     const { _id } = programs[0];
//     const { _id: _, ...fields } = generateProgram();

//     const resp = await request(app).put(`/api/programs/${_id}`).send(fields);
//     const { success, data } = resp.body;

//     expect(resp.status).toBe(200);
//     expect(success).toBe(true);
//     expect({
//       ...data,
//       applicationAvailable: new Date(data.applicationAvailable),
//       application_deadline: new Date(data.application_deadline),
//     }).toMatchObject(fields);

//     const updatedProgram = await Program.findById(_id).lean();
//     expect(updatedProgram).toMatchObject(fields);
//   });
// });

// describe("DELETE /api/programs/:id", () => {
//   it("should delete a program", async () => {
//     const { _id } = programs[0];

//     const resp = await request(app).delete(`/api/programs/${_id}`);

//     expect(resp.status).toBe(200);
//     expect(resp.body.success).toBe(true);

//     const deletedProgram = await Program.findById(_id);
//     expect(deletedProgram).toBe(null);
//   });
// });
