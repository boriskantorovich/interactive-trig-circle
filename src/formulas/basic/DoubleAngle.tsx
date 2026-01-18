/**
 * Double Angle Formulas visualization
 * Per milestone 13: Double-angle: θ vs 2θ side-by-side
 * Per spec Section 2.3.3: Double Angle Formulas
 * 
 * Formulas:
 * - sin(2θ) = 2sin(θ)cos(θ)
 * - cos(2θ) = cos²(θ) - sin²(θ)
 */

import type { ReactElement } from 'react';
import { BaseFormulaVisualization } from '../base/FormulaVisualization';
import { Angle, type Angle as AngleType } from '../../core/Angle';
import { TrigonometricValues } from '../../core/Trigonometry';
import { Point } from '../../core/Point';
import { mathToSvg } from '../../utils/coordinateUtils';
import { SVG_CENTER_X, SVG_CENTER_Y, SVG_RADIUS } from '../../constants/svgConstants';
import './DoubleAngle.css';

/**
 * Double Angle Formulas visualization
 * Shows θ vs 2θ side-by-side with formula verification
 */
export class DoubleAngle extends BaseFormulaVisualization {
  readonly id = 'doubleAngle';
  readonly name = 'Double Angle Formulas';
  readonly difficulty = 'highSchool';
  readonly katexFormula = '\\sin(2\\theta) = 2\\sin(\\theta)\\cos(\\theta) \\\\ \\cos(2\\theta) = \\cos^2(\\theta) - \\sin^2(\\theta)';
  readonly description =
    'The double angle formulas show how to calculate trigonometric functions of twice an angle. These formulas are useful for simplifying expressions and solving equations.';

