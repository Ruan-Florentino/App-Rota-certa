import React from 'react';
import { Settings } from 'lucide-react';

export default function ProfileHeader() {
  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex flex-col">
        <div className="flex items-center text-3xl tracking-tight leading-none" style={{ fontFamily: '"Fraunces", serif' }}>
          <span className="font-bold text-white">Right</span>
          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#A855F7] to-[#7DD3FC]">Way</span>
        </div>
        <span className="text-[10px] text-[#5A6178] uppercase font-bold tracking-[0.2em] mt-1">
          Your Journey Starts Here
        </span>
      </div>
      
      <button className="w-[40px] h-[40px] rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md hover:bg-white/10 transition-colors">
        <Settings size={20} className="text-gray-300" />
      </button>
    </div>
  );
}
