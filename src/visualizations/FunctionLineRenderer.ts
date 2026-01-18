/**
 * FunctionLineRenderer for geometric visualization of trigonometric functions
 * Per milestone 8: Geometric visuals for all 6 functions
 * Per spec Section 2.2.2: Trigonometric Function Display
 * Per spec Section 4.2.1: Module structure
 */

import { Angle } from '../core/Angle';
import { Point } from '../core/Point';
import { TrigonometricValues } from '../core/Trigonometry';
import { SVG_CENTER_X, SVG_CENTER_Y, SVG_SIZE } from '../constants/svgConstants';
import { mathToSvg } from '../utils/coordinateUtils';

/**
 * Options for function line rendering
 */
export interface FunctionLineRendererOptions {
  /**
   * Stroke width for function lines
   * Default: 2
   */
  strokeWidth?: number;
  /**
   * Stroke color for function lines
   * Default: 'var(--color-primary)'
   */
  strokeColor?: string;
  /**
   * Opacity for function lines
   * Default: 0.7
   */
  opacity?: number;
  /**
   * Opacity for undefined/asymptote visuals
   * Default: 0.3
   */
  undefinedOpacity?: number;
  /**
   * Show labels for function values
   * Default: true
   */
  showLabels?: boolean;
  /**
   * Font size for labels
   * Default: 11
   */
  labelFontSize?: number;
  /**
   * Label color
   * Default: 'var(--color-text-medium)'
   */
  labelColor?: string;
  /**
   * Which functions to render
   * Default: all functions
   */
  functionsToRender?: Array<'sin' | 'cos' | 'tan' | 'cot' | 'sec' | 'csc'>;
}

/**
 * Rendering data for a single function line
 */
export interface FunctionLineData {
  /**
   * SVG path data for the line (or null if undefined)
   */
  path: string | null;
  /**
   * Start point in SVG coordinates
   */
  start: { x: number; y: number } | null;
  /**
   * End point in SVG coordinates
   */
  end: { x: number; y: number } | null;
  /**
   * Label position and text
   */
  label: { x: number; y: number; text: string } | null;
  /**
   * Whether the function is undefined at this angle
   */
  isUndefined: boolean;
  /**
   * The function value (or null if undefined)
   */
  value: number | null;
}

/**
 * Rendering data for all function lines
 */
export interface FunctionLinesData {
  sin: FunctionLineData;
  cos: FunctionLineData;
  tan: FunctionLineData;
  cot: FunctionLineData;
  sec: FunctionLineData;
  csc: FunctionLineData;
  /**
   * Rendering options
   */
  options: Required<FunctionLineRendererOptions>;
}

/**
 * Render geometric visualizations for all trigonometric functions
 * @param angle The angle to visualize
 * @param trigValues Trigonometric values for the angle
 * @param options Rendering options
 * @returns Function lines rendering data
 */
