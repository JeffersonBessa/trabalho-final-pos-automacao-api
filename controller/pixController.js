const express = require('express');
const router = express.Router();
const pixService = require('../service/pixService');

router.post('/pay', pixService.pay);
router.post('/receive', pixService.receive);

module.exports = router;
