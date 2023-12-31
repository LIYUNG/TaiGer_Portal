const path = require('path');
const async = require('async');

const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const { Role, User, Agent, Student, Editor } = require('../models/User');
const { Program } = require('../models/Program');
const { Documentthread } = require('../models/Documentthread');
const { Basedocumentationslink } = require('../models/Basedocumentationslink');
const { add_portals_registered_status } = require('../utils/utils_function');
const logger = require('../services/logger');

const {
  informEditorArchivedStudentEmail,
  informStudentArchivedStudentEmail,
  informAgentNewStudentEmail,
  informStudentTheirAgentEmail,
  informEditorNewStudentEmail,
  informStudentTheirEditorEmail,
  createApplicationToStudentEmail,
  informAgentStudentAssignedEmail
} = require('../services/email');

const { RLs_CONSTANT, isNotArchiv, ManagerType } = require('../constants');
const Permission = require('../models/Permission');
const Course = require('../models/Course');

const getStudent = asyncHandler(async (req, res, next) => {
  const {
    user,
    params: { studentId }
  } = req;

  const student = await Student.findById(studentId)
    .populate('agents editors', 'firstname lastname email')
    .populate('applications.programId')
    .populate(
      'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
      '-messages'
    )
    .lean();
  res.status(200).send({ success: true, data: student });
  next();
});

const getStudentAndDocLinks = asyncHandler(async (req, res, next) => {
  const {
    user,
    params: { studentId }
  } = req;

  const student = await Student.findById(studentId)
    .populate('agents editors', 'firstname lastname email')
    .populate(
      'applications.programId',
      'school program_name toefl toefl_reading toefl_listening toefl_writing toefl_speaking ielts ielts_reading ielts_listening ielts_writing ielts_speaking testdaf gre gmat degree semester country application_deadline ml_required ml_requirements rl_required uni_assist rl_requirements essay_required essay_requirements portfolio_required portfolio_requirements supplementary_form_required supplementary_form_requirements application_portal_a application_portal_b'
    )
    .populate(
      'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
      '-messages'
    )
    .select(
      '-taigerai +applications.portal_credentials.application_portal_a.account +applications.portal_credentials.application_portal_a.password +applications.portal_credentials.application_portal_b.account +applications.portal_credentials.application_portal_b.password'
    )
    .lean();

  const student_new = add_portals_registered_status(student);
  const base_docs_link = await Basedocumentationslink.find({
    category: 'base-documents'
  });
  const survey_link = await Basedocumentationslink.find({
    category: 'survey'
  });

  // TODO: remove agent notfication for new documents upload

  res
    .status(200)
    .send({ success: true, data: student_new, base_docs_link, survey_link });
  if (user.role === Role.Agent) {
    await Agent.findByIdAndUpdate(
      user._id.toString(),
      {
        $pull: {
          'agent_notification.isRead_new_base_docs_uploaded': {
            student_id: studentId
          }
        }
      },
      {}
    );
  }
  next();
});

const updateDocumentationHelperLink = asyncHandler(async (req, res, next) => {
  const { link, key, category } = req.body;
  // if not in database, then create one
  // otherwise: update the existing one.
  let helper_link = await Basedocumentationslink.findOneAndUpdate(
    { category, key },
    {
      $set: {
        link,
        updatedAt: new Date()
      }
    },
    { upsert: true, new: true }
  );

  const updated_helper_link = await Basedocumentationslink.find({
    category
  });
  res.status(200).send({ success: true, helper_link: updated_helper_link });
  next();
});

const getAllArchivStudents = asyncHandler(async (req, res, next) => {
  const students = await Student.find({ archiv: true })
    .populate('agents editors', 'firstname lastname email')
    .populate('applications.programId')
    .populate(
      'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
      '-messages'
    )
    .select(
      '-notification +applications.portal_credentials.application_portal_a.account +applications.portal_credentials.application_portal_a.password +applications.portal_credentials.application_portal_b.account +applications.portal_credentials.application_portal_b.password'
    )
    .lean();

  res.status(200).send({ success: true, data: students });
  next();
});

