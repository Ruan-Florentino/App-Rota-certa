import React from 'react';
import { Plus } from 'lucide-react';

interface AddCountryCardProps {
  onClick: () => void;
}

export const AddCountryCard = ({ onClick }: AddCountryCardProps) => {
  return (
    <button 
      onClick={onClick}
      className="group aspect-[4/5] rounded-[28px] border-2 border-dashed border-rw-border/40 
                 flex flex-col items-center justify-center gap-4
                 hover:border-rw-sky hover:bg-rw-sky/5 transition-all duration-500 shadow-sm"
    >
      <div className="w-14 h-14 rounded-2xl bg-rw-surface border border-rw-border 
                      flex items-center justify-center
                      group-hover:border-rw-sky group-hover:text-rw-sky
                      group-hover:shadow-rw-glow-sm
                      text-rw-muted transition-all duration-300">
        <Plus className="w-8 h-8" />
      </div>
      <p className="text-[10px] uppercase text-rw-muted group-hover:text-rw-sky 
                    transition-colors font-black tracking-[0.25em]">
        adicionar
      </p>
    </button>
  );
};
