import React, { useEffect, useState } from 'react';
import { useDebounce } from 'react-use';
import Search from './components/Search.jsx';
import Spinner from './components/spinner';
import MovieCard from './components/MovieCard.jsx';

const API_BASE_KEY = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {
  const [searchTerm, setsearchTerm] = useState('');
  const [errorMessage, seterrorMessage] = useState('');
  const [movieList, setmovieList] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [debouncedSearchTerm, setdebouncedSearchTerm] = useState('');

  useDebounce(() => setdebouncedSearchTerm(searchTerm), 1000, [searchTerm]);

  const fetchMovies = async (query='') => {
    setisLoading(true);
    seterrorMessage('');

    try {
      const endpoint = query ? `${API_BASE_KEY}/search/movie?query=${encodeURIComponent(query)}` : `${API_BASE_KEY}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();
      
      if (data.response === 'False') {
        seterrorMessage(data.error || 'failed to fetch movies data');
        setmovieList([]);
        return;
      }
      setmovieList(data.results || []);
    } 
    catch (error) {
      console.log(`error fetching movies: ${error}`);
      seterrorMessage('Error fetching movies, Please try again later');
    }
    finally {
      setisLoading(false);
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm])

  return (
    <main>
      <div className="pattern" />
      
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find <span className='text-gradient'>Movies</span> You'll Enjoy Without the Hassle
          </h1>
        <Search searchTerm={searchTerm} setsearchTerm={setsearchTerm} />
        </header>

        <section className='all-movies'>
          <h2 className='mt-[40px]'>All Movies</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className='text-red-500'>{errorMessage}</p>
          ) : movieList.length === 0 ? (
            <p className='text-white'>No Result Found for "{debouncedSearchTerm}"</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}

export default App