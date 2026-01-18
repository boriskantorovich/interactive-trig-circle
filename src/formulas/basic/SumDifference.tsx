/**
 * Sum and Difference Formulas visualization
 * Per milestone 13: Sum/difference formulas with interactive A and B
 * Per spec Section 2.3.2: Sum and Difference Formulas
 * 
 * Formulas:
 * - sin(A ± B) = sin(A)cos(B) ± cos(A)sin(B)
 * - cos(A ± B) = cos(A)cos(B) ∓ sin(A)sin(B)
 */

import { useState } from 'react';
import type { ReactElement } from 'react';
import { BaseFormulaVisualization } from '../base/FormulaVisualization';
import { Angle, type Angle as AngleType } from '../../core/Angle';
import { TrigonometricValues } from '../../core/Trigonometry';
import { Point } from '../../core/Point';
import { mathToSvg } from '../../utils/coordinateUtils';
import { SVG_CENTER_X, SVG_CENTER_Y, SVG_RADIUS } from '../../constants/svgConstants';
import './SumDifference.css';

/**
 * Sum and Difference Formulas visualization
 * Shows interactive A and B angles with sum/difference calculations
 */
export class SumDifference extends BaseFormulaVisualization {
  readonly id = 'sumDifference';
  readonly name = 'Sum and Difference Formulas';
  readonly difficulty = 'highSchool';
  readonly katexFormula = '\\sin(A \\pm B) = \\sin(A)\\cos(B) \\pm \\cos(A)\\sin(B) \\\\ \\cos(A \\pm B) = \\cos(A)\\cos(B) \\mp \\sin(A)\\sin(B)';
  readonly description =
    'The sum and difference formulas show how to calculate trigonometric functions of the sum or difference of two angles. These formulas are fundamental for understanding angle addition and subtraction.';

  render(angle: AngleType): ReactElement | null {
    return <SumDifferenceVisualization currentAngle={angle} />;
  }
}

/**
 * SumDifferenceVisualization component
 * Manages local state for angles A and B
 */
