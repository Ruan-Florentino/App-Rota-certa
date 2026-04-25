import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, MapPin, CheckCircle } from 'lucide-react';
import { SocialPost } from '../../services/social';

interface PostCardProps {
  post: SocialPost;
  currentUserId?: string;
}

export const PostCard: React.FC<PostCardProps> = ({ post, currentUserId }) => {
  const [isLiked, setIsLiked] = React.useState(false);
  const [likesCount, setLikesCount] = React.useState(post.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-0 overflow-hidden border-white/5 bg-white/5 mb-6"
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src={post.userPhoto || `https://ui-avatars.com/api/?name=${post.userName}&background=random`} 
              alt={post.userName}
              className="w-10 h-10 rounded-full border border-white/10"
            />
            {post.isPro && (
              <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-0.5 border border-background">
                <CheckCircle className="w-2.5 h-2.5 text-background" fill="currentColor" />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-black text-white">{post.userName}</span>
              {post.isPro && <span className="text-[8px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-black uppercase tracking-widest">Pro</span>}
            </div>
            {post.location && (
              <div className="flex items-center gap-1 text-[10px] text-white/40 uppercase font-black tracking-widest">
                <MapPin size={8} className="text-primary" /> {post.location}
              </div>
            )}
          </div>
        </div>
        <button className="text-white/40 hover:text-white transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-sm text-white/80 leading-relaxed">{post.content}</p>
      </div>

      {/* Media */}
      {post.media && post.media.length > 0 && (
        <div className="relative aspect-square">
          <img 
            src={post.media[0]} 
            alt="Post content" 
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Actions */}
      <div className="p-4 flex items-center justify-between border-t border-white/5">
        <div className="flex items-center gap-6">
          <button 
            onClick={handleLike}
            className={`flex items-center gap-2 transition-all active:scale-90 ${isLiked ? 'text-rose-500' : 'text-white/40 hover:text-white'}`}
          >
            <Heart size={22} fill={isLiked ? 'currentColor' : 'none'} />
            <span className="text-xs font-black">{likesCount}</span>
          </button>
          <button className="flex items-center gap-2 text-white/40 hover:text-white transition-all active:scale-90">
            <MessageCircle size={22} />
            <span className="text-xs font-black">{post.comments}</span>
          </button>
          <button className="text-white/40 hover:text-white transition-all active:scale-90">
            <Share2 size={22} />
          </button>
        </div>
        <button className="text-white/40 hover:text-white transition-all active:scale-90">
          <Bookmark size={22} />
        </button>
      </div>
    </motion.div>
  );
};
