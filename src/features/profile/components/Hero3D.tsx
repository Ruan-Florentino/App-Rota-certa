import React, { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import { motion } from 'motion/react';
import { useProfileStore } from '@/store/profileStore';
import { MapPin, Instagram } from 'lucide-react';
import { getCountryByCode } from '@/data/countries';

const Hero3D = ({ visitedPlaces }: any) => {
  const globeEl = useRef<any>(null);
  const [globeReady, setGlobeReady] = useState(false);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const { profile } = useProfileStore();
  const country = getCountryByCode(profile.countryCode);

  useEffect(() => {
    const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.3;
      globeEl.current.controls().enableZoom = false;
      globeEl.current.pointOfView({ altitude: 2 });
    }
  }, [globeReady]);

  const arcsData = visitedPlaces.length > 1 ? visitedPlaces.slice(1).map((place: any) => ({
    startLat: visitedPlaces[0].lat,
    startLng: visitedPlaces[0].lng,
    endLat: place.lat,
    endLng: place.lng,
    color: ['#8AB4F8', '#B4A7F0']
  })) : [];

  return (
    <div className="relative w-full h-[100vh] overflow-hidden flex flex-col items-center justify-center bg-rw-black">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-rw-sky/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-rw-lavender/10 blur-[120px] rounded-full" />
      
      {/* Twinkling Stars */}
      <div className="absolute inset-0 z-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random() * 0.5 + 0.1
            }}
            animate={{ opacity: [Math.random() * 0.5 + 0.1, 1, Math.random() * 0.5 + 0.1] }}
            transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* 3D Globe */}
      <div className="absolute inset-0 z-0 opacity-60 mix-blend-screen pointer-events-none flex items-center justify-center">
        <div className="scale-[1.2] sm:scale-150 transform-gpu origin-center mt-[-10vh]">
          <Globe
            ref={globeEl}
            width={dimensions.width}
            height={dimensions.height}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
            backgroundColor="rgba(0,0,0,0)"
            pointsData={visitedPlaces}
            pointLat="lat"
            pointLng="lng"
            pointColor={() => '#D4AF37'}
            pointAltitude={0.05}
            pointRadius={0.5}
            arcsData={arcsData}
            arcColor="color"
            arcDashLength={0.4}
            arcDashGap={0.2}
            arcDashAnimateTime={2000}
            onGlobeReady={() => setGlobeReady(true)}
          />
        </div>
      </div>
      
      {/* Overlay Content */}
      <div className="z-10 flex flex-col items-center text-center mt-20 relative px-6 w-full max-w-2xl mx-auto">
        <motion.div 
          className="relative w-24 h-24 mb-4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Avatar with subtle glow */}
          <div className="absolute inset-0 bg-rw-sky/30 blur-2xl rounded-full scale-110" />
          <div className="w-full h-full rounded-full overflow-hidden border-4 border-rw-dark shadow-rw-glow relative z-10 bg-rw-surface">
            {profile.avatarUrl ? (
              <img 
                src={profile.avatarUrl} 
                alt={profile.name} 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer" 
              />
            ) : (
              <div className="w-full h-full bg-rw-gradient flex items-center justify-center">
                <span className="text-rw-black text-3xl font-bold">
                  {profile.name?.charAt(0)?.toUpperCase() || '?'}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ delay: 0.3, duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold text-rw-text leading-tight mb-1">
            {profile.name}
          </h1>
          <p className="text-sm text-rw-sky font-medium">@{profile.username}</p>
        </motion.div>

        {profile.bio && (
          <motion.p 
            className="text-sm text-rw-muted max-w-xs mx-auto mt-3 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {profile.bio}
          </motion.p>
        )}

        <motion.div 
          className="flex items-center justify-center gap-2 mt-4 flex-wrap"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          {profile.city && country && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rw-dark/60 backdrop-blur-xl border border-rw-border rounded-full group cursor-default">
              <span className="text-xs text-rw-text font-medium">
                📍 {profile.city} · {country.flag}
              </span>
            </div>
          )}
          
          {profile.instagram && (
            <a 
              href={`https://instagram.com/${profile.instagram}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rw-dark/60 backdrop-blur-xl border border-rw-border rounded-full hover:border-rw-sky/60 hover:bg-rw-sky/10 transition-all"
            >
              <span className="text-xs text-rw-text font-medium">
                📷 @{profile.instagram}
              </span>
            </a>
          )}
          
          <div className="px-3 py-1.5 rounded-full bg-rw-sky/10 border border-rw-sky/20 text-rw-sky text-[10px] font-black uppercase tracking-widest shadow-rw-glow-sm">
            Explorador Nível 4
          </div>
        </motion.div>
      </div>

      {/* Fade out bottom directly to rw-black */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-rw-black via-rw-black/60 to-transparent z-10" />
    </div>
  );
};

export default Hero3D;
