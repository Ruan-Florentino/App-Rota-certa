import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import { auth, onAuthStateChanged } from './firebase';
import { Layout } from './components/Layout';
import { SplashScreen } from './screens/SplashScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { HomeScreen } from './screens/HomeScreen';
import { PlanTripScreen } from './screens/PlanTripScreen';
import { LoadingScreen } from './screens/LoadingScreen';
import { TripResultScreen } from './screens/TripResultScreen';
import { SavedTripsScreen } from './screens/SavedTripsScreen';
import { StartMenu } from './screens/StartMenu';
import { ProfileScreen } from './screens/ProfileScreen';
import { FinanceScreen } from './screens/FinanceScreen';
import { MapScreen } from './screens/MapScreen';
import { FlightScreen } from './screens/FlightScreen';
import { HotelScreen } from './screens/HotelScreen';
import { SuggestionsScreen } from './screens/SuggestionsScreen';
import { DestinationDetailScreen } from './screens/DestinationDetailScreen';
import { MockupScreen } from './screens/MockupScreen';

export default function App() {
  const { setUser, loading } = useStore();
  const [showSplash, setShowSplash] = React.useState(true);
  const [showOnboarding, setShowOnboarding] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          preferences: {
            currency: 'BRL',
            language: 'pt-BR',
            theme: 'dark'
          }
        });
      } else {
        setUser(null);
      }
    });

    // Check if onboarding has been seen
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }

    return () => unsubscribe();
  }, [setUser]);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (showOnboarding) {
    return (
      <OnboardingScreen 
        onFinish={() => {
          localStorage.setItem('hasSeenOnboarding', 'true');
          setShowOnboarding(false);
        }} 
      />
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-background text-text flex flex-col selection:bg-primary/30">
        {loading && <LoadingScreen />}
        
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/plan" element={<PlanTripScreen />} />
            <Route path="/map" element={<MapScreen />} />
            <Route path="/flights" element={<FlightScreen />} />
            <Route path="/hotels" element={<HotelScreen />} />
            <Route path="/suggestions" element={<SuggestionsScreen />} />
            <Route path="/destination/:id" element={<DestinationDetailScreen />} />
            <Route path="/expenses" element={<FinanceScreen />} />
            <Route path="/results" element={<TripResultScreen />} />
            <Route path="/saved" element={<SavedTripsScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/mockup" element={<MockupScreen />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}
