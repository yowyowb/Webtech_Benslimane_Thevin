const db = require('../services/db.js')
const {merge} = require("mixme");
const {v4: uuid} = require('uuid')
const {HttpNotFoundError, HttpBadRequestError} = require('../errors')

const queryFunction = (query, user) => {
    for (const [key, value] of Object.entries(query)) {
        if (user[key] !== value) {
            return false;
        }
    }

    return true;
}

module.exports = {

    async create(user) {
        if (!user.email) { // TODO validation here si le temps
            throw new HttpBadRequestError("missing 'username' field");
        }

        if (!user.username) {
            user.username = user.email;
        }

        user.id = uuid()
        await db.put(`users:${user.id}`, JSON.stringify(user))
        return user;
    },

    async get(userId) {
        if (!userId) {
            throw new HttpNotFoundError('User not found');
        }

        try {
            const data = await db.get(`users:${userId}`)
            return JSON.parse(data)
        } catch (e) {
            throw new HttpNotFoundError('User not found');
        }
    },

    async list() {
        return new Promise((resolve, reject) => {
            const users = []
            db.createReadStream({
                gt: "users:",
                lte: "users" + String.fromCharCode(":".charCodeAt(0) + 1),
            }).on('data', ({value}) => {
                const user = JSON.parse(value)
                users.push(user)
            }).on('error', (err) => {
                reject(err)
            }).on('end', () => {
                resolve(users)
            })
        })
    },

    async update(id, user) {
        const original = await this.get(id);
        user = merge(original, user);
        await db.put(`users:${user.id}`, JSON.stringify(user))
        return user;
    },

    async delete(userId) {
        await this.get(userId);
        await db.del(`users:${userId}`);
    },

    async findBy(query) {
        const users = await this.list();
        return users.find(user => queryFunction(query, user))
    },

    async exists(query) {
        const users = await this.list();
        return users.some(user => queryFunction(query, user))
    }
}
