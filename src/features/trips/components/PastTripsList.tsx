import React from 'react';
import { useTripsStore } from '../stores/tripsStore';

export const PastTripsList = () => {
    const trips = useTripsStore((s) => s.trips.filter(t => t.status === 'completed'));
    return (
        <div className="flex flex-col gap-4">
             {trips.map(trip => (
                <div key={trip.id} className="h-[200px] rounded-xl bg-white/5 p-4 flex flex-col justify-end">
                    <h3 className="font-bold text-white">{trip.destination}</h3>
                </div>
             ))}
             {trips.length === 0 && <p className="text-center text-gray-500 py-10">Sua primeira aventura está chegando! 🌟</p>}
        </div>
    );
};
