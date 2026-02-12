import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X } from 'lucide-react';
import { ChatKit, useChatKit } from '@openai/chatkit-react';
import { getChatKitSessionToken } from '../../lib/chatkit';
import '../../styles/chatkit-custom.css';

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);

  // Initialize ChatKit outside of the component so it persists across open/close
  const { control } = useChatKit({
    api: {
      async getClientSecret(existing) {
        // If we have an existing session, reuse it
        if (existing) {
          console.log('Reusing existing ChatKit session');
          return existing;
        }

        // Create a new session only if none exists
        console.log('Creating new ChatKit session');
        return await getChatKitSessionToken();
      },
    },
    // Header customization
    header: {
      enabled: false, // Hide the entire header with conversation title
    },
    // Theme configuration to match Luca Studio design
    theme: {
      colorScheme: 'dark',
      density: 'spacious',
      radius: 'round',
      color: {
        accent: {
          primary: '#c4ff0d', // Luca Studio primary color
          level: 1,
        },
        surface: {
          background: '#000000', // Black background
          foreground: '#1a1a1a', // Dark foreground
        },
        grayscale: {
          hue: 70, // Yellow-green hue to match primary
          tint: 6,
          shade: -1,
        },
      },
      typography: {
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      },
    },
    // Hide feedback and action buttons
    threadItemActions: {
      feedback: false, // Hide like/dislike buttons
      retry: false, // Hide retry button
    },
    // Composer settings
    composer: {
      placeholder: 'Escribe tu mensaje...',
    },
    // Start screen
    startScreen: {
      greeting: 'Hola 👋 ¿Tenés una idea o proyecto digital?',
    },
  });

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

      {/* Chat Window with ChatKit - Always mounted for persistence */}
      <motion.div
        initial={false}
        animate={isOpen ? { opacity: 1, y: 0, scale: 1, pointerEvents: 'auto' } : { opacity: 0, y: 20, scale: 0.95, pointerEvents: 'none' }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-28 right-8 z-50 w-96 h-[600px] bg-background/95 backdrop-blur-xl border-2 border-primary/30 rounded-2xl shadow-2xl shadow-primary/20 overflow-hidden"
        style={{ display: isOpen ? 'flex' : 'none', flexDirection: 'column' }}
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

        {/* ChatKit Container */}
        <div className="h-[calc(100%-80px)]">
          <ChatKit control={control} className="w-full h-full" />
        </div>
      </motion.div>
    </>
  );
}
