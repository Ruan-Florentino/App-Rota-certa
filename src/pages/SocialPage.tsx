import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Plus, Compass, MessageCircle } from 'lucide-react';
import { useSocialStore } from '../store/socialStore';
import { StoriesBar } from '../features/social/components/StoriesBar';
import { PostCard } from '../features/social/components/PostCard';
import { SuggestedUsers } from '../features/social/components/SuggestedUsers';
import { CreatePostModal } from '../features/social/components/CreatePostModal';
import { motion, AnimatePresence } from 'motion/react';

export default function SocialPage() {
  const { getFeedPosts } = useSocialStore();
  const posts = getFeedPosts();
  const [isPostModalOpen, setIsPostModalOpen] = React.useState(false);
  
  return (
    <div className="social-page bg-[#020617] min-h-screen">
      {/* Header Fixo */}
      <header className="social-header">
        <div className="social-logo tracking-tighter">RIGHT WAY</div>
        <div className="social-actions">
          <button 
            onClick={() => setIsPostModalOpen(true)}
            className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center text-primary active:scale-95 transition-all"
          >
            <Plus size={24} strokeWidth={3} />
          </button>
          <Link to="/notifications" className="social-nav-btn relative">
            <Bell size={24} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-[#020617]" />
          </Link>
          <button className="social-nav-btn">
            <MessageCircle size={24} />
          </button>
        </div>
      </header>
      
      {/* Feed Area */}
      <main className="social-feed pt-4">
        <StoriesBar />
        
        <SuggestedUsers />
        
        <div className="feed-posts px-0">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <PostCard post={post} />
            </motion.div>
          ))}
          
          {posts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
              <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6 border border-white/10">
                <Compass className="w-10 h-10 text-white/20" />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">O mundo está quieto</h3>
              <p className="text-white/40 text-xs font-bold uppercase tracking-widest max-w-[200px]">Comece a seguir viajantes para ver suas aventuras aqui.</p>
              <button className="mt-8 bg-primary/20 text-primary border border-primary/30 px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest">Encontrar Viajantes</button>
            </div>
          )}
        </div>
        
        <div className="py-20 text-center">
          <div className="w-12 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mb-6 opacity-30" />
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Você chegou ao fim das novidades</p>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="mt-4 text-primary text-[10px] font-black uppercase tracking-widest"
          >
            Voltar ao topo ↑
          </button>
        </div>
      </main>

      <CreatePostModal 
        isOpen={isPostModalOpen} 
        onClose={() => setIsPostModalOpen(false)} 
      />
    </div>
  );
}
