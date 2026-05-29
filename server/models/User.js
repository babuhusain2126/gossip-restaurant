const mongoose = require('mongoose');

/**
 * User Model
 * Stores user profile data synced from Firebase Auth
 * Firebase UID is the primary identifier
 */
const userSchema = new mongoose.Schema(
  {
    // Firebase Auth UID — links Firebase identity to MongoDB profile
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // Basic profile
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: '', // URL to avatar image
    },
    bio: {
      type: String,
      maxlength: 300,
      default: '',
    },

    // Saved / favourite recipe IDs
    favouriteRecipes: [
      {
        type: String, // recipe slug or ID
      },
    ],

    // Order history
    orderHistory: [
      {
        orderId: String,
        items: [
          {
            name: String,
            price: Number,
            qty: Number,
          },
        ],
        total: Number,
        status: {
          type: String,
          enum: ['pending', 'confirmed', 'delivered', 'cancelled'],
          default: 'pending',
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Meal plan — weekly structure
    mealPlan: {
      monday:    { breakfast: String, lunch: String, dinner: String },
      tuesday:   { breakfast: String, lunch: String, dinner: String },
      wednesday: { breakfast: String, lunch: String, dinner: String },
      thursday:  { breakfast: String, lunch: String, dinner: String },
      friday:    { breakfast: String, lunch: String, dinner: String },
      saturday:  { breakfast: String, lunch: String, dinner: String },
      sunday:    { breakfast: String, lunch: String, dinner: String },
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

module.exports = mongoose.model('User', userSchema);
