const express = require('express');
const router = express.Router();
const {requestWrapper, HttpUnAuthorizedError, HttpBadRequestError} = require('../errors')
const Channels = require('../models/channels');

router.get('/', requestWrapper(async (req, res) => {
    const channels = await Channels.listUserChannels(req.user.id);
    res.json(channels);
}))

router.post('/', requestWrapper(async (req, res) => {
    const channelDTO = req.body;
    channelDTO.owner = req.user.id;
    const channel = await Channels.create(channelDTO);
    res.status(201).json(channel)
}))

router.post('/:id/add/:userId', requestWrapper(async (req, res) => {
    const channelId = req.params.id;
    const userId = req.params.userId;
    const channel = await Channels.get(channelId);

    if (channel.owner !== req.user.id) {
        throw new HttpUnAuthorizedError(`Your are not the owner of the channel ${channelId}`)
    }

    if (!channel.users.includes(userId)) {
        channel.users.push(userId)
        await Channels.update(channel.id, channel);
    }

    res.json(channel)
}))

router.post('/:id/leave', requestWrapper(async (req, res) => {
    const channelId = req.params.id;
    let channel = await Channels.get(channelId);

    console.log(channelId, channel);

    if (channel.owner === req.user.id) {
        throw new HttpBadRequestError("You can't leave your own channels");
    }

    if (!channel.users.includes(req.user.id)) {
        throw new HttpUnAuthorizedError(`You are not member of the channel "${channel.name}"`)
    }

    channel.users = channel.users.filter(userId => userId !== req.user.id);
    channel = await Channels.update(channelId, channel);

    res.json(channel);
}))

router.get('/:id', requestWrapper(async (req, res) => {
    const channel = await Channels.get(req.params.id)

    if (!channel.users.includes(req.user.id)) {
        throw new HttpUnAuthorizedError('You are not member of this channel');
    }

    res.json(channel)
}))

router.put('/:id', requestWrapper(async (req, res) => {
    const channelId = req.params.id;
    let channel = Channels.get(channelId);

    if (channel.owner !== req.user.id) {
        throw new HttpUnAuthorizedError('You are not the owner of this channel');
    }

    channel = Channels.update(channelId, channel);
    res.json(channel)
}))

router.delete('/:id', requestWrapper(async (req, res) => {
    const channel = await Channels.get(req.params.id)

    if (channel.owner !== req.user.id) {
        throw new HttpUnAuthorizedError('Your not the owner of this channel');
    }

    await Channels.delete(channel.id)
    res.status(204).send();
}))

module.exports = router;
