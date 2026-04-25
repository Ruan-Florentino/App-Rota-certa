import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Search, 
  Plus, 
  Users, 
  MapPin, 
  Calendar, 
  Compass, 
  Crown,
  LayoutGrid,
  Rss
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { OptimizedImage } from '../components/OptimizedImage';
import { useStore } from '../store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { db, collection, query, where, getDocs, doc, updateDoc, increment, addDoc, serverTimestamp } from '../firebase';
import { Trip } from '../types';
import { getDynamicImage } from '../services/imageService';
import { createNotification } from '../services/notificationService';
import { LoadingState } from '../components/ui/LoadingState';
import { EmptyState } from '../components/ui/EmptyState';
import { WorldIcon, CommunityIcon, HeartIcon, CopyIcon, CalendarIcon, ExploreIcon } from '../components/icons';
import { socialService, SocialPost, Story } from '../services/social';
import { PostCard } from '../components/social/PostCard';
import { StoriesBar } from '../components/social/StoriesBar';

type ViewMode = 'feed' | 'discover';

export const CommunityScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, setCurrentTrip } = useStore(
    useShallow((s) => ({
      user: s.user,
      setCurrentTrip: s.setCurrentTrip
    }))
  );
  const [mode, setMode] = useState<ViewMode>('feed');
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [publicTrips, setPublicTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, [mode]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (mode === 'feed') {
        const [feedPosts, feedStories] = await Promise.all([
          socialService.getFeed(user?.uid),
          socialService.getStories()
        ]);
        setPosts(feedPosts);
        setStories(feedStories);
      } else {
        const q = query(collection(db, 'trips'), where('isPublic', '==', true));
        const snapshot = await getDocs(q);
        let trips = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Trip));
        trips.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        setPublicTrips(trips);
      }
    } catch (e) {
      console.error("Error loading social data:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeTrip = async (tripId: string, currentLikes: number, likedBy: string[] = []) => {
    if (!user) return;
    const isLiked = likedBy.includes(user.uid);
    const newLikedBy = isLiked ? likedBy.filter(id => id !== user.uid) : [...likedBy, user.uid];
    const newLikes = isLiked ? currentLikes - 1 : currentLikes + 1;

    setPublicTrips(prev => prev.map(t => t.id === tripId ? { ...t, likes: newLikes, likedBy: newLikedBy } : t));

    try {
      await updateDoc(doc(db, 'trips', tripId), { likes: newLikes, likedBy: newLikedBy });
    } catch (e) {
      console.error(e);
      loadData();
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] pb-32 overflow-y-auto no-scrollbar pt-safe">
      {/* Header */}
      <div className="px-6 py-8 flex flex-col gap-6 sticky top-0 bg-[#020617]/80 backdrop-blur-xl z-50 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              <CommunityIcon size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-white italic tracking-tighter uppercase leading-none">Comunidade</h1>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mt-1">Right Way Social</p>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/plan')}
            className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-background shadow-lg shadow-primary/20"
          >
            <Plus size={24} />
          </motion.button>
        </div>

        {/* Search */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-white/40" />
          </div>
          <input 
            type="text"
            placeholder="Buscar roteiros ou viajantes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-xs font-bold text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-all"
          />
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5">
          <button 
            onClick={() => setMode('feed')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'feed' ? 'bg-primary text-background shadow-lg' : 'text-white/40 hover:text-white'}`}
          >
            <Rss size={14} /> Feed
          </button>
          <button 
            onClick={() => setMode('discover')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'discover' ? 'bg-primary text-background shadow-lg' : 'text-white/40 hover:text-white'}`}
          >
            <Compass size={14} /> Descobrir
          </button>
        </div>
      </div>

      <div className="px-6 py-6">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="py-20 flex flex-col items-center justify-center"
            >
              <LoadingState type="spinner" />
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mt-4">Sincronizando com a rede...</p>
            </motion.div>
          ) : mode === 'feed' ? (
            <motion.div 
              key="feed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <StoriesBar stories={stories} />
              
              <div className="space-y-6">
                {posts.length > 0 ? (
                  posts.map(post => (
                    <PostCard key={post.id} post={post} currentUserId={user?.uid} />
                  ))
                ) : (
                  <div className="glass-card py-20 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                      <LayoutGrid className="text-white/20" size={32} />
                    </div>
                    <h3 className="text-lg font-black text-white tracking-tighter uppercase mb-2">Seu feed está vazio</h3>
                    <p className="text-xs text-white/40 max-w-[200px]">Siga outros viajantes ou comece a compartilhar suas aventuras!</p>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="discover"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid gap-6"
            >
              {publicTrips.length > 0 ? (
                publicTrips.map((trip, i) => (
                  <motion.div
                    key={trip.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-card p-0 overflow-hidden border-white/5 bg-white/5 group h-80 relative"
                  >
                    <OptimizedImage
                      src={trip.heroImage || `https://picsum.photos/seed/${trip.destination}/800/600`}
                      alt={trip.destination}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    
                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                      <img 
                        src={trip.authorPhoto || `https://ui-avatars.com/api/?name=${trip.authorName}&background=random`} 
                        className="w-5 h-5 rounded-full"
                        alt={trip.authorName}
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-[10px] font-black text-white uppercase tracking-tight">{trip.authorName}</span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 space-y-3">
                      <div>
                        <h4 className="text-2xl font-black text-white uppercase tracking-tighter leading-none mb-1">{trip.destination}</h4>
                        <div className="flex items-center gap-3 text-[10px] font-black text-white/50 uppercase tracking-widest">
                          <span className="flex items-center gap-1"><CalendarIcon size={12} /> {trip.itinerary?.length || 0} dias</span>
                          <span className="flex items-center gap-1"><Compass size={12} /> {trip.type}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between border-t border-white/10 pt-4">
                        <button 
                          onClick={() => handleLikeTrip(trip.id!, trip.likes || 0, trip.likedBy)}
                          className={`flex items-center gap-2 font-black text-sm ${(trip.likedBy || []).includes(user?.uid || '') ? 'text-primary' : 'text-white'}`}
                        >
                          <HeartIcon size={18} fill={(trip.likedBy || []).includes(user?.uid || '') ? 'currentColor' : 'none'} />
                          {trip.likes || 0}
                        </button>
                        <button 
                          onClick={() => {
                            setCurrentTrip(trip);
                            navigate('/results');
                          }}
                          className="bg-primary text-background px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl"
                        >
                          Ver Roteiro
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <EmptyState title="Nenhum roteiro público" description="Seja o primeiro a compartilhar um roteiro incrível!" icon={<CommunityIcon size={48} />} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
