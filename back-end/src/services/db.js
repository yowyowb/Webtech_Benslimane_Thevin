const level = require('level')
const db = level(__dirname + '/../../db')

module.exports = db;

const tmp = {
  admin: {
    clear: async () => {
      await db.clear()
    }
  }
}
