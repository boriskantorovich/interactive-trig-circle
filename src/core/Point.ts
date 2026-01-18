/**
 * Point class
 * Per spec Section 4.3.2: Point/coordinate utilities
 */

import { Angle, ANGLE_TOLERANCE } from './Angle';

/**
 * Tolerance for unit circle check
 * @deprecated Use ANGLE_TOLERANCE from './Angle' instead
 */
export const UNIT_CIRCLE_TOLERANCE = ANGLE_TOLERANCE;

/**
 * Point class for representing 2D coordinates
 * Per spec Section 4.3.2
 */
export class Point {
  private readonly _x: number;
  private readonly _y: number;

  constructor(x: number, y: number) {
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      throw new Error(`Invalid point coordinates: (${x}, ${y}) must be finite numbers`);
    }
    this._x = x;
    this._y = y;
  }

  /**
   * Get x coordinate
   */
  get x(): number {
    return this._x;
  }

  /**
   * Get y coordinate
   */
  get y(): number {
    return this._y;
  }

  /**
   * Calculate distance to another point
   * Per spec Section 4.3.2
   */
  distanceTo(other: Point): number {
    const dx = this._x - other._x;
    const dy = this._y - other._y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Calculate angle from origin (0, 0) to this point
   * Returns angle in radians
   * Per spec Section 4.3.2
   */
  angle(): Angle {
    const radians = Math.atan2(this._y, this._x);
    return new Angle(radians, 'radians');
  }

  /**
   * Check if point is on the unit circle (within tolerance)
   * Per spec Section 4.3.2
   */
  onUnitCircle(tolerance: number = UNIT_CIRCLE_TOLERANCE): boolean {
    const distanceFromOrigin = Math.sqrt(this._x * this._x + this._y * this._y);
    return Math.abs(distanceFromOrigin - 1) < tolerance;
  }

  /**
   * Create a point on the unit circle at the given angle
   */
  static fromAngle(angle: Angle): Point {
    const radians = angle.toRadians();
    const x = Math.cos(radians);
    const y = Math.sin(radians);
    return new Point(x, y);
  }

  /**
   * Create point at origin
   */
  static readonly ORIGIN = new Point(0, 0);
}
