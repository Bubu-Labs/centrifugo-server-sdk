import { CentrifugoClient, CentrifugoConfig, CentrifugoMode, CentrifugoModeType } from "@core/type";
import { CentrifugoAPIClient } from "./api";
import { CentrifugoGRPCClient } from "main";
import { GRPCClientConfig } from "./grpc";
import { CentrifugoQueue } from "main";



export class Centrifugo {
    private config: CentrifugoConfig;
    private client: CentrifugoClient;
    private queue: CentrifugoQueue | null = null;
    private mode: CentrifugoMode;
    private debug: boolean;
    private logLevel: "error" | "warn" | "info" | "debug";

    constructor(config: CentrifugoConfig) {
        this.config = config;
        this.debug = config.debug ?? false;
        this.logLevel = config.logLevel ?? "info";
        this.mode =
            config.mode === "API"
                ? CentrifugoMode.API
                : config.mode === "GRPC"
                    ? CentrifugoMode.GRPC
                    : (config.mode as CentrifugoMode);

        this.log("info", `Initializing Centrifugo SDK in ${this.mode} mode`);

        // Initialize the appropriate client
        if (this.mode === CentrifugoMode.API) {
            this.log("debug", `Creating API client for endpoint: ${config.endpoint}`);
            this.client = new CentrifugoAPIClient(config.endpoint, config.apiKey);
        } else {
            this.log("debug", `Creating GRPC client for endpoint: ${config.endpoint}`);
            this.client = new CentrifugoGRPCClient({
                endpoint: config.endpoint,
                apiKey: config.apiKey,
            } as GRPCClientConfig);
        }

        // Initialize queue if enabled
        if (config.enableQueue) {
            this.log("info", "Queue is enabled");
            this.queue = new CentrifugoQueue(config.queueConfig);
        }
    }

    /**
     * Helper method to execute operations with queue support
     */
    private async executeWithQueue(
        jobName: string,
        jobData: Record<string, any>,
        apiAction: () => Promise<void>,
        grpcAction: () => Promise<void>,
        queuedMessage: string,
        successMessage: string,
        errorMessage: string
    ): Promise<void> {
        try {
            if (this.queue) {
                await this.queue.addJob(jobName, jobData);
                this.log("info", queuedMessage);
            } else {
                if (this.mode === CentrifugoMode.API) {
                    await apiAction();
                } else {
                    await grpcAction();
                }
                this.log("info", successMessage);
            }
        } catch (error) {
            this.log("error", errorMessage, error);
            throw error;
        }
    }

    /**
     * Publish a message to a specific channel
     */
    async publish(
        channel: string,
        data: Record<string, any>
    ): Promise<void> {
        this.log("debug", `Publishing message to channel: ${channel}`);
        await this.executeWithQueue(
            "publish",
            { channel, data },
            async () => {
                const apiClient = this.client as CentrifugoAPIClient;
                await apiClient.publish({ channel, data });
            },
            async () => {
                const grpcClient = this.client as CentrifugoGRPCClient;
                await grpcClient.publish(channel, data);
            },
            `Job queued for publishing to ${channel}`,
            `Message published to ${channel}`,
            `Failed to publish to ${channel}`
        );
    }

    /**
     * Broadcast a message to multiple channels
     */
    async broadcast(
        channels: string[],
        data: Record<string, any>
    ): Promise<void> {
        this.log("debug", `Broadcasting message to ${channels.length} channels`);
        await this.executeWithQueue(
            "broadcast",
            { channels, data },
            async () => {
                const apiClient = this.client as CentrifugoAPIClient;
                await apiClient.broadcast(channels, data);
            },
            async () => {
                const grpcClient = this.client as CentrifugoGRPCClient;
                await grpcClient.broadcast(channels, data);
            },
            `Job queued for broadcasting to channels: ${channels.join(", ")}`,
            `Broadcast sent to channels: ${channels.join(", ")}`,
            `Failed to broadcast to channels`
        );
    }

