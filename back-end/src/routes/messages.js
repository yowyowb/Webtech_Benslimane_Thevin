const express = require('express');
const router = express.Router({ mergeParams: true });
const { requestWrapper, HttpUnAuthorizedError } = require('../errors')
const Messages = require('../models/messages');
const Channels = require('../models/channels')
const { serializeMessages } = require('../services/serializer');

router.get('/', requestWrapper(async (req, res) => {
    const channelId = req.params.id;
    const channel = await Channels.get(channelId);

    if (!channel.users.includes(req.user.id)) {
        throw new HttpUnAuthorizedError('You are not member of this channel');
    }

    const messages = await Messages.list(channelId);

    res.json(await serializeMessages(messages));
}))

router.post('/', requestWrapper(async (req, res) => {
    const channelId = req.params.id;
    const channel = await Channels.get(channelId);

    console.log('oui');
    if (!channel.users.includes(req.user.id)) {
        throw new HttpUnAuthorizedError('You are not member of this channel');
    }

    const messageDTO = req.body;
    messageDTO.author = req.user.id;

    const message = await Messages.create(channelId, req.body)
    res.status(201).json(message)
}))

module.exports = router;
