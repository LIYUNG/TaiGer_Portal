const request = require("supertest");

const { app } = require("../app");
const { connectToDatabase, disconnectFromDatabase } = require("../database");
const { Role, User } = require("../models/User");
const { generateUser } = require("./fixtures/users");

jest.mock("../middlewares/auth", () => {
  const passthrough = async (req, res, next) => next();

  return Object.assign({}, jest.requireActual("../middlewares/auth"), {
    protect: passthrough,
    permit: (...roles) => passthrough,
  });
});

beforeAll(async () => {
  jest.spyOn(console, "log").mockImplementation(jest.fn());
  await connectToDatabase(global.__MONGO_URI__);
});

afterAll(disconnectFromDatabase);

const admins = [...Array(2)].map(() => generateUser(Role.Admin));
const agents = [...Array(3)].map(() => generateUser(Role.Agent));
const editors = [...Array(3)].map(() => generateUser(Role.Editor));
const students = [...Array(5)].map(() => generateUser(Role.Student));
const guests = [...Array(5)].map(() => generateUser(Role.Guest));
const users = [...admins, ...agents, ...editors, ...students, ...guests];

beforeEach(async () => {
  await User.deleteMany();
  await User.insertMany(users);
});

describe("GET /api/users", () => {
  it("should return all users", async () => {
    const resp = await request(app).get("/api/users");
    const { success, data } = resp.body;

    expect(resp.status).toBe(200);
    expect(success).toBe(true);
    expect(data).toEqual(expect.any(Array));
    expect(data.length).toBe(users.length);
  });
});

// describe("PUT /api/users/:id", () => {
//   it("should update a user", async () => {
//     const { _id } = users[0];
//     const { name, email } = generateUser();

//     const resp = await request(app)
//       .put(`/api/users/${_id}`)
//       .send({ name, email });
//     const { success, data } = resp.body;

//     expect(resp.status).toBe(200);
//     expect(success).toBe(true);
//     expect(data).toMatchObject({ name, email });

//     const updatedUser = await User.findById(_id);
//     expect(updatedUser).toMatchObject({ name, email });
//   });

//   it.todo("should change user fields when updating it's role");
// });

// describe("DELETE /api/users/:id", () => {
//   it("should delete a user", async () => {
//     const { _id } = users[0];

//     const resp = await request(app).delete(`/api/users/${_id}`);

//     expect(resp.status).toBe(200);
//     expect(resp.body.success).toBe(true);

//     const deletedUser = await User.findById(_id);
//     expect(deletedUser).toBe(null);
//   });
// });

// TODO: move below to their own files?
describe("GET /api/agents", () => {
  it("should return all agents", async () => {
    const resp = await request(app).get("/api/agents");
    const { success, data } = resp.body;

    const agentIds = agents.map(({ _id }) => _id).sort();
    const receivedIds = data.map(({ _id }) => _id).sort();

    expect(resp.status).toBe(200);
    expect(success).toBe(true);
    expect(receivedIds).toEqual(agentIds);
  });
});

describe("GET /api/editors", () => {
  it("should return all editors", async () => {
    const resp = await request(app).get("/api/editors");
    const { success, data } = resp.body;

    const editorIds = editors.map(({ _id }) => _id).sort();
    const receivedIds = data.map(({ _id }) => _id).sort();

    expect(resp.status).toBe(200);
    expect(success).toBe(true);
    expect(receivedIds).toEqual(editorIds);
  });
});

describe("GET /api/students", () => {
  it("should return all students", async () => {
    const resp = await request(app).get("/api/students");
    const { success, data } = resp.body;

    const studentIds = students.map(({ _id }) => _id).sort();
    // const receivedIds = data.map(({ _id }) => _id).sort();

    expect(resp.status).toBe(200);
    expect(success).toBe(true);
    // expect(receivedIds).toEqual(studentIds);
  });
});
