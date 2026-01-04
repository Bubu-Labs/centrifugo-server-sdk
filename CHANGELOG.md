# Changelog

All notable changes to the Centrifugo Server SDK project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned Features
- Structured logging handlers and formatters
- Batch idempotency support
- Connection pooling optimizations
- WebSocket support for real-time updates
- Advanced monitoring and metrics collection

## [1.0.0] - 2026-01-04

### Added

#### Core Features
- **Dual Mode Support**: Both HTTP API and gRPC communication modes
- **Message Publishing**: Publish messages to single or multiple channels
- **Message History**: Retrieve historical messages with pagination and stream positions
- **Presence Management**: Track active users in channels with detailed client information
- **Presence Stats**: Get real-time presence statistics (client count, unique users)
- **Queue Integration**: Optional BullMQ support for reliable async operations
- **User Management**: Subscribe, unsubscribe, refresh, and disconnect operations
- **Server Operations**: Batch requests, channel listing, and server information retrieval

#### Enhanced Features
- **Enhanced Logging Configuration** (`LogOption`):
  - Structured logging with configurable levels: "error" | "warn" | "info" | "debug"
  - Enable/disable logging at runtime via `setLogging()`
  - Change log levels dynamically via `setLogLevel()`
  - Better observability in production environments

- **Idempotency Support**:
  - Optional idempotency keys for `publish()` and `broadcast()` methods
  - Automatic UUID v4 key generation when `idempotency.enabled: true`
  - Custom idempotency key generator support via `idempotency.generate` callback
  - Manual idempotency key passing per operation
  - Supports both HTTP API and gRPC transports
  - Built-in protection against duplicate message processing (5-minute cache per channel)

#### Developer Experience
- **Full TypeScript Support**: Comprehensive type definitions with JSDoc comments
- **Type-Safe Interfaces**: 
  - `CentrifugoConfig` - Main configuration interface
  - `LogOption` - Logging configuration
  - `IdempotencyConfig` - Idempotency settings
  - `PublishOptions` - Publish operation options
  - `BroadcastOptions` - Broadcast operation options
  - And many more...

- **Lazy Loading**: Queue support is lazy-loaded, keeping bundle size small for API-only mode
- **Flexible Configuration**: Support for both environment variables and code-based configuration
- **Error Handling**: Comprehensive error handling with meaningful error messages
- **Jest/Bun Test Suite**: 97 comprehensive tests covering all features

#### Documentation
- **README.md**: Quick start guide with multiple examples (API, gRPC, Queue, Idempotency, Logging)
- **ENHANCEMENTS.md**: Detailed guide for new logging and idempotency features
- **CONTRIBUTING.md**: Complete contributor guide with setup instructions and code style guide
- **API Reference**: Full documentation of all public methods and options
- **Examples**: Working code examples for all major features

#### Quality Assurance
- **Comprehensive Test Coverage**:
  - API mode tests (HTTP)
  - gRPC mode tests
  - Queue integration tests
  - Client integration tests
  - Complete end-to-end tests
- **Build System**: Automated build and TypeScript compilation
- **Type Checking**: Full TypeScript type safety with `.d.ts` generation

### Features Breakdown

#### HTTP API Mode
```typescript
const centrifugo = new Centrifugo({
  mode: "API",
  endpoint: "http://localhost:8000",
  apiKey: "your-api-key",
  logOption: { enable: true, level: "info" },
  idempotency: { enabled: true }
});
```

#### gRPC Mode
```typescript
const centrifugo = new Centrifugo({
  mode: "GRPC",
  endpoint: "localhost:10000",
  logOption: { enable: true, level: "info" },
  idempotency: { enabled: true }
});
```

#### Queue Support
- BullMQ integration for reliable message queuing
- Redis-backed persistent queue
- Configurable worker concurrency
- Job retry with exponential backoff
- Automatic job cleanup on completion/failure

### Technical Details

#### Performance
- **Bundle Size**: 2.43 MB (optimized with lazy loading)
- **Module Count**: 509 modules bundled
- **Optional Dependencies**: axios, @grpc/grpc-js, bullmq, ioredis
- **Peer Dependencies**: None required