export function renderFunctionLines(
  angle: Angle,
  trigValues: TrigonometricValues,
  options: FunctionLineRendererOptions = {}
): FunctionLinesData {
  const {
    strokeWidth = 2,
    strokeColor = 'var(--color-primary)',
    opacity = 0.7,
    undefinedOpacity = 0.3,
    showLabels = true,
    labelFontSize = 11,
    labelColor = 'var(--color-text-medium)',
    functionsToRender = ['sin', 'cos', 'tan', 'cot', 'sec', 'csc'],
  } = options;

  // Calculate point on unit circle
  const point = Point.fromAngle(angle);

  // Get all function values
  const sinValue = trigValues.sin();
  const cosValue = trigValues.cos();
  const tanValue = trigValues.tan();
  const cotValue = trigValues.cot();
  const secValue = trigValues.sec();
  const cscValue = trigValues.csc();

  // Check for asymptotes (undefined values)
  const isTanUndefined = tanValue === null;
  const isCotUndefined = cotValue === null;
  const isSecUndefined = secValue === null;
  const isCscUndefined = cscValue === null;

  // Convert point to SVG coordinates
  const pointSvg = mathToSvg(point.x, point.y);
  const originSvg = { x: SVG_CENTER_X, y: SVG_CENTER_Y };

  // Render each function
  const sin = renderSinLine(point, pointSvg, originSvg, sinValue, {
    showLabels,
    labelFontSize,
    labelColor,
  });

  const cos = renderCosLine(point, pointSvg, originSvg, cosValue, {
    showLabels,
    labelFontSize,
    labelColor,
  });

  const tan = renderTanLine(
    angle,
    point,
    pointSvg,
    originSvg,
    tanValue,
    isTanUndefined,
    {
      showLabels,
      labelFontSize,
      labelColor,
    }
  );

  const cot = renderCotLine(
    angle,
    point,
    pointSvg,
    originSvg,
    cotValue,
    isCotUndefined,
    {
      showLabels,
      labelFontSize,
      labelColor,
    }
  );

  const sec = renderSecLine(
    angle,
    point,
    pointSvg,
    originSvg,
    secValue,
    isSecUndefined,
    {
      showLabels,
      labelFontSize,
      labelColor,
    }
  );

  const csc = renderCscLine(
    angle,
    point,
    pointSvg,
    originSvg,
    cscValue,
    isCscUndefined,
    {
      showLabels,
      labelFontSize,
      labelColor,
    }
  );

  return {
    sin,
    cos,
    tan,
    cot,
    sec,
    csc,
    options: {
      strokeWidth,
      strokeColor,
      opacity,
      undefinedOpacity,
      showLabels,
      labelFontSize,
      labelColor,
      functionsToRender,
    },
  };
}

/**
 * Render sin(θ) as vertical line (y-coordinate)
 * Per spec Section 2.2.2: sin(θ) displayed as y-coordinate, shown as vertical line
 */
function renderSinLine(
  point: Point,
  pointSvg: { x: number; y: number },
  originSvg: { x: number; y: number },
  sinValue: number,
  labelOptions: {
    showLabels: boolean;
    labelFontSize: number;
    labelColor: string;
  }
): FunctionLineData {
  // sin(θ) = y-coordinate
  // Show as vertical line from x-axis to point
  const xAxisSvg = mathToSvg(point.x, 0);
  const start = xAxisSvg;
  const end = pointSvg;
  const path = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;

  // Label positioned at midpoint, slightly to the right
  let label: { x: number; y: number; text: string } | null = null;
  if (labelOptions.showLabels) {
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;
    const offsetX = point.x >= 0 ? 10 : -10;
    label = {
      x: midX + offsetX,
      y: midY,
      text: `sin(θ) = ${sinValue.toFixed(4)}`,
    };
  }

  return {
    path,
    start,
    end,
    label,
    isUndefined: false,
    value: sinValue,
  };
}

/**
 * Render cos(θ) as horizontal line (x-coordinate)
 * Per spec Section 2.2.2: cos(θ) displayed as x-coordinate, shown as horizontal line
 */
function renderCosLine(
  point: Point,
  pointSvg: { x: number; y: number },
  originSvg: { x: number; y: number },
  cosValue: number,
  labelOptions: {
    showLabels: boolean;
    labelFontSize: number;
    labelColor: string;
  }
): FunctionLineData {
  // cos(θ) = x-coordinate
  // Show as horizontal line from y-axis to point
  const yAxisSvg = mathToSvg(0, point.y);
  const start = yAxisSvg;
  const end = pointSvg;
  const path = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;

  // Label positioned at midpoint, slightly below
  let label: { x: number; y: number; text: string } | null = null;
  if (labelOptions.showLabels) {
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;
    label = {
      x: midX,
      y: midY + 15,
      text: `cos(θ) = ${cosValue.toFixed(4)}`,
    };
  }

  return {
    path,
    start,
    end,
    label,
    isUndefined: false,
    value: cosValue,
  };
}

