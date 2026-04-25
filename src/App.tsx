// Forced rebuild to trigger preview container reload.
import React, { lazy, Suspense } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useStore } from "./store/useStore";
import { UserProfile } from "./types";
import { useShallow } from "zustand/react/shallow";
import { auth, onAuthStateChanged, db, isFirebaseConfigured } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Layout } from "./components/Layout";
import { SplashScreen } from "./components/SplashScreen";
import { OnboardingScreen } from "./screens/OnboardingScreen";
import { LoadingScreen } from "./screens/LoadingScreen";
import { OfflineIndicator } from "./components/OfflineIndicator";
import { AmbientBackground } from "./components/background/AmbientBackground";

import { PageTransition } from "./components/PageTransition";
import { EffectsOverlay } from "./components/effects/EffectsOverlay";
import { useKonamiCode } from "./hooks/useKonamiCode";
import { useShakeDetection } from "./hooks/useShakeDetection";
import { useEasterEggStore } from "./stores/easterEggsStore";
import { triggerKonami } from "./lib/easterEggs";

import { seedProfileData } from "./utils/seedProfile";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { PageLoader } from "./components/PageLoader";
import { HomeScreen } from "./screens/HomeScreen";

// Lazy Screens
const PlanTripScreen = lazy(() => import("./screens/PlanTripScreen").then(m => ({ default: m.PlanTripScreen })));
const TripResultScreen = lazy(() => import("./screens/TripResultScreen").then(m => ({ default: m.TripResultScreen })));
const SavedTripsScreen = lazy(() => import("./screens/SavedTripsScreen").then(m => ({ default: m.SavedTripsScreen })));
const ProfileScreen = lazy(() => import("./features/profile/ProfileScreen").then(m => ({ default: m.ProfileScreen })));
const SocialPage = lazy(() => import("./pages/SocialPage"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));
const FinanceScreen = lazy(() => import("./screens/FinanceScreen").then(m => ({ default: m.FinanceScreen })));
const MapScreen = lazy(() => import("./screens/MapScreen").then(m => ({ default: m.MapScreen })));
const FlightScreen = lazy(() => import("./screens/FlightScreen").then(m => ({ default: m.FlightScreen })));
const HotelScreen = lazy(() => import("./screens/HotelScreen").then(m => ({ default: m.HotelScreen })));
const SuggestionsScreen = lazy(() => import("./screens/SuggestionsScreen").then(m => ({ default: m.SuggestionsScreen })));
const DestinationDetailScreen = lazy(() => import("./screens/DestinationDetailScreen").then(m => ({ default: m.DestinationDetailScreen })));
const ExploreScreen = lazy(() => import("./screens/ExploreScreen").then(m => ({ default: m.ExploreScreen })));
const CollectionPage = lazy(() => import("./pages/CollectionPage"));
const ContinentPage = lazy(() => import("./pages/ContinentPage"));
const VibePage = lazy(() => import("./pages/VibePage"));
const AILensScreen = lazy(() => import("./screens/AILensScreen").then(m => ({ default: m.AILensScreen })));
const UpgradeScreen = lazy(() => import("./screens/UpgradeScreen").then(m => ({ default: m.UpgradeScreen })));
const CommunityScreen = lazy(() => import("./screens/CommunityScreen").then(m => ({ default: m.CommunityScreen })));
const SwipeScreen = lazy(() => import("./screens/SwipeScreen").then(m => ({ default: m.SwipeScreen })));
const PublicTripScreen = lazy(() => import("./screens/PublicTripScreen").then(m => ({ default: m.PublicTripScreen })));
const PriceAlertScreen = lazy(() => import("./screens/PriceAlertScreen").then(m => ({ default: m.PriceAlertScreen })));
const PaymentSuccessScreen = lazy(() => import("./screens/PaymentSuccessScreen").then(m => ({ default: m.PaymentSuccessScreen })));
const AllDestinationsPage = lazy(() => import("./pages/AllDestinations").then(m => ({ default: m.AllDestinationsPage })));
const CollectionDetailScreen = lazy(() => import("./screens/CollectionDetailScreen").then(m => ({ default: m.CollectionDetailScreen })));

import { useEffect } from "react";
import { testAllImages } from "./utils/testImages";

import { Toaster } from 'sonner';
import { DevModePanel } from "./features/profile/DevModePanel";

