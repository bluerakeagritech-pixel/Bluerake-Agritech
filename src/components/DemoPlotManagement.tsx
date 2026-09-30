import React, { useState } from 'react';
import { Plus, Search, Filter, BarChart3, MapPin, Calendar, TrendingUp, Leaf } from 'lucide-react';
import type { DemoPlot } from '../types';
import AddDemoPlotForm from './AddDemoPlotForm';

const DemoPlotManagement = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'plots' | 'add'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterZone, setFilterZone] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  // Mock demo plot data
  const [demoPlots] = useState<DemoPlot[]>([
    {
      id: 'demo_1',
      agroEcologicalZone: 'Forest Zone',
      cropType: 'Maize',
      variety: 'Obatanpa',
      season: 'Main',
      year: 2024,
      soilTestResults: {
        pH: 6.8,
        nitrogen: 0.18,
        phosphorus: 28,
        potassium: 165,
        soilFertilityScore: 85
      },
      fertilizerUsed: [
        { type: 'NPK 15-15-15', quantity: 200, cost: 450 },
        { type: 'Urea', quantity: 100, cost: 180 }
      ],
      yieldAchieved: 4.2,
      weatherConditions: {
        rainfall: 1350,
        temperature: 26,
        humidity: 75
      },
      productionCost: 2800,
      marketPrice: 3200,
      profit: 10640,
      extensionOfficer: 'John Mensah',
      created_at: '2024-01-15T00:00:00Z'
    },
    {
      id: 'demo_2',
      agroEcologicalZone: 'Coastal Savanna',
      cropType: 'Rice',
      variety: 'Jasmine 85',
      season: 'Main',
      year: 2024,
      soilTestResults: {
        pH: 6.2,
        nitrogen: 0.15,
        phosphorus: 22,
        potassium: 140,
        soilFertilityScore: 72
      },
      fertilizerUsed: [
        { type: 'NPK 15-15-15', quantity: 150, cost: 340 },
        { type: 'Urea', quantity: 80, cost: 145 }
      ],
      yieldAchieved: 3.8,
      weatherConditions: {
        rainfall: 1100,
        temperature: 28,
        humidity: 68
      },
      productionCost: 3200,
      marketPrice: 3800,
      profit: 11240,
      extensionOfficer: 'Grace Addo',
      created_at: '2024-02-01T00:00:00Z'
    }
  ]);

  const agroEcologicalZones = ['Forest Zone', 'Coastal Savanna', 'Guinea Savanna', 'Sudan Savanna'];
  
  const filteredPlots = demoPlots.filter(plot => {
    const matchesSearch = plot.cropType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plot.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plot.agroEcologicalZone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesZone = filterZone === 'all' || plot.agroEcologicalZone === filterZone;
    return matchesSearch && matchesZone;
  });

  const calculateAverageYield = (zone: string, crop: string) => {
    const zonePlots = demoPlots.filter(p => p.agroEcologicalZone === zone && p.cropType === crop);
    if (zonePlots.length === 0) return 0;
    return zonePlots.reduce((sum, plot) => sum + plot.yieldAchieved, 0) / zonePlots.length;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Demo Plot Management</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Demo Plot
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('plots')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'plots'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Demo Plots
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Plots</p>
                  <p className="text-2xl font-semibold">{demoPlots.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Agro-Ecological Zones</p>
                  <p className="text-2xl font-semibold">{agroEcologicalZones.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg Yield</p>
                  <p className="text-2xl font-semibold">
                    {(demoPlots.reduce((sum, plot) => sum + plot.yieldAchieved, 0) / demoPlots.length).toFixed(1)} MT/ha
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-4">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Leaf className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Crop Types</p>
                  <p className="text-2xl font-semibold">
                    {new Set(demoPlots.map(plot => plot.cropType)).size}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Zone Performance */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Performance by Agro-Ecological Zone</h2>
            <div className="space-y-4">
              {agroEcologicalZones.map(zone => {
                const zonePlots = demoPlots.filter(p => p.agroEcologicalZone === zone);
                const avgYield = zonePlots.length > 0 
                  ? zonePlots.reduce((sum, plot) => sum + plot.yieldAchieved, 0) / zonePlots.length 
                  : 0;
                
                return (
                  <div key={zone} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-800">{zone}</h3>
                      <p className="text-sm text-gray-600">{zonePlots.length} demo plots</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-green-600">{avgYield.toFixed(1)} MT/ha</p>
                      <p className="text-sm text-gray-500">Average yield</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'plots' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex gap-4 items-center">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search plots..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <select
                  value={filterZone}
                  onChange={(e) => setFilterZone(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All Zones</option>
                  {agroEcologicalZones.map(zone => (
                    <option key={zone} value={zone}>{zone}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Demo Plots Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPlots.map(plot => (
              <div key={plot.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{plot.cropType} - {plot.variety}</h3>
                    <p className="text-sm text-gray-600">{plot.agroEcologicalZone}</p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                    {plot.season} {plot.year}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Yield Achieved</p>
                    <p className="text-xl font-semibold text-green-600">{plot.yieldAchieved} MT/ha</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Profit</p>
                    <p className="text-xl font-semibold text-blue-600">GH₵{plot.profit.toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Soil Fertility Score</span>
                    <span>{plot.soilTestResults.soilFertilityScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${plot.soilTestResults.soilFertilityScore}%` }}
                    />
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  <p><strong>Extension Officer:</strong> {plot.extensionOfficer}</p>
                  <p><strong>Production Cost:</strong> GH₵{plot.productionCost.toLocaleString()}</p>
                  <p><strong>Market Price:</strong> GH₵{plot.marketPrice}/MT</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Demo Plot Form Modal */}
      {showAddForm && (
        <AddDemoPlotForm
          onClose={() => setShowAddForm(false)}
          onDemoPlotAdded={(demoPlot) => {
            // Refresh the demo plots list
            setShowAddForm(false);
          }}
        />
      )}
    </div>
  );
};

export default DemoPlotManagement;