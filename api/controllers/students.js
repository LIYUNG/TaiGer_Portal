const Student = require("../models/Students");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

const { JWT_KEY, JWT_EXPIRY_SECONDS } = require("../config");

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
  const students_exists = await Student.findOne({
    emailaddress_: req.body.emailaddress,
  }).select("+password_");
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

const getStudents = async (req, res) => {
  try {
    const bearer = req.headers.authorization.split(" ");
    const token = bearer[1];
    //Extract user email info by token
    var emailaddress = jwt_decode(token);
    //Get user email
    emailaddress = emailaddress["emailaddress"];
    console.log(emailaddress);
    const students_exists = await Student.findOne({
      emailaddress_: emailaddress,
    }); //get email by token

    if (students_exists.role_ === "Agent") {
      const Agent = await Student.findOne({ emailaddress_: emailaddress }); //get email by token
      const student_all = await Student.find({
        role_: "Student",
        agent_: emailaddress,
      });
      console.log(
        students_exists.role_ +
          " " +
          Agent.firstname_ +
          " " +
          Agent.lastname_ +
          " get her/his student list"
      );
      res.send({
        data: student_all,
        role: students_exists.role_,
      });
    } else if (students_exists.role_ === "Admin") {
      const student_all = await Student.find({ role_: "Student" });
      console.log("Admin get all student list");
      res.send({
        data: student_all,
        role: students_exists.role_,
      });
    } else if (students_exists.role_ === "Editor") {
      const Editor = await Student.findOne({ emailaddress_: emailaddress }); //get email by token
      const student_all = await Student.find({
        role_: "Student",
        editor_: emailaddress,
      });
      console.log(
        students_exists.role_ +
          "  " +
          Editor.firstname_ +
          " " +
          Editor.lastname_ +
          " log in"
      );
      res.send({
        data: student_all,
        role: students_exists.role_,
      });
    } else if (students_exists.role_ === "Student") {
      console.log(
        students_exists.role_ +
          " " +
          students_exists.firstname_ +
          " " +
          students_exists.lastname_ +
          " get her/his personal dashboard"
      );
      res.send({
        data: [students_exists],
        role: students_exists.role_,
      });
    } else {
      console.log(
        "Guest " +
          students_exists.firstname_ +
          " " +
          students_exists.lastname_ +
          " get her/his personal dashboard"
      );
      res.send({
        data: [students_exists],
        role: students_exists.role_,
      });
    }
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      // if the error thrown is because the JWT is unauthorized, return a 401 error
      console.log(e);
      console.log("error by studentlist");
      return res.status(500).end(); // 500 Internal Server Error
    }
    console.log(err);
    return res.status(500).end(); // 500 Internal Server Error
  }
};

const assignprogramtostudent = async (req, res) => {
  try {
    // Only Admin and Agent can assign.
    const bearer = req.headers.authorization.split(" ");
    const token = bearer[1];
    //Extract user email info by token
    var emailaddress = jwt_decode(token);
    //Get user email
    emailaddress = emailaddress["emailaddress"];
    const user_me = await Student.findOne({
      emailaddress_: emailaddress, // get current user.
    });
    if (user_me.role_ === "Admin" || user_me.role_ === "Agent") {
      console.log("edit req.body = " + req.body);
      console.log("edit req.body.program_id = " + req.body.program_id);
      const program_id = req.body.program_id;
      let program = await Program.findById(program_id);
      console.log("edit req.body.student_id = " + req.body.student_id);
      const student_id = req.body.student_id;
      var student1 = await Student.findById(student_id);
      const exist_program = await student1.applying_program_.id(program_id);
      if (exist_program === null) {
        student1.applying_program_.push(program);
        student1.save();
        console.log("success: " + program);
        res.send({
          data: "success",
        });
      } else {
        res.send({
          data: "failed",
        });
      }
    } else {
      return res.status(401).end(); // 401 Unauthorized response
    }
  } catch (err) {
    console.log("error by assigning program");
    console.log(err);
    return res.status(500).end(); // 500 Internal Server Error
  }
};

const editagent = async (req, res, next) => {
  try {
    // Only Admin can edit.
    const bearer = req.headers.authorization.split(" ");
    const token = bearer[1];
    //Extract user email info by token
    var emailaddress = jwt_decode(token);
    //Get user email
    emailaddress = emailaddress["emailaddress"];
    const user_me = await Student.findOne({
      emailaddress_: emailaddress, // get current user.
    });
    if (user_me.role_ === "Admin") {
      const Agent_all = await Student.find({ role_: "Agent" });
      console.log("get agent list success!");
      res.send({
        data: Agent_all,
      });
    } else {
      return res.status(401).end(); // 401 Unauthorized response
    }
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      // if the error thrown is because the JWT is unauthorized, return a 401 error
      console.log(e);
      console.log("error by editagent");
      return res.status(500).end(); // 500 Internal Server Error
    }
    console.log(err);
    return res.status(500).end(); // 500 Internal Server Error
  }
};