    /**
     * Get message history for a channel
     */
    async history(
        channel: string,
        limitOrOptions?: number | { limit?: number; since?: string; reverse?: boolean },
        since?: string
    ): Promise<Record<string, any>[]> {
        let options: any = { channel };

        if (typeof limitOrOptions === "number") {
            options.limit = limitOrOptions;
            options.since = since;
        } else if (typeof limitOrOptions === "object" && limitOrOptions !== null) {
            options = { channel, ...limitOrOptions };
        }

        if (this.mode === CentrifugoMode.API) {
            const apiClient = this.client as CentrifugoAPIClient;
            return await apiClient.history(options);
        } else {
            const grpcClient = this.client as CentrifugoGRPCClient;
            return await grpcClient.history(channel, options.limit);
        }
    }

    /**
     * Get current presence information for a channel
     */
    async presence(channel: string): Promise<Record<string, any>> {
        if (this.mode === CentrifugoMode.API) {
            const apiClient = this.client as CentrifugoAPIClient;
            return await apiClient.presence({ channel });
        } else {
            const grpcClient = this.client as CentrifugoGRPCClient;
            return await grpcClient.presence(channel);
        }
    }

    /**
     * Get presence statistics for a channel
     */
    async presenceStats(
        channel: string
    ): Promise<{ num_clients: number; num_users: number }> {
        if (this.mode === CentrifugoMode.API) {
            const apiClient = this.client as CentrifugoAPIClient;
            return await apiClient.presenceStats({ channel });
        } else {
            const grpcClient = this.client as CentrifugoGRPCClient;
            return await grpcClient.presenceStats(channel);
        }
    }

    /**
     * Unsubscribe a user from a channel
     */
    async unsubscribe(user: string, channel?: string): Promise<void> {
        await this.executeWithQueue(
            "unsubscribe",
            { user, channel },
            async () => {
                const apiClient = this.client as CentrifugoAPIClient;
                await apiClient.unsubscribe({ user, channel });
            },
            async () => {
                const grpcClient = this.client as CentrifugoGRPCClient;
                await grpcClient.unsubscribe(user, channel);
            },
            `Job queued for unsubscribing user ${user} from ${channel || "all channels"}`,
            `User ${user} unsubscribed from ${channel || "all channels"}`,
            `Failed to unsubscribe user ${user}`
        );
    }

    /**
     * Disconnect a user
     */
    async disconnect(user: string, reconnect?: boolean): Promise<void> {
        await this.executeWithQueue(
            "disconnect",
            { user, reconnect },
            async () => {
                const apiClient = this.client as CentrifugoAPIClient;
                await apiClient.disconnect({ user, reconnect });
            },
            async () => {
                const grpcClient = this.client as CentrifugoGRPCClient;
                await grpcClient.disconnect(user, reconnect);
            },
            `Job queued for disconnecting user ${user}`,
            `User ${user} disconnected`,
            `Failed to disconnect user ${user}`
        );
    }

    /**
     * Start the queue worker
     */
    async startQueue(
        handler?: (data: any) => Promise<void>
    ): Promise<void> {
        if (!this.queue) {
            throw new Error(
                "Queue is not enabled. Set enableQueue to true in config."
            );
        }

        const defaultHandler = async (data: any) => {
            console.log("Processing job:", data);
        };

        await this.queue.startWorker(handler || defaultHandler);
    }

    /**
     * Subscribe a user to a channel
     */
    async subscribe(
        user: string,
        channel: string,
        options?: {
            info?: Record<string, any>;
            client?: string;
            session?: string;
            data?: Record<string, any>;
        }
    ): Promise<void> {
        if (this.mode === CentrifugoMode.API) {
            const apiClient = this.client as CentrifugoAPIClient;
            await apiClient.subscribe({
                user,
                channel,
                info: options?.info,
                client: options?.client,
                session: options?.session,
                data: options?.data,
            });
        } else {
            const grpcClient = this.client as CentrifugoGRPCClient;
            await grpcClient.subscribe(user, channel, options);
        }
        this.log("info", `User ${user} subscribed to ${channel}`);
    }

