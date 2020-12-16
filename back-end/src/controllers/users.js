const express = require('express');
const router = express.Router();

const Users = require('../models/users');

router.get('/', async (req, res) => {
    const users = await Users.list()
    res.json(users);
})

router.post('/', async (req, res) => {
    const user = await Users.create(req.body)
    res.status(201).json(user)
})

router.get('/:id', async (req, res) => {
    const user = await Users.get(req.params.id)
    res.json(user)
})

router.put('/:id', async (req, res) => {
    const user = await Users.update(req.params.id, req.body)
    res.json(user)
})

router.delete('/:id', async (req, res) => {
    const user = await Users.delete(req.params.id)
    res.json(user)
})

module.exports = router;
