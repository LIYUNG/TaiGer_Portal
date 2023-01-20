const aws = require('aws-sdk');
const path = require('path');
const async = require('async');

const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const { Role, Agent, Student, Editor } = require('../models/User');
const { Program } = require('../models/Program');
const { Documentthread } = require('../models/Documentthread');
const { Basedocumentationslink } = require('../models/Basedocumentationslink');
const { emptyS3Directory } = require('../utils/utils_function');
const logger = require('../services/logger');

const {
  informAgentNewStudentEmail,
  informStudentTheirAgentEmail,
  informEditorNewStudentEmail,
  informStudentTheirEditorEmail,
  createApplicationToStudentEmail
} = require('../services/email');

const { RLs_CONSTANT } = require('../constants');
const {
  AWS_S3_ACCESS_KEY_ID,
  AWS_S3_ACCESS_KEY,
  AWS_S3_BUCKET_NAME
} = require('../config');

const s3 = new aws.S3({
  accessKeyId: AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: AWS_S3_ACCESS_KEY
});

const getStudent = asyncHandler(async (req, res) => {
  const {
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
});

const getStudentAndDocLinks = asyncHandler(async (req, res) => {
  const {
    params: { studentId }
  } = req;

  const student = await Student.findById(studentId)
    .populate('agents editors', 'firstname lastname email')
    .populate(
      'applications.programId',
      'school program_name toefl ielts degree semester application_deadline ml_required ml_requirements rl_required uni_assist rl_requirements essay_required essay_requirements'
    )
    .populate(
      'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
      '-messages'
    )
    .select('-taigerai')
    .lean();
  const base_docs_link = await Basedocumentationslink.find({
    category: 'base-documents'
  });
  const survey_link = await Basedocumentationslink.find({
    category: 'survey'
  });
  res
    .status(200)
    .send({ success: true, data: student, base_docs_link, survey_link });
});

const updateDocumentationHelperLink = asyncHandler(async (req, res) => {
  const {
    params: { studentId }
  } = req;
  const { link, key, category } = req.body;
  // TODO: if not in database, then create one
  // otherwise: update the existing one.
  let helper_link = await Basedocumentationslink.findOne({ category, key });
  if (!helper_link) {
    helper_link = await Basedocumentationslink.create({
      category,
      key,
      link,
      updatedAt: new Date()
    });
  } else {
    helper_link.link = link;
    helper_link.updatedAt = new Date();
    await helper_link.save();
  }
  const updated_helper_link = await Basedocumentationslink.find({
    category
  });
  res.status(200).send({ success: true, helper_link: updated_helper_link });
});

const getAllStudents = asyncHandler(async (req, res) => {
  const students = await Student.find()
    .select('firstname lastname academic_background email')
    .lean();

  res.status(200).send({ success: true, data: students });
});

const getStudents = asyncHandler(async (req, res) => {
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
      .select('-notification')
      .lean();
    res.status(200).send({ success: true, data: students });
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
      .select('-notification')
      .lean()
      .exec();
    // console.log(Object.entries(students[0].applications[0].programId)); // looks ok!
    // console.log(students[0].applications[0].programId); // looks ok!
    // console.log(students[0].applications[0].programId.school);

    res.status(200).send({ success: true, data: students });
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
      .select('-notification');

    res.status(200).send({ success: true, data: students });
  } else if (user.role === Role.Student) {
    const student = await Student.findById(user._id)
      .populate('applications.programId')
      .populate('agents editors', '-students')
      .populate(
        'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
        '-messages'
      )
      // .populate('editors', '-students')
      .lean()
      .exec();
    res.status(200).send({ success: true, data: [student] });
  } else {
    // Guest
    res.status(200).send({ success: true, data: [user] });
  }
});

