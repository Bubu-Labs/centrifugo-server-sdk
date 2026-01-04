import axios, { AxiosInstance } from "axios";

export interface PublishOptions {
    channel: string;
    data: Record<string, any>;
    idempotency_key?: string; // Optional idempotency key for duplicate protection
}

export interface BroadcastOptions {
    channels: string[];
    data: Record<string, any>;
    idempotency_key?: string; // Optional idempotency key for duplicate protection
}

export interface HistoryOptions {
    channel: string;
    limit?: number;
    since?: string;
    reverse?: boolean;
}

export interface PresenceOptions {
    channel: string;
}

export interface PresenceStatsOptions {
    channel: string;
}

export interface UnsubscribeOptions {
    user: string;
    channel?: string;
}

export interface DisconnectOptions {
    user: string;
    reconnect?: boolean;
}

export interface SubscribeOptions {
    user: string;
    channel: string;
    info?: Record<string, any>;
    b64info?: string;
    client?: string;
    session?: string;
    data?: Record<string, any>;
    b64data?: string;
    override?: {
        presence?: boolean;
        join_leave?: boolean;
        force_push_join_leave?: boolean;
        force_positioning?: boolean;
        force_recovery?: boolean;
    };
}

export interface RefreshOptions {
    user: string;
    client?: string;
    session?: string;
    expired?: boolean;
    expire_at?: number;
}

export interface BatchRequest {
    publish?: PublishOptions;
    broadcast?: { channels: string[]; data: Record<string, any> };
    subscribe?: SubscribeOptions;
    unsubscribe?: { user: string; channel?: string };
    disconnect?: DisconnectOptions;
    refresh?: RefreshOptions;
    presence?: PresenceOptions;
    presence_stats?: PresenceStatsOptions;
    history?: HistoryOptions;
    history_remove?: { channel: string };
    channels?: { pattern?: string };
    info?: Record<string, any>;
}

export interface ChannelsOptions {
    pattern?: string;
}

export interface InfoOptions {}

export interface CentrifugoAPIResponse<T = any> {
    result: T;
    error?: string;
}

export class CentrifugoAPIClient {
    private client: AxiosInstance;
    private endpoint: string;

    constructor(endpoint: string, apiKey?: string) {
        this.endpoint = endpoint;
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };

        // Add API key to headers if provided
        if (apiKey) {
            headers["Authorization"] = `apikey ${apiKey}`;
        }

