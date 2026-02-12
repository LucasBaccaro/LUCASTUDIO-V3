import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setMobileMenuOpen(false); // Close menu after navigation
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-background/80 backdrop-blur-lg border-b border-border' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex flex-col items-center group">
          <span className="text-2xl font-semibold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }} translate="no">
            Luca
          </span>
          <span className="text-[7px] font-semibold text-white tracking-[0.3em] uppercase" translate="no">
            Studio
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollToSection('hero')} className="text-muted-foreground hover:text-primary transition-colors duration-300 font-normal">
            Inicio
          </button>
          <button onClick={() => scrollToSection('services')} className="text-muted-foreground hover:text-primary transition-colors duration-300 font-normal">
            Servicios
          </button>
          <button onClick={() => scrollToSection('value')} className="text-muted-foreground hover:text-primary transition-colors duration-300 font-normal">
            Por qué elegirnos
          </button>
          <button onClick={() => scrollToSection('contact')} className="group relative overflow-hidden px-6 py-2 rounded-full transition-all duration-300 hover:scale-[1.03]">
            <span className="absolute inset-0 bg-primary group-hover:bg-primary/90 transition-colors duration-300"></span>
            <span className="relative z-10 text-primary-foreground font-semibold">Contacto</span>
          </button>
        </nav>

        {/* Mobile menu button */}
        <button className="md:hidden p-2 hover:bg-primary/10 rounded-lg transition-colors duration-300" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <div className="w-6 h-5 flex flex-col justify-between">
            <span className="w-full h-0.5 bg-primary rounded-full"></span>
            <span className="w-full h-0.5 bg-primary rounded-full"></span>
            <span className="w-full h-0.5 bg-primary rounded-full"></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="md:hidden fixed top-[88px] left-0 right-0 bg-background/95 backdrop-blur-lg border-b border-border"
        >
          <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-6">
            <motion.button 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              onClick={() => scrollToSection('hero')} 
              className="text-muted-foreground hover:text-primary transition-colors duration-300 font-normal text-left py-3 border-b border-border/50"
            >
              Inicio
            </motion.button>
            <motion.button 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              onClick={() => scrollToSection('services')} 
              className="text-muted-foreground hover:text-primary transition-colors duration-300 font-normal text-left py-3 border-b border-border/50"
            >
              Servicios
            </motion.button>
            <motion.button 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              onClick={() => scrollToSection('value')} 
              className="text-muted-foreground hover:text-primary transition-colors duration-300 font-normal text-left py-3 border-b border-border/50"
            >
              Por qué elegirnos
            </motion.button>
            <motion.button 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              onClick={() => scrollToSection('contact')} 
              className="group relative overflow-hidden px-6 py-3 rounded-full transition-all duration-300 hover:scale-[1.03] mt-4"
            >
              <span className="absolute inset-0 bg-primary group-hover:bg-primary/90 transition-colors duration-300"></span>
              <span className="relative z-10 text-primary-foreground font-semibold">Contacto</span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}