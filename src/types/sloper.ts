export type Category = 'women' | 'men' | 'kids';
export type PatternType = 'skirt' | 'bodice' | 'bodice-dartless' | 'bodice-with-darts' | 'bodice-knit' | 'dress' | 'pants' | 'sleeve';
export type BodiceVariant = 'dartless' | 'with-darts' | 'knit';

export interface SkirtMeasurements {
  waist: number;
  hip: number;
  waistToHip: number;
  skirtLength: number;
  ease?: number; // Custom ease (optional, defaults to category-specific)
}

export interface BodiceMeasurements {
  // Essential bodice measurements
  bust: number;              // Tour de poitrine
  neckCircumference: number; // Tour de cou
  shoulderLength: number;    // Longueur d'épaule
  backWidth: number;         // Carrure dos
  backLength: number;        // Longueur taille-dos
  ease?: number;             // Custom ease (optional, defaults to category-specific)
}

export interface PantsMeasurements {
  waist: number;             // Tour de taille
  hip: number;               // Tour de hanches
  thigh: number;             // Tour de cuisse
  knee: number;              // Tour de genou
  ankle: number;             // Tour de cheville
  hipHeight: number;         // Distance taille bassin (Altezza Fianco)
  crotchDepth: number;       // Hauteur d'entrejambe (rise)
  outseamLength: number;     // Longueur extérieure
  inseamLength: number;      // Longueur intérieure
  ease?: number;             // Custom ease (optional)
}

export interface SleeveMeasurements {
  upperArm: number;          // Tour de bras (bicep circumference)
  wrist: number;             // Tour de poignet
  sleeveLength: number;      // Longueur de manche (shoulder to wrist)
  elbowLength: number;       // Longueur coude (shoulder to elbow)
  armholeDepth: number;      // Profondeur d'emmanchure (sleeve cap height)
  ease?: number;             // Custom ease (optional)
}

// Unified profile measurements (all measurements in one)
export interface UnifiedMeasurements {
  // Skirt measurements
  waist: number;
  hip: number;
  waistToHip: number;
  skirtLength: number;
  // Bodice measurements
  bust: number;
  neckCircumference: number;
  shoulderLength: number;
  backWidth: number;
  backLength: number;
  // Pants measurements
  thigh: number;
  knee: number;
  ankle: number;
  hipHeight: number;
  crotchDepth: number;
  outseamLength: number;
  inseamLength: number;
  // Sleeve measurements
  upperArm: number;
  wrist: number;
  sleeveLength: number;
  elbowLength: number;
  armholeDepth: number;
}

export interface PatternDimensions {
  width: number;
  height: number;
  scale: number;
}

// Union type for all measurement types
// Union type for all measurement types
export type Measurements = SkirtMeasurements | BodiceMeasurements | PantsMeasurements | SleeveMeasurements;

// Type guards
export function isSkirtMeasurements(m: Measurements): m is SkirtMeasurements {
  return 'skirtLength' in m && 'hip' in m;
}

export function isBodiceMeasurements(m: Measurements): m is BodiceMeasurements {
  return 'bust' in m && 'backLength' in m;
}

export function isPantsMeasurements(m: Measurements): m is PantsMeasurements {
  return 'crotchDepth' in m && 'inseamLength' in m;
}

export function isSleeveMeasurements(m: Measurements): m is SleeveMeasurements {
  return 'upperArm' in m && 'sleeveLength' in m && 'armholeDepth' in m;
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
    neckCircumference: u.neckCircumference,
    shoulderLength: u.shoulderLength,
    backWidth: u.backWidth,
    backLength: u.backLength,
  };
}

export function toPantsMeasurements(u: UnifiedMeasurements): PantsMeasurements {
  return {
    waist: u.waist,
    hip: u.hip,
    thigh: u.thigh,
    knee: u.knee,
    ankle: u.ankle,
    hipHeight: u.hipHeight,
    crotchDepth: u.crotchDepth,
    outseamLength: u.outseamLength,
    inseamLength: u.inseamLength,
  };
}

export function toSleeveMeasurements(u: UnifiedMeasurements): SleeveMeasurements {
  return {
    upperArm: u.upperArm,
    wrist: u.wrist,
    sleeveLength: u.sleeveLength,
    elbowLength: u.elbowLength,
    armholeDepth: u.armholeDepth,
  };
}
