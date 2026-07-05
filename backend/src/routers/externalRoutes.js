const express = require('express');
const router = express.Router();

const { summaryStats, getTransactions } = require('../controllers/externalController');

router.get('/summary', summaryStats);
router.get('/transactions', getTransactions);

module.exports = router;