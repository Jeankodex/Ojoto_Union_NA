import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/ojoto_union_logo.png";
import { FaBars, FaTimes, FaUserPlus, FaSignInAlt } from "react-icons/fa";

const Navbar = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const closeAll = () => {
    setIsOpen(false);
    setDropdownOpen(false);
  };

  return (
    <nav className="bg-[#0B1A33] text-white shadow-xl relative z-50">
      <div className="container mx-auto flex items-center justify-between p-4">
        
        {/* Logo + Heading */}
        <Link to="/" className="flex items-center gap-3" onClick={closeAll}>
          <img
            src={logo}
            alt="Ojoto Union Logo"
            className="h-12 w-12 object-cover rounded-full shadow-lg hover:scale-105 transition duration-300"
          />
          <span className="hidden sm:inline font-serif tracking-wide text-xl font-semibold">
            Ojoto Union North America
          </span>
          <span className="inline sm:hidden font-serif text-lg font-semibold">
            OU NA
          </span>
        </Link>

        {/* Mobile Hamburger */}
        <div className="sm:hidden cursor-pointer" onClick={toggleMenu}>
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </div>

        {/* MENU - FIXED VISIBILITY */}
        <ul
          className={`
            sm:flex sm:flex-row sm:items-center sm:gap-8
            absolute sm:static left-0 top-full w-full sm:w-auto
            bg-[#0B1A33] sm:bg-transparent shadow-lg sm:shadow-none
            transition-all duration-300 ease-in-out z-40
            ${isOpen ? "flex flex-col gap-4 py-4 px-4" : "hidden sm:flex"}
          `}
        >
          {/* Menu Items with Enhanced Typography */}
          {[
            { to: "/", label: "Home" },
            { to: "/questions", label: "Q&A" },
            { to: "/community", label: "Community" },
            { to: "/members", label: "Members" },
            { to: "/volunteer", label: "Volunteer" },
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

          {/* If user logged in */}
          {user ? (
            <>
              <li>
                <Link
                  to="/post_announcement"
                  className="
                    font-medium tracking-wide px-2 py-1
                    hover:text-[#E4B84D] transition-all duration-300
                    hover:tracking-wider
                  "
                  onClick={closeAll}
                >
                  Post Announcement
                </Link>
              </li>

              <li>
                <Link
                  to="/post_opportunity"
                  className="
                    font-medium tracking-wide px-2 py-1
                    hover:text-[#E4B84D] transition-all duration-300
                    hover:tracking-wider
                  "
                  onClick={closeAll}
                >
                  Post Opportunity
                </Link>
              </li>

              <li className="hidden lg:inline text-[#E4B84D] font-semibold tracking-wide px-2">
                Welcome, {user.username}
              </li>

              <li>
                <Link
                  to="/logout"
                  className="
                    font-medium tracking-wide px-2 py-1
                    hover:text-[#E4B84D] transition-all duration-300
                    hover:tracking-wider
                  "
                  onClick={closeAll}
                >
                  Logout
                </Link>
              </li>
            </>
          ) : (
            <>
              {/* SIGN UP DROPDOWN - IMPROVED */}
              <li className="relative">
                <button
                  onClick={toggleDropdown}
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

                {/* DROPDOWN MENU - IMPROVED */}
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

      {/* Close dropdown when clicking outside (only on desktop) */}
      {dropdownOpen && (
        <div
          className="fixed inset-0 z-30 sm:block hidden"
          onClick={() => setDropdownOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;