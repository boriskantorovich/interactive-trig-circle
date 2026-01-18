/**
 * GraphView component
 * Per milestone 9: Graph views (sin/cos first → then others)
 * Per spec Section 2.4: Graph Views
 * Per spec Section 2.4.2: Graph-Unit Circle Relationship
 */

import { useMemo, useState, useRef, useCallback } from 'react';
import { useCurrentAngle, useAngleUnit, useStore } from '../state/store';
import { Angle, PI, TWO_PI } from '../core/Angle';
import { TrigonometricValues } from '../core/Trigonometry';
import { angleToGraphPosition } from '../utils/graphUtils';
import './GraphView.css';

/**
 * Function type for graph rendering
 */
type GraphFunction = 'sin' | 'cos' | 'tan' | 'cot' | 'sec' | 'csc';

/**
 * Graph configuration
 */
interface GraphConfig {
  width: number;
  height: number;
  padding: number;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  gridStep: number;
}

/**
 * Default graph configuration
 */
const DEFAULT_CONFIG: GraphConfig = {
  width: 600,
  height: 400,
  padding: 60,
  xMin: 0,
  xMax: TWO_PI,
  yMin: -2,
  yMax: 2,
  gridStep: PI / 4,
};

/**
 * Convert mathematical x coordinate to SVG x coordinate
 */
function mathXToSvgX(x: number, config: GraphConfig): number {
  const range = config.xMax - config.xMin;
  const normalized = (x - config.xMin) / range;
  return config.padding + normalized * (config.width - 2 * config.padding);
}

/**
 * Convert mathematical y coordinate to SVG y coordinate
 * SVG y increases downward, so we need to invert
 */
function mathYToSvgY(y: number, config: GraphConfig): number {
  const range = config.yMax - config.yMin;
  // Normalize y to [0, 1] where 0 = yMin, 1 = yMax
  const normalized = (y - config.yMin) / range;
  // Invert: yMax maps to top (padding), yMin maps to bottom (height - padding)
  return config.padding + (1 - normalized) * (config.height - 2 * config.padding);
}

/**
 * Generate path data for sin(x) function
 */
function generateSinPath(config: GraphConfig): string {
  const points: string[] = [];
  const step = (config.xMax - config.xMin) / 500; // 500 points for smooth curve

  for (let x = config.xMin; x <= config.xMax; x += step) {
    const y = Math.sin(x);
    const svgX = mathXToSvgX(x, config);
    const svgY = mathYToSvgY(y, config);
    points.push(`${svgX},${svgY}`);
  }

  if (points.length === 0) return '';
  return `M ${points[0]} L ${points.slice(1).join(' L ')}`;
}

/**
 * Generate path data for cos(x) function
 */
function generateCosPath(config: GraphConfig): string {
  const points: string[] = [];
  const step = (config.xMax - config.xMin) / 500;

  for (let x = config.xMin; x <= config.xMax; x += step) {
    const y = Math.cos(x);
    const svgX = mathXToSvgX(x, config);
    const svgY = mathYToSvgY(y, config);
    points.push(`${svgX},${svgY}`);
  }

  if (points.length === 0) return '';
  return `M ${points[0]} L ${points.slice(1).join(' L ')}`;
}

/**
 * Generate path segments for tan(x) function
 * Returns array of path strings, split around asymptotes and out-of-bounds regions
 */
function generateTanPathSegments(config: GraphConfig): string[] {
  const segments: string[] = [];
  const step = (config.xMax - config.xMin) / 1000;
  const asymptotes = [PI / 2, (3 * PI) / 2];

  let currentSegment: string[] = [];

  for (let x = config.xMin; x <= config.xMax; x += step) {
    // Check if we're near an asymptote
    const nearAsymptote = asymptotes.some((asym) => Math.abs(x - asym) < step * 2);

    if (nearAsymptote) {
      // Close current segment if it exists
      if (currentSegment.length > 0) {
        segments.push(`M ${currentSegment[0]} L ${currentSegment.slice(1).join(' L ')}`);
        currentSegment = [];
      }
      continue;
    }

    const y = Math.tan(x);
    const isOutOfBounds = y < config.yMin || y > config.yMax;
    
    if (isOutOfBounds) {
      // Close current segment if it exists (value went out of bounds)
      if (currentSegment.length > 0) {
        segments.push(`M ${currentSegment[0]} L ${currentSegment.slice(1).join(' L ')}`);
        currentSegment = [];
      }
      continue; // Skip out-of-bounds points
    }

    // Only add points that are within bounds
    const svgX = mathXToSvgX(x, config);
    const svgY = mathYToSvgY(y, config);
    currentSegment.push(`${svgX},${svgY}`);
  }

  // Add final segment
  if (currentSegment.length > 0) {
    segments.push(`M ${currentSegment[0]} L ${currentSegment.slice(1).join(' L ')}`);
  }

  return segments;
}

