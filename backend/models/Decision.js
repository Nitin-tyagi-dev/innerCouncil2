const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  option: {
    type: String,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
}, { _id: false });

const recommendationSchema = new mongoose.Schema({
  bestOption: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  tradeoff: {
    type: String,
    required: true,
  },
  scores: [scoreSchema],
}, { _id: false });

const decisionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true,
  },
  options: {
    type: [String],
    validate: [options => options.length >= 2, 'Must have at least 2 options'],
  },
  category: {
    type: String,
    default: '',
  },
  generatedCriteria: {
    type: [String],
    default: [],
  },
  selectedPersonas: {
    type: [String],
    default: [],
  },
  finalRecommendation: {
    type: recommendationSchema,
    default: null,
  },
  status: {
    type: String,
    enum: ['pending', 'analyzed', 'complete'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Decision', decisionSchema);
