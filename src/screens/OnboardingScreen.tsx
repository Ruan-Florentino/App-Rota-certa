import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Sparkles, Map, Wallet, ArrowRight, User, Compass, DollarSign } from 'lucide-react';
import { Logo } from '../components/Logo';
import { Globe3D } from '../components/Globe3D';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useStore } from '../store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const steps = [
  {
    title: "Explore o mundo sem limites",
    description: "Descubra destinos incríveis e planeje sua próxima grande aventura em segundos.",
    type: "globe"
  },
  {
    title: "Planejamento com IA",
    description: "Nossa inteligência artificial cria roteiros personalizados baseados no seu perfil.",
    type: "chat"
  },
  {
    title: "Controle Financeiro",
    description: "Acompanhe seus gastos e mantenha-se dentro do orçamento.",
    type: "chart"
  },
  {
    title: "Seu Perfil",
    description: "Conte-nos como você gosta de viajar.",
    type: "form"
  }
];

export const OnboardingScreen: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { user, setUser } = useStore(
    useShallow((s) => ({
      user: s.user,
      setUser: s.setUser
    }))
  );
  
  const [name, setName] = useState(user?.displayName || '');
  const [style, setStyle] = useState('Aventureiro');
  const [budget, setBudget] = useState('5000');

  const next = async () => {
    if (currentStep === steps.length - 1) {
      if (user) {
        const updatedUser = {
          ...user,
          displayName: name,
          travelStyle: style,
          defaultBudget: parseInt(budget) || 5000
        };
        setUser(updatedUser);
        try {
          await setDoc(doc(db, 'users', user.uid), updatedUser, { merge: true });
        } catch (error) {
          console.error("Error saving onboarding profile:", error);
        }
      }
      onFinish();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const renderVisual = () => {
    switch (steps[currentStep].type) {
      case 'globe':
        return (
          <div className="w-full h-[40vh] relative -mt-10">
            <Globe3D hideSearch hideControls hideInfoCard />
          </div>
        );
      case 'chat':
        return (
          <div className="w-full h-[40vh] flex flex-col justify-center items-center gap-4 px-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="bg-white/10 p-4 rounded-2xl rounded-tr-none self-end max-w-[80%] border border-white/5"
            >
              <p className="text-sm text-white">Crie um roteiro de 5 dias em Paris para um casal.</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2 }}
              className="bg-primary/20 p-4 rounded-2xl rounded-tl-none self-start max-w-[80%] border border-primary/30"
            >
              <p className="text-sm text-white">Claro! Aqui está um roteiro romântico em Paris...</p>
              <div className="mt-2 flex gap-2">
                <div className="w-12 h-12 bg-white/10 rounded-lg" />
                <div className="w-12 h-12 bg-white/10 rounded-lg" />
              </div>
            </motion.div>
          </div>
        );
      case 'chart':
        const data = [
          { name: 'Hospedagem', value: 400 },
          { name: 'Alimentação', value: 300 },
          { name: 'Transporte', value: 150 },
          { name: 'Lazer', value: 200 },
        ];
        const COLORS = ['#00E5FF', '#F59E0B', '#EC4899', '#8B5CF6'];
        return (
          <div className="w-full h-[40vh] flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  animationBegin={200}
                  animationDuration={1500}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
      case 'form':
        return (
          <div className="w-full h-[40vh] flex flex-col justify-center gap-4 px-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/60 uppercase tracking-widest flex items-center gap-2"><User className="w-4 h-4"/> Nome</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50"
                placeholder="Como quer ser chamado?"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/60 uppercase tracking-widest flex items-center gap-2"><Compass className="w-4 h-4"/> Estilo de Viagem</label>
              <select 
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50"
              >
                <option value="Aventureiro">Aventureiro</option>
                <option value="Luxo">Luxo</option>
                <option value="Econômico">Econômico</option>
                <option value="Família">Família</option>
                <option value="Romântico">Romântico</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/60 uppercase tracking-widest flex items-center gap-2"><DollarSign className="w-4 h-4"/> Orçamento Padrão (R$)</label>
              <input 
                type="number" 
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50"
                placeholder="Ex: 5000"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-[#020617] flex flex-col overflow-hidden">
      <div className="flex-1 relative flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            {renderVisual()}
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="relative z-10 flex flex-col justify-end p-10 pb-16 bg-gradient-to-t from-[#020617] via-[#020617]/80 to-transparent">
        <motion.div
          key={`content-${currentStep}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="max-w-md"
        >
          <h2 className="text-4xl font-black text-white tracking-tighter mb-4 leading-tight">
            {steps[currentStep].title}
          </h2>
          
          <p className="text-white/60 text-lg font-medium mb-10 leading-relaxed">
            {steps[currentStep].description}
          </p>
          
          <div className="flex items-center justify-between gap-8">
            <div className="flex gap-2">
              {steps.map((_, i) => (
                <motion.div 
                  key={i}
                  animate={{ 
                    width: i === currentStep ? 32 : 8,
                    backgroundColor: i === currentStep ? '#00E5FF' : 'rgba(255,255,255,0.2)'
                  }}
                  className="h-2 rounded-full transition-all duration-500"
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={next}
              className="px-8 py-4 bg-primary text-black rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:bg-white transition-all duration-300"
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
      {currentStep < steps.length - 1 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={() => setCurrentStep(steps.length - 1)}
          className="absolute top-12 right-10 text-white/50 font-black uppercase tracking-[0.2em] text-[10px] hover:text-white transition-colors z-20"
        >
          Pular
        </motion.button>
      )}
    </div>
  );
};
