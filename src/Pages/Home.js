import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import './Home.css';
import MovieCard from '../components/MovieCard';
import WatchlistModal from '../components/WatchlistModal'; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
function Home() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [watchlists, setWatchlists] = useState([]); 
  const [showMovies, setShowMovies] = useState(false); 

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setShowMovies(true); 
  };

  const handleAddMovieClick = (movie) => {
    setSelectedMovie(movie);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedMovie(null);
  };

  const handleSaveToWatchlist = (watchlistId) => {
    console.log(`Add movie ${selectedMovie} to watchlist ${watchlistId}`);
    handleCloseModal();
  };

  const handleCreateWatchlist = (newWatchlist) => {
    console.log(`Create new watchlist ${newWatchlist}`);
    setWatchlists([...watchlists, newWatchlist]);
  };

  const contentStyle = {
    marginLeft: isSidebarOpen ? '250px' : '0',
    transition: 'margin-left 0.3s ease-in-out',
    padding: '20px',
    paddingTop: '80px', 
  };

  return (
    <div className="home-container">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} />
      <div style={contentStyle}>
        <div className="welcome-section">
          <div className="welcome-message">
            <h1>Welcome to <span className="highlight">Watchlists</span></h1>
            <p>
              Browse movies, add them to watchlists, and share them with friends.
              Just click the <span className="add-movie-icon">+</span> to add a movie, the poster to see more details,
              or <span className="mark-watched-icon">✓</span> to mark the movie as watched.
            </p>
          </div>
          <form className="search-bar" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button type="submit">Search</button>
          </form>
        </div>
        <div className="movies-grid">
          {showMovies && (
            <MovieCard query={searchQuery} onAddMovieClick={handleAddMovieClick} />
          )}
        </div>
        {isModalOpen && (
          <WatchlistModal
            onClose={handleCloseModal}
            onSaveToWatchlist={handleSaveToWatchlist}
            onCreateWatchlist={handleCreateWatchlist}
            watchlists={watchlists}
          />
        )}
      </div>

      <ToastContainer></ToastContainer>
    </div>
  );
}

export default Home;
