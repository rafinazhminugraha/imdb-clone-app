import React, { useState } from 'react'
import Search from './components/Search.jsx'

const App = () => {
  const [searchTerm, setsearchTerm] = useState('Avengers');

  return (
    <main>
      <div className="pattern" />
      
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find All <span className='text-gradient'>Movies</span> With a Cup of Coffee
          </h1>
        </header>

        <Search searchTerm={searchTerm} setsearchTerm={setsearchTerm} />
      </div>
    </main>
  )
}

export default App