import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SearchIcon, MicIcon, XIcon, SparklesIcon, MapPinIcon } from '../icons';

interface SearchBarPremiumProps {
  onSearch: (query: string) => void;
  value: string;
}

export const SearchBarPremium: React.FC<SearchBarPremiumProps> = ({ onSearch, value }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const placeholders = [
    "Pra onde vamos dessa vez?",
    "Que tal uma praia paradisíaca?",
    "Busque por 'Paris' ou 'Montanha'",
    "Diga o que você sente que eu encontro"
  ];
  const [placeholderIdx, setPlaceholderIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx(prev => (prev + 1) % placeholders.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [placeholders.length]);

  const handleVoiceSearch = () => {
    setIsRecording(true);
    // Basic implementation of Web Speech API if supported
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.lang = 'pt-BR';
      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        onSearch(text);
        setIsRecording(false);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);
      recognition.start();
    } else {
      setTimeout(() => setIsRecording(false), 2000);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto px-6 z-30">
      <motion.div 
        animate={{ 
          scale: isFocused ? 1.02 : 1,
          boxShadow: isFocused ? '0 0 24px rgba(34,211,238,0.2)' : '0 4px 12px rgba(0,0,0,0.1)'
        }}
        className={`relative flex items-center h-14 rounded-2xl transition-colors duration-300 backdrop-blur-xl border ${
          isFocused ? 'border-primary/50 bg-white/10' : 'border-white/10 bg-[rgba(255,255,255,0.06)]'
        }`}
      >
        <div className="pl-4 pr-3 text-primary">
          <SearchIcon size={20} animated />
        </div>
        
        <AnimatePresence mode="wait">
          {!value && !isFocused && (
             <motion.span 
               key={placeholderIdx}
               initial={{ opacity: 0, y: 5 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -5 }}
               className="absolute left-11 text-white/40 pointer-events-none text-[15px]"
             >
               {placeholders[placeholderIdx]}
             </motion.span>
          )}
        </AnimatePresence>

        <input 
          type="text"
          value={value}
          onChange={(e) => onSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="flex-1 bg-transparent border-none text-white font-medium focus:outline-none focus:ring-0 text-[15px] h-full"
        />

        <div className="flex items-center pr-2 gap-1">
          {value && (
            <button 
              onClick={() => onSearch('')}
              className="p-2 text-white/40 hover:text-white transition-colors"
            >
              <XIcon size={16} animated />
            </button>
          )}
          <button 
             onClick={handleVoiceSearch}
             className={`p-2.5 rounded-xl transition-all relative ${
               isFocused || isRecording ? 'text-primary' : 'text-white/40 hover:bg-white/5'
             }`}
          >
             {isRecording && (
                <span className="absolute inset-0 bg-primary/20 rounded-xl animate-ping" />
             )}
            <MicIcon size={18} animated />
          </button>
        </div>
      </motion.div>

      {/* Dropdown for suggestions/recent searches */}
      <AnimatePresence>
        {isFocused && (
          <motion.div 
            initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
            className="absolute top-full left-6 right-6 mt-3 bg-[rgba(15,23,42,0.85)] backdrop-blur-2xl border border-white/10 p-2 rounded-2xl shadow-2xl z-40 overflow-hidden"
          >
            <div className="space-y-1">
              <SuggestionItem emoji="🔥" label="Trending: Fernando de Noronha" onClick={() => onSearch('Fernando de Noronha')} />
              <SuggestionItem emoji="📍" label="Perto de você: São Paulo" onClick={() => onSearch('São Paulo')} />
              <SuggestionItem emoji="💰" label="Econômicos: Chapada Diamantina" onClick={() => onSearch('Chapada Diamantina')} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SuggestionItem: React.FC<{ emoji: string; label: string; onClick: () => void }> = ({ emoji, label, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-left group"
  >
    <div className="text-xl group-hover:scale-110 transition-transform">
      {emoji}
    </div>
    <span className="text-[14px] font-medium text-white/80 group-hover:text-white transition-colors">{label}</span>
  </button>
);
