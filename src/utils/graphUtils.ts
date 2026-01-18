/**
 * Graph utility functions
 * Per milestone 9: Graph views
 * Handles angle-to-graph-position conversion with 0 = 2π equivalence
 */

import { Angle, TWO_PI } from '../core/Angle';

/**
 * Tolerance for detecting max angle values
 * Used to handle 0° = 360° and 0 rad = 2π rad equivalence for graph display
 */
const MAX_TOLERANCE_DEG = 0.5; // degrees
const MAX_TOLERANCE_RAD = 0.01; // radians

/**
 * Convert angle to graph x-position (in radians)
 * For graph display, show angles at their actual positions:
 * - 0 shows at 0 (left edge)
 * - 2π shows at 2π (right edge)
 * - No special handling for 0 = 2π equivalence (graph is periodic)
 * 
 * @param angle Angle to convert (may be normalized)
 * @param unit Current angle unit (not used, but kept for API consistency)
 * @param wasAtMax Whether the angle was originally at max (not used, but kept for API consistency)
 * @returns Angle in radians for graph positioning
 */
export function angleToGraphPosition(
  angle: Angle
): number {
  const radians = angle.toRadians();
  
  // Simply clamp to [0, 2π] - no special 0 = 2π handling
  // The graph is periodic, so 0 and 2π are the same point visually
  // But we show 0 at the left and 2π at the right for clarity
  return Math.min(Math.max(0, radians), TWO_PI);
}

/**
 * Check if an angle value is at or near the maximum (360° or 2π)
 * Used to determine if we should display at max position on graph
 */
export function isAtMaxAngle(angle: Angle, unit: 'radians' | 'degrees'): boolean {
  if (unit === 'degrees') {
    const degrees = angle.toDegrees();
    return Math.abs(degrees) < MAX_TOLERANCE_DEG || Math.abs(degrees - 360) < MAX_TOLERANCE_DEG;
  } else {
    const radians = angle.toRadians();
    return Math.abs(radians) < MAX_TOLERANCE_RAD || Math.abs(radians - TWO_PI) < MAX_TOLERANCE_RAD;
  }
}
