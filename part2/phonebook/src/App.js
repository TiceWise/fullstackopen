import React, { useState } from 'react'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [stringToSearch, setStringToSearch] = useState('')
  const [personsToShow, setPersonsToShow] = useState(persons)

  const addName = (event) => {
    event.preventDefault()

    const checkName = persons.filter(person => (person.name === newName))

    if (checkName.length > 0) {
      window.alert(`${newName} is already added to phonebook`)
    }
    else {
      const personObject = {
        name: newName,
        number: newNumber
      }

      setPersons(persons.concat(personObject))
      setPersonsToShow(persons.concat(personObject))
      setNewName('')
      setNewNumber('')
      setStringToSearch('')
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearch = (event) => {
    const searchStringLowerCase = event.target.value.toLowerCase()
    if (searchStringLowerCase) {
      // console.log(`searching ${searchStringLowerCase}...`)
      setPersonsToShow(persons.filter(person =>
        person.name.toLocaleLowerCase().includes(searchStringLowerCase)))
    }
    else {
      setPersonsToShow(persons)
    }
    setStringToSearch(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter stringToSearch={stringToSearch} handleSearch={handleSearch} />

      <h3>Add a new</h3>

      <PersonForm
        addName={addName}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>
      
      <Persons personsToShow={personsToShow} />
    </div>
  )
}

export default App