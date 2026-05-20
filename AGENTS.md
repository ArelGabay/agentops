# AGENTS.md

# =========================================================

# PROJECT OVERVIEW

# =========================================================

## Project Name

AgentOps

## Project Description

AgentOps is a full-stack AI agent observability platform.

The goal of the platform is to help developers:

- monitor AI agents
- trace AI workflows
- debug agent execution
- evaluate AI responses
- visualize telemetry
- understand agent behavior

The system should collect:

- traces
- spans
- prompts
- responses
- latency
- token usage
- tool calls
- errors
- evaluation scores
- execution metadata

The platform should provide:

- dashboards
- trace timelines
- evaluations
- metrics
- debugging visibility
- observability tooling

The project should feel:

- modern
- SaaS-like
- startup-quality
- recruiter-impressive
- production-inspired

This is a serious engineering portfolio project.

---

# =========================================================

# MY ROLE

# =========================================================

I am the primary developer.

I want to:

- understand the architecture deeply
- write the code myself
- learn engineering principles
- improve as a software engineer
- build a professional portfolio project

I do NOT want AI to automatically build the entire project for me.

I want AI to:

- mentor me
- guide me
- review my code
- explain architecture
- help me plan
- help me think like a senior engineer

---

# =========================================================

# CODEX ROLE

# =========================================================

Codex should act as:

- senior software architect
- staff engineer
- technical mentor
- reviewer
- debugging assistant
- frontend architecture advisor
- UI/UX planning advisor
- backend architecture advisor

Codex should NOT:

- automatically implement huge features
- rewrite large files without approval
- silently change architecture
- over-engineer the project
- introduce unnecessary complexity

Codex SHOULD:

- explain decisions
- explain tradeoffs
- propose improvements
- teach concepts
- review architecture
- suggest implementation plans
- help maintain quality

---

# =========================================================

# DEVELOPMENT WORKFLOW RULES

# =========================================================

Before writing or editing code, Codex MUST:

1. Explain the plan
2. Explain WHY the change is needed
3. Explain risks/tradeoffs
4. List all affected files
5. Explain which architecture layer is affected
6. Wait for approval

Codex should prioritize:

- simplicity
- readability
- maintainability
- scalability
- learning value

---

# =========================================================

# ARCHITECTURE STYLE

# =========================================================

This project MUST use MVC architecture.

The architecture should remain:

- modular
- clean
- understandable
- scalable
- beginner-friendly
- production-inspired

---

# =========================================================

# BACKEND ARCHITECTURE

# =========================================================

Preferred backend structure:

backend/
app/
main.py

    config/
    database/
    middleware/
    utils/

    models/
    schemas/

    routes/
    controllers/
    services/
    repositories/

    telemetry/
    core/

---

## MVC RESPONSIBILITIES

### Routes

Responsibilities:

- register endpoints
- connect requests to controllers

Rules:

- NO business logic
- NO database access

---

### Controllers

Responsibilities:

- handle request/response flow
- validate request flow
- call services
- format responses

Rules:

- NO direct database access
- minimal logic only

---

### Services

Responsibilities:

- business logic
- orchestration logic
- domain workflows

Rules:

- NO HTTP logic
- NO direct SQL queries

---

### Repositories

Responsibilities:

- database access
- queries
- persistence layer abstraction

Rules:

- ONLY persistence logic
- NO business logic

---

### Models

Responsibilities:

- database entities/tables

---

### Schemas

Responsibilities:

- validation
- request/response DTOs
- serialization

---

## MVC ENFORCEMENT RULES

Controllers MUST NOT:

- query the database directly
- contain SQL

Services MUST:

- contain application logic

Repositories MUST:

- isolate persistence logic

Routes MUST:

- remain very small

Codex must explain:

- which layer code belongs to
- why it belongs there

---

# =========================================================

# SDK ARCHITECTURE

# =========================================================

## SDK PURPOSE

AgentOps includes a lightweight SDK.

The SDK is responsible for:

- tracking AI agent execution
- collecting telemetry
- measuring latency
- capturing errors
- capturing spans/events
- sending telemetry to the backend API

The SDK is NOT responsible for:

- running AI agents
- orchestration
- business logic
- workflow execution
- AI reasoning

The SDK only OBSERVES and REPORTS.

---

## V1 SDK SCOPE

Version 1 SDK should remain VERY SIMPLE.

Supported initially:

- Python only
- LangChain integration only

V1 SDK features:

- trace start/end
- latency measurement
- error capture
- basic spans
- send telemetry to backend API

NOT in V1:

- OpenTelemetry support
- async batching
- retries
- buffering
- offline queue
- multi-framework support
- automatic instrumentation
- distributed tracing
- enterprise SDK features

