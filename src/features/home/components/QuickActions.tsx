import React from 'react';
import { Map, Lightbulb, Plane, Users } from 'lucide-react';
import { motion } from 'motion/react';

const actions = [
  { label: 'Planejar Viagem', icon: Map, color: 'bg-[#A855F7]' },
  { label: 'Ideias de Destino', icon: Lightbulb, color: 'bg-[#7DD3FC]' },
  { label: 'Minhas Viagens', icon: Plane, color: 'bg-[#00E5D4]' },
  { label: 'Comunidade', icon: Users, color: 'bg-[#6D28D9]' },
];

export const QuickActions = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {actions.map((act) => (
        <motion.button
          whileTap={{ scale: 0.96 }}
          key={act.label}
          className={`${act.color} h-[100px] rounded-2xl p-4 flex flex-col justify-between items-start text-white shadow-md`}
        >
          <act.icon className="w-8 h-8" />
          <span className="font-bold text-sm">{act.label}</span>
        </motion.button>
      ))}
    </div>
  );
};
