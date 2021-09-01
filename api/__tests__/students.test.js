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

describe("POST /students/:id/agents", () => {
  it("should update user's agents", async () => {
    const { _id } = students[0];
    const [agent1, agent2, _] = agents;

    const resp = await request(app)
      .post(`/students/${_id}/agents`)
      .send({
        [agent1.emailaddress_]: true,
        [agent2.emailaddress_]: true,
      });

    expect(resp.status).toBe(200);

    const student = await Student.findById(_id);
    expect(student.agent_.toObject()).toEqual([
      agent1.emailaddress_,
      agent2.emailaddress_,
    ]);
  });
});

describe("POST /students/:id/editors", () => {
  it("should update user's editors", async () => {
    const { _id } = students[0];
    const [editor1, editor2, _] = editors;

    const resp = await request(app)
      .post(`/students/${_id}/editors`)
      .send({
        [editor1.emailaddress_]: true,
        [editor2.emailaddress_]: true,
      });

    expect(resp.status).toBe(200);

    const student = await Student.findById(_id);
    expect(student.editor_.toObject()).toEqual([
      editor1.emailaddress_,
      editor2.emailaddress_,
    ]);
  });
});
