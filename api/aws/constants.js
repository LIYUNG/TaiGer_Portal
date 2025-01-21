const {
  AWS_TRANSCRIPT_ANALYSER_ROLE,
  AWS_TRANSCRIPT_ANALYSER_APIG_URL
} = require('../config');

// AWS configuration
const roleToAssumeForCourseAnalyzerAPIG = AWS_TRANSCRIPT_ANALYSER_ROLE;

// Transcript Analyser API Gateway URL
const apiGatewayUrl = AWS_TRANSCRIPT_ANALYSER_APIG_URL;

module.exports = {
  roleToAssumeForCourseAnalyzerAPIG,
  apiGatewayUrl
};
