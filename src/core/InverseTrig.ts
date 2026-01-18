/**
 * Inverse Trigonometry module
 * Per spec Section 4.3.4: Inverse trigonometric function calculations
 * Per milestone 14: College-level expansions
 */

import { Angle, PI, TWO_PI } from './Angle';
import { ZERO_TOLERANCE } from './Trigonometry';

/**
 * InverseTrigonometricValues class
 * Per spec Section 4.3.4
 */
export class InverseTrigonometricValues {
  private readonly _value: number;
  private readonly _functionName: 'sin' | 'cos' | 'tan' | 'sec' | 'csc' | 'cot';

  constructor(value: number, functionName: 'sin' | 'cos' | 'tan' | 'sec' | 'csc' | 'cot') {
    if (!Number.isFinite(value)) {
      throw new Error(`Invalid value: ${value} must be a finite number`);
    }
    this._value = value;
    this._functionName = functionName;
  }

  /**
   * Get the input value
   */
  get value(): number {
    return this._value;
  }

  /**
   * Get the function name
   */
  get functionName(): 'sin' | 'cos' | 'tan' | 'sec' | 'csc' | 'cot' {
    return this._functionName;
  }

  /**
   * Calculate arcsin (inverse sine)
   * Domain: [-1, 1]
   * Principal value range: [-π/2, π/2]
   * Returns all solutions in [0, 2π)
   * Per spec Section 4.3.4: Returns Angle[]
   */
  arcsin(): Angle[] {
    if (this._value < -1 || this._value > 1) {
      throw new Error(`arcsin domain error: value ${this._value} must be in [-1, 1]`);
    }

    // Principal value: [-π/2, π/2]
    const principal = Math.asin(this._value);
    const principalAngle = Angle.fromRadians(principal);

    // All solutions in [0, 2π):
    // sin(θ) = sin(π - θ), so if θ is the principal value:
    // - If principal is in [0, π/2], then π - principal is also a solution
    // - If principal is in [-π/2, 0), then 2π + principal and π - principal are solutions
    const solutions: Angle[] = [];

    if (principal >= 0) {
      // Principal is in [0, π/2]
      solutions.push(principalAngle);
      if (principal > 0 && principal < PI / 2) {
        // π - principal is also a solution
        const secondSolution = PI - principal;
        solutions.push(Angle.fromRadians(secondSolution));
      }
    } else {
      // Principal is in [-π/2, 0)
      // Two solutions: 2π + principal (which is in [3π/2, 2π)) and π - principal (which is in (π/2, π])
      const firstSolution = TWO_PI + principal; // Normalize to [0, 2π)
      const secondSolution = PI - principal;
      solutions.push(Angle.fromRadians(firstSolution));
      solutions.push(Angle.fromRadians(secondSolution));
    }

    // Normalize all solutions
    return solutions.map((angle) => angle.normalize());
  }

  /**
   * Calculate arccos (inverse cosine)
   * Domain: [-1, 1]
   * Principal value range: [0, π]
   * Returns all solutions in [0, 2π)
   * Per spec Section 4.3.4: Returns Angle[]
   */
  arccos(): Angle[] {
    if (this._value < -1 || this._value > 1) {
      throw new Error(`arccos domain error: value ${this._value} must be in [-1, 1]`);
    }

    // Principal value: [0, π]
    const principal = Math.acos(this._value);
    const principalAngle = Angle.fromRadians(principal);

    // All solutions in [0, 2π):
    // cos(θ) = cos(-θ) = cos(2π - θ)
    // If principal is in [0, π], then 2π - principal is also a solution
    const solutions: Angle[] = [principalAngle];

    if (principal > 0 && principal < PI) {
      // 2π - principal is also a solution
      const secondSolution = TWO_PI - principal;
      solutions.push(Angle.fromRadians(secondSolution));
    }

    // Normalize all solutions
    return solutions.map((angle) => angle.normalize());
  }

  /**
   * Calculate arctan (inverse tangent)
   * Domain: (-∞, ∞)
   * Principal value range: (-π/2, π/2)
   * Returns single solution (principal value)
   * Per spec Section 4.3.4: Returns Angle
   */
  arctan(): Angle {
    // Principal value: (-π/2, π/2)
    const principal = Math.atan(this._value);
    return Angle.fromRadians(principal).normalize();
  }

