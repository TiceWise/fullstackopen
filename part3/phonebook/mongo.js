const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const databaseName = 'phonebook-app'

const url = `mongodb+srv://ticewise:${password}@testincourse.dlugg.mongodb.net/${databaseName}?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const phonebookEntrySchema = new mongoose.Schema({
  name: String,
  number: String,
})

const PhonebookEntry = mongoose.model('PhonebookEntry', phonebookEntrySchema)

if (process.argv.length === 3) {
  PhonebookEntry.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(phonebookEntry => {
      console.log(`${phonebookEntry.name} ${phonebookEntry.number}`)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length === 4 || process.argv.length > 5) {
  console.log('To display phonebook contents use: node mongo.js <password>')
  console.log('To add a name and number to phonebook use: node mongo.js <password> <name> <number>')
  process.exit(1)
}

if (process.argv.length === 5) {
  const newPhonebookEntry = new PhonebookEntry({
    name: process.argv[3],
    number: process.argv[4]
  })

  newPhonebookEntry.save().then(() => {
    console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
    mongoose.connection.close()
  })
}



