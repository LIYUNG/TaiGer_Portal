const Student = require('../models/Students')
const Program = require('../models/Programs')


const getPrograms = async (req, res) => {
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
    if (
      students_exists.role_ === "Agent" ||
      students_exists.role_ === "Admin"
    ) {
      const program_all = await Program.find();
      res.send({
        data: program_all,
        role: "Agent",
      });
    } else {
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


const createProgram = async (req, res) => {
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

const updateProgram = async (req, res) => {
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

const deleteProgram = async (req, res) => {
  try {
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
      console.log("delete " + req.params.program_id);
      const program_id = req.params.program_id;
      await Program.findByIdAndDelete(program_id);
      res.send({
        data: "success",
      });
    } else {
      console.log(
        "delete " +
          req.params.program_id +
          " failed: " +
          "only Admin and Agent can delete program"
      );
      return res.status(401).end(); // 401 Unauthorized response
    }
  } catch (err) {
    console.log("error by delete program");
    console.log(err);
    return res.status(500).end(); // 500 Internal Server Error
  }
};

module.exports = {
  getPrograms,
  createProgram,
  updateProgram,
  deleteProgram,
}
