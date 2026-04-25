import React, { useState, useEffect } from 'react';
import { 
  HomeIcon,
  PlusIcon, 
  ReceiptIcon, 
  PlaneIcon, 
  MapIcon, 
  GlobeIcon, 
  ChevronIcon, 
  CalendarIcon, 
  HotelIcon, 
  SparklesIcon, 
  RefreshIcon, 
  ExploreIcon,
  ArrowIcon
} from '../components/icons';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { MobileContainer, AnimatedContainer, NeonCard, GlowButton, Modal } from '../components/MobileUI';
import { useTranslation } from 'react-i18next';
import { getDynamicImage } from '../services/imageService';
import { subscribeToNotifications, markAllRead, AppNotification } from '../services/notificationService';
import { OptimizedImage } from '../components/OptimizedImage';
import { QuickActions } from '../components/home/QuickActions';
import { HomeHeader } from '../components/home/HomeHeader';
import { AirlineLogo } from '../components/airline/AirlineLogo';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

import { DestinationsCarousel } from '../components/DestinationsCarousel';
import { MOCK_DESTINATIONS } from '../data/destinationsMock';

import { getDestinationImage } from '../data/destinationImages';

const FLIGHT_DEALS = [
  { to: 'Miami', country: 'EUA', price: 'R$ 2.450', airline: 'American Airlines', img: getDestinationImage('Miami') },
  { to: 'Lisboa', country: 'Portugal', price: 'R$ 3.800', airline: 'TAP', img: getDestinationImage('Lisboa') },
  { to: 'Santiago', country: 'Chile', price: 'R$ 1.200', airline: 'LATAM', img: getDestinationImage('Santiago') },
];

const EXPLORE_DESTS = [
  { id: 'roma', name: 'Roma', country: 'Itália', recommendedDays: 5, avgPrice: 4000, category: ['Cultura', 'História'], description: 'A Cidade Eterna, repleta de história e arte.', lat: 41.9028, lng: 12.4964, image: getDestinationImage('Roma') },
  { id: 'cancun', name: 'Cancún', country: 'México', recommendedDays: 7, avgPrice: 3500, category: ['Praia', 'Relaxamento'], description: 'Paraíso caribenho com praias de areia branca e águas cristalinas.', lat: 21.1619, lng: -86.8515, image: getDestinationImage('Cancún') },
  { id: 'tokyo', name: 'Kyoto', country: 'Japão', recommendedDays: 6, avgPrice: 6000, category: ['Cultura', 'Tradição'], description: 'Antiga capital imperial do Japão, famosa por seus templos clássicos.', lat: 35.0116, lng: 135.7681, image: getDestinationImage('Kyoto') },
  { id: 'londres', name: 'Londres', country: 'Reino Unido', recommendedDays: 5, avgPrice: 5000, category: ['Cultura', 'Urbano'], description: 'Metrópole vibrante com uma mistura de história e modernidade.', lat: 51.5074, lng: -0.1278, image: getDestinationImage('Londres') },
  { id: 'new-york', name: 'Nova York', country: 'EUA', recommendedDays: 6, avgPrice: 4500, category: ['Urbano', 'Compras'], description: 'A cidade que nunca dorme, um centro global de arte, moda e finanças.', lat: 40.7128, lng: -74.0060, image: getDestinationImage('Nova York') },
];

import { formatCurrency, formatDateTime } from '../utils';
import { staggerContainer, staggerItem } from '../components/ui/MotionUtils';

