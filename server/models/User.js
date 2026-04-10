const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  weight: { type: Number, default: null },
  height: { type: Number, default: null },
  age: { type: Number, default: null },
  gender: { type: String, enum: ['male', 'female', 'other'], default: null },
  dietType: {
    type: String,
    enum: ['vegetarian', 'eggetarian', 'non-vegetarian'],
    default: null
  },
  deficiencies: [{
    type: String,
    enum: ['iron', 'omega3', 'vitaminD', 'vitaminB12', 'calcium', 'zinc', 'fiber', 'protein']
  }],
  isOnboarded: { type: Boolean, default: false }

}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);