  /**
   * Calculate arcsec (inverse secant)
   * Domain: (-∞, -1] ∪ [1, ∞)
   * Principal value range: [0, π/2) ∪ (π/2, π]
   * Returns all solutions in [0, 2π)
   * Per spec Section 4.3.4: Returns Angle[]
   */
  arcsec(): Angle[] {
    if (this._value > -1 && this._value < 1) {
      throw new Error(`arcsec domain error: value ${this._value} must be in (-∞, -1] ∪ [1, ∞)`);
    }

    // sec(θ) = 1/cos(θ), so we need to find θ such that cos(θ) = 1/value
    const cosValue = 1 / this._value;
    const principal = Math.acos(cosValue);
    const principalAngle = Angle.fromRadians(principal);

    // All solutions in [0, 2π):
    // Similar to arccos, but with domain restrictions
    const solutions: Angle[] = [principalAngle];

    if (principal > 0 && principal < PI) {
      // 2π - principal is also a solution
      const secondSolution = TWO_PI - principal;
      solutions.push(Angle.fromRadians(secondSolution));
    }

    // Normalize all solutions
    return solutions.map((angle) => angle.normalize());
  }

  /**
   * Calculate arccsc (inverse cosecant)
   * Domain: (-∞, -1] ∪ [1, ∞)
   * Principal value range: [-π/2, 0) ∪ (0, π/2]
   * Returns all solutions in [0, 2π)
   * Per spec Section 4.3.4: Returns Angle[]
   */
  arccsc(): Angle[] {
    if (this._value > -1 && this._value < 1) {
      throw new Error(`arccsc domain error: value ${this._value} must be in (-∞, -1] ∪ [1, ∞)`);
    }

    // csc(θ) = 1/sin(θ), so we need to find θ such that sin(θ) = 1/value
    const sinValue = 1 / this._value;
    const principal = Math.asin(sinValue);
    const principalAngle = Angle.fromRadians(principal);

    // All solutions in [0, 2π):
    // Similar to arcsin
    const solutions: Angle[] = [];

    if (principal >= 0) {
      // Principal is in [0, π/2]
      solutions.push(principalAngle);
      if (principal > 0 && principal < PI / 2) {
        // π - principal is also a solution
        const secondSolution = PI - principal;
        solutions.push(Angle.fromRadians(secondSolution));
      }
    } else {
      // Principal is in [-π/2, 0)
      // Two solutions: 2π + principal and π - principal
      const firstSolution = TWO_PI + principal;
      const secondSolution = PI - principal;
      solutions.push(Angle.fromRadians(firstSolution));
      solutions.push(Angle.fromRadians(secondSolution));
    }

    // Normalize all solutions
    return solutions.map((angle) => angle.normalize());
  }

  /**
   * Calculate arccot (inverse cotangent)
   * Domain: (-∞, ∞)
   * Principal value range: (0, π)
   * Returns single solution (principal value)
   * Per spec Section 4.3.4: Returns Angle
   * 
   * Note: Some definitions use range (-π/2, π/2), but we use (0, π) for consistency
   * with arccos and to avoid discontinuity at 0.
   */
  arccot(): Angle {
    // cot(θ) = cos(θ)/sin(θ) = 1/tan(θ)
    // So arccot(x) = arctan(1/x) for x ≠ 0
    // But we want range (0, π), so we adjust:
    // - If x > 0: arctan(1/x) gives (0, π/2), which is fine
    // - If x < 0: arctan(1/x) gives (-π/2, 0), we add π to get (π/2, π)
    // - If x = 0: cot(θ) = 0 when θ = π/2, so return π/2

    if (Math.abs(this._value) < ZERO_TOLERANCE) {
      // cot(θ) = 0 when θ = π/2 or 3π/2, but principal is π/2
      return Angle.PI_OVER_2;
    }

    const atanValue = Math.atan(1 / this._value);
    let principal: number;

    if (this._value > 0) {
      // atan(1/x) gives (0, π/2), which is in our desired range (0, π)
      principal = atanValue;
    } else {
      // atan(1/x) gives (-π/2, 0), we add π to get (π/2, π)
      principal = atanValue + PI;
    }

    return Angle.fromRadians(principal).normalize();
  }
}