#### Compatibility
- **Node.js**: 14.18.0+ (for crypto.randomUUID support)
- **TypeScript**: 4.5+
- **Centrifugo**: v4.0+, v5.0+
- **Runtime**: Node.js, Bun

#### Supported Platforms
- Linux
- macOS
- Windows
- Docker containers
- Kubernetes environments

### Architecture
- **Modular Design**: Separate modules for API, gRPC, Queue, and Core
- **Lazy Loading**: Queue functionality loaded only when needed
- **Type-First Development**: TypeScript-based with full type safety
- **Protocol Buffer Support**: Proper gRPC support with proto file generation

## Detailed Feature Descriptions

### 1. Enhanced Logging
Replaces simple `debug` boolean and `logLevel` string with structured `LogOption` interface:

```typescript
logOption: {
  enable: boolean;      // Enable/disable logging
  level: LogLevel;      // "error" | "warn" | "info" | "debug"
}
```

**Benefits**:
- Type-safe log levels
- Better configuration clarity
- Runtime log level changes
- Backward compatible with old `debug`/`logLevel` fields

### 2. Idempotency Support
Ensures operations are processed exactly once, even with retries:

**Three Usage Patterns**:
1. **Auto-Generated Keys** (Easiest):
   ```typescript
   idempotency: { enabled: true }
   // Uses crypto.randomUUID() automatically
   ```

2. **Custom Generator**:
   ```typescript
   idempotency: {
     enabled: true,
     generate: (data) => `${Date.now()}-${data.channel}`
   }
   ```

3. **Manual Keys**:
   ```typescript
   await centrifugo.publish("channel", data, "my-unique-key-123")
   ```

**Features**:
- Works with both `publish()` and `broadcast()`
- Supported in API and gRPC modes
- 5-minute cache window per channel
- Requires Memory or Redis Centrifugo engine

### 3. Queue Integration
Reliable async message delivery with BullMQ:

```typescript
enableQueue: true,
queueConfig: {
  redis: { host: "localhost", port: 6379 },
  worker: { concurrency: 10 },
  defaultJobOptions: { 
    attempts: 3,
    backoff: { type: "exponential", delay: 1000 }
  }
}
```

**Features**:
- Automatic job persistence
- Retry with backoff strategies
- Worker concurrency control
- Job statistics and monitoring

## Breaking Changes
None - This is the initial release (v1.0.0)

## Deprecations
- `debug` boolean field (still supported, use `logOption.enable` instead)
- `logLevel` string field (still supported, use `logOption.level` instead)

## Security
- No known security vulnerabilities in v1.0.0
- Uses `crypto.randomUUID()` for secure key generation
- All dependencies are up-to-date

## Testing
- Total Tests: 97
- Test Files: 9
- Coverage: High (all public APIs tested)
- Test Framework: Bun built-in test runner

## Contributors
Special thanks to all contributors who have helped make this SDK better!

## Getting Help

### Documentation
- 📚 [Centrifugo Official Docs](https://centrifugal.dev/docs/)
- 📖 [SDK README](README.md)
- 📋 [Contributing Guide](CONTRIBUTING.md)
- ✨ [Enhancements Guide](ENHANCEMENTS.md)

### Community
- 🐛 [GitHub Issues](https://github.com/Bubu-Labs/centrifugo-server-sdk/issues)
- 💬 [GitHub Discussions](https://github.com/Bubu-Labs/centrifugo-server-sdk/discussions)
- 🌐 [Centrifugo Community](https://centrifugal.dev/community)

## Related Links
- [npm Package](https://www.npmjs.com/package/centrifugo-server-sdk)
- [GitHub Repository](https://github.com/Bubu-Labs/centrifugo-server-sdk)
- [Centrifugo Server](https://centrifugal.dev/)

---

**Release Date**: January 4, 2026

For more information about upcoming releases and development progress, check the [GitHub Project Board](https://github.com/Bubu-Labs/centrifugo-server-sdk/projects).
