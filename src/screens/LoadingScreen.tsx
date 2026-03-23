import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plane, Globe, Map, Sparkles, Compass } from 'lucide-react';

const messages = [
  "Buscando as melhores rotas...",
  "Encontrando hotéis incríveis...",
  "Organizando seus passeios...",
  "Calculando o melhor orçamento...",
  "Finalizando seu roteiro personalizado..."
];

export const LoadingScreen: React.FC = () => {
  const [progress, setProgress] = React.useState(0);
  const [messageIndex, setMessageIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev < 98 ? prev + Math.random() * 5 : prev));
    }, 400);

    const messageInterval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % messages.length);
    }, 2500);

    return () => {
      clearInterval(interval);
      clearInterval(messageInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-[200] p-12 overflow-hidden">
      {/* Background Elements */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
          rotate: [0, -90, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px]"
      />

      <div className="relative flex flex-col items-center w-full max-w-md">
        {/* Animated Icon Container */}
        <motion.div
          animate={{ 
            y: [0, -15, 0],
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative mb-16"
        >
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="w-32 h-32 glass-card rounded-[40px] flex items-center justify-center shadow-2xl border-white/10 relative z-10">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Plane className="w-16 h-16 text-primary" />
            </motion.div>
          </div>
          
          {/* Orbiting Sparkles */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ rotate: 360 }}
              transition={{ duration: 5 + i, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-10 pointer-events-none"
            >
              <Sparkles 
                className="w-4 h-4 text-accent absolute" 
                style={{ 
                  top: i * 30 + '%', 
                  left: i * 20 + '%',
                  opacity: 0.6
                }} 
              />
            </motion.div>
          ))}
        </motion.div>
        
        {/* Progress Text */}
        <div className="text-center mb-12 h-20 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={messageIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-3"
            >
              <h2 className="text-3xl font-black text-white tracking-tighter">
                {messages[messageIndex]}
              </h2>
              <p className="text-primary font-black uppercase tracking-[0.4em] text-[10px]">
                Quase lá... {Math.round(progress)}%
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Premium Progress Bar */}
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden shadow-inner relative">
          <motion.div 
            className="h-full bg-gradient-to-r from-primary via-blue-400 to-primary bg-[length:200%_100%] origin-left relative z-10"
            initial={{ width: 0 }}
            animate={{ 
              width: `${progress}%`,
              backgroundPosition: ["0% 0%", "200% 0%"]
            }}
            transition={{ 
              width: { duration: 0.5 },
              backgroundPosition: { duration: 2, repeat: Infinity, ease: "linear" }
            }}
          />
          <div className="absolute inset-0 bg-primary/10 blur-sm" />
        </div>

        {/* Bottom Icons */}
        <div className="mt-16 flex items-center gap-8 opacity-30">
          <Globe className="w-6 h-6 text-white" />
          <Map className="w-6 h-6 text-white" />
          <Compass className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};
