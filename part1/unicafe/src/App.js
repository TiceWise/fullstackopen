import React, { useState } from 'react'

const Button = ({ text, handleClick }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const Statistic = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
)

const roundToTwoDecimal = number => Math.round(number * 100) / 100

const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad
  const average = roundToTwoDecimal((good - bad) / total)
  const positivePerc = roundToTwoDecimal((good / total) * 100)

  if (total === 0) {
    return (
      <div>No feedback given</div>
    )
  }

  return (
    <table>
      <tbody>
        <Statistic text="good" value={good} />
        <Statistic text="neutral" value={neutral} />
        <Statistic text="bad" value={bad} />
        <Statistic text="all" value={total} />
        <Statistic text="average" value={average} />
        <Statistic text="positive" value={positivePerc.toString() + ' %'} />
        {/* A bit quick and dirty to pass the percentage sign */}
      </tbody>
    </table>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const increaseGood = () => setGood(good + 1)
  const increaseNeutral = () => setNeutral(neutral + 1)
  const increaseBad = () => setBad(bad + 1)

  return (
    <div>
      <h1>give feedback</h1>
      <Button text="good" handleClick={increaseGood} />
      <Button text="neutral" handleClick={increaseNeutral} />
      <Button text="bad" handleClick={increaseBad} />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App