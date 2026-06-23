const Decision = require('../models/Decision');
const Evaluation = require('../models/Evaluation');
const Outcome = require('../models/Outcome');
const aiService = require('../services/aiService');

// @desc    Create new decision
// @route   POST /api/decisions
// @access  Private
const createDecision = async (req, res) => {
  const { title, description, options } = req.body;

  try {
    if (!title || !description || !options) {
      return res.status(400).json({ message: 'Title, description, and options are required' });
    }

    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ message: 'Decisions must have at least 2 options' });
    }

    // Create decision in pending state
    const decision = new Decision({
      userId: req.user.id,
      title,
      description,
      options: options.map(opt => opt.trim()),
      status: 'pending',
    });

    await decision.save();

    // Trigger AI Context Analysis immediately
    try {
      const aiAnalysis = await aiService.analyzeContext(title, description);
      
      decision.category = aiAnalysis.category || 'general';
      decision.generatedCriteria = aiAnalysis.generatedCriteria || [];
      decision.selectedPersonas = aiAnalysis.selectedPersonas || [];
      decision.status = 'analyzed';

      await decision.save();
      res.status(201).json(decision);
    } catch (aiError) {
      console.error('AI Context Analysis failed:', aiError);
      // Even if AI context analysis fails, we have the decision, but we should set fallback criteria/personas or return error
      // Let's provide fallback so the app remains usable or throw error
      decision.category = 'general';
      decision.generatedCriteria = ['Cost', 'Usability', 'Reliability', 'Long-term Value'];
      decision.selectedPersonas = ['Rational Analyst', 'Budget Guardian', 'Long-Term Planner'];
      decision.status = 'analyzed';
      
      await decision.save();
      // Return with warning header or message
      res.status(201).json({
        ...decision.toObject(),
        warning: 'AI analysis failed; loaded default evaluation criteria.'
      });
    }
  } catch (error) {
    console.error('Create decision error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all decisions for logged-in user
// @route   GET /api/decisions
// @access  Private
const getDecisions = async (req, res) => {
  try {
    const decisions = await Decision.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(decisions);
  } catch (error) {
    console.error('Get decisions error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single decision by ID
// @route   GET /api/decisions/:id
// @access  Private
const getDecisionById = async (req, res) => {
  try {
    const decision = await Decision.findById(req.params.id);

    if (!decision) {
      return res.status(404).json({ message: 'Decision not found' });
    }

    // Verify ownership
    if (decision.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(decision);
  } catch (error) {
    console.error('Get decision by id error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a decision
// @route   DELETE /api/decisions/:id
// @access  Private
const deleteDecision = async (req, res) => {
  try {
    const decision = await Decision.findById(req.params.id);

    if (!decision) {
      return res.status(404).json({ message: 'Decision not found' });
    }

    // Verify ownership
    if (decision.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Delete associated evaluations and outcomes
    await Evaluation.deleteMany({ decisionId: decision._id });
    await Outcome.deleteMany({ decisionId: decision._id });
    
    // Delete decision
    await Decision.findByIdAndDelete(req.params.id);

    res.json({ message: 'Decision and related records deleted successfully' });
  } catch (error) {
    console.error('Delete decision error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createDecision,
  getDecisions,
  getDecisionById,
  deleteDecision,
};
