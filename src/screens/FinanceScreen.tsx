import { toast } from 'sonner';
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, 
  Receipt, 
  Trash2, 
  X, 
  Filter,
  PieChart as PieChartIcon,
  Camera,
  Sparkles
} from 'lucide-react';
import { 
  MobileContainer, 
  AnimatedContainer, 
  NeonCard, 
  GlowButton, 
  BlurCard
} from '../components/MobileUI';
import { useStore } from '../store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { getCurrencyRates, convertCurrency, CurrencyRates } from '../services/currencyService';
import { formatCurrency } from '../utils';
import { motion, AnimatePresence } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { trackEvent } from '../services/analyticsService';
import axios from 'axios';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { Expense } from '../types';

const categories = ['Hotel', 'Comida', 'Voos', 'Passeios', 'Compras', 'Outros'] as const;
type Category = typeof categories[number];

const categoryColors: Record<Category, string> = {
  Hotel: '#00F5FF',
  Comida: '#FF3366',
  Voos: '#9D4EDD',
  Passeios: '#FFD700',
  Compras: '#00E676',
  Outros: '#8A92A6'
};

export const FinanceScreen: React.FC = () => {
  const { budget, setBudget, currentTrip, user } = useStore(
    useShallow((s) => ({
      budget: s.budget,
      setBudget: s.setBudget,
      currentTrip: s.currentTrip,
      user: s.user
    }))
  );
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [rates, setRates] = React.useState<CurrencyRates | null>(null);

  useEffect(() => {
    getCurrencyRates('BRL').then(setRates);
  }, []);

  useEffect(() => {
    if (!user || !currentTrip?.id || !db) return;

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
  }, [user, currentTrip?.id]);

  const renderPrice = (amount: number) => {
    if (!rates || !currentTrip?.info?.currency || currentTrip.info.currency === 'BRL') {
      return formatCurrency(amount);
    }
    const localAmount = convertCurrency(amount, 'BRL', currentTrip.info.currency, rates);
    return `${formatCurrency(amount)} (${currentTrip.info.currency} ${localAmount.toFixed(2)})`;
  };
  
  // Form State
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<'Hotel' | 'Comida' | 'Voos' | 'Passeios' | 'Compras' | 'Outros'>('Outros');
  const [description, setDescription] = useState('');
  const [newBudget, setNewBudget] = useState(budget.toString());

  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const remaining = budget - totalSpent;
  const percentage = (totalSpent / budget) * 100;
  
  // Calculate daily average
  const dailyAverage = useMemo(() => {
    if (expenses.length === 0) return 0;
    const dates = expenses.map(e => e.date);
    const uniqueDates = new Set(dates);
    return totalSpent / uniqueDates.size;
  }, [expenses, totalSpent]);

  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleScanReceipt = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setIsModalOpen(true); // Open modal to show loading state

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;
        const base64Data = base64Image.split(',')[1];
        const mimeType = base64Image.split(';')[0].split(':')[1];

        const prompt = `Você é um assistente financeiro. Analise este recibo/nota fiscal e extraia as seguintes informações em formato JSON:
        {
          "title": "Nome do estabelecimento ou item principal (curto)",
          "amount": "Valor total em formato numérico (ex: 150.50)",
          "category": "Uma destas categorias: Hotel, Comida, Voos, Passeios, Compras, Outros",
          "description": "Breve descrição dos itens comprados"
        }`;

        const response = await axios.post('/api/gemini', {
          prompt,
          image: base64Data,
          mimeType: mimeType,
          schema: {
            type: "object",
            required: ["title", "amount", "category", "description"],
            properties: {
              title: { type: "string" },
              amount: { type: "number" },
              category: { type: "string" },
              description: { type: "string" }
            }
          }
        });

        const data = response.data;
        setTitle(data.title || '');
        setAmount(data.amount ? String(data.amount) : '');
        if (categories.includes(data.category)) {
          setCategory(data.category as any);
        }
        setDescription(data.description || '');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error scanning receipt:", error);
      toast.error("Erro ao ler o recibo.", {
        description: "Ocorreu um problema no processamento da imagem. Por favor, preencha os dados manualmente."
      });
    } finally {
      setIsScanning(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddExpense = async () => {
    if (!title || !amount || !user || !currentTrip?.id) return;
    
    const newExpense = {
      title,
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString().split('T')[0],
      description
    };

    const expensesRef = collection(db, 'trips', currentTrip.id, 'expenses');
    await addDoc(expensesRef, newExpense);
    
    trackEvent('expense_added');

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

  const handleDeleteExpense = async (id: string) => {
    if (!user || !currentTrip?.id) return;
    const expenseRef = doc(db, 'trips', currentTrip.id, 'expenses', id);
    await deleteDoc(expenseRef);
  };

  const categories = ['Hotel', 'Comida', 'Voos', 'Passeios', 'Compras', 'Outros'];

  const chartData = useMemo(() => {
    const data = categories.map(cat => ({
      name: cat,
      value: expenses.filter(e => e.category === cat).reduce((acc, curr) => acc + curr.amount, 0)
    })).filter(item => item.value > 0);
    return data;
  }, [expenses]);

  const COLORS = ['#8b5cf6', '#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#64748b'];

  return (
    <MobileContainer>
      <div className="flex items-center justify-between py-6">
        <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Gastos</h1>
        <div className="flex gap-2">
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => fileInputRef.current?.click()}
            className="w-12 h-12 bg-accent/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-accent border border-accent/20 shadow-[0_0_15px_rgba(255,0,128,0.15)]"
          >
            <Camera className="w-5 h-5" />
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="w-12 h-12 bg-primary/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-primary border border-primary/20 shadow-[0_0_15px_rgba(0,229,255,0.15)]"
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
      <input 
        type="file" 
        accept="image/*" 
        capture="environment"
        ref={fileInputRef}
        className="hidden"
        onChange={handleScanReceipt}
      />

      <div className="flex flex-col gap-6 pb-32">
        {/* Summary Card */}
        <AnimatedContainer delay={0.1}>
          <div className="glass-card p-0 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            
            <div className="p-6 flex flex-col gap-8">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(0,229,255,0.1)]">
                    <PieChartIcon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Resumo Financeiro</span>
                </div>
                <button 
                  onClick={() => setIsBudgetModalOpen(true)}
                  className="text-[9px] font-black text-primary uppercase tracking-widest px-4 py-2 bg-primary/10 backdrop-blur-md rounded-xl border border-primary/20 active:scale-95 transition-all"
                >
                  Editar Orçamento
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-1">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Total Gasto</p>
                  <p className="text-3xl font-black text-white tracking-tighter">{renderPrice(totalSpent)}</p>
                </div>
                <div className="flex flex-col gap-1 text-right">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Restante</p>
                  <p className="text-3xl font-black text-primary tracking-tighter">{renderPrice(remaining)}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between text-[9px] font-black text-white/40 uppercase tracking-widest">
                  <span>0%</span>
                  <span>{Math.round(percentage)}% Utilizado</span>
                  <span>100%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(percentage, 100)}%` }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    className={`absolute top-0 left-0 h-full ${percentage > 90 ? 'bg-red-500' : 'bg-primary'} shadow-[0_0_20px_rgba(0,229,255,0.6)]`}
                  />
                </div>
              </div>

              {expenses.length > 0 && (
                <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                  <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Média Diária</span>
                  <span className="text-lg font-black text-white tracking-tight">{renderPrice(dailyAverage)}</span>
                </div>
              )}

              {chartData.length > 0 && (
                <div className="h-48 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => renderPrice(value)}
                        contentStyle={{ backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </AnimatedContainer>

        {/* Expense List */}
        <AnimatedContainer delay={0.2}>
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center px-2">
              <h4 className="text-xl font-black text-white tracking-tighter uppercase">Lista de Gastos</h4>
              <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all">
                <Filter className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {expenses.length === 0 ? (
                <div className="glass-card p-12 text-center border-white/5 border-dashed">
                  <Receipt className="w-12 h-12 text-white/20 mx-auto mb-4" />
                  <p className="text-white/40 font-black text-[10px] uppercase tracking-widest">Nenhum gasto registrado</p>
                </div>
              ) : (
                expenses.map((expense) => (
                  <motion.div
                    key={expense.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card p-4 flex items-center justify-between group border-white/5 hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.2)] flex items-center justify-center text-white/60 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <Receipt className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <h5 className="text-sm font-bold text-white tracking-tight">{expense.title}</h5>
                        <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">{expense.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-lg font-black text-white tracking-tighter">
                        {renderPrice(expense.amount)}
                      </p>
                      <button 
                        onClick={() => handleDeleteExpense(expense.id!)}
                        className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500/50 hover:text-red-400 hover:bg-red-500/20 transition-all active:scale-95"
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
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60]"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-[rgba(255,255,255,0.05)] backdrop-blur-[40px] rounded-t-[32px] p-8 z-[70] border-t border-[rgba(255,255,255,0.1)] shadow-[0_-8px_32px_0_rgba(0,0,0,0.37)]"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-semibold text-white tracking-tight">Registrar Gasto</h2>
                <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 bg-[rgba(255,255,255,0.1)] backdrop-blur-[20px] rounded-full flex items-center justify-center border border-[rgba(255,255,255,0.15)] active:scale-95 transition-all">
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              {isScanning ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-white/60 text-sm font-semibold uppercase tracking-widest animate-pulse">Lendo Recibo...</p>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-semibold text-white/60 uppercase tracking-widest px-2">Valor</label>
                  <input 
                    type="number" 
                    value={amount || ''}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0,00"
                    className="w-full h-14 bg-[rgba(255,255,255,0.05)] backdrop-blur-[20px] rounded-[20px] px-6 text-xl font-semibold text-white border border-[rgba(255,255,255,0.08)] focus:border-primary/50 outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-semibold text-white/60 uppercase tracking-widest px-2">Título</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Jantar em Paris"
                    className="w-full h-14 bg-[rgba(255,255,255,0.05)] backdrop-blur-[20px] rounded-[20px] px-6 text-base font-semibold text-white border border-[rgba(255,255,255,0.08)] focus:border-primary/50 outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-semibold text-white/60 uppercase tracking-widest px-2">Categoria</label>
                  <div className="grid grid-cols-3 gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat as any)}
                        className={`h-10 rounded-full text-[10px] font-semibold uppercase tracking-widest transition-all ${
                          category === cat 
                            ? 'bg-[rgba(255,255,255,0.15)] text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] border border-[rgba(255,255,255,0.2)]' 
                            : 'bg-[rgba(255,255,255,0.05)] text-white/60 border border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.1)]'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={handleAddExpense} 
                  className="mt-4 w-full h-14 bg-[rgba(255,255,255,0.1)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.15)] rounded-[20px] text-white font-semibold text-[10px] uppercase tracking-widest shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] active:scale-95 transition-all"
                >
                  Confirmar Gasto
                </button>
              </div>
              )}
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
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60]"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[360px] bg-[rgba(255,255,255,0.05)] backdrop-blur-[40px] rounded-[32px] p-8 z-[70] border border-[rgba(255,255,255,0.1)] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]"
            >
              <h2 className="text-xl font-semibold text-white tracking-tight mb-6 text-center">Definir Orçamento</h2>
              <div className="flex flex-col gap-6">
                <input 
                  type="number" 
                  value={newBudget || ''}
                  onChange={(e) => setNewBudget(e.target.value)}
                  className="w-full h-14 bg-[rgba(255,255,255,0.05)] backdrop-blur-[20px] rounded-[20px] px-6 text-xl font-semibold text-white text-center border border-[rgba(255,255,255,0.08)] focus:border-primary/50 outline-none transition-all"
                />
                <div className="flex gap-3">
                  <button 
                    onClick={() => setIsBudgetModalOpen(false)}
                    className="flex-1 h-12 bg-[rgba(255,255,255,0.05)] backdrop-blur-[20px] rounded-full border border-[rgba(255,255,255,0.08)] text-[10px] font-semibold text-white uppercase tracking-widest active:scale-95 transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleUpdateBudget}
                    className="flex-1 h-12 bg-[rgba(255,255,255,0.15)] backdrop-blur-[20px] rounded-full border border-[rgba(255,255,255,0.2)] text-[10px] font-semibold text-white uppercase tracking-widest shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] active:scale-95 transition-all"
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
