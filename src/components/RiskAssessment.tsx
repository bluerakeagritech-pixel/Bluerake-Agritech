import React, { useState, useEffect } from 'react';
import { Calculator, Droplets, Car as Farm, History, MapPin, User, Wallet, Cloud, CloudRain, Sun, AlertTriangle, Sprout, ThermometerSun, Wind, Home, Users, Package, Loader as Road, Building, PiggyBank, Satellite, BarChart3, TrendingUp, Shield, Search, CheckCircle, Info, Target, Eye } from 'lucide-react';
import { centralIntelligence } from '../services/centralIntelligence';
import { riskAssessmentEngine } from '../services/riskAssessmentEngine';
import type { FarmData, RiskScore, Farmer } from '../types';
import { predictRisk, calculateRuleBasedRisk } from '../services/riskScoring';

const REGIONS = [
  'Greater Accra',
  'Ashanti',
  'Central',
  'Eastern',
  'Northern',
  'Western',
  'Volta',
  'Brong-Ahafo',
  'Upper East',
  'Upper West'
];

const CROPS = [
  'Cocoa',
  'Maize',
  'Rice',
  'Cassava',
  'Yam',
  'Plantain',
  'Groundnuts',
  'Oil Palm'
];

const SOIL_TYPES = [
  'clay',
  'sandy',
  'loamy',
  'silt',
  'peat'
];

const WEATHER_DATA = {
  'Greater Accra': { drought: 'high', flood: 'low', avgRainfall: 810, temperature: 28 },
  'Ashanti': { drought: 'low', flood: 'medium', avgRainfall: 1400, temperature: 26 },
  'Central': { drought: 'medium', flood: 'medium', avgRainfall: 1200, temperature: 27 },
  'Eastern': { drought: 'low', flood: 'medium', avgRainfall: 1500, temperature: 25 },
  'Northern': { drought: 'high', flood: 'high', avgRainfall: 1000, temperature: 29 },
  'Western': { drought: 'low', flood: 'high', avgRainfall: 1800, temperature: 26 },
  'Volta': { drought: 'medium', flood: 'high', avgRainfall: 1300, temperature: 27 },
  'Brong-Ahafo': { drought: 'low', flood: 'medium', avgRainfall: 1350, temperature: 26 },
  'Upper East': { drought: 'high', flood: 'medium', avgRainfall: 950, temperature: 30 },
  'Upper West': { drought: 'high', flood: 'medium', avgRainfall: 900, temperature: 30 }
};

// Enhanced risk categories with detailed scoring
const RISK_CATEGORIES = [
  { name: "Crop Pests & Diseases", baseScore: 5.0, icon: Sprout, color: "red" },
  { name: "Post-Harvest Losses", baseScore: 4.75, icon: Package, color: "orange" },
  { name: "Price Fluctuations", baseScore: 4.35, icon: TrendingUp, color: "yellow" },
  { name: "Livestock Diseases", baseScore: 4.1, icon: Farm, color: "amber" },
  { name: "Drought", baseScore: 3.5, icon: Sun, color: "orange" },
  { name: "Counterfeit Inputs", baseScore: 3.4, icon: Shield, color: "red" },
  { name: "Flood Risk", baseScore: 3.2, icon: CloudRain, color: "blue" },
  { name: "Market Access", baseScore: 2.8, icon: Road, color: "gray" }
];

