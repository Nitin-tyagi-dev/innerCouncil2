const mongoose = require('mongoose');

const criterionScoreSchema = new mongoose.Schema({
  criterion: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
}, { _id: false });

const optionEvaluationSchema = new mongoose.Schema({
  option: {
    type: String,
    required: true,
  },
  scores: [criterionScoreSchema],
  summary: {
    type: String,
    required: true,
  },
  concerns: {
    type: String,
    required: true,
  },
}, { _id: false });

const personaDebateSchema = new mongoose.Schema({
  persona: {
    type: String,
    required: true,
  },
  evaluations: [optionEvaluationSchema],
}, { _id: false });

const evaluationSchema = new mongoose.Schema({
  decisionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Decision',
    required: true,
  },
  personaDebate: [personaDebateSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Evaluation', evaluationSchema);
