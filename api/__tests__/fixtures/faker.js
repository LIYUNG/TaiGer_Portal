const { ObjectId } = require('mongoose').Types;
const { faker } = require('@faker-js/faker');

const generateUser = (role) => ({
  _id: new ObjectId().toHexString(),
  firstname: faker.person.firstName(),
  lastname: faker.person.lastName(),
  email: faker.internet.email().toLowerCase(),
  password: '$2a$10$Xv45poDOdKSjmxPp7FSEfOYNfSDfLZyOEjt7z.WO7sOBKNyS25k1S', // somePassword
  generaldocs_threads: [],
  applications: [],
  isAccountActivated: true,
  archiv: false,
  birthday: '',
  role
});

const generateAgent = (studentIds) => ({
  ...generateUser(),
  students: studentIds
});

const generateEditor = (studentIds) => ({
  ...generateUser(),
  students: studentIds
});

const generateStudent = (agentIds, editorIds) => ({
  ...generateUser(),
  agents: agentIds,
  editors: editorIds,
  personaldata: {},
  academic_background: { language: {}, university: {} }
});

const generateProgram = (requiredDocuments, optionalDocuments) => ({
  _id: new ObjectId().toHexString(),
  school: faker.company.name(),
  program_name: faker.lorem.word(10),
  degree: faker.lorem.word(20),
  website: faker.internet.url(),
  semester: 'summer',
  application_start: faker.date.recent(),
  application_deadline: faker.date.future(),
  isArchiv: false,
  ml_required: 'yes',
  requiredDocuments,
  optionalDocuments
});

const generateCourse = (student_id) => ({
  _id: new ObjectId().toHexString(),
  student_id,
  name: faker.lorem.word(10),
  table_data_string_locked: false,
  table_data_string:
    '[{"course_chinese":"(Example)微積分一","course_english":"calculus","credits":"2","grades":"73"}]',
  table_data_string_taiger_guided:
    '[{"course_chinese":"(Example)物理二","course_english":"physics ii","credits":"2","grades":"73"}]'
});

const generateCommunicationMessage = (props) => ({
  _id: new ObjectId().toHexString(),
  student_id: props.studnet_id,
  user_id: props.user_id,
  message: faker.lorem.words(20),
  readBy: []
});

const generateComlaintTicket = () => ({
  _id: new ObjectId().toHexString(),
  requester_id: new ObjectId().toHexString(),
  title: faker.lorem.words(20),
  messages: []
});

module.exports = {
  generateUser,
  generateAgent,
  generateEditor,
  generateStudent,
  generateProgram,
  generateCourse,
  generateCommunicationMessage,
  generateComlaintTicket
};
