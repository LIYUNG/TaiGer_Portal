const studentController = require("../controllers/students");

const authRouter = require("./auth");
const accountRouter = require("./account")
const usersRouter = require("./users");
const agentsRouter = require("./agents")
const editorsRouter = require("./editors")
const studentsRouter = require("./students");
const documentationsRouter = require("./documentations");
const programsRouter = require("./programs");

const router = (app) => {
  // TODO: remove below routes when authRouter is ready
  app.post("/login", studentController.signIn);
  app.post("/register", studentController.signUp);
  app.post("/password", studentController.passwordPost);
  app.get("/settings", studentController.settings);

  app.use("/auth", authRouter);

  app.use("/account", accountRouter)

  app.use("/users", usersRouter);
  app.use("/students", studentsRouter)
  app.use("/agents", agentsRouter)
  app.use("/editors", editorsRouter)

  app.use("/docs", documentationsRouter);
  app.use("/programs", programsRouter);
};

module.exports = router;
