/**
 * Coordinate conversion utilities
 * 
 * Functions for converting between mathematical coordinates and SVG coordinates.
 * 
 * Mathematical coordinate system:
 * - Origin at (0, 0)
 * - Unit circle has radius 1
 * - Y-axis increases upward (standard math convention)
 * 
 * SVG coordinate system:
 * - Origin at top-left (0, 0)
 * - Center at (SVG_CENTER_X, SVG_CENTER_Y)
 * - Unit circle has radius SVG_RADIUS pixels
 * - Y-axis increases downward (SVG convention)
 */

import { SVG_CENTER_X, SVG_CENTER_Y, SVG_RADIUS, SVG_SIZE } from '../constants/svgConstants';
import { ANGLE_TOLERANCE } from '../core/Angle';
import { Angle } from '../core/Angle';

/**
 * Convert mathematical coordinate to SVG coordinate
 * 
 * @param x Mathematical x coordinate (unit circle radius = 1)
 * @param y Mathematical y coordinate (unit circle radius = 1)
 * @returns SVG coordinates { x, y }
 * 
 * @example
 * // Point at (1, 0) on unit circle (right side)
 * const svg = mathToSvg(1, 0);
 * // Returns { x: 350, y: 200 } (assuming SVG_CENTER_X=200, SVG_RADIUS=150)
 */
export function mathToSvg(x: number, y: number): { x: number; y: number } {
  return {
    x: SVG_CENTER_X + x * SVG_RADIUS,
    y: SVG_CENTER_Y - y * SVG_RADIUS, // Invert y-axis (SVG y increases downward)
  };
}

/**
 * Convert SVG coordinate to mathematical coordinate
 * 
 * @param svgX SVG x coordinate (0 to SVG_SIZE)
 * @param svgY SVG y coordinate (0 to SVG_SIZE)
 * @returns Mathematical coordinates { x, y } where unit circle has radius 1
 * 
 * @example
 * // Click at SVG center
 * const math = svgToMath(200, 200);
 * // Returns { x: 0, y: 0 } (origin)
 */
export function svgToMath(svgX: number, svgY: number): { x: number; y: number } {
  return {
    x: (svgX - SVG_CENTER_X) / SVG_RADIUS,
    y: (SVG_CENTER_Y - svgY) / SVG_RADIUS, // Invert y-axis (SVG y increases downward)
  };
}

/**
 * Calculate distance from point to origin (0, 0)
 * 
 * @param x X coordinate
 * @param y Y coordinate
 * @returns Distance from origin
 */
export function distanceFromOrigin(x: number, y: number): number {
  return Math.sqrt(x * x + y * y);
}

/**
 * Normalize a point to be on the unit circle
 * 
 * If the point is at the origin (distance < ANGLE_TOLERANCE), returns (1, 0) which
 * corresponds to angle 0 (pointing right along positive x-axis).
 * 
 * @param x X coordinate
 * @param y Y coordinate
 * @returns Normalized point on unit circle { x, y }
 * 
 * @example
 * // Point at (2, 0) - normalize to unit circle
 * const normalized = normalizeToUnitCircle(2, 0);
 * // Returns { x: 1, y: 0 }
 */
export function normalizeToUnitCircle(x: number, y: number): { x: number; y: number } {
  const distance = distanceFromOrigin(x, y);
  if (distance < ANGLE_TOLERANCE) {
    // At origin, default to angle 0 (pointing right)
    return { x: 1, y: 0 };
  }
  return {
    x: x / distance,
    y: y / distance,
  };
}

/**
 * Normalize radians from atan2 range [-π, π] to [0, 2π)
 * 
 * atan2 returns angles in the range [-π, π], but we often want
 * angles in the range [0, 2π) for consistency.
 * 
 * @param radians Angle in radians from atan2 (range: [-π, π])
 * @returns Normalized angle in radians (range: [0, 2π))
 * 
 * @example
 * // atan2(-1, 0) returns -π/2
 * const normalized = normalizeRadians(-Math.PI / 2);
 * // Returns 3π/2
 */
export function normalizeRadians(radians: number): number {
  return radians < 0 ? radians + 2 * Math.PI : radians;
}

