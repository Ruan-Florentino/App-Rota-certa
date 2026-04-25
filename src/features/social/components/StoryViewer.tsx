import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSocialStore } from '../../../store/socialStore';
import { Story } from '../../../types/social';

interface Props {
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
}

export function StoryViewer({ stories, initialIndex, onClose }: Props) {
  const { markStoryViewed } = useSocialStore();
  const [storyIdx, setStoryIdx] = useState(initialIndex);
  const [itemIdx, setItemIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const currentStory = stories[storyIdx];
  const currentItem = currentStory?.items[itemIdx];
  
  const nextStory = React.useCallback(() => {
    if (storyIdx < stories.length - 1) {
      setStoryIdx(storyIdx + 1);
      setItemIdx(0);
      setProgress(0);
    } else {
      onClose();
    }
  }, [storyIdx, stories.length, onClose]);

  const prevStory = React.useCallback(() => {
    if (storyIdx > 0) {
      setStoryIdx(storyIdx - 1);
      setItemIdx(0);
      setProgress(0);
    }
  }, [storyIdx]);

  const nextItem = React.useCallback(() => {
    if (!currentStory) return;
    if (itemIdx < currentStory.items.length - 1) {
      setItemIdx(itemIdx + 1);
      setProgress(0);
    } else {
      nextStory();
    }
  }, [currentStory, itemIdx, nextStory]);

  const prevItem = React.useCallback(() => {
    if (itemIdx > 0) {
      setItemIdx(itemIdx - 1);
      setProgress(0);
    } else {
      prevStory();
    }
  }, [itemIdx, prevStory]);

  // Auto-progress
  useEffect(() => {
    if (!currentItem) return;
    
    setProgress(0);
    
    const duration = currentItem.duration;
    const interval = 50;
    const increment = (interval / duration) * 100;
    
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) return 100;
        return p + increment;
      });
    }, interval);
    
    return () => clearInterval(timer);
  }, [itemIdx, storyIdx, currentItem]);

  useEffect(() => {
    if (progress >= 100) {
      nextItem();
    }
  }, [progress, nextItem]);
  
  // Marca como visto
  useEffect(() => {
    if (currentStory) markStoryViewed(currentStory.id);
  }, [storyIdx, currentStory, markStoryViewed]);
  
  if (!currentItem) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        className="story-viewer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Progress bars */}
        <div className="story-progress">
          {currentStory.items.map((_, i) => (
            <div key={i} className="story-progress-bar">
              <div
                className="story-progress-fill"
                style={{
                  width: i < itemIdx ? '100%' : i === itemIdx ? `${progress}%` : '0%',
                }}
              />
            </div>
          ))}
        </div>
        
        {/* Header */}
        <div className="story-header">
          <div className="story-header-user">
            <img src={currentStory.user.avatar} alt="" />
            <div>
              <div className="story-header-name">{currentStory.user.name}</div>
              <div className="story-header-time">
                {timeAgo(currentStory.createdAt)} • {currentItem.location}
              </div>
            </div>
          </div>
          <button className="story-close" onClick={onClose}>
            ✕
          </button>
        </div>
        
        {/* Image */}
        <img
          key={currentItem.id}
          src={currentItem.url}
          alt=""
          className="story-image"
          referrerPolicy="no-referrer"
        />
        
        {/* Caption */}
        {currentItem.caption && (
          <div className="story-caption">{currentItem.caption}</div>
        )}
        
        {/* Tap zones */}
        <button className="story-tap-zone story-tap-left" onClick={prevItem} />
        <button className="story-tap-zone story-tap-right" onClick={nextItem} />
        
        {/* Reply */}
        <div className="story-reply">
          <input
            type="text"
            placeholder={`Responder ${currentStory.user.username}...`}
            className="story-reply-input"
          />
          <button className="story-reply-btn">❤️</button>
          <button className="story-reply-btn">📤</button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'agora';
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}