/**
 * Generate path segments for cot(x) function
 * Returns array of path strings, split around asymptotes and out-of-bounds regions
 */
function generateCotPathSegments(config: GraphConfig): string[] {
  const segments: string[] = [];
  const step = (config.xMax - config.xMin) / 1000;
  const asymptotes = [0, PI, TWO_PI];

  let currentSegment: string[] = [];

  for (let x = config.xMin; x <= config.xMax; x += step) {
    // Check if we're near an asymptote
    const nearAsymptote = asymptotes.some((asym) => Math.abs(x - asym) < step * 2);

    if (nearAsymptote) {
      // Close current segment if it exists
      if (currentSegment.length > 0) {
        segments.push(`M ${currentSegment[0]} L ${currentSegment.slice(1).join(' L ')}`);
        currentSegment = [];
      }
      continue;
    }

    const y = 1 / Math.tan(x); // cot(x) = 1/tan(x)
    const isOutOfBounds = y < config.yMin || y > config.yMax;
    
    if (isOutOfBounds) {
      // Close current segment if it exists (value went out of bounds)
      if (currentSegment.length > 0) {
        segments.push(`M ${currentSegment[0]} L ${currentSegment.slice(1).join(' L ')}`);
        currentSegment = [];
      }
      continue; // Skip out-of-bounds points
    }

    // Only add points that are within bounds
    const svgX = mathXToSvgX(x, config);
    const svgY = mathYToSvgY(y, config);
    currentSegment.push(`${svgX},${svgY}`);
  }

  if (currentSegment.length > 0) {
    segments.push(`M ${currentSegment[0]} L ${currentSegment.slice(1).join(' L ')}`);
  }

  return segments;
}

/**
 * Generate path segments for sec(x) function
 * Returns array of path strings, split around asymptotes and out-of-bounds regions
 */
function generateSecPathSegments(config: GraphConfig): string[] {
  const segments: string[] = [];
  const step = (config.xMax - config.xMin) / 1000;
  const asymptotes = [PI / 2, (3 * PI) / 2];

  let currentSegment: string[] = [];

  for (let x = config.xMin; x <= config.xMax; x += step) {
    const nearAsymptote = asymptotes.some((asym) => Math.abs(x - asym) < step * 2);

    if (nearAsymptote) {
      // Close current segment if it exists
      if (currentSegment.length > 0) {
        segments.push(`M ${currentSegment[0]} L ${currentSegment.slice(1).join(' L ')}`);
        currentSegment = [];
      }
      continue;
    }

    const y = 1 / Math.cos(x);
    const isOutOfBounds = y < config.yMin || y > config.yMax;
    
    if (isOutOfBounds) {
      // Close current segment if it exists (value went out of bounds)
      if (currentSegment.length > 0) {
        segments.push(`M ${currentSegment[0]} L ${currentSegment.slice(1).join(' L ')}`);
        currentSegment = [];
      }
      continue; // Skip out-of-bounds points
    }

    // Only add points that are within bounds
    const svgX = mathXToSvgX(x, config);
    const svgY = mathYToSvgY(y, config);
    currentSegment.push(`${svgX},${svgY}`);
  }

  if (currentSegment.length > 0) {
    segments.push(`M ${currentSegment[0]} L ${currentSegment.slice(1).join(' L ')}`);
  }

  return segments;
}

/**
 * Generate path segments for csc(x) function
 * Returns array of path strings, split around asymptotes and out-of-bounds regions
 */
