const { ErrorResponse } = require('../common/errors');
const path = require('path');
const { asyncHandler } = require('../middlewares/error-handler');
const { Role, Agent, Student, Editor } = require('../models/User');
const { Program } = require('../models/Program');
const logger = require('../services/logger');
const aws = require('aws-sdk');

const { UPLOAD_PATH } = require('../config');
var async = require('async');
const fs = require('fs');
const {
  informAgentNewStudentEmail,
  informStudentTheirAgentEmail,
  informEditorNewStudentEmail,
  informStudentTheirEditorEmail
} = require('../services/email');

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
    user,
    params: { studentId }
  } = req;
  if (user.Role === 'Student' || user.Role === 'Guest') {
    const student = await Student.findById(user._id)
      .populate('applications.programId agents editors')
      .populate(
        'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id'
      )
      .lean();
    return res.status(200).send({ success: true, data: student });
  }
  const student = await Student.findById(studentId)
    .populate('applications.programId agents editors')
    .populate(
      'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id'
    )
    .lean();
  res.status(200).send({ success: true, data: student });
});

const getAllStudents = asyncHandler(async (req, res) => {
  const {
    user
    // params: { userId },
  } = req;
  const students = await Student.find();
  // .populate("applications.programId agents editors");
  // .lean();
  res.status(200).send({ success: true, data: students });
});

const getStudents = asyncHandler(async (req, res) => {
  const {
    user
    // params: { userId },
  } = req;
  if (user.role === 'Admin') {
    const students = await Student.find({
      $or: [{ archiv: { $exists: false } }, { archiv: false }]
    })
      .populate('applications.programId agents editors')
      .populate(
        'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id'
      )
      .lean();
    res.status(200).send({ success: true, data: students });
  } else if (user.role === 'Agent') {
    const students = await Student.find({
      _id: { $in: user.students },
      $or: [{ archiv: { $exists: false } }, { archiv: false }]
    })
      .populate('applications.programId agents editors')
      .populate(
        'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id'
      )
      .lean()
      .exec();
    // console.log(Object.entries(students[0].applications[0].programId)); // looks ok!
    // console.log(students[0].applications[0].programId); // looks ok!
    // console.log(students[0].applications[0].programId.school);

    res.status(200).send({ success: true, data: students });
  } else if (user.role === 'Editor') {
    const students = await Student.find({
      _id: { $in: user.students },
      $or: [{ archiv: { $exists: false } }, { archiv: false }]
    })
      .populate('applications.programId agents editors')
      .populate(
        'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id'
      );

    res.status(200).send({ success: true, data: students });
  } else if (user.role === 'Student') {
    const student = await Student.findById(user._id)
      .populate('applications.programId')
      .populate('agents', '-students')
      .populate('editors', '-students')
      .lean()
      .exec();
    res.status(200).send({ success: true, data: [student] });
  } else {
    // Guest
    res.status(200).send({ success: true, data: [user] });
  }
});

const getArchivStudent = asyncHandler(async (req, res) => {
  const {
    user,
    params: { studentId }
  } = req;

  if (user.role === 'Guest' || user.role === 'Student') {
    logger.error('Unauthorized access: getArchivStudent');
    throw new ErrorResponse(400, 'Unauthorized access.');
  }
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

  if (user.role === 'Admin') {
    const students = await Student.find({ archiv: true }).exec();

    res.status(200).send({ success: true, data: students });
  } else if (user.role === 'Agent') {
    const students = await Student.find({
      _id: { $in: user.students },
      archiv: true
    })
      .populate('applications.programId')
      .lean()
      .exec();

    res.status(200).send({ success: true, data: students });
  } else if (user.role === 'Editor') {
    const students = await Student.find({
      _id: { $in: user.students },
      archiv: true
    }).populate('applications.programId');
    res.status(200).send({ success: true, data: students });
  } else {
    // Guest
    res.status(200).send({ success: true, data: [] });
  }
});

