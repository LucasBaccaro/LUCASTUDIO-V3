import { motion } from 'motion/react';
import { Mail, Linkedin, Instagram, Twitter } from 'lucide-react';

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

export function Footer() {
  return (
    <footer id="contact" className="relative">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="mb-4 inline-flex flex-col items-center">
              <span className="text-3xl font-semibold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }} translate="no">Luca</span>
              <span className="text-[8px] font-semibold text-white tracking-[0.3em] uppercase" translate="no">Studio</span>
            </div>
            <p className="text-muted-foreground mb-6 font-normal">
              Soluciones digitales a medida para impulsar tu negocio al siguiente nivel.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.linkedin.com/in/luca-studio"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg border border-primary/30 text-primary hover:border-primary hover:bg-primary/10 transition-all duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/lucastudio.ba"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg border border-primary/30 text-primary hover:border-primary hover:bg-primary/10 transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Servicios</h3>
            <ul className="space-y-3">
              <li>
                <button onClick={() => scrollToSection('desarrollo-web')} className="text-muted-foreground hover:text-primary transition-colors duration-300 font-normal cursor-pointer">
                  Desarrollo Web
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('aplicaciones')} className="text-muted-foreground hover:text-primary transition-colors duration-300 font-normal cursor-pointer">
                  Aplicaciones
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('inteligencia-artificial')} className="text-muted-foreground hover:text-primary transition-colors duration-300 font-normal cursor-pointer">
                  Inteligencia Artificial
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('chatbots')} className="text-muted-foreground hover:text-primary transition-colors duration-300 font-normal cursor-pointer">
                  Chatbots
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-muted-foreground font-normal">
                <Mail className="w-4 h-4 text-primary" />
                <a href="mailto:lucastudio.ba@gmail.com" className="hover:text-primary transition-colors duration-300">
                  lucastudio.ba@gmail.com
                </a>
              </li>
              <li className="text-muted-foreground font-normal">
                Buenos Aires, Argentina
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm font-normal">
            © 2024 <span translate="no">Luca Studio</span>. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300 font-normal">
              Privacidad
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300 font-normal">
              Términos
            </a>
          </div>
        </div>
      </div>

      {/* Accent line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
    </footer>
  );
}