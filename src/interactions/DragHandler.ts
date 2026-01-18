/**
 * DragHandler for unit circle drag interaction
 * Per milestone 5: Drag interaction
 * Per spec Section 2.1.1: Drag interaction
 */

import { Angle } from '../core/Angle';
import { eventToSvgCoordinates, angleFromSvgCoordinates } from '../utils/coordinateUtils';

/**
 * Options for drag handler behavior
 */
export interface DragHandlerOptions {
  /**
   * Throttle updates to target FPS (default: 60)
   * Uses requestAnimationFrame for smooth updates
   */
  targetFPS?: number;
  /**
   * Lock point to unit circle during drag (default: true)
   */
  lockToCircle?: boolean;
}


/**
 * Drag handler state
 */
interface DragState {
  isDragging: boolean;
  animationFrameId: number | null;
  lastUpdateTime: number;
}

/**
 * Create a drag handler for unit circle interaction
 * @param svgElement The SVG element to attach drag handlers to
 * @param onAngleChange Callback when angle changes during drag
 * @param options Drag handler options
 * @returns Cleanup function to remove event listeners
 */
export function createDragHandler(
  svgElement: SVGSVGElement,
  onAngleChange: (angle: Angle) => void,
  options: DragHandlerOptions = {}
): () => void {
  const { targetFPS = 60, lockToCircle = true } = options;
  const minFrameTime = 1000 / targetFPS; // Minimum time between updates in ms

  const state: DragState = {
    isDragging: false,
    animationFrameId: null,
    lastUpdateTime: 0,
  };

  /**
   * Update angle during drag with throttling
   */
  const updateAngle = (event: PointerEvent) => {
    const now = performance.now();
    const timeSinceLastUpdate = now - state.lastUpdateTime;

    // Throttle updates to target FPS
    if (timeSinceLastUpdate < minFrameTime && state.animationFrameId === null) {
      state.animationFrameId = requestAnimationFrame(() => {
        state.animationFrameId = null;
        updateAngle(event);
      });
      return;
    }

    // Calculate pointer position relative to SVG
    const { x: svgX, y: svgY } = eventToSvgCoordinates(event, svgElement);

    // Calculate angle and update
    const angle = angleFromSvgCoordinates(svgX, svgY, { normalizeToCircle: lockToCircle });
    onAngleChange(angle);

    state.lastUpdateTime = now;
  };

  /**
   * Handle pointer down - start drag
   */
  const handlePointerDown = (event: PointerEvent) => {
    // Only handle left mouse button or primary pointer
    if (event.button !== 0 && event.pointerType !== 'touch') {
      return;
    }

    state.isDragging = true;
    state.lastUpdateTime = performance.now();

    // Capture pointer to receive events even if pointer leaves element
    svgElement.setPointerCapture(event.pointerId);

    // Update angle immediately on pointer down
    updateAngle(event);

    // Prevent default to avoid text selection and other browser behaviors
    event.preventDefault();
  };

  /**
   * Handle pointer move - update during drag
   */
  const handlePointerMove = (event: PointerEvent) => {
    if (!state.isDragging) {
      return;
    }

    updateAngle(event);
  };

  /**
   * Handle pointer up - end drag
   */
  const handlePointerUp = (event: PointerEvent) => {
    if (!state.isDragging) {
      return;
    }

    state.isDragging = false;

    // Release pointer capture
    if (svgElement.hasPointerCapture(event.pointerId)) {
      svgElement.releasePointerCapture(event.pointerId);
    }

    // Cancel any pending animation frame
    if (state.animationFrameId !== null) {
      cancelAnimationFrame(state.animationFrameId);
      state.animationFrameId = null;
    }

    // Final update on pointer up
    updateAngle(event);
  };

  /**
   * Handle pointer cancel - end drag (e.g., pointer leaves viewport)
   */
  const handlePointerCancel = (event: PointerEvent) => {
    if (!state.isDragging) {
      return;
    }

    state.isDragging = false;

    // Release pointer capture
    if (svgElement.hasPointerCapture(event.pointerId)) {
      svgElement.releasePointerCapture(event.pointerId);
    }

    // Cancel any pending animation frame
    if (state.animationFrameId !== null) {
      cancelAnimationFrame(state.animationFrameId);
      state.animationFrameId = null;
    }
  };

  // Attach event listeners
  svgElement.addEventListener('pointerdown', handlePointerDown);
  svgElement.addEventListener('pointermove', handlePointerMove);
  svgElement.addEventListener('pointerup', handlePointerUp);
  svgElement.addEventListener('pointercancel', handlePointerCancel);

  // Return cleanup function
  return () => {
    // Remove event listeners
    svgElement.removeEventListener('pointerdown', handlePointerDown);
    svgElement.removeEventListener('pointermove', handlePointerMove);
    svgElement.removeEventListener('pointerup', handlePointerUp);
    svgElement.removeEventListener('pointercancel', handlePointerCancel);

    // Cancel any pending animation frame
    if (state.animationFrameId !== null) {
      cancelAnimationFrame(state.animationFrameId);
      state.animationFrameId = null;
    }

    // Release any active pointer captures
    if (state.isDragging) {
      // Note: We can't release specific captures here, but they should be released
      // when the pointer is released naturally
      state.isDragging = false;
    }
  };
}
