import React from 'react';
import { motion } from 'motion/react';
import { Pencil, Camera, MapPin, ExternalLink } from 'lucide-react';
import { useUserStore } from '../../../stores/userStore';

export const ProfileHero = ({ onEdit }: { onEdit: () => void }) => {
    const user = useUserStore((s) => s.user);
    if (!user) return null;

    return (
        <div className="relative h-[340px]">
            <div className="h-[200px] bg-gradient-to-r from-[#A855F7] to-[#7DD3FC]" />
            <button onClick={onEdit} className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white">
                <Pencil size={18} />
            </button>
            <div className="absolute left-5 -bottom-10">
                <div className="relative">
                    <div className="w-[120px] h-[120px] rounded-full border-4 border-[#020617] bg-gray-800 flex items-center justify-center text-4xl text-white font-bold">
                        {user.name.charAt(0)}
                    </div>
                </div>
            </div>
            <div className="absolute left-5 bottom-12 mt-16 pl-[135px]">
                <h1 className="text-2xl font-Fraunces font-bold text-white">{user.name}</h1>
                <p className="text-sm text-gray-400">@{user.username}</p>
            </div>
        </div>
    );
};
