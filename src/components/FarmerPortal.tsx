import React, { useState } from 'react';
import { User, Upload, Eye, TrendingUp, AlertCircle, CheckCircle, Save, Sprout, MapPin, Settings, Users, Shield, Satellite, DollarSign } from 'lucide-react';
import { centralIntelligence } from '../services/centralIntelligence';
import type { Farmer, FarmSenseSoilData } from '../types';

interface FarmerPortalProps {
  farmerId: string;
}

const FarmerPortal: React.FC<FarmerPortalProps> = ({ farmerId }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'riskprofile' | 'data' | 'results'>('profile');
  const [farmerData, setFarmerData] = useState<Partial<Farmer>>({
    id: farmerId,
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
    created_at: new Date().toISOString(),
    extendedData: {
      landTenure: 'owned',
      soilData: {
        soilType: 'loamy',
        soilFertility: 'medium',
        organicMatter: 0,
        moisture: 0,
        pH: 0,
        lastUpdated: new Date().toISOString()
      },
      cropManagement: {
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
      },
      inputAccess: {
        qualitySeeds: false,
        fertilizer: false,
        tools: false,
        subsidies: false
      },
      infrastructure: {
        roadAccess: false,
        irrigationSystem: false,
        storageFacilities: false
      },
      socialFinancial: {
        cooperativeMember: false,
        cooperativeName: '',
        offFarmIncome: false,
        hasSavings: false,
        familySupport: false
      },
      vegetationHealth: {
        ndviScore: 0,
        lastUpdated: new Date().toISOString()
      }
    }
  });

  const [soilData, setSoilData] = useState<Partial<FarmSenseSoilData>>({
    farmerId,
    reportDate: new Date().toISOString().split('T')[0],
    reportType: 'manual',
    soilData: {
      pH: 0,
      nitrogen: 0,
      phosphorus: 0,
      potassium: 0,
      soilFertilityScore: 0,
      soilTexture: 'loamy',
      moisture: 0,
      organicMatter: 0,
    },
    cropSuitability: [],
    fertilizerRecommendation: [],
  });

  // Get farmer profile from central system
  const farmerProfile = centralIntelligence.getFarmerProfile(farmerId);

  const handleDataSubmit = () => {
    try {
      if (farmerData.fullName && farmerData.farmSize && farmerData.location?.region) {
        // Add or update farmer in central system
        centralIntelligence.addFarmer(farmerData as Farmer);
        alert('Farmer data submitted successfully to Central System');
        setActiveTab('results');
      } else {
        alert('Please fill in all required fields');
      }
    } catch (error) {
      alert(`Error submitting data: ${error}`);
    }
  };

  const handleSoilDataSubmit = () => {
    try {
      if (soilData.soilData?.pH && soilData.soilData?.nitrogen) {
        const completeSoilData: FarmSenseSoilData = {
          id: `farmsense_${Date.now()}`,
          farmerId,
          reportDate: soilData.reportDate!,
          reportType: soilData.reportType!,
          reportUrl: soilData.reportUrl,
          soilData: soilData.soilData!,
          cropSuitability: soilData.cropSuitability!,
          fertilizerRecommendation: soilData.fertilizerRecommendation!,
          created_at: new Date().toISOString(),
        };

        centralIntelligence.addFarmSenseData(farmerId, completeSoilData);
        alert('FarmSense soil data submitted successfully to Central System');
      } else {
        alert('Please fill in all required soil data fields');
      }
    } catch (error) {
      alert(`Error submitting soil data: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center">
            <User className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <h1 className="text-xl font-bold text-gray-900">Farmer Portal</h1>
              <p className="text-sm text-gray-500">Data Collection Window</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Alert */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
            <div>
              <h3 className="font-medium text-blue-800">Data Collection Portal</h3>
              <p className="text-sm text-blue-700 mt-1">
                Enter your farm data below. All information is sent directly to the AgroRisk Ghana 
                Central System for processing and analysis. You cannot edit system calculations.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Enter Profile Data
              </button>
              <button
                onClick={() => setActiveTab('riskprofile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'riskprofile'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Farm & Risk Profile
              </button>
              <button
                onClick={() => setActiveTab('data')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'data'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Enter Soil Data
              </button>
              <button
                onClick={() => setActiveTab('results')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'results'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                View My Results
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-800">Farmer Profile Data Entry</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={farmerData.fullName}
                      onChange={(e) => setFarmerData({...farmerData, fullName: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age *</label>
                    <input
                      type="number"
                      required
                      value={farmerData.age}
                      onChange={(e) => setFarmerData({...farmerData, age: Number(e.target.value)})}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your age"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={farmerData.phone}
                      onChange={(e) => setFarmerData({...farmerData, phone: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="+233 XX XXX XXXX"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ghana Card ID *</label>
                    <input
                      type="text"
                      required
                      value={farmerData.ghanaCardId}
                      onChange={(e) => setFarmerData({...farmerData, ghanaCardId: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="GHA-XXXXXXXXX-X"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Farm Size (hectares) *</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={farmerData.farmSize}
                      onChange={(e) => setFarmerData({...farmerData, farmSize: Number(e.target.value)})}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter farm size"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Farming Experience (years) *</label>
                    <input
                      type="number"
                      required
                      value={farmerData.farmingExperience}
                      onChange={(e) => setFarmerData({...farmerData, farmingExperience: Number(e.target.value)})}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Years of experience"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Region *</label>
                    <select
                      required
                      value={farmerData.location?.region}
                      onChange={(e) => setFarmerData({
                        ...farmerData, 
                        location: {...farmerData.location!, region: e.target.value}
                      })}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select Region</option>
                      <option value="Greater Accra">Greater Accra</option>
                      <option value="Ashanti">Ashanti</option>
                      <option value="Western">Western</option>
                      <option value="Central">Central</option>
                      <option value="Eastern">Eastern</option>
                      <option value="Northern">Northern</option>
                      <option value="Volta">Volta</option>
                      <option value="Brong-Ahafo">Brong-Ahafo</option>
                      <option value="Upper East">Upper East</option>
                      <option value="Upper West">Upper West</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">District *</label>
                    <input
                      type="text"
                      required
                      value={farmerData.location?.district}
                      onChange={(e) => setFarmerData({
                        ...farmerData, 
                        location: {...farmerData.location!, district: e.target.value}
                      })}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter district"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={farmerData.irrigationAccess}
                        onChange={(e) => setFarmerData({...farmerData, irrigationAccess: e.target.checked})}
                        className="rounded border-gray-300 text-green-600 mr-2"
                      />
                      I have access to irrigation
                    </label>
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={farmerData.mechanisationAccess}
                        onChange={(e) => setFarmerData({...farmerData, mechanisationAccess: e.target.checked})}
                        className="rounded border-gray-300 text-green-600 mr-2"
                      />
                      I have access to mechanization
                    </label>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleDataSubmit}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
                  >
                    <Save className="w-5 h-5" />
                    Submit to Central System
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'riskprofile' && (
              <div className="space-y-8">
                <h2 className="text-lg font-semibold text-gray-800">Farm & Risk Profile Data Entry</h2>
                <p className="text-gray-600">Complete your farm profile to improve your risk assessment and loan eligibility. All fields are optional but providing more information helps us better understand your farming operation.</p>
                
                {/* Farm Information */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-green-600" />
                    🌾 Farm Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Land Tenure (Optional - improves accuracy if provided)
                      </label>
                      <select
                        value={farmerData.extendedData?.landTenure || 'owned'}
                        onChange={(e) => setFarmerData({
                          ...farmerData,
                          extendedData: {
                            ...farmerData.extendedData!,
                            landTenure: e.target.value as any
                          }
                        })}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="owned">Owned</option>
                        <option value="lease">Lease</option>
                        <option value="sharecrop">Sharecrop</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Agro-Ecological Zone (Optional - improves accuracy if provided)
                      </label>
                      <select
                        value={farmerData.location?.agroEcologicalZone || ''}
                        onChange={(e) => setFarmerData({
                          ...farmerData,
                          location: {...farmerData.location!, agroEcologicalZone: e.target.value}
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

                {/* Soil Data Component */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Sprout className="w-5 h-5 text-orange-600" />
                    🌱 Soil Data Component
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Soil Type (Optional - improves accuracy if provided)
                      </label>
                      <select
                        value={farmerData.extendedData?.soilData.soilType || 'loamy'}
                        onChange={(e) => setFarmerData({
                          ...farmerData,
                          extendedData: {
                            ...farmerData.extendedData!,
                            soilData: {
                              ...farmerData.extendedData!.soilData,
                              soilType: e.target.value as any
                            }
                          }
                        })}
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
                        Soil Fertility Level (Optional - improves accuracy if provided)
                      </label>
                      <select
                        value={farmerData.extendedData?.soilData.soilFertility || 'medium'}
                        onChange={(e) => setFarmerData({
                          ...farmerData,
                          extendedData: {
                            ...farmerData.extendedData!,
                            soilData: {
                              ...farmerData.extendedData!.soilData,
                              soilFertility: e.target.value as any
                            }
                          }
                        })}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        pH Level (Optional - improves accuracy if provided)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="14"
                        value={farmerData.extendedData?.soilData.pH || ''}
                        onChange={(e) => setFarmerData({
                          ...farmerData,
                          extendedData: {
                            ...farmerData.extendedData!,
                            soilData: {
                              ...farmerData.extendedData!.soilData,
                              pH: parseFloat(e.target.value) || 0
                            }
                          }
                        })}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="6.5"
                      />
                    </div>
                  </div>
                </div>

                {/* Environmental & Vegetation */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Satellite className="w-5 h-5 text-cyan-600" />
                    🌦 Environmental & Vegetation
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        NDVI Score (0-1) (Optional - improves accuracy if provided)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="1"
                        value={farmerData.extendedData?.vegetationHealth.ndviScore || ''}
                        onChange={(e) => setFarmerData({
                          ...farmerData,
                          extendedData: {
                            ...farmerData.extendedData!,
                            vegetationHealth: {
                              ...farmerData.extendedData!.vegetationHealth,
                              ndviScore: parseFloat(e.target.value) || 0
                            }
                          }
                        })}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="0.75"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Updated (Optional - improves accuracy if provided)
                      </label>
                      <input
                        type="date"
                        value={farmerData.extendedData?.vegetationHealth.lastUpdated.split('T')[0] || ''}
                        onChange={(e) => setFarmerData({
                          ...farmerData,
                          extendedData: {
                            ...farmerData.extendedData!,
                            vegetationHealth: {
                              ...farmerData.extendedData!.vegetationHealth,
                              lastUpdated: e.target.value + 'T00:00:00.000Z'
                            }
                          }
                        })}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Crop Management */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-purple-600" />
                    🌽 Crop Management
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={farmerData.extendedData?.cropManagement.practicesCropRotation || false}
                          onChange={(e) => setFarmerData({
                            ...farmerData,
                            extendedData: {
                              ...farmerData.extendedData!,
                              cropManagement: {
                                ...farmerData.extendedData!.cropManagement,
                                practicesCropRotation: e.target.checked
                              }
                            }
                          })}
                          className="rounded border-gray-300 text-green-600 mr-2"
                        />
                        Practice Crop Rotation (Optional - improves accuracy if provided)
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Previous Crops (Optional - improves accuracy if provided)
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {Object.entries(farmerData.extendedData?.cropManagement.previousCrops || {}).map(([crop, checked]) => (
                          <label key={crop} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) => setFarmerData({
                                ...farmerData,
                                extendedData: {
                                  ...farmerData.extendedData!,
                                  cropManagement: {
                                    ...farmerData.extendedData!.cropManagement,
                                    previousCrops: {
                                      ...farmerData.extendedData!.cropManagement.previousCrops,
                                      [crop]: e.target.checked
                                    }
                                  }
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

                {/* Input Access */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                    🌿 Input Access
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={farmerData.extendedData?.inputAccess.qualitySeeds || false}
                        onChange={(e) => setFarmerData({
                          ...farmerData,
                          extendedData: {
                            ...farmerData.extendedData!,
                            inputAccess: {
                              ...farmerData.extendedData!.inputAccess,
                              qualitySeeds: e.target.checked
                            }
                          }
                        })}
                        className="rounded border-gray-300 text-green-600 mr-2"
                      />
                      Access to Quality Seeds (Optional - improves accuracy if provided)
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={farmerData.extendedData?.inputAccess.fertilizer || false}
                        onChange={(e) => setFarmerData({
                          ...farmerData,
                          extendedData: {
                            ...farmerData.extendedData!,
                            inputAccess: {
                              ...farmerData.extendedData!.inputAccess,
                              fertilizer: e.target.checked
                            }
                          }
                        })}
                        className="rounded border-gray-300 text-green-600 mr-2"
                      />
                      Access to Fertilizer (Optional - improves accuracy if provided)
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={farmerData.extendedData?.inputAccess.tools || false}
                        onChange={(e) => setFarmerData({
                          ...farmerData,
                          extendedData: {
                            ...farmerData.extendedData!,
                            inputAccess: {
                              ...farmerData.extendedData!.inputAccess,
                              tools: e.target.checked
                            }
                          }
                        })}
                        className="rounded border-gray-300 text-green-600 mr-2"
                      />
                      Access to Tools/Equipment (Optional - improves accuracy if provided)
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={farmerData.extendedData?.inputAccess.subsidies || false}
                        onChange={(e) => setFarmerData({
                          ...farmerData,
                          extendedData: {
                            ...farmerData.extendedData!,
                            inputAccess: {
                              ...farmerData.extendedData!.inputAccess,
                              subsidies: e.target.checked
                            }
                          }
                        })}
                        className="rounded border-gray-300 text-green-600 mr-2"
                      />
                      Access to Subsidies (Optional - improves accuracy if provided)
                    </label>
                  </div>
                </div>

                {/* Infrastructure */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-gray-600" />
                    🚜 Infrastructure
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={farmerData.extendedData?.infrastructure.roadAccess || false}
                        onChange={(e) => setFarmerData({
                          ...farmerData,
                          extendedData: {
                            ...farmerData.extendedData!,
                            infrastructure: {
                              ...farmerData.extendedData!.infrastructure,
                              roadAccess: e.target.checked
                            }
                          }
                        })}
                        className="rounded border-gray-300 text-green-600 mr-2"
                      />
                      Road Access (Optional - improves accuracy if provided)
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={farmerData.irrigationAccess || false}
                        onChange={(e) => setFarmerData({...farmerData, irrigationAccess: e.target.checked})}
                        className="rounded border-gray-300 text-green-600 mr-2"
                      />
                      Irrigation System (Optional - improves accuracy if provided)
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={farmerData.extendedData?.infrastructure.storageFacilities || false}
                        onChange={(e) => setFarmerData({
                          ...farmerData,
                          extendedData: {
                            ...farmerData.extendedData!,
                            infrastructure: {
                              ...farmerData.extendedData!.infrastructure,
                              storageFacilities: e.target.checked
                            }
                          }
                        })}
                        className="rounded border-gray-300 text-green-600 mr-2"
                      />
                      Storage Facilities (Optional - improves accuracy if provided)
                    </label>
                  </div>
                </div>

                {/* Cooperative Membership */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-teal-600" />
                    🤝 Cooperative Membership
                  </h3>
                  
                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={farmerData.extendedData?.socialFinancial.cooperativeMember || false}
                        onChange={(e) => setFarmerData({
                          ...farmerData,
                          extendedData: {
                            ...farmerData.extendedData!,
                            socialFinancial: {
                              ...farmerData.extendedData!.socialFinancial,
                              cooperativeMember: e.target.checked
                            }
                          }
                        })}
                        className="rounded border-gray-300 text-green-600 mr-2"
                      />
                      Member of Farmer Organization (Optional - improves accuracy if provided)
                    </label>

                    {farmerData.extendedData?.socialFinancial.cooperativeMember && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Organization Name (Optional - improves accuracy if provided)
                        </label>
                        <input
                          type="text"
                          value={farmerData.extendedData?.socialFinancial.cooperativeName || ''}
                          onChange={(e) => setFarmerData({
                            ...farmerData,
                            extendedData: {
                              ...farmerData.extendedData!,
                              socialFinancial: {
                                ...farmerData.extendedData!.socialFinancial,
                                cooperativeName: e.target.value
                              }
                            }
                          })}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Enter organization name"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Backup & Financial Resilience */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-red-600" />
                    💰 Backup & Financial Resilience
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={farmerData.extendedData?.socialFinancial.offFarmIncome || false}
                        onChange={(e) => setFarmerData({
                          ...farmerData,
                          extendedData: {
                            ...farmerData.extendedData!,
                            socialFinancial: {
                              ...farmerData.extendedData!.socialFinancial,
                              offFarmIncome: e.target.checked
                            }
                          }
                        })}
                        className="rounded border-gray-300 text-green-600 mr-2"
                      />
                      Off-farm Income (Optional - improves accuracy if provided)
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={farmerData.extendedData?.socialFinancial.hasSavings || false}
                        onChange={(e) => setFarmerData({
                          ...farmerData,
                          extendedData: {
                            ...farmerData.extendedData!,
                            socialFinancial: {
                              ...farmerData.extendedData!.socialFinancial,
                              hasSavings: e.target.checked
                            }
                          }
                        })}
                        className="rounded border-gray-300 text-green-600 mr-2"
                      />
                      Has Savings (Optional - improves accuracy if provided)
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={farmerData.extendedData?.socialFinancial.familySupport || false}
                        onChange={(e) => setFarmerData({
                          ...farmerData,
                          extendedData: {
                            ...farmerData.extendedData!,
                            socialFinancial: {
                              ...farmerData.extendedData!.socialFinancial,
                              familySupport: e.target.checked
                            }
                          }
                        })}
                        className="rounded border-gray-300 text-green-600 mr-2"
                      />
                      Family Support Network (Optional - improves accuracy if provided)
                    </label>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleDataSubmit}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
                  >
                    <Save className="w-5 h-5" />
                    Submit Farm & Risk Profile to Central System
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'data' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-800">FarmSense Soil Data Entry</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Basic Soil Parameters</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">pH Level *</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="14"
                        required
                        value={soilData.soilData?.pH || ''}
                        onChange={(e) => setSoilData({
                          ...soilData,
                          soilData: {
                            ...soilData.soilData!,
                            pH: parseFloat(e.target.value)
                          }
                        })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="6.5"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nitrogen (N) % *</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        value={soilData.soilData?.nitrogen || ''}
                        onChange={(e) => setSoilData({
                          ...soilData,
                          soilData: {
                            ...soilData.soilData!,
                            nitrogen: parseFloat(e.target.value)
                          }
                        })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="0.15"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phosphorus (P) ppm *</label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={soilData.soilData?.phosphorus || ''}
                        onChange={(e) => setSoilData({
                          ...soilData,
                          soilData: {
                            ...soilData.soilData!,
                            phosphorus: parseFloat(e.target.value)
                          }
                        })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="25"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Potassium (K) ppm *</label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={soilData.soilData?.potassium || ''}
                        onChange={(e) => setSoilData({
                          ...soilData,
                          soilData: {
                            ...soilData.soilData!,
                            potassium: parseFloat(e.target.value)
                          }
                        })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="150"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Soil Properties</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Soil Fertility Score (0-100) *</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        required
                        value={soilData.soilData?.soilFertilityScore || ''}
                        onChange={(e) => setSoilData({
                          ...soilData,
                          soilData: {
                            ...soilData.soilData!,
                            soilFertilityScore: parseFloat(e.target.value)
                          }
                        })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="75"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Soil Texture</label>
                      <select
                        value={soilData.soilData?.soilTexture || 'loamy'}
                        onChange={(e) => setSoilData({
                          ...soilData,
                          soilData: {
                            ...soilData.soilData!,
                            soilTexture: e.target.value as any
                          }
                        })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="clay">Clay</option>
                        <option value="sandy">Sandy</option>
                        <option value="loamy">Loamy</option>
                        <option value="silt">Silt</option>
                        <option value="peat">Peat</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Moisture Content %</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={soilData.soilData?.moisture || ''}
                        onChange={(e) => setSoilData({
                          ...soilData,
                          soilData: {
                            ...soilData.soilData!,
                            moisture: parseFloat(e.target.value)
                          }
                        })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="25"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Organic Matter %</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={soilData.soilData?.organicMatter || ''}
                        onChange={(e) => setSoilData({
                          ...soilData,
                          soilData: {
                            ...soilData.soilData!,
                            organicMatter: parseFloat(e.target.value)
                          }
                        })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="3.5"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSoilDataSubmit}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save className="w-5 h-5" />
                    Submit Soil Data to Central System
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'results' && (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2" />
                    <div>
                      <h3 className="font-medium text-green-800">Your Results from Central System</h3>
                      <p className="text-sm text-green-700 mt-1">
                        These results are calculated and provided by the AgroRisk Ghana Central System.
                        You cannot modify these values.
                      </p>
                    </div>
                  </div>
                </div>

                {farmerProfile && farmerProfile.riskAssessment ? (
                  <div className="space-y-6">
                    {/* Risk Score Display */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-lg">
                        <div className="flex items-center">
                          <TrendingUp className="h-6 w-6 mr-2" />
                          <div>
                            <p className="text-sm opacity-90">Risk Score</p>
                            <p className="text-xl font-bold">{farmerProfile.riskAssessment.score}/100</p>
                            <p className="text-xs opacity-75">{farmerProfile.riskAssessment.riskLevel} Risk</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white p-4 rounded-lg">
                        <div className="flex items-center">
                          <Eye className="h-6 w-6 mr-2" />
                          <div>
                            <p className="text-sm opacity-90">Default Risk</p>
                            <p className="text-xl font-bold">{farmerProfile.riskAssessment.defaultProbability.toFixed(1)}%</p>
                            <p className="text-xs opacity-75">Probability</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-4 rounded-lg">
                        <div className="flex items-center">
                          <TrendingUp className="h-6 w-6 mr-2" />
                          <div>
                            <p className="text-sm opacity-90">Profit Capacity</p>
                            <p className="text-xl font-bold">GH₵{farmerProfile.riskAssessment.profitCapacity.toLocaleString()}</p>
                            <p className="text-xs opacity-75">Annual</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-4 rounded-lg">
                        <div className="flex items-center">
                          <CheckCircle className="h-6 w-6 mr-2" />
                          <div>
                            <p className="text-sm opacity-90">Loan Eligible</p>
                            <p className="text-xl font-bold">GH₵{farmerProfile.riskAssessment.safeLoanAmount.toLocaleString()}</p>
                            <p className="text-xs opacity-75">Maximum Amount</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="bg-white border rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">System Recommendations</h3>
                      <div className="space-y-3">
                        {farmerProfile.riskAssessment.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-start">
                            <span className="w-2 h-2 rounded-full bg-green-500 mt-2 mr-3 flex-shrink-0" />
                            <p className="text-gray-700">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Loan Eligibility */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-blue-800 mb-2">Loan Eligibility Status</h3>
                      <p className="text-blue-700 mb-4">
                        Based on your risk assessment, you are eligible for agricultural financing.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-blue-600">Recommended Loan Amount</p>
                          <p className="text-xl font-bold text-blue-800">
                            GH₵{farmerProfile.riskAssessment.safeLoanAmount.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-blue-600">Repayment Period</p>
                          <p className="text-xl font-bold text-blue-800">
                            {farmerProfile.riskAssessment.recommendedRepaymentPeriod} months
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Assessment Available</h3>
                    <p className="text-gray-600">
                      Your data has been submitted to the Central System. 
                      Please wait for the risk assessment to be completed by our staff.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerPortal;