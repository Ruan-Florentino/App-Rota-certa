import React from 'react';
import { Post } from '../types/community.types';
import { Heart, MessageSquare, Bookmark } from 'lucide-react';
import { useCommunityStore } from '../stores/communityStore';

export const PostCard = ({ post }: { post: Post }) => {
    const { toggleLike, toggleSave } = useCommunityStore();
    return (
        <div className="bg-[#0A0E1A] rounded-xl mx-5 border border-white/5 p-4">
            <div className="flex items-center gap-2 mb-3">
                <img src={post.author.avatar} className="w-8 h-8 rounded-full" />
                <span className="text-sm font-bold text-white">{post.author.username}</span>
            </div>
            <img src={post.media[0].url} className="w-full aspect-[4/5] object-cover rounded-xl" />
            <div className="flex gap-4 mt-3 text-white">
                <Heart size={24} onClick={() => toggleLike(post.id)} className={post.isLiked ? 'fill-[#A855F7] text-[#A855F7]' : ''} />
                <MessageSquare size={24} />
                <Bookmark onClick={() => toggleSave(post.id)} className={post.isSaved ? 'fill-white' : ''} />
            </div>
            <p className="text-sm text-gray-300 mt-2">{post.caption}</p>
        </div>
    );
};
