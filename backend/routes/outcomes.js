const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { saveOutcome, getOutcome } = require('../controllers/outcomeController');

router.use(protect); // Secure all routes

router.route('/:decisionId')
  .post(saveOutcome)
  .get(getOutcome);

module.exports = router;
