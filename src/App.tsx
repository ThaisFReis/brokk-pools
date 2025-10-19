import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

// Landing page components
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Footer } from './components/Footer';
import { About } from './components/About';

// Dashboard components
import { DashboardLayout } from './components/dashboard/DashboardLayout';

// Demo/Test pages
import { TopPositions } from './pages/TopPositions';

function LandingPage() {
  return (
    <main className="relative min-h-screen bg-solana-gray">
      <div className="relative z-10">
        <Hero />
        <Features />
        <About />
      </div>
    </main>
  );
}

function App() {
  // Configure Solana network (mainnet-beta for production, devnet for testing)
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // Configure wallet adapters (Phantom and Solflare)
  const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>
          <BrowserRouter>
            <Header />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<DashboardLayout />} />
              <Route path="/top-positions" element={<TopPositions />} />
              {/*<Route path="/demo/top-position" element={<TopPositionDemo />} />*/}
            </Routes>
            <Footer />
          </BrowserRouter>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
