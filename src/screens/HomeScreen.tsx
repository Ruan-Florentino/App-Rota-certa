import React from 'react';
import { 
  Bell, Plus, Receipt, Plane, Map, Globe, 
  ArrowRight, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore';
import { MobileContainer, AnimatedContainer, NeonCard, GlowButton } from '../components/MobileUI';
import { Logo } from '../components/Logo';

export const HomeScreen: React.FC = () => {
  const { user, budget, expenses } = useStore();
  const navigate = useNavigate();

  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const remaining = budget - totalSpent;
  const percentage = (totalSpent / budget) * 100;

  return (
    <MobileContainer>
      {/* 1. HEADER */}
      <div className="flex items-center justify-between py-8">
        <div className="flex items-center gap-4">
          <Logo size="sm" showText={false} />
          <h1 className="text-[20px] font-bold text-white tracking-tight">
            Olá, {user?.displayName?.split(' ')[0] || 'Viajante'}
          </h1>
        </div>
        <motion.button 
          whileTap={{ scale: 0.9 }}
          className="w-12 h-12 glass-card rounded-full flex items-center justify-center relative border border-white/10 hover:border-primary/30 transition-all"
        >
          <Bell className="w-6 h-6 text-white" />
          <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-primary rounded-full shadow-[0_0_8px_rgba(0,229,255,0.8)]" />
        </motion.button>
      </div>

      <div className="flex flex-col gap-10 pb-32">
        
        {/* 2. CARD PRINCIPAL (ORÇAMENTO) */}
        <AnimatedContainer delay={0.1}>
          <NeonCard className="p-8 bg-gradient-to-br from-card via-card to-primary/10 rounded-[32px]">
            <div className="flex flex-col gap-8">
              <div>
                <p className="text-[16px] font-medium text-subtext mb-2">Orçamento Total</p>
                <h2 className="text-[44px] font-black text-white tracking-tighter neon-text">
                  R$ {budget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </h2>
              </div>
              
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-end">
                  <p className="text-[16px] font-medium text-subtext">Restante</p>
                  <p className="text-[24px] font-bold text-primary">
                    R$ {remaining.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(percentage, 100)}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={`absolute top-0 left-0 h-full ${percentage > 90 ? 'bg-red-500' : 'bg-primary'}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-2">
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/expenses')}
                  className="glass-card py-4 rounded-2xl flex items-center justify-center gap-3 border border-white/5 hover:border-primary/30 transition-all"
                >
                  <Plus className="w-5 h-5 text-primary" />
                  <span className="text-[15px] font-bold text-white">Adicionar</span>
                </motion.button>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/expenses')}
                  className="glass-card py-4 rounded-2xl flex items-center justify-center gap-3 border border-white/5 hover:border-accent/30 transition-all"
                >
                  <Receipt className="w-5 h-5 text-accent" />
                  <span className="text-[15px] font-bold text-white">Gasto</span>
                </motion.button>
              </div>
              
              <GlowButton onClick={() => navigate('/plan')} className="h-16 rounded-2xl mt-2">
                <div className="flex items-center gap-3">
                  <Plane className="w-6 h-6" />
                  <span className="text-[18px] font-bold">Planejar Viagem</span>
                </div>
              </GlowButton>
            </div>
          </NeonCard>
        </AnimatedContainer>

        {/* 3. SUGESTÕES INTELIGENTES */}
        <AnimatedContainer delay={0.2}>
          <div className="glass-card p-8 rounded-[32px] border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            
            <h3 className="text-[22px] font-bold text-white mb-2 tracking-tight">Sugestões Inteligentes</h3>
            <p className="text-[16px] text-subtext mb-8">Com seu orçamento você pode viajar para:</p>
            
            <div className="flex flex-col gap-4 mb-8">
              {[
                { city: 'Buenos Aires', days: 3 },
                { city: 'Santiago', days: 4 },
                { city: 'Rio de Janeiro', days: 5 }
              ].map((dest, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white/5 p-5 rounded-2xl border border-white/5">
                  <span className="text-[18px] font-bold text-white">{dest.city}</span>
                  <span className="text-[16px] font-medium text-primary">{dest.days} dias</span>
                </div>
              ))}
            </div>

            <motion.button 
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/plan')} 
              className="w-full h-16 bg-white/10 hover:bg-white/20 text-white font-bold text-[16px] rounded-2xl transition-all flex items-center justify-center gap-3"
            >
              Gerar roteiro <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </AnimatedContainer>

        {/* 4. AÇÕES RÁPIDAS (Grid 2x2) */}
        <AnimatedContainer delay={0.3}>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Plane, label: 'Planejar viagem', route: '/plan', color: 'text-primary', bg: 'bg-primary/10' },
              { icon: Globe, label: 'Explorar destinos', route: '/suggestions', color: 'text-accent', bg: 'bg-accent/10' },
              { icon: Map, label: 'Ver mapa', route: '/map', color: 'text-green-500', bg: 'bg-green-500/10' },
              { icon: Plane, label: 'Buscar voos', route: '/flights', color: 'text-blue-500', bg: 'bg-blue-500/10' },
            ].map((action, idx) => (
              <motion.button 
                key={idx}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(action.route)}
                className="glass-card p-6 rounded-[24px] flex flex-col items-center justify-center gap-4 border border-white/5 hover:border-white/20 transition-all"
              >
                <div className={`w-14 h-14 rounded-2xl ${action.bg} flex items-center justify-center`}>
                  <action.icon className={`w-7 h-7 ${action.color}`} />
                </div>
                <span className="text-[15px] font-bold text-white text-center">{action.label}</span>
              </motion.button>
            ))}
          </div>
        </AnimatedContainer>

        {/* 5. GASTOS RECENTES */}
        <AnimatedContainer delay={0.4}>
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-[22px] font-bold text-white tracking-tight">Gastos Recentes</h3>
              <button 
                onClick={() => navigate('/expenses')} 
                className="text-[15px] font-medium text-primary flex items-center gap-1"
              >
                Ver Tudo <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              {expenses.length === 0 ? (
                <div className="glass-card p-8 rounded-2xl text-center border border-dashed border-white/10">
                  <p className="text-[15px] text-subtext font-medium">Nenhum gasto registrado</p>
                </div>
              ) : (
                expenses.slice(0, 3).map((expense) => (
                  <motion.div
                    key={expense.id}
                    whileTap={{ scale: 0.98 }}
                    className="glass-card p-5 rounded-[24px] flex items-center justify-between border border-white/5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                        <Receipt className="w-6 h-6 text-subtext" />
                      </div>
                      <div>
                        <h5 className="text-[16px] font-bold text-white">{expense.title}</h5>
                        <p className="text-[14px] font-medium text-subtext">{expense.category}</p>
                      </div>
                    </div>
                    <p className="text-[16px] font-bold text-white">
                      R$ {expense.amount.toLocaleString('pt-BR')}
                    </p>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </AnimatedContainer>

      </div>
    </MobileContainer>
  );
};
