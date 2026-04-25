import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Crown, CheckCircle2, XCircle, Clock, ArrowRight } from 'lucide-react';
import { AnimatedContainer, GlowButton } from '../components/MobileUI';
import { useSubscription } from '../services/subscriptionService';

export const PaymentSuccessScreen: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { sync } = useSubscription();

  const status = searchParams.get('status') || 'pending';

  useEffect(() => {
    // Sync subscription status with backend right away
    sync();
  }, [sync]);

  const renderContent = () => {
    switch (status) {
      case 'success':
        return (
          <>
            <div className="w-24 h-24 bg-amber-500/20 rounded-full flex items-center justify-center mb-6 mx-auto border border-amber-500/30">
              <Crown className="w-12 h-12 text-amber-500" />
            </div>
            <h1 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">
              Pagamento <span className="text-amber-500">Confirmado!</span>
            </h1>
            <p className="text-white/60 mb-8 font-medium">
              Bem-vindo ao PRO 🎉 Sua assinatura foi ativada com sucesso.
            </p>
            <GlowButton 
              onClick={() => navigate('/')} 
              className="w-full flex items-center justify-center gap-2"
            >
              Começar a explorar <ArrowRight className="w-5 h-5" />
            </GlowButton>
          </>
        );
      case 'failure':
        return (
          <>
            <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mb-6 mx-auto border border-red-500/30">
              <XCircle className="w-12 h-12 text-red-500" />
            </div>
            <h1 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">
              Pagamento <span className="text-red-500">Falhou</span>
            </h1>
            <p className="text-white/60 mb-8 font-medium">
              Não foi possível concluir o seu pagamento. Tente novamente.
            </p>
            <GlowButton 
              onClick={() => navigate('/upgrade')} 
              className="w-full flex items-center justify-center gap-2"
            >
              Tentar de novo <ArrowRight className="w-5 h-5" />
            </GlowButton>
          </>
        );
      case 'pending':
      default:
        return (
          <>
            <div className="w-24 h-24 bg-yellow-500/20 rounded-full flex items-center justify-center mb-6 mx-auto border border-yellow-500/30">
              <Clock className="w-12 h-12 text-yellow-500" />
            </div>
            <h1 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">
              Pagamento <span className="text-yellow-500">em Análise</span>
            </h1>
            <p className="text-white/60 mb-8 font-medium">
              Avisaremos quando o pagamento for confirmado.
            </p>
            <GlowButton 
              onClick={() => navigate('/')} 
              className="w-full flex items-center justify-center gap-2"
            >
              Voltar ao Início <ArrowRight className="w-5 h-5" />
            </GlowButton>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 text-center">
      <AnimatedContainer className="max-w-md w-full glass-card p-8 border-white/10 rounded-[32px]">
        {renderContent()}
      </AnimatedContainer>
    </div>
  );
};
