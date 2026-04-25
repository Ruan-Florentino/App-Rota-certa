import React from "react";
import { motion, AnimatePresence } from "motion/react";
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
  Plus,
  Copy,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { useShallow } from "zustand/react/shallow";
import {
  db,
  doc,
  deleteDoc,
  collection,
  query,
  where,
  onSnapshot,
} from "../firebase";
import { Trip } from "../types";
import { formatCurrency, formatDate } from "../utils";
import { getDynamicImage } from "../services/imageService";
import { 
  SparklesIcon, 
  HeartIcon, 
  CopyIcon, 
  CalendarIcon, 
  ExploreIcon, 
  WorldIcon, 
  TrophyIcon, 
  WalletIcon,
  PlaneIcon,
  ShieldIcon,
  LogoutIcon,
  SettingsIcon,
  BellIcon,
  AwardIcon,
  MapPinIcon,
  SearchIcon,
  ClockIcon,
  NavigationIcon
} from '../components/icons';
import { PremiumCard } from '../components/ui/PremiumCard';
import { PremiumButton } from '../components/ui/PremiumButton';
import { LoadingState } from '../components/ui/LoadingState';
import { EmptyState } from '../components/ui/EmptyState';
import { 
  AnimatedContainer,
  Modal
} from '../components/MobileUI';

