export interface AdminAugmentationData {
  earthObservation: {
    ndviScore: number;
    vegetationStatus: 'excellent' | 'good' | 'moderate' | 'poor';
    vhiDroughtStatus: 'normal' | 'mild' | 'moderate' | 'severe';
    soilMoistureIndex: number;
    rainfallPattern: 'bimodal' | 'unimodal' | 'irregular';
    annualRainfallMm: number;
    droughtRisk: 'low' | 'medium' | 'high';
    floodRisk: 'low' | 'medium' | 'high';
    imagerySource: string;
    observationDate: string;
  };
  soilScience: {
    pH: number;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    organicMatter: number;
    moisture: number;
    soilTexture: 'clay' | 'sandy' | 'loamy' | 'silt' | 'peat';
    soilDepth: 'shallow' | 'medium' | 'deep';
    soilFertilityScore: number;
    fertilizerRecommendation: string;
    labReportDate: string;
  };
  demoPlotData: {
    farmerExpectedYield: number;
    benchmarkYield: number;
    performanceRatio: number;
    extensionComplianceScore: number;
    pestControlCapacity: 'high' | 'medium' | 'low';
    extensionOfficer: string;
    fieldNotes: string;
  };
  augmentedBy: string;
  augmentedAt: string;
}

export interface Farmer {
  id: string;
  fullName: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  education: 'none' | 'primary' | 'secondary' | 'tertiary';
  farmingExperience: number;
  phone: string;
  email?: string;
  ghanaCardId: string;
  language: 'en' | 'tw' | 'ee' | 'ha' | 'da';
  photoUrl?: string;
  farmPhotoUrl?: string;
  farmSize: number;
  irrigationAccess: boolean;
  mechanisationAccess: boolean;
  location: {
    latitude: number;
    longitude: number;
    region: string;
    district: string;
    community?: string;
    agroEcologicalZone: string;
  };
  extensionScore: number;
  performanceRatio: number;
  created_at: string;
  extendedData?: {
    ghfaId?: string;
    primaryCrop?: string;
    season?: string;
    registrationStatus?: 'pending_augmentation' | 'augmented_bank_ready';
    landTenure: 'owned' | 'lease' | 'sharecrop';
    soilData: {
      soilType: 'clay' | 'sandy' | 'loamy' | 'silt' | 'peat';
      soilFertility: 'low' | 'medium' | 'high';
      organicMatter: number;
      moisture: number;
      pH: number;
      lastUpdated: string;
    };
    cropManagement: {
      practicesCropRotation: boolean;
      previousCrops: {
        cocoa: boolean;
        maize: boolean;
        rice: boolean;
        cassava: boolean;
        yam: boolean;
        plantain: boolean;
        groundnuts: boolean;
        oilPalm: boolean;
      };
    };
    inputAccess: {
      qualitySeeds: boolean;
      fertilizer: boolean;
      tools: boolean;
      subsidies: boolean;
    };
    infrastructure: {
      roadAccess: boolean;
      irrigationSystem: boolean;
      storageFacilities: boolean;
    };
    socialFinancial: {
      cooperativeMember: boolean;
      cooperativeName: string;
      vslaMember?: boolean;
      offFarmIncome: boolean;
      hasSavings: boolean;
      familySupport: boolean;
    };
    vegetationHealth: {
      ndviScore: number;
      lastUpdated: string;
    };
    adminAugmentation?: AdminAugmentationData;
  };
}

export interface FarmSenseSoilData {
  id: string;
  farmerId: string;
  reportDate: string;
  reportType: 'pdf' | 'csv' | 'photo' | 'manual';
  reportUrl?: string;
  soilData: {
    pH: number;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    soilFertilityScore: number;
    soilTexture: 'clay' | 'sandy' | 'loamy' | 'silt' | 'peat';
    moisture: number;
    organicMatter: number;
  };
  cropSuitability: {
    crop: string;
    suitabilityScore: number;
  }[];
  fertilizerRecommendation: {
    type: string;
    quantity: number;
    applicationTiming: string;
    cost: number;
  }[];
  created_at: string;
}

export interface DemoPlot {
  id: string;
  agroEcologicalZone: string;
  cropType: string;
  variety: string;
  season: string;
  year: number;
  soilTestResults: {
    pH: number;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    soilFertilityScore: number;
  };
  fertilizerUsed: {
    type: string;
    quantity: number;
    cost: number;
  }[];
  yieldAchieved: number;
  weatherConditions: {
    rainfall: number;
    temperature: number;
    humidity: number;
  };
  productionCost: number;
  marketPrice: number;
  profit: number;
  extensionOfficer: string;
  created_at: string;
}

export interface ProductionPlan {
  id: string;
  farmerId: string;
  season: string;
  year: number;
  prePlanting: {
    cropSelected: string;
    variety: string;
    seedSource: string;
    fertilizerPlan: {
      type: string;
      quantity: number;
      timing: string;
      cost: number;
    }[];
    budget: number;
    expectedYield: number;
    marketTarget: string;
  };
  duringGrowth: {
    plantingDate: string;
    weatherEvents: {
      date: string;
      type: 'rain' | 'drought' | 'flood' | 'storm';
      severity: 'low' | 'medium' | 'high';
    }[];
    ndviReadings: {
      date: string;
      value: number;
    }[];
    fertilizerApplications: {
      date: string;
      type: string;
      quantity: number;
    }[];
    pesticideUse: {
      date: string;
      type: string;
      reason: string;
    }[];
    irrigationEvents: {
      date: string;
      duration: number;
    }[];
    fieldPhotos: {
      date: string;
      url: string;
      notes: string;
    }[];
    extensionVisits: {
      date: string;
      officer: string;
      recommendations: string;
    }[];
  };
  postHarvest: {
    harvestDate: string;
    yieldHarvested: number;
    storageMethod: string;
    salesPrice: number;
    buyer: string;
    profit: number;
    loanRepaymentStatus: 'pending' | 'partial' | 'complete' | 'defaulted';
  };
  created_at: string;
}

