const db = require('../services/db.js')
const {v4: uuid} = require('uuid')
const microtime = require('microtime')

module.exports = {
    async create(channelId, { author, content }) {
        console.log(channelId);
        if (!channelId) {
            throw Error('Invalid channel')
        }

        if (!author || !content) {
            throw Error('Invalid message')
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
