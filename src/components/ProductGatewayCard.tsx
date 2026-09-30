import React from 'react';
import { ExternalLink, ShieldCheck, Map, TrendingUp } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

export default function ProductGatewayCard() {
  return (
    <div id="agrorisk" className="relative group bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden hover:shadow-[0_20px_50px_rgba(10,114,68,0.15)] hover:border-bluerake-emerald/30 transition-all duration-500">
      
      <div className="grid lg:grid-cols-2 gap-0">
        {/* Left Side: Product Info */}
        <div className="p-10 lg:p-16 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-sm font-bold tracking-wide uppercase mb-8 w-fit">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Live Platform
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-4">AgroRisk Ghana</h2>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            Our flagship platform connecting smallholder farmers to institutional finance through bank-grade risk assessments, utilizing real-time soil intelligence and geospatial verification.
          </p>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-bluerake-emerald flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900">Bank-Grade Assessments</h4>
                <p className="text-gray-500 text-sm">Automated credit scoring and loan capacity modeling.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Map className="w-6 h-6 text-bluerake-emerald flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900">Geospatial Validation</h4>
                <p className="text-gray-500 text-sm">Polygon mapping and historical yield estimation.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <TrendingUp className="w-6 h-6 text-bluerake-emerald flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900">Live Dashboards</h4>
                <p className="text-gray-500 text-sm">Centralized intelligence portals for all stakeholders.</p>
              </div>
            </div>
          </div>
          
          <RouterLink to="/agrorisk" className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-bluerake-green text-white rounded-xl font-semibold hover:bg-bluerake-emerald transition-colors shadow-lg">
            Enter AgroRisk Portal
            <ExternalLink className="w-5 h-5" />
          </RouterLink>
        </div>

        {/* Right Side: Visual Mockup */}
        <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-12 lg:p-20 flex items-center justify-center overflow-hidden border-l border-gray-100">
          {/* Abstract Mockup UI */}
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-200 overflow-hidden transform group-hover:scale-105 group-hover:-rotate-2 transition-transform duration-700 z-10">
            {/* Mockup Header */}
            <div className="h-14 bg-bluerake-slate flex items-center px-6 gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="ml-4 text-white/90 font-medium text-sm tracking-wide">AgroRisk Global Dashboard</div>
            </div>
            {/* Mockup Body */}
            <div className="p-6 space-y-6 bg-gray-50/50">
              <div className="h-40 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/connected.png')] opacity-10"></div>
                <Map className="w-10 h-10 text-bluerake-emerald/40" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-20 bg-green-50 rounded-xl border border-green-100/50 flex flex-col justify-center px-4">
                  <div className="h-2 w-8 bg-green-200 rounded mb-2"></div>
                  <div className="h-4 w-16 bg-green-300 rounded"></div>
                </div>
                <div className="h-20 bg-blue-50 rounded-xl border border-blue-100/50 flex flex-col justify-center px-4">
                  <div className="h-2 w-8 bg-blue-200 rounded mb-2"></div>
                  <div className="h-4 w-16 bg-blue-300 rounded"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative background shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 group-hover:scale-110 transition-transform duration-700"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 group-hover:scale-110 transition-transform duration-700"></div>
        </div>
      </div>
    </div>
  );
}
