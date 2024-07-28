const async = require('async');
const path = require('path');
const { Agent, Student, Editor, User, Role } = require('../models/User');
const { Documentthread } = require('../models/Documentthread');
const { Communication } = require('../models/Communication');
const { Interval } = require('../models/Interval');
const { ResponseTime } = require('../models/ResponseTime');
const {
  sendAssignEditorReminderEmail,
  MeetingReminderEmail,
  UnconfirmedMeetingReminderEmail,
  sendNoTrainerInterviewRequestsReminderEmail,
  InterviewTrainingReminderEmail,
  InterviewSurveyRequestEmail
} = require('../services/email');
const Permission = require('../models/Permission');
const { s3 } = require('../aws/index');
const Event = require('../models/Event');
const { Interview } = require('../models/Interview');

const {
  StudentTasksReminderEmail,
  AgentTasksReminderEmail,
  EditorTasksReminderEmail,
  StudentApplicationsDeadline_Within30Days_DailyReminderEmail,
  StudentCVMLRLEssay_NoReplyAfter3Days_DailyReminderEmail,
  EditorCVMLRLEssay_NoReplyAfter7Days_DailyReminderEmail,
  AgentCVMLRLEssay_NoReplyAfterXDays_DailyReminderEmail,
  AgentApplicationsDeadline_Within30Days_DailyReminderEmail,
  EditorCVMLRLEssayDeadline_Within30Days_DailyReminderEmail,
  StudentCourseSelectionReminderEmail,
  AgentCourseSelectionReminderEmail
} = require('../services/regular_system_emails');
const logger = require('../services/logger');
const {
  does_editor_have_pending_tasks,
  is_deadline_within30days_needed,
  is_cv_ml_rl_reminder_needed,
  isNotArchiv,
  needUpdateCourseSelection
} = require('../constants');
const { asyncHandler } = require('../middlewares/error-handler');

const emptyS3Directory = asyncHandler(async (bucket, dir) => {
  const listParams = {
    Bucket: bucket,
    Prefix: dir
  };

  const listedObjects = await s3.listObjectsV2(listParams).promise();

  if (listedObjects.Contents.length === 0) return;

  const deleteParams = {
    Bucket: bucket,
    Delete: { Objects: [] }
  };

  listedObjects.Contents.forEach(({ Key }) => {
    deleteParams.Delete.Objects.push({ Key });
  });
  logger.warn(JSON.stringify(deleteParams));
  await s3.deleteObjects(deleteParams).promise();

  if (listedObjects.IsTruncated) await emptyS3Directory(bucket, dir);
});

const TasksReminderEmails_Editor_core = asyncHandler(async () => {
  // Only inform active student
  // TODO: deactivate or change email frequency (default 1 week.)
  const editors = await Editor.find();

  const editorPromises = editors.map(async (editor) => {
    const editor_students = await Student.find({
      editors: editor._id,
      $or: [{ archiv: { $exists: false } }, { archiv: false }]
    })
      .populate('agents editors', 'firstname lastname email')
      .populate('applications.programId')
      .populate(
        'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
        '-messages'
      )
      .select('-notification');

    if (
      editor_students.length > 0 &&
      does_editor_have_pending_tasks(editor_students, editor) &&
      isNotArchiv(editor)
    ) {
      await EditorTasksReminderEmail(
        {
          firstname: editor.firstname,
          lastname: editor.lastname,
          address: editor.email
        },
        { students: editor_students, editor: editor }
      );
    }
  });

  await Promise.all(editorPromises);

  logger.info('Editor reminder email sent');
});

const TasksReminderEmails_Agent_core = asyncHandler(async () => {
  // Only inform active student
  // TODO: deactivate or change email frequency (default 1 week.)
  const agents = await Agent.find();

  for (let j = 0; j < agents.length; j += 1) {
    const agent_students = await Student.find({
      agents: agents[j]._id,
      $or: [{ archiv: { $exists: false } }, { archiv: false }]
    })
      .populate('agents editors', 'firstname lastname email')
      .populate('applications.programId')
      .populate(
        'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
        '-messages'
      )
      .select('-notification')
      .lean();
    if (agent_students.length > 0) {
      if (isNotArchiv(agents[j])) {
        AgentTasksReminderEmail(
          {
            firstname: agents[j].firstname,
            lastname: agents[j].lastname,
            address: agents[j].email
          },
          { students: agent_students, agent: agents[j] }
        );
      }
    }
  }
  logger.info('Agent reminder email sent');
});

const TasksReminderEmails_Student_core = asyncHandler(async () => {
  // Only inform active student
  // TODO: deactivate or change email frequency (default 1 week.)
  const students = await Student.find({
    $or: [{ archiv: { $exists: false } }, { archiv: false }]
  })
    .populate('agents editors', 'firstname lastname email')
    .populate('applications.programId')
    .populate(
      'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
      '-messages'
    )
    .select('-notification')
    .lean(); // Only active student, not archiv

  for (let j = 0; j < students.length; j += 1) {
    StudentTasksReminderEmail(
      {
        firstname: students[j].firstname,
        lastname: students[j].lastname,
        address: students[j].email
      },
      { student: students[j] }
    );
  }
  logger.info('Student reminder email sent');
});

// Weekly called.
const TasksReminderEmails = asyncHandler(async () => {
  await TasksReminderEmails_Editor_core();
  await TasksReminderEmails_Student_core();
  await TasksReminderEmails_Agent_core();
});

