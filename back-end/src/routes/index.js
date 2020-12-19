const express = require('express');
const router = express.Router();
const { errorHandler } = require('../errors');

router.use('/users', require('./users'));
router.use('/channels', require('./channels'));
router.use('/channels/:id/messages', require('./messages'))
router.use(errorHandler)

module.exports = router;
