import React, { useState } from 'react';
import Logo from "../../assets/logo.png";
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import logoutIcon from '../../assets/logoutIcon.png';
import incomeIcon from '../../assets/IncomeIcon.svg';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  // State for mobile menu toggle
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/');
  };

  // Extracting the last segment of the pathname
  const pathSegment = location.pathname.split("/").filter(Boolean).pop();

  // Toggle the mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav style={{ fontFamily: 'MyCustomFont, sans-serif' }}  className="bg-[#111111] p-4">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex pl-10 items-center">
            <img src={Logo} alt="Logo" className="h-12 w-28" />
          </div>

          {/* Desktop Navigation Links */}
          <ul className="flex md:space-x-8 sm:space-x-5 sm:text-xs text-xs space-x-5 text-gray-300">
            <li>
              <a
                onClick={() => navigate('/home')}
                className={`cursor-pointer ${pathSegment === 'home' ? 'text-[#ffeda5] font-semibold border-b-2 border-[#ffeda5]' : 'hover:text-white'}`}
              >
                Home
              </a>
            </li>
            <li>
              <a
                onClick={() => navigate('/expense')}
                className={`cursor-pointer ${pathSegment === 'expense' ? 'text-[#ffeda5] font-semibold border-b-2 border-[#ffeda5]' : 'hover:text-white'}`}
              >
                Expense
              </a>
            </li>
            <li>
              <a
                onClick={() => navigate('/order')}
                className={`cursor-pointer ${pathSegment === 'order' ? 'text-[#ffeda5] font-semibold border-b-2 border-[#ffeda5]' : 'hover:text-white'}`}
              >
                Order
              </a>
            </li>
            <li>
              <a
                onClick={() => navigate('/items')}
                className={`cursor-pointer ${pathSegment === 'items' ? 'text-[#ffeda5] font-semibold border-b-2 border-[#ffeda5]' : 'hover:text-white'}`}
              >
                Items
              </a>
            </li>
            <li>
              <a
                onClick={() => navigate('/category')}
                className={`cursor-pointer ${pathSegment === 'category' ? 'text-[#ffeda5] font-semibold border-b-2 border-[#ffeda5]' : 'hover:text-white'}`}
              >
                Category
              </a>
            </li>
          </ul>

          {/* Icons and Add Income/Expense Button */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <button
              className="cursor-pointer border border-cyan-600 bg-[#00A1B7] bg-opacity-20 text-white font-semibold py-2 px-3 rounded-lg shadow-md hover:bg-cyan-500 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 flex gap-2"
              onClick={handleLogout}
            >
              <img src={logoutIcon} alt="Logout Icon" />
              Logout
            </button>
            <img
              src="https://via.placeholder.com/150"
              alt="Profile"
              className="h-8 w-8 cursor-pointer rounded-full"
            />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              className="text-gray-300 hover:text-white focus:outline-none"
              onClick={toggleMobileMenu}
            >
              <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Links */}
        {isMobileMenuOpen && (
          <ul className="md:hidden mt-4 space-y-2 text-gray-300">
            <li>
              <a onClick={() => navigate('/home')} className="block cursor-pointer">
                Home
              </a>
            </li>
            <li>
              <a onClick={() => navigate('/expense')} className="block cursor-pointer">
                Expense
              </a>
            </li>
            <li>
              <a onClick={() => navigate('/income')} className="block cursor-pointer">
                Income
              </a>
            </li>
            <li>
              <a onClick={() => navigate('/order')} className="block cursor-pointer">
                Order
              </a>
            </li>
            <li>
              <a onClick={() => navigate('/items')} className="block cursor-pointer">
                Items
              </a>
            </li>
            <li>
              <a onClick={() => navigate('/category')} className="block cursor-pointer">
                Category
              </a>
            </li>
            <li>
              <button
                className="w-full text-left text-red-500"
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
          </ul>
        )}
      </nav>
    </>
  );
};

export default Navbar;
