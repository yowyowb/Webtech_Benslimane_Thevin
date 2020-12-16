const express = require('express');
const router = express.Router();

router.use('/users', require('./users'));
router.use('/channels', require('./channels'));
router.use('/channels/:id/messages', require('./messages'))

module.exports = router;
