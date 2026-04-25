import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { useTripsStore, Trip } from '@/stores/tripsStore';
import { COUNTRIES } from '@/data/countries';
import { FormField } from './FormField';

interface AddCountrySheetProps {
  open: boolean;
  onClose: () => void;
}

export const AddCountrySheet = ({ open, onClose }: AddCountrySheetProps) => {
  const { addTrip } = useTripsStore();
  
  const [selectedCountry, setSelectedCountry] = useState<typeof COUNTRIES[0] | null>(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [status, setStatus] = useState<'visited' | 'planned' | 'wishlist'>('visited');
  const [query, setQuery] = useState('');
  const [saving, setSaving] = useState(false);

  const filteredCountries = query
    ? COUNTRIES.filter(c => 
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.code.toLowerCase().includes(query.toLowerCase())
      )
    : COUNTRIES;

  const handleSave = () => {
    if (!selectedCountry) {
      toast.error('Selecione um país');
      return;
    }

    setSaving(true);
    
    addTrip({
      countryCode: selectedCountry.code,
      year: Number(year),
      status,
    });
    
    setSaving(false);
    onClose();
    // Limpar estado
    setSelectedCountry(null);
    setQuery('');
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 
                       bg-rw-dark border-t border-rw-border
                       rounded-t-3xl max-h-[90vh] flex flex-col"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2 shrink-0">
              <div className="w-10 h-1 rounded-full bg-rw-border" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-3 
                            border-b border-rw-border shrink-0">
              <button 
                onClick={onClose}
                className="text-rw-muted text-sm font-medium"
              >
                Cancelar
              </button>
              <h2 className="text-rw-text font-semibold uppercase tracking-widest text-xs">Novo Carimbo</h2>
              <button 
                onClick={handleSave}
                disabled={!selectedCountry || saving}
                className="px-6 py-1.5 rounded-full bg-rw-gradient
                           text-rw-black text-sm font-black uppercase
                           shadow-rw-glow-sm transition-all
                           disabled:opacity-40 disabled:shadow-none"
              >
                {saving ? 'Catalogando…' : 'Adicionar'}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6 pb-12">
              {/* Seleção de País */}
              <section>
                <label className="text-[10px] uppercase tracking-[0.25em] 
                                  text-rw-muted font-black mb-3 block">
                  1. Qual o destino?
                </label>
                
                {selectedCountry ? (
                  <div className="flex items-center gap-4 p-4 bg-rw-surface border border-rw-sky/30 rounded-2xl">
                    <span className="text-4xl">{selectedCountry.flag}</span>
                    <div className="flex-1">
                      <h3 className="text-rw-text font-bold">{selectedCountry.name}</h3>
                      <p className="text-rw-muted text-xs uppercase tracking-wider">{selectedCountry.continent}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedCountry(null)}
                      className="text-rw-muted hover:text-rw-sky text-xs font-bold uppercase transition-colors"
                    >
                      Trocar
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-rw-dim">🔍</span>
                      <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Buscar país por nome ou sigla..."
                        className="w-full h-12 pl-10 pr-4 bg-rw-surface border border-rw-border 
                                   rounded-xl text-sm text-rw-text placeholder:text-rw-dim
                                   focus:outline-none focus:border-rw-sky focus:ring-1 focus:ring-rw-sky/20
                                   transition-all"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                      {filteredCountries.slice(0, 10).map(c => (
                        <button
                          key={c.code}
                          onClick={() => setSelectedCountry(c)}
                          className="w-full flex items-center gap-3 px-4 py-3 bg-rw-surface/50
                                     border border-rw-border/50 rounded-xl hover:bg-rw-sky/5
                                     hover:border-rw-sky/30 transition-all text-left"
                        >
                          <span className="text-2xl">{c.flag}</span>
                          <span className="text-sm text-rw-text font-medium flex-1">{c.name}</span>
                          <span className="text-[10px] font-mono text-rw-dim">{c.code}</span>
                        </button>
                      ))}
                      {filteredCountries.length === 0 && (
                        <p className="text-center py-8 text-rw-muted text-xs">Nenhum país encontrado</p>
                      )}
                    </div>
                  </div>
                )}
              </section>

              {/* Status e Ano */}
              <div className="grid grid-cols-2 gap-4">
                <section>
                  <label className="text-[10px] uppercase tracking-[0.25em] 
                                    text-rw-muted font-black mb-3 block">
                    2. Status
                  </label>
                  <div className="flex flex-col gap-2">
                    {(['visited', 'planned', 'wishlist'] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setStatus(s)}
                        className={`px-4 py-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                          status === s 
                            ? 'bg-rw-sky/10 border-rw-sky/40 text-rw-sky' 
                            : 'bg-rw-surface border-rw-border text-rw-muted hover:border-rw-muted'
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${
                          status === s ? 'bg-rw-sky shadow-rw-glow-sm' : 'bg-rw-dim'
                        }`} />
                        <span className="text-xs font-bold uppercase tracking-widest">
                          {s === 'visited' ? 'Já fui' : s === 'planned' ? 'Planejando' : 'Lista de Desejos'}
                        </span>
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <label className="text-[10px] uppercase tracking-[0.25em] 
                                    text-rw-muted font-black mb-3 block">
                    3. Ano
                  </label>
                  <input
                    type="number"
                    min="1950"
                    max={new Date().getFullYear() + 10}
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full h-12 px-4 bg-rw-surface border border-rw-border 
                               rounded-xl text-rw-text font-bold text-center
                               focus:outline-none focus:border-rw-sky"
                  />
                  <div className="flex justify-between mt-2 px-1">
                    <button 
                      onClick={() => setYear(y => y - 1)}
                      className="text-rw-muted hover:text-rw-text p-1"
                    >
                      -
                    </button>
                    <button 
                       onClick={() => setYear(y => y + 1)}
                       className="text-rw-muted hover:text-rw-text p-1"
                    >
                      +
                    </button>
                  </div>
                </section>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
