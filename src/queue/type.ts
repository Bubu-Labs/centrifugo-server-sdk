export interface RedisConfig {
    host: string;
    port: number;
    password?: string;
    db?: number;
    username?: string;
    maxRetriesPerRequest?: number;
    enableReadyCheck?: boolean;
    enableOfflineQueue?: boolean;
    connectTimeout?: number;
    retryStrategy?: (times: number) => number | null;
    family?: number; // IPv4 or IPv6
    keepAlive?: number;
    noDelay?: boolean;
    tls?: {
        rejectUnauthorized?: boolean;
        ca?: string[];
        cert?: string;
        key?: string;
    };
}

export interface QueueJobOptions {
    attempts?: number;
    backoff?: {
        type: 'exponential' | 'fixed';
        delay: number;
    };
    delay?: number;
    priority?: number;
    repeat?: {
        pattern?: string;
        every?: number;
        limit?: number;
        startDate?: Date | number;
        endDate?: Date | number;
        tz?: string;
    };
    removeOnComplete?: boolean | { age?: number; count?: number };
    removeOnFail?: boolean | { age?: number };
    timeout?: number;
    jobId?: string;
    parent?: { id: string; waitChildrenError?: boolean };
    salariedInterval?: number;
    trace?: boolean;
}

export interface WorkerConfig {
    concurrency?: number;
    lockDuration?: number;
    lockRenewTime?: number;
    maxStalledCount?: number;
    maxStalledInterval?: number;
    stalledInterval?: number;
    useWorkerThreads?: boolean;
    autorun?: boolean;
    processingTimeout?: number;
}

export interface CentrifugoQueueConfig {
    name?: string;
    redis?: RedisConfig;
    defaultJobOptions?: QueueJobOptions;
    worker?: WorkerConfig;
    settings?: {
        maxListeners?: number;
        guardInterval?: number;
        retryProcessDelay?: number;
        cleaningInterval?: number;
    };
    [key: string]: any;
}

export interface QueueJobData {
    method: string;
    params: Record<string, any>;
    timestamp?: number;
    priority?: number;
    metadata?: Record<string, any>;
}

export interface QueueJobResult {
    success: boolean;
    data?: any;
    error?: string;
    timestamp?: number;
    duration?: number;
}

export interface QueueStats {
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
    paused: number;
}

export interface WorkerOptions {
    concurrency?: number;
    processInterval?: number;
    lockDuration?: number;
    lockRenewTime?: number;
    stalledInterval?: number;
    maxStalledCount?: number;
}

export interface JobEventHandlers {
    onProgress?: (job: any, progress: number) => void;
    onAttemptFailed?: (job: any, error: Error) => void;
    onCompleted?: (job: any, result?: any) => void;
    onFailed?: (job: any, error: Error) => void;
    onRemoved?: (job: any) => void;
}

export interface QueueEventHandlers {
    onError?: (error: Error) => void;
    onActive?: (job: any) => void;
    onCompleted?: (job: any, result?: any) => void;
    onFailed?: (job: any, error: Error) => void;
    onStalled?: (job: any) => void;
    onWaiting?: (jobId: string) => void;
    onPaused?: () => void;
    onResumed?: () => void;
    onCleaned?: (jobs: string[], type: string) => void;
}