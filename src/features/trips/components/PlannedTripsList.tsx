import React from 'react';
import { useTripsStore } from '../stores/tripsStore';

export const PlannedTripsList = () => {
    const trips = useTripsStore((s) => s.trips.filter(t => t.status === 'planned'));
    return (
        <div className="grid grid-cols-2 gap-4">
             {trips.map(trip => (
                <div key={trip.id} className="aspect-[3/4] rounded-xl bg-white/5 p-4 flex flex-col justify-end">
                    <h3 className="font-bold text-white">{trip.destination}</h3>
                </div>
             ))}
             {trips.length === 0 && <p className="col-span-2 text-center text-gray-500 py-10">Que tal planejar um sonho? ✨</p>}
        </div>
    );
};
