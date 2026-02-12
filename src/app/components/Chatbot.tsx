import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Send } from 'lucide-react';

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([
    { text: 'Hola 👋\n¿Tenés una idea o proyecto digital?\n\nPodés contarnos por acá y dejar tus datos,\no escribirnos directo a lucastudio.ba@gmail.com', isUser: false }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', apellido: '', email: '' });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const newMessages = [...messages, { text: inputValue, isUser: true }];
    setMessages(newMessages);
    setInputValue('');

    // Simulate AI response after a short delay
    setTimeout(() => {
      const responses = [
        'Perfecto, gracias por escribir. ¿Querés dejar tus datos para que te contactemos, o preferís mandarnos un mail a lucastudio.ba@gmail.com?',
        'Dale, entendido. Si querés dejanos tu nombre, apellido y mail, o escribinos directo a lucastudio.ba@gmail.com',
        'Buenísimo. Podemos seguir hablando por acá, o si preferís, escribinos a lucastudio.ba@gmail.com',
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages([...newMessages, { text: randomResponse, isUser: false }]);
      
      // Show form option after first message
      if (messages.length === 1) {
        setTimeout(() => {
          setShowForm(true);
        }, 500);
      }
    }, 1000);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.apellido || !formData.email) return;

    setMessages([
      ...messages,
      { text: `Nombre: ${formData.nombre}\nApellido: ${formData.apellido}\nEmail: ${formData.email}`, isUser: true },
      { text: 'Listo, recibimos tus datos. Te escribimos pronto 🚀', isUser: false }
    ]);
    
    setShowForm(false);
    setFormData({ nombre: '', apellido: '', email: '' });
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-primary hover:bg-primary/90 rounded-full shadow-2xl shadow-primary/50 flex items-center justify-center group transition-all duration-300 hover:scale-110"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-5 h-5 text-background" />
            </motion.div>
          ) : (
            <motion.div
              key="sparkles"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <Sparkles className="w-5 h-5 text-background" />
              {/* Animated sparkle effect */}
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-background rounded-full animate-ping"></span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-28 right-8 z-50 w-96 h-[500px] bg-background/95 backdrop-blur-xl border-2 border-primary/30 rounded-2xl shadow-2xl shadow-primary/20 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/20 to-primary/10 p-4 border-b border-primary/30">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-background" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></span>
                </div>
                <div>
                  <h3 className="font-semibold">Asistente IA</h3>
                  <p className="text-xs text-muted-foreground" translate="no">Luca Studio</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.isUser
                        ? 'bg-primary text-background rounded-br-sm'
                        : 'bg-muted/50 text-foreground rounded-bl-sm border border-primary/20'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                  </div>
                </motion.div>
              ))}
              
              {/* Form card */}
              {showForm && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-start"
                >
                  <form onSubmit={handleFormSubmit} className="w-full bg-muted/30 border border-primary/20 p-4 rounded-2xl space-y-3">
                    <p className="text-sm text-muted-foreground mb-2">Dejanos tus datos:</p>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      placeholder="Nombre"
                      className="w-full bg-background/50 border border-primary/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                    />
                    <input
                      type="text"
                      value={formData.apellido}
                      onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                      placeholder="Apellido"
                      className="w-full bg-background/50 border border-primary/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                    />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Email"
                      className="w-full bg-background/50 border border-primary/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                    />
                    <button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90 rounded-lg px-4 py-2 text-sm text-background font-semibold transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!formData.nombre || !formData.apellido || !formData.email}
                    >
                      Enviar
                    </button>
                  </form>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-primary/30 bg-background/50">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 bg-muted/50 border border-primary/30 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                />
                <button
                  type="submit"
                  className="w-10 h-10 bg-primary hover:bg-primary/90 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!inputValue.trim()}
                >
                  <Send className="w-4 h-4 text-background" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}