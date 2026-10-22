import React, { useState } from 'react';
import { Save, X, User, MapPin, Sprout, Settings, Users, Shield, TrendingUp, Satellite } from 'lucide-react';
import { centralIntelligence } from '../services/centralIntelligence';
import type { Farmer } from '../types';
import toast from 'react-hot-toast';

interface AddFarmerFormProps {
  onClose: () => void;
  onFarmerAdded: (farmer: Farmer) => void;
}

const AddFarmerForm: React.FC<AddFarmerFormProps> = ({ onClose, onFarmerAdded }) => {
  const [formData, setFormData] = useState<Partial<Farmer>>({
    id: `farmer_${Date.now()}`,
    fullName: '',
    age: 0,
    gender: 'male',
    education: 'primary',
    farmingExperience: 0,
    phone: '',
    email: '',
    ghanaCardId: '',
    language: 'en',
    farmSize: 0,
    irrigationAccess: false,
    mechanisationAccess: false,
    location: {
      latitude: 0,
      longitude: 0,
      region: '',
      district: '',
      agroEcologicalZone: ''
    },
    extensionScore: 0,
    performanceRatio: 1.0,
    created_at: new Date().toISOString()
  });

  const [soilData, setSoilData] = useState({
    soilType: 'loamy' as 'clay' | 'sandy' | 'loamy' | 'silt' | 'peat',
    soilFertility: 'medium' as 'low' | 'medium' | 'high',
    organicMatter: 0,
    moisture: 0,
    pH: 0,
    lastUpdated: new Date().toISOString()
  });

  const [cropManagement, setCropManagement] = useState({
    practicesCropRotation: false,
    previousCrops: {
      cocoa: false,
      maize: false,
      rice: false,
      cassava: false,
      yam: false,
      plantain: false,
      groundnuts: false,
      oilPalm: false
    }
  });

  const [inputAccess, setInputAccess] = useState({
    qualitySeeds: false,
    fertilizer: false,
    tools: false,
    subsidies: false
  });

  const [infrastructure, setInfrastructure] = useState({
    roadAccess: false,
    irrigationSystem: false,
    storageFacilities: false
  });

  const [socialFinancial, setSocialFinancial] = useState({
    cooperativeMember: false,
    cooperativeName: '',
    offFarmIncome: false,
    hasSavings: false,
    familySupport: false
  });

  const [vegetationHealth, setVegetationHealth] = useState({
    ndviScore: 0,
    lastUpdated: new Date().toISOString()
  });

  const [landTenure, setLandTenure] = useState<'owned' | 'lease' | 'sharecrop'>('owned');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.farmSize || !formData.location?.region) {
      toast.error('Please fill in all required fields (Name, Farm Size, Region)');
      return;
    }

    try {
      // Create complete farmer record and generate sequential GHFAxxx ID
      const createdFarmer = await centralIntelligence.registerFarmer({
        ...formData,
        id: undefined,
        extendedData: {
          landTenure,
          soilData,
          cropManagement,
          inputAccess,
          infrastructure,
          socialFinancial,
          vegetationHealth
        }
      });
      
      toast.success(`Farmer ${createdFarmer.fullName} registered with ID: ${createdFarmer.id}!`);
      onFarmerAdded(createdFarmer);
      onClose();
    } catch (error) {
      toast.error(`Error adding farmer: ${error}`);
    }
  };

  const regions = [
    'Greater Accra', 'Ashanti', 'Western', 'Central', 'Eastern', 
    'Northern', 'Volta', 'Brong-Ahafo', 'Upper East', 'Upper West'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[95vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Add New Farmer</h2>
              <p className="text-gray-600">Master Data Entry - Creates complete farmer profile for Risk Assessment Engine</p>
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
          {/* A. Farmer Profile */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              A. Farmer Profile
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Farmer Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: Number(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter age"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value as any})}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="+233 XX XXX XXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghana Card ID
                </label>
                <input
                  type="text"
                  value={formData.ghanaCardId}
                  onChange={(e) => setFormData({...formData, ghanaCardId: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="GHA-XXXXXXXXX-X"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Farming Experience (years)
                </label>
                <input
                  type="number"
                  value={formData.farmingExperience}
                  onChange={(e) => setFormData({...formData, farmingExperience: Number(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Years of experience"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Region *
                </label>
                <select
                  required
                  value={formData.location?.region}
                  onChange={(e) => setFormData({
                    ...formData, 
                    location: {...formData.location!, region: e.target.value}
                  })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select Region</option>
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District
                </label>
                <input
                  type="text"
                  value={formData.location?.district}
                  onChange={(e) => setFormData({
                    ...formData, 
                    location: {...formData.location!, district: e.target.value}
                  })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter district"
                />
              </div>
            </div>
          </div>

          {/* B. Farm Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              B. Farm Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Farm Size (Hectares) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={formData.farmSize}
                  onChange={(e) => setFormData({...formData, farmSize: Number(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter farm size"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Land Tenure
                </label>
                <select
                  value={landTenure}
                  onChange={(e) => setLandTenure(e.target.value as any)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="owned">Owned</option>
                  <option value="lease">Lease</option>
                  <option value="sharecrop">Sharecrop</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Agro-Ecological Zone
                </label>
                <select
                  value={formData.location?.agroEcologicalZone}
                  onChange={(e) => setFormData({
                    ...formData, 
                    location: {...formData.location!, agroEcologicalZone: e.target.value}
                  })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select Zone</option>
                  <option value="Forest Zone">Forest Zone</option>
                  <option value="Coastal Savanna">Coastal Savanna</option>
                  <option value="Guinea Savanna">Guinea Savanna</option>
                  <option value="Sudan Savanna">Sudan Savanna</option>
                </select>
              </div>
            </div>
          </div>

          {/* C. Soil Data Component */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Sprout className="w-5 h-5 text-orange-600" />
              C. Soil Data Component
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Soil Type
                </label>
                <select
                  value={soilData.soilType}
                  onChange={(e) => setSoilData({...soilData, soilType: e.target.value as any})}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="clay">Clay</option>
                  <option value="sandy">Sandy</option>
                  <option value="loamy">Loamy</option>
                  <option value="silt">Silt</option>
                  <option value="peat">Peat</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Soil Fertility Level
                </label>
                <select
                  value={soilData.soilFertility}
                  onChange={(e) => setSoilData({...soilData, soilFertility: e.target.value as any})}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  pH Level (Optional)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="14"
                  value={soilData.pH}
                  onChange={(e) => setSoilData({...soilData, pH: Number(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="6.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organic Matter % (Optional)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={soilData.organicMatter}
                  onChange={(e) => setSoilData({...soilData, organicMatter: Number(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="3.5"
                />
              </div>
            </div>
          </div>

          {/* D. Crop Management */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-purple-600" />
              D. Crop Management
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={cropManagement.practicesCropRotation}
                    onChange={(e) => setCropManagement({...cropManagement, practicesCropRotation: e.target.checked})}
                    className="rounded border-gray-300 text-green-600 mr-2"
                  />
                  Practice Crop Rotation
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Previous Crops (Select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Object.entries(cropManagement.previousCrops).map(([crop, checked]) => (
                    <label key={crop} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => setCropManagement({
                          ...cropManagement,
                          previousCrops: {
                            ...cropManagement.previousCrops,
                            [crop]: e.target.checked
                          }
                        })}
                        className="rounded border-gray-300 text-green-600 mr-2"
                      />
                      {crop.charAt(0).toUpperCase() + crop.slice(1)}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* E. Input Access */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              E. Input Access
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(inputAccess).map(([input, checked]) => (
                <label key={input} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => setInputAccess({
                      ...inputAccess,
                      [input]: e.target.checked
                    })}
                    className="rounded border-gray-300 text-green-600 mr-2"
                  />
                  Access to {input.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </label>
              ))}
            </div>
          </div>

          {/* F. Infrastructure Access */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-gray-600" />
              F. Infrastructure Access
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={infrastructure.roadAccess}
                  onChange={(e) => setInfrastructure({...infrastructure, roadAccess: e.target.checked})}
                  className="rounded border-gray-300 text-green-600 mr-2"
                />
                Road Access
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.irrigationAccess}
                  onChange={(e) => setFormData({...formData, irrigationAccess: e.target.checked})}
                  className="rounded border-gray-300 text-green-600 mr-2"
                />
                Irrigation System
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={infrastructure.storageFacilities}
                  onChange={(e) => setInfrastructure({...infrastructure, storageFacilities: e.target.checked})}
                  className="rounded border-gray-300 text-green-600 mr-2"
                />
                Storage Facilities
              </label>
            </div>
          </div>

          {/* G. Cooperative Membership */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-teal-600" />
              G. Cooperative Membership
            </h3>
            
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={socialFinancial.cooperativeMember}
                  onChange={(e) => setSocialFinancial({...socialFinancial, cooperativeMember: e.target.checked})}
                  className="rounded border-gray-300 text-green-600 mr-2"
                />
                Member of Farmer Organization
              </label>

              {socialFinancial.cooperativeMember && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    value={socialFinancial.cooperativeName}
                    onChange={(e) => setSocialFinancial({...socialFinancial, cooperativeName: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter organization name"
                  />
                </div>
              )}
            </div>
          </div>

          {/* H. Backup Resources */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-600" />
              H. Backup Resources
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={socialFinancial.offFarmIncome}
                  onChange={(e) => setSocialFinancial({...socialFinancial, offFarmIncome: e.target.checked})}
                  className="rounded border-gray-300 text-green-600 mr-2"
                />
                Off-farm Income
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={socialFinancial.hasSavings}
                  onChange={(e) => setSocialFinancial({...socialFinancial, hasSavings: e.target.checked})}
                  className="rounded border-gray-300 text-green-600 mr-2"
                />
                Has Savings
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={socialFinancial.familySupport}
                  onChange={(e) => setSocialFinancial({...socialFinancial, familySupport: e.target.checked})}
                  className="rounded border-gray-300 text-green-600 mr-2"
                />
                Family Support Network
              </label>
            </div>
          </div>

          {/* I. Vegetation Health */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Satellite className="w-5 h-5 text-cyan-600" />
              I. Vegetation Health
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NDVI Score (0-1) (Optional)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={vegetationHealth.ndviScore}
                  onChange={(e) => setVegetationHealth({...vegetationHealth, ndviScore: Number(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0.75"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Updated
                </label>
                <input
                  type="date"
                  value={vegetationHealth.lastUpdated.split('T')[0]}
                  onChange={(e) => setVegetationHealth({...vegetationHealth, lastUpdated: e.target.value + 'T00:00:00.000Z'})}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
              Create Farmer Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFarmerForm;