const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const EventEmitter = require("events");
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

// jest.mock("../middlewares/auth", () => {
//   return Object.assign({}, jest.requireActual("../middlewares/auth"), {
//     protect: jest.fn(),
//     permit:
//       (...roles) =>
//       (req, res, next) =>
//         next(),
//   });
// });

jest.mock("../middlewares/auth", () => {
  const passthrough = async (req, res, next) => next();

  return Object.assign({}, jest.requireActual("../middlewares/auth"), {
    protect: jest.fn().mockImplementation(passthrough),
    permit: jest.fn().mockImplementation((...roles) => passthrough),
  });
});

jest.mock("child_process", () => ({
  spawn: jest.fn(),
}));

const admin = generateUser(Role.Admin);
const agents = [...Array(3)].map(() => generateUser(Role.Agent));
const editor = generateUser(Role.Editor);
const student = generateUser(Role.Student);
const users = [admin, ...agents, editor, student];
// const student = generateUser(Role.Student);

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

  // protect.mockImplementation(async (req, res, next) => {
  //   req.user = await Student.findById(student._id);
  //   next();
  // });
});

afterEach(() => {
  fs.rmSync(UPLOAD_PATH, { recursive: true, force: true });
});


describe("POST /api/account/files/programspecific/upload/:studentId/:applicationId/:fileCategory", () => {
  const { _id: studentId } = student;
  var docName = requiredDocuments[0];
  const filename = "my-file.pdf"; // will be overwrite to docName
  const fileCategory = "ML";
  var whoupdate = "Editor";
  var temp_name;
  var applicationIds;
  var applicationId;
  var file_name_inDB;
  beforeEach(async () => {
    protect.mockImplementation(async (req, res, next) => {
      req.user = await User.findById(admin._id);
      next();
    });

    const resp = await request(app)
      .post(`/api/students/${studentId}/applications`)
      .send({ program_id_set: [program._id] });

    applicationIds = resp.body.data;
    applicationId = applicationIds[0];
  });

  it("should save the uploaded file and store the path in db", async () => {
    const resp = await request(app)
      .post(
        `/api/account/files/programspecific/upload/${studentId}/${applicationId}/${fileCategory}`
      )
      .attach("file", Buffer.from("Lorem ipsum"), filename);

    const { status, body } = resp;
    expect(status).toBe(201);
    expect(body.success).toBe(true);

    var updatedStudent = await Student.findById(studentId)
      .populate("applications.programId")
      .lean()
      .exec();
    var application = updatedStudent.applications.find(
      ({ programId }) => programId._id == applicationId
    );
    const doc_idx = application.documents.findIndex(({ name }) =>
      name.includes(fileCategory)
    );

    var version_number = 1;
    var same_file_name = true;
    while (same_file_name) {
      // console.log(application.programId);
      temp_name =
        student.lastname +
        "_" +
        student.firstname +
        "_" +
        application.programId.school +
        "_" +
        application.programId.program_name +
        "_" +
        fileCategory +
        "_v" +
        version_number +
        `${path.extname(application.documents[doc_idx].path)}`;
      temp_name = temp_name.replace(/ /g, "_");

      // let student_input_doc = application.student_inputs.find(
      //   ({ name }) => name === temp_name
      // );
      // let editor_output_doc = application.documents.find(
      //   ({ name }) => name === temp_name
      // );
      // if (editor_output_doc || student_input_doc) {
      //   version_number++;
      // } else {
      same_file_name = false;
      // }
    }

    // expect(
    //   updatedStudent.applications[appl_idx].documents[doc_idx].name
    // ).toMatchObject({
    //   // path: expect.not.stringMatching(/^$/),
    //   name: docName,
    //   // status: DocumentStatus.Uploaded,
    // });
    file_name_inDB = path.basename(application.documents[doc_idx].path);
    expect(file_name_inDB).toBe(temp_name);

    // Test Download:

     const resp2 = await request(app)
       .get(
         `/api/account/files/programspecific/${studentId}/${applicationId}/${whoupdate}/${temp_name}`
       )
       .buffer();

     expect(resp2.status).toBe(200);
     expect(resp2.headers["content-disposition"]).toEqual(
       `attachment; filename="${temp_name}"`
     );
  });

  // it("should return 400 with invalid applicationId", async () => {
  //   const invalidDoc = "wrong-doc";
  //   const resp = await request(app)
  //     .post(
  //       `/api/students/${studentId}/applications/${applicationId}/${invalidDoc}`
  //     )
  //     .attach("file", Buffer.from("Lorem ipsum"), filename);

  //   const { status, body } = resp;
  //   expect(status).toBe(400);
  //   expect(body.success).toBe(false);
  // });
});

