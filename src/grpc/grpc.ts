import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import * as path from "path";

export interface GRPCClientConfig {
    endpoint: string;
    apiKey?: string;
}

// Interface for the gRPC client service
interface IGRPCClient {
    publish(request: any, metadata: grpc.Metadata, callback: Function): void;
    broadcast(request: any, metadata: grpc.Metadata, callback: Function): void;
    subscribe(request: any, metadata: grpc.Metadata, callback: Function): void;
    unsubscribe(request: any, metadata: grpc.Metadata, callback: Function): void;
    disconnect(request: any, metadata: grpc.Metadata, callback: Function): void;
    refresh(request: any, metadata: grpc.Metadata, callback: Function): void;
    history(request: any, metadata: grpc.Metadata, callback: Function): void;
    presence(request: any, metadata: grpc.Metadata, callback: Function): void;
    presenceStats(request: any, metadata: grpc.Metadata, callback: Function): void;
    historyRemove(request: any, metadata: grpc.Metadata, callback: Function): void;
    channels(request: any, metadata: grpc.Metadata, callback: Function): void;
    info(request: any, metadata: grpc.Metadata, callback: Function): void;
}

export class CentrifugoGRPCClient {
    private endpoint: string;
    private client: IGRPCClient | null = null;
    private apiKey?: string;
    private initPromise: Promise<void> | null = null;

    constructor(config: GRPCClientConfig) {
        this.endpoint = config.endpoint;
        this.apiKey = config.apiKey;
        // Lazy initialize on first use
        this.initPromise = this.initializeClient();
    }

    private async initializeClient(): Promise<void> {
        try {
            // Load proto file
            const protoPath = path.join(import.meta.dir, "grpc.proto");
            const packageDefinition = await protoLoader.load(protoPath, {
                keepCase: true,
                longs: String,
                enums: String,
                defaults: true,
                oneofs: true,
            });

            const proto = grpc.loadPackageDefinition(packageDefinition) as any;
            const CentrifugoApi = proto.centrifugal.centrifugo.api.CentrifugoApi;

            // Create client with credentials
            const credentials = grpc.credentials.createInsecure();
            this.client = new CentrifugoApi(this.endpoint, credentials);
        } catch (error) {
            console.error("Failed to initialize gRPC client:", error);
            throw error;
        }
    }

    private getMetadata(): grpc.Metadata {
        const metadata = new grpc.Metadata();
        if (this.apiKey) {
            metadata.add("authorization", `apikey ${this.apiKey}`);
        }
        return metadata;
    }

    /**
     * Helper method to wrap gRPC method calls with error handling
     */
    private async callGRPC<T>(
        method: (metadata: grpc.Metadata, callback: Function) => void,
        transformer?: (response: any) => T
    ): Promise<T> {
        // Ensure initialization is complete before calling
        if (this.initPromise) {
            await this.initPromise;
        }

        return new Promise((resolve, reject) => {
            if (!this.client) {
                reject(new Error("gRPC client not initialized"));
                return;
            }

            method(this.getMetadata(), (err: any, response: any) => {
                if (err) {
                    reject(err);
                } else if (response.error && response.error.code !== 0) {
                    reject(new Error(`gRPC Error: ${response.error.message} (code: ${response.error.code})`));
                } else {
                    resolve(transformer ? transformer(response) : response);
                }
            });
        });
    }

    async publish(channel: string, data: Record<string, any>): Promise<void> {
        return this.callGRPC((metadata, callback) => {
            const request = {
                channel,
                data: Buffer.from(JSON.stringify(data)),
            };
            this.client!.publish(request, metadata, callback);
        });
    }

    async broadcast(
        channels: string[],
        data: Record<string, any>
    ): Promise<void> {
        return this.callGRPC((metadata, callback) => {
            const request = {
                channels,
                data: Buffer.from(JSON.stringify(data)),
            };
            this.client!.broadcast(request, metadata, callback);
        });
    }

    async history(
        channel: string,
        limit?: number
    ): Promise<Record<string, any>[]> {
        return this.callGRPC(
            (metadata, callback) => {
                const request = {
                    channel,
                    limit: limit || 0,
                };
                this.client!.history(request, metadata, callback);
            },
            (response) => {
                const publications = response.result?.publications || [];
                return publications.map((pub: any) => ({
                    data: pub.data ? JSON.parse(pub.data.toString()) : {},
                    offset: pub.offset,
                    tags: pub.tags,
                }));
            }
        );
    }

    async presence(channel: string): Promise<Record<string, any>> {
        return this.callGRPC(
            (metadata, callback) => {
                const request = { channel };
                this.client!.presence(request, metadata, callback);
            },
            (response) => {
                const presence = response.result?.presence || {};
                const result: Record<string, any> = {};
                for (const [key, value] of Object.entries(presence)) {
                    result[key] = {
                        client: (value as any).client,
                        user: (value as any).user,
                    };
                }
                return result;
            }
        );
    }

    async presenceStats(
        channel: string
    ): Promise<{ num_clients: number; num_users: number }> {
        return this.callGRPC(
            (metadata, callback) => {
                const request = { channel };
                this.client!.presenceStats(request, metadata, callback);
            },
            (response) => ({
                num_clients: response.result?.num_clients || 0,
                num_users: response.result?.num_users || 0,
            })
        );
    }

    async unsubscribe(user: string, channel?: string): Promise<void> {
        return this.callGRPC((metadata, callback) => {
            const request = {
                user,
                channel: channel || "",
            };
            this.client!.unsubscribe(request, metadata, callback);
        });
    }

    async disconnect(user: string, reconnect?: boolean): Promise<void> {
        return this.callGRPC((metadata, callback) => {
            const request = {
                user,
                disconnect: reconnect
                    ? { code: 0, reason: "manual disconnect" }
                    : undefined,
            };
            this.client!.disconnect(request, metadata, callback);
        });
    }

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
        return this.callGRPC((metadata, callback) => {
            const request: Record<string, any> = {
                user,
                channel,
            };

            if (options?.info) request.info = Buffer.from(JSON.stringify(options.info));
            if (options?.client) request.client = options.client;
            if (options?.session) request.session = options.session;
            if (options?.data) request.data = Buffer.from(JSON.stringify(options.data));

            this.client!.subscribe(request, metadata, callback);
        });
    }

    async refresh(
        user: string,
        options?: {
            client?: string;
            session?: string;
            expired?: boolean;
            expire_at?: number;
        }
    ): Promise<void> {
        return this.callGRPC((metadata, callback) => {
            const request: Record<string, any> = {
                user,
            };

            if (options?.client) request.client = options.client;
            if (options?.session) request.session = options.session;
            if (options?.expired) request.expired = options.expired;
            if (options?.expire_at) request.expire_at = options.expire_at;

            this.client!.refresh(request, metadata, callback);
        });
    }

    async historyRemove(channel: string): Promise<void> {
        return this.callGRPC((metadata, callback) => {
            const request = { channel };
            this.client!.historyRemove(request, metadata, callback);
        });
    }

    async channels(pattern?: string): Promise<Record<string, any>> {
        return this.callGRPC(
            (metadata, callback) => {
                const request: Record<string, any> = {};
                if (pattern) request.pattern = pattern;
                this.client!.channels(request, metadata, callback);
            },
            (response) => response.result?.channels || {}
        );
    }

    async info(): Promise<any> {
        return this.callGRPC(
            (metadata, callback) => {
                const request = {};
                this.client!.info(request, metadata, callback);
            },
            (response) => response.result || {}
        );
    }
}