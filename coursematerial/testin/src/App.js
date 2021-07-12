import React, { useState } from 'react'
import Note from './components/Note'

const App = (props) => {
  const [notes, setNotes] = useState(props.notes)
  // const [notes, setNotes] = useState([])  // if you want to start with an empty list
  // also then no app-props needed
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

    const handleNoteChange = (event) => {
      // no preventDefault needed, as there is no default for onChange
      console.log(event.target.value)
      setNewNote(event.target.value)
    }

  const addNote = (event) => {
    event.preventDefault() // prevents among others page refresh after click
    // console.log('button clicked', event.target)
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() < 0.5,
      id: notes.length + 1,
    }

    setNotes(notes.concat(noteObject))
    setNewNote('')
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)
  
  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>
      <ul>
        {notesToShow.map(note => 
          <Note key={note.id} note={note} />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input 
          value={newNote} 
          onChange={handleNoteChange}
        />
        <button type='submit'>save</button>
      </form>
    </div>
  )
}

export default App 