export interface LandHistory {
  id: string;
  farmerId: string;
  seasons: {
    season: string;
    year: number;
    cropsGrown: string[];
    yields: {
      crop: string;
      yield: number;
    }[];
    fertilizerHistory: {
      type: string;
      quantity: number;
    }[];
    pestDiseaseOutbreaks: {
      type: string;
      severity: 'low' | 'medium' | 'high';
      treatment: string;
    }[];
    soilImprovementEfforts: string[];
    croppingPattern: 'fallow' | 'continuous';
  }[];
  created_at: string;
}

export interface ExtensionGuidance {
  id: string;
  farmerId: string;
  season: string;
  year: number;
  recommendations: {
    plantingDate: string;
    fertilizerTiming: {
      date: string;
      type: string;
      quantity: number;
    }[];
    pestDiseaseAlerts: {
      date: string;
      risk: string;
      prevention: string;
    }[];
    irrigationAlerts: {
      date: string;
      recommendation: string;
    }[];
    harvestTiming: string;
    marketPriceAlerts: {
      date: string;
      crop: string;
      price: number;
      trend: 'rising' | 'falling' | 'stable';
    }[];
  };
  complianceScore: number;
  created_at: string;
}

export interface FarmData {
  farmerName: string;
  farmSize: number;
  cropType: string;
  farmingExperience: number;
  previousLoans: number;
  hasIrrigation: boolean;
  location: string;
  // New fields
  soilType: 'clay' | 'sandy' | 'loamy' | 'silt' | 'peat';
  soilFertility: 'low' | 'medium' | 'high';
  landTenure: 'owned' | 'leased' | 'sharecropped';
  cropRotation: boolean;
  previousCrops: string[];
  inputAccess: {
    seeds: boolean;
    fertilizer: boolean;
    tools: boolean;
    subsidyAccess: boolean;
  };
  infrastructure: {
    roadAccess: boolean;
    irrigation: boolean;
    storage: boolean;
  };
  cooperativeMembership: {
    isMember: boolean;
    organizationName?: string;
  };
  backupResources: {
    hasOffFarmIncome: boolean;
    hasSavings: boolean;
    familySupport: boolean;
  };
  satelliteData: {
    ndviScore: number;
    lastUpdated: string;
  };
  farmSenseData?: FarmSenseSoilData;
  demoPlotBenchmark?: DemoPlot;
}

export interface BankGradeRiskAssessment {
  score: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  defaultProbability: number;
  profitCapacity: number;
  safeLoanAmount: number;
  recommendedRepaymentPeriod: number;
  recommendations: string[];
  factors: {
    soilFertility: number;
    ndviHealth: number;
    climateRisk: number;
    pestHistory: number;
    marketAccess: number;
    infrastructure: number;
    landTenure: number;
    farmerPerformance: number;
    demoPlotComparison: number;
  };
  created_at: string;
}

export interface SmartLoanRecommendation {
  farmerId: string;
  cropType: string;
  season: string;
  year: number;
  farmSenseFertilizerPlan: {
    type: string;
    quantity: number;
    cost: number;
  }[];
  demoPlotYield: number;
  soilQualityScore: number;
  marketPrice: number;
  calculations: {
    recommendedLoanAmount: number;
    expectedProfit: number;
    safeRepaymentSchedule: {
      installments: number;
      amount: number;
      frequency: 'monthly' | 'quarterly' | 'seasonal';
    };
    riskAdjustedInterestRate: number;
  };
  created_at: string;
}

export interface FinancialData {
  id: string;
  farmerId: string;
  monthlyIncome: number;
  monthlyExpenses: number;
  previousLoans: {
    amount: number;
    status: 'repaid' | 'ongoing' | 'defaulted';
    lender: string;
  }[];
  hasInsurance: boolean;
  insuranceProvider?: string;
  marketAccess: {
    distanceToMarket: number;
    cooperativeMember: boolean;
    cooperativeName?: string;
  };
  created_at: string;
}

export interface RiskAssessment {
  id: string;
  farmerId: string;
  farmDataId: string;
  financialDataId: string;
  overallScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  categoryScores: {
    farmManagement: number;
    financialHealth: number;
    weatherRisk: number;
    marketRisk: number;
    landTenure: number;
    cropDiversification: number;
    inputAccess: number;
    infrastructure: number;
    cooperative: number;
    backupResources: number;
    satelliteHealth: number;
  };
  recommendations: string[];
  created_at: string;
}

export interface LoanApplication {
  id: string;
  farmerId: string;
  riskAssessmentId: string;
  lender: string;
  amount: number;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected' | 'disbursed';
  smartRecommendation?: SmartLoanRecommendation;
  bankGradeAssessment?: BankGradeRiskAssessment;
  created_at: string;
}

export type Language = 'en' | 'tw' | 'ee' | 'ha' | 'da';

export interface Translations {
  [key: string]: {
    [key in Language]: string;
  };
}