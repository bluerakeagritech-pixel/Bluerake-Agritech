import React, { useState, useEffect, useCallback } from 'react';
import { Brain, Database, BarChart3, Users, Building, Settings, Eye, Calculator, Search, Plus, Download, FileText, Loader2 } from 'lucide-react';
import { centralIntelligence, type FarmerIntelligenceProfile, type BankIntelligenceRecord } from '../services/centralIntelligence';
import AddFarmerForm from './AddFarmerForm';
import RiskAssessment from './RiskAssessment';
import BankDashboard from './BankDashboard';
import FarmSenseModule from './FarmSenseModule';
import DemoPlotManagement from './DemoPlotManagement';
import DigitalExtensionAgent from './DigitalExtensionAgent';
import type { Farmer, BankGradeRiskAssessment } from '../types';

const SAMPLE_FARMERS: Farmer[] = [
  {
    id: 'farmer_1',
    fullName: 'Kwame Asante',
    age: 45,
    gender: 'male',
    education: 'secondary',
    farmingExperience: 20,
    phone: '+233244123456',
    email: 'kwame.asante@email.com',
    ghanaCardId: 'GHA-123456789-0',
    language: 'en',
    farmSize: 5.5,
    irrigationAccess: true,
    mechanisationAccess: false,
    location: {
      latitude: 6.6885,
      longitude: -1.6244,
      region: 'Ashanti',
      district: 'Kumasi',
      agroEcologicalZone: 'Forest Zone',
    },
    extensionScore: 85,
    performanceRatio: 1.2,
    created_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'farmer_2',
    fullName: 'Ama Serwaa',
    age: 38,
    gender: 'female',
    education: 'primary',
    farmingExperience: 15,
    phone: '+233244987654',
    ghanaCardId: 'GHA-987654321-0',
    language: 'tw',
    farmSize: 3.2,
    irrigationAccess: false,
    mechanisationAccess: false,
    location: {
      latitude: 5.6037,
      longitude: -0.1870,
      region: 'Western',
      district: 'Takoradi',
      agroEcologicalZone: 'Coastal Savanna',
    },
    extensionScore: 72,
    performanceRatio: 0.9,
    created_at: '2024-02-01T00:00:00Z',
  },
];

