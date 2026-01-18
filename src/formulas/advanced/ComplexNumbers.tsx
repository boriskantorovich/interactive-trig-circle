/**
 * Complex Numbers formula visualization
 * Per milestone 14: College-level expansions
 * Per spec Section 2.3.7: Complex Numbers
 * 
 * Euler: e^(iθ) = cos θ + i sin θ in complex plane
 */

import type { ReactElement } from 'react';
import { BaseFormulaVisualization } from '../base/FormulaVisualization';
import type { Angle } from '../../core/Angle';
import { TrigonometricValues } from '../../core/Trigonometry';
import { Point } from '../../core/Point';
import { mathToSvg } from '../../utils/coordinateUtils';
import { SVG_CENTER_X, SVG_CENTER_Y, SVG_RADIUS } from '../../constants/svgConstants';
import './ComplexNumbers.css';

/**
 * Complex Numbers visualization
 * Shows Euler's formula: e^(iθ) = cos(θ) + i·sin(θ)
 */
export class ComplexNumbers extends BaseFormulaVisualization {
  readonly id = 'complexNumbers';
  readonly name = "Euler's Formula";
  readonly difficulty = 'college';
  readonly katexFormula = 'e^{i\\theta} = \\cos(\\theta) + i\\sin(\\theta)';
  readonly description =
    "Euler's formula connects complex exponentials with trigonometric functions. On the unit circle, e^(iθ) represents a point with real part cos(θ) and imaginary part sin(θ).";

  render(angle: Angle): ReactElement | null {
    const trigValues = new TrigonometricValues(angle);
    const sinValue = trigValues.sin();
    const cosValue = trigValues.cos();
    
    // Complex number: e^(iθ) = cos(θ) + i·sin(θ)
    const realPart = cosValue; // Real part
    const imaginaryPart = sinValue; // Imaginary part
    
    // Get point on unit circle
    const point = Point.fromAngle(angle);
    const pointSvg = mathToSvg(point.x, point.y);

    return (
      <div className="complex-numbers">
        <div className="complex-numbers__explanation">
          <p>
            Euler's formula states that for any angle θ:
          </p>
          <p className="complex-numbers__formula-text">
            e<sup>iθ</sup> = cos(θ) + i·sin(θ)
          </p>
          <p>
            On the unit circle, this means:
          </p>
          <ul>
            <li><strong>Real part (x-axis):</strong> cos(θ) = {cosValue.toFixed(4)}</li>
            <li><strong>Imaginary part (y-axis):</strong> sin(θ) = {sinValue.toFixed(4)}</li>
          </ul>
          <p className="complex-numbers__values">
            <strong>Complex number:</strong> {cosValue.toFixed(4)} + {imaginaryPart >= 0 ? '' : ''}i·{sinValue.toFixed(4)}
          </p>
          <p className="complex-numbers__note">
            <em>Note: The unit circle in the complex plane represents all complex numbers with magnitude 1.</em>
          </p>
        </div>
        
        <svg
          className="complex-numbers__visualization"
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
          
          {/* Real axis (horizontal) */}
          <line
            x1={0}
            y1={SVG_CENTER_Y}
            x2={400}
            y2={SVG_CENTER_Y}
            stroke="var(--color-text-medium)"
            strokeWidth="1.5"
            opacity="0.5"
          />
          <text
            x={380}
            y={SVG_CENTER_Y - 10}
            fill="var(--color-text-medium)"
            fontSize="14"
            fontWeight="bold"
          >
            Re
          </text>
          
          {/* Imaginary axis (vertical) */}
          <line
            x1={SVG_CENTER_X}
            y1={0}
            x2={SVG_CENTER_X}
            y2={400}
            stroke="var(--color-text-medium)"
            strokeWidth="1.5"
            opacity="0.5"
          />
          <text
            x={SVG_CENTER_X + 10}
            y={20}
            fill="var(--color-text-medium)"
            fontSize="14"
            fontWeight="bold"
          >
            Im
          </text>
          
          {/* Vector from origin to point (complex number) */}
          <line
            x1={SVG_CENTER_X}
            y1={SVG_CENTER_Y}
            x2={pointSvg.x}
            y2={pointSvg.y}
            stroke="var(--color-primary)"
            strokeWidth="2.5"
            markerEnd="url(#arrowhead)"
          />
          
          {/* Arrow marker definition */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3, 0 6"
                fill="var(--color-primary)"
              />
            </marker>
          </defs>
          
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
            r="6"
            fill="var(--color-primary)"
            stroke="white"
            strokeWidth="2"
          />
          
          {/* Labels */}
          {/* θ label */}
          <text
            x={SVG_CENTER_X + SVG_RADIUS * 0.25 * Math.cos(angle.toRadians() / 2)}
            y={SVG_CENTER_Y - SVG_RADIUS * 0.25 * Math.sin(angle.toRadians() / 2) - 5}
            fill="var(--color-primary)"
            fontSize="14"
            fontWeight="bold"
          >
            θ
          </text>
          
          {/* Real part projection */}
          <line
            x1={pointSvg.x}
            y1={pointSvg.y}
            x2={pointSvg.x}
            y2={SVG_CENTER_Y}
            stroke="var(--color-text-secondary)"
            strokeWidth="1.5"
            strokeDasharray="4,4"
            opacity="0.6"
          />
          <text
            x={pointSvg.x}
            y={SVG_CENTER_Y + 20}
            fill="var(--color-text-secondary)"
            fontSize="12"
            textAnchor="middle"
          >
            Re = {realPart.toFixed(3)}
          </text>
          
          {/* Imaginary part projection */}
          <line
            x1={pointSvg.x}
            y1={pointSvg.y}
            x2={SVG_CENTER_X}
            y2={pointSvg.y}
            stroke="var(--color-text-secondary)"
            strokeWidth="1.5"
            strokeDasharray="4,4"
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
            Im = {imaginaryPart.toFixed(3)}
          </text>
          
          {/* Complex number label at point */}
          <text
            x={pointSvg.x + 15}
            y={pointSvg.y - 15}
            fill="var(--color-primary)"
            fontSize="13"
            fontWeight="bold"
          >
            e<sup>iθ</sup>
          </text>
        </svg>
      </div>
    );
  }
}
