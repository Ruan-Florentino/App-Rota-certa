import React from 'react';
import { motion } from 'motion/react';
import { MessageSquare, ArrowRight } from 'lucide-react';

interface TranslatorTabProps {
  translationInput: string;
  setTranslationInput: (v: string) => void;
  handleTranslate: () => void;
  isTranslating: boolean;
  translationResult: { translated: string; pronunciation: string; context?: string } | null;
  language: string;
}

export const TranslatorTab: React.FC<TranslatorTabProps> = ({
  translationInput,
  setTranslationInput,
  handleTranslate,
  isTranslating,
  translationResult,
  language
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4"
    >
      <div className="glass-card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-[rgba(255,255,255,0.1)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.15)] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-full flex items-center justify-center text-primary">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white tracking-tight">Tradutor Inteligente</h4>
            <p className="text-[10px] font-semibold text-white/60 uppercase tracking-widest">
              Para {language || 'o idioma local'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <textarea
            value={translationInput}
            onChange={(e) => setTranslationInput(e.target.value)}
            placeholder="O que você quer dizer?"
            className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-2xl p-4 text-white resize-none focus:outline-none focus:border-primary/50 min-h-[100px]"
          />
          
          <button
            onClick={handleTranslate}
            disabled={isTranslating || !translationInput.trim()}
            className="w-full h-14 bg-primary text-black font-bold rounded-[20px] flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 transition-all"
          >
            {isTranslating ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>Traduzir <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </div>

        {translationResult && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-4"
          >
            <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-2xl p-4">
              <p className="text-[10px] font-semibold text-white/60 uppercase tracking-widest mb-1">Tradução</p>
              <p className="text-xl font-bold text-white mb-2">{translationResult.translated}</p>
              
              <p className="text-[10px] font-semibold text-white/60 uppercase tracking-widest mb-1">Pronúncia</p>
              <p className="text-sm text-primary mb-4 italic">{translationResult.pronunciation}</p>
              
              {translationResult.context && (
                <>
                  <p className="text-[10px] font-semibold text-white/60 uppercase tracking-widest mb-1">Dica Cultural</p>
                  <p className="text-sm text-white/80">{translationResult.context}</p>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
