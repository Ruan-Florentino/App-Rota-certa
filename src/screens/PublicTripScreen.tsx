import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { doc, getDoc, addDoc, collection, serverTimestamp, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';
import { Trip } from '../types';
import { formatCurrency } from '../utils';
import { useStore } from '../store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { LoadingScreen } from './LoadingScreen';
import { 
  ChevronLeft, 
  Copy, 
  Calendar, 
  DollarSign, 
  Compass, 
  MapPin,
  Sparkles,
  Share2,
  Lock,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { OptimizedImage } from '../components/OptimizedImage';
import { getDestinationImage } from '../services/imageService';
import { PremiumButton } from '../components/ui/PremiumButton';
import { PremiumCard } from '../components/ui/PremiumCard';
import { usePresence } from '../hooks/usePresence';
import { CalendarIcon, DollarIcon, ExploreIcon, CopyIcon, SparklesIcon, ShareIcon } from '../components/icons';

export const PublicTripScreen: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [cloning, setCloning] = useState(false);
  const [heroImage, setHeroImage] = useState<string>('');
  const { user, addTrip, setCurrentTrip } = useStore(
    useShallow((s) => ({
      user: s.user,
      addTrip: s.addTrip,
      setCurrentTrip: s.setCurrentTrip
    }))
  );
  const navigate = useNavigate();
  const location = useLocation();
  const hasAutoCloned = useRef(false);

  // Real-time presence
  const activeUsers = usePresence('trip', tripId || '');

  useEffect(() => {
    const fetchTrip = async () => {
      if (!tripId) return;
      try {
        const docRef = doc(db, 'trips', tripId);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const fetchedTrip = { id: snap.id, ...snap.data() } as Trip;
          setTrip(fetchedTrip);
          const image = await getDestinationImage(fetchedTrip.destination);
          setHeroImage(image);
        }
      } catch (error) {
        console.error('Error fetching public trip:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [tripId]);

  const handleClone = async () => {
    if (!user || !trip) {
      navigate('/login', { state: { returnTo: `/trip/${tripId}`, action: 'clone' } });
      return;
    }
    setCloning(true);
    try {
      const { id, ...tripData } = trip;
      const newTrip: Trip = {
        ...tripData,
        userId: user.uid,
        isPublic: false,
        likes: 0,
        clones: 0,
        createdAt: serverTimestamp(),
        status: 'planejada'
      };
      
      const docRef = await addDoc(collection(db, 'trips'), newTrip as any);
      const savedTrip = { ...newTrip, id: docRef.id };
      addTrip(savedTrip);
      setCurrentTrip(savedTrip);
      
      if (trip.id) {
        const tripRef = doc(db, 'trips', trip.id);
        await updateDoc(tripRef, { clones: increment(1) });
      }
      
      navigate('/results');
    } catch (error) {
      console.error('Error cloning trip:', error);
    } finally {
      setCloning(false);
    }
  };

  if (loading) return <LoadingScreen />;
  if (!trip || (!trip.isPublic && trip.userId !== user?.uid)) return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-6 text-center">
      <PremiumCard className="max-w-sm p-8 flex flex-col items-center">
        <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 shadow-2xl">
          <Lock className="w-10 h-10 text-white/20" />
        </div>
        <h2 className="text-2xl font-black text-white tracking-tighter uppercase mb-2">Roteiro Privado</h2>
        <p className="text-xs text-white/40 mb-8 leading-relaxed">Este roteiro não está disponível publicamente ou foi removido pelo autor.</p>
        <PremiumButton onClick={() => navigate('/')} className="w-full">
          Voltar ao Início
        </PremiumButton>
      </PremiumCard>
    </div>
  );

  return (
    <div className="min-h-screen bg-transparent pb-32 overflow-y-auto">
      <div className="max-w-md mx-auto relative">
        
        {/* Header Bar */}
        <div className="fixed top-0 left-0 right-0 z-50 p-6 flex items-center justify-between pointer-events-none max-w-md mx-auto">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 glass rounded-full flex items-center justify-center pointer-events-auto border border-white/10 shadow-xl active:scale-95 transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          
          <div className="flex items-center gap-2 pointer-events-auto">
             <PremiumButton 
                onClick={handleClone} 
                variant="primary" 
                size="sm"
                className="flex items-center gap-2"
                loading={cloning}
             >
                <CopyIcon size={14} />
                Clonar
             </PremiumButton>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative h-[480px] w-full overflow-hidden rounded-b-[48px] shadow-2xl">
          <OptimizedImage 
            src={heroImage} 
            alt={trip.destination} 
            destinationName={trip.destination}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          
          {/* Presence Indicator */}
          <div className="absolute top-24 left-8 right-8 z-10">
             <div className="flex flex-wrap items-center gap-2">
                <div className="flex -space-x-3">
                   {activeUsers.slice(0, 4).map((u: any, idx) => (
                      <motion.img 
                        key={u.id}
                        initial={{ scale: 0, x: -10 }}
                        animate={{ scale: 1, x: 0 }}
                        src={u.userPhoto || `https://ui-avatars.com/api/?name=${u.userName}&background=random`}
                        className="w-8 h-8 rounded-full border-2 border-background shadow-lg"
                        title={u.userName}
                      />
                   ))}
                   {activeUsers.length > 4 && (
                      <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border-2 border-background flex items-center justify-center text-[10px] font-black text-white">
                        +{activeUsers.length - 4}
                      </div>
                   )}
                </div>
                {activeUsers.length > 1 && (
                   <span className="text-[10px] font-black uppercase tracking-widest text-white/60 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                      Visualizando agora
                   </span>
                )}
             </div>
          </div>

          <div className="absolute bottom-12 left-8 right-8 z-10">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4"
            >
              <SparklesIcon size={14} />
              <span>Community Favorite</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-5xl font-black text-white tracking-tighter leading-[0.9] uppercase drop-shadow-2xl"
            >
              {trip.destination}
            </motion.h1>
            <p className="text-white/60 text-xs mt-6 line-clamp-2 max-w-[280px] leading-relaxed">
              {trip.summary || `Descubra os segredos de ${trip.destination} com este roteiro exclusivo de ${trip.itinerary.length} dias.`}
            </p>
          </div>
        </div>

        {/* Stats Panel */}
        <div className="px-6 -mt-10 relative z-20">
          <PremiumCard className="p-6 flex justify-between items-center bg-white/5 backdrop-blur-2xl">
            <div className="text-center">
               <CalendarIcon size={18} className="text-primary mx-auto mb-2" />
               <span className="block text-[8px] font-black text-white/40 uppercase tracking-widest">Duração</span>
               <span className="text-sm font-black text-white">{trip.itinerary.length} Dias</span>
            </div>
            <div className="w-[1px] h-10 bg-white/5" />
            <div className="text-center">
               <DollarIcon size={18} className="text-secondary mx-auto mb-2" />
               <span className="block text-[8px] font-black text-white/40 uppercase tracking-widest">Budget</span>
               <span className="text-sm font-black text-white">{formatCurrency(trip.budget)}</span>
            </div>
            <div className="w-[1px] h-10 bg-white/5" />
            <div className="text-center">
               <ExploreIcon size={18} className="text-accent mx-auto mb-2" />
               <span className="block text-[8px] font-black text-white/40 uppercase tracking-widest">Estilo</span>
               <span className="text-sm font-black text-white capitalize">{trip.type}</span>
            </div>
          </PremiumCard>
        </div>

        {/* Itinerary */}
        <div className="px-6 mt-12 space-y-10">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-white tracking-tighter uppercase">Itinerário Completo</h3>
            <div className="flex items-center gap-2 p-1 glass rounded-xl border border-white/10">
               <button className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <MapPin size={14} />
               </button>
               <button className="w-8 h-8 rounded-lg text-white/40 flex items-center justify-center hover:text-white transition-colors">
                  <MessageSquare size={14} />
               </button>
            </div>
          </div>
          
          <div className="space-y-12">
            {trip.itinerary.map((day, dIdx) => (
              <motion.div 
                key={dIdx}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Timeline line */}
                {dIdx < trip.itinerary.length - 1 && (
                  <div className="absolute top-12 left-6 bottom-[-48px] w-0.5 bg-gradient-to-b from-primary/30 to-transparent" />
                )}
                
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary),0.2)]">
                    <span className="text-primary font-black text-lg">{day.day}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-[0.2em]">Dia {day.day}</h4>
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Aventura planejada</p>
                  </div>
                </div>

                <div className="space-y-4 ml-6 pl-10">
                  {day.activities.map((activity, aIdx) => (
                    <PremiumCard key={aIdx} className="p-5 border-white/5 hover:border-primary/20 transition-all hover:translate-x-1">
                      <div className="flex justify-between items-start mb-3">
                        <div className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                          <span className="text-[9px] font-black text-primary uppercase tracking-widest">{activity.time}</span>
                        </div>
                        <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.15em]">{activity.category}</span>
                      </div>
                      <h5 className="text-base font-black text-white mb-2 tracking-tight">{activity.placeName}</h5>
                      <p className="text-xs text-white/40 leading-relaxed font-medium">{activity.description}</p>
                    </PremiumCard>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Global CTA */}
        <div className="p-8 mt-12 mb-20">
           <PremiumCard className="p-8 text-center bg-primary/5 border-primary/20">
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(var(--primary),0.3)]">
                 <CopyIcon size={32} className="text-primary" />
              </div>
              <h4 className="text-xl font-black text-white uppercase tracking-tighter mb-2">Gostou deste roteiro?</h4>
              <p className="text-xs text-white/40 mb-8 max-w-[200px] mx-auto leading-relaxed">Clone este roteiro para seus próprios planos e personalize como quiser!</p>
              <PremiumButton onClick={handleClone} loading={cloning} className="w-full">
                 Personalizar roteiro
              </PremiumButton>
           </PremiumCard>
        </div>
      </div>
    </div>
  );
};
