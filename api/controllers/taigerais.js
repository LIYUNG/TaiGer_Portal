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
const { Student } = require('../models/User');
const { generalMLPrompt } = require('../prompt/ml_prompt');
const { FILE_MAPPING_TABLE } = require('../constants');
const { generalRLPrompt } = require('../prompt/rl_prompt');

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

const generate = async (input, model) => {
  console.log(`model = ${model}`);
  const response = await openAIClient.chat.completions.create({
    messages: [{ role: 'user', content: input }],
    model
  });
  // console.log(response.choices[0]?.message);
  return response.choices[0]?.message;
};
const generate_streaming = async (input) => {
  const response = await openAIClient.chat.completions.create({
    messages: [{ role: 'user', content: input }],
    model: 'gpt-3.5-turbo',
    stream: true
  });
  // console.log(response.choices[0]?.message);
  return response.choices[0]?.message;
};

const TaiGerAiGeneral = asyncHandler(async (req, res, next) => {
  const { user } = req;
  const { prompt, model } = req.body;
  console.log(prompt);

  const chatGPTOutput = await generate(prompt, model || 'gpt-3.5-turbo');
  // console.log(chatGPTOutput);

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

const cvmlrlAi = asyncHandler(async (req, res, next) => {
  const { user } = req;
  const {
    student_input,
    document_requirements,
    editor_requirements,
    program_full_name,
    file_type,
    student_id
  } = req.body;
  console.log(student_input);
  console.log(document_requirements);
  const parsed_editor_requirements = JSON.parse(editor_requirements);
  console.log(parsed_editor_requirements);
  let student_info = {};

  try {
    const student = await Student.findById(student_id);
    student_info = {
      firstname: student.firstname,
      lastname: student.lastname,
      academic_background: student.academic_background
    };
  } catch (e) {}

  const file_type_name = FILE_MAPPING_TABLE[file_type];
  let concat_prompt = '';
  if (file_type.includes('ML')) {
    concat_prompt = generalMLPrompt({
      editor_requirements,
      document_requirements,
      program_full_name,
      student_input,
      file_type_name,
      student_info
    });
  } else {
    // TODO: need to fine tune prompt
    concat_prompt = generalRLPrompt({
      editor_requirements,
      document_requirements,
      program_full_name,
      student_input,
      file_type_name,
      student_info
    });
  }

  console.log('Show prompt');
  console.log('========================');
  console.log(concat_prompt);
  const chatGPTOutput = await generate(
    concat_prompt,
    parsed_editor_requirements.gptModel || 'gpt-3.5-turbo'
  );
  // console.log(chatGPTOutput);

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

module.exports = { TaiGerAiGeneral, cvmlrlAi, processProgramListAi };
