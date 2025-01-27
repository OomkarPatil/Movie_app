import { useEffect, useState } from 'react';
import { useDebounce } from 'react-use'
import Search from './Components/Search'
import Spinner from './Components/Spinner';
import MovieCard from './Components/MovieCard';
import { getTreandingMovies, UpdSearchCount } from './appwrite';


const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMBD_API_KEY;
const API_OPTIONS = {
  method: 'Get',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

function App() {
  const [seacrhTerm, setSeacrhTerm] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [debouncedTerm, setDebouncedTerm] = useState('');


  useDebounce(()=> setDebouncedTerm(seacrhTerm), 1000, [seacrhTerm])

  const fetchMovies = async (query = '')=>{
    setLoading(true);
    setErrorMsg('')
    try {
      const endpoint = query 
                   ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
                   :`${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);

      if(!response.ok){
        throw new Error('Failed to fetch Movies');
      } 
      const data = await response.json();

      if(data.Response == false){
        setErrorMsg(data.Error || 'Failed to fetch Movies')
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);

      if(query && data.results.length > 0){
        await UpdSearchCount(query, data.results[0]);
      }

    } catch (error) {
      console.log(`Error fetching Movies: ${error}`);
      setErrorMsg('Error Fetching Movies. Please try again later')
    } finally{
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchMovies(debouncedTerm);
  }, [debouncedTerm]);


  const trndMovies = async ()=>{
    try {
      const movies = await getTreandingMovies();
      setTrendingMovies(movies) 
    } catch (error) {
      console.log(`Error fetching treanding Movies: ${error}`);
    }
  }
  useEffect(()=>{
    trndMovies();
  },[])
  

  return (
    <main>

      <div className='pattern'/>
      
      <div className='wrapper'>
        <header>
          <img src='./hero.png' alt='Hero Banner'/>
          <h1>Find <span className='text-gradient'>Movies</span> You'll Enjoy Without the Hassle</h1>
          <Search seacrhTerm={seacrhTerm} setSeacrhTerm={setSeacrhTerm}/>
        </header>
        {trendingMovies.length>0 && (
          <section className='trending'>
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index)=>(
                <li key={movie.$id}>
                  <p>{index+1}</p>
                  <img src={movie.poster_URL} alt={movie.title}/>
                </li>
              ))}
            </ul>
          </section>
        )}
        <section className='all-movies'>
          <h2 >All Movies</h2>
          {loading ? (
            <Spinner/>
          ): errorMsg ? (
            <p className='text-red-400'>{errorMsg}</p>
          ):(
            <ul>
              {movieList.map((movie)=>(
                <MovieCard key={movie.id} movie={movie}/>
              ))} 
            </ul>
          )}

        </section>
      </div>
    </main>
  )
}

export default App;
