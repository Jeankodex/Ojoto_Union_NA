import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // Add this import
import logo from "../assets/ojoto_union_logo.png";
import { 
  FaBars, FaTimes, FaUserPlus, FaSignInAlt, 
  FaUserCircle, FaSignOutAlt, FaHome, FaTachometerAlt 
} from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  
  const { user, logout, isAuthenticated } = useAuth(); // Use auth context

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleSignupDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleUserDropdown = () => setUserDropdownOpen(!userDropdownOpen);
  
  const closeAll = () => {
    setIsOpen(false);
    setDropdownOpen(false);
    setUserDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeAll();
  };

  return (
    <nav className="bg-[#0B1A33] text-white shadow-xl relative z-50">
      <div className="container mx-auto flex items-center justify-between p-4">
        
        {/* Logo + Heading */}
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-3" onClick={closeAll}>
          <img
            src={logo}
            alt="Ojoto Union Logo"
            className="h-12 w-12 object-cover rounded-full shadow-lg hover:scale-105 transition duration-300"
          />
          <div className="flex flex-col">
            <span className="font-serif tracking-wide text-xl font-semibold">
              <span className="text-[#E4B84D]">Ojoto Union</span>
              <span className="text-white"> North America</span>
            </span>
            <span className="text-xs text-gray-300 hidden sm:block">
              {isAuthenticated ? "Member Dashboard" : "Community Platform"}
            </span>
          </div>
        </Link>

        {/* Mobile Hamburger */}
        <div className="sm:hidden cursor-pointer" onClick={toggleMenu}>
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </div>

        {/* MENU - FIXED VISIBILITY */}
        <ul
          className={`
            sm:flex sm:flex-row sm:items-center sm:gap-6
            absolute sm:static left-0 top-full w-full sm:w-auto
            bg-[#0B1A33] sm:bg-transparent shadow-lg sm:shadow-none
            transition-all duration-300 ease-in-out z-40
            ${isOpen ? "flex flex-col gap-4 py-4 px-4" : "hidden sm:flex"}
          `}
        >
          {/* ========== AUTHENTICATED USER MENU ========== */}
          {isAuthenticated ? (
            <>
              {/* Dashboard Link (Only for logged in users) */}
              <li>
                <Link
                  to="/dashboard"
                  className="
                    font-medium tracking-wide px-2 py-1
                    hover:text-[#E4B84D] transition-all duration-300
                    hover:tracking-wider hover:font-semibold
                    relative after:content-[''] after:absolute after:w-0 after:h-0.5 
                    after:bg-[#E4B84D] after:left-0 after:-bottom-1
                    after:transition-all after:duration-300
                    hover:after:w-full flex items-center gap-2
                  "
                  onClick={closeAll}
                >
                  <FaTachometerAlt className="text-sm" />
                  Dashboard
                </Link>
              </li>

              {/* Main Navigation Items */}
              {[
                { to: "/community", label: "Community", icon: "👥" },
                { to: "/questions", label: "Q&A", icon: "❓" },
                { to: "/members", label: "Members", icon: "👤" },
                { to: "/volunteer", label: "Volunteer", icon: "🤝" },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="
                      font-medium tracking-wide px-2 py-1
                      hover:text-[#E4B84D] transition-all duration-300
                      hover:tracking-wider hover:font-semibold
                      relative after:content-[''] after:absolute after:w-0 after:h-0.5 
                      after:bg-[#E4B84D] after:left-0 after:-bottom-1
                      after:transition-all after:duration-300
                      hover:after:w-full
                    "
                    onClick={closeAll}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}

              {/* User Dropdown */}
              <li className="relative">
                <button
                  onClick={toggleUserDropdown}
                  className="
                    flex items-center gap-2 px-3 py-2
                    bg-white/5 hover:bg-white/10 rounded-lg
                    transition-all duration-300 ease-in-out
                    border border-white/10 hover:border-white/20
                  "
                >
                  <FaUserCircle className="text-lg text-[#E4B84D]" />
                  <span className="font-medium tracking-wide">
                    {user?.firstName || "User"}
                  </span>
                  <svg 
                    className={`w-4 h-4 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* User Dropdown Menu */}
                <ul
                  className={`
                    absolute right-0 top-full mt-2
                    w-56 bg-white text-gray-800 rounded-xl shadow-2xl
                    overflow-hidden border border-gray-200
                    transition-all duration-300 ease-in-out z-50
                    ${userDropdownOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"}
                  `}
                >
                  {/* User Info Header */}
                  <li className="bg-gradient-to-r from-[#0B1A33] to-[#1a365d] p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#E4B84D] to-[#FFD166] rounded-full flex items-center justify-center text-white font-bold">
                        {user?.firstName?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{user?.firstName} {user?.surname}</p>
                        <p className="text-sm text-gray-300">@{user?.username}</p>
                      </div>
                    </div>
                  </li>

                  {/* User Menu Items */}
                  <li className="border-b border-gray-100">
                    <Link
                      to="/profile/edit"
                      className="
                        flex items-center gap-3 px-4 py-3 
                        hover:bg-gray-50 transition-all duration-200
                        font-medium text-gray-700
                        hover:text-[#0B1A33]
                      "
                      onClick={closeAll}
                    >
                      <FaUserCircle className="text-gray-500" />
                      <span>My Profile</span>
                    </Link>
                  </li>

                  <li className="border-b border-gray-100">
                    <Link
                      to="/dashboard"
                      className="
                        flex items-center gap-3 px-4 py-3 
                        hover:bg-gray-50 transition-all duration-200
                        font-medium text-gray-700
                        hover:text-[#0B1A33]
                      "
                      onClick={closeAll}
                    >
                      <FaTachometerAlt className="text-gray-500" />
                      <span>Dashboard</span>
                    </Link>
                  </li>

                  <li>
                    <button
                      onClick={handleLogout}
                      className="
                        w-full flex items-center gap-3 px-4 py-3 
                        hover:bg-red-50 transition-all duration-200
                        font-medium text-red-600 hover:text-red-700
                      "
                    >
                      <FaSignOutAlt />
                      <span>Logout</span>
                    </button>
                  </li>
                </ul>
              </li>
            </>
          ) : (
            /* ========== GUEST USER MENU ========== */
            <>
              {/* Public Navigation Items */}
              {[
                { to: "/", label: "Home", icon: <FaHome className="inline mr-1" /> },
                { to: "/about", label: "About" },
                { to: "/gallery", label: "Gallery" },
                { to: "/community", label: "Community" },
                { to: "/members", label: "Members" },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="
                      font-medium tracking-wide px-2 py-1
                      hover:text-[#E4B84D] transition-all duration-300
                      hover:tracking-wider hover:font-semibold
                      relative after:content-[''] after:absolute after:w-0 after:h-0.5 
                      after:bg-[#E4B84D] after:left-0 after:-bottom-1
                      after:transition-all after:duration-300
                      hover:after:w-full
                    "
                    onClick={closeAll}
                  >
                    {item.icon} {item.label}
                  </Link>
                </li>
              ))}

              {/* SIGN UP DROPDOWN */}
              <li className="relative">
                <button
                  onClick={toggleSignupDropdown}
                  className="
                    px-5 py-2.5 bg-gradient-to-r from-[#E4B84D] to-[#FFD166] 
                    text-[#0B1A33] rounded-lg font-semibold 
                    hover:from-[#FFD166] hover:to-[#E4B84D] 
                    transition-all duration-300 ease-in-out
                    shadow-md hover:shadow-lg
                    flex items-center gap-2
                  "
                >
                  <FaUserPlus />
                  <span className="tracking-wide">Sign Up</span>
                </button>

                {/* DROPDOWN MENU */}
                <ul
                  className={`
                    absolute left-0 top-full mt-2
                    w-48 bg-white text-gray-800 rounded-lg shadow-xl
                    overflow-hidden border border-gray-100
                    transition-all duration-300 ease-in-out z-50
                    ${dropdownOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"}
                    ${isOpen ? "relative mt-2 w-full" : ""}
                  `}
                >
                  <li className="border-b border-gray-100">
                    <Link
                      to="/register"
                      className="
                        flex items-center gap-3 px-4 py-3 
                        hover:bg-gray-50 transition-all duration-200
                        font-medium text-gray-700
                        hover:text-[#0B1A33] hover:pl-5
                        hover:font-semibold
                      "
                      onClick={closeAll}
                    >
                      <FaUserPlus className="text-[#E4B84D]" />
                      <span>Register Account</span>
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/login"
                      className="
                        flex items-center gap-3 px-4 py-3 
                        hover:bg-gray-50 transition-all duration-200
                        font-medium text-gray-700
                        hover:text-[#0B1A33] hover:pl-5
                        hover:font-semibold
                      "
                      onClick={closeAll}
                    >
                      <FaSignInAlt className="text-[#0B1A33]" />
                      <span>Login</span>
                    </Link>
                  </li>
                </ul>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Close dropdowns when clicking outside */}
      {(dropdownOpen || userDropdownOpen) && (
        <div
          className="fixed inset-0 z-30 sm:block hidden"
          onClick={() => {
            setDropdownOpen(false);
            setUserDropdownOpen(false);
          }}
        />
      )}

      {/* Close mobile menu when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 sm:hidden"
          onClick={closeAll}
        />
      )}
    </nav>
  );
};

export default Navbar;