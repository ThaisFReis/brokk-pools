<!--
SYNC IMPACT REPORT
==================
Version change: 1.0.0 → 1.1.0
Modified principles:
  - Updated II. Code Quality Standards to emphasize component testing for financial data displays
  - Updated III. Performance Excellence to include dashboard-specific optimization requirements
Added sections:
  - V. Component Testing Standards (financial data visualization focus)
Removed sections: N/A
Templates requiring updates:
  ✅ .specify/templates/plan-template.md (pending validation)
  ✅ .specify/templates/spec-template.md (pending validation)
  ✅ .specify/templates/tasks-template.md (pending validation)
Follow-up TODOs: None
-->

# Brokkr Finance Development Constitution

## Core Principles

### I. Visual Identity Adherence (Dark Cyberpunk + Nordic Runes) — NON-NEGOTIABLE

**Aderência total ao tema "dark cyberpunk com runas nórdicas" é obrigatória.**

- MUST use Solana's color palette (purple, blue, electric green) prominently throughout the interface
- MUST implement futuristic design with metallic textures
- MUST incorporate Nordic rune elements in visual design
- All visual elements MUST follow the established dark cyberpunk aesthetic
- All data visualization components (cards, tables, charts) MUST adhere to the visual identity guide
- NO deviations from this visual identity are permitted without explicit approval
- Design decisions MUST be validated against the visual identity guide before implementation

**Rationale**: The brand identity is the core differentiator for Brokkr Finance. Consistency in visual execution ensures brand recognition and creates a unique, memorable user experience in the DeFi space. Financial data displays must maintain visual coherence while ensuring readability and usability.

### II. Code Quality Standards — NON-NEGOTIABLE

**TypeScript com modo `strict` ativado é obrigatório.**

- MUST use TypeScript with `strict` mode enabled in tsconfig.json
- MUST format all code with Prettier for consistency
- MUST lint all code with ESLint and pass all checks before commit
- MUST follow established naming conventions and code organization patterns
- Type safety MUST be enforced - no `any` types without explicit justification
- All components MUST have proper TypeScript interfaces/types defined
- Financial data types (positions, prices, APYs, etc.) MUST be strictly typed
- Code MUST pass linting checks before commit

**Rationale**: Strict TypeScript prevents runtime errors, improves maintainability, and provides superior developer experience through autocomplete and type checking. Prettier and ESLint eliminate style debates and ensure consistent formatting across the codebase. Financial applications require the highest level of type safety to prevent data handling errors that could lead to incorrect displays or calculations.

### III. Performance Excellence — NON-NEGOTIABLE

**O dashboard DEVE ser performático, mesmo lidando com múltiplas posições e gráficos.**

- MUST optimize all images (WebP/AVIF formats, proper sizing, lazy loading)
- MUST implement code splitting and lazy loading for components
- MUST achieve Lighthouse performance score ≥90
- MUST minimize bundle size (analyze and remove unused dependencies)
- MUST use web performance best practices (Critical CSS, async/defer scripts)
- MUST measure and track Core Web Vitals (LCP, FID, CLS)
- NO blocking resources on initial page load
- Data fetching MUST be optimized (caching, batching, parallel requests where appropriate)
- Chart rendering MUST be optimized (virtualization for large datasets, efficient re-rendering)
- Dashboard MUST remain responsive with 50+ positions displayed simultaneously
- Real-time data updates MUST NOT cause UI jank or frame drops

**Rationale**: Performance directly impacts user experience and trust. In DeFi, users need instant access to their financial data. A slow dashboard handling multiple positions and charts means frustrated users and potential loss of capital visibility during critical market moments. Optimizing data fetching and rendering is crucial for maintaining application responsiveness.

### IV. Responsive Design

**Design totalmente responsivo é obrigatório.**

- MUST provide flawless experience on desktop (1920px, 1440px, 1280px)
- MUST provide flawless experience on mobile (375px, 414px, 768px)
- MUST test on actual devices (iOS Safari, Android Chrome)
- MUST use mobile-first approach in CSS
- MUST ensure touch targets are appropriately sized (≥44px)
- Visual identity MUST remain consistent across all breakpoints
- NO horizontal scrolling on any supported viewport
- Financial data tables MUST be responsive and readable on all devices

**Rationale**: Users access DeFi platforms from various devices. A broken mobile experience alienates a significant portion of potential users and damages brand credibility. Responsive design is essential for accessibility and market reach. Users must be able to monitor positions and make decisions on any device.

