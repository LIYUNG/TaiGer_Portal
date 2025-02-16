const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

// TODO: verify requests with token issued by Cognito attached from React.
const COGNITO_USER_POOL_ID = 'us-east-1_examplePoolId';
const REGION = 'us-east-1'; // TODO regionalize
const ISSUER = `https://cognito-idp.${REGION}.amazonaws.com/${COGNITO_USER_POOL_ID}`;

// Setup JWKS client to fetch Cognito public keys
const client = jwksClient({
  jwksUri: `${ISSUER}/.well-known/jwks.json`
});

// Function to get signing key
const getKey = (header, callback) => {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      return callback(err);
    }
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
};

// Middleware to verify JWT
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  // Verify token
  jwt.verify(
    token.replace('Bearer ', ''),
    getKey,
    { issuer: ISSUER },
    (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
      }

      req.user = decoded; // Attach user info to request
      next();
    }
  );
};
module.exports = {
  authMiddleware
};
