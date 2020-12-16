const db = require('../services/db.js')
const {merge} = require("mixme");
const {v4: uuid} = require('uuid')

module.exports = {

    async create(user) {
        if (!user.username) { // TODO validation here si le temps
            throw Error('Invalid user')
        }

        user.id = uuid()
        await db.put(`users:${user.id}`, JSON.stringify(user))
        return user;
    },

    async get(userId) {
        if (!userId) {
            throw Error('Invalid id')
        }

        const data = await db.get(`users:${userId}`)
        return JSON.parse(data)
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

        if (!original) {
            throw Error('Unregistered user id')
        }

        user = merge(original, user);
        await db.put(`users:${user.id}`, JSON.stringify(user))
        return user;
    },

    async delete(userId) {
        const original = this.get(userId);

        if (!original) {
            throw Error('Unregistered user id')
        }

        await db.del(`users:${userId}`);
    }
}
