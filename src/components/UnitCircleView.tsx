/**
 * UnitCircleView component
 * Per spec Section 4.4.1: Unit Circle Rendering
 * Per milestone 3: Unit circle static rendering
 * Per milestone 4: Click-to-set angle + snapping
 */

import { useMemo, useRef, useCallback, useEffect, useState } from 'react';
import './UnitCircleView.css';
import { useCurrentAngle, useAngleUnit, useStore } from '../state/store';
import { Point } from '../core/Point';
import { Angle, PI, TWO_PI, ANGLE_TOLERANCE } from '../core/Angle';
import { handleCircleClick } from '../interactions/ClickHandler';
import { createDragHandler } from '../interactions/DragHandler';
import { renderAngleArc } from '../visualizations/ArcRenderer';
import { renderReferenceTriangle } from '../visualizations/TriangleRenderer';
import { renderFunctionLines } from '../visualizations/FunctionLineRenderer';
import { TrigonometricValues } from '../core/Trigonometry';
import { SVG_CENTER_X, SVG_CENTER_Y, SVG_RADIUS, SVG_SIZE } from '../constants/svgConstants';
import { mathToSvg } from '../utils/coordinateUtils';

/**
 * Function visibility state type
 */
type FunctionVisibility = {
  sin: boolean;
  cos: boolean;
  tan: boolean;
  cot: boolean;
  sec: boolean;
  csc: boolean;
};

/**
 * Angle markers to display
 * Per spec Section 2.2.1: π/6, π/4, π/3, π/2, π, 3π/2, 2π
 */
const ANGLE_MARKERS = [
  { angle: Angle.ZERO, label: '0', degLabel: '0°' },
  { angle: Angle.PI_OVER_6, label: 'π/6', degLabel: '30°' },
  { angle: Angle.PI_OVER_4, label: 'π/4', degLabel: '45°' },
  { angle: Angle.PI_OVER_3, label: 'π/3', degLabel: '60°' },
  { angle: Angle.PI_OVER_2, label: 'π/2', degLabel: '90°' },
  { angle: Angle.PI, label: 'π', degLabel: '180°' },
  { angle: Angle.THREE_PI_OVER_2, label: '3π/2', degLabel: '270°' },
  { angle: Angle.TWO_PI, label: '2π', degLabel: '360°' },
];

/**
 * UnitCircleView component
 * Per spec Section 4.4.4: SVG Responsiveness
 */
