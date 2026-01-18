/**
 * Cofunction Identities visualization
 * Per milestone 13: Cofunction identities with symmetry view
 * Per spec Section 2.3.5: Co-function Identities
 * 
 * Formulas:
 * - sin(π/2 - θ) = cos(θ)
 * - cos(π/2 - θ) = sin(θ)
 * - tan(π/2 - θ) = cot(θ)
 * - cot(π/2 - θ) = tan(θ)
 */

import { BaseFormulaVisualization } from '../base/FormulaVisualization';
import { Angle, type Angle as AngleType } from '../../core/Angle';
import { TrigonometricValues } from '../../core/Trigonometry';
import { Point } from '../../core/Point';
import { mathToSvg } from '../../utils/coordinateUtils';
import { SVG_CENTER_X, SVG_CENTER_Y, SVG_RADIUS } from '../../constants/svgConstants';
import './Cofunction.css';

/**
 * Cofunction Identities visualization
 * Shows symmetry between θ and π/2 - θ
 */
export class Cofunction extends BaseFormulaVisualization {
  readonly id = 'cofunction';
  readonly name = 'Cofunction Identities';
  readonly difficulty = 'highSchool';
  readonly katexFormula = '\\sin\\left(\\frac{\\pi}{2} - \\theta\\right) = \\cos(\\theta) \\\\ \\cos\\left(\\frac{\\pi}{2} - \\theta\\right) = \\sin(\\theta)';
  readonly description =
    'The cofunction identities show the symmetry between complementary angles. The sine of an angle equals the cosine of its complement, and vice versa.';

