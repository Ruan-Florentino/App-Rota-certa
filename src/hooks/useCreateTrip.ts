import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TripService, TripInput } from '../services/trips';
import { toast } from 'sonner';

export function useCreateTrip() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const create = async (data: TripInput) => {
    setLoading(true);
    setError(null);
    
    const toastId = toast.loading('Criando sua viagem...');
    
    try {
      const result = await TripService.create(data);
      
      toast.success('Viagem criada! 🎉', {
        id: toastId,
        description: 'Agora vamos planejar cada detalhe',
      });
      
      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate([50, 30, 80]);
      }
      
      // Navegar para planejamento
      navigate(`/plan/${result.id}`, {
        state: { fromCreate: true, trip: result.data },
      });
      
      return result;
      
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(message);
      
      toast.error('Ops!', {
        id: toastId,
        description: message,
        action: {
          label: 'Tentar novamente',
          onClick: () => create(data),
        },
      });
      
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }
      
      throw err;
      
    } finally {
      setLoading(false);
    }
  };
  
  return { create, loading, error };
}
