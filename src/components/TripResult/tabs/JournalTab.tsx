import React from 'react';
import { motion } from 'motion/react';
import { Bookmark, Plus, Sparkles, Camera, X, Trash2 } from 'lucide-react';
import { Trip } from '../../../types';
import { useStore } from '../../../store/useStore';

interface JournalTabProps {
  currentTrip: Trip;
  isOwner: boolean;
  canEdit: boolean;
  handleSave: (tripToSave?: any) => Promise<void>;
  journalSummary: string | null;
  setJournalSummary: (summary: string | null) => void;
  handleSummarizeJournal: () => void;
  isSummarizingJournal: boolean;
  handleGenerateJournalInsight: (text: string, entryId: string) => void;
  isGeneratingInsight: string | null;
}

export const JournalTab: React.FC<JournalTabProps> = ({
  currentTrip,
  isOwner,
  canEdit,
  handleSave,
  journalSummary,
  setJournalSummary,
  handleSummarizeJournal,
  isSummarizingJournal,
  handleGenerateJournalInsight,
  isGeneratingInsight
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[rgba(255,255,255,0.1)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.15)] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-full flex items-center justify-center text-primary">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white tracking-tight">Diário de Viagem</h4>
              <p className="text-[10px] font-semibold text-white/60 uppercase tracking-widest">Suas memórias em {currentTrip.destination}</p>
            </div>
          </div>
          {canEdit && (
            <button
              onClick={() => {
                const newEntry = {
                  id: Date.now().toString(),
                  date: new Date().toISOString().split('T')[0],
                  text: ''
                };
                const updatedTrip = { ...currentTrip, journal: [newEntry, ...(currentTrip.journal || [])] };
                const { updateTrip } = useStore.getState();
                updateTrip(updatedTrip);
                if (updatedTrip.id) handleSave(updatedTrip);
              }}
              className="w-10 h-10 bg-primary/20 text-primary rounded-full flex items-center justify-center hover:bg-primary/30 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>

        {currentTrip.journal && currentTrip.journal.length > 1 && (
          <div className="mt-4">
            {journalSummary ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-accent/10 border border-accent/20 rounded-2xl p-4 relative"
              >
                <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-2 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Resumo da Jornada
                </p>
                <p className="text-xs text-white/90 leading-relaxed italic">"{journalSummary}"</p>
                <button 
                  onClick={() => setJournalSummary(null)}
                  className="absolute top-2 right-2 text-white/40 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            ) : (
              <button 
                onClick={handleSummarizeJournal}
                disabled={isSummarizingJournal}
                className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-white/60 hover:text-white hover:bg-white/10 transition-all"
              >
                {isSummarizingJournal ? (
                  <div className="w-4 h-4 border-2 border-white/40 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 text-accent" />
                )}
                Resumir Minha Jornada com IA
              </button>
            )}
          </div>
        )}
      </div>

      {currentTrip.journal && currentTrip.journal.length > 0 ? (
        currentTrip.journal.map((entry, idx) => (
          <div key={entry.id} className="glass-card p-6 relative group">
            <div className="flex justify-between items-start mb-4">
              <input 
                type="date" 
                value={entry.date}
                disabled={!isOwner}
                onChange={(e) => {
                  const newJournal = [...currentTrip.journal!];
                  newJournal[idx].date = e.target.value;
                  const updatedTrip = { ...currentTrip, journal: newJournal };
                  useStore.getState().updateTrip(updatedTrip);
                  if (updatedTrip.id) handleSave(updatedTrip);
                }}
                className="bg-transparent text-white/60 text-xs font-semibold uppercase tracking-widest focus:outline-none disabled:opacity-100"
              />
              {isOwner && (
                <button 
                  onClick={() => {
                    const newJournal = currentTrip.journal!.filter(j => j.id !== entry.id);
                    const updatedTrip = { ...currentTrip, journal: newJournal };
                    useStore.getState().updateTrip(updatedTrip);
                    if (updatedTrip.id) handleSave(updatedTrip);
                  }}
                  className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <textarea
              value={entry.text}
              disabled={!isOwner}
              onChange={(e) => {
                const newJournal = [...currentTrip.journal!];
                newJournal[idx].text = e.target.value;
                const updatedTrip = { ...currentTrip, journal: newJournal };
                useStore.getState().updateTrip(updatedTrip);
              }}
              onBlur={() => {
                if (currentTrip.id) handleSave(currentTrip);
              }}
              placeholder="Escreva sobre o seu dia..."
              className="w-full bg-transparent text-white resize-none focus:outline-none min-h-[100px] mb-4 disabled:opacity-100"
            />
            
            {entry.photos && entry.photos.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-4">
                {entry.photos.map((photo, pIdx) => (
                  <div key={pIdx} className="relative aspect-square rounded-lg overflow-hidden group/photo">
                    <img src={photo} alt={`Journal photo ${pIdx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    {isOwner && (
                      <button
                        onClick={() => {
                          const newJournal = [...currentTrip.journal!];
                          newJournal[idx].photos = newJournal[idx].photos!.filter((_, i) => i !== pIdx);
                          const updatedTrip = { ...currentTrip, journal: newJournal };
                          useStore.getState().updateTrip(updatedTrip);
                          if (updatedTrip.id) handleSave(updatedTrip);
                        }}
                        className="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover/photo:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {entry.insight && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-4 bg-primary/10 border border-primary/20 rounded-xl p-3"
              >
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Insight da IA
                </p>
                <p className="text-xs text-white/80 leading-relaxed italic">"{entry.insight}"</p>
              </motion.div>
            )}

            <div className="flex justify-between items-center">
              <button 
                onClick={() => handleGenerateJournalInsight(entry.text, entry.id)}
                disabled={isGeneratingInsight === entry.id || !entry.text.trim() || !isOwner}
                className={`flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest hover:text-primary/80 transition-colors ${(!isOwner || isGeneratingInsight === entry.id || !entry.text.trim()) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isGeneratingInsight === entry.id ? (
                  <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Sparkles className="w-3 h-3" />
                )}
                Gerar Insight
              </button>

              {isOwner && (
                <label className="cursor-pointer flex items-center gap-2 text-xs font-semibold text-white/60 hover:text-white transition-colors">
                  <Camera className="w-4 h-4" />
                  Adicionar Foto
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const base64String = reader.result as string;
                          const newJournal = [...currentTrip.journal!];
                          if (!newJournal[idx].photos) newJournal[idx].photos = [];
                          newJournal[idx].photos!.push(base64String);
                          const updatedTrip = { ...currentTrip, journal: newJournal };
                          useStore.getState().updateTrip(updatedTrip);
                          if (updatedTrip.id) handleSave(updatedTrip);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="glass-card p-8 text-center flex flex-col items-center gap-4">
          <Bookmark className="w-12 h-12 text-white/20" />
          <p className="text-white/60 text-sm">Nenhuma memória registrada ainda. Clique no + para começar seu diário!</p>
        </div>
      )}
    </motion.div>
  );
};