  render(angle: AngleType): ReactElement | null {
    const trigValues = new TrigonometricValues(angle);
    const sinTheta = trigValues.sin();
    const cosTheta = trigValues.cos();

    // Calculate 2θ
    const angleDouble = new Angle(angle.toRadians() * 2, 'radians');
    const trigDouble = new TrigonometricValues(angleDouble);
    const sinDouble = trigDouble.sin();
    const cosDouble = trigDouble.cos();

    // Calculate using formulas
    const sinFormula = 2 * sinTheta * cosTheta;
    const cosFormula = cosTheta * cosTheta - sinTheta * sinTheta;

    // Get points on unit circle
    const pointTheta = Point.fromAngle(angle);
    const pointDouble = Point.fromAngle(angleDouble);
    
    const pointThetaSvg = mathToSvg(pointTheta.x, pointTheta.y);
    const pointDoubleSvg = mathToSvg(pointDouble.x, pointDouble.y);

    return (
      <div className="double-angle">
        <div className="double-angle__explanation">
          <p>
            The double angle formulas show how to calculate trigonometric functions of 2θ
            (twice the current angle of {angle.toDegrees().toFixed(1)}°):
          </p>
        </div>

        <div className="double-angle__formulas">
          <div className="double-angle__formula-card">
            <h3>sin(2θ) Formula</h3>
            <p className="double-angle__formula-text">
              sin(2θ) = 2sin(θ)cos(θ)
            </p>
            <p className="double-angle__calculation">
              sin(2 × {angle.toDegrees().toFixed(1)}°) = 2 × sin({angle.toDegrees().toFixed(1)}°) × cos({angle.toDegrees().toFixed(1)}°)
            </p>
            <p className="double-angle__calculation">
              = 2 × {sinTheta.toFixed(4)} × {cosTheta.toFixed(4)} = {sinFormula.toFixed(6)}
            </p>
            <p className="double-angle__verification">
              Direct calculation: sin({angleDouble.toDegrees().toFixed(1)}°) = {sinDouble.toFixed(6)} ✓
            </p>
          </div>

          <div className="double-angle__formula-card">
            <h3>cos(2θ) Formula</h3>
            <p className="double-angle__formula-text">
              cos(2θ) = cos²(θ) - sin²(θ)
            </p>
            <p className="double-angle__calculation">
              cos(2 × {angle.toDegrees().toFixed(1)}°) = cos²({angle.toDegrees().toFixed(1)}°) - sin²({angle.toDegrees().toFixed(1)}°)
            </p>
            <p className="double-angle__calculation">
              = {cosTheta.toFixed(4)}² - {sinTheta.toFixed(4)}² = {(cosTheta * cosTheta).toFixed(6)} - {(sinTheta * sinTheta).toFixed(6)} = {cosFormula.toFixed(6)}
            </p>
            <p className="double-angle__verification">
              Direct calculation: cos({angleDouble.toDegrees().toFixed(1)}°) = {cosDouble.toFixed(6)} ✓
            </p>
          </div>
        </div>

        <div className="double-angle__visualization">
          <div className="double-angle__circle-container">
            <h4>Angle θ = {angle.toDegrees().toFixed(1)}°</h4>
            <svg
              viewBox="0 0 400 400"
              preserveAspectRatio="xMidYMid meet"
              className="double-angle__svg"
            >
              {/* Unit circle outline */}
              <circle
                cx={SVG_CENTER_X}
                cy={SVG_CENTER_Y}
                r={SVG_RADIUS}
                fill="none"
                stroke="#e0e0e0"
                strokeWidth="1"
              />

              {/* Coordinate axes */}
              <line
                x1={0}
                y1={SVG_CENTER_Y}
                x2={400}
                y2={SVG_CENTER_Y}
                stroke="#d0d0d0"
                strokeWidth="1"
              />
              <line
                x1={SVG_CENTER_X}
                y1={0}
                x2={SVG_CENTER_X}
                y2={400}
                stroke="#d0d0d0"
                strokeWidth="1"
              />

              {/* Radius line for θ */}
              <line
                x1={SVG_CENTER_X}
                y1={SVG_CENTER_Y}
                x2={pointThetaSvg.x}
                y2={pointThetaSvg.y}
                stroke="#0066cc"
                strokeWidth="2"
              />
              <circle cx={pointThetaSvg.x} cy={pointThetaSvg.y} r="5" fill="#0066cc" />

              {/* Arc for θ */}
              <path
                d={`M ${SVG_CENTER_X + SVG_RADIUS * 0.3} ${SVG_CENTER_Y} A ${SVG_RADIUS * 0.3} ${SVG_RADIUS * 0.3} 0 ${angle.toRadians() > Math.PI ? 1 : 0} 0 ${SVG_CENTER_X + SVG_RADIUS * 0.3 * Math.cos(angle.toRadians())} ${SVG_CENTER_Y - SVG_RADIUS * 0.3 * Math.sin(angle.toRadians())}`}
                fill="none"
                stroke="#0066cc"
                strokeWidth="2"
              />

              {/* Labels */}
              <text
                x={pointThetaSvg.x + 10}
                y={pointThetaSvg.y - 10}
                fontSize="14"
                fill="#0066cc"
                fontWeight="bold"
              >
                θ
              </text>
              <text
                x={SVG_CENTER_X + 20}
                y={SVG_CENTER_Y - 20}
                fontSize="12"
                fill="#1a1a1a"
              >
                sin(θ) = {sinTheta.toFixed(4)}
              </text>
              <text
                x={SVG_CENTER_X + 20}
                y={SVG_CENTER_Y - 5}
                fontSize="12"
                fill="#1a1a1a"
              >
                cos(θ) = {cosTheta.toFixed(4)}
              </text>
            </svg>
          </div>

          <div className="double-angle__circle-container">
            <h4>Angle 2θ = {angleDouble.toDegrees().toFixed(1)}°</h4>
            <svg
              viewBox="0 0 400 400"
              preserveAspectRatio="xMidYMid meet"
              className="double-angle__svg"
            >
              {/* Unit circle outline */}
              <circle
                cx={SVG_CENTER_X}
                cy={SVG_CENTER_Y}
                r={SVG_RADIUS}
                fill="none"
                stroke="#e0e0e0"
                strokeWidth="1"
              />

              {/* Coordinate axes */}
              <line
                x1={0}
                y1={SVG_CENTER_Y}
                x2={400}
                y2={SVG_CENTER_Y}
                stroke="#d0d0d0"
                strokeWidth="1"
              />
              <line
                x1={SVG_CENTER_X}
                y1={0}
                x2={SVG_CENTER_X}
                y2={400}
                stroke="#d0d0d0"
                strokeWidth="1"
              />

              {/* Radius line for 2θ */}
              <line
                x1={SVG_CENTER_X}
                y1={SVG_CENTER_Y}
                x2={pointDoubleSvg.x}
                y2={pointDoubleSvg.y}
                stroke="#cc0000"
                strokeWidth="2"
              />
              <circle cx={pointDoubleSvg.x} cy={pointDoubleSvg.y} r="5" fill="#cc0000" />

              {/* Arc for 2θ */}
              <path
                d={`M ${SVG_CENTER_X + SVG_RADIUS * 0.3} ${SVG_CENTER_Y} A ${SVG_RADIUS * 0.3} ${SVG_RADIUS * 0.3} 0 ${angleDouble.toRadians() > Math.PI ? 1 : 0} 0 ${SVG_CENTER_X + SVG_RADIUS * 0.3 * Math.cos(angleDouble.toRadians())} ${SVG_CENTER_Y - SVG_RADIUS * 0.3 * Math.sin(angleDouble.toRadians())}`}
                fill="none"
                stroke="#cc0000"
                strokeWidth="2"
              />

              {/* Labels */}
              <text
                x={pointDoubleSvg.x + 10}
                y={pointDoubleSvg.y - 10}
                fontSize="14"
                fill="#cc0000"
                fontWeight="bold"
              >
                2θ
              </text>
              <text
                x={SVG_CENTER_X + 20}
                y={SVG_CENTER_Y - 20}
                fontSize="12"
                fill="#1a1a1a"
              >
                sin(2θ) = {sinDouble.toFixed(4)}
              </text>
              <text
                x={SVG_CENTER_X + 20}
                y={SVG_CENTER_Y - 5}
                fontSize="12"
                fill="#1a1a1a"
              >
                cos(2θ) = {cosDouble.toFixed(4)}
              </text>
            </svg>
          </div>
        </div>
      </div>
    );
  }
}
