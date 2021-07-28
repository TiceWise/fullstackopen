const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


const password = process.env.DBPASSWORD

const databaseName = 'phonebook-app'
const username = 'ticewise'
const clusterName = 'testincourse'

const url = `mongodb+srv://${username}:${password}@${clusterName}.dlugg.mongodb.net/${databaseName}?retryWrites=true&w=majority`

console.log('connecting to', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const phonebookEntrySchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
    unique: true
  },
  number: {
    type: String,
    required: true,
    validate: /^(\d-* *){8,}$/
  },
})

phonebookEntrySchema.plugin(uniqueValidator)

phonebookEntrySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('PhonebookEntry', phonebookEntrySchema)