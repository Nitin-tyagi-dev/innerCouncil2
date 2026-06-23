const Decision = require('../models/Decision');
const Evaluation = require('../models/Evaluation');
const aiService = require('../services/aiService');

// @desc    Run persona debate & generate final recommendation
// @route   POST /api/evaluations/:decisionId
// @access  Private
const runEvaluation = async (req, res) => {
  const { decisionId } = req.params;

  try {
    const decision = await Decision.findById(decisionId);

    if (!decision) {
      return res.status(404).json({ message: 'Decision not found' });
    }

    // Verify ownership
    if (decision.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (!decision.options || decision.options.length < 2) {
      return res.status(400).json({ message: 'Decision must have at least 2 options to evaluate' });
    }

    // Fallbacks if criteria/personas were somehow not generated
    const criteria = decision.generatedCriteria.length > 0
      ? decision.generatedCriteria
      : ['Cost', 'Utility', 'Risk', 'Long-term Benefit'];
    
    const personas = decision.selectedPersonas.length > 0
      ? decision.selectedPersonas
      : ['Rational Analyst', 'Budget Guardian', 'Long-Term Planner'];

    // 1. Run Persona Debate
    const personaDebate = await aiService.runPersonaDebate(
      decision.title,
      decision.description,
      decision.options,
      criteria,
      personas
    );

    // 2. Generate Final Recommendation
    const finalRec = await aiService.generateRecommendation(
      decision.title,
      decision.options,
      criteria,
      personaDebate
    );

    // 3. Save Evaluation Document
    // Delete previous evaluation if exists to avoid duplication
    await Evaluation.deleteMany({ decisionId });

    const evaluation = new Evaluation({
      decisionId,
      personaDebate,
    });
    await evaluation.save();

    // 4. Update Decision final recommendation & status
    decision.finalRecommendation = finalRec;
    decision.status = 'complete';
    await decision.save();

    res.status(201).json({
      evaluation,
      decision
    });
  } catch (error) {
    console.error('Run evaluation error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get evaluation for a decision
// @route   GET /api/evaluations/:decisionId
// @access  Private
const getEvaluation = async (req, res) => {
  const { decisionId } = req.params;

  try {
    const decision = await Decision.findById(decisionId);
    if (!decision) {
      return res.status(404).json({ message: 'Decision not found' });
    }

    // Verify ownership
    if (decision.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const evaluation = await Evaluation.findOne({ decisionId });
    if (!evaluation) {
      return res.status(404).json({ message: 'Evaluation not found for this decision' });
    }

    res.json(evaluation);
  } catch (error) {
    console.error('Get evaluation error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  runEvaluation,
  getEvaluation,
};
