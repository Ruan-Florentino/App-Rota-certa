import React from 'react';
import { posts } from '../data/posts';

export const DiscoverScreen = () => {
    return (
        <div className="grid grid-cols-3 gap-1 p-1">
            {posts.map(post => (
                <img key={post.id} src={post.media[0].url} className="aspect-square object-cover" />
            ))}
        </div>
    );
};
