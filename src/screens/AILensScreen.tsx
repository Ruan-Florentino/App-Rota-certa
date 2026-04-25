import { toast } from 'sonner';
import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Camera, Upload, X, Sparkles, MapPin, Info, ArrowLeft } from 'lucide-react';
import { MobileContainer, AnimatedContainer, GlowButton } from '../components/MobileUI';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { checkLimit } from '../services/subscriptionService';
import { trackEvent } from '../services/analyticsService';
import { analyzeImageWithAI } from '../services/geminiService';

export const AILensScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useStore(useShallow((s) => ({ user: s.user })));
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (user) {
      const canUseLens = await checkLimit(user.uid, 'lens');
      if (!canUseLens) {
        toast.error("Premium Necessário", {
          description: "O recurso AI Lens é exclusivo para assinantes Premium. Assine agora para desbloquear!"
        });
        navigate('/upgrade');
        return;
      }
    }

    const file = e.target.files?.[0];
    if (file) {
      trackEvent('ai_lens_used');
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        analyzeImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (base64Image: string) => {
    setLoading(true);
    setResult(null);
    try {
      // Remove the data:image/jpeg;base64, part
      const base64Data = base64Image.split(',')[1];
      const mimeType = base64Image.split(';')[0].split(':')[1];

      const data = await analyzeImageWithAI(base64Data, mimeType);
      setResult(data);
    } catch (error) {
      console.error("Error analyzing image:", error);
      setResult({ error: "Erro ao analisar a imagem. Tente novamente com uma foto mais clara." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileContainer>
      <div className="flex items-center gap-4 py-6">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-[rgba(255,255,255,0.1)] backdrop-blur-[20px] rounded-full flex items-center justify-center text-white border border-[rgba(255,255,255,0.15)] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-semibold text-white tracking-tight flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" /> Lente IA
        </h1>
      </div>

      <div className="flex flex-col gap-6 pb-32">
        <AnimatedContainer delay={0.1}>
          <div className="glass-card p-6 text-center">
            <p className="text-white/60 text-sm mb-6">
              Tire uma foto de um monumento, prato típico ou paisagem e a IA te contará tudo sobre ele!
            </p>

            {!image ? (
              <div 
                onClick={async () => {
                  if (user) {
                    const canUseLens = await checkLimit(user.uid, 'lens');
                    if (!canUseLens) {
                      toast.error("Premium Necessário", {
                        description: "O recurso AI Lens é exclusivo para assinantes Premium. Assine agora para desbloquear!"
                      });
                      navigate('/upgrade');
                      return;
                    }
                  }
                  fileInputRef.current?.click();
                }}
                className="w-full aspect-[4/3] rounded-2xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-white/5 transition-colors"
              >
                <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center">
                  <Camera className="w-8 h-8" />
                </div>
                <span className="text-white font-semibold">Tirar Foto ou Fazer Upload</span>
              </div>
            ) : (
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
                <img src={image} alt="Uploaded" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <button 
                  onClick={() => {
                    setImage(null);
                    setResult(null);
                  }}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            <input 
              type="file" 
              accept="image/*" 
              capture="environment"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
        </AnimatedContainer>

        <AnimatePresence mode="wait">
          {loading && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-card p-8 flex flex-col items-center justify-center gap-4"
            >
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-white/60 text-sm font-semibold uppercase tracking-widest animate-pulse">A IA está analisando...</p>
            </motion.div>
          )}

          {result && !loading && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {result.error ? (
                <div className="glass-card p-6 border-red-500/30 flex flex-col items-center gap-4 text-center">
                  <div className="w-12 h-12 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center">
                    <X className="w-6 h-6" />
                  </div>
                  <p className="text-white font-medium">{result.error}</p>
                  <GlowButton onClick={() => setImage(null)} className="w-full h-10 text-xs">Tentar Outra Foto</GlowButton>
                </div>
              ) : (
                <div className="glass-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary/20 text-primary rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white">{result.name}</h2>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed mb-6">
                    {result.description}
                  </p>

                  <h3 className="text-xs font-bold text-white/60 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Info className="w-4 h-4" /> Dicas da IA
                  </h3>
                  <ul className="space-y-2">
                    {result.tips.map((tip: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-white/80 bg-white/5 p-3 rounded-xl border border-white/10">
                        <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MobileContainer>
  );
};
