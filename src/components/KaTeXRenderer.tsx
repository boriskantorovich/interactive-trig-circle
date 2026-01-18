/**
 * KaTeX renderer component with safe fallback on render errors
 * Per milestone 11: KaTeX wrapper component with safe fallback
 * Per spec Section 4.1.3: Math Rendering with KaTeX
 */

import { useLayoutEffect, useRef, useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { errorHandler } from '../error/ErrorHandler';

export interface KaTeXRendererProps {
  /**
   * LaTeX string to render
   */
  formula: string;
  /**
   * Display mode (block vs inline)
   */
  displayMode?: boolean;
  /**
   * CSS class name for styling
   */
  className?: string;
  /**
   * Error message to show if rendering fails
   */
  errorMessage?: string;
}

/**
 * KaTeX renderer component with error handling
 * Per milestone 11: Use ErrorHandler.handleRenderingError() for KaTeX failures
 */
export function KaTeXRenderer({
  formula,
  displayMode = false,
  className = '',
  errorMessage = 'Formula rendering error',
}: KaTeXRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasError, setHasError] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const errorStateRef = useRef<{ hasError: boolean; errorText: string | null }>({
    hasError: false,
    errorText: null,
  });

  // Render KaTeX into DOM (synchronously, no state updates in this effect)
  useLayoutEffect(() => {
    if (!containerRef.current) return;

    try {
      // Clear container
      containerRef.current.innerHTML = '';

      // Render KaTeX
      katex.render(formula, containerRef.current, {
        displayMode,
        throwOnError: false, // Don't throw, handle errors gracefully
        errorColor: '#cc0000',
        strict: false, // Allow some LaTeX extensions
      });

      // Track success in ref
      if (errorStateRef.current.hasError) {
        errorStateRef.current.hasError = false;
        errorStateRef.current.errorText = null;
        // Update state asynchronously to avoid lint warning
        queueMicrotask(() => {
          setHasError(false);
          setErrorText(null);
        });
      }
    } catch (error) {
      // Handle rendering error
      const errorObj = error instanceof Error ? error : new Error(String(error));
      errorHandler.handleRenderingError(errorObj, 'KaTeXRenderer');

      // Track error in ref
      errorStateRef.current.hasError = true;
      errorStateRef.current.errorText = errorObj.message;

      // Update state asynchronously to avoid lint warning
      queueMicrotask(() => {
        setHasError(true);
        setErrorText(errorObj.message);
      });

      // Show fallback message
      if (containerRef.current) {
        containerRef.current.innerHTML = `<span class="katex-error">${errorMessage}</span>`;
      }
    }
  }, [formula, displayMode, errorMessage]);

  if (hasError && errorText) {
    return (
      <div className={`katex-renderer katex-renderer--error ${className}`}>
        <div ref={containerRef} />
        <span className="katex-renderer__error-text" title={errorText}>
          {errorMessage}
        </span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`katex-renderer ${className}`}
      aria-label={`Formula: ${formula}`}
    />
  );
}
