/**
 * Half Angle Formulas visualization
 * Per milestone 13: Half-angle with quadrant sign logic visualised
 * Per spec Section 2.3.4: Half Angle Formulas
 * 
 * Formulas:
 * - sin(θ/2) = ±√[(1 - cos(θ))/2]
 * - cos(θ/2) = ±√[(1 + cos(θ))/2]
 * 
 * The sign depends on which quadrant θ/2 is in.
 */

import type { ReactElement } from 'react';
import { BaseFormulaVisualization } from '../base/FormulaVisualization';
import { Angle, type Angle as AngleType } from '../../core/Angle';
import { TrigonometricValues } from '../../core/Trigonometry';
import { Point } from '../../core/Point';
import { mathToSvg } from '../../utils/coordinateUtils';
import { SVG_CENTER_X, SVG_CENTER_Y, SVG_RADIUS, SVG_SIZE } from '../../constants/svgConstants';
import './HalfAngle.css';

/**
 * Half Angle Formulas visualization
 * Shows θ/2 with quadrant sign logic
 */
export class HalfAngle extends BaseFormulaVisualization {
  readonly id = 'halfAngle';
  readonly name = 'Half Angle Formulas';
  readonly difficulty = 'highSchool';
  readonly katexFormula = '\\sin\\left(\\frac{\\theta}{2}\\right) = \\pm\\sqrt{\\frac{1 - \\cos(\\theta)}{2}} \\\\ \\cos\\left(\\frac{\\theta}{2}\\right) = \\pm\\sqrt{\\frac{1 + \\cos(\\theta)}{2}}';
  readonly description =
    'The half angle formulas show how to calculate trigonometric functions of half an angle. The sign (±) depends on which quadrant the half angle is in.';

  render(angle: AngleType): ReactElement | null {
    const trigValues = new TrigonometricValues(angle);
    const cosTheta = trigValues.cos();

    // Calculate θ/2
    const angleHalf = new Angle(angle.toRadians() / 2, 'radians');
    const trigHalf = new TrigonometricValues(angleHalf);
    const sinHalf = trigHalf.sin();
    const cosHalf = trigHalf.cos();

    // Calculate using formulas (with sign determination)
    const sinFormulaValue = Math.sqrt((1 - cosTheta) / 2);
    const cosFormulaValue = Math.sqrt((1 + cosTheta) / 2);

    // Determine signs based on quadrant of θ/2
    const halfRadians = angleHalf.toRadians();
    const sinSign = sinHalf >= 0 ? '+' : '-';
    const cosSign = cosHalf >= 0 ? '+' : '-';

    const sinFormula = sinSign === '+' ? sinFormulaValue : -sinFormulaValue;
    const cosFormula = cosSign === '+' ? cosFormulaValue : -cosFormulaValue;

    // Determine quadrant of θ/2
    const quadrant = getQuadrant(halfRadians);

    // Get points on unit circle
    const pointTheta = Point.fromAngle(angle);
    const pointHalf = Point.fromAngle(angleHalf);
    
    const pointThetaSvg = mathToSvg(pointTheta.x, pointTheta.y);
    const pointHalfSvg = mathToSvg(pointHalf.x, pointHalf.y);

    return (
      <div className="half-angle">
        <div className="half-angle__explanation">
          <p>
            The half angle formulas show how to calculate trigonometric functions of θ/2
            (half of the current angle of {angle.toDegrees().toFixed(1)}°):
          </p>
          <p className="half-angle__quadrant-info">
            <strong>Quadrant of θ/2 ({angleHalf.toDegrees().toFixed(1)}°):</strong> {quadrant.name}
            <br />
            In this quadrant: sin is {quadrant.sinSign}, cos is {quadrant.cosSign}
          </p>
        </div>

        <div className="half-angle__formulas">
          <div className="half-angle__formula-card">
            <h3>sin(θ/2) Formula</h3>
            <p className="half-angle__formula-text">
              sin(θ/2) = {sinSign}√[(1 - cos(θ))/2]
            </p>
            <p className="half-angle__calculation">
              sin({angle.toDegrees().toFixed(1)}°/2) = {sinSign}√[(1 - {cosTheta.toFixed(4)})/2]
            </p>
            <p className="half-angle__calculation">
              = {sinSign}√[{(1 - cosTheta).toFixed(6)}/2] = {sinSign}√[{((1 - cosTheta) / 2).toFixed(6)}] = {sinFormula.toFixed(6)}
            </p>
            <p className="half-angle__verification">
              Direct calculation: sin({angleHalf.toDegrees().toFixed(1)}°) = {sinHalf.toFixed(6)} ✓
            </p>
          </div>

          <div className="half-angle__formula-card">
            <h3>cos(θ/2) Formula</h3>
            <p className="half-angle__formula-text">
              cos(θ/2) = {cosSign}√[(1 + cos(θ))/2]
            </p>
            <p className="half-angle__calculation">
              cos({angle.toDegrees().toFixed(1)}°/2) = {cosSign}√[(1 + {cosTheta.toFixed(4)})/2]
            </p>
            <p className="half-angle__calculation">
              = {cosSign}√[{(1 + cosTheta).toFixed(6)}/2] = {cosSign}√[{((1 + cosTheta) / 2).toFixed(6)}] = {cosFormula.toFixed(6)}
            </p>
            <p className="half-angle__verification">
              Direct calculation: cos({angleHalf.toDegrees().toFixed(1)}°) = {cosHalf.toFixed(6)} ✓
            </p>
          </div>
        </div>

        <div className="half-angle__visualization">
          <div className="half-angle__circle-container">
            <h4>Angle θ = {angle.toDegrees().toFixed(1)}°</h4>
            <svg
              viewBox="0 0 400 400"
              preserveAspectRatio="xMidYMid meet"
              className="half-angle__svg"
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
            </svg>
          </div>

          <div className="half-angle__circle-container">
            <h4>Angle θ/2 = {angleHalf.toDegrees().toFixed(1)}° ({quadrant.name})</h4>
            <svg
              viewBox="0 0 400 400"
              preserveAspectRatio="xMidYMid meet"
              className="half-angle__svg"
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

              {/* Quadrant labels */}
              <text
                x={SVG_CENTER_X + 10}
                y={SVG_CENTER_Y - 10}
                fontSize="11"
                fill="#808080"
                fontWeight="bold"
              >
                I: +,+
              </text>
              <text
                x={SVG_CENTER_X - 50}
                y={SVG_CENTER_Y - 10}
                fontSize="11"
                fill="#808080"
                fontWeight="bold"
              >
                II: -,+
              </text>
              <text
                x={SVG_CENTER_X - 50}
                y={SVG_CENTER_Y + 20}
                fontSize="11"
                fill="#808080"
                fontWeight="bold"
              >
                III: -,-
              </text>
              <text
                x={SVG_CENTER_X + 10}
                y={SVG_CENTER_Y + 20}
                fontSize="11"
                fill="#808080"
                fontWeight="bold"
              >
                IV: +,-
              </text>

              {/* Highlight current quadrant */}
              <rect
                x={quadrant.svgBounds.x}
                y={quadrant.svgBounds.y}
                width={quadrant.svgBounds.width}
                height={quadrant.svgBounds.height}
                fill={quadrant.color}
                fillOpacity="0.1"
                stroke={quadrant.color}
                strokeWidth="2"
                strokeDasharray="4,2"
              />

              {/* Radius line for θ/2 */}
              <line
                x1={SVG_CENTER_X}
                y1={SVG_CENTER_Y}
                x2={pointHalfSvg.x}
                y2={pointHalfSvg.y}
                stroke="#cc0000"
                strokeWidth="2"
              />
              <circle cx={pointHalfSvg.x} cy={pointHalfSvg.y} r="5" fill="#cc0000" />

              {/* Arc for θ/2 */}
              <path
                d={`M ${SVG_CENTER_X + SVG_RADIUS * 0.3} ${SVG_CENTER_Y} A ${SVG_RADIUS * 0.3} ${SVG_RADIUS * 0.3} 0 ${angleHalf.toRadians() > Math.PI ? 1 : 0} 0 ${SVG_CENTER_X + SVG_RADIUS * 0.3 * Math.cos(angleHalf.toRadians())} ${SVG_CENTER_Y - SVG_RADIUS * 0.3 * Math.sin(angleHalf.toRadians())}`}
                fill="none"
                stroke="#cc0000"
                strokeWidth="2"
              />

              {/* Labels */}
              <text
                x={pointHalfSvg.x + 10}
                y={pointHalfSvg.y - 10}
                fontSize="14"
                fill="#cc0000"
                fontWeight="bold"
              >
                θ/2
              </text>
              <text
                x={SVG_CENTER_X + 20}
                y={SVG_CENTER_Y - 20}
                fontSize="12"
                fill="#1a1a1a"
              >
                sin(θ/2) = {sinHalf.toFixed(4)} ({sinSign})
              </text>
              <text
                x={SVG_CENTER_X + 20}
                y={SVG_CENTER_Y - 5}
                fontSize="12"
                fill="#1a1a1a"
              >
                cos(θ/2) = {cosHalf.toFixed(4)} ({cosSign})
              </text>
            </svg>
          </div>
        </div>
      </div>
    );
  }
}

