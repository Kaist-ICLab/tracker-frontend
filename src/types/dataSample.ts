export interface DataSample {
  id: string;
  timestamp: Date;
  // Vital Signs
  heartRate?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  bodyTemperature?: number;
  oxygenSaturation?: number;
  respiratoryRate?: number;
  
  // Physical Activity
  steps?: number;
  distance?: number;
  calories?: number;
  activeMinutes?: number;
  
  // Sleep Metrics
  sleepDuration?: number;
  deepSleepDuration?: number;
  remSleepDuration?: number;
  lightSleepDuration?: number;
  
  // Body Composition
  weight?: number;
  bodyFatPercentage?: number;
  muscleMass?: number;
  bmi?: number;
  
  // Blood Sugar
  bloodGlucose?: number;
  
  // Stress & Recovery
  stressLevel?: number;
  hrvScore?: number;
  recoveryScore?: number;
  
  // Environmental
  ambientTemperature?: number;
  humidity?: number;
  airQualityIndex?: number;
  
  notes?: string;
}

export interface DataSampleResponse {
  samples: DataSample[];
  hasNextPage: boolean;
  isLoading: boolean;
  error?: string;
}

export interface MetricInfo {
  key: keyof DataSample;
  label: string;
  unit?: string;
  formatter?: (value: any) => string;
  category: 'vital' | 'activity' | 'sleep' | 'body' | 'blood' | 'stress' | 'environment';
} 