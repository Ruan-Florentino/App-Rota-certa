import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  MapPin, 
  ChevronLeft, 
  Trash2, 
  Heart, 
  Clock, 
  DollarSign, 
  ArrowRight,
  Search,
  Filter,
  Navigation,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { db, doc, deleteDoc, collection, query, where, onSnapshot } from '../firebase';
import { Trip } from '../types';
import { getCityImage } from '../services/imageService';
import { AnimatedContainer, BlurCard } from '../components/MobileUI';

const TripCard: React.FC<{ trip: Trip; onClick: () => void; onDelete: (e: React.MouseEvent) => void; onFavorite: (e: React.MouseEvent) => void; isFavorite: boolean }> = ({ trip, onClick, onDelete, onFavorite, isFavorite }) => {
  const [images, setImages] = React.useState<string[]>([]);

  React.useEffect(() => {
    const loadImages = async () => {
      const imgs = await Promise.all([
        getCityImage(`${trip.destination} travel`),
        getCityImage(`${trip.destination} food`),
        getCityImage(`${trip.destination} hotel`)
      ]);
      setImages(imgs);
    };
    loadImages();
  }, [trip.destination]);

  return (
    <motion.div
      layout
      onClick={onClick}
      className="glass-card rounded-[32px] overflow-hidden group cursor-pointer hover:border-white/20 transition-all active:scale-[0.98] ios-shadow"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary/10 rounded-[20px] flex items-center justify-center overflow-hidden">
              {images[0] ? (
                <img src={images[0]} alt={trip.destination} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <MapPin className="w-7 h-7 text-primary" />
              )}
            </div>
            <div>
              <h3 className="text-[20px] font-black text-white tracking-tight leading-tight">{trip.destination}</h3>
              <div className="flex items-center gap-2 text-subtext text-[10px] font-bold uppercase tracking-widest mt-1">
                <Calendar className="w-3 h-3" />
                <span>{new Date(trip.startDate).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={onFavorite}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                isFavorite ? 'bg-red-500/10 text-red-500' : 'bg-white/5 text-subtext hover:text-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button 
              onClick={onDelete}
              className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-subtext hover:text-red-500 hover:bg-red-500/10 transition-all"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 py-4 border-y border-white/5">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black text-subtext uppercase tracking-widest">Duração</span>
            <div className="flex items-center gap-1 text-white font-bold text-[14px]">
              <Clock className="w-3 h-3 text-primary" />
              <span>{trip.itinerary.length} Dias</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black text-subtext uppercase tracking-widest">Orçamento</span>
            <div className="flex items-center gap-1 text-white font-bold text-[14px]">
              <DollarSign className="w-3 h-3 text-secondary" />
              <span>R$ {trip.budget}</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black text-subtext uppercase tracking-widest">Estilo</span>
            <div className="flex items-center gap-1 text-white font-bold text-[14px]">
              <Filter className="w-3 h-3 text-accent" />
              <span className="capitalize">{trip.type}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex -space-x-2">
            {images.map((img, i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-card bg-white/10 flex items-center justify-center overflow-hidden">
                <img 
                  src={img || `https://picsum.photos/seed/travel-${trip.id}-${i}/100/100`} 
                  alt="Activity" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
          <button className="text-primary text-[12px] font-black flex items-center gap-2 group-hover:translate-x-1 transition-transform">
            Ver detalhes <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export const SavedTripsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, trips, setTrips, deleteTrip, setCurrentTrip, favorites, toggleFavorite } = useStore();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filter, setFilter] = React.useState<'all' | 'favorites'>('all');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'trips'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tripsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Trip[];
      setTrips(tripsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, setTrips]);

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || favorites.includes(trip.id || '');
    return matchesSearch && matchesFilter;
  });

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Tem certeza que deseja excluir esta viagem?')) {
      try {
        await deleteDoc(doc(db, 'trips', id));
        deleteTrip(id);
      } catch (error) {
        console.error('Error deleting trip:', error);
      }
    }
  };

  const handleTripClick = (trip: any) => {
    setCurrentTrip(trip);
    navigate('/results');
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full shadow-[0_0_15px_rgba(37,99,235,0.3)]" 
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <AnimatedContainer delay={0.1}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')}
              className="w-12 h-12 glass-card rounded-[20px] flex items-center justify-center hover:bg-white/10 transition-all active:scale-95"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <div>
              <h1 className="text-[28px] font-black text-white tracking-tighter leading-tight">Minhas Viagens</h1>
              <p className="text-[12px] font-bold text-subtext uppercase tracking-widest mt-1">Seu histórico de aventuras</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/plan')}
            className="w-12 h-12 bg-primary rounded-[20px] flex items-center justify-center shadow-xl shadow-primary/30 text-white"
          >
            <Plus className="w-6 h-6" />
          </motion.button>
        </div>
      </AnimatedContainer>

      {/* Search & Filter */}
      <AnimatedContainer delay={0.2}>
        <div className="flex gap-3">
          <div className="flex-1 glass-card h-14 rounded-[20px] flex items-center px-4 gap-3 focus-within:border-primary/50 transition-all ios-shadow">
            <Search className="w-5 h-5 text-subtext" />
            <input 
              type="text"
              placeholder="Buscar destino..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-white text-sm font-bold outline-none w-full placeholder:text-subtext/50"
            />
          </div>
          <button 
            onClick={() => setFilter(filter === 'all' ? 'favorites' : 'all')}
            className={`w-14 h-14 rounded-[20px] flex items-center justify-center transition-all active:scale-95 ios-shadow ${
              filter === 'favorites' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'glass-card text-subtext'
            }`}
          >
            <Heart className={`w-6 h-6 ${filter === 'favorites' ? 'fill-current' : ''}`} />
          </button>
        </div>
      </AnimatedContainer>

      {/* Trips List */}
      <div className="flex flex-col gap-6">
        <AnimatePresence mode="popLayout">
          {filteredTrips.length > 0 ? (
            filteredTrips.map((trip, idx) => (
              <AnimatedContainer key={trip.id} delay={0.3 + idx * 0.05}>
                <TripCard 
                  trip={trip}
                  onClick={() => handleTripClick(trip)}
                  onDelete={(e) => handleDelete(e, trip.id!)}
                  onFavorite={(e) => {
                    e.stopPropagation();
                    trip.id && toggleFavorite(trip.id);
                  }}
                  isFavorite={favorites.includes(trip.id || '')}
                />
              </AnimatedContainer>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-24 h-24 bg-white/5 rounded-[40px] flex items-center justify-center mb-6 relative">
                <div className="absolute inset-0 bg-primary/10 rounded-[40px] blur-2xl" />
                <Navigation className="w-12 h-12 text-subtext opacity-20 relative z-10" />
              </div>
              <h3 className="text-[20px] font-bold text-white mb-2">
                {searchTerm ? 'Nenhum roteiro encontrado' : 'Nenhuma viagem salva'}
              </h3>
              <p className="text-subtext text-[14px] max-w-xs">
                {searchTerm ? 'Tente buscar por outro destino.' : 'Comece a planejar sua primeira aventura agora mesmo!'}
              </p>
              {!searchTerm && (
                <button 
                  onClick={() => navigate('/plan')}
                  className="mt-8 bg-primary px-8 h-14 rounded-[20px] font-bold text-white shadow-lg shadow-primary/20 active:scale-95 transition-all"
                >
                  Planejar Viagem
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
