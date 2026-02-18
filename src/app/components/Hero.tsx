import { motion } from 'motion/react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    const offset = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

export function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      {/* Office background image */}
      <div className="absolute inset-0">
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1761123044903-1671e0edc3f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHNjcmVlbiUyMGNvZGUlMjBkZXZlbG9wbWVudHxlbnwxfHx8fDE3Njg4NDQ1Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Development workspace"
          className="w-full h-full object-cover grayscale opacity-[0.22]"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-col items-center"
        >
          <h1 className="text-5xl md:text-6xl font-semibold mb-1 text-foreground text-center" style={{ fontFamily: "'Playfair Display', serif" }} translate="no">
            Luca
          </h1>
          <p className="text-sm md:text-base font-semibold text-white tracking-[0.3em] uppercase text-center" translate="no">
            Studio
          </p>
        </motion.div>

        {/* Main title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-8 leading-tight"
        >
          Soluciones digitales <span className="text-primary">a medida</span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto font-normal"
        >
          Diseñamos y desarrollamos productos digitales, webs y automatizaciones pensadas para vender mejor y optimizar procesos.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <a href="https://wa.me/5491157529494" target="_blank" rel="noopener noreferrer" className="group relative overflow-hidden inline-block px-8 py-4 rounded-full transition-all duration-300 hover:scale-[1.03] cursor-pointer">
            <span className="absolute inset-0 bg-primary group-hover:bg-primary/90 transition-colors duration-300"></span>
            <span className="relative z-10 text-primary-foreground font-semibold">Charlemos</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}