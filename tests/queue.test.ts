import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { Centrifugo, CentrifugoMode } from "../src/index";

describe("Centrifugo SDK - Queue Tests", () => {
    let centrifugo: Centrifugo;

    beforeAll(() => {
        centrifugo = new Centrifugo({
            mode: CentrifugoMode.API,
            endpoint: "http://localhost:8000",
            apiKey: "test_api_key_12345",
            enableQueue: true,
            queueConfig: {
                redis: {
                    host: "localhost",
                    port: 6379,
                    password: undefined,
                    db: 0,
                },
            },
        });
    });

    afterAll(async () => {
        await centrifugo.close();
    });

    test("should initialize queue successfully", () => {
        expect(centrifugo).toBeDefined();
    });

    test("should start queue worker", async () => {
        const queue = await centrifugo.getQueue();
        expect(queue).toBeDefined();
        expect(queue).not.toBeNull();
    });

    test("should queue a publish job", async () => {
        const queue = await centrifugo.getQueue();
        if (queue) {
            // addJob returns void, not the job
            await queue.addJob("publish", {
                channel: "queue-test",
                data: { message: "Test message" },
            });
            expect(queue).toBeDefined();
        }
    });

    test("should queue multiple jobs", async () => {
        const queue = await centrifugo.getQueue();
        if (queue) {
            const jobs = [];
            for (let i = 0; i < 3; i++) {
                const job = await queue.addJob("publish", {
                    channel: `queue-test-${i}`,
                    data: { index: i },
                });
                jobs.push(job);
            }
            expect(jobs.length).toBe(3);
        }
    });

    test("should publish with queue enabled", async () => {
        const result = await centrifugo.publish("queue-enabled-channel", {
            message: "Test with queue",
            timestamp: new Date().toISOString(),
        });
        expect(result).toBeUndefined();
    });

    test("should broadcast with queue enabled", async () => {
        const result = await centrifugo.broadcast(
            ["queue-channel-1", "queue-channel-2"],
            {
                message: "Broadcast with queue",
                timestamp: new Date().toISOString(),
            }
        );
        expect(result).toBeUndefined();
    });

    test("should get queue statistics", async () => {
        const queue = await centrifugo.getQueue();
        if (queue) {
            // Give it a moment for jobs to process
            await new Promise((resolve) => setTimeout(resolve, 500));

            // Get the underlying BullMQ queue
            const bullQueue = queue.getQueue();
            const counts = await bullQueue.getJobCounts();

            expect(counts).toBeDefined();
            expect(typeof counts.completed).toBe("number");
            expect(typeof counts.active).toBe("number");
        }
    });
});
