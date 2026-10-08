import React from 'react';
import CorporateNavbar from './CorporateNavbar';
import HeroDataVisualization from './HeroDataVisualization';
import LeadershipProfileCard from './LeadershipProfileCard';
import ProductGatewayCard from './ProductGatewayCard';
import { Database, LineChart, ThermometerSun, Shield } from 'lucide-react';

export default function CorporateLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <CorporateNavbar />
      
      <main>
        <HeroDataVisualization />

        {/* The Vision Section */}
        <section id="about" className="py-32 bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-green-50 to-transparent opacity-50"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <span className="inline-block py-1 px-3 rounded-full bg-green-100 text-green-800 text-sm font-bold tracking-widest uppercase mb-6">Our Vision</span>
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-8 leading-tight tracking-tight">Securing the Future of Agriculture Through <span className="text-bluerake-emerald">Intelligence</span></h3>
              <p className="text-xl md:text-2xl text-gray-500 leading-relaxed font-light">
                We believe that agricultural finance should be driven by hard data, not guesswork. BlueRake AgriTech builds the infrastructural software that allows banks to lend safely, governments to plan accurately, and farmers to scale profitably.
              </p>
            </div>
          </div>
        </section>

        {/* Product Gateway Section */}
        <section className="py-32 bg-gray-50 border-y border-gray-100 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-20 text-center">
              <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-800 text-sm font-bold tracking-widest uppercase mb-4">Subsidiary Platforms</span>
              <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">Active Ecosystems</h3>
            </div>
            
            <ProductGatewayCard />
          </div>
        </section>

        {/* Technology Hub */}
        <section id="tech" className="py-32 bg-[#0A1128] text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="mb-20 text-center">
              <span className="inline-block py-1 px-3 rounded-full bg-white/10 text-green-400 text-sm font-bold tracking-widest uppercase mb-4 border border-white/10">Technology Hub</span>
              <h3 className="text-4xl md:text-5xl font-extrabold tracking-tight">Our Methodologies</h3>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white/5 border border-white/10 p-10 rounded-3xl hover:bg-white/10 hover:border-green-400/30 hover:-translate-y-2 transition-all duration-300 shadow-2xl">
                <div className="bg-green-400/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-8">
                  <Database className="w-8 h-8 text-green-400" />
                </div>
                <h4 className="text-2xl font-bold mb-4">Earth Engine</h4>
                <p className="text-gray-400 text-base leading-relaxed">Advanced historical imagery analysis to map farm boundaries, track long-term deforestation, and assess topographical viability.</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-10 rounded-3xl hover:bg-white/10 hover:border-blue-400/30 hover:-translate-y-2 transition-all duration-300 shadow-2xl">
                <div className="bg-blue-400/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-8">
                  <LineChart className="w-8 h-8 text-blue-400" />
                </div>
                <h4 className="text-2xl font-bold mb-4">Predictive ML</h4>
                <p className="text-gray-400 text-base leading-relaxed">Machine learning algorithms trained on decades of soil and yield data to accurately project future farm profitability.</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-10 rounded-3xl hover:bg-white/10 hover:border-orange-400/30 hover:-translate-y-2 transition-all duration-300 shadow-2xl">
                <div className="bg-orange-400/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-8">
                  <ThermometerSun className="w-8 h-8 text-orange-400" />
                </div>
                <h4 className="text-2xl font-bold mb-4">Climate Models</h4>
                <p className="text-gray-400 text-base leading-relaxed">Integration of meteorological data to assess vulnerability to drought, flooding, and seasonal shifts.</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-10 rounded-3xl hover:bg-white/10 hover:border-purple-400/30 hover:-translate-y-2 transition-all duration-300 shadow-2xl">
                <div className="bg-purple-400/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-8">
                  <Shield className="w-8 h-8 text-purple-400" />
                </div>
                <h4 className="text-2xl font-bold mb-4">Bank Security</h4>
                <p className="text-gray-400 text-base leading-relaxed">Enterprise-grade encryption and secure SSO infrastructure bridging all our subsidiary applications.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Leadership Section */}
        <section id="leadership" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-sm font-bold tracking-wider text-bluerake-emerald uppercase mb-2">The Core Team</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900">Leadership</h3>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <LeadershipProfileCard 
                name="Mailitafi Abdullahi Mailitafi"
                title="Co-founder & Agricultural Innovation Lead"
                bio="In charge of bridging farming practices to the fintech ecosystem."
                imageUrl="/team/mailitafi.jpg"
                linkedin="https://linkedin.com"
              />
              <LeadershipProfileCard 
                name="Ishmeal Amoah"
                title="Co-founder & Agricultural Innovation Lead"
                bio="PhD in Soil and Water Engineering | Climate change adaptation (indigenous weather forecasting) | Agricultural water management."
                imageUrl="/team/ishmeal.jpg"
                linkedin="https://linkedin.com"
              />
              <LeadershipProfileCard 
                name="Maame Adwoa Safoa Amoah"
                title="Agronomy & Sustainability Lead"
                bio="MSc Organic Agriculture and Food Systems."
                imageUrl="/team/maame.jpg"
                linkedin="https://linkedin.com"
              />
            </div>
          </div>
        </section>
      </main>

      {/* Global Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-bold text-xl tracking-tight text-white">
                BlueRake<span className="text-bluerake-emerald">AgriTech</span>
              </span>
            </div>
            <p className="text-sm max-w-xs">
              Securing agricultural finance through advanced data intelligence and satellite observation.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Subsidiaries</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">BlueRakeAgriTech Ghana</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FarmSense API</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Corporate</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Investor Relations</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-800 text-sm text-center">
          © {new Date().getFullYear()} BlueRake AgriTech. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
