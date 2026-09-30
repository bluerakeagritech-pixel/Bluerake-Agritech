import React, { useState } from 'react';
import { Download, Filter, Search, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, DollarSign, Users, BarChart3, FileText } from 'lucide-react';
import type { BankGradeRiskAssessment, Farmer } from '../types';

interface BankDashboardProps {
  farmers: Farmer[];
  riskAssessments: BankGradeRiskAssessment[];
}

const BankDashboard: React.FC<BankDashboardProps> = ({ farmers, riskAssessments }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | 'Low' | 'Medium' | 'High'>('all');
  const [selectedFarmer, setSelectedFarmer] = useState<string | null>(null);

  // Mock data for demonstration
  const mockFarmers: Farmer[] = [
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
        region: 'Greater Accra',
        district: 'Accra',
        agroEcologicalZone: 'Coastal Savanna',
      },
      extensionScore: 72,
      performanceRatio: 0.9,
      created_at: '2024-02-01T00:00:00Z',
    },
  ];

  const mockAssessments: BankGradeRiskAssessment[] = [
    {
      score: 78,
      riskLevel: 'Low',
      defaultProbability: 8.5,
      profitCapacity: 12500,
      safeLoanAmount: 8000,
      recommendedRepaymentPeriod: 12,
      recommendations: [
        'Maintain current soil management practices',
        'Consider expanding irrigation coverage',
        'Monitor market prices for optimal selling timing',
      ],
      factors: {
        soilFertility: 0.85,
        ndviHealth: 0.78,
        climateRisk: 0.65,
        pestHistory: 0.90,
        marketAccess: 0.75,
        infrastructure: 0.80,
        landTenure: 1.0,
        farmerPerformance: 0.88,
        demoPlotComparison: 0.82,
      },
      created_at: '2024-01-20T00:00:00Z',
    },
    {
      score: 52,
      riskLevel: 'Medium',
      defaultProbability: 22.3,
      profitCapacity: 6800,
      safeLoanAmount: 4500,
      recommendedRepaymentPeriod: 18,
      recommendations: [
        'Improve soil fertility through FarmSense recommendations',
        'Join local farmer cooperative for better market access',
        'Implement pest management strategies',
      ],
      factors: {
        soilFertility: 0.45,
        ndviHealth: 0.62,
        climateRisk: 0.40,
        pestHistory: 0.55,
        marketAccess: 0.50,
        infrastructure: 0.45,
        landTenure: 0.75,
        farmerPerformance: 0.60,
        demoPlotComparison: 0.48,
      },
      created_at: '2024-02-05T00:00:00Z',
    },
  ];

  const filteredData = mockFarmers.map((farmer, index) => ({
    farmer,
    assessment: mockAssessments[index],
  })).filter(({ farmer, assessment }) => {
    const matchesSearch = farmer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         farmer.location.region.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === 'all' || assessment.riskLevel === riskFilter;
    return matchesSearch && matchesRisk;
  });

  const generateCreditReport = (farmerId: string) => {
    const data = filteredData.find(d => d.farmer.id === farmerId);
    if (!data) return;

    // In a real application, this would generate a PDF
    const reportData = {
      farmer: data.farmer,
      assessment: data.assessment,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `credit_report_${data.farmer.fullName.replace(' ', '_')}.json`;
    a.click();
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low': return <CheckCircle className="w-4 h-4" />;
      case 'Medium': return <Clock className="w-4 h-4" />;
      case 'High': return <AlertTriangle className="w-4 h-4" />;
      default: return <BarChart3 className="w-4 h-4" />;
    }
  };

  // Calculate summary statistics
  const totalFarmers = mockFarmers.length;
  const lowRiskCount = mockAssessments.filter(a => a.riskLevel === 'Low').length;
  const mediumRiskCount = mockAssessments.filter(a => a.riskLevel === 'Medium').length;
  const highRiskCount = mockAssessments.filter(a => a.riskLevel === 'High').length;
  const avgDefaultProbability = mockAssessments.reduce((sum, a) => sum + a.defaultProbability, 0) / mockAssessments.length;
  const totalLoanCapacity = mockAssessments.reduce((sum, a) => sum + a.safeLoanAmount, 0);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Bank Credit Intelligence Dashboard</h1>
        <p className="text-gray-600 mt-2">Comprehensive farmer credit assessment with soil intelligence and performance analytics</p>
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
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Low Risk</p>
              <p className="text-2xl font-semibold">{lowRiskCount}</p>
              <p className="text-xs text-gray-500">{((lowRiskCount / totalFarmers) * 100).toFixed(1)}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-4">
            <div className="bg-red-100 p-3 rounded-lg">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Default Risk</p>
              <p className="text-2xl font-semibold">{avgDefaultProbability.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Loan Capacity</p>
              <p className="text-2xl font-semibold">GH₵{(totalLoanCapacity / 1000).toFixed(0)}K</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
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
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Risk Levels</option>
              <option value="Low">Low Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="High">High Risk</option>
            </select>
          </div>

          <button
            onClick={() => {
              // Export all data
              const exportData = filteredData.map(d => ({
                farmer: d.farmer.fullName,
                region: d.farmer.location.region,
                riskLevel: d.assessment.riskLevel,
                defaultProbability: d.assessment.defaultProbability,
                safeLoanAmount: d.assessment.safeLoanAmount,
                performanceRatio: d.farmer.performanceRatio,
                extensionScore: d.farmer.extensionScore,
              }));
              
              const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'farmer_credit_analysis.json';
              a.click();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            Export Data
          </button>
        </div>
      </div>

      {/* Farmer Credit Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Farmer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Default Risk
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance Ratio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Safe Loan Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Extension Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map(({ farmer, assessment }) => (
                <tr key={farmer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{farmer.fullName}</div>
                      <div className="text-sm text-gray-500">{farmer.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{farmer.location.region}</div>
                    <div className="text-sm text-gray-500">{farmer.location.agroEcologicalZone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(assessment.riskLevel)}`}>
                      {getRiskIcon(assessment.riskLevel)}
                      {assessment.riskLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{assessment.defaultProbability.toFixed(1)}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-900">{farmer.performanceRatio.toFixed(2)}</span>
                      {farmer.performanceRatio > 1 ? (
                        <TrendingUp className="w-4 h-4 text-green-500 ml-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500 ml-1" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      GH₵{assessment.safeLoanAmount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {assessment.recommendedRepaymentPeriod} months
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${farmer.extensionScore}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">{farmer.extensionScore}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedFarmer(farmer.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => generateCreditReport(farmer.id)}
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                      >
                        <FileText className="w-4 h-4" />
                        Report
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed View Modal */}
      {selectedFarmer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {(() => {
                const data = filteredData.find(d => d.farmer.id === selectedFarmer);
                if (!data) return null;
                
                const { farmer, assessment } = data;
                
                return (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">Credit Assessment Details</h2>
                      <button
                        onClick={() => setSelectedFarmer(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Farmer Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">Farmer Profile</h3>
                        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                          <div><strong>Name:</strong> {farmer.fullName}</div>
                          <div><strong>Age:</strong> {farmer.age} years</div>
                          <div><strong>Experience:</strong> {farmer.farmingExperience} years</div>
                          <div><strong>Farm Size:</strong> {farmer.farmSize} hectares</div>
                          <div><strong>Location:</strong> {farmer.location.region}, {farmer.location.district}</div>
                          <div><strong>Agro-Ecological Zone:</strong> {farmer.location.agroEcologicalZone}</div>
                        </div>
                      </div>

                      {/* Risk Assessment */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">Risk Assessment</h3>
                        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                          <div><strong>Overall Score:</strong> {assessment.score}/100</div>
                          <div><strong>Risk Level:</strong> 
                            <span className={`ml-2 px-2 py-1 rounded text-sm ${getRiskColor(assessment.riskLevel)}`}>
                              {assessment.riskLevel}
                            </span>
                          </div>
                          <div><strong>Default Probability:</strong> {assessment.defaultProbability.toFixed(1)}%</div>
                          <div><strong>Profit Capacity:</strong> GH₵{assessment.profitCapacity.toLocaleString()}</div>
                          <div><strong>Safe Loan Amount:</strong> GH₵{assessment.safeLoanAmount.toLocaleString()}</div>
                          <div><strong>Repayment Period:</strong> {assessment.recommendedRepaymentPeriod} months</div>
                        </div>
                      </div>
                    </div>

                    {/* Risk Factors */}
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Risk Factors Analysis</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(assessment.factors).map(([factor, value]) => (
                          <div key={factor} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="capitalize font-medium">
                                {factor.replace(/([A-Z])/g, ' $1').trim()}
                              </span>
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

                    {/* Recommendations */}
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Recommendations</h3>
                      <ul className="space-y-2">
                        {assessment.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                            <span className="text-gray-700">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4 mt-8">
                      <button
                        onClick={() => generateCreditReport(farmer.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Download className="w-5 h-5" />
                        Download Credit Report
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankDashboard;