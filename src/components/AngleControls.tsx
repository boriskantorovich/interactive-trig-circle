/**
 * AngleControls component
 * Per milestone 6: Angle controls (slider + input + presets)
 * Per spec Section 2.6: Angle Input Methods
 */

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Angle } from '../core/Angle';
import { useCurrentAngle, useAngleUnit, useStore } from '../state/store';
import { parseAngleInput, formatAngleForInput, detectNormalization } from '../utils/angleParser';
import {
  getDefaultSliderOptions,
  sliderValueToAngle,
  angleToSliderValue,
} from '../interactions/SliderHandler';
import { errorHandler } from '../error/ErrorHandler';
import './AngleControls.css';

/**
 * Preset angles in degrees
 * Per milestone 6: Presets: 0°, 30°, 45°, 60°, 90°, 180°, 270°, 360°
 */
const PRESET_ANGLES = [
  { degrees: 0, label: '0°' },
  { degrees: 30, label: '30°' },
  { degrees: 45, label: '45°' },
  { degrees: 60, label: '60°' },
  { degrees: 90, label: '90°' },
  { degrees: 180, label: '180°' },
  { degrees: 270, label: '270°' },
  { degrees: 360, label: '360°' },
];

/**
 * AngleControls component
 * Provides slider, text input, presets, and unit toggle for angle control
 */
