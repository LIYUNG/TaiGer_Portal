const _ = require('lodash');
const aws = require('aws-sdk');

const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const { User, Agent, Editor, Student, Role } = require('../models/User');
const Course = require('../models/Course');
const { Documentthread } = require('../models/Documentthread');
const { updateNotificationEmail } = require('../services/email');
const logger = require('../services/logger');

const {
  AWS_S3_ACCESS_KEY_ID,
  AWS_S3_ACCESS_KEY,
  AWS_S3_BUCKET_NAME
} = require('../config');

const s3 = new aws.S3({
  accessKeyId: AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: AWS_S3_ACCESS_KEY
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).lean();
  res.status(200).send({ success: true, data: users });
});

// (O) TODO email notify user
const updateUser = asyncHandler(async (req, res) => {
  const {
    params: { user_id }
  } = req;
  const fields = _.pick(req.body, ['name', 'email', 'role']);
  // TODO: check if email in use already and if role is valid
  if (fields.role === Role.Admin) {
    logger.warn('User role is changed to ', fields.role);
  }

  const new_user = await User.findByIdAndUpdate(user_id, fields, {
    runValidators: true,
    overwriteDiscriminatorKey: true,
    // upsert: true,
    new: true
  }).lean();

  res.status(200).send({ success: true, data: new_user });
  // Email inform user, the updated status
  await updateNotificationEmail(
    {
      firstname: new_user.firstname,
      lastname: new_user.lastname,
      address: new_user.email
    },
    {}
  );
});

// () TODO: delete user without deleting their files causing storage leak
const deleteUser = asyncHandler(async (req, res) => {
  const {
    params: { user_id }
  } = req;
  const user_deleting = await User.findById(user_id);

  // delete from agent/editor
  if (user_deleting.role === Role.Agent) {
    // remove agent from students
    const students = await Student.updateMany(
      {
        agents: { $in: user_id }
      },
      {
        $pull: { agents: user_id }
      },
      { multi: true }
    );
    await User.findByIdAndDelete(user_id);
    console.log('delete agent user');
    console.log(students);
  }

  if (user_deleting.role === Role.Editor) {
    // remove editor from students
    const students = await Student.updateMany(
      {
        editors: { $in: user_id }
      },
      {
        $pull: { editors: user_id }
      },
      { multi: true }
    );
    await User.findByIdAndDelete(user_id);
    console.log('delete editor user');
    console.log(students);
  }
  if (
    user_deleting.role === Role.Student ||
    user_deleting.role === Role.Guest
  ) {
    // TODO: delete all S3 data of the student
    // TODO: only root path of student folder is deleted. recursive (subfolder not deleted)
    logger.info('Trying to delete student and their S3 files');
    const listParams = {
      Bucket: AWS_S3_BUCKET_NAME,
      Delimiter: '/',
      Prefix: `${user_id}/`
    };
    const listedObjects = await s3.listObjectsV2(listParams).promise();
    // const listedObjects_vpd = await s3.listObjectsV2(listParams_vpd).promise();
    console.log(listedObjects);
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

    // Delete thread that user has
    await Documentthread.deleteMany({ student_id: user_id });
    console.log('Threads deleted');
    // Delete course that user has
    await Course.deleteMany({ student_id: user_id });
    console.log('Courses deleted');

    // remove student from agents
    const agents = await Agent.updateMany(
      {
        students: { $in: user_id }
      },
      {
        $pull: { students: user_id }
      },
      { multi: true }
    );
    console.log('student from agent removed');
    // remove student from editors
    const editors = await Editor.updateMany(
      {
        students: { $in: user_id }
      },
      {
        $pull: { students: user_id }
      },
      { multi: true }
    );
    console.log('student from editor removed');
    // delete user in database
    await User.findByIdAndDelete(user_id);
    console.log('studnet deleted');
  }

  // logger.warn('User is deleted');
  res.status(200).send({ success: true });
});

const getAgents = asyncHandler(async (req, res, next) => {
  const agents = await Agent.find().populate('students', '_id name');
  // if (!agents) {
  //   logger.error('getAgents : no agents');
  //   throw new ErrorResponse(400, 'no agents');
  // }
  res.status(200).send({ success: true, data: agents });
});

const getEditors = asyncHandler(async (req, res, next) => {
  const editors = await Editor.find().populate('students', '_id name');
  // if (!editors) {
  //   logger.error('getgetEditorsAgents : no editors');
  //   throw new ErrorResponse(400, 'no editors');
  // }
  res.status(200).send({ success: true, data: editors });
});

module.exports = {
  getUsers,
  updateUser,
  deleteUser,
  getAgents,
  getEditors
};
