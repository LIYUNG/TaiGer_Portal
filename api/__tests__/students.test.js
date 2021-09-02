const request = require("supertest");

const { app } = require("../app");
const { connectToDatabase, disconnectFromDatabase } = require("../database");
const { Role } = require("../models/User");
const Student = require("../models/Students");
const Program = require("../models/Programs");
const { generateUser } = require("./fixtures/users");
const { generateProgram } = require("./fixtures/programs");

jest.mock("../middlewares/auth", () => {
  const passthrough = async (req, res, next) => next();

  return Object.assign({}, jest.requireActual("../middlewares/auth"), {
    auth: jest.fn().mockImplementation(passthrough),
    permit: jest.fn().mockImplementation((...roles) => passthrough),
  });
});

const admin = generateUser(Role.Admin);
const agents = [...Array(3)].map(() => generateUser(Role.Agent));
const editors = [...Array(3)].map(() => generateUser(Role.Editor));
const student = generateUser(Role.Student);
const users = [admin, ...agents, ...editors, student];

const programs = [...Array(10)].map(generateProgram);

beforeAll(async () => await connectToDatabase(global.__MONGO_URI__));

afterAll(disconnectFromDatabase);

beforeEach(async () => {
  await Student.deleteMany();
  await Student.create(users);

  await Program.deleteMany();
  await Program.create(programs);
});

afterEach(() => {
  // TODO: safe way to delete genertated upload files?
});

describe("POST /students/:id/agents", () => {
  it("should update user's agents", async () => {
    const { _id } = student;
    const [agent1, agent2, _] = agents;

    const resp = await request(app)
      .post(`/students/${_id}/agents`)
      .send({
        [agent1.emailaddress_]: true,
        [agent2.emailaddress_]: true,
      });

    expect(resp.status).toBe(200);

    const updatedStudent = await Student.findById(_id);
    expect(updatedStudent.agent_.toObject()).toEqual([
      agent1.emailaddress_,
      agent2.emailaddress_,
    ]);
  });
});

describe("POST /students/:id/editors", () => {
  it("should update user's editors", async () => {
    const { _id } = student;
    const [editor1, editor2, _] = editors;

    const resp = await request(app)
      .post(`/students/${_id}/editors`)
      .send({
        [editor1.emailaddress_]: true,
        [editor2.emailaddress_]: true,
      });

    expect(resp.status).toBe(200);

    const updatedStudent = await Student.findById(_id);
    expect(updatedStudent.editor_.toObject()).toEqual([
      editor1.emailaddress_,
      editor2.emailaddress_,
    ]);
  });
});

describe("POST /students/:id/programs", () => {
  it("should assign a program to student", async () => {
    const { _id: studentId } = student;
    const program = programs[0];
    const resp = await request(app)
      .post(`/students/${studentId}/programs`)
      .send({ programId: program._id });

    expect(resp.status).toBe(201);

    const updatedStudent = await Student.findById(studentId);
    expect(updatedStudent.applying_program_[0]).toMatchObject(program);
  });

  it("should return 400 when creating duplicate program for student", async () => {
    const { _id: studentId } = student;
    const program = programs[0];
    await request(app)
      .post(`/students/${studentId}/programs`)
      .send({ programId: program._id });

    const resp = await request(app)
      .post(`/students/${studentId}/programs`)
      .send({ programId: program._id });

    expect(resp.status).toBe(400);
  });
});

describe("DELETE /students/:studentId/programs/:programId", () => {
  const { _id: studentId } = student;
  const [program1, program2] = programs.slice(0, 2);

  beforeEach(async () => {
    await request(app)
      .post(`/students/${studentId}/programs`)
      .send({ programId: program1._id });
  });

  it("should delete a program from student", async () => {
    const resp = await request(app).delete(
      `/students/${studentId}/programs/${program1._id}`
    );

    expect(resp.status).toBe(200);

    const student = await Student.findById(studentId);
    expect(student.applying_program_).toHaveLength(0);
  });

  it.todo(
    "should return 400 when deleting a program that student doesn't possess"
  );
});

describe("POST /students/:studentId/files/:category", () => {
  it("should save the uploaded file and store the path in db", async () => {
    const { _id } = student;
    const category = "Essay_";
    const filename = "my-file.pdf";

    const resp = await request(app)
      .post(`/students/${_id}/files/${category}`)
      .attach("file", Buffer.from("Lorem ipsum"), filename);

    expect(resp.status).toBe(201);

    const updatedStudent = await Student.findById(_id);
    expect(updatedStudent.uploadedDocs_[category]).toMatchObject({
      uploadStatus_: "uploaded",
      filePath_: expect.toEndWith(filename),
      LastUploadDate_: expect.anything(),
    });
  });

  it.todo("should return 400 with invalid category");
});

describe("GET /students/:studentId/files/:category", () => {
  it("should download the previous uploaded file", async () => {
    const { _id } = student;
    const category = "Essay_";
    const filename = "my-file.pdf";

    await request(app)
      .post(`/students/${_id}/files/${category}`)
      .attach("file", Buffer.from("Lorem ipsum"), filename);

    const resp = await request(app)
      .get(`/students/${_id}/files/${category}`)
      .buffer();

    expect(resp.status).toBe(200);
    expect(resp.headers["content-disposition"]).toEqual(
      `attachment; filename="${filename}"`
    );
  });

  it.todo("should return 400 when file not exist");
});

describe("DELETE /students/:studentId/files/:category", () => {
  it("should delete previous uploaded file", async () => {
    const { _id } = student;
    const category = "Essay_";
    const filename = "my-file.pdf";

    await request(app)
      .post(`/students/${_id}/files/${category}`)
      .attach("file", Buffer.from("Lorem ipsum"), filename);

    const resp = await request(app).delete(`/students/${_id}/files/${category}`)

    expect(resp.status).toBe(200);

    const updatedStudent = await Student.findById(_id);
    expect(updatedStudent.uploadedDocs_[category]).toMatchObject({
      uploadStatus_: "",
      filePath_: "",
      LastUploadDate_: expect.anything(),
    });
  });
});
