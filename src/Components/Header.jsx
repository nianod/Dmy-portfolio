import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import {FaHome,FaCode, FaGraduationCap,FaBlog, FaProjectDiagram, FaEnvelope, FaBars, FaSuperpowers, FaTimes} from "react-icons/fa";

 const USER = {
  name: "Arnold",
  imageUrl: "/Screenshot 2025-05-01 181530.png",
  imageSize: 50,
};

const NAV_CONTENTS = [
  { label: "Home", icon: <FaHome />, path: "/" },
  { label: "Skills", icon: <FaCode />, path: "/skills" },
  { label: "Education", icon: <FaGraduationCap />, path: "/education" },
  { label: "Blogs", icon: <FaBlog />, path: "/blogs" },
  { label: "Projects", icon: <FaProjectDiagram />, path: "/projects" },
  { label: "Contact", icon: <FaEnvelope />, path: "/contact" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

   useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

   useEffect(() => {
    setIsOpen(false);
  }, [location]);

   useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const toggleMenu = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

   const NavLink = ({ item, isMobile = false }) => {
    const isActive = location.pathname === item.path;
    
    if (isMobile) {
      return (
        <Link
          to={item.path}
          onClick={closeMenu}
          className={`flex items-center gap-3 p-4 text-lg font-semibold rounded-xl transition-all duration-300 border-b border-gray-700/50 ${
            isActive
              ? "bg-gradient-to-r from-green-600 to-green-600 text-white shadow-lg"
              : "text-gray-300 hover:bg-white/10 hover:text-white"
          }`}
        >
          <span className={`text-xl ${isActive ? "text-white" : "text-green-400"}`}>
            {item.icon}
          </span>
          <span>{item.label}</span>
        
        </Link>
      );
    }

    return (
      <Link
        to={item.path}
        className={`group flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 relative ${
          isActive
            ? "text-white bg-gradient-to-r from-blue-800 to-blue-500 shadow-lg"
            : "text-gray-300 hover:text-white"
        }`}
      >
        <span className="text-sm">{item.icon}</span>
        <span className="font-semibold">{item.label}</span>
        
         {!isActive && (
          <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-green-400 transition-all duration-300 group-hover:w-3/4 group-hover:left-1/4" />
        )}
        
       
      </Link>
    );
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-gray-900/95 backdrop-blur-xl shadow-2xl border-b border-gray-700/50"
          : "bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <Link
            to="/"
            className="flex items-center gap-3 group"
            onClick={closeMenu}
          >
            <div className="relative">
              <img
                className="w-12 h-12 object-cover rounded-full border-2 border-white shadow-lg group-hover:scale-110 transition-transform duration-300"
                src={USER.imageUrl}
                alt={`Profile of ${USER.name}`}
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-xl leading-5">
                {USER.name}
              </span>
              <span className="text-xs text-gray-200 opacity-80">
                Developer
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV_CONTENTS.map((item) => (
              <NavLink key={item.path} item={item} />
            ))}
          </nav>

          <div className="hidden md:flex">
            <a
              href="https://buy-arnold-coffee.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-800 to-blue-500 text-white rounded-full font-semibold hover:scale-105 transition-transform duration-300 shadow-lg "
            >
              <FaSuperpowers className="text-sm" />
              <span>Support me</span>
            </a>
          </div>

          <button
            onClick={toggleMenu}
            className="lg:hidden flex cursor-pointer flex-col items-center justify-center w-10 h-10 text-white hover:bg-white/10 rounded-xl transition-colors duration-300"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <FaTimes className="text-xl" />
            ) : (
              <FaBars className="text-xl" />
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
            onClick={closeMenu}
          />

          <div
            className={`fixed top-0 right-0 w-80 h-full  shadow-2xl border-l border-gray-700/50 z-40 transform transition-transform duration-500 ease-out lg:hidden ${
              isOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="rounded z-1000 bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
                <div className="flex items-center gap-3">
                  <img
                    className="w-10 h-10 object-cover rounded-full border-2 border-green-500"
                    src={USER.imageUrl}
                    alt={`Profile of ${USER.name}`}
                  />
                  <span className="text-white font-bold text-lg">
                    {USER.name}
                  </span>
                </div>
                <button
                  onClick={closeMenu}
                  className="cursor-pointer text-gray-400 hover:text-white text-2xl p-2  rounded-xl transition-colors duration-300"
                  aria-label="Close menu"
                >
                  <FaTimes />
                </button>
              </div>

              <nav className="flex-1 p-6 space-y-2 g-blue-900">
                {NAV_CONTENTS.map((item) => (
                  <NavLink key={item.path} item={item} isMobile={true} />
                ))}
              </nav>

              <div className="p-6 border-t border-gray-700/50">
                <a
                  href="https://buy-arnold-coffee.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-blue-700 to-blue-700 text-white rounded-xl font-semibold hover:transition-transform duration-300 shadow-lg"
                  onClick={closeMenu}
                >
                  <FaSuperpowers />
                  <span>Support my Work</span>
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header
