export type Category = 'women' | 'men' | 'kids';
export type PatternType = 'skirt' | 'bodice' | 'bodice-dartless' | 'bodice-with-darts' | 'bodice-knit' | 'dress' | 'pants' | 'sleeve';
export type BodiceVariant = 'dartless' | 'with-darts' | 'knit';

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

// Unified profile measurements (all measurements in one)
export interface UnifiedMeasurements {
  // Body measurements
  bust: number;
  waist: number;
  hip: number;
  // Vertical measurements
  shoulderToWaist: number;
  bustHeight: number;
  waistToHip: number;
  skirtLength: number;
  // Width measurements
  shoulderWidth: number;
  backWidth: number;
  chestWidth: number;
  // Armhole & Neck
  armholeDepth: number;
  neckWidth: number;
  neckDepthFront: number;
  neckDepthBack: number;
  // Other
  shoulderSlope: number;
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

// Convert unified measurements to specific pattern measurements
export function toSkirtMeasurements(u: UnifiedMeasurements): SkirtMeasurements {
  return {
    waist: u.waist,
    hip: u.hip,
    waistToHip: u.waistToHip,
    skirtLength: u.skirtLength,
  };
}

export function toBodiceMeasurements(u: UnifiedMeasurements): BodiceMeasurements {
  return {
    bust: u.bust,
    waist: u.waist,
    shoulderToWaist: u.shoulderToWaist,
    bustHeight: u.bustHeight,
    shoulderWidth: u.shoulderWidth,
    backWidth: u.backWidth,
    chestWidth: u.chestWidth,
    armholeDepth: u.armholeDepth,
    neckWidth: u.neckWidth,
    shoulderSlope: u.shoulderSlope,
  };
}
