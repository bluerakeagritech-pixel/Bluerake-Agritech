import React from 'react';

const FarmData = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Farm Data</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Crop Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">Crop Information</h2>
            <div className="bg-gray-50 p-4 rounded-md space-y-4">
              <label className="block text-gray-600">Crop/Livestock Type</label>
              <select className="w-full border rounded p-2">
                <option value="">Select type</option>
                <option value="maize">Maize</option>
                <option value="cassava">Cassava</option>
                <option value="cattle">Cattle</option>
              </select>

              <label className="block text-gray-600">Farm Size (in acres)</label>
              <input type="number" className="w-full border rounded p-2" placeholder="Enter farm size" />

              <label className="block text-gray-600">Farming Practices</label>
              <div className="space-y-1">
                <label className="block"><input type="checkbox" /> Irrigation</label>
                <label className="block"><input type="checkbox" /> Mechanization</label>
                <label className="block"><input type="checkbox" /> Pesticide/Fertilizer usage</label>
              </div>
            </div>
          </div>

          {/* Land Details */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">Land Details</h2>
            <div className="bg-gray-50 p-4 rounded-md space-y-4">
              <label className="block text-gray-600">Soil Type</label>
              <select className="w-full border rounded p-2">
                <option value="">Select soil type</option>
                <option value="clay">Clay</option>
                <option value="sandy">Sandy</option>
                <option value="loamy">Loamy</option>
              </select>

              <label className="block text-gray-600">Soil Fertility</label>
              <select className="w-full border rounded p-2">
                <option value="">Select fertility level</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              <label className="block text-gray-600">Pest/Disease History</label>
              <textarea className="w-full border rounded p-2" placeholder="Describe past pest or disease issues"></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmData;
