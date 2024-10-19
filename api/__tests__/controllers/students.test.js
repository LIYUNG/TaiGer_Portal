const fs = require('fs');
const path = require('path');
const request = require('supertest');

const { UPLOAD_PATH } = require('../../config');
const { connect, closeDatabase, clearDatabase } = require('../fixtures/db');
const { app } = require('../../app');
const { Role } = require('../../constants');
const { Student, UserSchema } = require('../../models/User');
const { DocumentStatus } = require('../../constants');
const { generateUser } = require('../fixtures/faker');
const { protect, permit } = require('../../middlewares/auth');
const {
  InnerTaigerMultitenantFilter
} = require('../../middlewares/InnerTaigerMultitenantFilter');
const {
  permission_canAccessStudentDatabase_filter
} = require('../../middlewares/permission-filter');
const { generateProgram } = require('../fixtures/faker');
const { programSchema } = require('../../models/Program');
const { TENANT_ID } = require('../fixtures/constants');
const { connectToDatabase } = require('../../middlewares/tenantMiddleware');
const {
  decryptCookieMiddleware
} = require('../../middlewares/decryptCookieMiddleware');
const { documentThreadsSchema } = require('../../models/Documentthread');

jest.mock('../../middlewares/auth', () => {
  const passthrough = async (req, res, next) => next();

  return Object.assign({}, jest.requireActual('../../middlewares/auth'), {
    protect: jest.fn().mockImplementation(passthrough),
    permit: jest.fn().mockImplementation((...roles) => passthrough)
  });
});

jest.mock('../../middlewares/InnerTaigerMultitenantFilter', () => {
  const passthrough = async (req, res, next) => next();

  return Object.assign(
    {},
    jest.requireActual('../../middlewares/InnerTaigerMultitenantFilter'),
    {
      InnerTaigerMultitenantFilter: jest.fn().mockImplementation(passthrough)
    }
  );
});

jest.mock('../../middlewares/tenantMiddleware', () => {
  const passthrough = async (req, res, next) => {
    req.tenantId = 'test';
    next();
  };

  return {
    ...jest.requireActual('../../middlewares/tenantMiddleware'),
    checkTenantDBMiddleware: jest.fn().mockImplementation(passthrough)
  };
});

jest.mock('../../middlewares/decryptCookieMiddleware', () => {
  const passthrough = async (req, res, next) => next();

  return {
    ...jest.requireActual('../../middlewares/decryptCookieMiddleware'),
    decryptCookieMiddleware: jest.fn().mockImplementation(passthrough)
  };
});

jest.mock('../../middlewares/permission-filter', () => {
  const passthrough = async (req, res, next) => next();

  return Object.assign(
    {},
    jest.requireActual('../../middlewares/permission-filter'),
    {
      permission_canAccessStudentDatabase_filter: jest
        .fn()
        .mockImplementation(passthrough),
      permission_canAssignAgent_filter: jest
        .fn()
        .mockImplementation(passthrough),
      permission_canAssignEditor_filter: jest
        .fn()
        .mockImplementation(passthrough)
    }
  );
});

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
let dbUri;

const program1 = generateProgram();
const program2 = generateProgram();
const program3 = generateProgram();
const programs = [program1, program2, program3];

const requiredDocuments = ['transcript', 'resume'];
const optionalDocuments = ['certificate', 'visa'];

beforeAll(async () => {
  dbUri = await connect();
});
afterAll(async () => {
  await clearDatabase();
});

beforeEach(async () => {
  const db = connectToDatabase(TENANT_ID, dbUri);

  const UserModel = db.model('User', UserSchema);
  const DocumentthreadModel = db.model('Documentthread', documentThreadsSchema);
  const ProgramModel = db.model('Program', programSchema);

  await UserModel.deleteMany();
  await DocumentthreadModel.deleteMany();
  await UserModel.insertMany(users);
  await ProgramModel.deleteMany();
  await ProgramModel.insertMany(programs);
});

afterEach(() => {
  fs.rmSync(UPLOAD_PATH, { recursive: true, force: true });
});

describe('POST /api/students/:id/agents', () => {
  protect.mockImplementation(async (req, res, next) => {
    req.user = admin;
    next();
  });

  it('should assign agent(s) to student', async () => {
    const { _id: studentId } = student;

    const agents_obj = {};
    agents.forEach((ag) => {
      agents_obj[ag._id] = true;
    });

    const resp = await request(app)
      .post(`/api/students/${studentId}/agents`)
      .set('tenantId', TENANT_ID)
      .send(agents_obj);

    expect(resp.status).toBe(200);

    var agents_arr = [];
    agents.forEach((ag) => {
      if ((agents_obj[ag._id] = true)) {
        agents_arr.push(ag._id);
      }
    });

    const updatedStudent = await Student.findById(studentId).lean();
    expect(updatedStudent.agents.map(String)).toEqual(agents_arr);
  });
});

