const { Router } = require('express');

const authRouter = require('./auth');
const accountRouter = require('./account');
const usersRouter = require('./users');
const agentsRouter = require('./agents');
const editorsRouter = require('./editors');
const studentsRouter = require('./students');
const documentationsRouter = require('./documentations');
const programsRouter = require('./programs');
const docsModiRouter = require('./documents_modification');
const tasksRouter = require('./tasks');
const interviewsRouter = require('./interviews');

const router = (app) => {
  const apiRouter = Router();
  apiRouter.use('/account', accountRouter);

  apiRouter.use('/users', usersRouter);
  apiRouter.use('/students', studentsRouter);
  apiRouter.use('/agents', agentsRouter);
  apiRouter.use('/editors', editorsRouter);

  apiRouter.use('/docs', documentationsRouter);
  apiRouter.use('/programs', programsRouter);
  apiRouter.use('/document-threads', docsModiRouter);
  apiRouter.use('/tasks', tasksRouter);
  apiRouter.use('/interviews', interviewsRouter);

  app.use('/api', apiRouter);
  app.use('/auth', authRouter);
};

module.exports = router;
