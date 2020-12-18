const db = require('../services/db.js')
const {v4: uuid} = require('uuid')
const microtime = require('microtime')
const {HttpBadRequestError} = require('../errors')

module.exports = {
    async create(channelId, { author, content }) {
        if (!channelId) {
            throw HttpBadRequestError("Missing 'channelId' property");
        }

        if (!author || !content) {
            throw HttpBadRequestError("Missing 'author' or 'content' property");
        }

        const id = uuid();
        const creation = microtime.now()
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
};
