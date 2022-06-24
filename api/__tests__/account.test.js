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
  const filename_invalid_ext = "my-file.exe"; // will be overwrite to docName
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

  it("should return 400 when program specific file type not .pdf .png, .jpg and .jpeg .docx", async () => {
    const buffer_2MB_exe = Buffer.alloc(1024 * 1024 * 2); // 2 MB
    const resp2 = await request(app)
      .post(
        `/api/account/files/programspecific/upload/${studentId}/${applicationId}/${fileCategory}`
      )
      .attach("file", buffer_2MB_exe, filename_invalid_ext);

    expect(resp2.status).toBe(400);
    expect(resp2.body.success).toBe(false);
  });

  it("should return 400 when program specific file size (ML, Essay) over 5 MB", async () => {
    const buffer_10MB = Buffer.alloc(1024 * 1024 * 6); // 6 MB
    const resp2 = await request(app)
      .post(
        `/api/account/files/programspecific/upload/${studentId}/${applicationId}/${fileCategory}`
      )
      .attach("file", buffer_10MB, filename);

    expect(resp2.status).toBe(400);
    expect(resp2.body.success).toBe(false);
  });

  it("should save the uploaded program specific file and store the path in db", async () => {
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

    // test download: should return 400 with invalid applicationId
    const invalidApplicationId = "invalidapplicationID";
    const resp3 = await request(app)
      .get(
        `/api/account/files/programspecific/${studentId}/${invalidApplicationId}/${whoupdate}/${temp_name}`
      )
      .buffer();

    expect(resp3.status).toBe(400);
    expect(resp3.body.success).toBe(false);

    // test delete
    const resp4 = await request(app).delete(
      `/api/account/files/programspecific/${studentId}/${applicationId}/${whoupdate}/${temp_name}`
    );
    expect(resp4.status).toBe(201);
    expect(resp4.body.success).toBe(true);
  });
});

// TODO: uploading edutir general files like CV, RL_1, RL_2
describe("POST /api/account/files/general/upload/:studentId/:fileCategory", () => {
  const { _id: studentId } = student;
  var docName = requiredDocuments[0];
  const filename = "my-file.pdf"; // will be overwrite to docName
  const filename_invalid_ext = "invalid_extension.exe"; // will be overwrite to docName
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

  it("should return 400 when program specific file type not .pdf .png, .jpg and .jpeg .docx", async () => {
    const buffer_2MB_exe = Buffer.alloc(1024 * 1024 * 2); // 2 MB
    const resp2 = await request(app)
      .post(`/api/account/files/general/upload/${studentId}/${fileCategory}`)
      .attach("file", buffer_2MB_exe, filename_invalid_ext);

    expect(resp2.status).toBe(400);
    expect(resp2.body.success).toBe(false);
  });

  it("should return 400 when editor general file (CV, RL) size over 5 MB", async () => {
    const buffer_10MB = Buffer.alloc(1024 * 1024 * 6); // 6 MB
    const resp2 = await request(app)
      .post(`/api/account/files/general/upload/${studentId}/${fileCategory}`)
      .attach("file", buffer_10MB, filename);

    expect(resp2.status).toBe(400);
    expect(resp2.body.success).toBe(false);
  });

  it("should save the uploaded general CV,RL files and store the path in db", async () => {
    const resp = await request(app)
      .post(`/api/account/files/general/upload/${studentId}/${fileCategory}`)
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

    const resp3 = await request(app)
      .get(`/api/account/files/general/${studentId}/${whoupdate}/${temp_name}`)
      .buffer();

    expect(resp3.status).toBe(200);
    expect(resp3.headers["content-disposition"]).toEqual(
      `attachment; filename="${temp_name}"`
    );

    // test delete
    const resp4 = await request(app).delete(
      `/api/account/files/general/${studentId}/${whoupdate}/${temp_name}`
    );
    expect(resp4.status).toBe(201);
    expect(resp4.body.success).toBe(true);
  });
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

describe("POST /api/account/profile", () => {
  it("should update personal data", async () => {
    const resp = await request(app)
      .post(`/api/account/profile`)
      .send({
        personaldata: { firstname: "New_FirstName", lastname: "New_LastName" },
      });
    const { status, body } = resp;
    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toMatchObject({
      firstname: "New_FirstName",
      lastname: "New_LastName",
    });
  });
});

describe("POST /api/account/survey/language", () => {
  const language_obj = {
    language: {
      english_certificate: "TOEFL",
      english_score: "95",
      english_test_date: "",
      german_certificate: "",
      german_score: "",
      german_test_date: "",
    },
  };
  it("should update language status", async () => {
    const resp = await request(app)
      .post(`/api/account/survey/language`)
      .send(language_obj);
    const { status, body } = resp;
    expect(status).toBe(200);
    expect(body.success).toBe(true);
    // expect(body.data).toMatchObject(language_obj);
    expect(body.data.english_certificate).toBe(
      language_obj.language.english_certificate
    );
    expect(body.data.english_score).toBe(language_obj.language.english_score);
    expect(body.data.english_test_date).toBe(
      language_obj.language.english_test_date
    );
    expect(body.data.german_certificate).toBe(
      language_obj.language.german_certificate
    );
    expect(body.data.german_score).toBe(language_obj.language.german_score);
    expect(body.data.german_test_date).toBe(
      language_obj.language.german_test_date
    );
  });
});
