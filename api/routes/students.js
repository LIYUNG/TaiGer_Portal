const { Router } = require("express");

const { auth } = require("../middlewares/auth");

const {
  // getUsers,
  // updateUser,
  // deleteUser,
  // changeUserRole,
  // getStudents,
} = require("../controllers/students");

const router = Router();

router.use(auth);

// app.post("/assignprogramtostudent", auth, handlers.assignprogramtostudent);

// app.get("/studentlist", getStudents);

// app.get("/editagent", auth, handlers.editagent);
// app.post("/updateagent/:student_id", auth, handlers.updateagent);

// app.get("/editeditor", auth, handlers.editeditor);
// app.post("/updateeditor/:student_id", auth, handlers.updateeditor);

// app.post("/editstudentprogram", auth, handlers.editstudentprogram);

// app.delete(
//   "/deleteprogramfromstudent/:program_id/:student_id",
//   auth,
//   handlers.deleteprogramfromstudent
// );

module.exports = router;
