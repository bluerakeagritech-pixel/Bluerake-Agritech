import React, { useState, useEffect, useCallback } from 'react';
import {
  Calculator,
  Search,
  User,
  MapPin,
  Sprout,
  Satellite,
  BarChart3,
  Shield,
  CheckCircle,
  Clock,
  Save,
  Download,
  RefreshCw,
  Sliders,
  Layers,
  Award,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  centralIntelligence,
  normalizeGhfaId,
  type FarmerIntelligenceProfile,
} from '../services/centralIntelligence';
import type { AdminAugmentationData, BankGradeRiskAssessment } from '../types';

interface RiskAssessmentProps {
  initialFarmerId?: string | null;
  onProfileUpdated?: () => void;
}

const getDefaultAugmentation = (
  profile?: FarmerIntelligenceProfile | null
): AdminAugmentationData => {
  const existing = profile?.farmer.extendedData?.adminAugmentation;
  if (existing) return existing;

  const farmer = profile?.farmer;
  const today = new Date().toISOString().split('T')[0];

  return {
    earthObservation: {
      ndviScore: farmer?.extendedData?.vegetationHealth?.ndviScore || 0.68,
      vegetationStatus: 'good',
      vhiDroughtStatus: 'normal',
      soilMoistureIndex: 64,
      rainfallPattern: 'bimodal',
      annualRainfallMm: 1350,
      droughtRisk: 'low',
      floodRisk: 'low',
      imagerySource: 'Sentinel-2 / Google Earth Pro',
      observationDate: today,
    },
    soilScience: {
      pH: farmer?.extendedData?.soilData?.pH || 6.4,
      nitrogen: 0.18,
      phosphorus: 28,
      potassium: 165,
      organicMatter: farmer?.extendedData?.soilData?.organicMatter || 2.8,
      moisture: farmer?.extendedData?.soilData?.moisture || 24,
      soilTexture: farmer?.extendedData?.soilData?.soilType || 'loamy',
      soilDepth: 'medium',
      soilFertilityScore: 76,
      fertilizerRecommendation:
        'Apply NPK 15-15-15 at 250 kg/ha basal + Urea top-dressing at 4 weeks.',
      labReportDate: today,
    },
    demoPlotData: {
      farmerExpectedYield: 3.8,
      benchmarkYield: 3.5,
      performanceRatio: farmer?.performanceRatio || 1.09,
      extensionComplianceScore: farmer?.extensionScore || 84,
      pestControlCapacity: 'medium',
      extensionOfficer: 'BlueRake Field Science Team',
      fieldNotes:
        'Field boundary and crop stand verified against agro-ecological zone demo plot.',
    },
    augmentedBy: 'Central System Admin',
    augmentedAt: new Date().toISOString(),
  };
};

