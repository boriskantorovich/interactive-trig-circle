/**
 * Application state types
 * Per spec Section 4.2.2: State Management
 */

import { Angle } from '../core/Angle';

/**
 * Angle unit type
 */
export type AngleUnit = 'radians' | 'degrees';

/**
 * Active view type
 */
export type ActiveView = 'unitCircle' | 'graphs' | 'table' | 'formulas';

/**
 * Difficulty level type
 */
export type DifficultyLevel = 'highSchool' | 'college' | 'graduate';

/**
 * Formula view mode type
 */
export type FormulaViewMode = 'single' | 'multiple' | 'hybrid';

/**
 * Application state interface
 * Per spec Section 4.2.2: AppStore interface
 */
export interface AppState {
  // State
  currentAngle: Angle;
  angleUnit: AngleUnit;
  activeView: ActiveView;
  selectedFormula: string | null;
  difficultyLevel: DifficultyLevel;
  formulaViewMode: FormulaViewMode;
}
