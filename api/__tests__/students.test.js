const fs = require("fs");
const path = require("path");
const request = require("supertest");

const { UPLOAD_PATH } = require("../config");
const { app } = require("../app");
const { connectToDatabase, disconnectFromDatabase } = require("../database");
const { Role, User, Agent, Editor, Student } = require("../models/User");
const { Program } = require("../models/Program");
const { DocumentStatus } = require("../constants");
const { generateUser } = require("./fixtures/users");
const { generateProgram } = require("./fixtures/programs");
const { protect } = require("../middlewares/auth");

jest.mock("../middlewares/auth", () => {
  const passthrough = async (req, res, next) => next();

  return Object.assign({}, jest.requireActual("../middlewares/auth"), {
    protect: jest.fn().mockImplementation(passthrough),
    permit: jest.fn().mockImplementation((...roles) => passthrough),
  });
});

const admin = generateUser(Role.Admin);
const agents = [...Array(3)].map(() => generateUser(Role.Agent));
const editors = [...Array(3)].map(() => generateUser(Role.Editor));
const student = generateUser(Role.Student);
const users = [admin, ...agents, ...editors, student];

const requiredDocuments = ["transcript", "resume"];
const optionalDocuments = ["certificate", "visa"];
const program = generateProgram(requiredDocuments, optionalDocuments);

beforeAll(async () => {
  jest.spyOn(console, "log").mockImplementation(jest.fn());
  await connectToDatabase(global.__MONGO_URI__);
});

afterAll(disconnectFromDatabase);

beforeEach(async () => {
  await User.deleteMany();
  await User.insertMany(users);

  await Program.deleteMany();
  await Program.create(program);
});

afterEach(() => {
  fs.rmSync(UPLOAD_PATH, { recursive: true, force: true });
});

// describe("POST /api/students/:id/agents", () => {
//   it("should assign an agent to student", async () => {
//     const { _id: studentId } = student;
//     const { _id: agentId } = agents[0];

//     const resp = await request(app)
//       .post(`/api/students/${studentId}/agents`)
//       .send({ id: agentId });

//     expect(resp.status).toBe(200);

//     const updatedStudent = await Student.findById(studentId).lean();
//     expect(updatedStudent.agents.map(String)).toEqual([agentId]);

//     const updatedAgent = await Agent.findById(agentId).lean();
//     expect(updatedAgent.students.map(String)).toEqual([studentId]);
//   });
// });

// describe("DELETE /api/students/:studentId/agents/:agentId", () => {
//   it("should remove an agent from student", async () => {
//     const { _id: studentId } = student;
//     const { _id: agentId } = agents[0];

//     await request(app)
//       .post(`/api/students/${studentId}/agents`)
//       .send({ id: agentId });

//     const resp = await request(app).delete(
//       `/api/students/${studentId}/agents/${agentId}`
//     );

//     expect(resp.status).toBe(200);

//     const updatedStudent = await Student.findById(studentId).lean();
//     expect(updatedStudent.agents.map(String)).toEqual([]);

//     const updatedAgent = await Agent.findById(agentId).lean();
//     expect(updatedAgent.students.map(String)).toEqual([]);
//   });
// });

// describe("POST /api/students/:id/editors", () => {
//   it("should assign an editor to student", async () => {
//     const { _id: studentId } = student;
//     const { _id: editorId } = editors[0];

//     const resp = await request(app)
//       .post(`/api/students/${studentId}/editors`)
//       .send({ id: editorId });

//     expect(resp.status).toBe(200);

//     const updatedStudent = await Student.findById(studentId).lean();
//     expect(updatedStudent.editors.map(String)).toEqual([editorId]);

//     const updatedEditor = await Editor.findById(editorId).lean();
//     expect(updatedEditor.students.map(String)).toEqual([studentId]);
//   });
// });

// describe("DELETE /api/students/:studentId/editors/:editorId", () => {
//   it("should remove an editor from student", async () => {
//     const { _id: studentId } = student;
//     const { _id: editorId } = editors[0];

//     await request(app)
//       .post(`/api/students/${studentId}/editors`)
//       .send({ id: editorId });

//     const resp = await request(app).delete(
//       `/api/students/${studentId}/editors/${editorId}`
//     );

//     expect(resp.status).toBe(200);

//     const updatedStudent = await Student.findById(studentId).lean();
//     expect(updatedStudent.editors.map(String)).toEqual([]);

//     const updatedEditor = await Editor.findById(editorId).lean();
//     expect(updatedEditor.students.map(String)).toEqual([]);
//   });
// });

describe("POST /api/students/:id/applications", () => {
  it("should create an application for student", async () => {
    const { _id: studentId } = student;
    const resp = await request(app)
      .post(`/api/students/${studentId}/applications`)
      .send({ programId: program._id });

    const {
      status,
      body: { success, data },
    } = resp;

    expect(status).toBe(201);
    expect(success).toBe(true);
    expect(data).toMatchObject({
      _id: expect.any(String),
      programId: program._id,
      documents: expect.toBeArrayOfSize(
        requiredDocuments.length + optionalDocuments.length
      ),
    });

    const updatedStudent = await Student.findById(studentId).lean();
    const { documents } = updatedStudent.applications[0];
    expect(documents.map(({ name }) => name).sort()).toEqual(
      [...requiredDocuments, ...optionalDocuments].sort()
    );
  });

  it("should return 400 when creating application with duplicate program Id", async () => {
    const { _id: studentId } = student;
    await request(app)
      .post(`/api/students/${studentId}/applications`)
      .send({ programId: program._id });

    const resp = await request(app)
      .post(`/api/students/${studentId}/applications`)
      .send({ programId: program._id });

    expect(resp.status).toBe(400);
  });
});

