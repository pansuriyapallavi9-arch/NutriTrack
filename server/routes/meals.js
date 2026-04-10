const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const MealLog = require('../models/MealLog');
const multer = require('multer');
const fs = require('fs');

const upload = multer({ dest: 'uploads/' });

// POST — save meal
router.post('/save', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const { detectedFoods, nutritionData, mealType } = req.body;
    let imageUrl = null;

    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const meal = new MealLog({
      userId: req.user.id,
      imageUrl,
      detectedFoods: JSON.parse(detectedFoods || '[]'),
      nutritionData: JSON.parse(nutritionData || '{}'),
      mealType: mealType || 'snack',
      timestamp: new Date()
    });

    await meal.save();
    res.status(201).json({ message: 'Meal saved', meal });

  } catch (error) {
    console.log('Save meal error:', error);
    res.status(500).json({ message: 'Could not save meal' });
  }
});

// GET today's meals
router.get('/today', verifyToken, async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const meals = await MealLog.find({
      userId: req.user.id,
      timestamp: { $gte: start, $lte: end }
    }).sort({ timestamp: 1 });

    const totals = meals.reduce((acc, meal) => {
      const n = meal.nutritionData || {};
      acc.calories += n.calories || 0;
      acc.protein += n.protein || 0;
      acc.carbs += n.carbs || 0;
      acc.fat += n.fat || 0;
      acc.iron += n.iron || 0;
      acc.omega3 += n.omega3 || 0;
      acc.vitaminD += n.vitaminD || 0;
      acc.vitaminB12 += n.vitaminB12 || 0;
      acc.calcium += n.calcium || 0;
      acc.zinc += n.zinc || 0;
      acc.fiber += n.fiber || 0;
      return acc;
    }, {
      calories: 0, protein: 0, carbs: 0, fat: 0,
      iron: 0, omega3: 0, vitaminD: 0, vitaminB12: 0,
      calcium: 0, zinc: 0, fiber: 0
    });

    res.json({ meals, totals, water: 0 });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET all meals
router.get('/', verifyToken, async (req, res) => {
  try {
    const meals = await MealLog.find({ userId: req.user.id })
      .sort({ timestamp: -1 });
    res.json({ meals });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;