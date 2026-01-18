/**
 * Pythagorean Identity formula visualization
 * Per milestone 12: Interactive proof: Pythagorean identity
 * Per spec Section 2.3.1: Pythagorean Identity
 * 
 * Visual proof: sin²(θ) + cos²(θ) = 1
 * Shows squares visually on the triangle legs
 * Live updates with θ
 */

import { BaseFormulaVisualization } from '../base/FormulaVisualization';
import type { Angle } from '../../core/Angle';
import { TrigonometricValues } from '../../core/Trigonometry';
import { Point } from '../../core/Point';
import { mathToSvg } from '../../utils/coordinateUtils';
import { SVG_CENTER_X, SVG_CENTER_Y, SVG_RADIUS } from '../../constants/svgConstants';
import './PythagoreanIdentity.css';

/**
 * Pythagorean Identity visualization
 * Shows geometric proof that sin²(θ) + cos²(θ) = 1
 */
export class PythagoreanIdentity extends BaseFormulaVisualization {
  readonly id = 'pythagorean-identity';
  readonly name = 'Pythagorean Identity';
  readonly difficulty = 'highSchool';
  readonly katexFormula = '\\sin^2(\\theta) + \\cos^2(\\theta) = 1';
  readonly description =
    'The fundamental trigonometric identity: the sum of the squares of sine and cosine always equals 1. This is a direct consequence of the Pythagorean theorem applied to the unit circle.';

