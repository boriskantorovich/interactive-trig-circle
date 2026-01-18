/**
 * TrigonometricValuesDisplay component
 * Per milestone 7: Numeric trig panel + formatting
 * Per spec Section 2.2.2: Trigonometric Function Display
 */

import { useMemo } from 'react';
import { useCurrentAngle } from '../state/store';
import { TrigonometricValues, formatTrigValue } from '../core/Trigonometry';
import './TrigonometricValuesDisplay.css';

/**
 * TrigonometricValuesDisplay component
 * Displays all six trigonometric function values with proper formatting
 */
export function TrigonometricValuesDisplay() {
  const currentAngle = useCurrentAngle();

  // Calculate all trigonometric values
  const trigValues = useMemo(() => {
    return new TrigonometricValues(currentAngle);
  }, [currentAngle]);

  // Format all values with consistent precision (4 decimals)
  // Per milestone 7: Formatting rules - null → "undefined", clamp tiny values to 0
  const formattedValues = useMemo(() => {
    const precision = 4;
    return {
      sin: formatTrigValue(trigValues.sin(), precision),
      cos: formatTrigValue(trigValues.cos(), precision),
      tan: formatTrigValue(trigValues.tan(), precision),
      cot: formatTrigValue(trigValues.cot(), precision),
      sec: formatTrigValue(trigValues.sec(), precision),
      csc: formatTrigValue(trigValues.csc(), precision),
    };
  }, [trigValues]);

  return (
    <div className="trigonometric-values-display">
      <h2 className="trigonometric-values-display__title">Trigonometric Values</h2>
      <div className="trigonometric-values-display__grid">
        <div className="trigonometric-values-display__item">
          <span className="trigonometric-values-display__label">sin(θ)</span>
          <span
            className={`trigonometric-values-display__value ${
              formattedValues.sin === 'undefined'
                ? 'trigonometric-values-display__value--undefined'
                : ''
            }`}
          >
            {formattedValues.sin}
          </span>
        </div>
        <div className="trigonometric-values-display__item">
          <span className="trigonometric-values-display__label">cos(θ)</span>
          <span
            className={`trigonometric-values-display__value ${
              formattedValues.cos === 'undefined'
                ? 'trigonometric-values-display__value--undefined'
                : ''
            }`}
          >
            {formattedValues.cos}
          </span>
        </div>
        <div className="trigonometric-values-display__item">
          <span className="trigonometric-values-display__label">tan(θ)</span>
          <span
            className={`trigonometric-values-display__value ${
              formattedValues.tan === 'undefined'
                ? 'trigonometric-values-display__value--undefined'
                : ''
            }`}
          >
            {formattedValues.tan}
          </span>
        </div>
        <div className="trigonometric-values-display__item">
          <span className="trigonometric-values-display__label">cot(θ)</span>
          <span
            className={`trigonometric-values-display__value ${
              formattedValues.cot === 'undefined'
                ? 'trigonometric-values-display__value--undefined'
                : ''
            }`}
          >
            {formattedValues.cot}
          </span>
        </div>
        <div className="trigonometric-values-display__item">
          <span className="trigonometric-values-display__label">sec(θ)</span>
          <span
            className={`trigonometric-values-display__value ${
              formattedValues.sec === 'undefined'
                ? 'trigonometric-values-display__value--undefined'
                : ''
            }`}
          >
            {formattedValues.sec}
          </span>
        </div>
        <div className="trigonometric-values-display__item">
          <span className="trigonometric-values-display__label">csc(θ)</span>
          <span
            className={`trigonometric-values-display__value ${
              formattedValues.csc === 'undefined'
                ? 'trigonometric-values-display__value--undefined'
                : ''
            }`}
          >
            {formattedValues.csc}
          </span>
        </div>
      </div>
    </div>
  );
}
