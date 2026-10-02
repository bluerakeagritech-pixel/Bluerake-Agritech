import React from 'react';
import { Leaf, Menu, X, Globe, BarChart2 } from 'lucide-react';

import { Link as RouterLink } from 'react-router-dom';

export default function CorporateNavbar() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          <div className="flex items-center gap-3">
            <div className="bg-bluerake-green p-2.5 rounded-xl shadow-lg shadow-bluerake-green/20">
              <Globe className="h-7 w-7 text-white" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-bluerake-green">
              BlueRake<span className="text-bluerake-emerald">AgriTech</span>
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#about" className="text-gray-600 hover:text-bluerake-green font-medium transition-colors">Our Vision</a>
            <a href="#leadership" className="text-gray-600 hover:text-bluerake-green font-medium transition-colors">Leadership</a>
            <a href="#tech" className="text-gray-600 hover:text-bluerake-green font-medium transition-colors">Technology Hub</a>
            <a href="#investors" className="text-gray-600 hover:text-bluerake-green font-medium transition-colors">Investors</a>
            
            <RouterLink 
              to="/BlueRakeAgriTech" 
              className="group flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-bluerake-emerald text-bluerake-emerald font-semibold hover:bg-bluerake-emerald hover:text-white transition-all duration-300"
            >
              <Leaf className="w-4 h-4" />
              Access BlueRakeAgriTech
            </RouterLink>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#about" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-bluerake-green">Our Vision</a>
            <a href="#leadership" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-bluerake-green">Leadership</a>
            <RouterLink to="/BlueRakeAgriTech" className="block px-3 py-2 mt-4 text-center rounded-md bg-bluerake-emerald text-white font-medium">Access BlueRakeAgriTech</RouterLink>
          </div>
        </div>
      )}
    </nav>
  );
}