describe("DELETE /api/students/:studentId/applications/:applicationId", () => {
  it("should delete an application from student", async () => {
    const { _id: studentId } = student;

    await request(app)
      .post(`/api/students/${studentId}/applications`)
      .send({ programId: program._id });

    let updatedStudent = await Student.findById(studentId).lean();
    const applicationId = updatedStudent.applications[0]._id;

    const resp = await request(app).delete(
      `/api/students/${studentId}/applications/${applicationId}`
    );

    expect(resp.status).toBe(200);

    updatedStudent = await Student.findById(studentId).lean();
    expect(updatedStudent.applications).toHaveLength(0);
  });

  it.todo(
    "should return 400 when deleting a application that student doesn't possess"
  );
});

describe("POST /api/students/:studentId/applications/:applicationId/:docName", () => {
  const { _id: studentId } = student;
  const docName = requiredDocuments[0];
  const filename = "my-file.pdf"; // will be overwrite to docName

  let applicationId;
  beforeEach(async () => {
    protect.mockImplementation(async (req, res, next) => {
      req.user = await User.findById(admin._id);
      next();
    });

    const resp = await request(app)
      .post(`/api/students/${studentId}/applications`)
      .send({ programId: program._id });

    applicationId = resp.body.data._id;
  });

  it("should save the uploaded file and store the path in db", async () => {
    const resp = await request(app)
      .post(
        `/api/students/${studentId}/applications/${applicationId}/${docName}`
      )
      .attach("file", Buffer.from("Lorem ipsum"), filename);

    const { status, body } = resp;
    expect(status).toBe(201);
    expect(body.success).toBe(true);
    expect(body.data).toMatchObject({
      path: expect.not.stringMatching(/^$/),
      name: docName,
      status: DocumentStatus.Uploaded,
    });
  });

  it("should return 400 with invalid document name", async () => {
    const invalidDoc = "wrong-doc";
    const resp = await request(app)
      .post(
        `/api/students/${studentId}/applications/${applicationId}/${invalidDoc}`
      )
      .attach("file", Buffer.from("Lorem ipsum"), filename);

    const { status, body } = resp;
    expect(status).toBe(400);
    expect(body.success).toBe(false);
  });
});

describe("Document Read / Update / Delete operations", () => {
  const { _id: studentId } = student;
  const docName = requiredDocuments[0];
  const filename = "my-file.pdf"; // will be overwrite to docName

  let applicationId;
  beforeEach(async () => {
    protect.mockImplementation(async (req, res, next) => {
      req.user = await User.findById(admin._id);
      next();
    });

    const resp = await request(app)
      .post(`/api/students/${studentId}/applications`)
      .send({ programId: program._id });

    applicationId = resp.body.data._id;

    await request(app)
      .post(
        `/api/students/${studentId}/applications/${applicationId}/${docName}`
      )
      .attach("file", Buffer.from("Lorem ipsum"), filename);
  });

  describe("GET /api/students/:studentId/applications/:applicationId/:docName", () => {
    it("should download the previous uploaded file", async () => {
      const resp = await request(app)
        .get(
          `/api/students/${studentId}/applications/${applicationId}/${docName}`
        )
        .buffer();

      expect(resp.status).toBe(200);
      expect(resp.headers["content-disposition"]).toEqual(
        `attachment; filename="${docName}${path.extname(filename)}"`
      );
    });

    it("should return 400 with invalid document name", async () => {
      const invalidDoc = "wrong-doc";
      const resp = await request(app)
        .get(
          `/api/students/${studentId}/applications/${applicationId}/${invalidDoc}`
        )
        .buffer();

      expect(resp.status).toBe(400);
    });

    it("should return 400 when file not uploaded yet", async () => {
      const emptyDoc = requiredDocuments[1];
      const resp = await request(app)
        .get(
          `/api/students/${studentId}/applications/${applicationId}/${emptyDoc}`
        )
        .buffer();

      expect(resp.status).toBe(400);
    });
  });

  describe("DELETE /api/students/:studentId/applications/:applicationId/:docName", () => {
    it("should delete previous uploaded file", async () => {
      const resp = await request(app).delete(
        `/api/students/${studentId}/applications/${applicationId}/${docName}`
      );

      const { success, data } = resp.body;
      expect(resp.status).toBe(200);
      expect(success).toBe(true);
      expect(data).toMatchObject({
        status: DocumentStatus.Missing,
        path: "",
      });

      const updatedStudent = await Student.findById(studentId);
      const { documents } = updatedStudent.applications.id(applicationId);
      const document = documents.find(({ name }) => name === docName);
      expect(document).toMatchObject({
        status: DocumentStatus.Missing,
        path: "",
      });
    });
  });

  describe("POST /api/students/:studentId/applications/:applicationId/:docName/status", () => {
    it("should update uploaded file status", async () => {
      const status = DocumentStatus.Rejected;
      const resp = await request(app)
        .post(
          `/api/students/${studentId}/applications/${applicationId}/${docName}/status`
        )
        .send({ status });

      const { success, data } = resp.body;
      expect(resp.status).toBe(200);
      expect(success).toBe(true);
      expect(data).toMatchObject({
        status,
        path: expect.any(String),
        name: docName,
      });
    });
  });
});
