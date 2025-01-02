const { Role } = require('@taiger-common/core');

const { Student } = require('../../models/User');
const {
  AssignOutsourcerFilter
} = require('../../middlewares/AssignOutsourcerFilter');
const { Documentthread } = require('../../models/Documentthread');
const { getPermission } = require('../../utils/queryFunctions');

// Mock dependencies
jest.mock('../../utils/queryFunctions');
jest.mock('../../models/Documentthread');
jest.mock('../../models/User');

// Helper function to create a mock request
const createMockRequest = (user, messagesThreadId) => ({
  user,
  params: { messagesThreadId }
});

// Helper function to create a mock response
const createMockResponse = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis()
});

// Mock next function
const next = jest.fn();

describe('AssignOutsourcerFilter middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call next if user is Editor and has necessary permissions', async () => {
    const user = { role: Role.Editor, _id: 'editor_id' };
    const req = createMockRequest(user, 'thread_id');
    const res = createMockResponse();
    const permissions = { canAssignEditors: true };
    const document_thread = {
      student_id: { _id: 'student_id' },
      outsourced_user_id: ['editor_id'],
      file_type: 'Essay'
    };
    const student = { agents: [], editors: ['editor_id'] };

    Documentthread.findById.mockResolvedValue(document_thread);
    Student.findById.mockResolvedValue(student);
    getPermission.mockResolvedValue(permissions);

    await AssignOutsourcerFilter(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should call next if user is Agent and has necessary permissions', async () => {
    const user = { role: Role.Agent, _id: 'agent_id' };
    const req = createMockRequest(user, 'thread_id');
    const res = createMockResponse();
    const permissions = { canAssignAgents: true };
    const document_thread = {
      student_id: { _id: 'student_id', agents: ['agent_id'] },
      outsourced_user_id: [],
      file_type: 'Other'
    };
    const student = { agents: ['agent_id'], editors: [] };

    Documentthread.findById.mockResolvedValue(document_thread);
    Student.findById.mockResolvedValue(student);
    getPermission.mockResolvedValue(permissions);

    await AssignOutsourcerFilter(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should call next if user role is neither Editor nor Agent', async () => {
    const user = { role: Role.Admin };
    const req = createMockRequest(user, 'thread_id');
    const res = createMockResponse();

    await AssignOutsourcerFilter(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  // More test cases can be added to cover other scenarios
});
