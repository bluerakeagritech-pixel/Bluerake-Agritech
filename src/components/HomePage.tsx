import React from "react";
import { Link } from "react-router-dom";
import { Building, MessageSquare, Landmark } from "lucide-react";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div
        className="min-h-screen bg-cover bg-center flex items-center justify-center text-white relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=1920&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 bg-black bg-opacity-60 p-10 rounded-xl text-center max-w-4xl mx-4">
          <div className="inline-block px-4 py-1.5 rounded-full bg-green-500/20 border border-green-400/30 text-green-300 text-sm font-semibold tracking-wider uppercase mb-6">
            An Enterprise Solution by BlueRake AgriTech
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Uses soil science, satellite data, and field demo plots to convert Ghanaian farmers into bank-ready investments.
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Bridging the financing gap by delivering the precise, ground-truthed risk metrics that lenders and agribusinesses demand.
          </p>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/farmer"
                className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105 shadow-lg shadow-green-600/30"
              >
                Access Farmer Portal
              </Link>
              <Link
                to="/bank"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105 shadow-lg shadow-blue-600/30"
              >
                Access Bank Portal
              </Link>
            </div>
            
            {/* Hidden System Admin Portal for Devs/Admins only - reveals on hover */}
            <div className="pt-8 opacity-0 hover:opacity-100 transition-opacity duration-500 flex justify-center">
              <Link
                to="/system"
                className="text-xs text-gray-500 hover:text-gray-300 tracking-widest uppercase"
              >
                [Admin Portal]
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Digital Bridge Between Soil, Crops, and Finance</h2>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-gray-600 mb-6">
              BlueRakeAgriTech Ghana transforms traditional farming into data-driven agriculture by combining FarmSense soil intelligence, satellite monitoring, and demo plot benchmarks to create bank-grade credit assessments.
            </p>
            <p className="text-lg text-gray-600">
              Powered by FarmSense soil devices and Demo Plot Intelligence, we provide comprehensive digital extension services that guide farmers from land preparation to profitable harvest.
            </p>
          </div>
        </div>
      </section>

      {/* FarmSense Partnership Section */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Powered by FarmSense Soil Intelligence</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold text-xl">pH</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Soil Analysis</h3>
              <p className="text-gray-600">Precise pH, NPK, and fertility measurements using FarmSense devices</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Demo Plot Benchmarks</h3>
              <p className="text-gray-600">Compare farmer performance against proven demo plot yields</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 font-bold text-xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Credit Intelligence</h3>
              <p className="text-gray-600">Bank-grade risk assessment with profit-based loan sizing</p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Meet the Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <img
                src="https://i.imgur.com/KlSUzza.jpeg"
                alt="Mailitafi Abdullahi Mailitafi"
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold mb-2">Mailitafi Abdullahi Mailitafi</h3>
              <p className="text-gray-800 font-medium text-sm mb-2">Co-founder & Agricultural Innovation Lead</p>
              <p className="text-gray-500 text-xs">In charge of bridging farming practices to the fintech ecosystem.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <img
                src="https://i.imgur.com/SAGXDVT.jpeg"
                alt="Ishmeal Amoah"
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold mb-2">Ishmeal Amoah</h3>
              <p className="text-gray-800 font-medium text-sm mb-2">Co-founder & Agricultural Innovation Lead</p>
              <p className="text-gray-500 text-xs">PhD in Soil and Water Engineering | Climate change adaptation (indigenous weather forecasting) | Agricultural water management.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <img
                src="https://i.imgur.com/Qix442a.jpeg"
                alt="Maame Adwoa Safoa Amoah"
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold mb-2">Maame Adwoa Safoa Amoah</h3>
              <p className="text-gray-800 font-medium text-sm mb-2">Agronomy & Sustainability Lead</p>
              <p className="text-gray-500 text-xs">MSc Organic Agriculture and Food Systems.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Banking Partners Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Financial Institution Partners</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto opacity-50">
            {/* 
              TODO: Replace with actual partners later
              {['GCB Bank', 'Agricultural Development Bank', 'Ecobank Ghana', 'Fidelity Bank'].map((bank) => (
                <div key={bank} className="bg-gray-50 rounded-lg p-6 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Landmark className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold">{bank}</h3>
                </div>
              ))}
            */}
            {[1, 2, 3, 4].map((placeholder) => (
              <div key={placeholder} className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-6 text-center flex flex-col items-center justify-center h-40">
                <p className="text-gray-400 font-medium">Partner TBA</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Providing bank-grade credit reports with soil intelligence and performance analytics
            </p>
          </div>
        </div>
      </section>

      {/* Technology Partners Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Technology Partners</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-green-600 font-bold text-2xl">FS</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4">FarmSense</h3>
              <p className="text-gray-600 mb-4">Soil Intelligence Partner</p>
              <p className="text-sm text-gray-500">
                Providing precision soil analysis devices and fertility recommendations for data-driven farming decisions
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Project BlueRake</h3>
              <p className="text-gray-600 mb-4">Parent Project</p>
              <p className="text-sm text-gray-500">
                Comprehensive agricultural technology initiative modernizing Ghana's agricultural sector
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Farmer Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Farmer Testimonials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Ama Serwaa</h3>
                  <p className="text-gray-600">Cocoa Farmer, Western Region</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The FarmSense soil test showed my pH was too low for cocoa. After following their fertilizer plan, my yield increased by 40% and I got approved for a larger loan."
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Kofi Manu</h3>
                  <p className="text-gray-600">Maize Farmer, Ashanti Region</p>
                </div>
              </div>
              <p className="text-gray-600">
                "Comparing my performance to the demo plot helped me see where I was losing money. Now I follow the digital extension advice and my profit margin doubled."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Project BlueRake Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-6">Project BlueRake Agritech Ghana</h2>
            <p className="text-lg mb-8 text-green-100">
              A comprehensive agricultural technology initiative transforming Ghana's agricultural sector through soil science, digital extension, and financial inclusion.
            </p>
            <Link
              to="/about"
              className="inline-block bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-full text-lg font-semibold transition-all"
            >
              Learn More About Project BlueRake
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
