// Central Intelligence Service - The Brain of AgroRisk Ghana
// Now backed by Supabase for persistent storage across reloads.
import { supabase } from '../lib/supabase';
import { riskAssessmentEngine, type RawFarmParameters } from './riskAssessmentEngine';
import type { Farmer, BankGradeRiskAssessment, FarmSenseSoilData, DemoPlot, ProductionPlan } from '../types';

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
  return {
    id: row.id,
    fullName: row.full_name,
    age: row.age,
    gender: row.gender as Farmer['gender'],
    education: row.education as Farmer['education'],
    farmingExperience: row.farming_experience,
    phone: row.phone,
    email: row.email ?? undefined,
    ghanaCardId: row.ghana_card_id,
    language: row.language as Farmer['language'],
    photoUrl: row.photo_url ?? undefined,
    farmPhotoUrl: row.farm_photo_url ?? undefined,
    farmSize: row.farm_size,
    irrigationAccess: row.irrigation_access,
    mechanisationAccess: row.mechanisation_access,
    location: row.location,
    extensionScore: row.extension_score,
    performanceRatio: row.performance_ratio,
    created_at: row.created_at,
    extendedData: row.extended_data ?? undefined,
  };
}

function farmerToRow(farmer: Farmer): Partial<FarmerRow> {
  return {
    id: farmer.id,
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
    extended_data: farmer.extendedData ?? null,
  };
}

function soilRowToType(row: SoilRow): FarmSenseSoilData {
  return {
    id: row.id,
    farmerId: row.farmer_id,
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
    score: row.score,
    riskLevel: row.risk_level as BankGradeRiskAssessment['riskLevel'],
    defaultProbability: row.default_probability,
    profitCapacity: row.profit_capacity,
    safeLoanAmount: row.safe_loan_amount,
    recommendedRepaymentPeriod: row.recommended_repayment_period,
    recommendations: row.recommendations,
    factors: row.factors,
    created_at: row.created_at,
  };
}

function bankRowToType(row: BankRow): BankIntelligenceRecord {
  return {
    farmerId: row.farmer_id,
    farmerName: row.farmer_name,
    location: row.location,
    farmSize: row.farm_size,
    cropType: row.crop_type,
    season: row.season,
    riskScore: row.risk_score,
    riskCategory: row.risk_category as BankIntelligenceRecord['riskCategory'],
    defaultProbability: row.default_probability,
    profitCapacity: row.profit_capacity,
    recommendedLoanAmount: row.recommended_loan_amount,
    repaymentPeriod: row.repayment_period,
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
    yieldAchieved: row.yield_achieved,
    weatherConditions: row.weather_conditions,
    productionCost: row.production_cost,
    marketPrice: row.market_price,
    profit: row.profit,
    extensionOfficer: row.extension_officer,
    created_at: row.created_at,
  };
}

// ── Service ──────────────────────────────────────────────────────────────────

class CentralIntelligenceService {

  // FARMER DATA MANAGEMENT
  async addFarmer(farmer: Farmer): Promise<void> {
    const row = farmerToRow(farmer);
    const { error } = await supabase
      .from('farmers')
      .upsert(row, { onConflict: 'id' });
    if (error) throw error;
  }

  async getFarmerProfile(farmerId: string): Promise<FarmerIntelligenceProfile | undefined> {
    const { data: farmerRow, error: farmerErr } = await supabase
      .from('farmers')
      .select('*')
      .eq('id', farmerId)
      .maybeSingle();
    if (farmerErr || !farmerRow) return undefined;

    const farmer = farmerRowToType(farmerRow as FarmerRow);

    // Fetch related data in parallel
    const [soilRes, riskRes] = await Promise.all([
      supabase.from('farmsense_soil_data').select('*').eq('farmer_id', farmerId).order('created_at', { ascending: false }).limit(1).maybeSingle(),
      supabase.from('risk_assessments').select('*').eq('farmer_id', farmerId).order('created_at', { ascending: false }).limit(1).maybeSingle(),
    ]);

    const soilData = soilRes.data ? soilRowToType(soilRes.data as SoilRow) : undefined;
    const riskAssessment = riskRes.data ? riskRowToType(riskRes.data as RiskRow) : undefined;

    return {
      farmer,
      farmSenseData: soilData,
      soilData,
      riskAssessment,
      productionHistory: [],
      financialHistory: {
        totalLoans: 0,
        repaidLoans: 0,
        defaultedLoans: 0,
        repaymentBehavior: 'good',
      },
      ndviHistory: [],
      weatherRisk: {
        droughtRisk: 'medium',
        floodRisk: 'medium',
        climateScore: 0.7,
      },
    };
  }

