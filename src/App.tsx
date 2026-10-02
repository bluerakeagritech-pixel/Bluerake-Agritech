import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import CorporateLandingPage from './components/CorporateLandingPage';
import AboutPage from './components/AboutPage';
import ServicesPage from './components/ServicesPage';
import ContactPage from './components/ContactPage';
import CentralizedSystem from './components/CentralizedSystem';
import FarmerPortal from './components/FarmerPortal';
import BankPortal from './components/BankPortal';
import AccessibilityControls from './components/AccessibilityControls';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';

const WebsiteLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAuthRoute = ['/login', '/register'].includes(location.pathname);
  const isCorporateRoute = location.pathname === '/';
  const isSystemRoute = location.pathname.startsWith('/system') || 
                       location.pathname.startsWith('/farmer') || 
                       location.pathname.startsWith('/bank');

  return (
    <div className={isCorporateRoute ? "min-h-screen" : "min-h-screen bg-gradient-to-br from-green-50 to-emerald-100"}>
      {!isAuthRoute && !isCorporateRoute && <Header />}
      <main className={isAuthRoute || isSystemRoute ? '' : ''}>
        {children}
      </main>
      {!isAuthRoute && !isSystemRoute && !isCorporateRoute && <Footer />}
      <AccessibilityControls />
      <Toaster position="top-right" />
    </div>
  );
};

function App() {
  return (
    <Router>
      <WebsiteLayout>
        <Routes>
          <Route path="/" element={<CorporateLandingPage />} />
          <Route path="/BlueRakeAgriTech" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/system" element={<CentralizedSystem />} />
          <Route path="/farmer" element={<FarmerPortal farmerId="farmer_1" />} />
          <Route path="/bank" element={<BankPortal bankId="bank_1" />} />
        </Routes>
      </WebsiteLayout>
    </Router>
  );
}

export default App;