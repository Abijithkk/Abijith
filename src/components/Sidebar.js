import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Sidebar.css';
import { Modal, Button } from 'react-bootstrap';

function Sidebar({ isOpen }) {
  const [watchlists, setWatchlists] = useState([]);
  const [newWatchlistName, setNewWatchlistName] = useState('');
  const [editWatchlistId, setEditWatchlistId] = useState(null);
  const [editWatchlistName, setEditWatchlistName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLogoutConfirmModal, setShowLogoutConfirmModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const userEmail = localStorage.getItem('currentUser');
  const sanitizeEmail = (email) => email ? email.replace(/[^a-zA-Z0-9]/g, '_') : 'guest';
  const watchlistsKey = `watchlists_${sanitizeEmail(userEmail)}`;

  useEffect(() => {
    const fetchWatchlists = () => {
      const storedWatchlists = JSON.parse(localStorage.getItem(watchlistsKey)) || [];
      setWatchlists(storedWatchlists);
    };

    fetchWatchlists();

    const storedUserName = localStorage.getItem('currentUser') || 'Guest';
    setUserName(storedUserName);

    window.addEventListener('storage', fetchWatchlists);

    return () => {
      window.removeEventListener('storage', fetchWatchlists);
    };
  }, [watchlistsKey]);

  const handleWatchlistSelect = (watchlistId) => {
    navigate(`/watchlist/${watchlistId}`);
  };

  const handleAddWatchlist = () => {
    if (newWatchlistName.trim()) {
      const newWatchlist = { id: Date.now(), name: newWatchlistName };
      const updatedWatchlists = [...watchlists, newWatchlist];
      setWatchlists(updatedWatchlists);
      localStorage.setItem(watchlistsKey, JSON.stringify(updatedWatchlists));
      setNewWatchlistName('');
      setShowModal(false);
    }
  };

  const handleEditWatchlist = () => {
    if (editWatchlistName.trim()) {
      const updatedWatchlists = watchlists.map((watchlist) =>
        watchlist.id === editWatchlistId
          ? { ...watchlist, name: editWatchlistName }
          : watchlist
      );
      setWatchlists(updatedWatchlists);
      localStorage.setItem(watchlistsKey, JSON.stringify(updatedWatchlists));
      setEditWatchlistName('');
      setShowEditModal(false);
    }
  };

  const handleDeleteWatchlist = (watchlistId) => {
    const updatedWatchlists = watchlists.filter(
      (watchlist) => watchlist.id !== watchlistId
    );
    setWatchlists(updatedWatchlists);
    localStorage.setItem(watchlistsKey, JSON.stringify(updatedWatchlists));
  };

  const handleClose = () => {
    setShowModal(false);
    setShowEditModal(false);
    setShowLogoutConfirmModal(false);
  };

  const handleShow = () => setShowModal(true);

  const handleShowEdit = (watchlist) => {
    setEditWatchlistId(watchlist.id);
    setEditWatchlistName(watchlist.name);
    setShowEditModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser'); 
    navigate('/login'); 
  };

  const handleLogoutConfirm = () => {
    setShowLogoutConfirmModal(true);
  };

  const handleConfirmLogout = () => {
    handleLogout();
    handleClose();
  };

  const filteredWatchlists = watchlists.filter(watchlist =>
    watchlist.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`sidebar-container ${isOpen ? 'open' : 'closed'}`}>
      <div style={{marginTop:'16%'}} className="sidebar d-flex flex-column p-3 h-100">
        <h2 className="mb-4 sidebar-title d-flex align-items-center">
          <i className="bi bi-eye me-2"></i> Watchlists
        </h2>
        <div className="mb-4">
          <input
            type="text"
            className="form-control sidebar-search-input"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <ul className="nav flex-column mb-4">
          <li className="nav-item">
            <a href="/" className="nav-link d-flex align-items-center sidebar-nav-link">
              <i className="bi bi-house-door-fill me-2 sidebar-icon"></i> Home
            </a>
          </li>
        </ul>
        <h3 className="mb-3 sidebar-subtitle d-flex justify-content-between align-items-center">
          My Lists
          <button className="btn btn-link p-0" onClick={handleShow}>
            <i className="bi bi-plus-circle sidebar-add-icon"></i>
          </button>
        </h3>
        <ul className="nav flex-column">
          {filteredWatchlists.map((watchlist) => (
            <li className="nav-item" key={watchlist.id}>
              <div className="d-flex align-items-center">
                <button
                  className="nav-link d-flex align-items-center sidebar-nav-link flex-grow-1"
                  onClick={() => handleWatchlistSelect(watchlist.id)}
                >
                  <i className="bi bi-film me-2 sidebar-icon"></i> {watchlist.name}
                </button>
                <div className="ms-2">
                  <button
                    className="btn btn-link text-dark"
                    onClick={() => handleShowEdit(watchlist)}
                    aria-label="Edit"
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button
                    className="btn btn-link text-dark ms-1"
                    onClick={() => handleDeleteWatchlist(watchlist.id)}
                    aria-label="Delete"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-auto d-flex align-items-center pt-3 border-top sidebar-user-section">
          <i className="bi bi-person-circle me-2 sidebar-avatar-icon"></i>
          <span className="flex-grow-1">{userName}</span>
          <button className="btn btn-link text-dark" onClick={handleLogoutConfirm}>
            <i className="bi bi-three-dots"></i>
          </button>
        </div>
      </div>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Watchlist</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Watchlist Name"
            value={newWatchlistName}
            onChange={(e) => setNewWatchlistName(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddWatchlist}>
            Add Watchlist
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Watchlist</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Watchlist Name"
            value={editWatchlistName}
            onChange={(e) => setEditWatchlistName(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditWatchlist}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showLogoutConfirmModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to logout?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmLogout}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Sidebar;
