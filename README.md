# Brokk Pools

Modern DeFi platform on Solana for concentrated liquidity pool management. Track your positions, monitor performance, and optimize your liquidity provision with real-time analytics.

## 🚀 Features

### Landing Page
- **Hero Section**: Immersive background with compelling CTA and Nordic-inspired branding
- **Feature Showcase**: Interactive feature cards highlighting platform capabilities
- **About Section**: Project narrative and vision
- **Responsive Design**: Mobile-first approach with seamless experience across all devices
- **Dark Cyberpunk Theme**: Solana-branded color palette with forge-inspired aesthetics

### Dashboard
- **Wallet Integration**: Seamless Solana wallet connection (Phantom, Solflare)
- **Position Management**: View and manage all your concentrated liquidity positions
- **Real-time Analytics**: Track performance metrics, PnL, and uncollected fees
- **Interactive Charts**: Visualize liquidity distribution and price ranges
- **Performance Monitoring**: Summary cards with key portfolio metrics
- **Responsive Tables**: Virtual scrolling for optimal performance with large datasets

## 🛠️ Tech Stack

- **React 18.2** - UI framework
- **TypeScript 5.0+** - Type safety with strict mode enabled
- **Vite 5.0** - Lightning-fast build tool and dev server
- **Tailwind CSS 3.3** - Utility-first CSS framework
- **React Router 7.9** - Client-side routing
- **Solana Wallet Adapter** - Wallet connection and management
- **ECharts** - Interactive data visualization
- **TanStack Virtual** - High-performance list virtualization
- **Vitest** - Unit testing framework
- **Playwright** - End-to-end testing
- **ESLint + Prettier** - Code quality and formatting

## 📦 Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- A Solana wallet (Phantom or Solflare recommended)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

### Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Auto-fix ESLint issues |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:ui` | Open Vitest UI |
| `npm run test:coverage` | Generate test coverage report |

## 📁 Project Structure

```
src/
├── components/
│   ├── Header.tsx              # Global header with wallet connection
│   ├── Hero.tsx                # Landing page hero section
│   ├── Features.tsx            # Feature showcase
│   ├── FeatureCard.tsx         # Individual feature card
│   ├── About.tsx               # About section
│   ├── Footer.tsx              # Footer with social links
│   ├── Logo.tsx                # Logo component
│   ├── CTAButton.tsx           # Call-to-action button
│   ├── VisualShowcase.tsx      # Visual showcase section
│   └── dashboard/
│       ├── DashboardLayout.tsx # Main dashboard layout
│       ├── SummaryCards.tsx    # Portfolio summary cards
│       ├── PositionList.tsx    # Position list with virtual scrolling
│       ├── PositionCard.tsx    # Individual position card
│       ├── PositionChart.tsx   # Position chart visualization
│       ├── EmptyState.tsx      # Empty state component
│       └── SkeletonCard.tsx    # Loading skeleton
├── hooks/
│   ├── useWallet.ts            # Wallet connection hook
│   └── usePositions.ts         # Position data management hook
├── utils/
│   └── formatters.ts           # Utility functions for formatting
├── data/
│   └── mockPositions.ts        # Mock position data
├── types/
│   └── dashboard.ts            # TypeScript interfaces
├── content/
│   ├── hero.ts                 # Hero section content
│   ├── features.ts             # Features content
│   └── social.ts               # Social links
├── styles/
│   └── index.css               # Global styles and Tailwind
├── App.tsx                     # Root component with routing
└── main.tsx                    # Entry point
```

## 🎨 Design System

### Color Palette

#### Solana Colors
- **Purple**: `#9945FF` - Primary brand color
- **Pink**: `#FF006E` - Accent color
- **Cyan**: `#14F195` - Success/positive
- **Teal**: `#00D4AA` - Secondary accent
- **Dark**: `#1A1A2E` - Background
- **Gray**: `#060606` - Deep background

#### Forge Theme
- **Deep Black**: `#0A0A0A` - Darkest background
- **Metal Dark**: `#1a1a1a` - Card backgrounds
- **Metal Gray**: `#2a2a2a` - Elevated surfaces
- **Steel**: `#3a3a3a` - Borders and dividers
- **Ember**: `#FF6B35` - Hot accent
- **Glow**: `#FFA500` - Warning/attention

### Typography

