// const express = require('express');
// const { registerUser, loginUser } = require('../controllers/authController');
// const router = express.Router();

// // Registration route
// router.post('/signup', registerUser);

// // Login route
// router.post('/login', loginUser);

// module.exports = router;



// const express = require('express');
// const { body } = require('express-validator');
// const { registerUser, loginUser } = require('../controllers/authController');
// const rateLimiter = require('../middleware/rateLimiter');  // Limit brute-force login attempts
// const jwt = require('jsonwebtoken'); 
// const User = require('../models/User');
// const router = express.Router();

// // ✅ Secure registration route with validation
// router.post(
//   '/signup',
//   rateLimiter,
//   [
//     body('email').isEmail().withMessage('Please enter a valid email address').normalizeEmail(),
//     body('password')
//       .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
//       .matches(/\d/).withMessage('Password must contain at least one number')
//       .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
//       .trim(),
//     body('name').notEmpty().withMessage('Name is required').trim()
//   ],
//   registerUser
// );

// // ✅ Secure login route with validation
// router.post(
//   '/login',
//   rateLimiter,
//   [
//     body('email').isEmail().withMessage('Invalid email').normalizeEmail(),
//     body('password').notEmpty().withMessage('Password is required')
//   ],
//   loginUser
// );

// router.post('/refresh-token', async (req, res) => {
//     const { refreshToken } = req.body;
  
//     if (!refreshToken) {
//       return res.status(403).json({ message: 'Refresh token is required' });
//     }
  
//     try {
//       // Verify refresh token
//       const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  
//       // Check if the refresh token matches the one stored in the database
//       const user = await User.findById(decoded.userId);
//       if (!user || user.refreshToken !== refreshToken) {
//         return res.status(403).json({ message: 'Invalid or tampered refresh token' });
//       }
  
//       // Generate a new access token
//       const newAccessToken = jwt.sign(
//         { userId: user._id, email: user.email, role: user.role },
//         process.env.JWT_SECRET,
//         { expiresIn: '1h' }
//       );
  
//       res.status(200).json({ accessToken: newAccessToken });
//     } catch (error) {
//       res.status(403).json({ message: 'Invalid or expired refresh token', error });
//     }
//   });
  

// module.exports = router;


const express = require('express');
const { body } = require('express-validator');
const { registerUser, loginUser, refreshAccessToken } = require('../controllers/authController');
const { forgotPassword, resetPassword, forgotUserID } = require('../controllers/authController');
const rateLimiter = require('../middleware/rateLimiter');  // Middleware to limit brute-force attempts
const router = express.Router();

// ✅ Secure registration route with validation and rate limiting
router.post(
  '/signup',
  rateLimiter,
  [
    body('email').isEmail().withMessage('Please enter a valid email address').normalizeEmail(),
    body('password')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
      .matches(/\d/).withMessage('Password must contain at least one number')
      .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
      .trim(),
    body('name').notEmpty().withMessage('Name is required').trim(),
  ],
  registerUser
);

// ✅ Secure login route with validation and rate limiting
router.post(
  '/login',
  rateLimiter,
  [
    body('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  loginUser
);

// ✅ Refresh token route for generating new access tokens
router.post('/refresh-token', refreshAccessToken);

// Forgot password and reset password routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Forgot user ID route
router.post('/forgot-user-id', forgotUserID);

module.exports = router;

module.exports = router;



