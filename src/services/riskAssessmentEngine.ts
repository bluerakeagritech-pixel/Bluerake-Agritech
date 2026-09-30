// UPGRADED AGRICULTURAL RISK ASSESSMENT ENGINE
// 3-Layer Interaction System for Ghana's Agricultural Finance Sector

import type { Farmer, FarmSenseSoilData } from '../types';

// 🧠 LAYER 1 — RAW PARAMETER CAPTURE INTERFACES

export interface RawFarmParameters {
  // A. Farmer Profile
  farmerId: string;
  experience: number;
  age: number;
  vslaMembership: boolean;
  fboMembership: 'active' | 'inactive' | 'none';
  accessToInsurance: boolean;

  // B. Farm Structural Data
  farmSize: number;
  cropType: string;
  tenureType: 'owner' | 'lease' | 'abunu' | 'abusa';
  mechanizationAccess: boolean;
  laborSource: 'family' | 'hired' | 'scarce_galamsey';

  // C. Location & Environment
  gpsCoordinates: { latitude: number; longitude: number };
  agroEcologicalZone: string;
  rainfallPattern: 'unimodal' | 'bimodal' | 'irregular';
  temperatureTrend: 'stable' | 'warming' | 'cooling';
  soilType: 'clay' | 'sandy' | 'loamy' | 'silt' | 'peat';
  soilDepth: 'shallow' | 'medium' | 'deep';
  ndviTrend: number; // 0-1
  vhiDroughtStatus: 'normal' | 'mild' | 'moderate' | 'severe';

  // D. Infrastructure
  distanceToPavedRoad: number; // km
  roadQuality: 'good' | 'seasonal' | 'poor';
  distanceToMarket: number; // km
  storageType: 'none' | 'basic' | 'hermetic_pics';

  // E. Input System
  inputSource: 'pfj_subsidy' | 'cash_purchase' | 'aggregator_credit';
  fertilizerTimingReliability: boolean;
  pestControlCapacity: 'high' | 'medium' | 'low';
}

export interface RiskAssessmentResult {
  farmerId: string;
  finalRiskScore: number; // 0-100
  riskCategory: 'critical' | 'high' | 'moderate' | 'low' | 'very_safe';
  baseScores: {
    agronomicEnvironmental: number;
    socioeconomicResilience: number;
    operationalInfrastructure: number;
    realtimeSatellite: number;
  };
  interactionFlags: string[];
  killSwitchTriggered: boolean;
  killSwitchReason?: string;
  riskMultipliers: {
    factor: string;
    impact: number;
    reason: string;
  }[];
  recommendations: string[];
  creditRecommendation: {
    maxLoanAmount: number;
    repaymentPeriod: number;
    interestRateAdjustment: number;
  };
  generatedAt: string;
}

// District classifications for galamsey and disease hotspots
const GALAMSEY_HOTSPOTS = [
  'Obuasi', 'Tarkwa', 'Prestea', 'Konongo', 'Dunkwa', 'Bibiani'
];

const CSSV_HOTSPOTS = [
  'Suhum', 'Akim Oda', 'Kade', 'Nkawkaw', 'Begoro'
];

class UpgradedRiskAssessmentEngine {
  
  // ⚙️ LAYER 2 — BASE WEIGHTED SCORE CALCULATION
  private calculateBaseWeightedScore(params: RawFarmParameters): {
    agronomicEnvironmental: number;
    socioeconomicResilience: number;
    operationalInfrastructure: number;
    realtimeSatellite: number;
    totalScore: number;
  } {
    // Agronomic & Environmental (40% weight)
    const agronomicScore = this.calculateAgronomicScore(params);
    
    // Socio-economic Resilience (30% weight)
    const socioeconomicScore = this.calculateSocioeconomicScore(params);
    
    // Operational & Infrastructure (20% weight)
    const operationalScore = this.calculateOperationalScore(params);
    
    // Real-time Satellite Status (10% weight)
    const satelliteScore = this.calculateSatelliteScore(params);

    const totalScore = (
      agronomicScore * 0.4 +
      socioeconomicScore * 0.3 +
      operationalScore * 0.2 +
      satelliteScore * 0.1
    );

    return {
      agronomicEnvironmental: agronomicScore,
      socioeconomicResilience: socioeconomicScore,
      operationalInfrastructure: operationalScore,
      realtimeSatellite: satelliteScore,
      totalScore
    };
  }

