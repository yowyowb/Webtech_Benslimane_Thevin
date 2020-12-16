const express = require('express');
const router = express.Router({ mergeParams: true });

const Messages = require('../models/messages');

router.get('/', async (req, res) => {
    // params from parent router
    console.log(req.params);
    const messages = await Messages.list(req.params.id)
    res.json(messages);
})

router.post('/', async (req, res) => {
    console.log(req.params);
    const messages = await Messages.create(req.params.id, req.body)
    res.status(201).json(messages)
})

module.exports = router;
