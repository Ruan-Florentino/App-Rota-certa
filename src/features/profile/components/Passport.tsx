import React, { useState } from 'react';
import { useTripsStore } from '@/stores/tripsStore';
import { CountryCard } from './CountryCard';
import { AddCountryCard } from './AddCountryCard';
import { AddCountrySheet } from './AddCountrySheet';
import { getCountryByCode } from '@/data/countries';

export const Passport = () => {
  const trips = useTripsStore(state => state.trips);
  const totalCountries = new Set(trips.filter(t => t.status === 'visited').map(t => t.countryCode)).size;
  const [showAddSheet, setShowAddSheet] = useState(false);

  return (
    <section className="mx-4 mt-12 relative">
      <header className="flex items-end justify-between mb-6 px-2">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-rw-sky shadow-md" />
            <p className="text-[10px] tracking-[0.25em] uppercase text-rw-sky font-bold">
              Passaporte
            </p>
          </div>
          <h2 className="text-3xl font-black text-rw-text tracking-tighter uppercase">
            Seus destinos
          </h2>
          <p className="text-sm text-rw-muted mt-1 font-bold">
            <span className="text-rw-sky font-black tabular-nums">{totalCountries}</span> países catalogados de 195 pelo mundo.
          </p>
        </div>
      </header>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
        <AddCountryCard onClick={() => setShowAddSheet(true)} />
        {trips.map(trip => {
            const country = getCountryByCode(trip.countryCode);
            return <CountryCard key={trip.id} trip={{...trip, year: new Date(trip.createdAt).getFullYear(), flag: country?.flag || '🏳️', name: country?.name || 'Desconhecido'}} />;
        })}
      </div>

      {trips.length === 0 && (
        <div className="mt-4 p-8 rounded-[32px] bg-rw-surface border border-dashed border-rw-border flex flex-col items-center text-center">
          <p className="text-rw-muted text-xs font-bold uppercase tracking-widest">Nada por aqui ainda.</p>
        </div>
      )}

      <AddCountrySheet 
        open={showAddSheet} 
        onClose={() => setShowAddSheet(false)} 
      />
    </section>
  );
};
