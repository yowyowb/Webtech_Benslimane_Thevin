
const Users = require('../models/users');


module.exports = {

    async serializeMessages(messages) {
        const users = await Users.findUsers(messages.map(message => message.author));
        return messages.map(message => ({...message, author: users.find(user => user.id === message.author)}))
    }
}