    /**
     * Refresh user connection
     */
    async refresh(
        user: string,
        options?: {
            client?: string;
            session?: string;
            expired?: boolean;
            expire_at?: number;
        }
    ): Promise<void> {
        if (this.mode === CentrifugoMode.API) {
            const apiClient = this.client as CentrifugoAPIClient;
            await apiClient.refresh({ user, ...options });
        } else {
            const grpcClient = this.client as CentrifugoGRPCClient;
            await grpcClient.refresh(user, options);
        }
        this.log("info", `Connection refreshed for user ${user}`);
    }

    /**
     * Remove channel history
     */
    async historyRemove(channel: string): Promise<void> {
        if (this.mode === CentrifugoMode.API) {
            const apiClient = this.client as CentrifugoAPIClient;
            await apiClient.historyRemove(channel);
        } else {
            const grpcClient = this.client as CentrifugoGRPCClient;
            await grpcClient.historyRemove(channel);
        }
        this.log("info", `History removed for channel ${channel}`);
    }

    /**
     * Get active channels
     */
    async channels(pattern?: string): Promise<Record<string, any>> {
        if (this.mode === CentrifugoMode.API) {
            const apiClient = this.client as CentrifugoAPIClient;
            return await apiClient.channels(pattern ? { pattern } : undefined);
        } else {
            const grpcClient = this.client as CentrifugoGRPCClient;
            return await grpcClient.channels(pattern);
        }
    }

    /**
     * Get server info
     */
    async info(): Promise<any> {
        if (this.mode === CentrifugoMode.API) {
            const apiClient = this.client as CentrifugoAPIClient;
            return await apiClient.info();
        } else {
            const grpcClient = this.client as CentrifugoGRPCClient;
            return await grpcClient.info();
        }
    }

    /**
     * Get the queue instance
     */
    getQueue(): CentrifugoQueue | null {
        return this.queue;
    }

    /**
     * Get the client instance
     */
    getClient(): CentrifugoClient {
        return this.client;
    }

    /**
     * Get current mode
     */
    getMode(): CentrifugoMode {
        return this.mode;
    }

    /**
     * Cleanup resources
     */
    async close(): Promise<void> {
        this.log("info", "Closing Centrifugo SDK");
        if (this.queue) {
            await this.queue.close();
        }
    }

    /**
     * Internal logging method
     */
    private log(
        level: "error" | "warn" | "info" | "debug",
        message: string,
        data?: any
    ): void {
        // Only log if enabled and meets log level threshold
        const levels = { error: 0, warn: 1, info: 2, debug: 3 };
        const currentLevel = levels[this.logLevel];
        const messageLevel = levels[level];

        if (!this.debug && messageLevel > currentLevel) {
            return;
        }

        if (!this.debug && this.logLevel !== "debug" && level === "debug") {
            return;
        }

        const timestamp = new Date().toISOString();
        const prefix = `[${timestamp}] [Centrifugo] [${level.toUpperCase()}]`;

        if (data) {
            console[level === "error" ? "error" : level === "warn" ? "warn" : "log"](
                prefix,
                message,
                data
            );
        } else {
            console[level === "error" ? "error" : level === "warn" ? "warn" : "log"](
                prefix,
                message
            );
        }
    }

    /**
     * Enable debug logging
     */
    setDebug(enabled: boolean): void {
        this.debug = enabled;
        this.log("info", `Debug logging ${enabled ? "enabled" : "disabled"}`);
    }

    /**
     * Set log level
     */
    setLogLevel(level: "error" | "warn" | "info" | "debug"): void {
        this.logLevel = level;
        this.log("info", `Log level set to ${level}`);
    }
}

// Export all types and classes
export { CentrifugoAPIClient } from "./api";
export { CentrifugoGRPCClient } from "./grpc/grpc";
export { CentrifugoQueue } from "./queue/queue";