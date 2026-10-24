import { NavLink, useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleFeature = () => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById('features')?.scrollIntoView({
          behavior: 'smooth',
        });
      }, 300);
    } else {
      document.getElementById('features')?.scrollIntoView({
        behavior: 'smooth',
      });
    }
  };
 const handleLogout = async (e) => {
  e.preventDefault();

  try {
    await fetch('http://localhost:3000/user/logout', {
      method: 'POST',
      credentials: 'include',
    });
  } catch (error) {
    console.error('Logout failed:', error);
  } finally {
    navigate('/login', { replace: true });
  }
};
  return (
    <nav className="mx-auto flex max-w-5xl items-center justify-between rounded-xl border border-white/10 bg-[#1e1c1c] px-8 py-4 shadow-md">
      <h1 className="text-2xl font-bold text-white">
        Study<span className="text-gray-400">Planner</span>
      </h1>

      <div className="flex items-center gap-6">
        <NavLink to="/" className="text-gray-400 transition hover:text-white">
          Home
        </NavLink>

        <NavLink
          to="/about"
          className="text-gray-400 transition hover:text-white"
        >
          About
        </NavLink>

        <a
          href="#features"
          onClick={handleFeature}
          className="text-gray-400 transition hover:text-white"
        >
          Feature
        </a>

        <NavLink
          to="/costomer"
          className="text-gray-400 transition hover:text-white"
        >
          Customer
        </NavLink>
        <NavLink
          to="/login"
          onClick={handleLogout}
          className="text-gray-400 transition hover:text-white"
        >
          Logout
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
