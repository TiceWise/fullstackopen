require('dotenv').config()

const express = require('express')
const app = express()
const PhonebookEntry = require('./models/phonebookEntry')

const morgan = require('morgan')
const cors = require('cors')

app.use(express.static('build'))
app.use(express.json())

app.use(cors())

// morgan.token('http-post-data', function (req, res) { return JSON.stringify(req.body) })
// or if only return on POST requests like the assignment suggests:
morgan.token('http-post-data', function (req, res) { 
  return req.method === 'POST' ? JSON.stringify(req.body) : " "
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :http-post-data'))

// let persons = [
//   { 
//     "id": 1,
//     "name": "Arto Hellas", 
//     "number": "040-123456"
//   },
//   { 
//     "id": 2,
//     "name": "Ada Lovelace", 
//     "number": "39-44-5323523"
//   },
//   { 
//     "id": 3,
//     "name": "Dan Abramov", 
//     "number": "12-43-234345"
//   },
//   { 
//     "id": 4,
//     "name": "Mary Poppendieck", 
//     "number": "39-23-6423122"
//   }
// ]

app.get('/', (request, response) => {
  response.send('if you see this, build is not loaded')
})

app.get('/info', (request, response, next) => {
  PhonebookEntry.find({})
    .then(phonebookentries => {
      const numberOfEntires = phonebookentries.length
      const dateString = new Date()
      response.send(
        `<p>Phonebook has info for ${numberOfEntires} people</p> 
        <p>${dateString}</p>`
      )
    })
    .catch(error => next(error))
})

app.get('/api/persons', (request, response, next) => {
  PhonebookEntry.find({})
    .then(phonebookentries => {
      response.json(phonebookentries)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  PhonebookEntry.findById(request.params.id)
    .then(newPbEntry => {
      if (newPbEntry) {
        response.json(newPbEntry)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  PhonebookEntry.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// generateId = () => {
//   return Math.round(Math.random()*10000)
// }

app.post('/api/persons', (request,response, next) => {
  // The json-parser takes the raw data from the requests that's stored in the 
  // request object, parses it into a JavaScript object and assigns it to the 
  // request object as a new property body.
  const body = request.body
  
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name and/or number missing'
    })
  }

  const newPhonebookEntry = new PhonebookEntry({
    // id: generateId(),
    name: body.name,
    number: body.number
  })

  newPhonebookEntry.save()
    .then(savedPbEntry => {
      response.json(savedPbEntry)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name and/or number missing'
    })
  }

  const newPhonebookEntry = {
    name: body.name,
    number: body.number
  }

  PhonebookEntry.findByIdAndUpdate(request.params.id, newPhonebookEntry, { new: true, runValidators: true, context: 'query' })
    .then(updatedPbEntry => {
      if (updatedPbEntry) {
        response.json(updatedPbEntry)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})