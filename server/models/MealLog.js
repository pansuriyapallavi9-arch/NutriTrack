const mongoose = require('mongoose');

const MealLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: { type: String, default: null },
  detectedFoods: [{ type: String }],
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    default: 'snack'
  },
  nutritionData: {
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    iron: { type: Number, default: 0 },
    omega3: { type: Number, default: 0 },
    vitaminD: { type: Number, default: 0 },
    vitaminB12: { type: Number, default: 0 },
    calcium: { type: Number, default: 0 },
    zinc: { type: Number, default: 0 },
    fiber: { type: Number, default: 0 }
  },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('MealLog', MealLogSchema);