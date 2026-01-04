import { CentrifugoQueueConfig } from "@queue/index";
import { CentrifugoAPIClient, CentrifugoGRPCClient } from "main";
import type { LogLevel } from "@lib/logger";

export enum CentrifugoMode {
    API = "API",
    GRPC = "GRPC",
}

// Union type for mode - accept both enum values and string literals
export type CentrifugoModeType = CentrifugoMode | "API" | "GRPC";

// Log option interface
export interface LogOption {
    enable?: boolean;
    level?: LogLevel;
}

// Idempotency generator function type
export type IdempotencyGenerator = (data?: unknown) => string;

// Idempotency config
export interface IdempotencyConfig {
    enabled?: boolean;
    generate?: IdempotencyGenerator;
}

export interface CentrifugoConfig {
    mode: CentrifugoModeType;
    endpoint: string;
    apiKey?: string; // API key for authentication
    enableQueue?: boolean;
    queueConfig?: CentrifugoQueueConfig;
    debug?: boolean; // Enable debug logging (deprecated, use logOption instead)
    logLevel?: LogLevel; // Log level (deprecated, use logOption instead)
    logOption?: LogOption; // Enhanced log configuration
    idempotency?: IdempotencyConfig; // Idempotency configuration for publish/broadcast
}

export type CentrifugoClient = CentrifugoAPIClient | CentrifugoGRPCClient;