const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const EventEmitter = require("events");
const request = require("supertest");

const { UPLOAD_PATH } = require("../config");
const { app } = require("../app");
const { connectToDatabase, disconnectFromDatabase } = require("../database");
const { Role, Student } = require("../models/User");
const { Program } = require("../models/Program");
const { DocumentStatus } = require("../constants");
const { generateUser } = require("./fixtures/users");
const { generateProgram } = require("./fixtures/programs");
const { protect } = require("../middlewares/auth");

jest.mock("../middlewares/auth", () => {
  return Object.assign({}, jest.requireActual("../middlewares/auth"), {
    protect: jest.fn(),
    permit:
      (...roles) =>
      (req, res, next) =>
        next(),
  });
});

jest.mock("child_process", () => ({
  spawn: jest.fn(),
}));

const student = generateUser(Role.Student);

const requiredDocuments = ["transcript", "resume"];
const optionalDocuments = ["certificate", "visa"];
const program = generateProgram(requiredDocuments, optionalDocuments);

beforeAll(async () => {
  jest.spyOn(console, "log").mockImplementation(jest.fn());
  await connectToDatabase(global.__MONGO_URI__);
});

afterAll(disconnectFromDatabase);

beforeEach(async () => {
  await Student.deleteMany();
  await Student.create(student);

  await Program.deleteMany();
  await Program.create(program);

  protect.mockImplementation(async (req, res, next) => {
    req.user = await Student.findById(student._id);
    next();
  });
});

afterEach(() => {
  fs.rmSync(UPLOAD_PATH, { recursive: true, force: true });
});

// TODO: refactor with students API, too much duplicate
describe("POST /api/account/files/programspecific/upload/:studentId/:applicationId/:fileCategory", () => {
  const { _id: studentId } = student;
  const docName = requiredDocuments[0];
  const filename = "my-file.pdf"; // will be overwrite to docName
  const fileCategory = "CV";
  var applicationId = program._id;
  beforeEach(async () => {
    // FIXME: create fixture directly? it shouldn't depends on students API
    const resp = await request(app)
      .post(`/api/students/${studentId}/applications`)
      .send({ program_id_set: [program._id] });
    // const { data, success } = resp.body.data;
    // applicationId = data[0]; // resp: {data: program_id_set}, program_id_set is array
  });

  it("should save the uploaded file and store the path in db", async () => {
    const resp = await request(app)
      .post(
        `/api/account/files/programspecific/upload/${studentId}/${applicationId}/${fileCategory}`
      )
      .attach("file", Buffer.from("Lorem ipsum"), filename);

    const { status, body } = resp;
    expect(program._id).toBe(applicationId);
    expect(status).toBe(201);
    expect(body.success).toBe(true);
    // expect(body.data).toMatchObject({
    //   path: expect.not.stringMatching(/^$/),
    //   name: docName,
    //   status: DocumentStatus.Uploaded,
    // });
  });

  // it("should return 400 with invalid document name", async () => {
  //   const invalidDoc = "wrong-doc";
  //   const resp = await request(app)
  //     .post(`/api/account/files/${applicationId}/${invalidDoc}`)
  //     .attach("file", Buffer.from("Lorem ipsum"), filename);

  //   const { status, body } = resp;
  //   expect(status).toBe(400);
  //   expect(body.success).toBe(false);
  // });
});

// describe("GET /api/account/files/:applicationId/:docName", () => {
//   const { _id: studentId } = student;
//   const docName = requiredDocuments[0];
//   const filename = "my-file.pdf"; // will be overwrite to docName

//   let applicationId;
//   beforeEach(async () => {
//     // FIXME: create fixture directly? it shouldn't depends on students API
//     const resp = await request(app)
//       .post(`/api/students/${studentId}/applications`)
//       .send({ programId: program._id });

//     applicationId = resp.body.data._id;

//     await request(app)
//       .post(`/api/account/files/${applicationId}/${docName}`)
//       .attach("file", Buffer.from("Lorem ipsum"), filename);
//   });

//   it("should download the previous uploaded file", async () => {
//     const resp = await request(app)
//       .get(`/api/account/files/${applicationId}/${docName}`)
//       .buffer();

//     expect(resp.status).toBe(200);
//     expect(resp.headers["content-disposition"]).toEqual(
//       `attachment; filename="${docName}${path.extname(filename)}"`
//     );
//   });

//   it("should return 400 with invalid document name", async () => {
//     const invalidDoc = "wrong-doc";
//     const resp = await request(app)
//       .get(`/api/account/files/${applicationId}/${invalidDoc}`)
//       .buffer();

//     expect(resp.status).toBe(400);
//   });

//   it("should return 400 when file not uploaded yet", async () => {
//     const emptyDoc = requiredDocuments[1];
//     const resp = await request(app)
//       .get(`/api/account/files/${applicationId}/${emptyDoc}`)
//       .buffer();

//     expect(resp.status).toBe(400);
//   });
// });

// describe("POST /api/account/transcript/:category/:group", () => {
//   it("should run python script on the uploaded file", async () => {
//     const pythonProcess = new EventEmitter();
//     spawn.mockImplementation((cmd, ...args) => {
//       setTimeout(() => pythonProcess.emit("close", 0), 0);
//       return pythonProcess
//     });

//     const category = "bachelorTranscript_";
//     const filename = "my-file.xlsx";
//     const group = "cs";

//     const resp = await request(app)
//       .post(`/api/account/transcript/${category}/${group}`)
//       .attach("file", Buffer.from("Lorem ipsum"), filename);

//     expect(spawn).toBeCalled();
//     expect(resp.status).toBe(200);
//     // FIXME: not a reasonable response
//     expect(resp.body).toMatchObject({ generatedfile: `analyzed_${filename}` });
//   });

//   it("should return 500 when error occurs while processing file", async () => {
//     const pythonProcess = new EventEmitter();
//     spawn.mockImplementation((cmd, ...args) => {
//       setTimeout(() => pythonProcess.emit("close", 1), 0);
//       return pythonProcess
//     });

//     const category = "bachelorTranscript_";
//     const filename = "my-file.xlsx";
//     const group = "cs";

//     const resp = await request(app)
//       .post(`/api/account/transcript/${category}/${group}`)
//       .attach("file", Buffer.from("Lorem ipsum"), filename);

//     expect(resp.status).toBe(500);
//   });

//   it.todo("should return 400 for invalid file");
// });

// describe("GET /api/account/download/:category/:filename", () => {
//   it.todo("should download the analyzed report");
// });
