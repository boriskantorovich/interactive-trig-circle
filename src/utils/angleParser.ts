/**
 * Angle input parsing utilities
 * Per milestone 6: Text input parsing
 * Per spec Section 2.6: Angle Input Methods
 * 
 * Accepts formats:
 * - "30" (assumes current unit)
 * - "30deg" or "30°" (degrees)
 * - "π/6" or "pi/6" (radians as fraction of π)
 * - "1.2rad" (radians)
 */

import { Angle, PI, TWO_PI } from '../core/Angle';
import type { AngleUnit } from '../state/AppState';

/**
 * Result of parsing an angle input string
 */
export interface ParseAngleResult {
  /**
   * Parsed angle, or null if parsing failed
   */
  angle: Angle | null;
  /**
   * Error message if parsing failed, or null if successful
   */
  error: string | null;
}

/**
 * Parse an angle input string
 * @param input Input string to parse
 * @param currentUnit Current angle unit (used when no unit is specified)
 * @returns ParseAngleResult with parsed angle or error message
 */
export function parseAngleInput(
  input: string,
  currentUnit: AngleUnit = 'radians'
): ParseAngleResult {
  // Trim whitespace
  const trimmed = input.trim();
  
  // Empty input
  if (trimmed === '') {
    return {
      angle: null,
      error: 'Angle input cannot be empty',
    };
  }

  // Try to parse as fraction of π (e.g., "π/6", "pi/6", "PI/4")
  const piFractionMatch = trimmed.match(/^(pi|π|PI)\s*\/\s*(\d+(?:\.\d+)?)$/i);
  if (piFractionMatch) {
    const denominator = parseFloat(piFractionMatch[2]);
    if (denominator === 0) {
      return {
        angle: null,
        error: 'Cannot divide by zero',
      };
    }
    const radians = PI / denominator;
    return {
      angle: new Angle(radians, 'radians'),
      error: null,
    };
  }

  // Try to parse as number with unit (e.g., "30deg", "1.2rad", "30°")
  const unitMatch = trimmed.match(/^(-?\d+(?:\.\d+)?)\s*(deg|degrees?|°|rad|radians?)$/i);
  if (unitMatch) {
    const value = parseFloat(unitMatch[1]);
    const unitStr = unitMatch[2].toLowerCase();
    
    if (!Number.isFinite(value)) {
      return {
        angle: null,
        error: `Invalid number: ${unitMatch[1]}`,
      };
    }

    // Determine unit
    let unit: AngleUnit;
    if (unitStr.startsWith('deg') || unitStr === '°') {
      unit = 'degrees';
    } else if (unitStr.startsWith('rad')) {
      unit = 'radians';
    } else {
      return {
        angle: null,
        error: `Unknown unit: ${unitMatch[2]}`,
      };
    }

    return {
      angle: new Angle(value, unit),
      error: null,
    };
  }

  // Try to parse as plain number (assumes current unit)
  const numberMatch = trimmed.match(/^(-?\d+(?:\.\d+)?)$/);
  if (numberMatch) {
    const value = parseFloat(numberMatch[1]);
    
    if (!Number.isFinite(value)) {
      return {
        angle: null,
        error: `Invalid number: ${numberMatch[1]}`,
      };
    }

    return {
      angle: new Angle(value, currentUnit),
      error: null,
    };
  }

  // If no pattern matches, return error
  return {
    angle: null,
    error: `Invalid angle format: "${input}". Expected formats: "30", "30deg", "π/6", "1.2rad"`,
  };
}

/**
 * Format an angle for display in input field
 * @param angle Angle to format
 * @param unit Unit to display
 * @returns Formatted string
 */
export function formatAngleForInput(angle: Angle, unit: AngleUnit): string {
  if (unit === 'degrees') {
    return angle.toDegrees().toFixed(2);
  } else {
    const rad = angle.toRadians();
    // Try to show as fraction of π if it's a common angle
    if (Math.abs(rad) < 0.0001) return '0';
    if (Math.abs(rad - PI) < 0.0001) return 'π';
    if (Math.abs(rad - 2 * PI) < 0.0001) return '2π';
    if (Math.abs(rad - PI / 2) < 0.0001) return 'π/2';
    if (Math.abs(rad - (3 * PI) / 2) < 0.0001) return '3π/2';
    if (Math.abs(rad - PI / 3) < 0.0001) return 'π/3';
    if (Math.abs(rad - PI / 4) < 0.0001) return 'π/4';
    if (Math.abs(rad - PI / 6) < 0.0001) return 'π/6';
    return rad.toFixed(4);
  }
}

/**
 * Result of normalization detection
 */
export interface NormalizationInfo {
  /**
   * Whether normalization occurred
   */
  wasNormalized: boolean;
  /**
   * Number of full rotations (positive for positive angles, negative for negative)
   */
  rotations: number;
  /**
   * User-friendly message describing the normalization
   */
  message: string;
}

/**
 * Detect if an angle was normalized and calculate rotation information
 * @param originalValue The original input value before normalization
 * @param normalizedAngle The normalized angle
 * @param originalUnit The unit of the original value
 * @returns NormalizationInfo with details about the normalization
 */
export function detectNormalization(
  originalValue: number,
  normalizedAngle: Angle,
  originalUnit: AngleUnit
): NormalizationInfo {
  const normalizedValue = originalUnit === 'degrees' 
    ? normalizedAngle.toDegrees() 
    : normalizedAngle.toRadians();
  
  // Check if normalization occurred (values differ significantly)
  const tolerance = originalUnit === 'degrees' ? 0.01 : 0.0001;
  const wasNormalized = Math.abs(originalValue - normalizedValue) > tolerance;
  
  if (!wasNormalized) {
    return {
      wasNormalized: false,
      rotations: 0,
      message: '',
    };
  }
  
  // Calculate number of rotations
  // For positive: Math.floor gives the number of complete rotations
  // For negative: Math.floor also works correctly (e.g., -30/360 = -0.083, floor = -1)
  let rotations: number;
  if (originalUnit === 'degrees') {
    rotations = Math.floor(originalValue / 360);
  } else {
    rotations = Math.floor(originalValue / TWO_PI);
  }
  
  // Format the message
  const originalFormatted = originalUnit === 'degrees' 
    ? `${originalValue.toFixed(2)}°`
    : `${originalValue.toFixed(4)} rad`;
  
  const normalizedFormatted = originalUnit === 'degrees'
    ? `${normalizedValue.toFixed(2)}°`
    : `${normalizedValue.toFixed(4)} rad`;
  
  const rotationText = Math.abs(rotations) === 1 ? 'rotation' : 'rotations';
  const message = `${originalFormatted} normalized to ${normalizedFormatted} (${Math.abs(rotations)} full ${rotationText})`;
  
  return {
    wasNormalized: true,
    rotations,
    message,
  };
}