const events_transformer = (events) => {
  const transformedDocuments = events.map((event) => ({
    ...event,
    _id: { $oid: event._id.toString() },
    requester_id:
      event.requester_id &&
      event.requester_id.map((req_id) => ({ $oid: req_id.toString() })),
    receiver_id:
      event.receiver_id &&
      event.receiver_id.map((rev_id) => ({ $oid: rev_id.toString() })),
    start: event.start && { $date: event.start },
    end: event.end && { $date: event.end },
    updatedAt: event.updatedAt && { $date: event.updatedAt },
    createdAt: event.createdAt && { $date: event.createdAt }
  }));
  return transformedDocuments;
};
const users_transformer = (users) => {
  const transformedDocuments = users.map((user) => ({
    ...user,
    _id: { $oid: user._id.toString() },
    lastLoginAt: user.lastLoginAt && { $date: user.lastLoginAt },
    updatedAt: user.updatedAt && { $date: user.updatedAt },
    createdAt: user.createdAt && { $date: user.createdAt },
    // students are Deprecated
    students:
      user.students &&
      user.students.map((agent) => ({ $oid: agent.toString() })),
    agents:
      user.agents && user.agents.map((agent) => ({ $oid: agent.toString() })),
    agent_notification: user.agent_notification && {
      ...user.agent_notification,
      isRead_new_base_docs_uploaded:
        user.agent_notification.isRead_new_base_docs_uploaded.map(
          (is_new_bd_uploaded) => ({
            ...is_new_bd_uploaded,
            _id: { $oid: is_new_bd_uploaded._id.toString() }
          })
        )
    },
    editors:
      user.editors &&
      user.editors.map((editor) => ({
        $oid: editor.toString()
      })),
    academic_background: user.academic_background && {
      ...user.academic_background,
      university: user.academic_background.university && {
        ...user.academic_background.university,
        updatedAt: user.academic_background.university.updatedAt && {
          $date: user.academic_background.university.updatedAt
        }
      },
      language: user.academic_background.language && {
        ...user.academic_background.language,
        updatedAt: user.academic_background.language.updatedAt && {
          $date: user.academic_background.language.updatedAt
        }
      }
    },
    application_preference: user.application_preference && {
      ...user.application_preference,
      updatedAt: user.application_preference.updatedAt && {
        $date: user.application_preference.updatedAt
      }
    },
    applications:
      user.applications &&
      user.applications.map((application) => ({
        ...application,
        _id: { $oid: application._id.toString() },
        programId: { $oid: application.programId.toString() },
        uni_assist: {
          ...application.uni_assist,
          updatedAt: application.uni_assist.updatedAt && {
            $date: application.uni_assist.updatedAt
          }
        },
        doc_modification_thread: application.doc_modification_thread.map(
          (thread) => ({
            ...thread,
            _id: { $oid: thread._id.toString() },
            doc_thread_id: { $oid: thread.doc_thread_id.toString() },
            updatedAt: thread.updatedAt && { $date: thread.updatedAt },
            createdAt: thread.createdAt && { $date: thread.createdAt }
          })
        ),
        admission_letter: application.admission_letter && {
          ...application.admission_letter,
          updatedAt: application.admission_letter?.updatedAt && {
            $date: application.admission_letter?.updatedAt
          }
        }
      })),
    generaldocs_threads:
      user.generaldocs_threads &&
      user.generaldocs_threads.map((general_doc) => ({
        ...general_doc,
        _id: { $oid: general_doc._id.toString() },
        doc_thread_id: { $oid: general_doc.doc_thread_id.toString() },
        updatedAt: general_doc.updatedAt && { $date: general_doc.updatedAt },
        createdAt: general_doc.createdAt && { $date: general_doc.createdAt }
      })),
    profile:
      user.profile &&
      user.profile.map((prof) => ({
        ...prof,
        _id: { $oid: prof._id.toString() },
        updatedAt: prof.updatedAt && { $date: prof.updatedAt }
      })),
    attributes:
      user.attributes &&
      user.attributes.map((prof) => ({
        ...prof,
        _id: { $oid: prof._id.toString() }
      }))
  }));
  return transformedDocuments;
};

const communications_transformer = (communications) => {
  const transformedDocuments = communications.map((communication) => ({
    ...communication,
    _id: { $oid: communication._id.toString() },
    student_id: { $oid: communication.student_id.toString() },
    user_id: { $oid: communication.user_id.toString() },
    readBy:
      communication.readBy &&
      communication.readBy.map((rb) => ({ $oid: rb.toString() })),
    updatedAt: communication.updatedAt && { $date: communication.updatedAt },
    createdAt: communication.createdAt && { $date: communication.createdAt }
  }));
  return transformedDocuments;
};

const courses_transformer = (courses) => {
  const transformedDocuments = courses.map((course) => ({
    ...course,
    _id: { $oid: course._id.toString() },
    student_id: { $oid: course.student_id.toString() },
    analysis: course.analysis && {
      ...course.analysis,
      updatedAt: course.analysis.updatedAt && {
        $date: course.analysis.updatedAt
      }
    },
    updatedAt: course.updatedAt && { $date: course.updatedAt }
  }));
  return transformedDocuments;
};

const notes_transformer = (notes) => {
  const transformedDocuments = notes.map((note) => ({
    ...note,
    _id: { $oid: note._id.toString() },
    student_id: { $oid: note.student_id.toString() },
    updatedAt: note.updatedAt && { $date: note.updatedAt }
  }));
  return transformedDocuments;
};

const permissions_transformer = (permissions) => {
  const transformedDocuments = permissions.map((permission) => ({
    ...permission,
    _id: { $oid: permission._id.toString() },
    user_id: { $oid: permission.user_id.toString() },
    updatedAt: permission.updatedAt && { $date: permission.updatedAt },
    createdAt: permission.createdAt && { $date: permission.createdAt }
  }));
  return transformedDocuments;
};

const basedocumentationslinks_transformer = (basedocumentationslinks) => {
  const transformedDocuments = basedocumentationslinks.map(
    (basedocumentationslink) => ({
      ...basedocumentationslink,
      _id: { $oid: basedocumentationslink._id.toString() },
      updatedAt: basedocumentationslink.updatedAt && {
        $date: basedocumentationslink.updatedAt
      }
    })
  );
  return transformedDocuments;
};

const docspages_transformer = (docspages) => {
  const transformedDocuments = docspages.map((docspage) => ({
    ...docspage,
    _id: { $oid: docspage._id.toString() },
    updatedAt: docspage.updatedAt && {
      $date: docspage.updatedAt
    }
  }));
  return transformedDocuments;
};