  async getAllFarmers(): Promise<FarmerIntelligenceProfile[]> {
    const { data: farmerRows, error } = await supabase
      .from('farmers')
      .select('*')
      .order('created_at', { ascending: true });
    if (error || !farmerRows) return [];

    const profiles: FarmerIntelligenceProfile[] = [];
    for (const row of farmerRows as FarmerRow[]) {
      const farmer = farmerRowToType(row);

      const [soilRes, riskRes] = await Promise.all([
        supabase.from('farmsense_soil_data').select('*').eq('farmer_id', farmer.id).order('created_at', { ascending: false }).limit(1).maybeSingle(),
        supabase.from('risk_assessments').select('*').eq('farmer_id', farmer.id).order('created_at', { ascending: false }).limit(1).maybeSingle(),
      ]);

      profiles.push({
        farmer,
        farmSenseData: soilRes.data ? soilRowToType(soilRes.data as SoilRow) : undefined,
        soilData: soilRes.data ? soilRowToType(soilRes.data as SoilRow) : undefined,
        riskAssessment: riskRes.data ? riskRowToType(riskRes.data as RiskRow) : undefined,
        productionHistory: [],
        financialHistory: {
          totalLoans: 0,
          repaidLoans: 0,
          defaultedLoans: 0,
          repaymentBehavior: 'good',
        },
        ndviHistory: [],
        weatherRisk: {
          droughtRisk: 'medium',
          floodRisk: 'medium',
          climateScore: 0.7,
        },
      });
    }
    return profiles;
  }

  async updateFarmerData(farmerId: string, updates: Partial<Farmer>): Promise<void> {
    const row = farmerToRow(updates as Farmer);
    const { error } = await supabase
      .from('farmers')
      .update(row)
      .eq('id', farmerId);
    if (error) throw error;
  }

  async addFarmSenseData(farmerId: string, soilData: FarmSenseSoilData): Promise<void> {
    const { error } = await supabase
      .from('farmsense_soil_data')
      .insert({
        farmer_id: farmerId,
        report_date: soilData.reportDate,
        report_type: soilData.reportType,
        report_url: soilData.reportUrl ?? null,
        soil_data: soilData.soilData,
        crop_suitability: soilData.cropSuitability,
        fertilizer_recommendation: soilData.fertilizerRecommendation,
      });
    if (error) throw error;
  }

