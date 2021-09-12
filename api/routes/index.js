const authRouter = require("./auth");
const accountRouter = require("./account")
const usersRouter = require("./users");
const agentsRouter = require("./agents")
const editorsRouter = require("./editors")
const studentsRouter = require("./students");
const documentationsRouter = require("./documentations");
const programsRouter = require("./programs");

const router = (app) => {
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