/**
 * Convert mouse/pointer event coordinates to SVG coordinates
 * 
 * Takes a mouse or pointer event and converts the client coordinates
 * to SVG viewBox coordinates, accounting for the SVG element's position
 * and size.
 * 
 * @param event MouseEvent or PointerEvent
 * @param svgElement The SVG element
 * @returns SVG coordinates { x, y } in viewBox space (0 to SVG_SIZE)
 * 
 * @example
 * // Click handler
 * const svgCoords = eventToSvgCoordinates(event, svgElement);
 * // Returns { x: 200, y: 150 } (example)
 */
export function eventToSvgCoordinates(
  event: MouseEvent | PointerEvent,
  svgElement: SVGSVGElement
): { x: number; y: number } {
  const rect = svgElement.getBoundingClientRect();
  
  // Get the viewBox from the SVG element
  const viewBox = svgElement.viewBox.baseVal;
  const viewBoxX = viewBox.x || 0;
  const viewBoxY = viewBox.y || 0;
  const viewBoxWidth = viewBox.width || SVG_SIZE;
  const viewBoxHeight = viewBox.height || SVG_SIZE;
  
  // Convert click coordinates to viewBox coordinates
  return {
    x: viewBoxX + ((event.clientX - rect.left) / rect.width) * viewBoxWidth,
    y: viewBoxY + ((event.clientY - rect.top) / rect.height) * viewBoxHeight,
  };
}

/**
 * Calculate angle from mathematical coordinates
 * 
 * Converts a point in mathematical coordinates to an Angle.
 * Optionally normalizes the point to the unit circle before calculating the angle.
 * 
 * @param x Mathematical x coordinate
 * @param y Mathematical y coordinate
 * @param options Options for angle calculation
 * @param options.normalizeToCircle If true, normalize point to unit circle before calculating angle (default: false)
 * @returns Angle corresponding to the coordinates
 * 
 * @example
 * // Point at (1, 0) on unit circle
 * const angle = angleFromMathCoordinates(1, 0);
 * // Returns Angle.ZERO (0 radians)
 * 
 * @example
 * // Point at (2, 0) - normalize to circle first
 * const angle = angleFromMathCoordinates(2, 0, { normalizeToCircle: true });
 * // Returns Angle.ZERO (normalized to (1, 0))
 */
export function angleFromMathCoordinates(
  x: number,
  y: number,
  options: { normalizeToCircle?: boolean } = {}
): Angle {
  const { normalizeToCircle = false } = options;
  
  let finalX = x;
  let finalY = y;
  
  // Normalize to unit circle if requested
  if (normalizeToCircle) {
    const normalized = normalizeToUnitCircle(x, y);
    finalX = normalized.x;
    finalY = normalized.y;
  }
  
  // Calculate angle using atan2
  // atan2(y, x) gives angle from positive x-axis
  const radians = Math.atan2(finalY, finalX);
  
  // atan2 returns [-π, π], but we want [0, 2π)
  // Normalize to [0, 2π)
  const normalizedRadians = normalizeRadians(radians);
  
  return new Angle(normalizedRadians, 'radians');
}

/**
 * Calculate angle from SVG coordinates
 * 
 * Converts a point in SVG coordinates to an Angle.
 * Optionally normalizes the point to the unit circle before calculating the angle.
 * 
 * @param svgX SVG x coordinate
 * @param svgY SVG y coordinate
 * @param options Options for angle calculation
 * @param options.normalizeToCircle If true, normalize point to unit circle before calculating angle (default: false)
 * @returns Angle corresponding to the SVG coordinates
 * 
 * @example
 * // Click at SVG center (200, 200)
 * const angle = angleFromSvgCoordinates(200, 200);
 * // Returns Angle.ZERO (origin = 0 radians)
 * 
 * @example
 * // Drag with lock to circle
 * const angle = angleFromSvgCoordinates(svgX, svgY, { normalizeToCircle: true });
 */
export function angleFromSvgCoordinates(
  svgX: number,
  svgY: number,
  options: { normalizeToCircle?: boolean } = {}
): Angle {
  // Convert to mathematical coordinates
  const mathCoords = svgToMath(svgX, svgY);
  
  // Calculate angle from math coordinates
  return angleFromMathCoordinates(mathCoords.x, mathCoords.y, options);
}
