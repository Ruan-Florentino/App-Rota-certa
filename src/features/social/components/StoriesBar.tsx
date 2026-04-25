import { motion } from 'motion/react';
import { useState } from 'react';
import { useSocialStore } from '../../../store/socialStore';
import { StoryViewer } from './StoryViewer';

export function StoriesBar() {
  const { stories } = useSocialStore();
  const [activeStory, setActiveStory] = useState<number | null>(null);
  
  return (
    <>
      <div className="stories-bar">
        {/* Sua story (adicionar) */}
        <motion.button
          className="story-item story-item-own"
          whileTap={{ scale: 0.95 }}
        >
          <div className="story-avatar-wrap story-add">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=you&backgroundColor=22d3ee"
              alt="Você"
            />
            <div className="story-add-btn">+</div>
          </div>
          <span className="story-name">Sua story</span>
        </motion.button>
        
        {stories.map((story, i) => (
          <motion.button
            key={story.id}
            className="story-item"
            onClick={() => setActiveStory(i)}
            whileTap={{ scale: 0.95 }}
          >
            <div
              className={`story-avatar-wrap ${
                story.viewed ? 'story-viewed' : 'story-unviewed'
              }`}
            >
              <img src={story.user.avatar} alt={story.user.name} />
            </div>
            <span className="story-name">{story.user.username}</span>
          </motion.button>
        ))}
      </div>
      
      {activeStory !== null && (
        <StoryViewer
          stories={stories}
          initialIndex={activeStory}
          onClose={() => setActiveStory(null)}
        />
      )}
    </>
  );
}
