import React from 'react';
import { ExternalLink, Link, Mail } from 'lucide-react';

interface LeaderProps {
  name: string;
  title: string;
  bio: string;
  imageUrl?: string;
  linkedin?: string;
}

export default function LeadershipProfileCard({ name, title, bio, imageUrl, linkedin }: LeaderProps) {
  return (
    <div className="group relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="absolute top-0 left-0 w-full h-32 bg-bluerake-green"></div>
      
      <div className="relative px-6 pt-16 pb-8 text-center">
        <div className="relative w-32 h-32 mx-auto mb-6 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-200">
          {imageUrl ? (
            <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
              No Image
            </div>
          )}
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{name}</h3>
        <p className="text-bluerake-emerald font-medium mb-4">{title}</p>
        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          {bio}
        </p>
        
        <div className="flex items-center justify-center gap-4">
          {linkedin && (
            <a href={linkedin} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
              <Link className="w-5 h-5" />
            </a>
          )}
          <button className="p-2 text-gray-400 hover:text-bluerake-green hover:bg-green-50 rounded-full transition-colors">
            <Mail className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Decorative corner */}
      <div className="absolute bottom-0 right-0 w-16 h-16 bg-bluerake-emerald/10 rounded-tl-full -z-10 group-hover:scale-150 transition-transform duration-500"></div>
    </div>
  );
}
