import React from 'react';
import { User, MapPin, Phone, Mail, Tractor } from 'lucide-react';

const FarmerProfile = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Farmer Profile</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-start gap-6">
          <div className="w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center">
            <User className="w-16 h-16 text-emerald-600" />
          </div>
          
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-gray-800">John Smith</h2>
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-5 h-5" />
                <span>123 Farm Road, Rural County, State 12345</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-5 h-5" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-5 h-5" />
                <span>john.smith@example.com</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Tractor className="w-5 h-5" />
                <span>Farming since 2005</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Farm Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700">Primary Crops</h4>
              <p className="text-gray-600">Corn, Soybeans, Wheat</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700">Total Acreage</h4>
              <p className="text-gray-600">500 acres</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700">Equipment</h4>
              <p className="text-gray-600">2 Tractors, 1 Harvester, Irrigation System</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700">Certifications</h4>
              <p className="text-gray-600">Organic Certified, Sustainable Agriculture</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerProfile;