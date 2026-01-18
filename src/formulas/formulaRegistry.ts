/**
 * Formula registry system
 * Per milestone 11: Formula registry
 * Per spec Section 4.2.1: Module Structure
 */

import type { FormulaVisualization } from './base/FormulaVisualization';
import type { DifficultyLevel } from '../state/AppState';
import { isFormulaEnabled } from '../state/DifficultyLevel';

/**
 * Formula registry - stores all registered formulas
 */
class FormulaRegistry {
  private formulas: Map<string, FormulaVisualization> = new Map();

  /**
   * Register a formula
   */
  register(formula: FormulaVisualization): void {
    if (this.formulas.has(formula.id)) {
      console.warn(`Formula with id "${formula.id}" is already registered. Overwriting.`);
    }
    this.formulas.set(formula.id, formula);
  }

  /**
   * Register multiple formulas
   */
  registerAll(formulas: FormulaVisualization[]): void {
    formulas.forEach((formula) => this.register(formula));
  }

  /**
   * Get a formula by ID
   */
  get(id: string): FormulaVisualization | undefined {
    return this.formulas.get(id);
  }

  /**
   * Get all formulas
   */
  getAll(): FormulaVisualization[] {
    return Array.from(this.formulas.values());
  }

  /**
   * Get formulas filtered by difficulty level
   * Per milestone 11: enable/disable formulas per config
   */
  getByDifficulty(level: DifficultyLevel): FormulaVisualization[] {
    return this.getAll().filter((formula) => {
      // Check if formula is enabled for this difficulty level
      return isFormulaEnabled(formula.id, level);
    });
  }

  /**
   * Get formulas by difficulty requirement
   * Returns formulas that are available at or below the given level
   */
  getByDifficultyLevel(level: DifficultyLevel): FormulaVisualization[] {
    const levelOrder: DifficultyLevel[] = ['highSchool', 'college', 'graduate'];
    const currentLevelIndex = levelOrder.indexOf(level);

    return this.getAll().filter((formula) => {
      const formulaLevelIndex = levelOrder.indexOf(formula.difficulty);
      // Include formulas at or below current level
      return formulaLevelIndex <= currentLevelIndex && isFormulaEnabled(formula.id, level);
    });
  }

  /**
   * Check if a formula exists
   */
  has(id: string): boolean {
    return this.formulas.has(id);
  }

  /**
   * Clear all formulas (useful for testing)
   */
  clear(): void {
    this.formulas.clear();
  }
}

// Singleton instance
export const formulaRegistry = new FormulaRegistry();
