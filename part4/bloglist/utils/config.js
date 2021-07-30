require('dotenv').config()

const password = process.env.DBPASSWORD
const PORT = process.env.PORT

const databaseName = 'bloglist-app'
const username = 'ticewise'
const clusterName = 'testincourse'

const MONGODB_URI = `mongodb+srv://${username}:${password}@${clusterName}.dlugg.mongodb.net/${databaseName}?retryWrites=true&w=majority`

module.exports = {
  MONGODB_URI,
  PORT
}