import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <Sprout className="h-8 w-8 text-green-400" />
              <span className="ml-2 text-xl font-bold">BlueRakeAgriTech Ghana</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              A sub-project of Project BlueRake Agritech Ghana, empowering farmers with smart risk assessment tools and financial solutions for sustainable agriculture.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-green-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-green-400 transition-colors">
                  Our Services
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-green-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-green-400 transition-colors">
                  Farmer Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-green-400 mr-2" />
                <span className="text-gray-300 text-sm">Accra, Ghana</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-green-400 mr-2" />
                <span className="text-gray-300 text-sm">+233 XX XXX XXXX</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-green-400 mr-2" />
                <span className="text-gray-300 text-sm">info@BlueRakeAgriTech.gh</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 BlueRakeAgriTech Ghana. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-green-400 text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 text-sm transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;