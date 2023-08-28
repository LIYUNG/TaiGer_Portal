const { Router } = require('express');

const authRouter = require('./auth');
const accountRouter = require('./account');
const usersRouter = require('./users');
const expensesRouter = require('./expenses');
const agentsRouter = require('./agents');
const editorsRouter = require('./editors');
const eventsRouter = require('./events');
const studentsApplicationRouter = require('./student_applications');
const studentsRouter = require('./students');
const documentationsRouter = require('./documentations');
const coursesRouter = require('./courses');
const communicationsRouter = require('./communications');
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
const uniassistRouter = require('./uniassist');
const interviewsRouter = require('./interviews');
const googleapisRouter = require('./googleapis');

const router = (app) => {
  const apiRouter = Router();
  apiRouter.use('/account', accountRouter);

  apiRouter.use('/users', usersRouter);
  apiRouter.use('/student-applications', studentsApplicationRouter);
  apiRouter.use('/students', studentsRouter);
  apiRouter.use('/agents', agentsRouter);
  apiRouter.use('/editors', editorsRouter);

  apiRouter.use('/admissions', admissionsRouter);
  apiRouter.use('/courses', coursesRouter);
  apiRouter.use('/communications', communicationsRouter);
  apiRouter.use('/docs', documentationsRouter);
  apiRouter.use('/document-threads', docsModiRouter);
  apiRouter.use('/expenses', expensesRouter);
  apiRouter.use('/events', eventsRouter);
  apiRouter.use('/google', googleapisRouter);
  apiRouter.use('/interviews', interviewsRouter);
  apiRouter.use('/notes', notesRouter);
  apiRouter.use('/portal-informations', portalsRouter);
  apiRouter.use('/permissions', permissionsRouter);
  apiRouter.use('/programs', programsRouter);
  apiRouter.use('/search', searchesRouter);
  apiRouter.use('/tasks', tasksRouter);
  apiRouter.use('/teams', teamsRouter);
  apiRouter.use('/uniassist', uniassistRouter);
  apiRouter.use('/widgets', widgetsRouter);

  app.use('/api', apiRouter);
  app.use('/auth', authRouter);
};

module.exports = router;
