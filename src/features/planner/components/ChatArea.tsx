import React from 'react';
import { usePlannerStore } from '../stores/plannerStore';
import { motion } from 'motion/react';

export const ChatArea = () => {
    const messages = usePlannerStore((s) => s.messages);
    return (
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            {messages.map(m => (
                <motion.div 
                    key={m.id}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className={`p-3 rounded-lg max-w-[80%] ${m.sender === 'ai' ? 'bg-white/10 self-start' : 'bg-[#A855F7] self-end'}`}
                >
                    {m.text}
                </motion.div>
            ))}
        </div>
    );
};
