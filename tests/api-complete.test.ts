import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { Centrifugo } from "../src/main";

describe("Centrifugo SDK - Complete API Methods", () => {
    let centrifugo: Centrifugo;

    beforeAll(() => {
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

    // publish - already tested in basic tests
    test("should publish message to channel", async () => {
        await expect(
            centrifugo.publish("complete-test", { message: "test" })
        ).resolves.toBeUndefined();
    });

    // broadcast - already tested in basic tests
    test("should broadcast message to multiple channels", async () => {
        await expect(
            centrifugo.broadcast(["channel1", "channel2"], { message: "broadcast test" })
        ).resolves.toBeUndefined();
    });

    // subscribe - NEW METHOD
    test("should subscribe user to channel", async () => {
        await expect(
            centrifugo.subscribe("user-123", "complete-channel", {
                info: { name: "John Doe" },
            })
        ).resolves.toBeUndefined();
    });

    // refresh - NEW METHOD
    test("should refresh user connection", async () => {
        await expect(
            centrifugo.refresh("user-123", {
                expired: false,
            })
        ).resolves.toBeUndefined();
    });

    // presence - already tested in basic tests but now enabled
    test("should get channel presence", async () => {
        const presence = await centrifugo.presence("complete-test");
        expect(typeof presence === "object").toBe(true);
    });

    // presence_stats - already tested in basic tests
    test("should get presence stats", async () => {
        const stats = await centrifugo.presenceStats("complete-test");
        expect(typeof stats.num_clients === "number").toBe(true);
        expect(typeof stats.num_users === "number").toBe(true);
    });

    // history - already tested in basic tests but now enabled
    test("should get channel history", async () => {
        // Publish a few messages first
        await centrifugo.publish("complete-test", { message: "history-test-1" });
        await centrifugo.publish("complete-test", { message: "history-test-2" });
        
        const history = await centrifugo.history("complete-test", 10);
        expect(Array.isArray(history)).toBe(true);
    });

    // history_remove - NEW METHOD
    test("should remove channel history", async () => {
        await expect(
            centrifugo.historyRemove("complete-test")
        ).resolves.toBeUndefined();
    });

    // unsubscribe - already tested in basic tests
    test("should unsubscribe user from channel", async () => {
        await expect(
            centrifugo.unsubscribe("user-123", "complete-channel")
        ).resolves.toBeUndefined();
    });

    // disconnect - already tested in basic tests
    test("should disconnect user", async () => {
        await expect(
            centrifugo.disconnect("user-123")
        ).resolves.toBeUndefined();
    });

    // channels - NEW METHOD
    test("should get active channels", async () => {
        const channels = await centrifugo.channels();
        expect(typeof channels === "object").toBe(true);
    });

    // channels with pattern - NEW METHOD
    test("should get channels by pattern", async () => {
        const channels = await centrifugo.channels("complete-*");
        expect(typeof channels === "object").toBe(true);
    });

    // info - NEW METHOD
    test("should get server info", async () => {
        const info = await centrifugo.info();
        expect(typeof info === "object").toBe(true);
    });

    // Test new write methods in sequence
    test("should perform workflow with new API methods", async () => {
        // 1. Subscribe user to channel
        await centrifugo.subscribe("workflow-user", "workflow-channel", {
            info: { role: "user" },
        });

        // 2. Publish message
        await centrifugo.publish("workflow-channel", { text: "Hello" });

        // 3. Broadcast
        await centrifugo.broadcast(["ch1", "ch2"], { text: "broadcast" });

        // 4. Refresh connection
        await centrifugo.refresh("workflow-user");

        // 5. Get channels
        const channels = await centrifugo.channels();
        expect(typeof channels === "object").toBe(true);

        // 6. Get info
        const info = await centrifugo.info();
        expect(typeof info === "object").toBe(true);

        // 7. Unsubscribe
        await centrifugo.unsubscribe("workflow-user", "workflow-channel");
    });

    // Test subscribe with all options
    test("should subscribe with advanced options", async () => {
        await expect(
            centrifugo.subscribe("advanced-user", "advanced-channel", {
                info: { role: "admin", timestamp: Date.now() },
                client: "client-id-123",
                data: { custom: "subscription data" },
            })
        ).resolves.toBeUndefined();
    });

    // Test refresh with expiration
    test("should refresh with expiration settings", async () => {
        const futureTime = Math.floor(Date.now() / 1000) + 3600;
        await expect(
            centrifugo.refresh("expiring-user", {
                expire_at: futureTime,
                expired: false,
            })
        ).resolves.toBeUndefined();
    });
});
