import React, { useState } from 'react';
import { 
  Plus, 
  Receipt, 
  Trash2, 
  X, 
  Filter,
  PieChart
} from 'lucide-react';
import { 
  MobileContainer, 
  AnimatedContainer, 
  NeonCard, 
  GlowButton, 
  BlurCard
} from '../components/MobileUI';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'motion/react';

export const FinanceScreen: React.FC = () => {
  const { budget, expenses, addExpense, deleteExpense, setBudget } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<'Hotel' | 'Comida' | 'Voos' | 'Passeios' | 'Compras' | 'Outros'>('Outros');
  const [description, setDescription] = useState('');
  const [newBudget, setNewBudget] = useState(budget.toString());

  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const remaining = budget - totalSpent;
  const percentage = (totalSpent / budget) * 100;

  const handleAddExpense = () => {
    if (!title || !amount) return;
    
    addExpense({
      id: Math.random().toString(36).substr(2, 9),
      title,
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString().split('T')[0],
      description
    });

    setIsModalOpen(false);
    setTitle('');
    setAmount('');
    setCategory('Outros');
    setDescription('');
  };

  const handleUpdateBudget = () => {
    setBudget(parseFloat(newBudget));
    setIsBudgetModalOpen(false);
  };

  const categories = ['Hotel', 'Comida', 'Voos', 'Passeios', 'Compras', 'Outros'];

  return (
    <MobileContainer>
      <div className="flex items-center justify-between py-6">
        <h1 className="text-[26px] font-black text-white tracking-tight">Gastos</h1>
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsModalOpen(true)}
          className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-background neon-glow"
        >
          <Plus className="w-6 h-6" />
        </motion.button>
      </div>

      <div className="flex flex-col gap-6 pb-32">
        {/* Summary Card */}
        <AnimatedContainer delay={0.1}>
          <NeonCard className="bg-gradient-to-br from-card to-background">
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <PieChart className="w-5 h-5" />
                  </div>
                  <span className="text-[14px] font-bold text-white uppercase tracking-widest">Resumo</span>
                </div>
                <button 
                  onClick={() => setIsBudgetModalOpen(true)}
                  className="text-[11px] font-bold text-primary uppercase tracking-widest px-3 py-1 glass-card rounded-full border border-primary/20"
                >
                  Editar Orçamento
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-[11px] font-bold text-subtext uppercase tracking-widest">Total Gasto</p>
                  <p className="text-[20px] font-bold text-white">R$ {totalSpent.toLocaleString('pt-BR')}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-[11px] font-bold text-subtext uppercase tracking-widest">Restante</p>
                  <p className="text-[20px] font-bold text-primary">R$ {remaining.toLocaleString('pt-BR')}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-[11px] font-bold text-subtext uppercase tracking-widest">
                  <span>Progresso</span>
                  <span>{Math.round(percentage)}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(percentage, 100)}%` }}
                    className={`h-full ${percentage > 90 ? 'bg-red-500' : 'bg-primary'} neon-glow`}
                  />
                </div>
              </div>
            </div>
          </NeonCard>
        </AnimatedContainer>

        {/* Expense List */}
        <AnimatedContainer delay={0.2}>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center px-2">
              <h4 className="text-[18px] font-black text-white tracking-tight">Lista de Gastos</h4>
              <Filter className="w-5 h-5 text-subtext" />
            </div>
            <div className="flex flex-col gap-3">
              {expenses.length === 0 ? (
                <div className="glass-card p-8 rounded-[24px] text-center border border-dashed border-white/10">
                  <Receipt className="w-12 h-12 text-subtext mx-auto mb-3 opacity-20" />
                  <p className="text-subtext font-medium">Nenhum gasto registrado</p>
                </div>
              ) : (
                expenses.map((expense) => (
                  <motion.div
                    key={expense.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card p-4 rounded-[24px] flex items-center justify-between border border-white/5 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-subtext group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <Receipt className="w-6 h-6" />
                      </div>
                      <div>
                        <h5 className="text-[15px] font-bold text-white">{expense.title}</h5>
                        <p className="text-[12px] font-medium text-subtext">{expense.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-[16px] font-semibold text-white">
                        R$ {expense.amount.toLocaleString('pt-BR')}
                      </p>
                      <button 
                        onClick={() => deleteExpense(expense.id)}
                        className="p-2 text-red-500/50 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </AnimatedContainer>
      </div>

      {/* Register Expense Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 glass-card rounded-t-[40px] p-8 z-[70] border-t border-primary/20"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-[22px] font-black text-white tracking-tight">Registrar Gasto</h2>
                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 glass-card rounded-full flex items-center justify-center">
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-subtext uppercase tracking-widest px-2">Valor</label>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0,00"
                    className="w-full h-16 glass-card rounded-[20px] px-6 text-[22px] font-semibold text-white focus:border-primary/50 outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-subtext uppercase tracking-widest px-2">Título</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Jantar em Paris"
                    className="w-full h-16 glass-card rounded-[20px] px-6 text-[16px] font-medium text-white focus:border-primary/50 outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-subtext uppercase tracking-widest px-2">Categoria</label>
                  <div className="grid grid-cols-3 gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat as any)}
                        className={`h-12 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${
                          category === cat 
                            ? 'bg-primary text-background neon-glow' 
                            : 'glass-card text-subtext border-white/5'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <GlowButton onClick={handleAddExpense} className="mt-4">
                  Confirmar Gasto
                </GlowButton>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Edit Budget Modal */}
      <AnimatePresence>
        {isBudgetModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBudgetModalOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[360px] glass-card rounded-[32px] p-8 z-[70] border border-primary/20"
            >
              <h2 className="text-[20px] font-black text-white tracking-tight mb-6">Definir Orçamento</h2>
              <div className="flex flex-col gap-6">
                <input 
                  type="number" 
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  className="w-full h-16 glass-card rounded-[20px] px-6 text-[22px] font-semibold text-white text-center focus:border-primary/50 outline-none transition-all"
                />
                <div className="flex gap-3">
                  <button 
                    onClick={() => setIsBudgetModalOpen(false)}
                    className="flex-1 h-14 glass-card rounded-2xl text-[13px] font-bold text-white uppercase tracking-widest"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleUpdateBudget}
                    className="flex-1 h-14 bg-primary rounded-2xl text-[13px] font-bold text-background uppercase tracking-widest neon-glow"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </MobileContainer>
  );
};
