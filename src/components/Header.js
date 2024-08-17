import React, { useState } from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { HiMenuAlt1, HiX } from 'react-icons/hi';
import './Header.css'; 

function Header({ toggleSidebar }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    toggleSidebar(); 
  };

  return (
    <Navbar className="custom-navbar py-2" fixed="top" expand="lg" >
      <Container>
        <Button 
          variant="link" 
          onClick={handleToggleSidebar} 
          className="text-white me-3"
        >
          <span className={`icon-container ${isSidebarOpen ? 'icon-close' : 'icon-menu'}`}>
            {isSidebarOpen ? <HiX /> : <HiMenuAlt1 />}
          </span>
        </Button>
        <Navbar.Brand style={{color:'white'}}>FilmFolio</Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export default Header;
