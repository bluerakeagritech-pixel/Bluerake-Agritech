import React, { useState, useEffect } from 'react';
import {
  User,
  CheckCircle,
  Save,
  Sprout,
  MapPin,
  Settings,
  Users,
  Shield,
  TrendingUp,
  Search,
  Copy,
  FileCheck,
  Clock,
  ArrowRight,
  RefreshCw,
  Award,
  Layers,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  centralIntelligence,
  normalizeGhfaId,
  type FarmerIntelligenceProfile,
} from '../services/centralIntelligence';
import type { Farmer } from '../types';

interface FarmerPortalProps {
  farmerId?: string;
}

const REGIONS = [
  'Greater Accra',
  'Ashanti',
  'Western',
  'Central',
  'Eastern',
  'Northern',
  'Volta',
  'Brong-Ahafo',
  'Upper East',
  'Upper West',
];

const CROPS = [
  'Maize',
  'Cocoa',
  'Rice',
  'Cassava',
  'Yam',
  'Plantain',
  'Groundnuts',
  'Oil Palm',
  'Sorghum',
  'Soybean',
];

const ZONES = [
  'Forest Zone',
  'Transition Zone',
  'Guinea Savanna',
  'Coastal Savanna',
  'Sudan Savanna',
];

const getInitialFarmerState = (): Partial<Farmer> => ({
  fullName: '',
  age: 35,
  gender: 'male',
  education: 'primary',
  farmingExperience: 5,
  phone: '',
  email: '',
  ghanaCardId: '',
  language: 'en',
  farmSize: 2.0,
  irrigationAccess: false,
  mechanisationAccess: false,
  location: {
    latitude: 6.6885,
    longitude: -1.6244,
    region: '',
    district: '',
    community: '',
    agroEcologicalZone: 'Forest Zone',
  },
  extensionScore: 0,
  performanceRatio: 1.0,
  created_at: new Date().toISOString(),
  extendedData: {
    primaryCrop: 'Maize',
    season: 'Main 2025',
    registrationStatus: 'pending_augmentation',
    landTenure: 'owned',
    soilData: {
      soilType: 'loamy',
      soilFertility: 'medium',
      organicMatter: 0,
      moisture: 0,
      pH: 0,
      lastUpdated: new Date().toISOString(),
    },
    cropManagement: {
      practicesCropRotation: false,
      previousCrops: {
        cocoa: false,
        maize: true,
        rice: false,
        cassava: false,
        yam: false,
        plantain: false,
        groundnuts: false,
        oilPalm: false,
      },
    },
    inputAccess: {
      qualitySeeds: false,
      fertilizer: false,
      tools: false,
      subsidies: false,
    },
    infrastructure: {
      roadAccess: true,
      irrigationSystem: false,
      storageFacilities: false,
    },
    socialFinancial: {
      cooperativeMember: false,
      cooperativeName: '',
      vslaMember: false,
      offFarmIncome: false,
      hasSavings: false,
      familySupport: false,
    },
    vegetationHealth: {
      ndviScore: 0,
      lastUpdated: new Date().toISOString(),
    },
  },
});

