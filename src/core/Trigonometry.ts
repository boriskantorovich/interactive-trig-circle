/**
 * Trigonometry module
 * Per spec Section 4.3.3: Trigonometric function calculations
 */

import { Angle, ANGLE_TOLERANCE } from './Angle';

/**
 * Tolerance for checking if a value is effectively zero
 */
export const ZERO_TOLERANCE = 1e-10;

/**
 * TrigonometricValues class
 * Single source of truth for all trigonometric calculations
 * Per spec Section 4.3.3
 */
export class TrigonometricValues {
  private readonly _angle: Angle;
  private readonly _sinValue: number;
  private readonly _cosValue: number;

  constructor(angle: Angle) {
    this._angle = angle;
    const radians = angle.toRadians();
    this._sinValue = Math.sin(radians);
    this._cosValue = Math.cos(radians);
  }

  /**
   * Get the angle used for calculations
   */
  get angle(): Angle {
    return this._angle;
  }

  /**
   * Calculate sine
   * Per spec Section 4.3.3
   */
  sin(): number {
    return this._sinValue;
  }

  /**
   * Calculate cosine
   * Per spec Section 4.3.3
   */
  cos(): number {
    return this._cosValue;
  }

  /**
   * Calculate tangent
   * Returns null if undefined (cos(θ) = 0)
   * Per spec Section 4.3.3
   */
  tan(): number | null {
    if (Math.abs(this._cosValue) < ZERO_TOLERANCE) {
      return null; // undefined when cos(θ) = 0 (e.g., π/2, 3π/2)
    }
    return this._sinValue / this._cosValue;
  }

  /**
   * Calculate cotangent
   * Returns null if undefined (sin(θ) = 0)
   * Per spec Section 4.3.3
   */
  cot(): number | null {
    if (Math.abs(this._sinValue) < ZERO_TOLERANCE) {
      return null; // undefined when sin(θ) = 0 (e.g., 0, π)
    }
    return this._cosValue / this._sinValue;
  }

  /**
   * Calculate secant
   * Returns null if undefined (cos(θ) = 0)
   * Per spec Section 4.3.3
   */
  sec(): number | null {
    if (Math.abs(this._cosValue) < ZERO_TOLERANCE) {
      return null; // undefined when cos(θ) = 0
    }
    return 1 / this._cosValue;
  }

  /**
   * Calculate cosecant
   * Returns null if undefined (sin(θ) = 0)
   * Per spec Section 4.3.3
   */
  csc(): number | null {
    if (Math.abs(this._sinValue) < ZERO_TOLERANCE) {
      return null; // undefined when sin(θ) = 0
    }
    return 1 / this._sinValue;
  }
}

/**
 * Tolerance for display formatting
 * Values smaller than this are shown as 0
 * Made smaller to avoid clamping values that are close to but not exactly 0
 */
const DISPLAY_ZERO_TOLERANCE = 1e-10;

/**
 * Format a number for display
 * Clamps tiny values to 0 to avoid floating-point noise
 * Respects Pythagorean identity: if sin² + cos² = 1, then cos can't be exactly 1 if sin is not 0
 */
export function formatTrigValue(value: number | null, precision: number = 4): string {
  if (value === null) {
    return 'undefined';
  }
  // Only clamp truly tiny values (near machine epsilon) to 0
  // This preserves values like -0.9996 that are close to but not exactly -1
  if (Math.abs(value) < DISPLAY_ZERO_TOLERANCE) {
    return '0';
  }
  return value.toFixed(precision);
}

/**
 * Format trigonometric values ensuring Pythagorean identity is respected
 * If sin² + cos² = 1, then cos cannot be exactly 1 if sin is not exactly 0
 * @param sinValue Sine value
 * @param cosValue Cosine value
 * @param precision Display precision
 * @returns Formatted values with corrected precision
 */
export function formatTrigValuesRespectingIdentity(
  sinValue: number,
  cosValue: number,
  precision: number = 4
): { sin: string; cos: string } {
  // Check Pythagorean identity: sin² + cos² should be 1
  const sumOfSquares = sinValue * sinValue + cosValue * cosValue;
  const identityError = Math.abs(sumOfSquares - 1);
  
  // If identity error is significant, adjust display
  // This prevents showing cos = 1.0000 when sin is not 0
  // Use a more lenient tolerance for identity check (0.0001) vs display clamping (1e-10)
  const IDENTITY_TOLERANCE = 0.0001;
  
  if (identityError > IDENTITY_TOLERANCE) {
    // If one value is very close to ±1 and the other is not 0, show more precision
    if (Math.abs(cosValue) > 0.999 && Math.abs(sinValue) > IDENTITY_TOLERANCE) {
      // cos is too close to ±1, show it with more precision to reveal it's not exactly ±1
      const cosFormatted = cosValue.toFixed(Math.max(precision + 1, 5));
      const sinFormatted = formatTrigValue(sinValue, precision);
      return { sin: sinFormatted, cos: cosFormatted };
    }
    if (Math.abs(sinValue) > 0.999 && Math.abs(cosValue) > IDENTITY_TOLERANCE) {
      // sin is too close to ±1, show it with more precision
      const sinFormatted = sinValue.toFixed(Math.max(precision + 1, 5));
      const cosFormatted = formatTrigValue(cosValue, precision);
      return { sin: sinFormatted, cos: cosFormatted };
    }
  }
  
  // Normal formatting - use same precision as coordinates display
  return {
    sin: formatTrigValue(sinValue, precision),
    cos: formatTrigValue(cosValue, precision),
  };
}

/**
 * Check if two numbers are approximately equal (within tolerance)
 */
export function approximatelyEqual(a: number, b: number, tolerance: number = ANGLE_TOLERANCE): boolean {
  return Math.abs(a - b) < tolerance;
}
