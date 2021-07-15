import React, { useState, useEffect } from 'react'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import personService from './services/personService'
import { Notification, ErrorNotification } from './components/Notification'
import './index.css'

const App = () => {
  // const [persons, setPersons] = useState([
  //   { name: 'Arto Hellas', number: '040-123456' },
  //   { name: 'Ada Lovelace', number: '39-44-5323523' },
  //   { name: 'Dan Abramov', number: '12-43-234345' },
  //   { name: 'Mary Poppendieck', number: '39-23-6423122' }
  // ])
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [stringToSearch, setStringToSearch] = useState('')
  const [personsToShow, setPersonsToShow] = useState([])
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const timeOutDuration = 5000

  useEffect(() => {
    // console.log('effect')
    personService
      .getAll()
      .then(initialPersons => {
        // console.log('promise fulfilled')
        setPersons(initialPersons)
        setPersonsToShow(initialPersons) // a bit quick and dirty
      })
  }, [])

  // console.log('render', persons.length, 'notes')

  const addName = (event) => {
    event.preventDefault()

    const checkName = persons.filter(person => (person.name === newName))

    if (checkName.length > 0) {
      const result = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
      if (result) {
        const person = persons.find(person => (person.name === newName))
        const updatedPerson = { ...person, number: newNumber}
        personService
          .update(person.id, updatedPerson)
          .then(updatedPersonReturned => {
            setPersons(persons.map(person => person.name !== newName ? person : updatedPersonReturned))
            setPersonsToShow(personsToShow.map(person => person.name !== newName ? person : updatedPersonReturned))
            setNewName('')
            setNewNumber('')
            setMessage(`Updated ${person.name}'s number to ${newNumber}`)
            setTimeout(() => {
              setMessage(null)
            }, timeOutDuration)
          })
          .catch(error => {
            setErrorMessage(`Information of ${person.name} has already been removed from server`)
            setTimeout(() => {
              setMessage(null)
            }, timeOutDuration)
            setPersons(persons.filter(person => (person.name !== newName)))
            setPersonsToShow(personsToShow.filter(person => (person.name !== newName)))
            setNewName('')
            setNewNumber('')
          })
      }
    }
    else {
      const personObject = {
        name: newName,
        number: newNumber
      }

      personService
        .create(personObject)
        .then(personAdded => {
          setPersons(persons.concat(personAdded))
          setPersonsToShow(persons.concat(personAdded))
          setNewName('')
          setNewNumber('')
          setStringToSearch('')
          setMessage(`Added ${personObject.name}`)
          setTimeout(() => {
            setMessage(null)
          }, timeOutDuration)
        })
    }
  }

  const deletePerson = (id) => {
    // console.log({id})
    const personToDelete = persons.find(person => person.id === id)
    // console.log({personToDelete})
    if (personToDelete) {
      const result = window.confirm(`Delete ${personToDelete.name}?`)
      if (result) {
        personService
          .deletePerson(id)
          .then(response => {
            // console.log('so far...')
            setPersons(persons.filter(person => person.id !== id))
            setPersonsToShow(personsToShow.filter(person => person.id !== id))
            setMessage(`Deleted ${personToDelete.name}`)
            setTimeout(() => {
              setMessage(null)
            }, timeOutDuration)
          })
      }
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
      <Notification message={message} />
      <ErrorNotification message={errorMessage} />
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
      <div>
        {personsToShow.map((person) =>
          <Persons 
            key={person.id}
            person={person}
            deletePerson={() => deletePerson(person.id)}
          />
        )}
      </div>
    </div>
  )
}

export default App