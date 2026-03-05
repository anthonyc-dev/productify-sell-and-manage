# AGENTS.md - Agentic Coding Guidelines

## Project Overview

- **Name:** Productify - Full-Stack Product Store
- **Architecture:** Monolith (Express backend + React frontend)
- **Database:** PostgreSQL with Drizzle ORM
- **Authentication:** Clerk (OAuth)
- **Languages:** TypeScript (backend), JavaScript (frontend)

## Build, Lint, and Test Commands

### Root Commands

```bash
npm run build        # Install deps & build frontend + backend
npm run start        # Push DB schema & start backend (PORT=3000)
```

### Backend (./backend)

```bash
npm run dev          # Run dev server with nodemon (auto-reload)
npm run build        # Compile TypeScript to ./dist
npm run start        # Run production server (node dist/index.js)
npm run db:push      # Push Drizzle schema to database
```

### Frontend (./frontend)

```bash
npm run dev          # Run Vite dev server (http://localhost:5173)
npm run build        # Production build to ./dist
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

### Running a Single Test

**Note:** This project currently has no test framework configured. Do not write tests unless explicitly requested by the user.

---

## Code Style Guidelines

### General Principles

- Follow Clean Architecture and SOLID principles
- Prefer feature-based folder structure
- Avoid unnecessary abstractions
- Keep code modular and reusable
- Provide production-ready solutions

### Backend (TypeScript)

#### Architecture Pattern

```
src/
├── controllers/     # Request handling, validation
├── services/       # Business logic
├── routes/         # Route definitions
├── db/             # Schema & queries (Drizzle ORM)
├── config/         # Environment & configuration
└── index.ts        # Entry point
```

#### TypeScript Settings (tsconfig.json)

- `strict: true` - All strict type-checking enabled
- Use explicit types; avoid `any`
- Enable `esModuleInterop` for CommonJS imports

#### Error Handling

- Centralized error handling middleware
- Use custom error classes for domain errors
- Always return proper HTTP status codes (4xx, 5xx)

#### Database

- Use parameterized queries only (Drizzle ORM)
- Follow repository pattern for data access
- Enforce least privilege access

#### Security

- Never hardcode secrets - use `.env` files
- Enable rate limiting in production
- Use Helmet.js for security headers
- Validate all input with schema validation

---

### Frontend (React/JavaScript)

#### Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Route pages
├── hooks/         # Custom React hooks
├── context/       # React context providers
├── lib/           # Utilities (API client, axios config)
└── App.jsx        # Main app component
```

#### Component Guidelines

- Use functional components with hooks
- Use TanStack Query (React Query) for data fetching
- Extract reusable logic into custom hooks
- Use context for global state (e.g., CartContext)

#### State Management

- Server state: TanStack Query
- Client state: React useState/useReducer
- Global state: React Context

#### Styling

- Tailwind CSS + DaisyUI for components
- Use utility classes for styling
- Follow responsive design patterns

---

### Naming Conventions

| Type            | Convention  | Example                               |
| --------------- | ----------- | ------------------------------------- |
| Variables       | camelCase   | `userName`, `productList`             |
| Functions       | camelCase   | `getUserById()`, `calculateTotal()`   |
| Components      | PascalCase  | `ProductCard`, `Navbar`               |
| Constants       | UPPER_SNAKE | `MAX_RETRY_COUNT`, `API_BASE_URL`     |
| Files (React)   | PascalCase  | `ProductCard.jsx`, `HomePage.jsx`     |
| Files (TS)      | camelCase   | `productController.ts`, `apiUtils.ts` |
| Database tables | snake_case  | `products`, `order_items`             |

---

### Import Organization

#### Frontend (ESLint configured)

```javascript
// 1. React imports
import React, { useState, useEffect } from "react";

// 2. External libraries
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// 3. Internal components
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";

// 4. Hooks & context
import { useProducts } from "../hooks/useProducts";
import { CartContext } from "../context/CartContext";

// 5. Utilities
import { formatPrice } from "../lib/utils";
```

