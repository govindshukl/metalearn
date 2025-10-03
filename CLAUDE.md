# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

Excalidraw is a **Yarn workspaces monorepo** with clear separation between the core library and application:

- **`packages/excalidraw/`** - Main React component library published to npm as `@excalidraw/excalidraw`
- **`excalidraw-app/`** - Full-featured web application (excalidraw.com) that uses the library
- **`packages/`** - Core packages: `@excalidraw/common`, `@excalidraw/element`, `@excalidraw/math`, `@excalidraw/utils`
- **`examples/`** - Integration examples showing library usage
- **`dev-docs/`** - Developer documentation (Docusaurus site)

## Essential Commands

### Development
```bash
yarn start                    # Start development server for excalidraw-app
yarn build                   # Build the entire project
yarn build:packages          # Build only the npm packages (must run before using examples)
yarn build:app               # Build only the excalidraw-app
yarn start:example           # Build packages and run example
```

### Testing
```bash
yarn test                    # Run tests with watch mode
yarn test:all                # Run all tests (typecheck, code, other, app)
yarn test:typecheck          # TypeScript type checking
yarn test:code               # ESLint linting
yarn test:other              # Prettier formatting check
yarn test:app                # Run app tests (Vitest)
yarn test:update             # Update test snapshots
yarn test:coverage           # Generate test coverage report
```

### Code Quality
```bash
yarn fix                     # Auto-fix all formatting and linting issues
yarn fix:code                # Auto-fix ESLint issues
yarn fix:other               # Auto-fix Prettier formatting
```

## Architecture Overview

### Monorepo Structure
- **Yarn workspaces** for dependency management across packages
- **Path aliases** defined in `tsconfig.json` and `vitest.config.mts` for cross-package imports
- **Strict TypeScript** configuration with ESNext target
- **Vitest** for testing with jsdom environment and coverage thresholds

### Key Packages
- `@excalidraw/common` - Shared utilities and types
- `@excalidraw/element` - Element-related functionality (shapes, selection)
- `@excalidraw/math` - Mathematical operations and geometry (always use the `Point` type from `packages/math/src/types.ts` instead of `{ x, y }`)
- `@excalidraw/utils` - General utility functions
- `@excalidraw/excalidraw` - Main React component library

### Import Restrictions
- **Jotai imports**: Must use app-specific modules (`packages/excalidraw/editor-jotai.ts` or `excalidraw-app/app-jotai.ts`) instead of importing directly from `jotai`
- **Import order**: Enforced via ESLint with specific grouping for `@excalidraw/*` packages
- **Type imports**: Use `import type` for type-only imports (enforced by ESLint)

### Build System
- **Vite** for excalidraw-app development and building
- **esbuild** for package builds via `scripts/buildPackage.js`
- **Path resolution** handles internal package references during development
- Package build order: `common` → `math` → `element` → `excalidraw`

### Testing Configuration
- **Vitest** with jsdom environment for DOM testing
- **Coverage thresholds**: Lines 60%, Branches 70%, Functions 63%, Statements 60%
- **Global test setup** in `setupTests.ts`
- **Parallel hook execution** for better performance
- Always run `yarn test:app` after modifications and attempt to fix reported issues

## Development Workflow

1. **Library development**: Work in `packages/*` for core editor features
2. **App development**: Work in `excalidraw-app/` for application-specific features
3. **Testing**: Always run `yarn test:update` before committing to update snapshots
4. **Type safety**: Use `yarn test:typecheck` to verify TypeScript compliance
5. **Code quality**: Run `yarn fix` to auto-resolve formatting/linting issues

## Code Style

- **TypeScript**: Use TypeScript for all new code
- **Performance**: Prefer implementations without allocation; trade RAM for CPU cycles when possible
- **Immutability**: Prefer `const` and `readonly`
- **Null safety**: Use optional chaining (`?.`) and nullish coalescing (`??`)
- **React**: Functional components with hooks (no conditional hooks)
- **Naming**: PascalCase for components/types, camelCase for variables/functions, ALL_CAPS for constants
- **Conciseness**: Be succinct in responses and code; avoid unnecessary explanations unless asked

## AWS Deployment & Infrastructure

For AWS deployment and infrastructure management, see **[AWS_DEPLOYMENT_GUIDE.md](AWS_DEPLOYMENT_GUIDE.md)** which documents the custom Claude Code commands available in `.claude/commands/`:
- `/deploy` - Automated deployment to S3+CloudFront or ECS Fargate
- `/setup-aws-infra` - CloudFormation infrastructure setup
- `/containerize` - Docker optimization and ECR integration
- `/rollback` - Safe deployment rollback
- `/monitor` - CloudWatch monitoring and observability