/**
 * Render tan(θ) as line tangent to circle
 * Per spec Section 2.2.2: tan(θ) shown as line tangent to circle (when applicable)
 * Per spec Section 8.1: tan(π/2) show asymptote, undefined value
 */
function renderTanLine(
  angle: Angle,
  point: Point,
  pointSvg: { x: number; y: number },
  originSvg: { x: number; y: number },
  tanValue: number | null,
  isUndefined: boolean,
  labelOptions: {
    showLabels: boolean;
    labelFontSize: number;
    labelColor: string;
  }
): FunctionLineData {
  if (isUndefined) {
    // Show asymptote indicator (vertical line at x=1)
    // Per spec Section 8.1: tan(π/2) show asymptote
    const asymptoteX = mathToSvg(1, 0).x;
    const topY = 0;
    const bottomY = SVG_SIZE;
    const path = `M ${asymptoteX} ${topY} L ${asymptoteX} ${bottomY}`;

    let label: { x: number; y: number; text: string } | null = null;
    if (labelOptions.showLabels) {
      label = {
        x: asymptoteX + 10,
        y: SVG_CENTER_Y,
        text: 'tan(θ) = undefined',
      };
    }

    return {
      path,
      start: { x: asymptoteX, y: topY },
      end: { x: asymptoteX, y: bottomY },
      label,
      isUndefined: true,
      value: null,
    };
  }

  // tan(θ) = sin(θ)/cos(θ)
  // Geometric interpretation:
  // tan and cot lie on the SAME line tangent to the circle
  // This line passes through:
  //   - The outer end of sec: (sec(θ), 0) on x-axis
  //   - The point on the circle: (cos(θ), sin(θ))
  //   - The outer end of csc: (0, csc(θ)) on y-axis
  // tan is the segment from (sec(θ), 0) to (cos(θ), sin(θ))
  
  // We need to get sec value to find the outer end of sec
  // But we don't have it here, so we'll calculate it
  const secValue = 1 / point.x; // sec(θ) = 1/cos(θ)
  
  // The point on the circle is (cos(θ), sin(θ)) = (point.x, point.y)
  // The outer end of sec is (sec(θ), 0)
  // tan is the segment from (sec(θ), 0) to (point.x, point.y)
  
  // Clamp sec value to visible area
  const maxExtent = 5;
  const clampedSecX = Math.max(-maxExtent, Math.min(maxExtent, secValue));
  
  const secEndSvg = mathToSvg(clampedSecX, 0); // Outer end of sec
  const path = `M ${secEndSvg.x} ${secEndSvg.y} L ${pointSvg.x} ${pointSvg.y}`;

  let label: { x: number; y: number; text: string } | null = null;
  if (labelOptions.showLabels) {
    const midX = (secEndSvg.x + pointSvg.x) / 2;
    const midY = (secEndSvg.y + pointSvg.y) / 2;
    // Position label perpendicular to line
    const dx = pointSvg.x - secEndSvg.x;
    const dy = pointSvg.y - secEndSvg.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    if (length > 0) {
      const perpX = -dy / length;
      const perpY = dx / length;
      const offset = 12;
      label = {
        x: midX + perpX * offset,
        y: midY + perpY * offset,
        text: `tan(θ) = ${tanValue!.toFixed(4)}`,
      };
    }
  }

  return {
    path,
    start: secEndSvg,
    end: pointSvg,
    label,
    isUndefined: false,
    value: tanValue,
  };
}

/**
 * Render cot(θ) as visual representation
 * Per spec Section 2.2.2: cot(θ) shown visually
 * Per spec Section 8.1: cot(0) show undefined value
 */
