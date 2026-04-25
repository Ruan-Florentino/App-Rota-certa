import React from 'react';
import { motion } from 'motion/react';

const stories = [
  'Economizar', 'Bagagem', 'Seguro', 'Câmbio', 'Apps', 'Cultura', 'Foto', 'Segurança'
];

export const TipsStories = () => {
  return (
    <div className="px-5">
      <h2 className="text-lg font-bold text-white mb-4">💡 Dicas rápidas</h2>
      <div className="flex gap-4 overflow-x-auto">
        {stories.map((story, i) => (
          <div key={i} className="flex flex-col items-center gap-2 shrink-0">
            <div className="w-[70px] h-[70px] rounded-full p-[2px] bg-gradient-to-tr from-[#A855F7] to-[#7DD3FC]">
                <div className="w-full h-full bg-[#0A0E1A] rounded-full flex items-center justify-center font-bold text-xl">💡</div>
            </div>
            <span className="text-[10px] text-gray-400">{story}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