  // RISK ASSESSMENT ENGINE
  async runRiskAssessment(farmerId: string): Promise<BankGradeRiskAssessment> {
    const profile = await this.getFarmerProfile(farmerId);
    if (!profile) {
      throw new Error(`Farmer not found: ${farmerId}`);
    }

    const riskParameters: RawFarmParameters = {
      farmerId: profile.farmer.id,
      experience: profile.farmer.farmingExperience,
      age: profile.farmer.age,
      vslaMembership: profile.farmer.extendedData?.socialFinancial.cooperativeMember || false,
      fboMembership: profile.farmer.extendedData?.socialFinancial.cooperativeMember ? 'active' : 'none',
      accessToInsurance: false,
      farmSize: profile.farmer.farmSize,
      cropType: 'Maize',
      tenureType: profile.farmer.extendedData?.landTenure || 'owner',
      mechanizationAccess: profile.farmer.mechanisationAccess,
      laborSource: 'family',
      gpsCoordinates: {
        latitude: profile.farmer.location.latitude,
        longitude: profile.farmer.location.longitude,
      },
      agroEcologicalZone: profile.farmer.location.agroEcologicalZone,
      rainfallPattern: 'bimodal',
      temperatureTrend: 'stable',
      soilType: profile.farmer.extendedData?.soilData.soilType || 'loamy',
      soilDepth: 'medium',
      ndviTrend: profile.farmer.extendedData?.vegetationHealth.ndviScore || 0.6,
      vhiDroughtStatus: 'normal',
      distanceToPavedRoad: 5,
      roadQuality: profile.farmer.extendedData?.infrastructure.roadAccess ? 'good' : 'poor',
      distanceToMarket: 10,
      storageType: profile.farmer.extendedData?.infrastructure.storageFacilities ? 'hermetic_pics' : 'none',
      inputSource: 'pfj_subsidy',
      fertilizerTimingReliability: profile.farmer.extendedData?.inputAccess.fertilizer || false,
      pestControlCapacity: 'medium',
    };

    const engineResult = riskAssessmentEngine.runRiskAssessment(riskParameters);

    const riskLevel: BankGradeRiskAssessment['riskLevel'] =
      engineResult.riskCategory === 'very_safe' || engineResult.riskCategory === 'low' ? 'Low' :
      engineResult.riskCategory === 'moderate' ? 'Medium' : 'High';

    const factors = {
      soilFertility: engineResult.baseScores.agronomicEnvironmental / 100,
      ndviHealth: engineResult.baseScores.realtimeSatellite / 100,
      climateRisk: engineResult.baseScores.agronomicEnvironmental / 100,
      pestHistory: 0.8,
      marketAccess: engineResult.baseScores.operationalInfrastructure / 100,
      infrastructure: engineResult.baseScores.operationalInfrastructure / 100,
      landTenure: 1.0,
      farmerPerformance: engineResult.baseScores.socioeconomicResilience / 100,
      demoPlotComparison: 0.8,
    };

    const assessment: BankGradeRiskAssessment = {
      score: engineResult.finalRiskScore,
      riskLevel,
      defaultProbability: this.calculateDefaultProbability(engineResult.finalRiskScore, factors),
      profitCapacity: engineResult.creditRecommendation.maxLoanAmount * 1.5,
      safeLoanAmount: engineResult.creditRecommendation.maxLoanAmount,
      recommendedRepaymentPeriod: engineResult.creditRecommendation.repaymentPeriod,
      recommendations: engineResult.recommendations,
      factors,
      created_at: new Date().toISOString(),
    };

    // Persist assessment
    const { error: riskErr } = await supabase
      .from('risk_assessments')
      .insert({
        farmer_id: farmerId,
        score: assessment.score,
        risk_level: assessment.riskLevel,
        default_probability: assessment.defaultProbability,
        profit_capacity: assessment.profitCapacity,
        safe_loan_amount: assessment.safeLoanAmount,
        recommended_repayment_period: assessment.recommendedRepaymentPeriod,
        recommendations: assessment.recommendations,
        factors: assessment.factors,
      });
    if (riskErr) throw riskErr;

    // Update bank intelligence
    await this.updateBankIntelligence(farmerId, assessment);

    return assessment;
  }

