const { Router } = require("express")

const authRouter = require("./auth");
const accountRouter = require("./account")
const usersRouter = require("./users");
const agentsRouter = require("./agents")
const editorsRouter = require("./editors")
const studentsRouter = require("./students");
const documentationsRouter = require("./documentations");
const programsRouter = require("./programs");

const router = (app) => {
  const apiRouter = Router()
  apiRouter.use("/account", accountRouter)

  apiRouter.use("/users", usersRouter);
  apiRouter.use("/students", studentsRouter)
  apiRouter.use("/agents", agentsRouter)
  apiRouter.use("/editors", editorsRouter)

  apiRouter.use("/docs", documentationsRouter);
  apiRouter.use("/programs", programsRouter);

  app.use("/api", apiRouter);
  app.use("/auth", authRouter);
};

module.exports = router;
