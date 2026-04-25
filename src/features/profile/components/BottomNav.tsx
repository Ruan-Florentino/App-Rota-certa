import React from 'react';
import { Home, PlusSquare, Compass, Map, Users, User } from 'lucide-react';

export default function BottomNav() {
  const navItems = [
    { icon: Home, label: 'Início', active: false },
    { icon: PlusSquare, label: 'Adicionar', active: false },
    { icon: Compass, label: 'Explorar', active: false },
    { icon: Map, label: 'Mapa', active: false },
    { icon: Users, label: 'Social', active: false },
    { icon: User, label: 'Perfil', active: true },
  ];

  return (
    <div className="fixed bottom-[24px] left-1/2 -translate-x-1/2 w-[90%] max-w-[500px] z-[100]">
      <div className="bg-[#141928]/80 backdrop-blur-2xl border border-white/10 rounded-[32px] px-[20px] py-[12px] flex items-center justify-between shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
        {navItems.map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-[4px] cursor-pointer">
            <item.icon size={22} className={item.active ? 'text-[#00E5D4]' : 'text-[#8B92A8]'} />
            <span className={`text-[9px] font-bold ${item.active ? 'text-[#00E5D4]' : 'text-[#8B92A8]'}`}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