  private calculateAgronomicScore(params: RawFarmParameters): number {
    let score = 50; // Base score

    // Soil suitability for crop
    score += this.getSoilCropSuitability(params.soilType, params.cropType);
    
    // Climate adaptation
    score += this.getClimateAdaptation(params.agroEcologicalZone, params.cropType);
    
    // Rainfall pattern match
    score += this.getRainfallPatternScore(params.rainfallPattern, params.cropType);
    
    // NDVI health
    score += (params.ndviTrend * 30); // 0-30 points
    
    // Drought resilience
    const droughtPenalty = {
      'normal': 0,
      'mild': -5,
      'moderate': -15,
      'severe': -30
    };
    score += droughtPenalty[params.vhiDroughtStatus];

    return Math.max(0, Math.min(100, score));
  }

  private calculateSocioeconomicScore(params: RawFarmParameters): number {
    let score = 40; // Base score

    // Experience bonus
    score += Math.min(params.experience * 2, 20); // Max 20 points
    
    // Age factor (peak productivity 30-50)
    if (params.age >= 30 && params.age <= 50) {
      score += 15;
    } else if (params.age > 50 && params.age <= 65) {
      score += 10;
    } else {
      score += 5;
    }

    // VSLA membership (financial resilience)
    if (params.vslaMembership) score += 15;
    
    // FBO membership
    if (params.fboMembership === 'active') score += 10;
    else if (params.fboMembership === 'inactive') score += 5;
    
    // Insurance access
    if (params.accessToInsurance) score += 10;

    return Math.max(0, Math.min(100, score));
  }

  private calculateOperationalScore(params: RawFarmParameters): number {
    let score = 50; // Base score

    // Farm size efficiency
    if (params.farmSize >= 1 && params.farmSize <= 5) {
      score += 15; // Optimal size
    } else if (params.farmSize > 5) {
      score += 5; // Large but manageable
    }

    // Mechanization access
    if (params.mechanizationAccess) score += 10;
    
    // Labor availability
    const laborScores = {
      'family': 15,
      'hired': 10,
      'scarce_galamsey': -10
    };
    score += laborScores[params.laborSource];

    // Input reliability
    const inputScores = {
      'cash_purchase': 15,
      'aggregator_credit': 10,
      'pfj_subsidy': 5
    };
    score += inputScores[params.inputSource];

    if (params.fertilizerTimingReliability) score += 10;

    // Pest control capacity
    const pestScores = {
      'high': 10,
      'medium': 5,
      'low': -5
    };
    score += pestScores[params.pestControlCapacity];

    return Math.max(0, Math.min(100, score));
  }

  private calculateSatelliteScore(params: RawFarmParameters): number {
    let score = 50; // Base score

    // NDVI trend analysis
    if (params.ndviTrend > 0.7) score += 30;
    else if (params.ndviTrend > 0.5) score += 15;
    else if (params.ndviTrend > 0.3) score += 5;
    else score -= 20;

    // VHI drought status
    const vhiScores = {
      'normal': 20,
      'mild': 10,
      'moderate': -10,
      'severe': -30
    };
    score += vhiScores[params.vhiDroughtStatus];

    return Math.max(0, Math.min(100, score));
  }

  // 🚨 LAYER 3 — INTERACTION ENGINE