const getAllActiveStudents = asyncHandler(async (req, res, next) => {
  const students = await Student.find({
    $or: [{ archiv: { $exists: false } }, { archiv: false }]
  })
    .populate('agents editors', 'firstname lastname email')
    .populate('applications.programId')
    .populate(
      'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
      '-messages'
    )
    .select(
      '-notification +applications.portal_credentials.application_portal_a.account +applications.portal_credentials.application_portal_a.password +applications.portal_credentials.application_portal_b.account +applications.portal_credentials.application_portal_b.password'
    )
    .lean();
  const courses = await Course.find().select('-table_data_string').lean();
  // Perform the join
  const studentsWithCourse = students.map((student) => {
    const matchingItemB = courses.find(
      (course) => student._id.toString() === course.student_id.toString()
    );
    if (matchingItemB) {
      return { ...student, courses: matchingItemB };
    } else {
      return { ...student };
    }
  });
  const students_new = [];
  for (let j = 0; j < studentsWithCourse.length; j += 1) {
    students_new.push(add_portals_registered_status(studentsWithCourse[j]));
  }
  res.status(200).send({ success: true, data: students_new });
  next();
});

const getAllStudents = asyncHandler(async (req, res, next) => {
  const students = await Student.find()
    .populate('agents editors', 'firstname lastname email')
    .populate('applications.programId')
    .populate(
      'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
      '-messages'
    )
    .select(
      '-notification +applications.portal_credentials.application_portal_a.account +applications.portal_credentials.application_portal_a.password +applications.portal_credentials.application_portal_b.account +applications.portal_credentials.application_portal_b.password'
    )
    .lean();

  res.status(200).send({ success: true, data: students });
  next();
});

