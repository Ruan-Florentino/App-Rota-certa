import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Bell, Plus, MapPin, Trash2, Activity, Plane, DollarSign } from 'lucide-react';
import { auth } from '../firebase';
import { trackEvent } from '../services/analyticsService';
import axios from 'axios';
import { apiUrl } from '../services/apiConfig';
import { PremiumButton } from '../components/ui/PremiumButton';
import { PremiumCard } from '../components/ui/PremiumCard';
import { PremiumInput } from '../components/ui/PremiumInput';
import { AlertsIcon, PlaneIcon, MapIcon, TrashIcon, DollarIcon, BellIcon } from '../components/icons';
import { LoadingState } from '../components/ui/LoadingState';
import { EmptyState } from '../components/ui/EmptyState';

export const PriceAlertScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prefilledDestination = location.state?.destination || '';

  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [origin, setOrigin] = useState('SAO - São Paulo'); 
  const [destination, setDestination] = useState(prefilledDestination);
  const [targetPrice, setTargetPrice] = useState(2500);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    trackEvent('price_alerts_viewed');
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    if (!auth) {
        setLoading(false);
        return;
    }
    const user = auth.currentUser;
    if (!user) {
        setLoading(false);
        return;
    }
    try {
      const response = await axios.get(apiUrl(`/api/alerts/${user.uid}`));
      setAlerts(response.data || []);
    } catch (err) {
      console.error("Failed to fetch alerts", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAlert = async () => {
    if (!auth) {
        navigate('/login');
        return;
    }
    const user = auth.currentUser;
    if (!user) {
        navigate('/login');
        return;
    }
    if (!origin || !destination) return;

    try {
      setIsCreating(true);
      await axios.post(apiUrl('/api/alerts'), {
          userId: user.uid,
          origin,
          destination,
          targetPrice
      });
      trackEvent('price_alert_created', { destination, targetPrice });
      setDestination('');
      setTargetPrice(2500);
      fetchAlerts();
    } catch (err) {
      console.error("Error creating alert", err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteAlert = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
       await axios.delete(apiUrl(`/api/alerts/${id}`));
       setAlerts(prev => prev.filter(a => a.id !== id));
       trackEvent('price_alert_deleted');
    } catch (err) {
       console.error("Error deleting alert", err);
    }
  };

  return (
    <div className="min-h-screen bg-transparent p-6 pb-24 overflow-y-auto pt-safe">
      <div className="max-w-md mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 glass rounded-full flex items-center justify-center text-white/70 hover:text-white transition-all shadow-xl border border-white/10"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shadow-[0_0_20px_rgba(var(--primary),0.2)] border border-primary/20">
              <AlertsIcon size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">Alertas de Preço</h1>
              <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Monitore passagens</p>
            </div>
          </div>
        </div>

        {/* Create Alert Form */}
        <PremiumCard className="p-6">
            <h2 className="text-sm font-black text-white/90 mb-6 flex items-center gap-2 uppercase tracking-widest">
               <Plus className="w-4 h-4 text-primary" /> 
               Monitorar Nova Rota
            </h2>
            
            <div className="space-y-4">
                <PremiumInput 
                  label="Origem"
                  value={origin}
                  onChange={setOrigin}
                  placeholder="Ex: São Paulo (SAO)"
                  icon={<PlaneIcon size={18} />}
                />

                <PremiumInput 
                  label="Destino"
                  value={destination}
                  onChange={setDestination}
                  placeholder="Ex: Paris (CDG)"
                  icon={<MapIcon size={18} />}
                />

                <div className="pt-2 space-y-4">
                   <div className="flex items-center justify-between">
                       <label className="text-[10px] uppercase tracking-widest text-white/40 font-black">Preço Alvo</label>
                       <div className="flex items-center gap-1 text-primary font-black">
                         <span className="text-sm">R$</span>
                         <span className="text-lg">{targetPrice}</span>
                       </div>
                   </div>
                   
                   <div className="relative h-6 flex items-center">
                     <input 
                        type="range"
                        min="500"
                        max="8000"
                        step="100"
                        value={targetPrice}
                        onChange={(e) => setTargetPrice(Number(e.target.value))}
                        className="w-full transition-all"
                        style={{
                          WebkitAppearance: 'none',
                          background: `linear-gradient(to right, #00E5FF 0%, #00E5FF ${(targetPrice-500)/(8000-500)*100}%, rgba(255,255,255,0.1) ${(targetPrice-500)/(8000-500)*100}%, rgba(255,255,255,0.1) 100%)`,
                          height: '4px',
                          borderRadius: '2px',
                          outline: 'none'
                        }}
                     />
                     <style>{`
                        input[type='range']::-webkit-slider-thumb {
                          -webkit-appearance: none;
                          height: 20px;
                          width: 20px;
                          border-radius: 50%;
                          background: #FFFFFF;
                          box-shadow: 0 0 10px rgba(0,229,255,0.5);
                          cursor: pointer;
                          border: 4px solid #00E5FF;
                        }
                     `}</style>
                   </div>
                   
                   <div className="flex justify-between text-[8px] text-white/20 font-black tracking-widest uppercase">
                      <span>Mín: R$ 500</span>
                      <span>Máx: R$ 8.000</span>
                   </div>
                </div>
                
                <div className="pt-4">
                  <PremiumButton 
                      variant="primary"
                      onClick={handleCreateAlert}
                      disabled={isCreating || !origin || !destination}
                      className="w-full"
                      loading={isCreating}
                  >
                      Ativar Monitoramento
                  </PremiumButton>
                </div>
            </div>
        </PremiumCard>

        {/* Existing Alerts */}
        <div className="space-y-4 pt-4">
            <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] px-1">Seus Alertas Ativos</h3>
            
            {loading ? (
                <div className="glass-card py-12 flex items-center justify-center">
                  <LoadingState type="spinner" message="Carregando seus alertas..." />
                </div>
            ) : alerts.length === 0 ? (
                <EmptyState 
                  title="Nenhum alerta"
                  description="Você ainda não configurou alertas de preço para suas viagens."
                  icon={<BellIcon size={48} />}
                />
            ) : (
                <div className="space-y-4">
                    {alerts.map(alert => (
                        <PremiumCard key={alert.id} className="p-4 hover:border-primary/40 transition-all group">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="flex flex-col">
                                          <span className="text-xs font-bold text-white leading-none">{alert.origin}</span>
                                        </div>
                                        <div className="flex-1 h-[1px] bg-white/10 relative">
                                          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 glass border border-white/10 rounded-full flex items-center justify-center">
                                            <PlaneIcon size={8} className="text-primary rotate-90" />
                                          </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                          <span className="text-xs font-bold text-white leading-none">{alert.destination}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                       <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-primary/10 border border-primary/20">
                                           <DollarIcon size={12} className="text-primary" />
                                           <span className="text-[11px] font-black text-primary leading-none">R$ {alert.targetPrice}</span>
                                       </div>
                                       {alert.lastPrice && (
                                           <div className="flex items-center gap-1 text-[10px] text-white/40 font-bold uppercase tracking-wider">
                                               <span>Atual:</span>
                                               <span className={alert.lastPrice <= alert.targetPrice ? "text-green-400" : "text-white/60"}>
                                                  R$ {Math.floor(alert.lastPrice)}
                                               </span>
                                           </div>
                                       )}
                                    </div>
                                </div>
                                <button 
                                   onClick={(e) => handleDeleteAlert(alert.id, e)}
                                   className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-xl"
                                >
                                    <TrashIcon size={18} />
                                </button>
                            </div>
                        </PremiumCard>
                    ))}
                </div>
            )}
        </div>

      </div>
    </div>
  );
};
