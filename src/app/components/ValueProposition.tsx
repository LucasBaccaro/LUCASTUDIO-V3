import { motion } from 'motion/react';
import { Zap, Target, Sparkles } from 'lucide-react';
import { useInView } from './useInView';

const values = [
  {
    icon: Zap,
    title: 'Eficiencia',
    description: 'Optimizamos cada proceso para entregar soluciones funcionales en tiempos ágiles, sin perder calidad.',
  },
  {
    icon: Target,
    title: 'Soluciones a medida',
    description: 'Cada proyecto es único. Diseñamos y desarrollamos soluciones alineadas a las necesidades reales de cada negocio.',
  },
  {
    icon: Sparkles,
    title: 'Tecnología aplicada al negocio',
    description: 'Utilizamos tecnologías actuales e inteligencia artificial como herramientas para generar impacto real, no solo tendencia.',
  },
];

export function ValueProposition() {
  const [ref, isInView] = useInView({ threshold: 0.1 });

  return (
    <section ref={ref} id="value" className="py-32 px-6 relative overflow-hidden">
      {/* Accent line */}
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>

      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">
            Por qué elegir <span className="text-primary" translate="no">Luca Studio</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-normal">
            Diseño, tecnología y estrategia combinados para crear productos digitales reales.
          </p>
        </motion.div>

        {/* Values grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="text-center group"
              >
                {/* Icon with animated border */}
                <div className="relative inline-flex mb-6">
                  <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl group-hover:bg-primary/30 transition-all duration-300"></div>
                  <div className="relative p-6 rounded-full border border-primary/30 bg-secondary/50 group-hover:border-primary group-hover:scale-110 transition-all duration-300">
                    <Icon className="w-10 h-10 text-primary" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-semibold mb-4">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed font-normal">
                  {value.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Stats or additional content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-24 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-primary/30 bg-primary/5">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <p className="text-muted-foreground font-normal">
              Diseñamos con mentalidad de negocio y desarrollamos con foco en resultados.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}