function generateCscPathSegments(config: GraphConfig): string[] {
  const segments: string[] = [];
  const step = (config.xMax - config.xMin) / 1000;
  const asymptotes = [0, PI, TWO_PI];

  let currentSegment: string[] = [];

  for (let x = config.xMin; x <= config.xMax; x += step) {
    const nearAsymptote = asymptotes.some((asym) => Math.abs(x - asym) < step * 2);

    if (nearAsymptote) {
      // Close current segment if it exists
      if (currentSegment.length > 0) {
        segments.push(`M ${currentSegment[0]} L ${currentSegment.slice(1).join(' L ')}`);
        currentSegment = [];
      }
      continue;
    }

    const y = 1 / Math.sin(x);
    const isOutOfBounds = y < config.yMin || y > config.yMax;
    
    if (isOutOfBounds) {
      // Close current segment if it exists (value went out of bounds)
      if (currentSegment.length > 0) {
        segments.push(`M ${currentSegment[0]} L ${currentSegment.slice(1).join(' L ')}`);
        currentSegment = [];
      }
      continue; // Skip out-of-bounds points
    }

    // Only add points that are within bounds
    const svgX = mathXToSvgX(x, config);
    const svgY = mathYToSvgY(y, config);
    currentSegment.push(`${svgX},${svgY}`);
  }

  if (currentSegment.length > 0) {
    segments.push(`M ${currentSegment[0]} L ${currentSegment.slice(1).join(' L ')}`);
  }

  return segments;
}

/**
 * Get function value at angle
 */
function getFunctionValue(
  _angle: Angle,
  functionName: GraphFunction,
  trigValues: TrigonometricValues
): number | null {
  switch (functionName) {
    case 'sin':
      return trigValues.sin();
    case 'cos':
      return trigValues.cos();
    case 'tan':
      return trigValues.tan();
    case 'cot':
      return trigValues.cot();
    case 'sec':
      return trigValues.sec();
    case 'csc':
      return trigValues.csc();
  }
}

/**
 * GraphView component
 * Per spec Section 2.4.1: Function Graphs
 */
