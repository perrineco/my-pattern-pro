export type Category = 'women' | 'men' | 'kids';
export type PatternType = 'skirt' | 'bodice' | 'dress' | 'pants' | 'sleeve';

export interface SkirtMeasurements {
  waist: number;
  hip: number;
  waistToHip: number;
  skirtLength: number;
}

export interface BodiceMeasurements {
  // Core measurements
  bust: number;
  waist: number;
  // Vertical measurements
  shoulderToWaist: number;
  bustHeight: number; // From shoulder to bust point
  // Width measurements
  shoulderWidth: number;
  backWidth: number;
  chestWidth: number;
  // Armhole
  armholeDepth: number;
  // Additional
  neckWidth: number;
  shoulderSlope: number; // in degrees or cm drop
}

export interface PatternDimensions {
  width: number;
  height: number;
  scale: number;
}

// Union type for all measurement types
export type Measurements = SkirtMeasurements | BodiceMeasurements;

// Type guards
export function isSkirtMeasurements(m: Measurements): m is SkirtMeasurements {
  return 'skirtLength' in m && 'hip' in m;
}

export function isBodiceMeasurements(m: Measurements): m is BodiceMeasurements {
  return 'bust' in m && 'shoulderToWaist' in m;
}
