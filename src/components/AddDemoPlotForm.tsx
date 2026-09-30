import React, { useState } from 'react';
import { Save, X, BarChart3, MapPin, Sprout, Calendar, DollarSign } from 'lucide-react';
import { centralIntelligence } from '../services/centralIntelligence';
import type { DemoPlot } from '../types';
import toast from 'react-hot-toast';

interface AddDemoPlotFormProps {
  onClose: () => void;
  onDemoPlotAdded: (demoPlot: DemoPlot) => void;
}

const AddDemoPlotForm: React.FC<AddDemoPlotFormProps> = ({ onClose, onDemoPlotAdded }) => {
  const [formData, setFormData] = useState<Partial<DemoPlot>>({
    id: `demo_${Date.now()}`,
    agroEcologicalZone: '',
    cropType: '',
    variety: '',
    season: 'Main',
    year: 2024,
    soilTestResults: {
      pH: 0,
      nitrogen: 0,
      phosphorus: 0,
      potassium: 0,
      soilFertilityScore: 0
    },
    fertilizerUsed: [],
    yieldAchieved: 0,
    weatherConditions: {
      rainfall: 0,
      temperature: 0,
      humidity: 0
    },
    productionCost: 0,
    marketPrice: 0,
    profit: 0,
    extensionOfficer: '',
    created_at: new Date().toISOString()
  });

  const [fertilizers, setFertilizers] = useState([
    { type: '', quantity: 0, cost: 0 }
  ]);

  const agroEcologicalZones = ['Forest Zone', 'Coastal Savanna', 'Guinea Savanna', 'Sudan Savanna'];
  const cropTypes = ['Maize', 'Rice', 'Cassava', 'Yam', 'Cocoa', 'Plantain', 'Groundnuts', 'Oil Palm'];
  const seasons = ['Main', 'Minor'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agroEcologicalZone || !formData.cropType || !formData.variety) {
      toast.error('Please fill in all required fields (Zone, Crop Type, Variety)');
      return;
    }

    try {
      // Calculate profit
      const totalFertilizerCost = fertilizers.reduce((sum, fert) => sum + fert.cost, 0);
      const totalProduction = (formData.yieldAchieved || 0) * (formData.marketPrice || 0);
      const calculatedProfit = totalProduction - (formData.productionCost || 0) - totalFertilizerCost;

      const completeDemoPlot: DemoPlot = {
        ...formData as DemoPlot,
        fertilizerUsed: fertilizers.filter(f => f.type && f.quantity > 0),
        profit: calculatedProfit
      };

      // Add demo plot to central intelligence system
      centralIntelligence.addDemoPlot(completeDemoPlot);
      
      toast.success(`Demo plot for ${formData.cropType} - ${formData.variety} added successfully!`);
      onDemoPlotAdded(completeDemoPlot);
      onClose();
    } catch (error) {
      toast.error(`Error adding demo plot: ${error}`);
    }
  };

  const addFertilizer = () => {
    setFertilizers([...fertilizers, { type: '', quantity: 0, cost: 0 }]);
  };

  const removeFertilizer = (index: number) => {
    setFertilizers(fertilizers.filter((_, i) => i !== index));
  };

  const updateFertilizer = (index: number, field: string, value: any) => {
    const updated = [...fertilizers];
    updated[index] = { ...updated[index], [field]: value };
    setFertilizers(updated);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Add New Demo Plot</h2>
              <p className="text-gray-600">Create a benchmark demo plot for farmer comparison</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* A. Basic Plot Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              A. Basic Plot Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Agro-Ecological Zone *
                </label>
                <select
                  required
                  value={formData.agroEcologicalZone}
                  onChange={(e) => setFormData({...formData, agroEcologicalZone: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select Zone</option>
                  {agroEcologicalZones.map(zone => (
                    <option key={zone} value={zone}>{zone}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Crop Type *
                </label>
                <select
                  required
                  value={formData.cropType}
                  onChange={(e) => setFormData({...formData, cropType: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select Crop</option>
                  {cropTypes.map(crop => (
                    <option key={crop} value={crop}>{crop}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Variety *
                </label>
                <input
                  type="text"
                  required
                  value={formData.variety}
                  onChange={(e) => setFormData({...formData, variety: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter variety name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Season
                </label>
                <select
                  value={formData.season}
                  onChange={(e) => setFormData({...formData, season: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {seasons.map(season => (
                    <option key={season} value={season}>{season}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year
                </label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({...formData, year: Number(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Extension Officer
                </label>
                <input
                  type="text"
                  value={formData.extensionOfficer}
                  onChange={(e) => setFormData({...formData, extensionOfficer: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Officer name"
                />
              </div>
            </div>
          </div>

          {/* B. Soil Test Results */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Sprout className="w-5 h-5 text-orange-600" />
              B. Soil Test Results
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">pH Level</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="14"
                  value={formData.soilTestResults?.pH || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    soilTestResults: {
                      ...formData.soilTestResults!,
                      pH: parseFloat(e.target.value)
                    }
                  })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="6.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nitrogen (%)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.soilTestResults?.nitrogen || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    soilTestResults: {
                      ...formData.soilTestResults!,
                      nitrogen: parseFloat(e.target.value)
                    }
                  })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0.15"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phosphorus (ppm)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.soilTestResults?.phosphorus || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    soilTestResults: {
                      ...formData.soilTestResults!,
                      phosphorus: parseFloat(e.target.value)
                    }
                  })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="25"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Potassium (ppm)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.soilTestResults?.potassium || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    soilTestResults: {
                      ...formData.soilTestResults!,
                      potassium: parseFloat(e.target.value)
                    }
                  })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="150"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Soil Fertility Score (0-100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.soilTestResults?.soilFertilityScore || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    soilTestResults: {
                      ...formData.soilTestResults!,
                      soilFertilityScore: parseFloat(e.target.value)
                    }
                  })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="75"
                />
              </div>
            </div>
          </div>

          {/* C. Fertilizer Used */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                C. Fertilizer Used
              </h3>
              <button
                type="button"
                onClick={addFertilizer}
                className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
              >
                Add Fertilizer
              </button>
            </div>
            
            {fertilizers.map((fertilizer, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white rounded-lg mb-4">
                <input
                  type="text"
                  placeholder="Fertilizer type"
                  value={fertilizer.type}
                  onChange={(e) => updateFertilizer(index, 'type', e.target.value)}
                  className="p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="number"
                  placeholder="Quantity (kg/ha)"
                  min="0"
                  value={fertilizer.quantity}
                  onChange={(e) => updateFertilizer(index, 'quantity', parseFloat(e.target.value))}
                  className="p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="number"
                  placeholder="Cost (GH₵)"
                  min="0"
                  value={fertilizer.cost}
                  onChange={(e) => updateFertilizer(index, 'cost', parseFloat(e.target.value))}
                  className="p-2 border border-gray-300 rounded-md"
                />
                <button
                  type="button"
                  onClick={() => removeFertilizer(index)}
                  className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* D. Production Results */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              D. Production Results
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Yield Achieved (MT/ha)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.yieldAchieved}
                  onChange={(e) => setFormData({...formData, yieldAchieved: parseFloat(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="4.2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Production Cost (GH₵)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.productionCost}
                  onChange={(e) => setFormData({...formData, productionCost: parseFloat(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="2800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Market Price (GH₵/MT)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.marketPrice}
                  onChange={(e) => setFormData({...formData, marketPrice: parseFloat(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="3200"
                />
              </div>
            </div>
          </div>

          {/* E. Weather Conditions */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              E. Weather Conditions
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rainfall (mm)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.weatherConditions?.rainfall || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    weatherConditions: {
                      ...formData.weatherConditions!,
                      rainfall: parseFloat(e.target.value)
                    }
                  })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="1350"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Temperature (°C)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.weatherConditions?.temperature || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    weatherConditions: {
                      ...formData.weatherConditions!,
                      temperature: parseFloat(e.target.value)
                    }
                  })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="26"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Humidity (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.weatherConditions?.humidity || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    weatherConditions: {
                      ...formData.weatherConditions!,
                      humidity: parseFloat(e.target.value)
                    }
                  })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="75"
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
            >
              <Save className="w-5 h-5" />
              Create Demo Plot
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDemoPlotForm;