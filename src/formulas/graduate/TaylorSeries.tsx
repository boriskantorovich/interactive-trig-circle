/**
 * Taylor Series convergence visualization
 * Per milestone 15: Graduate modules
 * Per spec Section 2.3.7: Series Expansions
 * 
 * Shows how sin and cos can be approximated using polynomial series
 * Interactive convergence visualization
 */

/* eslint-disable react-refresh/only-export-components */
import type { ReactElement } from 'react';
import { BaseFormulaVisualization } from '../base/FormulaVisualization';
import type { Angle } from '../../core/Angle';
import { useState, useMemo } from 'react';
import { TrigonometricValues } from '../../core/Trigonometry';
import { KaTeXRenderer } from '../../components/KaTeXRenderer';
import './TaylorSeries.css';

/**
 * Calculate Taylor series approximation for sin(x)
 * sin(x) = x - x³/3! + x⁵/5! - x⁷/7! + ...
 * 
 * @param x Angle in radians
 * @param numTerms Number of terms in series
 * @returns Approximate value of sin(x)
 */
function sinTaylor(x: number, numTerms: number): number {
  let sum = 0;
  let term = x;
  let sign = 1;

  for (let n = 0; n < numTerms; n++) {
    sum += sign * term;
    sign *= -1;
    term *= (x * x) / ((2 * n + 2) * (2 * n + 3));
  }

  return sum;
}

/**
 * Calculate Taylor series approximation for cos(x)
 * cos(x) = 1 - x²/2! + x⁴/4! - x⁶/6! + ...
 * 
 * @param x Angle in radians
 * @param numTerms Number of terms in series
 * @returns Approximate value of cos(x)
 */
function cosTaylor(x: number, numTerms: number): number {
  let sum = 1;
  let term = 1;
  let sign = -1;

  for (let n = 1; n < numTerms; n++) {
    term *= (x * x) / ((2 * n - 1) * (2 * n));
    sum += sign * term;
    sign *= -1;
  }

  return sum;
}

/**
 * Generate points for Taylor series visualization
 * @param numTerms Number of terms in series
 * @param functionType Type of function to approximate
 * @returns Array of {x, y} points
 */
function generateTaylorPoints(
  numTerms: number,
  functionType: 'sin' | 'cos'
): Array<{ x: number; y: number; exact: number }> {
  const points: Array<{ x: number; y: number; exact: number }> = [];
  const numPoints = 200;
  const xRange = 2 * Math.PI;

  for (let i = 0; i <= numPoints; i++) {
    const x = (i / numPoints) * xRange;
    const approximate =
      functionType === 'sin' ? sinTaylor(x, numTerms) : cosTaylor(x, numTerms);
    const exact =
      functionType === 'sin' ? Math.sin(x) : Math.cos(x);
    points.push({ x, y: approximate, exact });
  }

  return points;
}

/**
 * Convert math coordinates to SVG coordinates for graph
 * @param x Math x coordinate (0 to 2π)
 * @param y Math y coordinate (typically -1 to 1)
 * @param width SVG width
 * @param height SVG height
 * @returns SVG coordinates
 */
function mathToSvgGraph(
  x: number,
  y: number,
  width: number,
  height: number
): { x: number; y: number } {
  // X: map [0, 2π] to [0, width]
  const svgX = (x / (2 * Math.PI)) * width;
  // Y: map [-1.5, 1.5] to [height, 0] (flip Y axis)
  const svgY = height - ((y + 1.5) / 3) * height;
  return { x: svgX, y: svgY };
}

/**
 * Generate Taylor series formula text
 * @param functionType Type of function
 * @param numTerms Number of terms
 * @returns LaTeX formula string
 */
function generateTaylorFormula(
  functionType: 'sin' | 'cos',
  numTerms: number
): string {
  if (functionType === 'sin') {
    if (numTerms === 1) return '\\sin(x) \\approx x';
    if (numTerms === 2) return '\\sin(x) \\approx x - \\frac{x^3}{3!}';
    if (numTerms === 3)
      return '\\sin(x) \\approx x - \\frac{x^3}{3!} + \\frac{x^5}{5!}';
    if (numTerms === 4)
      return '\\sin(x) \\approx x - \\frac{x^3}{3!} + \\frac{x^5}{5!} - \\frac{x^7}{7!}';
    return `\\sin(x) \\approx \\sum_{n=0}^{${numTerms - 1}} \\frac{(-1)^n x^{2n+1}}{(2n+1)!}`;
  } else {
    if (numTerms === 1) return '\\cos(x) \\approx 1';
    if (numTerms === 2) return '\\cos(x) \\approx 1 - \\frac{x^2}{2!}';
    if (numTerms === 3)
      return '\\cos(x) \\approx 1 - \\frac{x^2}{2!} + \\frac{x^4}{4!}';
    if (numTerms === 4)
      return '\\cos(x) \\approx 1 - \\frac{x^2}{2!} + \\frac{x^4}{4!} - \\frac{x^6}{6!}';
    return `\\cos(x) \\approx \\sum_{n=0}^{${numTerms - 1}} \\frac{(-1)^n x^{2n}}{(2n)!}`;
  }
}

/**
 * Taylor Series visualization component (with hooks)
 */
