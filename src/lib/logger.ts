/**
 * Logger utility for the Centrifugo SDK
 * Provides configurable logging with support for custom handlers
 */

export type LogLevel = "error" | "warn" | "info" | "debug";

export interface LoggerConfig {
    enabled?: boolean;
    level?: LogLevel;
    prefix?: string;
    handler?: (level: LogLevel, message: string, data?: any) => void;
}

export interface LogContext {
    level: LogLevel;
    message: string;
    data?: any;
    timestamp: string;
    prefix: string;
}

/**
 * Logger class for managing SDK logging
 * 
 * @example
 * ```typescript
 * const logger = new Logger({
 *   enabled: true,
 *   level: "debug",
 *   prefix: "Centrifugo"
 * });
 * 
 * logger.info("Message published", { channel: "chat" });
 * logger.debug("Publishing message", { channel: "chat", data: {...} });
 * logger.error("Failed to publish", { error: "Network error" });
 * ```
 */
export class Logger {
    private enabled: boolean;
    private level: LogLevel;
    private prefix: string;
    private handler: (level: LogLevel, message: string, data?: any) => void;

    private static readonly LEVELS: Record<LogLevel, number> = {
        error: 0,
        warn: 1,
        info: 2,
        debug: 3,
    };

    constructor(config: LoggerConfig = {}) {
        this.enabled = config.enabled ?? true;
        this.level = config.level ?? "info";
        this.prefix = config.prefix ?? "App";
        this.handler = config.handler ?? this.defaultHandler.bind(this);
    }

    /**
     * Set whether logging is enabled
     */
    setEnabled(enabled: boolean): void {
        this.enabled = enabled;
    }

    /**
     * Check if logging is enabled
     */
    isEnabled(): boolean {
        return this.enabled;
    }

    /**
     * Set the log level
     */
    setLevel(level: LogLevel): void {
        this.level = level;
    }

    /**
     * Get the current log level
     */
    getLevel(): LogLevel {
        return this.level;
    }

    /**
     * Set the prefix for all log messages
     */
    setPrefix(prefix: string): void {
        this.prefix = prefix;
    }

    /**
     * Set a custom log handler
     * The handler is called for all log messages that pass the level filter
     * 
     * @example
     * ```typescript
     * logger.setHandler((level, message, data) => {
     *   myLoggingService.log({
     *     level,
     *     message,
     *     data,
     *     timestamp: new Date().toISOString()
     *   });
     * });
     * ```
     */
    setHandler(handler: (level: LogLevel, message: string, data?: any) => void): void {
        this.handler = handler;
    }

    /**
     * Log an error message
     */
    error(message: string, data?: any): void {
        this.log("error", message, data);
    }

    /**
     * Log a warning message
     */
    warn(message: string, data?: any): void {
        this.log("warn", message, data);
    }

    /**
     * Log an info message
     */
    info(message: string, data?: any): void {
        this.log("info", message, data);
    }

    /**
     * Log a debug message
     */
    debug(message: string, data?: any): void {
        this.log("debug", message, data);
    }

    /**
     * Internal log method that checks level and calls handler
     */
    private log(level: LogLevel, message: string, data?: any): void {
        if (!this.enabled) {
            return;
        }

        const levelValue = Logger.LEVELS[level];
        const currentLevelValue = Logger.LEVELS[this.level];

        if (levelValue <= currentLevelValue) {
            this.handler(level, message, data);
        }
    }

    /**
     * Default log handler that outputs to console
     */
    private defaultHandler(level: LogLevel, message: string, data?: any): void {
        const timestamp = new Date().toISOString();
        const prefix = `[${timestamp}] [${this.prefix}] [${level.toUpperCase()}]`;
        const formatted = `${prefix} ${message}`;

        switch (level) {
            case "error":
                console.error(formatted, data);
                break;
            case "warn":
                console.warn(formatted, data);
                break;
            case "info":
                console.log(formatted, data);
                break;
            case "debug":
                console.log(formatted, data);
                break;
        }
    }

    /**
     * Get a context object for the current log state
     * Useful for passing logging context through async operations
     */
    getContext(): Partial<LogContext> {
        return {
            timestamp: new Date().toISOString(),
            prefix: this.prefix,
        };
    }
}

/**
 * Create a child logger with the same configuration but different prefix
 * 
 * @example
 * ```typescript
 * const mainLogger = new Logger({ level: "debug" });
 * const queueLogger = createChildLogger(mainLogger, "Queue");
 * ```
 */
export function createChildLogger(
    parentLogger: Logger,
    prefix: string
): Logger {
    const config: LoggerConfig = {
        enabled: parentLogger.isEnabled(),
        level: parentLogger.getLevel(),
        prefix,
        handler: (level, message, data) => {
            // Delegate to parent's handler for custom implementations
            const parentHandler = (parentLogger as any).handler;
            if (parentHandler) {
                parentHandler(level, message, data);
            }
        },
    };

    return new Logger(config);
}

/**
 * Global logger instance (singleton pattern)
 * Can be configured once and reused throughout the application
 */
let globalLogger: Logger | null = null;

/**
 * Get or create the global logger
 */
export function getGlobalLogger(config?: LoggerConfig): Logger {
    if (!globalLogger) {
        globalLogger = new Logger({
            prefix: "Centrifugo",
            ...config,
        });
    }
    return globalLogger;
}

/**
 * Reset the global logger instance
 * Useful for testing or reconfiguration
 */
export function resetGlobalLogger(): void {
    globalLogger = null;
}