const FarmerPortal: React.FC<FarmerPortalProps> = () => {
  const [activeTab, setActiveTab] = useState<'register' | 'lookup'>('register');
  const [farmerData, setFarmerData] = useState<Partial<Farmer>>(getInitialFarmerState());
  const [submitting, setSubmitting] = useState(false);

  // Newly registered farmer receipt
  const [registeredFarmer, setRegisteredFarmer] = useState<Farmer | null>(null);
  const [nextPreviewId, setNextPreviewId] = useState<string>('GHFA003');

  // Lookup state for checking existing GHFA-XXX profile & results
  const [lookupId, setLookupId] = useState<string>('');
  const [lookedUpProfile, setLookedUpProfile] = useState<FarmerIntelligenceProfile | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [recentFarmers, setRecentFarmers] = useState<FarmerIntelligenceProfile[]>([]);

  const refreshNextIdAndList = async () => {
    try {
      const nextId = await centralIntelligence.generateNextFarmerId();
      setNextPreviewId(nextId);
      const all = await centralIntelligence.getAllFarmers();
      setRecentFarmers(all);
    } catch (err) {
      console.error('Error loading next farmer ID:', err);
    }
  };

  useEffect(() => {
    refreshNextIdAndList();
  }, []);

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!farmerData.fullName?.trim()) {
      toast.error('Please enter the Farmer Full Name');
      return;
    }
    if (!farmerData.phone?.trim()) {
      toast.error('Please enter a valid Phone Number');
      return;
    }
    if (!farmerData.location?.region) {
      toast.error('Please select the Farm Region');
      return;
    }
    if (!farmerData.farmSize || farmerData.farmSize <= 0) {
      toast.error('Please enter a valid Farm Size (hectares)');
      return;
    }

    setSubmitting(true);
    try {
      // Transmit baseline registration payload to Central System
      // Central System intercepts and generates sequential GHFAxxx ID
      const createdFarmer = await centralIntelligence.registerFarmer({
        ...farmerData,
        id: undefined, // Ensure Central System assigns next sequential GHFAxxx ID
      });

      setRegisteredFarmer(createdFarmer);
      setLookupId(createdFarmer.id);
      const fullProfile = await centralIntelligence.getFarmerProfile(createdFarmer.id);
      if (fullProfile) {
        setLookedUpProfile(fullProfile);
      }

      await refreshNextIdAndList();
      toast.success(
        `Registration transmitted! Assigned Official ID: ${createdFarmer.id}`
      );
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(`Error submitting registration: ${error}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartNewRegistration = () => {
    setRegisteredFarmer(null);
    setFarmerData(getInitialFarmerState());
    refreshNextIdAndList();
  };

  const handleLookupSearch = async (targetId?: string) => {
    const query = (targetId ?? lookupId).trim();
    if (!query) {
      toast.error('Please enter a Farmer ID (e.g., GHFA001)');
      return;
    }
    setLookupLoading(true);
    try {
      const norm = normalizeGhfaId(query.replace('-', ''));
      const profile = await centralIntelligence.getFarmerProfile(norm);
      if (profile) {
        setLookedUpProfile(profile);
        setLookupId(profile.farmer.id);
      } else {
        // Also try searching by name if not found by ID
        const all = await centralIntelligence.getAllFarmers();
        const byName = all.find(
          (p) =>
            p.farmer.fullName.toLowerCase().includes(query.toLowerCase()) ||
            p.farmer.id.toLowerCase() === query.toLowerCase().replace('-', '')
        );
        if (byName) {
          setLookedUpProfile(byName);
          setLookupId(byName.farmer.id);
        } else {
          setLookedUpProfile(null);
          toast.error(`No farmer profile found for "${query}"`);
        }
      }
    } catch (err) {
      toast.error(`Error looking up farmer: ${err}`);
    } finally {
      setLookupLoading(false);
    }
  };

  const copyIdToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success(`Copied Farmer ID: ${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50/60 to-slate-100 pb-16">
      {/* Portal Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center">
              <div className="bg-green-600 p-2.5 rounded-xl shadow-md">
                <User className="h-7 w-7 text-white" />
              </div>
              <div className="ml-3.5">
                <h1 className="text-2xl font-bold text-gray-900">
                  Farmer Onboarding & Baseline Portal
                </h1>
                <p className="text-sm text-gray-500">
                  Step 1 of Data Flow: Primary Baseline Capture &rarr; Central System Automated ID Generation
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Next Sequential ID: <strong className="font-mono">{nextPreviewId}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Workflow Architecture Banner */}
        <div className="bg-white border border-emerald-200 rounded-xl p-5 mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50/80 border border-green-100">
              <div className="w-7 h-7 rounded-full bg-green-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-xs">
                1
              </div>
              <div>
                <p className="font-semibold text-gray-900">1. Farmer Portal Capture</p>
                <p className="text-gray-600 text-xs mt-0.5">
                  Farmers or field agents input primary baseline profile &amp; farm operational data.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50/80 border border-blue-100">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-xs">
                2
              </div>
              <div>
                <p className="font-semibold text-gray-900">2. Auto-ID Generation</p>
                <p className="text-gray-600 text-xs mt-0.5">
                  Central System intercepts payload and assigns sequential ID (e.g. <code className="font-mono font-bold">GHFA001</code>).
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-50/80 border border-purple-100">
              <div className="w-7 h-7 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-xs">
                3
              </div>
              <div>
                <p className="font-semibold text-gray-900">3. Admin Risk Augmentation</p>
                <p className="text-gray-600 text-xs mt-0.5">
                  Admins retrieve profile by GHFA ID, append Soil/Satellite/Demo data &amp; generate Bank Profile.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="border-b border-gray-200 bg-gray-50/60">
            <nav className="flex">
              <button
                type="button"
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-4 px-6 text-center border-b-2 font-semibold text-sm transition-colors flex items-center justify-center gap-2 ${
                  activeTab === 'register'
                    ? 'border-green-600 text-green-700 bg-white'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <User className="w-4 h-4" />
                1. New Farmer Registration (Baseline Data Capture)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('lookup')}
                className={`flex-1 py-4 px-6 text-center border-b-2 font-semibold text-sm transition-colors flex items-center justify-center gap-2 ${
                  activeTab === 'lookup'
                    ? 'border-green-600 text-green-700 bg-white'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Search className="w-4 h-4" />
                2. Check Farmer Status &amp; Bank-Ready Profile (By GHFA ID)
              </button>
            </nav>
          </div>

          <div className="p-6 md:p-8">
            {/* TAB 1: FARMER REGISTRATION */}
            {activeTab === 'register' && (
              <>
                {registeredFarmer ? (
                  <div className="max-w-2xl mx-auto py-6 text-center space-y-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>

                    <div>
                      <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-bold uppercase tracking-wider mb-2">
                        Central System Registration Confirmed
                      </span>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Farmer Baseline Profile Transmitted
                      </h2>
                      <p className="text-gray-600 mt-1">
                        The Central System intercepted the registration payload and generated the following unique primary key:
                      </p>
                    </div>

                    {/* Generated GHFA ID Card */}
                    <div className="bg-gradient-to-r from-green-800 to-emerald-700 text-white p-6 rounded-2xl shadow-lg text-left relative overflow-hidden">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-widest text-green-200 font-semibold">
                            Official Primary Identifier (Sequential ID)
                          </p>
                          <div className="text-4xl font-extrabold font-mono tracking-wider mt-1">
                            {registeredFarmer.id}
                          </div>
                          <p className="text-sm text-green-100 mt-2">
                            Farmer: <strong>{registeredFarmer.fullName}</strong> &bull;{' '}
                            {registeredFarmer.location.district
                              ? `${registeredFarmer.location.district}, `
                              : ''}
                            {registeredFarmer.location.region}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyIdToClipboard(registeredFarmer.id)}
                          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/15 hover:bg-white/25 rounded-xl text-sm font-semibold backdrop-blur-sm transition-colors self-start sm:self-center"
                        >
                          <Copy className="w-4 h-4" />
                          Copy ID
                        </button>
                      </div>
                      <div className="mt-4 pt-4 border-t border-white/20 flex flex-wrap items-center justify-between text-xs text-green-100 gap-2">
                        <span>
                          Primary Crop: <strong>{registeredFarmer.extendedData?.primaryCrop || 'Maize'}</strong>
                        </span>
                        <span>
                          Farm Size: <strong>{registeredFarmer.farmSize} ha</strong>
                        </span>
                        <span className="inline-flex items-center gap-1 bg-amber-400/20 text-amber-200 px-2.5 py-0.5 rounded-full border border-amber-300/30">
                          <Clock className="w-3.5 h-3.5" />
                          Status: Awaiting Admin Risk Engine Augmentation
                        </span>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-left text-sm text-blue-900">
                      <p className="font-semibold mb-1">Next Step in System Workflow:</p>
                      <p className="text-blue-800">
                        An administrator can now log into the <strong>Admin Risk Engine</strong>, search for{' '}
                        <code className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border">
                          {registeredFarmer.id}
                        </code>
                        , review this baseline data, and manually append secondary Earth Observation, Soil Science, and Demo Plot metrics to generate the final bank-ready profile.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('lookup');
                          handleLookupSearch(registeredFarmer.id);
                        }}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-sm"
                      >
                        <FileCheck className="w-5 h-5" />
                        View Profile Status ({registeredFarmer.id})
                      </button>
                      <button
                        type="button"
                        onClick={handleStartNewRegistration}
                        className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-semibold flex items-center justify-center gap-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Register Another Farmer
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleRegistrationSubmit} className="space-y-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-2">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">
                          Primary Baseline Data Capture Form
                        </h2>
                        <p className="text-sm text-gray-600">
                          Complete the farmer&apos;s baseline details below. Upon submission, the Central System will automatically assign a unique <code className="font-mono font-bold text-green-700">GHFAxxx</code> ID.
                        </p>
                      </div>
                    </div>

                    {/* Section A: Personal & Identity Baseline */}
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200/80 space-y-4">
                      <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                        <User className="w-5 h-5 text-green-600" />
                        A. Farmer Identity &amp; Demographic Baseline
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={farmerData.fullName || ''}
                            onChange={(e) =>
                              setFarmerData({ ...farmerData, fullName: e.target.value })
                            }
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            placeholder="e.g., Kofi Mensah"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Age (Years) *
                          </label>
                          <input
                            type="number"
                            min={18}
                            max={100}
                            required
                            value={farmerData.age || ''}
                            onChange={(e) =>
                              setFarmerData({ ...farmerData, age: Number(e.target.value) })
                            }
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Gender
                          </label>
                          <select
                            value={farmerData.gender || 'male'}
                            onChange={(e) =>
                              setFarmerData({
                                ...farmerData,
                                gender: e.target.value as Farmer['gender'],
                              })
                            }
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            required
                            value={farmerData.phone || ''}
                            onChange={(e) =>
                              setFarmerData({ ...farmerData, phone: e.target.value })
                            }
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            placeholder="+233 XX XXX XXXX"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ghana Card ID *
                          </label>
                          <input
                            type="text"
                            required
                            value={farmerData.ghanaCardId || ''}
                            onChange={(e) =>
                              setFarmerData({ ...farmerData, ghanaCardId: e.target.value })
                            }
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            placeholder="GHA-XXXXXXXXX-X"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Education Level
                          </label>
                          <select
                            value={farmerData.education || 'primary'}
                            onChange={(e) =>
                              setFarmerData({
                                ...farmerData,
                                education: e.target.value as Farmer['education'],
                              })
                            }
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          >
                            <option value="none">No Formal Education</option>
                            <option value="primary">Primary / JHS</option>
                            <option value="secondary">Secondary / SHS</option>
                            <option value="tertiary">Tertiary</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Farming Experience (Years) *
                          </label>
                          <input
                            type="number"
                            min={0}
                            max={80}
                            required
                            value={farmerData.farmingExperience ?? 0}
                            onChange={(e) =>
                              setFarmerData({
                                ...farmerData,
                                farmingExperience: Number(e.target.value),
                              })
                            }
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Preferred Language
                          </label>
                          <select
                            value={farmerData.language || 'en'}
                            onChange={(e) =>
                              setFarmerData({
                                ...farmerData,
                                language: e.target.value as Farmer['language'],
                              })
                            }
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          >
                            <option value="en">English</option>
                            <option value="tw">Twi</option>
                            <option value="ee">Ewe</option>
                            <option value="ha">Hausa</option>
                            <option value="da">Dagbani</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Section B: Farm Location & Structural Baseline */}
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200/80 space-y-4">
                      <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        B. Farm Location, Crop &amp; Structural Baseline
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Region *
                          </label>
                          <select
                            required
                            value={farmerData.location?.region || ''}
                            onChange={(e) =>
                              setFarmerData({
                                ...farmerData,
                                location: { ...farmerData.location!, region: e.target.value },
                              })
                            }
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          >
                            <option value="">Select Region</option>
                            {REGIONS.map((r) => (
                              <option key={r} value={r}>
                                {r}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            District *
                          </label>
                          <input
                            type="text"
                            required
                            value={farmerData.location?.district || ''}
                            onChange={(e) =>
                              setFarmerData({
                                ...farmerData,
                                location: { ...farmerData.location!, district: e.target.value },
                              })
                            }
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            placeholder="e.g., Ejura-Sekyedumase"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Community / Town
                          </label>
                          <input
                            type="text"
                            value={farmerData.location?.community || ''}
                            onChange={(e) =>
                              setFarmerData({
                                ...farmerData,
                                location: { ...farmerData.location!, community: e.target.value },
                              })
                            }
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            placeholder="Enter community name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Agro-Ecological Zone
                          </label>
                          <select
                            value={farmerData.location?.agroEcologicalZone || 'Forest Zone'}
                            onChange={(e) =>
                              setFarmerData({
                                ...farmerData,
                                location: {
                                  ...farmerData.location!,
                                  agroEcologicalZone: e.target.value,
                                },
                              })
                            }
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          >
                            {ZONES.map((z) => (
                              <option key={z} value={z}>
                                {z}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Farm Size (Hectares) *
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            min="0.1"
                            required
                            value={farmerData.farmSize || ''}
                            onChange={(e) =>
                              setFarmerData({ ...farmerData, farmSize: Number(e.target.value) })
                            }
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            placeholder="e.g., 3.5"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Primary Crop Cultivated *
                          </label>
                          <select
                            value={farmerData.extendedData?.primaryCrop || 'Maize'}
                            onChange={(e) =>
                              setFarmerData({
                                ...farmerData,
                                extendedData: {
                                  ...farmerData.extendedData!,
                                  primaryCrop: e.target.value,
                                },
                              })
                            }
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          >
                            {CROPS.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Land Tenure Arrangement
                          </label>
                          <select
                            value={farmerData.extendedData?.landTenure || 'owned'}
                            onChange={(e) =>
                              setFarmerData({
                                ...farmerData,
                                extendedData: {
                                  ...farmerData.extendedData!,
                                  landTenure: e.target.value as any,
                                },
                              })
                            }
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          >
                            <option value="owned">Owned / Customary Freehold</option>
                            <option value="lease">Leased</option>
                            <option value="sharecrop">Sharecrop (Abunu / Abusa)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            GPS Latitude (Optional)
                          </label>
                          <input
                            type="number"
                            step="0.0001"
                            value={farmerData.location?.latitude ?? 6.6885}
                            onChange={(e) =>
                              setFarmerData({
                                ...farmerData,
                                location: {
                                  ...farmerData.location!,
                                  latitude: Number(e.target.value),
                                },
                              })
                            }
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            GPS Longitude (Optional)
                          </label>
                          <input
                            type="number"
                            step="0.0001"
                            value={farmerData.location?.longitude ?? -1.6244}
                            onChange={(e) =>
                              setFarmerData({
                                ...farmerData,
                                location: {
                                  ...farmerData.location!,
                                  longitude: Number(e.target.value),
                                },
                              })
                            }
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section C: Operational, Input & Socio-Economic Baseline */}
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200/80 space-y-4">
                      <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-purple-600" />
                        C. Farm Operations, Infrastructure &amp; Financial Resilience Baseline
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
                        <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-400">
                          <input
                            type="checkbox"
                            checked={farmerData.irrigationAccess || false}
                            onChange={(e) =>
                              setFarmerData({
                                ...farmerData,
                                irrigationAccess: e.target.checked,
                              })
                            }
                            className="rounded border-gray-300 text-green-600 mr-2.5"
                          />
                          <span className="text-sm text-gray-700">Irrigation Access</span>
                        </label>

                        <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-400">
                          <input
                            type="checkbox"
                            checked={farmerData.mechanisationAccess || false}
                            onChange={(e) =>
                              setFarmerData({
                                ...farmerData,
                                mechanisationAccess: e.target.checked,
                              })
                            }
                            className="rounded border-gray-300 text-green-600 mr-2.5"
                          />
                          <span className="text-sm text-gray-700">Mechanization / Tractor Access</span>
                        </label>

                        <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-400">
                          <input
                            type="checkbox"
                            checked={
                              farmerData.extendedData?.cropManagement.practicesCropRotation || false
                            }
                            onChange={(e) =>
                              setFarmerData({
                                ...farmerData,
                                extendedData: {
                                  ...farmerData.extendedData!,
                                  cropManagement: {
                                    ...farmerData.extendedData!.cropManagement,
                                    practicesCropRotation: e.target.checked,
                                  },
                                },
                              })
                            }
                            className="rounded border-gray-300 text-green-600 mr-2.5"
                          />
                          <span className="text-sm text-gray-700">Practices Crop Rotation</span>
                        </label>

                        <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-400">
                          <input
                            type="checkbox"
                            checked={farmerData.extendedData?.inputAccess.qualitySeeds || false}
                            onChange={(e) =>
                              setFarmerData({
                                ...farmerData,
                                extendedData: {
                                  ...farmerData.extendedData!,
                                  inputAccess: {
                                    ...farmerData.extendedData!.inputAccess,
                                    qualitySeeds: e.target.checked,
                                  },
                                },
                              })
                            }
                            className="rounded border-gray-300 text-green-600 mr-2.5"
                          />
                          <span className="text-sm text-gray-700">Certified Quality Seeds</span>
                        </label>

                        <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-400">
                          <input
                            type="checkbox"
                            checked={farmerData.extendedData?.inputAccess.fertilizer || false}
                            onChange={(e) =>
                              setFarmerData({
                                ...farmerData,
                                extendedData: {
                                  ...farmerData.extendedData!,
                                  inputAccess: {
                                    ...farmerData.extendedData!.inputAccess,
                                    fertilizer: e.target.checked,
                                  },
                                },
                              })
                            }
                            className="rounded border-gray-300 text-green-600 mr-2.5"
                          />
                          <span className="text-sm text-gray-700">Reliable Fertilizer Access</span>
                        </label>

                        <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-400">
                          <input
                            type="checkbox"
                            checked={farmerData.extendedData?.infrastructure.roadAccess || false}
                            onChange={(e) =>
                              setFarmerData({
                                ...farmerData,
                                extendedData: {
                                  ...farmerData.extendedData!,
                                  infrastructure: {
                                    ...farmerData.extendedData!.infrastructure,
                                    roadAccess: e.target.checked,
                                  },
                                },
                              })
                            }
                            className="rounded border-gray-300 text-green-600 mr-2.5"
                          />
                          <span className="text-sm text-gray-700">Motorable Road Access</span>
                        </label>

                        <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-400">
                          <input
                            type="checkbox"
                            checked={
                              farmerData.extendedData?.infrastructure.storageFacilities || false
                            }
                            onChange={(e) =>
                              setFarmerData({
                                ...farmerData,
                                extendedData: {
                                  ...farmerData.extendedData!,
                                  infrastructure: {
                                    ...farmerData.extendedData!.infrastructure,
                                    storageFacilities: e.target.checked,
                                  },
                                },
                              })
                            }
                            className="rounded border-gray-300 text-green-600 mr-2.5"
                          />
                          <span className="text-sm text-gray-700">Post-Harvest Storage Access</span>
                        </label>

                        <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-400">
                          <input
                            type="checkbox"
                            checked={
                              farmerData.extendedData?.socialFinancial.cooperativeMember || false
                            }
                            onChange={(e) =>
                              setFarmerData({
                                ...farmerData,
                                extendedData: {
                                  ...farmerData.extendedData!,
                                  socialFinancial: {
                                    ...farmerData.extendedData!.socialFinancial,
                                    cooperativeMember: e.target.checked,
                                  },
                                },
                              })
                            }
                            className="rounded border-gray-300 text-green-600 mr-2.5"
                          />
                          <span className="text-sm text-gray-700">FBO / Cooperative Member</span>
                        </label>

                        <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-400">
                          <input
                            type="checkbox"
                            checked={farmerData.extendedData?.socialFinancial.hasSavings || false}
                            onChange={(e) =>
                              setFarmerData({
                                ...farmerData,
                                extendedData: {
                                  ...farmerData.extendedData!,
                                  socialFinancial: {
                                    ...farmerData.extendedData!.socialFinancial,
                                    hasSavings: e.target.checked,
                                    vslaMember: e.target.checked,
                                  },
                                },
                              })
                            }
                            className="rounded border-gray-300 text-green-600 mr-2.5"
                          />
                          <span className="text-sm text-gray-700">VSLA / Active Savings Account</span>
                        </label>
                      </div>

                      {farmerData.extendedData?.socialFinancial.cooperativeMember && (
                        <div className="pt-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cooperative / FBO Name
                          </label>
                          <input
                            type="text"
                            value={farmerData.extendedData?.socialFinancial.cooperativeName || ''}
                            onChange={(e) =>
                              setFarmerData({
                                ...farmerData,
                                extendedData: {
                                  ...farmerData.extendedData!,
                                  socialFinancial: {
                                    ...farmerData.extendedData!.socialFinancial,
                                    cooperativeName: e.target.value,
                                  },
                                },
                              })
                            }
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            placeholder="Enter Cooperative or Farmer Based Organization name"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200">
                      <div className="text-xs text-gray-500">
                        Upon submission, Central System will assign sequential ID{' '}
                        <span className="font-mono font-bold text-gray-800">{nextPreviewId}</span>{' '}
                        and route profile to the Admin Risk Engine.
                      </div>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-md transition-all disabled:opacity-50"
                      >
                        <Save className="w-5 h-5" />
                        {submitting
                          ? 'Transmitting to Central System...'
                          : 'Submit Registration & Generate GHFA ID'}
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}

            {/* TAB 2: LOOKUP EXISTING GHFA-XXX PROFILE & RESULTS */}
            {activeTab === 'lookup' && (
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <h2 className="text-lg font-bold text-gray-900 mb-2">
                    Retrieve Farmer Profile &amp; Bank-Ready Status
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Enter your sequential Farmer ID (e.g., <code className="font-mono font-bold">GHFA001</code>, <code className="font-mono font-bold">GHFA002</code>) or select from registered profiles below.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={lookupId}
                        onChange={(e) => setLookupId(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleLookupSearch()}
                        placeholder="Enter GHFA ID (e.g. GHFA001) or Farmer Name..."
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 font-mono"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleLookupSearch()}
                      disabled={lookupLoading}
                      className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2"
                    >
                      {lookupLoading ? 'Searching...' : 'Retrieve Profile'}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quick Select Chips for Registered Farmers */}
                  {recentFarmers.length > 0 && (
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="text-xs text-gray-500 font-medium">Registered IDs:</span>
                      {recentFarmers.map((p) => (
                        <button
                          key={p.farmer.id}
                          type="button"
                          onClick={() => {
                            setLookupId(p.farmer.id);
                            handleLookupSearch(p.farmer.id);
                          }}
                          className={`text-xs px-3 py-1 rounded-full font-mono font-semibold border transition-colors ${
                            lookedUpProfile?.farmer.id === p.farmer.id
                              ? 'bg-green-600 text-white border-green-600'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-green-500'
                          }`}
                        >
                          {p.farmer.id} ({p.farmer.fullName})
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {lookedUpProfile && (
                  <div className="space-y-6">
                    {/* Profile Header Card */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="px-3 py-1 rounded-lg bg-green-100 text-green-800 font-mono font-bold text-lg">
                              {lookedUpProfile.farmer.id}
                            </span>
                            <h3 className="text-2xl font-bold text-gray-900">
                              {lookedUpProfile.farmer.fullName}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {lookedUpProfile.farmer.location.district},{' '}
                            {lookedUpProfile.farmer.location.region} ({lookedUpProfile.farmer.location.agroEcologicalZone}) &bull;{' '}
                            Farm Size: <strong>{lookedUpProfile.farmer.farmSize} ha</strong> &bull;{' '}
                            Primary Crop: <strong>{lookedUpProfile.farmer.extendedData?.primaryCrop || 'Maize'}</strong>
                          </p>
                        </div>

                        <div>
                          {lookedUpProfile.riskAssessment ? (
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <CheckCircle className="w-4 h-4 text-emerald-600" />
                              Bank-Ready Profile Generated
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
                              <Clock className="w-4 h-4 text-amber-600" />
                              Pending Admin Data Augmentation
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Baseline Summary */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-sm">
                        <div>
                          <span className="text-gray-500 block text-xs">Ghana Card ID</span>
                          <span className="font-semibold text-gray-900">
                            {lookedUpProfile.farmer.ghanaCardId || 'N/A'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 block text-xs">Phone</span>
                          <span className="font-semibold text-gray-900">
                            {lookedUpProfile.farmer.phone || 'N/A'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 block text-xs">Experience</span>
                          <span className="font-semibold text-gray-900">
                            {lookedUpProfile.farmer.farmingExperience} Years
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 block text-xs">Land Tenure</span>
                          <span className="font-semibold text-gray-900 capitalize">
                            {lookedUpProfile.farmer.extendedData?.landTenure || 'Owned'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bank-Ready Assessment Output (Combined Farmer + Admin Input) */}
                    {lookedUpProfile.riskAssessment ? (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="bg-gradient-to-br from-green-600 to-emerald-700 text-white p-5 rounded-xl shadow">
                            <p className="text-xs uppercase tracking-wider opacity-85">
                              Combined Risk Score
                            </p>
                            <p className="text-3xl font-extrabold mt-1">
                              {lookedUpProfile.riskAssessment.score}/100
                            </p>
                            <p className="text-xs mt-1 font-medium">
                              {lookedUpProfile.riskAssessment.riskLevel} Risk Classification
                            </p>
                          </div>

                          <div className="bg-gradient-to-br from-blue-600 to-cyan-700 text-white p-5 rounded-xl shadow">
                            <p className="text-xs uppercase tracking-wider opacity-85">
                              Recommended Safe Loan
                            </p>
                            <p className="text-3xl font-extrabold mt-1">
                              GH₵{lookedUpProfile.riskAssessment.safeLoanAmount.toLocaleString()}
                            </p>
                            <p className="text-xs mt-1 font-medium">
                              Repayment: {lookedUpProfile.riskAssessment.recommendedRepaymentPeriod} Months
                            </p>
                          </div>

                          <div className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white p-5 rounded-xl shadow">
                            <p className="text-xs uppercase tracking-wider opacity-85">
                              Projected Profit Capacity
                            </p>
                            <p className="text-3xl font-extrabold mt-1">
                              GH₵{lookedUpProfile.riskAssessment.profitCapacity.toLocaleString()}
                            </p>
                            <p className="text-xs mt-1 font-medium">Seasonal Estimate</p>
                          </div>

                          <div className="bg-gradient-to-br from-slate-700 to-slate-900 text-white p-5 rounded-xl shadow">
                            <p className="text-xs uppercase tracking-wider opacity-85">
                              Default Probability
                            </p>
                            <p className="text-3xl font-extrabold mt-1">
                              {lookedUpProfile.riskAssessment.defaultProbability.toFixed(1)}%
                            </p>
                            <p className="text-xs mt-1 font-medium">Bank-Grade Metric</p>
                          </div>
                        </div>

                        {/* Secondary Data Appended by Admin */}
                        {lookedUpProfile.farmer.extendedData?.adminAugmentation && (
                          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                            <h4 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                              <Layers className="w-5 h-5 text-purple-600" />
                              Admin-Appended Secondary Scientific Data
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div className="p-4 rounded-lg bg-cyan-50/70 border border-cyan-100">
                                <p className="font-bold text-cyan-900 mb-2">
                                  Earth Observation Metrics
                                </p>
                                <p>
                                  NDVI Score:{' '}
                                  <strong>
                                    {lookedUpProfile.farmer.extendedData.adminAugmentation.earthObservation.ndviScore}
                                  </strong>
                                </p>
                                <p className="capitalize">
                                  Drought Status:{' '}
                                  <strong>
                                    {lookedUpProfile.farmer.extendedData.adminAugmentation.earthObservation.vhiDroughtStatus}
                                  </strong>
                                </p>
                                <p>
                                  Soil Moisture Index:{' '}
                                  <strong>
                                    {lookedUpProfile.farmer.extendedData.adminAugmentation.earthObservation.soilMoistureIndex}%
                                  </strong>
                                </p>
                              </div>

                              <div className="p-4 rounded-lg bg-orange-50/70 border border-orange-100">
                                <p className="font-bold text-orange-900 mb-2">
                                  Soil Science Results
                                </p>
                                <p>
                                  Soil pH:{' '}
                                  <strong>
                                    {lookedUpProfile.farmer.extendedData.adminAugmentation.soilScience.pH}
                                  </strong>{' '}
                                  ({lookedUpProfile.farmer.extendedData.adminAugmentation.soilScience.soilTexture})
                                </p>
                                <p>
                                  Fertility Score:{' '}
                                  <strong>
                                    {lookedUpProfile.farmer.extendedData.adminAugmentation.soilScience.soilFertilityScore}/100
                                  </strong>
                                </p>
                                <p>
                                  NPK:{' '}
                                  <strong>
                                    {lookedUpProfile.farmer.extendedData.adminAugmentation.soilScience.nitrogen}% N,{' '}
                                    {lookedUpProfile.farmer.extendedData.adminAugmentation.soilScience.phosphorus}P,{' '}
                                    {lookedUpProfile.farmer.extendedData.adminAugmentation.soilScience.potassium}K
                                  </strong>
                                </p>
                              </div>

                              <div className="p-4 rounded-lg bg-indigo-50/70 border border-indigo-100">
                                <p className="font-bold text-indigo-900 mb-2">
                                  Demo Plot Benchmark
                                </p>
                                <p>
                                  Farmer Yield:{' '}
                                  <strong>
                                    {lookedUpProfile.farmer.extendedData.adminAugmentation.demoPlotData.farmerExpectedYield} MT/ha
                                  </strong>
                                </p>
                                <p>
                                  Demo Benchmark:{' '}
                                  <strong>
                                    {lookedUpProfile.farmer.extendedData.adminAugmentation.demoPlotData.benchmarkYield} MT/ha
                                  </strong>
                                </p>
                                <p>
                                  Performance Ratio:{' '}
                                  <strong>
                                    {lookedUpProfile.farmer.extendedData.adminAugmentation.demoPlotData.performanceRatio}x
                                  </strong>
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Recommendations */}
                        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                          <h4 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <Award className="w-5 h-5 text-green-600" />
                            Agronomic &amp; Credit Recommendations
                          </h4>
                          <ul className="space-y-2 text-sm text-gray-700">
                            {lookedUpProfile.riskAssessment.recommendations.map((rec, i) => (
                              <li key={i} className="flex items-start gap-2.5">
                                <span className="w-2 h-2 rounded-full bg-green-600 mt-1.5 flex-shrink-0" />
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
                        <Clock className="w-10 h-10 text-amber-600 mx-auto mb-2" />
                        <h4 className="text-lg font-bold text-amber-900">
                          Awaiting Admin Risk Engine Augmentation
                        </h4>
                        <p className="text-sm text-amber-800 max-w-xl mx-auto mt-1">
                          Your primary baseline data is stored under ID{' '}
                          <strong className="font-mono">{lookedUpProfile.farmer.id}</strong>. Because the automated engine is currently in manual-augmentation mode, an administrator will append your Earth Observation, Soil Science, and Demo Plot metrics in the Central Admin Engine to generate your bank-ready credit profile.
                        </p>
                      </div>
                    )}
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