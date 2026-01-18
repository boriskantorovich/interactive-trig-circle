/**
 * Fourier Series sandbox visualization
 * Per milestone 15: Graduate modules
 * Per spec Section 2.3.7: Fourier Series Basics
 * 
 * Shows how periodic functions can be decomposed into sin/cos components
 * Interactive partial sums visualization
 */

/* eslint-disable react-refresh/only-export-components */
import type { ReactElement } from 'react';
import { BaseFormulaVisualization } from '../base/FormulaVisualization';
import type { Angle } from '../../core/Angle';
import { useState, useMemo } from 'react';
import { KaTeXRenderer } from '../../components/KaTeXRenderer';
import './FourierSeries.css';

/**
 * Calculate Fourier series partial sum for square wave
 * Square wave: f(x) = 4/π * Σ(1/(2n-1) * sin((2n-1)x)) for n=1 to N
 * 
 * @param x Angle in radians
 * @param numTerms Number of terms in partial sum
 * @returns Approximate value of square wave
 */
function squareWaveFourier(x: number, numTerms: number): number {
  let sum = 0;
  for (let n = 1; n <= numTerms; n++) {
    const coefficient = 4 / (Math.PI * (2 * n - 1));
    const frequency = 2 * n - 1;
    sum += coefficient * Math.sin(frequency * x);
  }
  return sum;
}

/**
 * Calculate Fourier series partial sum for sawtooth wave
 * Sawtooth: f(x) = 2/π * Σ((-1)^(n+1) / n * sin(nx)) for n=1 to N
 * 
 * @param x Angle in radians
 * @param numTerms Number of terms in partial sum
 * @returns Approximate value of sawtooth wave
 */
function sawtoothWaveFourier(x: number, numTerms: number): number {
  let sum = 0;
  for (let n = 1; n <= numTerms; n++) {
    const coefficient = (2 / Math.PI) * (Math.pow(-1, n + 1) / n);
    sum += coefficient * Math.sin(n * x);
  }
  return sum;
}

/**
 * Generate points for Fourier series visualization
 * @param numTerms Number of terms in partial sum
 * @param waveType Type of wave to approximate
 * @returns Array of {x, y} points
 */
