const { OpenAI } = require('openai');

const { OPENAI_API_KEY } = require('../../config');

const openAIClient = new OpenAI({ apiKey: OPENAI_API_KEY });

const OpenAiModel = {
  GPT_3_5_TURBO: 'gpt-3.5-turbo',
  GPT_4_o: 'gpt-4o'
};

module.exports = { openAIClient, OpenAiModel };