export default function App() {
  const { setUser, loading } = useStore(
    useShallow((s) => ({
      setUser: s.setUser,
      loading: s.loading
    }))
  );
  const activateSecretTheme = useEasterEggStore(s => s.activateSecretTheme);
  
  useKonamiCode(triggerKonami);
  
  useShakeDetection(() => {
    // openRandomDestinationModal(); // Needs random modal state management
  });

  React.useEffect(() => {
    if (import.meta.env.DEV) {
      testAllImages();
    }
  }, []);

  const [showSplash, setShowSplash] = React.useState(true);
  const [showOnboarding, setShowOnboarding] = React.useState(false);

  React.useEffect(() => {
    if (!auth) {
      console.warn("Firebase Auth not initialized, skipping auth listener.");
      setShowSplash(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (!db) {
          // Fallback if db not initialized
          setUser({
            uid: user.uid,
            email: user.email || "",
            displayName: user.displayName || "",
            photoURL: user.photoURL || "",
            preferences: {
              currency: "BRL",
              language: "pt-BR",
              theme: "dark" as "dark",
            },
          } as UserProfile);
          return;
        }

        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (!userDoc.exists()) {
            const newUser = {
              uid: user.uid,
              email: user.email || "",
              displayName: user.displayName || "",
              photoURL: user.photoURL || "",
              tripsMade: 0,
              countriesVisited: 0,
              points: 0,
              rank: "Explorador Iniciante",
              averageIncome: 5000,
              favoriteDestination: "",
              travelStyle: "Aventureiro",
              travelPace: "Moderado",
              travelInterests: ["Cultura", "Natureza"],
              defaultBudget: 5000,
              referralCode: `RIGHT${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
              preferences: {
                currency: "BRL",
                language: "pt-BR",
                theme: "dark" as "dark",
              },
            };
            await setDoc(doc(db, 'users', user.uid), newUser);
            setUser(newUser);
          } else {
            const data = userDoc.data() as UserProfile;
            if (!data.referralCode) {
              const referralCode = `RIGHT${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
              await setDoc(doc(db, 'users', user.uid), { referralCode }, { merge: true });
              data.referralCode = referralCode;
            }
            setUser({
              ...data,
              uid: user.uid,
              email: user.email || "",
            });
            import('./services/subscriptionService').then(m => m.useSubscription.getState().sync());
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          // Fallback
          setUser({
            uid: user.uid,
            email: user.email || "",
            displayName: user.displayName || "",
            photoURL: user.photoURL || "",
            preferences: {
              currency: "BRL",
              language: "pt-BR",
              theme: "dark" as "dark",
            },
          });
        }
      } else {
        setUser(null);
      }
    });

    // Check if onboarding has been seen
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }

    // Seed data
    seedProfileData();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [setUser]);

  return (
    <ErrorBoundary>
      <AnimatePresence mode="wait">
        {showSplash ? (
          <SplashScreen key="splash" onFinish={() => setShowSplash(false)} />
        ) : showOnboarding ? (
          <OnboardingScreen
            key="onboarding"
            onFinish={() => {
              localStorage.setItem("hasSeenOnboarding", "true");
              setShowOnboarding(false);
            }}
          />
        ) : (
          <motion.div 
            key="main-app"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex-1 flex flex-col w-full h-full"
          >
            <Router>
              {import.meta.env.DEV && <DevModePanel />}
              <Toaster 
                position="top-center"
                theme="dark"
                richColors
                closeButton
                toastOptions={{
                  style: {
                    background: 'rgba(20, 20, 30, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'white',
                  },
                }}
              />
              <EffectsOverlay />
              <OfflineIndicator />
              <AmbientBackground />
              <div className="min-h-[100dvh] bg-[#020617] text-text-primary flex flex-col selection:bg-primary/30 relative z-10">
                {loading && <LoadingScreen />}

                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/app" element={<PaymentSuccessScreen />} />
                    <Route element={<Layout />}>
                      <Route path="/" element={<HomeScreen />} />
                      <Route path="/explorar" element={<ExploreScreen />} />
                      <Route path="/explorar/mapa" element={<MapScreen />} />
                      <Route path="/plan" element={<PlanTripScreen />} />
                      <Route path="/map" element={<MapScreen />} />
                      <Route path="/flights" element={<FlightScreen />} />
                      <Route path="/hotels" element={<HotelScreen />} />
                      <Route path="/suggestions" element={<SuggestionsScreen />} />
                      <Route path="/destination/:id" element={<DestinationDetailScreen />} />
                      <Route path="/expenses" element={<FinanceScreen />} />
                      <Route path="/results" element={<TripResultScreen />} />
                      <Route path="/saved" element={<SavedTripsScreen />} />
                      <Route path="/trips" element={<Navigate to="/saved" replace />} />
                      <Route path="/colecao/:id" element={<CollectionPage />} />
                      <Route path="/continente/:id" element={<ContinentPage />} />
                      <Route path="/vibe/:id" element={<VibePage />} />
                      <Route path="/explore/all-destinations" element={<AllDestinationsPage />} />
                      <Route path="/collection/:id" element={<CollectionPage />} />
                      <Route path="/profile" element={<ProfileScreen />} />
                      <Route path="/u/:username" element={<ProfileScreen />} />
                      <Route path="/social" element={<SocialPage />} />
                      <Route path="/notifications" element={<NotificationsPage />} />
                      <Route path="/lens" element={<AILensScreen />} />
                      <Route path="/upgrade" element={<UpgradeScreen />} />
                      <Route path="/alerts" element={<PriceAlertScreen />} />
                      <Route path="/community" element={<CommunityScreen />} />
                      <Route path="/swipe" element={<SwipeScreen />} />
                      <Route path="/trip/:tripId" element={<PublicTripScreen />} />
                      <Route path="/explore" element={<Navigate to="/explorar" replace />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                  </Routes>
                </Suspense>
              </div>
            </Router>
          </motion.div>
        )}
      </AnimatePresence>
    </ErrorBoundary>
  );
}