### V. Component Testing Standards — NON-NEGOTIABLE

**Componentes que exibem dados financeiros DEVEM ter testes para garantir a correta renderização dos dados.**

- All financial data display components (position cards, APY displays, price charts, balance displays) MUST have unit tests
- Tests MUST verify correct data rendering with various input scenarios
- Tests MUST verify correct formatting of financial values (decimals, currency symbols, percentages)
- Tests MUST verify edge cases (zero values, negative values, extremely large numbers, null/undefined data)
- Tests MUST verify loading states and error states
- Chart components MUST have tests verifying correct data point rendering
- Integration tests MUST verify end-to-end data flow from API to UI display
- Visual regression tests SHOULD be used for critical financial components
- Test coverage for financial components MUST be ≥80%

**Rationale**: Financial applications require the highest level of testing to prevent display errors that could lead to incorrect user decisions. A user seeing incorrect position values or APYs could make catastrophic financial decisions. Testing ensures data integrity throughout the application and builds user trust in the platform's reliability.

## Performance Standards

### Required Metrics

- **Lighthouse Performance Score**: ≥90
- **First Contentful Paint (FCP)**: <1.5s
- **Largest Contentful Paint (LCP)**: <2.5s
- **Time to Interactive (TTI)**: <3.5s
- **Cumulative Layout Shift (CLS)**: <0.1
- **Total Bundle Size**: <300KB (initial load, gzipped)
- **Dashboard Rendering Time**: <500ms for 50 positions
- **Chart Render Time**: <200ms per chart
- **API Response Time**: <1s for data fetching

### Optimization Requirements

- Image optimization MUST use next-gen formats (WebP with fallbacks)
- Critical CSS MUST be inlined
- JavaScript MUST be code-split by route/component
- Third-party scripts MUST be loaded asynchronously
- Fonts MUST use `font-display: swap` and preload critical fonts
- Performance regression tests MUST be part of CI/CD pipeline
- Data fetching MUST use caching strategies (SWR, React Query, or similar)
- Charts MUST use canvas rendering for datasets >100 points
- List virtualization MUST be used for displaying >20 items
- Memoization MUST be used for expensive calculations (APY, P&L, etc.)

## Development Workflow

### Quality Gates

All code MUST pass the following gates before merge:

1. **TypeScript Compilation**: No type errors with `strict` mode
2. **Linting**: ESLint passes with zero errors
3. **Formatting**: Prettier check passes
4. **Performance**: Lighthouse CI score ≥90
5. **Visual Validation**: Screenshots match design specifications
6. **Responsive Testing**: Manual verification on key breakpoints

### Code Review Requirements

- All PRs MUST be reviewed for visual identity compliance
- All PRs MUST be reviewed for performance impact
- Performance budget violations MUST be justified and approved
- Visual changes MUST include screenshots/videos
- Reviewers MUST verify TypeScript strict compliance

### Testing Standards

- MUST include unit tests for all financial data display components
- MUST include visual regression tests for critical UI components
- MUST test responsive behavior at standard breakpoints
- MUST validate performance metrics in CI/CD
- MUST test cross-browser compatibility (Chrome, Firefox, Safari)
- MUST include integration tests for data flow (API → State → UI)
- MUST test edge cases for financial calculations and displays
- Test coverage for financial components MUST be ≥80%
- MUST test real-time data update scenarios

## Governance

**This constitution supersedes all other development practices and guidelines.**

All pull requests and code reviews MUST verify compliance with these principles. Any complexity introduced MUST be justified against the core principles, particularly performance and visual identity requirements.

### Amendment Process

- Amendments require documented justification with impact analysis
- Major changes (principle additions/removals) require stakeholder approval
- All amendments MUST include migration plan for existing code
- Constitution version MUST be updated following semantic versioning

### Versioning Policy

- **MAJOR**: Backward-incompatible principle removals or redefinitions
- **MINOR**: New principle added or materially expanded guidance
- **PATCH**: Clarifications, wording fixes, non-semantic refinements

### Compliance Review

- Constitution compliance MUST be verified in every PR review
- Performance regressions are grounds for immediate PR rejection
- Visual identity violations are grounds for immediate PR rejection
- Quarterly constitution review to ensure continued relevance

**Version**: 1.1.0 | **Ratified**: 2025-10-10 | **Last Amended**: 2025-10-11