- **Display**: IBM Plex Mono (code/data display)
- **Body**: Inter (body text)
- **Title**: Cinzel (headings and titles)

### Responsive Breakpoints

- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

## 🔐 Wallet Integration

Brokk Pools supports the following Solana wallets:

- **Phantom** - Recommended for desktop and mobile
- **Solflare** - Alternative desktop wallet

### Wallet Flow

1. User clicks "Connect Wallet" button in header
2. Wallet modal appears with available wallet options
3. User selects wallet and approves connection
4. Automatic redirect to dashboard (from landing page)
5. Dashboard loads user's positions and portfolio data
6. User can disconnect wallet manually at any time

## 📊 Dashboard Features

### Summary Cards
- **Total Assets Value**: Sum of all position values
- **Total PnL**: Profit and loss across all positions
- **Uncollected Fees**: Fees ready to be collected
- **Position Stats**: Active positions and range status

### Position Management
- View all concentrated liquidity positions
- Real-time price monitoring
- Liquidity distribution charts
- Fee accumulation tracking
- Position status indicators (In Range / Out of Range)

### Performance Optimization
- Virtual scrolling for large position lists
- Lazy loading of charts and heavy components
- Skeleton loading states for better UX
- Efficient data fetching and caching

## 🚢 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

### Environment Variables

For production deployment, configure:

```env
# Solana RPC Endpoint (optional - defaults to public RPC)
VITE_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# Network (mainnet-beta, devnet, testnet)
VITE_SOLANA_NETWORK=mainnet-beta
```

## 🧪 Testing

### Unit Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# UI mode
npm run test:ui

# Coverage
npm run test:coverage
```

### E2E Tests

```bash
# Run Playwright tests
npx playwright test

# Interactive mode
npx playwright test --ui

# Debug mode
npx playwright test --debug
```

### Manual Testing Checklist

#### Landing Page
- [ ] Hero section displays with background image
- [ ] CTA buttons navigate correctly
- [ ] Features section shows all cards
- [ ] Footer displays social links
- [ ] Responsive layout on mobile (375px)
- [ ] Header appears on all pages

#### Dashboard
- [ ] Wallet connection prompt appears when disconnected
- [ ] Wallet modal opens with wallet options
- [ ] Connection success redirects to dashboard (from landing)
- [ ] Summary cards display correct data
- [ ] Position list renders with virtual scrolling
- [ ] Position cards show all details (pool, value, PnL, fees)
- [ ] Charts render correctly
- [ ] Empty state shows when no positions
- [ ] Disconnect wallet works properly

## 📝 Development Guidelines

### TypeScript

- **Strict mode enabled** - All code must pass strict type checking
- **No implicit `any`** - Explicit typing required
- **Interface-first** - Define interfaces before implementation
- Run `npm run typecheck` before committing

### Code Style

- **ESLint** - Follow configured rules
- **Prettier** - Automatic formatting (use `npm run format`)
- **Tailwind** - Use utility classes, avoid custom CSS
- **Component structure** - One component per file
- **Named exports** - Prefer named exports over default

### Git Workflow

```bash
# Before committing
npm run typecheck
npm run lint:fix
npm run format
npm test

# Create meaningful commits
git add .
git commit -m "feat: add position chart visualization"
```

## 🔗 Resources

### Specifications
- Landing Page: `specs/001-construir-a-landing/`
- Dashboard: `specs/002-construir-o-dashboard/`
- Constitution: `.specify/memory/constitution.md`

### Documentation
- [React Documentation](https://react.dev)
- [Solana Wallet Adapter](https://github.com/solana-labs/wallet-adapter)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Guide](https://vitejs.dev/guide)
- [Vitest](https://vitest.dev)

## 📄 License

© 2025 Brokk Pools. All rights reserved.

## 🤝 Contributing

This project follows the Specify methodology for feature development:

1. Review feature specifications in `specs/`
2. Check task lists for implementation status
3. Follow constitution principles for code quality
4. Run all checks before submitting PR
5. Write tests for new features
6. Update documentation as needed

### Code of Conduct

- Write clean, maintainable code
- Follow TypeScript best practices
- Test your changes thoroughly
- Document complex logic
- Be respectful in code reviews

---

Built with ⚡ by the Brokk Pools team

**Powered by Solana** | [Twitter](https://twitter.com/brokkpools) | [Discord](https://discord.gg/brokkpools) | [Telegram](https://t.me/brokkpools)
