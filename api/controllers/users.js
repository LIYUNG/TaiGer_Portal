const _ = require('lodash');
const crypto = require('crypto');
const aws = require('aws-sdk');
const generator = require('generate-password');

const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const { User, Agent, Editor, Student, Guest, Role } = require('../models/User');
const Course = require('../models/Course');
const { Documentthread } = require('../models/Documentthread');
const Token = require('../models/Token');
const {
  updateNotificationEmail,
  sendInvitationEmail
} = require('../services/email');
const logger = require('../services/logger');
const {
  fieldsValidation,
  checkUserFirstname,
  checkUserLastname,
  checkEmail,
  checkPassword
} = require('../common/validation');

const {
  AWS_S3_ACCESS_KEY_ID,
  AWS_S3_ACCESS_KEY,
  AWS_S3_BUCKET_NAME
} = require('../config');

const s3 = new aws.S3({
  accessKeyId: AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: AWS_S3_ACCESS_KEY
});

const generateRandomToken = () => crypto.randomBytes(32).toString('hex');
const hashToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

const addUser = asyncHandler(async (req, res) => {
  await fieldsValidation(
    checkUserFirstname,
    checkUserLastname,
    checkEmail
  )(req);

  const { firstname, lastname, email } = req.body;
  const existUser = await User.findOne({ email });
  if (existUser) {
    logger.error('addUser: An account with this email address already exists');
    throw new ErrorResponse(
      409,
      'An account with this email address already exists'
    );
  }
  // TODO: check if email address exists in the world!
  const password = generator.generate({
    length: 10,
    numbers: true
  });
  const user = await Student.create({ firstname, lastname, email, password });

  const activationToken = generateRandomToken();
  await Token.create({ userId: user._id, value: hashToken(activationToken) });

  const users = await User.find({}).lean();
  res.status(201).send({ success: true, data: users });

  await sendInvitationEmail(
    { firstname, lastname, address: email },
    { token: activationToken, password }
  );
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
  console.log(fields.role);
  // TODO: if Agent or editor change role, remove their belong students!
  // const students = await Student.updateMany(
  //   {
  //     agents: { $in: user_id }
  //   },
  //   {
  //     $pull: { agents: user_id }
  //   },
  //   { multi: true }
  // );

  const new_user = await User.findByIdAndUpdate(user_id, fields, {
    runValidators: true,
    overwriteDiscriminatorKey: true,
    // upsert: true,
    new: true
  }).lean();
  const updated_user = await User.findById(user_id);
  res.status(200).send({ success: true, data: new_user });
  console.log(updated_user);

  // Email inform user, the updated status
  await updateNotificationEmail(
    {
      firstname: updated_user.firstname,
      lastname: updated_user.lastname,
      address: updated_user.email
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

  // Delete Admin
  if (user_deleting.role === Role.Admin) {
    // remove agent from students
    // const students = await Student.updateMany(
    //   {
    //     agents: { $in: user_id },
    //   },
    //   {
    //     $pull: { agents: user_id }
    //   },
    //   { multi: true }
    // );
    await User.findByIdAndDelete(user_id);
  }

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

module.exports = {
  addUser,
  getUsers,
  updateUser,
  deleteUser
};
