const db = require('../services/db.js')
const {merge} = require("mixme");
const {v4: uuid} = require('uuid')

module.exports = {

    async create(channel) {
        if (!channel.name) { // TODO validation here si le temps
            throw Error('Invalid channel')
        }

        channel.id = uuid()
        await db.put(`channels:${channel.id}`, JSON.stringify(channel))
        return channel;
    },

    async get(channelId) {
        if (!channelId) {
            throw Error('Invalid id')
        }

        const data = await db.get(`channels:${channelId}`)
        return JSON.parse(data)
    },

    async list() {
        return new Promise((resolve, reject) => {
            const channels = []
            db.createReadStream({
                gt: "channels:",
                lte: "channels" + String.fromCharCode(":".charCodeAt(0) + 1),
            }).on('data', ({value, key}) => {
                const channel = JSON.parse(value)
                channels.push(channel)
            }).on('error', (err) => {
                reject(err)
            }).on('end', () => {
                resolve(channels)
            })
        })
    },

    async update(id, channel) {
        const original = await this.get(id);

        if (!original) {
            throw Error('Unregistered user id')
        }

        channel = merge(original, channel);
        await db.put(`channels:${channel.id}`, JSON.stringify(channel))
        return channel;
    },

    async delete(channelId) {
        const original = this.get(channelId);

        if (!original) {
            throw Error('Unregistered user id')
        }

        await db.del(`channels:${channelId}`);
    }
}
