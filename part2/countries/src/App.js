import React, { useState, useEffect } from 'react'
import Result from './components/Result'
import CurrentCountry from './components/CurrentCountry'

import axios from 'axios'

const App = () => {
  const [stringToSearch, setStringToSearch] = useState('')
  const [countries, setCountries] = useState([])
  const [searchResult, setSearchResult] = useState([])
  const [countryToShow, setCountryToShow] = useState({})
  const [showCountry, setShowCountry] = useState(false)
  const [weather, setWeather] = useState({})

  useEffect(() => {
    // console.log('effect')
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        // console.log('promise fulfilled')
        setCountries(response.data)
      })
  }, [])

  useEffect(() => {
    if (showCountry){
      // console.log(`http://api.weatherstack.com/current?access_key=${process.env.REACT_APP_API_KEY}&query=${countryToShow.capital}`)

      axios
        .get(`http://api.weatherstack.com/current?access_key=${process.env.REACT_APP_API_KEY}&query=${countryToShow.capital}`)
        .then(response => {
          // console.log('promise fulfilled')
          // console.log(response.data)
          if ('current' in response.data){
            // console.log('weather succes')
            setWeather(response.data.current)
          }
          else{
            // console.log('weather failed')
            setWeather({})
          }
        })
    }
    else{
      // console.log('not showing country, clear weather')
      setWeather({})
    }
  },[showCountry, countryToShow])

  const handleSearch = (event) => {
    const searchStringLowerCase = event.target.value.toLowerCase()
    setShowCountry(false)
    if (searchStringLowerCase) {
      // console.log(`searching ${searchStringLowerCase}...`)
      setSearchResult(countries.filter(country =>
        country.name.toLocaleLowerCase().includes(searchStringLowerCase)))
    }
    else {
      setSearchResult([])
    }
    setStringToSearch(event.target.value)
  }

  const prepareShowCountry = (countryInput) => {
    setShowCountry(true)
    setCountryToShow(countryInput)
  }

  const handleClick = (event) => {
    event.preventDefault()
    const clickedCountry = searchResult.filter(country => (country.alpha2Code === event.target.id))
    prepareShowCountry(clickedCountry[0])
  }

  // this part of the code is not a function but done on each render!
  if (searchResult.length === 1 && !showCountry ) {
    prepareShowCountry(searchResult[0])
  }

  return (
    <div>
      <form>
        find countries
        <input
          value={stringToSearch}
          onChange={handleSearch}
        />
      </form>
      { searchResult.length > 10 ? <div>Too many matches, specify another filter</div> : null}
      { searchResult.length === 0 && stringToSearch.length > 0 ? <div>No match</div> : null}
      { searchResult.length < 10 && searchResult.length > 1 ? <Result searchResult={searchResult} handleClick={handleClick} /> : null}
      { showCountry ? <CurrentCountry countryToShow={countryToShow} weather={weather} /> : null}
    </div>
  )
}

export default App