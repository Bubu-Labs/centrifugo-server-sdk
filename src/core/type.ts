import { CentrifugoQueueConfig } from "@queue/index";
import { CentrifugoAPIClient, CentrifugoGRPCClient } from "main";

export enum CentrifugoMode {
    API = "API",
    GRPC = "GRPC",
}

// Union type for mode - accept both enum values and string literals
export type CentrifugoModeType = CentrifugoMode | "API" | "GRPC";

export interface CentrifugoConfig {
    mode: CentrifugoModeType;
    endpoint: string;
    apiKey?: string; // API key for authentication
    enableQueue?: boolean;
    queueConfig?: CentrifugoQueueConfig;
    debug?: boolean; // Enable debug logging
    logLevel?: "error" | "warn" | "info" | "debug"; // Log level (default: info)
}

export type CentrifugoClient = CentrifugoAPIClient | CentrifugoGRPCClient;
