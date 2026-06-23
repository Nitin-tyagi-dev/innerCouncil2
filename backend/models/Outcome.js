const mongoose = require('mongoose');

const outcomeSchema = new mongoose.Schema({
  decisionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Decision',
    required: true,
    unique: true,
  },
  chosenOption: {
    type: String,
    required: [true, 'Please provide the chosen option'],
  },
  satisfactionScore: {
    type: Number,
    required: [true, 'Please provide a satisfaction score'],
    min: 1,
    max: 10,
  },
  notes: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Outcome', outcomeSchema);