export default function RiskAssessment({
  initialFarmerId,
  onProfileUpdated,
}: RiskAssessmentProps) {
  const [farmers, setFarmers] = useState<FarmerIntelligenceProfile[]>([]);
  const [loadingFarmers, setLoadingFarmers] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'ready'>('all');

  const [selectedFarmerId, setSelectedFarmerId] = useState<string>(initialFarmerId || '');
  const [selectedProfile, setSelectedProfile] = useState<FarmerIntelligenceProfile | null>(null);

  // Admin Manual Augmentation State
  const [augmentation, setAugmentation] = useState<AdminAugmentationData>(
    getDefaultAugmentation(null)
  );

  // Optional Manual Override for Final Bank-Ready Metrics
  const [useManualRiskOverride, setUseManualRiskOverride] = useState(false);
  const [manualScore, setManualScore] = useState<number>(78);
  const [manualRiskLevel, setManualRiskLevel] = useState<'Low' | 'Medium' | 'High'>('Low');
  const [manualSafeLoan, setManualSafeLoan] = useState<number>(12000);
  const [manualRepaymentMonths, setManualRepaymentMonths] = useState<number>(12);

  const [saving, setSaving] = useState(false);
  const [activeStepTab, setActiveStepTab] = useState<'augment' | 'output'>('augment');

  const loadFarmers = useCallback(async () => {
    setLoadingFarmers(true);
    try {
      const list = await centralIntelligence.getAllFarmers();
      setFarmers(list);
      if (initialFarmerId) {
        const target = list.find(
          (p) => normalizeGhfaId(p.farmer.id) === normalizeGhfaId(initialFarmerId)
        );
        if (target) {
          setSelectedFarmerId(target.farmer.id);
          setSelectedProfile(target);
          setAugmentation(getDefaultAugmentation(target));
        }
      } else if (!selectedFarmerId && list.length > 0) {
        setSelectedFarmerId(list[0].farmer.id);
        setSelectedProfile(list[0]);
        setAugmentation(getDefaultAugmentation(list[0]));
      }
    } catch (err) {
      console.error('Failed to load farmers in Admin Risk Engine:', err);
    } finally {
      setLoadingFarmers(false);
    }
  }, [initialFarmerId, selectedFarmerId]);

  useEffect(() => {
    loadFarmers();
  }, [loadFarmers]);

  const handleSelectFarmer = async (farmerId: string) => {
    setSelectedFarmerId(farmerId);
    const profile = await centralIntelligence.getFarmerProfile(farmerId);
    if (profile) {
      setSelectedProfile(profile);
      const defaultAug = getDefaultAugmentation(profile);
      setAugmentation(defaultAug);

      const preview = centralIntelligence.calculateCombinedAssessmentPreview(
        profile.farmer,
        defaultAug
      );
      setManualScore(profile.riskAssessment?.score ?? preview.score);
      setManualRiskLevel(profile.riskAssessment?.riskLevel ?? preview.riskLevel);
      setManualSafeLoan(profile.riskAssessment?.safeLoanAmount ?? preview.safeLoanAmount);
      setManualRepaymentMonths(
        profile.riskAssessment?.recommendedRepaymentPeriod ??
          preview.recommendedRepaymentPeriod
      );
      setActiveStepTab('augment');
    }
  };

  // Normalize search query so "GHFA-001" and "GHFA001" both match
  const normalizedQuery = searchTerm.trim().toLowerCase().replace('-', '');
  const filteredFarmers = farmers.filter((profile) => {
    const idNorm = profile.farmer.id.toLowerCase().replace('-', '');
    const matchesSearch =
      !normalizedQuery ||
      idNorm.includes(normalizedQuery) ||
      profile.farmer.fullName.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
      profile.farmer.location.region.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
      profile.farmer.location.district.toLowerCase().includes(searchTerm.trim().toLowerCase());

    const isReady = Boolean(profile.riskAssessment);
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'ready' && isReady) ||
      (statusFilter === 'pending' && !isReady);

    return matchesSearch && matchesStatus;
  });

  // Live preview of combined calculation (Farmer Baseline + Admin Augmentation)
  const livePreviewAssessment: BankGradeRiskAssessment | null = selectedProfile
    ? centralIntelligence.calculateCombinedAssessmentPreview(
        selectedProfile.farmer,
        augmentation
      )
    : null;

  const handleYieldChange = (farmerYield: number, benchmarkYield: number) => {
    const ratio =
      benchmarkYield > 0 ? Math.round((farmerYield / benchmarkYield) * 100) / 100 : 1.0;
    setAugmentation({
      ...augmentation,
      demoPlotData: {
        ...augmentation.demoPlotData,
        farmerExpectedYield: farmerYield,
        benchmarkYield,
        performanceRatio: ratio,
      },
    });
  };

  const handleSaveAndGenerateBankProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProfile) {
      toast.error('Please select a registered farmer (GHFA-XXX) first.');
      return;
    }

    setSaving(true);
    try {
      const overrides: Partial<BankGradeRiskAssessment> | undefined = useManualRiskOverride
        ? {
            score: manualScore,
            riskLevel: manualRiskLevel,
            safeLoanAmount: manualSafeLoan,
            profitCapacity: Math.round(manualSafeLoan * 1.65),
            recommendedRepaymentPeriod: manualRepaymentMonths,
          }
        : undefined;

      const result = await centralIntelligence.saveAdminAugmentation(
        selectedProfile.farmer.id,
        augmentation,
        overrides
      );

      setSelectedProfile(result.profile);
      await loadFarmers();
      if (onProfileUpdated) onProfileUpdated();

      toast.success(
        `Bank-Ready Profile generated for ${result.profile.farmer.id} (${result.profile.farmer.fullName})!`
      );
      setActiveStepTab('output');
    } catch (error) {
      console.error('Error saving admin augmentation:', error);
      toast.error(`Failed to generate profile: ${error}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadDossier = async () => {
    if (!selectedProfile) return;
    try {
      const report = await centralIntelligence.generateCreditReport(selectedProfile.farmer.id);
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedProfile.farmer.id}_Bank_Ready_Profile_${selectedProfile.farmer.fullName.replace(/\s+/g, '_')}.json`;
      a.click();
      toast.success(`Downloaded dossier for ${selectedProfile.farmer.id}`);
    } catch (err) {
      toast.error(`Could not download report: ${err}`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Architecture Status Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-amber-900 text-sm">
              Manual-Augmentation Workflow Active (Automated Risk Engine Offline)
            </h3>
            <p className="text-xs text-amber-800 mt-0.5">
              Retrieve any registered farmer via their sequential{' '}
              <code className="font-mono font-bold">GHFAxxx</code> ID, review their primary baseline data captured at the Farmer Portal, and manually append secondary Earth Observation, Soil Science, and Demo Plot data below to generate the final bank-ready profile.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={loadFarmers}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-amber-300 text-amber-900 rounded-lg text-xs font-semibold hover:bg-amber-100 self-start sm:self-center flex-shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Registry
        </button>
      </div>

      {/* STEP 1: SEARCHABLE GHFA-XXX DATABASE */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Search className="w-5 h-5 text-green-600" />
              1. Retrieve Registered Farmer by GHFA-XXX ID
            </h2>
            <p className="text-xs text-gray-500">
              Search the central database by sequential ID (e.g., <code className="font-mono">GHFA001</code> or <code className="font-mono">GHFA-001</code>), farmer name, or region.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {(['all', 'pending', 'ready'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                  statusFilter === st
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {st === 'all'
                  ? `All (${farmers.length})`
                  : st === 'pending'
                  ? `Pending Augmentation (${farmers.filter((f) => !f.riskAssessment).length})`
                  : `Bank-Ready (${farmers.filter((f) => Boolean(f.riskAssessment)).length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by GHFA ID (e.g., GHFA001, GHFA-002), Farmer Name, District, or Region..."
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 text-sm"
          />
        </div>

        {/* Search Results Grid */}
        {loadingFarmers ? (
          <div className="py-8 text-center text-gray-500 text-sm">
            Loading central farmer registry...
          </div>
        ) : filteredFarmers.length === 0 ? (
          <div className="py-6 text-center text-gray-500 text-sm bg-gray-50 rounded-lg">
            No matching farmer profiles found for &ldquo;{searchTerm}&rdquo;.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto pr-1">
            {filteredFarmers.map((item) => {
              const isSelected = item.farmer.id === selectedProfile?.farmer.id;
              const isAugmented = Boolean(item.riskAssessment);
              return (
                <button
                  key={item.farmer.id}
                  type="button"
                  onClick={() => handleSelectFarmer(item.farmer.id)}
                  className={`text-left p-3.5 rounded-xl border transition-all flex items-start justify-between gap-2 ${
                    isSelected
                      ? 'border-green-600 bg-green-50/70 ring-2 ring-green-500/30'
                      : 'border-gray-200 hover:border-green-400 bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-slate-900 text-white">
                        {item.farmer.id}
                      </span>
                      <span className="font-bold text-gray-900 text-sm truncate">
                        {item.farmer.fullName}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.farmer.location.region} &bull; {item.farmer.farmSize} ha &bull;{' '}
                      {item.farmer.extendedData?.primaryCrop || 'Maize'}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-semibold flex-shrink-0 ${
                      isAugmented
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {isAugmented ? 'Bank-Ready' : 'Pending'}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* STEP 2 & 3: SELECTED FARMER WORKSPACE */}
      {selectedProfile && (
        <div className="space-y-6">
          {/* Initial Farmer Registration Data Display (Read-Only Baseline) */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <span className="px-3.5 py-1.5 rounded-xl bg-green-700 text-white font-mono font-extrabold text-lg">
                  {selectedProfile.farmer.id}
                </span>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Initial Baseline Data Loaded from Farmer Portal:{' '}
                    {selectedProfile.farmer.fullName}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Registered on{' '}
                    {new Date(selectedProfile.farmer.created_at).toLocaleDateString()} &bull;
                    Primary Key linking all Soil, Satellite &amp; Banking Intelligence
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveStepTab('augment')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                    activeStepTab === 'augment'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Admin Augmentation Form
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStepTab('output')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                    activeStepTab === 'output'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Final Bank-Ready Output
                </button>
              </div>
            </div>

            {/* Clean Display of Initial Farmer Data */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/70">
                <h4 className="font-bold text-gray-800 mb-2.5 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                  <User className="w-4 h-4 text-green-600" />
                  Farmer Identity Baseline
                </h4>
                <div className="space-y-1.5 text-xs">
                  <p className="flex justify-between">
                    <span className="text-gray-500">Farmer ID:</span>
                    <strong className="font-mono text-gray-900">{selectedProfile.farmer.id}</strong>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-500">Full Name:</span>
                    <strong className="text-gray-900">{selectedProfile.farmer.fullName}</strong>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-500">Age / Gender:</span>
                    <strong className="text-gray-900 capitalize">
                      {selectedProfile.farmer.age} yrs / {selectedProfile.farmer.gender}
                    </strong>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-500">Experience:</span>
                    <strong className="text-gray-900">
                      {selectedProfile.farmer.farmingExperience} years
                    </strong>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-500">Phone:</span>
                    <strong className="text-gray-900">{selectedProfile.farmer.phone || 'N/A'}</strong>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-500">Ghana Card:</span>
                    <strong className="text-gray-900">
                      {selectedProfile.farmer.ghanaCardId || 'N/A'}
                    </strong>
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/70">
                <h4 className="font-bold text-gray-800 mb-2.5 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  Farm &amp; Location Baseline
                </h4>
                <div className="space-y-1.5 text-xs">
                  <p className="flex justify-between">
                    <span className="text-gray-500">Region / District:</span>
                    <strong className="text-gray-900">
                      {selectedProfile.farmer.location.region}
                      {selectedProfile.farmer.location.district
                        ? `, ${selectedProfile.farmer.location.district}`
                        : ''}
                    </strong>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-500">Ecological Zone:</span>
                    <strong className="text-gray-900">
                      {selectedProfile.farmer.location.agroEcologicalZone || 'Forest Zone'}
                    </strong>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-500">Farm Size:</span>
                    <strong className="text-gray-900">{selectedProfile.farmer.farmSize} Hectares</strong>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-500">Primary Crop:</span>
                    <strong className="text-gray-900">
                      {selectedProfile.farmer.extendedData?.primaryCrop || 'Maize'}
                    </strong>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-500">Land Tenure:</span>
                    <strong className="text-gray-900 capitalize">
                      {selectedProfile.farmer.extendedData?.landTenure || 'owned'}
                    </strong>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-500">Irrigation / Mech:</span>
                    <strong className="text-gray-900">
                      {selectedProfile.farmer.irrigationAccess ? 'Irrigated' : 'Rainfed'} /{' '}
                      {selectedProfile.farmer.mechanisationAccess ? 'Mechanized' : 'Manual'}
                    </strong>
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/70">
                <h4 className="font-bold text-gray-800 mb-2.5 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                  <Shield className="w-4 h-4 text-purple-600" />
                  Operational &amp; Social Baseline
                </h4>
                <div className="space-y-1.5 text-xs">
                  <p className="flex justify-between">
                    <span className="text-gray-500">Crop Rotation:</span>
                    <strong className="text-gray-900">
                      {selectedProfile.farmer.extendedData?.cropManagement.practicesCropRotation
                        ? 'Yes'
                        : 'No'}
                    </strong>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-500">Quality Seeds / Fert:</span>
                    <strong className="text-gray-900">
                      {selectedProfile.farmer.extendedData?.inputAccess.qualitySeeds ? 'Yes' : 'No'}{' '}
                      / {selectedProfile.farmer.extendedData?.inputAccess.fertilizer ? 'Yes' : 'No'}
                    </strong>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-500">Road / Storage Access:</span>
                    <strong className="text-gray-900">
                      {selectedProfile.farmer.extendedData?.infrastructure.roadAccess
                        ? 'Yes'
                        : 'No'}{' '}
                      /{' '}
                      {selectedProfile.farmer.extendedData?.infrastructure.storageFacilities
                        ? 'Yes'
                        : 'No'}
                    </strong>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-500">Cooperative / FBO:</span>
                    <strong className="text-gray-900">
                      {selectedProfile.farmer.extendedData?.socialFinancial.cooperativeMember
                        ? selectedProfile.farmer.extendedData?.socialFinancial.cooperativeName ||
                          'Active Member'
                        : 'Non-Member'}
                    </strong>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-500">VSLA / Savings:</span>
                    <strong className="text-gray-900">
                      {selectedProfile.farmer.extendedData?.socialFinancial.hasSavings
                        ? 'Yes'
                        : 'No'}
                    </strong>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-500">Current Status:</span>
                    <strong
                      className={
                        selectedProfile.riskAssessment ? 'text-emerald-700' : 'text-amber-700'
                      }
                    >
                      {selectedProfile.riskAssessment
                        ? 'Augmented & Bank-Ready'
                        : 'Awaiting Admin Augmentation'}
                    </strong>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* TAB A: ADMIN MANUAL DATA AUGMENTATION FORM */}
          {activeStepTab === 'augment' && (
            <form onSubmit={handleSaveAndGenerateBankProfile} className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-8">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Layers className="w-6 h-6 text-purple-600" />
                    2. Admin Secondary Data Augmentation Module
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Manually input the secondary scientific observations below to augment{' '}
                    <strong className="font-mono">{selectedProfile.farmer.id}</strong>&apos;s pre-loaded baseline profile.
                  </p>
                </div>

                {/* Module A: Earth Observation & Satellite Metrics */}
                <div className="bg-cyan-50/50 border border-cyan-200/80 rounded-xl p-5 space-y-4">
                  <h4 className="text-base font-bold text-cyan-950 flex items-center gap-2">
                    <Satellite className="w-5 h-5 text-cyan-600" />
                    A. Earth Observation &amp; Geospatial Metrics (Satellite Imagery)
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        NDVI Vegetation Score (0.00 - 1.00) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="1"
                        required
                        value={augmentation.earthObservation.ndviScore}
                        onChange={(e) =>
                          setAugmentation({
                            ...augmentation,
                            earthObservation: {
                              ...augmentation.earthObservation,
                              ndviScore: parseFloat(e.target.value) || 0,
                            },
                          })
                        }
                        className="w-full p-2.5 border border-gray-300 rounded-lg bg-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        VHI Drought Status
                      </label>
                      <select
                        value={augmentation.earthObservation.vhiDroughtStatus}
                        onChange={(e) =>
                          setAugmentation({
                            ...augmentation,
                            earthObservation: {
                              ...augmentation.earthObservation,
                              vhiDroughtStatus: e.target.value as any,
                            },
                          })
                        }
                        className="w-full p-2.5 border border-gray-300 rounded-lg bg-white text-sm"
                      >
                        <option value="normal">Normal (No Stress)</option>
                        <option value="mild">Mild Stress</option>
                        <option value="moderate">Moderate Drought</option>
                        <option value="severe">Severe Drought</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Soil Moisture Index (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={augmentation.earthObservation.soilMoistureIndex}
                        onChange={(e) =>
                          setAugmentation({
                            ...augmentation,
                            earthObservation: {
                              ...augmentation.earthObservation,
                              soilMoistureIndex: Number(e.target.value),
                            },
                          })
                        }
                        className="w-full p-2.5 border border-gray-300 rounded-lg bg-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Rainfall Pattern
                      </label>
                      <select
                        value={augmentation.earthObservation.rainfallPattern}
                        onChange={(e) =>
                          setAugmentation({
                            ...augmentation,
                            earthObservation: {
                              ...augmentation.earthObservation,
                              rainfallPattern: e.target.value as any,
                            },
                          })
                        }
                        className="w-full p-2.5 border border-gray-300 rounded-lg bg-white text-sm"
                      >
                        <option value="bimodal">Bimodal (2 Rainy Seasons)</option>
                        <option value="unimodal">Unimodal (1 Rainy Season)</option>
                        <option value="irregular">Irregular / Erratic</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Annual Rainfall (mm)
                      </label>
                      <input
                        type="number"
                        value={augmentation.earthObservation.annualRainfallMm}
                        onChange={(e) =>
                          setAugmentation({
                            ...augmentation,
                            earthObservation: {
                              ...augmentation.earthObservation,
                              annualRainfallMm: Number(e.target.value),
                            },
                          })
                        }
                        className="w-full p-2.5 border border-gray-300 rounded-lg bg-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Drought Risk Classification
                      </label>
                      <select
                        value={augmentation.earthObservation.droughtRisk}
                        onChange={(e) =>
                          setAugmentation({
                            ...augmentation,
                            earthObservation: {
                              ...augmentation.earthObservation,
                              droughtRisk: e.target.value as any,
                            },
                          })
                        }
                        className="w-full p-2.5 border border-gray-300 rounded-lg bg-white text-sm"
                      >
                        <option value="low">Low Risk</option>
                        <option value="medium">Medium Risk</option>
                        <option value="high">High Risk</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Flood Risk Classification
                      </label>
                      <select
                        value={augmentation.earthObservation.floodRisk}
                        onChange={(e) =>
                          setAugmentation({
                            ...augmentation,
                            earthObservation: {
                              ...augmentation.earthObservation,
                              floodRisk: e.target.value as any,
                            },
                          })
                        }
                        className="w-full p-2.5 border border-gray-300 rounded-lg bg-white text-sm"
                      >
                        <option value="low">Low Risk</option>
                        <option value="medium">Medium Risk</option>
                        <option value="high">High Risk</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Satellite Imagery Source
                      </label>
                      <input
                        type="text"
                        value={augmentation.earthObservation.imagerySource}
                        onChange={(e) =>
                          setAugmentation({
                            ...augmentation,
                            earthObservation: {
                              ...augmentation.earthObservation,
                              imagerySource: e.target.value,
                            },
                          })
                        }
                        className="w-full p-2.5 border border-gray-300 rounded-lg bg-white text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Module B: Soil Science Results (FarmSense / Lab Data) */}
                <div className="bg-orange-50/50 border border-orange-200/80 rounded-xl p-5 space-y-4">
                  <h4 className="text-base font-bold text-orange-950 flex items-center gap-2">
                    <Sprout className="w-5 h-5 text-orange-600" />
                    B. Soil Science &amp; FarmSense Laboratory Results
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Soil pH Level (0 - 14) *
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="14"
                        required
                        value={augmentation.soilScience.pH}
                        onChange={(e) =>
                          setAugmentation({
                            ...augmentation,
                            soilScience: {
                              ...augmentation.soilScience,
                              pH: parseFloat(e.target.value) || 0,
                            },
                          })
                        }
                        className="w-full p-2.5 border border-gray-300 rounded-lg bg-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Soil Fertility Score (0 - 100) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        required
                        value={augmentation.soilScience.soilFertilityScore}
                        onChange={(e) =>
                          setAugmentation({
                            ...augmentation,
                            soilScience: {
                              ...augmentation.soilScience,
                              soilFertilityScore: Number(e.target.value),
                            },
                          })
                        }
                        className="w-full p-2.5 border border-gray-300 rounded-lg bg-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Nitrogen (N %)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={augmentation.soilScience.nitrogen}
                        onChange={(e) =>
                          setAugmentation({
                            ...augmentation,
                            soilScience: {
                              ...augmentation.soilScience,
                              nitrogen: parseFloat(e.target.value) || 0,
                            },
                          })
                        }
                        className="w-full p-2.5 border border-gray-300 rounded-lg bg-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Phosphorus (P ppm)
                      </label>
                      <input
                        type="number"
                        value={augmentation.soilScience.phosphorus}
                        onChange={(e) =>
                          setAugmentation({
                            ...augmentation,
                            soilScience: {
                              ...augmentation.soilScience,
                              phosphorus: Number(e.target.value),
                            },
                          })
                        }
                        className="w-full p-2.5 border border-gray-300 rounded-lg bg-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Potassium (K ppm)
                      </label>
                      <input
                        type="number"
                        value={augmentation.soilScience.potassium}
                        onChange={(e) =>
                          setAugmentation({
                            ...augmentation,
                            soilScience: {
                              ...augmentation.soilScience,
                              potassium: Number(e.target.value),
                            },
                          })
                        }
                        className="w-full p-2.5 border border-gray-300 rounded-lg bg-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Organic Matter (%)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={augmentation.soilScience.organicMatter}
                        onChange={(e) =>
                          setAugmentation({
                            ...augmentation,
                            soilScience: {
                              ...augmentation.soilScience,
                              organicMatter: parseFloat(e.target.value) || 0,
                            },
                          })
                        }
                        className="w-full p-2.5 border border-gray-300 rounded-lg bg-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Soil Texture Class
                      </label>
                      <select
                        value={augmentation.soilScience.soilTexture}
                        onChange={(e) =>
                          setAugmentation({
                            ...augmentation,
                            soilScience: {
                              ...augmentation.soilScience,
                              soilTexture: e.target.value as any,
                            },
                          })
                        }
                        className="w-full p-2.5 border border-gray-300 rounded-lg bg-white text-sm"
                      >
                        <option value="loamy">Loamy</option>
                        <option value="clay">Clay</option>
                        <option value="sandy">Sandy</option>
                        <option value="silt">Silt</option>
                        <option value="peat">Peat</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Effective Soil Depth
                      </label>
                      <select
                        value={augmentation.soilScience.soilDepth}
                        onChange={(e) =>
                          setAugmentation({
                            ...augmentation,
                            soilScience: {
                              ...augmentation.soilScience,
                              soilDepth: e.target.value as any,
                            },
                          })
                        }
                        className="w-full p-2.5 border border-gray-300 rounded-lg bg-white text-sm"
                      >
                        <option value="deep">Deep (&gt; 100cm)</option>
                        <option value="medium">Medium (50 - 100cm)</option>
                        <option value="shallow">Shallow (&lt; 50cm)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2 lg:col-span-4">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Agronomic &amp; Fertilizer Recommendation
                      </label>
                      <input
                        type="text"
                        value={augmentation.soilScience.fertilizerRecommendation}
                        onChange={(e) =>
                          setAugmentation({
                            ...augmentation,
                            soilScience: {
                              ...augmentation.soilScience,
                              fertilizerRecommendation: e.target.value,
                            },
                          })
                        }
                        className="w-full p-2.5 border border-gray-300 rounded-lg bg-white text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Module C: Demo Plot & Field Benchmark Data */}
                <div className="bg-indigo-50/50 border border-indigo-200/80 rounded-xl p-5 space-y-4">
                  <h4 className="text-base font-bold text-indigo-950 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-indigo-600" />
                    C. Demo Plot Benchmarks &amp; Field Verification Data
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Farmer Expected Yield (MT/ha)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={augmentation.demoPlotData.farmerExpectedYield}
                        onChange={(e) =>
                          handleYieldChange(
                            parseFloat(e.target.value) || 0,
                            augmentation.demoPlotData.benchmarkYield
                          )
                        }
                        className="w-full p-2.5 border border-gray-300 rounded-lg bg-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Demo Plot Benchmark Yield (MT/ha)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={augmentation.demoPlotData.benchmarkYield}
                        onChange={(e) =>
                          handleYieldChange(
                            augmentation.demoPlotData.farmerExpectedYield,
                            parseFloat(e.target.value) || 1
                          )
                        }
                        className="w-full p-2.5 border border-gray-300 rounded-lg bg-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Yield Performance Ratio
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={augmentation.demoPlotData.performanceRatio}
                        onChange={(e) =>
                          setAugmentation({
                            ...augmentation,
                            demoPlotData: {
                              ...augmentation.demoPlotData,
                              performanceRatio: parseFloat(e.target.value) || 1.0,
                            },
                          })
                        }
                        className="w-full p-2.5 border border-gray-300 rounded-lg bg-white font-bold text-indigo-700 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Extension Compliance Score (0-100)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={augmentation.demoPlotData.extensionComplianceScore}
                        onChange={(e) =>
                          setAugmentation({
                            ...augmentation,
                            demoPlotData: {
                              ...augmentation.demoPlotData,
                              extensionComplianceScore: Number(e.target.value),
                            },
                          })
                        }
                        className="w-full p-2.5 border border-gray-300 rounded-lg bg-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Pest &amp; Disease Control Capacity
                      </label>
                      <select
                        value={augmentation.demoPlotData.pestControlCapacity}
                        onChange={(e) =>
                          setAugmentation({
                            ...augmentation,
                            demoPlotData: {
                              ...augmentation.demoPlotData,
                              pestControlCapacity: e.target.value as any,
                            },
                          })
                        }
                        className="w-full p-2.5 border border-gray-300 rounded-lg bg-white text-sm"
                      >
                        <option value="high">High (Integrated Pest Management)</option>
                        <option value="medium">Medium (Standard Spraying)</option>
                        <option value="low">Low (Minimal Protection)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Verifying Extension Officer
                      </label>
                      <input
                        type="text"
                        value={augmentation.demoPlotData.extensionOfficer}
                        onChange={(e) =>
                          setAugmentation({
                            ...augmentation,
                            demoPlotData: {
                              ...augmentation.demoPlotData,
                              extensionOfficer: e.target.value,
                            },
                          })
                        }
                        className="w-full p-2.5 border border-gray-300 rounded-lg bg-white text-sm"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Field Verification Notes
                      </label>
                      <input
                        type="text"
                        value={augmentation.demoPlotData.fieldNotes}
                        onChange={(e) =>
                          setAugmentation({
                            ...augmentation,
                            demoPlotData: {
                              ...augmentation.demoPlotData,
                              fieldNotes: e.target.value,
                            },
                          })
                        }
                        className="w-full p-2.5 border border-gray-300 rounded-lg bg-white text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Live Combined Output Preview & Optional Manual Override */}
                {livePreviewAssessment && (
                  <div className="bg-slate-900 text-white rounded-xl p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700 pb-4">
                      <div>
                        <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
                          Combined Intelligence Synthesis (Farmer Input + Admin Input)
                        </span>
                        <h4 className="text-lg font-bold mt-0.5">
                          Bank-Ready Credit Profile Preview for {selectedProfile.farmer.id}
                        </h4>
                      </div>
                      <label className="inline-flex items-center gap-2 text-xs bg-slate-800 px-3 py-2 rounded-lg cursor-pointer border border-slate-700">
                        <input
                          type="checkbox"
                          checked={useManualRiskOverride}
                          onChange={(e) => {
                            setUseManualRiskOverride(e.target.checked);
                            if (e.target.checked && livePreviewAssessment) {
                              setManualScore(livePreviewAssessment.score);
                              setManualRiskLevel(livePreviewAssessment.riskLevel);
                              setManualSafeLoan(livePreviewAssessment.safeLoanAmount);
                              setManualRepaymentMonths(
                                livePreviewAssessment.recommendedRepaymentPeriod
                              );
                            }
                          }}
                          className="rounded text-emerald-500"
                        />
                        <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                        Manual Admin Score/Loan Override
                      </label>
                    </div>

                    {!useManualRiskOverride ? (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-slate-800/90 p-4 rounded-lg border border-slate-700">
                          <span className="text-xs text-slate-400">Combined Risk Score</span>
                          <p className="text-2xl font-extrabold text-emerald-400 mt-1">
                            {livePreviewAssessment.score}/100
                          </p>
                        </div>
                        <div className="bg-slate-800/90 p-4 rounded-lg border border-slate-700">
                          <span className="text-xs text-slate-400">Risk Category</span>
                          <p className="text-2xl font-extrabold text-white mt-1">
                            {livePreviewAssessment.riskLevel} Risk
                          </p>
                        </div>
                        <div className="bg-slate-800/90 p-4 rounded-lg border border-slate-700">
                          <span className="text-xs text-slate-400">Safe Loan Sizing</span>
                          <p className="text-2xl font-extrabold text-cyan-400 mt-1">
                            GH₵{livePreviewAssessment.safeLoanAmount.toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-slate-800/90 p-4 rounded-lg border border-slate-700">
                          <span className="text-xs text-slate-400">Default Probability</span>
                          <p className="text-2xl font-extrabold text-amber-400 mt-1">
                            {livePreviewAssessment.defaultProbability.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
                        <div>
                          <label className="block text-xs text-slate-300 mb-1">
                            Manual Risk Score (0-100)
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={manualScore}
                            onChange={(e) => setManualScore(Number(e.target.value))}
                            className="w-full p-2.5 rounded-lg bg-slate-800 border border-slate-600 text-white font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-300 mb-1">
                            Risk Category
                          </label>
                          <select
                            value={manualRiskLevel}
                            onChange={(e) => setManualRiskLevel(e.target.value as any)}
                            className="w-full p-2.5 rounded-lg bg-slate-800 border border-slate-600 text-white font-bold"
                          >
                            <option value="Low">Low Risk (Eligible)</option>
                            <option value="Medium">Medium Risk (Conditional)</option>
                            <option value="High">High Risk (Not Eligible)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-slate-300 mb-1">
                            Recommended Loan (GH₵)
                          </label>
                          <input
                            type="number"
                            value={manualSafeLoan}
                            onChange={(e) => setManualSafeLoan(Number(e.target.value))}
                            className="w-full p-2.5 rounded-lg bg-slate-800 border border-slate-600 text-white font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-300 mb-1">
                            Repayment Period (Months)
                          </label>
                          <input
                            type="number"
                            value={manualRepaymentMonths}
                            onChange={(e) => setManualRepaymentMonths(Number(e.target.value))}
                            className="w-full p-2.5 rounded-lg bg-slate-800 border border-slate-600 text-white font-bold"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-base shadow-lg flex items-center gap-2.5 transition-all disabled:opacity-50"
                  >
                    <Save className="w-5 h-5" />
                    {saving
                      ? 'Saving & Generating Bank-Ready Profile...'
                      : `Save Augmentation & Generate Bank-Ready Profile (${selectedProfile.farmer.id})`}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* TAB B: FINAL OUTPUT (COMBINED BANK-READY PROFILE) */}
          {activeStepTab === 'output' && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6">
              {selectedProfile.riskAssessment ? (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-emerald-100 text-emerald-700">
                        <FileCheck className="w-7 h-7" />
                      </div>
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                          Final Output &bull; Published to Bank Intelligence Portal
                        </span>
                        <h3 className="text-2xl font-bold text-gray-900">
                          Bank-Ready Profile: {selectedProfile.farmer.id} &mdash;{' '}
                          {selectedProfile.farmer.fullName}
                        </h3>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleDownloadDossier}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm flex items-center gap-2 self-start sm:self-center shadow-sm"
                    >
                      <Download className="w-4 h-4" />
                      Download Bank Dossier (JSON)
                    </button>
                  </div>

                  {/* Summary Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200">
                      <span className="text-xs font-semibold text-emerald-800 uppercase">
                        Final Risk Score
                      </span>
                      <p className="text-3xl font-extrabold text-emerald-900 mt-1">
                        {selectedProfile.riskAssessment.score}/100
                      </p>
                      <span className="text-xs text-emerald-700 font-medium">
                        {selectedProfile.riskAssessment.riskLevel} Risk Tier
                      </span>
                    </div>

                    <div className="p-5 rounded-xl bg-blue-50 border border-blue-200">
                      <span className="text-xs font-semibold text-blue-800 uppercase">
                        Recommended Safe Loan
                      </span>
                      <p className="text-3xl font-extrabold text-blue-900 mt-1">
                        GH₵{selectedProfile.riskAssessment.safeLoanAmount.toLocaleString()}
                      </p>
                      <span className="text-xs text-blue-700 font-medium">
                        Term: {selectedProfile.riskAssessment.recommendedRepaymentPeriod} Months
                      </span>
                    </div>

                    <div className="p-5 rounded-xl bg-purple-50 border border-purple-200">
                      <span className="text-xs font-semibold text-purple-800 uppercase">
                        Projected Profit Capacity
                      </span>
                      <p className="text-3xl font-extrabold text-purple-900 mt-1">
                        GH₵{selectedProfile.riskAssessment.profitCapacity.toLocaleString()}
                      </p>
                      <span className="text-xs text-purple-700 font-medium">
                        Seasonal Revenue Margin
                      </span>
                    </div>

                    <div className="p-5 rounded-xl bg-amber-50 border border-amber-200">
                      <span className="text-xs font-semibold text-amber-800 uppercase">
                        Default Probability
                      </span>
                      <p className="text-3xl font-extrabold text-amber-900 mt-1">
                        {selectedProfile.riskAssessment.defaultProbability.toFixed(1)}%
                      </p>
                      <span className="text-xs text-amber-700 font-medium">
                        Actuarial Risk Estimate
                      </span>
                    </div>
                  </div>

                  {/* Factor Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-5 rounded-xl bg-gray-50 border border-gray-200">
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                        <Calculator className="w-4 h-4 text-blue-600" />
                        Combined Dimension Factor Scores
                      </h4>
                      <div className="space-y-2.5">
                        {Object.entries(selectedProfile.riskAssessment.factors).map(
                          ([key, val]) => (
                            <div key={key} className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="capitalize font-medium text-gray-700">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                                <span className="font-bold text-gray-900">
                                  {Math.round((val as number) * 100)}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 h-2 rounded-full">
                                <div
                                  className="bg-green-600 h-2 rounded-full"
                                  style={{
                                    width: `${Math.min(100, Math.round((val as number) * 100))}%`,
                                  }}
                                />
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <div className="p-5 rounded-xl bg-gray-50 border border-gray-200">
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                        <Award className="w-4 h-4 text-green-600" />
                        Bank &amp; Agronomic Directives
                      </h4>
                      <ul className="space-y-2 text-xs text-gray-700">
                        {selectedProfile.riskAssessment.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 space-y-3">
                  <Clock className="w-12 h-12 text-amber-500 mx-auto" />
                  <h4 className="text-lg font-bold text-gray-900">
                    Bank-Ready Profile Not Yet Generated for {selectedProfile.farmer.id}
                  </h4>
                  <p className="text-sm text-gray-600 max-w-md mx-auto">
                    Switch to the <strong>Admin Augmentation Form</strong> tab to append Earth Observation, Soil Science, and Demo Plot metrics and generate the final bank-ready profile.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveStepTab('augment')}
                    className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-semibold text-sm"
                  >
                    Open Admin Augmentation Form
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}