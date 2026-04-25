import React, { useState } from 'react';
import { usePlannerStore } from '../stores/plannerStore';
import { Send } from 'lucide-react';

export const InputArea = () => {
    const [text, setText] = useState('');
    const answer = usePlannerStore((s) => s.answerQuestion);
    
    const handleSend = () => {
        if (!text) return;
        answer('destination', text); // Simplified for this draft
        setText('');
    };

    return (
        <div className="p-4 bg-[#0A0E1A] flex gap-2">
            <input 
                value={text} onChange={(e) => setText(e.target.value)}
                className="flex-1 bg-white/5 rounded-full px-4 py-2 text-white border border-white/10"
                placeholder="Digite..."
            />
            <button onClick={handleSend} className="bg-[#A855F7] p-2 rounded-full"><Send size={20} /></button>
        </div>
    );
};
