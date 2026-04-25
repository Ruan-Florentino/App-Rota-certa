import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Post } from '../../../types/social';
import { useSocialStore } from '../../../store/socialStore';
import { CommentsSheet } from './CommentsSheet';
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  MoreHorizontal, 
  ChevronLeft, 
  ChevronRight,
  Map as MapIcon,
  Check
} from 'lucide-react';

interface Props {
  post: Post;
}

export function PostCard({ post }: Props) {
  const navigate = useNavigate();
  const { toggleLike, toggleSave } = useSocialStore();
  const [photoIdx, setPhotoIdx] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [showFullCaption, setShowFullCaption] = useState(false);
  const [doubleTapHeart, setDoubleTapHeart] = useState(false);
  
  const handleDoubleTap = () => {
    if (!post.liked) toggleLike(post.id);
    setDoubleTapHeart(true);
    setTimeout(() => setDoubleTapHeart(false), 800);
  };
  
  const handlePhotoChange = (dir: 'next' | 'prev') => {
    if (dir === 'next' && photoIdx < post.photos.length - 1) setPhotoIdx(photoIdx + 1);
    if (dir === 'prev' && photoIdx > 0) setPhotoIdx(photoIdx - 1);
  };
  
  return (
    <>
      <article className="post-card">
        {/* Header */}
        <header className="post-header">
          <button
            className="post-user"
            onClick={() => navigate(`/u/${post.user.username}`)}
          >
            <div className="post-avatar-ring">
              <img src={post.user.avatar} alt={post.user.name} className="post-avatar" referrerPolicy="no-referrer" />
            </div>
            <div className="post-user-info">
              <div className="post-user-name">
                {post.user.name}
                {post.user.verified && <Check className="w-3 h-3 text-[#22D3EE] bg-white rounded-full p-[1px] ml-1" />}
              </div>
              <div className="post-user-meta uppercase tracking-widest text-[9px] font-black text-white/40">
                {post.location.cityName}, {post.location.country}
              </div>
            </div>
          </button>
          
          <button className="text-white/40 hover:text-white transition-colors">
            <MoreHorizontal size={20} />
          </button>
        </header>
        
        {/* Photos carousel */}
        <div
          className="post-photos"
          onDoubleClick={handleDoubleTap}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={photoIdx}
              src={post.photos[photoIdx]}
              alt=""
              className="post-photo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </AnimatePresence>
          
          {/* Double-tap heart */}
          <AnimatePresence>
            {doubleTapHeart && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Heart fill="#EF4444" className="text-[#EF4444] w-24 h-24" />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Carousel nav */}
          {post.photos.length > 1 && (
            <>
              {photoIdx > 0 && (
                <button
                  className="post-carousel-btn post-carousel-prev"
                  onClick={(e) => { e.stopPropagation(); handlePhotoChange('prev'); }}
                >
                  <ChevronLeft size={20} />
                </button>
              )}
              {photoIdx < post.photos.length - 1 && (
                <button
                  className="post-carousel-btn post-carousel-next"
                  onClick={(e) => { e.stopPropagation(); handlePhotoChange('next'); }}
                >
                  <ChevronRight size={20} />
                </button>
              )}
              
              {/* Indicators */}
              <div className="post-indicators">
                {post.photos.map((_, i) => (
                  <div
                    key={i}
                    className={`post-indicator ${i === photoIdx ? 'post-indicator-active' : ''}`}
                  />
                ))}
              </div>
              
              {/* Counter */}
              <div className="post-photo-counter">
                {photoIdx + 1}/{post.photos.length}
              </div>
            </>
          )}
          
          {/* Badges Overlay */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {post.tripId && (
              <div className="bg-primary/20 backdrop-blur-md border border-primary/30 px-3 py-1.5 rounded-full flex items-center gap-2">
                <MapIcon size={12} className="text-primary" />
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Roteiro Ativo</span>
              </div>
            )}
            {post.mood && (
              <div className="bg-black/20 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2">
                <span className="text-xs">{getMoodEmoji(post.mood)}</span>
                <span className="text-[10px] font-black text-white uppercase tracking-widest">{post.mood}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Actions bar */}
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-6">
            <motion.button
              onClick={() => toggleLike(post.id)}
              whileTap={{ scale: 0.8 }}
              animate={{ scale: post.liked ? [1, 1.2, 1] : 1 }}
              className={`transition-colors ${post.liked ? 'text-red-500' : 'text-white'}`}
            >
              <Heart size={26} fill={post.liked ? "currentColor" : "none"} />
            </motion.button>
            <button
              className="text-white hover:text-primary transition-colors"
              onClick={() => setShowComments(true)}
            >
              <MessageCircle size={26} />
            </button>
            <button className="text-white hover:text-primary transition-colors">
              <Send size={26} />
            </button>
          </div>
          
          <motion.button
            className={`transition-colors ${post.saved ? 'text-secondary' : 'text-white'}`}
            onClick={() => toggleSave(post.id)}
            whileTap={{ scale: 0.8 }}
          >
            <Bookmark size={26} fill={post.saved ? "currentColor" : "none"} />
          </motion.button>
        </div>
        
        {/* Likes + Caption */}
        <div className="px-5 pb-4 space-y-2">
          <div className="text-sm font-black text-white tracking-tight">
            {post.likes.toLocaleString('pt-BR')} curtidas
          </div>
          
          {post.caption && (
            <div className="text-sm leading-relaxed text-white/80">
              <span className="font-black text-white mr-2" onClick={() => navigate(`/u/${post.user.username}`)}>
                {post.user.username}
              </span>
              {showFullCaption || post.caption.length < 120
                ? post.caption
                : `${post.caption.slice(0, 120)}... `}
              {post.caption.length >= 120 && !showFullCaption && (
                <button
                  className="text-white/40 font-bold ml-1 hover:text-white"
                  onClick={() => setShowFullCaption(true)}
                >
                  mais
                </button>
              )}
            </div>
          )}
          
          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs font-bold text-primary">
                  #{tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Comments preview */}
          {post.commentsCount > 0 && (
            <button
              className="text-xs font-bold text-white/40 pt-1 block hover:text-white transition-colors"
              onClick={() => setShowComments(true)}
            >
              Ver {post.commentsCount} {post.commentsCount === 1 ? 'comentário' : 'comentários'}
            </button>
          )}
          
          <div className="text-[10px] font-black text-white/20 uppercase tracking-widest pt-2">
            {timeAgo(post.createdAt)}
          </div>
        </div>
      </article>

      <CommentsSheet
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        post={post}
      />
    </>
  );
}

function getMoodEmoji(mood: string) {
  const map: Record<string, string> = {
    adventurous: '🏔️',
    romantic: '💕',
    chill: '🌴',
    cultural: '🎭',
    foodie: '🍜',
    party: '🎉',
  };
  return map[mood] || '✈️';
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}
