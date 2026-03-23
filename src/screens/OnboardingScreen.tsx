import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Sparkles, Map, Wallet, ArrowRight } from 'lucide-react';
import { Logo } from '../components/Logo';

const steps = [
  {
    title: "Explore o mundo sem limites",
    description: "Descubra destinos incríveis e planeje sua próxima grande aventura em segundos.",
    image: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=1200&q=80",
    icon: <Sparkles className="w-8 h-8 text-primary" />
  },
  {
    title: "Roteiros inteligentes",
    description: "Nossa tecnologia organiza cada detalhe do seu dia para você focar apenas em aproveitar.",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80",
    icon: <Map className="w-8 h-8 text-secondary" />
  },
  {
    title: "Viagens que cabem no bolso",
    description: "Controle seus gastos em tempo real e tenha uma estimativa precisa em Reais.",
    image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1200&q=80",
    icon: <Wallet className="w-8 h-8 text-accent" />
  }
];

export const OnboardingScreen: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const [currentStep, setCurrentStep] = React.useState(0);

  const next = () => {
    if (currentStep === steps.length - 1) {
      onFinish();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-background flex flex-col overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 8, ease: "linear" }}
            src={steps[currentStep].image} 
            alt={steps[currentStep].title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </motion.div>
      </AnimatePresence>
      
      <div className="relative z-10 flex-1 flex flex-col justify-end p-10 pb-16">
        <motion.div
          key={`content-${currentStep}`}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="max-w-md"
        >
          <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center mb-8 border border-white/10 shadow-2xl">
            {steps[currentStep].icon}
          </div>
          
          <h2 className="text-5xl font-black text-white tracking-tighter mb-6 leading-[0.9]">
            {steps[currentStep].title}
          </h2>
          
          <p className="text-subtext text-xl font-medium mb-12 leading-relaxed opacity-80">
            {steps[currentStep].description}
          </p>
          
          <div className="flex items-center justify-between gap-8">
            <div className="flex gap-2">
              {steps.map((_, i) => (
                <motion.div 
                  key={i}
                  animate={{ 
                    width: i === currentStep ? 32 : 8,
                    backgroundColor: i === currentStep ? '#2563EB' : 'rgba(255,255,255,0.2)'
                  }}
                  className="h-2 rounded-full transition-all duration-500"
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={next}
              className="px-8 py-5 bg-white text-background rounded-[24px] font-black text-sm uppercase tracking-[0.2em] flex items-center gap-3 shadow-2xl hover:bg-primary hover:text-white transition-all duration-300"
            >
              {currentStep === steps.length - 1 ? 'Começar' : 'Próximo'}
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Logo */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute top-12 left-10 z-20"
      >
        <Logo size="sm" />
      </motion.div>

      {/* Skip Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={onFinish}
        className="absolute top-12 right-10 text-white/50 font-black uppercase tracking-[0.2em] text-[10px] hover:text-white transition-colors"
      >
        Pular
      </motion.button>
    </div>
  );
};
