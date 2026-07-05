const router = require('express').Router();
const { createTransaction, getTransactions } = require('../controllers/transactionController');


router.post('/createTransaction', createTransaction);
router.get('/getTransactions', getTransactions);

module.exports = router;