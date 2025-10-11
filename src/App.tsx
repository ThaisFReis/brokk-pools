import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Footer } from './components/Footer';
import { About } from './components/About';

function App() {
  return (
    <main className="relative min-h-screen bg-solana-gray">
      <div className="relative z-10">
        <Header />
        <Hero />
        <Features />
        <About />
        <Footer />
      </div>
    </main>
  );
}

export default App;
