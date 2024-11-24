const { Role } = require('../constants');

const { isArchiv } = require('../constants');
const {
  sendNewApplicationMessageInThreadEmail,
  sendAssignEditorReminderEmail,
  sendNewGeneraldocMessageInThreadEmail
} = require('../services/email');
const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');

const addMessageInThread = asyncHandler(
  async (req, message, threadId, userId) => {
    const thread = await req.db.model('Documentthread').findById(threadId);
    if (!thread) {
      throw new ErrorResponse(403, 'Invalid message thread id');
    }
    const msg = JSON.stringify({
      blocks: [
        {
          data: { text: message },
          type: 'paragraph'
        }
      ]
    });
    const newMessage = {
      user_id: userId,
      message: msg,
      createdAt: new Date()
    };
    thread.messages.push(newMessage);
    thread.updatedAt = new Date();
    await thread.save();
  }
);

const informStaff = asyncHandler(
  async (user, staff, student, fileType, thread, message) => {
    await sendNewApplicationMessageInThreadEmail(
      {
        firstname: staff.firstname,
        lastname: staff.lastname,
        address: staff.email
      },
      {
        writer_firstname: user.firstname,
        writer_lastname: user.lastname,
        student_firstname: student.firstname,
        student_lastname: student.lastname,
        uploaded_documentname: fileType,
        school: thread.program_id.school,
        program_name: thread.program_id.program_name,
        thread_id: thread._id.toString(),
        uploaded_updatedAt: new Date(),
        message
      }
    );
  }
);

const informNoEditor = asyncHandler(async (req, student) => {
  const agents = student?.agents;
  await req.db
    .model('Student')
    .findByIdAndUpdate(student._id, { needEditor: true }, {});

  // inform active-agent
  for (const agent of agents) {
    if (isArchiv(agent)) {
      continue;
    }
    await sendAssignEditorReminderEmail(
      {
        firstname: agent.firstname,
        lastname: agent.lastname,
        address: agent.email
      },
      {
        student_firstname: student.firstname,
        student_id: student._id.toString(),
        student_lastname: student.lastname
      }
    );
  }

  // inform editor-lead
  const permissions = await Permission.find({
    canAssignEditors: true
  })
    .populate('user_id', 'firstname lastname email')
    .lean();

  if (!permissions) {
    return;
  }
  const editorLeads = permissions.map((permission) => permission.user_id);

  for (const editorLead of editorLeads) {
    await sendAssignEditorReminderEmail(
      {
        firstname: editorLead.firstname,
        lastname: editorLead.lastname,
        address: editorLead.email
      },
      {
        student_firstname: student.firstname,
        student_id: student._id.toString(),
        student_lastname: student.lastname
      }
    );
  }
});

const informOnSurveyUpdate = asyncHandler(async (req, user, survey, thread) => {
  // placeholder for automatic notification user id
  const notificationUser = undefined;

  // Create message notification
  await addMessageInThread(
    req,
    `Automatic Notification: Survey has been finalized by ${user.firstname} ${user.lastname}.`,
    thread?._id,
    notificationUser
  );

  if (user.role !== Role.Student) {
    return;
  }

  const student = await req.db
    .model('Student')
    .findById(survey.studentId)
    .populate('agents editors', 'firstname lastname email')
    .lean();

  const editors = student?.editors;
  const agents = student?.agents;
  const noEditor = !agents || agents.length === 0;
  const programId = survey?.programId?.toString();
  const fileType = survey?.fileType;
  const message = `Survey has been finalized by ${user.firstname} ${user.lastname}`;
  if (isArchiv(student)) {
    return;
  }

  // If no editor, inform agent to assign
  if (noEditor) {
    informNoEditor(req, student);
  } else {
    // if supplementary form, inform Agent.
    if (fileType === 'Supplementary_Form') {
      for (let agent of agents) {
        if (isArchiv(agent)) {
          continue;
        }
        await informStaff(user, agent, student, fileType, message);
      }
    } else {
      // Inform Editor
      for (const editor of editors) {
        if (isArchiv(editor)) {
          continue;
        }
        if (programId) {
          await informStaff(user, editor, student, fileType, message);
        } else {
          const recipient = {
            firstname: editor.firstname,
            lastname: editor.lastname,
            address: editor.email
          };
          const msg = {
            writer_firstname: user.firstname,
            writer_lastname: user.lastname,
            student_firstname: student.firstname,
            student_lastname: student.lastname,
            uploaded_documentname: fileType,
            thread_id: thread._id.toString(),
            uploaded_updatedAt: new Date(),
            message
          };
          await sendNewGeneraldocMessageInThreadEmail(recipient, msg);
        }
      }
    }
  }
});

module.exports = { informOnSurveyUpdate, addMessageInThread };
