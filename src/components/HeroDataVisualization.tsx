import React from 'react';
import { ArrowRight, Satellite, Database, Activity, Globe2 } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

export default function HeroDataVisualization() {
  return (
    <div className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden bg-[#0A1128]">
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-[radial-gradient(circle,rgba(10,114,68,0.15)_0%,transparent_70%)] blur-3xl"></div>
        <div className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-[radial-gradient(circle,rgba(4,74,41,0.2)_0%,transparent_70%)] blur-3xl"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/90 mb-8 backdrop-blur-md shadow-lg shadow-black/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-sm font-semibold tracking-wide uppercase text-green-400">Pioneering Data-Driven Agriculture</span>
        </div>
        
        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8 leading-tight max-w-5xl">
          Agricultural Risk Intelligence <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-bluerake-emerald to-teal-500">
            At Macro Scale.
          </span>
        </h1>
        
        {/* Sub-headline */}
        <p className="mt-4 max-w-3xl mx-auto text-xl md:text-2xl text-gray-300/90 mb-12 font-light leading-relaxed">
          BlueRake AgriTech leverages satellite Earth Observation, predictive machine learning, and geospatial soil analytics to derisk agricultural financing across Africa.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row justify-center gap-5 mb-24 w-full sm:w-auto">
          <RouterLink to="/agrorisk" className="px-8 py-4 bg-bluerake-emerald hover:bg-green-600 text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 group shadow-[0_0_30px_rgba(10,114,68,0.3)] hover:shadow-[0_0_40px_rgba(10,114,68,0.5)] transform hover:-translate-y-1">
            Explore AgroRisk
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </RouterLink>
          <a href="#tech" className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold text-lg transition-all flex items-center justify-center backdrop-blur-md transform hover:-translate-y-1">
            View Our Technology
          </a>
        </div>

        {/* Floating Data Metrics - Glassmorphism style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto text-left relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-teal-500/10 to-blue-500/10 blur-3xl -z-10 rounded-full"></div>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl hover:bg-white/10 transition-colors">
            <div className="bg-green-500/20 w-14 h-14 rounded-xl flex items-center justify-center mb-6 border border-green-500/30">
              <Globe2 className="w-7 h-7 text-green-400" />
            </div>
            <h3 className="text-white font-bold text-4xl mb-2 tracking-tight">2.4M<span className="text-2xl text-gray-400 font-medium"> ha</span></h3>
            <p className="text-gray-400 font-medium">Geospatial Area Monitored</p>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl hover:bg-white/10 transition-colors">
            <div className="bg-blue-500/20 w-14 h-14 rounded-xl flex items-center justify-center mb-6 border border-blue-500/30">
              <Database className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="text-white font-bold text-4xl mb-2 tracking-tight">50M<span className="text-green-400">+</span></h3>
            <p className="text-gray-400 font-medium">Data Points Processed</p>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl hover:bg-white/10 transition-colors">
            <div className="bg-purple-500/20 w-14 h-14 rounded-xl flex items-center justify-center mb-6 border border-purple-500/30">
              <Activity className="w-7 h-7 text-purple-400" />
            </div>
            <h3 className="text-white font-bold text-4xl mb-2 tracking-tight">94.2<span className="text-2xl text-gray-400 font-medium">%</span></h3>
            <p className="text-gray-400 font-medium">Predictive Accuracy</p>
          </div>
        </div>
      </div>
    </div>
  );
}
