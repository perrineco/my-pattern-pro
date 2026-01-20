export type Category = 'women' | 'men' | 'kids';
export type PatternType = 'skirt' | 'bodice' | 'dress' | 'pants' | 'sleeve';

export interface SkirtMeasurements {
  waist: number;
  hip: number;
  waistToHip: number;
  skirtLength: number;
}

export interface PatternDimensions {
  width: number;
  height: number;
  scale: number;
}