const programs_transformer = (programs) => {
  const transformedDocuments = programs.map((program) => ({
    ...program,
    _id: { $oid: program._id?.toString() },
    updatedAt: program.updatedAt && {
      $date: program.updatedAt
    }
  }));
  return transformedDocuments;
};

const documentthreads_transformer = (documentthreads) => {
  const transformedDocuments = documentthreads.map((documentthread) => ({
    ...documentthread,
    _id: { $oid: documentthread._id.toString() },
    student_id: { $oid: documentthread.student_id.toString() },
    program_id: documentthread.program_id && {
      $oid: documentthread.program_id.toString()
    },
    pin_by_user_id:
      documentthread.pin_by_user_id &&
      documentthread.pin_by_user_id.map((pin_user_id) => ({
        ...pin_user_id,
        _id: {
          $oid: pin_user_id._id?.toString()
        }
      })),
    outsourced_user_id:
      documentthread.outsourced_user_id &&
      documentthread.outsourced_user_id.map((outsource_user_id) => ({
        ...outsource_user_id,
        $oid: outsource_user_id._id?.toString()
      })),
    isOriginAuthorDeclarationConfirmedByStudentTimestamp:
      documentthread.isOriginAuthorDeclarationConfirmedByStudentTimestamp && {
        $date:
          documentthread.isOriginAuthorDeclarationConfirmedByStudentTimestamp
      },
    flag_by_user_id:
      documentthread.flag_by_user_id &&
      documentthread.flag_by_user_id.map((flag_user_id) => ({
        ...flag_user_id,
        _id: {
          $oid: flag_user_id._id?.toString()
        }
      })),
    messages:
      documentthread.messages &&
      documentthread.messages.map((message) => ({
        ...message,
        _id: {
          $oid: message._id?.toString()
        },
        user_id: {
          $oid: message.user_id?.toString()
        },
        file:
          message.file &&
          message.file.map((f) => ({
            ...f,
            _id: {
              $oid: f._id.toString()
            }
          })),
        createdAt: message.createdAt && {
          $date: message.createdAt
        }
      })),
    updatedAt: documentthread.updatedAt && {
      $date: documentthread.updatedAt
    }
  }));
  return transformedDocuments;
};
// Daily called.

const UrgentTasksReminderEmails_Student_core = asyncHandler(async () => {
  // Only inform active student
  // TODO: deactivate or change email frequency (default 1 week.)
  const trigger_days = 3;
  const students = await Student.find({
    $or: [{ archiv: { $exists: false } }, { archiv: false }]
  })
    .populate('agents editors', 'firstname lastname email')
    .populate('applications.programId')
    .populate(
      'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
      '-messages'
    )
    .select('-notification')
    .lean(); // Only active student, not archiv

  const deadlineReminderPromises = students.map(async (student) => {
    if (is_deadline_within30days_needed(student)) {
      logger.info(`Escalate: ${student.firstname} ${student.lastname}`);
      await StudentApplicationsDeadline_Within30Days_DailyReminderEmail(
        {
          firstname: student.firstname,
          lastname: student.lastname,
          address: student.email
        },
        { student, trigger_days }
      );
      logger.info(
        `Daily urgent emails sent to ${student.firstname} ${student.lastname}`
      );
    }

    if (is_cv_ml_rl_reminder_needed(student, student, trigger_days)) {
      logger.info(`Escalate: ${student.firstname} ${student.lastname}`);
      await StudentCVMLRLEssay_NoReplyAfter3Days_DailyReminderEmail(
        {
          firstname: student.firstname,
          lastname: student.lastname,
          address: student.email
        },
        { student, trigger_days }
      );
      logger.info(
        `Daily2 urgent emails sent to ${student.firstname} ${student.lastname}`
      );
    }
  });

  await Promise.all(deadlineReminderPromises);
});

const UrgentTasksReminderEmails_Agent_core = asyncHandler(async () => {
  // Only inform active student
  // TODO: deactivate or change email frequency (default 1 week.)
  const escalation_trigger_10days = 10;
  const escalation_trigger_3days = 3;
  const agents = await Agent.find();

  const agentPromises = agents.map(async (agent) => {
    const agent_students = await Student.find({
      agents: agent._id,
      $or: [{ archiv: { $exists: false } }, { archiv: false }]
    })
      .populate('agents editors', 'firstname lastname email')
      .populate('applications.programId')
      .populate(
        'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
        '-messages'
      )
      .select('-notification');
    if (agent_students.length > 0) {
      let cv_ml_rl_10days_flag = false;
      let cv_ml_rl_3days_flag = false;
      let deadline_within30days_flag = false;
      for (let x = 0; x < agent_students.length; x += 1) {
        deadline_within30days_flag |= is_deadline_within30days_needed(
          agent_students[x]
        );
        cv_ml_rl_10days_flag |= is_cv_ml_rl_reminder_needed(
          agent_students[x],
          agent,
          escalation_trigger_10days
        );
        cv_ml_rl_3days_flag |= is_cv_ml_rl_reminder_needed(
          agent_students[x],
          agent,
          escalation_trigger_3days
        );
      }
      const promises = [];
      if (deadline_within30days_flag && cv_ml_rl_3days_flag) {
        logger.info(`Escalate: ${agent.firstname} ${agent.lastname}`);
        promises.push(
          AgentApplicationsDeadline_Within30Days_DailyReminderEmail(
            {
              firstname: agent.firstname,
              lastname: agent.lastname,
              address: agent.email
            },
            {
              students: agent_students,
              agent,
              trigger_days: escalation_trigger_3days
            }
          ),
          AgentCVMLRLEssay_NoReplyAfterXDays_DailyReminderEmail(
            {
              firstname: agent.firstname,
              lastname: agent.lastname,
              address: agent.email
            },
            {
              students: agent_students,
              agent,
              trigger_days: escalation_trigger_3days
            }
          )
        );
        logger.info(
          `Deadline urgent emails sent to ${agent.firstname} ${agent.lastname}`
        );
      } else if (cv_ml_rl_10days_flag) {
        promises.push(
          AgentCVMLRLEssay_NoReplyAfterXDays_DailyReminderEmail(
            {
              firstname: agent.firstname,
              lastname: agent.lastname,
              address: agent.email
            },
            {
              students: agent_students,
              agent,
              trigger_days: escalation_trigger_10days
            }
          )
        );
      }
      await Promise.all(promises);
    }
  });

  await Promise.all(agentPromises);
});

