# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Chrome Manifest V3 extension for AI-driven website UI reskinning. The extension applies LLM-generated JSON patches to modify website appearance while preserving all original interactions. Built as a monorepo using pnpm workspaces.

## Development Commands

```bash
# Setup and installation
pnpm install

# Development (runs extension in dev mode)
pnpm dev

# Production build
pnpm build

# Testing
pnpm test          # Unit tests with Jest
pnpm test:e2e      # E2E tests with Playwright

# Code quality
pnpm lint          # ESLint with Airbnb TypeScript config
pnpm format        # Prettier formatting
```

## Architecture

The extension follows Chrome MV3 architecture with these core components:

### Extension Structure
- **Background Service Worker** (`extension/src/background/`): Handles LLM communication and patch requests
- **Content Scripts** (`extension/src/content/`): DOM manipulation and patch application
- **UI Components** (`extension/src/ui/`): React-based popup and options pages
- **Shared Schema** (`extension/src/shared/schema.ts`): Zod validation for JSON patches

### Key Files
- `extension/src/shared/schema.ts`: Defines patch schema with types: hide, css, replace, insert
- `extension/src/content/patcher.ts`: Core DOM patch application logic with DOMPurify sanitization
- `extension/manifest.json`: Chrome extension configuration with CSP policies

### Patch System
The extension uses a JSON patch format validated by Zod schema:
```typescript
{
  type: 'hide' | 'css' | 'replace' | 'insert',
  selector: string,
  content?: string,
  properties?: Record<string, string>
}
```

## Technology Stack
- **Build**: Vite with @crxjs/vite-plugin for Chrome extension bundling
- **Frontend**: React 18 with TypeScript, Tailwind CSS for styling
- **Validation**: Zod for runtime schema validation
- **Security**: DOMPurify for content sanitization
- **Testing**: Jest for unit tests, Playwright for E2E
- **Quality**: ESLint (Airbnb TypeScript), Prettier, Husky pre-commit hooks

## Security Considerations
- All patch content is sanitized through DOMPurify before DOM application
- CSP policy restricts script execution to 'self'
- Extension requires host permissions for all URLs to enable universal website modification

## Development Status
Currently in early development phase with basic scaffolding complete. Core patcher logic and LLM integration are marked as TODO items requiring implementation.