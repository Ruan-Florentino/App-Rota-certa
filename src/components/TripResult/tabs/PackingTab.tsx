import React from 'react';
import { motion } from 'motion/react';
import { Briefcase, CheckCircle2, RefreshCw, Sparkles } from 'lucide-react';
import { Trip } from '../../../types';

interface PackingTabProps {
  currentTrip: Trip;
  isGeneratingPackingList: boolean;
  handleGeneratePackingList: () => void;
  togglePackingItem: (catIdx: number, itemIdx: number) => void;
  canEdit: boolean;
  handleSave: (tripToSave?: any) => Promise<void>;
}

export const PackingTab: React.FC<PackingTabProps> = ({
  currentTrip,
  isGeneratingPackingList,
  handleGeneratePackingList,
  togglePackingItem,
  canEdit,
  handleSave
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-primary" /> Lista de Bagagem
        </h3>
        <button 
          onClick={handleGeneratePackingList}
          disabled={isGeneratingPackingList}
          className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 active:scale-95 transition-all disabled:opacity-50"
        >
          {isGeneratingPackingList ? (
            <RefreshCw className="w-3 h-3 animate-spin" />
          ) : (
            <Sparkles className="w-3 h-3" />
          )}
          Regerar Lista
        </button>
      </div>

      <div className="grid gap-6">
        {currentTrip.packingList?.map((category, catIdx) => (
          <div key={catIdx} className="glass-card p-6">
            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center justify-between">
              {category.category}
              <span className="text-[10px] text-white/40">{category.items.filter(i => i.checked).length}/{category.items.length}</span>
            </h4>
            <div className="grid gap-3">
              {category.items.map((item, itemIdx) => (
                <button 
                  key={itemIdx}
                  onClick={() => togglePackingItem(catIdx, itemIdx)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                    item.checked 
                      ? 'bg-primary/10 border-primary/30 text-white' 
                      : 'bg-white/5 border-white/5 text-white/60 hover:border-white/10'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                    item.checked ? 'bg-primary border-primary text-black' : 'border-white/20'
                  }`}>
                    {item.checked && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <span className="text-sm font-medium">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