const updateagent = async (req, res, next) => {
  console.log(req.body);
  // console.log(req.params.student_id);
  try {
    // Only admin can update agent// Only Admin can edit.
    const bearer = req.headers.authorization.split(" ");
    const token = bearer[1];
    //Extract user email info by token
    var emailaddress = jwt_decode(token);
    //Get user email
    emailaddress = emailaddress["emailaddress"];
    const user_me = await Student.findOne({
      emailaddress_: emailaddress, // get current user.
    });
    if (user_me.role_ === "Admin") {
      const Agent_all = await Student.find({ role_: "Agent" });
      const student = await Student.findById(req.params.student_id);
      console.log(student._id);
      let temp_updateAgentlist = [];
      Agent_all.map((agent) =>
        // console.log(agent.emailaddress_)
        req.body[agent.emailaddress_] === undefined
          ? console.log("undefined")
          : req.body[agent.emailaddress_]
          ? temp_updateAgentlist.push(agent.emailaddress_)
          : //  var indx = await student.agent_.indexOf(agent.emailaddress_);
            // add agent student's database
            // remove agent student's database
            console.log("false")
      );
      student.agent_ = temp_updateAgentlist;
      await student.save();
      console.log("temp_updateAgentlist: " + temp_updateAgentlist);
      console.log("update agent list success!");
      res.status(200).end();
    } else {
      return res.status(401).end(); // 401 Unauthorized response
    }
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      // if the error thrown is because the JWT is unauthorized, return a 401 error
      console.log(e);
      console.log("error by update agent");
      return res.status(500).end(); // 500 Internal Server Error
    }
    console.log(err);
    return res.status(500).end(); // 500 Internal Server Error
  }
};

const editeditor = async (req, res, next) => {
  try {
    // Only Admin can edit.
    const bearer = req.headers.authorization.split(" ");
    const token = bearer[1];
    //Extract user email info by token
    var emailaddress = jwt_decode(token);
    //Get user email
    emailaddress = emailaddress["emailaddress"];
    const user_me = await Student.findOne({
      emailaddress_: emailaddress, // get current user.
    });
    if (user_me.role_ === "Admin") {
      const Editor_all = await Student.find({ role_: "Editor" });
      console.log("get editor list success!");
      res.send({
        data: Editor_all,
      });
    } else {
      return res.status(401).end(); // 401 Unauthorized response
    }
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      // if the error thrown is because the JWT is unauthorized, return a 401 error
      console.log(e);
      console.log("error by editeditor");
      return res.status(500).end(); // 500 Internal Server Error
    }
    console.log(err);
    return res.status(500).end(); // 500 Internal Server Error
  }
};

const updateeditor = async (req, res, next) => {
  console.log(req.body);

  try {
    // Only Admin can update editor
    const bearer = req.headers.authorization.split(" ");
    const token = bearer[1];
    //Extract user email info by token
    var emailaddress = jwt_decode(token);
    //Get user email
    emailaddress = emailaddress["emailaddress"];
    const user_me = await Student.findOne({
      emailaddress_: emailaddress, // get current user.
    });
    if (user_me.role_ === "Admin") {
      const Editor_All = await Student.find({ role_: "Editor" });
      const student = await Student.findById(req.params.student_id);
      console.log(student._id);
      let temp_updateEditorlist = [];
      Editor_All.map((editor) =>
        req.body[editor.emailaddress_] === undefined
          ? console.log("undefined")
          : req.body[editor.emailaddress_]
          ? temp_updateEditorlist.push(editor.emailaddress_)
          : console.log("false")
      );
      student.editor_ = temp_updateEditorlist;
      await student.save();
      console.log("temp_updateEditorlist: " + temp_updateEditorlist);
      console.log("update editor list success!");
      res.status(200).end();
    } else {
      return res.status(401).end(); // 401 Unauthorized response
    }
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      // if the error thrown is because the JWT is unauthorized, return a 401 error
      console.log(e);
      console.log("error by update editor");
      return res.status(500).end(); // 500 Internal Server Error
    }
    console.log(err);
    return res.status(500).end(); // 500 Internal Server Error
  }
};

const editstudentprogram = async (req, res, next) => {
  //TODO: only agent can update
  console.log("editstudentprogram success!");
  res.status(404).end();
};

const deleteprogramfromstudent = async (req, res, next) => {
  try {
    //Only Admin and Agent can delete
    const bearer = req.headers.authorization.split(" ");
    const token = bearer[1];
    //Extract user email info by token
    var emailaddress = jwt_decode(token);
    //Get user email
    emailaddress = emailaddress["emailaddress"];
    const user_me = await Student.findOne({
      emailaddress_: emailaddress, // get current user.
    });
    if (user_me.role_ === "Admin" || user_me.role_ === "Agent") {
      const student_id = req.params.student_id;
      const program_id = req.params.program_id;
      console.log("student id: " + student_id);
      console.log("program id: " + program_id);
      await Student.findByIdAndUpdate(
        student_id,
        { $pull: { applying_program_: { _id: program_id } } },
        { safe: true, upsert: true },
        function (err, node) {
          if (err) {
            return res.status(500).end(); // 500 Internal Server Error
          }
          return res.status(200).end();
        }
      );
    } else {
      return res.status(401).end(); // 401 Unauthorized response
    }
  } catch (err) {
    console.log("error delete file: " + err);
    return res.status(500).end(); // 500 Internal Server Error
  }
};

module.exports = {
  signIn,
  signUp,
  passwordPost,
  settings,
  // student APIs
  getStudents,
};
