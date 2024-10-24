import React, { useState, useEffect } from 'react';
import Logo from './Logo'; // Ensure the path is correct
import bgImage from '../assets/gbks.jpg'; // Ensure the image exists
import { Link, useNavigate } from 'react-router-dom'; // Use `useNavigate` for redirection
import { useDispatch, useSelector } from 'react-redux';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import { setUserDetails } from '../store/userSlice';
import ROLE from '../common/role';

const Header = () => {
  const user = useSelector((state) => state?.user?.user); // Select user from Redux store
  const dispatch = useDispatch();
  const [menuDisplay, setMenuDisplay] = useState(false);

  const navigate = useNavigate();

  // Fetch user from localStorage if available
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      dispatch(setUserDetails(JSON.parse(storedUser)));
    }
  }, [dispatch]);

  // Update component when user state changes in Redux
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user)); // Keep user in localStorage
    } else {
      localStorage.removeItem('user'); // Remove from localStorage on logout
    }
  }, [user]); // This effect runs whenever the user state changes

  // Debugging: Log user to check if profilePic is available
  useEffect(() => {
    console.log(user); // Check what the user object contains, especially the profilePic
  }, [user]);

  const handleLogout = async () => {
    try {
      const fetchData = await fetch(SummaryApi.logout_user.url, {
        method: SummaryApi.logout_user.method,
        credentials: 'include',
      });
      const data = await fetchData.json();

      if (data.success) {
        toast.success(data.message);
        dispatch(setUserDetails(null)); // Clear user from Redux store
        setMenuDisplay(false); // Close the dropdown menu
        navigate('/login'); // Redirect to login page
      } else {
        toast.error(data.message || 'Logout failed');
      }
    } catch (error) {
      toast.error('Error logging out. Please try again.');
      console.error('Logout error:', error);
    }
  };

  const handleOutsideClick = (event) => {
    if (!event.target.closest('.menu-container')) {
      setMenuDisplay(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <header
      className="h-16 shadow-md bg-white relative"
      style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover' }}
    >
      <div className="h-full container mx-auto flex items-center px-4 justify-between">
        <div className="flex items-center">
          <Link to="/">
            <Logo w={90} h={50} />
          </Link>
        </div>

        <div>
          <button>
          {user?.role === ROLE.ADMIN && (
                        <Link
                          to="/admin-panel/all-products"
                          className="px-3 py-1  text-white bg-green-500 hover:bg-green-700"
                          onClick={() => setMenuDisplay(false)}
                        >
                          Admin Panel
                        </Link>
                      )}
          </button>
        </div>

        
            {/* Login/Logout Button */}
            <div>
              {user?._id ? (
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 rounded-full text-white bg-green-500 hover:bg-green-700"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="px-3 py-1 rounded-full text-white bg-green-500 hover:bg-green-700"
                >
                  Login
                </Link>
              )}
            </div>
      </div>
    </header>
  );
};

export default Header;