/**
 * Get quadrant information for an angle
 */
function getQuadrant(radians: number): {
  name: string;
  sinSign: string;
  cosSign: string;
  color: string;
  svgBounds: { x: number; y: number; width: number; height: number };
} {
  // Normalize to [0, 2π)
  const normalized = radians < 0 ? radians + 2 * Math.PI : radians;
  
  if (normalized >= 0 && normalized < Math.PI / 2) {
    return {
      name: 'Quadrant I',
      sinSign: '+',
      cosSign: '+',
      color: '#006600',
      svgBounds: { x: SVG_CENTER_X, y: 0, width: SVG_SIZE - SVG_CENTER_X, height: SVG_CENTER_Y },
    };
  } else if (normalized >= Math.PI / 2 && normalized < Math.PI) {
    return {
      name: 'Quadrant II',
      sinSign: '+',
      cosSign: '-',
      color: '#cc0000',
      svgBounds: { x: 0, y: 0, width: SVG_CENTER_X, height: SVG_CENTER_Y },
    };
  } else if (normalized >= Math.PI && normalized < (3 * Math.PI) / 2) {
    return {
      name: 'Quadrant III',
      sinSign: '-',
      cosSign: '-',
      color: '#cc0000',
      svgBounds: { x: 0, y: SVG_CENTER_Y, width: SVG_CENTER_X, height: SVG_SIZE - SVG_CENTER_Y },
    };
  } else {
    return {
      name: 'Quadrant IV',
      sinSign: '-',
      cosSign: '+',
      color: '#0066cc',
      svgBounds: { x: SVG_CENTER_X, y: SVG_CENTER_Y, width: SVG_SIZE - SVG_CENTER_X, height: SVG_SIZE - SVG_CENTER_Y },
    };
  }
}
