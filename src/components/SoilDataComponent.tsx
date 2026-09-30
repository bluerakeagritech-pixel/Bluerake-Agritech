import React, { useState } from 'react';
import { Upload, FileText, Camera, CreditCard as Edit3, Save, AlertCircle, CheckCircle, MapPin, Sprout } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import type { FarmSenseSoilData } from '../types';

interface SoilDataComponentProps {
  farmerId: string;
  season: string;
  onSoilDataUpdate: (data: FarmSenseSoilData) => void;
}

const SoilDataComponent: React.FC<SoilDataComponentProps> = ({ farmerId, season, onSoilDataUpdate }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'manual'>('upload');
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'text/csv': ['.csv'],
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setSoilData(prev => ({
          ...prev,
          reportType: file.type.includes('pdf') ? 'pdf' : file.type.includes('csv') ? 'csv' : 'photo',
          reportUrl: URL.createObjectURL(file),
        }));
        toast.success('Soil data report uploaded successfully');
      }
    },
  });

  const handleSoilDataChange = (field: string, value: any) => {
    setSoilData(prev => ({
      ...prev,
      soilData: {
        ...prev.soilData!,
        [field]: value,
      },
    }));
  };

  const addCropSuitability = () => {
    setSoilData(prev => ({
      ...prev,
      cropSuitability: [
        ...prev.cropSuitability!,
        { crop: '', suitabilityScore: 0 },
      ],
    }));
  };

  const addFertilizerRecommendation = () => {
    setSoilData(prev => ({
      ...prev,
      fertilizerRecommendation: [
        ...prev.fertilizerRecommendation!,
        { type: '', quantity: 0, applicationTiming: '', cost: 0 },
      ],
    }));
  };

  const saveSoilData = () => {
    if (!soilData.soilData?.pH || !soilData.soilData?.nitrogen) {
      toast.error('Please fill in all required soil data fields');
      return;
    }

    const completeSoilData: FarmSenseSoilData = {
      id: `soil_${farmerId}_${season}_${Date.now()}`,
      farmerId,
      reportDate: soilData.reportDate!,
      reportType: soilData.reportType!,
      reportUrl: soilData.reportUrl,
      soilData: soilData.soilData!,
      cropSuitability: soilData.cropSuitability!,
      fertilizerRecommendation: soilData.fertilizerRecommendation!,
      created_at: new Date().toISOString(),
    };

    onSoilDataUpdate(completeSoilData);
    toast.success(`Soil data saved for farmer ${farmerId} - ${season} season`);
  };

  const getSoilHealthStatus = () => {
    const { pH, soilFertilityScore } = soilData.soilData || {};
    if (!pH || !soilFertilityScore) return { status: 'unknown', color: 'gray' };
    
    if (pH >= 6.0 && pH <= 7.5 && soilFertilityScore >= 70) {
      return { status: 'excellent', color: 'green' };
    } else if (pH >= 5.5 && pH <= 8.0 && soilFertilityScore >= 50) {
      return { status: 'good', color: 'yellow' };
    } else {
      return { status: 'needs improvement', color: 'red' };
    }
  };

  const soilHealth = getSoilHealthStatus();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
          <MapPin className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Soil Data Component</h2>
          <p className="text-gray-600">User-bound soil data for Farmer {farmerId} - {season} season</p>
        </div>
      </div>

      {/* User Context Display */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-blue-600" />
          <span className="text-blue-800 font-medium">
            ✔ User Context: Farmer {farmerId} | Season: {season} | All data will be stored under this user record
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('upload')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'upload'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Upload Soil Report
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'manual'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Manual Data Entry
          </button>
        </nav>
      </div>

      {activeTab === 'upload' && (
        <div className="space-y-6">
          {/* File Upload */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-400'
            }`}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <div className="flex justify-center space-x-4">
                <FileText className="w-8 h-8 text-gray-400" />
                <Upload className="w-8 h-8 text-gray-400" />
                <Camera className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-700">
                  {isDragActive ? 'Drop your soil report here' : 'Upload Soil Analysis Report'}
                </p>
                <p className="text-sm text-gray-500">
                  Supports PDF reports, CSV data, or photos of soil analysis
                </p>
              </div>
            </div>
          </div>

          {soilData.reportUrl && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-800 font-medium">Report uploaded successfully</span>
              </div>
              <p className="text-green-700 text-sm mt-1">
                Type: {soilData.reportType?.toUpperCase()} • 
                Date: {soilData.reportDate} • 
                User: {farmerId}
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'manual' && (
        <div className="space-y-6">
          {/* Soil Health Status */}
          <div className={`bg-${soilHealth.color}-50 border border-${soilHealth.color}-200 rounded-lg p-4`}>
            <div className="flex items-center gap-2">
              <AlertCircle className={`w-5 h-5 text-${soilHealth.color}-600`} />
              <span className={`text-${soilHealth.color}-800 font-medium capitalize`}>
                User Soil Health Status: {soilHealth.status}
              </span>
            </div>
          </div>

          {/* Physical Soil Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Physical Soil Data</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Soil Type</label>
                <select
                  value={soilData.soilData?.soilTexture || 'loamy'}
                  onChange={(e) => handleSoilDataChange('soilTexture', e.target.value)}
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
                  onChange={(e) => handleSoilDataChange('moisture', parseFloat(e.target.value))}
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
                  onChange={(e) => handleSoilDataChange('organicMatter', parseFloat(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="3.5"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Chemical Soil Data</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">pH Level *</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="14"
                  required
                  value={soilData.soilData?.pH || ''}
                  onChange={(e) => handleSoilDataChange('pH', parseFloat(e.target.value))}
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
                  onChange={(e) => handleSoilDataChange('nitrogen', parseFloat(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0.15"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phosphorus (P) ppm</label>
                <input
                  type="number"
                  min="0"
                  value={soilData.soilData?.phosphorus || ''}
                  onChange={(e) => handleSoilDataChange('phosphorus', parseFloat(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="25"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Potassium (K) ppm</label>
                <input
                  type="number"
                  min="0"
                  value={soilData.soilData?.potassium || ''}
                  onChange={(e) => handleSoilDataChange('potassium', parseFloat(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="150"
                />
              </div>
            </div>
          </div>

          {/* Soil Productivity Indicators */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Soil Productivity Indicators</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Soil Fertility Score (0-100)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={soilData.soilData?.soilFertilityScore || ''}
                onChange={(e) => handleSoilDataChange('soilFertilityScore', parseFloat(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="75"
              />
            </div>
          </div>

          {/* Crop Suitability */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Crop Suitability for User {farmerId}</h3>
              <button
                onClick={addCropSuitability}
                className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
              >
                Add Crop
              </button>
            </div>
            
            {soilData.cropSuitability?.map((crop, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <input
                  type="text"
                  placeholder="Crop name"
                  value={crop.crop}
                  onChange={(e) => {
                    const updated = [...soilData.cropSuitability!];
                    updated[index].crop = e.target.value;
                    setSoilData(prev => ({ ...prev, cropSuitability: updated }));
                  }}
                  className="p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="number"
                  placeholder="Suitability score (0-100)"
                  min="0"
                  max="100"
                  value={crop.suitabilityScore}
                  onChange={(e) => {
                    const updated = [...soilData.cropSuitability!];
                    updated[index].suitabilityScore = parseFloat(e.target.value);
                    setSoilData(prev => ({ ...prev, cropSuitability: updated }));
                  }}
                  className="p-2 border border-gray-300 rounded-md"
                />
              </div>
            ))}
          </div>

          {/* Fertilizer Recommendations */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Fertilizer Recommendations for User {farmerId}</h3>
              <button
                onClick={addFertilizerRecommendation}
                className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
              >
                Add Fertilizer
              </button>
            </div>
            
            {soilData.fertilizerRecommendation?.map((fertilizer, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <input
                  type="text"
                  placeholder="Fertilizer type"
                  value={fertilizer.type}
                  onChange={(e) => {
                    const updated = [...soilData.fertilizerRecommendation!];
                    updated[index].type = e.target.value;
                    setSoilData(prev => ({ ...prev, fertilizerRecommendation: updated }));
                  }}
                  className="p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="number"
                  placeholder="Quantity (kg/ha)"
                  min="0"
                  value={fertilizer.quantity}
                  onChange={(e) => {
                    const updated = [...soilData.fertilizerRecommendation!];
                    updated[index].quantity = parseFloat(e.target.value);
                    setSoilData(prev => ({ ...prev, fertilizerRecommendation: updated }));
                  }}
                  className="p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  placeholder="Application timing"
                  value={fertilizer.applicationTiming}
                  onChange={(e) => {
                    const updated = [...soilData.fertilizerRecommendation!];
                    updated[index].applicationTiming = e.target.value;
                    setSoilData(prev => ({ ...prev, fertilizerRecommendation: updated }));
                  }}
                  className="p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="number"
                  placeholder="Cost (GH₵)"
                  min="0"
                  value={fertilizer.cost}
                  onChange={(e) => {
                    const updated = [...soilData.fertilizerRecommendation!];
                    updated[index].cost = parseFloat(e.target.value);
                    setSoilData(prev => ({ ...prev, fertilizerRecommendation: updated }));
                  }}
                  className="p-2 border border-gray-300 rounded-md"
                />
              </div>
            ))}
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={saveSoilData}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save className="w-5 h-5" />
              Save User-Bound Soil Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SoilDataComponent;