const getStudents = asyncHandler(async (req, res, next) => {
  const {
    user
    // params: { userId },
  } = req;
  if (user.role === Role.Admin) {
    const students = await Student.find({
      $or: [{ archiv: { $exists: false } }, { archiv: false }]
    })
      .populate('agents editors', 'firstname lastname email')
      .populate('applications.programId')
      .populate(
        'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
        '-messages'
      )
      .select(
        '-notification +applications.portal_credentials.application_portal_a.account +applications.portal_credentials.application_portal_a.password +applications.portal_credentials.application_portal_b.account +applications.portal_credentials.application_portal_b.password'
      )
      .lean();
    const courses = await Course.find().select('-table_data_string').lean();
    // Perform the join
    const studentsWithCourse = students.map((student) => {
      const matchingItemB = courses.find(
        (course) => student._id.toString() === course.student_id.toString()
      );
      if (matchingItemB) {
        return { ...student, courses: matchingItemB };
      } else {
        return { ...student };
      }
    });
    const students_new = [];
    for (let j = 0; j < studentsWithCourse.length; j += 1) {
      students_new.push(add_portals_registered_status(studentsWithCourse[j]));
    }
    res.status(200).send({ success: true, data: students_new });
  } else if (user.role === Role.Manager) {
    let students = [];
    // TODO: depends on manager type
    if (user.manager_type === ManagerType.Agent) {
      students = await Student.find({
        agents: { $in: user.agents },
        $or: [{ archiv: { $exists: false } }, { archiv: false }]
      })
        .populate('agents editors', 'firstname lastname email')
        .populate('applications.programId')
        .populate(
          'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
          '-messages'
        )
        .select(
          '-notification +applications.portal_credentials.application_portal_a.account +applications.portal_credentials.application_portal_a.password +applications.portal_credentials.application_portal_b.account +applications.portal_credentials.application_portal_b.password'
        )
        .lean();
    }
    if (user.manager_type === ManagerType.Editor) {
      students = await Student.find({
        editors: { $in: user.editors },
        $or: [{ archiv: { $exists: false } }, { archiv: false }]
      })
        .populate('agents editors', 'firstname lastname email')
        .populate('applications.programId')
        .populate(
          'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
          '-messages'
        )
        .select(
          '-notification +applications.portal_credentials.application_portal_a.account +applications.portal_credentials.application_portal_a.password +applications.portal_credentials.application_portal_b.account +applications.portal_credentials.application_portal_b.password'
        )
        .lean();
    }
    if (user.manager_type === ManagerType.AgentAndEditor) {
      students = await Student.find({
        $and: [
          {
            $or: [
              { agents: { $in: user.agents } },
              { editors: { $in: user.editors } }
            ]
          },
          { $or: [{ archiv: { $exists: false } }, { archiv: false }] }
        ]
      })
        .populate('agents editors', 'firstname lastname email')
        .populate('applications.programId')
        .populate(
          'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
          '-messages'
        )
        .select(
          '-notification +applications.portal_credentials.application_portal_a.account +applications.portal_credentials.application_portal_a.password +applications.portal_credentials.application_portal_b.account +applications.portal_credentials.application_portal_b.password'
        )
        .lean();
    }
    const courses = await Course.find().select('-table_data_string').lean();
    // Perform the join
    const studentsWithCourse = students.map((student) => {
      const matchingItemB = courses.find(
        (course) => student._id.toString() === course.student_id.toString()
      );
      if (matchingItemB) {
        return { ...student, courses: matchingItemB };
      } else {
        return { ...student };
      }
    });
    const students_new = [];
    for (let j = 0; j < studentsWithCourse.length; j += 1) {
      students_new.push(add_portals_registered_status(studentsWithCourse[j]));
    }
    res.status(200).send({
      success: true,
      data: students_new,
      notification: user.agent_notification
    });
  } else if (user.role === Role.Agent) {
    const students = await Student.find({
      agents: user._id,
      $or: [{ archiv: { $exists: false } }, { archiv: false }]
    })
      .populate('agents editors', 'firstname lastname email')
      .populate('applications.programId')
      .populate(
        'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
        '-messages'
      )
      .select(
        '-notification +applications.portal_credentials.application_portal_a.account +applications.portal_credentials.application_portal_a.password +applications.portal_credentials.application_portal_b.account +applications.portal_credentials.application_portal_b.password'
      )
      .lean();
    const courses = await Course.find().select('-table_data_string').lean();
    // Perform the join
    const studentsWithCourse = students.map((student) => {
      const matchingItemB = courses.find(
        (course) => student._id.toString() === course.student_id.toString()
      );
      if (matchingItemB) {
        return { ...student, courses: matchingItemB };
      } else {
        return { ...student };
      }
    });
    const students_new = [];
    for (let j = 0; j < studentsWithCourse.length; j += 1) {
      students_new.push(add_portals_registered_status(studentsWithCourse[j]));
    }
    res.status(200).send({
      success: true,
      data: students_new,
      notification: user.agent_notification
    });
  } else if (user.role === Role.Editor) {
    const permissions = await Permission.findOne({ user_id: user._id });
    if (permissions && permissions.canAssignEditors) {
      const students = await Student.find({
        $or: [{ archiv: { $exists: false } }, { archiv: false }]
      })
        .populate('agents editors', 'firstname lastname email')
        .populate('applications.programId')
        .populate(
          'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
          '-messages'
        )
        .select('-notification');

      res.status(200).send({ success: true, data: students });
    } else {
      const students = await Student.find({
        editors: user._id,
        $or: [{ archiv: { $exists: false } }, { archiv: false }]
      })
        .populate('agents editors', 'firstname lastname email')
        .populate('applications.programId')
        .populate(
          'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
          '-messages'
        )
        .select('-notification');

      res.status(200).send({ success: true, data: students });
    }
  } else if (user.role === Role.Student) {
    const student = await Student.findById(user._id.toString())
      .populate('applications.programId')
      .populate('agents editors', '-students')
      .populate(
        'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
        '-messages'
      )
      .select(
        '+applications.portal_credentials.application_portal_a.account +applications.portal_credentials.application_portal_a.password +applications.portal_credentials.application_portal_b.account +applications.portal_credentials.application_portal_b.password'
      )
      .lean();

    const student_new = add_portals_registered_status(student);
    // TODO Get My Courses
    let isCoursesFilled = true;
    const courses = await Course.findOne({
      student_id: user._id.toString()
    }).lean();
    if (!courses) {
      isCoursesFilled = false;
    }
    res
      .status(200)
      .send({ success: true, data: [student_new], isCoursesFilled });
  } else {
    // Guest
    res.status(200).send({ success: true, data: [user] });
  }
  next();
});

const getStudentsAndDocLinks = asyncHandler(async (req, res, next) => {
  const { user } = req;
  if (user.role === Role.Admin) {
    const students = await Student.find({
      $or: [{ archiv: { $exists: false } }, { archiv: false }]
    })
      .select('firstname lastname profile')
      .lean();
    res.status(200).send({ success: true, data: students, base_docs_link: {} });
  } else if (user.role === Role.Agent) {
    const students = await Student.find({
      agents: user._id,
      $or: [{ archiv: { $exists: false } }, { archiv: false }]
    })
      .select('firstname lastname profile')
      .lean()
      .exec();

    // res.status(200).send({ success: true, data: students, base_docs_link });
    res.status(200).send({ success: true, data: students, base_docs_link: {} });
  } else if (user.role === Role.Editor) {
    const students = await Student.find({
      editors: user._id,
      $or: [{ archiv: { $exists: false } }, { archiv: false }]
    })
      .select('firstname lastname profile')
      .select('-notification');
    const base_docs_link = await Basedocumentationslink.find({
      category: 'base-documents'
    });

    res.status(200).send({ success: true, data: students, base_docs_link });
  } else if (user.role === Role.Student) {
    const obj = user.notification; // create object
    obj['isRead_base_documents_rejected'] = true; // set value
    await Student.findByIdAndUpdate(
      user._id.toString(),
      { notification: obj },
      {}
    );
    const student = await Student.findById(user._id.toString())
      .select('firstname lastname profile')
      .lean()
      .exec();
    const base_docs_link = await Basedocumentationslink.find({
      category: 'base-documents'
    });
    res.status(200).send({ success: true, data: [student], base_docs_link });
  } else {
    // Guest
    res.status(200).send({ success: true, data: [user] });
  }
  next();
});

const getArchivStudent = asyncHandler(async (req, res, next) => {
  const {
    params: { studentId }
  } = req;

  const students = await Student.find({
    _id: studentId,
    archiv: true
  }).populate('applications.programId agents editors');
  // .lean();
  res.status(200).send({ success: true, data: students[0] });
  next();
});

// () TODO email : agent better notification! (only added or removed should be informed.)
// (O) email : inform student close service
// (O) email : inform editor that student is archived.
const updateStudentsArchivStatus = asyncHandler(async (req, res, next) => {
  const {
    user,
    params: { studentId },
    body: { isArchived }
  } = req;

  // TODO: data validation for isArchived and studentId
  const student = await Student.findByIdAndUpdate(
    studentId,
    {
      archiv: isArchived
    },
    { new: true, strict: false }
  )
    .populate('agents editors', 'firstname lastname email')
    .lean()
    .exec();
  if (isArchived) {
    // return dashboard students
    if (user.role === Role.Admin) {
      const students = await Student.find({
        $or: [{ archiv: { $exists: false } }, { archiv: false }]
      })
        .populate('agents editors', 'firstname lastname email')
        .populate('applications.programId')
        .populate(
          'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
          '-messages'
        )
        .select(
          '-notification +applications.portal_credentials.application_portal_a.account +applications.portal_credentials.application_portal_a.password +applications.portal_credentials.application_portal_b.account +applications.portal_credentials.application_portal_b.password'
        )
        .lean();

      res.status(200).send({ success: true, data: students });
    } else if (user.role === Role.Agent) {
      const permissions = await Permission.findOne({ user_id: user._id });
      if (permissions && permissions.canAssignAgents) {
        console.log('with permission');
        console.log(permissions);
        const students = await Student.find({
          $or: [{ archiv: { $exists: false } }, { archiv: false }]
        })
          .populate('agents editors', 'firstname lastname email')
          .populate('applications.programId')
          .populate(
            'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
            '-messages'
          )
          .select('-notification');

        res.status(200).send({ success: true, data: students });
      } else {
        const students = await Student.find({
          agents: user._id,
          $or: [{ archiv: { $exists: false } }, { archiv: false }]
        })
          .populate('agents editors', 'firstname lastname email')
          .populate('applications.programId')
          .populate(
            'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
            '-messages'
          )
          .select(
            '-notification +applications.portal_credentials.application_portal_a.account +applications.portal_credentials.application_portal_a.password +applications.portal_credentials.application_portal_b.account +applications.portal_credentials.application_portal_b.password'
          )
          .lean();
        res.status(200).send({ success: true, data: students });
      }
    } else if (user.role === Role.Editor) {
      const students = await Student.find({
        editors: user._id,
        $or: [{ archiv: { $exists: false } }, { archiv: false }]
      })
        .populate('agents editors', 'firstname lastname email')
        .populate('applications.programId')
        .populate(
          'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
          '-messages'
        )
        .select(
          '-notification +applications.portal_credentials.application_portal_a.account +applications.portal_credentials.application_portal_a.password +applications.portal_credentials.application_portal_b.account +applications.portal_credentials.application_portal_b.password'
        )
        .lean();
      res.status(200).send({ success: true, data: students });
    }
    // (O): send editor email.
    for (let i = 0; i < student.editors.length; i += 1) {
      await informEditorArchivedStudentEmail(
        {
          firstname: student.editors[i].firstname,
          lastname: student.editors[i].lastname,
          address: student.editors[i].email
        },
        {
          std_firstname: student.firstname,
          std_lastname: student.lastname
        }
      );
    }
    await informStudentArchivedStudentEmail(
      {
        firstname: student.firstname,
        lastname: student.lastname,
        address: student.email
      },
      { student }
    );
  } else {
    if (user.role === Role.Admin) {
      const students = await Student.find({ archiv: true })
        .populate('applications.programId agents editors')
        .lean();
      res.status(200).send({ success: true, data: students });
    } else if (user.role === Role.Agent) {
      const students = await Student.find({
        agents: user._id,
        archiv: true
      })
        .populate('applications.programId agents editors')
        .lean()
        .exec();

      res.status(200).send({ success: true, data: students });
    } else if (user.role === Role.Editor) {
      const students = await Student.find({
        editors: user._id,
        archiv: true
      }).populate('applications.programId');
      res.status(200).send({ success: true, data: students });
    } else {
      // Guest
      res.status(200).send({ success: true, data: [] });
    }
  }
  next();
});

// (O) email : agent better notification! (only added should be informed.)
// () TODO email : student better notification ()
const assignAgentToStudent = asyncHandler(async (req, res, next) => {
  const {
    params: { studentId },
    body: agentsId // agentsId is json (or agentsId array with boolean)
  } = req;
  const student = await Student.findById(studentId);
  // TODO: data validation for studentId, agentsId
  const agentsId_arr = Object.keys(agentsId);
  let updated_agent_id = [];
  let before_change_agent_arr = student.agents;
  let to_be_informed_agents = [];
  let updated_agent = [];
  for (let i = 0; i < agentsId_arr.length; i += 1) {
    if (agentsId[agentsId_arr[i]]) {
      updated_agent_id.push(agentsId_arr[i]);
      const agent = await Agent.findById(agentsId_arr[i]);
      updated_agent.push({
        firstname: agent.firstname,
        lastname: agent.lastname,
        email: agent.email
      });
      if (!before_change_agent_arr.includes(agentsId_arr[i])) {
        to_be_informed_agents.push({
          firstname: agent.firstname,
          lastname: agent.lastname,
          archiv: agent.archiv,
          email: agent.email
        });
      }
    }
  }

  if (updated_agent_id.length > 0) {
    student.notification.isRead_new_agent_assigned = false;
  }
  student.agents = updated_agent_id;
  await student.save();

  const student_upated = await Student.findById(studentId)
    .populate('applications.programId agents editors')
    .populate(
      'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
      '-messages'
    )
    .exec();
  res.status(200).send({ success: true, data: student_upated });

  for (let i = 0; i < to_be_informed_agents.length; i += 1) {
    if (isNotArchiv(student)) {
      if (isNotArchiv(to_be_informed_agents[i])) {
        await informAgentNewStudentEmail(
          {
            firstname: to_be_informed_agents[i].firstname,
            lastname: to_be_informed_agents[i].lastname,
            address: to_be_informed_agents[i].email
          },
          {
            std_firstname: student.firstname,
            std_lastname: student.lastname,
            std_id: student._id.toString()
          }
        );
      }
    }
  }
  if (updated_agent.length !== 0) {
    if (isNotArchiv(student)) {
      await informStudentTheirAgentEmail(
        {
          firstname: student.firstname,
          lastname: student.lastname,
          address: student.email
        },
        {
          agents: updated_agent
        }
      );
    }
  }
  next();
});

// () TODO email : agent better notification
// () TODO email : student better notification
const assignEditorToStudent = asyncHandler(async (req, res, next) => {
  const {
    params: { studentId },
    body: editorsId
  } = req;
  const keys = Object.keys(editorsId);
  const student = await Student.findById(studentId);
  // TODO: data validation for studentId, editorsId
  let updated_editor_id = [];
  let before_change_editor_arr = student.editors;
  let to_be_informed_editors = [];
  let updated_editor = [];
  for (let i = 0; i < keys.length; i += 1) {
    if (editorsId[keys[i]]) {
      updated_editor_id.push(keys[i]);
      const editor = await Editor.findById(keys[i]);
      updated_editor.push({
        firstname: editor.firstname,
        lastname: editor.lastname,
        email: editor.email
      });
      if (!before_change_editor_arr.includes(keys[i])) {
        to_be_informed_editors.push({
          firstname: editor.firstname,
          lastname: editor.lastname,
          archiv: editor.archiv,
          email: editor.email
        });
      }
    }
  }

  student.notification.isRead_new_editor_assigned = false;
  student.editors = updated_editor_id;
  await student.save();

  const student_upated = await Student.findById(studentId)
    .populate('applications.programId agents editors')
    .populate(
      'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
      '-messages'
    )
    .exec();

  res.status(200).send({ success: true, data: student_upated });

  for (let i = 0; i < to_be_informed_editors.length; i += 1) {
    if (isNotArchiv(student)) {
      if (isNotArchiv(to_be_informed_editors[i])) {
        await informEditorNewStudentEmail(
          {
            firstname: to_be_informed_editors[i].firstname,
            lastname: to_be_informed_editors[i].lastname,
            address: to_be_informed_editors[i].email
          },
          {
            std_firstname: student.firstname,
            std_lastname: student.lastname,
            std_id: student._id.toString()
          }
        );
      }
    }
  }
  // TODO: inform Agent for assigning editor.
  for (let i = 0; i < student_upated.agents.length; i += 1) {
    if (isNotArchiv(student)) {
      if (isNotArchiv(student_upated.agents[i])) {
        await informAgentStudentAssignedEmail(
          {
            firstname: student_upated.agents[i].firstname,
            lastname: student_upated.agents[i].lastname,
            address: student_upated.agents[i].email
          },
          {
            std_firstname: student.firstname,
            std_lastname: student.lastname,
            std_id: student._id.toString(),
            editors: student_upated.editors
          }
        );
      }
    }
  }

  if (updated_editor.length !== 0) {
    if (isNotArchiv(student)) {
      await informStudentTheirEditorEmail(
        {
          firstname: student.firstname,
          lastname: student.lastname,
          address: student.email
        },
        {
          editors: updated_editor
        }
      );
    }
  }
  next();
});

const ToggleProgramStatus = asyncHandler(async (req, res, next) => {
  const {
    params: { studentId, program_id }
  } = req;

  const student = await Student.findById(studentId)
    .populate('applications.programId agents editors')
    .populate(
      'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
      '-messages'
    );
  if (!student) {
    logger.error('ToggleProgramStatus: Invalid student id');
    throw new ErrorResponse(403, 'Invalid student id');
  }

  const application = student.applications.find(
    ({ programId }) => programId._id.toString() === program_id
  );
  if (!application) {
    logger.error('ToggleProgramStatus: Invalid application id');
    throw new ErrorResponse(403, 'Invalid application id');
  }
  application.closed = application.closed === 'O' ? '-' : 'O';
  await student.save();

  res.status(201).send({ success: true, data: student });
  next();
});

const getStudentApplications = asyncHandler(async (req, res, next) => {
  const {
    params: { studentId }
  } = req;
  const student = await Student.findById(studentId)
    .select('applications.programId')
    .populate('applications.programId', 'school program_name degree semester');
  if (!student) {
    logger.error('getStudentApplications: no such student');
    throw new ErrorResponse(404, `getStudentApplications: no such student`);
  }
  res.status(201).send({ success: true, data: student.applications });
});

