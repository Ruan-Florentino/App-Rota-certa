import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Compass, 
  Map, 
  Bell,
  Search
} from 'lucide-react';

interface QuickAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  route: string;
  color: string;
  badge?: number;
}

export function QuickActions() {
  const navigate = useNavigate();
  
  const actions: QuickAction[] = [
    {
      id: 'lens',
      icon: <Search size={22} />,
      label: 'Lente AI',
      route: '/lens',
      color: 'from-primary/20 to-primary/5'
    },
    {
      id: 'plan',
      icon: <Sparkles size={22} />,
      label: 'Novo Plano',
      route: '/plan',
      color: 'from-accent/20 to-accent/5'
    },
    {
      id: 'explore',
      icon: <Compass size={22} />,
      label: 'Explorar',
      route: '/explore',
      color: 'from-emerald-400/20 to-emerald-400/5'
    },
    {
      id: 'saved',
      icon: <Map size={22} />,
      label: 'Roteiros',
      route: '/saved',
      color: 'from-rose-400/20 to-rose-400/5'
    }
  ];
  
  return (
    <section className="px-6 mb-8">
      <header className="flex items-center justify-between mb-4">
        <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Quick Access</h3>
      </header>
      
      <div className="grid grid-cols-4 gap-3">
        {actions.map((action, i) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.05 }}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(action.route)}
            className="flex flex-col items-center gap-2 group relative"
          >
            <div className={`w-full aspect-square rounded-2xl bg-linear-to-br ${action.color} border border-white/5 flex items-center justify-center text-white/70 group-hover:text-white group-hover:border-white/10 transition-all duration-300 relative overflow-hidden`}>
              {/* Subtle background glow */}
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {action.icon}
              
              {action.badge && (
                <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-red-500 border border-white/20 flex items-center justify-center text-[8px] font-black text-white">
                  {action.badge}
                </div>
              )}
            </div>
            
            <span className="text-[10px] font-bold text-white/50 group-hover:text-white transition-colors uppercase tracking-wider text-center">
              {action.label}
            </span>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
