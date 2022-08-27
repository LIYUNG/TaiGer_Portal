const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const EventEmitter = require('events');
const request = require('supertest');

const { UPLOAD_PATH } = require('../config');
const { app } = require('../app');
const { connectToDatabase, disconnectFromDatabase } = require('../database');
const { Role, User, Agent, Editor, Student } = require('../models/User');
const { Program } = require('../models/Program');
const { DocumentStatus } = require('../constants');
const { generateUser } = require('./fixtures/users');
const { generateProgram } = require('./fixtures/programs');
const { protect } = require('../middlewares/auth');

// jest.mock("../middlewares/auth", () => {
//   return Object.assign({}, jest.requireActual("../middlewares/auth"), {
//     protect: jest.fn(),
//     permit:
//       (...roles) =>
//       (req, res, next) =>
//         next(),
//   });
// });

jest.mock('../middlewares/auth', () => {
  const passthrough = async (req, res, next) => next();

  return Object.assign({}, jest.requireActual('../middlewares/auth'), {
    protect: jest.fn().mockImplementation(passthrough),
    permit: jest.fn().mockImplementation((...roles) => passthrough)
  });
});

jest.mock('child_process', () => ({
  spawn: jest.fn()
}));

const admin = generateUser(Role.Admin);
const agents = [...Array(3)].map(() => generateUser(Role.Agent));
const agent = generateUser(Role.Agent);
const editors = [...Array(3)].map(() => generateUser(Role.Editor));
const editor = generateUser(Role.Editor);
const students = [...Array(3)].map(() => generateUser(Role.Student));
const student = generateUser(Role.Student);
const student2 = generateUser(Role.Student);
const users = [
  admin,
  ...agents,
  agent,
  ...editors,
  editor,
  ...students,
  student,
  student2
];

const requiredDocuments = ['transcript', 'resume'];
const optionalDocuments = ['certificate', 'visa'];
const program = generateProgram(requiredDocuments, optionalDocuments);

