/**
 * Difficulty level configuration
 * Per spec Section 4.3.6: Difficulty Level Configuration
 */

import type { DifficultyLevel } from './AppState';

/**
 * Difficulty configuration interface
 * Per spec Section 4.3.6
 */
export interface DifficultyConfig {
  level: DifficultyLevel;
  enabledFormulas: string[];
  enabledViews: string[];
  enabledConcepts: string[];
}

/**
 * Default difficulty configurations
 * Per spec Section 9: Advanced Trigonometry Concepts by Difficulty Level
 */
export const DIFFICULTY_CONFIGS: Record<DifficultyLevel, DifficultyConfig> = {
  highSchool: {
    level: 'highSchool',
    enabledFormulas: [
      'pythagorean-identity',
      'sumDifference',
      'doubleAngle',
      'halfAngle',
      'cofunction',
      'reciprocal',
      'quotient',
    ],
    enabledViews: ['unitCircle', 'graphs', 'table', 'formulas'],
    enabledConcepts: [
      'basicIdentities',
      'sumDifferenceFormulas',
      'doubleHalfAngle',
      'cofunctionIdentities',
      'basicGraphs',
      'commonAngles',
    ],
  },
  college: {
    level: 'college',
    enabledFormulas: [
      'pythagorean-identity',
      'sumDifference',
      'doubleAngle',
      'halfAngle',
      'cofunction',
      'reciprocal',
      'quotient',
      'inverseFunctions',
      'polarCoordinates',
      'complexNumbers',
      'hyperbolicFunctions',
      'graphTransformations',
    ],
    enabledViews: ['unitCircle', 'graphs', 'table', 'formulas'],
    enabledConcepts: [
      'basicIdentities',
      'sumDifferenceFormulas',
      'doubleHalfAngle',
      'cofunctionIdentities',
      'basicGraphs',
      'commonAngles',
      'inverseFunctions',
      'polarCoordinates',
      'complexNumbers',
      'hyperbolicFunctions',
      'graphTransformations',
    ],
  },
  graduate: {
    level: 'graduate',
    enabledFormulas: [
      'pythagorean-identity',
      'sumDifference',
      'doubleAngle',
      'halfAngle',
      'cofunction',
      'reciprocal',
      'quotient',
      'inverseFunctions',
      'polarCoordinates',
      'complexNumbers',
      'hyperbolicFunctions',
      'graphTransformations',
      'fourierSeries',
      'sphericalTrig',
      'seriesExpansions',
      'complexPlane',
    ],
    enabledViews: ['unitCircle', 'graphs', 'table', 'formulas'],
    enabledConcepts: [
      'basicIdentities',
      'sumDifferenceFormulas',
      'doubleHalfAngle',
      'cofunctionIdentities',
      'basicGraphs',
      'commonAngles',
      'inverseFunctions',
      'polarCoordinates',
      'complexNumbers',
      'hyperbolicFunctions',
      'graphTransformations',
      'fourierSeries',
      'sphericalTrig',
      'seriesExpansions',
      'complexPlane',
    ],
  },
};

/**
 * Get difficulty configuration for a given level
 */
export function getDifficultyConfig(level: DifficultyLevel): DifficultyConfig {
  return DIFFICULTY_CONFIGS[level];
}

/**
 * Check if a formula is enabled for a given difficulty level
 */
export function isFormulaEnabled(
  formulaId: string,
  level: DifficultyLevel
): boolean {
  const config = getDifficultyConfig(level);
  return config.enabledFormulas.includes(formulaId);
}

/**
 * Check if a view is enabled for a given difficulty level
 */
export function isViewEnabled(viewId: string, level: DifficultyLevel): boolean {
  const config = getDifficultyConfig(level);
  return config.enabledViews.includes(viewId);
}

/**
 * Check if a concept is enabled for a given difficulty level
 */
export function isConceptEnabled(
  conceptId: string,
  level: DifficultyLevel
): boolean {
  const config = getDifficultyConfig(level);
  return config.enabledConcepts.includes(conceptId);
}
