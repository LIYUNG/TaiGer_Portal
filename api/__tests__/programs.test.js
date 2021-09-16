const request = require("supertest");

const { app } = require("../app");
const { connectToDatabase, disconnectFromDatabase } = require("../database");
const { Program } = require("../models/Program");
const { generateProgram } = require("./fixtures/programs");

jest.mock("../middlewares/auth", () => {
  const passthrough = async (req, res, next) => next();

  return Object.assign({}, jest.requireActual("../middlewares/auth"), {
    protect: passthrough,
    permit: (...roles) => passthrough,
  });
});

beforeAll(async () => await connectToDatabase(global.__MONGO_URI__));

afterAll(disconnectFromDatabase);

const programs = [...Array(5)].map(generateProgram);

beforeEach(async () => {
  await Program.deleteMany();
  await Program.insertMany(programs);
});

describe("GET /programs", () => {
  it("should return all programs", async () => {
    const resp = await request(app).get("/programs");
    const { success, data } = resp.body;

    expect(resp.status).toBe(200);
    expect(success).toBe(true);
    expect(data).toEqual(expect.any(Array));
    expect(data.length).toBe(programs.length);
  });
});

describe("POST /programs", () => {
  it("should create a program", async () => {
    const { _id, ...fields } = generateProgram();
    const resp = await request(app).post("/programs").send(fields);
    const { success, data } = resp.body;

    expect(resp.status).toBe(201);
    expect(success).toBe(true);
    expect({
      ...data,
      applicationAvailable: new Date(data.applicationAvailable),
      applicationDeadline: new Date(data.applicationDeadline),
    }).toMatchObject(fields);

    const createdProgram = await Program.findById(data._id);
    expect(createdProgram.toObject()).toMatchObject(fields);
  });
});

describe("PUT /programs/:id", () => {
  it("should update a program", async () => {
    const { _id } = programs[0];
    const { _id: _, ...fields } = generateProgram();

    const resp = await request(app).put(`/programs/${_id}`).send(fields);
    const { success, data } = resp.body;

    expect(resp.status).toBe(200);
    expect(success).toBe(true);
    expect({
      ...data,
      applicationAvailable: new Date(data.applicationAvailable),
      applicationDeadline: new Date(data.applicationDeadline),
    }).toMatchObject(fields);

    const updatedProgram = await Program.findById(_id);
    expect(updatedProgram.toObject()).toMatchObject(fields);
  });
});

describe("DELETE /programs/:id", () => {
  it("should delete a program", async () => {
    const { _id } = programs[0];

    const resp = await request(app).delete(`/programs/${_id}`);

    expect(resp.status).toBe(200);
    expect(resp.body.success).toBe(true);

    const deletedProgram = await Program.findById(_id);
    expect(deletedProgram).toBe(null);
  });
});
