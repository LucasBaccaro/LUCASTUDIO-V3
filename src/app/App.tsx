import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { ValueProposition } from './components/ValueProposition';
import { CTASection } from './components/CTASection';
import { Footer } from './components/Footer';
import { Chatbot } from './components/Chatbot';
import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    document.title = 'Luca Studio | Soluciones Digitales para tu Negocio';
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <Navigation />
      <main>
        <Hero />
        <Services />
        <ValueProposition />
        <CTASection />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}