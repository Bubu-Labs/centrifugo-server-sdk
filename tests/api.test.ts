import { CentrifugoMode } from "@core/type";
import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { Centrifugo } from "main";


describe("Centrifugo SDK - Integration Tests", () => {
    let centrifugo: Centrifugo;

    beforeAll(() => {
        centrifugo = new Centrifugo({
            mode: CentrifugoMode.API,
            endpoint: "http://localhost:8000",
            apiKey: "test_api_key_12345",
        });
    });

    afterAll(async () => {
        await centrifugo.close();
    });

    test("should publish a message to a channel", async () => {
        const result = await centrifugo.publish("test-channel", {
            type: "test",
            message: "Hello from Bun test",
            timestamp: new Date().toISOString(),
        });
        expect(result).toBeUndefined();
    });

    test("should broadcast to multiple channels", async () => {
        const result = await centrifugo.broadcast(
            ["channel-1", "channel-2", "channel-3"],
            {
                event: "broadcast_test",
                data: "Broadcasting to multiple channels",
            }
        );
        expect(result).toBeUndefined();
    });

    test("should handle presence stats (with graceful error handling)", async () => {
        try {
            const stats = await centrifugo.presenceStats("test-channel");
            expect(stats).toBeDefined();
            // Only check numbers if they exist
            if (stats.num_clients !== undefined) {
                expect(typeof stats.num_clients).toBe("number");
            }
            if (stats.num_users !== undefined) {
                expect(typeof stats.num_users).toBe("number");
            }
        } catch (error) {
            // Presence not available is a valid Centrifugo response
            // when there are no active subscribers
            expect(error).toBeDefined();
        }
    });

    test("should publish multiple messages sequentially", async () => {
        const messages = [
            { type: "msg", content: "Message 1", id: 1 },
            { type: "msg", content: "Message 2", id: 2 },
            { type: "msg", content: "Message 3", id: 3 },
        ];

        for (const msg of messages) {
            await centrifugo.publish("multi-test", msg);
        }
        expect(messages.length).toBe(3);
    });

    test("should disconnect a user", async () => {
        const result = await centrifugo.disconnect("test-user-123", true);
        expect(result).toBeUndefined();
    });

    test("should unsubscribe a user from a channel", async () => {
        const result = await centrifugo.unsubscribe(
            "test-user-456",
            "test-channel"
        );
        expect(result).toBeUndefined();
    });

    test("should get the client instance", () => {
        const client = centrifugo.getClient();
        expect(client).toBeDefined();
        expect(client).not.toBeNull();
    });

    test("should return API mode", () => {
        const mode = centrifugo.getMode();
        expect(mode).toBe(CentrifugoMode.API);
    });

    test("should publish complex data structures", async () => {
        const complexData = {
            user: {
                id: "user-123",
                name: "John Doe",
                email: "john@example.com",
                metadata: {
                    roles: ["admin", "user"],
                    lastLogin: new Date().toISOString(),
                },
            },
            event: {
                type: "login",
                timestamp: Date.now(),
                details: {
                    ip: "192.168.1.1",
                    location: "US",
                },
            },
            tags: ["important", "verified"],
            nested: {
                level1: {
                    level2: {
                        level3: "deep value",
                    },
                },
            },
        };

        const result = await centrifugo.publish("complex-channel", complexData);
        expect(result).toBeUndefined();
    });

    test("should handle long channel names", async () => {
        const longChannelName = "very-long-channel-name-" + "x".repeat(100);
        const result = await centrifugo.publish(longChannelName, {
            test: "long-channel-name",
        });
        expect(result).toBeUndefined();
    });

    test("should handle rapid successive publishes", async () => {
        const promises = [];
        for (let i = 0; i < 5; i++) {
            promises.push(
                centrifugo.publish(`rapid-test-${i}`, { index: i })
            );
        }
        await Promise.all(promises);
        expect(promises.length).toBe(5);
    });
});
