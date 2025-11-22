import React from 'react'

const Search = ({searchTerm , setsearchTerm}) => {
  return (
    <div className="search">
      <div>
        <img src="search.png" alt="search" />
        <input 
          type="text"
          placeholder='Seacrh Any Movies'
          value={searchTerm}
          onChange={(e) => setsearchTerm(e.target.value)}
        />
      </div>
    </div>
  )
}

export default Search