#### ESLint Rules (frontend/eslint.config.js)

- `no-unused-vars`: Error, except vars starting with `^[A-Z_]`
- React Hooks: Recommended rules enforced
- React Refresh: Supported for hot reload

---

### API Design

#### RESTful Conventions

- `GET /api/products` - List products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

#### Request/Response

- Use JSON for request/response bodies
- Validate input on server side
- Return appropriate HTTP status codes
- Include error messages in responses

---

### Environment Variables

#### Backend (.env)

```
PORT=3000
DATABASE_URL=<YOUR_DB_URL>
NODE_ENV=development
CLERK_PUBLISHABLE_KEY=<YOUR_KEY>
CLERK_SECRET_KEY=<YOUR_KEY>
FRONTEND_URL=http://localhost:5173
```

#### Frontend (.env)

```
VITE_CLERK_PUBLISHABLE_KEY=<YOUR_KEY>
VITE_API_URL=http://localhost:3000/api
```

---

### Git Workflow

- Create feature branches from `master`
- Write meaningful commit messages
- Run lint before committing (frontend)
- Build should pass before pushing

---

<!-- ### Existing Agent Rules (from .agent/rules/)

1. Prioritize secure coding practices
2. Never expose secrets in responses
3. Provide production-ready solutions
4. Avoid unnecessary abstractions
5. Suggest scalable patterns
6. Keep explanations concise but technically precise
7. When unsure, ask clarifying questions
8. Prefer modular and reusable code
9. Call the user "Body" when done responding

--- -->

# AI Agent Configuration for This Project (Existing Agent Rules from .agent/rules/)

This project includes a comprehensive AI agent setup to help with development.
All AI tools (Cursor, Claude Code, Antigravity) should read these instructions.

## 📚 Core Agent Files

### Agent Personality & Behavior

.agent/rules/agent.md - Defines the agent's personality, tone, and interaction style

### Context & Background

.agent/rules/context.md - Project context, domain knowledge, and background info

### Rules & Constraints

.agent/rules/rules.md - Coding rules, do's and don'ts, constraints

### Debugging Guidelines

.agent/rules/debugging.md - Debugging strategies, common issues, solutions

### Security Protocols

.agent/rules/security.md - Security best practices, authentication, data handling

### Architecture Decisions

.agent/rules/architecture.md - System architecture, patterns, design decisions

### Workflows

.agent/rules/workflows.md - Common workflows and processes

## 🎯 Prompt Templates

.agent/rules/prompts/system.md - System prompt for the AI
.agent/rules/prompts/developer.md - Developer-specific prompt templates
.agent/rules/prompts/user-template.md - User interaction templates

## 🧠 Memory System

.agent/rules/memory/short-term.md - Session-specific context and temporary info
.agent/rules/memory/long-term.md - Persistent knowledge and learned patterns

## 🛠️ Tool Definitions

.agent/rules/tools/api-tools.md - API endpoints and usage patterns
.agent/rules/tools/db-tools.md - Database schemas and query patterns
.agent/rules/tools/cli-tools.md - CLI commands and automation scripts

## 📋 Quick Start

When working on this project:

1. First read .agent/rules/context.md for project overview
2. Follow .agent/rules/rules.md for coding standards
3. Use .agent/rules/workflows.md for common tasks
4. Reference .agent/rules/architecture.md for system design

## 🔄 Loading Instructions

To load this entire agent configuration:

1. Share this file with the AI
2. Or use the tool-specific methods below

---

### Debugging Tips

- Backend: Check `npm run dev` output for errors
- Frontend: Check browser console + Network tab
- Database: Use `npm run db:push` to sync schema
- Auth issues: Verify Clerk keys in .env

---

### Resources

- Backend docs: Drizzle ORM, Express.js
- Frontend docs: React 19, Vite, TanStack Query, Tailwind CSS
- Auth: Clerk documentation

### Calling

- Call the user "Body" when done responding
