import React from 'react';
import { motion } from 'motion/react';
import { Compass, Bookmark, Map, User, ChevronRight, Sparkles, Plane, Globe, LayoutGrid } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';

export const StartMenu: React.FC = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: 'Planejar viagem',
      description: 'Crie um roteiro personalizado em segundos',
      icon: <Plane className="w-8 h-8 text-primary" />,
      path: '/plan',
      color: 'bg-primary/10',
      glow: 'shadow-primary/20'
    },
    {
      title: 'Minhas viagens',
      description: 'Acesse seus roteiros salvos e favoritos',
      icon: <Bookmark className="w-8 h-8 text-secondary" />,
      path: '/saved',
      color: 'bg-secondary/10',
      glow: 'shadow-secondary/20'
    },
    {
      title: 'Explorar destinos',
      description: 'Descubra os lugares mais amados do mundo',
      icon: <Globe className="w-8 h-8 text-accent" />,
      path: '/explore',
      color: 'bg-accent/10',
      glow: 'shadow-accent/20'
    }
  ];

  return (
    <div className="flex-1 p-8 flex flex-col justify-center max-w-2xl mx-auto w-full bg-background min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <Logo size="md" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-16"
      >
        <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-[0.3em] text-[10px] mb-4">
          <Sparkles className="w-4 h-4" />
          <span>Bem-vindo ao RotaCerta</span>
        </div>
        <h1 className="text-6xl font-black text-white tracking-tighter mb-6 leading-[0.9]">
          Para onde <br />vamos?
        </h1>
        <p className="text-subtext text-xl font-medium max-w-sm leading-relaxed">
          Sua próxima grande aventura começa com uma escolha simples.
        </p>
      </motion.div>

      <div className="space-y-6">
        {menuItems.map((item, idx) => (
          <motion.button
            key={item.title}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 + 0.5, duration: 0.6 }}
            whileHover={{ scale: 1.02, x: 10 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(item.path)}
            className={`w-full glass-card p-8 rounded-[40px] flex items-center gap-8 group hover:border-white/20 transition-all text-left ios-shadow relative overflow-hidden shadow-2xl ${item.glow}`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className={`w-20 h-20 ${item.color} rounded-3xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
              {item.icon}
            </div>
            
            <div className="flex-1 relative z-10">
              <h3 className="text-2xl font-black text-white mb-1 tracking-tight">{item.title}</h3>
              <p className="text-sm font-medium text-subtext leading-relaxed">{item.description}</p>
            </div>
            
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <ChevronRight className="w-6 h-6 text-subtext group-hover:text-white" />
            </div>
          </motion.button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-20 flex items-center justify-between p-6 glass-card rounded-[32px] border-white/5"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-[10px] font-black text-subtext uppercase tracking-widest">Viajante</p>
            <p className="text-sm font-bold text-white">Linda Flor</p>
          </div>
        </div>
        <button className="p-3 hover:bg-white/10 rounded-2xl transition-colors text-subtext hover:text-white">
          <LayoutGrid className="w-5 h-5" />
        </button>
      </motion.div>
    </div>
  );
};
