import { Queue, Worker, QueueOptions, WorkerOptions as BullMQWorkerOptions } from "bullmq";
import { CentrifugoQueueConfig, QueueJobData } from "./type";

export class CentrifugoQueue {
    private queue: Queue<QueueJobData>;
    private worker: Worker<QueueJobData> | null = null;
    private config: CentrifugoQueueConfig;

    constructor(config?: CentrifugoQueueConfig) {
        this.config = config || { redis: { host: "localhost", port: 6379 } };
        const redisConfig = config?.redis || {
            host: "localhost",
            port: 6379,
        };

        const queueOptions: QueueOptions = {
            connection: redisConfig,
            defaultJobOptions: config?.defaultJobOptions,
        };

        this.queue = new Queue<QueueJobData>("centrifugo", queueOptions);
    }

    async addJob(method: string, params: Record<string, any>): Promise<void> {
        try {
            await this.queue.add("centrifugo_task", {
                method,
                params,
            });
        } catch (error) {
            throw new Error(`Failed to add job to queue: ${error}`);
        }
    }

    async startWorker(
        handler: (data: QueueJobData) => Promise<void>
    ): Promise<void> {
        const redisConfig = this.config.redis || {
            host: "localhost",
            port: 6379,
        };

        const workerOptions: BullMQWorkerOptions = {
            connection: redisConfig,
            concurrency: this.config.worker?.concurrency,
        };

        this.worker = new Worker<QueueJobData>(
            "centrifugo",
            async (job) => {
                try {
                    await handler(job.data);
                } catch (error) {
                    console.error(`Job processing failed: ${error}`);
                    throw error;
                }
            },
            workerOptions
        );

        this.worker.on("completed", (job) => {
            console.log(`Job ${job.id} completed`);
        });

        this.worker.on("failed", (job, err) => {
            console.error(`Job ${job?.id} failed:`, err);
        });
    }

    async close(): Promise<void> {
        if (this.worker) {
            await this.worker.close();
        }
        await this.queue.close();
    }

    getQueue(): Queue<QueueJobData> {
        return this.queue;
    }
}
