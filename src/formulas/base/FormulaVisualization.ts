/**
 * Base class for formula visualizations
 * Per milestone 11: Formula registry base class
 * Per spec Section 4.2.1: Module Structure
 */

import type { ReactElement } from 'react';
import type { DifficultyLevel } from '../../state/AppState';
import type { Angle } from '../../core/Angle';

/**
 * Formula visualization interface
 * Per milestone 11: id, name, difficulty, KaTeX string, renderer hook/component
 */
export interface FormulaVisualization {
  /**
   * Unique identifier for the formula
   */
  id: string;

  /**
   * Human-readable name
   */
  name: string;

  /**
   * Difficulty level required to view this formula
   */
  difficulty: DifficultyLevel;

  /**
   * KaTeX LaTeX string for the formula
   */
  katexFormula: string;

  /**
   * Optional description/explanation
   */
  description?: string;

  /**
   * Render function that returns JSX
   * @param angle Current angle from store
   */
  render: (angle: Angle) => ReactElement | null;
}

/**
 * Base class for formula visualizations
 * Provides common functionality and structure
 */
export abstract class BaseFormulaVisualization implements FormulaVisualization {
  abstract readonly id: string;
  abstract readonly name: string;
  abstract readonly difficulty: DifficultyLevel;
  abstract readonly katexFormula: string;
  abstract readonly description?: string;

  /**
   * Render the formula visualization
   * Must be implemented by subclasses
   */
  abstract render(angle: Angle): ReactElement | null;
}