export function AngleControls() {
  const currentAngle = useCurrentAngle();
  const angleUnit = useAngleUnit();
  const setAngle = useStore((state) => state.setAngle);
  const setAngleUnit = useStore((state) => state.setAngleUnit);

  // Local state for text input
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);
  const [userMessage, setUserMessage] = useState<{ message: string; type: 'error' | 'warning' | 'info' } | null>(null);
  const isInputFocusedRef = useRef(false);

  // Register error handler callback
  useEffect(() => {
    errorHandler.setUserMessageCallback((message, type) => {
      setUserMessage({ message, type });
      // Clear message after 5 seconds
      setTimeout(() => setUserMessage(null), 5000);
    });

    return () => {
      errorHandler.clearUserMessageCallback();
    };
  }, []);

  // Get slider options based on current unit
  const sliderOptions = useMemo(
    () => getDefaultSliderOptions(angleUnit),
    [angleUnit]
  );

  // Track if slider was at max to maintain position when 360° = 0°
  const [wasAtMax, setWasAtMax] = useState(false);

  // Current slider value
  // Use wasAtMax to maintain slider position when angle is normalized from 360° to 0°
  const sliderValue = useMemo(() => {
    return angleToSliderValue(currentAngle, angleUnit, wasAtMax);
  }, [currentAngle, angleUnit, wasAtMax]);

  // Update input value when angle changes externally (e.g., from drag or click)
  // Only update if input is not focused (user is not actively editing)
  // Show slider value (not normalized angle) when at max to match user expectation
  useEffect(() => {
    if (!isInputFocusedRef.current) {
      // If slider is at max, show max value in input (360° or 2π), not normalized 0°
      const max = angleUnit === 'degrees' ? 360 : 2 * Math.PI;
      const isAtMax = Math.abs(sliderValue - max) < (angleUnit === 'degrees' ? 0.5 : 0.01);
      
      let formatted: string;
      if (isAtMax) {
        // Show max value in input when at max
        formatted = angleUnit === 'degrees' ? '360.00' : (2 * Math.PI).toFixed(4);
      } else {
        // Show normalized angle for other values
        formatted = formatAngleForInput(currentAngle, angleUnit);
      }
      
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Syncing input value from external angle changes
      setInputValue(formatted);
      setInputError(null);
    }
  }, [currentAngle, angleUnit, sliderValue]);

  // Update wasAtMax based on slider value
  // This is necessary to track slider position when 360° = 0°
  useEffect(() => {
    const max = angleUnit === 'degrees' ? 360 : 2 * Math.PI;
    const isAtMax = Math.abs(sliderValue - max) < (angleUnit === 'degrees' ? 0.5 : 0.01);
    if (isAtMax !== wasAtMax) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Necessary to track slider max position for 360° = 0° equivalence
      setWasAtMax(isAtMax);
    }
  }, [sliderValue, angleUnit, wasAtMax]);

  // Handle slider change
  const handleSliderChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(event.target.value);
      if (Number.isFinite(value)) {
        // Check if we're at max and update state
        const max = angleUnit === 'degrees' ? 360 : 2 * Math.PI;
        const isAtMax = Math.abs(value - max) < (angleUnit === 'degrees' ? 0.5 : 0.01);
        setWasAtMax(isAtMax);
        
        const angle = sliderValueToAngle(value, angleUnit);
        setAngle(angle);
      }
    },
    [angleUnit, setAngle]
  );

  // Handle text input change
  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setInputValue(value);
      setInputError(null);
      setUserMessage(null);
    },
    []
  );

  // Handle text input focus
  const handleInputFocus = useCallback(() => {
    isInputFocusedRef.current = true;
  }, []);

  // Handle text input blur (parse and apply)
  const handleInputBlur = useCallback(() => {
    isInputFocusedRef.current = false;
    const result = parseAngleInput(inputValue, angleUnit);
    
    if (result.error) {
      setInputError(result.error);
      errorHandler.handleInputError(
        inputValue,
        'Expected formats: "30", "30deg", "π/6", "1.2rad"'
      );
      // Restore previous value
      const formatted = formatAngleForInput(currentAngle, angleUnit);
      setInputValue(formatted);
    } else if (result.angle) {
      // Check if input is a plain number (no explicit unit) - only show normalization for these
      const plainNumberMatch = inputValue.trim().match(/^(-?\d+(?:\.\d+)?)$/);
      
      if (plainNumberMatch) {
        const originalValue = parseFloat(plainNumberMatch[1]);
        
        // Normalize the angle to see what it becomes
        const normalizedAngle = result.angle.normalize();
        
        // Check if normalization occurred (use the angle's unit, which should match currentUnit for plain numbers)
        const normalizationInfo = detectNormalization(
          originalValue,
          normalizedAngle,
          result.angle.unit
        );
        
        // Set the angle (setAngle will normalize it)
        setAngle(result.angle);
        
        if (normalizationInfo.wasNormalized) {
          // Show normalization message
          setUserMessage({
            message: normalizationInfo.message,
            type: 'info',
          });
          // Clear message after 3 seconds
          setTimeout(() => {
            setUserMessage((prev) => {
              // Only clear if it's still the same message (avoid race conditions)
              if (prev?.message === normalizationInfo.message) {
                return null;
              }
              return prev;
            });
          }, 3000);
        }
      } else {
        // For inputs with explicit units (e.g., "20000deg", "π/6"), just set the angle
        // We don't show normalization messages for these as they're more explicit
        setAngle(result.angle);
      }
      setInputError(null);
    }
  }, [inputValue, angleUnit, currentAngle, setAngle]);

  // Handle text input key press (Enter to apply)
  const handleInputKeyPress = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        handleInputBlur();
      }
    },
    [handleInputBlur]
  );

  // Handle unit toggle
  const handleUnitToggle = useCallback(() => {
    setAngleUnit(angleUnit === 'radians' ? 'degrees' : 'radians');
  }, [angleUnit, setAngleUnit]);

  // Handle preset angle click
  const handlePresetClick = useCallback(
    (degrees: number) => {
      // If clicking 360° button, mark as at max so slider shows 360° instead of 0°
      if (degrees === 360) {
        setWasAtMax(true);
      } else {
        // For other angles, they're not at max
        setWasAtMax(false);
      }
      
      const angle = Angle.fromDegrees(degrees);
      setAngle(angle);
    },
    [setAngle]
  );

  return (
    <div className="angle-controls">
      <div className="angle-controls__header">
        <h3>Angle Controls</h3>
      </div>

      {/* User message display */}
      {userMessage && (
        <div className={`angle-controls__message angle-controls__message--${userMessage.type}`}>
          {userMessage.message}
        </div>
      )}

      {/* Unit toggle */}
      <div className="angle-controls__unit-toggle">
        <label className="angle-controls__label">Unit:</label>
        <button
          className="angle-controls__toggle-button"
          onClick={handleUnitToggle}
          aria-label={`Switch to ${angleUnit === 'radians' ? 'degrees' : 'radians'}`}
        >
          {angleUnit === 'radians' ? 'Degrees' : 'Radians'}
        </button>
        <span className="angle-controls__current-unit">
          (Current: {angleUnit === 'radians' ? 'Radians' : 'Degrees'})
        </span>
      </div>

      {/* Slider */}
      <div className="angle-controls__slider-group">
        <label className="angle-controls__label" htmlFor="angle-slider">
          Angle: {sliderValue.toFixed(angleUnit === 'degrees' ? 0 : 2)}{' '}
          {angleUnit === 'degrees' ? '°' : 'rad'}
        </label>
        <input
          id="angle-slider"
          type="range"
          min={sliderOptions.min}
          max={sliderOptions.max}
          step={sliderOptions.step}
          value={sliderValue}
          onChange={handleSliderChange}
          className="angle-controls__slider"
          aria-label={`Angle slider (${angleUnit})`}
        />
        <div className="angle-controls__slider-labels">
          <span>{sliderOptions.min}</span>
          <span>{sliderOptions.max}</span>
        </div>
      </div>

      {/* Text input */}
      <div className="angle-controls__input-group">
        <label className="angle-controls__label" htmlFor="angle-input">
          Enter angle:
        </label>
        <input
          id="angle-input"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyPress={handleInputKeyPress}
          className={`angle-controls__input ${inputError ? 'angle-controls__input--error' : ''}`}
          placeholder={angleUnit === 'degrees' ? 'e.g., 30, 30deg, 45°' : 'e.g., π/6, 1.2rad'}
          aria-label="Angle text input"
          aria-invalid={inputError !== null}
          aria-describedby={inputError ? 'angle-input-error' : undefined}
        />
        {inputError && (
          <div
            id="angle-input-error"
            className="angle-controls__input-error"
            role="alert"
          >
            {inputError}
          </div>
        )}
        <div className="angle-controls__input-hint">
          Formats: <code>30</code>, <code>30deg</code>, <code>π/6</code>, <code>1.2rad</code>
        </div>
      </div>

      {/* Preset buttons */}
      <div className="angle-controls__presets">
        <label className="angle-controls__label">Preset angles:</label>
        <div className="angle-controls__preset-buttons">
          {PRESET_ANGLES.map((preset) => (
            <button
              key={preset.degrees}
              className="angle-controls__preset-button"
              onClick={() => handlePresetClick(preset.degrees)}
              aria-label={`Set angle to ${preset.label}`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