describe('POST /api/students/:id/editors', () => {
  protect.mockImplementation(async (req, res, next) => {
    req.user = admin;
    next();
  });
  it('should assign editors to student', async () => {
    const { _id: studentId } = student;
    const { _id: editorId } = editors[0];

    const editors_obj = {};
    editors.forEach((editor) => {
      editors_obj[editor._id] = true;
    });

    const resp = await request(app)
      .post(`/api/students/${studentId}/editors`)
      .set('tenantId', TENANT_ID)
      .send(editors_obj);

    expect(resp.status).toBe(200);

    var editors_arr = [];
    editors.forEach((editor) => {
      if ((editors_obj[editor._id] = true)) {
        editors_arr.push(editor._id);
      }
    });

    const updatedStudent = await Student.findById(studentId).lean();
    expect(updatedStudent.editors.map(String)).toEqual(editors_arr);
    // TODO: verify editors data
    // const updatedEditor = await Editor.findById(editorId).lean();
    // expect(updatedEditor.students.map(String)).toEqual([studentId]);
  });
});

// Agent should create applications (programs) to student
describe('POST /api/students/:studentId/applications', () => {
  protect.mockImplementation(async (req, res, next) => {
    req.user = agent;
    next();
  });
  permission_canAccessStudentDatabase_filter.mockImplementation(
    async (req, res, next) => {
      next();
    }
  );
  InnerTaigerMultitenantFilter.mockImplementation(async (req, res, next) => {
    next();
  });

  it('should create an application for student', async () => {
    const { _id: studentId } = student;
    let programs_arr = [];
    programs.forEach((pro) => {
      programs_arr.push(pro._id.toString());
    });
    const resp = await request(app)
      .post(`/api/students/${studentId}/applications`)
      .set('tenantId', TENANT_ID)
      .send({ program_id_set: programs_arr });

    const {
      status,
      body: { success, data }
    } = resp;

    expect(status).toBe(201);
    expect(success).toBe(true);
    expect(data).toMatchObject(programs_arr);
    // expect(data).toMatchObject({
    // _id: expect.any(String),
    // program_id_set: programs_arr,
    // documents: expect.toBeArrayOfSize(
    // requiredDocuments.length + optionalDocuments.length
    // ),
    // });
  });
});

describe('DELETE /api/students/:studentId/applications/:applicationId', () => {
  permission_canAccessStudentDatabase_filter.mockImplementation(
    async (req, res, next) => {
      next();
    }
  );
  InnerTaigerMultitenantFilter.mockImplementation(async (req, res, next) => {
    next();
  });

  protect.mockImplementation(async (req, res, next) => {
    req.user = agent;
    next();
  });
  it('should delete an application from student', async () => {
    const { _id: studentId } = student;

    const resp = await request(app)
      .post(`/api/students/${studentId}/applications`)
      .set('tenantId', TENANT_ID)
      .send({ program_id_set: [program1._id?.toString()] });

    expect(resp.status).toBe(201);

    const resp2 = await request(app)
      .delete(
        `/api/students/${studentId}/applications/${program1._id?.toString()}`
      )
      .set('tenantId', TENANT_ID);

    expect(resp2.status).toBe(200);
    const resp2_std = await request(app)
      .get(`/api/students/doc-links/${studentId}`)
      .set('tenantId', TENANT_ID);
    expect(resp2_std.body.data.applications).toHaveLength(0);
  });

  it('deleting an application should fail if one of the threads is none-empty', async () => {
    const { _id: studentId } = student;

    const resp = await request(app)
      .post(`/api/students/${studentId}/applications`)
      .set('tenantId', TENANT_ID)
      .send({ program_id_set: [program1._id?.toString()] });

    expect(resp.status).toBe(201);

    const resp_std = await request(app)
      .get(`/api/students/doc-links/${studentId}`)
      .set('tenantId', TENANT_ID);

    expect(resp_std.status).toBe(200);
    const newStudentData = resp_std.body.data;

    const newApplication = newStudentData.applications.find(
      (appl) => appl.programId._id?.toString() === program1._id?.toString()
    );
    const thread = newApplication.doc_modification_thread.find(
      (thr) => thr.doc_thread_id.file_type === 'ML'
    );
    expect(thread.doc_thread_id.file_type).toBe('ML');
    const messagesThreadId = thread.doc_thread_id._id?.toString();

    const resp2 = await request(app)
      .post(`/api/document-threads/${messagesThreadId}/${studentId}`)
      .set('tenantId', TENANT_ID)
      .field('message', '{}');
    expect(resp2.status).toBe(200);

    const resp3 = await request(app)
      .delete(
        `/api/students/${studentId}/applications/${program1._id?.toString()}`
      )
      .set('tenantId', TENANT_ID);

    expect(resp3.status).toBe(409);
    const resp3_std = await request(app)
      .get(`/api/students/doc-links/${studentId}`)
      .set('tenantId', TENANT_ID);
    expect(resp3_std.body.data.applications).toHaveLength(1);
  });
});

