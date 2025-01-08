const { isProd } = require('../config');

// AWS configuration
const roleToAssumeForCourseAnalyzerAPIG = isProd()
  ? 'arn:aws:iam::669131042313:role/Prod-NA-LambdaStack-Prod--AuthorizedClientRoleProdN-8hih2AVix5Rp'
  : 'arn:aws:iam::669131042313:role/Beta-FE-LambdaStack-Beta--AuthorizedClientRoleBetaF-3H8r1NC3e8lf'; // Replace with your role ARN

const apiGatewayUrl = isProd()
  ? 'https://prod.taigerconsultancy-portal.com/analyze'
  : 'https://beta.taigerconsultancy-portal.com/analyze'; // Replace with your API Gateway URL

module.exports = {
  roleToAssumeForCourseAnalyzerAPIG,
  apiGatewayUrl
};
