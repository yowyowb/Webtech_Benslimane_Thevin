const db = require('../services/db.js')
const {merge} = require("mixme");
const {v4: uuid} = require('uuid')
const {HttpNotFoundError, HttpBadRequestError} = require('../errors')

module.exports = {

    async create(channel) {
        if (!channel.name) { // TODO validation here si le temps
            throw HttpBadRequestError('missing \'name\' property\'')
        }

        channel.id = uuid()
        await db.put(`channels:${channel.id}`, JSON.stringify(channel))
        return channel;
    },

    async get(channelId) {
        if (!channelId) {
            throw new HttpBadRequestError("missing 'id' property")
        }

        try {
            const data = await db.get(`channels:${channelId}`)
            return JSON.parse(data)
        } catch (error) {
            throw new HttpNotFoundError('Channel not found');
        }
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
        channel = merge(original, channel);
        await db.put(`channels:${channel.id}`, JSON.stringify(channel))
        return channel;
    },

    async delete(channelId) {
        await this.get(channelId);
        await db.del(`channels:${channelId}`);
    }
}