const updateStudentsArchivStatus = asyncHandler(async (req, res) => {
  const {
    user,
    params: { studentId },
    body: { isArchived }
  } = req;
  if (
    user.role === 'Admin' ||
    user.role === 'Agent' ||
    user.role === 'Editor'
  ) {
    let student = await Student.findByIdAndUpdate(
      studentId,
      {
        archiv: isArchived
      },
      { strict: false }
    );
    if (isArchived) {
      // return dashboard students
      if (user.role === 'Admin') {
        const students = await Student.find({
          $or: [{ archiv: { $exists: false } }, { archiv: false }]
        })
          .populate('applications.programId agents editors')
          .lean();

        res.status(200).send({ success: true, data: students });
      } else if (user.role === 'Agent') {
        const students = await Student.find({
          _id: { $in: user.students },
          $or: [{ archiv: { $exists: false } }, { archiv: false }]
        })
          .populate('applications.programId agents editors')
          .lean()
          .exec();
        res.status(200).send({ success: true, data: students });
      } else if (user.role === 'Editor') {
        const students = await Student.find({
          _id: { $in: user.students },
          $or: [{ archiv: { $exists: false } }, { archiv: false }]
        }).populate('applications.programId agents editors');
        res.status(200).send({ success: true, data: students });
      }
    } else {
      if (user.role === 'Admin') {
        const students = await Student.find({ archiv: true })
          .populate('applications.programId agents editors')
          .lean();
        res.status(200).send({ success: true, data: students });
      } else if (user.role === 'Agent') {
        const students = await Student.find({
          _id: { $in: user.students },
          archiv: true
        })
          .populate('applications.programId agents editors')
          .lean()
          .exec();

        res.status(200).send({ success: true, data: students });
      } else if (user.role === 'Editor') {
        const students = await Student.find({
          _id: { $in: user.students },
          archiv: true
        }).populate('applications.programId');
        res.status(200).send({ success: true, data: students });
      } else {
        // Guest
        res.status(200).send({ success: true, data: [] });
      }
    }
  } else {
    // Guest
    res.status(200).send({ success: true, data: [] });
  }
});

const assignAgentToStudent = asyncHandler(async (req, res, next) => {
  const {
    params: { studentId },
    body: agentsId // agentsId is json (or agentsId array with boolean)
  } = req;
  const keys = Object.keys(agentsId);

  let updated_agent_id = [];
  let updated_agent = [];
  for (let i = 0; i < keys.length; i++) {
    if (agentsId[keys[i]]) {
      updated_agent_id.push(keys[i]);
      await Agent.findByIdAndUpdate(keys[i], {
        $addToSet: { students: studentId }
      });
      const agent = await Agent.findById(keys[i]);
      updated_agent.push({
        firstname: agent.firstname,
        lastname: agent.lastname,
        email: agent.email
      });
    } else {
      await Agent.findByIdAndUpdate(keys[i], {
        $pull: { students: studentId }
      });
    }
  }

  // if (!agentIds) throw new ErrorResponse(400, "Invalid AgentId");

  // TODO: transaction?
  // await Student.findByIdAndUpdate(studentId, {
  //   $push: { agents: agentsId },
  // });
  await Student.findByIdAndUpdate(studentId, {
    agents: updated_agent_id
  });
  const student = await Student.findById(studentId)
    .populate('applications.programId agents editors')
    .exec();
  res.status(200).send({ success: true, data: student });

  for (let i = 0; i < updated_agent.length; i++) {
    await informAgentNewStudentEmail(
      {
        firstname: updated_agent[i].firstname,
        lastname: updated_agent[i].lastname,
        address: updated_agent[i].email
      },
      {
        std_firstname: student.firstname,
        std_lastname: student.lastname
      }
    );
  }
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
  //TODO: email inform Student for(assigned agent) and inform Agent for (your new student)
});

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
      await Editor.findByIdAndUpdate(keys[i], {
        $addToSet: { students: studentId }
      });
      const editor = await Editor.findById(keys[i]);
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

  // TODO: check studentId and editorsId are valid
  // const editorsIds = await Editor.findById(({ editorsId }) => editorsId);
  // if (!editorsIds) throw new ErrorResponse(400, "Invalid editorsId");

  // // TODO: transaction?
  // await Student.findByIdAndUpdate(studentId, {
  //   $push: { editors: editorsId },
  // });

  await Student.findByIdAndUpdate(studentId, {
    editors: updated_editor_id
  });

  const student = await Student.findById(studentId)
    .populate('applications.programId agents editors')
    .exec();

  res.status(200).send({ success: true, data: student });

  for (let i = 0; i < updated_editor.length; i++) {
    await informEditorNewStudentEmail(
      {
        firstname: updated_editor[i].firstname,
        lastname: updated_editor[i].lastname,
        address: updated_editor[i].email
      },
      {
        std_firstname: student.firstname,
        std_lastname: student.lastname
      }
    );
  }
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
  // for()
  //TODO: email inform Student for(assigned editor) and inform editor for (your new student)
});

