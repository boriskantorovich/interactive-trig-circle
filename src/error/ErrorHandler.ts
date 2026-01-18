/**
 * ErrorHandler class
 * Per spec Section 4.3.7: Error handling utilities and user feedback
 * Per milestone 6: Complete ErrorHandler implementation
 */

export type ErrorType = 'error' | 'warning' | 'info';

export interface ErrorContext {
  component?: string;
  action?: string;
  state?: Record<string, unknown>;
}

/**
 * User message callback type
 * Components can register callbacks to display user messages
 */
export type UserMessageCallback = (message: string, type: ErrorType) => void;

/**
 * ErrorHandler class for handling calculation errors, input validation, and user feedback
 * Per spec Section 4.3.7
 */
export class ErrorHandler {
  private userMessageCallback: UserMessageCallback | null = null;

  /**
   * Register a callback for displaying user messages
   * Components should call this to receive error messages
   */
  setUserMessageCallback(callback: UserMessageCallback): void {
    this.userMessageCallback = callback;
  }

  /**
   * Remove the user message callback
   */
  clearUserMessageCallback(): void {
    this.userMessageCallback = null;
  }

  /**
   * Handle calculation errors (mathematical edge cases, undefined values)
   * Per spec Section 8.3.2
   */
  handleCalculationError(error: Error, context: string): void {
    const errorMessage = `Calculation error in ${context}: ${error.message}`;
    console.error(errorMessage, error);
    this.logError(error, { component: context, action: 'calculation' });
    this.showUserMessage(
      `A calculation error occurred: ${error.message}`,
      'error'
    );
  }

  /**
   * Handle input validation errors (user input format issues)
   * Per spec Section 8.3.1
   * Per milestone 6: Complete implementation for angle input validation
   */
  handleInputError(invalidInput: string, expectedFormat: string): void {
    const errorMessage = `Input validation error: "${invalidInput}" does not match expected format: ${expectedFormat}`;
    console.error(errorMessage);
    
    // Create user-friendly error message
    const userMessage = `Invalid input: "${invalidInput}". ${expectedFormat}`;
    this.showUserMessage(userMessage, 'error');
    
    // Log error
    this.logError(
      new Error(errorMessage),
      {
        component: 'AngleControls',
        action: 'inputValidation',
        state: { invalidInput, expectedFormat },
      }
    );
  }

  /**
   * Handle rendering errors (SVG failures, KaTeX rendering errors)
   * Per spec Section 8.3.3
   */
  handleRenderingError(error: Error, element: string): void {
    const errorMessage = `Rendering error in ${element}: ${error.message}`;
    console.error(errorMessage, error);
    this.logError(error, { component: element, action: 'rendering' });
    this.showUserMessage(
      `A rendering error occurred: ${error.message}`,
      'error'
    );
  }

  /**
   * Show user-friendly error message
   * Per spec Section 8.3.4
   * Per milestone 6: Complete implementation with callback support
   */
  showUserMessage(message: string, type: ErrorType): void {
    // Log to console in development
    if (import.meta.env.DEV) {
      console.log(`[${type.toUpperCase()}] ${message}`);
    }

    // Call registered callback if available
    if (this.userMessageCallback) {
      this.userMessageCallback(message, type);
    }
  }

  /**
   * Log error with structured format
   * Per spec Section 4.3.8
   */
  logError(error: Error, context: ErrorContext): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      component: context.component || 'unknown',
      action: context.action || 'unknown',
      message: error.message,
      stack: error.stack,
      state: context.state,
    };
    
    // Log to console (structured format)
    console.error('Structured error log:', JSON.stringify(logEntry, null, 2));
    
    // Future: Send to error tracking service (Sentry, Rollbar, etc.)
    // if (import.meta.env.PROD) {
    //   errorTrackingService.captureException(error, { extra: logEntry });
    // }
  }
}

// Singleton instance
export const errorHandler = new ErrorHandler();