  render(angle: Angle): JSX.Element | null {
    const trigValues = new TrigonometricValues(angle);
    const sinValue = trigValues.sin();
    const cosValue = trigValues.cos();
    const sinSquared = sinValue * sinValue;
    const cosSquared = cosValue * cosValue;
    const sum = sinSquared + cosSquared;

    // Get point on unit circle
    const point = Point.fromAngle(angle);
    const pointSvg = mathToSvg(point.x, point.y);

    // Calculate triangle vertices in SVG coordinates
    const originX = SVG_CENTER_X;
    const originY = SVG_CENTER_Y;
    const pointX = pointSvg.x;
    const pointY = pointSvg.y;

    // Calculate side lengths in SVG pixels
    // On unit circle: adjacent = cos(θ) * radius, opposite = sin(θ) * radius
    const adjacentLength = Math.abs(cosValue * SVG_RADIUS);
    const oppositeLength = Math.abs(sinValue * SVG_RADIUS);

    // Square dimensions (scaled for visibility)
    const squareScale = 0.7; // Scale squares to 70% of side length for better visibility
    const sinSquareSize = oppositeLength * squareScale;
    const cosSquareSize = adjacentLength * squareScale;

    // Position squares relative to the triangle
    // Sin square: positioned on the opposite (vertical) side
    // Center it on the vertical leg
    const sinSquareX =
      cosValue >= 0
        ? pointX + 5 // Right side of origin: square to the right of vertical leg
        : pointX - sinSquareSize - 5; // Left side of origin: square to the left of vertical leg

    // Center vertically on the vertical leg
    const sinSquareY = originY + (pointY - originY) / 2 - sinSquareSize / 2;

    // Cos square: positioned on the adjacent (horizontal) side
    // Center it on the horizontal leg
    // Center horizontally on the horizontal leg
    const cosSquareX = originX + (pointX - originX) / 2 - cosSquareSize / 2;

    const cosSquareY =
      sinValue >= 0
        ? originY - cosSquareSize - 5 // Top half: square above horizontal leg
        : originY + 5; // Bottom half: square below horizontal leg

    // Hypotenuse square (always 1, shown as reference)
    const hypotenuseSquareSize = SVG_RADIUS * squareScale;
    const hypotenuseSquareX = pointX - hypotenuseSquareSize / 2;
    const hypotenuseSquareY = pointY - hypotenuseSquareSize / 2;

    return (
      <div className="pythagorean-identity">
        <div className="pythagorean-identity__explanation">
          <p>
            The Pythagorean identity states that for any angle θ on the unit circle, the sum of the
            squares of sine and cosine equals 1. This is because the hypotenuse of the reference
            triangle is always 1 (the radius of the unit circle), so by the Pythagorean theorem:
          </p>
          <p className="pythagorean-identity__formula-text">
            (adjacent)² + (opposite)² = (hypotenuse)²
          </p>
          <p className="pythagorean-identity__formula-text">
            cos²(θ) + sin²(θ) = 1² = 1
          </p>
        </div>

        <div className="pythagorean-identity__visualization">
          <svg
            viewBox="0 0 400 400"
            preserveAspectRatio="xMidYMid meet"
            className="pythagorean-identity__svg"
          >
            {/* Unit circle outline (subtle) */}
            <circle
              cx={SVG_CENTER_X}
              cy={SVG_CENTER_Y}
              r={SVG_RADIUS}
              fill="none"
              stroke="#e0e0e0"
              strokeWidth="1"
              strokeDasharray="2,2"
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

            {/* Reference triangle */}
            <line
              x1={originX}
              y1={originY}
              x2={pointX}
              y2={pointY}
              stroke="#0066cc"
              strokeWidth="2"
              strokeDasharray="3,2"
            />
            <line
              x1={originX}
              y1={originY}
              x2={pointX}
              y2={originY}
              stroke="#0066cc"
              strokeWidth="2"
            />
            <line
              x1={pointX}
              y1={originY}
              x2={pointX}
              y2={pointY}
              stroke="#0066cc"
              strokeWidth="2"
            />

            {/* Current point on circle */}
            <circle cx={pointX} cy={pointY} r="4" fill="#0066cc" stroke="#fff" strokeWidth="1" />

            {/* Sin square (on opposite side) */}
            <rect
              x={sinSquareX}
              y={sinSquareY}
              width={sinSquareSize}
              height={sinSquareSize}
              fill="#cc0000"
              fillOpacity="0.3"
              stroke="#cc0000"
              strokeWidth="2"
            />
            <text
              x={sinSquareX + sinSquareSize / 2}
              y={sinSquareY + sinSquareSize / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="14"
              fill="#cc0000"
              fontWeight="bold"
            >
              sin²
            </text>
            <text
              x={sinSquareX + sinSquareSize / 2}
              y={sinSquareY + sinSquareSize / 2 + 16}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="10"
              fill="#cc0000"
            >
              {sinSquared.toFixed(4)}
            </text>

            {/* Cos square (on adjacent side) */}
            <rect
              x={cosSquareX}
              y={cosSquareY}
              width={cosSquareSize}
              height={cosSquareSize}
              fill="#006600"
              fillOpacity="0.3"
              stroke="#006600"
              strokeWidth="2"
            />
            <text
              x={cosSquareX + cosSquareSize / 2}
              y={cosSquareY + cosSquareSize / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="14"
              fill="#006600"
              fontWeight="bold"
            >
              cos²
            </text>
            <text
              x={cosSquareX + cosSquareSize / 2}
              y={cosSquareY + cosSquareSize / 2 + 16}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="10"
              fill="#006600"
            >
              {cosSquared.toFixed(4)}
            </text>

            {/* Hypotenuse square (reference, always = 1) */}
            <rect
              x={hypotenuseSquareX}
              y={hypotenuseSquareY}
              width={hypotenuseSquareSize}
              height={hypotenuseSquareSize}
              fill="none"
              stroke="#808080"
              strokeWidth="2"
              strokeDasharray="4,2"
            />
            <text
              x={hypotenuseSquareX + hypotenuseSquareSize / 2}
              y={hypotenuseSquareY + hypotenuseSquareSize / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="14"
              fill="#808080"
              fontWeight="bold"
            >
              1
            </text>

            {/* Sum indicator */}
            <text
              x={SVG_CENTER_X}
              y={50}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="16"
              fill="#1a1a1a"
              fontWeight="bold"
            >
              sin²(θ) + cos²(θ) = {sum.toFixed(6)}
            </text>
            <text
              x={SVG_CENTER_X}
              y={70}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="12"
              fill="#808080"
            >
              (Always equals 1 on the unit circle)
            </text>

            {/* Labels */}
            <text
              x={pointX + 10}
              y={pointY - 10}
              fontSize="12"
              fill="#1a1a1a"
            >
              θ
            </text>
            <text
              x={originX + (pointX - originX) / 2}
              y={originY - 10}
              textAnchor="middle"
              fontSize="11"
              fill="#0066cc"
            >
              cos(θ) = {cosValue.toFixed(4)}
            </text>
            <text
              x={pointX + 10}
              y={originY + (pointY - originY) / 2}
              fontSize="11"
              fill="#0066cc"
            >
              sin(θ) = {sinValue.toFixed(4)}
            </text>
          </svg>
        </div>
      </div>
    );
  }
}