const getStudentsAndDocLinks = asyncHandler(async (req, res) => {
  const { user } = req;
  if (user.role === Role.Admin) {
    const students = await Student.find({
      $or: [{ archiv: { $exists: false } }, { archiv: false }]
    })
      .select('firstname lastname profile')
      .lean();
    // const base_docs_link = await Basedocumentationslink.find({
    //   category: 'base-documents'
    // });
    // res.status(200).send({ success: true, data: students, base_docs_link });
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
    const student = await Student.findById(user._id)
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
});

const getArchivStudent = asyncHandler(async (req, res) => {
  const {
    params: { studentId }
  } = req;

  const students = await Student.find({
    _id: studentId,
    archiv: true
  }).populate('applications.programId agents editors');
  // .lean();
  res.status(200).send({ success: true, data: students[0] });
});

const getArchivStudents = asyncHandler(async (req, res) => {
  const {
    user
    // params: { userId },
  } = req;

  if (user.role === Role.Admin) {
    const students = await Student.find({ archiv: true }).exec();

    res.status(200).send({ success: true, data: students });
  } else if (user.role === Role.Agent) {
    const students = await Student.find({
      agents: user._id,
      archiv: true
    })
      .populate('applications.programId')
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
});

// () TODO email : agent better notification! (only added or removed should be informed.)
// () TODO email : student better notification
const updateStudentsArchivStatus = asyncHandler(async (req, res) => {
  const {
    user,
    params: { studentId },
    body: { isArchived }
  } = req;

  let student = await Student.findByIdAndUpdate(
    studentId,
    {
      archiv: isArchived
    },
    { new: true, strict: false }
  );
  if (isArchived) {
    // return dashboard students
    if (user.role === Role.Admin) {
      const students = await Student.find({
        $or: [{ archiv: { $exists: false } }, { archiv: false }]
      })
        .populate('applications.programId agents editors')
        .lean();

      res.status(200).send({ success: true, data: students });
    } else if (user.role === Role.Agent) {
      const students = await Student.find({
        agents: user._id,
        $or: [{ archiv: { $exists: false } }, { archiv: false }]
      })
        .populate('applications.programId agents editors')
        .lean()
        .exec();
      res.status(200).send({ success: true, data: students });
    } else if (user.role === Role.Editor) {
      const students = await Student.find({
        editors: user._id,
        $or: [{ archiv: { $exists: false } }, { archiv: false }]
      }).populate('applications.programId agents editors');
      res.status(200).send({ success: true, data: students });
    }
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
});

// () TODO email : agent better notification! (only added or removed should be informed.)
// () TODO email : student better notification ()
const assignAgentToStudent = asyncHandler(async (req, res, next) => {
  const {
    params: { studentId },
    body: agentsId // agentsId is json (or agentsId array with boolean)
  } = req;
  const agentsId_arr = Object.keys(agentsId);
  let updated_agent_id = [];
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
    }
  }

  const student = await Student.findById(studentId);
  if (updated_agent_id.length > 0) {
    student.notification.isRead_new_agent_assigned = false;
  }
  student.agents = updated_agent_id;
  await student.save();

  const student_upated = await Student.findById(studentId)
    .populate('applications.programId agents editors')
    .exec();
  res.status(200).send({ success: true, data: student_upated });

  for (let i = 0; i < updated_agent.length; i += 1) {
    await informAgentNewStudentEmail(
      {
        firstname: updated_agent[i].firstname,
        lastname: updated_agent[i].lastname,
        address: updated_agent[i].email
      },
      {
        std_firstname: student.firstname,
        std_lastname: student.lastname,
        std_id: student._id.toString()
      }
    );
  }
  if (updated_agent.length !== 0) {
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
});

// () TODO email : agent better notification
// () TODO email : student better notification
const assignEditorToStudent = asyncHandler(async (req, res, next) => {
  const {
    params: { studentId },
    body: editorsId
  } = req;
  const keys = Object.keys(editorsId);

  var updated_editor_id = [];
  var updated_editor = [];
  for (let i = 0; i < keys.length; i++) {
    // const agent = await Agent.findById(({ editorsId }) => editorsId);
    if (editorsId[keys[i]]) {
      updated_editor_id.push(keys[i]);
      const editor = await Editor.findByIdAndUpdate(
        keys[i],
        {
          $addToSet: { students: studentId }
        },
        { new: true }
      );
      updated_editor.push({
        firstname: editor.firstname,
        lastname: editor.lastname,
        email: editor.email
      });
    } else {
      await Editor.findByIdAndUpdate(keys[i], {
        $pull: { students: studentId }
      });
    }
  }

  const student = await Student.findById(studentId);
  student.notification.isRead_new_editor_assigned = false;
  student.editors = updated_editor_id;
  await student.save();

  const student_upated = await Student.findById(studentId)
    .populate('applications.programId agents editors')
    .exec();

  res.status(200).send({ success: true, data: student_upated });

  for (let i = 0; i < updated_editor.length; i += 1) {
    await informEditorNewStudentEmail(
      {
        firstname: updated_editor[i].firstname,
        lastname: updated_editor[i].lastname,
        address: updated_editor[i].email
      },
      {
        std_firstname: student.firstname,
        std_lastname: student.lastname,
        std_id: student._id.toString()
      }
    );
  }
  if (updated_editor.length !== 0) {
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
});

const ToggleProgramStatus = asyncHandler(async (req, res) => {
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
    throw new ErrorResponse(404, 'Invalid student id');
  }

  const application = student.applications.find(
    ({ programId }) => programId._id.toString() === program_id
  );
  if (!application) {
    logger.error('ToggleProgramStatus: Invalid application id');
    throw new ErrorResponse(404, 'Invalid application id');
  }
  if (application.closed === 'O') {
    application.closed = 'X';
  } else {
    application.closed = 'O';
  }
  await student.save();

  res.status(201).send({ success: true, data: student });
});
// (O) email : student notification
// (O) TODO: auto-create document thread for student: ML,RL,Essay
// (if applicable, depending on program list)
const createApplication = asyncHandler(async (req, res) => {
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
    throw new ErrorResponse(400, 'some program_ids invalid');
  }
  // limit the number in students application.
  if (student.applications.length + program_id_set.length > max_application) {
    logger.error('createApplication: some program ids invalid');
    throw new ErrorResponse(
      400,
      `${student.firstname} ${student.lastname} has more than ${max_application} programs!`
    );
  }
  try {
    const programIds = student.applications.map(({ programId }) =>
      programId._id.toString()
    );

    // Create programId array only new for student.
    const new_programIds = [];
    for (let i = 0; i < program_id_set.length; i += 1) {
      // if new for student, push it in array.
      if (!programIds.includes(program_id_set[i])) {
        new_programIds.push(program_id_set[i]);
      }
    }

    // Insert only new programIds for student.
    for (let i = 0; i < new_programIds.length; i += 1) {
      const application = student.applications.create({
        programId: new_programIds[i]
      });
      let program = program_ids.find(
        ({ _id }) => _id.toString() === new_programIds[i]
      );
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
      // TODO: check if RL required, if yes, create new thread
      if (
        program.rl_required !== undefined &&
        Number.isInteger(parseInt(program.rl_required)) >= 0
      ) {
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
      student.notification.isRead_new_programs_assigned = false;
      student.applications.push(application);
    }
    await student.save();
    //   });
    //     programId: program_id_set[i]
    //   });
    //   // const { requiredDocuments, optionalDocuments } = program;
    //   const now = new Date();
    //   const application = student.applications.create({
    //     programId: program_id_set[i]
    //   });
    //   // application.documents = [
    //   //   ...requiredDocuments.map((name) => ({
    //   //     name,
    //   //     required: true,
    //   //     updatedAt: now,
    //   //   })),
    //   //   ...optionalDocuments.map((name) => ({
    //   //     name,
    //   //     required: false,
    //   //     updatedAt: now,
    //   //   })),
    //   // ];
    //   student.applications.push(application);
    //   await student.save();
  } catch (err) {
    logger.error('createApplication: ', err);
    throw new ErrorResponse(400, err);
  }

  res.status(201).send({ success: true, data: program_id_set });

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
    throw new ErrorResponse(404, 'Invalid student id');
  }

  const application = student.applications.find(
    ({ programId }) => programId._id.toString() === program_id
  );
  if (!application) {
    logger.error('deleteApplication: Invalid application id');
    throw new ErrorResponse(404, 'Invalid application id');
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
    let directory;
    for (let i = 0; i < application.doc_modification_thread.length; i += 1) {
      messagesThreadId =
        application.doc_modification_thread[i].doc_thread_id._id.toString();
      directory = path.join(studentId, messagesThreadId);
      logger.info('Trying to delete message threads and S3 thread folders');
      directory = directory.replace(/\\/g, '/');
      // Because thread are empty: go to S3 is redundant
      // emptyS3Directory(AWS_S3_BUCKET_NAME, directory);

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
});

module.exports = {
  getStudent,
  getStudentAndDocLinks,
  updateDocumentationHelperLink,
  getAllStudents,
  getStudents,
  getStudentsAndDocLinks,
  getArchivStudent,
  getArchivStudents,
  updateStudentsArchivStatus,
  assignAgentToStudent,
  assignEditorToStudent,
  ToggleProgramStatus,
  createApplication,
  deleteApplication
};
