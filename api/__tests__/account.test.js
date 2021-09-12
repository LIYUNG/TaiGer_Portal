const fs = require("fs");
const { spawn } = require("child_process");
const EventEmitter = require("events");
const request = require("supertest");

const { UPLOAD_PATH } = require("../config");
const { app } = require("../app");
const { connectToDatabase, disconnectFromDatabase } = require("../database");
const { Role, Student } = require("../models/User");
const { generateUser } = require("./fixtures/users");
const { protect } = require("../middlewares/auth");

jest.mock("../middlewares/auth", () => {
  return Object.assign({}, jest.requireActual("../middlewares/auth"), {
    protect: jest.fn(),
    permit: (...roles) => (req, res, next) => next(),
  });
});

jest.mock("child_process", () => ({
  spawn: jest.fn(),
}));

const student = generateUser(Role.Student);

beforeAll(async () => await connectToDatabase(global.__MONGO_URI__));

afterAll(disconnectFromDatabase);

beforeEach(async () => {
  await Student.deleteMany();
  await Student.create(student);

  protect.mockImplementation(async (req, res, next) => {
    req.user = await Student.findById(student._id);
    next();
  });
});

afterEach(() => {
  fs.rmSync(UPLOAD_PATH, { recursive: true, force: true });
});

// describe("GET /account/files", () => {
//   it.todo("should list all user files");
// });

// describe("POST /account/files/:category", () => {
//   it("should save the uploaded file and store the path in db", async () => {
//     const category = "Essay_";
//     const filename = "my-file.pdf";

//     const resp = await request(app)
//       .post(`/account/files/${category}`)
//       .attach("file", Buffer.from("Lorem ipsum"), filename);

//     expect(resp.status).toBe(201);

//     const updatedStudent = await Student.findById(student._id);
//     expect(updatedStudent.uploadedDocs_[category]).toMatchObject({
//       uploadStatus_: "uploaded",
//       filePath_: expect.toEndWith(filename),
//       LastUploadDate_: expect.anything(),
//     });
//   });
// });

// describe("GET /account/files/:category", () => {
//   it("should download the previous uploaded file", async () => {
//     const category = "Essay_";
//     const filename = "my-file.pdf";

//     await request(app)
//       .post(`/account/files/${category}`)
//       .attach("file", Buffer.from("Lorem ipsum"), filename);

//     const resp = await request(app).get(`/account/files/${category}`).buffer();

//     expect(resp.status).toBe(200);
//     expect(resp.headers["content-disposition"]).toEqual(
//       `attachment; filename="${filename}"`
//     );
//   });
// });

// describe("POST /account/transcript/:category/:group", () => {
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
//       .post(`/account/transcript/${category}/${group}`)
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
//       .post(`/account/transcript/${category}/${group}`)
//       .attach("file", Buffer.from("Lorem ipsum"), filename);

//     expect(resp.status).toBe(500);
//   });

//   it.todo("should return 400 for invalid file");
// });

// describe("GET /account/download/:category/:filename", () => {
//   it.todo("should download the analyzed report");
// });

test.todo("account test")
