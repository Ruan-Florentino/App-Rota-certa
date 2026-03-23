import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { AnimatePresence, motion } from 'motion/react';
import { MobileContainer, FloatingBottomBar } from './MobileUI';

export const Layout: React.FC = () => {
  const { user } = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path === '/plan') return 'plan';
    if (path === '/map') return 'map';
    if (path === '/suggestions') return 'suggestions';
    if (path === '/profile') return 'profile';
    return 'home';
  };

  const handleTabChange = (tab: string) => {
    switch (tab) {
      case 'home': navigate('/'); break;
      case 'plan': navigate('/plan'); break;
      case 'map': navigate('/map'); break;
      case 'suggestions': navigate('/suggestions'); break;
      case 'profile': navigate('/profile'); break;
    }
  };

  const hideNav = ['/splash', '/onboarding'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-[#020617] flex justify-center">
      <MobileContainer>
        <main className="flex-1 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex flex-col"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        {!hideNav && (
          <FloatingBottomBar 
            activeTab={getActiveTab()} 
            onTabChange={handleTabChange} 
          />
        )}
      </MobileContainer>
    </div>
  );
};
