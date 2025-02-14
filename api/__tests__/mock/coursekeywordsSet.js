const { generateCourseKeywordsSet } = require('../fixtures/faker');

const keywordsSet1 = generateCourseKeywordsSet();
const keywordsSet2 = generateCourseKeywordsSet();
const keywordsSet3 = generateCourseKeywordsSet();

const keywordsSets = [keywordsSet1, keywordsSet2, keywordsSet3];

module.exports = {
  keywordsSet1,
  keywordsSet2,
  keywordsSet3,
  keywordsSets
};
