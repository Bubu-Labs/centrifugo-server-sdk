import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { Centrifugo } from "../src/main";

describe("Centrifugo Integration - SDK Publication", () => {
    let centrifugo: Centrifugo;

    beforeAll(async () => {
        // Initialize SDK server-side client
        centrifugo = new Centrifugo({
            mode: "API",
            endpoint: "http://localhost:8000",
            apiKey: "test_api_key_12345",
            logLevel: "debug",
            debug: true,
        });
    });

    afterAll(async () => {
        await centrifugo.close();
    });

    test("should publish message to general namespace", async () => {
        const testChannel = "general:test-channel-" + Date.now();
        const messageData = { text: "hello from SDK", timestamp: Date.now() };

        // Should publish without error
        await expect(
            centrifugo.publish(testChannel, messageData)
        ).resolves.toBeUndefined();
    });

    test("should broadcast to multiple channels", async () => {
        const channels = ["general:ch1-" + Date.now(), "general:ch2-" + Date.now()];
        const messageData = { type: "broadcast", value: "test" };

        // Should broadcast without error
        await expect(
            centrifugo.broadcast(channels, messageData)
        ).resolves.toBeUndefined();
    });

    test("should subscribe user to channel", async () => {
        const user = "test-user-" + Date.now();
        const channel = "general:test-ch-" + Date.now();

        // Should subscribe without error
        await expect(
            centrifugo.subscribe(user, channel, { 
                info: { username: "test_user" } 
            })
        ).resolves.toBeUndefined();
    });

    test("should refresh user connection", async () => {
        const user = "test-user-" + Date.now();

        // Should refresh without error
        await expect(
            centrifugo.refresh(user)
        ).resolves.toBeUndefined();
    });

    test("should get history from channel", async () => {
        const testChannel = "general:history-ch-" + Date.now();

        // Publish some messages
        for (let i = 0; i < 3; i++) {
            await centrifugo.publish(testChannel, { 
                id: i, 
                message: `Message ${i}` 
            });
        }

        // Get history
        const history = await centrifugo.history(testChannel, { limit: 10 });
        
        expect(history).toBeDefined();
        expect(Array.isArray(history)).toBe(true);
    });

    test("should get presence info", async () => {
        const channel = "general:presence-ch-" + Date.now();

        // Get presence - may be empty
        const presence = await centrifugo.presence(channel);
        
        expect(presence).toBeDefined();
        expect(typeof presence).toBe("object");
    });

    test("should get presence stats", async () => {
        const channel = "general:stats-ch-" + Date.now();

        // Get stats - may show 0 clients
        const stats = await centrifugo.presenceStats(channel);
        
        expect(stats).toBeDefined();
        expect(typeof stats.num_clients).toBe("number");
        expect(typeof stats.num_users).toBe("number");
    });

    test("should get server info", async () => {
        // Get info
        const info = await centrifugo.info();
        
        expect(info).toBeDefined();
        expect(typeof info).toBe("object");
        expect(info !== null).toBe(true);
    });

    test("should get active channels", async () => {
        // First publish to create a channel
        await centrifugo.publish("general:active-ch-" + Date.now(), { test: true });

        // Get channels
        const channels = await centrifugo.channels();
        
        expect(channels).toBeDefined();
        expect(typeof channels).toBe("object");
    });
});