const UrgentTasksReminderEmails_Editor_core = asyncHandler(async () => {
  // Only inform active student
  // TODO: deactivate or change email frequency (default 1 week.)
  const editor_trigger_7days = 7;
  const editor_trigger_3days = 3;
  const editors = await Editor.find();

  // (O): Check if editor no reply (need to response) more than 3 days (Should configurable)
  for (let j = 0; j < editors.length; j += 1) {
    const editor_students = await Student.find({
      editors: editors[j]._id,
      $or: [{ archiv: { $exists: false } }, { archiv: false }]
    })
      .populate('agents editors', 'firstname lastname email')
      .populate('applications.programId')
      .populate(
        'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
        '-messages'
      )
      .select('-notification');
    if (editor_students.length > 0) {
      let cv_ml_rl_7days_flag = false;
      let cv_ml_rl_3days_flag = false;
      let deadline_within30days_flag = false;
      for (let x = 0; x < editor_students.length; x += 1) {
        deadline_within30days_flag |= is_deadline_within30days_needed(
          editor_students[x]
        );
        cv_ml_rl_7days_flag |= is_cv_ml_rl_reminder_needed(
          editor_students[x],
          editors[j],
          editor_trigger_7days
        );
        cv_ml_rl_3days_flag |= is_cv_ml_rl_reminder_needed(
          editor_students[x],
          editors[j],
          editor_trigger_3days
        );
      }

      if (deadline_within30days_flag) {
        if (cv_ml_rl_3days_flag) {
          logger.info(
            `Escalate: ${editors[j].firstname} ${editors[j].lastname}`
          );
          EditorCVMLRLEssayDeadline_Within30Days_DailyReminderEmail(
            {
              firstname: editors[j].firstname,
              lastname: editors[j].lastname,
              address: editors[j].email
            },
            { students: editor_students }
          );
          logger.info(
            `Daily urgent emails sent to ${editors[j].firstname} ${editors[j].lastname}`
          );
        }
      } else if (cv_ml_rl_7days_flag) {
        logger.info(`Escalate: ${editors[j].firstname} ${editors[j].lastname}`);
        await EditorCVMLRLEssay_NoReplyAfter7Days_DailyReminderEmail(
          {
            firstname: editors[j].firstname,
            lastname: editors[j].lastname,
            address: editors[j].email
          },
          {
            students: editor_students,
            editor: editors[j],
            trigger_days: editor_trigger_7days
          }
        );
      }
    }
  }
});

const AssignEditorTasksReminderEmails = asyncHandler(async () => {
  const students = await Student.find({
    $or: [{ archiv: { $exists: false } }, { archiv: false }]
  })
    .populate('agents editors', 'firstname lastname email archiv')
    .populate('applications.programId')
    .populate(
      'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
      '-messages'
    )
    .select('-notification')
    .lean(); // Only active student, not archiv
  for (let i = 0; i < students.length; i += 1) {
    if (!students[i].editors || students[i].editors.length === 0) {
      for (let j = 0; j < students[i].agents.length; j += 1) {
        // inform active-agent
        if (isNotArchiv(students[i])) {
          if (isNotArchiv(students[i].agents[j])) {
            if (students[i].needEditor) {
              sendAssignEditorReminderEmail(
                {
                  firstname: students[i].agents[j].firstname,
                  lastname: students[i].agents[j].lastname,
                  address: students[i].agents[j].email
                },
                {
                  student_firstname: students[i].firstname,
                  student_id: students[i]._id.toString(),
                  student_lastname: students[i].lastname
                }
              );
            }
          }
        }
      }
      // inform editor-lead
      const permissions = await Permission.find({
        canAssignEditors: true
      })
        .populate('user_id', 'firstname lastname email')
        .lean();
      if (permissions) {
        for (let x = 0; x < permissions.length; x += 1) {
          if (students[i].needEditor) {
            sendAssignEditorReminderEmail(
              {
                firstname: permissions[x].user_id.firstname,
                lastname: permissions[x].user_id.lastname,
                address: permissions[x].user_id.email
              },
              {
                student_firstname: students[i].firstname,
                student_id: students[i]._id.toString(),
                student_lastname: students[i].lastname
              }
            );
          }
        }
      }
      logger.info('Assign editor reminded');
    }
  }
});

const UrgentTasksReminderEmails = asyncHandler(async () => {
  const UrgentTaskPromises = [
    UrgentTasksReminderEmails_Editor_core(),
    UrgentTasksReminderEmails_Student_core(),
    UrgentTasksReminderEmails_Agent_core()
  ];

  await Promise.all(UrgentTaskPromises);
});

const NextSemesterCourseSelectionStudentReminderEmails = asyncHandler(
  async () => {
    // Only inform active student
    const studentsWithCourses = await Student.aggregate([
      {
        $match: {
          archiv: { $ne: true } // Filter out students where 'archiv' is not equal to true
        }
      },
      {
        $lookup: {
          from: 'courses',
          localField: '_id',
          foreignField: 'student_id',
          as: 'courses'
        }
      },
      {
        $project: {
          firstname: 1,
          lastname: 1,
          email: 1,
          role: 1,
          archiv: 1,
          academic_background: 1,
          courses: 1
        }
      }
    ]);

    for (let j = 0; j < studentsWithCourses.length; j += 1) {
      if (isNotArchiv(studentsWithCourses[j])) {
        if (needUpdateCourseSelection(studentsWithCourses[j])) {
          // Inform student
          StudentCourseSelectionReminderEmail(
            {
              firstname: studentsWithCourses[j].firstname,
              lastname: studentsWithCourses[j].lastname,
              address: studentsWithCourses[j].email
            },
            { student: studentsWithCourses[j] }
          );
        }
      }
    }
  }
);

