const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const User = require('../models/User');

router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { age, gender, weight, height, dietType, deficiencies, isOnboarded } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { age, gender, weight, height, dietType, deficiencies, isOnboarded },
      { new: true }
    ).select('-password');

    res.json({ user: updatedUser });
  } catch (error) {
    console.log('Profile update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;