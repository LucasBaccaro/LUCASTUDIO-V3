import { motion } from 'motion/react';
import { Mail } from 'lucide-react';
import { useInView } from './useInView';

export function CTASection() {
  const [ref, isInView] = useInView({ threshold: 0.1 });

  // Generate grid lines programmatically for Figma export compatibility
  const gridSize = 40;
  const gridLines = [];

  // Grid dimensions - full width, multiple rows
  const numCols = 50; // More columns to cover full width
  const numRows = 9; // Adjusted to match reference - shorter grid
  const gridWidth = numCols * gridSize; // 2000px width
  const gridHeight = numRows * gridSize; // 360px height

  // Vertical lines - stop exactly at the last horizontal line
  for (let i = 0; i <= numCols; i++) {
    gridLines.push(
      <line
        key={`v-${i}`}
        x1={i * gridSize}
        y1="0"
        x2={i * gridSize}
        y2={gridHeight}
        stroke="#c4ff0d"
        strokeWidth="1"
        opacity="0.15"
      />
    );
  }

  // Horizontal lines
  for (let i = 0; i <= numRows; i++) {
    gridLines.push(
      <line
        key={`h-${i}`}
        x1="0"
        y1={i * gridSize}
        x2={gridWidth}
        y2={i * gridSize}
        stroke="#c4ff0d"
        strokeWidth={i === numRows ? "2" : "1"}
        opacity="0.15"
      />
    );
  }

  return (
    <section
      ref={ref}
      className="px-6 relative overflow-hidden bg-black py-20"
    >
      {/* Grid background with explicit lines for Figma export - centered */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg
          width={gridWidth}
          height={gridHeight}
          xmlns="http://www.w3.org/2000/svg"
          className="max-w-none"
        >
          {gridLines}
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-4xl mx-auto text-center pt-10"
      >
        {/* Main heading */}
        <h2 className="text-3xl md:text-4xl font-semibold mb-8 leading-[1.4]">
          ¿Listo para transformar tu proyecto en un <span className="text-primary">producto digital real?</span>
        </h2>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto font-normal">
          Contanos tu idea y veamos juntos cómo llevarla a la acción.
        </p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center items-center"
        >
          <a
            href="https://wa.me/5491157529494?text=Hola%20%F0%9F%91%8B%20Vengo%20desde%20la%20web%20y%20quiero%20m%C3%A1s%20info%20sobre%20sus%20servicios%20y%20automatizaciones%20para%20mi%20negocio."
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden inline-flex items-center gap-3 px-8 py-4 rounded-full transition-all duration-300 shadow-lg shadow-primary/20 hover:scale-[1.03]"
          >
            <span className="absolute inset-0 bg-primary group-hover:bg-primary/90 transition-colors duration-300"></span>
            <span className="relative z-10 text-primary-foreground font-semibold">Contactanos</span>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}