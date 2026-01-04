import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { Centrifugo } from "../src/main";

describe("Centrifugo SDK - Complete gRPC API Methods", () => {
    let centrifugo: Centrifugo;

    beforeAll(() => {
        centrifugo = new Centrifugo({
            mode: "GRPC",
            endpoint: "localhost:10000",
            apiKey: "test_grpc_api_key_12345",
            logLevel: "debug",
            debug: true,
        });
    });

    afterAll(async () => {
        await centrifugo.close();
    });

    // publish - already tested
    test("should publish message via gRPC", async () => {
        await expect(
            centrifugo.publish("grpc-complete-test", { message: "grpc test" })
        ).resolves.toBeUndefined();
    });

    // broadcast - already tested
    test("should broadcast message via gRPC to multiple channels", async () => {
        await expect(
            centrifugo.broadcast(["grpc-channel1", "grpc-channel2"], { 
                message: "grpc broadcast" 
            })
        ).resolves.toBeUndefined();
    });

    // subscribe - NEW METHOD via gRPC
    test("should subscribe user to channel via gRPC", async () => {
        await expect(
            centrifugo.subscribe("grpc-user-123", "grpc-complete-channel", {
                info: { username: "grpc_user" },
            })
        ).resolves.toBeUndefined();
    });

    // refresh - NEW METHOD via gRPC
    test("should refresh user connection via gRPC", async () => {
        await expect(
            centrifugo.refresh("grpc-user-123")
        ).resolves.toBeUndefined();
    });

    // unsubscribe - already tested
    test("should unsubscribe user from channel via gRPC", async () => {
        await expect(
            centrifugo.unsubscribe("grpc-user-123", "grpc-complete-channel")
        ).resolves.toBeUndefined();
    });

    // disconnect - already tested
    test("should disconnect user via gRPC", async () => {
        await expect(
            centrifugo.disconnect("grpc-user-123")
        ).resolves.toBeUndefined();
    });

    // Test core gRPC methods workflow
    test("should perform core gRPC workflow", async () => {
        // 1. Subscribe user
        await centrifugo.subscribe("grpc-workflow-user", "grpc-workflow-channel", {
            info: { gRPC: true },
        });

        // 2. Publish message
        await centrifugo.publish("grpc-workflow-channel", { text: "gRPC Hello" });

        // 3. Broadcast
        await centrifugo.broadcast(["grpc-ch1", "grpc-ch2"], { text: "broadcast" });

        // 4. Refresh connection
        await centrifugo.refresh("grpc-workflow-user");

        // 5. Unsubscribe
        await centrifugo.unsubscribe("grpc-workflow-user", "grpc-workflow-channel");

        // 6. Disconnect
        await centrifugo.disconnect("grpc-workflow-user");
    });

    // Test optional parameters
    test("should subscribe with advanced options", async () => {
        await expect(
            centrifugo.subscribe("grpc-advanced-user", "grpc-advanced-channel", {
                info: { role: "admin", timestamp: Date.now() },
                data: { custom: "subscription data" },
            })
        ).resolves.toBeUndefined();
    });

    // Test refresh with expiration
    test("should refresh with expiration settings", async () => {
        const futureTime = Math.floor(Date.now() / 1000) + 3600;
        await expect(
            centrifugo.refresh("grpc-expiring-user", {
                expire_at: futureTime,
                expired: false,
            })
        ).resolves.toBeUndefined();
    });
});