beforeAll(async () => {
  jest.spyOn(console, 'log').mockImplementation(jest.fn());
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

// user: Agent
describe('POST /api/document-threads/init/application/:studentId/:programId/:document_category', () => {
  const { _id: studentId } = student;
  const { _id: programId } = program;
  const { _id: agentId } = agent;
  var docName = requiredDocuments[0];
  const filename = 'my-file.pdf'; // will be overwrite to docName
  const filename_invalid_ext = 'my-file.exe'; // will be overwrite to docName
  const fileCategory = 'ML';
  var r = /\d+/; //number pattern
  var whoupdate = 'Editor';
  let version_number_max = 0;
  let db_file_name;
  var temp_name;
  var applicationIds;
  var applicationId;
  var file_name_inDB;
  let document_category = 'ML';
  var student_1;
  var messagesThreadId;
  beforeEach(async () => {
    protect.mockImplementation(async (req, res, next) => {
      req.user = await User.findById(agentId);
      next();
    });

    const resp = await request(app)
      .post(`/api/students/${studentId}/applications`)
      .send({ program_id_set: [programId] });

    const resp22 = await request(app).post(
      `/api/document-threads/init/application/${studentId}/${programId}/${document_category}`
    );

    applicationIds = resp.body.data;
    applicationId = applicationIds[0];
    student_1 = resp.body.data;
    messagesThreadId =
      student_1.applications[0].doc_modification_thread[0].doc_thread_id;
  });

  it.each([
    ['my-file.exe', 400, false],
    ['my-file.pdf', 201, true]
  ])(
    'should return 400 when program specific file type not .pdf .png, .jpg and .jpeg .docx %p %p %p',
    async (File_Name, status, success) => {
      const buffer_1MB_exe = Buffer.alloc(1024 * 1024 * 1); // 1 MB
      const resp2 = await request(app)
        .post(`/api/document-threads/${messagesThreadId}/${studentId}`)
        .attach('file', buffer_1MB_exe, File_Name);

      expect(resp2.status).toBe(status);
      expect(resp2.body.success).toBe(success);
    }
  );

  it('should return 400 when program specific file size (ML, Essay) over 5 MB', async () => {
    const buffer_10MB = Buffer.alloc(1024 * 1024 * 6); // 6 MB
    const resp2 = await request(app)
      .post(`/api/document-threads/${messagesThreadId}/${studentId}`)
      .attach('file', buffer_10MB, filename);

    expect(resp2.status).toBe(400);
    expect(resp2.body.success).toBe(false);
  });

  it('should save the uploaded program specific file and store the path in db', async () => {
    const resp = await request(app)
      .post(`/api/document-threads/${messagesThreadId}/${studentId}`)
      .attach('file', Buffer.from('Lorem ipsum'), filename);

    const { status, body } = resp;
    expect(status).toBe(201);
    expect(body.success).toBe(true);

    var updatedStudent = await Student.findById(studentId)
      .populate('applications.programId')
      .lean()
      .exec();
    var application = updatedStudent.applications.find(
      ({ programId }) => programId._id == applicationId
    );

    application.documents.forEach((editoroutput) => {
      if (editoroutput.name.includes(fileCategory)) {
        if (
          editoroutput.name.match(r) !== null &&
          editoroutput.name.match(r)[0] > version_number_max
        ) {
          version_number_max = editoroutput.name.match(r)[0]; // get the max version number
        }
      }
    });

    var version_number = version_number_max;
    var same_file_name = true;
    while (same_file_name) {
      temp_name =
        student.lastname +
        '_' +
        student.firstname +
        '_' +
        application.programId.school +
        '_' +
        application.programId.program_name +
        '_' +
        fileCategory +
        '_v' +
        version_number +
        `${path.extname(filename)}`;
      temp_name = temp_name.replace(/ /g, '_');

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
      db_file_name = temp_name;
      // }
    }
    const doc_idx = application.documents.findIndex(({ name }) =>
      name.includes(db_file_name)
    );

    file_name_inDB = path.basename(application.documents[doc_idx].path);
    expect(file_name_inDB).toBe(temp_name);

    // Test Download:
    const resp2 = await request(app)
      .get(
        `/api/account/files/programspecific/${studentId}/${applicationId}/${whoupdate}/${temp_name}`
      )
      .buffer();

    expect(resp2.status).toBe(200);
    expect(resp2.headers['content-disposition']).toEqual(
      `attachment; filename="${temp_name}"`
    );

    // Mark as final documents
    const resp6 = await request(app).put(
      `/api/account/files/programspecific/${studentId}/${applicationId}/${whoupdate}/${temp_name}`
    );
    expect(resp6.status).toBe(201);
    expect(resp6.body.success).toBe(true);

    // test download: should return 400 with invalid applicationId
    const invalidApplicationId = 'invalidapplicationID';
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
    expect(resp4.status).toBe(200);
    expect(resp4.body.success).toBe(true);

    // Mark program as "GetAdmission"
    const resp7 = await request(app).put(
      `/api/account/program/admission/${studentId}/${applicationId}`
    );
    expect(resp7.status).toBe(201);
    expect(resp7.body.success).toBe(true);

    const resp8 = await request(app).put(
      `/api/account/program/admission/${studentId}/${invalidApplicationId}`
    );
    expect(resp8.status).toBe(400);
    expect(resp8.body.success).toBe(false);

    // Mark program as "Close"
    const resp9 = await request(app).put(
      `/api/account/program/close/${studentId}/${applicationId}`
    );
    expect(resp9.status).toBe(201);
    expect(resp9.body.success).toBe(true);

    const resp10 = await request(app).put(
      `/api/account/program/close/${studentId}/${invalidApplicationId}`
    );
    expect(resp10.status).toBe(400);
    expect(resp10.body.success).toBe(false);

    // Mark program as "Decided"
    const resp11 = await request(app).put(
      `/api/account/program/decided/${studentId}/${applicationId}`
    );
    expect(resp11.status).toBe(201);
    expect(resp11.body.success).toBe(true);

    const resp12 = await request(app).put(
      `/api/account/program/decided/${studentId}/${invalidApplicationId}`
    );
    expect(resp12.status).toBe(400);
    expect(resp12.body.success).toBe(false);
  });
});

// user: Editor
describe('POST /api/account/files/programspecific/upload/:studentId/:applicationId/:fileCategory', () => {
  const { _id: studentId } = student;
  var docName = requiredDocuments[0];
  const filename = 'my-file.pdf'; // will be overwrite to docName
  const fileCategory = 'ML';
  var whoupdate = 'Editor';
  let version_number_max = 0;
  let temp_name;
  let db_file_name;
  var applicationIds;
  var applicationId;
  var file_name_inDB;
  var r = /\d+/; //number pattern
  beforeEach(async () => {
    protect.mockImplementation(async (req, res, next) => {
      req.user = await User.findById(editor._id);
      next();
    });

    const resp = await request(app)
      .post(`/api/students/${studentId}/applications`)
      .send({ program_id_set: [program._id] });

    applicationIds = resp.body.data;
    applicationId = applicationIds[0];
  });

  it.each([
    ['my-file.exe', 400, false],
    ['my-file.pdf', 201, true]
  ])(
    'should return 400 when program specific file type not .pdf .png, .jpg and .jpeg .docx %p %p %p',
    async (File_Name, status, success) => {
      const buffer_1MB_exe = Buffer.alloc(1024 * 1024 * 1); // 1 MB
      const resp2 = await request(app)
        .post(
          `/api/account/files/programspecific/upload/${studentId}/${applicationId}/${fileCategory}`
        )
        .attach('file', buffer_1MB_exe, File_Name);

      expect(resp2.status).toBe(status);
      expect(resp2.body.success).toBe(success);
    }
  );

  it('should return 400 when program specific file size (ML, Essay) over 5 MB', async () => {
    const buffer_6MB = Buffer.alloc(1024 * 1024 * 6); // 6 MB
    const resp2 = await request(app)
      .post(
        `/api/account/files/programspecific/upload/${studentId}/${applicationId}/${fileCategory}`
      )
      .attach('file', buffer_6MB, filename);

    expect(resp2.status).toBe(400);
    expect(resp2.body.success).toBe(false);
  });

  it('should save the uploaded program specific file and store the path in db', async () => {
    const resp = await request(app)
      .post(
        `/api/account/files/programspecific/upload/${studentId}/${applicationId}/${fileCategory}`
      )
      .attach('file', Buffer.from('Lorem ipsum'), filename);

    const { status, body } = resp;
    expect(status).toBe(201);
    expect(body.success).toBe(true);

    // const resp_dup = await request(app)
    //   .post(
    //     `/api/account/files/programspecific/upload/${studentId}/${applicationId}/${fileCategory}`
    //   )
    //   .attach("file", Buffer.from("Lorem ipsum"), filename);
    // expect(resp_dup.status).toBe(201);
    // expect(resp_dup.body.success).toBe(true);

    // // test delete first
    // const resp4 = await request(app).delete(
    //   `/api/account/files/programspecific/${studentId}/${applicationId}/${whoupdate}/${temp_name}`
    // );
    // expect(resp4.status).toBe(200);
    // expect(resp4.body.success).toBe(true);

    var updatedStudent = await Student.findById(studentId)
      .populate('applications.programId')
      .lean()
      .exec();
    var application = updatedStudent.applications.find(
      ({ programId }) => programId._id == applicationId
    );

    application.documents.forEach((editoroutput) => {
      if (editoroutput.name.includes(fileCategory)) {
        if (
          editoroutput.name.match(r) !== null &&
          editoroutput.name.match(r)[0] > version_number_max
        ) {
          version_number_max = editoroutput.name.match(r)[0]; // get the max version number
        }
      }
    });

    let version_number = version_number_max;
    var same_file_name = true;
    while (same_file_name) {
      temp_name =
        student.lastname +
        '_' +
        student.firstname +
        '_' +
        application.programId.school +
        '_' +
        application.programId.program_name +
        '_' +
        fileCategory +
        '_v' +
        version_number +
        `${path.extname(filename)}`;
      temp_name = temp_name.replace(/ /g, '_');

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
      db_file_name = temp_name;
      // }
    }

    const doc_idx = application.documents.findIndex(({ name }) =>
      // name.includes(version_number.toString())
      name.includes(db_file_name)
    );

    file_name_inDB = path.basename(application.documents[doc_idx].path);
    expect(file_name_inDB).toBe(db_file_name);

    // Test Download:
    const resp2 = await request(app)
      .get(
        `/api/account/files/programspecific/${studentId}/${applicationId}/${whoupdate}/${temp_name}`
      )
      .buffer();

    expect(resp2.status).toBe(200);
    expect(resp2.headers['content-disposition']).toEqual(
      `attachment; filename="${temp_name}"`
    );

    // Mark as final documents
    const resp6 = await request(app).put(
      `/api/account/files/programspecific/${studentId}/${applicationId}/${whoupdate}/${temp_name}`
    );
    expect(resp6.status).toBe(201);
    expect(resp6.body.success).toBe(true);

    // test download: should return 400 with invalid applicationId
    const invalidApplicationId = 'invalidapplicationID';
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
    expect(resp4.status).toBe(200);
    expect(resp4.body.success).toBe(true);
  });
});

// user: Student
describe('POST /api/account/files/programspecific/upload/:studentId/:applicationId/:fileCategory', () => {
  const { _id: studentId } = student;
  const { _id: student2Id } = student2;
  var docName = requiredDocuments[0];
  const filename = 'my-file.pdf'; // will be overwrite to docName
  const fileCategory = 'ML';
  let version_number_max = 0;
  var r = /\d+/; //number pattern
  var whoupdate = 'Student';
  let temp_name;
  let db_file_name;
  var applicationIds;
  var applicationId;
  var file_name_inDB;
  beforeEach(async () => {
    protect.mockImplementation(async (req, res, next) => {
      req.user = await User.findById(student._id);
      next();
    });

    const resp = await request(app)
      .post(`/api/students/${studentId}/applications`)
      .send({ program_id_set: [program._id] });

    applicationIds = resp.body.data;
    applicationId = applicationIds[0];
  });

  it.each([
    ['my-file.exe', 400, false],
    ['my-file.pdf', 201, true]
  ])(
    'should return 400 when program specific file type not .pdf .png, .jpg and .jpeg .docx %p %p %p',
    async (File_Name, status, success) => {
      const buffer_1MB_exe = Buffer.alloc(1024 * 1024 * 1); // 1 MB
      const resp2 = await request(app)
        .post(
          `/api/account/files/programspecific/upload/${studentId}/${applicationId}/${fileCategory}`
        )
        .attach('file', buffer_1MB_exe, File_Name);

      expect(resp2.status).toBe(status);
      expect(resp2.body.success).toBe(success);
    }
  );

  it('should return 400 when program specific file size (ML, Essay) over 5 MB', async () => {
    const buffer_6MB = Buffer.alloc(1024 * 1024 * 6); // 6 MB
    const resp2 = await request(app)
      .post(
        `/api/account/files/programspecific/upload/${studentId}/${applicationId}/${fileCategory}`
      )
      .attach('file', buffer_6MB, filename);

    expect(resp2.status).toBe(400);
    expect(resp2.body.success).toBe(false);
  });

  it('should save the uploaded program specific file and store the path in db', async () => {
    const resp = await request(app)
      .post(
        `/api/account/files/programspecific/upload/${studentId}/${applicationId}/${fileCategory}`
      )
      .attach('file', Buffer.from('Lorem ipsum'), filename);

    const { status, body } = resp;
    expect(status).toBe(201);
    expect(body.success).toBe(true);

    // const resp_dup = await request(app)
    //   .post(
    //     `/api/account/files/programspecific/upload/${studentId}/${applicationId}/${fileCategory}`
    //   )
    //   .attach("file", Buffer.from("Lorem ipsum"), filename);

    // expect(resp_dup.status).toBe(201);
    // expect(resp_dup.body.success).toBe(true);

    var updatedStudent = await Student.findById(studentId)
      .populate('applications.programId')
      .lean()
      .exec();
    var application = updatedStudent.applications.find(
      ({ programId }) => programId._id == applicationId
    );

    application.student_inputs.forEach((student_input) => {
      if (student_input.name.includes(fileCategory)) {
        if (
          student_input.name.match(r) !== null &&
          student_input.name.match(r)[0] > version_number_max
        ) {
          version_number_max = student_input.name.match(r)[0]; // get the max version number
        }
      }
    });

    let version_number = version_number_max;
    var same_file_name = true;
    while (same_file_name) {
      temp_name =
        student.lastname +
        '_' +
        student.firstname +
        '_' +
        application.programId.school +
        '_' +
        application.programId.program_name +
        '_' +
        fileCategory +
        '_v' +
        version_number +
        `${path.extname(filename)}`;
      temp_name = temp_name.replace(/ /g, '_');

      // let student_input_doc = application.student_inputs.find(
      //   ({ name }) => name === temp_name
      // );
      // let editor_output_doc = application.student_inputs.find(
      //   ({ name }) => name === temp_name
      // );
      // if (editor_output_doc || student_input_doc) {
      //   version_number++;
      // } else {
      same_file_name = false;
      db_file_name = temp_name;
      // }
    }

    const doc_idx = application.student_inputs.findIndex(({ name }) =>
      // name.includes(version_number.toString())
      name.includes(db_file_name)
    );
    // expect(
    //   updatedStudent.applications[appl_idx].student_inputs[doc_idx].name
    // ).toMatchObject({
    //   // path: expect.not.stringMatching(/^$/),
    //   name: docName,
    //   // status: DocumentStatus.Uploaded,
    // });
    file_name_inDB = path.basename(application.student_inputs[doc_idx].path);
    expect(file_name_inDB).toBe(db_file_name);

    // Test Download:
    const resp2 = await request(app)
      .get(
        `/api/account/files/programspecific/${studentId}/${applicationId}/${whoupdate}/${temp_name}`
      )
      .buffer();
    expect(resp2.status).toBe(200);
    expect(resp2.headers['content-disposition']).toEqual(
      `attachment; filename="${temp_name}"`
    );

    // test download: should return 400 with invalid applicationId
    const invalidApplicationId = 'invalidapplicationID';
    const resp3 = await request(app)
      .get(
        `/api/account/files/programspecific/${studentId}/${invalidApplicationId}/${whoupdate}/${temp_name}`
      )
      .buffer();

    expect(resp3.status).toBe(400);
    expect(resp3.body.success).toBe(false);

    // Mark as final documents (Invalid operation for student)
    const resp6 = await request(app).put(
      `/api/account/files/programspecific/${studentId}/${applicationId}/${whoupdate}/${temp_name}`
    );
    expect(resp6.status).toBe(401);
    expect(resp6.body.success).toBe(false);

    // test delete
    const resp4 = await request(app).delete(
      `/api/account/files/programspecific/${studentId}/${applicationId}/${whoupdate}/${temp_name}`
    );
    expect(resp4.status).toBe(200);
    expect(resp4.body.success).toBe(true);

    // test delete: student can not delete other student's file
    const resp5 = await request(app).delete(
      `/api/account/files/programspecific/${student2Id}/${applicationId}/${whoupdate}/${temp_name}`
    );
    expect(resp5.status).toBe(401);
    expect(resp5.body.success).toBe(false);
  });
});

// uploading edutir general files like CV, RL_1, RL_2, by Editor (Admin, Agent)
describe('POST /api/account/files/general/upload/:studentId/:fileCategory', () => {
  const { _id: studentId } = student;
  var docName = requiredDocuments[0];
  const filename = 'my-file.pdf'; // will be overwrite to docName
  const filename_invalid_ext = 'invalid_extension.exe'; // will be overwrite to docName
  const fileCategory = 'CV';
  var whoupdate = 'Editor';
  var temp_name;
  var file_name_inDB;
  beforeEach(async () => {
    protect.mockImplementation(async (req, res, next) => {
      req.user = await User.findById(editor._id);
      next();
    });
  });

  it.each([
    ['my-file.exe', 400, false],
    ['my-file.pdf', 201, true]
  ])(
    'should return 400 when program specific file type not .pdf .png, .jpg and .jpeg .docx %p %p %p',
    async (File_Name, status, success) => {
      const buffer_1MB_exe = Buffer.alloc(1024 * 1024 * 1); // 1 MB
      const resp2 = await request(app)
        .post(`/api/account/files/general/upload/${studentId}/${fileCategory}`)
        .attach('file', buffer_1MB_exe, File_Name);

      expect(resp2.status).toBe(status);
      expect(resp2.body.success).toBe(success);
    }
  );
  it('should return 400 when editor general file (CV, RL) size over 5 MB', async () => {
    const buffer_6MB = Buffer.alloc(1024 * 1024 * 6); // 6 MB
    const resp2 = await request(app)
      .post(`/api/account/files/general/upload/${studentId}/${fileCategory}`)
      .attach('file', buffer_6MB, filename);

    expect(resp2.status).toBe(400);
    expect(resp2.body.success).toBe(false);
  });

  it('should save the uploaded general CV,RL files and store the path in db', async () => {
    const resp = await request(app)
      .post(`/api/account/files/general/upload/${studentId}/${fileCategory}`)
      .attach('file', Buffer.from('Lorem ipsum'), filename);

    const { status, body } = resp;
    expect(status).toBe(201);
    expect(body.success).toBe(true);

    var updatedStudent = await Student.findById(studentId)
      .populate('applications.programId')
      .lean()
      .exec();
    var editoroutput_idx = updatedStudent.generaldocs.editoroutputs.findIndex(
      ({ name }) => name.includes(fileCategory)
    );

    var version_number = 1;
    var same_file_name = true;
    while (same_file_name) {
      temp_name =
        student.lastname +
        '_' +
        student.firstname +
        '_' +
        fileCategory +
        '_v' +
        version_number +
        `${path.extname(
          updatedStudent.generaldocs.editoroutputs[editoroutput_idx].path
        )}`;
      temp_name = temp_name.replace(/ /g, '_');

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
    expect(resp3.headers['content-disposition']).toEqual(
      `attachment; filename="${temp_name}"`
    );

    var updated2Student = await Student.findById(studentId)
      .populate('applications.programId')
      .lean()
      .exec();
    var editoroutput2_idx = updatedStudent.generaldocs.editoroutputs.findIndex(
      ({ name }) => name.includes(fileCategory)
    );
    expect(
      updated2Student.generaldocs.editoroutputs[editoroutput2_idx].feedback
    ).toBe('My comments');

    // Mark as final documents
    const resp6 = await request(app).put(
      `/api/account/files/general/${studentId}/${whoupdate}/${temp_name}`
    );
    expect(resp6.status).toBe(201);
    expect(resp6.body.success).toBe(true);
    //TODO: check if it is really flagged with final: true

    // test delete
    const resp4 = await request(app).delete(
      `/api/account/files/general/${studentId}/${whoupdate}/${temp_name}`
    );
    expect(resp4.status).toBe(200);
    expect(resp4.body.success).toBe(true);
  });
});

// uploading edutir general files like CV, RL_1, RL_2, by Editor (Student)
describe('POST /api/account/files/general/upload/:studentId/:fileCategory', () => {
  const { _id: studentId } = student;
  const { _id: student2Id } = student2;
  var docName = requiredDocuments[0];
  const filename = 'my-file.pdf'; // will be overwrite to docName
  const filename_invalid_ext = 'invalid_extension.exe'; // will be overwrite to docName
  const fileCategory = 'CV';
  var whoupdate = 'Student';
  var temp_name;
  var file_name_inDB;
  beforeEach(async () => {
    protect.mockImplementation(async (req, res, next) => {
      req.user = await User.findById(student._id);
      next();
    });
  });

  it('should return 400 when program specific file type not .pdf .png, .jpg and .jpeg .docx', async () => {
    const buffer_1MB_exe = Buffer.alloc(1024 * 1024 * 1); // 1 MB
    const resp2 = await request(app)
      .post(`/api/account/files/general/upload/${studentId}/${fileCategory}`)
      .attach('file', buffer_1MB_exe, filename_invalid_ext);

    expect(resp2.status).toBe(400);
    expect(resp2.body.success).toBe(false);
  });

  it('should return 400 when editor general file (CV, RL) size over 5 MB', async () => {
    const buffer_6MB = Buffer.alloc(1024 * 1024 * 6); // 6 MB
    const resp2 = await request(app)
      .post(`/api/account/files/general/upload/${studentId}/${fileCategory}`)
      .attach('file', buffer_6MB, filename);

    expect(resp2.status).toBe(400);
    expect(resp2.body.success).toBe(false);
  });

  it('should save the uploaded general CV,RL files and store the path in db', async () => {
    const resp = await request(app)
      .post(`/api/account/files/general/upload/${studentId}/${fileCategory}`)
      .attach('file', Buffer.from('Lorem ipsum'), filename);

    const { status, body } = resp;
    expect(status).toBe(201);
    expect(body.success).toBe(true);

    var updatedStudent = await Student.findById(studentId)
      .populate('applications.programId')
      .lean()
      .exec();
    var studentinput_idx = updatedStudent.generaldocs.studentinputs.findIndex(
      ({ name }) => name.includes(fileCategory)
    );

    var version_number = 1;
    var same_file_name = true;
    while (same_file_name) {
      // console.log(application.programId);
      temp_name =
        student.lastname +
        '_' +
        student.firstname +
        '_' +
        fileCategory +
        '_v' +
        version_number +
        `${path.extname(
          updatedStudent.generaldocs.studentinputs[studentinput_idx].path
        )}`;
      temp_name = temp_name.replace(/ /g, '_');

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
      updatedStudent.generaldocs.studentinputs[studentinput_idx].path
    );
    expect(file_name_inDB).toBe(temp_name);

    var updated2Student = await Student.findById(studentId)
      .populate('applications.programId')
      .lean()
      .exec();
    var studentinput2_idx = updatedStudent.generaldocs.studentinputs.findIndex(
      ({ name }) => name.includes(fileCategory)
    );
    expect(
      updated2Student.generaldocs.studentinputs[studentinput2_idx].feedback
    ).toBe('My comments2');

    // Test Download:

    const resp3 = await request(app)
      .get(`/api/account/files/general/${studentId}/${whoupdate}/${temp_name}`)
      .buffer();

    expect(resp3.status).toBe(200);
    expect(resp3.headers['content-disposition']).toEqual(
      `attachment; filename="${temp_name}"`
    );

    // Mark as final documents (Invalid operation for student)
    const resp6 = await request(app).put(
      `/api/account/files/general/${studentId}/${whoupdate}/${temp_name}`
    );
    expect(resp6.status).toBe(401);
    expect(resp6.body.success).toBe(false);

    // test delete
    const resp4 = await request(app).delete(
      `/api/account/files/general/${studentId}/${whoupdate}/${temp_name}`
    );
    expect(resp4.status).toBe(200);
    expect(resp4.body.success).toBe(true);

    // test delete: student can not delete other student's file
    const resp5 = await request(app).delete(
      `/api/account/files/general/${student2Id}/${whoupdate}/${temp_name}`
    );
    expect(resp5.status).toBe(401);
    expect(resp5.body.success).toBe(false);
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

describe('POST /api/account/profile', () => {
  it('should update personal data', async () => {
    const resp = await request(app)
      .post(`/api/account/profile`)
      .send({
        personaldata: { firstname: 'New_FirstName', lastname: 'New_LastName' }
      });
    const { status, body } = resp;
    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toMatchObject({
      firstname: 'New_FirstName',
      lastname: 'New_LastName'
    });
  });
});

describe('POST /api/account/survey/language', () => {
  const language_obj = {
    language: {
      english_certificate: 'TOEFL',
      english_score: '95',
      english_test_date: '',
      german_certificate: '',
      german_score: '',
      german_test_date: ''
    }
  };
  it('should update language status', async () => {
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

describe('POST /api/account/survey/university', () => {
  const university_obj = {
    university: {
      attended_university: 'National Chiao Tung University',
      attended_university_program: 'Electronics Engineering',
      isGraduated: 'No'
    }
  };
  it('should update university (academic background) ', async () => {
    const resp = await request(app)
      .post(`/api/account/survey/university`)
      .send(university_obj);
    const { status, body } = resp;
    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.attended_university).toBe(
      university_obj.university.attended_university
    );
    expect(body.data.attended_university_program).toBe(
      university_obj.university.attended_university_program
    );
    expect(body.data.isGraduated).toBe(university_obj.university.isGraduated);

    const resp2 = await request(app).get(`/api/account/survey`);
    const academic_backgroud = resp2.body.data;
    expect(academic_backgroud.university.attended_university).toBe(
      university_obj.university.attended_university
    );
    expect(academic_backgroud.university.attended_university_program).toBe(
      university_obj.university.attended_university_program
    );
    expect(academic_backgroud.university.isGraduated).toBe(
      university_obj.university.isGraduated
    );
  });
});
