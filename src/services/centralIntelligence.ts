// Central Intelligence Service - The Brain of BlueRakeAgriTech Ghana
// Implements the Farmer Portal -> Central System (GHFAxxx ID Generation) -> Admin Risk Engine (Manual Augmentation) -> Bank Portal workflow.
// Backed by dual-persistence: Supabase + LocalStorage fallback for 100% reliability offline/online.

import { supabase } from '../lib/supabase';
import { riskAssessmentEngine, type RawFarmParameters } from './riskAssessmentEngine';
import type {
  Farmer,
  AdminAugmentationData,
  BankGradeRiskAssessment,
  FarmSenseSoilData,
  DemoPlot,
  ProductionPlan,
} from '../types';

export interface FarmerIntelligenceProfile {
  farmer: Farmer;
  farmSenseData?: FarmSenseSoilData;
  demoPlotComparison?: {
    farmerYield: number;
    benchmarkYield: number;
    performanceRatio: number;
  };
  riskAssessment?: BankGradeRiskAssessment;
  productionHistory: ProductionPlan[];
  financialHistory: {
    totalLoans: number;
    repaidLoans: number;
    defaultedLoans: number;
    repaymentBehavior: 'excellent' | 'good' | 'poor';
  };
  ndviHistory: {
    date: string;
    value: number;
    status: 'excellent' | 'good' | 'poor';
  }[];
  weatherRisk: {
    droughtRisk: 'low' | 'medium' | 'high';
    floodRisk: 'low' | 'medium' | 'high';
    climateScore: number;
  };
  soilData?: FarmSenseSoilData;
}

export interface BankIntelligenceRecord {
  farmerId: string;
  farmerName: string;
  location: string;
  farmSize: number;
  cropType: string;
  season: string;
  riskScore: number;
  riskCategory: 'Low' | 'Medium' | 'High';
  defaultProbability: number;
  profitCapacity: number;
  recommendedLoanAmount: number;
  repaymentPeriod: number;
  loanStatus: 'eligible' | 'conditional' | 'not_eligible';
  lastAssessment: string;
}

// ── LocalStorage Keys for Resilient Persistence ─────────────────────────────
const LS_KEYS = {
  FARMERS: 'bluerake_central_farmers_v2',
  SOIL: 'bluerake_central_soil_v2',
  RISK: 'bluerake_central_risk_v2',
  BANK: 'bluerake_central_bank_v2',
  DEMO: 'bluerake_central_demo_v2',
};

function readLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('LocalStorage write warning:', e);
  }
}

// ── GHFA Sequential ID <-> UUID Mapping for Postgres Compatibility ──────────
export function normalizeGhfaId(input: string): string {
  const cleaned = input.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  const match = cleaned.match(/^GHFA(\d+)$/);
  if (match) {
    const num = parseInt(match[1], 10);
    return `GHFA${String(num).padStart(3, '0')}`;
  }
  return input.trim();
}

export function isGhfaId(id: string): boolean {
  return /^GHFA\d{3,}$/i.test(id.trim());
}

