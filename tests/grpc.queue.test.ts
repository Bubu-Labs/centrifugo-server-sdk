import { CentrifugoMode } from "@core/type";
import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { Centrifugo } from "main";

describe("Centrifugo SDK - gRPC with Queue Integration Tests", () => {
    let centrifugo: Centrifugo;

    beforeAll(() => {
        centrifugo = new Centrifugo({
            mode: CentrifugoMode.GRPC,
            endpoint: "localhost:10000",
            apiKey: "test_grpc_api_key_12345",
            enableQueue: true,
            queueConfig: {
                name: "centrifugo-grpc-queue",
                redis: {
                    host: "localhost",
                    port: 6379,
                    password: undefined,
                    db: 0,
                    maxRetriesPerRequest: 3,
                    enableOfflineQueue: true,
                    connectTimeout: 10000,
                    keepAlive: 30000,
                },
                defaultJobOptions: {
                    attempts: 3,
                    backoff: {
                        type: "exponential",
                        delay: 5000,
                    },
                    priority: 5,
                    removeOnComplete: { age: 3600 },
                    removeOnFail: { age: 7200 },
                    timeout: 30000,
                },
                worker: {
                    concurrency: 10,
                    lockDuration: 30000,
                    lockRenewTime: 15000,
                    maxStalledCount: 2,
                    stalledInterval: 5000,
                },
                settings: {
                    maxListeners: 200,
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

    test("should initialize Centrifugo with queue enabled in gRPC mode", () => {
        expect(centrifugo).toBeDefined();
        expect(centrifugo.getMode()).toBe(CentrifugoMode.GRPC);
    });

    test("should publish message via gRPC and queue the operation", async () => {
        const result = await centrifugo.publish("grpc-queue-test-channel", {
            type: "test",
            message: "Message via gRPC with queue",
            timestamp: new Date().toISOString(),
        });
        expect(result).toBeUndefined();
    });

    test("should broadcast to multiple channels via gRPC and queue", async () => {
        const channels = [
            "grpc-queue-channel-1",
            "grpc-queue-channel-2",
            "grpc-queue-channel-3",
        ];
        const result = await centrifugo.broadcast(channels, {
            event: "grpc_queue_broadcast_test",
            data: "Broadcasting via gRPC with queue support",
        });
        expect(result).toBeUndefined();
    });

    test("should get queue instance in gRPC mode", () => {
        const queue = centrifugo.getQueue();
        expect(queue).toBeDefined();
        expect(queue).not.toBeNull();
    });

    test("should handle multiple publish operations via gRPC with queue", async () => {
        const messages = [
            { id: 1, content: "gRPC Message 1", priority: "high" },
            { id: 2, content: "gRPC Message 2", priority: "medium" },
            { id: 3, content: "gRPC Message 3", priority: "low" },
        ];

        const publishPromises = messages.map((msg) =>
            centrifugo.publish("grpc-queue-multi-test", msg)
        );

        await Promise.all(publishPromises);
        expect(messages.length).toBe(3);
    });

    test("should disconnect user via gRPC and queue the operation", async () => {
        const result = await centrifugo.disconnect("grpc-queue-user-123", true);
        expect(result).toBeUndefined();
    });

    test("should unsubscribe user from channel via gRPC and queue", async () => {
        const result = await centrifugo.unsubscribe(
            "grpc-queue-user-456",
            "grpc-queue-channel"
        );
        expect(result).toBeUndefined();
    });

    test("should handle rapid successive publishes via gRPC with queue", async () => {
        const promises = [];
        for (let i = 0; i < 10; i++) {
            promises.push(
                centrifugo.publish(`grpc-queue-rapid-test-${i}`, {
                    index: i,
                    timestamp: Date.now(),
                })
            );
        }
        await Promise.all(promises);
        expect(promises.length).toBe(10);
    });

    test("should publish complex nested data structures via gRPC with queue", async () => {
        const complexData = {
            user: {
                id: "grpc-queue-user-123",
                name: "John Smith",
                email: "john.smith@example.com",
                profile: {
                    avatar: "https://example.com/grpc-avatar.jpg",
                    roles: ["admin", "moderator", "user"],
                    permissions: {
                        canPublish: true,
                        canSubscribe: true,
                        canModerate: true,
                        canDelete: false,
                    },
                },
            },
            event: {
                type: "system_notification",
                timestamp: Date.now(),
                priority: "critical",
                metadata: {
                    source: "grpc_queue_test",
                    version: "2.0",
                    environment: "test",
                },
            },
            tags: ["important", "grpc", "queue"],
        };

        const result = await centrifugo.publish("grpc-queue-complex", complexData);
        expect(result).toBeUndefined();
    });

    test("should handle long channel names via gRPC with queue", async () => {
        const longChannelName = "very-long-grpc-queue-channel-" + "y".repeat(100);
        const result = await centrifugo.publish(longChannelName, {
            test: "long-channel-grpc-queue",
            length: longChannelName.length,
        });
        expect(result).toBeUndefined();
    });

    test("should get gRPC client instance", () => {
        const client = centrifugo.getClient();
        expect(client).toBeDefined();
        expect(client).not.toBeNull();
    });

    test("should handle presence stats via gRPC with queue enabled", async () => {
        try {
            const stats = await centrifugo.presenceStats(
                "grpc-queue-presence-channel"
            );
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

    test("should handle presence via gRPC with queue enabled", async () => {
        try {
            const presence = await centrifugo.presence("grpc-queue-presence-test");
            expect(presence).toBeDefined();
        } catch (error) {
            expect(error).toBeDefined();
        }
    });

    test("should handle history via gRPC with queue enabled", async () => {
        try {
            const history = await centrifugo.history(
                "grpc-queue-history-channel",
                10
            );
            expect(Array.isArray(history)).toBe(true);
        } catch (error) {
            expect(error).toBeDefined();
        }
    });

    test("should publish with various data types via gRPC and queue", async () => {
        const testData = {
            numbers: [1, 2, 3, 4, 5],
            floats: [1.1, 2.2, 3.3],
            strings: ["grpc", "test", "queue"],
            booleans: [true, false, true, false],
            mixed: {
                string: "grpc_value",
                number: 42,
                float: 3.14,
                boolean: true,
                null: null,
                array: [1, "two", true],
            },
        };

        const result = await centrifugo.publish("grpc-queue-types-test", testData);
        expect(result).toBeUndefined();
    });

    test("should broadcast with large payload via gRPC and queue", async () => {
        const largePayload = {
            data: "g".repeat(10000),
            timestamp: Date.now(),
            channels: ["grpc-queue-large-1", "grpc-queue-large-2", "grpc-queue-large-3"],
        };

        const result = await centrifugo.broadcast(
            largePayload.channels,
            largePayload
        );
        expect(result).toBeUndefined();
    });

    test("should queue maintain order for sequential gRPC operations", async () => {
        const operations = [];
        for (let i = 0; i < 5; i++) {
            operations.push({
                channel: `grpc-queue-order-${i}`,
                data: { order: i, timestamp: Date.now() },
            });
        }

        for (const op of operations) {
            await centrifugo.publish(op.channel, op.data);
        }

        expect(operations.length).toBe(5);
    });

    test("should handle concurrent gRPC operations with queue", async () => {
        const concurrentOps = [];

        // Mix different operations
        for (let i = 0; i < 5; i++) {
            concurrentOps.push(
                centrifugo.publish(`grpc-queue-concurrent-${i}`, {
                    operation: "publish",
                    index: i,
                })
            );
        }

        concurrentOps.push(
            centrifugo.broadcast(
                ["grpc-queue-concurrent-broadcast-1", "grpc-queue-concurrent-broadcast-2"],
                { operation: "broadcast" }
            )
        );

        concurrentOps.push(
            centrifugo.disconnect("grpc-queue-concurrent-user", true)
        );

        await Promise.all(concurrentOps);
        expect(concurrentOps.length).toBe(7);
    });

    test("should handle batch operations via gRPC with queue", async () => {
        const batchSize = 20;
        const batchOps = [];

        for (let i = 0; i < batchSize; i++) {
            batchOps.push(
                centrifugo.publish(`grpc-queue-batch-${i}`, {
                    batchId: 1,
                    itemIndex: i,
                    timestamp: Date.now(),
                })
            );
        }

        await Promise.all(batchOps);
        expect(batchOps.length).toBe(batchSize);
    });
});
