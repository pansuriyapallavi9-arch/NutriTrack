const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const WaterLog = require('../models/WaterLog');

router.get('/today', verifyToken, async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const log = await WaterLog.findOne({
      userId: req.user.id,
      date: { $gte: start, $lte: end }
    });

    res.json({ water: log?.amount || 0 });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/add', verifyToken, async (req, res) => {
  try {
    const { amount } = req.body;
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    let log = await WaterLog.findOne({
      userId: req.user.id,
      date: { $gte: start, $lte: end }
    });

    if (log) {
      log.amount += amount;
      await log.save();
    } else {
      log = await WaterLog.create({
        userId: req.user.id,
        amount,
        date: new Date()
      });
    }

    res.json({ water: log.amount });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;