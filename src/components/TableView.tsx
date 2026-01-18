/**
 * TableView component
 * Per milestone 10: Table view
 * Per spec Section 2.5: Table View
 */

import { useMemo } from 'react';
import { useCurrentAngle, useStore, useAngleUnit } from '../state/store';
import { Angle } from '../core/Angle';
import './TableView.css';

/**
 * Common angle data with exact values
 * Per spec Section 6.4.5: Common Angle Values Reference Table
 */
interface CommonAngle {
  degrees: number;
  radians: number;
  radianLabel: string; // e.g., "π/6", "π/4"
  exactValues: {
    sin: string; // e.g., "1/2", "√2/2", "√3/2"
    cos: string;
    tan: string | 'undefined';
    cot: string | 'undefined';
    sec: string | 'undefined';
    csc: string | 'undefined';
  };
  angle: Angle; // Pre-computed Angle object
}

/**
 * Common angles table data
 * Includes exact values for educational purposes
 */
const COMMON_ANGLES: CommonAngle[] = [
  {
    degrees: 0,
    radians: 0,
    radianLabel: '0',
    exactValues: {
      sin: '0',
      cos: '1',
      tan: '0',
      cot: 'undefined',
      sec: '1',
      csc: 'undefined',
    },
    angle: Angle.ZERO,
  },
  {
    degrees: 30,
    radians: Math.PI / 6,
    radianLabel: 'π/6',
    exactValues: {
      sin: '1/2',
      cos: '√3/2',
      tan: '1/√3',
      cot: '√3',
      sec: '2/√3',
      csc: '2',
    },
    angle: Angle.PI_OVER_6,
  },
  {
    degrees: 45,
    radians: Math.PI / 4,
    radianLabel: 'π/4',
    exactValues: {
      sin: '√2/2',
      cos: '√2/2',
      tan: '1',
      cot: '1',
      sec: '√2',
      csc: '√2',
    },
    angle: Angle.PI_OVER_4,
  },
  {
    degrees: 60,
    radians: Math.PI / 3,
    radianLabel: 'π/3',
    exactValues: {
      sin: '√3/2',
      cos: '1/2',
      tan: '√3',
      cot: '1/√3',
      sec: '2',
      csc: '2/√3',
    },
    angle: Angle.PI_OVER_3,
  },
  {
    degrees: 90,
    radians: Math.PI / 2,
    radianLabel: 'π/2',
    exactValues: {
      sin: '1',
      cos: '0',
      tan: 'undefined',
      cot: '0',
      sec: 'undefined',
      csc: '1',
    },
    angle: Angle.PI_OVER_2,
  },
  {
    degrees: 180,
    radians: Math.PI,
    radianLabel: 'π',
    exactValues: {
      sin: '0',
      cos: '-1',
      tan: '0',
      cot: 'undefined',
      sec: '-1',
      csc: 'undefined',
    },
    angle: Angle.PI,
  },
  {
    degrees: 270,
    radians: (3 * Math.PI) / 2,
    radianLabel: '3π/2',
    exactValues: {
      sin: '-1',
      cos: '0',
      tan: 'undefined',
      cot: '0',
      sec: 'undefined',
      csc: '-1',
    },
    angle: Angle.THREE_PI_OVER_2,
  },
  {
    degrees: 360,
    radians: 2 * Math.PI,
    radianLabel: '2π',
    exactValues: {
      sin: '0',
      cos: '1',
      tan: '0',
      cot: 'undefined',
      sec: '1',
      csc: 'undefined',
    },
    angle: Angle.TWO_PI,
  },
];

/**
 * Find the nearest angle in the common angles table to the current angle
 * Returns the index of the nearest angle
 */
function findNearestAngleIndex(
  currentAngle: Angle,
  commonAngles: CommonAngle[]
): number {
  const currentRad = currentAngle.toRadians();
  let nearestIndex = 0;
  let minDistance = Math.abs(currentRad - commonAngles[0].radians);

  for (let i = 1; i < commonAngles.length; i++) {
    const distance = Math.abs(currentRad - commonAngles[i].radians);
    if (distance < minDistance) {
      minDistance = distance;
      nearestIndex = i;
    }
  }

  return nearestIndex;
}

/**
 * TableView component
 * Displays a table of common angles with exact trigonometric values
 * Highlights the row closest to the current angle
 * Allows clicking rows to set the angle
 */
export function TableView() {
  const currentAngle = useCurrentAngle();
  const angleUnit = useAngleUnit();
  const setAngle = useStore((state) => state.setAngle);

  // Find the nearest angle row to highlight
  const nearestIndex = useMemo(() => {
    return findNearestAngleIndex(currentAngle, COMMON_ANGLES);
  }, [currentAngle]);

  /**
   * Handle row click to set the angle
   */
  const handleRowClick = (angle: Angle) => {
    setAngle(angle);
  };

  return (
    <div className="table-view">
      <h2 className="table-view__title">Common Angle Values</h2>
      <div className="table-view__container">
        <table className="table-view__table">
          <thead>
            <tr>
              <th className="table-view__header">Angle</th>
              <th className="table-view__header">sin(θ)</th>
              <th className="table-view__header">cos(θ)</th>
              <th className="table-view__header">tan(θ)</th>
              <th className="table-view__header">cot(θ)</th>
              <th className="table-view__header">sec(θ)</th>
              <th className="table-view__header">csc(θ)</th>
            </tr>
          </thead>
          <tbody>
            {COMMON_ANGLES.map((angleData, index) => {
              const isNearest = index === nearestIndex;
              const angleLabel =
                angleUnit === 'degrees'
                  ? `${angleData.degrees}°`
                  : angleData.radianLabel;

              return (
                <tr
                  key={index}
                  className={`table-view__row ${
                    isNearest ? 'table-view__row--highlighted' : ''
                  }`}
                  onClick={() => handleRowClick(angleData.angle)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleRowClick(angleData.angle);
                    }
                  }}
                  aria-label={`Set angle to ${angleLabel}`}
                >
                  <td className="table-view__cell table-view__cell--angle">
                    {angleLabel}
                  </td>
                  <td className="table-view__cell">{angleData.exactValues.sin}</td>
                  <td className="table-view__cell">{angleData.exactValues.cos}</td>
                  <td
                    className={`table-view__cell ${
                      angleData.exactValues.tan === 'undefined'
                        ? 'table-view__cell--undefined'
                        : ''
                    }`}
                  >
                    {angleData.exactValues.tan}
                  </td>
                  <td
                    className={`table-view__cell ${
                      angleData.exactValues.cot === 'undefined'
                        ? 'table-view__cell--undefined'
                        : ''
                    }`}
                  >
                    {angleData.exactValues.cot}
                  </td>
                  <td
                    className={`table-view__cell ${
                      angleData.exactValues.sec === 'undefined'
                        ? 'table-view__cell--undefined'
                        : ''
                    }`}
                  >
                    {angleData.exactValues.sec}
                  </td>
                  <td
                    className={`table-view__cell ${
                      angleData.exactValues.csc === 'undefined'
                        ? 'table-view__cell--undefined'
                        : ''
                    }`}
                  >
                    {angleData.exactValues.csc}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="table-view__hint">
        Click a row to set the angle. The highlighted row shows the angle closest
        to the current value.
      </p>
    </div>
  );
}
