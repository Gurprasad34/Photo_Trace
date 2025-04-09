import express from 'express';
import passport from 'passport';

const router = express.Router();

// Get the frontend URL from environment variables
const FRONTEND_URL = process.env.NODE_ENV === 'production' 
  ? 'https://photo-trace-client.onrender.com'
  : 'http://localhost:3000';

// Route to initiate Google OAuth
router.get('/google',
    (_req, _res, next) => {
      console.log('Starting Google authentication flow...');
      next();
    },
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

// Google OAuth callback route
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (_req, res) => {
    // Successful authentication, redirect to the frontend
    res.redirect(FRONTEND_URL);
  }
);

// Route to get current user
router.get('/me', (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// Route to logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect(FRONTEND_URL);
  });
});

export default router; 