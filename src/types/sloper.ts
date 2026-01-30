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
  crotchDepth: number;       // Hauteur d'entrejambe (rise)
  outseamLength: number;     // Longueur extérieure
  inseamLength: number;      // Longueur intérieure
}

// Unified profile measurements (all measurements in one)
export interface UnifiedMeasurements {
  // Skirt measurements
  waist: number;
  hip: number;
  waistToHip: number;
  skirtLength: number;
  // Bodice measurements
  bust: number;              // Tour de poitrine
  neckCircumference: number; // Tour de cou
  shoulderLength: number;    // Longueur d'épaule
  backWidth: number;         // Carrure dos
  backLength: number;        // Longueur taille-dos
}

export interface PatternDimensions {
  width: number;
  height: number;
  scale: number;
}

// Union type for all measurement types
export type Measurements = SkirtMeasurements | BodiceMeasurements | PantsMeasurements;

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
