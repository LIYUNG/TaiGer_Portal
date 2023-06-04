const _ = require('lodash');
const crypto = require('crypto');
const aws = require('aws-sdk');
const generator = require('generate-password');

const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const { User, Agent, Editor, Student, Role } = require('../models/User');
const Course = require('../models/Course');
const { Documentthread } = require('../models/Documentthread');
const { emptyS3Directory } = require('../utils/utils_function');
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
  AWS_S3_PUBLIC_BUCKET_NAME,
  AWS_S3_BUCKET_NAME
} = require('../config');
const { isNotArchiv } = require('../constants');

const s3 = new aws.S3({
  accessKeyId: AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: AWS_S3_ACCESS_KEY
});

const generateRandomToken = () => crypto.randomBytes(32).toString('hex');
const hashToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

// If user deleted, but some files still remain in S3, this function is to address this issue.
const UserS3GarbageCollector = async () => {
  logger.info('Trying to delete redundant file for deleted users.');
  const listParamsPublic = {
    Bucket: AWS_S3_BUCKET_NAME,
    Delimiter: '/',
    Prefix: ''
  };
  const listedObjectsPublic = await s3
    .listObjectsV2(listParamsPublic)
    .promise();
  if (listedObjectsPublic.CommonPrefixes.length > 0) {
    for (let i = 0; i < listedObjectsPublic.CommonPrefixes.length; i += 1) {
      const Obj = listedObjectsPublic.CommonPrefixes[i];
      const student_id = Obj.Prefix.replace('/', '');
      try {
        const student = await User.findById(student_id);
        if (!student) {
          // Obj.Prefix = folder_name/
          emptyS3Directory(AWS_S3_BUCKET_NAME, `${Obj.Prefix}`);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
};

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

const updateUserArchivStatus = asyncHandler(async (req, res) => {
  const {
    user,
    params: { user_id },
    body: { isArchived }
  } = req;

  // TODO: data validation for isArchived and user_id
  let updated_user = await User.findByIdAndUpdate(
    user_id,
    {
      archiv: isArchived
    },
    { new: true, strict: false }
  )
    .populate('editors')
    .lean()
    .exec();
  const users = await User.find({}).lean();
  res.status(200).send({ success: true, data: users });
});

const deleteUser = asyncHandler(async (req, res) => {
  const {
    params: { user_id }
  } = req;
  const user_deleting = await User.findById(user_id);

  // Delete Admin
  if (user_deleting.role === Role.Admin) {
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
    // Delete all S3 data of the student
    logger.info('Trying to delete student and their S3 files');
    emptyS3Directory(AWS_S3_BUCKET_NAME, `${user_id}/`);

    // Delete thread that user has
    await Documentthread.deleteMany({ student_id: user_id });
    logger.info('Threads deleted');
    // Delete course that user has
    await Course.deleteMany({ student_id: user_id });
    logger.info('Courses deleted');

    // delete user in database
    await User.findByIdAndDelete(user_id);
    logger.info('studnet deleted');
  }
  res.status(200).send({ success: true });
});

module.exports = {
  UserS3GarbageCollector,
  addUser,
  getUsers,
  updateUserArchivStatus,
  updateUser,
  deleteUser
};