// (O) email : student notification
// (O) auto-create document thread for student: ML,RL,Essay
// (if applicable, depending on program list)
// TODO: race condition risk (when send 2 api call concurrently)
const createApplication = asyncHandler(async (req, res, next) => {
  const {
    user,
    params: { studentId },
    body: { program_id_set }
  } = req;
  // Limit the number of assigning programs
  const max_application = 20;
  if (program_id_set.length > max_application) {
    logger.error(
      'createApplication: too much program assigned: ',
      program_id_set.length
    );
    throw new ErrorResponse(
      400,
      `You assign too many programs to student. Please select max. ${max_application} programs.`
    );
  }
  const student = await Student.findById(studentId);
  const program_ids = await Program.find({ _id: { $in: program_id_set } });
  if (program_ids.length !== program_id_set.length) {
    logger.error('createApplication: some program_ids invalid');
    throw new ErrorResponse(
      400,
      'Some Programs are out-of-date. Please refresh the page.'
    );
  }
  // limit the number in students application.
  if (student.applications.length + program_id_set.length > max_application) {
    logger.error(
      `${student.firstname} ${student.lastname} has more than ${max_application} programs!`
    );
    throw new ErrorResponse(
      400,
      `${student.firstname} ${student.lastname} has more than ${max_application} programs!`
    );
  }

  const programIds = student.applications.map(({ programId }) =>
    programId.toString()
  );

  // () TODO: check if the same university accept more than 1 application (different programs)
  // () TODO: differentiate the case of different year / semester?
  // () TODO: or only show warning?

  // Create programId array only new for student.
  const new_programIds = program_id_set.filter(
    (id) => !programIds.includes(id)
  );

  // Insert only new programIds for student.
  for (let i = 0; i < new_programIds.length; i += 1) {
    const application = student.applications.create({
      programId: new_programIds[i]
    });
    let program = program_ids.find(
      ({ _id }) => _id.toString() === new_programIds[i]
    );

    // Create ML task
    if (program.ml_required === 'yes') {
      const new_doc_thread = new Documentthread({
        student_id: studentId,
        file_type: 'ML',
        program_id: new_programIds[i],
        updatedAt: new Date()
      });
      const temp = application.doc_modification_thread.create({
        doc_thread_id: new_doc_thread._id,
        updatedAt: new Date(),
        createdAt: new Date()
      });

      temp.student_id = studentId;
      application.doc_modification_thread.push(temp);
      await new_doc_thread.save();
    }
    // check if RL required, if yes, create new thread
    if (
      program.rl_required !== undefined &&
      Number.isInteger(parseInt(program.rl_required)) >= 0
    ) {
      // TODO: if no specific requirement,

      if (!program.rl_requirements) {
        // check if general RL is created, if not, create ones!
        if (!student.generaldocs_threads.find((thread) => thread.file_type)) {
          // TODO: create general tasks, WARNING: be careful of racing condition.
          console.log('Create general RL tasks!');
        }
        // if general existed, then do nothing.
      } else {
        // TODO: with requirements, create special tasks! WARNING: be careful of racing condition.
        console.log('Create specific RL tasks!');
      }

      for (let j = 0; j < parseInt(program.rl_required); j += 1) {
        const new_doc_thread = new Documentthread({
          student_id: studentId,
          file_type: RLs_CONSTANT[j],
          program_id: new_programIds[i],
          updatedAt: new Date()
        });
        const temp = application.doc_modification_thread.create({
          doc_thread_id: new_doc_thread._id,
          updatedAt: new Date(),
          createdAt: new Date()
        });

        temp.student_id = studentId;
        application.doc_modification_thread.push(temp);
        await new_doc_thread.save();
      }
    }
    // Create essay task
    if (program.essay_required === 'yes') {
      const new_doc_thread = new Documentthread({
        student_id: studentId,
        file_type: 'Essay',
        program_id: new_programIds[i],
        updatedAt: new Date()
      });
      const temp = application.doc_modification_thread.create({
        doc_thread_id: new_doc_thread._id,
        updatedAt: new Date(),
        createdAt: new Date()
      });

      temp.student_id = studentId;
      application.doc_modification_thread.push(temp);
      await new_doc_thread.save();
    }
    // Create portfolio task
    if (program.portfolio_required === 'yes') {
      const new_doc_thread = new Documentthread({
        student_id: studentId,
        file_type: 'Portfolio',
        program_id: new_programIds[i],
        updatedAt: new Date()
      });
      const temp = application.doc_modification_thread.create({
        doc_thread_id: new_doc_thread._id,
        updatedAt: new Date(),
        createdAt: new Date()
      });

      temp.student_id = studentId;
      application.doc_modification_thread.push(temp);
      await new_doc_thread.save();
    }
    // Create supplementary form task
    if (program.supplementary_form_required === 'yes') {
      const new_doc_thread = new Documentthread({
        student_id: studentId,
        file_type: 'Supplementary_Form',
        program_id: new_programIds[i],
        updatedAt: new Date()
      });
      const temp = application.doc_modification_thread.create({
        doc_thread_id: new_doc_thread._id,
        updatedAt: new Date(),
        createdAt: new Date()
      });

      temp.student_id = studentId;
      application.doc_modification_thread.push(temp);
      await new_doc_thread.save();
    }
    student.notification.isRead_new_programs_assigned = false;
    student.applications.push(application);
  }
  await student.save();

  res.status(201).send({ success: true, data: program_id_set });

  if (isNotArchiv(student)) {
    await createApplicationToStudentEmail(
      {
        firstname: student.firstname,
        lastname: student.lastname,
        address: student.email
      },
      {
        agent_firstname: user.firstname,
        agent_lastname: user.lastname,
        programs: program_ids
      }
    );
  }
  next();
});

