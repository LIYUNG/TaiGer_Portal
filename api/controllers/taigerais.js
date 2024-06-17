const path = require('path');
const async = require('async');
const { ErrorResponse } = require('../common/errors');
const { spawn } = require('child_process');

const { asyncHandler } = require('../middlewares/error-handler');
const logger = require('../services/logger');
const { Program } = require('../models/Program');
const { ProgramAI } = require('../models/ProgramAI');
const { isProd } = require('../config');
const { openAIClient } = require('../services/openai');
const { Student, Role } = require('../models/User');
const { generalMLPrompt } = require('../prompt/ml_prompt');
const { FILE_MAPPING_TABLE } = require('../constants');
const { generalRLPrompt } = require('../prompt/rl_prompt');
const { getPermission } = require('../utils/queryFunctions');
const { Communication } = require('../models/Communication');
const Permission = require('../models/Permission');

const pageSize = 3;

const processProgramListAi = asyncHandler(async (req, res, next) => {
  const {
    params: { programId }
  } = req;
  const program = await Program.findOne({ _id: programId }).lean();
  const programai = await ProgramAI.findOne({ program_id: programId }).lean();
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
  logger.info(`model = ${model}`);
  const response = await openAIClient.chat.completions.create({
    messages: [{ role: 'user', content: input || 'where is BMW Headquarter?' }],
    model
  });
  return response.choices[0]?.message;
};
const generate_streaming = async (input, model) =>
  openAIClient.chat.completions.create({
    messages: [{ role: 'user', content: input || 'where is BMW Headquarter?' }],
    model: 'gpt-3.5-turbo',
    stream: true
  });

const TaiGerAiGeneral = asyncHandler(async (req, res, next) => {
  const { user } = req;
  const { prompt, model } = req.body;
  const stream = await generate_streaming(prompt, model || 'gpt-3.5-turbo');
  for await (const part of stream) {
    res.write(part.choices[0]?.delta.content || '');
  }
  res.end();
});

const TaiGerAiChat = asyncHandler(async (req, res, next) => {
  const {
    user,
    params: { studentId }
  } = req;
  const { prompt } = req.body;

  const communication_thread = await Communication.find({
    student_id: studentId
  })
    .populate('student_id user_id', 'firstname lastname role')
    .sort({ createdAt: -1 }) // 0: latest!
    .limit(pageSize)
    .lean(); // show only first y limit items after skip.

  const chat = communication_thread?.map((c) => {
    try {
      const messageObj = JSON.parse(c.message);
      return {
        createdAt: c.createdAt,
        user: c.user_id?.firstname || '',
        role: c.user_id?.role,
        message:
          messageObj.blocks
            .map((block) =>
              block?.type === 'paragraph' ? block.data?.text : ''
            )
            .join('')
            .replace(/<\/?[^>]+(>|$)|&[^;]+;?/g, '') || ''
      };
    } catch (e) {
      logger.error('Error parsing JSON:', e);
      return ''; // Return an empty string or handle the error as needed
    }
  });
  const latestStudentMessage = chat?.filter((c) => c.role === Role.Student)[0];
  const pmp = `
  Your name is ${
    user.firstname
  } and is study assistant helping a student with their academic queries. Your responses should be informative, clear, and professional, aiming to provide accurate answers and guidance. 
  Be friendly and encouraging to promote a positive learning environment.
  Please reply the Student's latest Message:
   ${JSON.stringify(latestStudentMessage)}

  based on the context ${chat}

  Instructions:
 
  Your are a professional study-in-Germany agent and you know the application process very well. 
  Please according to the following chat history and create a professional response: ${JSON.stringify(
    chat
  )}. 
  Please provide the response concise and simple in Markdown language and based on the most recent messages from the Student (user_id: ${studentId}). 
  And please use student's language as reponse. 
  If they use Traditional Chinese then use Tranditional Chinese. Please avoid using simple Chinese as it is not suitable for Taiwanese students.
  
  Here are some resources if student ansk for the topics related to below, you can provide the link to them:
  1. if students ask how to apply German study visa, here is the link: https://taigerconsultancy-portal.com/docs/visa
  2. if students ask how to make an appointment with Deutsches Institut Taipeh for applying visa, here is the link: https://taigerconsultancy-portal.com/docs/search/64c04b3522adb5d6aad94caf
  3. if students ask how to apply Expatrio blocked account (限制提領帳戶), here is the link: https://taigerconsultancy-portal.com/docs/search/64825ca787c9c3e88237351d
  4. if students ask how to apply Switzerland study visa, here is the link: https://taigerconsultancy-portal.com/docs/search/6611756177802f1278b601cf
  5. if students ask how to apply VPD or how to use uni-assist, here is the link: https://taigerconsultancy-portal.com/docs/uniassist
  6. if students ask how to prepare motivation letter (ML in our acronym), here is the link: https://taigerconsultancy-portal.com/docs/search/6383200c766614178d7f978f
  7. if students ask how to prepare Curriculum Vitae (CV in our acronym), here is the link: https://taigerconsultancy-portal.com/docs/search/6379767530243f127d431613
  8. if students ask how to prepare Recommendation letter with Professors (RL in our acronym), here is the link: https://taigerconsultancy-portal.com/docs/search/63832557766614178d7f982b
  9. if students ask how to prepare Recommendation letter with Manager or Boss (RL in our acronym), here is the link: https://taigerconsultancy-portal.com/docs/search/645f4ac8e4452f90ced998ce
  10. if students ask how to prepare essay, here is the link: https://taigerconsultancy-portal.com/docs/search/638b4f82d495bd2198261f7b
  11: if students ask how to prepare cerified copies for German universities (德國學校要求之影本驗證): https://taigerconsultancy-portal.com/docs/search/6381d2e0766614178d7f95bb

  if students ask how to prepare the Documents, here are the requirements for:
  1. passport: https://taigerconsultancy-portal.com/docs/search/6379715430243f127d4315a6
  2. bachelor or master's diploma: https://taigerconsultancy-portal.com/docs/search/6381c95a766614178d7f94bc
  3. bachelor or master's graduate certificate: https://taigerconsultancy-portal.com/docs/search/6381c389766614178d7f94a3
  4. ECTS Conversion document: https://taigerconsultancy-portal.com/docs/search/6381cfe8766614178d7f959b
  5. bachelor or master's transcript: https://taigerconsultancy-portal.com/docs/search/6381cd11766614178d7f9555
  6. GSAT(學測)/TVE 統測成績單: https://taigerconsultancy-portal.com/docs/search/6381d070766614178d7f95a8
  7. Course description / Module Description: https://taigerconsultancy-portal.com/docs/search/63b9c5fe045871fbf1cc01ba
  8. TOEFL, IELTS report: https://taigerconsultancy-portal.com/docs/search/63b9c52e045871fbf1cc016c
  9. High school diploma: https://taigerconsultancy-portal.com/docs/search/63e0e62d1dd60644058853e7
  10. High school transcrpt : https://taigerconsultancy-portal.com/docs/search/63e0e7a51dd6064405885476
  11: Grading System, grade conversion table: https://taigerconsultancy-portal.com/docs/search/63d841d2603c4c625d4b3b83


  Please don't provide all links, but only relavant ones. If none of above mataches, please answer the student based on your best professional knowledge.
  `;

  const stream = await generate_streaming(pmp, 'gpt-3.5-turbo');
  logger.info(pmp);
  let tokenCount = 0;

  for await (const part of stream) {
    const content = part.choices[0]?.delta.content || '';
    res.write(content);
    // Estimate tokens in the current part
    tokenCount += countTokens(content);
  }
  res.end();

  logger.info(
    `Total tokens used: ${tokenCount} , by ${
      user.firstname
    }, user id: ${user._id.toString()}`
  );

  // res.status(200).send({ success: true, data: chat });
  const permission = await Permission.findOne({
    user_id: user._id
  });
  if (permission.taigerAiQuota > 0) {
    permission.taigerAiQuota -= 1;
    await permission.save();
  }
});

const countTokens = (text) => {
  // Implement a function to count tokens based on your tokenizer
  // This is a simple approximation, and you should replace it with an accurate tokenizer
  return text.split(' ').length;
};

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
  const parsed_editor_requirements = JSON.parse(editor_requirements);
  let student_info = {};

  try {
    const student = await Student.findById(student_id);
    student_info = {
      firstname: student.firstname,
      lastname: student.lastname,
      email: student.email,
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

  const stream = await generate_streaming(
    concat_prompt,
    parsed_editor_requirements.gptModel || 'gpt-3.5-turbo'
  );
  for await (const part of stream) {
    res.write(part.choices[0]?.delta.content || '');
  }
  res.end();

  const permission = await Permission.findOne({
    user_id: user._id
  });
  if (permission.taigerAiQuota > 0) {
    permission.taigerAiQuota -= 1;
    await permission.save();
  }
});

module.exports = {
  TaiGerAiGeneral,
  TaiGerAiChat,
  cvmlrlAi,
  processProgramListAi
};
