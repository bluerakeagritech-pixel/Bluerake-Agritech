import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sprout } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/contact', label: 'Contact' },
  ];

  const isSystemRoute = location.pathname.startsWith('/system');
  const isFarmerRoute = location.pathname.startsWith('/farmer');
  const isBankRoute = location.pathname.startsWith('/bank');

  if (isSystemRoute) {
    return (
      <nav className="bg-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to="/system" className="flex items-center">
              <Sprout className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-xl font-bold text-green-800">
                BlueRakeAgriTech Ghana - Central System
              </span>
            </Link>
            
            <div className="hidden md:flex space-x-4">
              <span className="text-gray-600">System Administrator Access</span>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  if (isFarmerRoute) {
    return (
      <nav className="bg-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to="/farmer" className="flex items-center">
              <Sprout className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-xl font-bold text-green-800">
                BlueRakeAgriTech Ghana - Farmer Portal
              </span>
            </Link>
            
            <div className="hidden md:flex space-x-4">
              <span className="text-gray-600">Data Collection & Results</span>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  if (isBankRoute) {
    return (
      <nav className="bg-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to="/bank" className="flex items-center">
              <Sprout className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-blue-800">
                BlueRakeAgriTech Ghana - Bank Portal
              </span>
            </Link>
            
            <div className="hidden md:flex space-x-4">
              <span className="text-gray-600">Credit Intelligence Dashboard</span>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <nav className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <Sprout className="h-8 w-8 text-green-600" />
            <span className="ml-2 text-xl font-bold text-green-800">
              BlueRakeAgriTech Ghana
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-gray-700 hover:text-green-600 transition-colors ${
                  location.pathname === item.path ? 'text-green-600 font-medium' : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-gray-700 hover:text-green-600 transition-colors ${
                    location.pathname === item.path ? 'text-green-600 font-medium' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                <Link
                  to="/login"
                  className="text-green-600 hover:text-green-700 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;