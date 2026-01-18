/**
 * ArcRenderer for angle arc visualization
 * Per milestone 4: Angle arc visualization
 * Per spec Section 2.2.1: Angle arc (visual arc showing angle from positive x-axis)
 */

import { Angle } from '../core/Angle';
import { SVG_CENTER_X, SVG_CENTER_Y, SVG_RADIUS } from '../constants/svgConstants';

/**
 * Options for arc rendering
 */
export interface ArcRendererOptions {
  /**
   * Radius of the arc (as fraction of unit circle radius)
   * Default: 0.3 (30% of unit circle radius)
   */
  arcRadius?: number;
  /**
   * Stroke width of the arc
   * Default: 2
   */
  strokeWidth?: number;
  /**
   * Stroke color (CSS color value)
   * Default: 'var(--color-primary)'
   */
  strokeColor?: string;
  /**
   * Fill color (CSS color value) - for filled arc
   * Default: 'none'
   */
  fillColor?: string;
  /**
   * Opacity of the arc
   * Default: 0.3
   */
  opacity?: number;
}

/**
 * Render an SVG arc showing the angle from positive x-axis
 * @param angle The angle to visualize
 * @param options Arc rendering options
 * @returns SVG path element attributes for the arc
 */
export function renderAngleArc(
  angle: Angle,
  options: ArcRendererOptions = {}
): {
  d: string;
  strokeWidth: number;
  stroke: string;
  fill: string;
  opacity: number;
} {
  const {
    arcRadius = 0.3,
    strokeWidth = 2,
    strokeColor = 'var(--color-primary)',
    fillColor = 'none',
    opacity = 0.3,
  } = options;

  const radians = angle.toRadians();
  const arcRadiusPixels = SVG_RADIUS * arcRadius;

  // Start angle is 0 (positive x-axis)
  const startX = SVG_CENTER_X + SVG_RADIUS * arcRadius;
  const startY = SVG_CENTER_Y;

  // End angle is the current angle
  const endX = SVG_CENTER_X + Math.cos(radians) * SVG_RADIUS * arcRadius;
  const endY = SVG_CENTER_Y - Math.sin(radians) * SVG_RADIUS * arcRadius; // Invert y for SVG

  // SVG arc parameters:
  // A rx ry x-axis-rotation large-arc-flag sweep-flag x y
  // large-arc-flag: 0 for arc ≤ 180°, 1 for arc > 180°
  // sweep-flag: 0 for counter-clockwise, 1 for clockwise
  // 
  // Since we invert y-axis in coordinate conversion (y: SVG_CENTER_Y - y * SVG_RADIUS),
  // the visual representation matches math coordinates where:
  // - 0° is at right (positive x-axis)
  // - 90° is at top (positive y-axis in math, which is smaller y in SVG)
  // - Angles increase counter-clockwise
  // 
  // In SVG's native coordinate system (y increases downward), going from 0° to 90°
  // means going from right to top, which is counter-clockwise in SVG.
  // So we use sweep-flag = 0 (counter-clockwise in SVG = counter-clockwise in math)
  const largeArcFlag = radians > Math.PI ? 1 : 0;
  const sweepFlag = 0; // Counter-clockwise in SVG (matches counter-clockwise in math)

  // Create SVG path for filled sector:
  // M = move to center
  // L = line to start point (positive x-axis)
  // A = arc from start to end
  // Z = close path (line back to center)
  const d = `M ${SVG_CENTER_X} ${SVG_CENTER_Y} L ${startX} ${startY} A ${arcRadiusPixels} ${arcRadiusPixels} 0 ${largeArcFlag} ${sweepFlag} ${endX} ${endY} Z`;

  return {
    d,
    strokeWidth,
    stroke: strokeColor,
    fill: fillColor,
    opacity,
  };
}

/**
 * Get the arc path data as a string for use in SVG <path> element
 */
export function getArcPathData(angle: Angle, options?: ArcRendererOptions): string {
  return renderAngleArc(angle, options).d;
}
