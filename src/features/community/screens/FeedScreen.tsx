import React from 'react';
import { posts } from '../data/posts';
import { PostCard } from '../components/PostCard';
import { StoriesBar } from '../components/StoriesBar';

export const FeedScreen = () => {
    return (
        <div className="flex flex-col gap-4 py-4">
            <StoriesBar />
            {posts.map(post => <PostCard key={post.id} post={post} />)}
        </div>
    );
};
