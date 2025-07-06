// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/authUtils';

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = isAuthenticated();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>📁 FilePreviewApp</h2>
      <div style={styles.links}>
        {!isLoggedIn && (
          <>
            <Link style={styles.link} to="/signup">Signup</Link>
            <Link style={styles.link} to="/login">Login</Link>
            
          </>
        )}
        {isLoggedIn && (
          <>
            <Link style={styles.link} to="/home">Home</Link>
            <button onClick={handleLogout} style={styles.button}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#6a5acd',
    padding: '1rem 2rem',
    color: 'white',
  },
  logo: {
    margin: 0,
    fontSize: '1.5rem',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1rem',
  },
  button: {
    backgroundColor: 'white',
    color: '#6a5acd',
    border: 'none',
    padding: '0.5rem 1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    borderRadius: '4px',
  }
};
