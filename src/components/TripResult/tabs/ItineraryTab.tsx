import React from 'react';
import { motion } from 'motion/react';
import { 
  Clock, 
  Map as MapIcon, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  Sparkles, 
  CheckCircle2, 
  Info, 
  Headphones, 
  Square, 
  Navigation, 
  DollarSign 
} from 'lucide-react';
import { SafeImage } from '../../ui/SafeImage';
import { Map2D } from '../../Map2D';
import { Trip } from '../../../types';

interface ItineraryTabProps {
  currentTrip: Trip;
  isMapView: boolean;
  setIsMapView: (v: boolean) => void;
  isPlayingAudio: boolean;
  handleAudioGuide: () => void;
  playingAudioActivity: string | null;
  isGeneratingAudio: string | null;
  handlePlayAudioTour: (id: string, name: string) => void;
  canEdit: boolean;
  isOwner: boolean;
  isReoptimizingDay: number | null;
  handleReoptimizeDay: (day: number) => void;
  setEditingActivity: (act: any) => void;
  handleDeleteActivity: (dIdx: number, aIdx: number) => void;
  renderPrice: (amount: number) => React.ReactNode;
  heroImage: string;
  navigate: (path: string, state?: any) => void;
}

export const ItineraryTab: React.FC<ItineraryTabProps> = ({
  currentTrip,
  isMapView,
  setIsMapView,
  isPlayingAudio,
  handleAudioGuide,
  playingAudioActivity,
  isGeneratingAudio,
  handlePlayAudioTour,
  canEdit,
  isOwner,
  isReoptimizingDay,
  handleReoptimizeDay,
  setEditingActivity,
  handleDeleteActivity,
  renderPrice,
  heroImage,
  navigate
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-8"
    >
      <div className="flex gap-2 mb-4">
        <button 
          onClick={() => setIsMapView(false)}
          className={`flex-1 h-12 rounded-[20px] font-semibold text-xs flex items-center justify-center gap-2 transition-all ${
            !isMapView ? 'bg-[rgba(255,255,255,0.15)] text-white border border-[rgba(255,255,255,0.2)] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]' : 'bg-[rgba(255,255,255,0.05)] text-white/60 border border-transparent hover:bg-[rgba(255,255,255,0.1)]'
          }`}
        >
          <Clock className="w-4 h-4" /> LISTA
        </button>
        <button 
          onClick={() => setIsMapView(true)}
          className={`flex-1 h-12 rounded-[20px] font-semibold text-xs flex items-center justify-center gap-2 transition-all ${
            isMapView ? 'bg-[rgba(255,255,255,0.15)] text-white border border-[rgba(255,255,255,0.2)] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]' : 'bg-[rgba(255,255,255,0.05)] text-white/60 border border-transparent hover:bg-[rgba(255,255,255,0.1)]'
          }`}
        >
          <MapIcon className="w-4 h-4" /> MAPA
        </button>
        <button 
          onClick={handleAudioGuide}
          className={`w-12 h-12 rounded-[20px] flex items-center justify-center transition-all ${
            isPlayingAudio ? 'bg-primary text-black shadow-[0_0_15px_rgba(0,229,255,0.5)]' : 'bg-[rgba(255,255,255,0.05)] text-white/60 border border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.1)]'
          }`}
        >
          {isPlayingAudio ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>

      {isMapView ? (
        <div className="h-[500px] rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.1)] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] relative z-0 group">
          <Map2D 
            points={currentTrip.itinerary.flatMap(day => day.activities.filter(a => a.location?.lat && a.location?.lng).map(a => ({
              id: `${day.day}-${a.activity}`,
              lat: a.location!.lat,
              lng: a.location!.lng,
              name: a.placeName || a.activity,
              type: 'attraction',
              description: `Dia ${day.day} - ${a.time}`
            })))}
            isItinerary={true}
          />
          <button
            onClick={() => navigate('/map', { state: { itinerary: currentTrip.itinerary, destination: currentTrip.destination } })}
            className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MapIcon className="w-5 h-5" />
          </button>
        </div>
      ) : (
        currentTrip.itinerary.map((day, dIdx) => (
          <div key={day.day} className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative h-40 rounded-[32px] overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
              <div className="absolute inset-0">
                <SafeImage 
                  src={day.activities[0]?.image || heroImage} 
                  alt={`Dia ${day.day}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              </div>
              
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-md text-[9px] font-black text-primary uppercase tracking-widest">
                        Roteiro
                      </span>
                      <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
                        {day.activities.length} Atividades
                      </span>
                    </div>
                    <h3 className="text-3xl font-black text-white tracking-tighter">DIA {day.day}</h3>
                  </div>
                  
                  {canEdit && (
                    <button 
                      onClick={() => handleReoptimizeDay(day.day)}
                      disabled={isReoptimizingDay === day.day}
                      className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-90"
                    >
                      {isReoptimizingDay === day.day ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                      ) : (
                        <Sparkles className="w-5 h-5 text-primary" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
            
            <div className="space-y-6 relative pl-4">
              <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 via-primary/20 to-transparent" />
              
              {day.activities.map((act, aIdx) => (
                <motion.div 
                  key={aIdx}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: aIdx * 0.1 }}
                  className="relative pl-10"
                >
                  <div className="absolute left-0 top-6 w-10 h-10 -ml-5 bg-[#020617] rounded-full border-2 border-primary/30 flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.3)] z-10">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  </div>

                  <div className="glass-card p-0 overflow-hidden group/card border-white/5 hover:border-primary/30 transition-all duration-500">
                    {act.image && (
                      <div className="h-48 w-full relative overflow-hidden">
                        <SafeImage 
                          src={act.image} 
                          alt={act.activity} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
                        
                        <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md border border-white/10 rounded-full">
                          <span className="text-[9px] font-black text-white uppercase tracking-widest flex items-center gap-1">
                            <Clock className="w-3 h-3 text-primary" /> {act.time}
                          </span>
                        </div>

                        {act.category && (
                          <div className="absolute top-4 right-4 px-3 py-1 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full">
                            <span className="text-[9px] font-black text-primary uppercase tracking-widest">
                              {act.category}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-lg font-bold text-white leading-tight group-hover/card:text-primary transition-colors">
                          {act.activity}
                        </h4>
                        {isOwner && (
                          <div className="flex items-center gap-2">
                            <button onClick={() => setEditingActivity({ dayIndex: dIdx, activityIndex: aIdx, activity: act })} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all">
                              <Info className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeleteActivity(dIdx, aIdx)} className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all">
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      <p className="text-sm text-white/60 leading-relaxed mb-6 line-clamp-3 group-hover/card:line-clamp-none transition-all duration-500">
                        {act.description}
                      </p>

                      <div className="flex items-center justify-between pt-6 border-t border-white/5">
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => handlePlayAudioTour(`${day.day}-${aIdx}`, act.placeName || act.activity)}
                            disabled={isGeneratingAudio === `${day.day}-${aIdx}`}
                            className={`h-10 px-4 rounded-xl flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest transition-all ${
                              playingAudioActivity === `${day.day}-${aIdx}` 
                                ? 'bg-primary text-black shadow-[0_0_20px_rgba(0,229,255,0.4)]' 
                                : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                            }`}
                          >
                            {isGeneratingAudio === `${day.day}-${aIdx}` ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : playingAudioActivity === `${day.day}-${aIdx}` ? (
                              <Square className="w-4 h-4 fill-current" />
                            ) : (
                              <Headphones className="w-4 h-4" />
                            )}
                            Audio Guia
                          </button>
                          
                          <div className="flex flex-col">
                            <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Estimativa IA*</span>
                            <div className="flex items-center gap-1 text-emerald-400 font-black">
                              <DollarSign className="w-3 h-3" />
                              <span className="text-sm">{renderPrice(act.cost)}</span>
                            </div>
                          </div>
                        </div>

                        <button 
                          onClick={() => navigate('/map', { state: { hotel: { name: act.placeName || act.activity, location: currentTrip.destination, price: act.cost, image: act.image } } })}
                          className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 hover:bg-primary hover:text-black transition-all shadow-[0_0_15px_rgba(0,229,255,0.1)]"
                        >
                          <Navigation className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))
      )}
    </motion.div>
  );
};
