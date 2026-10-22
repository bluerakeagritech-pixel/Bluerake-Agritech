import React, { useState } from 'react';
import { Building, Search, Filter, Download, Eye, TrendingUp, Users, DollarSign, FileText } from 'lucide-react';
import { centralIntelligence, type BankIntelligenceRecord } from '../services/centralIntelligence';

interface BankPortalProps {
  bankId: string;
}

const BankPortal: React.FC<BankPortalProps> = ({ bankId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | 'Low' | 'Medium' | 'High'>('all');
  const [selectedFarmerId, setSelectedFarmerId] = useState<string | null>(null);
  const [bankIntelligence, setBankIntelligence] = useState<BankIntelligenceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFarmerData, setSelectedFarmerData] = useState<any>(null);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const data = await centralIntelligence.getBankIntelligence();
        setBankIntelligence(data || []);
      } catch (error) {
        console.error("Failed to load bank intelligence", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  React.useEffect(() => {
    const loadProfile = async () => {
      if (selectedFarmerId) {
        try {
          const data = await centralIntelligence.getBankFarmerProfile(selectedFarmerId);
          setSelectedFarmerData(data);
        } catch (error) {
          console.error("Failed to load profile", error);
        }
      } else {
        setSelectedFarmerData(null);
      }
    };
    loadProfile();
  }, [selectedFarmerId]);

  const normalizedSearch = searchTerm.trim().toLowerCase().replace('-', '');
  const filteredIntelligence = bankIntelligence.filter(record => {
    const matchesSearch = !normalizedSearch ||
                         record.farmerId.toLowerCase().replace('-', '').includes(normalizedSearch) ||
                         record.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === 'all' || record.riskCategory === riskFilter;
    return matchesSearch && matchesRisk;
  });

  const generateCreditReport = async (farmerId: string) => {
    try {
      const report = await centralIntelligence.generateCreditReport(farmerId);
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `credit_report_${report.farmer.fullName.replace(' ', '_')}.json`;
      a.click();
    } catch (error) {
      alert(`Error generating credit report: ${error}`);
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Calculate summary statistics
  const totalFarmers = bankIntelligence.length;
  const eligibleFarmers = bankIntelligence.filter(r => r.loanStatus === 'eligible').length;
  const avgRiskScore = bankIntelligence.length > 0 ? 
    bankIntelligence.reduce((sum, r) => sum + r.riskScore, 0) / bankIntelligence.length : 0;
  const totalLoanCapacity = bankIntelligence.reduce((sum, r) => sum + r.recommendedLoanAmount, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading Bank Intelligence Data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">Bank Credit Intelligence Portal</h1>
                <p className="text-sm text-gray-500">Decision Support System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Intelligence Viewing Window
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Alert */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <Eye className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
            <div>
              <h3 className="font-medium text-blue-800">Intelligence Viewing Portal</h3>
              <p className="text-sm text-blue-700 mt-1">
                All data is processed and analyzed by the BlueRakeAgriTech Ghana Central System. 
                You can view farmer intelligence, risk assessments, and download credit reports.
                You cannot modify any data or run assessments.
              </p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Farmers</p>
                <p className="text-2xl font-semibold">{totalFarmers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Loan Eligible</p>
                <p className="text-2xl font-semibold">{eligibleFarmers}</p>
                <p className="text-xs text-gray-500">{totalFarmers > 0 ? ((eligibleFarmers / totalFarmers) * 100).toFixed(1) : 0}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Risk Score</p>
                <p className="text-2xl font-semibold">{avgRiskScore.toFixed(1)}</p>
                <p className="text-xs text-gray-500">Out of 100</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Loan Capacity</p>
                <p className="text-2xl font-semibold">GH₵{(totalLoanCapacity / 1000000).toFixed(1)}M</p>
                <p className="text-xs text-gray-500">Total Available</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search farmers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Risk Levels</option>
                <option value="Low">Low Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="High">High Risk</option>
              </select>
            </div>

            <button
              onClick={() => {
                const exportData = filteredIntelligence.map(r => ({
                  farmerId: r.farmerId,
                  farmerName: r.farmerName,
                  location: r.location,
                  riskScore: r.riskScore,
                  riskCategory: r.riskCategory,
                  defaultProbability: r.defaultProbability,
                  recommendedLoanAmount: r.recommendedLoanAmount,
                  loanStatus: r.loanStatus
                }));
                
                const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'farmer_intelligence_data.json';
                a.click();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              Export Intelligence
            </button>
          </div>
        </div>

        {/* Farmer Intelligence Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Farmer ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Assessment Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Default Probability (%)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profit Capacity (GH₵)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recommended Loan Amount (GH₵)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loan Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredIntelligence.map((record) => (
                  <tr key={record.farmerId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {record.farmerId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.farmerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(record.riskCategory)}`}>
                        {record.riskScore}/100
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.defaultProbability.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      GH₵{record.profitCapacity.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      GH₵{record.recommendedLoanAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        record.loanStatus === 'eligible' ? 'bg-green-100 text-green-800' :
                        record.loanStatus === 'conditional' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {record.loanStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedFarmerId(record.farmerId)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Profile
                        </button>
                        <button
                          onClick={() => generateCreditReport(record.farmerId)}
                          className="text-green-600 hover:text-green-900 flex items-center gap-1"
                        >
                          <FileText className="w-4 h-4" />
                          Credit Report
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Farmer Profile Modal */}
        {selectedFarmerData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Farmer Intelligence Profile</h2>
                  <button
                    onClick={() => setSelectedFarmerId(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Risk Intelligence */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Risk Intelligence</h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div><strong>Risk Score:</strong> {selectedFarmerData.intelligence.riskScore}/100</div>
                      <div><strong>Risk Category:</strong> 
                        <span className={`ml-2 px-2 py-1 rounded text-sm ${getRiskColor(selectedFarmerData.intelligence.riskCategory)}`}>
                          {selectedFarmerData.intelligence.riskCategory}
                        </span>
                      </div>
                      <div><strong>Default Probability:</strong> {selectedFarmerData.intelligence.defaultProbability.toFixed(1)}%</div>
                    </div>
                  </div>

                  {/* Production Intelligence */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Production Intelligence</h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div><strong>Farm Size:</strong> {selectedFarmerData.intelligence.farmSize} ha</div>
                      <div><strong>Crop Type:</strong> {selectedFarmerData.intelligence.cropType}</div>
                      <div><strong>Season:</strong> {selectedFarmerData.intelligence.season}</div>
                      {selectedFarmerData.profile.farmSenseData && (
                        <div><strong>Soil Health:</strong> {selectedFarmerData.profile.farmSenseData.soilData.soilFertilityScore}%</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Financial Intelligence */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Financial Intelligence</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div><strong>Profit Capacity:</strong> GH₵{selectedFarmerData.intelligence.profitCapacity.toLocaleString()}</div>
                      <div><strong>Recommended Loan:</strong> GH₵{selectedFarmerData.intelligence.recommendedLoanAmount.toLocaleString()}</div>
                      <div><strong>Repayment Period:</strong> {selectedFarmerData.intelligence.repaymentPeriod} months</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div><strong>Loan Status:</strong> 
                        <span className={`ml-2 px-2 py-1 rounded text-sm ${
                          selectedFarmerData.intelligence.loanStatus === 'eligible' ? 'bg-green-100 text-green-800' :
                          selectedFarmerData.intelligence.loanStatus === 'conditional' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {selectedFarmerData.intelligence.loanStatus}
                        </span>
                      </div>
                      <div><strong>Last Assessment:</strong> {new Date(selectedFarmerData.intelligence.lastAssessment).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 mt-8">
                  <button
                    onClick={() => generateCreditReport(selectedFarmerData.intelligence.farmerId)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    Download Credit Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BankPortal;