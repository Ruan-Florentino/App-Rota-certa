import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { FlightSearch } from '../components/flights/FlightSearch';

export function FlightScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#020617] pb-32 overflow-y-auto no-scrollbar pt-safe relative">
      <div className="absolute top-0 left-0 right-0 h-64 bg-primary/5 rounded-b-[40px] blur-3xl -z-10" />

      {/* Header */}
      <div className="flex items-center justify-between p-6 pt-safe z-10 relative">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-white transition-all backdrop-blur-md border border-white/5"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-white tracking-widest uppercase">Voos Oficiais</h1>
        <div className="w-10" /> {/* Spacer */}
      </div>

      <div className="px-6 space-y-8 mt-4 z-10 relative">
        {/* Usando o componente premium foda construído pro Sprint 3 */}
        <FlightSearch />
      </div>
    </div>
  );
}