// TODO: uploading edutir general files like CV, RL_1, RL_2
describe("POST /api/account/files/general/upload/:studentId/:fileCategory", () => {
  const { _id: studentId } = student;
  var docName = requiredDocuments[0];
  const filename = "my-file.pdf"; // will be overwrite to docName
  const fileCategory = "CV";
  var whoupdate = "Editor";
  var temp_name;
  var file_name_inDB;
  beforeEach(async () => {
    protect.mockImplementation(async (req, res, next) => {
      req.user = await User.findById(admin._id);
      next();
    });
  });

  it("should save the uploaded general CV,RL files and store the path in db", async () => {
    const resp = await request(app)
      .post(
        `/api/account/files/general/upload/${studentId}/${fileCategory}`
      )
      .attach("file", Buffer.from("Lorem ipsum"), filename);

    const { status, body } = resp;
    expect(status).toBe(201);
    expect(body.success).toBe(true);

    var updatedStudent = await Student.findById(studentId)
      .populate("applications.programId")
      .lean()
      .exec();
    var editoroutput_idx = updatedStudent.generaldocs.editoroutputs.findIndex(
      ({ name }) => name.includes(fileCategory)
    );

    var version_number = 1;
    var same_file_name = true;
    while (same_file_name) {
      // console.log(application.programId);
      temp_name =
        student.lastname +
        "_" +
        student.firstname +
        "_" +
        fileCategory +
        "_v" +
        version_number +
        `${path.extname(
          updatedStudent.generaldocs.editoroutputs[editoroutput_idx].path
        )}`;
      temp_name = temp_name.replace(/ /g, "_");

      // let student_input_doc = application.student_inputs.find(
      //   ({ name }) => name === temp_name
      // );
      // let editor_output_doc = application.documents.find(
      //   ({ name }) => name === temp_name
      // );
      // if (editor_output_doc || student_input_doc) {
      //   version_number++;
      // } else {
      same_file_name = false;
      // }
    }

    // expect(
    //   updatedStudent.applications[appl_idx].documents[doc_idx].name
    // ).toMatchObject({
    //   // path: expect.not.stringMatching(/^$/),
    //   name: docName,
    //   // status: DocumentStatus.Uploaded,
    // });
    file_name_inDB = path.basename(
      updatedStudent.generaldocs.editoroutputs[editoroutput_idx].path
    );
    expect(file_name_inDB).toBe(temp_name);

    // Test Download:

    const resp2 = await request(app)
      .get(
        `/api/account/files/general/${studentId}/${whoupdate}/${temp_name}`
      )
      .buffer();

    expect(resp2.status).toBe(200);
    expect(resp2.headers["content-disposition"]).toEqual(
      `attachment; filename="${temp_name}"`
    );
  });

  // it("should return 400 with invalid document name", async () => {
  //   const invalidDoc = "wrong-doc";
  //   const resp = await request(app)
  //     .post(
  //       `/api/students/${studentId}/applications/${applicationId}/${invalidDoc}`
  //     )
  //     .attach("file", Buffer.from("Lorem ipsum"), filename);

  //   const { status, body } = resp;
  //   expect(status).toBe(400);
  //   expect(body.success).toBe(false);
  // });
});

// TODO: uploading transcript for courses analyser
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
