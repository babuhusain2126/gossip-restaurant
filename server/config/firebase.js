const admin = require('firebase-admin');

/**
 * Initialize Firebase Admin SDK
 * Uses environment variables for credentials (never hardcode keys)
 */
const initFirebase = () => {
  if (admin.apps.length > 0) return admin; // prevent re-initialization

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Replace escaped newlines from .env string
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });

  console.log('✅ Firebase Admin initialized');
  return admin;
};

module.exports = initFirebase();
