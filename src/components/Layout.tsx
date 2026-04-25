import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { AnimatePresence, motion, Variants } from "motion/react";
import { MobileContainer, FloatingBottomBar, FloatingAssistant } from "./MobileUI";

import { useShallow } from "zustand/react/shallow";

import BottomNavLiquid from "./navigation/BottomNavLiquid";

export const Layout: React.FC = () => {
  const user = useStore(useShallow((s) => s.user));
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === "/") return "home";
    if (path === "/plan") return "plus";
    if (path === "/explore") return "explore";
    if (path === "/map") return "map";
    if (path === "/social") return "social";
    if (path === "/profile") return "profile";
    return "home";
  };

  const handleTabChange = (tab: string) => {
    switch (tab) {
      case "home":
        navigate("/");
        break;
      case "plus":
        navigate("/plan");
        break;
      case "explore":
        navigate("/explore");
        break;
      case "map":
        navigate("/map");
        break;
      case "social":
        navigate("/social");
        break;
      case "profile":
        navigate("/profile");
        break;
    }
  };

  const hideNav = ["/splash", "/onboarding"].includes(location.pathname);

  // Directional logic placeholder
  const direction = 1;

  const pageVariants: Variants = {
    initial: {
      opacity: 0,
      x: direction > 0 ? 30 : -30,
      scale: 1.04,
      filter: 'blur(8px)'
    },
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.45,
        ease: [0.32, 0.72, 0, 1] as any
      }
    },
    exit: {
      opacity: 0,
      x: direction > 0 ? -30 : 30,
      scale: 0.96,
      filter: 'blur(8px)',
      transition: {
        duration: 0.35,
        ease: [0.32, 0.72, 0, 1] as any
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex justify-center selection:bg-[#A855F7]/30">
      <MobileContainer>
        <main className="flex-1 flex flex-col">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={location.pathname}
              custom={direction}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex-1 flex flex-col"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        {!hideNav && (
          <>
            <FloatingAssistant />
            <BottomNavLiquid 
              activeTab={getActiveTab()} 
              onTabChange={handleTabChange} 
            />
          </>
        )}
      </MobileContainer>
    </div>
  );
};