const createApplication = asyncHandler(async (req, res) => {
  const {
    user,
    params: { studentId },
    body: { program_id_set }
  } = req;
  const student = await Student.findById(studentId);
  const program = await Program.find({ _id: { $in: program_id_set } });
  if (program.length !== program_id_set.length) {
    logger.error('createApplication: some program ids invalid');
    throw new ErrorResponse(400, 'some program ids invalid');
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
      student.applications.push(application);
      //   await student.save();
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
});

const deleteApplication = asyncHandler(async (req, res, next) => {
  const {
    user,
    params: { studentId, applicationId, docName }
  } = req;
  // TODO: remove uploaded files before remove program

  // retrieve studentId differently depend on if student or Admin/Agent uploading the file
  const student = await Student.findById(studentId).populate(
    'applications.programId'
  );
  if (!student) {
    logger.error('deleteApplication: Invalid student id');
    throw new ErrorResponse(400, 'Invalid student id');
  }

  const application = student.applications.find(
    ({ programId }) => programId._id == applicationId
  );
  if (!application) {
    logger.error('deleteApplication: Invalid application id');
    throw new ErrorResponse(400, 'Invalid application id');
  }

  // TODO: iteratively to remove files
  let messagesThreadId;
  if (application) {
    for (let i = 0; i < application.doc_modification_thread.length; i += 1) {
      messagesThreadId = path.join(
        studentId,
        application.doc_modification_thread[i].doc_thread_id
      );
      logger.info('Trying to delete message thread and folder');
      messagesThreadId = messagesThreadId.replace(/\\/g, '/');

      const listParams = {
        Bucket: AWS_S3_BUCKET_NAME,
        Prefix: messagesThreadId
      };
      const listedObjects = await s3.listObjectsV2(listParams).promise();

      if (listedObjects.Contents.length > 0) {
        const deleteParams = {
          Bucket: AWS_S3_BUCKET_NAME,
          Delete: { Objects: [] }
        };

        listedObjects.Contents.forEach(({ Key }) => {
          deleteParams.Delete.Objects.push({ Key });
          logger.info('Deleting ', Key);
        });

        await s3.deleteObjects(deleteParams).promise();

        // if (listedObjects.IsTruncated) await emptyS3Directory(bucket, dir);
      }
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
      await Documentthread.findByIdAndDelete(messagesThreadId);
    }
  }
  await Student.findByIdAndUpdate(studentId, {
    $pull: { applications: { programId: { _id: applicationId } } }
  });

  const folderPath = path.join(UPLOAD_PATH, studentId, applicationId);

  try {
    // TODO: better implementation is to find all document in that folder
  } catch (err) {
    logger.error('Your Application folder not empty!', err);
    throw new ErrorResponse(500, 'Your Application folder not empty!');
  }

  res.status(200).send({ success: true });
});

module.exports = {
  getStudent,
  getAllStudents,
  getStudents,
  getArchivStudent,
  getArchivStudents,
  updateStudentsArchivStatus,
  assignAgentToStudent,
  assignEditorToStudent,
  createApplication,
  deleteApplication
};
