/**
 * Tests for SliderHandler utilities
 * Per milestone 6: Slider interaction
 */

import { describe, it, expect } from 'vitest';
import { Angle, PI, TWO_PI } from '../core/Angle';
import {
  getDefaultSliderOptions,
  sliderValueToAngle,
  angleToSliderValue,
} from './SliderHandler';

describe('getDefaultSliderOptions', () => {
  it('should return correct options for degrees', () => {
    const options = getDefaultSliderOptions('degrees');
    expect(options.min).toBe(0);
    expect(options.max).toBe(360);
    expect(options.step).toBe(1);
  });

  it('should return correct options for radians', () => {
    const options = getDefaultSliderOptions('radians');
    expect(options.min).toBe(0);
    expect(options.max).toBeCloseTo(TWO_PI, 4);
    expect(options.step).toBe(0.01);
  });
});

describe('sliderValueToAngle', () => {
  it('should convert degrees slider value to Angle', () => {
    const angle = sliderValueToAngle(30, 'degrees');
    expect(angle.toDegrees()).toBeCloseTo(30, 4);
    expect(angle.unit).toBe('degrees');
  });

  it('should convert radians slider value to Angle', () => {
    const angle = sliderValueToAngle(PI / 2, 'radians');
    expect(angle.toRadians()).toBeCloseTo(PI / 2, 4);
    expect(angle.unit).toBe('radians');
  });

  it('should handle zero', () => {
    const angle = sliderValueToAngle(0, 'degrees');
    expect(angle.toDegrees()).toBe(0);
  });

  it('should convert maximum value to 0° for calculations (360° = 0°)', () => {
    const angle = sliderValueToAngle(360, 'degrees');
    // 360° is equivalent to 0° on the unit circle, so we convert it to 0° for calculations
    expect(angle.toDegrees()).toBe(0);
  });

  it('should convert values near maximum to 0° (within tolerance)', () => {
    const angle1 = sliderValueToAngle(359.6, 'degrees');
    expect(angle1.toDegrees()).toBe(0);
    
    const angle2 = sliderValueToAngle(2 * Math.PI - 0.005, 'radians');
    expect(angle2.toRadians()).toBe(0);
  });

  it('should show max on slider when angle is 0° and was at max', () => {
    const angle = Angle.ZERO;
    const value = angleToSliderValue(angle, 'degrees', true);
    expect(value).toBe(360);
  });

  it('should show max on slider when angle is 0 rad and was at max', () => {
    const angle = Angle.ZERO;
    const value = angleToSliderValue(angle, 'radians', true);
    expect(value).toBeCloseTo(2 * Math.PI, 4);
  });

  it('should show 0 on slider when angle is 0° and was not at max', () => {
    const angle = Angle.ZERO;
    const value = angleToSliderValue(angle, 'degrees', false);
    expect(value).toBe(0);
  });
});

describe('angleToSliderValue', () => {
  it('should convert Angle to degrees slider value', () => {
    const angle = Angle.fromDegrees(30);
    const value = angleToSliderValue(angle, 'degrees');
    expect(value).toBeCloseTo(30, 4);
  });

  it('should convert Angle to radians slider value', () => {
    const angle = Angle.fromRadians(PI / 2);
    const value = angleToSliderValue(angle, 'radians');
    expect(value).toBeCloseTo(PI / 2, 4);
  });

  it('should convert degrees angle to radians slider value', () => {
    const angle = Angle.fromDegrees(90);
    const value = angleToSliderValue(angle, 'radians');
    expect(value).toBeCloseTo(PI / 2, 4);
  });

  it('should convert radians angle to degrees slider value', () => {
    const angle = Angle.fromRadians(PI / 2);
    const value = angleToSliderValue(angle, 'degrees');
    expect(value).toBeCloseTo(90, 4);
  });

  it('should handle zero', () => {
    const angle = Angle.ZERO;
    const value = angleToSliderValue(angle, 'degrees');
    expect(value).toBe(0);
  });
});
