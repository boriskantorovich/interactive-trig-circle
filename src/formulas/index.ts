/**
 * Formula registry initialization
 * Per milestone 11: Formula registry
 */

import { formulaRegistry } from './formulaRegistry';
import { PlaceholderFormula } from './basic/PlaceholderFormula.tsx';
import { PythagoreanIdentity } from './basic/PythagoreanIdentity';
import { SumDifference } from './basic/SumDifference';
import { DoubleAngle } from './basic/DoubleAngle';
import { HalfAngle } from './basic/HalfAngle';
import { Cofunction } from './basic/Cofunction';
import { PolarCoordinates } from './advanced/PolarCoordinates';
import { ComplexNumbers } from './advanced/ComplexNumbers';
import { FourierSeries } from './graduate/FourierSeries';
import { TaylorSeries } from './graduate/TaylorSeries';

/**
 * Initialize formula registry with all available formulas
 * This should be called once at app startup
 */
export function initializeFormulas(): void {
  // Register placeholder formula for testing
  formulaRegistry.register(new PlaceholderFormula());

  // Milestone 12: Pythagorean Identity
  formulaRegistry.register(new PythagoreanIdentity());

  // Milestone 13: Remaining high school formulas
  formulaRegistry.register(new SumDifference());
  formulaRegistry.register(new DoubleAngle());
  formulaRegistry.register(new HalfAngle());
  formulaRegistry.register(new Cofunction());

  // Milestone 14: College-level expansions
  formulaRegistry.register(new PolarCoordinates());
  formulaRegistry.register(new ComplexNumbers());

  // Milestone 15: Graduate modules
  formulaRegistry.register(new FourierSeries());
  formulaRegistry.register(new TaylorSeries());
}
