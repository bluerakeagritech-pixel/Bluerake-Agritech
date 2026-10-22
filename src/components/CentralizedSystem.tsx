import React, { useState, useEffect, useCallback } from 'react';
import {
  Brain,
  Database,
  BarChart3,
  Users,
  Building,
  Settings,
  Eye,
  Calculator,
  Search,
  Plus,
  Download,
  Loader2,
  Layers,
  CheckCircle,
  Clock,
} from 'lucide-react';
import {
  centralIntelligence,
  type FarmerIntelligenceProfile,
  type BankIntelligenceRecord,
} from '../services/centralIntelligence';
import AddFarmerForm from './AddFarmerForm';
import RiskAssessment from './RiskAssessment';
import FarmSenseModule from './FarmSenseModule';
import DemoPlotManagement from './DemoPlotManagement';
import DigitalExtensionAgent from './DigitalExtensionAgent';

const CentralizedSystem = () => {
  const [activeModule, setActiveModule] = useState<
    'farmers' | 'risk' | 'banks' | 'farmsense' | 'demoplots' | 'extension'
  >('farmers');
  const [selectedFarmerId, setSelectedFarmerId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddFarmerForm, setShowAddFarmerForm] = useState(false);
  const [farmers, setFarmers] = useState<FarmerIntelligenceProfile[]>([]);
  const [bankIntelligence, setBankIntelligence] = useState<BankIntelligenceRecord[]>([]);
  const [selectedFarmerProfile, setSelectedFarmerProfile] =
    useState<FarmerIntelligenceProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const allFarmers = await centralIntelligence.getAllFarmers();
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
    centralIntelligence.getFarmerProfile(selectedFarmerId).then((profile) => {
      setSelectedFarmerProfile(profile ?? null);
    });
  }, [selectedFarmerId]);

  const normalizedSearch = searchTerm.trim().toLowerCase().replace('-', '');
  const filteredFarmers = farmers.filter(
    (profile) =>
      !normalizedSearch ||
      profile.farmer.id.toLowerCase().replace('-', '').includes(normalizedSearch) ||
      profile.farmer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.farmer.location.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.farmer.location.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAdminAugmentationForFarmer = (farmerId: string) => {
    setSelectedFarmerId(farmerId);
    setActiveModule('risk');
  };

  const downloadCreditReport = async (farmerId: string) => {
    try {
      const report = await centralIntelligence.generateCreditReport(farmerId);
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.farmer.id}_credit_report_${report.farmer.fullName.replace(/\s+/g, '_')}.json`;
      a.click();
    } catch (error) {
      alert(`Error generating report: ${error}`);
    }
  };

  const modules = [
    { id: 'farmers', name: 'Registered Farmers (GHFA-XXX)', icon: Users, color: 'bg-green-600' },
    {
      id: 'risk',
      name: 'Admin Risk & Augmentation Engine',
      icon: Calculator,
      color: 'bg-purple-600',
    },
    { id: 'banks', name: 'Bank-Ready Intelligence', icon: Building, color: 'bg-blue-600' },
    { id: 'farmsense', name: 'FarmSense Soil Lab', icon: Database, color: 'bg-orange-600' },
    { id: 'demoplots', name: 'Demo Plot Benchmarks', icon: BarChart3, color: 'bg-indigo-600' },
    { id: 'extension', name: 'Extension Services', icon: Eye, color: 'bg-teal-600' },
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
                <p className="text-sm text-gray-500">
                  Central Agricultural Intelligence &amp; Admin Augmentation Engine
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                Manual-Augmentation Workflow Active
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
                className={`p-4 rounded-xl text-left transition-all ${
                  activeModule === module.id
                    ? `${module.color} text-white shadow-lg`
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <div className="flex items-center">
                  <Icon className="h-6 w-6 mr-3" />
                  <div>
                    <h3 className="font-semibold">{module.name}</h3>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Module Content */}
        <div className="bg-white rounded-xl shadow">
          {activeModule === 'farmers' && (
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Central Farmer Registry (GHFA-XXX)
                  </h2>
                  <p className="text-sm text-gray-500">
                    All profiles registered via the Farmer Portal with sequential GHFA identifiers. Select any farmer to append secondary data and generate their bank-ready profile.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search GHFA001, Name, Region..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={() => setShowAddFarmerForm(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 font-medium"
                  >
                    <Plus className="w-5 h-5" />
                    Register Farmer
                  </button>
                </div>
              </div>

              {/* Farmers Table */}
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 text-green-600 animate-spin" />
                    <span className="ml-2 text-gray-600">Loading central farmer registry...</span>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                          GHFA ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Farmer Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Farm / Crop
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Workflow Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Risk Score
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Admin Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredFarmers.map((profile) => (
                        <tr key={profile.farmer.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2.5 py-1 rounded-md bg-slate-900 text-white font-mono text-xs font-bold">
                              {profile.farmer.id}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => setSelectedFarmerId(profile.farmer.id)}
                              className="text-blue-600 hover:text-blue-900 font-semibold"
                            >
                              {profile.farmer.fullName}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {profile.farmer.location.district
                              ? `${profile.farmer.location.district}, `
                              : ''}
                            {profile.farmer.location.region}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {profile.farmer.farmSize} ha &bull;{' '}
                            <span className="text-gray-600">
                              {profile.farmer.extendedData?.primaryCrop || 'Maize'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {profile.riskAssessment ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                                <CheckCircle className="w-3.5 h-3.5" />
                                Bank-Ready Profile
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                                <Clock className="w-3.5 h-3.5" />
                                Pending Augmentation
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {profile.riskAssessment ? (
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                  profile.riskAssessment.riskLevel === 'Low'
                                    ? 'bg-green-100 text-green-800'
                                    : profile.riskAssessment.riskLevel === 'Medium'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {profile.riskAssessment.riskLevel} ({profile.riskAssessment.score}
                                /100)
                              </span>
                            ) : (
                              <span className="text-gray-400 text-xs">Awaiting Admin Input</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => openAdminAugmentationForFarmer(profile.farmer.id)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-xs font-semibold"
                              >
                                <Layers className="w-3.5 h-3.5" />
                                {profile.riskAssessment
                                  ? 'Edit Augmentation'
                                  : 'Augment & Generate Profile'}
                              </button>
                              {profile.riskAssessment && (
                                <button
                                  onClick={() => downloadCreditReport(profile.farmer.id)}
                                  className="text-blue-600 hover:text-blue-900 text-xs font-semibold flex items-center gap-1"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  Dossier
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Selected Farmer Quick Inspector */}
              {selectedFarmerProfile && (
                <div className="mt-8 border-t pt-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">
                      Farmer Baseline Inspector:{' '}
                      <span className="font-mono text-green-700">
                        {selectedFarmerProfile.farmer.id}
                      </span>{' '}
                      &mdash; {selectedFarmerProfile.farmer.fullName}
                    </h3>
                    <button
                      onClick={() =>
                        openAdminAugmentationForFarmer(selectedFarmerProfile.farmer.id)
                      }
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm font-semibold flex items-center gap-2"
                    >
                      <Layers className="w-4 h-4" />
                      Open in Admin Augmentation Engine
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-800 mb-3">Initial Farmer Baseline</h4>
                      <div className="space-y-1.5 text-sm">
                        <p>
                          <strong>GHFA ID:</strong> {selectedFarmerProfile.farmer.id}
                        </p>
                        <p>
                          <strong>Age / Gender:</strong> {selectedFarmerProfile.farmer.age} yrs /{' '}
                          {selectedFarmerProfile.farmer.gender}
                        </p>
                        <p>
                          <strong>Experience:</strong>{' '}
                          {selectedFarmerProfile.farmer.farmingExperience} years
                        </p>
                        <p>
                          <strong>Phone:</strong> {selectedFarmerProfile.farmer.phone}
                        </p>
                        <p>
                          <strong>Ghana Card:</strong> {selectedFarmerProfile.farmer.ghanaCardId}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-800 mb-3">Farm &amp; Location Data</h4>
                      <div className="space-y-1.5 text-sm">
                        <p>
                          <strong>Size:</strong> {selectedFarmerProfile.farmer.farmSize} ha
                        </p>
                        <p>
                          <strong>Primary Crop:</strong>{' '}
                          {selectedFarmerProfile.farmer.extendedData?.primaryCrop || 'Maize'}
                        </p>
                        <p>
                          <strong>Location:</strong>{' '}
                          {selectedFarmerProfile.farmer.location.district},{' '}
                          {selectedFarmerProfile.farmer.location.region}
                        </p>
                        <p>
                          <strong>Zone:</strong>{' '}
                          {selectedFarmerProfile.farmer.location.agroEcologicalZone}
                        </p>
                        <p>
                          <strong>Irrigation:</strong>{' '}
                          {selectedFarmerProfile.farmer.irrigationAccess ? 'Yes' : 'No'}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-800 mb-3">
                        Bank-Ready Profile Output
                      </h4>
                      {selectedFarmerProfile.riskAssessment ? (
                        <div className="space-y-1.5 text-sm">
                          <p>
                            <strong>Score:</strong> {selectedFarmerProfile.riskAssessment.score}/100
                          </p>
                          <p>
                            <strong>Risk Tier:</strong>{' '}
                            {selectedFarmerProfile.riskAssessment.riskLevel}
                          </p>
                          <p>
                            <strong>Default Risk:</strong>{' '}
                            {selectedFarmerProfile.riskAssessment.defaultProbability.toFixed(1)}%
                          </p>
                          <p>
                            <strong>Safe Loan Amount:</strong> GH₵
                            {selectedFarmerProfile.riskAssessment.safeLoanAmount.toLocaleString()}
                          </p>
                        </div>
                      ) : (
                        <p className="text-amber-700 text-sm">
                          Pending Admin Secondary Data Augmentation. Click &ldquo;Open in Admin Augmentation Engine&rdquo; to append Earth Observation, Soil Science, and Demo Plot metrics.
                        </p>
                      )}
                    </div>
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
              <RiskAssessment
                initialFarmerId={selectedFarmerId}
                onProfileUpdated={() => loadData()}
              />
            </div>
          )}

          {activeModule === 'banks' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Bank Intelligence Dashboard (Published Profiles)
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Displays all bank-ready farmer profiles generated by combining Farmer Portal baseline inputs with Admin Risk Engine secondary data augmentation.
              </p>

              <div className="overflow-x-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                    <span className="ml-2 text-gray-600">Loading bank intelligence...</span>
                  </div>
                ) : bankIntelligence.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-gray-600 font-medium">
                      No Bank-Ready Profiles generated yet.
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Go to the <strong>Admin Risk &amp; Augmentation Engine</strong> tab to augment a registered farmer (e.g., GHFA001) and publish their bank-ready profile.
                    </p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                          GHFA ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Risk Score
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Default Probability
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Recommended Loan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bankIntelligence.map((record) => (
                        <tr key={record.farmerId} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap font-mono text-xs font-bold text-gray-900">
                            {record.farmerId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {record.farmerName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {record.location}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                record.riskCategory === 'Low'
                                  ? 'bg-green-100 text-green-800'
                                  : record.riskCategory === 'Medium'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {record.riskScore}/100 ({record.riskCategory})
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {record.defaultProbability.toFixed(1)}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                            GH₵{record.recommendedLoanAmount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                                record.loanStatus === 'eligible'
                                  ? 'bg-green-100 text-green-800'
                                  : record.loanStatus === 'conditional'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {record.loanStatus.replace('_', ' ')}
                            </span>
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
              <FarmSenseModule
                farmerId={selectedFarmerId || 'GHFA001'}
                onSoilDataUpdate={(data) => console.log('Soil data updated:', data)}
              />
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Digital Extension Services
              </h2>
              <DigitalExtensionAgent
                farmerId={selectedFarmerId || 'GHFA001'}
                currentSeason="Main"
                currentYear={2025}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CentralizedSystem;