function renderCotLine(
  angle: Angle,
  point: Point,
  pointSvg: { x: number; y: number },
  originSvg: { x: number; y: number },
  cotValue: number | null,
  isUndefined: boolean,
  labelOptions: {
    showLabels: boolean;
    labelFontSize: number;
    labelColor: string;
  }
): FunctionLineData {
  if (isUndefined) {
    // Show asymptote indicator (horizontal line at y=1)
    // Per spec Section 8.1: cot(0) show undefined value
    const asymptoteY = mathToSvg(0, 1).y;
    const leftX = 0;
    const rightX = SVG_SIZE;
    const path = `M ${leftX} ${asymptoteY} L ${rightX} ${asymptoteY}`;

    let label: { x: number; y: number; text: string } | null = null;
    if (labelOptions.showLabels) {
      label = {
        x: SVG_CENTER_X,
        y: asymptoteY - 10,
        text: 'cot(θ) = undefined',
      };
    }

    return {
      path,
      start: { x: leftX, y: asymptoteY },
      end: { x: rightX, y: asymptoteY },
      label,
      isUndefined: true,
      value: null,
    };
  }

  // cot(θ) = cos(θ)/sin(θ)
  // Geometric interpretation:
  // tan and cot lie on the SAME line tangent to the circle
  // This line passes through:
  //   - The outer end of sec: (sec(θ), 0) on x-axis
  //   - The point on the circle: (cos(θ), sin(θ))
  //   - The outer end of csc: (0, csc(θ)) on y-axis
  // cot is the segment from (0, csc(θ)) to (cos(θ), sin(θ))
  
  // We need to get csc value to find the outer end of csc
  // But we don't have it here, so we'll calculate it
  const cscValue = 1 / point.y; // csc(θ) = 1/sin(θ)
  
  // The point on the circle is (cos(θ), sin(θ)) = (point.x, point.y)
  // The outer end of csc is (0, csc(θ))
  // cot is the segment from (0, csc(θ)) to (point.x, point.y)
  
  // Clamp csc value to visible area
  const maxExtent = 5;
  const clampedCscY = Math.max(-maxExtent, Math.min(maxExtent, cscValue));
  
  const cscEndSvg = mathToSvg(0, clampedCscY); // Outer end of csc
  const path = `M ${cscEndSvg.x} ${cscEndSvg.y} L ${pointSvg.x} ${pointSvg.y}`;

  let label: { x: number; y: number; text: string } | null = null;
  if (labelOptions.showLabels) {
    const midX = (cscEndSvg.x + pointSvg.x) / 2;
    const midY = (cscEndSvg.y + pointSvg.y) / 2;
    // Position label perpendicular to line
    const dx = pointSvg.x - cscEndSvg.x;
    const dy = pointSvg.y - cscEndSvg.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    if (length > 0) {
      const perpX = -dy / length;
      const perpY = dx / length;
      const offset = 12;
      label = {
        x: midX + perpX * offset,
        y: midY + perpY * offset,
        text: `cot(θ) = ${cotValue!.toFixed(4)}`,
      };
    }
  }

  return {
    path,
    start: cscEndSvg,
    end: pointSvg,
    label,
    isUndefined: false,
    value: cotValue,
  };
}

/**
 * Render sec(θ) as line from origin extending beyond circle
 * Per spec Section 2.2.2: sec(θ) shown as line from origin extending beyond circle
 */
