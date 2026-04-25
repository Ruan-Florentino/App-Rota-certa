import React from 'react';
import { useTripsStore } from '../stores/tripsStore';
import { motion } from 'motion/react';

export const UpcomingTripsList = () => {
    const trips = useTripsStore((s) => s.trips.filter(t => t.status === 'upcoming'));
    
    return (
        <div className="flex flex-col gap-4">
            {trips.map(trip => (
                <motion.div key={trip.id} className="h-[140px] rounded-2xl bg-white/5 p-4 flex gap-4">
                    <img src={trip.image} className="w-[100px] h-full object-cover rounded-xl" />
                    <div className="flex flex-col justify-center">
                        <h3 className="font-bold text-white font-Fraunces">{trip.destination}</h3>
                        <p className="text-xs text-gray-400">Em {Math.ceil(((trip.startDate?.getTime() || 0) - Date.now()) / (1000*60*60*24))} dias</p>
                    </div>
                </motion.div>
            ))}
            {trips.length === 0 && <p className="text-center text-gray-500 py-10">Nenhuma viagem agendada 📅</p>}
        </div>
    );
};
