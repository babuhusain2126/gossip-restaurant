const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const verifyFirebaseToken = require('../middleware/auth');
const {
  syncUser,
  getProfile,
  updateProfile,
  getFavourites,
  toggleFavourite,
  getOrders,
  getMealPlan,
  updateMealPlan,
} = require('../controllers/userController');

// All routes require a valid Firebase token
router.use(verifyFirebaseToken);

// Sync Firebase user to MongoDB (call on every login)
router.post('/sync', syncUser);

// Profile
router.get('/profile', getProfile);
router.put('/profile', [
  body('name').optional().trim().isLength({ min: 2, max: 80 }).withMessage('Name must be 2–80 characters'),
  body('bio').optional().isLength({ max: 300 }).withMessage('Bio max 300 characters'),
  body('avatar').optional().isURL().withMessage('Avatar must be a valid URL'),
], updateProfile);

// Favourites
router.get('/favourites', getFavourites);
router.post('/favourites/:recipeId', toggleFavourite);

// Orders
router.get('/orders', getOrders);

// Meal Plan
router.get('/mealplan', getMealPlan);
router.put('/mealplan', updateMealPlan);

module.exports = router;
