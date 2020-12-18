const express = require('express');
const router = express.Router({ mergeParams: true });
const { requestWrapper } = require('../errors')
const Messages = require('../models/messages');

router.get('/', requestWrapper(async (req, res) => {
    // params from parent router
    const messages = await Messages.list(req.params.id)
    res.json(messages);
}))

router.post('/', requestWrapper(async (req, res) => {
    const messages = await Messages.create(req.params.id, req.body)
    res.status(201).json(messages)
}))

module.exports = router;