function TaylorSeriesVisualization({ angle }: { angle: Angle }) {
  const [numTerms, setNumTerms] = useState(5);
  const [functionType, setFunctionType] = useState<'sin' | 'cos'>('sin');

    // Get exact value for current angle
    const trigValues = new TrigonometricValues(angle);
    const exactValue =
      functionType === 'sin' ? trigValues.sin() : trigValues.cos();
    const currentX = angle.toRadians();
    const approximateValue =
      functionType === 'sin'
        ? sinTaylor(currentX, numTerms)
        : cosTaylor(currentX, numTerms);

    // Generate Taylor series points
    const taylorPoints = useMemo(
      () => generateTaylorPoints(numTerms, functionType),
      [numTerms, functionType]
    );

    // Convert to SVG paths
    const approximatePath = useMemo(() => {
      if (taylorPoints.length === 0) return '';
      const width = 600;
      const height = 300;
      const firstPoint = mathToSvgGraph(
        taylorPoints[0].x,
        taylorPoints[0].y,
        width,
        height
      );
      let path = `M ${firstPoint.x} ${firstPoint.y}`;
      for (let i = 1; i < taylorPoints.length; i++) {
        const point = mathToSvgGraph(
          taylorPoints[i].x,
          taylorPoints[i].y,
          width,
          height
        );
        path += ` L ${point.x} ${point.y}`;
      }
      return path;
    }, [taylorPoints]);

    const exactPath = useMemo(() => {
      if (taylorPoints.length === 0) return '';
      const width = 600;
      const height = 300;
      const firstPoint = mathToSvgGraph(
        taylorPoints[0].x,
        taylorPoints[0].exact,
        width,
        height
      );
      let path = `M ${firstPoint.x} ${firstPoint.y}`;
      for (let i = 1; i < taylorPoints.length; i++) {
        const point = mathToSvgGraph(
          taylorPoints[i].x,
          taylorPoints[i].exact,
          width,
          height
        );
        path += ` L ${point.x} ${point.y}`;
      }
      return path;
    }, [taylorPoints]);

    // Current angle marker
    const currentPointApprox = mathToSvgGraph(
      currentX,
      approximateValue,
      600,
      300
    );
    const currentPointExact = mathToSvgGraph(currentX, exactValue, 600, 300);

    // Generate formula
    const taylorFormula = generateTaylorFormula(functionType, numTerms);

    // Calculate error
    const error = Math.abs(exactValue - approximateValue);

    return (
      <div className="taylor-series">
        <div className="taylor-series__explanation">
          <p>
            <strong>Taylor Series</strong> approximate functions using polynomial
            expansions around a point (here, x = 0). This visualization shows
            how adding more terms improves the approximation of trigonometric
            functions.
          </p>
          <p>
            <strong>Maclaurin Series</strong> (Taylor series at x = 0):
          </p>
          <ul>
            <li>
              sin(x) = x - x³/3! + x⁵/5! - x⁷/7! + ...
            </li>
            <li>
              cos(x) = 1 - x²/2! + x⁴/4! - x⁶/6! + ...
            </li>
          </ul>
        </div>

        <div className="taylor-series__controls">
          <div className="taylor-series__control-group">
            <label htmlFor="function-type">Function:</label>
            <select
              id="function-type"
              value={functionType}
              onChange={(e) => setFunctionType(e.target.value as 'sin' | 'cos')}
            >
              <option value="sin">sin(x)</option>
              <option value="cos">cos(x)</option>
            </select>
          </div>

          <div className="taylor-series__control-group">
            <label htmlFor="num-terms">
              Number of Terms: {numTerms}
            </label>
            <input
              id="num-terms"
              type="range"
              min="1"
              max="15"
              value={numTerms}
              onChange={(e) => setNumTerms(parseInt(e.target.value, 10))}
            />
          </div>
        </div>

        <div className="taylor-series__formula">
          <KaTeXRenderer formula={taylorFormula} displayMode={true} />
        </div>

        <div className="taylor-series__visualization">
          <svg
            viewBox="0 0 600 300"
            preserveAspectRatio="xMidYMid meet"
            className="taylor-series__svg"
          >
            {/* Grid lines */}
            <defs>
              <pattern
                id="grid-taylor"
                width="50"
                height="50"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 50 0 L 0 0 0 50"
                  fill="none"
                  stroke="var(--color-border-subtle)"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="600" height="300" fill="url(#grid-taylor)" />

            {/* Axes */}
            <line
              x1="0"
              y1="150"
              x2="600"
              y2="150"
              stroke="var(--color-text-medium)"
              strokeWidth="2"
            />
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="300"
              stroke="var(--color-text-medium)"
              strokeWidth="2"
            />

            {/* Axis labels */}
            <text
              x="590"
              y="145"
              fill="var(--color-text-medium)"
              fontSize="12"
              textAnchor="end"
            >
              x
            </text>
            <text
              x="10"
              y="15"
              fill="var(--color-text-medium)"
              fontSize="12"
            >
              y
            </text>
            <text
              x="300"
              y="145"
              fill="var(--color-text-medium)"
              fontSize="10"
              textAnchor="middle"
            >
              0
            </text>
            <text
              x="590"
              y="145"
              fill="var(--color-text-medium)"
              fontSize="10"
              textAnchor="end"
            >
              2π
            </text>

            {/* Exact function curve */}
            <path
              d={exactPath}
              fill="none"
              stroke="var(--color-text-medium)"
              strokeWidth="2"
              strokeDasharray="5,5"
              opacity="0.6"
            />

            {/* Taylor approximation curve */}
            <path
              d={approximatePath}
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="2.5"
            />

            {/* Current angle markers */}
            <circle
              cx={currentPointExact.x}
              cy={currentPointExact.y}
              r="5"
              fill="var(--color-text-medium)"
              stroke="white"
              strokeWidth="2"
              opacity="0.6"
            />
            <circle
              cx={currentPointApprox.x}
              cy={currentPointApprox.y}
              r="5"
              fill="var(--color-primary)"
              stroke="white"
              strokeWidth="2"
            />
            <line
              x1={currentPointApprox.x}
              y1="150"
              x2={currentPointApprox.x}
              y2={currentPointApprox.y}
              stroke="var(--color-primary)"
              strokeWidth="1.5"
              strokeDasharray="3,3"
              opacity="0.6"
            />
          </svg>
        </div>

        <div className="taylor-series__info">
          <p>
            <strong>Current angle:</strong> θ = {angle.toDegrees().toFixed(2)}°
            ({angle.toRadians().toFixed(4)} rad)
          </p>
          <p>
            <strong>Exact value:</strong> {functionType}(θ) ={' '}
            {exactValue.toFixed(6)}
          </p>
          <p>
            <strong>Taylor approximation:</strong> ≈ {approximateValue.toFixed(6)}
          </p>
          <p>
            <strong>Error:</strong> |exact - approx| = {error.toFixed(8)}
          </p>
          <p>
            <strong>Terms used:</strong> {numTerms}
          </p>
          <p className="taylor-series__note">
            <em>
              The Taylor series converges to the exact function as the number of
              terms approaches infinity. Notice how the approximation improves
              near x = 0 and becomes less accurate further away.
            </em>
          </p>
        </div>
      </div>
    );
}

/**
 * Taylor Series visualization
 * Shows how sin and cos can be approximated using polynomial series
 */
export class TaylorSeries extends BaseFormulaVisualization {
  readonly id = 'seriesExpansions';
  readonly name = 'Taylor Series Convergence';
  readonly difficulty = 'graduate';
  readonly katexFormula =
    'f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!}(x-a)^n';
  readonly description =
    'Taylor series approximate functions using polynomial expansions. Explore how adding more terms improves the approximation of sin and cos functions.';

  render(angle: Angle): ReactElement | null {
    return <TaylorSeriesVisualization angle={angle} />;
  }
}
