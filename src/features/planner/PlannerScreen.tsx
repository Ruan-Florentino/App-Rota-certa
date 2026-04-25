import React, { useEffect } from 'react';
import { usePlannerStore } from './stores/plannerStore';
import { getNextQuestion } from './services/aiTravelPlanner';
import { ChatArea } from './components/ChatArea';
import { InputArea } from './components/InputArea';

export const PlannerScreen = () => {
    const { addMessage, currentStep } = usePlannerStore();

    useEffect(() => {
        const q = getNextQuestion(currentStep, {});
        addMessage({ id: Date.now().toString(), sender: 'ai', text: q.text, type: 'text', timestamp: new Date() });
    }, [currentStep]);

    return (
        <div className="flex flex-col h-screen bg-[#020617]">
            <header className="p-4 border-b border-white/5">Right Way AI</header>
            <ChatArea />
            <InputArea />
        </div>
    );
};
