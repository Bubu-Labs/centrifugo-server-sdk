# Contributing to Centrifugo Server SDK

Thank you for your interest in contributing to the Centrifugo Server SDK! This document provides guidelines and instructions for contributing to our project.

We appreciate all contributions - whether it's reporting bugs, suggesting features, improving documentation, or submitting code improvements. Every contribution helps make this SDK better for everyone!

## 🙏 Contributors

We want to give a special thank you to all contributors who have helped improve this project. Your contributions, big or small, are invaluable to the community.

If you contribute to this project, your name will be added here. Thank you for being part of our journey!

## Getting Started

### Prerequisites

Before you can contribute code, you'll need:

- **Node.js**: 14.18.0 or higher (16+ recommended)
- **Bun**: v1.3.5+ (used for building and testing)
- **Git**: For version control
- **TypeScript**: Basic knowledge of TypeScript is helpful

### Setting Up Your Development Environment

1. **Fork the repository** on GitHub

2. **Clone your fork**:
   ```bash
   git clone https://github.com/your-username/centrifugo-server-sdk.git
   cd centrifugo-server-sdk
   ```

3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/nhanlethanh1198/centrifugo-server-sdk.git
   ```

4. **Install dependencies**:
   ```bash
   bun install
   ```

5. **Verify your setup** by running tests:
   ```bash
   bun test
   ```

## Development Workflow

### 1. Create a Feature Branch

Always create a new branch for your work:

```bash
# Update main branch
git fetch upstream
git checkout main
git merge upstream/main

# Create feature branch
git checkout -b feature/your-feature-name
# or for bug fixes:
git checkout -b fix/your-bug-fix-name
```

**Branch naming conventions:**
- Feature: `feature/description-of-feature`
- Bug fix: `fix/description-of-bug`
- Documentation: `docs/description`
- Refactor: `refactor/description`
- Test: `test/description`

### 2. Make Your Changes

```bash
# Install optional dependencies if needed
bun add axios                    # For API mode
bun add @grpc/grpc-js          # For GRPC mode
bun add bullmq ioredis          # For queue support

# Edit files in your preferred editor
# Keep commits atomic and focused on a single task
```

### 3. Running Tests and Building

```bash
# Run all tests
bun test

# Run specific test file
bun test tests/api.test.ts

# Watch mode for development
bun test --watch

# Verbose output
bun test --verbose

# Build the project
bun run build:npm