// () TODO email : agent notification
// () TODO email : student notification
const deleteApplication = asyncHandler(async (req, res, next) => {
  const {
    params: { studentId, program_id }
  } = req;

  // retrieve studentId differently depend on if student or Admin/Agent uploading the file
  const student = await Student.findById(studentId)
    .populate('agents editors', 'firstname lastname email')
    .populate('applications.programId')
    .populate(
      'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id'
    )
    .lean();
  if (!student) {
    logger.error('deleteApplication: Invalid student id');
    throw new ErrorResponse(403, 'Invalid student id');
  }

  const application = student.applications.find(
    ({ programId }) => programId._id.toString() === program_id
  );
  if (!application) {
    logger.error('deleteApplication: Invalid application id');
    throw new ErrorResponse(403, 'Invalid application id');
  }

  // checking if delete is safe?
  for (let i = 0; i < application.doc_modification_thread.length; i += 1) {
    if (
      application.doc_modification_thread[i].doc_thread_id.messages.length !== 0
    ) {
      throw new ErrorResponse(
        409,
        `Some ML/RL/Essay discussion threads are existed and not empty. 
        Please make sure the non-empty discussion threads are ready to be deleted and delete those thread first and then delete this application.`
      );
    }
  }
  try {
    // remove uploaded files before remove program in database
    let messagesThreadId;
    for (let i = 0; i < application.doc_modification_thread.length; i += 1) {
      messagesThreadId =
        application.doc_modification_thread[i].doc_thread_id._id.toString();
      logger.info('Trying to delete message threads and S3 thread folders');
      // Because there are no non-empty threads. Safe to delete application.

      await Documentthread.findByIdAndDelete(messagesThreadId);
      await Student.findOneAndUpdate(
        { _id: studentId, 'applications.programId': program_id },
        {
          $pull: {
            'applications.$.doc_modification_thread': {
              doc_thread_id: { _id: messagesThreadId }
            }
          }
        }
      );
    }
    // TODO: delete VPD

    const student_updated = await Student.findByIdAndUpdate(
      studentId,
      {
        $pull: { applications: { programId: { _id: program_id } } }
      },
      { new: true }
    ).populate('applications.programId');
    res.status(200).send({ success: true, data: student_updated.applications });
  } catch (err) {
    logger.error('Your Application folder not empty!', err);
    throw new ErrorResponse(500, 'Your Application folder not empty!');
  }
  next();
});

module.exports = {
  getStudent,
  getStudentAndDocLinks,
  updateDocumentationHelperLink,
  getAllArchivStudents,
  getAllActiveStudents,
  getAllStudents,
  getStudents,
  getStudentsAndDocLinks,
  getArchivStudent,
  updateStudentsArchivStatus,
  assignAgentToStudent,
  assignEditorToStudent,
  ToggleProgramStatus,
  getStudentApplications,
  createApplication,
  deleteApplication
};
