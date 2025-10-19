<!--
SYNC IMPACT REPORT
==================
Version change: 1.1.0 → 1.2.0
Modified principles:
  - Enhanced I. Visual Identity Adherence to explicitly mention third-party component styling
  - Expanded IV. Responsive Design to include financial data table requirements
Added sections:
  - VI. Security & User Safety (NEW) - Critical information display, wallet interaction security
  - VII. User Experience Excellence (NEW) - Transaction flow clarity and feedback
Removed sections: N/A
Templates requiring updates:
  ✅ .specify/templates/plan-template.md (updated)
  ✅ .specify/templates/spec-template.md (updated)
  ✅ .specify/templates/tasks-template.md (updated)
  ✅ .specify/templates/commands/*.md (validated)
Follow-up TODOs: None
-->

# Brokk Pools Development Constitution

## Core Principles

### I. Visual Identity Adherence (Dark Cyberpunk + Nordic Runes) — NON-NEGOTIABLE

**Aderência estrita à paleta de cores da Solana e ao tema futurista. Todos os componentes de UI, incluindo os integrados de terceiros, devem ser estilizados para se alinharem ao design do dApp.**

- MUST use Solana's color palette (purple `#9945FF`, pink `#FF006E`, cyan `#14F195`, teal `#00D4AA`) prominently throughout the interface
- MUST implement dark cyberpunk aesthetic with metallic textures and forge-inspired elements
- MUST incorporate Nordic rune elements in visual design where appropriate
- All visual elements MUST follow the established dark theme aesthetic
- All data visualization components (cards, tables, charts, badges) MUST adhere to the visual identity guide
- Third-party UI components (wallet buttons, modals, integrations) MUST be styled to match the dApp's design system
- NO unstyled or default-themed third-party components are permitted
- Design decisions MUST be validated against the visual identity guide before implementation
- Component libraries MUST be customized to fit the cyberpunk aesthetic

**Rationale**: The brand identity is the core differentiator for Brokk Pools. Consistency in visual execution ensures brand recognition and creates a unique, memorable user experience in the DeFi space. Third-party components that don't match the theme break immersion and damage brand credibility. Every pixel must reinforce the dark cyberpunk identity.

### II. Code Quality Standards — NON-NEGOTIABLE

**TypeScript com modo `strict` ativado, Prettier e ESLint são obrigatórios.**

- MUST use TypeScript with `strict` mode enabled in tsconfig.json
- MUST format all code with Prettier for consistency
- MUST lint all code with ESLint and pass all checks before commit
- MUST follow established naming conventions and code organization patterns
- Type safety MUST be enforced - no `any` types without explicit justification
- All components MUST have proper TypeScript interfaces/types defined
- Financial data types (positions, prices, APYs, fees, slippage) MUST be strictly typed
- Code MUST pass `npm run typecheck`, `npm run lint`, and `npm run format:check` before commit

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

### IV. Responsive Design — NON-NEGOTIABLE

**Design totalmente responsivo é obrigatório.**

- MUST provide flawless experience on desktop (1920px, 1440px, 1280px)
- MUST provide flawless experience on mobile (375px, 414px, 768px)
- MUST test on actual devices (iOS Safari, Android Chrome)
- MUST use mobile-first approach in CSS
- MUST ensure touch targets are appropriately sized (≥44px)
- Visual identity MUST remain consistent across all breakpoints
- NO horizontal scrolling on any supported viewport
- Financial data tables MUST be responsive and readable on all devices
- Complex financial information (slippage, price impact, fees) MUST be displayed clearly on mobile screens

**Rationale**: Users access DeFi platforms from various devices. A broken mobile experience alienates a significant portion of potential users and damages brand credibility. Responsive design is essential for accessibility and market reach. Users must be able to monitor positions, execute swaps, and make financial decisions on any device with confidence.

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

### VI. Security & User Safety — NON-NEGOTIABLE

**A interface deve apresentar de forma clara informações críticas como tolerância a slippage, impacto no preço e taxas, para que o usuário possa tomar decisões informadas. As interações com a carteira devem ser seguras e explícitas.**

- MUST display slippage tolerance prominently before transaction confirmation
- MUST display price impact clearly with color-coded warnings (green <1%, yellow 1-3%, red >3%)
- MUST display all transaction fees (network fees, protocol fees, swap fees) before user confirmation
- MUST show transaction preview with input/output amounts before execution
- Wallet interactions MUST require explicit user approval (no automatic signing)
- MUST display clear confirmation dialogs for all financial transactions
- MUST show transaction status with real-time feedback (pending, confirming, success, failed)
- Error messages MUST be clear, actionable, and user-friendly (no raw error codes without explanation)
- MUST implement transaction simulation/preview when available
- Security warnings MUST be displayed for high-risk actions (large price impact, unusual slippage)
- MUST validate user inputs (addresses, amounts) before submission
- NO silent failures - all errors must be surfaced to the user

**Rationale**: In DeFi, user errors can result in permanent financial loss. Transparent display of critical information (slippage, price impact, fees) empowers users to make informed decisions and prevents costly mistakes. Explicit wallet interactions prevent phishing attacks and unauthorized transactions. Clear feedback builds trust and reduces user anxiety during high-stakes financial operations.

### VII. User Experience Excellence — NON-NEGOTIABLE

**A interface de swap deve ser intuitiva, rápida e fornecer feedback claro ao usuário em cada etapa do processo (ex: aprovação, envio, confirmação da transação).**

- Swap interface MUST be intuitive with clear input/output fields
- MUST provide real-time price quotes with automatic refresh
- MUST show loading states during quote fetching, approval, and execution
- Multi-step transactions (approve + swap) MUST show progress with step indicators
- MUST display clear feedback for each transaction stage:
  - "Approving token..." (with transaction link)
  - "Submitting swap..." (with transaction link)
  - "Confirming..." (with block confirmations count)
  - "Success!" (with final transaction details and link)
- Transaction failures MUST display actionable error messages with retry options
- MUST show estimated completion time for transactions
- Recent transaction history MUST be accessible and filterable
- Loading states MUST use skeleton screens or progress indicators (NO blank screens)
- Success states MUST include confetti/celebration animations for positive reinforcement
- MUST provide "What's happening?" tooltips for complex operations

**Rationale**: DeFi transactions can be complex and intimidating, especially for new users. Clear, step-by-step feedback reduces anxiety and builds confidence. Users need to understand what's happening at every stage to maintain trust in the platform. Fast, responsive UI with real-time updates creates a premium experience that differentiates Brokk Pools from competitors. Positive reinforcement (success animations) creates emotional engagement and satisfaction.

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
- **Swap Quote Refresh**: <2s for price updates

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
- Memoization MUST be used for expensive calculations (APY, P&L, price impact, etc.)

## Development Workflow

### Quality Gates

All code MUST pass the following gates before merge:

1. **TypeScript Compilation**: No type errors with `strict` mode
2. **Linting**: ESLint passes with zero errors
3. **Formatting**: Prettier check passes
4. **Performance**: Lighthouse CI score ≥90
5. **Visual Validation**: Screenshots match design specifications
6. **Responsive Testing**: Manual verification on key breakpoints
7. **Security Review**: Critical information display verified (slippage, fees, price impact)

### Code Review Requirements

- All PRs MUST be reviewed for visual identity compliance (including third-party component styling)
- All PRs MUST be reviewed for performance impact
- Performance budget violations MUST be justified and approved
- Visual changes MUST include screenshots/videos
- Reviewers MUST verify TypeScript strict compliance
- Financial transaction flows MUST be reviewed for security and clarity
- User-facing error messages MUST be reviewed for clarity

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
- MUST test transaction flows end-to-end (approve → swap → confirm)
- MUST test error handling and recovery flows

## Governance

**This constitution supersedes all other development practices and guidelines.**

All pull requests and code reviews MUST verify compliance with these principles. Any complexity introduced MUST be justified against the core principles, particularly performance, visual identity, security, and user experience requirements.

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
- Security violations (missing fee display, unclear confirmation) are grounds for immediate PR rejection
- Poor UX (missing feedback, unclear steps) should be flagged and improved
- Quarterly constitution review to ensure continued relevance

**Version**: 1.2.0 | **Ratified**: 2025-10-10 | **Last Amended**: 2025-10-19
