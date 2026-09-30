import React, { useState } from 'react';
import { Calendar, Bell, TrendingUp, Droplets, Bug, DollarSign, MapPin, Clock, CheckCircle, AlertTriangle, Info, Shield, Users, BookOpen, Target, Zap, Eye } from 'lucide-react';
import type { ExtensionGuidance, ProductionPlan } from '../types';

interface DigitalExtensionAgentProps {
  farmerId: string;
  currentSeason: string;
  currentYear: number;
}

const DigitalExtensionAgent: React.FC<DigitalExtensionAgentProps> = ({ 
  farmerId, 
  currentSeason, 
  currentYear 
}) => {
  const [activeTab, setActiveTab] = useState<'manual' | 'safeguards' | 'protocols' | 'guidance' | 'tracking' | 'alerts'>('manual');

  // Operational Manual Data
  const agroEcologicalSafeguards = [
    {
      zone: 'Northern Savannah (Unimodal Rainfall)',
      majorRisk: 'Terminal drought',
      safeguards: [
        'Early planting (May–June)',
        'Short-duration varieties (90–100 days)',
        'Tied ridges & water conservation',
        'Millet, sorghum, cowpea, soybean focus'
      ]
    },
    {
      zone: 'Transition Zone (Bimodal, unstable)',
      majorRisk: 'Minor season failure',
      safeguards: [
        'Early harvest of major season crops',
        'Extra-early maize (Omankwa)',
        'Strict planting windows (Sept)',
        'Fertility management'
      ]
    },
    {
      zone: 'Forest Zone',
      majorRisk: 'Fungal diseases & poor drainage',
      safeguards: [
        'Minimum tillage',
        'Drainage channels',
        'Disease monitoring (Black Pod, root rots)'
      ]
    },
    {
      zone: 'Coastal Savannah',
      majorRisk: 'Low rainfall',
      safeguards: [
        'Irrigation systems',
        'Cassava & vegetables',
        'Stress-tolerant crops'
      ]
    }
  ];

  const cropSafeguardProtocols = [
    {
      crop: 'Maize',
      icon: '🌽',
      criticalSafeguards: [
        'Hybrid seeds only',
        'Zn- and S-enriched fertilizers',
        'FAW scouting weekly',
        'Spray into whorl',
        'Narrow crib drying'
      ]
    },
    {
      crop: 'Rice (Sawah System)',
      icon: '🌾',
      criticalSafeguards: [
        'Bunding & leveling',
        '2–5 cm water control',
        'Urea Deep Placement',
        'Weed suppression via flooding'
      ]
    },
    {
      crop: 'Sorghum/Millet',
      icon: '🌿',
      majorThreat: 'Striga',
      criticalSafeguards: [
        'Soybean rotation',
        'Manure + nitrogen',
        'Resistant varieties'
      ]
    },
    {
      crop: 'Soybean',
      icon: '🌱',
      gameChanger: 'Inoculation (Nodumax)',
      criticalSafeguards: [
        'Shade-dry inoculated seed',
        'Phosphorus fertilizer'
      ]
    },
    {
      crop: 'Cowpea',
      icon: '🫘',
      majorThreat: 'High pest pressure',
      criticalSafeguards: [
        '2–3 strategic sprays',
        'PICS storage bags'
      ]
    },
    {
      crop: 'Groundnut',
      icon: '🥜',
      majorThreat: 'Aflatoxin control',
      criticalSafeguards: [
        'Calcium application (Gypsum)',
        'Dry on tarpaulin',
        'Sort damaged nuts'
      ]
    },
    {
      crop: 'Cassava',
      icon: '🌿',
      criticalSafeguards: [
        'Disease-free stems',
        'Pre-emergence weed control',
        'Proper fermentation for gari'
      ]
    },
    {
      crop: 'Yam',
      icon: '🍠',
      seedSafeguard: 'Minisett technique',
      criticalSafeguards: [
        'Minisett technique',
        'Trellis/live staking'
      ]
    }
  ];

  const treeCropAssets = [
    { crop: 'Cocoa', majorThreat: 'CSSVD', safeguard: 'Cutting out + barrier crops' },
    { crop: 'Cashew', majorThreat: 'Shading & poor canopy', safeguard: 'Thinning + pruning' },
    { crop: 'Oil Palm', majorThreat: 'K/Mg deficiency', safeguard: 'MOP + Kieserite' },
    { crop: 'Mango', majorThreat: 'Bacterial Black Spot', safeguard: 'Orchard sanitation' }
  ];

  const dailyPriorities = [
    'Register & map farms',
    'Monitor crop stage vs calendar',
    'Enforce fertilizer protocol',
    'Scout pests/diseases',
    'Ensure post-harvest handling',
    'Record data digitally',
    'Link farmers to markets',
    'Protect input credit recovery'
  ];

  const crossCuttingSafeguards = [
    { risk: 'Soil acidity', safeguard: 'Liming every 3–5 yrs' },
    { risk: 'Low mechanization', safeguard: 'Link to AMSECs' },
    { risk: 'Gender inequality', safeguard: 'Women FBOs & targeted tech' }
  ];

  // Mock data for demonstration
  const mockGuidance: ExtensionGuidance = {
    id: 'guidance_1',
    farmerId,
    season: currentSeason,
    year: currentYear,
    recommendations: {
      plantingDate: '2024-04-15',
      fertilizerTiming: [
        { date: '2024-04-20', type: 'NPK 15-15-15', quantity: 50 },
        { date: '2024-06-01', type: 'Urea', quantity: 25 },
        { date: '2024-07-15', type: 'Potash', quantity: 30 },
      ],
      pestDiseaseAlerts: [
        { date: '2024-05-01', risk: 'Fall Armyworm', prevention: 'Apply Bt-based insecticide early morning or evening' },
        { date: '2024-06-15', risk: 'Leaf Spot Disease', prevention: 'Ensure proper spacing and apply copper-based fungicide' },
      ],
      irrigationAlerts: [
        { date: '2024-05-10', recommendation: 'Increase irrigation frequency - dry spell expected' },
        { date: '2024-07-01', recommendation: 'Reduce irrigation - rainy season approaching' },
      ],
      harvestTiming: '2024-08-20',
      marketPriceAlerts: [
        { date: '2024-08-15', crop: 'Maize', price: 2800, trend: 'rising' },
        { date: '2024-08-25', crop: 'Maize', price: 3200, trend: 'stable' },
      ],
    },
    complianceScore: 78,
    created_at: '2024-01-01T00:00:00Z',
  };

  const mockProductionPlan: ProductionPlan = {
    id: 'plan_1',
    farmerId,
    season: currentSeason,
    year: currentYear,
    prePlanting: {
      cropSelected: 'Maize',
      variety: 'Obatanpa',
      seedSource: 'Certified Dealer',
      fertilizerPlan: [
        { type: 'NPK 15-15-15', quantity: 200, timing: 'Basal application', cost: 450 },
        { type: 'Urea', quantity: 100, timing: '4 weeks after planting', cost: 180 },
      ],
      budget: 2500,
      expectedYield: 4.5,
      marketTarget: 'Local Market',
    },
    duringGrowth: {
      plantingDate: '2024-04-15',
      weatherEvents: [
        { date: '2024-05-01', type: 'drought', severity: 'medium' },
        { date: '2024-06-15', type: 'rain', severity: 'high' },
      ],
      ndviReadings: [
        { date: '2024-05-01', value: 0.45 },
        { date: '2024-06-01', value: 0.68 },
        { date: '2024-07-01', value: 0.72 },
      ],
      fertilizerApplications: [
        { date: '2024-04-20', type: 'NPK 15-15-15', quantity: 200 },
        { date: '2024-05-20', type: 'Urea', quantity: 100 },
      ],
      pesticideUse: [
        { date: '2024-05-05', type: 'Bt Insecticide', reason: 'Fall Armyworm prevention' },
      ],
      irrigationEvents: [
        { date: '2024-05-10', duration: 2 },
        { date: '2024-05-15', duration: 3 },
      ],
      fieldPhotos: [
        { date: '2024-05-01', url: '/photos/field_may.jpg', notes: 'Good germination' },
        { date: '2024-06-01', url: '/photos/field_june.jpg', notes: 'Healthy growth' },
      ],
      extensionVisits: [
        { date: '2024-05-15', officer: 'John Mensah', recommendations: 'Increase irrigation frequency' },
      ],
    },
    postHarvest: {
      harvestDate: '',
      yieldHarvested: 0,
      storageMethod: '',
      salesPrice: 0,
      buyer: '',
      profit: 0,
      loanRepaymentStatus: 'pending',
    },
    created_at: '2024-01-01T00:00:00Z',
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'pest': return <Bug className="w-5 h-5 text-red-500" />;
      case 'irrigation': return <Droplets className="w-5 h-5 text-blue-500" />;
      case 'market': return <DollarSign className="w-5 h-5 text-green-500" />;
      case 'weather': return <Calendar className="w-5 h-5 text-yellow-500" />;
      default: return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getComplianceColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const upcomingTasks = [
    { date: '2024-04-15', task: 'Plant maize seeds', type: 'planting', priority: 'high' },
    { date: '2024-04-20', task: 'Apply basal fertilizer (NPK)', type: 'fertilizer', priority: 'high' },
    { date: '2024-05-01', task: 'Monitor for Fall Armyworm', type: 'pest', priority: 'medium' },
    { date: '2024-05-10', task: 'Begin irrigation schedule', type: 'irrigation', priority: 'medium' },
  ];

  const currentAlerts = [
    { type: 'weather', message: 'Dry spell expected next week - prepare irrigation', priority: 'high' },
    { type: 'pest', message: 'Fall Armyworm activity reported in nearby farms', priority: 'medium' },
    { type: 'market', message: 'Maize prices trending upward - good for harvest timing', priority: 'low' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Digital Extension Services</h1>
        <p className="text-gray-600 mt-2">
          Operational Manual & Strategic Framework for Agricultural Extension Agents (AEAs) in Ghana
        </p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">
              Safeguarding Crop Production Systems under PFJ 2.0
            </span>
          </div>
        </div>
      </div>

      {/* Strategic Foundation */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600" />
          Strategic Foundation: The New Role of the Extension Agent
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Core Mandate</h3>
            <div className="space-y-2">
              {['Productivity (higher yields)', 'Profitability (market linkage)', 'Creditworthiness (repayment capacity)', 'Climate resilience', 'Data integrity'].map((mandate, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-700">{mandate}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">AEA Roles</h3>
            <div className="space-y-2">
              {['Production Safeguard Officer', 'Farm Credit Risk Manager', 'Value Chain Facilitator', 'Data Collection & Intelligence Agent'].map((role, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-700">{role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 font-medium">
            <strong>Final Principle:</strong> An extension visit is successful only when it reduces production risk and increases the farmer's repayment capacity.
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8 overflow-x-auto">
          {[
            { id: 'manual', name: 'Operational Manual', icon: BookOpen },
            { id: 'safeguards', name: 'Agro-Ecological Safeguards', icon: Shield },
            { id: 'protocols', name: 'Crop Protocols', icon: Zap },
            { id: 'guidance', name: 'Seasonal Guidance', icon: Calendar },
            { id: 'tracking', name: 'Production Tracking', icon: TrendingUp },
            { id: 'alerts', name: 'Alerts & Tasks', icon: Bell }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'manual' && (
        <div className="space-y-6">
          {/* PFJ 2.0 Operating Environment */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-purple-600" />
              PFJ 2.0 Operating Environment
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Pillar</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Role of AEA</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Safeguarding Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    { pillar: 'Input Credit', role: 'Ensure proper use of inputs', impact: 'Prevent yield failure → loan default' },
                    { pillar: 'Storage Systems', role: 'Promote post-harvest technologies', impact: 'Reduce losses' },
                    { pillar: 'Off-taker Linkages', role: 'Link farmers to aggregators', impact: 'Assured markets' },
                    { pillar: 'Digitized Platforms', role: 'GPS mapping, E-diary, biometrics', impact: 'Prevent fraud, improve targeting' },
                    { pillar: 'Line-of-Sight Management', role: 'Monitor production under aggregator zones', impact: 'Ensure recovery commodity' }
                  ].map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.pillar}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{row.role}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{row.impact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 font-medium">
                <strong>Key Rule:</strong> Every input is credit, not a subsidy.
              </p>
            </div>
          </div>

          {/* Digital Responsibilities */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Digital Responsibilities of AEAs</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tool</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Operational Use</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Safeguard Function</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    { tool: 'GPS Mapping', use: 'Farm boundary verification', function: 'Accurate input dosage' },
                    { tool: 'Biometric Registration', use: 'Farmer identification', function: 'Credit history creation' },
                    { tool: 'E-Diary', use: 'Record extension visits', function: 'Coverage accountability' },
                    { tool: 'Real-time Reporting', use: 'Pest/disease alerts', function: 'Early intervention' },
                    { tool: 'Market Info Systems', use: 'Price monitoring', function: 'Protect farmer margins' }
                  ].map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.tool}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{row.use}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{row.function}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Daily Priorities */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Extension Agent Daily Priorities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dailyPriorities.map((priority, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <span className="text-gray-800">{priority}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cross-Cutting Safeguards */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Cross-Cutting Safeguards</h3>
            <div className="space-y-4">
              {crossCuttingSafeguards.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    <span className="font-medium text-gray-800">{item.risk}</span>
                  </div>
                  <span className="text-green-600 font-medium">{item.safeguard}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'safeguards' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Agro-Ecological Safeguard Strategies</h3>
          {agroEcologicalSafeguards.map((zone, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">{zone.zone}</h4>
                  <div className="mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                      Major Risk: {zone.majorRisk}
                    </span>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Safeguards:</h5>
                    <div className="space-y-2">
                      {zone.safeguards.map((safeguard, safeguardIndex) => (
                        <div key={safeguardIndex} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-gray-700">{safeguard}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'protocols' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Crop-Specific Safeguard Protocols</h3>
          
          {/* Field Crops */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cropSafeguardProtocols.map((crop, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{crop.icon}</span>
                  <h4 className="text-lg font-semibold text-gray-800">{crop.crop}</h4>
                </div>
                
                {crop.majorThreat && (
                  <div className="mb-3">
                    <span className="inline-flex items-center px-2 py-1 rounded text-sm font-medium bg-red-100 text-red-800">
                      Major Threat: {crop.majorThreat}
                    </span>
                  </div>
                )}
                
                {crop.gameChanger && (
                  <div className="mb-3">
                    <span className="inline-flex items-center px-2 py-1 rounded text-sm font-medium bg-green-100 text-green-800">
                      Game Changer: {crop.gameChanger}
                    </span>
                  </div>
                )}
                
                {crop.seedSafeguard && (
                  <div className="mb-3">
                    <span className="inline-flex items-center px-2 py-1 rounded text-sm font-medium bg-blue-100 text-blue-800">
                      Seed Safeguard: {crop.seedSafeguard}
                    </span>
                  </div>
                )}
                
                <div>
                  <h5 className="font-medium text-gray-700 mb-2">Critical Safeguards:</h5>
                  <div className="space-y-2">
                    {crop.criticalSafeguards.map((safeguard, safeguardIndex) => (
                      <div key={safeguardIndex} className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-700">{safeguard}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tree Crop Asset Management */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Tree Crop Asset Management</h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Crop</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Major Threat</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Safeguard</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {treeCropAssets.map((crop, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{crop.crop}</td>
                      <td className="px-4 py-3 text-sm text-red-600">{crop.majorThreat}</td>
                      <td className="px-4 py-3 text-sm text-green-600">{crop.safeguard}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Vegetable Systems */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Vegetable Systems (High Risk)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'EPA-approved pesticides only',
                'Strict PHI enforcement',
                'Plastic crates for tomatoes',
                'Drip irrigation promotion'
              ].map((safeguard, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <span className="text-gray-800">{safeguard}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'guidance' && (
        <div className="space-y-6">
          {/* Compliance Score Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Extension Compliance Score</h2>
                <p className="text-gray-600">Based on following recommendations and best practices</p>
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getComplianceColor(mockGuidance.complianceScore)}`}>
                  {mockGuidance.complianceScore}/100
                </div>
                <div className="mt-2 w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${mockGuidance.complianceScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Planting Guidance */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-600" />
              Planting Schedule
            </h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">Optimal Planting Date</span>
              </div>
              <p className="text-green-700">
                {new Date(mockGuidance.recommendations.plantingDate).toLocaleDateString('en-GB', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p className="text-sm text-green-600 mt-1">
                Based on weather patterns and soil conditions in your area
              </p>
            </div>
          </div>

          {/* Fertilizer Schedule */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Fertilizer Application Schedule
            </h3>
            <div className="space-y-4">
              {mockGuidance.recommendations.fertilizerTiming.map((fertilizer, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <div className="font-medium text-blue-800">{fertilizer.type}</div>
                    <div className="text-sm text-blue-600">
                      {new Date(fertilizer.date).toLocaleDateString()} • {fertilizer.quantity} kg/ha
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded text-sm">
                      Scheduled
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pest & Disease Alerts */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Bug className="w-5 h-5 text-red-600" />
              Pest & Disease Prevention
            </h3>
            <div className="space-y-4">
              {mockGuidance.recommendations.pestDiseaseAlerts.map((alert, index) => (
                <div key={index} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-red-800">{alert.risk}</div>
                      <div className="text-sm text-red-600 mt-1">
                        Expected: {new Date(alert.date).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-700 mt-2">
                        <strong>Prevention:</strong> {alert.prevention}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Market Price Alerts */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Market Price Trends
            </h3>
            <div className="space-y-4">
              {mockGuidance.recommendations.marketPriceAlerts.map((alert, index) => (
                <div key={index} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-green-800">{alert.crop}</div>
                      <div className="text-sm text-green-600">
                        {new Date(alert.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-800">
                        GH₵{alert.price.toLocaleString()}/MT
                      </div>
                      <div className={`text-sm capitalize ${
                        alert.trend === 'rising' ? 'text-green-600' :
                        alert.trend === 'falling' ? 'text-red-600' :
                        'text-gray-600'
                      }`}>
                        {alert.trend}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tracking' && (
        <div className="space-y-6">
          {/* Production Plan Overview */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Production Plan Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">Crop Selection</h4>
                <p className="text-lg font-semibold">{mockProductionPlan.prePlanting.cropSelected}</p>
                <p className="text-sm text-gray-600">{mockProductionPlan.prePlanting.variety}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">Expected Yield</h4>
                <p className="text-lg font-semibold">{mockProductionPlan.prePlanting.expectedYield} MT/ha</p>
                <p className="text-sm text-gray-600">Target yield</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">Budget</h4>
                <p className="text-lg font-semibold">GH₵{mockProductionPlan.prePlanting.budget.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total planned cost</p>
              </div>
            </div>
          </div>

          {/* NDVI Crop Health Tracking */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Crop Health Monitoring (NDVI)</h3>
            <div className="space-y-4">
              {mockProductionPlan.duringGrowth.ndviReadings.map((reading, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <div className="font-medium text-green-800">
                      {new Date(reading.date).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-green-600">NDVI Reading</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-800">{reading.value.toFixed(2)}</div>
                    <div className="text-sm text-green-600">
                      {reading.value > 0.7 ? 'Excellent' : reading.value > 0.5 ? 'Good' : 'Needs attention'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Field Activities Log */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Field Activities Log</h3>
            <div className="space-y-4">
              {mockProductionPlan.duringGrowth.fertilizerApplications.map((app, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-blue-800">Fertilizer Application</div>
                    <div className="text-sm text-blue-600">
                      {new Date(app.date).toLocaleDateString()} • {app.type} • {app.quantity} kg/ha
                    </div>
                  </div>
                </div>
              ))}
              
              {mockProductionPlan.duringGrowth.pesticideUse.map((use, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-red-50 rounded-lg">
                  <Bug className="w-5 h-5 text-red-600" />
                  <div>
                    <div className="font-medium text-red-800">Pesticide Application</div>
                    <div className="text-sm text-red-600">
                      {new Date(use.date).toLocaleDateString()} • {use.type} • {use.reason}
                    </div>
                  </div>
                </div>
              ))}

              {mockProductionPlan.duringGrowth.irrigationEvents.map((event, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-cyan-50 rounded-lg">
                  <Droplets className="w-5 h-5 text-cyan-600" />
                  <div>
                    <div className="font-medium text-cyan-800">Irrigation</div>
                    <div className="text-sm text-cyan-600">
                      {new Date(event.date).toLocaleDateString()} • {event.duration} hours
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="space-y-6">
          {/* Current Alerts */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-orange-600" />
              Current Alerts
            </h3>
            <div className="space-y-4">
              {currentAlerts.map((alert, index) => (
                <div key={index} className={`p-4 rounded-lg border ${
                  alert.priority === 'high' ? 'bg-red-50 border-red-200' :
                  alert.priority === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex items-start gap-3">
                    {getAlertIcon(alert.type)}
                    <div>
                      <div className={`font-medium ${
                        alert.priority === 'high' ? 'text-red-800' :
                        alert.priority === 'medium' ? 'text-yellow-800' :
                        'text-blue-800'
                      }`}>
                        {alert.message}
                      </div>
                      <div className={`text-sm mt-1 ${
                        alert.priority === 'high' ? 'text-red-600' :
                        alert.priority === 'medium' ? 'text-yellow-600' :
                        'text-blue-600'
                      }`}>
                        Priority: {alert.priority}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-600" />
              Upcoming Tasks
            </h3>
            <div className="space-y-4">
              {upcomingTasks.map((task, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getAlertIcon(task.type)}
                    <div>
                      <div className="font-medium text-gray-800">{task.task}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(task.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      task.priority === 'high' ? 'bg-red-100 text-red-800' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {task.priority}
                    </span>
                    <button className="text-green-600 hover:text-green-800 text-sm">
                      Mark Complete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DigitalExtensionAgent;