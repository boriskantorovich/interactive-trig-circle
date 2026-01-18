/**
 * SliderHandler for angle slider interaction
 * Per milestone 6: Slider interaction
 * Per spec Section 2.6: Angle Input Methods - Slider
 */

import { Angle } from '../core/Angle';
import type { AngleUnit } from '../state/AppState';

/**
 * Options for slider handler
 */
export interface SliderHandlerOptions {
  /**
   * Minimum angle value (in current unit)
   * Default: 0
   */
  min?: number;
  /**
   * Maximum angle value (in current unit)
   * Default: 360 for degrees, 2π for radians
   */
  max?: number;
  /**
   * Step size for slider (in current unit)
   * Default: 1 for degrees, 0.01 for radians
   */
  step?: number;
}

/**
 * Get default slider options based on angle unit
 * @param unit Current angle unit
 * @returns Default slider options
 */
export function getDefaultSliderOptions(unit: AngleUnit): Required<SliderHandlerOptions> {
  if (unit === 'degrees') {
    return {
      min: 0,
      max: 360,
      step: 1,
    };
  } else {
    return {
      min: 0,
      max: 2 * Math.PI,
      step: 0.01,
    };
  }
}

/**
 * Tolerance for detecting max slider values
 * Used to handle 0° = 360° and 0 rad = 2π rad equivalence
 */
const MAX_TOLERANCE_DEG = 0.5; // degrees
const MAX_TOLERANCE_RAD = 0.01; // radians

/**
 * Convert slider value to Angle
 * When slider is at max (360° or 2π), convert to 0° for calculations
 * since they're equivalent on the unit circle
 * @param value Slider value (in current unit)
 * @param unit Current angle unit
 * @returns Angle object (0° when at max, for calculations)
 */
export function sliderValueToAngle(value: number, unit: AngleUnit): Angle {
  if (unit === 'degrees') {
    const max = 360;
    // If value is at or very close to max, treat as 0° (they're equivalent)
    if (value >= max - MAX_TOLERANCE_DEG) {
      return new Angle(0, 'degrees');
    }
    return new Angle(value, 'degrees');
  } else {
    const max = 2 * Math.PI;
    // If value is at or very close to max, treat as 0 rad (they're equivalent)
    if (value >= max - MAX_TOLERANCE_RAD) {
      return new Angle(0, 'radians');
    }
    return new Angle(value, 'radians');
  }
}

/**
 * Convert Angle to slider value
 * When angle is 0° (normalized from 360°), show max on slider
 * This prevents slider from jumping when 360° is normalized to 0°
 * @param angle Angle to convert
 * @param unit Current angle unit
 * @param wasAtMax Whether the slider was previously at max (to maintain position)
 * @returns Slider value (in current unit)
 */
export function angleToSliderValue(
  angle: Angle,
  unit: AngleUnit,
  wasAtMax: boolean = false
): number {
  if (unit === 'degrees') {
    const degrees = angle.toDegrees();
    const max = 360;
    // If angle is 0° and we were at max, show max on slider
    // This prevents slider from jumping when 360° is normalized to 0°
    if (Math.abs(degrees) < MAX_TOLERANCE_DEG && wasAtMax) {
      return max;
    }
    // Clamp to max to prevent slider from going beyond
    return Math.min(degrees, max);
  } else {
    const radians = angle.toRadians();
    const max = 2 * Math.PI;
    // If angle is 0 rad and we were at max, show max on slider
    if (Math.abs(radians) < MAX_TOLERANCE_RAD && wasAtMax) {
      return max;
    }
    // Clamp to max to prevent slider from going beyond
    return Math.min(radians, max);
  }
}
