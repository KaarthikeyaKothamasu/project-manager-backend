const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next) {
  // 1. Get token from the request header
  const token = req.header('Authorization')?.split(' ')[1]; // Looks for "Bearer <token>"

  // 2. Check if no token exists
  if (!token) {
    // If there's no token, deny access immediately
    return res.status(401).json({ message: 'No token, authorization denied.' });
  }

  // 3. Verify the token if it exists
  try {
    // Try to decode the token using your secret key from the .env file
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // If successful, the token is valid. Attach the user's info from the token
    // to the request object. This lets future code know who is making the request.
    req.user = decoded.user;

    // 4. Move to the next step
    next(); // This says "check passed, proceed to the actual API logic."
  } catch (err) {
    // If jwt.verify fails, it means the token is fake or expired. Deny access.
    res.status(401).json({ message: 'Token is not valid.' });
  }
};