        this.client = axios.create({
            baseURL: endpoint,
            headers,
        });
    }

    async publish(options: PublishOptions): Promise<void> {
        try {
            const payload: any = {
                channel: options.channel,
                data: options.data,
            };
            // Add idempotency_key if provided
            if (options.idempotency_key) {
                payload.idempotency_key = options.idempotency_key;
            }

            const response = await this.client.post<CentrifugoAPIResponse>(
                "/api/publish",
                payload
            );

            if (response.data.error) {
                const errorMsg = JSON.stringify(response.data.error);
                throw new Error(`Centrifugo API Error: ${errorMsg}`);
            }
        } catch (error) {
            throw new Error(`Failed to publish message: ${error}`);
        }
    }

    async broadcast(options: BroadcastOptions): Promise<void> {
        try {
            const payload: any = {
                channels: options.channels,
                data: options.data,
            };
            // Add idempotency_key if provided
            if (options.idempotency_key) {
                payload.idempotency_key = options.idempotency_key;
            }

            const response = await this.client.post<CentrifugoAPIResponse>(
                "/api/broadcast",
                payload
            );

            if (response.data.error) {
                throw new Error(`Centrifugo API Error: ${response.data.error}`);
            }
        } catch (error) {
            throw new Error(`Failed to broadcast message: ${error}`);
        }
    }

    async history(options: HistoryOptions): Promise<any[]> {
        try {
            const payload: any = {
                channel: options.channel,
            };
            if (options.limit !== undefined) payload.limit = options.limit;
            if (options.since !== undefined) payload.since = options.since;
            if (options.reverse !== undefined) payload.reverse = options.reverse;

            const response = await this.client.post<CentrifugoAPIResponse>(
                "/api/history",
                payload
            );

            if (response.data.error) {
                throw new Error(`Centrifugo API Error: ${response.data.error}`);
            }

            // History API returns an object with publications array
            const result = response.data.result;
            if (result && result.publications) {
                return result.publications;
            }
            return result || [];
        } catch (error) {
            throw new Error(`Failed to get history: ${error}`);
        }
    }

    async presence(options: PresenceOptions): Promise<any> {
        try {
            const response = await this.client.post<CentrifugoAPIResponse>(
                "/api/presence",
                {
                    channel: options.channel,
                }
            );

            if (response.data.error) {
                throw new Error(`Centrifugo API Error: ${response.data.error}`);
            }

            return response.data.result || {};
        } catch (error) {
            throw new Error(`Failed to get presence: ${error}`);
        }
    }

    async presenceStats(
        options: PresenceStatsOptions
    ): Promise<{ num_clients: number; num_users: number }> {
        try {
            const response = await this.client.post<CentrifugoAPIResponse>(
                "/api/presence_stats",
                {
                    channel: options.channel,
                }
            );

            if (response.data.error) {
                throw new Error(`Centrifugo API Error: ${response.data.error}`);
            }

            return response.data.result || { num_clients: 0, num_users: 0 };
        } catch (error) {
            throw new Error(`Failed to get presence stats: ${error}`);
        }
    }

    async unsubscribe(options: UnsubscribeOptions): Promise<void> {
        try {
            const response = await this.client.post<CentrifugoAPIResponse>(
                "/api/unsubscribe",
                {
                    user: options.user,
                    channel: options.channel,
                }
            );

            if (response.data.error) {
                throw new Error(`Centrifugo API Error: ${response.data.error}`);
            }
        } catch (error) {
            throw new Error(`Failed to unsubscribe: ${error}`);
        }
    }

    async disconnect(options: DisconnectOptions): Promise<void> {
        try {
            const response = await this.client.post<CentrifugoAPIResponse>(
                "/api/disconnect",
                {
                    user: options.user,
                    reconnect: options.reconnect ?? false,
                }
            );

            if (response.data.error) {
                throw new Error(`Centrifugo API Error: ${response.data.error}`);
            }
        } catch (error) {
            throw new Error(`Failed to disconnect: ${error}`);
        }
    }

    async batch(
        requests: Array<{ method: string; params: Record<string, any> }>
    ): Promise<any[]> {
        try {
            const response = await this.client.post<CentrifugoAPIResponse>(
                "/api/batch",
                {
                    requests,
                }
            );

            if (response.data.error) {
                throw new Error(`Centrifugo API Error: ${response.data.error}`);
            }

            return response.data.result || [];
        } catch (error) {
            throw new Error(`Failed to execute batch requests: ${error}`);
        }
    }

    async subscribe(options: SubscribeOptions): Promise<void> {
        try {
            const payload: Record<string, any> = {
                user: options.user,
                channel: options.channel,
            };

            if (options.info !== undefined) payload.info = options.info;
            if (options.b64info !== undefined) payload.b64info = options.b64info;
            if (options.client !== undefined) payload.client = options.client;
            if (options.session !== undefined) payload.session = options.session;
            if (options.data !== undefined) payload.data = options.data;
            if (options.b64data !== undefined) payload.b64data = options.b64data;
            if (options.override !== undefined) payload.override = options.override;

            const response = await this.client.post<CentrifugoAPIResponse>(
                "/api/subscribe",
                payload
            );

            if (response.data.error) {
                throw new Error(`Centrifugo API Error: ${response.data.error}`);
            }
        } catch (error) {
            throw new Error(`Failed to subscribe user: ${error}`);
        }
    }

    async refresh(options: RefreshOptions): Promise<void> {
        try {
            const payload: Record<string, any> = {
                user: options.user,
            };

            if (options.client !== undefined) payload.client = options.client;
            if (options.session !== undefined) payload.session = options.session;
            if (options.expired !== undefined) payload.expired = options.expired;
            if (options.expire_at !== undefined) payload.expire_at = options.expire_at;

            const response = await this.client.post<CentrifugoAPIResponse>(
                "/api/refresh",
                payload
            );

            if (response.data.error) {
                throw new Error(`Centrifugo API Error: ${response.data.error}`);
            }
        } catch (error) {
            throw new Error(`Failed to refresh connection: ${error}`);
        }
    }

    async historyRemove(channel: string): Promise<void> {
        try {
            const response = await this.client.post<CentrifugoAPIResponse>(
                "/api/history_remove",
                { channel }
            );

            if (response.data.error) {
                throw new Error(`Centrifugo API Error: ${response.data.error}`);
            }
        } catch (error) {
            throw new Error(`Failed to remove history: ${error}`);
        }
    }

    async channels(options?: ChannelsOptions): Promise<Record<string, any>> {
        try {
            const payload: Record<string, any> = {};
            if (options?.pattern !== undefined) payload.pattern = options.pattern;

            const response = await this.client.post<CentrifugoAPIResponse>(
                "/api/channels",
                payload
            );

            if (response.data.error) {
                throw new Error(`Centrifugo API Error: ${response.data.error}`);
            }

            return response.data.result || {};
        } catch (error) {
            throw new Error(`Failed to get channels: ${error}`);
        }
    }

    async info(): Promise<any> {
        try {
            const response = await this.client.post<CentrifugoAPIResponse>(
                "/api/info",
                {}
            );

            if (response.data.error) {
                throw new Error(`Centrifugo API Error: ${response.data.error}`);
            }

            return response.data.result || {};
        } catch (error) {
            throw new Error(`Failed to get server info: ${error}`);
        }
    }
}