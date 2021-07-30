const Student = require("../models/Students");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

const { JWT_KEY, JWT_EXPIRY_SECONDS } = require('../config')

exports.RegisterPost = async (req, res) => {
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
      role_: "Student",
      agent_: ["liyung.chen.leo@gmail.com", "taiger.davidl@gmail.com"],
    });
    console.log(student);
    await student.save();

    return res.send({ token: token });
  } catch (e) {
    console.log("Error in RegisterPost! \n" + e);
    return res.status(401).end();
  }
};
