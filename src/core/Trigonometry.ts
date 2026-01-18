/**
 * Trigonometry module
 * Per spec Section 4.3.3: Trigonometric function calculations
 */

import { Angle } from './Angle';

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
 * Format a number for display
 * Clamps tiny values to 0 to avoid floating-point noise
 */
export function formatTrigValue(value: number | null, precision: number = 4): string {
  if (value === null) {
    return 'undefined';
  }
  if (Math.abs(value) < ZERO_TOLERANCE) {
    return '0';
  }
  return value.toFixed(precision);
}

/**
 * Check if two numbers are approximately equal (within tolerance)
 */
export function approximatelyEqual(a: number, b: number, tolerance: number = 0.0001): boolean {
  return Math.abs(a - b) < tolerance;
}
