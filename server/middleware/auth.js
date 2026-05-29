const admin = require('../config/firebase');

/**
 * verifyFirebaseToken middleware
 * Extracts and verifies the Firebase ID token from Authorization header
 * Attaches decoded user info to req.user
 *
 * Usage: router.get('/protected', verifyFirebaseToken, controller)
 */
const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'No token provided. Please log in.',
    });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken; // { uid, email, name, ... }
    next();
  } catch (error) {
    console.error('Token verification error:', error.code);

    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ success: false, message: 'Token expired. Please log in again.' });
    }
    return res.status(401).json({ success: false, message: 'Invalid token.' });
  }
};

module.exports = verifyFirebaseToken;
