import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  MapPin, 
  Camera, 
  Smile, 
  Hash, 
  ChevronRight, 
  Send,
  Plus,
  Image as ImageIcon,
  Map as MapIcon,
  Tag
} from 'lucide-react';
import { useSocialStore } from '../../../store/socialStore';
import { useProfileStore } from '../../../store/profileStore';
import { useStore } from '../../../store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { toast } from 'sonner';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose }) => {
  const { createPost } = useSocialStore(useShallow((s) => ({ createPost: s.createPost })));
  const { profile } = useProfileStore(useShallow((s) => ({ profile: s.profile })));
  const { trips } = useStore(useShallow((s) => ({ trips: s.trips })));
  
  const [caption, setCaption] = React.useState('');
  const [selectedTripId, setSelectedTripId] = React.useState('');
  const [photos, setPhotos] = React.useState<string[]>([]);
  const [location, setLocation] = React.useState({ cityName: '', country: '', countryCode: '' });
  const [tags, setTags] = React.useState<string[]>([]);
  const [tagInput, setTagInput] = React.useState('');
  const [mood, setMood] = React.useState<string>('adventurous');
  
  const moods = [
    { id: 'adventurous', label: 'Aventurero', icon: '⛺' },
    { id: 'chill', label: 'Relax', icon: '🏖️' },
    { id: 'cultural', label: 'Cultural', icon: '🏛️' },
    { id: 'foodie', label: 'Gastronômico', icon: '🍝' },
    { id: 'party', label: 'Festa', icon: '🎉' },
    { id: 'romantic', label: 'Romântico', icon: '❤️' },
  ];

  const handleCreate = () => {
    if (!caption.trim()) {
      toast.error('Adicione uma legenda à sua publicação!');
      return;
    }

    if (photos.length === 0 && !selectedTripId) {
      toast.error('Adicione pelo menos uma foto ou selecione uma viagem!');
      return;
    }

    const currentUser = {
      id: 'user-1',
      name: profile?.name || 'Você',
      username: profile?.username || 'voce',
      avatar: profile?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=you',
      followers: 432,
      following: 120,
      tripsCount: profile?.stats.countriesVisited || 0,
      countriesCount: profile?.stats.countriesVisited || 0,
    };

    let postPhotos = photos;
    let postLocation = location;

    if (selectedTripId) {
      const trip = trips.find(t => t.id === selectedTripId);
      if (trip) {
        if (postPhotos.length === 0) postPhotos = trip.images || [`https://picsum.photos/seed/${trip.destination}/800/1000`];
        if (!postLocation.cityName) postLocation = { 
          cityName: trip.destination, 
          country: trip.country || 'Desconhecido', 
          countryCode: 'US' 
        };
      }
    }

    createPost({
      userId: 'user-1',
      user: currentUser,
      photos: postPhotos.length > 0 ? postPhotos : ['https://picsum.photos/seed/travel/800/1000'],
      caption,
      location: postLocation.cityName ? postLocation : { cityName: 'Explorando', country: 'O Mundo', countryCode: 'WW' },
      tags,
      mood: mood as any,
      tripId: selectedTripId,
    });

    toast.success('Publicação enviada com sucesso! 🚀');
    onClose();
    // Reset
    setCaption('');
    setPhotos([]);
    setTags([]);
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[1000]"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 top-10 bg-[#020617] rounded-t-[32px] z-[1001] flex flex-col border-t border-white/10"
          >
            <div className="flex items-center justify-between p-6 border-bottom border-white/5">
              <button onClick={onClose} className="p-2 text-white/60"><X /></button>
              <h2 className="text-lg font-black text-white uppercase tracking-tighter">Nova Publicação</h2>
              <button 
                onClick={handleCreate}
                className="bg-primary text-black px-6 py-2 rounded-full font-black text-sm uppercase tracking-widest active:scale-95 transition-all"
              >
                Postar
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Photo Select Placeholder */}
              <div 
                className="aspect-square rounded-3xl bg-white/5 border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-white/10 transition-all group overflow-hidden"
                onClick={() => setPhotos([...photos, `https://picsum.photos/seed/${Math.random()}/800/1000`])}
              >
                {photos.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2 w-full h-full p-2">
                    {photos.map((p, i) => (
                      <img key={i} src={p} className="w-full h-full object-cover rounded-xl" referrerPolicy="no-referrer" />
                    ))}
                    <div className="flex items-center justify-center bg-white/5 rounded-xl">
                      <Plus className="text-white/20" />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <Camera size={32} />
                    </div>
                    <div className="text-center">
                      <p className="text-white font-bold">Adicionar Fotos</p>
                      <p className="text-white/40 text-xs">Selecione fotos da sua galeria</p>
                    </div>
                  </>
                )}
              </div>

              {/* Caption */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Legenda</label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Conte-nos sobre sua aventura..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-primary/50 transition-all min-h-[120px] resize-none"
                />
              </div>

              {/* Trip Select */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Vincular Viagem</label>
                  <MapIcon size={16} className="text-primary" />
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 scroll-hide">
                  {trips.length > 0 ? trips.map(trip => (
                    <button
                      key={trip.id}
                      onClick={() => setSelectedTripId(selectedTripId === trip.id ? '' : (trip.id || ''))}
                      className={`flex-shrink-0 px-4 py-3 rounded-2xl border transition-all ${
                        selectedTripId === trip.id 
                          ? 'bg-primary/20 border-primary text-primary' 
                          : 'bg-white/5 border-white/10 text-white/60'
                      }`}
                    >
                      <span className="text-xs font-bold">{trip.destination}</span>
                    </button>
                  )) : (
                    <p className="text-[10px] text-white/20 uppercase font-black">Nenhuma viagem encontrada</p>
                  )}
                </div>
              </div>

              {/* Mood */}
              <div className="space-y-4">
                 <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Vibe da Viagem</label>
                 <div className="grid grid-cols-3 gap-3">
                   {moods.map(m => (
                     <button
                       key={m.id}
                       onClick={() => setMood(m.id)}
                       className={`p-3 rounded-2xl border flex items-center justify-center gap-2 transition-all ${
                         mood === m.id 
                           ? 'bg-secondary/20 border-secondary text-secondary' 
                           : 'bg-white/5 border-white/10 text-white/40'
                       }`}
                     >
                       <span className="text-lg">{m.icon}</span>
                       <span className="text-[10px] font-bold uppercase">{m.label}</span>
                     </button>
                   ))}
                 </div>
              </div>

              {/* Tags */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Tags</label>
                <div className="flex gap-2 mb-3 flex-wrap">
                  {tags.map(t => (
                    <span key={t} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-primary font-bold">
                      #{t}
                      <button onClick={() => setTags(tags.filter(tag => tag !== t))} className="ml-2">×</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-2">
                    <Hash size={14} className="text-white/20" />
                    <input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      placeholder="Nova tag..."
                      className="bg-transparent outline-none text-white text-sm w-full"
                    />
                  </div>
                  <button onClick={addTag} className="p-2 bg-primary/20 text-primary rounded-xl border border-primary/20">
                    <Plus />
                  </button>
                </div>
              </div>

              <div className="h-20" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
