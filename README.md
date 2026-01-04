# Centrifugo Server SDK

TypeScript server-side library for [Centrifugo](https://centrifugal.dev/) - a real-time messaging server.

## Features

- 🚀 **Dual Mode Support**: Both API and GRPC communication modes
- 📨 **Message Publishing**: Publish to single or multiple channels
- 📜 **Message History**: Retrieve historical messages from channels
- 👥 **Presence Management**: Track user presence in channels
- ⚙️ **Queue Support**: Optional BullMQ integration for async operations
- 🔒 **Type Safe**: Full TypeScript support

## Installation

```bash
npm install centrifugo-server-sdk axios bullmq ioredis
```

Or with Bun:

```bash
bun add centrifugo-server-sdk axios bullmq ioredis
```

## Quick Start

### API Mode (Default)

```typescript
import { Centrifugo, CentrifugoMode } from "centrifugo-server-sdk";

const centrifugo = new Centrifugo({
  mode: CentrifugoMode.API,
  endpoint: "http://localhost:8000",
  apiKey: process.env.CENTRIFUGO_API_KEY, // Optional: API key for authentication
});

// Publish a message
await centrifugo.publish("chat", {
  user_id: 123,
  message: "Hello, world!",
});

// Broadcast to multiple channels
await centrifugo.broadcast(["news", "updates"], {
  event: "breaking_news",
  content: "Important update",
});

// Get presence stats
const stats = await centrifugo.presenceStats("chat");
console.log(`Active users: ${stats.num_clients}`);
```

### GRPC Mode

```typescript
const centrifugo = new Centrifugo({
  mode: CentrifugoMode.GRPC,
  endpoint: "localhost:10000",
});

await centrifugo.publish("events", {
  type: "user_action",
  action: "login",
});
```

### With Queue

```typescript
const centrifugo = new Centrifugo({
  mode: CentrifugoMode.API,
  endpoint: "http://localhost:8000",
  apiKey: process.env.CENTRIFUGO_API_KEY, // Optional: API key for authentication
  enableQueue: true,
  queueConfig: {
    redis: {
      host: "localhost",
      port: 6379,
      password: "optional_password",
      db: 0,
    },
  },
});

// Start queue worker
await centrifugo.startQueue(async (jobData) => {
  console.log("Processing:", jobData);
});

// Messages will be queued automatically
await centrifugo.publish("channel", { data: "test" });
```

## API Reference

### Constructor

```typescript
new Centrifugo(config: CentrifugoConfig)
```

**Config Options:**
- `mode` (CentrifugoMode | "API" | "GRPC"): Communication mode
- `endpoint` (string): Centrifugo server endpoint
- `enableQueue` (boolean, optional): Enable BullMQ queue
- `queueConfig` (CentrifugoQueueConfig, optional): Redis configuration for queue

### Methods

#### `publish(channel: string, data: Record<string, any>): Promise<void>`

Publish a message to a specific channel.

```typescript
await centrifugo.publish("notifications", {
  type: "alert",
  message: "Important notification",
});
```

#### `broadcast(channels: string[], data: Record<string, any>): Promise<void>`

Broadcast a message to multiple channels.

```typescript
await centrifugo.broadcast(["channel1", "channel2"], {
  event: "server_update",
  timestamp: new Date().toISOString(),
});
```

#### `history(channel: string, limit?: number, since?: string): Promise<Record<string, any>[]>`

Get message history from a channel.

```typescript
const messages = await centrifugo.history("chat", 50);
```

#### `presence(channel: string): Promise<Record<string, any>>`

Get presence information for a channel.

```typescript
const presence = await centrifugo.presence("chat");
console.log(presence);
```

#### `presenceStats(channel: string): Promise<{num_clients: number, num_users: number}>`

Get presence statistics for a channel.

```typescript
const stats = await centrifugo.presenceStats("chat");
console.log(`Clients: ${stats.num_clients}, Users: ${stats.num_users}`);
```

#### `unsubscribe(user: string, channel?: string): Promise<void>`

Unsubscribe a user from a channel.

```typescript
await centrifugo.unsubscribe("user_123", "chat");
```

#### `disconnect(user: string, reconnect?: boolean): Promise<void>`

Disconnect a user from the server.

```typescript
await centrifugo.disconnect("user_123", false);
```

#### `startQueue(handler?: (data: any) => Promise<void>): Promise<void>`

Start the queue worker with an optional custom handler.

```typescript
await centrifugo.startQueue(async (jobData) => {
  console.log("Processing job:", jobData);
});
```

#### `close(): Promise<void>`

Clean up resources and close connections.

```typescript
await centrifugo.close();
```

## Examples

See the `examples/` directory for complete examples:

- [basic-api.ts](examples/basic-api.ts) - Basic API mode usage
- [with-queue.ts](examples/with-queue.ts) - Queue integration example
- [grpc-mode.ts](examples/grpc-mode.ts) - GRPC mode usage

## Configuration

### Environment Variables

Create a `.env` file:

```env
CENTRIFUGO_ENDPOINT=http://localhost:8000
CENTRIFUGO_MODE=API
ENABLE_QUEUE=true
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=optional
```

## Architecture

```
centrifugo-server-sdk/
├── src/
│   ├── api/
│   │   ├── core.ts       # API client implementation
│   │   └── index.ts      # API exports
│   ├── grpc/
│   │   └── grpc.ts       # GRPC client implementation
│   ├── queue/
│   │   └── queue.ts      # BullMQ queue management
│   └── index.ts          # Main Centrifugo class
├── examples/
│   ├── basic-api.ts
│   ├── with-queue.ts
│   └── grpc-mode.ts
└── index.ts              # Library exports
```

## Error Handling

```typescript
try {
  await centrifugo.publish("channel", { data: "test" });
} catch (error) {
  console.error("Failed to publish:", error);
}
```

## Performance Tips

1. **Use Batch Operations**: For multiple operations, consider using the batch API
2. **Enable Queue**: For high-traffic scenarios, enable BullMQ for async processing
3. **Connection Pooling**: GRPC mode automatically handles connection management
4. **Monitor Redis**: If using queue, monitor your Redis instance

## License

MIT

## Support

For issues and questions:
- [Centrifugo Documentation](https://centrifugal.dev/docs/)
- GitHub Issues (if applicable)


To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.3.5. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
