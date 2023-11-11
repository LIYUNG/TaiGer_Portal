const path = require('path');
const async = require('async');
const { ErrorResponse } = require('../common/errors');
const { spawn } = require('child_process');

const { asyncHandler } = require('../middlewares/error-handler');
const logger = require('../services/logger');
const { Program, ProgramAi } = require('../models/Program');
const { isProd } = require('../config');
const { openAIClient } = require('../services/openai');
const Permission = require('../models/Permission');

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
    ['program_info.py', program.school, program.program_name, program.degree],
    {
      stdio: 'inherit',
      cwd: `${__dirname}/../python/TaiGerProgramListAICrawler/app`
    }
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

const generate = async (input) => {
  const response = await openAIClient.chat.completions.create({
    messages: [{ role: 'user', content: input }],
    model: 'gpt-3.5-turbo'
  });
  console.log(response.choices[0]?.message);
  return response.choices[0]?.message;
};
const generate_streaming = async (input) => {
  const response = await openAIClient.chat.completions.create({
    messages: [{ role: 'user', content: input }],
    model: 'gpt-3.5-turbo',
    stream: true
  });
  console.log(response.choices[0]?.message);
  return response.choices[0]?.message;
};
const cvmlrlAi = asyncHandler(async (req, res, next) => {
  const { user } = req;
  const { prompt } = req.body;
  console.log(prompt);
  const chatGPTOutput = await generate(prompt);
  console.log(chatGPTOutput);

  // const chatGPTOutput_Streaming = await generate(
  //   'Do you know how to learn German efficiently?'
  // );
  // const starttime = Date.now();
  // for await (const part of chatGPTOutput_Streaming) {
  //   const chunkTime = (Date.now() - starttime) / 1000;
  //   process.stdout.write(JSON.stringify(part.choices[0]?.delta || ''));
  //   console.log(' chunk time:', chunkTime);
  //   res.write(part.choices[0]?.delta.content || '');
  // }
  // res.end();
  res.send({ success: true, data: chatGPTOutput?.content });
  const permission = await Permission.findOne({ user_id: user._id });
  if (permission.taigerAiQuota > 0) {
    permission.taigerAiQuota -= 1;
    await permission.save();
  }
});

module.exports = { cvmlrlAi, processProgramListAi };
