const { Router } = require('express');

const authRouter = require('./auth');
const accountRouter = require('./account');
const usersRouter = require('./users');
const expensesRouter = require('./expenses');
const agentsRouter = require('./agents');
const editorsRouter = require('./editors');
const studentsRouter = require('./students');
const documentationsRouter = require('./documentations');
const coursesRouter = require('./courses');
const portalsRouter = require('./portal_information');
const programsRouter = require('./programs');
const docsModiRouter = require('./documents_modification');
const permissionsRouter = require('./permissions');
const tasksRouter = require('./tasks');
const notesRouter = require('./notes');
const widgetsRouter = require('./widget');
const admissionsRouter = require('./admissions');
const searchesRouter = require('./searches');
const teamsRouter = require('./teams');
// const interviewsRouter = require('./interviews');

const router = (app) => {
  const apiRouter = Router();
  apiRouter.use('/account', accountRouter);

  apiRouter.use('/users', usersRouter);
  apiRouter.use('/students', studentsRouter);
  apiRouter.use('/agents', agentsRouter);
  apiRouter.use('/editors', editorsRouter);

  apiRouter.use('/docs', documentationsRouter);
  apiRouter.use('/expenses', expensesRouter);
  apiRouter.use('/courses', coursesRouter);
  apiRouter.use('/portal-informations', portalsRouter);
  apiRouter.use('/programs', programsRouter);
  apiRouter.use('/document-threads', docsModiRouter);
  apiRouter.use('/permissions', permissionsRouter);
  apiRouter.use('/tasks', tasksRouter);
  apiRouter.use('/notes', notesRouter);
  apiRouter.use('/widgets', widgetsRouter);
  apiRouter.use('/admissions', admissionsRouter);
  apiRouter.use('/search', searchesRouter);

  apiRouter.use('/teams', teamsRouter);
  // apiRouter.use('/interviews', interviewsRouter);

  app.use('/api', apiRouter);
  app.use('/auth', authRouter);
};

module.exports = router;
