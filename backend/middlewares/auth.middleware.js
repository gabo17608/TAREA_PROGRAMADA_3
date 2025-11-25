// backend/middlewares/auth.js
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'secret';

function verifyToken(req, res, next) {
  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ success: false, message: 'No token provided' });

  const parts = header.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ success: false, message: 'Malformed token' });

  const token = parts[1];
  jwt.verify(token, secret, (err, decoded) => {
    if (err) return res.status(401).json({ success: false, message: 'Invalid token' });
    req.user = decoded;
    next();
  });
}

module.exports = { verifyToken };