// Student uploads profile files
// user: Student
describe('POST /api/students/:studentId/files/:category', () => {
  const { _id: studentId } = student;
  const { _id: student2Id } = student2;
  const filename_invalid_ext = 'invalid_extension.exe'; // will be overwrite to docName
  const docName = requiredDocuments[0];
  const filename = 'my-file.pdf'; // will be overwrite to docName
  const category = 'Bachelor_Transcript';

  var temp_name;

  protect.mockImplementation(async (req, res, next) => {
    req.user = student;
    next();
  });

  it('should return 415 when profile file type not .pdf .png, .jpg and .jpeg .docx', async () => {
    const buffer_2MB_exe = Buffer.alloc(1024 * 1024 * 2); // 2 MB
    const resp2 = await request(app)
      .post(`/api/students/${studentId}/files/${category}`)
      .set('tenantId', TENANT_ID)
      .attach('file', buffer_2MB_exe, filename_invalid_ext);

    expect(resp2.status).toBe(415);
    expect(resp2.body.success).toBe(false);
  });

  it('should return 413 when profile size over 5 MB', async () => {
    const buffer_10MB = Buffer.alloc(1024 * 1024 * 6); // 6 MB
    const resp2 = await request(app)
      .post(`/api/students/${studentId}/files/${category}`)
      .set('tenantId', TENANT_ID)
      .attach('file', buffer_10MB, filename);

    expect(resp2.status).toBe(413);
    expect(resp2.body.success).toBe(false);
  });

  it('should save the uploaded profile file and store the path in db', async () => {
    const resp = await request(app)
      .post(`/api/students/${studentId}/files/${category}`)
      .set('tenantId', TENANT_ID)
      .attach('file', Buffer.from('Lorem ipsum'), filename);

    const { status, body } = resp;
    expect(status).toBe(201);
    expect(body.success).toBe(true);

    const updatedStudent = body.data;
    const profile_file_idx = updatedStudent.profile.findIndex(({ name }) =>
      name.includes(category)
    );
    temp_name = `${student.lastname}_${
      student.firstname
    }_${category}${path.extname(
      updatedStudent.profile[profile_file_idx].path
    )}`;
    // expect(
    //   updatedStudent.applications[appl_idx].documents[doc_idx].name
    // ).toMatchObject({
    //   // path: expect.not.stringMatching(/^$/),
    //   name: docName,
    //   // status: DocumentStatus.Uploaded,
    // });
    const file_name_inDB = path.basename(
      updatedStudent.profile[profile_file_idx].path
    );

    expect(updatedStudent.profile[profile_file_idx].name).toBe(category);
    expect(file_name_inDB).toBe(temp_name);

    // Test Download:
    const resp2 = await request(app)
      .get(`/api/students/${studentId}/files/${category}`)
      .set('tenantId', TENANT_ID)
      .buffer();

    expect(resp2.status).toBe(200);
    expect(resp2.headers['content-disposition']).toEqual(
      `attachment; filename="${temp_name}"`
    );

    // TODO: test download: should not download other students's stuff!
    // const invalidApplicationId = "invalidapplicationID";
    // const resp3 = await request(app)
    //   .get(`/api/students/${studentId}/files/${category}`)
    //   .buffer();

    // expect(resp3).toBe(400);
    // expect(resp3.body.success).toBe(false);

    // test delete
    const resp4 = await request(app)
      .delete(`/api/students/${studentId}/files/${category}`)
      .set('tenantId', TENANT_ID);
    expect(resp4.status).toBe(200);
    expect(resp4.body.success).toBe(true);

    // TODO test delete: should not delete other students file
    const resp5 = await request(app)
      .delete(`/api/students/${student2Id}/files/${category}`)
      .set('tenantId', TENANT_ID);
    expect(resp5.status).toBe(403);
    expect(resp5.body.success).toBe(false);
  });
});