# Check for TypeScript errors
bun run build:npm  # Includes type checking
```

### 4. Commit Your Changes

Write clear, descriptive commit messages:

```bash
git add .
git commit -m "feat: add feature description"
```

**Commit message conventions:**

We follow the Conventional Commits specification:

- `feat:` - A new feature
- `fix:` - A bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, semicolons, etc.)
- `refactor:` - Code refactoring without feature changes
- `perf:` - Performance improvements
- `test:` - Adding or updating tests
- `chore:` - Build, dependency, or configuration changes

**Examples:**
```bash
git commit -m "feat: add idempotency support for publish method"
git commit -m "fix: correct history request payload"
git commit -m "docs: update README with new examples"
git commit -m "test: add test cases for broadcast with idempotency"
git commit -m "refactor: improve error handling in gRPC client"
```

### 5. Push Your Changes

```bash
git push origin feature/your-feature-name
```

### 6. Create a Pull Request

1. Go to GitHub and create a pull request from your branch to `upstream/main`

2. Fill in the PR template with:
   - Clear description of what you changed and why
   - Reference any related issues
   - List any breaking changes
   - Include examples if applicable

3. Make sure your PR:
   - ✅ Passes all tests (`bun test`)
   - ✅ Builds successfully (`bun run build:npm`)
   - ✅ Has clear commit messages
   - ✅ Updates documentation if needed
   - ✅ Includes tests for new features

## Code Style Guide

### TypeScript/JavaScript Style

We maintain a consistent code style across the project:

1. **Indentation**: 4 spaces (not tabs)

2. **Line length**: Keep lines under 100 characters when possible

3. **Naming conventions**:
   ```typescript
   // Classes: PascalCase
   class CentrifugoConfig {}
   
   // Functions: camelCase
   function publishMessage() {}
   
   // Constants: UPPER_SNAKE_CASE
   const MAX_RETRIES = 3;
   
   // Interfaces/Types: PascalCase with I prefix (optional)
   interface PublishOptions {}
   type LogLevel = "debug" | "info" | "warn" | "error";
   ```

4. **Imports**: Organize imports in this order:
   ```typescript
   // Node.js built-ins
   import { randomUUID } from "crypto";
   
   // External dependencies
   import axios from "axios";
   
   // Local imports
   import { CentrifugoConfig } from "./core/type";
   ```

5. **File structure**:
   ```typescript
   // 1. Imports
   // 2. Type definitions
   // 3. Constants
   // 4. Main code (classes, functions)
   // 5. Exports
   ```

6. **Comments**: Use JSDoc for public APIs
   ```typescript
   /**
    * Publish a message to a channel with optional idempotency
    * @param channel - The channel name
    * @param data - The message data
    * @param idempotencyKey - Optional idempotency key
    * @returns Promise that resolves when message is published
    */
   async publish(
     channel: string,
     data: Record<string, any>,
     idempotencyKey?: string
   ): Promise<void>
   ```

7. **Error handling**:
   ```typescript
   try {
     // operation
   } catch (error) {
     if (error instanceof Error) {
       this.logger.error(`Operation failed: ${error.message}`);
     }
     throw error;
   }
   ```

### File Organization

```
src/
├── api/              # HTTP API client
├── grpc/             # GRPC client
├── queue/            # Queue management
├── core/             # Core types and interfaces
├── lib/              # Utilities and helpers
├── main.ts           # Main SDK class
└── index.ts          # Package exports
```

## Testing Guidelines

### Writing Tests

1. **Test structure**: Use Bun's built-in test runner
   ```typescript
   import { describe, it, expect, beforeEach, afterEach } from "bun:test";
   import { Centrifugo } from "../src/main";
   
   describe("Feature Description", () => {
     let centrifugo: Centrifugo;
     
     beforeEach(() => {
       centrifugo = new Centrifugo(testConfig);
     });
     
     afterEach(async () => {
       await centrifugo.close();
     });
     
     it("should perform expected behavior", async () => {
       const result = await centrifugo.publish("test", {});
       expect(result).toBeDefined();
     });
   });
   ```

2. **Test naming**: Use descriptive test names
   ```typescript
   it("should return presence stats for active channel", async () => {});
   it("should throw error when channel is invalid", async () => {});
   it("should handle idempotency key correctly", async () => {});
   ```

3. **Test coverage**: Aim for high coverage of new features
   - Write unit tests for functions
   - Write integration tests for API/gRPC interactions
   - Test error scenarios

4. **Running tests**:
   ```bash
   # All tests
   bun test
   
   # Specific file
   bun test tests/api.test.ts
   
   # Watch mode
   bun test --watch
   ```

## Types and Interfaces

When adding new functionality, always add proper TypeScript types:

1. **Define interfaces in `src/core/type.ts`**:
   ```typescript
   export interface NewFeatureConfig {
     enabled?: boolean;
     options?: Record<string, any>;
   }
   ```

2. **Export from appropriate index files**:
   ```typescript
   // src/core/index.ts
   export * from './type';
   ```

3. **Add to main exports**:
   ```typescript
   // index.ts (root)
   export type { NewFeatureConfig } from './src/core/type';
   ```

## Documentation

### Update Documentation For:

1. **New features**: Add examples in README.md
2. **API changes**: Update relevant sections
3. **Breaking changes**: Add migration guide
4. **Complex features**: Create detailed docs in ENHANCEMENTS.md

### Documentation template:

```markdown
### Feature Name

Brief description of the feature.

#### Configuration

```typescript
const config = {
  featureName: {
    option1: value,
  }
};
```

#### Usage Example

```typescript
// Example code
```

#### Performance Considerations

