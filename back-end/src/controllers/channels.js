const express = require('express');
const router = express.Router();

const Channels = require('../models/channels');

router.get('/', async (req, res) => {
    const channels = await Channels.list()
    res.json(channels);
})

router.post('/', async (req, res) => {
    const channel = await Channels.create(req.body)
    res.status(201).json(channel)
})

router.get('/:id', async (req, res) => {
    const channel = await Channels.get(req.params.id)
    res.json(channel)
})

router.put('/:id', async (req, res) => {
    const channel = await Channels.update(req.params.id, req.body)
    res.json(channel)
})

router.delete('/:id', async (req, res) => {
    const channel = await Channels.delete(req.params.id)
    res.json(channel)
})

module.exports = router;
