import React from 'react'

const Filter = ({ stringToSearch, handleSearch }) => {
  return (
    <form>
      <div>
        filter shown with
        <input
          value={stringToSearch}
          onChange={handleSearch}
        />
      </div>
    </form>
  )
}

export default Filter