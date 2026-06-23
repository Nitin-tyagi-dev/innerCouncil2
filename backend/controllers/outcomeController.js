const Outcome = require('../models/Outcome');
const Decision = require('../models/Decision');

// @desc    Record actual outcome of a decision
// @route   POST /api/outcomes/:decisionId
// @access  Private
const saveOutcome = async (req, res) => {
  const { decisionId } = req.params;
  const { chosenOption, satisfactionScore, notes } = req.body;

  try {
    const decision = await Decision.findById(decisionId);

    if (!decision) {
      return res.status(404).json({ message: 'Decision not found' });
    }

    // Verify ownership
    if (decision.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Validate that the chosen option exists in decision options
    if (!decision.options.includes(chosenOption)) {
      return res.status(400).json({ message: 'Chosen option must be one of the original decision options' });
    }

    // Check if score is valid
    const score = Number(satisfactionScore);
    if (isNaN(score) || score < 1 || score > 10) {
      return res.status(400).json({ message: 'Satisfaction score must be a number between 1 and 10' });
    }

    // Check if outcome already exists
    let outcome = await Outcome.findOne({ decisionId });

    if (outcome) {
      outcome.chosenOption = chosenOption;
      outcome.satisfactionScore = score;
      outcome.notes = notes || '';
      await outcome.save();
    } else {
      outcome = new Outcome({
        decisionId,
        chosenOption,
        satisfactionScore: score,
        notes: notes || '',
      });
      await outcome.save();
    }

    res.status(201).json(outcome);
  } catch (error) {
    console.error('Save outcome error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged outcome for a decision
// @route   GET /api/outcomes/:decisionId
// @access  Private
const getOutcome = async (req, res) => {
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

    const outcome = await Outcome.findOne({ decisionId });
    if (!outcome) {
      return res.status(404).json({ message: 'Outcome not logged for this decision' });
    }

    res.json(outcome);
  } catch (error) {
    console.error('Get outcome error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  saveOutcome,
  getOutcome,
};
