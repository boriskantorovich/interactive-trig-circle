/**
 * Placeholder formula for testing the formula system
 * This will be replaced by actual formulas in milestone 12+
 */

import { BaseFormulaVisualization } from '../base/FormulaVisualization';
import type { Angle } from '../../core/Angle';

/**
 * Placeholder formula visualization
 * Used to test the formula system infrastructure
 */
export class PlaceholderFormula extends BaseFormulaVisualization {
  readonly id = 'placeholder';
  readonly name = 'Placeholder Formula';
  readonly difficulty = 'highSchool';
  readonly katexFormula = '\\sin^2(\\theta) + \\cos^2(\\theta) = 1';
  readonly description = 'This is a placeholder formula for testing the formula system.';

  render(angle: Angle): JSX.Element | null {
    return (
      <div style={{ padding: '1em', textAlign: 'center', color: '#808080' }}>
        <p>Formula visualization will appear here.</p>
        <p>Current angle: {angle.toDegrees().toFixed(2)}°</p>
      </div>
    );
  }
}
