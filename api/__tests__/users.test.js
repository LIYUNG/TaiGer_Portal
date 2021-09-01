const request = require("supertest");

const { app } = require("../app");
const { connectToDatabase, disconnectFromDatabase } = require("../database");
const { Role } = require("../models/User");
const Student = require("../models/Students");
const { generateUser } = require("./fixtures/users");

jest.mock("../middlewares/auth", () => {
  const passthrough = async (req, res, next) => next();

  return Object.assign({}, jest.requireActual("../middlewares/auth"), {
    auth: passthrough,
    permit: (...roles) => passthrough,
  });
});

beforeAll(async () => await connectToDatabase(global.__MONGO_URI__));

afterAll(disconnectFromDatabase);

const admins = [...Array(2)].map(() => generateUser(Role.Admin));
const agents = [...Array(3)].map(() => generateUser(Role.Agent));
const editors = [...Array(3)].map(() => generateUser(Role.Editor));
const students = [...Array(5)].map(() => generateUser(Role.Student));
const guests = [...Array(5)].map(() => generateUser(Role.Guest));
const users = [...admins, ...agents, ...editors, ...students, ...guests];

beforeEach(async () => {
  await Student.deleteMany();
  await Student.create(users);
});

describe("GET /users", () => {
  it("should return all users", async () => {
    const resp = await request(app).get("/users");
    const { data } = resp.body;

    expect(resp.status).toBe(200);
    expect(data).toEqual(expect.any(Array));
    expect(data.length).toBe(users.length);
  });
});

describe("POST /users/:id", () => {
  it("should update a user", async () => {
    const { _id } = users[0];
    const { firstname_, lastname_, emailaddress_ } = generateUser();

    const resp = await request(app).post(`/users/${_id}`).send({
      firstname_,
      lastname_,
      emailaddress_,
    });

    expect(resp.status).toBe(200);
    expect(resp.body.data).toMatchObject({ firstname_, lastname_, emailaddress_ })

    const updatedUser = await Student.findById(_id);
    expect(updatedUser).toMatchObject({ firstname_, lastname_, emailaddress_ })
  });
});

describe("DELETE /users/:id", () => {
  it("should delete a user", async () => {
    const { _id } = users[0];

    const resp = await request(app).delete(`/users/${_id}`);

    expect(resp.status).toBe(200);

    const deletedUser = await Student.findById(_id);
    expect(deletedUser).toBe(null)
  });
});

describe("GET /agents", () => {
  it("should return all agents", async () => {
    const resp = await request(app).get("/agents");
    const { data } = resp.body;

    expect(resp.status).toBe(200);
    expect(data).toEqual(expect.any(Array));
    expect(data.length).toBe(agents.length);
  });
});

describe("GET /editors", () => {
  it("should return all editors", async () => {
    const resp = await request(app).get("/editors");
    const { data } = resp.body;

    expect(resp.status).toBe(200);
    expect(data).toEqual(expect.any(Array));
    expect(data.length).toBe(editors.length);
  });
});

describe("GET /students", () => {
  // FIXME: fix the logic for this route, return data shouldn't depend on role?
  it.todo("should return all students");
});
