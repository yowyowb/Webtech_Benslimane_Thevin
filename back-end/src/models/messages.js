const db = require('../services/db.js')
const {v4: uuid} = require('uuid')
const {HttpBadRequestError, HttpNotFoundError} = require('../errors')

module.exports = {
    async create(channelId, { author, content }) {
        if (!channelId) {
            throw HttpBadRequestError("Missing 'channelId' property");
        }

        if (!author || !content) {
            throw HttpBadRequestError("Missing 'author' or 'content' property");
        }

        const id = uuid();
        const creation = new Date().getTime();
        const message = {
            id,
            author,
            content,
            creation,
            channelId,
        };

        await db.put(`messages:${channelId}:${creation}`, JSON.stringify(message));
        return message;
    },

    async list(channelId) {
        return new Promise((resolve, reject) => {
            const messages = []
            db.createReadStream({
                gt: `messages:${channelId}:`,
                lte: `messages:${channelId}` + String.fromCharCode(":".charCodeAt(0) + 1),
            }).on('data', ({value}) => {
                const message = JSON.parse(value)
                messages.push(message)
            }).on('error', (err) => {
                reject(err)
            }).on('end', () => {
                resolve(messages)
            })
        })
    },

    async get(channelId, creation) {
        if (!channelId || !creation) {
            throw new HttpBadRequestError("missing 'id' property or 'creation'")
        }

        try {
            const data = await db.get(`messages:${channelId}:${creation}`)
            return JSON.parse(data)
        } catch (error) {
            throw new HttpNotFoundError('Message not found');
        }
    },

    async delete(message) {
        await db.del(`messages:${message.channelId}:${message.creation}`);
    }
};