export function extractGhfaNumber(id: string): number | null {
  const cleaned = id.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  const match = cleaned.match(/^GHFA(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
}

// Converts GHFA001 -> 00000000-0000-4000-8000-000000000001 for Postgres UUID columns
function ghfaToUuid(id: string): string {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(id)) return id;
  const num = extractGhfaNumber(id);
  if (num !== null) {
    return `00000000-0000-4000-8000-${String(num).padStart(12, '0')}`;
  }
  // Fallback deterministic hash to valid UUID
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return `00000000-0000-4000-8000-${String(hash).padStart(12, '0')}`;
}

function uuidToGhfa(uuid: string, extendedData?: any): string {
  if (extendedData?.ghfaId && isGhfaId(extendedData.ghfaId)) {
    return normalizeGhfaId(extendedData.ghfaId);
  }
  if (isGhfaId(uuid)) {
    return normalizeGhfaId(uuid);
  }
  const match = uuid.match(/^00000000-0000-4000-8000-(\d{12})$/);
  if (match) {
    const num = parseInt(match[1], 10);
    if (num > 0 && num < 1000000) {
      return `GHFA${String(num).padStart(3, '0')}`;
    }
  }
  return uuid;
}

// ── Default Seed Farmers (GHFA001, GHFA002) ─────────────────────────────────
const DEFAULT_SEED_FARMERS: Farmer[] = [
  {
    id: 'GHFA001',
    fullName: 'Kwame Asante',
    age: 45,
    gender: 'male',
    education: 'secondary',
    farmingExperience: 20,
    phone: '+233 24 412 3456',
    email: 'kwame.asante@email.com',
    ghanaCardId: 'GHA-123456789-0',
    language: 'en',
    farmSize: 5.5,
    irrigationAccess: true,
    mechanisationAccess: true,
    location: {
      latitude: 6.6885,
      longitude: -1.6244,
      region: 'Ashanti',
      district: 'Ejura-Sekyedumase',
      community: 'Ejura Nkwanta',
      agroEcologicalZone: 'Forest Zone',
    },
    extensionScore: 85,
    performanceRatio: 1.15,
    created_at: '2025-01-15T09:30:00Z',
    extendedData: {
      ghfaId: 'GHFA001',
      primaryCrop: 'Maize',
      season: 'Main 2025',
      registrationStatus: 'pending_augmentation',
      landTenure: 'owned',
      soilData: {
        soilType: 'loamy',
        soilFertility: 'medium',
        organicMatter: 2.8,
        moisture: 24,
        pH: 6.4,
        lastUpdated: '2025-01-15T09:30:00Z',
      },
      cropManagement: {
        practicesCropRotation: true,
        previousCrops: {
          cocoa: false,
          maize: true,
          rice: false,
          cassava: true,
          yam: false,
          plantain: false,
          groundnuts: true,
          oilPalm: false,
        },
      },
      inputAccess: {
        qualitySeeds: true,
        fertilizer: true,
        tools: true,
        subsidies: false,
      },
      infrastructure: {
        roadAccess: true,
        irrigationSystem: true,
        storageFacilities: true,
      },
      socialFinancial: {
        cooperativeMember: true,
        cooperativeName: 'Ejura Maize Growers Cooperative',
        vslaMember: true,
        offFarmIncome: true,
        hasSavings: true,
        familySupport: true,
      },
      vegetationHealth: {
        ndviScore: 0.68,
        lastUpdated: '2025-01-15T09:30:00Z',
      },
    },
  },
  {
    id: 'GHFA002',
    fullName: 'Ama Serwaa',
    age: 38,
    gender: 'female',
    education: 'primary',
    farmingExperience: 15,
    phone: '+233 24 498 7654',
    ghanaCardId: 'GHA-987654321-0',
    language: 'tw',
    farmSize: 3.2,
    irrigationAccess: false,
    mechanisationAccess: false,
    location: {
      latitude: 5.6037,
      longitude: -0.1870,
      region: 'Western',
      district: 'Sefwi Wiawso',
      community: 'Asawinso',
      agroEcologicalZone: 'Forest Zone',
    },
    extensionScore: 74,
    performanceRatio: 0.95,
    created_at: '2025-02-01T11:15:00Z',
    extendedData: {
      ghfaId: 'GHFA002',
      primaryCrop: 'Cocoa',
      season: 'Main 2025',
      registrationStatus: 'pending_augmentation',
      landTenure: 'owned',
      soilData: {
        soilType: 'loamy',
        soilFertility: 'medium',
        organicMatter: 2.2,
        moisture: 20,
        pH: 5.8,
        lastUpdated: '2025-02-01T11:15:00Z',
      },
      cropManagement: {
        practicesCropRotation: false,
        previousCrops: {
          cocoa: true,
          maize: false,
          rice: false,
          cassava: false,
          yam: false,
          plantain: true,
          groundnuts: false,
          oilPalm: false,
        },
      },
      inputAccess: {
        qualitySeeds: true,
        fertilizer: true,
        tools: false,
        subsidies: true,
      },
      infrastructure: {
        roadAccess: true,
        irrigationSystem: false,
        storageFacilities: false,
      },
      socialFinancial: {
        cooperativeMember: true,
        cooperativeName: 'Western Cocoa Farmers Union',
        vslaMember: true,
        offFarmIncome: false,
        hasSavings: true,
        familySupport: true,
      },
      vegetationHealth: {
        ndviScore: 0.62,
        lastUpdated: '2025-02-01T11:15:00Z',
      },
    },
  },
];

// ── DB row types (snake_case from Postgres) ──────────────────────────────────
interface FarmerRow {
  id: string;
  full_name: string;
  age: number;
  gender: string;
  education: string;
  farming_experience: number;
  phone: string;
  email: string | null;
  ghana_card_id: string;
  language: string;
  photo_url: string | null;
  farm_photo_url: string | null;
  farm_size: number;
  irrigation_access: boolean;
  mechanisation_access: boolean;
  location: any;
  extension_score: number;
  performance_ratio: number;
  extended_data: any;
  created_at: string;
}

interface SoilRow {
  id: string;
  farmer_id: string;
  report_date: string;
  report_type: string;
  report_url: string | null;
  soil_data: any;
  crop_suitability: any;
  fertilizer_recommendation: any;
  created_at: string;
}

interface RiskRow {
  id: string;
  farmer_id: string;
  score: number;
  risk_level: string;
  default_probability: number;
  profit_capacity: number;
  safe_loan_amount: number;
  recommended_repayment_period: number;
  recommendations: any;
  factors: any;
  created_at: string;
}

interface BankRow {
  id: string;
  farmer_id: string;
  farmer_name: string;
  location: string;
  farm_size: number;
  crop_type: string;
  season: string;
  risk_score: number;
  risk_category: string;
  default_probability: number;
  profit_capacity: number;
  recommended_loan_amount: number;
  repayment_period: number;
  loan_status: string;
  last_assessment: string;
}

interface DemoRow {
  id: string;
  agro_ecological_zone: string;
  crop_type: string;
  variety: string;
  season: string;
  year: number;
  soil_test_results: any;
  fertilizer_used: any;
  yield_achieved: number;
  weather_conditions: any;
  production_cost: number;
  market_price: number;
  profit: number;
  extension_officer: string;
  created_at: string;
}

// ── Converters ───────────────────────────────────────────────────────────────

function farmerRowToType(row: FarmerRow): Farmer {
  const ghfaId = uuidToGhfa(row.id, row.extended_data);
  return {
    id: ghfaId,
    fullName: row.full_name,
    age: Number(row.age) || 0,
    gender: (row.gender as Farmer['gender']) || 'male',
    education: (row.education as Farmer['education']) || 'primary',
    farmingExperience: Number(row.farming_experience) || 0,
    phone: row.phone || '',
    email: row.email ?? undefined,
    ghanaCardId: row.ghana_card_id || '',
    language: (row.language as Farmer['language']) || 'en',
    photoUrl: row.photo_url ?? undefined,
    farmPhotoUrl: row.farm_photo_url ?? undefined,
    farmSize: Number(row.farm_size) || 0,
    irrigationAccess: Boolean(row.irrigation_access),
    mechanisationAccess: Boolean(row.mechanisation_access),
    location: row.location || {
      latitude: 0,
      longitude: 0,
      region: '',
      district: '',
      agroEcologicalZone: '',
    },
    extensionScore: Number(row.extension_score) || 0,
    performanceRatio: Number(row.performance_ratio) || 1.0,
    created_at: row.created_at || new Date().toISOString(),
    extendedData: row.extended_data
      ? {
          ...row.extended_data,
          ghfaId,
        }
      : undefined,
  };
}

function farmerToRow(farmer: Farmer): Partial<FarmerRow> {
  const normalizedId = isGhfaId(farmer.id) ? normalizeGhfaId(farmer.id) : farmer.id;
  const dbUuid = ghfaToUuid(normalizedId);
  const extendedData = {
    ...(farmer.extendedData || {}),
    ghfaId: normalizedId,
  };

  return {
    id: dbUuid,
    full_name: farmer.fullName,
    age: farmer.age,
    gender: farmer.gender,
    education: farmer.education,
    farming_experience: farmer.farmingExperience,
    phone: farmer.phone,
    email: farmer.email ?? null,
    ghana_card_id: farmer.ghanaCardId,
    language: farmer.language,
    photo_url: farmer.photoUrl ?? null,
    farm_photo_url: farmer.farmPhotoUrl ?? null,
    farm_size: farmer.farmSize,
    irrigation_access: farmer.irrigationAccess,
    mechanisation_access: farmer.mechanisationAccess,
    location: farmer.location,
    extension_score: farmer.extensionScore,
    performance_ratio: farmer.performanceRatio,
    extended_data: extendedData,
  };
}

function soilRowToType(row: SoilRow): FarmSenseSoilData {
  return {
    id: row.id,
    farmerId: uuidToGhfa(row.farmer_id),
    reportDate: row.report_date,
    reportType: row.report_type as FarmSenseSoilData['reportType'],
    reportUrl: row.report_url ?? undefined,
    soilData: row.soil_data,
    cropSuitability: row.crop_suitability,
    fertilizerRecommendation: row.fertilizer_recommendation,
    created_at: row.created_at,
  };
}

function riskRowToType(row: RiskRow): BankGradeRiskAssessment {
  return {
    score: Number(row.score),
    riskLevel: row.risk_level as BankGradeRiskAssessment['riskLevel'],
    defaultProbability: Number(row.default_probability),
    profitCapacity: Number(row.profit_capacity),
    safeLoanAmount: Number(row.safe_loan_amount),
    recommendedRepaymentPeriod: Number(row.recommended_repayment_period),
    recommendations: row.recommendations || [],
    factors: row.factors || {},
    created_at: row.created_at,
  };
}

function bankRowToType(row: BankRow): BankIntelligenceRecord {
  return {
    farmerId: uuidToGhfa(row.farmer_id),
    farmerName: row.farmer_name,
    location: row.location,
    farmSize: Number(row.farm_size),
    cropType: row.crop_type,
    season: row.season,
    riskScore: Number(row.risk_score),
    riskCategory: row.risk_category as BankIntelligenceRecord['riskCategory'],
    defaultProbability: Number(row.default_probability),
    profitCapacity: Number(row.profit_capacity),
    recommendedLoanAmount: Number(row.recommended_loan_amount),
    repaymentPeriod: Number(row.repayment_period),
    loanStatus: row.loan_status as BankIntelligenceRecord['loanStatus'],
    lastAssessment: row.last_assessment,
  };
}

function demoRowToType(row: DemoRow): DemoPlot {
  return {
    id: row.id,
    agroEcologicalZone: row.agro_ecological_zone,
    cropType: row.crop_type,
    variety: row.variety,
    season: row.season,
    year: row.year,
    soilTestResults: row.soil_test_results,
    fertilizerUsed: row.fertilizer_used,
    yieldAchieved: Number(row.yield_achieved),
    weatherConditions: row.weather_conditions,
    productionCost: Number(row.production_cost),
    marketPrice: Number(row.market_price),
    profit: Number(row.profit),
    extensionOfficer: row.extension_officer,
    created_at: row.created_at,
  };
}

// ── Service Implementation ──────────────────────────────────────────────────

class CentralIntelligenceService {
  // 1. AUTOMATED SEQUENTIAL ID GENERATION (GHFA001, GHFA002, ...)
  async generateNextFarmerId(): Promise<string> {
    const existingProfiles = await this.getAllFarmers();
    let maxNum = 0;

    for (const profile of existingProfiles) {
      const num = extractGhfaNumber(profile.farmer.id);
      if (num !== null && num > maxNum) {
        maxNum = num;
      }
    }

    const nextNum = maxNum + 1;
    return `GHFA${String(nextNum).padStart(3, '0')}`;
  }

  // Intercepts incoming registration data from Farmer Portal and assigns sequential GHFAxxx ID
  async registerFarmer(farmerInput: Partial<Farmer>): Promise<Farmer> {
    const generatedId =
      farmerInput.id && isGhfaId(farmerInput.id)
        ? normalizeGhfaId(farmerInput.id)
        : await this.generateNextFarmerId();

    const now = new Date().toISOString();
    const completeFarmer: Farmer = {
      id: generatedId,
      fullName: farmerInput.fullName || 'Unnamed Farmer',
      age: Number(farmerInput.age) || 0,
      gender: farmerInput.gender || 'male',
      education: farmerInput.education || 'primary',
      farmingExperience: Number(farmerInput.farmingExperience) || 0,
      phone: farmerInput.phone || '',
      email: farmerInput.email || undefined,
      ghanaCardId: farmerInput.ghanaCardId || '',
      language: farmerInput.language || 'en',
      farmSize: Number(farmerInput.farmSize) || 0,
      irrigationAccess: Boolean(farmerInput.irrigationAccess),
      mechanisationAccess: Boolean(farmerInput.mechanisationAccess),
      location: {
        latitude: Number(farmerInput.location?.latitude) || 0,
        longitude: Number(farmerInput.location?.longitude) || 0,
        region: farmerInput.location?.region || '',
        district: farmerInput.location?.district || '',
        community: farmerInput.location?.community || '',
        agroEcologicalZone: farmerInput.location?.agroEcologicalZone || 'Forest Zone',
      },
      extensionScore: Number(farmerInput.extensionScore) || 0,
      performanceRatio: Number(farmerInput.performanceRatio) || 1.0,
      created_at: farmerInput.created_at || now,
      extendedData: {
        ghfaId: generatedId,
        primaryCrop: farmerInput.extendedData?.primaryCrop || 'Maize',
        season: farmerInput.extendedData?.season || 'Main 2025',
        registrationStatus: farmerInput.extendedData?.registrationStatus || 'pending_augmentation',
        landTenure: farmerInput.extendedData?.landTenure || 'owned',
        soilData: farmerInput.extendedData?.soilData || {
          soilType: 'loamy',
          soilFertility: 'medium',
          organicMatter: 0,
          moisture: 0,
          pH: 0,
          lastUpdated: now,
        },
        cropManagement: farmerInput.extendedData?.cropManagement || {
          practicesCropRotation: false,
          previousCrops: {
            cocoa: false,
            maize: false,
            rice: false,
            cassava: false,
            yam: false,
            plantain: false,
            groundnuts: false,
            oilPalm: false,
          },
        },
        inputAccess: farmerInput.extendedData?.inputAccess || {
          qualitySeeds: false,
          fertilizer: false,
          tools: false,
          subsidies: false,
        },
        infrastructure: farmerInput.extendedData?.infrastructure || {
          roadAccess: false,
          irrigationSystem: Boolean(farmerInput.irrigationAccess),
          storageFacilities: false,
        },
        socialFinancial: farmerInput.extendedData?.socialFinancial || {
          cooperativeMember: false,
          cooperativeName: '',
          vslaMember: false,
          offFarmIncome: false,
          hasSavings: false,
          familySupport: false,
        },
        vegetationHealth: farmerInput.extendedData?.vegetationHealth || {
          ndviScore: 0,
          lastUpdated: now,
        },
        adminAugmentation: farmerInput.extendedData?.adminAugmentation,
      },
    };

    await this.saveFarmerRecord(completeFarmer);
    return completeFarmer;
  }

  // Backwards-compatible addFarmer that also enforces GHFAxxx sequential ID
  async addFarmer(farmer: Farmer): Promise<Farmer> {
    if (!farmer.id || !isGhfaId(farmer.id)) {
      return this.registerFarmer({ ...farmer, id: undefined });
    }
    const normalized = normalizeGhfaId(farmer.id);
    const updatedFarmer: Farmer = {
      ...farmer,
      id: normalized,
      extendedData: {
        ...(farmer.extendedData || {
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
              maize: false,
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
            roadAccess: false,
            irrigationSystem: farmer.irrigationAccess,
            storageFacilities: false,
          },
          socialFinancial: {
            cooperativeMember: false,
            cooperativeName: '',
            offFarmIncome: false,
            hasSavings: false,
            familySupport: false,
          },
          vegetationHealth: {
            ndviScore: 0,
            lastUpdated: new Date().toISOString(),
          },
        }),
        ghfaId: normalized,
        registrationStatus: farmer.extendedData?.registrationStatus || 'pending_augmentation',
      },
    };
    await this.saveFarmerRecord(updatedFarmer);
    return updatedFarmer;
  }

  private async saveFarmerRecord(farmer: Farmer): Promise<void> {
    // 1. Save to LocalStorage
    const localFarmers = readLocal<Farmer[]>(LS_KEYS.FARMERS, []);
    const idx = localFarmers.findIndex((f) => normalizeGhfaId(f.id) === normalizeGhfaId(farmer.id));
    if (idx >= 0) {
      localFarmers[idx] = farmer;
    } else {
      localFarmers.push(farmer);
    }
    writeLocal(LS_KEYS.FARMERS, localFarmers);

    // 2. Sync to Supabase
    try {
      const row = farmerToRow(farmer);
      const { error } = await supabase.from('farmers').upsert(row, { onConflict: 'id' });
      if (error) {
        console.warn('Supabase farmers upsert notice (using local store):', error.message);
      }
    } catch (err) {
      console.warn('Supabase sync unreachable, persisted locally:', err);
    }
  }

  private buildProfileFromFarmer(
    farmer: Farmer,
    soilMap: Record<string, FarmSenseSoilData>,
    riskMap: Record<string, BankGradeRiskAssessment>
  ): FarmerIntelligenceProfile {
    const id = normalizeGhfaId(farmer.id);
    const soilData = soilMap[id];
    const riskAssessment = riskMap[id];
    const aug = farmer.extendedData?.adminAugmentation;

    const demoPlotComparison = aug?.demoPlotData
      ? {
          farmerYield: aug.demoPlotData.farmerExpectedYield,
          benchmarkYield: aug.demoPlotData.benchmarkYield,
          performanceRatio: aug.demoPlotData.performanceRatio,
        }
      : {
          farmerYield: Number((3.2 * (farmer.performanceRatio || 1)).toFixed(2)),
          benchmarkYield: 3.5,
          performanceRatio: farmer.performanceRatio || 1.0,
        };

    const ndviScore =
      aug?.earthObservation?.ndviScore ?? farmer.extendedData?.vegetationHealth?.ndviScore ?? 0;

    return {
      farmer,
      farmSenseData: soilData,
      soilData,
      demoPlotComparison,
      riskAssessment,
      productionHistory: [],
      financialHistory: {
        totalLoans: 0,
        repaidLoans: 0,
        defaultedLoans: 0,
        repaymentBehavior: 'good',
      },
      ndviHistory: ndviScore
        ? [
            {
              date: aug?.earthObservation?.observationDate || farmer.created_at,
              value: ndviScore,
              status: ndviScore >= 0.65 ? 'excellent' : ndviScore >= 0.45 ? 'good' : 'poor',
            },
          ]
        : [],
      weatherRisk: {
        droughtRisk: aug?.earthObservation?.droughtRisk || 'medium',
        floodRisk: aug?.earthObservation?.floodRisk || 'low',
        climateScore: ndviScore > 0 ? Math.min(1, ndviScore + 0.15) : 0.7,
      },
    };
  }

  async getAllFarmers(): Promise<FarmerIntelligenceProfile[]> {
    let localFarmers = readLocal<Farmer[]>(LS_KEYS.FARMERS, []);
    const localSoil = readLocal<Record<string, FarmSenseSoilData>>(LS_KEYS.SOIL, {});
    const localRisk = readLocal<Record<string, BankGradeRiskAssessment>>(LS_KEYS.RISK, {});

    // Fetch from Supabase and merge
    try {
      const { data: farmerRows, error } = await supabase
        .from('farmers')
        .select('*')
        .order('created_at', { ascending: true });

      if (!error && farmerRows && farmerRows.length > 0) {
        const dbFarmers = (farmerRows as FarmerRow[]).map((r, index) => {
          const converted = farmerRowToType(r);
          if (!isGhfaId(converted.id)) {
            converted.id = `GHFA${String(index + 1).padStart(3, '0')}`;
          }
          return converted;
        });

        // Merge dbFarmers with localFarmers (prefer newest / augmented state)
        const mergedMap = new Map<string, Farmer>();
        for (const f of dbFarmers) {
          mergedMap.set(normalizeGhfaId(f.id), f);
        }
        for (const f of localFarmers) {
          const normId = normalizeGhfaId(f.id);
          const existing = mergedMap.get(normId);
          if (!existing || f.extendedData?.adminAugmentation) {
            mergedMap.set(normId, { ...f, id: normId });
          }
        }
        localFarmers = Array.from(mergedMap.values());
        writeLocal(LS_KEYS.FARMERS, localFarmers);
      }
    } catch (err) {
      console.warn('Using local farmers cache:', err);
    }

    // Seed default GHFA001 & GHFA002 if completely empty
    if (localFarmers.length === 0) {
      localFarmers = [...DEFAULT_SEED_FARMERS];
      writeLocal(LS_KEYS.FARMERS, localFarmers);
      for (const seed of DEFAULT_SEED_FARMERS) {
        try {
          const row = farmerToRow(seed);
          await supabase.from('farmers').upsert(row, { onConflict: 'id' });
        } catch {
          // ignore offline error
        }
      }
    }

    // Sort by GHFA number ascending
    localFarmers.sort((a, b) => {
      const numA = extractGhfaNumber(a.id) ?? 999999;
      const numB = extractGhfaNumber(b.id) ?? 999999;
      return numA - numB;
    });

    return localFarmers.map((f) => this.buildProfileFromFarmer(f, localSoil, localRisk));
  }

  async getFarmerProfile(farmerId: string): Promise<FarmerIntelligenceProfile | undefined> {
    const normalizedTarget = normalizeGhfaId(farmerId);
    const allProfiles = await this.getAllFarmers();
    return allProfiles.find((p) => normalizeGhfaId(p.farmer.id) === normalizedTarget);
  }

  async updateFarmerData(farmerId: string, updates: Partial<Farmer>): Promise<void> {
    const existing = await this.getFarmerProfile(farmerId);
    if (!existing) return;
    const updated: Farmer = {
      ...existing.farmer,
      ...updates,
      id: normalizeGhfaId(existing.farmer.id),
    };
    await this.saveFarmerRecord(updated);
  }

  async addFarmSenseData(farmerId: string, soilData: FarmSenseSoilData): Promise<void> {
    const normId = normalizeGhfaId(farmerId);
    const localSoil = readLocal<Record<string, FarmSenseSoilData>>(LS_KEYS.SOIL, {});
    localSoil[normId] = { ...soilData, farmerId: normId };
    writeLocal(LS_KEYS.SOIL, localSoil);

    try {
      const dbUuid = ghfaToUuid(normId);
      await supabase.from('farmsense_soil_data').insert({
        farmer_id: dbUuid,
        report_date: soilData.reportDate,
        report_type: soilData.reportType,
        report_url: soilData.reportUrl ?? null,
        soil_data: soilData.soilData,
        crop_suitability: soilData.cropSuitability,
        fertilizer_recommendation: soilData.fertilizerRecommendation,
      });
    } catch (err) {
      console.warn('Supabase soil insert notice (persisted locally):', err);
    }
  }

  // ── 3. ADMIN RISK ENGINE: MANUAL DATA AUGMENTATION & BANK-READY PROFILE ────
  calculateCombinedAssessmentPreview(
    farmer: Farmer,
    augmentation: AdminAugmentationData
  ): BankGradeRiskAssessment {
    const primaryCrop = farmer.extendedData?.primaryCrop || 'Maize';
    const tenureRaw = farmer.extendedData?.landTenure || 'owned';
    const tenureType: RawFarmParameters['tenureType'] =
      tenureRaw === 'owned' ? 'owner' : tenureRaw === 'lease' ? 'lease' : 'abunu';

    const riskParameters: RawFarmParameters = {
      farmerId: farmer.id,
      experience: farmer.farmingExperience || 5,
      age: farmer.age || 35,
      vslaMembership:
        farmer.extendedData?.socialFinancial.vslaMember ||
        farmer.extendedData?.socialFinancial.cooperativeMember ||
        false,
      fboMembership: farmer.extendedData?.socialFinancial.cooperativeMember ? 'active' : 'none',
      accessToInsurance: farmer.extendedData?.socialFinancial.hasSavings || false,
      farmSize: farmer.farmSize || 2,
      cropType: primaryCrop,
      tenureType,
      mechanizationAccess: farmer.mechanisationAccess,
      laborSource: 'family',
      gpsCoordinates: {
        latitude: farmer.location.latitude || 6.6885,
        longitude: farmer.location.longitude || -1.6244,
      },
      agroEcologicalZone: farmer.location.agroEcologicalZone || 'Forest Zone',
      rainfallPattern: augmentation.earthObservation.rainfallPattern,
      temperatureTrend: 'stable',
      soilType: augmentation.soilScience.soilTexture,
      soilDepth: augmentation.soilScience.soilDepth,
      ndviTrend: augmentation.earthObservation.ndviScore,
      vhiDroughtStatus: augmentation.earthObservation.vhiDroughtStatus,
      distanceToPavedRoad: farmer.extendedData?.infrastructure.roadAccess ? 3 : 12,
      roadQuality: farmer.extendedData?.infrastructure.roadAccess ? 'good' : 'poor',
      distanceToMarket: 8,
      storageType: farmer.extendedData?.infrastructure.storageFacilities
        ? 'hermetic_pics'
        : 'basic',
      inputSource: farmer.extendedData?.inputAccess.subsidies ? 'pfj_subsidy' : 'cash_purchase',
      fertilizerTimingReliability: farmer.extendedData?.inputAccess.fertilizer ?? true,
      pestControlCapacity: augmentation.demoPlotData.pestControlCapacity,
    };

    const engineResult = riskAssessmentEngine.runRiskAssessment(riskParameters);

    // Incorporate Soil Fertility Score & Demo Plot Performance Ratio into final score
    const soilBonus = (augmentation.soilScience.soilFertilityScore - 60) * 0.15;
    const demoRatioBonus = (augmentation.demoPlotData.performanceRatio - 1.0) * 15;
    const adjustedScore = Math.round(
      Math.max(10, Math.min(98, engineResult.finalRiskScore + soilBonus + demoRatioBonus))
    );

    const riskLevel: BankGradeRiskAssessment['riskLevel'] =
      adjustedScore >= 70 ? 'Low' : adjustedScore >= 50 ? 'Medium' : 'High';

    const factors = {
      soilFertility: Math.min(1, Math.max(0.1, augmentation.soilScience.soilFertilityScore / 100)),
      ndviHealth: Math.min(1, Math.max(0.1, augmentation.earthObservation.ndviScore)),
      climateRisk:
        augmentation.earthObservation.droughtRisk === 'low'
          ? 0.9
          : augmentation.earthObservation.droughtRisk === 'medium'
          ? 0.65
          : 0.35,
      pestHistory:
        augmentation.demoPlotData.pestControlCapacity === 'high'
          ? 0.9
          : augmentation.demoPlotData.pestControlCapacity === 'medium'
          ? 0.75
          : 0.45,
      marketAccess: farmer.extendedData?.infrastructure.roadAccess ? 0.85 : 0.55,
      infrastructure:
        (farmer.irrigationAccess ? 0.45 : 0.2) +
        (farmer.extendedData?.infrastructure.storageFacilities ? 0.45 : 0.25),
      landTenure: tenureRaw === 'owned' ? 1.0 : tenureRaw === 'lease' ? 0.75 : 0.5,
      farmerPerformance: Math.min(1, Math.max(0.2, augmentation.demoPlotData.extensionComplianceScore / 100)),
      demoPlotComparison: Math.min(1, Math.max(0.2, augmentation.demoPlotData.performanceRatio)),
    };

    const safeLoanAmount = Math.round(
      farmer.farmSize * 2800 * (adjustedScore / 100) * Math.max(0.8, augmentation.demoPlotData.performanceRatio)
    );
    const profitCapacity = Math.round(safeLoanAmount * 1.65);

    const recommendations = [
      ...engineResult.recommendations,
      augmentation.soilScience.fertilizerRecommendation
        ? `Soil Science Directive: ${augmentation.soilScience.fertilizerRecommendation}`
        : `Maintain balanced NPK fertilization aligned with pH ${augmentation.soilScience.pH}.`,
      augmentation.demoPlotData.fieldNotes
        ? `Extension Field Note: ${augmentation.demoPlotData.fieldNotes}`
        : `Target Demo Plot benchmark of ${augmentation.demoPlotData.benchmarkYield} MT/ha.`,
    ];

    return {
      score: adjustedScore,
      riskLevel,
      defaultProbability: this.calculateDefaultProbability(adjustedScore, factors),
      profitCapacity,
      safeLoanAmount,
      recommendedRepaymentPeriod: engineResult.creditRecommendation.repaymentPeriod || 12,
      recommendations,
      factors,
      created_at: new Date().toISOString(),
    };
  }

  async saveAdminAugmentation(
    farmerId: string,
    augmentation: AdminAugmentationData,
    manualRiskOverrides?: Partial<BankGradeRiskAssessment>
  ): Promise<{
    profile: FarmerIntelligenceProfile;
    assessment: BankGradeRiskAssessment;
    bankRecord: BankIntelligenceRecord;
  }> {
    const normId = normalizeGhfaId(farmerId);
    const existingProfile = await this.getFarmerProfile(normId);
    if (!existingProfile) {
      throw new Error(`Farmer profile not found for ID: ${normId}`);
    }

    const farmer = existingProfile.farmer;
    const now = new Date().toISOString();

    // 1. Update Farmer record with Admin Augmentation payload
    const updatedFarmer: Farmer = {
      ...farmer,
      id: normId,
      extensionScore: augmentation.demoPlotData.extensionComplianceScore,
      performanceRatio: augmentation.demoPlotData.performanceRatio,
      extendedData: {
        ...(farmer.extendedData || {
          landTenure: 'owned',
          soilData: {
            soilType: 'loamy',
            soilFertility: 'medium',
            organicMatter: 0,
            moisture: 0,
            pH: 0,
            lastUpdated: now,
          },
          cropManagement: {
            practicesCropRotation: false,
            previousCrops: {
              cocoa: false,
              maize: false,
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
            roadAccess: false,
            irrigationSystem: farmer.irrigationAccess,
            storageFacilities: false,
          },
          socialFinancial: {
            cooperativeMember: false,
            cooperativeName: '',
            offFarmIncome: false,
            hasSavings: false,
            familySupport: false,
          },
          vegetationHealth: {
            ndviScore: 0,
            lastUpdated: now,
          },
        }),
        ghfaId: normId,
        registrationStatus: 'augmented_bank_ready',
        soilData: {
          soilType: augmentation.soilScience.soilTexture,
          soilFertility:
            augmentation.soilScience.soilFertilityScore >= 70
              ? 'high'
              : augmentation.soilScience.soilFertilityScore >= 45
              ? 'medium'
              : 'low',
          organicMatter: augmentation.soilScience.organicMatter,
          moisture: augmentation.soilScience.moisture,
          pH: augmentation.soilScience.pH,
          lastUpdated: now,
        },
        vegetationHealth: {
          ndviScore: augmentation.earthObservation.ndviScore,
          lastUpdated: augmentation.earthObservation.observationDate || now,
        },
        adminAugmentation: {
          ...augmentation,
          augmentedAt: now,
        },
      },
    };

    await this.saveFarmerRecord(updatedFarmer);

    // 2. Save Soil Science record
    const soilRecord: FarmSenseSoilData = {
      id: `soil_${normId}_${Date.now()}`,
      farmerId: normId,
      reportDate: augmentation.soilScience.labReportDate || now.split('T')[0],
      reportType: 'manual',
      soilData: {
        pH: augmentation.soilScience.pH,
        nitrogen: augmentation.soilScience.nitrogen,
        phosphorus: augmentation.soilScience.phosphorus,
        potassium: augmentation.soilScience.potassium,
        soilFertilityScore: augmentation.soilScience.soilFertilityScore,
        soilTexture: augmentation.soilScience.soilTexture,
        moisture: augmentation.soilScience.moisture,
        organicMatter: augmentation.soilScience.organicMatter,
      },
      cropSuitability: [
        {
          crop: updatedFarmer.extendedData?.primaryCrop || 'Maize',
          suitabilityScore: augmentation.soilScience.soilFertilityScore,
        },
      ],
      fertilizerRecommendation: [
        {
          type: augmentation.soilScience.fertilizerRecommendation || 'NPK 15-15-15 + Urea',
          quantity: Math.round(updatedFarmer.farmSize * 4),
          applicationTiming: 'Split application at planting and 4 weeks after emergence',
          cost: Math.round(updatedFarmer.farmSize * 1200),
        },
      ],
      created_at: now,
    };

    await this.addFarmSenseData(normId, soilRecord);

    // 3. Generate Combined Bank-Grade Risk Assessment (Farmer Input + Admin Augmentation)
    const calculatedAssessment = this.calculateCombinedAssessmentPreview(updatedFarmer, augmentation);
    const finalAssessment: BankGradeRiskAssessment = {
      ...calculatedAssessment,
      ...manualRiskOverrides,
      created_at: now,
    };

    // Persist Risk Assessment locally + Supabase
    const localRisk = readLocal<Record<string, BankGradeRiskAssessment>>(LS_KEYS.RISK, {});
    localRisk[normId] = finalAssessment;
    writeLocal(LS_KEYS.RISK, localRisk);

    try {
      const dbUuid = ghfaToUuid(normId);
      await supabase.from('risk_assessments').insert({
        farmer_id: dbUuid,
        score: finalAssessment.score,
        risk_level: finalAssessment.riskLevel,
        default_probability: finalAssessment.defaultProbability,
        profit_capacity: finalAssessment.profitCapacity,
        safe_loan_amount: finalAssessment.safeLoanAmount,
        recommended_repayment_period: finalAssessment.recommendedRepaymentPeriod,
        recommendations: finalAssessment.recommendations,
        factors: finalAssessment.factors,
      });
    } catch (err) {
      console.warn('Supabase risk insert notice (persisted locally):', err);
    }

    // 4. Publish Bank-Ready Intelligence Record
    const bankRecord = await this.updateBankIntelligence(normId, updatedFarmer, finalAssessment);
    const updatedProfile = (await this.getFarmerProfile(normId))!;

    return {
      profile: updatedProfile,
      assessment: finalAssessment,
      bankRecord,
    };
  }

  // Fallback automated runRiskAssessment (uses default augmentation if none present)
  async runRiskAssessment(farmerId: string): Promise<BankGradeRiskAssessment> {
    const normId = normalizeGhfaId(farmerId);
    const profile = await this.getFarmerProfile(normId);
    if (!profile) {
      throw new Error(`Farmer not found: ${normId}`);
    }

    const existingAug = profile.farmer.extendedData?.adminAugmentation || {
      earthObservation: {
        ndviScore: profile.farmer.extendedData?.vegetationHealth.ndviScore || 0.65,
        vegetationStatus: 'good' as const,
        vhiDroughtStatus: 'normal' as const,
        soilMoistureIndex: 62,
        rainfallPattern: 'bimodal' as const,
        annualRainfallMm: 1350,
        droughtRisk: 'low' as const,
        floodRisk: 'low' as const,
        imagerySource: 'Sentinel-2 / Google Earth Pro',
        observationDate: new Date().toISOString().split('T')[0],
      },
      soilScience: {
        pH: profile.farmer.extendedData?.soilData.pH || 6.4,
        nitrogen: 0.18,
        phosphorus: 28,
        potassium: 165,
        organicMatter: profile.farmer.extendedData?.soilData.organicMatter || 2.8,
        moisture: profile.farmer.extendedData?.soilData.moisture || 24,
        soilTexture: profile.farmer.extendedData?.soilData.soilType || 'loamy',
        soilDepth: 'medium' as const,
        soilFertilityScore: 76,
        fertilizerRecommendation: 'NPK 15-15-15 basal + Urea top-dressing',
        labReportDate: new Date().toISOString().split('T')[0],
      },
      demoPlotData: {
        farmerExpectedYield: 3.8,
        benchmarkYield: 3.5,
        performanceRatio: profile.farmer.performanceRatio || 1.08,
        extensionComplianceScore: profile.farmer.extensionScore || 82,
        pestControlCapacity: 'medium' as const,
        extensionOfficer: 'BlueRake Field Science Team',
        fieldNotes: 'Verified via Central System Risk Engine',
      },
      augmentedBy: 'Central Admin Engine',
      augmentedAt: new Date().toISOString(),
    };

    const { assessment } = await this.saveAdminAugmentation(normId, existingAug);
    return assessment;
  }

  // BANK INTELLIGENCE MANAGEMENT
  private async updateBankIntelligence(
    farmerId: string,
    farmer: Farmer,
    assessment: BankGradeRiskAssessment
  ): Promise<BankIntelligenceRecord> {
    const normId = normalizeGhfaId(farmerId);
    const record: BankIntelligenceRecord = {
      farmerId: normId,
      farmerName: farmer.fullName,
      location: `${farmer.location.region}${farmer.location.district ? `, ${farmer.location.district}` : ''}`,
      farmSize: farmer.farmSize,
      cropType: farmer.extendedData?.primaryCrop || 'Maize',
      season: farmer.extendedData?.season || 'Main 2025',
      riskScore: assessment.score,
      riskCategory: assessment.riskLevel,
      defaultProbability: assessment.defaultProbability,
      profitCapacity: assessment.profitCapacity,
      recommendedLoanAmount: assessment.safeLoanAmount,
      repaymentPeriod: assessment.recommendedRepaymentPeriod,
      loanStatus:
        assessment.riskLevel === 'Low'
          ? 'eligible'
          : assessment.riskLevel === 'Medium'
          ? 'conditional'
          : 'not_eligible',
      lastAssessment: new Date().toISOString(),
    };

    // Save locally
    const localBank = readLocal<BankIntelligenceRecord[]>(LS_KEYS.BANK, []);
    const filtered = localBank.filter((r) => normalizeGhfaId(r.farmerId) !== normId);
    filtered.unshift(record);
    writeLocal(LS_KEYS.BANK, filtered);

    // Sync to Supabase
    try {
      const dbUuid = ghfaToUuid(normId);
      const bankRow = {
        farmer_id: dbUuid,
        farmer_name: record.farmerName,
        location: record.location,
        farm_size: record.farmSize,
        crop_type: record.cropType,
        season: record.season,
        risk_score: record.riskScore,
        risk_category: record.riskCategory,
        default_probability: record.defaultProbability,
        profit_capacity: record.profitCapacity,
        recommended_loan_amount: record.recommendedLoanAmount,
        repayment_period: record.repaymentPeriod,
        loan_status: record.loanStatus,
        last_assessment: record.lastAssessment,
      };
      await supabase.from('bank_intelligence').delete().eq('farmer_id', dbUuid);
      await supabase.from('bank_intelligence').insert(bankRow);
    } catch (err) {
      console.warn('Supabase bank_intelligence sync notice (persisted locally):', err);
    }

    return record;
  }

  async getBankIntelligence(): Promise<BankIntelligenceRecord[]> {
    const localBank = readLocal<BankIntelligenceRecord[]>(LS_KEYS.BANK, []);

    try {
      const { data, error } = await supabase
        .from('bank_intelligence')
        .select('*')
        .order('last_assessment', { ascending: false });

      if (!error && data && data.length > 0) {
        const dbRecords = (data as BankRow[]).map(bankRowToType);
        const mergedMap = new Map<string, BankIntelligenceRecord>();
        for (const r of dbRecords) {
          mergedMap.set(normalizeGhfaId(r.farmerId), { ...r, farmerId: normalizeGhfaId(r.farmerId) });
        }
        for (const r of localBank) {
          mergedMap.set(normalizeGhfaId(r.farmerId), { ...r, farmerId: normalizeGhfaId(r.farmerId) });
        }
        const merged = Array.from(mergedMap.values());
        writeLocal(LS_KEYS.BANK, merged);
        return merged;
      }
    } catch (err) {
      console.warn('Using local bank intelligence cache:', err);
    }

    return localBank;
  }

  async getBankFarmerProfile(farmerId: string): Promise<
    | {
        intelligence: BankIntelligenceRecord;
        profile: FarmerIntelligenceProfile;
      }
    | undefined
  > {
    const normId = normalizeGhfaId(farmerId);
    const [allBank, profile] = await Promise.all([
      this.getBankIntelligence(),
      this.getFarmerProfile(normId),
    ]);

    const intelligence = allBank.find((b) => normalizeGhfaId(b.farmerId) === normId);
    if (intelligence && profile) {
      return { intelligence, profile };
    }
    return undefined;
  }

  // CREDIT REPORT GENERATION
  async generateCreditReport(farmerId: string): Promise<{
    farmerId: string;
    farmer: Farmer;
    adminAugmentation?: AdminAugmentationData;
    riskAssessment: BankGradeRiskAssessment;
    soilSummary: any;
    demoPlotComparison: any;
    yieldForecast: number;
    profitForecast: number;
    repaymentCapacity: number;
    generatedAt: string;
  }> {
    const normId = normalizeGhfaId(farmerId);
    const profile = await this.getFarmerProfile(normId);
    if (!profile || !profile.riskAssessment) {
      throw new Error('Farmer profile or risk assessment not found');
    }

    const aug = profile.farmer.extendedData?.adminAugmentation;

    return {
      farmerId: normId,
      farmer: profile.farmer,
      adminAugmentation: aug,
      riskAssessment: profile.riskAssessment,
      soilSummary: aug?.soilScience
        ? {
            pH: aug.soilScience.pH,
            nitrogen: aug.soilScience.nitrogen,
            phosphorus: aug.soilScience.phosphorus,
            potassium: aug.soilScience.potassium,
            fertility: aug.soilScience.soilFertilityScore,
            texture: aug.soilScience.soilTexture,
            organicMatter: aug.soilScience.organicMatter,
            moisture: aug.soilScience.moisture,
          }
        : profile.farmSenseData
        ? {
            pH: profile.farmSenseData.soilData.pH,
            fertility: profile.farmSenseData.soilData.soilFertilityScore,
            texture: profile.farmSenseData.soilData.soilTexture,
          }
        : null,
      demoPlotComparison: profile.demoPlotComparison,
      yieldForecast: this.calculateYieldForecast(profile),
      profitForecast: profile.riskAssessment.profitCapacity,
      repaymentCapacity: profile.riskAssessment.safeLoanAmount,
      generatedAt: new Date().toISOString(),
    };
  }

  // CALCULATION METHODS
  private calculateDefaultProbability(score: number, factors: any): number {
    const baseRate = 100 - score;
    const adjustments = (1 - (factors.farmerPerformance || 0.8)) * 10;
    return Math.round(Math.max(4, Math.min(95, baseRate + adjustments)) * 10) / 10;
  }

  private calculateYieldForecast(profile: FarmerIntelligenceProfile): number {
    const aug = profile.farmer.extendedData?.adminAugmentation;
    if (aug?.demoPlotData?.farmerExpectedYield) {
      return aug.demoPlotData.farmerExpectedYield;
    }
    const baseYield = 3.5;
    const soilMultiplier = profile.soilData
      ? profile.soilData.soilData.soilFertilityScore / 100
      : 0.8;
    const performanceMultiplier = profile.farmer.performanceRatio || 1;
    return Math.round(baseYield * soilMultiplier * performanceMultiplier * 100) / 100;
  }

  // DEMO PLOT MANAGEMENT
  async addDemoPlot(demoPlot: DemoPlot): Promise<void> {
    const localDemos = readLocal<DemoPlot[]>(LS_KEYS.DEMO, []);
    localDemos.push(demoPlot);
    writeLocal(LS_KEYS.DEMO, localDemos);

    try {
      await supabase.from('demo_plots').insert({
        agro_ecological_zone: demoPlot.agroEcologicalZone,
        crop_type: demoPlot.cropType,
        variety: demoPlot.variety,
        season: demoPlot.season,
        year: demoPlot.year,
        soil_test_results: demoPlot.soilTestResults,
        fertilizer_used: demoPlot.fertilizerUsed,
        yield_achieved: demoPlot.yieldAchieved,
        weather_conditions: demoPlot.weatherConditions,
        production_cost: demoPlot.productionCost,
        market_price: demoPlot.marketPrice,
        profit: demoPlot.profit,
        extension_officer: demoPlot.extensionOfficer,
      });
    } catch (err) {
      console.warn('Supabase demo plot insert notice (persisted locally):', err);
    }
  }

  async getDemoPlots(): Promise<DemoPlot[]> {
    const localDemos = readLocal<DemoPlot[]>(LS_KEYS.DEMO, []);
    try {
      const { data, error } = await supabase
        .from('demo_plots')
        .select('*')
        .order('created_at', { ascending: true });
      if (!error && data && data.length > 0) {
        return (data as DemoRow[]).map(demoRowToType);
      }
    } catch {
      // use local fallback
    }
    return localDemos;
  }
}

// Singleton instance
export const centralIntelligence = new CentralIntelligenceService();
