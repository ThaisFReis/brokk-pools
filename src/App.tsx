import Hero from './components/Hero';
import Features from './components/Features';
import Footer from './components/Footer';
import Header from './components/Header';

function App() {
  return (
    <main className="relative min-h-screen bg-solana-gray">
      <div className="relative z-10">
        <Header />
        <Hero />
        <Features />
        <Footer />
      </div>
    </main>
  );
}

export default App;
