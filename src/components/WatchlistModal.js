import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './WatchlistModal.css';
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

const sanitizeEmail = (email) => email ? email.replace(/[^a-zA-Z0-9]/g, '_') : 'guest';

function WatchlistModal({ onClose, onSaveToWatchlist, onCreateWatchlist, watchlists }) {
  const [selectedWatchlist, setSelectedWatchlist] = useState('');
  const [newWatchlistName, setNewWatchlistName] = useState('');

  const handleSave = () => {
    if (selectedWatchlist) {
      onSaveToWatchlist(selectedWatchlist);
      toast.success('Movie added to watchlist successfully!');
      handleCloseModal();
    } else if (newWatchlistName) {
      const userEmail = localStorage.getItem('currentUser');
      const watchlistsKey = `watchlists_${sanitizeEmail(userEmail)}`;
      const newWatchlistId = Date.now().toString();
      const newWatchlist = { id: newWatchlistId, name: newWatchlistName, movies: [] };

      const existingWatchlists = JSON.parse(localStorage.getItem(watchlistsKey)) || [];
      existingWatchlists.push(newWatchlist);
      localStorage.setItem(watchlistsKey, JSON.stringify(existingWatchlists));

      setSelectedWatchlist(newWatchlistId);
      onSaveToWatchlist(newWatchlistId);
      setNewWatchlistName('');
      toast.success('New watchlist created and movie added!');
      handleCloseModal();
    } else {
      toast.error('Please select or create a watchlist.');
    }
  };

  const handleCloseModal = () => {
    setSelectedWatchlist('');
    setNewWatchlistName('');
    onClose();
  };

  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-labelledby="modalTitle" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content custom-modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalTitle">Add Movie to Watchlist</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseModal}></button>
            </div>
            <div className="modal-body">
              <div className="form-group mb-3">
                <label htmlFor="watchlist-select" className="form-label">Select a watchlist:</label>
                <select
                  id="watchlist-select"
                  className="form-select"
                  value={selectedWatchlist}
                  onChange={(e) => setSelectedWatchlist(e.target.value)}
                >
                  <option value="">--Select a watchlist--</option>
                  {watchlists.map((watchlist) => (
                    <option key={watchlist.id} value={watchlist.id}>{watchlist.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group mb-3">
                <label htmlFor="new-watchlist" className="form-label">Or create a new watchlist:</label>
                <input
                  id="new-watchlist"
                  type="text"
                  className="form-control"
                  placeholder="New watchlist name"
                  value={newWatchlistName}
                  onChange={(e) => setNewWatchlistName(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
              <button type="button" className="btn btn-primary" onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default WatchlistModal;
