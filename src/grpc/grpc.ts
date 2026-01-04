import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import * as path from "path";

export interface GRPCClientConfig {
    endpoint: string;
    apiKey?: string;
}

export class CentrifugoGRPCClient {
    private endpoint: string;
    private client: any;
    private apiKey?: string;
    private initialized: boolean = false;

    constructor(config: GRPCClientConfig) {
        this.endpoint = config.endpoint;
        this.apiKey = config.apiKey;
    }

    private async initializeClient(): Promise<void> {
        if (this.initialized) return;

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
            this.initialized = true;
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

    async publish(channel: string, data: Record<string, any>): Promise<void> {
        await this.initializeClient();
        
        return new Promise((resolve, reject) => {
            const request = {
                channel,
                data: Buffer.from(JSON.stringify(data)),
            };

            this.client.publish(request, this.getMetadata(), (err: any, response: any) => {
                if (err) {
                    reject(err);
                } else if (response.error && response.error.code !== 0) {
                    reject(new Error(`gRPC Error: ${response.error.message} (code: ${response.error.code})`));
                } else {
                    resolve();
                }
            });
        });
    }

    async broadcast(
        channels: string[],
        data: Record<string, any>
    ): Promise<void> {
        await this.initializeClient();
        
        return new Promise((resolve, reject) => {
            const request = {
                channels,
                data: Buffer.from(JSON.stringify(data)),
            };

            this.client.broadcast(request, this.getMetadata(), (err: any, response: any) => {
                if (err) {
                    reject(err);
                } else if (response.error && response.error.code !== 0) {
                    reject(new Error(`gRPC Error: ${response.error.message} (code: ${response.error.code})`));
                } else {
                    resolve();
                }
            });
        });
    }

    async history(
        channel: string,
        limit?: number
    ): Promise<Record<string, any>[]> {
        await this.initializeClient();
        
        return new Promise((resolve, reject) => {
            const request = {
                channel,
                limit: limit || 0,
            };

            this.client.history(request, this.getMetadata(), (err: any, response: any) => {
                if (err) {
                    reject(err);
                } else if (response.error && response.error.code !== 0) {
                    reject(new Error(`gRPC Error: ${response.error.message} (code: ${response.error.code})`));
                } else {
                    const publications = response.result?.publications || [];
                    resolve(
                        publications.map((pub: any) => ({
                            data: pub.data ? JSON.parse(pub.data.toString()) : {},
                            offset: pub.offset,
                            tags: pub.tags,
                        }))
                    );
                }
            });
        });
    }

    async presence(channel: string): Promise<Record<string, any>> {
        await this.initializeClient();
        
        return new Promise((resolve, reject) => {
            const request = { channel };

            this.client.presence(request, this.getMetadata(), (err: any, response: any) => {
                if (err) {
                    reject(err);
                } else if (response.error && response.error.code !== 0) {
                    reject(new Error(`gRPC Error: ${response.error.message} (code: ${response.error.code})`));
                } else {
                    const presence = response.result?.presence || {};
                    const result: Record<string, any> = {};
                    for (const [key, value] of Object.entries(presence)) {
                        result[key] = {
                            client: (value as any).client,
                            user: (value as any).user,
                        };
                    }
                    resolve(result);
                }
            });
        });
    }

    async presenceStats(
        channel: string
    ): Promise<{ num_clients: number; num_users: number }> {
        await this.initializeClient();
        
        return new Promise((resolve, reject) => {
            const request = { channel };

            this.client.presenceStats(request, this.getMetadata(), (err: any, response: any) => {
                if (err) {
                    reject(err);
                } else if (response.error && response.error.code !== 0) {
                    reject(new Error(`gRPC Error: ${response.error.message} (code: ${response.error.code})`));
                } else {
                    resolve({
                        num_clients: response.result?.num_clients || 0,
                        num_users: response.result?.num_users || 0,
                    });
                }
            });
        });
    }

    async unsubscribe(user: string, channel?: string): Promise<void> {
        await this.initializeClient();
        
        return new Promise((resolve, reject) => {
            const request = {
                user,
                channel: channel || "",
            };

            this.client.unsubscribe(request, this.getMetadata(), (err: any, response: any) => {
                if (err) {
                    reject(err);
                } else if (response.error && response.error.code !== 0) {
                    reject(new Error(`gRPC Error: ${response.error.message} (code: ${response.error.code})`));
                } else {
                    resolve();
                }
            });
        });
    }

    async disconnect(user: string, reconnect?: boolean): Promise<void> {
        await this.initializeClient();
        
        return new Promise((resolve, reject) => {
            const request = {
                user,
                disconnect: reconnect
                    ? { code: 0, reason: "manual disconnect" }
                    : undefined,
            };

            this.client.disconnect(request, this.getMetadata(), (err: any, response: any) => {
                if (err) {
                    reject(err);
                } else if (response.error && response.error.code !== 0) {
                    reject(new Error(`gRPC Error: ${response.error.message} (code: ${response.error.code})`));
                } else {
                    resolve();
                }
            });
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
        await this.initializeClient();

        return new Promise((resolve, reject) => {
            const request: Record<string, any> = {
                user,
                channel,
            };

            if (options?.info) request.info = Buffer.from(JSON.stringify(options.info));
            if (options?.client) request.client = options.client;
            if (options?.session) request.session = options.session;
            if (options?.data) request.data = Buffer.from(JSON.stringify(options.data));

            this.client.subscribe(request, this.getMetadata(), (err: any, response: any) => {
                if (err) {
                    reject(err);
                } else if (response.error && response.error.code !== 0) {
                    reject(new Error(`gRPC Error: ${response.error.message} (code: ${response.error.code})`));
                } else {
                    resolve();
                }
            });
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
        await this.initializeClient();

        return new Promise((resolve, reject) => {
            const request: Record<string, any> = {
                user,
            };

            if (options?.client) request.client = options.client;
            if (options?.session) request.session = options.session;
            if (options?.expired) request.expired = options.expired;
            if (options?.expire_at) request.expire_at = options.expire_at;

            this.client.refresh(request, this.getMetadata(), (err: any, response: any) => {
                if (err) {
                    reject(err);
                } else if (response.error && response.error.code !== 0) {
                    reject(new Error(`gRPC Error: ${response.error.message} (code: ${response.error.code})`));
                } else {
                    resolve();
                }
            });
        });
    }

    async historyRemove(channel: string): Promise<void> {
        await this.initializeClient();

        return new Promise((resolve, reject) => {
            const request = { channel };

            this.client.historyRemove(request, this.getMetadata(), (err: any, response: any) => {
                if (err) {
                    reject(err);
                } else if (response.error && response.error.code !== 0) {
                    reject(new Error(`gRPC Error: ${response.error.message} (code: ${response.error.code})`));
                } else {
                    resolve();
                }
            });
        });
    }

    async channels(pattern?: string): Promise<Record<string, any>> {
        await this.initializeClient();

        return new Promise((resolve, reject) => {
            const request: Record<string, any> = {};
            if (pattern) request.pattern = pattern;

            this.client.channels(request, this.getMetadata(), (err: any, response: any) => {
                if (err) {
                    reject(err);
                } else if (response.error && response.error.code !== 0) {
                    reject(new Error(`gRPC Error: ${response.error.message} (code: ${response.error.code})`));
                } else {
                    resolve(response.result?.channels || {});
                }
            });
        });
    }

    async info(): Promise<any> {
        await this.initializeClient();

        return new Promise((resolve, reject) => {
            const request = {};

            this.client.info(request, this.getMetadata(), (err: any, response: any) => {
                if (err) {
                    reject(err);
                } else if (response.error && response.error.code !== 0) {
                    reject(new Error(`gRPC Error: ${response.error.message} (code: ${response.error.code})`));
                } else {
                    resolve(response.result || {});
                }
            });
        });
    }
}