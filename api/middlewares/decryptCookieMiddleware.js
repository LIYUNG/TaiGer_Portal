const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

const decryptCookieMiddleware = (req, res, next) => {
  const token = req.cookies['x-auth'];
  if (!token) {
    return res.status(401).send('Authentication token not found');
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.decryptedToken = payload; // Attach decrypted payload to the request object
    next();
  } catch (err) {
    return res.status(401).send('Invalid token');
  }
};

module.exports = { decryptCookieMiddleware };
