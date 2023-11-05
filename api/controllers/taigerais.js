const path = require('path');
const async = require('async');
const { ErrorResponse } = require('../common/errors');
const { spawn } = require('child_process');

const { asyncHandler } = require('../middlewares/error-handler');
const logger = require('../services/logger');
const { Program, ProgramAi } = require('../models/Program');
const { isProd } = require('../config');

const processProgramListAi = asyncHandler(async (req, res, next) => {
  const {
    params: { programId }
  } = req;
  const program = await Program.findOne({ _id: programId }).lean();
  const programai = await ProgramAi.findOne({ program_id: programId }).lean();
  if (!program) {
    logger.error('no program found!');
    return res.send({ success: true, data: {} });
  }

  const python_command = isProd() ? 'python3' : 'python';
  const python = spawn(
    python_command,
    [
      path.join(
        __dirname,
        '..',
        'python',
        'TaiGerProgramListAICrawler',
        'main.py'
      ),
      program.school,
      program.program_name,
      program.degree
    ],
    { stdio: 'inherit' }
  );
  python.on('data', (data) => {
    logger.log(`${data}`);
  });
  python.on('error', (err) => {
    logger.log('error');
    logger.log(err);
  });

  python.on('close', (code) => {
    if (code === 0) {
      res.status(200).send({ success: true });
    } else {
      res.status(403).send({ message: code });
    }
  });
});

module.exports = {
  processProgramListAi
};
