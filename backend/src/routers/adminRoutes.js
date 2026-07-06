const express = require('express');
const router = express.Router();

const { summaryStats } = require('../controllers/adminController');

router.get('/summary', summaryStats);

module.exports = router;