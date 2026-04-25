import React from 'react';
import { reels } from '../data/reels';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, MessageSquare, Send, MoreVertical } from 'lucide-react';

export const ReelsScreen = () => {
    return (
        <div className="h-full bg-black overflow-y-scroll snap-y snap-mandatory">
            {reels.map(reel => (
                <div key={reel.id} className="h-full w-full snap-start relative">
                    <img src={reel.media[0].url} className="w-full h-full object-cover" />
                    <div className="absolute bottom-16 left-4 right-16 flex flex-col gap-2">
                        <span className="font-bold text-white">@{reel.author.username}</span>
                        <p className="text-white text-sm">{reel.caption}</p>
                    </div>
                    <div className="absolute bottom-16 right-4 flex flex-col gap-6 text-white">
                        <Heart />
                        <MessageSquare />
                        <Send />
                        <MoreVertical />
                    </div>
                </div>
            ))}
        </div>
    );
};
