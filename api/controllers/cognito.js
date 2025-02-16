const AWS = require('aws-sdk');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const cognito = new AWS.CognitoIdentityServiceProvider();
const COGNITO_USER_POOL_ID = 'us-east-1_examplePoolId';
const CLIENT_ID = '1pd9pueb8gqfqi3p8t8uqk18kq';

// TODO: replace this to existing login() controller
const fallbackLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1️⃣ Check if the user exists in Cognito first
    let cognitoUser;
    try {
      cognitoUser = await cognito
        .adminGetUser({
          UserPoolId: COGNITO_USER_POOL_ID,
          Username: email
        })
        .promise();
    } catch (err) {
      cognitoUser = null;
    }

    if (cognitoUser) {
      return res.status(400).json({
        message: 'User already exists in Cognito. Try logging in via Hosted UI.'
      });
    }

    // 2️⃣ Check MongoDB if user exists
    const user = await req.db.model('User').findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // 3️⃣ Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 4️⃣ Create the user in Cognito dynamically
    await cognito
      .adminCreateUser({
        UserPoolId: COGNITO_USER_POOL_ID,
        Username: email,
        UserAttributes: [{ Name: 'email', Value: email }],
        MessageAction: 'SUPPRESS' // Don't send a Cognito email
      })
      .promise();

    // 5️⃣ Authenticate the newly created Cognito user and get tokens
    const authResult = await cognito
      .initiateAuth({
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: CLIENT_ID,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password
        }
      })
      .promise();

    // 6️⃣ Return Cognito tokens
    return res.json({
      accessToken: authResult.AuthenticationResult.AccessToken,
      idToken: authResult.AuthenticationResult.IdToken,
      refreshToken: authResult.AuthenticationResult.RefreshToken
    });
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { fallbackLogin };
