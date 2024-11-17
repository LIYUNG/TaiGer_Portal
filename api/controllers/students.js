const path = require('path');
const async = require('async');

const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const { Role } = require('../constants');
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
  informAgentStudentAssignedEmail,
  informAgentManagerNewStudentEmail
} = require('../services/email');

const {
  GENERAL_RLs_CONSTANT,
  RLs_CONSTANT,
  isNotArchiv,
  ManagerType,
  PROGRAM_SPECIFIC_FILETYPE
} = require('../constants');
const { getPermission } = require('../utils/queryFunctions');

const fetchStudents = asyncHandler(async (req, filter) =>
  req.db
    .model('Student')
    .find(filter)
    .populate('agents editors', 'firstname lastname email')
    .populate('applications.programId')
    .populate(
      'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
      '-messages'
    )
    .select(
      '-notification +applications.portal_credentials.application_portal_a.account +applications.portal_credentials.application_portal_a.password +applications.portal_credentials.application_portal_b.account +applications.portal_credentials.application_portal_b.password'
    )
    .lean()
);

const getStudentAndDocLinks = asyncHandler(async (req, res, next) => {
  const {
    user,
    params: { studentId }
  } = req;

  const student = await req.db
    .model('Student')
    .findById(studentId)
    .populate('agents editors', 'firstname lastname email')
    .populate('applications.programId')
    .populate({
      path: 'generaldocs_threads.doc_thread_id',
      select: 'file_type isFinalVersion updatedAt messages.file',
      populate: {
        path: 'messages.user_id',
        select: 'firstname lastname'
      }
    })
    .populate({
      path: 'applications.doc_modification_thread.doc_thread_id',
      select: 'file_type isFinalVersion updatedAt messages.file',
      populate: {
        path: 'messages.user_id',
        select: 'firstname lastname'
      }
    })
    .select(
      '-taigerai +applications.portal_credentials.application_portal_a.account +applications.portal_credentials.application_portal_a.password +applications.portal_credentials.application_portal_b.account +applications.portal_credentials.application_portal_b.password'
    )
    .lean();

  const student_new = add_portals_registered_status(student);
  const base_docs_link = await req.db.model('Basedocumentationslink').find({
    category: 'base-documents'
  });
  const survey_link = await req.db.model('Basedocumentationslink').find({
    category: 'survey'
  });

  // TODO: remove agent notfication for new documents upload

  res
    .status(200)
    .send({ success: true, data: student_new, base_docs_link, survey_link });
  if (user.role === Role.Agent) {
    await req.db.model('Agent').findByIdAndUpdate(
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
  let helper_link = await req.db
    .model('Basedocumentationslink')
    .findOneAndUpdate(
      { category, key },
      {
        $set: {
          link,
          updatedAt: new Date()
        }
      },
      { upsert: true, new: true }
    );

  const updated_helper_link = await req.db
    .model('Basedocumentationslink')
    .find({
      category
    });
  res.status(200).send({ success: true, helper_link: updated_helper_link });
  next();
});

const getAllArchivStudents = asyncHandler(async (req, res, next) => {
  const students = await fetchStudents(req, { archiv: true });

  res.status(200).send({ success: true, data: students });
  next();
});

const getAllActiveStudents = asyncHandler(async (req, res, next) => {
  const students = await fetchStudents(req, {
    $or: [{ archiv: { $exists: false } }, { archiv: false }]
  });
  const courses = await req.db
    .model('Course')
    .find()
    .select('-table_data_string')
    .lean();
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
  const students = await fetchStudents(req);

  res.status(200).send({ success: true, data: students });
  next();
});

const getStudents = asyncHandler(async (req, res, next) => {
  const { user } = req;

  if (user.role === Role.Admin) {
    const students = await fetchStudents(req, {
      $or: [{ archiv: { $exists: false } }, { archiv: false }]
    });
    const courses = await req.db
      .model('Course')
      .find()
      .select('-table_data_string')
      .lean();
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
      students = await fetchStudents(req, {
        agents: { $in: user.agents },
        $or: [{ archiv: { $exists: false } }, { archiv: false }]
      });
    }
    if (user.manager_type === ManagerType.Editor) {
      students = await fetchStudents(req, {
        editors: { $in: user.editors },
        $or: [{ archiv: { $exists: false } }, { archiv: false }]
      });
    }
    if (user.manager_type === ManagerType.AgentAndEditor) {
      students = await fetchStudents(req, {
        $and: [
          {
            $or: [
              { agents: { $in: user.agents } },
              { editors: { $in: user.editors } }
            ]
          },
          { $or: [{ archiv: { $exists: false } }, { archiv: false }] }
        ]
      });
    }
    const courses = await req.db
      .model('Course')
      .find()
      .select('-table_data_string')
      .lean();
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
    const students = await fetchStudents(req, {
      agents: user._id,
      $or: [{ archiv: { $exists: false } }, { archiv: false }]
    });
    const courses = await req.db
      .model('Course')
      .find()
      .select('-table_data_string')
      .lean();
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
    const permissions = await getPermission(req, user);
    if (permissions && permissions.canAssignEditors) {
      const students = await req.db
        .model('Student')
        .find({
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
      const students = await fetchStudents(req, {
        editors: user._id,
        $or: [{ archiv: { $exists: false } }, { archiv: false }]
      });

      res.status(200).send({ success: true, data: students });
    }
  } else if (user.role === Role.Student) {
    const student = await req.db
      .model('Student')
      .findById(user._id.toString())
      .populate('applications.programId')
      .populate('agents editors', '-students')
      .populate(
        'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
        '-messages'
      )
      .select(
        '-attributes +applications.portal_credentials.application_portal_a.account +applications.portal_credentials.application_portal_a.password +applications.portal_credentials.application_portal_b.account +applications.portal_credentials.application_portal_b.password'
      )
      .lean();
    const interviews = await req.db
      .model('Interview')
      .find({
        student_id: user._id.toString()
      })
      .populate('trainer_id', 'firstname lastname email')
      .populate('event_id')
      .lean();
    if (interviews) {
      for (let i = 0; i < student.applications?.length; i += 1) {
        if (
          interviews.some(
            (interview) =>
              interview.program_id.toString() ===
              student.applications[i].programId._id.toString()
          )
        ) {
          const interview_temp = interviews.find(
            (interview) =>
              interview.program_id.toString() ===
              student.applications[i].programId._id.toString()
          );
          student.applications[i].interview_status = interview_temp.status;
          student.applications[i].interview_trainer_id =
            interview_temp.trainer_id;
          student.applications[i].interview_training_event =
            interview_temp.event_id;
          student.applications[i].interview_id = interview_temp._id.toString();
        }
      }
    }
    const student_new = add_portals_registered_status(student);
    // TODO Get My Courses
    let isCoursesFilled = true;
    const courses = await req.db
      .model('Course')
      .findOne({
        student_id: user._id.toString()
      })
      .lean();
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
    const students = await req.db
      .model('Student')
      .find({
        $or: [{ archiv: { $exists: false } }, { archiv: false }]
      })
      .populate('agents', 'firstname lastname email')
      .select('firstname firstname_chinese lastname lastname_chinese profile')
      .lean();
    res.status(200).send({ success: true, data: students, base_docs_link: {} });
  } else if (user.role === Role.Agent) {
    const students = await req.db
      .model('Student')
      .find({
        agents: user._id,
        $or: [{ archiv: { $exists: false } }, { archiv: false }]
      })
      .populate('agents', 'firstname lastname email')
      .select('firstname firstname_chinese lastname lastname_chinese profile')
      .lean()
      .exec();

    // res.status(200).send({ success: true, data: students, base_docs_link });
    res.status(200).send({ success: true, data: students, base_docs_link: {} });
  } else if (user.role === Role.Editor) {
    const students = await req.db
      .model('Student')
      .find({
        editors: user._id,
        $or: [{ archiv: { $exists: false } }, { archiv: false }]
      })
      .populate('agents', 'firstname lastname email')
      .select('firstname firstname_chinese lastname lastname_chinese profile')
      .select('-notification');
    const base_docs_link = await req.db.model('Basedocumentationslink').find({
      category: 'base-documents'
    });

    res.status(200).send({ success: true, data: students, base_docs_link });
  } else if (user.role === Role.Student) {
    const obj = user.notification; // create object
    obj['isRead_base_documents_rejected'] = true; // set value
    await req.db
      .model('Student')
      .findByIdAndUpdate(user._id.toString(), { notification: obj }, {});
    const student = await req.db
      .model('Student')
      .findById(user._id.toString())
      .select('firstname firstname_chinese lastname lastname_chinese profile')
      .lean()
      .exec();
    const base_docs_link = await req.db.model('Basedocumentationslink').find({
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

  const students = await req.db
    .model('Student')
    .find({
      _id: studentId,
      archiv: true
    })
    .populate('applications.programId agents editors');
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
    body: { isArchived, shouldInform }
  } = req;

  // TODO: data validation for isArchived and studentId
  const student = await req.db
    .model('Student')
    .findByIdAndUpdate(
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
      const students = await fetchStudents(req, {
        $or: [{ archiv: { $exists: false } }, { archiv: false }]
      });

      res.status(200).send({ success: true, data: students });
    } else if (user.role === Role.Agent) {
      const permissions = await getPermission(req, user);
      if (permissions && permissions.canAssignAgents) {
        const students = await req.db
          .model('Student')
          .find({
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
        const students = await fetchStudents(req, {
          agents: user._id,
          $or: [{ archiv: { $exists: false } }, { archiv: false }]
        });
        res.status(200).send({ success: true, data: students });
      }
    } else if (user.role === Role.Editor) {
      const students = await fetchStudents(req, {
        editors: user._id,
        $or: [{ archiv: { $exists: false } }, { archiv: false }]
      });
      res.status(200).send({ success: true, data: students });
    }
    // (O): send editor email.
    for (let i = 0; i < student.editors.length; i += 1) {
      informEditorArchivedStudentEmail(
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
    if (shouldInform) {
      logger.info(`Inform ${student.firstname} ${student.lastname} to archive`);
      informStudentArchivedStudentEmail(
        {
          firstname: student.firstname,
          lastname: student.lastname,
          address: student.email
        },
        { student }
      );
    }
  } else {
    if (user.role === Role.Admin) {
      const students = await req.db
        .model('Student')
        .find({ archiv: true })
        .populate('applications.programId agents editors')
        .lean();
      res.status(200).send({ success: true, data: students });
    } else if (user.role === Role.Agent) {
      const students = await req.db
        .model('Student')
        .find({
          agents: user._id,
          archiv: true
        })
        .populate('applications.programId agents editors')
        .lean()
        .exec();

      res.status(200).send({ success: true, data: students });
    } else if (user.role === Role.Editor) {
      const students = await req.db
        .model('Student')
        .find({
          editors: user._id,
          archiv: true
        })
        .populate('applications.programId');
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
    user,
    params: { studentId },
    body: agentsId // agentsId is json (or agentsId array with boolean)
  } = req;

  try {
    // Data validation
    if (!studentId || !agentsId || typeof agentsId !== 'object') {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid input data.' });
    }

    // Fetch the student
    const student = await req.db
      .model('Student')
      .findById(studentId)
      .populate('agents', 'firstname lastname email')
      .lean();
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: 'Student not found.' });
    }

    // Prepare arrays
    const agentsIdArr = Object.keys(agentsId);
    const updatedAgentIds = agentsIdArr.filter((agentId) => agentsId[agentId]);

    // Fetch agents concurrently
    const agents = await Promise.all(
      updatedAgentIds.map((id) =>
        req.db
          .model('Agent')
          .findById(id)
          .select('firstname lastname email archiv')
          .lean()
      )
    );

    // Prepare data for updating
    const beforeChangeAgentArr = student.agents;

    // Create sets for easy comparison
    const previousAgentSet = new Set(
      beforeChangeAgentArr.map((agn) => agn._id.toString())
    );
    const newAgentSet = new Set(updatedAgentIds);

    // Find newly added and removed agents
    const addedAgents = agents.filter(
      (agn) => !previousAgentSet.has(agn._id.toString())
    );
    const removedAgents = beforeChangeAgentArr.filter(
      (agnt) => !newAgentSet.has(agnt._id.toString())
    );

    const toBeInformedAgents = [];
    const updatedAgents = [];

    agents.forEach((agent) => {
      if (agent) {
        updatedAgents.push({
          firstname: agent.firstname,
          lastname: agent.lastname,
          email: agent.email
        });
        if (
          !beforeChangeAgentArr
            ?.map((agn) => agn._id.toString())
            .includes(agent._id.toString())
        ) {
          toBeInformedAgents.push({
            firstname: agent.firstname,
            lastname: agent.lastname,
            archiv: agent.archiv,
            email: agent.email
          });
        }
      }
    });

    // Update student's agents
    if (addedAgents.length > 0 || removedAgents.length > 0) {
      // Log the changes here
      logger.info('Agents updated:', {
        added: addedAgents,
        removed: removedAgents
      });
      await req.db.model('Student').findByIdAndUpdate(
        studentId,
        {
          'notification.isRead_new_agent_assigned': false,
          agents: updatedAgentIds
        },
        {}
      );
    }

    // Populate the updated student data
    const studentUpdated = await req.db
      .model('Student')
      .findById(studentId)
      .populate('applications.programId agents editors')
      .populate(
        'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
        '-messages'
      )
      .lean() // Optional: Use lean for better performance
      .exec();

    res.status(200).json({ success: true, data: studentUpdated });

    // inform editor-lead
    const Permission = req.db.model('Permission');
    const permissions = await Permission.find({
      canAssignAgents: true
    })
      .populate('user_id', 'firstname lastname email')
      .lean();
    const agentLeads = permissions
      .map((permission) => permission.user_id)
      ?.filter(
        (taigerUser) => taigerUser._id.toString() !== user._id.toString()
      );

    for (const agentLead of agentLeads) {
      if (isNotArchiv(studentUpdated)) {
        if (isNotArchiv(agentLead)) {
          informAgentManagerNewStudentEmail(
            {
              firstname: agentLead.firstname,
              lastname: agentLead.lastname,
              address: agentLead.email
            },
            {
              std_firstname: studentUpdated.firstname,
              std_lastname: studentUpdated.lastname,
              std_id: studentUpdated._id.toString(),
              agents: updatedAgents
            }
          );
        }
      }
    }

    for (let i = 0; i < toBeInformedAgents.length; i += 1) {
      if (isNotArchiv(studentUpdated)) {
        if (isNotArchiv(toBeInformedAgents[i])) {
          informAgentNewStudentEmail(
            {
              firstname: toBeInformedAgents[i].firstname,
              lastname: toBeInformedAgents[i].lastname,
              address: toBeInformedAgents[i].email
            },
            {
              std_firstname: studentUpdated.firstname,
              std_lastname: studentUpdated.lastname,
              std_id: studentUpdated._id.toString()
            }
          );
        }
      }
    }

    if (updatedAgents.length !== 0) {
      if (isNotArchiv(studentUpdated)) {
        informStudentTheirAgentEmail(
          {
            firstname: studentUpdated.firstname,
            lastname: studentUpdated.lastname,
            address: studentUpdated.email
          },
          {
            agents: updatedAgents
          }
        );
      }
    }

    if (addedAgents.length > 0 || removedAgents.length > 0) {
      req.audit = {
        performedBy: user._id,
        targetUserId: studentId, // Change this if you have a different target user ID
        action: 'update', // Action performed
        field: 'agents', // Field that was updated (if applicable)
        changes: {
          before: beforeChangeAgentArr, // Before state
          after: {
            added: addedAgents,
            removed: removedAgents
          }
        }
      };
      next();
    }
  } catch (error) {
    logger.error('Error updating agents:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// () TODO email : agent better notification
// () TODO email : student better notification
const assignEditorToStudent = asyncHandler(async (req, res, next) => {
  const {
    user,
    params: { studentId },
    body: editorsId
  } = req;
  try {
    // Data validation
    if (!studentId || !editorsId || typeof editorsId !== 'object') {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid input data.' });
    }

    // Fetch the student
    const student = await req.db
      .model('Student')
      .findById(studentId)
      .populate('editors', 'firstname lastname email')
      .lean();
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: 'Student not found.' });
    }

    // Prepare arrays
    const editorsIdArr = Object.keys(editorsId);
    const updatedEditorIds = editorsIdArr.filter(
      (agentId) => editorsId[agentId]
    );

    // Fetch editors concurrently
    const editors = await Promise.all(
      updatedEditorIds.map((id) =>
        req.db
          .model('Editor')
          .findById(id)
          .select('firstname lastname email archiv')
          .lean()
      )
    );

    // Prepare data for updating
    const beforeChangeEditorArr = student.editors;

    // Create sets for easy comparison
    const previousEditorSet = new Set(
      beforeChangeEditorArr.map((editr) => editr._id.toString())
    );
    const newEditorSet = new Set(updatedEditorIds);

    // Find newly added and removed editors
    const addedEditors = editors.filter(
      (editr) => !previousEditorSet.has(editr._id.toString())
    );
    const removedEditors = beforeChangeEditorArr.filter(
      (editrt) => !newEditorSet.has(editrt._id.toString())
    );

    const toBeInformedEditors = [];
    const updatedEditors = [];

    editors.forEach((editor) => {
      if (editor) {
        updatedEditors.push({
          firstname: editor.firstname,
          lastname: editor.lastname,
          email: editor.email
        });
        if (
          !beforeChangeEditorArr
            ?.map((agn) => agn._id.toString())
            .includes(editor._id.toString())
        ) {
          toBeInformedEditors.push({
            firstname: editor.firstname,
            lastname: editor.lastname,
            archiv: editor.archiv,
            email: editor.email
          });
        }
      }
    });

    // Update student's editors
    if (addedEditors.length > 0 || removedEditors.length > 0) {
      // Log the changes here
      logger.info('Editors updated:', {
        added: addedEditors,
        removed: removedEditors
      });
      await req.db.model('Student').findByIdAndUpdate(
        studentId,
        {
          'notification.isRead_new_agent_assigned': false,
          editors: updatedEditorIds
        },
        {}
      );
    }

    // Populate the updated student data
    const studentUpdated = await req.db
      .model('Student')
      .findById(studentId)
      .populate('applications.programId agents editors')
      .populate(
        'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
        '-messages'
      )
      .lean() // Optional: Use lean for better performance
      .exec();

    res.status(200).json({ success: true, data: studentUpdated });

    // -------------------------------------

    for (let i = 0; i < toBeInformedEditors.length; i += 1) {
      if (isNotArchiv(student)) {
        if (isNotArchiv(toBeInformedEditors[i])) {
          informEditorNewStudentEmail(
            {
              firstname: toBeInformedEditors[i].firstname,
              lastname: toBeInformedEditors[i].lastname,
              address: toBeInformedEditors[i].email
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
    for (let i = 0; i < studentUpdated.agents.length; i += 1) {
      if (isNotArchiv(student)) {
        if (isNotArchiv(studentUpdated.agents[i])) {
          informAgentStudentAssignedEmail(
            {
              firstname: studentUpdated.agents[i].firstname,
              lastname: studentUpdated.agents[i].lastname,
              address: studentUpdated.agents[i].email
            },
            {
              std_firstname: student.firstname,
              std_lastname: student.lastname,
              std_id: student._id.toString(),
              editors: studentUpdated.editors
            }
          );
        }
      }
    }

    if (updatedEditors.length !== 0) {
      if (isNotArchiv(student)) {
        await informStudentTheirEditorEmail(
          {
            firstname: student.firstname,
            lastname: student.lastname,
            address: student.email
          },
          {
            editors: updatedEditors
          }
        );
      }
    }

    if (addedEditors.length > 0 || removedEditors.length > 0) {
      req.audit = {
        performedBy: user._id,
        targetUserId: studentId, // Change this if you have a different target user ID
        action: 'update', // Action performed
        field: 'editors', // Field that was updated (if applicable)
        changes: {
          before: beforeChangeEditorArr, // Before state
          after: {
            added: addedEditors,
            removed: removedEditors
          }
        }
      };
      next();
    }
  } catch (error) {
    logger.error('Error updating editors:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

const assignAttributesToStudent = asyncHandler(async (req, res, next) => {
  const {
    params: { studentId },
    body: attributesId
  } = req;
  await req.db
    .model('Student')
    .findByIdAndUpdate(studentId, { attributes: attributesId }, {});

  const student_upated = await req.db
    .model('Student')
    .findById(studentId)
    .populate('applications.programId agents editors')
    .populate(
      'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
      '-messages'
    )
    .exec();

  res.status(200).send({ success: true, data: student_upated });
  next();
});

const ToggleProgramStatus = asyncHandler(async (req, res, next) => {
  const {
    params: { studentId, program_id }
  } = req;

  const student = await req.db
    .model('Student')
    .findById(studentId)
    .populate('applications.programId agents editors')
    .populate(
      'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
      '-messages'
    );
  if (!student) {
    logger.error('ToggleProgramStatus: Invalid student id');
    throw new ErrorResponse(404, 'Student not found');
  }

  const application = student.applications.find(
    ({ programId }) => programId._id.toString() === program_id
  );
  if (!application) {
    logger.error('ToggleProgramStatus: Invalid application id');
    throw new ErrorResponse(404, 'Application not found');
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
  const student = await req.db
    .model('Student')
    .findById(studentId)
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
  const student = await req.db.model('Student').findById(studentId);
  const program_ids = await req.db
    .model('Program')
    .find({ _id: { $in: program_id_set } });
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

    // check if RL required, if yes, create new thread
    if (
      program.rl_required !== undefined &&
      Number.isInteger(parseInt(program.rl_required)) >= 0
    ) {
      // TODO: if no specific requirement,
      const nrRLrequired = parseInt(program.rl_required);
      if (isNaN(nrRLrequired)) {
        logger.error(
          `createApplication ${new_programIds[i]}: RL required is not a number`
        );
      }
      const Documentthread = req.db.model('Documentthread');
      const isRLSpecific = program.is_rl_specific;
      const NoRLSpecificFlag =
        isRLSpecific === undefined || isRLSpecific === null;
      // create specific RL tag if flag is false, or no flag and no requirement
      if (
        isRLSpecific === false ||
        (NoRLSpecificFlag && !program.rl_requirements)
      ) {
        // check if general RL is created, if not, create ones!
        const genThreadIds = student.generaldocs_threads.map(
          (thread) => thread.doc_thread_id
        );
        const generalRLcount = await req.db
          .model('Documentthread')
          .find({
            _id: { $in: genThreadIds },
            file_type: { $regex: /Recommendation_Letter_/ }
          })
          .count();

        if (generalRLcount < nrRLrequired) {
          // create general RL tasks
          logger.info('Create general RL tasks!');
          for (let j = generalRLcount; j < nrRLrequired; j += 1) {
            const newThread = new Documentthread({
              student_id: studentId,
              file_type: GENERAL_RLs_CONSTANT[j],
              updatedAt: new Date()
            });
            const threadEntry = application.doc_modification_thread.create({
              doc_thread_id: newThread._id,
              updatedAt: new Date(),
              createdAt: new Date()
            });

            threadEntry.student_id = studentId;
            student.generaldocs_threads.push(threadEntry);
            await newThread.save();
          }
        }
      } else {
        logger.info('Create specific RL tasks!');
        for (let j = 0; j < nrRLrequired; j += 1) {
          const newThread = new Documentthread({
            student_id: studentId,
            file_type: RLs_CONSTANT[j],
            program_id: new_programIds[i],
            updatedAt: new Date()
          });
          const threadEntry = application.doc_modification_thread.create({
            doc_thread_id: newThread._id,
            updatedAt: new Date(),
            createdAt: new Date()
          });

          threadEntry.student_id = studentId;
          application.doc_modification_thread.push(threadEntry);
          await newThread.save();
        }
      }
    }

    // Create supplementary form task
    const Documentthread = req.db.model('Documentthread');

    for (const doc of PROGRAM_SPECIFIC_FILETYPE) {
      if (program[doc.required] === 'yes') {
        const new_doc_thread = new Documentthread({
          student_id: studentId,
          file_type: doc.fileType,
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
  const student = await req.db
    .model('Student')
    .findById(studentId)
    .populate('agents editors', 'firstname lastname email')
    .populate('applications.programId')
    .populate(
      'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id'
    )
    .lean();
  if (!student) {
    logger.error('deleteApplication: Invalid student id');
    throw new ErrorResponse(404, 'Student not found');
  }

  const application = student.applications.find(
    ({ programId }) => programId._id.toString() === program_id
  );
  if (!application) {
    logger.error('deleteApplication: Invalid application id');
    throw new ErrorResponse(404, 'Application not found');
  }
  const Documentthread = req.db.model('Documentthread');

  // checking if delete is safe?
  for (let i = 0; i < application.doc_modification_thread.length; i += 1) {
    if (
      application.doc_modification_thread[i].doc_thread_id.messages.length !== 0
    ) {
      logger.error(
        'deleteApplication: Some ML/RL/Essay discussion threads are existed and not empty.'
      );
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
      logger.info('Trying to delete empty threads');
      // Because there are no non-empty threads. Safe to delete application.

      await Documentthread.findByIdAndDelete(messagesThreadId);
      await req.db.model('Student').findOneAndUpdate(
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

    const student_updated = await req.db
      .model('Student')
      .findByIdAndUpdate(
        studentId,
        {
          $pull: { applications: { programId: { _id: program_id } } }
        },
        { new: true }
      )
      .populate('applications.programId');
    res.status(200).send({ success: true, data: student_updated.applications });
  } catch (err) {
    logger.error(`Your Application folder not empty! ${err}`);
    throw new ErrorResponse(500, 'Your Application folder not empty!');
  }
  next();
});

module.exports = {
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
  assignAttributesToStudent,
  ToggleProgramStatus,
  getStudentApplications,
  createApplication,
  deleteApplication
};