function generateFourierPoints(
  numTerms: number,
  waveType: 'square' | 'sawtooth'
): Array<{ x: number; y: number }> {
  const points: Array<{ x: number; y: number }> = [];
  const numPoints = 200; // Resolution of the curve
  const xRange = 2 * Math.PI;

  for (let i = 0; i <= numPoints; i++) {
    const x = (i / numPoints) * xRange;
    const y =
      waveType === 'square'
        ? squareWaveFourier(x, numTerms)
        : sawtoothWaveFourier(x, numTerms);
    points.push({ x, y });
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
 * Fourier Series visualization component (with hooks)
 */
function FourierSeriesVisualization({ angle }: { angle: Angle }) {
  const [numTerms, setNumTerms] = useState(5);
  const [waveType, setWaveType] = useState<'square' | 'sawtooth'>('square');

    // Generate Fourier series points
    const fourierPoints = useMemo(
      () => generateFourierPoints(numTerms, waveType),
      [numTerms, waveType]
    );

    // Convert to SVG path
    const pathData = useMemo(() => {
      if (fourierPoints.length === 0) return '';
      const width = 600;
      const height = 300;
      const firstPoint = mathToSvgGraph(
        fourierPoints[0].x,
        fourierPoints[0].y,
        width,
        height
      );
      let path = `M ${firstPoint.x} ${firstPoint.y}`;
      for (let i = 1; i < fourierPoints.length; i++) {
        const point = mathToSvgGraph(
          fourierPoints[i].x,
          fourierPoints[i].y,
          width,
          height
        );
        path += ` L ${point.x} ${point.y}`;
      }
      return path;
    }, [fourierPoints]);

    // Calculate current angle's value
    const currentX = angle.toRadians();
    const currentY =
      waveType === 'square'
        ? squareWaveFourier(currentX, numTerms)
        : sawtoothWaveFourier(currentX, numTerms);
    const currentPointSvg = mathToSvgGraph(currentX, currentY, 600, 300);

    // Generate Fourier series formula text
    const fourierFormula =
      waveType === 'square'
        ? `f(x) = \\frac{4}{\\pi} \\sum_{n=1}^{${numTerms}} \\frac{\\sin((2n-1)x)}{2n-1}`
        : `f(x) = \\frac{2}{\\pi} \\sum_{n=1}^{${numTerms}} \\frac{(-1)^{n+1}\\sin(nx)}{n}`;

    return (
      <div className="fourier-series">
        <div className="fourier-series__explanation">
          <p>
            <strong>Fourier Series</strong> decompose periodic functions into
            infinite sums of sine and cosine terms. This visualization shows how
            adding more terms improves the approximation.
          </p>
          <p>
            <strong>Square Wave:</strong> Only odd harmonics (sin(x), sin(3x),
            sin(5x), ...)
          </p>
          <p>
            <strong>Sawtooth Wave:</strong> All harmonics with alternating signs
          </p>
        </div>

        <div className="fourier-series__controls">
          <div className="fourier-series__control-group">
            <label htmlFor="wave-type">Wave Type:</label>
            <select
              id="wave-type"
              value={waveType}
              onChange={(e) =>
                setWaveType(e.target.value as 'square' | 'sawtooth')
              }
            >
              <option value="square">Square Wave</option>
              <option value="sawtooth">Sawtooth Wave</option>
            </select>
          </div>

          <div className="fourier-series__control-group">
            <label htmlFor="num-terms">
              Number of Terms: {numTerms}
            </label>
            <input
              id="num-terms"
              type="range"
              min="1"
              max="20"
              value={numTerms}
              onChange={(e) => setNumTerms(parseInt(e.target.value, 10))}
            />
          </div>
        </div>

        <div className="fourier-series__formula">
          <KaTeXRenderer formula={fourierFormula} displayMode={true} />
        </div>

        <div className="fourier-series__visualization">
          <svg
            viewBox="0 0 600 300"
            preserveAspectRatio="xMidYMid meet"
            className="fourier-series__svg"
          >
            {/* Grid lines */}
            <defs>
              <pattern
                id="grid"
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
            <rect width="600" height="300" fill="url(#grid)" />

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

            {/* Fourier series curve */}
            <path
              d={pathData}
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="2.5"
            />

            {/* Current angle marker */}
            <circle
              cx={currentPointSvg.x}
              cy={currentPointSvg.y}
              r="5"
              fill="var(--color-primary)"
              stroke="white"
              strokeWidth="2"
            />
            <line
              x1={currentPointSvg.x}
              y1="150"
              x2={currentPointSvg.x}
              y2={currentPointSvg.y}
              stroke="var(--color-primary)"
              strokeWidth="1.5"
              strokeDasharray="3,3"
              opacity="0.6"
            />
          </svg>
        </div>

        <div className="fourier-series__info">
          <p>
            <strong>Current angle:</strong> θ = {angle.toDegrees().toFixed(2)}°
            ({angle.toRadians().toFixed(4)} rad)
          </p>
          <p>
            <strong>Approximate value:</strong> f(θ) ≈{' '}
            {currentY.toFixed(4)}
          </p>
          <p>
            <strong>Terms used:</strong> {numTerms} (of ∞)
          </p>
          <p className="fourier-series__note">
            <em>
              As you increase the number of terms, the approximation becomes
              more accurate. The Fourier series converges to the exact function
              as the number of terms approaches infinity.
            </em>
          </p>
        </div>
      </div>
    );
}

/**
 * Fourier Series visualization
 * Shows how periodic functions can be approximated using sin/cos series
 */
export class FourierSeries extends BaseFormulaVisualization {
  readonly id = 'fourierSeries';
  readonly name = 'Fourier Series Sandbox';
  readonly difficulty = 'graduate';
  readonly katexFormula =
    'f(x) = \\frac{a_0}{2} + \\sum_{n=1}^{\\infty} [a_n \\cos(nx) + b_n \\sin(nx)]';
  readonly description =
    'Fourier series decompose periodic functions into infinite sums of sin and cos terms. Explore how adding more terms improves the approximation of square and sawtooth waves.';

  render(angle: Angle): ReactElement | null {
    return <FourierSeriesVisualization angle={angle} />;
  }
}
