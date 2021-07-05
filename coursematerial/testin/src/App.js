import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react'

// when application starts, App is executed (see index.js)
// use useState hook to create application state, setting counter
// App component containst the DisplayCounter and Button component
// Button clicked > event handler executed > changes state of App (through setCounter) > component rerender
// Calling a function which changes the state causes the component to rerender.

// Finally; don't implement components inside other components (like App)
const DisplayCounter = ({ counter }) => <p>{counter}</p>

const Button = ({ text, handleClick }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

function App() {
  // "HOOKS", don't call anywhere but in a function defining component, not in loops, 
  // not in conditional expressions, etc. as hooks must be called in the right order.
  const [counter, setCounter] = useState(0) // desctructuring useState, 0 is init value

  // setTimeout(
  //   () => setCounter(counter + 1),
  //   1000
  // )

  // console.log('rendering...', counter)

  // const handleClick = () => {
  //   // console.log('clicked')
  //   setCounter(counter + 1)
  // }

  // <button onClick={() => console.log('clicked')}>
  // <button onClick={handleClick}>

  // defining event handlers within jsx-templates not such a good idea
  // <button onClick={() => setCounter(counter + 1)}>
  // <button onClick={() => setCounter(counter - 1)}>

  const increaseByOne = () => setCounter(counter + 1)
  const decreaseByOne = () => setCounter(counter - 1)
  const setToZero = () => setCounter(0)

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" width={counter * 10} />
        <DisplayCounter counter={counter} />
        <Button text={"plus"} handleClick={increaseByOne} />
        <Button text={"minus"} handleClick={decreaseByOne} />
        <Button text={"zero"} handleClick={setToZero} />
      </header>
    </div>
  );
}

export default App;