export function GraphView() {
  const currentAngle = useCurrentAngle();
  const angleUnit = useAngleUnit();
  const setAngle = useStore((state) => state.setAngle);
  const [selectedFunction, setSelectedFunction] = useState<GraphFunction>('sin');
  const svgRef = useRef<SVGSVGElement>(null);

  // Calculate trigonometric values for current angle
  const trigValues = useMemo(() => {
    return new TrigonometricValues(currentAngle);
  }, [currentAngle]);

  // Get current angle in radians for graph positioning
  // Simply use the angle value directly - no special 0 = 2π handling
  // The graph is periodic, so 0 and 2π are equivalent, but we show them at their positions
  const angleRadians = useMemo(() => {
    return angleToGraphPosition(currentAngle);
  }, [currentAngle]);

  // Generate graph paths based on selected function
  const graphPaths = useMemo(() => {
    const config = DEFAULT_CONFIG;
    switch (selectedFunction) {
      case 'sin':
        return [generateSinPath(config)];
      case 'cos':
        return [generateCosPath(config)];
      case 'tan':
        return generateTanPathSegments(config);
      case 'cot':
        return generateCotPathSegments(config);
      case 'sec':
        return generateSecPathSegments(config);
      case 'csc':
        return generateCscPathSegments(config);
    }
  }, [selectedFunction]);

  // Get asymptote positions for the selected function
  const asymptotes = useMemo(() => {
    const config = DEFAULT_CONFIG;
    switch (selectedFunction) {
      case 'tan':
      case 'sec':
        // tan and sec are undefined at π/2 and 3π/2
        return [PI / 2, (3 * PI) / 2].filter((x) => x >= config.xMin && x <= config.xMax);
      case 'cot':
      case 'csc':
        // cot and csc are undefined at 0, π, and 2π
        return [0, PI, TWO_PI].filter((x) => x >= config.xMin && x <= config.xMax);
      default:
        // sin and cos have no asymptotes
        return [];
    }
  }, [selectedFunction]);

  // Calculate marker position
  const markerPosition = useMemo(() => {
    const config = DEFAULT_CONFIG;
    const value = getFunctionValue(currentAngle, selectedFunction, trigValues);

    if (value === null) {
      // Function is undefined at this angle
      return null;
    }

    // Check if value is out of bounds (clamped)
    // Only consider out of bounds if significantly outside (not just slightly)
    const isOutOfBounds = value < config.yMin - 0.1 || value > config.yMax + 0.1;
    
    // Don't show marker or indicator if out of bounds - just hide it completely
    if (isOutOfBounds) {
      return null; // Treat out of bounds as hidden, not as undefined
    }
    
    const clampedValue = Math.max(config.yMin, Math.min(config.yMax, value));
    
    return {
      x: mathXToSvgX(angleRadians, config),
      y: mathYToSvgY(clampedValue, config),
      value,
      isOutOfBounds: false,
    };
  }, [currentAngle, selectedFunction, trigValues, angleRadians]);

  // Generate grid lines
  const gridLines = useMemo(() => {
    const config = DEFAULT_CONFIG;
    const lines: Array<{ type: 'vertical' | 'horizontal'; x1: number; y1: number; x2: number; y2: number; label?: string }> = [];

    // Format angle label for display
    const formatAngleLabel = (radians: number, unit: 'radians' | 'degrees'): string => {
      if (unit === 'degrees') {
        const degrees = (radians * 180) / PI;
        if (degrees === 0) return '0°';
        if (degrees === 90) return '90°';
        if (degrees === 180) return '180°';
        if (degrees === 270) return '270°';
        if (degrees === 360) return '360°';
        return `${Math.round(degrees)}°`;
      } else {
        if (radians === 0) return '0';
        if (Math.abs(radians - PI / 6) < 0.01) return 'π/6';
        if (Math.abs(radians - PI / 4) < 0.01) return 'π/4';
        if (Math.abs(radians - PI / 3) < 0.01) return 'π/3';
        if (Math.abs(radians - PI / 2) < 0.01) return 'π/2';
        if (Math.abs(radians - PI) < 0.01) return 'π';
        if (Math.abs(radians - (3 * PI) / 2) < 0.01) return '3π/2';
        if (Math.abs(radians - TWO_PI) < 0.01) return '2π';
        return radians.toFixed(2);
      }
    };

    // Vertical grid lines (x-axis)
    for (let x = config.xMin; x <= config.xMax; x += config.gridStep) {
      const svgX = mathXToSvgX(x, config);
      lines.push({
        type: 'vertical',
        x1: svgX,
        y1: config.padding,
        x2: svgX,
        y2: config.height - config.padding,
        label: formatAngleLabel(x, angleUnit),
      });
    }

    // Horizontal grid lines (y-axis)
    for (let y = config.yMin; y <= config.yMax; y += 0.5) {
      const svgY = mathYToSvgY(y, config);
      lines.push({
        type: 'horizontal',
        x1: config.padding,
        y1: svgY,
        x2: config.width - config.padding,
        y2: svgY,
        label: y.toString(),
      });
    }

    return lines;
  }, [angleUnit]);


  // Handle graph click/drag to set angle
  const handleGraphInteraction = useCallback(
    (event: React.MouseEvent<SVGSVGElement> | React.PointerEvent<SVGSVGElement>) => {
      if (!svgRef.current) return;

      const svg = svgRef.current;
      const rect = svg.getBoundingClientRect();
      const viewBox = svg.viewBox.baseVal;
      
      // Calculate SVG coordinates from mouse position
      const svgX = ((event.clientX - rect.left) / rect.width) * viewBox.width;

      const config = DEFAULT_CONFIG;
      
      // Convert SVG x to mathematical x (angle in radians)
      const range = config.xMax - config.xMin;
      const normalizedX = (svgX - config.padding) / (config.width - 2 * config.padding);
      const mathX = config.xMin + normalizedX * range;
      
      // Clamp to valid range
      const clampedX = Math.max(config.xMin, Math.min(config.xMax, mathX));
      
      // Create angle from the x position
      // Simply use the actual position - no special tracking needed
      const newAngle = new Angle(clampedX, 'radians');
      setAngle(newAngle);
    },
    [setAngle]
  );

  // Handle pointer down for dragging
  const handlePointerDown = useCallback(
    (event: React.PointerEvent<SVGSVGElement>) => {
      event.preventDefault();
      if (!svgRef.current) return;
      
      svgRef.current.setPointerCapture(event.pointerId);
      handleGraphInteraction(event);
      
      const handlePointerMove = (e: PointerEvent) => {
        if (svgRef.current) {
          const reactEvent = e as unknown as React.PointerEvent<SVGSVGElement>;
          handleGraphInteraction(reactEvent);
        }
      };
      
      const handlePointerUp = () => {
        if (svgRef.current) {
          svgRef.current.releasePointerCapture(event.pointerId);
        }
        document.removeEventListener('pointermove', handlePointerMove);
        document.removeEventListener('pointerup', handlePointerUp);
      };
      
      document.addEventListener('pointermove', handlePointerMove);
      document.addEventListener('pointerup', handlePointerUp);
    },
    [handleGraphInteraction]
  );

  const config = DEFAULT_CONFIG;
  const viewBox = `0 0 ${config.width} ${config.height}`;

  return (
    <div className="graph-view">
      <h2 className="graph-view__title">Function Graphs</h2>
      
      {/* Function selector tabs */}
      <div className="graph-view__tabs">
        {(['sin', 'cos', 'tan', 'cot', 'sec', 'csc'] as GraphFunction[]).map((func) => (
          <button
            key={func}
            className={`graph-view__tab ${selectedFunction === func ? 'graph-view__tab--active' : ''}`}
            onClick={() => setSelectedFunction(func)}
          >
            {func}(x)
          </button>
        ))}
      </div>

      {/* SVG graph */}
      <div className="graph-view__container">
        <svg
          ref={svgRef}
          className="graph-view__svg"
          viewBox={viewBox}
          preserveAspectRatio="xMidYMid meet"
          onPointerDown={handlePointerDown}
          onClick={handleGraphInteraction}
          style={{ cursor: 'pointer' }}
        >
          {/* Grid background */}
          <g className="graph-view__grid">
            {gridLines.map((line, index) => (
              <g key={index}>
                <line
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  className={`graph-view__grid-line graph-view__grid-line--${line.type}`}
                />
                {line.label && (
                  <text
                    x={line.type === 'vertical' ? line.x1 : config.padding - 5}
                    y={line.type === 'vertical' ? config.height - config.padding + 20 : line.y1 + 5}
                    className="graph-view__grid-label"
                    textAnchor={line.type === 'vertical' ? 'middle' : 'end'}
                  >
                    {line.label}
                  </text>
                )}
              </g>
            ))}
          </g>

          {/* Axes */}
          <g className="graph-view__axes">
            {/* X-axis */}
            <line
              x1={config.padding}
              y1={mathYToSvgY(0, config)}
              x2={config.width - config.padding}
              y2={mathYToSvgY(0, config)}
              className="graph-view__axis graph-view__axis--x"
            />
            {/* Y-axis */}
            <line
              x1={mathXToSvgX(0, config)}
              y1={config.padding}
              x2={mathXToSvgX(0, config)}
              y2={config.height - config.padding}
              className="graph-view__axis graph-view__axis--y"
            />
          </g>

          {/* Function curve(s) */}
          <g className="graph-view__function">
            {graphPaths.map((path, index) => (
              <path
                key={index}
                d={path}
                className="graph-view__function-path"
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="2"
              />
            ))}
          </g>

          {/* Current angle marker */}
          {markerPosition && !markerPosition.isOutOfBounds && (
            <g className="graph-view__marker">
              {/* Vertical line at current angle */}
              <line
                x1={markerPosition.x}
                y1={config.padding}
                x2={markerPosition.x}
                y2={config.height - config.padding}
                className="graph-view__marker-line"
                strokeDasharray="4,4"
              />
              {/* Point on curve */}
              <circle
                cx={markerPosition.x}
                cy={markerPosition.y}
                r="5"
                className="graph-view__marker-point"
                fill="var(--color-primary)"
              />
              {/* Value label */}
              <text
                x={markerPosition.x + 10}
                y={markerPosition.y - 10}
                className="graph-view__marker-label"
              >
                {markerPosition.value.toFixed(4)}
              </text>
            </g>
          )}
          
          {/* Vertical asymptote lines */}
          <g className="graph-view__asymptotes">
            {asymptotes.map((asymptoteX, index) => {
              const svgX = mathXToSvgX(asymptoteX, config);
              // Check if current angle is at this asymptote
              const isAtAsymptote = Math.abs(angleRadians - asymptoteX) < 0.01;
              return (
                <g key={index}>
                  <line
                    x1={svgX}
                    y1={config.padding}
                    x2={svgX}
                    y2={config.height - config.padding}
                    className="graph-view__asymptote-line"
                    strokeDasharray="4,4"
                  />
                  {/* Show "undefined" text only if we're at this asymptote and function is truly undefined */}
                  {isAtAsymptote && markerPosition === null && (
                    <text
                      x={svgX + 10}
                      y={config.height / 2}
                      className="graph-view__undefined-label"
                    >
                      undefined
                    </text>
                  )}
                </g>
              );
            })}
          </g>

        </svg>
      </div>
    </div>
  );
}
