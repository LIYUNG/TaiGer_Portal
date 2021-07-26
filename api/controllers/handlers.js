const Student = require("../models/Students");
const Program = require("../models/Programs");
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
// const path = require("path");
const bcrypt = require("bcryptjs");
// var nodemailer = require('nodemailer');


// var transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'taiger.leoc@gmail.com',
//     pass: ''
//   }
// });

// var mailOptions = {
//   from: 'taiger.leoc@gmail.com',
//   to: 'taiger.leoc@gmail.com',
//   subject: 'Sending Email using Node.js',
//   text: 'That was easy!'
// };

// transporter.sendMail(mailOptions, function(error, info){
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response);
//   }
// });

exports.signIn = async (req, res) => {
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
          const token = jwt.sign({ emailaddress }, process.env.JWT_KEY, {
            algorithm: "HS256",
            expiresIn: parseInt(process.env.JWT_EXPIRY_SECONDS),
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
          return res.send({
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

exports.Charts = async (req, res) => {
  var token = req.cookies.token;
  //Extract user email info by token
  var emailaddress = jwt_decode(token);
  //Get user email
  emailaddress = emailaddress["emailaddress"];
  const students_exists = await Student.findOne({
    emailaddress_: emailaddress,
  });
  // Renew token again, entend expire time
  return res.status(401).end();
};

exports.passwordPost = async (req, res) => {
  res.send.status(404).end();
};

exports.settings = async (req, res) => {
  var token = req.cookies.token;
  //Extract user email info by token
  var emailaddress = jwt_decode(token);
  //Get user email
  emailaddress = emailaddress["emailaddress"];
  const students_exists = await Student.findOne({
    emailaddress_: emailaddress,
  });
  // Renew token again, entend expire time
  token = jwt.sign({ emailaddress }, process.env.JWT_KEY, {
    algorithm: "HS256",
    expiresIn: parseInt(process.env.JWT_EXPIRY_SECONDS),
  });
  console.log(students_exists);
  res.cookie("token", token, {
    maxAge: parseInt(process.env.JWT_EXPIRY_SECONDS) * 1000,
  });
};

exports.settingsPost = async (req, res) => {
  res.send.status(404).end();
};

exports.programlist = async (req, res) => {
  try {
    const bearer = req.headers.authorization.split(" ");
    const token = bearer[1];
    // //Extract user email info by token
    var emailaddress = jwt_decode(token);
    // //Get user email
    emailaddress = emailaddress["emailaddress"];
    console.log(emailaddress);
    const students_exists = await Student.findOne({
      emailaddress_: emailaddress,
    });
    // Access all programs
    if (students_exists.role_ === "Agent") {
      const program_all = await Program.find();
      res.send({
        data: program_all,
        role: "Agent"
      });
    } else {
      //TODO: show student's own program list
      res.send({
        // send the student's selected program
        data: students_exists.applying_program_,
        role: "Student",
      });
    }
  } catch (err) {
    if (e instanceof jwt.JsonWebTokenError) {
      // if the error thrown is because the JWT is unauthorized, return a 401 error
      console.log(e);
      console.log("error by programlist");
      return res.status(401).end();
    }
    console.log(err);
  }
};

exports.userslist = async (req, res) => {
  try {
    const bearer = req.headers.authorization.split(" ");
    const token = bearer[1];
    // //Extract user email info by token
    var emailaddress = jwt_decode(token);
    // //Get user email
    emailaddress = emailaddress["emailaddress"];
    console.log(emailaddress);
    const user_me = await Student.findOne({
      emailaddress_: emailaddress , // get current user.
    });
    const user_exists = await Student.find({ 
      emailaddress_: { $ne: emailaddress }, // get all users excluding the current user.
    });
    console.log(" user:" + user_me.role_);
    // Access all users
    if (user_me.role_ === "Agent" || user_me.role_ === "Admin") {
      res.send({
        data: user_exists,
        role: "Agent",
      });
    } else {
      //TODO: show student's own program list
      res.send({
        // send the student's selected program
        data: {},
        role: "Student",
      });
    }
  } catch (err) {
    if (e instanceof jwt.JsonWebTokenError) {
      // if the error thrown is because the JWT is unauthorized, return a 401 error
      console.log(e);
      console.log("error by userslist");
      return res.status(401).end();
    }
    console.log(err);
  }
};

exports.addprogram = async (req, res) => {
  console.log(req.body);
  const date_now = Date();
  try {
    console.log("New program ");
    const New_Program = new Program();
    New_Program.University_ = req.body.University_;
    New_Program.Program_ = req.body.Program_;
    New_Program.TOEFL_ = req.body.TOEFL_;
    New_Program.IELTS_ = req.body.IELTS_;
    New_Program.Degree_ = req.body.Degree_;
    New_Program.Application_end_date_ = req.body.Application_end_date_;
    New_Program.LastUpdate_ = date_now;
    New_Program.applicationDocu_ = {
      CV_: {
        needToBeUpload_: req.body.CV_,
      },
      ML_: {
        needToBeUpload_: req.body.ML_,
      },
      RL_: {
        needToBeUpload_: req.body.RL_,
      },
      bachelorCertificate_: {
        needToBeUpload_: req.body.bachelorCertificate_,
      },
      bachelorTranscript_: {
        needToBeUpload_: req.body.bachelorTranscript_,
      },
      highSchoolDiploma_: {
        needToBeUpload_: req.body.highSchoolDiploma_,
      },
      highSchoolTranscript_: {
        needToBeUpload_: req.body.highSchoolTranscript_,
      },
      universityEntranceExamination_: {
        needToBeUpload_: req.body.universityEntranceExamination_,
      },
      EnglischCertificate_: {
        needToBeUpload_: req.body.EnglischCertificate_,
      },
      GermanCertificate_: {
        needToBeUpload_: req.body.GermanCertificate_,
      },
      Essay_: {
        needToBeUpload_: req.body.Essay_,
      },
      ECTS_coversion_: {
        needToBeUpload_: req.body.ECTS_coversion_,
      },
      CourseDescription_: {
        needToBeUpload_: req.body.CourseDescription_,
      },
    };

    await New_Program.save();
    return res.send({
      data: New_Program,
    });
  } catch (err) {
    console.log("error by adding programlist : " + err);
    return res.status(500).end(); // 500 Internal Server Error
  }
};

exports.editprogram = async (req, res) => {
  try {
    console.log("edit req.params.id = " + req.params.id);
    const program_id = req.params.id;
    let program = await Program.findById(program_id);
    console.log("program: " + program);
    const date_now = Date();
    const bearer = req.headers.authorization.split(" ");
    const token = bearer[1];
    // TODO update the program
    program.University_ = req.body.University_;
    program.Program_ = req.body.Program_;
    program.TOEFL_ = req.body.TOEFL_;
    program.IELTS_ = req.body.IELTS_;
    program.Degree_ = req.body.Degree_;
    program.Application_end_date_ = req.body.Application_end_date_;
    // program.TestDaF_ : req.body.testdaf,
    // program.GMAT_ : req.body.gmat,
    // program.GRE_ : req.body.gre,
    // program.applicationStart_ : req.body.applicationStart_,
    // program.applicationDeadline_ : req.body.applicationDeadline_,
    // program.weblink_ : req.body.weblink_,
    // program.FPSOlink_ : req.body.FPSOlink_,
    program.LastUpdate_ = date_now;
    await program.save();
    return res.send({
      data: program,
    });
  } catch (err) {
    console.log("error by edit program: " + err);
    return res.status(500).end(); // 500 Internal Server Error
  }
};

exports.edituser = async (req, res) => {
  try {
    // TODO: only Admin/Agent can access this API
    console.log("edit req.params.id = " + req.params.id);
    const user_id = req.params.id;
    let user = await Student.findById(user_id);
    console.log("user: " + user);
    const bearer = req.headers.authorization.split(" ");
    const token = bearer[1];
    // TODO update the program
    user.firstname_ = req.body.firstname_;
    user.lastname_ = req.body.lastname_;
    user.emailaddress_ = req.body.emailaddress_;
    user.role_ = req.body.role_;
    // user.LastUpdate_ = date_now;
    await user.save();
    return res.send({
      data: user,
    });
  } catch (err) {
    console.log("error by edit user: " + err);
    return res.status(500).end(); // 500 Internal Server Error
  }
};


exports.deleteprogram = async (req, res) => {
  try {
    console.log("delete " + req.params.program_id);
    const program_id = req.params.program_id;
    await Program.findByIdAndDelete(program_id);
    res.send({
      data: "success",
    });
  } catch (err) {
    console.log("error by delete program");
    console.log(err);
    return res.status(500).end(); // 500 Internal Server Error
  }
};

exports.deleteuser = async (req, res) => {
  try {
    console.log("delete " + req.params.user_id);
    const user_id = req.params.user_id;
    await Student.findByIdAndDelete(user_id);
    res.send({
      data: "success",
    });
  } catch (err) {
    console.log("error by delete program");
    console.log(err);
    return res.status(500).end(); // 500 Internal Server Error
  }
};

exports.assignprogramtostudent = async (req, res) => {
  try {
    console.log("edit req.body = " + req.body);
    console.log("edit req.body.program_id = " + req.body.program_id);
    const program_id = req.body.program_id;
    let program = await Program.findById(program_id);
    console.log("edit req.body.student_id = " + req.body.student_id);
    const student_id = req.body.student_id;
    var student1 = await Student.findById(student_id);
    const exist_program = await student1.applying_program_.id(program_id);
    // TODO: remove subdocument/subarray
    // const exist_program = await student1.applying_program_.id(program_id).remove()
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
  } catch (err) {
    console.log("error by assigning program");
    console.log(err);
    return res.status(500).end(); // 500 Internal Server Error
  }
};

exports.studentlist = async (req, res) => {
  try {
    const bearer = req.headers.authorization.split(" ");
    const token = bearer[1];
    // //Extract user email info by token
    var emailaddress = jwt_decode(token);
    // //Get user email
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
        "Agent  " +
          Agent.firstname_ +
          " " +
          Agent.lastname_ +
          " get her/his student list"
      );
      res.send({
        data: student_all,
        role: "Agent"
      });
    } else if (students_exists.role_ === "Admin") {
      const student_all = await Student.find({ role_: "Student" });
      console.log("Admin get all student list");
      res.send({
        data: student_all,
        role: "Admin",
      });
    } else if (students_exists.role_ === "Editor") {
      const Editor = await Student.findOne({ emailaddress_: emailaddress }); //get email by token
      const student_all = await Student.find({
        role_: "Student",
        editor_: emailaddress,
      });
      console.log(
        "Editor  " + Editor.firstname_ + " " + Editor.lastname_ + " log in"
      );
      res.send({
        data: student_all,
        role: "Editor",
      });
    } else {
      console.log(
        "Student " +
          students_exists.firstname_ +
          " " +
          students_exists.lastname_ +
          " get her/his personal dashboard"
      );
      res.send({
        data: [students_exists],
        role: "Student",
      });
    }
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      // if the error thrown is because the JWT is unauthorized, return a 401 error
      console.log(e);
      console.log("error by programlist");
      return res.status(500).end(); // 500 Internal Server Error
    }
    console.log(err);
    return res.status(500).end(); // 500 Internal Server Error
  }
};

exports.editagent = async (req, res, next) => {
  try {
    const Agent_all = await Student.find({ role_: "Agent" });
    console.log("get agent list success!");
    res.send({
      data: Agent_all,
    });
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

exports.updateagent = async (req, res, next) => {
  console.log(req.body);
  // console.log(req.params.student_id);
  try {
    //TODO: only admin can update agent
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

exports.editeditor = async (req, res, next) => {
  try {
    const Editor_all = await Student.find({ role_: "Editor" });
    console.log("get editor list success!");
    res.send({
      data: Editor_all,
    });
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

exports.updateeditor = async (req, res, next) => {
  console.log(req.body);

  try {
    // req.body;
    //TODO: only admin can update editor
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

exports.editstudentprogram = async (req, res, next) => {
  console.log("editstudentprogram success!");
  res.status(404).end();
};

exports.deleteprogramfromstudent = async (req, res, next) => {
  try {
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
  } catch (err) {
    console.log("error delete file: " + err);
    return res.status(500).end(); // 500 Internal Server Error
  }
};