export const HomeScreen: React.FC = () => {
  const { user, budget, expenses, exploreDestinations, setExploreDestinations, trips } = useStore(
    useShallow((s) => ({
      user: s.user,
      budget: s.budget,
      expenses: s.expenses,
      exploreDestinations: s.exploreDestinations,
      setExploreDestinations: s.setExploreDestinations,
      trips: s.trips
    }))
  );
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [flightDeals, setFlightDeals] = useState<any[]>(FLIGHT_DEALS);
  const [dailyTip, setDailyTip] = useState<string>('');
  const [loadingTip, setLoadingTip] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    let notificationUnsubscribe: (() => void) | null = null;

    if (!auth) return;

    // We strictly use onAuthStateChanged to manage the subscription
    // to ensure we have a valid, authenticated UID before starting the listener.
    const authUnsub = onAuthStateChanged(auth, (authUser) => {
      // Cleanup previous subscription if it exists
      if (notificationUnsubscribe) {
        notificationUnsubscribe();
        notificationUnsubscribe = null;
      }

      if (authUser && user && authUser.uid === user.uid) {
        notificationUnsubscribe = subscribeToNotifications(authUser.uid, (notifs) => {
          setNotifications(notifs);
        });
      }
    });

    return () => {
      if (authUnsub) authUnsub();
      if (notificationUnsubscribe) {
        notificationUnsubscribe();
      }
    };
  }, [user?.uid]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleOpenNotifications = () => {
    setShowNotifications(true);
    if (user && unreadCount > 0) {
      markAllRead(user.uid, notifications);
    }
  };

  useEffect(() => {
    const loadImages = async () => {
      const updatedFlights = await Promise.all(FLIGHT_DEALS.map(async (flight) => {
        const img = await getDynamicImage(flight.to, 'city', flight.to, flight.country);
        return { ...flight, img };
      }));
      setFlightDeals(updatedFlights);

      if (exploreDestinations.length === 0 || exploreDestinations.some(d => d.image?.includes('unsplash'))) {
        const updatedExplore = await Promise.all(EXPLORE_DESTS.map(async (dest) => {
          const image = await getDynamicImage(dest.name, 'city', dest.name, dest.country);
          return { ...dest, image };
        }));
        setExploreDestinations(updatedExplore);
      }
    };
    loadImages();
  }, [exploreDestinations.length, setExploreDestinations]);

  const fetchTip = async () => {
    setLoadingTip(true);
    try {
      setDailyTip("Viajar na baixa temporada pode economizar até 40% em passagens e hotéis.");
    } catch (error) {
      console.error("Error fetching daily tip:", error);
    } finally {
      setLoadingTip(false);
    }
  };

  useEffect(() => {
    fetchTip();
  }, [user?.travelInterests]);

  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const remaining = budget - totalSpent;
  const percentage = (totalSpent / budget) * 100;

  // Get dynamic suggestions based on budget
  const suggestions = exploreDestinations.length > 0 
    ? exploreDestinations.filter(d => d.avgPrice <= remaining).slice(0, 3).map(d => ({ city: d.name, days: d.recommendedDays }))
    : [
        { city: 'Buenos Aires', days: 3 },
        { city: 'Santiago', days: 4 },
        { city: 'Rio de Janeiro', days: 5 }
      ];

  const activeTrip = trips.length > 0 ? trips[0] : null;
  
  const getTripDays = (start: string, end: string) => {
    try {
      const diff = new Date(end).getTime() - new Date(start).getTime();
      return Math.ceil(diff / (1000 * 3600 * 24));
    } catch {
      return 0;
    }
  };

  const formatTripDates = (start: string, end: string) => {
    try {
      const startDate = new Date(start).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
      const endDate = new Date(end).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
      return `${startDate} - ${endDate}`;
    } catch {
      return '';
    }
  };

  return (
    <MobileContainer>
      {/* 1. HEADER CINEMATOGRÁFICO */}
      <HomeHeader 
        user={user} 
        notificationCount={unreadCount} 
        onOpenNotifications={handleOpenNotifications} 
      />

      <div className="flex flex-col gap-10 pb-32">
        
        {/* 2. CARD PRINCIPAL (ORÇAMENTO) */}
        <AnimatedContainer delay={0.1}>
          <div className="relative">
            {/* Background Glow */}
            <div className="absolute -inset-4 bg-primary/20 blur-[60px] rounded-full opacity-50 pointer-events-none" />
            
            <div className="glass-card p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
              
              <div className="flex flex-col gap-8">
                {/* Daily Tip Section */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-3 items-start backdrop-blur-xl">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <SparklesIcon className="w-4 h-4 text-primary" animated />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[9px] font-black text-primary uppercase tracking-widest">Dica do Dia</p>
                      <button 
                        onClick={fetchTip} 
                        disabled={loadingTip}
                        className="p-1 hover:bg-white/5 rounded-full transition-colors disabled:opacity-50"
                      >
                        <RefreshIcon className={`w-3 h-3 text-primary ${loadingTip ? 'animate-spin' : ''}`} animated />
                      </button>
                    </div>
                    {loadingTip ? (
                      <div className="space-y-2">
                        <div className="h-3 w-full bg-white/5 animate-pulse rounded" />
                        <div className="h-3 w-2/3 bg-white/5 animate-pulse rounded" />
                      </div>
                    ) : (
                      <p className="text-xs text-white/80 leading-relaxed italic">"{dailyTip}"</p>
                    )}
                  </div>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">{t('total_budget')}</p>
                    <h2 className="text-4xl font-black text-white tracking-tighter">
                      {formatCurrency(budget)}
                    </h2>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{t('remaining')}</p>
                    <p className="text-xl font-black text-primary tracking-tighter">
                      {formatCurrency(remaining)}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden relative border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(percentage, 100)}%` }}
                      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                      className={`absolute top-0 left-0 h-full ${percentage > 90 ? 'bg-red-500' : 'bg-primary'} shadow-[0_0_20px_rgba(0,229,255,0.6)]`}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] font-black text-white/20 uppercase tracking-widest">
                    <span>0%</span>
                    <span>{Math.round(percentage)}% Utilizado</span>
                    <span>100%</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <GlowButton onClick={() => navigate('/plan')} variant="accent" className="h-12 rounded-2xl">
                    <SparklesIcon className="w-4 h-4" animated /> Planejar
                  </GlowButton>
                  <GlowButton onClick={() => navigate('/expenses')} variant="secondary" className="h-12 rounded-2xl">
                    <ReceiptIcon className="w-4 h-4" animated /> {t('expense')}
                  </GlowButton>
                </div>
              </div>
            </div>
          </div>
        </AnimatedContainer>

        {/* 3. QUICK ACTIONS (CLEAN & MINIMAL) */}
        <QuickActions />

        {/* 4. ACTIVE TRIP / PLAN TRIP */}
        <AnimatedContainer delay={0.2}>
          {activeTrip ? (
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-[32px] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
              <div className="glass-card p-6 relative overflow-hidden border-primary/20">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">Viagem em Andamento</span>
                  </div>
                  <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10">
                    <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{getTripDays(activeTrip.startDate, activeTrip.endDate)} dias</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <GlobeIcon className="w-8 h-8 text-primary" animated />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-white tracking-tighter uppercase">{activeTrip.destination}</h4>
                    <p className="text-xs font-bold text-white/40 uppercase tracking-widest">{formatTripDates(activeTrip.startDate, activeTrip.endDate)}</p>
                  </div>
                </div>

                  <GlowButton 
                    onClick={() => {
                      useStore.getState().setCurrentTrip(activeTrip);
                      navigate('/results');
                    }}
                    variant="accent"
                    className="h-14 rounded-2xl shadow-[0_0_20px_rgba(0,229,255,0.2)]"
                  >
                    {t('view_itinerary')} <ChevronIcon direction="right" className="w-4 h-4" animated />
                  </GlowButton>
              </div>
            </div>
          ) : (
            <div className="glass-card p-8 border-dashed border-white/10 flex flex-col items-center text-center gap-6">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center">
                <PlaneIcon className="w-10 h-10 text-white/20" animated />
              </div>
              <div>
                <h4 className="text-xl font-black text-white tracking-tighter uppercase">Nenhuma viagem planejada</h4>
                <p className="text-xs text-white/40 mt-1">Comece a planejar sua próxima aventura agora mesmo!</p>
              </div>
              <GlowButton onClick={() => navigate('/plan')} variant="accent" className="max-w-[200px] h-12 rounded-xl">
                Planejar Agora
              </GlowButton>
            </div>
          )}
        </AnimatedContainer>

        {/* 5. DESTINATIONS CAROUSEL */}
        <AnimatedContainer delay={0.25}>
          <DestinationsCarousel
            destinations={MOCK_DESTINATIONS}
            onSelect={(id) => navigate(`/destination/${id}`)}
          />
        </AnimatedContainer>

        {/* 6. FLIGHT DEALS */}
        <AnimatedContainer delay={0.3}>
          <div className="space-y-6">
            <div className="flex justify-between items-end px-2">
              <div>
                <h3 className="text-2xl font-black text-white tracking-tighter uppercase">Ofertas</h3>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Melhores preços do momento</p>
              </div>
              <button onClick={() => navigate('/flights')} className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                Ver Todas <ChevronIcon direction="right" className="w-3 h-3" animated />
              </button>
            </div>
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              className="flex gap-4 overflow-x-auto pb-4 px-2 scrollbar-hide snap-carousel"
            >
              {flightDeals.map((flight, idx) => (
                <motion.div
                  key={idx}
                  variants={staggerItem as any}
                  whileHover={{ y: -10 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/flights')}
                  className="flex-shrink-0 w-64 glass-card p-0 overflow-hidden relative group border-white/5 snap-start"
                >
                  <div className="h-40 relative">
                    <OptimizedImage 
                      src={flight.img || ''} 
                      alt={flight.to} 
                      destinationName={flight.to}
                      category="destination"
                      className="w-full h-full group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 px-2 py-1 bg-primary/20 backdrop-blur-md rounded-md border border-primary/30">
                      <span className="text-[8px] font-black text-primary uppercase tracking-widest">Oferta Elite</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="mb-2">
                       <AirlineLogo airline={flight.airline} size="sm" showName />
                    </div>
                    <p className="text-base font-black text-white truncate mb-4 uppercase tracking-tight">{flight.to}</p>
                    <div className="flex items-end justify-between">
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">A partir de</span>
                        <span className="text-xl font-black text-emerald-400 tracking-tighter">{flight.price}</span>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-primary group-hover:text-black transition-all">
                        <ArrowIcon direction="right" className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </AnimatedContainer>



        {/* 5. DESCUBRA O MUNDO */}
        <AnimatedContainer delay={0.35}>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-lg font-semibold text-white tracking-tight">Descubra</h3>
              <button 
                onClick={() => navigate('/explore')} 
                className="text-[10px] font-semibold text-primary uppercase tracking-widest flex items-center gap-1"
              >
                {t('see_all')} <ChevronIcon direction="right" className="w-3 h-3" />
              </button>
            </div>
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              className="flex gap-4 overflow-x-auto pb-4 px-2 scrollbar-hide snap-carousel"
            >
              {exploreDestinations.slice(0, 5).map((dest, idx) => (
                <motion.div
                  key={idx}
                  variants={staggerItem as any}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/plan')}
                  className="flex-shrink-0 w-36 h-48 glass-card p-0 overflow-hidden relative group rounded-3xl snap-start"
                >
                  <OptimizedImage 
                    src={dest.image || ''} 
                    alt={dest.name} 
                    destinationName={dest.name}
                    category="destination"
                    className="w-full h-full group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-3 right-3 flex flex-col items-center">
                    <p className="text-sm font-bold text-white truncate text-center w-full">{dest.name}</p>
                    <p className="text-[9px] text-white/50 uppercase tracking-widest">{dest.country}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </AnimatedContainer>
        {/* Removed recent expenses for a cleaner UI, to be viewed mostly on planning tab */}

      </div>

      <Modal isOpen={showNotifications} onClose={() => setShowNotifications(false)} title="Notificações">
        <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-white/60 text-center py-8">Nenhuma notificação no momento.</p>
          ) : (
            notifications.map((notif) => (
              <div key={notif.id} className={`p-4 rounded-xl border ${notif.read ? 'bg-white/5 border-white/10' : 'bg-primary/10 border-primary/30'} backdrop-blur-md`}>
                <p className="text-sm text-white">{notif.message}</p>
                <p className="text-[10px] text-white/40 mt-2 uppercase tracking-widest">
                  {formatDateTime(notif.createdAt)}
                </p>
              </div>
            ))
          )}
        </div>
      </Modal>
    </MobileContainer>
  );
};

