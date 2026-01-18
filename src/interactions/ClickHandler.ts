/**
 * ClickHandler for unit circle interaction
 * Per milestone 4: Click-to-set angle + snapping
 * Per spec Section 2.1.1: Click interaction
 */

import { Angle } from '../core/Angle';
import { SVG_RADIUS } from '../constants/svgConstants';
import { svgToMath, distanceFromOrigin, eventToSvgCoordinates, angleFromSvgCoordinates } from '../utils/coordinateUtils';

/**
 * Options for click handler behavior
 */
export interface ClickHandlerOptions {
  /**
   * If true, clicks outside the circle will snap to the nearest point on the circle
   * If false, clicks outside the circle are ignored
   * Default: true
   */
  snapToCircle?: boolean;
  /**
   * Tolerance for determining if a click is "on" the circle (in SVG pixels)
   * Default: 10 pixels
   */
  snapTolerance?: number;
}

/**
 * Handle click event on unit circle SVG
 * @param event MouseEvent or PointerEvent from SVG click
 * @param svgElement The SVG element that was clicked
 * @param options Click handler options
 * @returns Angle corresponding to the click, or null if click should be ignored
 */
export function handleCircleClick(
  event: MouseEvent | PointerEvent,
  svgElement: SVGSVGElement,
  options: ClickHandlerOptions = {}
): Angle | null {
  const { snapToCircle = true, snapTolerance = 10 } = options;

  // Calculate click position relative to SVG
  const { x: svgX, y: svgY } = eventToSvgCoordinates(event, svgElement);

  // Convert to mathematical coordinates
  const mathCoords = svgToMath(svgX, svgY);
  const { x, y } = mathCoords;

  // Calculate distance from origin
  const distance = distanceFromOrigin(x, y);

  // Check if click is outside circle
  const distanceInSvgPixels = distance * SVG_RADIUS;
  const isOutsideCircle = distanceInSvgPixels > SVG_RADIUS + snapTolerance;

  if (isOutsideCircle && !snapToCircle) {
    // Click outside circle and snap is disabled - ignore
    return null;
  }

  // Calculate angle from SVG coordinates
  // If snapToCircle is enabled and distance > 1, normalize to unit circle
  const shouldNormalize = snapToCircle && distance > 1;
  return angleFromSvgCoordinates(svgX, svgY, { normalizeToCircle: shouldNormalize });
}

/**
 * Check if a click is within the unit circle (including tolerance)
 * @param svgX SVG x coordinate
 * @param svgY SVG y coordinate
 * @param tolerance Tolerance in SVG pixels
 * @returns true if click is within circle + tolerance
 */
export function isClickOnCircle(
  svgX: number,
  svgY: number,
  tolerance: number = 10
): boolean {
  const mathCoords = svgToMath(svgX, svgY);
  const distance = distanceFromOrigin(mathCoords.x, mathCoords.y);
  const distanceInSvgPixels = distance * SVG_RADIUS;
  return distanceInSvgPixels <= SVG_RADIUS + tolerance;
}
