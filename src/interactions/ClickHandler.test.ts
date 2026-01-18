/**
 * Tests for ClickHandler
 * Per milestone 4: Integration tests for click interaction
 */

import { describe, it, expect, vi } from 'vitest';
import { handleCircleClick, isClickOnCircle } from './ClickHandler';

describe('ClickHandler', () => {
  describe('handleCircleClick', () => {
    // Create a mock SVG element
    const createMockSvg = (): SVGSVGElement => {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 400 400');
      // Mock getBoundingClientRect
      svg.getBoundingClientRect = vi.fn(() => ({
        left: 0,
        top: 0,
        width: 400,
        height: 400,
        right: 400,
        bottom: 400,
        x: 0,
        y: 0,
        toJSON: vi.fn(),
      }));
      return svg;
    };

    it('should return angle 0 for click on positive x-axis (right side)', () => {
      const svg = createMockSvg();
      const event = {
        clientX: 350, // Right side of circle (x = 200 + 150 = 350)
        clientY: 200, // Center y
      } as MouseEvent;

      const angle = handleCircleClick(event, svg);
      expect(angle).not.toBeNull();
      expect(angle?.toRadians()).toBeCloseTo(0, 3);
    });

    it('should return π/2 for click on positive y-axis (top)', () => {
      const svg = createMockSvg();
      const event = {
        clientX: 200, // Center x
        clientY: 50, // Top of circle (y = 200 - 150 = 50)
      } as MouseEvent;

      const angle = handleCircleClick(event, svg);
      expect(angle).not.toBeNull();
      expect(angle?.toRadians()).toBeCloseTo(Math.PI / 2, 3);
    });

    it('should return π for click on negative x-axis (left side)', () => {
      const svg = createMockSvg();
      const event = {
        clientX: 50, // Left side of circle (x = 200 - 150 = 50)
        clientY: 200, // Center y
      } as MouseEvent;

      const angle = handleCircleClick(event, svg);
      expect(angle).not.toBeNull();
      expect(angle?.toRadians()).toBeCloseTo(Math.PI, 3);
    });

    it('should return 3π/2 for click on negative y-axis (bottom)', () => {
      const svg = createMockSvg();
      const event = {
        clientX: 200, // Center x
        clientY: 350, // Bottom of circle (y = 200 + 150 = 350)
      } as MouseEvent;

      const angle = handleCircleClick(event, svg);
      expect(angle).not.toBeNull();
      expect(angle?.toRadians()).toBeCloseTo((3 * Math.PI) / 2, 3);
    });

    it('should snap to circle when click is outside and snapToCircle is true', () => {
      const svg = createMockSvg();
      const event = {
        clientX: 500, // Way outside circle (to the right)
        clientY: 200, // Center y
      } as MouseEvent;

      const angle = handleCircleClick(event, svg, { snapToCircle: true });
      expect(angle).not.toBeNull();
      // Should snap to angle 0 (positive x-axis)
      expect(angle?.toRadians()).toBeCloseTo(0, 3);
    });

    it('should return null when click is outside and snapToCircle is false', () => {
      const svg = createMockSvg();
      const event = {
        clientX: 500, // Way outside circle
        clientY: 200,
      } as MouseEvent;

      const angle = handleCircleClick(event, svg, { snapToCircle: false });
      expect(angle).toBeNull();
    });

    it('should handle click at origin (center)', () => {
      const svg = createMockSvg();
      const event = {
        clientX: 200, // Center
        clientY: 200, // Center
      } as MouseEvent;

      const angle = handleCircleClick(event, svg);
      expect(angle).not.toBeNull();
      // Should default to angle 0 when at origin
      expect(angle?.toRadians()).toBeCloseTo(0, 3);
    });

    it('should normalize angle to [0, 2π)', () => {
      const svg = createMockSvg();
      // Click at angle that would give negative radians from atan2
      // Click at -45 degrees (7π/4 or -π/4)
      const event = {
        clientX: 200 + 150 * Math.cos(-Math.PI / 4), // -45 degrees
        clientY: 200 - 150 * Math.sin(-Math.PI / 4), // Invert for SVG
      } as MouseEvent;

      const angle = handleCircleClick(event, svg);
      expect(angle).not.toBeNull();
      // Should be normalized to [0, 2π), so -π/4 becomes 7π/4
      expect(angle?.toRadians()).toBeCloseTo((7 * Math.PI) / 4, 3);
    });
  });

  describe('isClickOnCircle', () => {
    it('should return true for click on circle', () => {
      // Click at (350, 200) - on the right side of circle
      expect(isClickOnCircle(350, 200)).toBe(true);
    });

    it('should return true for click within tolerance', () => {
      // Click slightly outside circle but within tolerance
      expect(isClickOnCircle(360, 200, 20)).toBe(true);
    });

    it('should return false for click far outside circle', () => {
      expect(isClickOnCircle(500, 200, 10)).toBe(false);
    });
  });
});