export function UnitCircleView() {
  const currentAngle = useCurrentAngle();
  const angleUnit = useAngleUnit();
  const setAngle = useStore((state) => state.setAngle);
  const svgRef = useRef<SVGSVGElement>(null);
  const [wasDragging, setWasDragging] = useState(false);
  
  // Function visibility toggles - default all visible
  const [functionVisibility, setFunctionVisibility] = useState<FunctionVisibility>({
    sin: true,
    cos: true,
    tan: true,
    cot: true,
    sec: true,
    csc: true,
  });

  // Calculate current point on unit circle
  const currentPoint = useMemo(() => {
    return Point.fromAngle(currentAngle);
  }, [currentAngle]);

  // Calculate SVG coordinates for current point
  const pointSvg = useMemo(() => {
    return mathToSvg(currentPoint.x, currentPoint.y);
  }, [currentPoint]);

  // Calculate angle arc path
  const angleArc = useMemo(() => {
    return renderAngleArc(currentAngle, {
      arcRadius: 0.3,
      strokeWidth: 2,
      strokeColor: 'var(--color-primary)',
      fillColor: 'var(--color-primary)',
      opacity: 0.2,
    });
  }, [currentAngle]);

  // Calculate reference triangle
  const triangle = useMemo(() => {
    return renderReferenceTriangle(currentAngle, {
      strokeWidth: 1.5,
      strokeColor: 'var(--color-primary)',
      fillColor: 'var(--color-primary)',
      fillOpacity: 0.1,
      showLabels: true,
      labelFontSize: 12,
      labelColor: 'var(--color-text-medium)',
    });
  }, [currentAngle]);

  // Calculate trigonometric values
  const trigValues = useMemo(() => {
    return new TrigonometricValues(currentAngle);
  }, [currentAngle]);

  // Calculate function lines (geometric visualizations)
  const functionLines = useMemo(() => {
    return renderFunctionLines(currentAngle, trigValues, {
      strokeWidth: 2,
      strokeColor: 'var(--color-primary)',
      opacity: 0.7,
      undefinedOpacity: 0.3,
      showLabels: false, // Don't show labels on function lines to avoid clutter (values shown in panel)
      labelFontSize: 11,
      labelColor: 'var(--color-text-medium)',
    });
  }, [currentAngle, trigValues]);

  // Set up drag handler
  useEffect(() => {
    const svgElement = svgRef.current;
    if (!svgElement) {
      return;
    }

    let isDragging = false;

    const cleanup = createDragHandler(
      svgElement,
      (angle) => {
        if (!isDragging) {
          isDragging = true;
        }
        setWasDragging(true);
        setAngle(angle);
      },
      {
        targetFPS: 60,
        lockToCircle: true,
      }
    );

    // Reset wasDragging flag after drag ends
    const handlePointerUp = () => {
      if (isDragging) {
        // Small delay to allow click handler to check wasDragging
        setTimeout(() => {
          setWasDragging(false);
          isDragging = false;
        }, 0);
      }
    };

    svgElement.addEventListener('pointerup', handlePointerUp);

    return () => {
      cleanup();
      svgElement.removeEventListener('pointerup', handlePointerUp);
    };
  }, [setAngle]);

  // Format angle for display
  const angleDisplay = useMemo(() => {
    if (angleUnit === 'degrees') {
      return `${currentAngle.toDegrees().toFixed(2)}°`;
    }
    const rad = currentAngle.toRadians();
    // Try to show as fraction of π if possible
    if (Math.abs(rad) < ANGLE_TOLERANCE) return '0';
    if (Math.abs(rad - PI) < ANGLE_TOLERANCE) return 'π';
    if (Math.abs(rad - TWO_PI) < ANGLE_TOLERANCE) return '2π';
    if (Math.abs(rad - PI / 2) < ANGLE_TOLERANCE) return 'π/2';
    if (Math.abs(rad - (3 * PI) / 2) < ANGLE_TOLERANCE) return '3π/2';
    if (Math.abs(rad - PI / 3) < ANGLE_TOLERANCE) return 'π/3';
    if (Math.abs(rad - PI / 4) < ANGLE_TOLERANCE) return 'π/4';
    if (Math.abs(rad - PI / 6) < ANGLE_TOLERANCE) return 'π/6';
    return rad.toFixed(4);
  }, [currentAngle, angleUnit]);

  // Handle click on SVG (only if not dragging)
  const handleSvgClick = useCallback(
    (event: React.MouseEvent<SVGSVGElement>) => {
      // Don't handle click if we just finished dragging
      if (wasDragging) {
        return;
      }

      if (!svgRef.current) return;

      const angle = handleCircleClick(event.nativeEvent, svgRef.current, {
        snapToCircle: true,
        snapTolerance: 10,
      });

      if (angle !== null) {
        setAngle(angle);
      }
    },
    [setAngle, wasDragging]
  );

  return (
    <div className="unit-circle-view">
      <div className="unit-circle-view__svg-container">
        <svg
          ref={svgRef}
          viewBox={`-200 -200 ${SVG_SIZE + 400} ${SVG_SIZE + 400}`}
          preserveAspectRatio="xMidYMid meet"
          className="unit-circle-view__svg"
          onClick={handleSvgClick}
          style={{ cursor: 'pointer' }}
        >
        {/* Grid / Background */}
        <defs>
          <style>
            {`
              .unit-circle-view__axis {
                stroke: var(--color-grid);
                stroke-width: 1;
              }
              .unit-circle-view__circle {
                fill: none;
                stroke: var(--color-text-medium);
                stroke-width: 1.5;
              }
              .unit-circle-view__tick {
                stroke: var(--color-text-medium);
                stroke-width: 1;
              }
              .unit-circle-view__tick-label {
                fill: var(--color-text);
                font-family: var(--font-ui);
                font-size: 12px;
                text-anchor: middle;
              }
              .unit-circle-view__axis-label {
                fill: var(--color-text-medium);
                font-family: var(--font-ui);
                font-size: 14px;
                font-weight: 600;
              }
              .unit-circle-view__point {
                fill: var(--color-primary);
                stroke: var(--color-primary);
                stroke-width: 2;
              }
              .unit-circle-view__radius-line {
                stroke: var(--color-primary);
                stroke-width: 1.5;
                stroke-dasharray: 4, 2;
                opacity: 0.7;
              }
              .unit-circle-view__angle-arc {
                fill: var(--color-primary);
                stroke: var(--color-primary);
                stroke-width: 2;
                opacity: 0.2;
              }
              .unit-circle-view__triangle {
                fill: var(--color-primary);
                stroke: var(--color-primary);
                stroke-width: 1.5;
                opacity: 0.1;
              }
              .unit-circle-view__triangle-label {
                fill: var(--color-text-medium);
                font-family: var(--font-ui);
                font-size: 12px;
                text-anchor: middle;
              }
            `}
          </style>
        </defs>

        {/* Coordinate axes */}
        {/* X-axis */}
        <line
          x1="0"
          y1={SVG_CENTER_Y}
          x2={SVG_SIZE}
          y2={SVG_CENTER_Y}
          className="unit-circle-view__axis"
        />
        {/* Y-axis */}
        <line
          x1={SVG_CENTER_X}
          y1="0"
          x2={SVG_CENTER_X}
          y2={SVG_SIZE}
          className="unit-circle-view__axis"
        />

        {/* Axis labels - positioned to avoid overlap with angle labels */}
        <text
          x="390"
          y="190"
          className="unit-circle-view__axis-label"
        >
          x
        </text>
        <text
          x="210"
          y="10"
          className="unit-circle-view__axis-label"
        >
          y
        </text>

        {/* Unit circle outline */}
        <circle
          cx={SVG_CENTER_X}
          cy={SVG_CENTER_Y}
          r={SVG_RADIUS}
          className="unit-circle-view__circle"
        />

        {/* Angle markers (tick marks) */}
        {ANGLE_MARKERS.map((marker) => {
          const point = Point.fromAngle(marker.angle);
          const svgPoint = mathToSvg(point.x, point.y);
          const tickLength = 8; // Length of tick mark in SVG pixels
          const radians = marker.angle.toRadians();

          // Tick marks extend outward along the radius (prolongation of radius)
          // Radius direction in math: (point.x, point.y)
          // In SVG, we extend outward from the circle point
          const tickStart = svgPoint; // Start at circle point
          const tickEnd = {
            x: svgPoint.x + point.x * tickLength, // Extend along x direction
            y: svgPoint.y - point.y * tickLength, // Extend along y direction (invert for SVG)
          };

          // Label position with special handling for axis angles to avoid overlap
          const labelOffset = 25;
          let labelPos = {
            x: svgPoint.x + point.x * labelOffset,
            y: svgPoint.y - point.y * labelOffset, // Invert y for SVG
          };

          // Special positioning for labels on axes to avoid overlap
          if (Math.abs(radians) < 0.001 || Math.abs(radians - TWO_PI) < 0.001) {
            // 0 or 2π: position above x-axis
            // Use exact coordinates provided by user
            if (Math.abs(radians - TWO_PI) < 0.001) {
              labelPos = { x: 375, y: 210 };
            } else {
              labelPos = { x: 375, y: 190 };
            }
          } else if (Math.abs(radians - PI / 2) < 0.001) {
            // π/2: position to the left of y-axis (to avoid overlap with 0)
            labelPos = {
              x: svgPoint.x + point.x * labelOffset - 20, // Move left
              y: svgPoint.y - point.y * labelOffset,
            };
          } else if (Math.abs(radians - PI) < 0.001) {
            // π: position below x-axis
            labelPos = {
              x: svgPoint.x + point.x * labelOffset,
              y: svgPoint.y - point.y * labelOffset + 20, // Move down
            };
          } else if (Math.abs(radians - (3 * PI) / 2) < 0.001) {
            // 3π/2: position to the right of y-axis
            labelPos = {
              x: svgPoint.x + point.x * labelOffset + 20, // Move right
              y: svgPoint.y - point.y * labelOffset,
            };
          }

          const label = angleUnit === 'degrees' ? marker.degLabel : marker.label;

          return (
            <g key={marker.label}>
              <line
                x1={tickStart.x}
                y1={tickStart.y}
                x2={tickEnd.x}
                y2={tickEnd.y}
                className="unit-circle-view__tick"
              />
              <text
                x={labelPos.x}
                y={labelPos.y}
                className="unit-circle-view__tick-label"
                dy="0.35em"
              >
                {label}
              </text>
            </g>
          );
        })}

        {/* Dynamic elements */}
        {/* Reference triangle - shows opposite, adjacent, hypotenuse */}
        <path
          d={triangle.path}
          className="unit-circle-view__triangle"
          fill={triangle.options.fillColor}
          stroke={triangle.options.strokeColor}
          strokeWidth={triangle.options.strokeWidth}
          opacity={triangle.options.fillOpacity}
        />

        {/* Triangle labels */}
        {triangle.options.showLabels && (
          <>
            {triangle.labels.opposite && (
              <text
                x={triangle.labels.opposite.x}
                y={triangle.labels.opposite.y}
                className="unit-circle-view__triangle-label"
                fontSize={triangle.options.labelFontSize}
                fill={triangle.options.labelColor}
              >
                {triangle.labels.opposite.text}
              </text>
            )}
            {triangle.labels.adjacent && (
              <text
                x={triangle.labels.adjacent.x}
                y={triangle.labels.adjacent.y}
                className="unit-circle-view__triangle-label"
                fontSize={triangle.options.labelFontSize}
                fill={triangle.options.labelColor}
              >
                {triangle.labels.adjacent.text}
              </text>
            )}
          </>
        )}

        {/* Radius line from origin to current point */}
        <line
          x1={SVG_CENTER_X}
          y1={SVG_CENTER_Y}
          x2={pointSvg.x}
          y2={pointSvg.y}
          className="unit-circle-view__radius-line"
        />

        {/* Angle arc - visual arc showing angle from positive x-axis */}
        {/* Only show arc if angle is significant (not 0 or very close to 0) */}
        {Math.abs(currentAngle.toRadians()) > 0.001 &&
          Math.abs(currentAngle.toRadians() - TWO_PI) > 0.001 && (
            <path
              d={angleArc.d}
              className="unit-circle-view__angle-arc"
              fill={angleArc.fill}
              stroke={angleArc.stroke}
              strokeWidth={angleArc.strokeWidth}
              opacity={angleArc.opacity}
            />
          )}

        {/* Function lines - geometric visualizations for all 6 trig functions */}
        {/* Per milestone 8: Geometric visuals for all 6 functions */}
        {functionLines.sin.path && functionVisibility.sin && (
          <line
            x1={functionLines.sin.start!.x}
            y1={functionLines.sin.start!.y}
            x2={functionLines.sin.end!.x}
            y2={functionLines.sin.end!.y}
            className="unit-circle-view__function-line unit-circle-view__function-line--sin"
            stroke={functionLines.options.strokeColor}
            strokeWidth={functionLines.options.strokeWidth}
            opacity={functionLines.options.opacity}
          />
        )}
        {functionLines.cos.path && functionVisibility.cos && (
          <line
            x1={functionLines.cos.start!.x}
            y1={functionLines.cos.start!.y}
            x2={functionLines.cos.end!.x}
            y2={functionLines.cos.end!.y}
            className="unit-circle-view__function-line unit-circle-view__function-line--cos"
            stroke={functionLines.options.strokeColor}
            strokeWidth={functionLines.options.strokeWidth}
            opacity={functionLines.options.opacity}
          />
        )}
        {functionLines.tan.path && functionVisibility.tan && (
          <line
            x1={functionLines.tan.start!.x}
            y1={functionLines.tan.start!.y}
            x2={functionLines.tan.end!.x}
            y2={functionLines.tan.end!.y}
            className={`unit-circle-view__function-line unit-circle-view__function-line--tan ${
              functionLines.tan.isUndefined ? 'unit-circle-view__function-line--undefined' : ''
            }`}
            stroke={functionLines.options.strokeColor}
            strokeWidth={functionLines.options.strokeWidth}
            opacity={functionLines.tan.isUndefined ? functionLines.options.undefinedOpacity : functionLines.options.opacity}
            strokeDasharray={functionLines.tan.isUndefined ? '4,2' : undefined}
          />
        )}
        {functionLines.cot.path && functionVisibility.cot && (
          <line
            x1={functionLines.cot.start!.x}
            y1={functionLines.cot.start!.y}
            x2={functionLines.cot.end!.x}
            y2={functionLines.cot.end!.y}
            className={`unit-circle-view__function-line unit-circle-view__function-line--cot ${
              functionLines.cot.isUndefined ? 'unit-circle-view__function-line--undefined' : ''
            }`}
            stroke={functionLines.options.strokeColor}
            strokeWidth={functionLines.options.strokeWidth}
            opacity={functionLines.cot.isUndefined ? functionLines.options.undefinedOpacity : functionLines.options.opacity}
            strokeDasharray={functionLines.cot.isUndefined ? '4,2' : undefined}
          />
        )}
        {functionLines.sec.path && functionVisibility.sec && (
          <line
            x1={functionLines.sec.start!.x}
            y1={functionLines.sec.start!.y}
            x2={functionLines.sec.end!.x}
            y2={functionLines.sec.end!.y}
            className={`unit-circle-view__function-line unit-circle-view__function-line--sec ${
              functionLines.sec.isUndefined ? 'unit-circle-view__function-line--undefined' : ''
            }`}
            stroke={functionLines.options.strokeColor}
            strokeWidth={functionLines.options.strokeWidth}
            opacity={functionLines.sec.isUndefined ? functionLines.options.undefinedOpacity : functionLines.options.opacity}
            strokeDasharray={functionLines.sec.isUndefined ? '4,2' : undefined}
          />
        )}
        {functionLines.csc.path && functionVisibility.csc && (
          <line
            x1={functionLines.csc.start!.x}
            y1={functionLines.csc.start!.y}
            x2={functionLines.csc.end!.x}
            y2={functionLines.csc.end!.y}
            className={`unit-circle-view__function-line unit-circle-view__function-line--csc ${
              functionLines.csc.isUndefined ? 'unit-circle-view__function-line--undefined' : ''
            }`}
            stroke={functionLines.options.strokeColor}
            strokeWidth={functionLines.options.strokeWidth}
            opacity={functionLines.csc.isUndefined ? functionLines.options.undefinedOpacity : functionLines.options.opacity}
            strokeDasharray={functionLines.csc.isUndefined ? '4,2' : undefined}
          />
        )}

        {/* Current point on circle */}
        <circle
          cx={pointSvg.x}
          cy={pointSvg.y}
          r="5"
          className="unit-circle-view__point"
        />
        </svg>
      </div>

      {/* Function visibility controls and legend */}
      <div className="unit-circle-view__function-controls">
        <div className="unit-circle-view__legend">
          <h3 className="unit-circle-view__legend-title">Function Lines</h3>
          <div className="unit-circle-view__legend-items">
            {(['sin', 'cos', 'tan', 'cot', 'sec', 'csc'] as const).map((func) => (
              <label key={func} className="unit-circle-view__legend-item">
                <input
                  type="checkbox"
                  checked={functionVisibility[func]}
                  onChange={(e) =>
                    setFunctionVisibility((prev) => ({
                      ...prev,
                      [func]: e.target.checked,
                    }))
                  }
                  className="unit-circle-view__legend-checkbox"
                />
                <span
                  className={`unit-circle-view__legend-color unit-circle-view__legend-color--${func}`}
                />
                <span className="unit-circle-view__legend-label">{func}(θ)</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Readouts: angle and coordinates */}
      <div className="unit-circle-view__readouts">
        <div className="unit-circle-view__readout">
          <span className="unit-circle-view__readout-label">Angle:</span>
          <span className="unit-circle-view__readout-value">
            {angleDisplay} {angleUnit === 'degrees' ? '' : 'rad'}
          </span>
          {angleUnit === 'degrees' && (
            <span className="unit-circle-view__readout-secondary">
              ({currentAngle.toRadians().toFixed(4)} rad)
            </span>
          )}
          {angleUnit === 'radians' && (
            <span className="unit-circle-view__readout-secondary">
              ({currentAngle.toDegrees().toFixed(2)}°)
            </span>
          )}
        </div>
        <div className="unit-circle-view__readout">
          <span className="unit-circle-view__readout-label">Coordinates:</span>
          <span className="unit-circle-view__readout-value">
            ({currentPoint.x.toFixed(4)}, {currentPoint.y.toFixed(4)})
          </span>
        </div>
      </div>
    </div>
  );
}
