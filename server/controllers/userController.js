const User = require('../models/User');
const { validationResult } = require('express-validator');

/**
 * POST /api/users/sync
 * Called right after Firebase sign-up / first login
 * Creates a MongoDB user record if it doesn't exist yet
 */
const syncUser = async (req, res) => {
  try {
    const { uid, email, name } = req.user; // from Firebase token

    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        email,
        name: name || email.split('@')[0],
      });
      return res.status(201).json({ success: true, user, isNew: true });
    }

    res.json({ success: true, user, isNew: false });
  } catch (error) {
    console.error('syncUser error:', error);
    res.status(500).json({ success: false, message: 'Server error during user sync.' });
  }
};

/**
 * GET /api/users/profile
 * Returns full profile for the logged-in user
 */
const getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid }).lean();
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * PUT /api/users/profile
 * Update name, bio, avatar
 */
const updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { name, bio, avatar } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (bio !== undefined) updates.bio = bio;
    if (avatar !== undefined) updates.avatar = avatar;

    const user = await User.findOneAndUpdate(
      { firebaseUid: req.user.uid },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * GET /api/users/favourites
 * Get all saved recipe IDs
 */
const getFavourites = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid }, 'favouriteRecipes').lean();
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, favourites: user.favouriteRecipes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * POST /api/users/favourites/:recipeId
 * Toggle a recipe in/out of favourites
 */
const toggleFavourite = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    const idx = user.favouriteRecipes.indexOf(recipeId);
    let action;

    if (idx > -1) {
      user.favouriteRecipes.splice(idx, 1); // remove
      action = 'removed';
    } else {
      user.favouriteRecipes.push(recipeId);  // add
      action = 'added';
    }

    await user.save();
    res.json({ success: true, action, favourites: user.favouriteRecipes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * GET /api/users/orders
 * Get order history
 */
const getOrders = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid }, 'orderHistory').lean();
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    // Sort newest first
    const orders = [...user.orderHistory].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * GET /api/users/mealplan
 * Get weekly meal plan
 */
const getMealPlan = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid }, 'mealPlan').lean();
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, mealPlan: user.mealPlan });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * PUT /api/users/mealplan
 * Update weekly meal plan
 * Body: { day: 'monday', meal: 'breakfast', recipe: 'Avocado Toast' }
 */
const updateMealPlan = async (req, res) => {
  try {
    const { day, meal, recipe } = req.body;

    const VALID_DAYS  = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
    const VALID_MEALS = ['breakfast','lunch','dinner'];

    if (!VALID_DAYS.includes(day) || !VALID_MEALS.includes(meal)) {
      return res.status(400).json({ success: false, message: 'Invalid day or meal slot.' });
    }

    const user = await User.findOneAndUpdate(
      { firebaseUid: req.user.uid },
      { $set: { [`mealPlan.${day}.${meal}`]: recipe } },
      { new: true }
    );

    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, mealPlan: user.mealPlan });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = {
  syncUser,
  getProfile,
  updateProfile,
  getFavourites,
  toggleFavourite,
  getOrders,
  getMealPlan,
  updateMealPlan,
};
