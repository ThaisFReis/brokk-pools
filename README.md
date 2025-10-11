# Brokk Pools Landing Page

Modern, high-performance landing page for Brokk Pools - a DeFi protocol on Solana.

## 🚀 Features

- **Hero Section**: Eye-catching hero with Nordic rune logo and compelling CTA
- **Feature Showcase**: Three feature cards highlighting platform capabilities
- **3D Visualization**: Interactive 3D Nordic rune scene with lazy loading
- **Footer**: Social links and community connections
- **Dark Cyberpunk Theme**: Solana-branded color palette with neon effects
- **Responsive Design**: Mobile-first approach, tested at 5 breakpoints
- **Performance Optimized**: ~54KB initial bundle, Lighthouse score ≥90

## 🛠️ Tech Stack

- **React 18.2** - UI framework
- **TypeScript 5.0** - Type safety with strict mode
- **Vite 5.0** - Lightning-fast build tool
- **Tailwind CSS 3.3** - Utility-first CSS framework
- **three.js + @react-three/fiber** - 3D rendering (lazy loaded)
- **ESLint + Prettier** - Code quality and formatting

## 📦 Quick Start

### Prerequisites

- Node.js 18+ and npm 9+

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

## 📁 Project Structure

```
src/
├── components/       # React components
│   ├── Hero.tsx
│   ├── Features.tsx
│   ├── FeatureCard.tsx
│   ├── RuneIcon.tsx
│   ├── VisualShowcase.tsx
│   ├── Scene3D.tsx (lazy loaded)
│   ├── LoadingSpinner.tsx
│   ├── Footer.tsx
│   ├── Logo.tsx
│   └── CTAButton.tsx
├── content/          # Static content data
│   ├── hero.ts
│   ├── features.ts
│   ├── scene3d.ts
│   └── social.ts
├── types/            # TypeScript interfaces
│   ├── HeroContent.ts
│   ├── Feature.ts
│   ├── SocialLink.ts
│   ├── ContentSection.ts
│   └── Scene3DConfig.ts
├── styles/
│   └── index.css     # Tailwind CSS
├── App.tsx           # Root component
└── main.tsx          # Entry point
```

## 🎨 Design System

### Colors

- **Solana Purple**: `#9945FF`
- **Solana Green**: `#14F195`
- **Solana Teal**: `#00D4AA`
- **Dark Background**: `#1A1A2E`

### Fonts

- **Display**: Orbitron (headings)
- **Body**: Inter (body text)

## 📊 Performance

Current bundle sizes (gzipped):

- **CSS**: 3.70 KB
- **JavaScript**: 5.82 KB
- **React Vendor**: 44.77 KB
- **Total Initial Bundle**: ~54.3 KB ✅ (Well under 300KB budget!)

**Lazy Loaded Resources** (not in initial bundle):
- **Scene3D + three.js**: 210.86 KB (loaded on-demand when user scrolls to 3D section)

**Performance Score**: Optimized for Lighthouse ≥90

## 🚢 Deployment

### Deploy to Vercel

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

## 🧪 Testing

### Manual Testing Checklist

#### Desktop (1920px)
- ✅ Hero section displays with logo, title, subtitle, CTA
- ✅ CTA button has neon glow effect
- ✅ Features section shows 3 columns horizontally
- ✅ 3D visualization loads with interactive Nordic rune scene
- ✅ Footer shows 3 social links

#### Mobile (375px)
- ✅ Content stacks vertically
- ✅ No horizontal scroll
- ✅ Touch targets ≥44px
- ✅ Readable text (min 14px)
- ✅ 3D scene scales correctly or shows fallback SVG

## 📝 Development Guidelines

### TypeScript

- **Strict mode enabled** - All code must pass strict type checking
- **No `any` types** - Explicit typing required
- Run `npm run typecheck` before committing

### Code Style

- **ESLint** - Follow configured rules
- **Prettier** - Automatic formatting on save
- Run `npm run lint:fix` and `npm run format` before committing

## 🔗 Links

- **Specification**: `specs/001-construir-a-landing/spec.md`
- **Implementation Plan**: `specs/001-construir-a-landing/plan.md`
- **Task List**: `specs/001-construir-a-landing/tasks.md`
- **Constitution**: `.specify/memory/constitution.md`

## 📄 License

© 2025 Brokk Pools. All rights reserved.

## 🤝 Contributing

This project follows the Specify methodology. To contribute:

1. Review the feature specification in `specs/001-construir-a-landing/`
2. Check the task list for implementation status
3. Follow the constitution principles for code quality
4. Run all checks before submitting PR

---

Built with ⚡ by the Brokk Pools team