function renderSecLine(
  angle: Angle,
  point: Point,
  pointSvg: { x: number; y: number },
  originSvg: { x: number; y: number },
  secValue: number | null,
  isUndefined: boolean,
  labelOptions: {
    showLabels: boolean;
    labelFontSize: number;
    labelColor: string;
  }
): FunctionLineData {
  if (isUndefined) {
    // Show asymptote indicator (vertical line at x=0, i.e., y-axis)
    const asymptoteX = SVG_CENTER_X;
    const topY = 0;
    const bottomY = SVG_SIZE;
    const path = `M ${asymptoteX} ${topY} L ${asymptoteX} ${bottomY}`;

    let label: { x: number; y: number; text: string } | null = null;
    if (labelOptions.showLabels) {
      label = {
        x: asymptoteX + 10,
        y: SVG_CENTER_Y,
        text: 'sec(θ) = undefined',
      };
    }

    return {
      path,
      start: { x: asymptoteX, y: topY },
      end: { x: asymptoteX, y: bottomY },
      label,
      isUndefined: true,
      value: null,
    };
  }

  // sec(θ) = 1/cos(θ)
  // Geometric interpretation: sec(θ) is a line along the x-axis from origin to (sec(θ), 0)
  // This represents the distance along the x-axis to where the extended radius would intersect x=1
  // But we draw it as a line on the x-axis itself
  
  // Clamp to visible area if needed
  const maxExtent = 5; // Extend up to 5 units from origin
  const clampedX = Math.max(-maxExtent, Math.min(maxExtent, secValue!));
  
  // Draw line along x-axis from origin to (sec(θ), 0)
  const startSvg = mathToSvg(0, 0); // Origin
  const endSvg = mathToSvg(clampedX, 0); // (sec(θ), 0) on x-axis
  const path = `M ${startSvg.x} ${startSvg.y} L ${endSvg.x} ${endSvg.y}`;

  let label: { x: number; y: number; text: string } | null = null;
  if (labelOptions.showLabels) {
    // Position label at the end of sec line
    const midX = (startSvg.x + endSvg.x) / 2;
    const midY = (startSvg.y + endSvg.y) / 2;
    label = {
      x: midX + 10,
      y: midY - 10,
      text: `sec(θ) = ${secValue!.toFixed(4)}`,
    };
  }

  return {
    path,
    start: startSvg,
    end: endSvg,
    label,
    isUndefined: false,
    value: secValue,
  };
}

/**
 * Render csc(θ) as line from origin extending beyond circle
 * Per spec Section 2.2.2: csc(θ) shown as line from origin extending beyond circle
 */
function renderCscLine(
  angle: Angle,
  point: Point,
  pointSvg: { x: number; y: number },
  originSvg: { x: number; y: number },
  cscValue: number | null,
  isUndefined: boolean,
  labelOptions: {
    showLabels: boolean;
    labelFontSize: number;
    labelColor: string;
  }
): FunctionLineData {
  if (isUndefined) {
    // Show asymptote indicator (horizontal line at y=0, i.e., x-axis)
    const asymptoteY = SVG_CENTER_Y;
    const leftX = 0;
    const rightX = SVG_SIZE;
    const path = `M ${leftX} ${asymptoteY} L ${rightX} ${asymptoteY}`;

    let label: { x: number; y: number; text: string } | null = null;
    if (labelOptions.showLabels) {
      label = {
        x: SVG_CENTER_X,
        y: asymptoteY - 10,
        text: 'csc(θ) = undefined',
      };
    }

    return {
      path,
      start: { x: leftX, y: asymptoteY },
      end: { x: rightX, y: asymptoteY },
      label,
      isUndefined: true,
      value: null,
    };
  }

  // csc(θ) = 1/sin(θ)
  // Geometric interpretation: csc(θ) is a line along the y-axis from origin to (0, csc(θ))
  // This represents the distance along the y-axis to where the extended radius would intersect y=1
  // But we draw it as a line on the y-axis itself
  
  // Clamp to visible area if needed
  const maxExtent = 5; // Extend up to 5 units from origin
  const clampedY = Math.max(-maxExtent, Math.min(maxExtent, cscValue!));
  
  // Draw line along y-axis from origin to (0, csc(θ))
  const startSvg = mathToSvg(0, 0); // Origin
  const endSvg = mathToSvg(0, clampedY); // (0, csc(θ)) on y-axis
  const path = `M ${startSvg.x} ${startSvg.y} L ${endSvg.x} ${endSvg.y}`;

  let label: { x: number; y: number; text: string } | null = null;
  if (labelOptions.showLabels) {
    // Position label at the end of csc line
    const midX = (startSvg.x + endSvg.x) / 2;
    const midY = (startSvg.y + endSvg.y) / 2;
    label = {
      x: midX - 10,
      y: midY + 10,
      text: `csc(θ) = ${cscValue!.toFixed(4)}`,
    };
  }

  return {
    path,
    start: startSvg,
    end: endSvg,
    label,
    isUndefined: false,
    value: cscValue,
  };
}
