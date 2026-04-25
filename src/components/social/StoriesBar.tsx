import React from 'react';
import { motion } from 'motion/react';
import { Story } from '../../services/social';
import { Plus } from 'lucide-react';

interface StoriesBarProps {
  stories: Story[];
  onAddStory?: () => void;
}

export const StoriesBar: React.FC<StoriesBarProps> = ({ stories, onAddStory }) => {
  return (
    <div className="flex gap-4 overflow-x-auto pb-6 pt-2 px-6 no-scrollbar -mx-6">
      {/* Add Story */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onAddStory}
        className="flex-shrink-0 flex flex-col items-center gap-2"
      >
        <div className="w-16 h-16 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center bg-white/5 relative">
          <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center">
            <Plus size={24} className="text-primary" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1 shadow-lg">
            <Plus size={10} className="text-black font-black" />
          </div>
        </div>
        <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Seu Story</span>
      </motion.button>

      {/* Story List */}
      {stories.map((story) => (
        <motion.button
          key={story.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-shrink-0 flex flex-col items-center gap-2"
        >
          <div className={`w-16 h-16 rounded-full p-[2px] ${story.viewed ? 'bg-white/10' : 'bg-gradient-to-tr from-primary via-indigo-500 to-rose-500'}`}>
            <div className="w-full h-full rounded-full border-2 border-background overflow-hidden bg-white/10">
              <img 
                src={story.userPhoto || `https://ui-avatars.com/api/?name=${story.userName}&background=random`} 
                alt={story.userName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <span className="text-[9px] font-black text-white uppercase tracking-widest overflow-hidden text-ellipsis w-16 whitespace-nowrap">
            {story.userName.split(' ')[0]}
          </span>
        </motion.button>
      ))}
    </div>
  );
};
