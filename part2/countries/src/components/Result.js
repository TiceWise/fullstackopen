import React from 'react'

const Result = ({ searchResult, handleClick }) => {
  return (
    <div>
      {searchResult.map(country =>
        <div key={country.alpha2Code}>
          {country.name}
          <button id={country.alpha2Code} onClick={handleClick}>show</button>
        </div>
      )}
    </div>
  )

}

export default Result