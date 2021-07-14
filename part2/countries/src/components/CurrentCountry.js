import React from 'react'

const CurrentCountry = ({ countryToShow, weather }) => {

  return (
    <div>
      <h1>{countryToShow.name}</h1>
      <div>capital: {countryToShow.capital}</div>
      <div>population: {countryToShow.population}</div>
      <h2>languages</h2>
      <ul>
      {countryToShow.languages.map(luanguage =>
          <li key={luanguage.name}>{luanguage.name}</li>
        )}
      </ul>
      <img src={countryToShow.flag} alt="flag" width="100" />
      <h2>Weather in {countryToShow.capital}</h2>
      <div><b>temperature:</b> {weather.temperature} Celcius</div>
      <img src={weather.weather_icons} alt="weather icon" width="50" />
      <div><b>wind:</b> {weather.wind_speed} mph direction {weather.wind_dir}</div>
    </div>
  )
}

export default CurrentCountry