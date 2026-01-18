/**
 * Angle class
 * Per spec Section 4.3.1: Angle calculations and conversions
 */

export type AngleUnit = 'radians' | 'degrees';

/**
 * Mathematical constants
 */
export const PI = Math.PI;
export const TWO_PI = 2 * PI;
export const DEGREES_TO_RADIANS = PI / 180;
export const RADIANS_TO_DEGREES = 180 / PI;

/**
 * Tolerance for floating-point comparisons
 */
export const ANGLE_TOLERANCE = 0.0001;

/**
 * Angle class for representing and manipulating angles
 * Per spec Section 4.3.1
 */
export class Angle {
  private readonly _value: number;
  private readonly _unit: AngleUnit;

  constructor(value: number, unit: AngleUnit = 'radians') {
    if (!Number.isFinite(value)) {
      throw new Error(`Invalid angle value: ${value} must be a finite number`);
    }
    this._value = value;
    this._unit = unit;
  }

  /**
   * Get the angle value
   */
  get value(): number {
    return this._value;
  }

  /**
   * Get the angle unit
   */
  get unit(): AngleUnit {
    return this._unit;
  }

  /**
   * Convert angle to radians
   */
  toRadians(): number {
    if (this._unit === 'radians') {
      return this._value;
    }
    return this._value * DEGREES_TO_RADIANS;
  }

  /**
   * Convert angle to degrees
   */
  toDegrees(): number {
    if (this._unit === 'degrees') {
      return this._value;
    }
    return this._value * RADIANS_TO_DEGREES;
  }

  /**
   * Normalize angle to [0, 2π) for radians or [0°, 360°) for degrees
   * Per spec Section 4.3.1
   */
  normalize(): Angle {
    if (this._unit === 'radians') {
      let normalized = this._value % TWO_PI;
      if (normalized < 0) {
        normalized += TWO_PI;
      }
      return new Angle(normalized, 'radians');
    } else {
      let normalized = this._value % 360;
      if (normalized < 0) {
        normalized += 360;
      }
      return new Angle(normalized, 'degrees');
    }
  }

  /**
   * Check if this angle equals another angle (within tolerance)
   * Per spec Section 4.3.1
   */
  equals(other: Angle): boolean {
    const thisRad = this.toRadians();
    const otherRad = other.toRadians();
    return Math.abs(thisRad - otherRad) < ANGLE_TOLERANCE;
  }

  /**
   * Create an angle from radians
   */
  static fromRadians(radians: number): Angle {
    return new Angle(radians, 'radians');
  }

  /**
   * Create an angle from degrees
   */
  static fromDegrees(degrees: number): Angle {
    return new Angle(degrees, 'degrees');
  }

  /**
   * Common angle constants
   */
  static readonly ZERO = new Angle(0, 'radians');
  static readonly PI_OVER_6 = new Angle(PI / 6, 'radians');
  static readonly PI_OVER_4 = new Angle(PI / 4, 'radians');
  static readonly PI_OVER_3 = new Angle(PI / 3, 'radians');
  static readonly PI_OVER_2 = new Angle(PI / 2, 'radians');
  static readonly PI = new Angle(PI, 'radians');
  static readonly THREE_PI_OVER_2 = new Angle((3 * PI) / 2, 'radians');
  static readonly TWO_PI = new Angle(TWO_PI, 'radians');
}