  public runRiskAssessment(params: RawFarmParameters): RiskAssessmentResult {
    // Step 1: Calculate base scores
    const baseScores = this.calculateBaseWeightedScore(params);
    let finalScore = baseScores.totalScore;
    
    const interactionFlags: string[] = [];
    const riskMultipliers: { factor: string; impact: number; reason: string; }[] = [];
    let killSwitchTriggered = false;
    let killSwitchReason = '';

    // Step 2: Check Kill-Switch Conditions
    const killSwitchResult = this.checkKillSwitches(params);
    if (killSwitchResult.triggered) {
      killSwitchTriggered = true;
      killSwitchReason = killSwitchResult.reason;
      finalScore = killSwitchResult.forcedScore;
      interactionFlags.push(`KILL_SWITCH: ${killSwitchResult.reason}`);
    } else {
      // Step 3: Apply Interaction Multipliers
      const interactions = this.calculateInteractionEffects(params, baseScores);
      
      // Apply tenure × climate adaptation
      if (interactions.tenureClimateRisk > 0) {
        const reduction = baseScores.agronomicEnvironmental * (interactions.tenureClimateRisk / 100);
        finalScore -= reduction * 0.4; // 40% weight of agronomic score
        riskMultipliers.push({
          factor: 'Tenure × Climate Adaptation',
          impact: -interactions.tenureClimateRisk,
          reason: 'Cannot adapt to climate change due to tenure constraints'
        });
      }

      // Apply road access × crop perishability
      if (interactions.roadPerishabilityRisk > 0) {
        finalScore *= (1 - interactions.roadPerishabilityRisk / 100);
        riskMultipliers.push({
          factor: 'Road Access × Crop Perishability',
          impact: -interactions.roadPerishabilityRisk,
          reason: 'Poor road access increases post-harvest losses for perishable crops'
        });
      }

      // Apply input timing × crop sensitivity
      if (interactions.inputTimingRisk > 0) {
        finalScore *= (1 - interactions.inputTimingRisk / 100);
        riskMultipliers.push({
          factor: 'Input Timing × Crop Sensitivity',
          impact: -interactions.inputTimingRisk,
          reason: 'Delayed inputs severely impact sensitive crops'
        });
      }

      // Apply soil texture × crop physiology
      if (interactions.soilCropMismatch !== 0) {
        finalScore *= (1 + interactions.soilCropMismatch / 100);
        riskMultipliers.push({
          factor: 'Soil Texture × Crop Physiology',
          impact: interactions.soilCropMismatch,
          reason: interactions.soilCropMismatch > 0 ? 'Favorable soil-crop match' : 'Soil-crop mismatch increases risk'
        });
      }

      // Apply NDVI × disease zone risk
      if (interactions.ndviDiseaseRisk > 0) {
        finalScore *= (1 - interactions.ndviDiseaseRisk / 100);
        riskMultipliers.push({
          factor: 'NDVI × Disease Zone',
          impact: -interactions.ndviDiseaseRisk,
          reason: 'Low vegetation health in disease hotspot indicates biological collapse risk'
        });
      }

      // Apply VSLA membership boost
      if (interactions.vslaBoost > 0) {
        const boost = baseScores.socioeconomicResilience * (interactions.vslaBoost / 100);
        finalScore += boost * 0.3; // 30% weight of socioeconomic score
        riskMultipliers.push({
          factor: 'VSLA Membership × Shock Absorption',
          impact: interactions.vslaBoost,
          reason: 'VSLA membership provides financial resilience during shocks'
        });
      }

      // Apply farm size × labor constraint
      if (interactions.farmSizeLaborRisk > 0) {
        finalScore *= (1 - interactions.farmSizeLaborRisk / 100);
        riskMultipliers.push({
          factor: 'Farm Size × Labor Constraint',
          impact: -interactions.farmSizeLaborRisk,
          reason: 'Large farm becomes liability when labor is scarce'
        });
      }
    }

    // Ensure final score is within bounds
    finalScore = Math.max(0, Math.min(100, finalScore));

    // Step 4: Categorize risk
    const riskCategory = this.categorizeRisk(finalScore);

    // Step 5: Generate recommendations
    const recommendations = this.generateRecommendations(params, riskMultipliers, killSwitchTriggered);

    // Step 6: Calculate credit recommendation
    const creditRecommendation = this.calculateCreditRecommendation(finalScore, params);

    return {
      farmerId: params.farmerId,
      finalRiskScore: Math.round(finalScore),
      riskCategory,
      baseScores,
      interactionFlags,
      killSwitchTriggered,
      killSwitchReason,
      riskMultipliers,
      recommendations,
      creditRecommendation,
      generatedAt: new Date().toISOString()
    };
  }

  private checkKillSwitches(params: RawFarmParameters): {
    triggered: boolean;
    reason: string;
    forcedScore: number;
  } {
    // Extract district from GPS coordinates (simplified - in production would use proper geocoding)
    const district = this.getDistrictFromCoordinates(params.gpsCoordinates);

    // Kill Switch 1: Cocoa/Oil Palm in Galamsey hotspot
    if ((params.cropType === 'Cocoa' || params.cropType === 'Oil Palm') && 
        GALAMSEY_HOTSPOTS.includes(district)) {
      return {
        triggered: true,
        reason: 'Cocoa/Oil Palm in Galamsey hotspot - Environmental destruction risk',
        forcedScore: 15
      };
    }

    // Kill Switch 2: Abunu tenure + Transition zone + Cocoa
    if (params.tenureType === 'abunu' && 
        params.agroEcologicalZone === 'Transition Zone' && 
        params.cropType === 'Cocoa') {
      return {
        triggered: true,
        reason: 'Abunu tenure prevents climate adaptation for cocoa in transition zone',
        forcedScore: 35
      };
    }

    // Kill Switch 3: Sandy soil + Rainfed Rice
    if (params.soilType === 'sandy' && 
        params.cropType === 'Rice' && 
        !params.mechanizationAccess) { // Assuming no irrigation
      return {
        triggered: true,
        reason: 'Sandy soil unsuitable for rainfed rice production',
        forcedScore: 18
      };
    }

    // Kill Switch 4: Distance to road >20km + Perishable crops
    if (params.distanceToPavedRoad > 20 && 
        ['Yam', 'Cassava', 'Tomato'].includes(params.cropType)) {
      return {
        triggered: true,
        reason: 'Excessive distance to road makes perishable crop marketing impossible',
        forcedScore: 35
      };
    }

    return { triggered: false, reason: '', forcedScore: 0 };
  }

