/**
 * ErrorHandler class
 * Per spec Section 4.3.7: Error handling utilities and user feedback
 * Per milestone 6: Complete ErrorHandler implementation
 * Per milestone 16: Enhanced with structured logging (DEBUG/INFO/WARN/ERROR/FATAL)
 */

export type ErrorType = 'error' | 'warning' | 'info';

/**
 * Log levels per spec Section 4.3.8
 * DEBUG: Detailed debugging information (development only)
 * INFO: General informational messages
 * WARN: Warning messages for potential issues
 * ERROR: Error messages for handled errors
 * FATAL: Critical errors that may cause application failure
 */
export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';

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
 * Per milestone 16: Enhanced with structured logging
 */
export class ErrorHandler {
  private userMessageCallback: UserMessageCallback | null = null;
  private logLevel: LogLevel = import.meta.env.DEV ? 'DEBUG' : 'WARN';
  private sessionId: string;

  constructor() {
    // Generate anonymous session ID for error tracking
    // Per spec Section 4.3.8: User session ID (anonymous, no PII)
    this.sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Set the minimum log level
   * Per spec Section 4.3.8: Development vs Production log levels
   */
  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  /**
   * Get the current log level
   */
  getLogLevel(): LogLevel {
    return this.logLevel;
  }

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
    this.log('ERROR', errorMessage, {
      component: context,
      action: 'calculation',
      state: { errorStack: error.stack },
    });
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
    
    // Create user-friendly error message
    const userMessage = `Invalid input: "${invalidInput}". ${expectedFormat}`;
    this.showUserMessage(userMessage, 'error');
    
    // Log error
    this.log('WARN', errorMessage, {
      component: 'AngleControls',
      action: 'inputValidation',
      state: { invalidInput, expectedFormat },
    });
  }

  /**
   * Handle rendering errors (SVG failures, KaTeX rendering errors)
   * Per spec Section 8.3.3
   */
  handleRenderingError(error: Error, element: string): void {
    const errorMessage = `Rendering error in ${element}: ${error.message}`;
    this.log('ERROR', errorMessage, {
      component: element,
      action: 'rendering',
      state: { errorStack: error.stack },
    });
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
    // Log to console with appropriate level
    const logLevel: LogLevel = type === 'error' ? 'ERROR' :
                                type === 'warning' ? 'WARN' :
                                'INFO';
    this.log(logLevel, `User message: ${message}`, {
      component: 'ErrorHandler',
      action: 'showUserMessage',
    });

    // Call registered callback if available
    if (this.userMessageCallback) {
      this.userMessageCallback(message, type);
    }
  }

  /**
   * Log message with structured format
   * Per spec Section 4.3.8: Structured logging with levels
   */
  log(level: LogLevel, message: string, context?: ErrorContext): void {
    const levelOrder: LogLevel[] = ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL'];
    const currentLevelIndex = levelOrder.indexOf(this.logLevel);
    const messageLevelIndex = levelOrder.indexOf(level);

    // Only log if message level is at or above current log level
    if (messageLevelIndex < currentLevelIndex) {
      return;
    }

    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      sessionId: this.sessionId,
      component: context?.component || 'unknown',
      action: context?.action || 'unknown',
      message,
      state: context?.state,
      browser: typeof navigator !== 'undefined' ? {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
      } : undefined,
    };

    // Log to console with appropriate method
    const logMethod = level === 'DEBUG' ? console.debug :
                      level === 'INFO' ? console.info :
                      level === 'WARN' ? console.warn :
                      level === 'ERROR' ? console.error :
                      console.error; // FATAL uses error

    logMethod(`[${level}]`, message, logEntry);

    // Future: Send to error tracking service (Sentry, Rollbar, etc.)
    // if (import.meta.env.PROD && (level === 'ERROR' || level === 'FATAL')) {
    //   errorTrackingService.captureException(new Error(message), { extra: logEntry });
    // }
  }

  /**
   * Log error with structured format
   * Per spec Section 4.3.8
   * @deprecated Use log() with ERROR level instead
   */
  logError(error: Error, context: ErrorContext): void {
    this.log('ERROR', error.message, {
      ...context,
      state: {
        ...context.state,
        stack: error.stack,
      },
    });
  }

  /**
   * Log debug message
   */
  debug(message: string, context?: ErrorContext): void {
    this.log('DEBUG', message, context);
  }

  /**
   * Log info message
   */
  info(message: string, context?: ErrorContext): void {
    this.log('INFO', message, context);
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: ErrorContext): void {
    this.log('WARN', message, context);
  }

  /**
   * Log error message
   */
  error(message: string, context?: ErrorContext): void {
    this.log('ERROR', message, context);
  }

  /**
   * Log fatal error message
   */
  fatal(message: string, context?: ErrorContext): void {
    this.log('FATAL', message, context);
  }
}

// Singleton instance
export const errorHandler = new ErrorHandler();
