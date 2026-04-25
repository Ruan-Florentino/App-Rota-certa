import React from 'react';
import { motion } from 'motion/react';
import { Sun, Globe, Languages, Coins, Users, Plus, X, ShieldAlert, Phone, MessageSquare, Sparkles } from 'lucide-react';
import { Trip } from '../../../types';
import { SafeImage } from '../../ui/SafeImage';

interface InfoTabProps {
  currentTrip: Trip;
  isOwner: boolean;
  canEdit: boolean;
  collaboratorProfiles: any[];
  setIsCollaboratorsModalOpen: (v: boolean) => void;
  handleRemoveCollaborator: (uid: string) => void;
  handleGenerateSurvivalGuide: () => void;
  isGeneratingSurvivalGuide: boolean;
}

export const InfoTab: React.FC<InfoTabProps> = ({
  currentTrip,
  isOwner,
  canEdit,
  collaboratorProfiles,
  setIsCollaboratorsModalOpen,
  handleRemoveCollaborator,
  handleGenerateSurvivalGuide,
  isGeneratingSurvivalGuide
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-6 flex flex-col gap-2">
          <Sun className="w-6 h-6 text-accent" />
          <span className="text-[10px] font-semibold text-white/60 uppercase tracking-widest">Melhor Época</span>
          <span className="text-white font-semibold text-sm">{currentTrip.info?.bestTime || 'N/A'}</span>
        </div>
        <div className="glass-card p-6 flex flex-col gap-2">
          <Globe className="w-6 h-6 text-primary" />
          <span className="text-[10px] font-semibold text-white/60 uppercase tracking-widest">Fuso Horário</span>
          <span className="text-white font-semibold text-sm">{currentTrip.info?.timezone || 'N/A'}</span>
        </div>
        <div className="glass-card p-6 flex flex-col gap-2">
          <Languages className="w-6 h-6 text-secondary" />
          <span className="text-[10px] font-semibold text-white/60 uppercase tracking-widest">Idioma</span>
          <span className="text-white font-semibold text-sm">{currentTrip.info?.language || 'N/A'}</span>
        </div>
        <div className="glass-card p-6 flex flex-col gap-2">
          <Coins className="w-6 h-6 text-yellow-500" />
          <span className="text-[10px] font-semibold text-white/60 uppercase tracking-widest">Moeda</span>
          <span className="text-white font-semibold text-sm">{currentTrip.info?.currency || 'N/A'}</span>
        </div>
      </div>
      
      <div className="glass-card p-6">
        <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Dicas de Viagem</h4>
        <ul className="space-y-3">
          {currentTrip.tips?.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-3 text-xs text-white/60">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />
              {tip}
            </li>
          ))}
        </ul>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Parceiros de Viagem</h4>
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Planejamento em Grupo</p>
            </div>
          </div>
          {isOwner && (
            <button 
              onClick={() => setIsCollaboratorsModalOpen(true)}
              className="w-8 h-8 bg-primary text-[#020617] rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-xl border border-white/10">
            <div className="w-6 h-6 rounded-full overflow-hidden bg-white/10 border border-white/20">
              <SafeImage src={currentTrip.authorPhoto || ''} alt={currentTrip.authorName || ''} className="w-full h-full object-cover" />
            </div>
            <span className="text-xs font-bold text-white">{currentTrip.authorName || 'Dono'}</span>
            <span className="text-[8px] font-black text-primary uppercase tracking-widest bg-primary/20 px-1.5 py-0.5 rounded">Dono</span>
          </div>

          {collaboratorProfiles.map((profile) => (
            <div key={profile.uid} className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-xl border border-white/10 group">
              <div className="w-6 h-6 rounded-full overflow-hidden bg-white/10 border border-white/20">
                <SafeImage src={profile.photoURL || ''} alt={profile.displayName || ''} className="w-full h-full object-cover" />
              </div>
              <span className="text-xs font-bold text-white">{profile.displayName}</span>
              {isOwner && (
                <button 
                  onClick={() => handleRemoveCollaborator(profile.uid)}
                  className="w-4 h-4 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-2 h-2" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center text-red-500">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-widest">Guia de Sobrevivência</h4>
              <p className="text-[10px] text-white/60">Emergências e Cultura</p>
            </div>
          </div>
          {canEdit && !currentTrip.info?.survivalGuide && (
            <button
              onClick={handleGenerateSurvivalGuide}
              disabled={isGeneratingSurvivalGuide}
              className="flex items-center gap-2 bg-primary/20 text-primary px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-primary/30 transition-colors disabled:opacity-50"
            >
              <Sparkles className="w-3 h-3" />
              {isGeneratingSurvivalGuide ? 'Gerando...' : 'Gerar com IA'}
            </button>
          )}
        </div>

        {currentTrip.info?.survivalGuide && (
          <div className="space-y-6">
            <div>
              <h5 className="text-xs font-bold text-white/80 mb-3 flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-400" /> Números de Emergência
              </h5>
              <div className="grid grid-cols-2 gap-2">
                {currentTrip.info.survivalGuide.emergencyNumbers.map((em, i) => (
                  <div key={i} className="bg-white/5 p-3 rounded-xl border border-white/10 flex flex-col">
                    <span className="text-[10px] text-white/60 uppercase">{em.name}</span>
                    <span className="text-sm font-bold text-white">{em.number}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h5 className="text-xs font-bold text-white/80 mb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-400" /> Frases Essenciais
              </h5>
              <div className="space-y-2">
                {currentTrip.info.survivalGuide.phrases.map((phrase, i) => (
                  <div key={i} className="bg-white/5 p-3 rounded-xl border border-white/10">
                    <p className="text-sm font-bold text-white mb-1">{phrase.original}</p>
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] text-white/60">{phrase.translated}</span>
                      <span className="text-[10px] text-primary italic">"{phrase.pronunciation}"</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h5 className="text-xs font-bold text-white/80 mb-3 flex items-center gap-2">
                <Coins className="w-4 h-4 text-yellow-400" /> Gorjetas e Etiqueta
              </h5>
              <p className="text-xs text-white/80 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/10">
                {currentTrip.info.survivalGuide.tipping}
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