  private calculateInteractionEffects(params: RawFarmParameters, baseScores: any) {
    const effects = {
      tenureClimateRisk: 0,
      roadPerishabilityRisk: 0,
      inputTimingRisk: 0,
      soilCropMismatch: 0,
      ndviDiseaseRisk: 0,
      vslaBoost: 0,
      farmSizeLaborRisk: 0
    };

    // 1. Tenure × Climate Adaptation
    if ((params.tenureType === 'abunu' || params.tenureType === 'abusa') &&
        params.cropType === 'Cocoa' &&
        (params.agroEcologicalZone === 'Transition Zone' || params.temperatureTrend === 'warming')) {
      effects.tenureClimateRisk = 25; // 25% reduction in agronomic score
    }

    // 2. Road Access × Crop Perishability
    if (params.roadQuality === 'poor' || params.distanceToMarket > 15) {
      const perishabilityRisk = {
        'Cassava': 40,
        'Yam': 35,
        'Tomato': 45,
        'Maize': 10
      };
      effects.roadPerishabilityRisk = perishabilityRisk[params.cropType as keyof typeof perishabilityRisk] || 0;
    }

    // 3. Input Timing × Crop Sensitivity
    if (params.inputSource === 'pfj_subsidy' && !params.fertilizerTimingReliability) {
      const sensitivityRisk = {
        'Maize': 30,
        'Rice': 25,
        'Cocoa': 10
      };
      effects.inputTimingRisk = sensitivityRisk[params.cropType as keyof typeof sensitivityRisk] || 0;
    }

    // 4. Soil Texture × Crop Physiology
    const soilCropMatrix = {
      'clay': {
        'Groundnut': -30, // Bad match
        'Rice': 20, // Good match
        'Cocoa': 10
      },
      'sandy': {
        'Cocoa': -40, // Very bad for drought
        'Cassava': 15, // Good match
        'Groundnut': 10
      },
      'loamy': {
        'Maize': 15,
        'Cocoa': 10,
        'Rice': 10
      }
    };
    
    const soilEffects = soilCropMatrix[params.soilType as keyof typeof soilCropMatrix];
    if (soilEffects) {
      effects.soilCropMismatch = soilEffects[params.cropType as keyof typeof soilEffects] || 0;
    }

    // 5. NDVI × Disease Zone
    const district = this.getDistrictFromCoordinates(params.gpsCoordinates);
    if (params.ndviTrend < 0.5 && 
        params.cropType === 'Cocoa' && 
        CSSV_HOTSPOTS.includes(district)) {
      effects.ndviDiseaseRisk = 35; // Biological collapse flag
    }

    // 6. VSLA Membership × Shock Absorption
    if (params.vslaMembership) {
      effects.vslaBoost = 20; // 20% improvement in socioeconomic score
    }

    // 7. Farm Size × Labor Constraint
    if (params.farmSize > 5 && params.laborSource === 'scarce_galamsey') {
      effects.farmSizeLaborRisk = 25; // Large farm becomes liability
    }

    return effects;
  }

  private categorizeRisk(score: number): 'critical' | 'high' | 'moderate' | 'low' | 'very_safe' {
    if (score <= 30) return 'critical';
    if (score <= 50) return 'high';
    if (score <= 70) return 'moderate';
    if (score <= 85) return 'low';
    return 'very_safe';
  }

