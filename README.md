# Centrifugo Server SDK

A powerful **TypeScript/JavaScript server-side SDK** for [Centrifugo](https://centrifugal.dev/) - a real-time messaging server. Build scalable real-time applications with ease.

## Features

- 🚀 **Dual Mode Support**: Both HTTP API and GRPC communication modes
- 📨 **Message Publishing**: Publish to single or multiple channels with optional idempotency
- 📜 **Message History**: Retrieve historical messages with pagination
- 👥 **Presence Management**: Track active users in channels
- 📊 **Presence Stats**: Get real-time presence statistics
- ⚙️ **Queue Integration**: Optional BullMQ support for reliable async operations
- 🔒 **Type Safe**: Full TypeScript support with comprehensive types
- ⏱️ **Expiration & Refresh**: User connection refresh and expiration handling
- 🎯 **Batch Operations**: Support for batch requests
- 🪵 **Enhanced Logging**: Flexible logging configuration with multiple levels
- 🔄 **Idempotency Support**: Built-in idempotency key support with UUID v4 generation

## Requirements

- **Node.js**: 14.18.0+ (for `crypto.randomUUID()` support in idempotency features)
- **TypeScript**: 4.5+

## Installation

```bash
npm install centrifugo-server-sdk
```

Or with Bun:

```bash
bun add centrifugo-server-sdk
```

Or with Yarn:

```bash
yarn add centrifugo-server-sdk
```

### Optional Dependencies

Install these only if you need specific features:

```bash
# For API mode with HTTP requests
npm install axios

# For queue support with BullMQ
npm install bullmq ioredis

# For GRPC mode
npm install @grpc/grpc-js
```

Or install all optional dependencies:

```bash
npm install axios bullmq ioredis @grpc/grpc-js
```

### Peer Dependencies

- `axios` - HTTP client for API mode (optional)
- `bullmq` - Task queue for background jobs (optional)
- `ioredis` - Redis client for queue support (optional)
- `@grpc/grpc-js` - GRPC client for GRPC mode (optional)

## Quick Start

### API Mode (HTTP) with Enhanced Logging

```typescript
import { Centrifugo } from "centrifugo-server-sdk";

const centrifugo = new Centrifugo({
  mode: "API",
  endpoint: "http://localhost:8000",
  apiKey: process.env.CENTRIFUGO_API_KEY,
  logOption: {
    enable: true,
    level: "info", // "error" | "warn" | "info" | "debug"
  },
});

// Publish a message
await centrifugo.publish("chat:general", {
  user_id: 123,
  message: "Hello, world!",
  timestamp: Date.now(),
});

// Broadcast to multiple channels
await centrifugo.broadcast(
  ["news", "updates", "alerts"],
  {
    event: "breaking_news",
    content: "Important update",
  }
);

// Get presence stats
const stats = await centrifugo.presenceStats("chat:general");
console.log(`Active users: ${stats.num_clients}`);

// Get channel history
const history = await centrifugo.history("chat:general", { limit: 50 });
console.log(`Recent messages:`, history);

// Change log level at runtime
centrifugo.setLogLevel("debug");

// Disable logging
centrifugo.setLogging(false);

// Clean up
await centrifugo.close();
```

### GRPC Mode

```typescript
import { Centrifugo } from "centrifugo-server-sdk";

const centrifugo = new Centrifugo({
  mode: "GRPC",
  endpoint: "localhost:10000",
  logOption: {
    enable: true,
    level: "info",
  },
});

await centrifugo.publish("events", {
  type: "user_action",
  action: "login",
  user_id: 456,
});

await centrifugo.close();
```

### With Idempotency Support

```typescript
import { Centrifugo } from "centrifugo-server-sdk";

// Option 1: Auto-generate idempotency keys with UUID v4
const centrifugo = new Centrifugo({
  mode: "API",
  endpoint: "http://localhost:8000",
  apiKey: process.env.CENTRIFUGO_API_KEY,
  idempotency: {
    enabled: true,
    // Uses crypto.randomUUID() automatically - no custom generator needed
  },
});

// Each publish/broadcast gets a unique idempotency key
await centrifugo.publish("chat:general", {
  text: "Hello!",
  user_id: 123,
});

// Option 2: Provide custom idempotency key
await centrifugo.publish(
  "chat:general",
  { text: "Hello!" },
  "custom-idempotency-key-123"
);

// Option 3: Custom key generation function
const centrifugoCustom = new Centrifugo({
  mode: "API",
  endpoint: "http://localhost:8000",
  apiKey: process.env.CENTRIFUGO_API_KEY,
  idempotency: {
    enabled: true,
    generate: (data) => {
      // Your custom logic - return a string
      return `${Date.now()}-${Math.random()}`;
    },
  },
});
```

### With Queue Support

```typescript
import { Centrifugo } from "centrifugo-server-sdk";

const centrifugo = new Centrifugo({
  mode: "API",
  endpoint: "http://localhost:8000",
  apiKey: process.env.CENTRIFUGO_API_KEY,
  enableQueue: true,
  queueConfig: {
    redis: {
      host: "localhost",
      port: 6379,
      password: process.env.REDIS_PASSWORD,
      db: 0,
    },
    // Configure worker concurrency and other options
    worker: {
      concurrency: 10, // Process 10 jobs simultaneously
      lockDuration: 30000, // 30 second lock duration
      maxStalledCount: 2, // Max stalled count before removing
    },
    // Default job options
    defaultJobOptions: {
      attempts: 3, // Retry 3 times on failure
      backoff: {
        type: "exponential",
        delay: 1000,
      },
      removeOnComplete: true, // Auto-remove completed jobs
    },
  },
  logOption: {
    enable: true,
    level: "info",
  },
});

// Start queue worker
await centrifugo.startQueue(async (jobData) => {
  console.log("Processing job:", jobData);
  // Your custom job handler
});

// Messages will be queued automatically
await centrifugo.publish("channel", { data: "test" });

// Get queue stats
const queueInstance = await centrifugo.getQueue();
const stats = await queueInstance?.getStats();
console.log("Queue stats:", stats);
```

## API Reference

### Constructor Options

```typescript
interface CentrifugoConfig {
  mode: "API" | "GRPC";
  endpoint: string;
  apiKey?: string;
  
  // Enhanced logging configuration
  logOption?: {
    enable?: boolean;                      // Enable/disable logging (default: true)
    level?: "error" | "warn" | "info" | "debug"; // Log level (default: "info")
  };
  
  // Deprecated (still supported for backward compatibility)
  logLevel?: "error" | "warn" | "info" | "debug";
  debug?: boolean;
  
  // Idempotency configuration
  idempotency?: {
    enabled?: boolean;
    generate?: (data: any) => string;     // Custom key generator
    // If not provided, uses crypto.randomUUID() by default
  };
  
  enableQueue?: boolean;
  queueConfig?: {
    redis?: {
      host: string;
      port: number;
      password?: string;
      db?: number;
      username?: string;
      connectTimeout?: number;
      keepAlive?: number;
    };
    worker?: {
      concurrency?: number;        // Number of jobs to process simultaneously (default: 1)
      lockDuration?: number;       // Lock duration in ms (default: 30000)
      lockRenewTime?: number;      // Lock renewal time in ms
      maxStalledCount?: number;    // Max stalled count before removing
      stalledInterval?: number;    // Interval to check for stalled jobs
      useWorkerThreads?: boolean;  // Use worker threads
    };
    defaultJobOptions?: {
      attempts?: number;           // Number of retry attempts
      backoff?: {
        type: 'exponential' | 'fixed';
        delay: number;
      };
      delay?: number;              // Job delay in ms
      priority?: number;           // Job priority (higher = more important)
      removeOnComplete?: boolean;  // Auto-remove on completion
      removeOnFail?: boolean;      // Auto-remove on failure
      timeout?: number;            // Job timeout in ms
    };
  };
}
```

### Core Methods

#### `publish(channel: string, data: any, idempotencyKey?: string): Promise<void>`

Publish a message to a specific channel with optional idempotency.

```typescript
// Basic publish
await centrifugo.publish("notifications:user123", {
  type: "alert",
  message: "You have a new message",
  priority: "high",
});

// With custom idempotency key
await centrifugo.publish(
  "notifications:user123",
  { type: "alert", message: "New message" },
  "unique-key-12345"
);

// With auto-generated idempotency key (if enabled in config)
await centrifugo.publish("notifications:user123", {
  type: "alert",
  message: "New message",
  // Automatically gets a UUID v4 idempotency key
});
```

#### `broadcast(channels: string[], data: any, idempotencyKey?: string): Promise<void>`

Broadcast a message to multiple channels at once with optional idempotency.

```typescript
// Basic broadcast
await centrifugo.broadcast(
  ["notifications:all", "system:alerts"],
  {
    event: "maintenance_scheduled",
    time: "2024-01-05T10:00:00Z",
  }
);

// With idempotency key
await centrifugo.broadcast(
  ["notifications:all", "system:alerts"],
  { event: "maintenance_scheduled" },
  "maintenance-2024-01-05"
);
```

#### `history(channel: string, options?: HistoryOptions): Promise<Publication[]>`

Retrieve message history from a channel.

```typescript
// Get last 100 messages
const messages = await centrifugo.history("chat:general", { limit: 100 });

// Get messages since a specific position
const recentMessages = await centrifugo.history("chat:general", {
  limit: 50,
  since: "last_stream_position",
});
```

#### `presence(channel: string): Promise<PresenceData>`

Get presence information for a channel (who is online).

```typescript
const presence = await centrifugo.presence("chat:general");
console.log("Users online:", Object.keys(presence.presence));
```

#### `presenceStats(channel: string): Promise<{num_clients: number, num_users: number}>`

Get aggregate presence statistics for a channel.

```typescript
const stats = await centrifugo.presenceStats("chat:general");
console.log(`${stats.num_clients} clients, ${stats.num_users} unique users`);
```

#### `subscribe(user: string, channel: string, options?: SubscribeOptions): Promise<void>`

Subscribe a user to a channel server-side.

```typescript
await centrifugo.subscribe("user123", "private:notifications", {
  info: { name: "John Doe", premium: true },
});
```

#### `unsubscribe(user: string, channel?: string): Promise<void>`

Unsubscribe a user from a channel (or all channels if not specified).

```typescript
// Unsubscribe from specific channel
await centrifugo.unsubscribe("user123", "chat:general");

// Unsubscribe from all channels
await centrifugo.unsubscribe("user123");
```

#### `disconnect(user: string, reconnect?: boolean): Promise<void>`

Disconnect a user from the server.

```typescript
await centrifugo.disconnect("user123", false); // Don't allow reconnect
```

#### `refresh(user: string, options?: RefreshOptions): Promise<void>`

Refresh a user's connection and update their info.

```typescript
await centrifugo.refresh("user123", {
  expire_at: Math.floor(Date.now() / 1000) + 3600, // Expire in 1 hour
});
```

#### `channels(pattern?: string): Promise<ChannelsResult>`

Get active channels, optionally filtered by pattern.

```typescript
// Get all active channels
const allChannels = await centrifugo.channels();

// Get channels matching a pattern
const chatChannels = await centrifugo.channels("chat:*");
```

#### `info(): Promise<any>`

Get server information and stats.

```typescript
const serverInfo = await centrifugo.info();
console.log("Server version:", serverInfo.version);
```

### Logging Methods

#### `setLogging(enabled: boolean): void`

Enable or disable logging at runtime.

```typescript
const centrifugo = new Centrifugo({
  mode: "API",
  endpoint: "http://localhost:8000",
  logOption: { enable: true, level: "info" },
});

// Disable all logging
centrifugo.setLogging(false);

// Re-enable logging
centrifugo.setLogging(true);
```

#### `setLogLevel(level: LogLevel): void`

Change the log level at runtime.

```typescript
// Set to debug for verbose output
centrifugo.setLogLevel("debug");

// Set to warn for less verbose output
centrifugo.setLogLevel("warn");
```

### Queue Methods

#### `startQueue(handler?: (jobData: any) => Promise<void>): Promise<void>`

Start the queue worker.

```typescript
await centrifugo.startQueue(async (jobData) => {
  // Handle different job types
  if (jobData.type === "publish") {
    console.log(`Publishing to ${jobData.channel}`);
  }
});
```

#### `getQueue(): Promise<CentrifugoQueue | null>`

Get the queue instance to interact with it directly.

```typescript
const queue = await centrifugo.getQueue();
const stats = await queue?.getStats();
console.log(stats);
```

#### `close(): Promise<void>`

Close all connections and clean up resources.

```typescript
await centrifugo.close();
```

## Configuration

### Environment Variables

```env
# Server Configuration
CENTRIFUGO_ENDPOINT=http://localhost:8000
CENTRIFUGO_MODE=API
CENTRIFUGO_API_KEY=your_api_key

# Logging Configuration
LOG_LEVEL=info
DEBUG=false

# Idempotency
ENABLE_IDEMPOTENCY=true

# Queue Configuration
ENABLE_QUEUE=true
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=optional_password
REDIS_DB=0
```

### TypeScript Configuration

The SDK includes full TypeScript types. No additional type packages needed.

```typescript
import type { Centrifugo, CentrifugoConfig } from "centrifugo-server-sdk";

const config: CentrifugoConfig = {
  mode: "API",
  endpoint: "http://localhost:8000",
  logOption: {
    enable: true,
    level: "info",
  },
};
```

## Architecture

```
src/
├── api/                    # HTTP API client
│   ├── core.ts            # Core API implementation
│   └── index.ts           # API exports
├── grpc/                   # GRPC client
│   ├── grpc.ts            # GRPC implementation
│   ├── grpc.proto         # Protocol buffers
│   └── generated/         # Generated GRPC types
├── queue/                  # Queue management
│   ├── queue.ts           # BullMQ wrapper
│   └── type.ts            # Queue types
├── core/                   # Core types
│   ├── type.ts            # Shared types
│   └── index.ts           # Core exports
├── lib/                    # Utilities
│   ├── logger.ts          # Logging utility
│   └── index.ts           # Lib exports
├── main.ts                # Main Centrifugo class
└── index.ts               # Package entry point
```

## Error Handling

```typescript
try {
  await centrifugo.publish("channel", { data: "test" });
} catch (error) {
  if (error instanceof Error) {
    console.error("Failed to publish:", error.message);
  }
}
```

## Best Practices

1. **Always close connections**: Call `await centrifugo.close()` when done
2. **Use queue for high volume**: Enable queue for production deployments
3. **Handle errors gracefully**: Wrap SDK calls in try-catch
4. **Use typed interfaces**: Leverage TypeScript for better DX
5. **Set appropriate log levels**: Use `debug` during development, `info` in production
6. **Connection pooling**: SDK handles connection management automatically
7. **Enable idempotency**: Use idempotency for critical operations to prevent duplicates on retries
8. **Configure logging**: Use enhanced logging options for better observability

## Idempotency Notes

Idempotency keys are useful for ensuring that operations are only processed once, even if the request is retried:

- **Default behavior**: When `idempotency.enabled: true` without a custom generator, the SDK uses `crypto.randomUUID()` (Node.js 14.18.0+)
- **Custom keys**: Pass an idempotency key manually for deterministic behavior
- **Custom generator**: Provide your own generator function for custom logic
- **Cache duration**: Centrifugo caches idempotency results for 5 minutes per channel
- **Engine support**: Idempotency is supported by Memory and Redis engines

## Logging Configuration

The SDK provides flexible logging with multiple levels:

```typescript
// Configuration
logOption: {
  enable: true,           // Enable/disable logging
  level: "info"          // "error" | "warn" | "info" | "debug"
}

// Runtime control
centrifugo.setLogging(false);    // Disable
centrifugo.setLogLevel("debug"); // Change level
```

## Performance Tips

- **Lazy Loading**: Queue support is lazy-loaded on first use, keeping initial bundle small for API-only mode
- **Batch Operations**: Use `broadcast()` instead of multiple `publish()` calls
- **Queue Processing**: For high-traffic scenarios, enable BullMQ queue with configurable concurrency
- **Message History**: Use `limit` parameter to avoid loading too much history
- **Presence Stats**: Use `presenceStats()` instead of `presence()` when you only need counts
- **Idempotency**: Use idempotency for critical operations, not for every publish
- **Optional Dependencies**: GRPC, Queue, and Redis dependencies are optional - install only what you need
- **Log Levels**: Use `info` level in production to reduce logging overhead

## Supported Centrifugo Versions

- Centrifugo v4.0+
- Centrifugo v5.0+

## Supported Node.js Versions

- Node.js 14.18.0+ (for `crypto.randomUUID()` support)
- Recommended: Node.js 16+ for better stability and performance

## Testing

Run the test suite:

```bash
bun test                    # Run all tests
bun test --watch           # Run in watch mode
bun test --verbose         # Verbose output
bun test tests/api.test.ts # Run specific test file
```

## License

MIT

## Support & Documentation

- 📚 [Centrifugo Official Docs](https://centrifugal.dev/docs/)
- 📘 [Enhancements Guide](ENHANCEMENTS.md) - Detailed guide for new features
- 🐛 [GitHub Issues](https://github.com/Bubu-Labs/centrifugo-server-sdk/issues)
- 💬 [Centrifugo Community](https://centrifugal.dev/community)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.


