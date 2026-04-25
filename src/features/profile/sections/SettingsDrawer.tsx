import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Monitor, Moon, Sun, Trash2, X, Download } from 'lucide-react';
import { auth } from '@/firebase';
import { toast } from 'sonner';

export const SettingsDrawer = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const handleSignOut = () => {
    if (auth) {
      auth.signOut();
    }
  };

  const handleExport = () => {
    toast.success('Exportando seu mundo...');
    // Add real export logic later
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-[90%] max-w-sm bg-[#0A0E1A]/90 backdrop-blur-2xl border-l border-white/10 z-50 flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-[#D4AF37] font-black uppercase tracking-[0.2em] text-xs">Ajustes</h2>
              <button onClick={onClose} className="p-2 -mr-2 text-white/50 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Theme Section */}
              <section>
                <h3 className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-4">Aparência</h3>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Sistema', icon: Monitor },
                    { label: 'Claro', icon: Sun },
                    { label: 'Escuro', icon: Moon }
                  ].map((theme, i) => (
                    <button key={theme.label} className={`flex flex-col items-center gap-2 p-3 rounded-xl border ${i === 2 ? 'bg-white/10 border-white/20 text-white' : 'border-white/5 text-white/40 hover:bg-white/5'}`}>
                      <theme.icon size={18} />
                      <span className="text-[10px] font-bold uppercase">{theme.label}</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Data Section */}
              <section>
                <h3 className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-4">Seus Dados</h3>
                <div className="space-y-2">
                  <button onClick={handleExport} className="w-full flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5 text-white hover:bg-white/10 transition-colors">
                    <Download size={18} className="text-[#D4AF37]" />
                    <span className="text-sm font-bold flex-1 text-left">Exportar meu mundo</span>
                  </button>
                </div>
              </section>

              {/* Danger Zone */}
              <section className="pt-8 border-t border-white/5">
                <button 
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-colors mb-4"
                >
                  <LogOut size={18} />
                  <span className="text-sm font-bold flex-1 text-left">Sair da conta</span>
                </button>
                
                <button className="w-full flex items-center justify-center gap-2 py-4 text-white/30 hover:text-red-500 transition-colors text-xs uppercase tracking-widest font-bold">
                  <Trash2 size={14} /> Excluir perfil
                </button>
              </section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