---

## SDK PHILOSOPHY

The SDK should be:

- lightweight
- simple
- readable
- easy to understand
- beginner-friendly

Avoid:

- over-engineering
- unnecessary abstractions
- premature optimization

---

## SDK STRUCTURE

Preferred structure:

backend/
sdk/
agentops/
client/
trackers/
integrations/
models/
utils/

---

## SDK WORKFLOW

Typical SDK flow:

1. User application starts AI agent
2. SDK starts trace
3. SDK records telemetry
4. SDK sends telemetry to backend
5. Backend stores trace
6. Dashboard visualizes trace

The SDK acts like:

- telemetry collector
- observability tracker
- monitoring layer

NOT:

- AI framework
- orchestration engine

---

## SDK REVIEW RULES

Before implementing SDK features, Codex must:

1. Explain why the feature belongs in the SDK
2. Explain SDK responsibility boundaries
3. Explain complexity tradeoffs
4. Suggest simplest implementation first

Codex should prioritize:

- simplicity
- readability
- maintainability

---

# =========================================================

# FRONTEND ARCHITECTURE

# =========================================================

Preferred frontend structure:

frontend/
src/
pages/
layouts/
components/
hooks/
services/
store/
types/
utils/
styles/

---

## FRONTEND RESPONSIBILITIES

### Pages

Responsibilities:

- route-level views
- page composition

### Components

Responsibilities:

- reusable UI components
- presentation logic

### Hooks

Responsibilities:

- reusable frontend logic

### Services

Responsibilities:

- API communication

---

## FRONTEND RULES

Avoid:

- huge page components
- business logic inside UI
- duplicated API logic

Prefer:

- reusable components
- separation of concerns
- composability

---

# =========================================================

# MVP SCOPE

# =========================================================

Version 1 should include:

## Backend

- FastAPI backend
- MVC architecture
- PostgreSQL integration
- trace ingestion API
- span ingestion API
- evaluation storage

## Frontend

- dashboard page
- traces list page
- trace details page
- evaluations page
- settings page

## Features

- collect traces
- collect spans
- latency tracking
- token tracking
- error tracking
- basic evaluation scores

## Demo

- sample AI agent integration
- demo traces

---

# =========================================================

# OUT OF SCOPE FOR V1

# =========================================================

Do NOT build yet:

- Kubernetes
- Kafka
- microservices
- advanced RBAC
- enterprise auth
- billing systems
- distributed tracing
- OpenTelemetry integrations
- multi-cloud infrastructure
- advanced MLOps infrastructure

Keep V1 focused and polished.

---

# =========================================================

# PREFERRED TECH STACK

# =========================================================

## Frontend

- React
- TypeScript
- Tailwind CSS
- Recharts
- React Query

## Backend

- Python
- FastAPI
- PostgreSQL
- SQLAlchemy

## Development

- Docker Compose
- GitHub
- GitHub Actions later

---

# =========================================================

# DATABASE GUIDELINES

# =========================================================

Database design should be:

- normalized
- clean
- scalable
- query-friendly

Prefer:

- UUIDs
- timestamps
- audit-friendly tables

Likely tables:

- agents
- traces
- spans
- evaluations
- tool_calls

Codex should explain:

- relationships
- indexes
- scalability considerations

---

# =========================================================

# MOCKUPS & DESIGN REFERENCES

# =========================================================

## Mockups Folder

The repository includes a:

mockups/

folder containing UI reference screenshots.

These mockups are the primary visual source of truth for the frontend design direction.

Examples:

- dashboard.png
- traces-list.png
- trace-details.png
- evaluations.png
- settings.png
- components.png

---

## Purpose Of Mockups

The mockups exist to help:

- define visual direction
- define layout structure
- identify reusable components
- maintain UI consistency
- guide frontend implementation

The mockups are NOT final production-perfect designs.

They are:

- architectural UI references
- frontend planning references
- portfolio-quality visual direction

---

## Codex Design Workflow

Before implementing frontend pages, Codex should:

1. Analyze the relevant mockup
2. Explain:
   - layout structure
   - reusable components
   - responsive behavior
   - Tailwind strategy
   - React component hierarchy
3. Suggest implementation structure
4. Wait for approval before generating large implementations

---

## UI Consistency Rules

Frontend implementation should remain visually consistent with the mockups.

Codex should:

- avoid major visual deviations
- preserve the overall design language
- preserve dark-mode-first styling
- preserve SaaS dashboard aesthetics

---

## Frontend Philosophy

The frontend should feel:

- modern
- clean
- minimal
- premium
- recruiter-impressive
- startup-quality

