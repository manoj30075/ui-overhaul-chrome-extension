# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Start

1. **Clone and Install Dependencies**
   ```bash
   git clone https://github.com/manoj30075/ui-overhaul-chrome-extension.git
   cd ui-overhaul-chrome-extension
   pnpm install
   ```

2. **Load Extension in Chrome**
   ```bash
   pnpm build
   # Then load the 'extension/dist' folder in Chrome Developer Mode
   ```

3. **Development Mode**
   ```bash
   pnpm dev
   # Hot reload enabled for UI components
   ```

## Project Overview

**CustomClick** is a Chrome Manifest V3 extension that transforms Chrome's static right-click context menu into a dynamic, personalized command center with integrated AI assistance. The extension puts custom actions and AI capabilities at users' fingertips through an enhanced context menu experience. Built as a monorepo using pnpm workspaces.

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
- **Background Service Worker** (`extension/src/background/`): Handles AI integration and context menu management
- **Content Scripts** (`extension/src/content/`): Context menu injection and custom action execution
- **UI Components** (`extension/src/ui/`): React-based popup and options pages for configuration
- **Shared Schema** (`extension/src/shared/schema.ts`): Type definitions for menu actions and AI integrations

### Key Files
- `extension/src/shared/schema.ts`: Defines action schema for custom menu items and AI commands
- `extension/src/content/patcher.ts`: Context menu injection and action execution logic
- `extension/manifest.json`: Chrome extension configuration with context menu permissions

### Menu Action System
The extension uses a custom action format for context menu items:
```typescript
{
  type: 'ai_action' | 'custom_script' | 'quick_link' | 'text_transform',
  label: string,
  icon?: string,
  action: string | Function,
  context?: 'text' | 'image' | 'link' | 'page'
}
```

## Technology Stack
- **Build**: Vite with @crxjs/vite-plugin for Chrome extension bundling
- **Frontend**: React 18.2 with TypeScript 5.0, Tailwind CSS 3.4 for styling
- **State Management**: Zustand for extension state
- **Validation**: Zod for runtime schema validation
- **Security**: DOMPurify for content sanitization
- **Testing**: Jest for unit tests, Playwright for E2E
- **Quality**: ESLint (Airbnb TypeScript), Prettier, Husky pre-commit hooks

## Security Considerations
- All user-generated content is sanitized through DOMPurify
- CSP policy restricts script execution to 'self'
- Context menu permissions are scoped to minimize attack surface
- AI API keys are stored securely in Chrome storage with encryption

## MVP Goals
- **Target**: 1,000+ installs within 30 days of launch
- **Performance**: <100ms context menu render time
- **Quality**: 4.0+ star rating on Chrome Web Store
- **Conversion**: 10% free-to-paid conversion rate
- **Reliability**: Zero critical bugs in production

## Current Sprint Status

### Active Sprint: CustomClick MVP Development
**Jira Project**: SCRUM (Test Claude)  
**Sprint Board**: https://manojpls.atlassian.net  

#### Phase 1: Core Functionality (In Progress)
- **SCRUM-22** (CC-1): Setup Chrome Extension Project Structure ✅ **COMPLETED**
- **SCRUM-23** (CC-2): Implement Context Menu Override System 🔄 **NEXT**
- **SCRUM-24** (CC-3): Build Basic Menu UI Component
- **SCRUM-25** (CC-4): Implement Text Selection Detection  
- **SCRUM-26** (CC-5): Add Basic Search Actions

#### Phase 2: Customization Features 
- **SCRUM-27** (CC-6): Create Icon Grid System
- **SCRUM-28** (CC-7): Implement Drag-Drop Reordering
- **SCRUM-29** (CC-8): Build Settings/Options Page
- **SCRUM-30** (CC-9): Implement Theme System
- **SCRUM-31** (CC-10): Add Chrome Storage Integration

#### Phase 3: AI Integration
- **SCRUM-32** (CC-11): Setup OpenAI API Integration  
- **SCRUM-33** (CC-12): Create AI Chat Interface
- **SCRUM-34** (CC-13): Implement Prompt Engineering System
- **SCRUM-35** (CC-14): Add Response Streaming
- **SCRUM-36** (CC-15): Create API Key Management

#### Phase 4: Polish & Launch
- **SCRUM-37** (CC-16): Performance Optimization
- **SCRUM-38** (CC-17): Create Chrome Web Store Assets
- **SCRUM-39** (CC-18): Implement Analytics & Telemetry  
- **SCRUM-40** (CC-19): Create Documentation & Help System
- **SCRUM-41** (CC-20): Launch Preparation & Marketing

### Sprint Progress
- **Total Tasks**: 20 tasks (CC-1 through CC-20)
- **Completed**: 1/20 (5%)
- **In Progress**: Phase 1 - Core Functionality
- **Next Priority**: SCRUM-23 (Context Menu Override System)

### Task Implementation Workflow

When starting any Jira task, follow this structured approach:

#### 1. **Research Phase** (Before Implementation)
- **Read the Jira ticket thoroughly**: Understand acceptance criteria, technical requirements, and dependencies
- **Research best practices online**: Use WebSearch to find current best practices, patterns, and examples
  - Search for "Chrome extension [feature] best practices 2025"
  - Look for "React TypeScript [component] implementation patterns"
  - Find "Chrome MV3 [API] examples and tutorials"
- **Check official documentation**: Review Chrome Extension APIs, React docs, TypeScript guides
- **Analyze similar implementations**: Search GitHub for open-source Chrome extensions with similar features
- **Understand the context**: Review related files in the codebase and existing patterns
- **Research tools and libraries**: Find the most suitable packages and check their documentation

**Example Research Queries**:
```
"Chrome extension context menu override 2025"
"React TypeScript Chrome extension architecture"
"Chrome MV3 content script best practices"
"Chrome extension state management patterns"
```

#### 2. **Planning Phase**
- **Create implementation plan**: Break down the task into specific steps using TodoWrite
- **Identify dependencies**: Check if prerequisite tasks are completed
- **Review architecture**: Ensure the approach fits the existing system design
- **Consider edge cases**: Think about error handling, performance, and security implications

#### 3. **Implementation Phase**
- **Transition ticket to "In Progress"** in Jira
- **Follow the implementation plan**: Execute step-by-step using your todo list
- **Write clean, documented code**: Follow existing code patterns and conventions
- **Test thoroughly**: Verify functionality and edge cases
- **Update progress**: Add work logs and comments to Jira ticket

#### 4. **Completion Phase**
- **Verify acceptance criteria**: Ensure all requirements are met
- **Run quality checks**: Execute linting, type checking, and tests
- **Document the implementation**: Add detailed completion comment to Jira
- **Transition ticket to "Done"** in Jira
- **Update sprint progress**: Add summary to Epic if significant milestone

### Jira Integration Guidelines
**Status Transitions**: "To Do" → "In Progress" → "Done"
**Work Logging**: Add detailed comments with progress updates and technical decisions
**Dependencies**: Link related tickets and note any blockers or prerequisites
**Documentation**: Include code snippets, implementation notes, and verification steps

## Development Status
Project is in active development with structured sprint planning. Core extension scaffolding is complete and ready for context menu implementation.