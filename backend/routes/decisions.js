const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createDecision,
  getDecisions,
  getDecisionById,
  deleteDecision,
} = require('../controllers/decisionController');

router.use(protect); // Secure all routes in this router

router.route('/')
  .post(createDecision)
  .get(getDecisions);

router.route('/:id')
  .get(getDecisionById)
  .delete(deleteDecision);

module.exports = router;