  // BANK INTELLIGENCE MANAGEMENT
  private async updateBankIntelligence(farmerId: string, assessment: BankGradeRiskAssessment): Promise<void> {
    const profile = await this.getFarmerProfile(farmerId);
    if (!profile) return;

    const bankRecord = {
      farmer_id: farmerId,
      farmer_name: profile.farmer.fullName,
      location: `${profile.farmer.location.region}, ${profile.farmer.location.district}`,
      farm_size: profile.farmer.farmSize,
      crop_type: 'Maize',
      season: 'Main 2024',
      risk_score: assessment.score,
      risk_category: assessment.riskLevel,
      default_probability: assessment.defaultProbability,
      profit_capacity: assessment.profitCapacity,
      recommended_loan_amount: assessment.safeLoanAmount,
      repayment_period: assessment.recommendedRepaymentPeriod,
      loan_status: assessment.riskLevel === 'Low' ? 'eligible' :
                   assessment.riskLevel === 'Medium' ? 'conditional' : 'not_eligible',
      last_assessment: new Date().toISOString(),
    };

    // Upsert by farmer_id — delete existing then insert
    await supabase.from('bank_intelligence').delete().eq('farmer_id', farmerId);
    const { error } = await supabase.from('bank_intelligence').insert(bankRecord);
    if (error) throw error;
  }

  async getBankIntelligence(): Promise<BankIntelligenceRecord[]> {
    const { data, error } = await supabase
      .from('bank_intelligence')
      .select('*')
      .order('last_assessment', { ascending: false });
    if (error || !data) return [];
    return (data as BankRow[]).map(bankRowToType);
  }

  async getBankFarmerProfile(farmerId: string): Promise<{
    intelligence: BankIntelligenceRecord;
    profile: FarmerIntelligenceProfile;
  } | undefined> {
    const [bankRes, profile] = await Promise.all([
      supabase.from('bank_intelligence').select('*').eq('farmer_id', farmerId).maybeSingle(),
      this.getFarmerProfile(farmerId),
    ]);

    if (bankRes.data && profile) {
      return {
        intelligence: bankRowToType(bankRes.data as BankRow),
        profile,
      };
    }
    return undefined;
  }

  // CREDIT REPORT GENERATION
  async generateCreditReport(farmerId: string): Promise<{
    farmer: Farmer;
    riskAssessment: BankGradeRiskAssessment;
    soilSummary: any;
    demoPlotComparison: any;
    yieldForecast: number;
    profitForecast: number;
    repaymentCapacity: number;
    generatedAt: string;
  }> {
    const profile = await this.getFarmerProfile(farmerId);
    if (!profile || !profile.riskAssessment) {
      throw new Error('Farmer profile or risk assessment not found');
    }

    return {
      farmer: profile.farmer,
      riskAssessment: profile.riskAssessment,
      soilSummary: profile.farmSenseData ? {
        pH: profile.farmSenseData.soilData.pH,
        fertility: profile.farmSenseData.soilData.soilFertilityScore,
        texture: profile.farmSenseData.soilData.soilTexture,
      } : profile.soilData ? {
        pH: profile.soilData.soilData.pH,
        fertility: profile.soilData.soilData.soilFertilityScore,
        texture: profile.soilData.soilData.soilTexture,
      } : null,
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
    const adjustments = (1 - factors.farmerPerformance) * 10;
    return Math.max(5, Math.min(95, baseRate + adjustments));
  }

  private calculateYieldForecast(profile: FarmerIntelligenceProfile): number {
    const baseYield = 3.5;
    const soilMultiplier = profile.soilData ?
      (profile.soilData.soilData.soilFertilityScore / 100) :
      profile.farmSenseData ?
        (profile.farmSenseData.soilData.soilFertilityScore / 100) : 0.8;
    const performanceMultiplier = profile.farmer.performanceRatio || 1;

    return Math.round(baseYield * soilMultiplier * performanceMultiplier * 100) / 100;
  }

  // DEMO PLOT MANAGEMENT
  async addDemoPlot(demoPlot: DemoPlot): Promise<void> {
    const { error } = await supabase
      .from('demo_plots')
      .insert({
        id: demoPlot.id,
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
    if (error) throw error;
  }

  async getDemoPlots(): Promise<DemoPlot[]> {
    const { data, error } = await supabase
      .from('demo_plots')
      .select('*')
      .order('created_at', { ascending: true });
    if (error || !data) return [];
    return (data as DemoRow[]).map(demoRowToType);
  }
}

// Singleton instance
export const centralIntelligence = new CentralIntelligenceService();