const TripCard: React.FC<{
  trip: Trip;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
  onFavorite: (e: React.MouseEvent) => void;
  onComplete: (e: React.MouseEvent) => void;
  isFavorite: boolean;
}> = ({ trip, onClick, onDelete, onFavorite, onComplete, isFavorite }) => {
  const [images, setImages] = React.useState<string[]>([]);

  React.useEffect(() => {
    const loadImages = async () => {
      const imgs = await Promise.all([
        getDynamicImage(`${trip.destination} travel`),
        getDynamicImage(`${trip.destination} food`),
        getDynamicImage(`${trip.destination} hotel`),
      ]);
      setImages(imgs);
    };
    loadImages();
  }, [trip.destination]);

  return (
      <motion.div
        layout
        onClick={onClick}
        className="glass-card p-0 overflow-hidden group cursor-pointer border-white/5 hover:border-primary/30 transition-all duration-500"
      >
        <div className="h-48 relative">
          <img
            src={images[0] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&h=300'}
            alt={trip.destination}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent" />
          
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={onComplete}
              className="w-10 h-10 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl flex items-center justify-center text-secondary hover:text-white hover:bg-secondary/20 hover:border-secondary/30 transition-all"
              title="Concluir Viagem"
            >
              <CheckCircle2 className="w-5 h-5" />
            </button>
            <button
              onClick={onFavorite}
              className={`w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-md border transition-all ${
                isFavorite
                  ? "bg-red-500/20 border-red-500/30 text-red-500"
                  : "bg-black/40 border-white/10 text-white/60 hover:text-white"
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
            </button>
            <button
              onClick={onDelete}
              className="w-10 h-10 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl flex items-center justify-center text-white/60 hover:text-red-500 hover:bg-red-500/20 hover:border-red-500/30 transition-all"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          <div className="absolute bottom-6 left-6 right-6">
            <h3 className="text-3xl font-black text-white tracking-tighter uppercase leading-none mb-2">
              {trip.destination}
            </h3>
            <div className="flex items-center gap-2 text-white/60 text-[10px] font-bold uppercase tracking-widest">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(trip.startDate)}</span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-[#020617]/50 backdrop-blur-md">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="flex flex-col gap-1">
              <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Duração</span>
              <div className="flex items-center gap-1.5 text-white font-black text-sm">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>{trip.itinerary.length} Dias</span>
              </div>
            </div>
        <div className="flex flex-col gap-1">
          <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Budget</span>
          <div className="flex items-center gap-1.5 text-white font-black text-sm">
            <WalletIcon size={14} className="text-secondary" />
            <span>{formatCurrency(trip?.budget || 0)}</span>
          </div>
        </div>
            <div className="flex flex-col gap-1">
              <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">
                {trip.isPublic ? 'Clones' : 'Estilo'}
              </span>
              <div className="flex items-center gap-1.5 text-white font-black text-sm">
                {trip.isPublic ? (
                  <>
                    <Copy className="w-3.5 h-3.5 text-accent" />
                    <span>{trip.clones || 0}</span>
                  </>
                ) : (
                  <>
                    <Filter className="w-3.5 h-3.5 text-accent" />
                    <span className="capitalize">{trip.type}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-white/5">
            <div className="flex -space-x-3">
              {images.map((img, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-[#020617] bg-white/10 flex items-center justify-center overflow-hidden shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                >
                  <img
                    src={img || `https://picsum.photos/seed/travel-${trip.id}-${i}/100/100`}
                    alt="Activity"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>
            <button className="text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group-hover:translate-x-2 transition-transform">
              Ver detalhes <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
  );
};

export const SavedTripsScreen: React.FC = () => {
  const navigate = useNavigate();
  const {
    user,
    trips,
    setTrips,
    deleteTrip,
    completeTrip,
    setCurrentTrip,
    favorites,
    toggleFavorite,
  } = useStore(
    useShallow((s) => ({
      user: s.user,
      trips: s.trips,
      setTrips: s.setTrips,
      deleteTrip: s.deleteTrip,
      completeTrip: s.completeTrip,
      setCurrentTrip: s.setCurrentTrip,
      favorites: s.favorites,
      toggleFavorite: s.toggleFavorite,
    }))
  );
  const [searchTerm, setSearchTerm] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filter, setFilter] = React.useState<"all" | "favorites">("all");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user || !db) return;

    const q = query(collection(db, "trips"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tripsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Trip[];
      setTrips(tripsData);
      setLoading(false);
    }, (error) => {
      console.error("SavedTrips snapshot error:", error);
    });

    return () => unsubscribe();
  }, [user, setTrips]);

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch = trip.destination
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || favorites.includes(trip.id || "");
    return matchesSearch && matchesFilter;
  });

  const [tripToDelete, setTripToDelete] = React.useState<string | null>(null);

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setTripToDelete(id);
  };

  const confirmDelete = async () => {
    if (tripToDelete) {
      try {
        await deleteDoc(doc(db, "trips", tripToDelete));
        deleteTrip(tripToDelete);
      } catch (error) {
        console.error("Error deleting trip:", error);
      }
      setTripToDelete(null);
    }
  };

  const handleTripClick = (trip: any) => {
    setCurrentTrip(trip);
    navigate("/results");
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
        <div className="flex items-center justify-between pt-safe">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="w-12 h-12 glass rounded-2xl flex items-center justify-center border border-white/10 hover:bg-white/10 transition-all active:scale-95 shadow-xl"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <div>
              <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">
                Viagens
              </h1>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mt-1">
                Seu legado de aventuras
              </p>
            </div>
          </div>
          <PremiumButton
            variant="glass"
            size="icon"
            onClick={() => navigate("/plan")}
            className="w-12 h-12 rounded-2xl"
          >
            <Plus className="w-6 h-6" />
          </PremiumButton>
        </div>
      </AnimatedContainer>

      {/* Search & Filter */}
      <AnimatedContainer delay={0.2}>
        <div className="flex gap-3">
          <PremiumCard className="flex-1 glass border-white/5 h-14 flex items-center px-5 gap-3 transition-all p-0">
            <SearchIcon size={20} className="text-white/20" />
            <input
              type="text"
              placeholder="Buscar destino..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-white text-sm font-black outline-none w-full placeholder:text-white/20 uppercase tracking-widest"
            />
          </PremiumCard>
          <button
            onClick={() => setFilter(filter === "all" ? "favorites" : "all")}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all active:scale-95 border ${
              filter === "favorites"
                ? "bg-red-500/20 border-red-500/30 text-red-500 shadow-xl"
                : "glass border-white/10 text-white/60 hover:text-white"
            }`}
          >
            <HeartIcon size={20} fill={filter === "favorites" ? "currentColor" : "none"} />
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
                  onDelete={(e) => handleDeleteClick(e, trip.id!)}
                  onFavorite={(e) => {
                    e.stopPropagation();
                    trip.id && toggleFavorite(trip.id);
                  }}
                  onComplete={(e) => {
                    e.stopPropagation();
                    if (trip.id) {
                      completeTrip(trip.id);
                      import('sonner').then(m => m.toast.success("Parabéns! Viagem concluída e adicionada ao seu mapa."));
                    }
                  }}
                  isFavorite={favorites.includes(trip.id || "")}
                />
              </AnimatedContainer>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mb-6 relative border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                <div className="absolute inset-0 bg-primary/10 rounded-3xl blur-2xl" />
                <Navigation className="w-10 h-10 text-white/20 relative z-10" />
              </div>
              <h3 className="text-2xl font-black text-white tracking-tighter uppercase mb-2">
                {searchTerm
                  ? "Nenhum roteiro encontrado"
                  : "Nenhuma viagem salva"}
              </h3>
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest max-w-xs">
                {searchTerm
                  ? "Tente buscar por outro destino."
                  : "Comece a planejar sua primeira aventura agora mesmo!"}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => navigate("/plan")}
                  className="mt-8 bg-primary/20 border border-primary/30 px-8 h-12 rounded-xl font-black text-primary uppercase tracking-widest shadow-[0_0_15px_rgba(0,229,255,0.2)] active:scale-95 transition-all hover:bg-primary/30"
                >
                  Planejar Viagem
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Modal isOpen={!!tripToDelete} onClose={() => setTripToDelete(null)} title="Excluir Viagem">
        <div className="flex flex-col gap-4 text-center">
          <p className="text-white/80">Tem certeza que deseja excluir esta viagem? Esta ação não pode ser desfeita.</p>
          <div className="flex gap-3 mt-4">
            <button 
              onClick={() => setTripToDelete(null)}
              className="flex-1 py-3 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-all"
            >
              Cancelar
            </button>
            <button 
              onClick={confirmDelete}
              className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all"
            >
              Excluir
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
