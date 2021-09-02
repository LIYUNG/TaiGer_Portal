const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { ErrorResponse } = require("../common/errors");
const { asyncHandler } = require("../middlewares/error-handler");
const { Role } = require("../models/User");
const Student = require("../models/Students");
const Program = require("../models/Programs");

const { JWT_KEY, JWT_EXPIRY_SECONDS } = require("../config");
const saltRounds = 10;

const signUp = async (req, res) => {
  console.log(req.body);
  const students_exists = await Student.findOne({
    emailaddress_: req.body.emailaddress,
  });
  try {
    const { emailaddress, password } = req.body;
    console.log(emailaddress);
    const token = jwt.sign({ emailaddress }, JWT_KEY, {
      algorithm: "HS256",
      expiresIn: JWT_EXPIRY_SECONDS,
    });
    // Hashing password
    console.log("token: " + token);

    const salt = await bcrypt.genSalt(saltRounds);
    // const hashedpassword = await bcrypt.hash(password1, salt);
    const hashedpassword = await bcrypt.hash(password, salt);
    const student = new Student({
      firstname_: req.body.firstname,
      lastname_: req.body.lastname,
      emailaddress_: req.body.emailaddress,
      password_: hashedpassword,
      role_: "Guest",
      agent_: [],
    });
    console.log(student);
    await student.save();

    return res.send({ token: token });
  } catch (e) {
    console.log("Error in RegisterPost! \n" + e);
    return res.status(401).end();
  }
};

const signIn = async (req, res) => {
  // console.log(req.body);
  const { emailaddress, password } = req.body;
  // Found existing users
  // const students_exists = await Student.findOne({
  //   emailaddress_: req.body.emailaddress,
  // }).select("+password_");

  let students_exists;
  try {
    students_exists = await Student.findOne({
      emailaddress_: req.body.emailaddress,
    });
  } catch (err) {
    console.log(err);
  }

  console.log(req.body);
  console.log(students_exists);
  if (!students_exists) return res.status(401).end();
  // console.log(students_exists);
  try {
    if (students_exists != null) {
      // Compare password with hashed one in db
      const password2 = students_exists.password_;
      await bcrypt.compare(password, password2, (err, data) => {
        //if error than throw error
        if (err) {
          console.log(err);
          throw err;
        }
        //if both match than you can do anything
        if (data) {
          console.log("Passwords match !");
          const token = jwt.sign({ emailaddress }, JWT_KEY, {
            algorithm: "HS256",
            expiresIn: JWT_EXPIRY_SECONDS,
          });
          console.log("Send token !");
          console.log(
            students_exists.role_ +
              " " +
              students_exists.firstname_ +
              " " +
              students_exists.lastname_ +
              " log in"
          );
          return res.status(200).send({
            token: token,
            role: students_exists.role_,
          });
        } else {
          console.log("wrong password !");
          return res.status(401).end();
          // return res.status(401).json({ msg: "Invalid credencial" });
        }
      });
    } else {
      //Error
      console.log("User not existed !");
      return res.status(401).end();
    }
  } catch (err) {
    console.log("error at signIn!");
    console.log(err);
    return res.status(401).end();
  }
};

const passwordPost = async (req, res) => {
  res.send.status(404).end();
};

const settings = async (req, res) => {
  var token = req.cookies.token;
  //Extract user email info by token
  var emailaddress = jwt_decode(token);
  //Get user email
  emailaddress = emailaddress["emailaddress"];
  const students_exists = await Student.findOne({
    emailaddress_: emailaddress,
  });
  // Renew token again, entend expire time
  token = jwt.sign({ emailaddress }, JWT_KEY, {
    algorithm: "HS256",
    expiresIn: JWT_EXPIRY_SECONDS,
  });
  console.log(students_exists);
  res.cookie("token", token, {
    maxAge: JWT_EXPIRY_SECONDS * 1000,
  });
};

const getStudents = asyncHandler(async (req, res) => {
  const { role_: role, emailaddress_: emailaddress } = req.user;

  const query = { role_: Role.Student };

  switch (role) {
    case Role.Agent: {
      const students = await Student.find({ ...query, agent_: emailaddress });
      return res.send({ data: students, role });
    }

    case Role.Admin: {
      const students = await Student.find({ ...query });
      return res.send({ data: students, role });
    }

    case Role.Editor: {
      const students = await Student.find({ ...query, editor_: emailaddress });
      return res.send({ data: students, role });
    }

    default: {
      return res.send({ data: [user], role });
    }
  }
});

const updateAgent = asyncHandler(async (req, res, next) => {
  // FIXME: the request body should just be an array of emails, require change in frontend
  // TODO: use findByIdAndUpdate
  const student = await Student.findById(req.params.id);
  if (!student) throw new ErrorResponse(400, "Invalid id");

  const agents = await Student.find({ role_: Role.Agent });
  student.agent_ = agents
    .map((agent) => agent.emailaddress_)
    .filter((email) => req.body[email]);
  await student.save();
  res.status(200).end();
});

const updateEditor = asyncHandler(async (req, res, next) => {
  // FIXME: the request body should just be an array of emails, require change in frontend
  // TODO: use findByIdAndUpdate
  const student = await Student.findById(req.params.id);
  if (!student) throw new ErrorResponse(400, "Invalid id");

  const editors = await Student.find({ role_: Role.Editor });
  student.editor_ = editors
    .map((editor) => editor.emailaddress_)
    .filter((email) => req.body[email]);
  await student.save();
  res.status(200).end();
});

const createProgram = asyncHandler(async (req, res) => {
  const { params: { studentId }, body: { programId } } = req

  const student = await Student.findById(studentId);
  if (await student.applying_program_.id(programId))
    throw new ErrorResponse(400, "Duplicate program");

  const program = await Program.findById(programId);
  student.applying_program_.push(program);
  await student.save();
  res.status(201).send({ data: "success" });
});

// TODO: edit program?

const deleteProgram = asyncHandler(async (req, res, next) => {
  const { studentId, programId } = req.params;
  // FIXME: might want to check if student really have the program, return 400 otherwise
  await Student.findByIdAndUpdate(
    studentId,
    { $pull: { applying_program_: { _id: programId } } },
    { safe: true, upsert: true }
  );
  res.status(200).end();
});

module.exports = {
  signIn,
  signUp,
  passwordPost,
  settings,
  // student APIs
  getStudents,
  updateAgent,
  updateEditor,
  createProgram,
  deleteProgram,
};