// user: Agent
describe('POST /api/students/:studentId/files/:category', () => {
  const { _id: studentId } = student;
  const filename = 'my-file.pdf'; // will be overwrite to docName
  const category = 'Bachelor_Transcript';

  let temp_name;

  permit.mockImplementation(async (req, res, next) => {
    req.user = agent;
    next();
  });
  permission_canAccessStudentDatabase_filter.mockImplementation(
    async (req, res, next) => {
      next();
    }
  );
  InnerTaigerMultitenantFilter.mockImplementation(async (req, res, next) => {
    next();
  });

  it.each([
    ['my-file.exe', 415, false],
    ['my-file.pdf', 201, true]
  ])(
    'should return 415 when profile file type not .pdf .png, .jpg and .jpeg .docx',
    async (File_Name, status, success) => {
      const buffer_1MB_exe = Buffer.alloc(1024 * 1024 * 1); // 1 MB
      const resp2 = await request(app)
        .post(`/api/students/${studentId}/files/${category}`)
        .set('tenantId', TENANT_ID)
        .attach('file', buffer_1MB_exe, File_Name);

      expect(resp2.status).toBe(status);
      expect(resp2.body.success).toBe(success);
    }
  );

  it('should return 413 when profile size over 5 MB', async () => {
    const buffer_10MB = Buffer.alloc(1024 * 1024 * 6); // 6 MB
    const resp2 = await request(app)
      .post(`/api/students/${studentId}/files/${category}`)
      .set('tenantId', TENANT_ID)
      .attach('file', buffer_10MB, filename);

    expect(resp2.status).toBe(413);
    expect(resp2.body.success).toBe(false);
  });

  it('should save the uploaded profile file and store the path in db', async () => {
    const resp = await request(app)
      .post(`/api/students/${studentId}/files/${category}`)
      .set('tenantId', TENANT_ID)
      .attach('file', Buffer.from('Lorem ipsum'), filename);

    const { status, body } = resp;
    expect(status).toBe(201);
    expect(body.success).toBe(true);

    const updatedStudent = body.data;
    const profile_file_idx = updatedStudent.profile.findIndex(({ name }) =>
      name.includes(category)
    );
    temp_name = `${student.lastname}_${
      student.firstname
    }_${category}${path.extname(
      updatedStudent.profile[profile_file_idx].path
    )}`;
    // expect(
    //   updatedStudent.applications[appl_idx].documents[doc_idx].name
    // ).toMatchObject({
    //   // path: expect.not.stringMatching(/^$/),
    //   name: docName,
    //   // status: DocumentStatus.Uploaded,
    // });
    const file_name_inDB = path.basename(
      updatedStudent.profile[profile_file_idx].path
    );

    expect(updatedStudent.profile[profile_file_idx].name).toBe(category);
    expect(file_name_inDB).toBe(temp_name);

    // Test Download:
    const resp2 = await request(app)
      .get(`/api/students/${studentId}/files/${category}`)
      .set('tenantId', TENANT_ID)
      .buffer();

    expect(resp2.status).toBe(200);
    expect(resp2.headers['content-disposition']).toEqual(
      `attachment; filename="${temp_name}"`
    );

    // TODO: test download: should not download other students's stuff!
    // const invalidApplicationId = "invalidapplicationID";
    // const resp3 = await request(app)
    //   .get(`/api/students/${studentId}/files/${category}`)
    //   .buffer();

    // expect(resp3).toBe(400);
    // expect(resp3.body.success).toBe(false);

    // test update profile status
    const feedback_str = 'too blurred';
    const resp5 = await request(app)
      .post(`/api/students/${studentId}/${category}/status`)
      .set('tenantId', TENANT_ID)
      .send({ status: 'rejected', feedback: feedback_str });
    expect(resp5.status).toBe(201);
    var updatedStudent2 = resp5.body.data;
    const updated_doc_idx = updatedStudent2.profile.findIndex(({ name }) =>
      name.includes(category)
    );
    const updated_doc = updatedStudent2.profile[updated_doc_idx];
    expect(resp5.body.success).toBe(true);
    expect(updated_doc.feedback).toBe(feedback_str);

    // test delete
    const resp4 = await request(app)
      .delete(`/api/students/${studentId}/files/${category}`)
      .set('tenantId', TENANT_ID);
    expect(resp4.status).toBe(200);
    expect(resp4.body.success).toBe(true);
  });
});

// //TODO: token-specific API!!!
// describe("GET /api/students", () => {
//   it("should return role-specific students", async () => {
//     const resp = await request(app).get("/api/students").set('tenantId', TENANT_ID);
//     const { success, data } = resp.body;

//     const studentIds = students.map(({ _id }) => _id).sort();
//     // const receivedIds = data.map(({ _id }) => _id).sort();

//     expect(resp.status).toBe(200);
//     expect(success).toBe(true);
//     // expect(receivedIds).toEqual(studentIds);
//   });
// });

// TODO: token-specific API!!!
// describe("GET /api/students/archiv", () => {
//   it("should return all archiv students", async () => {
//     const resp = await request(app).get("/api/students/archiv");
//     const { success, data } = resp.body;

//     const studentIds = students.map(({ _id }) => _id).sort();
//     const receivedIds = data.map(({ _id }) => _id).sort();

//     expect(resp.status).toBe(200);
//     expect(success).toBe(true);
//     expect(receivedIds).toEqual(studentIds);
//   });
// });
