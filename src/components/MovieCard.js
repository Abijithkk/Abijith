import React, { useState, useEffect } from 'react';
import './MovieCard.css';
import axios from 'axios';
import WatchlistModal from './WatchlistModal';

function MovieCard({ query }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedMovieId, setExpandedMovieId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [watchlists, setWatchlists] = useState([]);
  const apiKey = process.env.REACT_APP_OMDB_API_KEY;
  

  
  const userEmail = localStorage.getItem('currentUser'); 

  const sanitizeEmail = (email) => email.replace(/[^a-zA-Z0-9]/g, '_');
  const watchlistsKey = `watchlists_${sanitizeEmail(userEmail)}`;

  useEffect(() => {
    const fetchMovies = async () => {
      if (query.trim()) {
        try {
          const response = await axios.get(`https://www.omdbapi.com/?s=${query}&apikey=${apiKey}`);
          const movieData = response.data.Search || [];
          const detailedMovies = await Promise.all(
            movieData.map(async (movie) => {
              const detailResponse = await axios.get(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${apiKey}`);
              return detailResponse.data;
            })
          );
          setMovies(detailedMovies);
        } catch (error) {
          console.error('Error fetching movie data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMovies();
  }, [query, apiKey]);

  useEffect(() => {
    const userWatchlists = JSON.parse(localStorage.getItem(watchlistsKey)) || [];
    setWatchlists(userWatchlists);
  }, [watchlistsKey]);

  const handleTogglePlot = (id) => {
    setExpandedMovieId(expandedMovieId === id ? null : id);
  };

  const handleAddToWatchlist = (movie) => {
    setSelectedMovie(movie);
    setShowModal(true);
  };
  
  const handleSaveToWatchlist = (watchlistId) => {
    if (selectedMovie) {
      const userWatchlists = JSON.parse(localStorage.getItem(watchlistsKey)) || [];
      const watchlistIndex = userWatchlists.findIndex((list) => list.id === watchlistId);

      if (watchlistIndex !== -1) {
        userWatchlists[watchlistIndex].movies.push(selectedMovie);
        localStorage.setItem(watchlistsKey, JSON.stringify(userWatchlists));
        setWatchlists(userWatchlists); 
      } else {
        console.error('Watchlist not found');
      }
      setShowModal(false);
    }
  };
  
  const handleCreateWatchlist = (name) => {
    const newWatchlistId = Date.now().toString();
    const newWatchlist = { id: newWatchlistId, name, movies: [] };
    let userWatchlists = JSON.parse(localStorage.getItem(watchlistsKey)) || [];
    userWatchlists.push(newWatchlist);
    localStorage.setItem(watchlistsKey, JSON.stringify(userWatchlists));
    return newWatchlistId;
  };

  if (loading) {
    return <div><h3>Search to get movies...</h3></div>;
  }

  if (!movies || movies.length === 0) {
    return <div>No movies found.</div>;
  }

  return (
    <>
      <div className="movie-list">
        {movies.map((movie) => (
          <div key={movie.imdbID} className="movie-card">
            <div className="movie-card-content">
              <div className="movie-image-container">
                <img src={movie.Poster} alt={movie.Title} className="movie-image" />
                <div className="add-icon" onClick={() => handleAddToWatchlist(movie)}>➕</div>
              </div>
              <div className="movie-info">
                <h3 className="movie-name">{movie.Title}</h3>
                <p className="movie-year">{movie.Year}</p>
                <p className="movie-rating">Rating: {movie.imdbRating}</p>
                <p className={`movie-plot ${expandedMovieId === movie.imdbID ? 'expanded' : 'collapsed'}`}>
                  {movie.Plot}
                </p>
                <button 
                  className="show-more-button" 
                  onClick={() => handleTogglePlot(movie.imdbID)}
                >
                  {expandedMovieId === movie.imdbID ? 'Show Less' : 'Show More'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <WatchlistModal 
          onClose={() => setShowModal(false)} 
          onSaveToWatchlist={handleSaveToWatchlist} 
          onCreateWatchlist={handleCreateWatchlist} 
          watchlists={watchlists}
        />
      )}
    </>
  );
}

export default MovieCard;
