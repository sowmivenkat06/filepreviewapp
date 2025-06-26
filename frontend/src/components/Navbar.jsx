import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="navbar">
      <h2 style={{ color: 'white' }}>Lavender App</h2>
      <div>
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>
        <button onClick={handleLogout} style={{ marginLeft: '1rem', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
          Logout
        </button>
      </div>
    </div>
  );
}
