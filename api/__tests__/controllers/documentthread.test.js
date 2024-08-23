const fs = require('fs');
const path = require('path');
const request = require('supertest');

const { UPLOAD_PATH } = require('../../config');
const { connect, closeDatabase, clearDatabase } = require('../fixtures/db');
const { app } = require('../../app');
const { Role } = require('../../constants');
const { User, UserSchema } = require('../../models/User');
const { programSchema } = require('../../models/Program');
const { generateUser } = require('../fixtures/faker');
const { generateProgram } = require('../fixtures/faker');
const { protect } = require('../../middlewares/auth');
const {
  permission_canAccessStudentDatabase_filter
} = require('../../middlewares/permission-filter');
const {
  InnerTaigerMultitenantFilter
} = require('../../middlewares/InnerTaigerMultitenantFilter');
const { connectToDatabase } = require('../../middlewares/tenantMiddleware');
const { TENANT_ID } = require('../fixtures/constants');
const {
  decryptCookieMiddleware
} = require('../../middlewares/decryptCookieMiddleware');

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

jest.mock('../../middlewares/auth', () => {
  const passthrough = async (req, res, next) => next();

  return Object.assign({}, jest.requireActual('../../middlewares/auth'), {
    protect: jest.fn().mockImplementation(passthrough),
    permit: jest.fn().mockImplementation((...roles) => passthrough)
  });
});

jest.mock('../../middlewares/permission-filter', () => {
  const passthrough = async (req, res, next) => next();

  return Object.assign(
    {},
    jest.requireActual('../../middlewares/permission-filter'),
    {
      permission_canAccessStudentDatabase_filter: jest
        .fn()
        .mockImplementation(passthrough)
    }
  );
});

jest.mock('../../middlewares/InnerTaigerMultitenantFilter', () => {
  const passthrough = async (req, res, next) => next();

  return Object.assign(
    {},
    jest.requireActual('../../middlewares/permission-filter'),
    {
      InnerTaigerMultitenantFilter: jest.fn().mockImplementation(passthrough)
    }
  );
});

jest.mock('../../aws/index', () => {
  const mockS3Instance = {
    upload: jest.fn().mockReturnThis(),
    promise: jest.fn().mockResolvedValue({
      Location: 'https://mock-s3-url.com/mock-file.jpg'
    }),
    getObject: jest.fn().mockReturnThis(),
    createReadStream: jest.fn(() => ({
      on: jest.fn((event, callback) => {
        if (event === 'data') {
          callback(Buffer.from('dummy file content'));
        }
        if (event === 'end') {
          callback();
        }
        if (event === 'error') {
          callback(new Error('S3 download error'));
        }
      })
    }))
  };
  return Object.assign({}, jest.requireActual('../../aws/index'), {
    s3: mockS3Instance
  });
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

const requiredDocuments = ['transcript', 'resume'];
const optionalDocuments = ['certificate', 'visa'];
const program = generateProgram(requiredDocuments, optionalDocuments);

let dbUri;

beforeAll(async () => {
  dbUri = await connect();
});
afterAll(async () => await clearDatabase());
beforeEach(async () => {
  const db = connectToDatabase(TENANT_ID, dbUri);

  const UserModel = db.model('User', UserSchema);
  const ProgramModel = db.model('Program', programSchema);

  await UserModel.deleteMany();
  await UserModel.insertMany(users);
  await ProgramModel.deleteMany();
  await ProgramModel.create(program);
});

afterEach(() => {
  fs.rmSync(UPLOAD_PATH, { recursive: true, force: true });
});

describe('POST /api/document-threads/:category', () => {
  const thread = {
    student_id: '1234',
    file_type: 'ML',
    program_id: null,
    updatedAt: new Date()
  };
  const new_thread = {
    student_id: '1234',
    file_type: 'ML',
    program_id: null,
    updatedAt: new Date()
  };
  var article_id;

  beforeEach(async () => {
    protect.mockImplementation(async (req, res, next) => {
      req.user = await User.findById(student._id);
      next();
    });
  });

  it('todo', async () => {
    expect(200).toBe(200);
  });
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
  let returndoc_modification_thread;
  var messagesThreadId;

  permission_canAccessStudentDatabase_filter.mockImplementation(
    async (req, res, next) => {
      next();
    }
  );
  InnerTaigerMultitenantFilter.mockImplementation(async (req, res, next) => {
    next();
  });
  protect.mockImplementation((req, res, next) => {
    req.user = agent;
    next();
  });

  expect(200).toBe(200);

  // TODO: need to simplify mock data.
  // beforeEach(async () => {
  //   const resp = await request(app)
  //     .post(`/api/students/${studentId}/applications`)
  //     .set('tenantId', TENANT_ID)
  //     .send({ program_id_set: [programId] });

  //   const resp22 = await request(app)
  //     .post(
  //       `/api/document-threads/init/application/${studentId}/${programId}/${document_category}`
  //     )
  //     .set('tenantId', TENANT_ID);
  //   applicationIds = resp.body.data;
  //   returndoc_modification_thread = resp22.body.data;
  //   messagesThreadId = returndoc_modification_thread?._id.toString();
  // });

  // it.each([
  //   ['my-file.exe', 400, false],
  //   ['my-file.pdf', 201, true]
  // ])(
  //   'should return 400 when program specific file type not .pdf .png, .jpg and .jpeg .docx %p %p %p',
  //   async (File_Name, status, success) => {
  //     const buffer_1MB_exe = Buffer.alloc(1024 * 1024 * 1); // 1 MB
  //     const resp2 = await request(app)
  //       .post(`/api/document-threads/${messagesThreadId}/${studentId}`)
  //       .set('tenantId', TENANT_ID)
  //       .attach('file', buffer_1MB_exe, File_Name);

  //     expect(resp2.status).toBe(status);
  //     expect(resp2.body.success).toBe(success);
  //   }
  // );
  // // TODO: mock S3 isntead of
  // it('should return 400 when program specific file type not .pdf .png, .jpg and .jpeg .docx', async () => {
  //   const buffer_1MB_exe = Buffer.alloc(1024 * 1024 * 1); // 1 MB
  //   const resp2 = await request(app)
  //     .post(`/api/document-threads/${messagesThreadId}/${studentId}`)
  //     .set('tenantId', TENANT_ID)
  //     .attach('file', buffer_1MB_exe, 'my-file.exe');

  //   expect(resp2.status).toBe(400);
  //   expect(resp2.body.success).toBe(false);
  // });

  // it('should return 200 when program specific file type .pdf .png, .jpg and .jpeg .docx', async () => {
  //   const buffer_1MB_pdf = Buffer.alloc(1024 * 1024 * 1); // 1 MB
  //   const resp2 = await request(app)
  //     .post(`/api/document-threads/${messagesThreadId}/${studentId}`)
  //     .set('tenantId', TENANT_ID)
  //     .attach('file', buffer_1MB_pdf, 'my-file.pdf');

  //   expect(resp2.status).toBe(200);
  //   expect(resp2.body.success).toBe(true);
  // });

  // it('should return 400 when program specific file size (ML, Essay) over 5 MB', async () => {
  //   const buffer_10MB = Buffer.alloc(1024 * 1024 * 6); // 6 MB
  //   const resp2 = await request(app)
  //     .post(`/api/document-threads/${messagesThreadId}/${studentId}`)
  //     .set('tenantId', TENANT_ID)
  //     .attach('file', buffer_10MB, filename);

  //   expect(resp2.status).toBe(400);
  //   expect(resp2.body.success).toBe(false);
  // });
});