  render(angle: AngleType): JSX.Element | null {
    const trigValues = new TrigonometricValues(angle);
    const sinTheta = trigValues.sin();
    const cosTheta = trigValues.cos();
    const tanTheta = trigValues.tan();
    const cotTheta = trigValues.cot();

    // Calculate π/2 - θ
    const complementAngle = new Angle(Math.PI / 2 - angle.toRadians(), 'radians');
    const trigComplement = new TrigonometricValues(complementAngle);
    const sinComplement = trigComplement.sin();
    const cosComplement = trigComplement.cos();
    const tanComplement = trigComplement.tan();
    const cotComplement = trigComplement.cot();

    // Get points on unit circle
    const pointTheta = Point.fromAngle(angle);
    const pointComplement = Point.fromAngle(complementAngle);
    
    const pointThetaSvg = mathToSvg(pointTheta.x, pointTheta.y);
    const pointComplementSvg = mathToSvg(pointComplement.x, pointComplement.y);

    return (
      <div className="cofunction">
        <div className="cofunction__explanation">
          <p>
            The cofunction identities show the relationship between an angle θ
            ({angle.toDegrees().toFixed(1)}°) and its complement π/2 - θ
            ({complementAngle.toDegrees().toFixed(1)}°):
          </p>
          <p className="cofunction__key-concept">
            <strong>Key insight:</strong> The sine of an angle equals the cosine of its complement,
            and vice versa. This reflects the symmetry of the unit circle about the line y = x.
          </p>
        </div>

        <div className="cofunction__formulas">
          <div className="cofunction__formula-card">
            <h3>Sine and Cosine</h3>
            <p className="cofunction__formula-text">
              sin(π/2 - θ) = cos(θ)
            </p>
            <p className="cofunction__calculation">
              sin({complementAngle.toDegrees().toFixed(1)}°) = cos({angle.toDegrees().toFixed(1)}°)
            </p>
            <p className="cofunction__calculation">
              {sinComplement.toFixed(6)} = {cosTheta.toFixed(6)} ✓
            </p>
            <p className="cofunction__formula-text">
              cos(π/2 - θ) = sin(θ)
            </p>
            <p className="cofunction__calculation">
              cos({complementAngle.toDegrees().toFixed(1)}°) = sin({angle.toDegrees().toFixed(1)}°)
            </p>
            <p className="cofunction__calculation">
              {cosComplement.toFixed(6)} = {sinTheta.toFixed(6)} ✓
            </p>
          </div>

          <div className="cofunction__formula-card">
            <h3>Tangent and Cotangent</h3>
            <p className="cofunction__formula-text">
              tan(π/2 - θ) = cot(θ)
            </p>
            <p className="cofunction__calculation">
              tan({complementAngle.toDegrees().toFixed(1)}°) = cot({angle.toDegrees().toFixed(1)}°)
            </p>
            <p className="cofunction__calculation">
              {tanComplement !== null ? tanComplement.toFixed(6) : 'undefined'} = {cotTheta !== null ? cotTheta.toFixed(6) : 'undefined'} ✓
            </p>
            <p className="cofunction__formula-text">
              cot(π/2 - θ) = tan(θ)
            </p>
            <p className="cofunction__calculation">
              cot({complementAngle.toDegrees().toFixed(1)}°) = tan({angle.toDegrees().toFixed(1)}°)
            </p>
            <p className="cofunction__calculation">
              {cotComplement !== null ? cotComplement.toFixed(6) : 'undefined'} = {tanTheta !== null ? tanTheta.toFixed(6) : 'undefined'} ✓
            </p>
          </div>
        </div>

        <div className="cofunction__visualization">
          <svg
            viewBox="0 0 400 400"
            preserveAspectRatio="xMidYMid meet"
            className="cofunction__svg"
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

            {/* Line y = x (symmetry line) */}
            <line
              x1={0}
              y1={0}
              x2={400}
              y2={400}
              stroke="#808080"
              strokeWidth="1"
              strokeDasharray="3,3"
              opacity="0.5"
            />
            <text
              x={380}
              y={390}
              fontSize="11"
              fill="#808080"
              textAnchor="end"
            >
              y = x
            </text>

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

            {/* Radius line for π/2 - θ (complement) */}
            <line
              x1={SVG_CENTER_X}
              y1={SVG_CENTER_Y}
              x2={pointComplementSvg.x}
              y2={pointComplementSvg.y}
              stroke="#006600"
              strokeWidth="2"
            />
            <circle cx={pointComplementSvg.x} cy={pointComplementSvg.y} r="5" fill="#006600" />

            {/* Arc for θ */}
            <path
              d={`M ${SVG_CENTER_X + SVG_RADIUS * 0.3} ${SVG_CENTER_Y} A ${SVG_RADIUS * 0.3} ${SVG_RADIUS * 0.3} 0 ${angle.toRadians() > Math.PI ? 1 : 0} 0 ${SVG_CENTER_X + SVG_RADIUS * 0.3 * Math.cos(angle.toRadians())} ${SVG_CENTER_Y - SVG_RADIUS * 0.3 * Math.sin(angle.toRadians())}`}
              fill="none"
              stroke="#0066cc"
              strokeWidth="2"
            />

            {/* Arc for π/2 - θ */}
            <path
              d={`M ${SVG_CENTER_X + SVG_RADIUS * 0.3} ${SVG_CENTER_Y} A ${SVG_RADIUS * 0.3} ${SVG_RADIUS * 0.3} 0 ${complementAngle.toRadians() > Math.PI ? 1 : 0} 0 ${SVG_CENTER_X + SVG_RADIUS * 0.3 * Math.cos(complementAngle.toRadians())} ${SVG_CENTER_Y - SVG_RADIUS * 0.3 * Math.sin(complementAngle.toRadians())}`}
              fill="none"
              stroke="#006600"
              strokeWidth="2"
              strokeDasharray="3,2"
            />

            {/* Arc showing π/2 */}
            <path
              d={`M ${SVG_CENTER_X + SVG_RADIUS * 0.2} ${SVG_CENTER_Y} A ${SVG_RADIUS * 0.2} ${SVG_RADIUS * 0.2} 0 0 0 ${SVG_CENTER_X} ${SVG_CENTER_Y - SVG_RADIUS * 0.2}`}
              fill="none"
              stroke="#808080"
              strokeWidth="1.5"
              strokeDasharray="2,2"
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
              x={pointThetaSvg.x + 10}
              y={pointThetaSvg.y + 5}
              fontSize="11"
              fill="#0066cc"
            >
              sin(θ) = {sinTheta.toFixed(4)}
            </text>
            <text
              x={pointThetaSvg.x + 10}
              y={pointThetaSvg.y + 18}
              fontSize="11"
              fill="#0066cc"
            >
              cos(θ) = {cosTheta.toFixed(4)}
            </text>

            <text
              x={pointComplementSvg.x - 10}
              y={pointComplementSvg.y - 10}
              fontSize="14"
              fill="#006600"
              fontWeight="bold"
              textAnchor="end"
            >
              π/2 - θ
            </text>
            <text
              x={pointComplementSvg.x - 10}
              y={pointComplementSvg.y + 5}
              fontSize="11"
              fill="#006600"
              textAnchor="end"
            >
              sin(π/2 - θ) = {sinComplement.toFixed(4)}
            </text>
            <text
              x={pointComplementSvg.x - 10}
              y={pointComplementSvg.y + 18}
              fontSize="11"
              fill="#006600"
              textAnchor="end"
            >
              cos(π/2 - θ) = {cosComplement.toFixed(4)}
            </text>

            {/* Show symmetry relationship */}
            <line
              x1={pointThetaSvg.x}
              y1={pointThetaSvg.y}
              x2={pointComplementSvg.x}
              y2={pointComplementSvg.y}
              stroke="#cc0000"
              strokeWidth="1"
              strokeDasharray="2,2"
              opacity="0.5"
            />

            {/* Label showing symmetry */}
            <text
              x={(pointThetaSvg.x + pointComplementSvg.x) / 2}
              y={(pointThetaSvg.y + pointComplementSvg.y) / 2 - 10}
              fontSize="10"
              fill="#cc0000"
              textAnchor="middle"
              fontWeight="bold"
            >
              Symmetry
            </text>
          </svg>
        </div>
      </div>
    );
  }
}
