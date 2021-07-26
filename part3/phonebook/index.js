const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

// morgan.token('http-post-data', function (req, res) { return JSON.stringify(req.body) })
// or if only return on POST requests like the assignment suggests:
morgan.token('http-post-data', function (req, res) { 
  return req.method === 'POST' ? JSON.stringify(req.body) : " "
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :http-post-data'))

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/info', (request, response) => {
  const numberOfPersons = persons.length
  const dateString = new Date()
  response.send(
    `<p>Phonebook has info for ${numberOfPersons} people</p> 
    <p>${dateString}</p>`
  )
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  // console.log('delete started')
  const id = Number(request.params.id)
  // console.log(id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

generateId = () => {
  return Math.round(Math.random()*10000)
}

app.post('/api/persons', (request,response) => {
  // The json-parser takes the raw data from the requests that's stored in the 
  // request object, parses it into a JavaScript object and assigns it to the 
  // request object as a new property body.
  const body = request.body
  
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name and/or number missing'
    })
  }

  const nameExists = persons.find(person => person.name === body.name)
  
  if (nameExists) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})