const CentralizedSystem = () => {
  const [activeModule, setActiveModule] = useState<'farmers' | 'risk' | 'banks' | 'farmsense' | 'demoplots' | 'extension'>('farmers');
  const [selectedFarmerId, setSelectedFarmerId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddFarmerForm, setShowAddFarmerForm] = useState(false);
  const [farmers, setFarmers] = useState<FarmerIntelligenceProfile[]>([]);
  const [bankIntelligence, setBankIntelligence] = useState<BankIntelligenceRecord[]>([]);
  const [selectedFarmerProfile, setSelectedFarmerProfile] = useState<FarmerIntelligenceProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [assessing, setAssessing] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const allFarmers = await centralIntelligence.getAllFarmers();
      if (allFarmers.length === 0) {
        for (const farmer of SAMPLE_FARMERS) {
          await centralIntelligence.addFarmer(farmer);
        }
        allFarmers.push(...(await centralIntelligence.getAllFarmers()));
      }
      setFarmers(allFarmers);
      const bankData = await centralIntelligence.getBankIntelligence();
      setBankIntelligence(bankData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!selectedFarmerId) {
      setSelectedFarmerProfile(null);
      return;
    }
    centralIntelligence.getFarmerProfile(selectedFarmerId).then(profile => {
      setSelectedFarmerProfile(profile ?? null);
    });
  }, [selectedFarmerId]);

  const filteredFarmers = farmers.filter(profile =>
    profile.farmer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.farmer.location.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const runRiskAssessment = async (farmerId: string) => {
    setAssessing(farmerId);
    try {
      const assessment = await centralIntelligence.runRiskAssessment(farmerId);
      alert(`Risk assessment completed for farmer ${farmerId}. Score: ${assessment.score}/100`);
      await loadData();
      const profile = await centralIntelligence.getFarmerProfile(farmerId);
      setSelectedFarmerProfile(profile ?? null);
    } catch (error) {
      alert(`Error running assessment: ${error}`);
    } finally {
      setAssessing(null);
    }
  };

  const downloadCreditReport = async (farmerId: string) => {
    try {
      const report = await centralIntelligence.generateCreditReport(farmerId);
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `credit_report_${report.farmer.fullName.replace(' ', '_')}.json`;
      a.click();
    } catch (error) {
      alert(`Error generating report: ${error}`);
    }
  };

  const modules = [
    { id: 'farmers', name: 'Farmers List', icon: Users, color: 'bg-green-600' },
    { id: 'risk', name: 'Risk Assessment Engine', icon: Calculator, color: 'bg-red-600' },
    { id: 'banks', name: 'Bank Intelligence', icon: Building, color: 'bg-blue-600' },
    { id: 'farmsense', name: 'FarmSense Integration', icon: Database, color: 'bg-orange-600' },
    { id: 'demoplots', name: 'Demo Plot Management', icon: BarChart3, color: 'bg-indigo-600' },
    { id: 'extension', name: 'Extension Services', icon: Eye, color: 'bg-teal-600' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">BlueRakeAgriTech Ghana</h1>
                <p className="text-sm text-gray-500">Central Agricultural Intelligence System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                System Active
              </span>
              <Settings className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Module Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <button
                key={module.id}
                onClick={() => setActiveModule(module.id as any)}
                className={`p-4 rounded-lg text-left transition-all ${
                  activeModule === module.id
                    ? `${module.color} text-white shadow-lg`
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <div className="flex items-center">
                  <Icon className="h-6 w-6 mr-3" />
                  <div>
                    <h3 className="font-medium">{module.name}</h3>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Module Content */}
        <div className="bg-white rounded-lg shadow">
          {activeModule === 'farmers' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Farmers List - Master Control</h2>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search farmers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={() => setShowAddFarmerForm(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add Farmer
                  </button>
                </div>
              </div>

              {/* Farmers Table */}
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 text-green-600 animate-spin" />
                    <span className="ml-2 text-gray-600">Loading farmers...</span>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Farmer ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Farm Size</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loan Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredFarmers.map((profile) => (
                        <tr key={profile.farmer.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{profile.farmer.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button onClick={() => setSelectedFarmerId(profile.farmer.id)} className="text-blue-600 hover:text-blue-900 font-medium">{profile.farmer.fullName}</button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{profile.farmer.location.region}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{profile.farmer.farmSize} ha</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {profile.riskAssessment ? (
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                profile.riskAssessment.riskLevel === 'Low' ? 'bg-green-100 text-green-800' :
                                profile.riskAssessment.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {profile.riskAssessment.riskLevel} ({profile.riskAssessment.score})
                              </span>
                            ) : <span className="text-gray-500">Not Assessed</span>}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {profile.riskAssessment ? (
                              profile.riskAssessment.riskLevel === 'Low' ? 'Eligible' :
                              profile.riskAssessment.riskLevel === 'Medium' ? 'Conditional' : 'Not Eligible'
                            ) : 'Pending Assessment'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2">
                              <button onClick={() => runRiskAssessment(profile.farmer.id)} disabled={assessing === profile.farmer.id} className="text-green-600 hover:text-green-900 disabled:opacity-50">
                                {assessing === profile.farmer.id ? 'Assessing...' : 'Run Assessment'}
                              </button>
                              {profile.riskAssessment && (
                                <button onClick={() => downloadCreditReport(profile.farmer.id)} className="text-blue-600 hover:text-blue-900">Credit Report</button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Selected Farmer Profile */}
              {selectedFarmerProfile && (
                <div className="mt-8 border-t pt-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Farmer Intelligence Profile: {selectedFarmerProfile.farmer.fullName}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-700 mb-3">Basic Profile</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Age:</strong> {selectedFarmerProfile.farmer.age}</p>
                        <p><strong>Experience:</strong> {selectedFarmerProfile.farmer.farmingExperience} years</p>
                        <p><strong>Education:</strong> {selectedFarmerProfile.farmer.education}</p>
                        <p><strong>Phone:</strong> {selectedFarmerProfile.farmer.phone}</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-700 mb-3">Farm Data</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Size:</strong> {selectedFarmerProfile.farmer.farmSize} ha</p>
                        <p><strong>Location:</strong> {selectedFarmerProfile.farmer.location.district}, {selectedFarmerProfile.farmer.location.region}</p>
                        <p><strong>Zone:</strong> {selectedFarmerProfile.farmer.location.agroEcologicalZone}</p>
                        <p><strong>Irrigation:</strong> {selectedFarmerProfile.farmer.irrigationAccess ? 'Yes' : 'No'}</p>
                        {selectedFarmerProfile.farmer.extendedData && (
                          <>
                            <p><strong>Land Tenure:</strong> {selectedFarmerProfile.farmer.extendedData.landTenure}</p>
                            <p><strong>Soil Type:</strong> {selectedFarmerProfile.farmer.extendedData.soilData.soilType}</p>
                            <p><strong>Soil Fertility:</strong> {selectedFarmerProfile.farmer.extendedData.soilData.soilFertility}</p>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-700 mb-3">Farmer-Submitted Risk Data</h4>
                      {selectedFarmerProfile.farmer.extendedData ? (
                        <div className="space-y-2 text-sm">
                          <p><strong>Crop Rotation:</strong> {selectedFarmerProfile.farmer.extendedData.cropManagement.practicesCropRotation ? 'Yes' : 'No'}</p>
                          <p><strong>Cooperative Member:</strong> {selectedFarmerProfile.farmer.extendedData.socialFinancial.cooperativeMember ? 'Yes' : 'No'}</p>
                          <p><strong>Off-farm Income:</strong> {selectedFarmerProfile.farmer.extendedData.socialFinancial.offFarmIncome ? 'Yes' : 'No'}</p>
                          <p><strong>NDVI Score:</strong> {selectedFarmerProfile.farmer.extendedData.vegetationHealth.ndviScore || 'Not provided'}</p>
                          <p><strong>Quality Seeds Access:</strong> {selectedFarmerProfile.farmer.extendedData.inputAccess.qualitySeeds ? 'Yes' : 'No'}</p>
                          <p><strong>Road Access:</strong> {selectedFarmerProfile.farmer.extendedData.infrastructure.roadAccess ? 'Yes' : 'No'}</p>
                        </div>
                      ) : <p className="text-gray-500 text-sm">No farmer-submitted risk data available</p>}
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-700 mb-3">Risk Assessment</h4>
                      {selectedFarmerProfile.riskAssessment ? (
                        <div className="space-y-2 text-sm">
                          <p><strong>Score:</strong> {selectedFarmerProfile.riskAssessment.score}/100</p>
                          <p><strong>Level:</strong> {selectedFarmerProfile.riskAssessment.riskLevel}</p>
                          <p><strong>Default Risk:</strong> {selectedFarmerProfile.riskAssessment.defaultProbability.toFixed(1)}%</p>
                          <p><strong>Loan Amount:</strong> GH₵{selectedFarmerProfile.riskAssessment.safeLoanAmount.toLocaleString()}</p>
                        </div>
                      ) : <p className="text-gray-500 text-sm">No assessment available</p>}
                    </div>
                  </div>
                  <div className="mt-6 flex gap-4">
                    <button onClick={() => runRiskAssessment(selectedFarmerProfile.farmer.id)} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Run Risk Assessment</button>
                    <button onClick={() => setActiveModule('farmsense')} className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">Add FarmSense Data</button>
                    {selectedFarmerProfile.riskAssessment && (
                      <button onClick={() => downloadCreditReport(selectedFarmerProfile.farmer.id)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                        <Download className="w-4 h-4" /> Download Credit Report
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Add Farmer Form Modal */}
          {showAddFarmerForm && (
            <AddFarmerForm
              onClose={() => setShowAddFarmerForm(false)}
              onFarmerAdded={() => {
                setShowAddFarmerForm(false);
                loadData();
              }}
            />
          )}

          {activeModule === 'risk' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Risk Assessment Engine</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800"><strong>System Authority:</strong> Only the Central System can run risk calculations and store results.</p>
              </div>
              <RiskAssessment />
            </div>
          )}

          {activeModule === 'banks' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Bank Intelligence Dashboard</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800"><strong>Intelligence Distribution:</strong> This shows what banks see after risk assessments are completed.</p>
              </div>
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                    <span className="ml-2 text-gray-600">Loading bank intelligence...</span>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Farmer ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Score</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Default Probability</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recommended Loan</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bankIntelligence.map((record) => (
                        <tr key={record.farmerId} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.farmerId}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.farmerName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.location}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              record.riskCategory === 'Low' ? 'bg-green-100 text-green-800' :
                              record.riskCategory === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                            }`}>{record.riskScore}/100</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.defaultProbability.toFixed(1)}%</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">GH₵{record.recommendedLoanAmount.toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              record.loanStatus === 'eligible' ? 'bg-green-100 text-green-800' :
                              record.loanStatus === 'conditional' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                            }`}>{record.loanStatus}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {activeModule === 'farmsense' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">FarmSense Integration</h2>
              <FarmSenseModule farmerId="system_admin" onSoilDataUpdate={(data) => console.log('Soil data updated:', data)} />
            </div>
          )}

          {activeModule === 'demoplots' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Demo Plot Management</h2>
              <DemoPlotManagement />
            </div>
          )}

          {activeModule === 'extension' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Digital Extension Services</h2>
              <DigitalExtensionAgent farmerId="system_overview" currentSeason="Main" currentYear={2024} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CentralizedSystem;
