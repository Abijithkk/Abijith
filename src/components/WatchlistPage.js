import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import Sidebar from '../components/Sidebar';
import './WatchlistPage.css';

function WatchlistPage() {
  const { watchlistId } = useParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [watchlistName, setWatchlistName] = useState('Watchlist');

  useEffect(() => {
    const fetchWatchlist = () => {
      const userEmail = localStorage.getItem('currentUser');
      const sanitizedEmail = userEmail ? userEmail.replace(/[^a-zA-Z0-9]/g, '_') : 'guest';
      const watchlistsKey = `watchlists_${sanitizedEmail}`;
      
      const userWatchlists = JSON.parse(localStorage.getItem(watchlistsKey)) || [];
      const selectedWatchlist = userWatchlists.find((list) => list.id === watchlistId);

      if (selectedWatchlist) {
        setMovies(selectedWatchlist.movies);
        setWatchlistName(selectedWatchlist.name);
      } else {
        setMovies([]);
        setWatchlistName('Watchlist');
      }
      setLoading(false);
    };

    setLoading(true);
    fetchWatchlist();
  }, [watchlistId]);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleDeleteMovie = (movieToDelete) => {
    const userEmail = localStorage.getItem('currentUser');
    const sanitizedEmail = userEmail ? userEmail.replace(/[^a-zA-Z0-9]/g, '_') : 'guest';
    const watchlistsKey = `watchlists_${sanitizedEmail}`;
    
    const userWatchlists = JSON.parse(localStorage.getItem(watchlistsKey)) || [];
    const updatedWatchlists = userWatchlists.map((list) => {
      if (list.id === watchlistId) {
        const updatedMovies = list.movies.filter((movie) => movie.imdbID !== movieToDelete.imdbID);
        return { ...list, movies: updatedMovies };
      }
      return list;
    });

    localStorage.setItem(watchlistsKey, JSON.stringify(updatedWatchlists));
    setMovies((prevMovies) => prevMovies.filter((movie) => movie.imdbID !== movieToDelete.imdbID));
  };

  const contentStyle = {
    marginLeft: isSidebarOpen ? '250px' : '0',
    transition: 'margin-left 0.3s ease-in-out',
    padding: '20px',
    paddingTop: '80px',
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="page-container">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} />
      <div style={contentStyle}>
        <h2 className="heading">{watchlistName}</h2>
        {movies.length > 0 ? (
          <div className="movie-grid" style={{position:'absolute'}}>
            {movies.map((movie, index) => (
              <div className="movie-item" key={index}>
                <div className="card">
                  <div className="card-content">
                    <div className="image-container">
                      <img
                        src={movie.Poster || 'https://via.placeholder.com/150'}  
                        alt={movie.Title}
                        className="movie-poster"
                      />
                    </div>
                    <div className="info">
                      <h5 className="movie-title">{movie.Title}</h5>
                      <p className="movie-year">{movie.Year}</p>
                      <p className="movie-rating">Rating: {movie.Rated}</p>
                      <p className="movie-description">{movie.Plot}</p>
                      <button 
                        className="delete-button"
                        onClick={() => handleDeleteMovie(movie)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No movies found in this watchlist.</p>
        )}
      </div>
    </div>
    
  );
}

export default WatchlistPage;
