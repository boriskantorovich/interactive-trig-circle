/**
 * Polar Coordinates formula visualization
 * Per milestone 14: College-level expansions
 * Per spec Section 2.3.7: Polar Coordinates
 * 
 * Polar overlay: (r, θ) ↔ (x, y) conversion
 * Shows conversion between polar (r, θ) and Cartesian (x, y) coordinates
 */

import { BaseFormulaVisualization } from '../base/FormulaVisualization';
import type { Angle } from '../../core/Angle';
import { TrigonometricValues } from '../../core/Trigonometry';
import { Point } from '../../core/Point';
import { mathToSvg } from '../../utils/coordinateUtils';
import { SVG_CENTER_X, SVG_CENTER_Y, SVG_RADIUS } from '../../constants/svgConstants';
import './PolarCoordinates.css';

/**
 * Polar Coordinates visualization
 * Shows conversion between polar (r, θ) and Cartesian (x, y) coordinates
 */
export class PolarCoordinates extends BaseFormulaVisualization {
  readonly id = 'polarCoordinates';
  readonly name = 'Polar Coordinates';
  readonly difficulty = 'college';
  readonly katexFormula = 'x = r \\cos(\\theta), \\quad y = r \\sin(\\theta)';
  readonly description =
    'Polar coordinates represent points using distance from origin (r) and angle (θ). On the unit circle, r = 1, so x = cos(θ) and y = sin(θ).';

  render(angle: Angle): JSX.Element | null {
    const trigValues = new TrigonometricValues(angle);
    const sinValue = trigValues.sin();
    const cosValue = trigValues.cos();
    
    // On unit circle, r = 1
    const r = 1;
    
    // Cartesian coordinates
    const x = cosValue; // r * cos(θ) = 1 * cos(θ)
    const y = sinValue; // r * sin(θ) = 1 * sin(θ)
    
    // Get point on unit circle
    const point = Point.fromAngle(angle);
    const pointSvg = mathToSvg(point.x, point.y);

    return (
      <div className="polar-coordinates">
        <div className="polar-coordinates__explanation">
          <p>
            Polar coordinates represent a point using:
          </p>
          <ul>
            <li><strong>r</strong> (radius): distance from origin</li>
            <li><strong>θ</strong> (theta): angle from positive x-axis</li>
          </ul>
          <p>
            On the unit circle, r = 1, so the conversion simplifies to:
          </p>
          <p className="polar-coordinates__formula-text">
            x = cos(θ) = {cosValue.toFixed(4)}
          </p>
          <p className="polar-coordinates__formula-text">
            y = sin(θ) = {sinValue.toFixed(4)}
          </p>
          <p className="polar-coordinates__values">
            <strong>Polar:</strong> (r = {r.toFixed(4)}, θ = {angle.toDegrees().toFixed(2)}°)
          </p>
          <p className="polar-coordinates__values">
            <strong>Cartesian:</strong> (x = {x.toFixed(4)}, y = {y.toFixed(4)})
          </p>
        </div>
        
        <svg
          className="polar-coordinates__visualization"
          viewBox="0 0 400 400"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Unit circle */}
          <circle
            cx={SVG_CENTER_X}
            cy={SVG_CENTER_Y}
            r={SVG_RADIUS}
            fill="none"
            stroke="var(--color-text-medium)"
            strokeWidth="1.5"
            opacity="0.3"
          />
          
          {/* Axes */}
          <line
            x1={0}
            y1={SVG_CENTER_Y}
            x2={400}
            y2={SVG_CENTER_Y}
            stroke="var(--color-text-medium)"
            strokeWidth="1"
            opacity="0.3"
          />
          <line
            x1={SVG_CENTER_X}
            y1={0}
            x2={SVG_CENTER_X}
            y2={400}
            stroke="var(--color-text-medium)"
            strokeWidth="1"
            opacity="0.3"
          />
          
          {/* Radius line (r) */}
          <line
            x1={SVG_CENTER_X}
            y1={SVG_CENTER_Y}
            x2={pointSvg.x}
            y2={pointSvg.y}
            stroke="var(--color-primary)"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
          
          {/* Angle arc */}
          <path
            d={`M ${SVG_CENTER_X} ${SVG_CENTER_Y} A ${SVG_RADIUS * 0.3} ${SVG_RADIUS * 0.3} 0 ${angle.toRadians() > Math.PI ? 1 : 0} 1 ${SVG_CENTER_X + SVG_RADIUS * 0.3 * Math.cos(angle.toRadians())} ${SVG_CENTER_Y - SVG_RADIUS * 0.3 * Math.sin(angle.toRadians())}`}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="1.5"
            opacity="0.6"
          />
          
          {/* Point on circle */}
          <circle
            cx={pointSvg.x}
            cy={pointSvg.y}
            r="5"
            fill="var(--color-primary)"
            stroke="white"
            strokeWidth="2"
          />
          
          {/* Labels */}
          {/* r label */}
          <text
            x={(SVG_CENTER_X + pointSvg.x) / 2}
            y={(SVG_CENTER_Y + pointSvg.y) / 2 - 10}
            fill="var(--color-primary)"
            fontSize="14"
            fontWeight="bold"
            textAnchor="middle"
          >
            r = 1
          </text>
          
          {/* θ label */}
          <text
            x={SVG_CENTER_X + SVG_RADIUS * 0.2 * Math.cos(angle.toRadians() / 2)}
            y={SVG_CENTER_Y - SVG_RADIUS * 0.2 * Math.sin(angle.toRadians() / 2) - 5}
            fill="var(--color-primary)"
            fontSize="14"
            fontWeight="bold"
          >
            θ
          </text>
          
          {/* x coordinate label */}
          <line
            x1={pointSvg.x}
            y1={pointSvg.y}
            x2={pointSvg.x}
            y2={SVG_CENTER_Y}
            stroke="var(--color-text-secondary)"
            strokeWidth="1.5"
            strokeDasharray="3,3"
            opacity="0.6"
          />
          <text
            x={pointSvg.x}
            y={SVG_CENTER_Y + 20}
            fill="var(--color-text-secondary)"
            fontSize="12"
            textAnchor="middle"
          >
            x = {x.toFixed(3)}
          </text>
          
          {/* y coordinate label */}
          <line
            x1={pointSvg.x}
            y1={pointSvg.y}
            x2={SVG_CENTER_X}
            y2={pointSvg.y}
            stroke="var(--color-text-secondary)"
            strokeWidth="1.5"
            strokeDasharray="3,3"
            opacity="0.6"
          />
          <text
            x={SVG_CENTER_X - 10}
            y={pointSvg.y}
            fill="var(--color-text-secondary)"
            fontSize="12"
            textAnchor="end"
            dominantBaseline="middle"
          >
            y = {y.toFixed(3)}
          </text>
        </svg>
      </div>
    );
  }
}
