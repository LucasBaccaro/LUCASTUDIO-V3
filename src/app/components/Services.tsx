import { motion } from 'motion/react';
import { Code, Smartphone, Brain, MessageSquare } from 'lucide-react';
import { useInView } from './useInView';

const services = [
  {
    id: 'desarrollo-web',
    icon: Code,
    title: 'Webs estratégicas para negocios',
    description: 'Tu sitio web comunica quién sos y qué hacés. Creamos presencias digitales claras, rápidas y orientadas a resultados concretos.',
  },
  {
    id: 'aplicaciones',
    icon: Smartphone,
    title: 'Productos digitales a medida',
    description: 'Cada negocio tiene lógica propia. Construimos plataformas con arquitectura sólida que escalan sin improvisación ni parches.',
  },
  {
    id: 'inteligencia-artificial',
    icon: Brain,
    title: 'Automatización y optimización con IA',
    description: 'Lo repetitivo consume recursos. Implementamos inteligencia artificial que ejecuta tareas y libera tiempo para decisiones estratégicas.',
  },
  {
    id: 'chatbots',
    icon: MessageSquare,
    title: 'Chatbots para atención y ventas',
    description: 'Cada consulta sin respuesta es una venta perdida. Asistentes que resuelven dudas, califican leads y cierran conversaciones 24/7.',
  },
];

export function Services() {
  const [ref, isInView] = useInView({ threshold: 0.1 });

  return (
    <section ref={ref} id="services" className="py-32 px-6 relative">
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">
            Nuestros <span className="text-primary">servicios</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-normal">
            Soluciones integrales para acompañar el crecimiento digital de tu negocio.
          </p>
        </motion.div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                id={service.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative p-8 rounded-2xl border border-border bg-zinc-900/40 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:scale-[1.02]"
              >
                {/* Icon */}
                <div className="mb-6 inline-flex p-4 rounded-xl bg-primary/10 text-primary">
                  <Icon className="w-8 h-8" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-semibold mb-4">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed font-normal">
                  {service.description}
                </p>

                {/* Hover effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}