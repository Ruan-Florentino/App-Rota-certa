import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Check, X, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { AnimatedContainer, GlowButton, NeonCard } from '../components/MobileUI';
import { useSubscription } from '../services/subscriptionService';
import { trackEvent } from '../services/analyticsService';
import { auth } from '../firebase';
import axios from 'axios';
import { apiUrl } from '../services/apiConfig';

export const UpgradeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { plan } = useSubscription();
  const isPro = plan === 'pro';
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  React.useEffect(() => {
    trackEvent('upgrade_viewed');
  }, []);

  const handleUpgrade = async () => {
    trackEvent('upgrade_clicked');
    
    if (isPro) {
       navigate(-1);
       return;
    }

    if (!auth) {
       navigate('/login');
       return;
    }

    const user = auth.currentUser;
    if (!user) {
       navigate('/login');
       return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      // Call backend to create subscription
      const response = await axios.post(apiUrl('/api/create-subscription'), {
        userId: user.uid,
        email: user.email
      });

      if (response.data && response.data.checkoutUrl) {
         window.location.href = response.data.checkoutUrl;
      } else {
         setErrorMsg("Erro ao iniciar pagamento. Tente novamente.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setErrorMsg("Falha ao comunicar com o servidor de pagamento.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 pb-24 overflow-y-auto">
      <AnimatedContainer className="max-w-md mx-auto space-y-8">
        
        <div className="text-center space-y-4 mt-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 mb-2">
            <Crown className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">🚀 Desbloqueie viagens ilimitadas</h1>
          <p className="text-white/60">O poder total da inteligência artificial para suas viagens.</p>
        </div>

        {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm text-center">
              {errorMsg}
            </div>
        )}

        <div className="grid gap-4">
          {/* Pro Plan */}
          <NeonCard className="p-6 border-amber-500/30 bg-gradient-to-b from-amber-500/10 to-transparent relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-amber-500 text-black text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
              Popular
            </div>
            <h3 className="text-xl font-bold mb-2 text-amber-400">Plano PRO</h3>
            <div className="text-3xl font-black mb-6">R$ 29,90<span className="text-sm font-normal text-white/40">/mês</span></div>
            
            <ul className="space-y-3 text-sm mb-8">
              <li className="flex items-center text-white/90">
                <Check className="w-4 h-4 text-amber-400 mr-3 shrink-0" />
                Roteiros ilimitados com IA
              </li>
              <li className="flex items-center text-white/90">
                <Check className="w-4 h-4 text-amber-400 mr-3 shrink-0" />
                AI Lens (explorar por câmera)
              </li>
              <li className="flex items-center text-white/90">
                <Check className="w-4 h-4 text-amber-400 mr-3 shrink-0" />
                Exportar para PDF
              </li>
              <li className="flex items-center text-white/90">
                <Check className="w-4 h-4 text-amber-400 mr-3 shrink-0" />
                Acesso à comunidade premium
              </li>
              <li className="flex items-center text-white/90">
                <Sparkles className="w-4 h-4 text-amber-400 mr-3 shrink-0" />
                🔥 Teste grátis por 7 dias
              </li>
            </ul>

            <GlowButton 
              onClick={handleUpgrade}
              disabled={isPro || isLoading}
              className="w-full h-12 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl flex justify-center items-center"
            >
              {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
              ) : isPro ? (
                  'Você já é PRO'
              ) : (
                  <>Assinar PRO Agora <ArrowRight className="w-4 h-4 ml-2" /></>
              )}
            </GlowButton>
          </NeonCard>

          {/* Free Plan */}
          <NeonCard className="p-6 border-white/5 bg-white/5 opacity-60">
            <h3 className="text-xl font-bold mb-2">Plano Free</h3>
            <div className="text-3xl font-black mb-6">R$ 0<span className="text-sm font-normal text-white/40">/mês</span></div>
            
            <ul className="space-y-3 text-sm">
              <li className="flex items-center text-white/80">
                <Check className="w-4 h-4 text-emerald-400 mr-3 shrink-0" />
                3 roteiros com IA por mês
              </li>
              <li className="flex items-center text-white/40">
                <X className="w-4 h-4 mr-3 shrink-0" />
                AI Lens
              </li>
              <li className="flex items-center text-white/40">
                <X className="w-4 h-4 mr-3 shrink-0" />
                Exportar PDF
              </li>
            </ul>
          </NeonCard>
        </div>

        <button 
          onClick={() => navigate(-1)}
          className="w-full text-center text-sm text-white/40 hover:text-white/60 py-4"
        >
          Voltar
        </button>

      </AnimatedContainer>
    </div>
  );
};
