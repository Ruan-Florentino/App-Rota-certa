import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Compass, Globe, Navigation, PiggyBank } from 'lucide-react';
import { mockProfileData as profile } from '../data/mockProfile';

const CountUp = ({ to, prefix = '', suffix = '' }: { to: number; prefix?: string; suffix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1500;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCount(easeProgress * to);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [to]);

  const value = Math.round(count);
  return <span className="tabular-nums">{prefix}{value >= 1000 ? `${(value/1000).toFixed(1)}k` : value}{suffix}</span>;
};

export default function StatsGrid() {
  const stats = [
    { label: 'TRIPS', value: profile.stats.trips, icon: Compass, color: 'text-[#A855F7]' },
    { label: 'PAÍSES', value: profile.stats.countries, icon: Globe, color: 'text-[#7DD3FC]' },
    { label: 'KM', value: profile.stats.kilometers, icon: Navigation, color: 'text-[#7DD3FC]' },
    { label: 'ECONOMIA', value: profile.stats.savings, icon: PiggyBank, color: 'text-[#A855F7]', prefix: 'R$ ' },
  ];

  return (
    <div className="grid grid-cols-4 gap-[10px]">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          className="bg-[#141928]/60 backdrop-blur-xl border border-white/5 rounded-[16px] px-[8px] py-[14px] flex flex-col items-center justify-center text-center hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(168,85,247,0.1)] transition-all group cursor-pointer"
          whileTap={{ scale: 0.98 }}
        >
          <motion.div 
            className="mb-[8px]"
            whileHover={{ 
              rotate: stat.icon === Compass ? 180 : 0,
              scale: 1.2,
              transition: { type: "spring", stiffness: 300 }
            }}
          >
            <stat.icon size={18} className={stat.color} />
          </motion.div>
          <div className="text-[20px] font-bold text-white leading-none mb-[4px]" style={{ fontFamily: '"Fraunces", serif' }}>
             <CountUp to={stat.value} prefix={stat.prefix} />
          </div>
          <span className="text-[9px] text-[#5A6178] uppercase font-bold tracking-[0.1em] group-hover:text-white transition-colors">
            {stat.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
