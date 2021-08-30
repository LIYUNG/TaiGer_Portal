const { asyncHandler } = require("../middlewares/error-handler");

const Student = require("../models/Students");
const Program = require("../models/Programs");

const getPrograms = asyncHandler(async (req, res) => {
  const { user } = req;
  const programs =
    user.role_ === "Agent" || user.role_ === "Admin"
      ? await Program.find()
      : user.applying_program_;
  res.send({ data: programs, role: user.role_ });
});

const createProgram = asyncHandler(async (req, res) => {
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
});

const updateProgram = asyncHandler(async (req, res) => {
  try {
    console.log("edit req.params.id = " + req.params.id);
    const id = req.params.id;
    let program = await Program.findById(id);
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
});

const deleteProgram = asyncHandler(async (req, res) => {
  await Program.findByIdAndDelete(req.params.id);
  res.send({ data: "success" });
});

module.exports = {
  getPrograms,
  createProgram,
  updateProgram,
  deleteProgram,
};
