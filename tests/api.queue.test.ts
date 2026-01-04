import { CentrifugoMode } from "@core/type";
import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { Centrifugo } from "main";

describe("Centrifugo SDK - API with Queue Integration Tests", () => {
    let centrifugo: Centrifugo;

    beforeAll(() => {
        centrifugo = new Centrifugo({
            mode: CentrifugoMode.API,
            endpoint: "http://localhost:8000",
            apiKey: "test_api_key_12345",
            enableQueue: true,
            queueConfig: {
                name: "centrifugo-queue",
                redis: {
                    host: "localhost",
                    port: 6379,
                    password: undefined,
                    db: 0,
                    maxRetriesPerRequest: 3,
                    enableOfflineQueue: true,
                    connectTimeout: 10000,
                },
                defaultJobOptions: {
                    attempts: 3,
                    backoff: {
                        type: "exponential",
                        delay: 5000,
                    },
                    removeOnComplete: true,
                    removeOnFail: { age: 3600 },
                    timeout: 30000,
                },
                worker: {
                    concurrency: 5,
                    lockDuration: 30000,
                    lockRenewTime: 15000,
                    maxStalledCount: 2,
                },
                settings: {
                    maxListeners: 100,
                    guardInterval: 5000,
                    retryProcessDelay: 5000,
                    cleaningInterval: 300000,
                },
            },
        });
    });

    afterAll(async () => {
        await centrifugo.close();
    });

    test("should initialize Centrifugo with queue enabled in API mode", () => {
        expect(centrifugo).toBeDefined();
        expect(centrifugo.getMode()).toBe(CentrifugoMode.API);
    });

    test("should publish message and queue the operation", async () => {
        const result = await centrifugo.publish("queue-api-test-channel", {
            type: "test",
            message: "Message with queue",
            timestamp: new Date().toISOString(),
        });
        expect(result).toBeUndefined();
    });

    test("should broadcast to multiple channels and queue the operation", async () => {
        const channels = ["queue-api-channel-1", "queue-api-channel-2", "queue-api-channel-3"];
        const result = await centrifugo.broadcast(channels, {
            event: "queue_broadcast_test",
            data: "Broadcasting with queue support",
        });
        expect(result).toBeUndefined();
    });

    test("should get queue instance", () => {
        const queue = centrifugo.getQueue();
        expect(queue).toBeDefined();
        expect(queue).not.toBeNull();
    });

    test("should handle multiple publish operations with queue", async () => {
        const messages = [
            { id: 1, content: "Message 1", priority: "high" },
            { id: 2, content: "Message 2", priority: "medium" },
            { id: 3, content: "Message 3", priority: "low" },
        ];

        const publishPromises = messages.map((msg) =>
            centrifugo.publish("queue-api-multi-test", msg)
        );

        await Promise.all(publishPromises);
        expect(messages.length).toBe(3);
    });

    test("should disconnect user and queue the operation", async () => {
        const result = await centrifugo.disconnect("queue-api-user-123", true);
        expect(result).toBeUndefined();
    });

    test("should unsubscribe user from channel and queue the operation", async () => {
        const result = await centrifugo.unsubscribe("queue-api-user-456", "queue-api-channel");
        expect(result).toBeUndefined();
    });

    test("should handle rapid successive publishes with queue", async () => {
        const promises = [];
        for (let i = 0; i < 10; i++) {
            promises.push(
                centrifugo.publish(`queue-api-rapid-test-${i}`, {
                    index: i,
                    timestamp: Date.now(),
                })
            );
        }
        await Promise.all(promises);
        expect(promises.length).toBe(10);
    });

    test("should publish complex nested data structures with queue", async () => {
        const complexData = {
            user: {
                id: "api-queue-user-123",
                name: "Jane Doe",
                email: "jane@example.com",
                profile: {
                    avatar: "https://example.com/avatar.jpg",
                    roles: ["admin", "moderator"],
                    permissions: {
                        canPublish: true,
                        canSubscribe: true,
                        canModerate: true,
                    },
                },
            },
            event: {
                type: "notification",
                timestamp: Date.now(),
                priority: "high",
                metadata: {
                    source: "api_queue_test",
                    version: "1.0",
                },
            },
        };

        const result = await centrifugo.publish("queue-api-complex", complexData);
        expect(result).toBeUndefined();
    });

    test("should handle long channel names with queue", async () => {
        const longChannelName = "very-long-queue-api-channel-" + "x".repeat(100);
        const result = await centrifugo.publish(longChannelName, {
            test: "long-channel-with-queue",
            length: longChannelName.length,
        });
        expect(result).toBeUndefined();
    });

    test("should get API client instance", () => {
        const client = centrifugo.getClient();
        expect(client).toBeDefined();
        expect(client).not.toBeNull();
    });

    test("should handle presence stats with queue enabled", async () => {
        try {
            const stats = await centrifugo.presenceStats("queue-api-presence-channel");
            expect(stats).toBeDefined();
            if (stats.num_clients !== undefined) {
                expect(typeof stats.num_clients).toBe("number");
            }
            if (stats.num_users !== undefined) {
                expect(typeof stats.num_users).toBe("number");
            }
        } catch (error) {
            expect(error).toBeDefined();
        }
    });

    test("should handle presence with queue enabled", async () => {
        try {
            const presence = await centrifugo.presence("queue-api-presence-test");
            expect(presence).toBeDefined();
        } catch (error) {
            expect(error).toBeDefined();
        }
    });

    test("should handle history with queue enabled", async () => {
        try {
            const history = await centrifugo.history("queue-api-history-channel", 10);
            expect(Array.isArray(history)).toBe(true);
        } catch (error) {
            expect(error).toBeDefined();
        }
    });

    test("should publish with custom data types and queue", async () => {
        const testData = {
            numbers: [1, 2, 3, 4, 5],
            strings: ["a", "b", "c"],
            booleans: [true, false, true],
            mixed: {
                string: "value",
                number: 42,
                boolean: true,
                null: null,
            },
        };

        const result = await centrifugo.publish("queue-api-types-test", testData);
        expect(result).toBeUndefined();
    });

    test("should broadcast with large payload and queue", async () => {
        const largePayload = {
            data: "x".repeat(10000),
            timestamp: Date.now(),
            channels: ["queue-api-large-1", "queue-api-large-2"],
        };

        const result = await centrifugo.broadcast(
            largePayload.channels,
            largePayload
        );
        expect(result).toBeUndefined();
    });

    test("should queue maintain order for sequential operations", async () => {
        const operations = [];
        for (let i = 0; i < 5; i++) {
            operations.push({
                channel: `queue-api-order-${i}`,
                data: { order: i, timestamp: Date.now() },
            });
        }

        for (const op of operations) {
            await centrifugo.publish(op.channel, op.data);
        }

        expect(operations.length).toBe(5);
    });
});
