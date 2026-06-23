const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { runEvaluation, getEvaluation } = require('../controllers/evaluationController');

router.use(protect); // Secure all routes

router.route('/:decisionId')
  .post(runEvaluation)
  .get(getEvaluation);

module.exports = router;
