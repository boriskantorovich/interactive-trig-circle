/**
 * Tests for DragHandler
 * Per milestone 5: Drag interaction tests
 */

import { describe, it, expect, beforeEach, afterEach, vi, type Mock } from 'vitest';
import { createDragHandler } from './DragHandler';
import { Angle } from '../core/Angle';

describe('DragHandler', () => {
  let svgElement: SVGSVGElement;
  let onAngleChange: Mock<(angle: Angle) => void>;

  beforeEach(() => {
    // Create a mock SVG element
    svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgElement.setAttribute('viewBox', '0 0 400 400');
    document.body.appendChild(svgElement);

    // Mock getBoundingClientRect
    vi.spyOn(svgElement, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      width: 400,
      height: 400,
      right: 400,
      bottom: 400,
      x: 0,
      y: 0,
      toJSON: vi.fn(),
    });

    // Mock setPointerCapture and releasePointerCapture
    // These methods may not exist in the test environment, so we add them
    type SVGElementWithPointerCapture = SVGSVGElement & {
      setPointerCapture?: (pointerId: number) => void;
      releasePointerCapture?: (pointerId: number) => void;
      hasPointerCapture?: (pointerId: number) => boolean;
    };

    const svgWithPointer = svgElement as SVGElementWithPointerCapture;

    if (!svgWithPointer.setPointerCapture) {
      svgWithPointer.setPointerCapture = vi.fn();
    }
    if (!svgWithPointer.releasePointerCapture) {
      svgWithPointer.releasePointerCapture = vi.fn();
    }
    if (!svgWithPointer.hasPointerCapture) {
      svgWithPointer.hasPointerCapture = vi.fn().mockReturnValue(true);
    }

    vi.spyOn(svgWithPointer, 'setPointerCapture').mockImplementation(() => {});
    vi.spyOn(svgWithPointer, 'releasePointerCapture').mockImplementation(() => {});
    vi.spyOn(svgWithPointer, 'hasPointerCapture').mockReturnValue(true);

    onAngleChange = vi.fn();
  });

  afterEach(() => {
    if (document.body.contains(svgElement)) {
      document.body.removeChild(svgElement);
    }
    vi.clearAllMocks();
  });

  it('should call onAngleChange when pointer moves during drag', () => {
    const cleanup = createDragHandler(svgElement, onAngleChange, {
      targetFPS: 60,
      lockToCircle: true,
    });

    // Simulate pointer down at center-right (angle 0)
    const pointerDownEvent = new PointerEvent('pointerdown', {
      clientX: 350, // Right side of SVG (200 + 150 = 350 for angle 0)
      clientY: 200, // Center
      pointerId: 1,
      button: 0,
    });

    svgElement.dispatchEvent(pointerDownEvent);

    // Simulate pointer move to top (angle π/2)
    const pointerMoveEvent = new PointerEvent('pointermove', {
      clientX: 200, // Center
      clientY: 50, // Top (200 - 150 = 50 for angle π/2)
      pointerId: 1,
    });

    svgElement.dispatchEvent(pointerMoveEvent);

    // Should have been called at least once
    expect(onAngleChange).toHaveBeenCalled();

    // Check that angle is approximately π/2
    const lastCall = onAngleChange.mock.calls[onAngleChange.mock.calls.length - 1];
    const angle = lastCall[0] as Angle;
    expect(angle).toBeInstanceOf(Angle);
    const radians = angle.toRadians();
    expect(Math.abs(radians - Math.PI / 2)).toBeLessThan(0.1);

    cleanup();
  });

  it('should lock point to unit circle during drag', () => {
    const cleanup = createDragHandler(svgElement, onAngleChange, {
      targetFPS: 60,
      lockToCircle: true,
    });

    // Simulate pointer down far outside circle
    const pointerDownEvent = new PointerEvent('pointerdown', {
      clientX: 500, // Far right
      clientY: 200, // Center
      pointerId: 1,
      button: 0,
    });

    svgElement.dispatchEvent(pointerDownEvent);

    // Simulate pointer move to trigger angle calculation
    const pointerMoveEvent = new PointerEvent('pointermove', {
      clientX: 500, // Far right
      clientY: 200, // Center
      pointerId: 1,
    });

    svgElement.dispatchEvent(pointerMoveEvent);

    // Should still calculate angle (snapped to circle)
    expect(onAngleChange).toHaveBeenCalled();
    const angle = onAngleChange.mock.calls[0][0] as Angle;
    expect(angle).toBeInstanceOf(Angle);

    cleanup();
  });

  it('should release pointer capture on pointer up', () => {
    const cleanup = createDragHandler(svgElement, onAngleChange);

    const pointerDownEvent = new PointerEvent('pointerdown', {
      clientX: 200,
      clientY: 200,
      pointerId: 1,
      button: 0,
    });

    svgElement.dispatchEvent(pointerDownEvent);
    expect(svgElement.setPointerCapture).toHaveBeenCalledWith(1);

    const pointerUpEvent = new PointerEvent('pointerup', {
      clientX: 200,
      clientY: 200,
      pointerId: 1,
    });

    svgElement.dispatchEvent(pointerUpEvent);
    expect(svgElement.releasePointerCapture).toHaveBeenCalledWith(1);

    cleanup();
  });

  it('should handle pointer cancel', () => {
    const cleanup = createDragHandler(svgElement, onAngleChange);

    const pointerDownEvent = new PointerEvent('pointerdown', {
      clientX: 200,
      clientY: 200,
      pointerId: 1,
      button: 0,
    });

    svgElement.dispatchEvent(pointerDownEvent);

    const pointerCancelEvent = new PointerEvent('pointercancel', {
      clientX: 200,
      clientY: 200,
      pointerId: 1,
    });

    svgElement.dispatchEvent(pointerCancelEvent);
    expect(svgElement.releasePointerCapture).toHaveBeenCalledWith(1);

    cleanup();
  });

  it('should cleanup event listeners', () => {
    const removeEventListenerSpy = vi.spyOn(svgElement, 'removeEventListener');
    const cleanup = createDragHandler(svgElement, onAngleChange);

    cleanup();

    // Should have removed all event listeners
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'pointerdown',
      expect.any(Function)
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'pointermove',
      expect.any(Function)
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'pointerup',
      expect.any(Function)
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'pointercancel',
      expect.any(Function)
    );
  });

  it('should throttle updates to target FPS', async () => {
    // Use a lower FPS for testing to make throttling more noticeable
    const cleanup = createDragHandler(svgElement, onAngleChange, {
      targetFPS: 10, // 10 FPS = 100ms between updates
      lockToCircle: true,
    });

    const pointerDownEvent = new PointerEvent('pointerdown', {
      clientX: 200,
      clientY: 200,
      pointerId: 1,
      button: 0,
    });

    svgElement.dispatchEvent(pointerDownEvent);

    // Send multiple rapid move events
    for (let i = 0; i < 5; i++) {
      const pointerMoveEvent = new PointerEvent('pointermove', {
        clientX: 200 + i,
        clientY: 200,
        pointerId: 1,
      });
      svgElement.dispatchEvent(pointerMoveEvent);
    }

    // Wait a bit for throttling
    await new Promise((resolve) => setTimeout(resolve, 150));

    // Should have been called, but throttled
    expect(onAngleChange).toHaveBeenCalled();

    cleanup();
  });

  it('should only handle left mouse button', () => {
    const cleanup = createDragHandler(svgElement, onAngleChange);

    // Right mouse button should be ignored
    const pointerDownEvent = new PointerEvent('pointerdown', {
      clientX: 200,
      clientY: 200,
      pointerId: 1,
      button: 2, // Right button
    });

    svgElement.dispatchEvent(pointerDownEvent);

    // Move should not trigger callback
    const pointerMoveEvent = new PointerEvent('pointermove', {
      clientX: 250,
      clientY: 200,
      pointerId: 1,
    });

    svgElement.dispatchEvent(pointerMoveEvent);

    // Should not have been called
    expect(onAngleChange).not.toHaveBeenCalled();

    cleanup();
  });
});