const NextSemesterCourseSelectionAgentReminderEmails = asyncHandler(
  async () => {
    // Only inform active student
    const studentsWithCourses = await Student.aggregate([
      {
        $match: {
          archiv: { $ne: true } // Filter out students where 'archiv' is not equal to true
        }
      },
      {
        $lookup: {
          from: 'courses',
          localField: '_id',
          foreignField: 'student_id',
          as: 'courses'
        }
      },
      {
        $lookup: {
          from: 'users', // Replace 'users' with the actual name of the User collection
          localField: 'agents',
          foreignField: '_id',
          as: 'agentsInfo'
        }
      },
      {
        $project: {
          firstname: 1,
          lastname: 1,
          email: 1,
          role: 1,
          archiv: 1,
          agents: {
            $map: {
              input: '$agents',
              as: 'agentId',
              in: {
                $let: {
                  vars: {
                    agentInfo: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: '$agentsInfo',
                            cond: { $eq: ['$$this._id', '$$agentId'] }
                          }
                        },
                        0
                      ]
                    }
                  },
                  in: {
                    firstname: '$$agentInfo.firstname',
                    lastname: '$$agentInfo.lastname',
                    archiv: '$$agentInfo.archiv',
                    email: '$$agentInfo.email'
                  }
                }
              }
            }
          },
          academic_background: 1,
          courses: 1
        }
      }
    ]);
    for (let j = 0; j < studentsWithCourses.length; j += 1) {
      if (isNotArchiv(studentsWithCourses[j])) {
        if (needUpdateCourseSelection(studentsWithCourses[j])) {
          // TODO: move informing Agent to another function so that all students needing update in 1 email for agents.
          for (let x = 0; x < studentsWithCourses[j].agents.length; x += 1) {
            if (isNotArchiv(studentsWithCourses[j].agents[x])) {
              // TODO: inform Agent
              await AgentCourseSelectionReminderEmail(
                {
                  firstname: studentsWithCourses[j].agents[x].firstname,
                  lastname: studentsWithCourses[j].agents[x].lastname,
                  address: studentsWithCourses[j].agents[x].email
                },
                { student: studentsWithCourses[j] }
              );
            }
          }
        }
      }
    }
  }
);

const NextSemesterCourseSelectionReminderEmails = asyncHandler(async () => {
  await NextSemesterCourseSelectionStudentReminderEmails();
  // await NextSemesterCourseSelectionAgentReminderEmails();
});