export function SumDifferenceVisualization({ currentAngle }: { currentAngle: AngleType }) {
  // Use currentAngle as default for A, and a fixed offset for B
  const [angleA, setAngleA] = useState<AngleType>(currentAngle);
  const [angleB, setAngleB] = useState<AngleType>(Angle.PI_OVER_6); // Default to 30°
  const [operation, setOperation] = useState<'sum' | 'difference'>('sum');

  // Update angleA when currentAngle changes (user can control A via main circle)
  // But only if user hasn't manually set A
  const [angleALocked, setAngleALocked] = useState(false);
  
  if (!angleALocked && !angleA.equals(currentAngle)) {
    setAngleA(currentAngle);
  }

  // Calculate values for A and B
  const trigA = new TrigonometricValues(angleA);
  const trigB = new TrigonometricValues(angleB);
  
  const sinA = trigA.sin();
  const cosA = trigA.cos();
  const sinB = trigB.sin();
  const cosB = trigB.cos();

  // Calculate sum/difference
  const angleSum = operation === 'sum' 
    ? new Angle(angleA.toRadians() + angleB.toRadians(), 'radians')
    : new Angle(angleA.toRadians() - angleB.toRadians(), 'radians');
  
  const trigSum = new TrigonometricValues(angleSum);
  const sinSum = trigSum.sin();
  const cosSum = trigSum.cos();

  // Calculate using formulas
  const sinFormula = operation === 'sum'
    ? sinA * cosB + cosA * sinB
    : sinA * cosB - cosA * sinB;
  const cosFormula = operation === 'sum'
    ? cosA * cosB - sinA * sinB
    : cosA * cosB + sinA * sinB;

  // Get points on unit circle
  const pointA = Point.fromAngle(angleA);
  const pointB = Point.fromAngle(angleB);
  const pointSum = Point.fromAngle(angleSum);
  
  const pointASvg = mathToSvg(pointA.x, pointA.y);
  const pointBSvg = mathToSvg(pointB.x, pointB.y);
  const pointSumSvg = mathToSvg(pointSum.x, pointSum.y);

  return (
    <div className="sum-difference">
      <div className="sum-difference__controls">
        <div className="sum-difference__angle-control">
          <label htmlFor="angle-a">Angle A:</label>
          <input
            id="angle-a"
            type="range"
            min="0"
            max="360"
            value={angleA.toDegrees()}
            onChange={(e) => {
              const deg = parseFloat(e.target.value);
              setAngleA(new Angle(deg, 'degrees'));
              setAngleALocked(true);
            }}
          />
          <span>{angleA.toDegrees().toFixed(1)}° ({angleA.toRadians().toFixed(3)} rad)</span>
        </div>
        <div className="sum-difference__angle-control">
          <label htmlFor="angle-b">Angle B:</label>
          <input
            id="angle-b"
            type="range"
            min="0"
            max="360"
            value={angleB.toDegrees()}
            onChange={(e) => {
              const deg = parseFloat(e.target.value);
              setAngleB(new Angle(deg, 'degrees'));
            }}
          />
          <span>{angleB.toDegrees().toFixed(1)}° ({angleB.toRadians().toFixed(3)} rad)</span>
        </div>
        <div className="sum-difference__operation-control">
          <label>
            <input
              type="radio"
              name="operation"
              value="sum"
              checked={operation === 'sum'}
              onChange={() => setOperation('sum')}
            />
            Sum (A + B)
          </label>
          <label>
            <input
              type="radio"
              name="operation"
              value="difference"
              checked={operation === 'difference'}
              onChange={() => setOperation('difference')}
            />
            Difference (A - B)
          </label>
        </div>
        <button
          className="sum-difference__sync-button"
          onClick={() => {
            setAngleALocked(false);
            setAngleA(currentAngle);
          }}
        >
          Sync A with main angle
        </button>
      </div>

      <div className="sum-difference__explanation">
        <p>
          The {operation === 'sum' ? 'sum' : 'difference'} formulas show how to calculate trigonometric functions
          of {angleA.toDegrees().toFixed(1)}° {operation === 'sum' ? '+' : '-'} {angleB.toDegrees().toFixed(1)}°:
        </p>
        <div className="sum-difference__formula-display">
          <p>
            <strong>sin({angleA.toDegrees().toFixed(1)}° {operation === 'sum' ? '+' : '-'} {angleB.toDegrees().toFixed(1)}°)</strong> = 
            sin({angleA.toDegrees().toFixed(1)}°)cos({angleB.toDegrees().toFixed(1)}°) {operation === 'sum' ? '+' : '-'} 
            cos({angleA.toDegrees().toFixed(1)}°)sin({angleB.toDegrees().toFixed(1)}°)
          </p>
          <p className="sum-difference__calculation">
            = {sinA.toFixed(4)} × {cosB.toFixed(4)} {operation === 'sum' ? '+' : '-'} {cosA.toFixed(4)} × {sinB.toFixed(4)} = {sinFormula.toFixed(6)}
          </p>
          <p className="sum-difference__verification">
            Direct calculation: sin({angleSum.toDegrees().toFixed(1)}°) = {sinSum.toFixed(6)} ✓
          </p>
        </div>
        <div className="sum-difference__formula-display">
          <p>
            <strong>cos({angleA.toDegrees().toFixed(1)}° {operation === 'sum' ? '+' : '-'} {angleB.toDegrees().toFixed(1)}°)</strong> = 
            cos({angleA.toDegrees().toFixed(1)}°)cos({angleB.toDegrees().toFixed(1)}°) {operation === 'sum' ? '∓' : '±'} 
            sin({angleA.toDegrees().toFixed(1)}°)sin({angleB.toDegrees().toFixed(1)}°)
          </p>
          <p className="sum-difference__calculation">
            = {cosA.toFixed(4)} × {cosB.toFixed(4)} {operation === 'sum' ? '-' : '+'} {sinA.toFixed(4)} × {sinB.toFixed(4)} = {cosFormula.toFixed(6)}
          </p>
          <p className="sum-difference__verification">
            Direct calculation: cos({angleSum.toDegrees().toFixed(1)}°) = {cosSum.toFixed(6)} ✓
          </p>
        </div>
      </div>

      <div className="sum-difference__visualization">
        <svg
          viewBox="0 0 400 400"
          preserveAspectRatio="xMidYMid meet"
          className="sum-difference__svg"
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

          {/* Angle A (blue) */}
          <line
            x1={SVG_CENTER_X}
            y1={SVG_CENTER_Y}
            x2={pointASvg.x}
            y2={pointASvg.y}
            stroke="#0066cc"
            strokeWidth="2"
          />
          <circle cx={pointASvg.x} cy={pointASvg.y} r="5" fill="#0066cc" />
          <text
            x={pointASvg.x + 10}
            y={pointASvg.y - 10}
            fontSize="12"
            fill="#0066cc"
            fontWeight="bold"
          >
            A
          </text>

          {/* Angle B (green) */}
          <line
            x1={SVG_CENTER_X}
            y1={SVG_CENTER_Y}
            x2={pointBSvg.x}
            y2={pointBSvg.y}
            stroke="#006600"
            strokeWidth="2"
            strokeDasharray="3,2"
          />
          <circle cx={pointBSvg.x} cy={pointBSvg.y} r="5" fill="#006600" />
          <text
            x={pointBSvg.x + 10}
            y={pointBSvg.y + 20}
            fontSize="12"
            fill="#006600"
            fontWeight="bold"
          >
            B
          </text>

          {/* Sum/Difference angle (red) */}
          <line
            x1={SVG_CENTER_X}
            y1={SVG_CENTER_Y}
            x2={pointSumSvg.x}
            y2={pointSumSvg.y}
            stroke="#cc0000"
            strokeWidth="2"
            strokeDasharray="5,3"
          />
          <circle cx={pointSumSvg.x} cy={pointSumSvg.y} r="5" fill="#cc0000" />
          <text
            x={pointSumSvg.x + 10}
            y={pointSumSvg.y - 10}
            fontSize="12"
            fill="#cc0000"
            fontWeight="bold"
          >
            {operation === 'sum' ? 'A + B' : 'A - B'}
          </text>

          {/* Arc for angle A */}
          <path
            d={`M ${SVG_CENTER_X + SVG_RADIUS * 0.3} ${SVG_CENTER_Y} A ${SVG_RADIUS * 0.3} ${SVG_RADIUS * 0.3} 0 ${angleA.toRadians() > Math.PI ? 1 : 0} 0 ${SVG_CENTER_X + SVG_RADIUS * 0.3 * Math.cos(angleA.toRadians())} ${SVG_CENTER_Y - SVG_RADIUS * 0.3 * Math.sin(angleA.toRadians())}`}
            fill="none"
            stroke="#0066cc"
            strokeWidth="1.5"
          />

          {/* Arc for angle B (from A) */}
          <path
            d={`M ${pointASvg.x} ${pointASvg.y} A ${SVG_RADIUS * 0.2} ${SVG_RADIUS * 0.2} 0 ${angleB.toRadians() > Math.PI ? 1 : 0} ${operation === 'sum' ? 0 : 1} ${SVG_CENTER_X + SVG_RADIUS * 0.2 * Math.cos(angleA.toRadians() + (operation === 'sum' ? 1 : -1) * angleB.toRadians())} ${SVG_CENTER_Y - SVG_RADIUS * 0.2 * Math.sin(angleA.toRadians() + (operation === 'sum' ? 1 : -1) * angleB.toRadians())}`}
            fill="none"
            stroke="#006600"
            strokeWidth="1.5"
            strokeDasharray="2,2"
          />
        </svg>
      </div>
    </div>
  );
}
