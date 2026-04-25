import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Wallet, Plus, Trash2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { Trip, Expense } from '../../../types';
import { useStore } from '../../../store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { db } from '../../../firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore';

interface ExpensesTabProps {
  currentTrip: Trip;
  isOwner: boolean;
  canEdit: boolean;
  handleSave: (tripToSave?: any) => Promise<void>;
  renderPrice: (amount: number) => React.ReactNode;
}

const EXPENSE_COLORS = ['#00E5FF', '#00FFA3', '#FFD700', '#FF4D4D', '#FF00FF'];

export const ExpensesTab: React.FC<ExpensesTabProps> = ({
  currentTrip,
  isOwner,
  canEdit,
  handleSave,
  renderPrice
}) => {
  const [expenses, setExpenses] = useState<Expense[]>(currentTrip.expenses || []);
  const user = useStore(useShallow((s) => s.user));

  useEffect(() => {
    if (!currentTrip.id || !user || !db) return;

    const expensesRef = collection(db, 'trips', currentTrip.id, 'expenses');
    const q = query(expensesRef, orderBy('date', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const expensesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Expense[];
      setExpenses(expensesData);
    });

    return () => unsubscribe();
  }, [currentTrip.id, user]);

  const expenseData = React.useMemo(() => {
    if (!expenses) return [];
    const categories: Record<string, number> = {};
    expenses.forEach(exp => {
      categories[exp.category] = (categories[exp.category] || 0) + exp.amount;
    });
    return Object.entries(categories).map(([name, value]) => ({
      name: name === 'food' ? 'Alimentação' :
            name === 'transport' ? 'Transporte' :
            name === 'activities' ? 'Atividades' :
            name === 'shopping' ? 'Compras' : 'Outros',
      value
    }));
  }, [currentTrip.expenses]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4"
    >
      <div className="glass-card p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[rgba(255,255,255,0.1)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.15)] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-full flex items-center justify-center text-primary">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white tracking-tight">Controle de Gastos</h4>
              <p className="text-[10px] font-semibold text-white/60 uppercase tracking-widest">Orçamento: R$ {currentTrip.budget.toLocaleString('pt-BR')}</p>
            </div>
          </div>
          {canEdit && (
            <button 
              onClick={async () => {
                if (!currentTrip.id || !user) return;
                const newExpense = {
                  date: new Date().toISOString().split('T')[0],
                  description: '',
                  amount: 0,
                  category: 'other' as const
                };
                const expensesRef = collection(db, 'trips', currentTrip.id, 'expenses');
                await addDoc(expensesRef, newExpense);
              }}
              className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs font-semibold mb-2">
            <span className="text-white/60">Gasto Total</span>
            <span className="text-white">
              R$ {(expenses?.reduce((acc, exp) => acc + exp.amount, 0) || 0).toLocaleString('pt-BR')} / R$ {currentTrip.budget.toLocaleString('pt-BR')}
            </span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${(expenses?.reduce((acc, exp) => acc + exp.amount, 0) || 0) > currentTrip.budget ? 'bg-red-500' : 'bg-primary'}`}
              style={{ width: `${Math.min(((expenses?.reduce((acc, exp) => acc + exp.amount, 0) || 0) / currentTrip.budget) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {expenseData.length > 0 && (
        <div className="glass-card p-6 mb-4 flex flex-col items-center">
          <h4 className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-4 w-full text-left">Gastos por Categoria</h4>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR')}`}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {expenseData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: EXPENSE_COLORS[index % EXPENSE_COLORS.length] }} />
                <span className="text-[10px] font-semibold text-white/80 uppercase tracking-widest">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {expenses && expenses.length > 0 ? (
        <div className="space-y-3">
          {expenses.map((expense, idx) => (
            <div key={expense.id} className="glass-card p-4 relative group">
              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <input 
                    type="date"
                    value={expense.date}
                    disabled={!isOwner}
                    onChange={async (e) => {
                      if (!currentTrip.id || !user || !expense.id) return;
                      const expenseRef = doc(db, 'trips', currentTrip.id, 'expenses', expense.id);
                      await updateDoc(expenseRef, { date: e.target.value });
                    }}
                    className="bg-transparent text-white/60 text-xs focus:outline-none disabled:opacity-100"
                  />
                  <select
                    value={expense.category}
                    disabled={!isOwner}
                    onChange={async (e) => {
                      if (!currentTrip.id || !user || !expense.id) return;
                      const expenseRef = doc(db, 'trips', currentTrip.id, 'expenses', expense.id);
                      await updateDoc(expenseRef, { category: e.target.value as any });
                    }}
                    className="bg-transparent text-primary text-xs font-semibold focus:outline-none uppercase tracking-widest disabled:opacity-100"
                  >
                    <option value="food" className="bg-slate-900">Alimentação</option>
                    <option value="transport" className="bg-slate-900">Transporte</option>
                    <option value="activities" className="bg-slate-900">Atividades</option>
                    <option value="shopping" className="bg-slate-900">Compras</option>
                    <option value="other" className="bg-slate-900">Outros</option>
                  </select>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <input
                    type="text"
                    value={expense.description}
                    disabled={!isOwner}
                    onChange={async (e) => {
                      if (!currentTrip.id || !user || !expense.id) return;
                      const expenseRef = doc(db, 'trips', currentTrip.id, 'expenses', expense.id);
                      await updateDoc(expenseRef, { description: e.target.value });
                    }}
                    placeholder="Descrição do gasto"
                    className="flex-1 bg-transparent text-white font-semibold focus:outline-none disabled:opacity-100"
                  />
                  <div className="flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                    <span className="text-white/60 text-sm">R$</span>
                    <input
                      type="number"
                      value={expense.amount || ''}
                      disabled={!isOwner}
                      onChange={async (e) => {
                        if (!currentTrip.id || !user || !expense.id) return;
                        const expenseRef = doc(db, 'trips', currentTrip.id, 'expenses', expense.id);
                        await updateDoc(expenseRef, { amount: Number(e.target.value) });
                      }}
                      placeholder="0,00"
                      className="w-20 bg-transparent text-white font-bold text-right focus:outline-none disabled:opacity-100"
                    />
                  </div>
                </div>
              </div>
              {isOwner && (
                <button 
                  onClick={async () => {
                    if (!currentTrip.id || !user || !expense.id) return;
                    const expenseRef = doc(db, 'trips', currentTrip.id, 'expenses', expense.id);
                    await deleteDoc(expenseRef);
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-8 text-center flex flex-col items-center gap-4">
          <Wallet className="w-12 h-12 text-white/20" />
          <p className="text-white/60 text-sm">Nenhum gasto registrado. Clique no + para adicionar!</p>
        </div>
      )}
    </motion.div>
  );
};