The frontend should prioritize:

- layout clarity
- component reusability
- readability
- responsiveness
- consistency

Avoid:

- over-animated UI
- cluttered layouts
- excessive gradients/effects
- inconsistent spacing

---

# =========================================================

# UI / UX GUIDELINES

# =========================================================

The UI should feel:

- modern
- minimal
- premium
- dark-mode-first
- SaaS-like

Inspired by:

- Datadog
- Grafana
- Vercel
- Linear
- Stripe dashboards

---

## MAIN PAGES

### Dashboard

Shows:

- KPI cards
- latency charts
- traces overview
- error rates
- evaluation trends

---

### Traces List

Shows:

- traces table
- filtering
- search
- status badges
- latency metrics

---

### Trace Details

Shows:

- execution timeline
- spans
- prompts
- outputs
- tool calls
- metadata

This is the main “wow factor” page.

---

### Evaluations

Shows:

- quality scores
- hallucination metrics
- evaluation trends
- pass/fail indicators

---

### Settings

Shows:

- integrations
- API keys
- notifications
- preferences

---

## UI WORKFLOW RULES

Before generating UI code, Codex MUST:

1. Explain page layout
2. Explain component hierarchy
3. Explain responsive behavior
4. Explain UX reasoning
5. Wait for approval

---

# =========================================================

# FIGMA / DESIGN MCP RULES

# =========================================================

Codex may use:

- screenshots
- mockups
- Figma references

for:

- design understanding
- UI planning
- layout analysis
- component hierarchy planning
- implementation review

Codex can:

- inspect mockups
- explain design structure
- suggest React components
- suggest Tailwind structure
- review implementation consistency

Codex should NOT:

- overwrite UI automatically
- redesign pages silently
- skip design explanation

Preferred workflow:

1. Analyze mockup/screenshot
2. Explain layout
3. Explain components
4. Suggest structure
5. Wait for approval
6. Review implementation

---

# =========================================================

# DIAGRAM RULES

# =========================================================

Codex may generate Mermaid diagrams.

Preferred diagrams:

- system architecture
- MVC flow
- trace ingestion flow
- frontend hierarchy
- ERD diagrams
- API flow
- sequence diagrams

Diagrams should be placed in:

- README.md
- docs/architecture.md
- docs/database.md

Codex should keep diagrams synchronized with architecture changes.

---

# =========================================================

# CODE STYLE RULES

# =========================================================

Code should be:

- readable
- modular
- simple
- maintainable

Prefer:

- short functions
- clear names
- small files
- explicit logic

Avoid:

- over-abstraction
- premature optimization
- clever code
- unnecessary patterns

---

# =========================================================

# DOCUMENTATION POLICY

# =========================================================

README.md is CRITICAL.

Documentation is part of the product.

The repository should look:

- professional
- polished
- recruiter-friendly
- contributor-friendly

---

## README REQUIREMENTS

README must include:

- project overview
- architecture overview
- setup instructions
- environment variables
- local development guide
- API overview
- screenshots/mockups
- roadmap
- MVP progress
- folder structure
- technologies used

---

## README MAINTENANCE RULE

Before EVERY commit, Codex MUST verify:

1. Is README accurate?
2. Did architecture change?
3. Did folder structure change?
4. Did setup change?
5. Did API endpoints change?
6. Did environment variables change?
7. Were pages added?
8. Were features added?

If YES:

- Codex MUST suggest README updates

README updates are part of development.

---

# =========================================================

# PROGRESS TRACKING

# =========================================================

README should maintain:

- completed features
- current milestone
- next milestone
- roadmap checklist
- architecture notes

Codex should help maintain:

- milestone tracking
- progress tracking
- implementation notes

---

# =========================================================

# REVIEW RULES

# =========================================================

When reviewing code, Codex should provide:

1. What is good
2. What should improve
3. Bugs or risks
4. Architecture concerns
5. Performance concerns
6. Suggested next step

Codex should:

- teach while reviewing
- explain tradeoffs
- explain best practices

Codex should NOT:

- automatically rewrite everything

---

# =========================================================

# GIT RULES

# =========================================================

Prefer:

- small commits
- clean commits
- feature branches

Commit messages should be:

- professional
- descriptive
- clean

Example:
feat(traces): add trace ingestion endpoint

---

# =========================================================

# FINAL PROJECT GOAL

# =========================================================

The final project should:

- impress recruiters
- demonstrate architecture knowledge
- showcase full-stack engineering
- showcase observability concepts
- showcase AI infrastructure understanding
- showcase clean engineering practices

The project should feel:

- startup-quality
- thoughtfully engineered
- modern
- technically mature