const numStudentYearDistribution = (students) =>
  students.reduce((acc, student) => {
    const date =
      student.application_preference.expected_application_date || 'TBD';
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

// const UpdateStatisticsData = asyncHandler(async () => {
//   const documents_cv = await Documentthread.find({
//     isFinalVersion: false,
//     file_type: 'CV'
//   }).count();
//   // TODO: this include the tasks that created by not shown, because the programs are not decided.
//   // So that is why the number is more than what we actually see in UI.
//   // Case 2: if student in Archiv, but the tasks are still open!! then the number is not correct!
//   const documents_ml = await Documentthread.find({
//     isFinalVersion: false,
//     file_type: 'ML'
//   }).count();
//   const documents_rl = await Documentthread.find({
//     isFinalVersion: false,
//     $or: [
//       { file_type: 'RL_A' },
//       { file_type: 'RL_B' },
//       { file_type: 'RL_C' },
//       { file_type: 'Recommendation_Letter_A' },
//       { file_type: 'Recommendation_Letter_B' },
//       { file_type: 'Recommendation_Letter_C' }
//     ]
//   }).count();
//   const documents_essay = await Documentthread.find({
//     isFinalVersion: false,
//     file_type: 'Essay'
//   }).count();
//   const documents_data = {};
//   documents_data.CV = { count: documents_cv };
//   documents_data.ML = { count: documents_ml };
//   documents_data.RL = { count: documents_rl };
//   documents_data.ESSAY = { count: documents_essay };
//   const agents = await Agent.find({
//     $or: [{ archiv: { $exists: false } }, { archiv: false }]
//   });
//   const editors = await Editor.find({
//     $or: [{ archiv: { $exists: false } }, { archiv: false }]
//   });
//   const students = await Student.find()
//     .populate('agents editors', 'firstname lastname')
//     .populate('applications.programId')
//     .populate(
//       'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
//       '-messages'
//     );
//   const agents_data = [];
//   const editors_data = [];
//   for (let i = 0; i < agents.length; i += 1) {
//     const Obj = {};
//     Obj._id = agents[i]._id.toString();
//     Obj.firstname = agents[i].firstname;
//     Obj.lastname = agents[i].lastname;
//     Obj.student_num = await Student.find({
//       agents: agents[i]._id,
//       $or: [{ archiv: { $exists: false } }, { archiv: false }]
//     }).count();
//     agents_data.push(Obj);
//   }
//   for (let i = 0; i < editors.length; i += 1) {
//     const Obj = {};
//     Obj._id = editors[i]._id.toString();
//     Obj.firstname = editors[i].firstname;
//     Obj.lastname = editors[i].lastname;
//     Obj.student_num = await Student.find({
//       editors: editors[i]._id,
//       $or: [{ archiv: { $exists: false } }, { archiv: false }]
//     }).count();
//     editors_data.push(Obj);
//   }
//   const finished_docs = await Documentthread.find({
//     isFinalVersion: true,
//     $or: [
//       { file_type: 'CV' },
//       { file_type: 'ML' },
//       { file_type: 'RL_A' },
//       { file_type: 'RL_B' },
//       { file_type: 'RL_C' },
//       { file_type: 'Recommendation_Letter_A' },
//       { file_type: 'Recommendation_Letter_B' },
//       { file_type: 'Recommendation_Letter_C' }
//     ]
//   })
//     .populate('student_id', 'firstname lastname')
//     .select('file_type messages.createdAt');
//   const users = await User.find({
//     role: { $in: ['Admin', 'Agent', 'Editor'] }
//   }).lean();
//   const result = {
//     success: true,
//     data: users,
//     // documents_all_open,
//     documents: documents_data,
//     students: {
//       isClose: students.filter((student) => student.archiv === true).length,
//       isOpen: students.filter((student) => student.archiv !== true).length
//     },
//     finished_docs,
//     agents: agents_data,
//     editors: editors_data,
//     students_details: students,
//     applications: []
//   };
// });

const add_portals_registered_status = (student_input) => {
  const student = student_input;
  for (let i = 0; i < student.applications.length; i += 1) {
    if (student.applications[i].decided === 'O') {
      if (student.applications[i].programId.application_portal_a) {
        if (
          student.applications[i].portal_credentials &&
          student.applications[i].portal_credentials.application_portal_a &&
          student.applications[i].portal_credentials.application_portal_a
            .account &&
          student.applications[i].portal_credentials.application_portal_a
            .password
        ) {
          student.applications[i].credential_a_filled = true;
        } else {
          student.applications[i].credential_a_filled = false;
        }
      } else {
        student.applications[i].credential_a_filled = true;
      }
      if (student.applications[i].programId.application_portal_b) {
        if (
          student.applications[i].portal_credentials &&
          student.applications[i].portal_credentials.application_portal_b &&
          student.applications[i].portal_credentials.application_portal_b
            .account &&
          student.applications[i].portal_credentials.application_portal_b
            .password
        ) {
          student.applications[i].credential_b_filled = true;
        } else {
          student.applications[i].credential_b_filled = false;
        }
      } else {
        student.applications[i].credential_b_filled = true;
      }
    } else {
      student.applications[i].credential_a_filled = true;
      student.applications[i].credential_b_filled = true;
    }

    delete student.applications[i].portal_credentials;
  }
  return student;
};

const MeetingDailyReminderChecker = asyncHandler(async () => {
  const currentDate = new Date();
  const twentyFourHoursLater = new Date(currentDate);
  twentyFourHoursLater.setHours(currentDate.getHours() + 24);

  // Only future meeting within 24 hours, not past
  const upcomingEvents = await Event.find({
    $and: [
      {
        end: {
          $gte: currentDate,
          $lt: twentyFourHoursLater
        }
      },
      { isConfirmedReceiver: true },
      { isConfirmedRequester: true }
    ]
  }).populate('requester_id receiver_id', 'firstname lastname email');
  if (upcomingEvents) {
    for (let j = 0; j < upcomingEvents.length; j += 1) {
      if (upcomingEvents.event_type === 'Interview') {
        // eslint-disable-next-line no-await-in-loop
        await InterviewTrainingReminderEmail(
          {
            firstname: upcomingEvents[j].requester_id[0].firstname,
            lastname: upcomingEvents[j].requester_id[0].lastname,
            address: upcomingEvents[j].requester_id[0].email
          },
          {
            event: upcomingEvents[j]
          }
        );
        await InterviewTrainingReminderEmail(
          {
            firstname: upcomingEvents[j].receiver_id[0].firstname,
            lastname: upcomingEvents[j].receiver_id[0].lastname,
            address: upcomingEvents[j].receiver_id[0].email
          },
          {
            event: upcomingEvents[j]
          }
        );
      } else {
        // eslint-disable-next-line no-await-in-loop
        await MeetingReminderEmail(
          {
            firstname: upcomingEvents[j].requester_id[0].firstname,
            lastname: upcomingEvents[j].requester_id[0].lastname,
            address: upcomingEvents[j].requester_id[0].email
          },
          {
            event: upcomingEvents[j]
          }
        );
        await MeetingReminderEmail(
          {
            firstname: upcomingEvents[j].receiver_id[0].firstname,
            lastname: upcomingEvents[j].receiver_id[0].lastname,
            address: upcomingEvents[j].receiver_id[0].email
          },
          {
            event: upcomingEvents[j]
          }
        );
      }
    }
    logger.info('Meeting attendees reminded');
  }
});

// every day reminder
const UnconfirmedMeetingDailyReminderChecker = asyncHandler(async () => {
  const currentDate = new Date();

  // Only future meeting within 24 hours, not past
  const upcomingEvents = await Event.find({
    $and: [
      {
        end: {
          $gte: currentDate
        }
      },
      {
        $or: [{ isConfirmedReceiver: false }, { isConfirmedRequester: false }]
      }
    ]
  }).populate('requester_id receiver_id', 'firstname lastname role email');
  if (upcomingEvents) {
    for (let j = 0; j < upcomingEvents.length; j += 1) {
      if (!upcomingEvents[j].isConfirmedRequester) {
        UnconfirmedMeetingReminderEmail(
          {
            firstname: upcomingEvents[j].requester_id[0].firstname,
            lastname: upcomingEvents[j].requester_id[0].lastname,
            address: upcomingEvents[j].requester_id[0].email
          },
          {
            event: upcomingEvents[j],
            firstname: upcomingEvents[j].receiver_id[0].firstname,
            lastname: upcomingEvents[j].receiver_id[0].lastname,
            id: upcomingEvents[j].requester_id[0]._id.toString(),
            role: upcomingEvents[j].requester_id[0].role
          }
        );
      }
      if (!upcomingEvents[j].isConfirmedReceiver) {
        UnconfirmedMeetingReminderEmail(
          {
            firstname: upcomingEvents[j].receiver_id[0].firstname,
            lastname: upcomingEvents[j].receiver_id[0].lastname,
            address: upcomingEvents[j].receiver_id[0].email
          },
          {
            event: upcomingEvents[j],
            firstname: upcomingEvents[j].requester_id[0].firstname,
            lastname: upcomingEvents[j].requester_id[0].lastname,
            id: upcomingEvents[j].receiver_id[0]._id.toString(),
            role: upcomingEvents[j].receiver_id[0].role
          }
        );
      }
    }
  }

  logger.info('Unconfirmed Meeting attendee reminded');
});

function CalculateInterval(message1, message2) {
  const intervalInDay =
    Math.abs(message1.createdAt - message2.createdAt) / (1000 * 60 * 60 * 24);
  return parseFloat(intervalInDay.toFixed(4));
}

const GroupCommunicationByStudent = asyncHandler(async () => {
  try {
    const communications = await Communication.find()
      .populate('student_id user_id', 'firstname lastname email archiv')
      .lean();
    let groupCommunication = {};
    for (const singleCommunicaiton of communications) {
      if (
        singleCommunicaiton.student_id &&
        singleCommunicaiton.student_id.archiv !== true
      ) {
        if (
          !groupCommunication[singleCommunicaiton.student_id._id.toString()]
        ) {
          groupCommunication[singleCommunicaiton.student_id._id.toString()] = [
            singleCommunicaiton
          ];
        } else {
          groupCommunication[
            singleCommunicaiton.student_id._id.toString()
          ].push(singleCommunicaiton);
        }
      }
    }
    return groupCommunication;
  } catch (error) {
    logger.error('error grouping communications');
    return null;
  }
});

const CreateIntervalMessageOperation = (student_id, msg1, msg2) => {
  const intervalValue = CalculateInterval(msg1, msg2);
  const intervalData = {
    student_id,
    message_1_id: msg1._id,
    message_2_id: msg2._id,
    interval_type: 'communication',
    interval: intervalValue,
    updatedAt: new Date()
  };

  // Create a query object excluding the updatedAt field
  const { updatedAt, ...queryData } = intervalData;

  // Define the update operation
  const update = {
    $setOnInsert: intervalData
  };

  return {
    updateOne: {
      filter: queryData,
      update: update,
      upsert: true
    }
  };
};

const ProcessMessages = (student, messages) => {
  const bulkOps = [];
  messages.sort((a, b) => a.updatedAt - b.updatedAt);
  // console.log("messages", messages);
  if (messages.length > 1) {
    let msg1 = undefined;
    let msg2 = undefined;

    for (const msg of messages) {
      const UserRole = msg.user_id?.role;
      if (
        msg1 === undefined &&
        UserRole === Role.Student &&
        msg.ignore_message !== true
      ) {
        // Get the first message from student
        msg1 = msg;
      } else if (msg1 !== undefined && UserRole !== Role.Student) {
        msg2 = msg;
      }
      if (msg1 !== undefined && msg2 !== undefined) {
        const operation = CreateIntervalMessageOperation(student, msg1, msg2);
        if (operation) {
          bulkOps.push(operation);
        }
        msg1 = undefined;
        msg2 = undefined;
      }
    }
  }
  return bulkOps;
};

const FindIntervalInCommunicationsAndSave = asyncHandler(async () => {
  try {
    // TODO: active student's message only
    const groupCommunication = await GroupCommunicationByStudent();
    const bulkOps = [];

    for (const [student, messages] of Object.entries(groupCommunication)) {
      const studentBulkOps = ProcessMessages(student, messages);
      bulkOps.push(...studentBulkOps);
    }

    if (bulkOps.length > 0) {
      const result = await Interval.bulkWrite(bulkOps);
      logger.info(
        'FindIntervalInCommunicationsAndSave: Bulk operation result:',
        result
      );
    }
  } catch (error) {
    logger.error('Error finding valid interval:', error);
  }
});

const CreateIntervalOperation = (thread, msg1, msg2) => {
  const intervalValue = CalculateInterval(msg1, msg2);
  const intervalData = {
    thread_id: thread._id,
    message_1_id: msg1._id,
    message_2_id: msg2._id,
    interval_type: thread.file_type,
    interval: intervalValue,
    updatedAt: new Date()
  };

  // Create a query object excluding the updatedAt field
  const { updatedAt, ...queryData } = intervalData;

  // Define the update operation
  const update = {
    $setOnInsert: intervalData
  };

  return {
    updateOne: {
      filter: queryData,
      update: update,
      upsert: true
    }
  };
};
const ProcessThread = (thread) => {
  const bulkOps = [];
  if (thread.messages?.length > 1) {
    let msg1 = undefined;
    let msg2 = undefined;

    for (const msg of thread.messages) {
      try {
        const UserRole = msg.user_id?.role;
        if (
          msg1 === undefined &&
          UserRole === Role.Student &&
          msg.ignore_message !== true
        ) {
          msg1 = msg;
        } else if (msg1 !== undefined && UserRole !== Role.Student) {
          msg2 = msg;
        }
      } catch (error) {
        logger.error('Error finding message user_id:', error);
      }
      if (msg1 !== undefined && msg2 !== undefined) {
        const operation = CreateIntervalOperation(thread, msg1, msg2);
        if (operation) {
          bulkOps.push(operation);
        }
        msg1 = undefined;
        msg2 = undefined;
      }
    }
  }
  return bulkOps;
};

const FetchStudentsForDocumentThreads = asyncHandler(async (filter) =>
  Student.find(filter)
    .populate('agents editors', 'firstname lastname email')
    .populate({
      path: 'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
      populate: {
        path: 'messages',
        populate: {
          path: 'user_id',
          model: 'User'
        }
      }
    })
    .lean()
);

const FindIntervalInDocumentThreadAndSave = asyncHandler(async () => {
  try {
    // calculate active student only
    const students = await FetchStudentsForDocumentThreads({
      $or: [{ archiv: { $exists: false } }, { archiv: false }]
    });
    const bulkOps = [];

    for (const student of students) {
      try {
        for (const generaldocs_thread of student.generaldocs_threads) {
          const thread = generaldocs_thread.doc_thread_id;
          const threadBulkOps = ProcessThread(thread);
          bulkOps.push(...threadBulkOps);
        }
      } catch (e) {
        logger.error('Error retrieving general docs', e);
      }

      try {
        for (const application of student.applications) {
          for (const doc_thread_id of application.doc_modification_thread) {
            const thread = doc_thread_id.doc_thread_id;
            const threadBulkOps = ProcessThread(thread);
            bulkOps.push(...threadBulkOps);
          }
        }
      } catch (e) {
        logger.error('Error retrieving application docs', e);
      }
    }

    if (bulkOps.length > 0) {
      const result = await Interval.bulkWrite(bulkOps);
      logger.info(
        'FindIntervalInDocumentThreadAndSave: Bulk operation result:',
        result
      );
    }
  } catch (error) {
    logger.error('Error in FindIntervalInDocumentThreadAndSave:', error);
  }
});

const GroupIntervals = asyncHandler(async () => {
  try {
    const intervals = await Interval.find()
      .populate('thread_id student_id')
      .lean();
    const studentGroupInterval = {};
    const documentThreadGroupInterval = {};
    intervals.forEach((singleInterval) => {
      const { student_id, thread_id } = singleInterval;
      const key = student_id
        ? student_id._id.toString()
        : thread_id._id.toString();
      const group = student_id
        ? studentGroupInterval
        : documentThreadGroupInterval;
      if (!group[key]) {
        group[key] = [singleInterval];
      } else {
        group[key].push(singleInterval);
      }
    });
    return [studentGroupInterval, documentThreadGroupInterval];
  } catch (error) {
    logger.error('Error grouping communications:', error);
    return null;
  }
});

const CalculateAverageResponseTimeAndSave = asyncHandler(async () => {
  const [studentGroupInterval, documentThreadGroupInterval] =
    await GroupIntervals();
  const calculateAndSaveAverage = async (groupInterval, idKey) => {
    try {
      const bulkOps = [];

      // Prepare the bulk operations
      for (const key in groupInterval) {
        const intervals = groupInterval[key];
        const total = intervals.reduce(
          (sum, interval) => sum + interval.interval,
          0
        );
        const final_avg = (total / intervals.length).toFixed(2);

        const singleInterval = intervals[0];
        const intervalType = singleInterval.interval_type;

        const query = {
          [`${idKey}`]: key.toString(),
          interval_type: intervalType
        };
        let update;
        if (idKey === 'thread_id') {
          update = {
            $set: {
              intervalAvg: final_avg,
              updatedAt: new Date()
            },
            $setOnInsert: {
              student_id: singleInterval.thread_id.student_id?.toString(),
              [`${idKey}`]: key.toString(),
              interval_type: intervalType
            }
          };
        } else {
          update = {
            $set: {
              intervalAvg: final_avg,
              updatedAt: new Date()
            },
            $setOnInsert: {
              [`${idKey}`]: key.toString(),
              interval_type: intervalType
            }
          };
        }

        bulkOps.push({
          updateOne: {
            filter: query,
            update: update,
            upsert: true
          }
        });
      }

      // Execute bulk operations
      if (bulkOps.length > 0) {
        const result = await ResponseTime.bulkWrite(bulkOps);
        logger.info('calculateAndSaveAverage: Bulk operation result:', result);
      }
    } catch (err) {
      logger.error(
        `Error calculating and saving average response time for ${idKey}:`,
        err
      );
    }
  };

  await calculateAndSaveAverage(studentGroupInterval, 'student_id');
  await calculateAndSaveAverage(documentThreadGroupInterval, 'thread_id');
});

const DailyCalculateAverageResponseTime = asyncHandler(async () => {
  await FindIntervalInCommunicationsAndSave();
  await FindIntervalInDocumentThreadAndSave();
  await CalculateAverageResponseTimeAndSave();
});

const DailyInterviewSurveyChecker = asyncHandler(async () => {
  // TODO: find today meeting and send email reminder (only once)
  const currentDate = new Date();
  const twentyFourHoursAgo = new Date(currentDate);
  twentyFourHoursAgo.setHours(currentDate.getHours() - 24);
  // interviews took place within last 24 hours
  const interviewTookPlacedToday = await Interview.find({
    interview_date: {
      $gte: twentyFourHoursAgo.toISOString(),
      $lt: currentDate
    }
  })
    .populate('student_id', 'firstname lastname email')
    .populate('program_id', 'school program_name degree semester')
    .lean();

  // send interview survey request email
  interviewTookPlacedToday?.map((interview) =>
    InterviewSurveyRequestEmail(
      {
        firstname: interview.student_id.firstname,
        lastname: interview.student_id.lastname,
        address: interview.student_id.email
      },
      { interview }
    )
  );
});

// every day reminder
// TODO: (O)no trainer, no date.
const NoInterviewTrainerOrTrainingDateDailyReminderChecker = asyncHandler(
  async () => {
    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().split('T')[0]; // Converts to 'YYYY-MM-DD' format

    // Only future meeting within 24 hours, not past
    const interviewRequests = await Interview.find({
      $and: [
        {
          interview_date: {
            $gte: currentDateString
          }
        },
        {
          $or: [
            {
              trainer_id: {
                $exists: false
              }
            },
            {
              trainer_id: {
                $size: 0
              }
            }
          ]
        }
      ]
    })
      .populate('student_id', 'firstname lastname role email')
      .populate('program_id');

    // TODO: reminder agent as well

    if (interviewRequests?.length > 0) {
      const permissions = await Permission.find({
        canAssignEditors: true
      })
        .populate('user_id', 'firstname lastname email')
        .lean();
      const sendEmailPromises = permissions.map((permission) =>
        sendNoTrainerInterviewRequestsReminderEmail(
          {
            firstname: permission.user_id.firstname,
            lastname: permission.user_id.lastname,
            address: permission.user_id.email
          },
          {
            interviewRequests
          }
        )
      );
      await Promise.all(sendEmailPromises);
      logger.info('No interviewer tasks reminder sent.');
    }
  }
);

module.exports = {
  emptyS3Directory,
  TasksReminderEmails,
  events_transformer,
  users_transformer,
  communications_transformer,
  courses_transformer,
  notes_transformer,
  permissions_transformer,
  basedocumentationslinks_transformer,
  docspages_transformer,
  programs_transformer,
  documentthreads_transformer,
  AssignEditorTasksReminderEmails,
  UrgentTasksReminderEmails,
  NextSemesterCourseSelectionReminderEmails,
  numStudentYearDistribution,
  // UpdateStatisticsData,
  add_portals_registered_status,
  MeetingDailyReminderChecker,
  UnconfirmedMeetingDailyReminderChecker,
  DailyCalculateAverageResponseTime,
  DailyInterviewSurveyChecker,
  NoInterviewTrainerOrTrainingDateDailyReminderChecker
};
