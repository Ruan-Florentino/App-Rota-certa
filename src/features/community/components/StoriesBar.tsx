import React from 'react';
import { stories } from '../data/stories';

export const StoriesBar = () => {
    return (
        <div className="flex gap-4 px-5 overflow-x-auto">
            <div className="flex flex-col items-center gap-1">
                <div className="w-[60px] h-[60px] rounded-full bg-white/10 flex items-center justify-center text-white">+</div>
                <span className="text-[10px] text-white">Você</span>
            </div>
            {stories.map(s => (
                <div key={s.id} className="flex flex-col items-center gap-1">
                    <img src={s.media} className="w-[60px] h-[60px] rounded-full" />
                    <span className="text-[10px] text-white truncate w-16 text-center">{s.author.name}</span>
                </div>
            ))}
        </div>
    );
};