- Performance tip 1
- Performance tip 2
```

## Before Submitting a Pull Request

- ✅ Ensure all tests pass: `bun test`
- ✅ Build successfully: `bun run build:npm`
- ✅ Follow TypeScript best practices
- ✅ No console.log() or debug code left in
- ✅ Add/update tests for your changes
- ✅ Update documentation if needed
- ✅ Write clear commit messages
- ✅ Check for code style consistency
- ✅ Ensure backward compatibility or document breaking changes

## Types of Contributions

### 🐛 Bug Reports

Found a bug? Help us fix it!

1. Check if the issue already exists
2. Include:
   - Clear description of the bug
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Your environment (Node.js version, Bun version, OS)
   - Code sample if possible

### 💡 Feature Requests

Have an idea for improvement?

1. Describe the feature clearly
2. Explain the use case and why it's useful
3. Provide examples if applicable
4. Discuss potential implementation approach

### 📚 Documentation

Improve existing documentation:

1. Fix typos or unclear explanations
2. Add examples or clarifications
3. Update outdated information
4. Improve code snippets

### 🔧 Code Improvements

Refactor, optimize, or improve existing code:

1. Keep changes focused
2. Improve readability or performance
3. Reduce technical debt
4. Maintain backward compatibility

## Code Review Process

1. **Automated checks**: GitHub Actions will run tests and linting
2. **Manual review**: Maintainers will review your code
3. **Feedback**: Address feedback and make requested changes
4. **Approval**: Once approved, your PR will be merged

Be patient and respectful during the review process. Maintainers might suggest changes to ensure code quality and consistency.

## Common Issues

### Tests failing locally but passing in CI

- Clear node_modules: `rm -rf node_modules && bun install`
- Clear build: `rm -rf dist`
- Check Node.js version: `node --version` (should be 14.18.0+)

### TypeScript errors

```bash
# Rebuild TypeScript
bun run build:npm

# Check specific file
bun run build:npm src/file.ts
```

### Build issues

```bash
# Full clean rebuild
rm -rf dist node_modules
bun install
bun run build:npm
```

## Communication

- **Issues**: Use GitHub issues for bug reports and feature requests
- **Discussions**: Use GitHub discussions for questions
- **Pull Requests**: Use PR comments for code review discussions
- **Code of Conduct**: Be respectful and professional

## Frequently Asked Questions

**Q: Can I contribute if I'm new to open source?**
A: Absolutely! We welcome contributions from developers of all skill levels. Start with small improvements like documentation or tests.

**Q: What if my PR is rejected?**
A: No worries! We'll provide feedback explaining why. Feel free to address the feedback and resubmit or discuss further.

**Q: How long does it take for a PR to be reviewed?**
A: We aim to review PRs within a few days, but it may take longer depending on complexity.

**Q: Can I contribute to the documentation?**
A: Yes! Documentation improvements are highly valued. Please follow the same process as code contributions.

**Q: What's the best way to get started?**
A: Look for issues tagged with `good-first-issue` or `help-wanted`. Start with something small to get familiar with the codebase.

## Development Tips

### Debugging

```bash
# Verbose test output
bun test --verbose

# Run specific test
bun test tests/api.test.ts

# Node debugger
node --inspect-brk $(bun pm bin) test
```

### Performance Profiling

```bash
# Build with sourcemaps
bun run build:npm

# Measure bundle size
ls -lh dist/index.js
```

### Working with gRPC

If making changes to gRPC:

```bash
# Regenerate types from proto
bun run build:npm

# This will run:
# proto-loader-gen-types src/grpc/grpc.proto --outDir src/grpc/generated
```

## Thank You!

We truly appreciate your contributions! Whether you're fixing bugs, adding features, improving documentation, or helping other developers - you're helping make the Centrifugo Server SDK better.

Together, we're building a robust, reliable SDK that developers love to use.

---

## Additional Resources

- 📚 [Centrifugo Documentation](https://centrifugal.dev/docs/)
- 🏗️ [Project Architecture](README.md#architecture)
- 📝 [Enhancements Guide](ENHANCEMENTS.md)
- 🔗 [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- 🧪 [Bun Documentation](https://bun.sh/docs)

## Questions?

If you have any questions about contributing, feel free to:
- Open a GitHub issue
- Start a discussion in the community
- Contact the maintainers

Happy contributing! 🚀