  private generateRecommendations(
    params: RawFarmParameters, 
    multipliers: any[], 
    killSwitch: boolean
  ): string[] {
    const recommendations: string[] = [];

    if (killSwitch) {
      recommendations.push('URGENT: Address critical risk factors before considering credit');
      return recommendations;
    }

    // Generate specific recommendations based on risk multipliers
    multipliers.forEach(multiplier => {
      switch (multiplier.factor) {
        case 'Tenure × Climate Adaptation':
          recommendations.push('Consider negotiating tree planting rights or switching to annual crops');
          break;
        case 'Road Access × Crop Perishability':
          recommendations.push('Invest in post-harvest processing or switch to less perishable crops');
          break;
        case 'Input Timing × Crop Sensitivity':
          recommendations.push('Secure alternative input sources or switch to less input-dependent crops');
          break;
        case 'Soil Texture × Crop Physiology':
          if (multiplier.impact < 0) {
            recommendations.push('Consider soil amendment or crop diversification to match soil type');
          }
          break;
        case 'NDVI × Disease Zone':
          recommendations.push('Implement intensive disease monitoring and resistant varieties');
          break;
        case 'Farm Size × Labor Constraint':
          recommendations.push('Consider mechanization or reducing farm size to manageable levels');
          break;
      }
    });

    // General recommendations based on parameters
    if (!params.vslaMembership) {
      recommendations.push('Join a Village Savings and Loan Association (VSLA) for financial resilience');
    }

    if (params.storageType === 'none') {
      recommendations.push('Invest in proper storage facilities to reduce post-harvest losses');
    }

    if (!params.accessToInsurance) {
      recommendations.push('Consider agricultural insurance to protect against weather risks');
    }

    return recommendations;
  }

  private calculateCreditRecommendation(score: number, params: RawFarmParameters) {
    const baseAmount = params.farmSize * 2000; // GH₵2000 per hectare base
    
    // Risk-adjusted loan amount
    const riskMultiplier = score / 100;
    const maxLoanAmount = Math.round(baseAmount * riskMultiplier);

    // Repayment period based on crop cycle and risk
    let repaymentPeriod = 12; // Default 12 months
    if (params.cropType === 'Cocoa' || params.cropType === 'Oil Palm') {
      repaymentPeriod = 24; // Tree crops need longer
    }
    if (score < 50) {
      repaymentPeriod = Math.min(repaymentPeriod, 6); // High risk = shorter period
    }

    // Interest rate adjustment
    let interestRateAdjustment = 0;
    if (score > 80) interestRateAdjustment = -2; // Premium rate reduction
    else if (score < 40) interestRateAdjustment = 5; // Risk premium

    return {
      maxLoanAmount,
      repaymentPeriod,
      interestRateAdjustment
    };
  }

  // Helper methods
  private getSoilCropSuitability(soilType: string, cropType: string): number {
    // Simplified soil-crop suitability matrix
    const suitabilityMatrix: { [key: string]: { [key: string]: number } } = {
      'clay': { 'Rice': 15, 'Cocoa': 10, 'Maize': 5, 'Groundnut': -10 },
      'sandy': { 'Cassava': 15, 'Groundnut': 10, 'Cocoa': -15, 'Rice': -10 },
      'loamy': { 'Maize': 15, 'Cocoa': 12, 'Rice': 10, 'Yam': 12 },
      'silt': { 'Rice': 12, 'Maize': 10, 'Cocoa': 8 },
      'peat': { 'Rice': 15, 'Cocoa': -5 }
    };

    return suitabilityMatrix[soilType]?.[cropType] || 0;
  }

  private getClimateAdaptation(zone: string, cropType: string): number {
    const adaptationMatrix: { [key: string]: { [key: string]: number } } = {
      'Forest Zone': { 'Cocoa': 15, 'Oil Palm': 12, 'Plantain': 10 },
      'Transition Zone': { 'Maize': 12, 'Yam': 10, 'Cocoa': 5 },
      'Guinea Savanna': { 'Maize': 15, 'Sorghum': 12, 'Millet': 12 },
      'Sudan Savanna': { 'Millet': 15, 'Sorghum': 15, 'Cowpea': 10 }
    };

    return adaptationMatrix[zone]?.[cropType] || 0;
  }

  private getRainfallPatternScore(pattern: string, cropType: string): number {
    const patternMatrix: { [key: string]: { [key: string]: number } } = {
      'bimodal': { 'Maize': 10, 'Cocoa': 15, 'Rice': 8 },
      'unimodal': { 'Millet': 15, 'Sorghum': 15, 'Cowpea': 12 },
      'irregular': { 'Cassava': 10, 'Yam': 8 }
    };

    return patternMatrix[pattern]?.[cropType] || 0;
  }

  private getDistrictFromCoordinates(coords: { latitude: number; longitude: number }): string {
    // Simplified district mapping - in production would use proper geocoding service
    // This is a mock implementation
    if (coords.latitude > 6.5) return 'Kumasi';
    if (coords.latitude > 5.5) return 'Obuasi';
    return 'Takoradi';
  }
}

// Export singleton instance
export const riskAssessmentEngine = new UpgradedRiskAssessmentEngine();