export default function RiskAssessment() {
  const [selectedRisk, setSelectedRisk] = useState("Crop Pests & Diseases");
  const [selectedFarmerId, setSelectedFarmerId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [riskParameters, setRiskParameters] = useState<Partial<RawFarmParameters>>({
    farmerId: '',
    experience: 0,
    age: 0,
    vslaMembership: false,
    fboMembership: 'none',
    accessToInsurance: false,
    farmSize: 0,
    cropType: '',
    tenureType: 'owner',
    mechanizationAccess: false,
    laborSource: 'family',
    gpsCoordinates: { latitude: 0, longitude: 0 },
    agroEcologicalZone: '',
    rainfallPattern: 'bimodal',
    temperatureTrend: 'stable',
    soilType: 'loamy',
    soilDepth: 'medium',
    ndviTrend: 0,
    vhiDroughtStatus: 'normal',
    distanceToPavedRoad: 0,
    roadQuality: 'good',
    distanceToMarket: 0,
    storageType: 'none',
    inputSource: 'cash_purchase',
    fertilizerTimingReliability: true,
    pestControlCapacity: 'medium'
  });
  
  const [assessmentResult, setAssessmentResult] = useState<RiskAssessmentResult | null>(null);
  const [riskScore, setRiskScore] = useState<RiskScore | null>(null);
  const [weatherRisk, setWeatherRisk] = useState<{
    droughtRisk: string;
    floodRisk: string;
    avgRainfall: number;
    temperature: number;
  } | null>(null);
  const [detailedRisks, setDetailedRisks] = useState<any[]>([]);
  const [assessmentBlocked, setAssessmentBlocked] = useState(true);
  const [formData, setFormData] = useState({
    farmerName: '',
    farmSize: 0,
    cropType: '',
    farmingExperience: 0,
    previousLoans: 0,
    hasIrrigation: false,
    location: '',
    soilType: 'loamy',
    soilFertility: 'medium',
    landTenure: 'owned',
    cropRotation: false,
    previousCrops: [],
    inputAccess: {
      seeds: false,
      fertilizer: false,
      tools: false,
      subsidyAccess: false
    },
    infrastructure: {
      roadAccess: false,
      irrigation: false,
      storage: false
    },
    cooperativeMembership: {
      isMember: false,
      organizationName: ''
    },
    backupResources: {
      hasOffFarmIncome: false,
      hasSavings: false,
      familySupport: false
    },
    satelliteData: {
      ndviScore: 0,
      lastUpdated: new Date().toISOString()
    }
  });
  const [activeTab, setActiveTab] = useState<'parameters' | 'results' | 'form' | 'overview' | 'details'>('parameters');
  const [loading, setLoading] = useState(false);

  // Get all farmers for selection
  const allFarmers = centralIntelligence.getAllFarmers();
  const filteredFarmers = allFarmers.filter(profile =>
    profile.farmer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.farmer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.farmer.location.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Auto-populate form when farmer is selected (USER-BOUND DATA LOADING)
  useEffect(() => {
    if (selectedFarmerId) {
      const farmerProfile = centralIntelligence.getFarmerProfile(selectedFarmerId);
      if (farmerProfile) {
        const farmer = farmerProfile.farmer;
        const extendedData = farmer.extendedData;
        
        // Auto-populate ALL available data from user context
        setFormData({
          farmerName: farmer.fullName || '',
          farmSize: farmer.farmSize || 0,
          cropType: 'Maize', // From current season data
          farmingExperience: farmer.farmingExperience || 0,
          previousLoans: 0, // From financial history
          hasIrrigation: farmer.irrigationAccess || false,
          location: farmer.location.region || '',
          soilType: extendedData?.soilData.soilType || farmerProfile.soilData?.soilData.soilTexture || 'loamy',
          soilFertility: extendedData?.soilData.soilFertility || 
            (farmerProfile.soilData ? 
              (farmerProfile.soilData.soilData.soilFertilityScore > 70 ? 'high' : 
               farmerProfile.soilData.soilData.soilFertilityScore > 40 ? 'medium' : 'low') : 'medium'),
          landTenure: extendedData?.landTenure || 'owned',
          cropRotation: extendedData?.cropManagement.practicesCropRotation || false,
          previousCrops: extendedData?.cropManagement.previousCrops || [],
          inputAccess: {
            seeds: extendedData?.inputAccess.qualitySeeds || true,
            fertilizer: extendedData?.inputAccess.fertilizer || true,
            tools: extendedData?.inputAccess.tools || farmer.mechanisationAccess || false,
            subsidyAccess: extendedData?.inputAccess.subsidies || false
          },
          infrastructure: {
            roadAccess: extendedData?.infrastructure.roadAccess || true,
            irrigation: farmer.irrigationAccess || false,
            storage: extendedData?.infrastructure.storageFacilities || false
          },
          cooperativeMembership: {
            isMember: extendedData?.socialFinancial.cooperativeMember || false,
            organizationName: extendedData?.socialFinancial.cooperativeName || ''
          },
          backupResources: {
            hasOffFarmIncome: extendedData?.socialFinancial.offFarmIncome || false,
            hasSavings: extendedData?.socialFinancial.hasSavings || false,
            familySupport: extendedData?.socialFinancial.familySupport || true
          },
          satelliteData: {
            ndviScore: extendedData?.vegetationHealth.ndviScore || 
              (farmerProfile.ndviHistory.length > 0 ? 
                farmerProfile.ndviHistory[farmerProfile.ndviHistory.length - 1].value : 0.6),
            lastUpdated: extendedData?.vegetationHealth.lastUpdated || 
              (farmerProfile.ndviHistory.length > 0 ? 
                farmerProfile.ndviHistory[farmerProfile.ndviHistory.length - 1].date : new Date().toISOString())
          }
        });

        setAssessmentBlocked(false);
      }
    } else {
      // Reset form when no farmer selected
      setFormData({
        farmerName: '',
        farmSize: 0,
        cropType: '',
        farmingExperience: 0,
        previousLoans: 0,
        hasIrrigation: false,
        location: '',
        soilType: 'loamy',
        soilFertility: 'medium',
        landTenure: 'owned',
        cropRotation: false,
        previousCrops: [],
        inputAccess: {
          seeds: false,
          fertilizer: false,
          tools: false,
          subsidyAccess: false
        },
        infrastructure: {
          roadAccess: false,
          irrigation: false,
          storage: false
        },
        cooperativeMembership: {
          isMember: false,
          organizationName: ''
        },
        backupResources: {
          hasOffFarmIncome: false,
          hasSavings: false,
          familySupport: false
        },
        satelliteData: {
          ndviScore: 0,
          lastUpdated: new Date().toISOString()
        }
      });
      setAssessmentBlocked(true);
    }
  }, [selectedFarmerId]);

  const calculateDetailedRisks = (farmData: FarmData, baseRiskScore: RiskScore) => {
    return RISK_CATEGORIES.map(category => {
      let adjustedScore = category.baseScore;
      
      // Adjust scores based on farm data
      switch (category.name) {
        case "Crop Pests & Diseases":
          if (farmData.cropRotation) adjustedScore -= 0.5;
          if (farmData.inputAccess.fertilizer) adjustedScore -= 0.3;
          break;
        case "Post-Harvest Losses":
          if (farmData.infrastructure.storage) adjustedScore -= 1.0;
          if (farmData.infrastructure.roadAccess) adjustedScore -= 0.5;
          break;
        case "Price Fluctuations":
          if (farmData.cooperativeMembership.isMember) adjustedScore -= 0.8;
          break;
        case "Drought":
          if (farmData.infrastructure.irrigation) adjustedScore -= 1.5;
          if (weatherRisk?.droughtRisk === 'high') adjustedScore += 0.5;
          break;
        case "Flood Risk":
          if (weatherRisk?.floodRisk === 'high') adjustedScore += 0.8;
          break;
        case "Market Access":
          if (farmData.infrastructure.roadAccess) adjustedScore -= 1.0;
          if (farmData.cooperativeMembership.isMember) adjustedScore -= 0.5;
          break;
      }
      
      return {
        ...category,
        score: Math.max(0, Math.min(5, adjustedScore))
      };
    });
  };

  const getInterventionStrategy = (riskName: string) => {
    const strategies = {
      "Crop Pests & Diseases": "Enhance pest surveillance systems, increase access to affordable pesticides, and improve extension services.",
      "Post-Harvest Losses": "Invest in community storage, promote use of hermetic bags, and support aggregation centers.",
      "Price Fluctuations": "Implement warehouse receipt systems, promote contract farming, and expand market information systems.",
      "Livestock Diseases": "Expand access to veterinary services, support mass vaccination campaigns, and train local animal health workers.",
      "Drought": "Develop small-scale irrigation, promote drought-resistant crops, and improve climate forecast dissemination.",
      "Counterfeit Inputs": "Strengthen input quality control, digitize supply chains, and enforce penalties for fake agro-inputs.",
      "Flood Risk": "Implement drainage systems, promote flood-resistant crops, and develop early warning systems.",
      "Market Access": "Improve rural road infrastructure, establish collection centers, and strengthen farmer cooperatives."
    };
    return strategies[riskName as keyof typeof strategies] || "Consult with agricultural extension officers for specific guidance.";
  };

  const calculateRisk = async () => {
    if (!selectedFarmerId) {
      alert('Please select a farmer first');
      return;
    }
    // Run the upgraded risk assessment engine
    const result = riskAssessmentEngine.runRiskAssessment(riskParameters as RawFarmParameters);
    setAssessmentResult(result);
    setActiveTab('results');
  };

  // Get available farmers from central intelligence
  const farmers = centralIntelligence.getAllFarmers();

  const loadFarmerData = (farmerId: string) => {
    const farmerProfile = centralIntelligence.getFarmerProfile(farmerId);
    if (farmerProfile) {
      const farmer = farmerProfile.farmer;
      setRiskParameters({
        farmerId: farmer.id,
        experience: farmer.farmingExperience,
        age: farmer.age,
        vslaMembership: farmer.extendedData?.socialFinancial.cooperativeMember || false,
        fboMembership: farmer.extendedData?.socialFinancial.cooperativeMember ? 'active' : 'none',
        accessToInsurance: false, // Would come from extended data
        farmSize: farmer.farmSize,
        cropType: 'Maize', // Default - would be selected by farmer
        tenureType: farmer.extendedData?.landTenure || 'owner',
        mechanizationAccess: farmer.mechanisationAccess,
        laborSource: 'family', // Default
        gpsCoordinates: {
          latitude: farmer.location.latitude,
          longitude: farmer.location.longitude
        },
        agroEcologicalZone: farmer.location.agroEcologicalZone,
        rainfallPattern: 'bimodal', // Would be derived from location
        temperatureTrend: 'stable', // Would come from climate data
        soilType: farmer.extendedData?.soilData.soilType || 'loamy',
        soilDepth: 'medium', // Would come from soil data
        ndviTrend: farmer.extendedData?.vegetationHealth.ndviScore || 0.6,
        vhiDroughtStatus: 'normal', // Would come from satellite data
        distanceToPavedRoad: 5, // Default
        roadQuality: farmer.extendedData?.infrastructure.roadAccess ? 'good' : 'poor',
        distanceToMarket: 10, // Default
        storageType: 'none',
        inputSource: 'cash_purchase',
        fertilizerTimingReliability: true,
        pestControlCapacity: 'medium'
      });
    }
  };

  const runAssessment = async () => {
    try {
      setLoading(true);
      // Run the upgraded risk assessment engine
      const result = riskAssessmentEngine.runRiskAssessment(riskParameters as RawFarmParameters);
      setAssessmentResult(result);
      setActiveTab('results');
    } catch (error) {
      console.error('Risk assessment failed:', error);
      alert('Risk assessment failed. Please try again.');
      console.error('Error in risk calculation:', error);
      alert(`Error running assessment: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateRisk();
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'very_safe': return 'text-green-600 bg-green-100';
      case 'low': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      case 'critical': return 'text-red-800 bg-red-200';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDataStatus = (value: any, field: string) => {
    if (value === 0 || value === '' || value === false) {
      return { status: 'optional', label: 'Optional – improves accuracy if provided' };
    }
    return { status: 'filled', label: 'Auto-populated from user data' };
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Upgraded Risk Assessment Engine</h1>
        <p className="text-gray-600 mt-2">3-Layer Interaction System for Agricultural Risk Analysis</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('parameters')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'parameters'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Risk Parameters
          </button>
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Eye className="w-4 h-4" />
            Risk Overview
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'details'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Info className="w-4 h-4" />
            Risk Details
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'results'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Assessment Results
          </button>
        </nav>
      </div>

      {activeTab === 'parameters' && (
        <div className="space-y-6">
          {/* Farmer Selection */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Farmer for Assessment</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={selectedFarmerId}
                onChange={(e) => loadFarmerData(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select a farmer...</option>
                {farmers.map(profile => (
                  <option key={profile.farmer.id} value={profile.farmer.id}>
                    {profile.farmer.fullName} - {profile.farmer.location.region}
                  </option>
                ))}
              </select>
              <button
                onClick={runAssessment}
                disabled={loading || !selectedFarmerId}
                className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Running Assessment...
                  </>
                ) : (
                  <>
                    <Calculator className="w-5 h-5" />
                    Run Risk Assessment
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Risk Parameters Display */}
          {selectedFarmerId && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">🧠 Layer 1 — Raw Parameter Capture</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* A. Farmer Profile */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-700">A. Farmer Profile</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Experience:</strong> {riskParameters.experience} years</p>
                    <p><strong>Age:</strong> {riskParameters.age}</p>
                    <p><strong>VSLA Member:</strong> {riskParameters.vslaMembership ? 'Yes' : 'No'}</p>
                    <p><strong>FBO Status:</strong> {riskParameters.fboMembership}</p>
                    <p><strong>Insurance:</strong> {riskParameters.accessToInsurance ? 'Yes' : 'No'}</p>
                  </div>
                </div>

                {/* B. Farm Structural Data */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-700">B. Farm Structural Data</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Farm Size:</strong> {riskParameters.farmSize} ha</p>
                    <p><strong>Crop Type:</strong> {riskParameters.cropType}</p>
                    <p><strong>Tenure:</strong> {riskParameters.tenureType}</p>
                    <p><strong>Mechanization:</strong> {riskParameters.mechanizationAccess ? 'Yes' : 'No'}</p>
                    <p><strong>Labor Source:</strong> {riskParameters.laborSource}</p>
                  </div>
                </div>

                {/* C. Location & Environment */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-700">C. Location & Environment</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Zone:</strong> {riskParameters.agroEcologicalZone}</p>
                    <p><strong>Rainfall:</strong> {riskParameters.rainfallPattern}</p>
                    <p><strong>Soil Type:</strong> {riskParameters.soilType}</p>
                    <p><strong>NDVI:</strong> {riskParameters.ndviTrend?.toFixed(2)}</p>
                    <p><strong>Drought Status:</strong> {riskParameters.vhiDroughtStatus}</p>
                  </div>
                </div>

                {/* D. Infrastructure */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-700">D. Infrastructure</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Road Distance:</strong> {riskParameters.distanceToPavedRoad} km</p>
                    <p><strong>Road Quality:</strong> {riskParameters.roadQuality}</p>
                    <p><strong>Market Distance:</strong> {riskParameters.distanceToMarket} km</p>
                    <p><strong>Storage:</strong> {riskParameters.storageType}</p>
                  </div>
                </div>

                {/* E. Input System */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-700">E. Input System</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Input Source:</strong> {riskParameters.inputSource}</p>
                    <p><strong>Fertilizer Timing:</strong> {riskParameters.fertilizerTimingReliability ? 'Reliable' : 'Unreliable'}</p>
                    <p><strong>Pest Control:</strong> {riskParameters.pestControlCapacity}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {assessmentResult ? (
            <>
              {/* Risk Score Summary */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Target className="w-6 h-6 text-blue-600" />
                  Risk Assessment Overview
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Overall Risk Score */}
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-4 relative">
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          stroke="#e5e7eb"
                          strokeWidth="8"
                          fill="none"
                        />
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          stroke={assessmentResult.riskCategory === 'critical' || assessmentResult.riskCategory === 'high' ? '#ef4444' :
                                 assessmentResult.riskCategory === 'moderate' ? '#f59e0b' : '#10b981'}
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${(assessmentResult.finalRiskScore / 100) * 314} 314`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">{assessmentResult.finalRiskScore}</div>
                          <div className="text-sm text-gray-500">/ 100</div>
                        </div>
                      </div>
                    </div>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(assessmentResult.riskCategory)}`}>
                      {assessmentResult.riskCategory.replace('_', ' ').toUpperCase()} RISK
                    </div>
                  </div>

                  {/* Credit Recommendation */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-3">Credit Recommendation</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-blue-600">Max Loan Amount:</span>
                        <div className="text-lg font-bold text-blue-800">
                          GH₵{assessmentResult.creditRecommendation.maxLoanAmount.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-blue-600">Repayment Period:</span>
                        <div className="font-medium text-blue-800">
                          {assessmentResult.creditRecommendation.repaymentPeriod} months
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-blue-600">Interest Rate Adjustment:</span>
                        <div className="font-medium text-blue-800">
                          {assessmentResult.creditRecommendation.interestRateAdjustment > 0 ? '+' : ''}
                          {assessmentResult.creditRecommendation.interestRateAdjustment}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Kill Switch Status */}
                  <div className={`p-4 rounded-lg ${assessmentResult.killSwitchTriggered ? 'bg-red-50' : 'bg-green-50'}`}>
                    <h3 className={`font-semibold mb-3 ${assessmentResult.killSwitchTriggered ? 'text-red-800' : 'text-green-800'}`}>
                      Critical Risk Status
                    </h3>
                    {assessmentResult.killSwitchTriggered ? (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                          <span className="font-medium text-red-800">Kill Switch Triggered</span>
                        </div>
                        <p className="text-sm text-red-600">{assessmentResult.killSwitchReason}</p>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="font-medium text-green-800">No Critical Issues</span>
                        </div>
                        <p className="text-sm text-green-600">All critical risk factors are within acceptable limits</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Base Scores Breakdown */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Risk Dimension Scores</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(assessmentResult.baseScores).map(([dimension, score]) => (
                    <div key={dimension} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize font-medium">
                          {dimension.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span>{Math.round(score as number)}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-300 ${
                            (score as number) >= 70 ? 'bg-green-500' :
                            (score as number) >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Multipliers */}
              {assessmentResult.riskMultipliers.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Risk Interaction Effects</h3>
                  <div className="space-y-3">
                    {assessmentResult.riskMultipliers.map((multiplier: any, index: number) => (
                      <div key={index} className={`p-3 rounded-lg border ${
                        multiplier.impact > 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                      }`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-800">{multiplier.factor}</span>
                          <span className={`font-bold ${
                            multiplier.impact > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {multiplier.impact > 0 ? '+' : ''}{multiplier.impact}%
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{multiplier.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Risk Mitigation Recommendations</h3>
                <div className="space-y-3">
                  {assessmentResult.recommendations.map((recommendation: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-blue-800">{recommendation}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Risk Assessment Available</h3>
              <p className="text-gray-600">Complete the risk assessment form to view the overview.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'details' && (
        <div className="space-y-6">
          {assessmentResult ? (
            <>
              {/* Technical Details */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Info className="w-6 h-6 text-purple-600" />
                  Technical Risk Analysis Details
                </h2>

                {/* Assessment Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-2">Farmer ID</h4>
                    <p className="text-lg font-semibold">{assessmentResult.farmerId}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-2">Assessment Date</h4>
                    <p className="text-lg font-semibold">
                      {new Date(assessmentResult.generatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-2">Engine Version</h4>
                    <p className="text-lg font-semibold">3-Layer Interaction v2.0</p>
                  </div>
                </div>

                {/* Layer 1: Raw Parameters */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Layer 1: Raw Parameter Capture</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">Farmer Profile</h4>
                      <div className="text-sm space-y-1">
                        <p><strong>Experience:</strong> {formData.farmingExperience} years</p>
                        <p><strong>Farm Size:</strong> {formData.farmSize} ha</p>
                        <p><strong>Crop Type:</strong> {formData.cropType}</p>
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-2">Infrastructure</h4>
                      <div className="text-sm space-y-1">
                        <p><strong>Irrigation:</strong> {formData.hasIrrigation ? 'Yes' : 'No'}</p>
                        <p><strong>Road Access:</strong> {formData.infrastructure?.roadAccess ? 'Yes' : 'No'}</p>
                        <p><strong>Storage:</strong> {formData.infrastructure?.storage ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-medium text-purple-800 mb-2">Resilience Factors</h4>
                      <div className="text-sm space-y-1">
                        <p><strong>Cooperative:</strong> {formData.cooperativeMembership?.isMember ? 'Yes' : 'No'}</p>
                        <p><strong>Off-farm Income:</strong> {formData.backupResources?.hasOffFarmIncome ? 'Yes' : 'No'}</p>
                        <p><strong>Savings:</strong> {formData.backupResources?.hasSavings ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Layer 2: Base Scores */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Layer 2: Base Weighted Scores</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Dimension</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Weight</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Score</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Weighted Contribution</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-900">Agronomic & Environmental</td>
                          <td className="px-4 py-3 text-sm text-gray-600">40%</td>
                          <td className="px-4 py-3 text-sm font-medium">{Math.round(assessmentResult.baseScores.agronomicEnvironmental)}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {Math.round(assessmentResult.baseScores.agronomicEnvironmental * 0.4)}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-900">Socio-economic Resilience</td>
                          <td className="px-4 py-3 text-sm text-gray-600">30%</td>
                          <td className="px-4 py-3 text-sm font-medium">{Math.round(assessmentResult.baseScores.socioeconomicResilience)}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {Math.round(assessmentResult.baseScores.socioeconomicResilience * 0.3)}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-900">Operational & Infrastructure</td>
                          <td className="px-4 py-3 text-sm text-gray-600">20%</td>
                          <td className="px-4 py-3 text-sm font-medium">{Math.round(assessmentResult.baseScores.operationalInfrastructure)}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {Math.round(assessmentResult.baseScores.operationalInfrastructure * 0.2)}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-900">Real-time Satellite Status</td>
                          <td className="px-4 py-3 text-sm text-gray-600">10%</td>
                          <td className="px-4 py-3 text-sm font-medium">{Math.round(assessmentResult.baseScores.realtimeSatellite)}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {Math.round(assessmentResult.baseScores.realtimeSatellite * 0.1)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Layer 3: Interaction Effects */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Layer 3: Interaction Engine Effects</h3>
                  
                  {assessmentResult.killSwitchTriggered && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-red-800 mb-2">🚨 Kill Switch Activated</h4>
                      <p className="text-red-700">{assessmentResult.killSwitchReason}</p>
                      <p className="text-sm text-red-600 mt-2">
                        This condition overrides base scoring and forces high risk classification.
                      </p>
                    </div>
                  )}

                  {assessmentResult.riskMultipliers.length > 0 ? (
                    <div className="space-y-3">
                      {assessmentResult.riskMultipliers.map((multiplier: any, index: number) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-800">{multiplier.factor}</h4>
                            <span className={`px-2 py-1 rounded text-sm font-medium ${
                              multiplier.impact > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {multiplier.impact > 0 ? '+' : ''}{multiplier.impact}% Impact
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{multiplier.reason}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-green-800">No significant interaction effects detected. Base scoring applies.</p>
                    </div>
                  )}
                </div>

                {/* Interaction Flags */}
                {assessmentResult.interactionFlags.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">System Interaction Flags</h3>
                    <div className="space-y-2">
                      {assessmentResult.interactionFlags.map((flag: string, index: number) => (
                        <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <span className="text-yellow-800 font-medium">{flag}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Final Score Calculation */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Final Score Calculation</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Base Weighted Score:</strong> {Math.round(
                      assessmentResult.baseScores.agronomicEnvironmental * 0.4 +
                      assessmentResult.baseScores.socioeconomicResilience * 0.3 +
                      assessmentResult.baseScores.operationalInfrastructure * 0.2 +
                      assessmentResult.baseScores.realtimeSatellite * 0.1
                    )}</p>
                    {assessmentResult.killSwitchTriggered && (
                      <p><strong>Kill Switch Override:</strong> Score forced to {assessmentResult.finalRiskScore}</p>
                    )}
                    {assessmentResult.riskMultipliers.length > 0 && !assessmentResult.killSwitchTriggered && (
                      <p><strong>Interaction Adjustments:</strong> Applied {assessmentResult.riskMultipliers.length} multiplier(s)</p>
                    )}
                    <p className="text-lg font-bold text-gray-900 pt-2 border-t">
                      <strong>Final Risk Score:</strong> {assessmentResult.finalRiskScore}/100
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Info className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Technical Details Available</h3>
              <p className="text-gray-600">Complete the risk assessment form to view detailed analysis.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'results' && assessmentResult && (
        <div className="space-y-6">
          {/* Overall Risk Score */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Final Risk Assessment</h2>
              <div className="text-right">
                <div className="text-4xl font-bold text-gray-800">{assessmentResult.finalRiskScore}/100</div>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(assessmentResult.riskCategory)}`}>
                  {assessmentResult.riskCategory.toUpperCase()}
                </div>
              </div>
            </div>

            {/* Kill Switch Alert */}
            {assessmentResult.killSwitchTriggered && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span className="font-medium text-red-800">KILL SWITCH TRIGGERED</span>
                </div>
                <p className="text-red-700 mt-1">{assessmentResult.killSwitchReason}</p>
              </div>
            )}

            {/* Base Scores */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">⚙️ Layer 2 — Base Scores</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Agronomic (40%):</span>
                    <span className="font-medium">{assessmentResult.baseScores.agronomicEnvironmental.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Socioeconomic (30%):</span>
                    <span className="font-medium">{assessmentResult.baseScores.socioeconomicResilience.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Operational (20%):</span>
                    <span className="font-medium">{assessmentResult.baseScores.operationalInfrastructure.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Satellite (10%):</span>
                    <span className="font-medium">{assessmentResult.baseScores.realtimeSatellite.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interaction Effects */}
          {assessmentResult.riskMultipliers.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-orange-600" />
                🚨 Layer 3 — Interaction Effects
              </h3>
              <div className="space-y-4">
                {assessmentResult.riskMultipliers.map((multiplier, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${
                    multiplier.impact > 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className={`font-medium ${
                          multiplier.impact > 0 ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {multiplier.factor}
                        </h4>
                        <p className={`text-sm mt-1 ${
                          multiplier.impact > 0 ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {multiplier.reason}
                        </p>
                      </div>
                      <div className={`text-right font-bold ${
                        multiplier.impact > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {multiplier.impact > 0 ? '+' : ''}{multiplier.impact}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Credit Recommendation */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Credit Recommendation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800">Max Loan Amount</h4>
                <p className="text-2xl font-bold text-blue-600">
                  GH₵{assessmentResult.creditRecommendation.maxLoanAmount.toLocaleString()}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-800">Repayment Period</h4>
                <p className="text-2xl font-bold text-green-600">
                  {assessmentResult.creditRecommendation.repaymentPeriod} months
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-800">Interest Rate Adjustment</h4>
                <p className="text-2xl font-bold text-purple-600">
                  {assessmentResult.creditRecommendation.interestRateAdjustment > 0 ? '+' : ''}
                  {assessmentResult.creditRecommendation.interestRateAdjustment}%
                </p>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              Risk Mitigation Recommendations
            </h3>
            <div className="space-y-3">
              {assessmentResult.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700">{recommendation}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-green-800 mb-8 text-center">
          Risk Assessment Engine - User-Bound Intelligence
        </h1>

        {/* MANDATORY USER SELECTION (NON-NEGOTIABLE) */}
        <div className="bg-white rounded-lg shadow-xl mb-6 p-6">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">Step 1: Select Farmer/User (MANDATORY)</h2>
          </div>
          
          {assessmentBlocked && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="text-red-800 font-medium">⚠️ No assessment actions allowed until a user is selected</span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Farmer Name, ID, Location, or Crop..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={selectedFarmerId}
              onChange={(e) => setSelectedFarmerId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a farmer/user...</option>
              {filteredFarmers.map((profile) => (
                <option key={profile.farmer.id} value={profile.farmer.id}>
                  {profile.farmer.fullName} - {profile.farmer.id} - {profile.farmer.location.region}
                </option>
              ))}
            </select>

            {selectedFarmerId && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-800 font-medium">
                    ✔ User Context Loaded: {formData.farmerName} - All parameters auto-populated from user data
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-xl mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('form')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'form'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Risk Assessment Form
              </button>
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                disabled={!riskScore}
              >
                Risk Overview
              </button>
              <button
                onClick={() => setActiveTab('details')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'details'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                disabled={!riskScore}
              >
                Risk Details
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'form' && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {assessmentBlocked && (
                  <div className="text-center py-8">
                    <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Farmer/User First</h3>
                    <p className="text-gray-600">
                      Please select a farmer from the dropdown above to load their data context and begin the risk assessment.
                    </p>
                  </div>
                )}

                {!assessmentBlocked && (
                  <>
                    {/* FULL PARAMETER VISIBILITY - ALL FIELDS ALWAYS VISIBLE */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center gap-2">
                        <Info className="w-5 h-5 text-blue-600" />
                        <span className="text-blue-800 font-medium">
                          User-Bound Assessment: All parameters visible and optional. Assessment runs with available data.
                        </span>
                      </div>
                    </div>

                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700">
                          <User className="w-4 h-4 mr-2" />
                          Farmer Name
                        </label>
                        <input
                          type="text"
                          value={formData.farmerName}
                          readOnly
                          className="w-full p-2 border rounded-md bg-gray-50"
                        />
                        <p className="text-xs text-green-600">✓ Auto-populated from user data</p>
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700">
                          <Farm className="w-4 h-4 mr-2" />
                          Farm Size (Hectares)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={formData.farmSize}
                          onChange={(e) => setFormData({...formData, farmSize: Number(e.target.value)})}
                          className={`w-full p-2 border rounded-md ${
                            getDataStatus(formData.farmSize, 'farmSize').status === 'optional' ? 'border-yellow-300' : 'bg-gray-50'
                          }`}
                        />
                        <p className={`text-xs ${
                          getDataStatus(formData.farmSize, 'farmSize').status === 'optional' ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {getDataStatus(formData.farmSize, 'farmSize').status === 'optional' ? '⚠' : '✓'} {getDataStatus(formData.farmSize, 'farmSize').label}
                        </p>
                      </div>
                    </div>

                    {/* Farming Experience & Previous Loans */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700">
                          <History className="w-4 h-4 mr-2" />
                          Farming Experience (Years)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={formData.farmingExperience}
                          onChange={(e) => setFormData({...formData, farmingExperience: Number(e.target.value)})}
                          className={`w-full p-2 border rounded-md ${
                            getDataStatus(formData.farmingExperience, 'experience').status === 'optional' ? 'border-yellow-300' : 'bg-gray-50'
                          }`}
                        />
                        <p className={`text-xs ${
                          getDataStatus(formData.farmingExperience, 'experience').status === 'optional' ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {getDataStatus(formData.farmingExperience, 'experience').status === 'optional' ? '⚠' : '✓'} {getDataStatus(formData.farmingExperience, 'experience').label}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700">
                          <Wallet className="w-4 h-4 mr-2" />
                          Previous Loans
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={formData.previousLoans}
                          onChange={(e) => setFormData({...formData, previousLoans: Number(e.target.value)})}
                          className="w-full p-2 border rounded-md border-yellow-300"
                        />
                        <p className="text-xs text-yellow-600">⚠ Optional – improves accuracy if provided</p>
                      </div>
                    </div>

                    {/* Location and Weather Risk */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                        <Cloud className="w-5 h-5" />
                        Location & Weather Risk
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm text-gray-600">Region</label>
                          <select
                            className="w-full p-2 border rounded-md bg-gray-50"
                            value={formData.location}
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                          >
                            <option value="">{formData.location || 'Select region'}</option>
                            {REGIONS.map(region => (
                              <option key={region} value={region}>{region}</option>
                            ))}
                          </select>
                          <p className="text-xs text-green-600">✓ Auto-populated from user data</p>
                        </div>

                        {formData.location && WEATHER_DATA[formData.location as keyof typeof WEATHER_DATA] && (
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-medium text-blue-800 mb-2">Regional Weather Data</h4>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="flex items-center">
                                  <Sun className="w-4 h-4 mr-2 text-yellow-500" />
                                  Temperature
                                </span>
                                <span>{WEATHER_DATA[formData.location as keyof typeof WEATHER_DATA].temperature}°C</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="flex items-center">
                                  <CloudRain className="w-4 h-4 mr-2 text-blue-500" />
                                  Annual Rainfall
                                </span>
                                <span>{WEATHER_DATA[formData.location as keyof typeof WEATHER_DATA].avgRainfall} mm</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Soil Data Component (Renamed from FarmSense) */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Soil Data Component
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="flex items-center text-sm font-medium text-gray-700">
                            <Home className="w-4 h-4 mr-2" />
                            Land Tenure
                          </label>
                          <select
                            className="w-full p-2 border rounded-md border-yellow-300"
                            value={formData.landTenure}
                            onChange={(e) => setFormData({...formData, landTenure: e.target.value as 'owned' | 'leased' | 'sharecropped'})}
                          >
                            <option value="owned">Owned</option>
                            <option value="leased">Leased</option>
                            <option value="sharecropped">Sharecropped</option>
                          </select>
                          <p className="text-xs text-yellow-600">⚠ Optional – improves accuracy if provided</p>
                        </div>

                        <div className="space-y-2">
                          <label className="flex items-center text-sm font-medium text-gray-700">
                            <MapPin className="w-4 h-4 mr-2" />
                            Soil Type
                          </label>
                          <select
                            className={`w-full p-2 border rounded-md ${
                              formData.soilType !== 'loamy' ? 'bg-gray-50' : 'border-yellow-300'
                            }`}
                            value={formData.soilType}
                            onChange={(e) => setFormData({...formData, soilType: e.target.value as any})}
                          >
                            {SOIL_TYPES.map(type => (
                              <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                            ))}
                          </select>
                          <p className="text-xs text-green-600">✓ Auto-populated from user soil data</p>
                        </div>

                        <div className="space-y-2">
                          <label className="flex items-center text-sm font-medium text-gray-700">
                            <Sprout className="w-4 h-4 mr-2" />
                            Soil Fertility
                          </label>
                          <select
                            className="w-full p-2 border rounded-md bg-gray-50"
                            value={formData.soilFertility}
                            onChange={(e) => setFormData({...formData, soilFertility: e.target.value as 'low' | 'medium' | 'high'})}
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                          <p className="text-xs text-green-600">✓ Auto-populated from user soil data</p>
                        </div>
                      </div>
                    </div>

                    {/* Crop Management */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                        <Sprout className="w-5 h-5" />
                        Crop Management
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm text-gray-600">Current Crop Type</label>
                          <select
                            className="w-full p-2 border rounded-md border-yellow-300"
                            value={formData.cropType}
                            onChange={(e) => setFormData({...formData, cropType: e.target.value})}
                          >
                            <option value="">Select crop</option>
                            {CROPS.map(crop => (
                              <option key={crop} value={crop}>{crop}</option>
                            ))}
                          </select>
                          <p className="text-xs text-yellow-600">⚠ Optional – improves accuracy if provided</p>
                        </div>

                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.cropRotation}
                              onChange={(e) => setFormData({...formData, cropRotation: e.target.checked})}
                              className="rounded border-gray-300 text-green-600 mr-2"
                            />
                            Practice Crop Rotation
                          </label>
                          <p className="text-xs text-yellow-600">⚠ Optional – improves accuracy if provided</p>
                        </div>
                      </div>
                    </div>

                    {/* Input Access */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        Input Access
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.inputAccess.seeds}
                            onChange={(e) => setFormData({
                              ...formData,
                              inputAccess: {...formData.inputAccess, seeds: e.target.checked}
                            })}
                            className="rounded border-gray-300 text-green-600 mr-2"
                          />
                          Quality Seeds
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.inputAccess.fertilizer}
                            onChange={(e) => setFormData({
                              ...formData,
                              inputAccess: {...formData.inputAccess, fertilizer: e.target.checked}
                            })}
                            className="rounded border-gray-300 text-green-600 mr-2"
                          />
                          Fertilizer
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.inputAccess.tools}
                            readOnly
                            className="rounded border-gray-300 text-green-600 mr-2 bg-gray-50"
                          />
                          Tools/Equipment ✓
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.inputAccess.subsidyAccess}
                            onChange={(e) => setFormData({
                              ...formData,
                              inputAccess: {...formData.inputAccess, subsidyAccess: e.target.checked}
                            })}
                            className="rounded border-gray-300 text-green-600 mr-2"
                          />
                          Subsidies
                        </label>
                      </div>
                      <p className="text-xs text-gray-600">
                        <Info className="w-4 h-4 inline mr-1" />
                        ✓ = Auto-populated from user data, others are optional
                      </p>
                    </div>

                    {/* Infrastructure Access */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                        <Road className="w-5 h-5" />
                        Infrastructure Access
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.infrastructure.roadAccess}
                            onChange={(e) => setFormData({
                              ...formData,
                              infrastructure: {...formData.infrastructure, roadAccess: e.target.checked}
                            })}
                            className="rounded border-gray-300 text-green-600 mr-2"
                          />
                          Road Access
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.infrastructure.irrigation}
                            readOnly
                            className="rounded border-gray-300 text-green-600 mr-2 bg-gray-50"
                          />
                          Irrigation System ✓
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.infrastructure.storage}
                            onChange={(e) => setFormData({
                              ...formData,
                              infrastructure: {...formData.infrastructure, storage: e.target.checked}
                            })}
                            className="rounded border-gray-300 text-green-600 mr-2"
                          />
                          Storage Facilities
                        </label>
                      </div>
                      <p className="text-xs text-gray-600">
                        <Info className="w-4 h-4 inline mr-1" />
                        ✓ = Auto-populated from user data, others are optional
                      </p>
                    </div>

                    {/* Social & Financial Resilience */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Social & Financial Resilience
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.cooperativeMembership.isMember}
                              onChange={(e) => setFormData({
                                ...formData,
                                cooperativeMembership: {...formData.cooperativeMembership, isMember: e.target.checked}
                              })}
                              className="rounded border-gray-300 text-green-600 mr-2"
                            />
                            Member of Farmer Organization
                          </label>
                          {formData.cooperativeMembership.isMember && (
                            <input
                              type="text"
                              placeholder="Organization name"
                              value={formData.cooperativeMembership.organizationName}
                              onChange={(e) => setFormData({
                                ...formData,
                                cooperativeMembership: {...formData.cooperativeMembership, organizationName: e.target.value}
                              })}
                              className="w-full p-2 border rounded-md border-yellow-300"
                            />
                          )}
                          <p className="text-xs text-yellow-600">⚠ Optional – improves accuracy if provided</p>
                        </div>

                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.backupResources.hasOffFarmIncome}
                              onChange={(e) => setFormData({
                                ...formData,
                                backupResources: {...formData.backupResources, hasOffFarmIncome: e.target.checked}
                              })}
                              className="rounded border-gray-300 text-green-600 mr-2"
                            />
                            Off-farm Income
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.backupResources.hasSavings}
                              onChange={(e) => setFormData({
                                ...formData,
                                backupResources: {...formData.backupResources, hasSavings: e.target.checked}
                              })}
                              className="rounded border-gray-300 text-green-600 mr-2"
                            />
                            Has Savings
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.backupResources.familySupport}
                              onChange={(e) => setFormData({
                                ...formData,
                                backupResources: {...formData.backupResources, familySupport: e.target.checked}
                              })}
                              className="rounded border-gray-300 text-green-600 mr-2"
                            />
                            Family Support Network
                          </label>
                          <p className="text-xs text-yellow-600">⚠ Optional – improves accuracy if provided</p>
                        </div>
                      </div>
                    </div>

                    {/* Vegetation Health (Satellite Data) */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                        <Satellite className="w-5 h-5" />
                        Vegetation Health Index
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm text-gray-600">NDVI Score (0–1)</label>
                          <input
                            type="number"
                            min="0"
                            max="1"
                            step="0.01"
                            value={formData.satelliteData.ndviScore}
                            onChange={(e) => setFormData({
                              ...formData,
                              satelliteData: {
                                ...formData.satelliteData,
                                ndviScore: Number(e.target.value)
                              }
                            })}
                            className="w-full p-2 border rounded-md bg-gray-50"
                          />
                          <p className="text-xs text-green-600">✓ Auto-populated from user satellite data</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm text-gray-600">Last Updated</label>
                          <input
                            type="text"
                            value={new Date(formData.satelliteData.lastUpdated).toLocaleDateString()}
                            readOnly
                            className="w-full p-2 border rounded-md bg-gray-50"
                          />
                          <p className="text-xs text-green-600">✓ Auto-populated from user satellite data</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <button
                        type="submit"
                        disabled={assessmentBlocked}
                        className="px-8 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Calculator className="w-5 h-5 inline mr-2" />
                        Run User-Bound Risk Assessment
                      </button>
                    </div>
                  </>
                )}
              </form>
            )}

            {activeTab === 'overview' && riskScore && (
              <div className="space-y-6">
                {/* Overall Risk Score */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calculator className="w-8 h-8" />
                      <div>
                        <h3 className="text-lg font-semibold">User Risk Score</h3>
                        <p className="text-3xl font-bold">{Math.round(riskScore.score)}/100</p>
                        <p className="text-sm opacity-90">{riskScore.category} Risk</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white p-6 rounded-lg">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="w-8 h-8" />
                      <div>
                        <h3 className="text-lg font-semibold">User Context</h3>
                        <p className="text-3xl font-bold">✓</p>
                        <p className="text-sm opacity-90">Farmer ID: {selectedFarmerId}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Shield className="w-8 h-8" />
                      <div>
                        <h3 className="text-lg font-semibold">Bank Intelligence</h3>
                        <p className="text-3xl font-bold">📤</p>
                        <p className="text-sm opacity-90">Auto-Updated</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Risk Factors */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold mb-4">User Risk Factors Analysis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(riskScore.factors).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize font-medium">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span>{Math.round(value * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${value * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* User-Bound System Status */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-800 mb-4">User-Bound System Status</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-green-700">✔ Risk assessment completed for user {selectedFarmerId}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-green-700">✔ Results stored under user context with timestamp</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-green-700">✔ Bank portal automatically updated with user intelligence</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-green-700">✔ User credit report ready for download</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'details' && detailedRisks.length > 0 && (
              <div className="space-y-6">
                {/* Risk Category Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {detailedRisks.map((risk, index) => {
                    const Icon = risk.icon;
                    return (
                      <div
                        key={index}
                        className={`cursor-pointer transition-all border-2 rounded-lg p-4 ${
                          selectedRisk === risk.name 
                            ? 'border-green-600 bg-green-50' 
                            : 'border-gray-200 bg-white hover:border-green-300'
                        }`}
                        onClick={() => setSelectedRisk(risk.name)}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <Icon className="w-6 h-6 text-gray-600" />
                          <h3 className="text-lg font-semibold">{risk.name}</h3>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">User Risk Score:</span>
                          <span className={`font-bold ${
                            risk.score >= 4 ? 'text-red-600' :
                            risk.score >= 3 ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {risk.score.toFixed(1)}/5.0
                          </span>
                        </div>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              risk.score >= 4 ? 'bg-red-500' :
                              risk.score >= 3 ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${(risk.score / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Intervention Strategy */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <History className="w-5 h-5 text-green-600" />
                    User-Specific Intervention Strategy for {selectedRisk}
                  </h2>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 leading-relaxed">
                      {getInterventionStrategy(selectedRisk)}
                    </p>
                  </div>
                </div>

                {/* User-Specific Recommendations */}
                {riskScore && riskScore.recommendations.length > 0 && (
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                      User-Specific System Recommendations
                    </h3>
                    <ul className="space-y-3">
                      {riskScore.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="mt-1.5 w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}