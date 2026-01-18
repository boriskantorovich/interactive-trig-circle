/**
 * TriangleRenderer for reference triangle visualization
 * Per milestone 5: Reference triangle
 * Per spec Section 2.2.1: Reference triangle showing opposite, adjacent, hypotenuse
 */

import { Angle } from '../core/Angle';
import { Point } from '../core/Point';
import { SVG_CENTER_X, SVG_CENTER_Y } from '../constants/svgConstants';
import { mathToSvg } from '../utils/coordinateUtils';

/**
 * Options for triangle rendering
 */
export interface TriangleRendererOptions {
  /**
   * Stroke width for triangle lines
   * Default: 1.5
   */
  strokeWidth?: number;
  /**
   * Stroke color for triangle lines
   * Default: 'var(--color-primary)'
   */
  strokeColor?: string;
  /**
   * Fill color for triangle (optional)
   * Default: 'none'
   */
  fillColor?: string;
  /**
   * Opacity of triangle fill
   * Default: 0.1
   */
  fillOpacity?: number;
  /**
   * Show labels for sides (opposite, adjacent, hypotenuse)
   * Default: true
   */
  showLabels?: boolean;
  /**
   * Font size for labels
   * Default: 12
   */
  labelFontSize?: number;
  /**
   * Label color
   * Default: 'var(--color-text-medium)'
   */
  labelColor?: string;
}

/**
 * Triangle rendering data
 */
export interface TriangleRenderingData {
  /**
   * SVG path data for the triangle
   */
  path: string;
  /**
   * Triangle vertices in SVG coordinates
   */
  vertices: {
    origin: { x: number; y: number };
    point: { x: number; y: number };
    xAxis: { x: number; y: number };
  };
  /**
   * Labels for triangle sides
   */
  labels: {
    opposite?: { x: number; y: number; text: string };
    adjacent?: { x: number; y: number; text: string };
    hypotenuse?: { x: number; y: number};
  };
  /**
   * Rendering options
   */
  options: Required<TriangleRendererOptions>;
}

/**
 * Render reference triangle for given angle
 * @param angle The angle to visualize
 * @param options Triangle rendering options
 * @returns Triangle rendering data
 */
export function renderReferenceTriangle(
  angle: Angle,
  options: TriangleRendererOptions = {}
): TriangleRenderingData {
  const {
    strokeWidth = 1.5,
    strokeColor = 'var(--color-primary)',
    fillColor = 'none',
    fillOpacity = 0.1,
    showLabels = true,
    labelFontSize = 12,
    labelColor = 'var(--color-text-medium)',
  } = options;

  // Calculate point on unit circle
  // On the unit circle: point.x = cos(θ), point.y = sin(θ)
  // Use point coordinates as single source of truth (DRY principle)
  const point = Point.fromAngle(angle);

  // Triangle vertices:
  // 1. Origin (0, 0) in math = (SVG_CENTER_X, SVG_CENTER_Y) in SVG
  // 2. Point on circle (point.x, point.y) in math
  // 3. Point on x-axis (point.x, 0) in math = projection onto x-axis
  const originSvg = { x: SVG_CENTER_X, y: SVG_CENTER_Y };
  const pointSvg = mathToSvg(point.x, point.y);
  const xAxisSvg = mathToSvg(point.x, 0); // Projection onto x-axis

  // Create SVG path for triangle
  // Path: M (origin) -> L (point on circle) -> L (x-axis point) -> Z (close)
  const path = `M ${originSvg.x} ${originSvg.y} L ${pointSvg.x} ${pointSvg.y} L ${xAxisSvg.x} ${xAxisSvg.y} Z`;

  // Calculate label positions
  const labels: TriangleRenderingData['labels'] = {};

  if (showLabels) {
    // Use point coordinates directly: point.x = cos(θ), point.y = sin(θ)
    // This is the single source of truth and matches the coordinates display
    // Use EXACT same formatting as coordinates display (.toFixed(4)) for perfect match
    // This ensures sin/cos labels match coordinates exactly
    const sinFormatted = point.y.toFixed(4);
    const cosFormatted = point.x.toFixed(4);

    // Opposite side (vertical line from x-axis to point)
    // Label positioned at midpoint of vertical side
    const oppositeMidX = (xAxisSvg.x + pointSvg.x) / 2;
    const oppositeMidY = (xAxisSvg.y + pointSvg.y) / 2;
    // Position label slightly to the right of the line
    const oppositeLabelX = oppositeMidX + (point.x >= 0 ? 8 : -8);
    const oppositeLabelY = oppositeMidY;
    labels.opposite = {
      x: oppositeLabelX,
      y: oppositeLabelY,
      text: `sin(θ) = ${sinFormatted}`,
    };

    // Adjacent side (horizontal line from origin to x-axis point)
    // Label positioned at midpoint of horizontal side
    const adjacentMidX = (originSvg.x + xAxisSvg.x) / 2;
    const adjacentMidY = (originSvg.y + xAxisSvg.y) / 2;
    // Position label slightly below the line
    const adjacentLabelY = adjacentMidY + 15;
    labels.adjacent = {
      x: adjacentMidX,
      y: adjacentLabelY,
      text: `cos(θ) = ${cosFormatted}`,
    };

    // Hypotenuse (radius line from origin to point)
    // Label positioned at midpoint of hypotenuse
    const hypotenuseMidX = (originSvg.x + pointSvg.x) / 2;
    const hypotenuseMidY = (originSvg.y + pointSvg.y) / 2;
    // Position label perpendicular to hypotenuse, slightly offset
    // Calculate perpendicular direction
    const dx = pointSvg.x - originSvg.x;
    const dy = pointSvg.y - originSvg.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const perpX = -dy / length; // Perpendicular x component
    const perpY = dx / length; // Perpendicular y component
    const offset = 12; // Offset distance
    labels.hypotenuse = {
      x: hypotenuseMidX + perpX * offset,
      y: hypotenuseMidY + perpY * offset,
    };
  }

  return {
    path,
    vertices: {
      origin: originSvg,
      point: pointSvg,
      xAxis: xAxisSvg,
    },
    labels,
    options: {
      strokeWidth,
      strokeColor,
      fillColor,
      fillOpacity,
      showLabels,
      labelFontSize,
      labelColor,
    },
  };
}

/**
 * Get triangle path data as string for use in SVG <path> element
 */
export function getTrianglePathData(
  angle: Angle,
  options?: TriangleRendererOptions
): string {
  return renderReferenceTriangle(angle, options).path;
}
