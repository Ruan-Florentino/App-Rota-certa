import React, { lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  MapPin, 
  ChevronLeft, 
  Share2, 
  Bookmark, 
  Clock, 
  DollarSign, 
  Sun, 
  Plane, 
  Hotel, 
  Navigation, 
  Info,
  Star,
  ArrowRight,
  Sparkles,
  Utensils,
  Camera,
  Bus,
  CheckCircle2,
  Globe,
  Languages,
  Coins,
  Wallet,
  Heart,
  RefreshCw,
  Download,
  Map as MapIcon,
  Lock,
  Briefcase,
  Users,
  Plus,
  Trash2,
  ShieldAlert,
  Phone,
  MessageSquare,
  Volume2,
  VolumeX,
  Compass,
  Copy,
  X,
  Headphones,
  Hourglass,
  Square,
  BookHeart,
  Aperture,
  ThumbsUp,
  ThumbsDown,
  Gamepad2,
  Trophy,
  Target,
  Bell
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { Trip } from '../types';
import { db, auth, collection, addDoc, serverTimestamp, doc, updateDoc, increment, getDoc, getDocs, query, where } from '../firebase';
import { getWeather, WeatherData } from '../services/weatherService';
import { getDynamicImage, getHotelImage, getPlaceImage, getAirlineLogo } from '../services/imageService';
import { 
  SparklesIcon, 
  HeartIcon, 
  CopyIcon, 
  CalendarIcon, 
  ExploreIcon, 
  WorldIcon, 
  TrophyIcon, 
  WalletIcon,
  PlaneIcon,
  ShieldIcon,
  LogoutIcon,
  SettingsIcon,
  BellIcon,
  AwardIcon,
  MapPinIcon,
  SearchIcon,
  CompassIcon,
  ClockIcon,
  NavigationIcon
} from '../components/icons';
import { PremiumCard } from '../components/ui/PremiumCard';
import { PremiumButton } from '../components/ui/PremiumButton';
import { LoadingState } from '../components/ui/LoadingState';
import { EmptyState } from '../components/ui/EmptyState';
import { SafeImage } from '../components/ui/SafeImage';
import { getCurrencyRates, convertCurrency, CurrencyRates } from '../services/currencyService';
import { generatePackingList, generateSurvivalGuide, generateOutfitSuggestion, translateText, generateHiddenGems, generateJournalInsight, generateAudioGuide, generateTimeMachine, generateLocalFood, generateEmergencyInfo, generateCulturalEtiquette, generatePhotoSpots, generateSecretMissions } from '../services/geminiService';
import { AnimatedContainer, BlurCard, Modal, GlowButton } from '../components/MobileUI';
import { OptimizedImage } from '../components/OptimizedImage';
import { Globe3D } from '../components/Globe3D';
import { Map2D } from '../components/Map2D';
import html2pdf from 'html2pdf.js';
import html2canvas from 'html2canvas';
import { ShareCard } from '../components/ShareCard';

import { formatCurrency } from '../utils';
import { TripAssistant } from '../components/TripAssistant';
import { TripChat } from '../components/TripChat';

import { checkLimit } from '../services/subscriptionService';
import { trackEvent } from '../services/analyticsService';

import { toast } from 'sonner';
import { TripService } from '../services/trips';

import { useGenerationContext } from '../hooks/useGenerationContext';

// Lazy Tabs
const ItineraryTab = lazy(() => import('../components/TripResult/tabs/ItineraryTab').then(m => ({ default: m.ItineraryTab })));
const FlightsTab = lazy(() => import('../components/TripResult/tabs/FlightsTab').then(m => ({ default: m.FlightsTab })));
const HotelsTab = lazy(() => import('../components/TripResult/tabs/HotelsTab').then(m => ({ default: m.HotelsTab })));
const PackingTab = lazy(() => import('../components/TripResult/tabs/PackingTab').then(m => ({ default: m.PackingTab })));
const JournalTab = lazy(() => import('../components/TripResult/tabs/JournalTab').then(m => ({ default: m.JournalTab })));
const ExpensesTab = lazy(() => import('../components/TripResult/tabs/ExpensesTab').then(m => ({ default: m.ExpensesTab })));
const MissionsTab = lazy(() => import('../components/TripResult/tabs/MissionsTab').then(m => ({ default: m.MissionsTab })));
const InfoTab = lazy(() => import('../components/TripResult/tabs/InfoTab').then(m => ({ default: m.InfoTab })));
const GalleryTab = lazy(() => import('../components/TripResult/tabs/GalleryTab').then(m => ({ default: m.GalleryTab })));
const TranslatorTab = lazy(() => import('../components/TripResult/tabs/TranslatorTab').then(m => ({ default: m.TranslatorTab })));
const GemsTab = lazy(() => import('../components/TripResult/tabs/GemsTab').then(m => ({ default: m.GemsTab })));
const TimeMachineTab = lazy(() => import('../components/TripResult/tabs/TimeMachineTab').then(m => ({ default: m.TimeMachineTab })));
const GastronomyTab = lazy(() => import('../components/TripResult/tabs/GastronomyTab').then(m => ({ default: m.GastronomyTab })));
const PhotoSpotsTab = lazy(() => import('../components/TripResult/tabs/PhotoSpotsTab').then(m => ({ default: m.PhotoSpotsTab })));
const EtiquetteTab = lazy(() => import('../components/TripResult/tabs/EtiquetteTab').then(m => ({ default: m.EtiquetteTab })));
const SOSTab = lazy(() => import('../components/TripResult/tabs/SOSTab').then(m => ({ default: m.SOSTab })));

export const TripResultScreen: React.FC = () => {
  const navigate = useNavigate();
  const genContext = useGenerationContext();
  const { 
    currentTrip, 
    user, 
    addTrip, 
    toggleFavorite, 
    favorites, 
    setCurrentTrip,
    completeTrip,
    togglePackingItem,
    updateItineraryActivity,
    deleteItineraryActivity
  } = useStore(
    useShallow((s) => ({
      currentTrip: s.currentTrip,
      user: s.user,
      addTrip: s.addTrip,
      toggleFavorite: s.toggleFavorite,
      favorites: s.favorites,
      setCurrentTrip: s.setCurrentTrip,
      completeTrip: s.completeTrip,
      togglePackingItem: s.togglePackingItem,
      updateItineraryActivity: s.updateItineraryActivity,
      deleteItineraryActivity: s.deleteItineraryActivity
    }))
  );
  const [weather, setWeather] = React.useState<WeatherData[]>([]);
  const [activeTab, setActiveTab] = React.useState<'itinerary' | 'flights' | 'hotels' | 'info' | 'packing' | 'gallery' | 'journal' | 'translator' | 'gems' | 'expenses' | 'timemachine' | 'gastronomy' | 'sos' | 'etiquette' | 'photo' | 'missions'>('itinerary');
  const [saving, setSaving] = React.useState(false);
  const [downloading, setDownloading] = React.useState(false);
  const [heroImage, setHeroImage] = React.useState('');
  const [galleryImages, setGalleryImages] = React.useState<string[]>([]);
  const [rates, setRates] = React.useState<CurrencyRates | null>(null);
  const [isGeneratingPackingList, setIsGeneratingPackingList] = React.useState(false);
  const [isGeneratingSurvivalGuide, setIsGeneratingSurvivalGuide] = React.useState(false);
  const [isMapView, setIsMapView] = React.useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = React.useState(false);

  // New features state
  const [outfitSuggestion, setOutfitSuggestion] = React.useState<any | null>(null);
  const [isGeneratingOutfit, setIsGeneratingOutfit] = React.useState(false);
  
  const [translationInput, setTranslationInput] = React.useState('');
  const [translationResult, setTranslationResult] = React.useState<any | null>(null);
  const [isTranslating, setIsTranslating] = React.useState(false);

  const [hiddenGems, setHiddenGems] = React.useState<any[]>([]);
  const [isGeneratingGems, setIsGeneratingGems] = React.useState(false);
  const [gastronomyGuide, setGastronomyGuide] = React.useState<any[]>([]);
  const [isGeneratingGastronomy, setIsGeneratingGastronomy] = React.useState(false);
  const [emergencyInfo, setEmergencyInfo] = React.useState<any | null>(null);
  const [isGeneratingEmergency, setIsGeneratingEmergency] = React.useState(false);
  const [culturalEtiquette, setCulturalEtiquette] = React.useState<any | null>(null);
  const [isGeneratingEtiquette, setIsGeneratingEtiquette] = React.useState(false);
  const [photoSpots, setPhotoSpots] = React.useState<any[]>([]);
  const [isGeneratingPhotoSpots, setIsGeneratingPhotoSpots] = React.useState(false);
  const [secretMissions, setSecretMissions] = React.useState<any[]>([]);
  const [isGeneratingMissions, setIsGeneratingMissions] = React.useState(false);
  const [completedMissions, setCompletedMissions] = React.useState<number[]>([]);
  const [isReoptimizingDay, setIsReoptimizingDay] = React.useState<number | null>(null);
  const [isGeneratingInsight, setIsGeneratingInsight] = React.useState<string | null>(null);
  const [isSummarizingJournal, setIsSummarizingJournal] = React.useState(false);
  const [journalSummary, setJournalSummary] = React.useState<string | null>(null);

  // Audio Guide & Time Machine State
  const [playingAudioActivity, setPlayingAudioActivity] = React.useState<string | null>(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = React.useState<string | null>(null);
  const [timeMachineEra, setTimeMachineEra] = React.useState<string>('100 Anos Atrás');
  const [timeMachineResult, setTimeMachineResult] = React.useState<any | null>(null);
  const [isGeneratingTimeMachine, setIsGeneratingTimeMachine] = React.useState(false);

  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const [isCollaboratorsModalOpen, setIsCollaboratorsModalOpen] = React.useState(false);
  const [collaboratorEmail, setCollaboratorEmail] = React.useState('');
  const [isSearchingUser, setIsSearchingUser] = React.useState(false);
  const [collaboratorError, setCollaboratorError] = React.useState<string | null>(null);
  const [collaboratorProfiles, setCollaboratorProfiles] = React.useState<any[]>([]);

  const isOwner = currentTrip?.userId === user?.uid;
  const isCollaborator = currentTrip?.collaborators?.includes(user?.uid || '');
  const canEdit = isOwner || isCollaborator;

  React.useEffect(() => {
    const fetchCollaborators = async () => {
      if (currentTrip?.collaborators && currentTrip.collaborators.length > 0) {
        const profiles = await Promise.all(
          currentTrip.collaborators.map(async (uid) => {
            const userDoc = await getDoc(doc(db, 'users', uid));
            return userDoc.exists() ? userDoc.data() : null;
          })
        );
        setCollaboratorProfiles(profiles.filter(p => p !== null));
      } else {
        setCollaboratorProfiles([]);
      }
    };
    fetchCollaborators();
  }, [currentTrip?.collaborators]);

  const handleAddCollaborator = async () => {
    if (!collaboratorEmail.trim() || !currentTrip?.id) return;
    setIsSearchingUser(true);
    setCollaboratorError(null);
    try {
      const q = query(collection(db, 'users'), where('email', '==', collaboratorEmail.trim().toLowerCase()));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        setCollaboratorError("Usuário não encontrado.");
        return;
      }

      const targetUser = querySnapshot.docs[0].data();
      if (targetUser.uid === user?.uid) {
        setCollaboratorError("Você já é o dono desta viagem!");
        return;
      }

      if (currentTrip.collaborators?.includes(targetUser.uid)) {
        setCollaboratorError("Este usuário já é um parceiro!");
        return;
      }

      const updatedCollaborators = [...(currentTrip.collaborators || []), targetUser.uid];
      const tripRef = doc(db, 'trips', currentTrip.id);
      await updateDoc(tripRef, { collaborators: updatedCollaborators });
      
      const updatedTrip = { ...currentTrip, collaborators: updatedCollaborators };
      setCurrentTrip(updatedTrip);
      setCollaboratorEmail('');
      setIsCollaboratorsModalOpen(false);
    } catch (error) {
      console.error("Error adding collaborator:", error);
    } finally {
      setIsSearchingUser(false);
    }
  };

  const handleRemoveCollaborator = async (uid: string) => {
    if (!currentTrip?.id || !isOwner) return;
    try {
      const updatedCollaborators = currentTrip.collaborators?.filter(id => id !== uid) || [];
      const tripRef = doc(db, 'trips', currentTrip.id);
      await updateDoc(tripRef, { collaborators: updatedCollaborators });
      
      const updatedTrip = { ...currentTrip, collaborators: updatedCollaborators };
      setCurrentTrip(updatedTrip);
    } catch (error) {
      console.error("Error removing collaborator:", error);
    }
  };

  const handleGenerateJournalInsight = async (entryText: string, entryId: string) => {
    if (!currentTrip || !entryText.trim()) return;
    setIsGeneratingInsight(entryId);
    try {
      const insight = await generateJournalInsight(entryText, currentTrip.destination);
      const newJournal = currentTrip.journal?.map(entry => 
        entry.id === entryId ? { ...entry, insight } : entry
      );
      const updatedTrip = { ...currentTrip, journal: newJournal };
      useStore.getState().updateTrip(updatedTrip);
      if (updatedTrip.id) handleSave(updatedTrip);
    } catch (error) {
      console.error("Error generating journal insight:", error);
    } finally {
      setIsGeneratingInsight(null);
    }
  };

  const handleSummarizeJournal = async () => {
    if (!currentTrip?.journal || currentTrip.journal.length === 0) return;
    setIsSummarizingJournal(true);
    try {
      const summary = "Resumo do diário gerado com sucesso.";
      setJournalSummary(summary);
    } catch (error) {
      console.error("Error summarizing journal:", error);
    } finally {
      setIsSummarizingJournal(false);
    }
  };

  const handleReoptimizeDay = async (dayNumber: number) => {
    if (!currentTrip) return;
    setIsReoptimizingDay(dayNumber);
    try {
      const dayIndex = dayNumber - 1;
      const currentActivities = currentTrip.itinerary[dayIndex].activities;
      const newActivities = currentActivities; // Fallback

      const newItinerary = [...currentTrip.itinerary];
      newItinerary[dayIndex] = {
        ...newItinerary[dayIndex],
        activities: newActivities
      };

      const updatedTrip = { ...currentTrip, itinerary: newItinerary };
      setCurrentTrip(updatedTrip);
      if (updatedTrip.id) handleSave(updatedTrip);
    } catch (error) {
      console.error("Error reoptimizing day:", error);
    } finally {
      setIsReoptimizingDay(null);
    }
  };

  const handleGenerateHiddenGems = async () => {
    if (!currentTrip) return;
    setIsGeneratingGems(true);
    try {
      const gems = await generateHiddenGems(currentTrip.destination);
      setHiddenGems(gems);
      // Update trip in store if needed
      const updatedTrip = {
        ...currentTrip,
        info: {
          ...currentTrip.info,
          hiddenGems: gems
        }
      };
      setCurrentTrip(updatedTrip);
    } catch (error) {
      console.error("Error generating gems:", error);
    } finally {
      setIsGeneratingGems(false);
    }
  };

  const handleGenerateGastronomy = async () => {
    if (!currentTrip) return;
    setIsGeneratingGastronomy(true);
    try {
      const guide = await generateLocalFood(currentTrip.destination);
      setGastronomyGuide(guide);
    } catch (error) {
      console.error("Error generating gastronomy guide:", error);
    } finally {
      setIsGeneratingGastronomy(false);
    }
  };

  const handleGenerateEmergencyInfo = async () => {
    if (!currentTrip) return;
    setIsGeneratingEmergency(true);
    try {
      const info = await generateEmergencyInfo(currentTrip.destination);
      setEmergencyInfo(info);
    } catch (error) {
      console.error("Error generating emergency info:", error);
    } finally {
      setIsGeneratingEmergency(false);
    }
  };

  const handleGenerateEtiquette = async () => {
    if (!currentTrip) return;
    setIsGeneratingEtiquette(true);
    try {
      const info = await generateCulturalEtiquette(currentTrip.destination);
      setCulturalEtiquette(info);
    } catch (error) {
      console.error("Error generating etiquette:", error);
    } finally {
      setIsGeneratingEtiquette(false);
    }
  };

  const handleGeneratePhotoSpots = async () => {
    if (!currentTrip) return;
    setIsGeneratingPhotoSpots(true);
    try {
      const spots = await generatePhotoSpots(currentTrip.destination);
      setPhotoSpots(spots);
    } catch (error) {
      console.error("Error generating photo spots:", error);
    } finally {
      setIsGeneratingPhotoSpots(false);
    }
  };

  const handleGenerateMissions = async () => {
    if (!currentTrip) return;
    setIsGeneratingMissions(true);
    try {
      const missions = await generateSecretMissions(currentTrip.destination);
      setSecretMissions(missions);
      setCompletedMissions([]);
    } catch (error) {
      console.error("Error generating missions:", error);
    } finally {
      setIsGeneratingMissions(false);
    }
  };

  const toggleMission = (index: number) => {
    setCompletedMissions(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const handleGenerateOutfit = async () => {
    if (!currentTrip || weather.length === 0) return;
    setIsGeneratingOutfit(true);
    try {
      const suggestion = await generateOutfitSuggestion(currentTrip.destination, JSON.stringify(weather), "Exploração geral");
      setOutfitSuggestion(suggestion);
    } catch (error) {
      console.error("Error generating outfit:", error);
    } finally {
      setIsGeneratingOutfit(false);
    }
  };

  const handleTranslate = async () => {
    if (!currentTrip || !translationInput.trim()) return;
    setIsTranslating(true);
    try {
      const result = await translateText(
        translationInput, 
        currentTrip.destination, 
        currentTrip.info?.language || 'idioma local',
        genContext
      );
      setTranslationResult(result);
    } catch (error) {
      console.error("Error translating:", error);
    } finally {
      setIsTranslating(false);
    }
  };

  const handlePlayAudioTour = async (activityId: string, placeName: string) => {
    if (!currentTrip) return;

    // If already playing this activity, stop it
    if (playingAudioActivity === activityId) {
      window.speechSynthesis.cancel();
      setPlayingAudioActivity(null);
      return;
    }

    // Stop any current audio
    window.speechSynthesis.cancel();
    setPlayingAudioActivity(null);
    setIsGeneratingAudio(activityId);

    try {
      const script = await generateAudioGuide(placeName, currentTrip.destination);
      
      const utterance = new SpeechSynthesisUtterance(script);
      utterance.lang = 'pt-BR';
      utterance.rate = 1.0;
      utterance.pitch = 1.1;
      
      utterance.onend = () => {
        setPlayingAudioActivity(null);
      };
      utterance.onerror = () => {
        setPlayingAudioActivity(null);
      };

      window.speechSynthesis.speak(utterance);
      setPlayingAudioActivity(activityId);
    } catch (error) {
      console.error("Error playing audio tour:", error);
    } finally {
      setIsGeneratingAudio(null);
    }
  };

  const handleGenerateTimeMachine = async () => {
    if (!currentTrip) return;
    setIsGeneratingTimeMachine(true);
    try {
      const result = await generateTimeMachine(currentTrip.destination, currentTrip.destination, timeMachineEra);
      setTimeMachineResult(result);
    } catch (error) {
      console.error("Error generating time machine:", error);
    } finally {
      setIsGeneratingTimeMachine(false);
    }
  };

  const handleAudioGuide = () => {
    if (!currentTrip) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const textToRead = `
      Bem-vindo ao roteiro de ${currentTrip.destination}.
      ${currentTrip.itinerary.map(day => `
        Dia ${day.day}.
        ${day.activities.map(act => `
          À ${act.time}, ${act.activity}. ${act.description || ''}
        `).join('. ')}
      `).join('. ')}
    `;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.1;
    
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleGenerateSurvivalGuide = async () => {
    if (!currentTrip) return;
    setIsGeneratingSurvivalGuide(true);
    try {
      const guide = await generateSurvivalGuide(currentTrip.destination);
      const updatedTrip = { 
        ...currentTrip, 
        info: { ...currentTrip.info, survivalGuide: guide } 
      };
      const { updateTrip } = useStore.getState();
      updateTrip(updatedTrip);
      if (updatedTrip.id) {
        handleSave(updatedTrip);
      }
    } catch (error) {
      console.error("Error generating survival guide:", error);
    } finally {
      setIsGeneratingSurvivalGuide(false);
    }
  };

  const handleGeneratePackingList = async () => {
    if (!currentTrip) return;
    setIsGeneratingPackingList(true);
    try {
      const days = currentTrip.itinerary.length;
      const newList = await generatePackingList(currentTrip.destination, days, currentTrip.type);
      const updatedTrip = { ...currentTrip, packingList: newList };
      const { updateTrip } = useStore.getState();
      updateTrip(updatedTrip);
      if (updatedTrip.id) {
        handleSave(updatedTrip);
      }
    } catch (error) {
      console.error("Error generating packing list:", error);
    } finally {
      setIsGeneratingPackingList(false);
    }
  };

  React.useEffect(() => {
    if (currentTrip) {
      getWeather(currentTrip.destination).then(setWeather);
      getDynamicImage(currentTrip.destination).then(setHeroImage);
      getCurrencyRates('BRL').then(setRates);
      
      import('../services/imageService').then(({ getCityImages }) => {
        getCityImages(currentTrip.destination).then(setGalleryImages);
      });

      // Fetch images for hotels and activities if they don't have real ones
      const fetchImages = async () => {
        let changed = false;
        const updatedTrip = { ...currentTrip };

        if (currentTrip.hotels && currentTrip.hotels.length > 0) {
          const updatedHotels = await Promise.all(currentTrip.hotels.map(async (hotel) => {
            if (hotel && (!hotel.image || hotel.image.includes('placeholder') || hotel.image.includes('images.unsplash.com/photo-1500000000000'))) {
              const image = await getHotelImage(hotel.name, currentTrip.destination);
              if (image && image !== hotel.image) {
                changed = true;
                return { ...hotel, image };
              }
            }
            return hotel;
          }));
          updatedTrip.hotels = updatedHotels;
        }

        // Fetch images for activities
        const updatedItinerary = await Promise.all(currentTrip.itinerary.map(async (day) => {
          if (!day?.activities) return day;
          const updatedActivities = await Promise.all(day.activities.map(async (act) => {
            if (act && (!act.image || act.image.includes('placeholder') || act.image.includes('images.unsplash.com/photo-1500000000000'))) {
              const query = act.placeName || act.activity;
              const image = await getPlaceImage(query, currentTrip.destination);
              if (image && image !== act.image) {
                changed = true;
                return { ...act, image };
              }
            }
            return act;
          }));
          return { ...day, activities: updatedActivities };
        }));
        updatedTrip.itinerary = updatedItinerary;
        
        if (changed) {
          setCurrentTrip(updatedTrip);
        }
      };
      fetchImages();
    }
  }, [currentTrip, setCurrentTrip]);

  if (!currentTrip) {
    navigate('/');
    return null;
  }

  const isFavorite = currentTrip.id ? favorites.includes(currentTrip.id) : false;
  
  const openLink = (url?: string) => {
    if (!url) return;
    window.open(url, '_blank');
  };

  const [saveStatus, setSaveStatus] = React.useState<'idle' | 'saving' | 'success' | 'error' | 'unauthorized'>('idle');

  const renderPrice = (amount: number) => {
    if (!rates || !currentTrip.info?.currency || currentTrip.info.currency === 'BRL') {
      return (
        <div className="flex flex-col items-end">
          <span className="text-white font-bold">{formatCurrency(amount)}</span>
        </div>
      );
    }
    const localAmount = convertCurrency(amount, 'BRL', currentTrip.info.currency, rates);
    
    // Format currency symbol
    const getSymbol = (currency: string) => {
      switch(currency) {
        case 'EUR': return '€';
        case 'USD': return '$';
        case 'GBP': return '£';
        default: return currency;
      }
    };

    const symbol = getSymbol(currentTrip.info.currency);

    return (
      <div className="flex flex-col items-end">
        <span className="text-white font-bold text-lg">{symbol} {localAmount.toFixed(2)}</span>
        <span className="text-white/50 text-xs font-medium">{formatCurrency(amount)}</span>
      </div>
    );
  };

  const handleSave = async (tripToSave?: any, preventNavigate: boolean = false) => {
    const trip = tripToSave || currentTrip;
    if (!user) {
      toast.error('Você precisa estar logado para salvar viagens!');
      setSaveStatus('unauthorized');
      return null;
    }

    const toastId = toast.loading('Salvando seu roteiro...', {
      style: { background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)' }
    });

    setSaving(true);
    setSaveStatus('saving');

    try {
      if (trip.id) {
        // Update existing trip
        await TripService.update(trip.id, trip as any);
        setSaveStatus('success');
        toast.success('Roteiro atualizado com sucesso!', { id: toastId });
        
        setTimeout(() => {
          setSaveStatus('idle');
        }, 1500);
        return trip.id;
      } else {
        // Create new trip
        // Ensure title exists for validation
        const tripData = {
          ...trip,
          title: trip.title || `Viagem para ${typeof trip.destination === 'string' ? trip.destination : (trip.destination?.name || 'Destino')}`,
          destination: typeof trip.destination === 'object' ? trip.destination : { name: trip.destination || 'Destino', country: trip.country || 'Desconhecido' },
          startDate: trip.startDate || new Date().toISOString(),
          endDate: trip.endDate || new Date(Date.now() + 86400000).toISOString(),
          travelers: trip.travelers || 1,
        };

        const result = await TripService.create(tripData as any);
        
        if (result.success) {
          const savedTrip = { ...tripData, id: result.id };
          addTrip(savedTrip);
          setCurrentTrip(savedTrip);
          setSaveStatus('success');
          trackEvent('trip_saved');
          
          toast.success('Roteiro salvo! 🎉 Tudo pronto para sua aventura.', { 
            id: toastId,
            duration: 3000
          });

          setTimeout(() => {
            setSaveStatus('idle');
            if (!preventNavigate) {
              navigate('/saved');
            }
          }, 1500);
          return result.id;
        }
      }
    } catch (error: any) {
      console.error('Error saving trip:', error);
      setSaveStatus('error');
      toast.error(error.message || 'Erro ao salvar roteiro. Tente novamente.', { 
        id: toastId,
        duration: 5000
      });
      return null;
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (user) {
      const canDownload = await checkLimit(user.uid, 'pdf');
      if (!canDownload) {
        toast.error("A exportação para PDF é exclusiva para assinantes Premium. Assine agora para desbloquear!");
        navigate('/upgrade');
        return;
      }
      trackEvent('pdf_exported', { destination: currentTrip?.destination || '' });
    }
    setDownloading(true);
    const element = document.getElementById('trip-content-to-pdf');
    if (!element) {
      setDownloading(false);
      return;
    }

    // Temporarily show all tabs for the PDF
    const originalTab = activeTab;
    setActiveTab('itinerary'); // We'll just print the itinerary for now as it's the most important

    setTimeout(() => {
      const opt = {
        margin:       10,
        filename:     `Roteiro-${currentTrip!.destination.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`,
        image:        { type: 'jpeg' as const, quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, backgroundColor: '#020617' },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
      };

      html2pdf().set(opt).from(element).save().then(() => {
        setDownloading(false);
        setActiveTab(originalTab);
      }).catch((err: any) => {
        console.error("Error generating PDF:", err);
        setDownloading(false);
        setActiveTab(originalTab);
      });
    }, 500);
  };

  const handleShareCommunity = async () => {
    if (!currentTrip || !user) return;

    const canShare = await checkLimit(user.uid, 'social');
    if (!canShare) {
      toast.error("O compartilhamento na comunidade é exclusivo para assinantes Premium. Assine agora para inspirar outros viajantes!");
      navigate('/upgrade');
      return;
    }

    setSaving(true);
    try {
      const tripRef = doc(db, 'trips', currentTrip.id || 'temp');
      const publicData = {
        ...currentTrip,
        isPublic: true,
        authorName: user.displayName,
        authorPhoto: user.photoURL,
        likes: 0,
        likedBy: [],
        clones: 0,
        sharedAt: serverTimestamp()
      };
      
      if (currentTrip.id) {
        await updateDoc(tripRef, publicData);
      } else {
        await addDoc(collection(db, 'trips'), publicData);
      }
      
      trackEvent('trip_shared');
      toast.success("Roteiro compartilhado com sucesso na comunidade!");
    } catch (error) {
      console.error("Error sharing to community:", error);
      toast.error("Erro ao compartilhar roteiro.", {
        description: "Não foi possível compartilhar na comunidade."
      });
    } finally {
      setSaving(false);
    }
  };

  const globeCenter = React.useMemo(() => {
    return currentTrip.lat && currentTrip.lng ? { lat: currentTrip.lat, lng: currentTrip.lng } : undefined;
  }, [currentTrip.lat, currentTrip.lng]);

  const getGoogleFlightsLink = () => {
    if (!currentTrip) return '#';
    const dest = encodeURIComponent(currentTrip.destination);
    return `https://www.google.com/travel/flights?q=flights+to+${dest}`;
  };

  const getBookingLink = () => {
    if (!currentTrip) return '#';
    const dest = encodeURIComponent(currentTrip.destination);
    return `https://www.booking.com/searchresults.html?ss=${dest}`;
  };

  const [copied, setCopied] = React.useState(false);
  const [editingActivity, setEditingActivity] = React.useState<{ dayIndex: number, activityIndex: number, activity: any } | null>(null);

  const handleDeleteActivity = (dIdx: number, aIdx: number) => {
    deleteItineraryActivity(dIdx, aIdx);
    if (currentTrip) handleSave({ ...currentTrip, itinerary: currentTrip.itinerary.map((day, i) => i === dIdx ? { ...day, activities: day.activities.filter((_, j) => j !== aIdx) } : day) }, true);
  };

  const handleSaveActivity = (dIdx: number, aIdx: number, activity: any) => {
    updateItineraryActivity(dIdx, aIdx, activity);
    setEditingActivity(null);
    if (currentTrip) handleSave({ ...currentTrip, itinerary: currentTrip.itinerary.map((day, i) => i === dIdx ? { ...day, activities: day.activities.map((a, j) => j === aIdx ? activity : a) } : day) }, true);
  };

  const togglePublic = async () => {
    if (!currentTrip || !currentTrip.id) return;
    
    // Removendo bloqueio premium para que todos possam usar a Tela Social
    const tripRef = doc(db, 'trips', currentTrip.id);
    const newIsPublic = !currentTrip.isPublic;
    const updateData: any = { isPublic: newIsPublic };
    
    if (newIsPublic && user) {
      updateData.authorName = user.displayName;
      updateData.authorPhoto = user.photoURL;
    }
    
    await updateDoc(tripRef, updateData);
    setCurrentTrip({ ...currentTrip, ...updateData });
  };

  const handleShare = async () => {
    if (!user) {
      toast.warning("Você precisa estar logado para compartilhar o roteiro.");
      navigate('/profile');
      return;
    }

    setDownloading(true);
    try {
      let tripId = currentTrip.id;
      let tripData = { ...currentTrip };

      // Ensure trip is saved and public
      if (!tripId || !currentTrip.isPublic) {
        tripData.isPublic = true;
        tripData.authorName = user.displayName;
        tripData.authorPhoto = user.photoURL;
        tripData.sharedAt = serverTimestamp() as any;
        
        tripId = await handleSave(tripData, true);
        if (!tripId) {
          throw new Error("Failed to save trip before sharing.");
        }
      }

      const publicUrl = `${window.location.origin}/trip/${tripId}`;
      
      const shareText = `Confira meu roteiro de viagem para ${currentTrip.destination} criado com IA no Right Way! Veja aqui: ${publicUrl}`;

      if (navigator.share) {
        await navigator.share({
          title: `Meu roteiro para ${currentTrip.destination}`,
          text: shareText,
          url: publicUrl
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success("Link copiado para a área de transferência!");
      }
      
      trackEvent('trip_shared_link', { destination: currentTrip.destination });
    } catch (error) {
      console.error('Error sharing trip:', error);
      toast.error("Erro ao compartilhar roteiro.", {
        description: "Ocorreu um erro ao gerar o compartilhamento."
      });
    } finally {
      setDownloading(false);
    }
  };

  const handleClone = async () => {
    if (!user || !currentTrip) return;
    setSaving(true);
    setSaveStatus('saving');
    try {
      const { id, ...tripData } = currentTrip;
      const newTrip: Trip = {
        ...tripData,
        userId: user.uid,
        isPublic: false,
        likes: 0,
        clones: 0,
        createdAt: serverTimestamp(),
        status: 'planejada'
      };
      
      const docRef = await addDoc(collection(db, 'trips'), newTrip as any);
      const savedTrip = { ...newTrip, id: docRef.id };
      addTrip(savedTrip);
      setCurrentTrip(savedTrip);

      // Increment clone count on original trip
      if (currentTrip.id) {
        const tripRef = doc(db, 'trips', currentTrip.id);
        await updateDoc(tripRef, { clones: increment(1) });
      }
      
      setSaveStatus('success');
      setTimeout(() => {
        setSaveStatus('idle');
      }, 1500);
    } catch (error) {
      console.error('Error cloning trip:', error);
      setSaveStatus('error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 -mt-6">
      {/* Dynamic Header */}
      <div className="fixed top-0 left-0 right-0 z-[100] p-6 flex items-center justify-between pointer-events-none max-w-md mx-auto pt-safe">
        <button 
          onClick={() => navigate(-1)}
          className="w-12 h-12 glass rounded-2xl flex items-center justify-center pointer-events-auto border border-white/10 shadow-2xl active:scale-90 transition-all"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <div className="flex gap-2 pointer-events-auto">
          {isOwner && (
            <button 
              onClick={togglePublic}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all active:scale-90 ${currentTrip?.isPublic ? 'bg-primary/20 text-primary border-primary/40 shadow-[0_0_15px_rgba(var(--primary),0.3)]' : 'glass text-white border-white/10 shadow-2xl'}`}
            >
              <Users className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={handleShare}
            className="w-12 h-12 glass rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl active:scale-90 transition-all"
          >
            <Share2 className="w-4 h-4 text-white" />
          </button>
          <button 
            onClick={() => currentTrip?.id && toggleFavorite(currentTrip.id)}
            className={`w-12 h-12 glass rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl active:scale-90 transition-all ${isFavorite ? 'text-red-500' : 'text-white'}`}
          >
            <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          {canEdit ? (
            <PremiumButton 
              variant="glow"
              size="sm"
              onClick={() => handleSave()}
              disabled={saving}
              className="px-4 h-12"
            >
              {saving ? <LoadingState type="spinner" size="sm" /> : <CheckCircle2 className="w-5 h-5" />}
            </PremiumButton>
          ) : (
            <button 
              onClick={handleClone}
              disabled={saving}
              className="w-12 h-12 bg-emerald-500/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-emerald-500/30 shadow-2xl active:scale-90 transition-all disabled:opacity-50"
            >
              <Copy className="w-5 h-5 text-emerald-500" />
            </button>
          )}
        </div>
      </div>

      {/* Map Section - Simplified Globe */}
      <div className="h-[40vh] w-full relative overflow-hidden rounded-b-[48px] shadow-2xl z-0 bg-background pt-safe">
        <Globe3D 
          hideSearch 
          hideControls 
          initialCenter={globeCenter}
          initialZoom={1.5}
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background via-background/60 to-transparent z-[10] pointer-events-none" />
      </div>

      {/* Hero Content Overlay */}
      <div className="px-6 -mt-24 relative z-20 space-y-8">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="space-y-3"
        >
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-lg shadow-xl backdrop-blur-md">
              <span className="text-[8px] font-black text-primary uppercase tracking-[0.2em]">{currentTrip?.type || 'Viagem'}</span>
            </div>
            {currentTrip?.isPublic && (
               <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg shadow-xl backdrop-blur-md">
                  <span className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.2em]">Public</span>
               </div>
            )}
          </div>
          <h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-none drop-shadow-2xl">
             {currentTrip?.destination}
          </h1>
          <p className="text-sm font-black text-white/40 uppercase tracking-[0.2em]">Roteiro de {currentTrip?.itinerary?.length} dias</p>
        </motion.div>

        {/* Action Quick Bar */}
        <div className="grid grid-cols-3 gap-3">
           <PremiumCard className="flex flex-col items-center gap-2 p-4 bg-white/5 border-white/5 shadow-xl glass">
              <CalendarIcon size={16} className="text-primary" />
              <div className="flex flex-col items-center">
                 <span className="text-xs font-black text-white tracking-tight">{currentTrip?.itinerary?.length}</span>
                 <span className="text-[8px] font-black text-white/20 uppercase">Dias</span>
              </div>
           </PremiumCard>
           <PremiumCard className="flex flex-col items-center gap-2 p-4 bg-white/5 border-white/5 shadow-xl glass text-emerald-400">
              <WalletIcon size={16} />
              <div className="flex flex-col items-center">
                 <span className="text-xs font-black text-white tracking-tight">{formatCurrency(currentTrip?.budget || 0)}</span>
                 <span className="text-[8px] font-black text-white/20 uppercase tracking-widest text-center">Budget</span>
              </div>
           </PremiumCard>
           <PremiumCard 
              onClick={() => navigate('/alerts', { state: { destination: currentTrip?.destination } })}
              className="flex flex-col items-center gap-2 p-4 bg-white/5 border-white/5 shadow-xl glass cursor-pointer active:scale-95 transition-all text-secondary"
            >
              <BellIcon size={16} />
              <div className="flex flex-col items-center">
                 <span className="text-xs font-black text-white tracking-tight">Ativo</span>
                 <span className="text-[8px] font-black text-white/20 uppercase">Alertas</span>
              </div>
           </PremiumCard>
        </div>

        {/* Main Tabs Container */}
        <div className="pt-4 space-y-10">
          {/* Status Card */}
          <AnimatedContainer delay={0.1}>
            <PremiumCard className="p-8 relative overflow-hidden glass border-white/5">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-[60px] -mr-12 -mt-12 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/5 rounded-full blur-[60px] -ml-12 -mb-12 pointer-events-none" />
              
              <div className="flex flex-col gap-8 relative z-10">
                 <div className="flex items-center justify-between">
                    <div className="space-y-1">
                       <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Status Atual</span>
                       <h3 className="text-xl font-black text-white uppercase tracking-tight">{(currentTrip?.status || 'planejada').replace('_', ' ')}</h3>
                    </div>
                    <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center text-primary shadow-xl backdrop-blur-md">
                       <NavigationIcon size={24} />
                    </div>
                 </div>

                 <div className="flex gap-2">
                   {(['planejada', 'em_andamento', 'concluída'] as const).map((status) => (
                     <button
                       key={status}
                       onClick={() => {
                         const updatedTrip = { ...currentTrip, status };
                         const { updateTrip } = useStore.getState();
                         updateTrip(updatedTrip);
                         if (updatedTrip.id) {
                           handleSave(updatedTrip);
                         }
                       }}
                       className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                         (currentTrip?.status || 'planejada') === status 
                           ? 'bg-primary text-black shadow-[0_0_25px_rgba(var(--primary),0.4)]' 
                           : 'bg-white/5 text-white/40 hover:bg-white/10 border border-white/10'
                       }`}
                     >
                       {status.replace('_', ' ')}
                     </button>
                   ))}
                 </div>
              </div>
            </PremiumCard>
          </AnimatedContainer>
        </div>
      </div>

      <div className="px-6 space-y-8 relative z-20">
        {/* Budget Summary */}
        <AnimatedContainer delay={0.25}>
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
                <Wallet className="w-5 h-5 text-secondary" />
                Resumo do Orçamento
              </h2>
              <div className="text-right">
                <span className="text-2xl font-semibold text-secondary tracking-tight">{renderPrice(currentTrip.costs?.total || 0)}</span>
                <p className="text-[10px] font-semibold text-white/60 uppercase tracking-widest">Total Estimado</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.08)] rounded-[20px] p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Plane className="w-3 h-3 text-primary" />
                  <span className="text-[10px] font-semibold text-white/60 uppercase tracking-widest">Voos</span>
                </div>
                <span className="text-white font-semibold text-base">{renderPrice(currentTrip.costs?.transport || 0)}</span>
              </div>
              <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.08)] rounded-[20px] p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Hotel className="w-3 h-3 text-accent" />
                  <span className="text-[10px] font-semibold text-white/60 uppercase tracking-widest">Hospedagem</span>
                </div>
                <span className="text-white font-semibold text-base">{renderPrice(currentTrip.costs?.hotel || 0)}</span>
              </div>
              <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.08)] rounded-[20px] p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Utensils className="w-3 h-3 text-orange-400" />
                  <span className="text-[10px] font-semibold text-white/60 uppercase tracking-widest">Alimentação</span>
                </div>
                <span className="text-white font-semibold text-base">{renderPrice(currentTrip.costs?.food || 0)}</span>
              </div>
              <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.08)] rounded-[20px] p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Navigation className="w-3 h-3 text-blue-400" />
                  <span className="text-[10px] font-semibold text-white/60 uppercase tracking-widest">Atividades</span>
                </div>
                <span className="text-white font-semibold text-base">{renderPrice(currentTrip.costs?.activities || 0)}</span>
              </div>
            </div>
          </div>
        </AnimatedContainer>

        {/* Weather Section */}
        {weather.length > 0 && (
          <AnimatedContainer delay={0.2}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Sun className="w-5 h-5 text-accent" />
                Clima na Viagem
              </h2>
              <button 
                onClick={handleGenerateOutfit}
                disabled={isGeneratingOutfit}
                className="text-[10px] font-semibold text-primary uppercase tracking-widest flex items-center gap-1 bg-[rgba(255,255,255,0.05)] px-3 py-1.5 rounded-full border border-[rgba(255,255,255,0.1)] active:scale-95 transition-all disabled:opacity-50"
              >
                {isGeneratingOutfit ? (
                  <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Sparkles className="w-3 h-3" />
                )}
                O que vestir?
              </button>
            </div>
            
            {outfitSuggestion && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6 bg-accent/10 border border-accent/20 rounded-2xl p-6 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] font-bold text-accent uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Sugestão de Look IA
                  </p>
                  <button 
                    onClick={() => setOutfitSuggestion(null)}
                    className="text-white/40 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Roupa</p>
                    <p className="text-xs text-white/90 font-medium">{outfitSuggestion.outfit}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Calçados</p>
                    <p className="text-xs text-white/90 font-medium">{outfitSuggestion.footwear}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Acessórios</p>
                    <p className="text-xs text-white/90 font-medium">{outfitSuggestion.accessories}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Dica Extra</p>
                    <p className="text-xs text-primary font-medium">{outfitSuggestion.extraTip}</p>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="flex gap-3 overflow-x-auto pb-2 scroll-hide -mx-4 px-4">
              {weather.map((w, idx) => (
                <div key={idx} className="bg-[rgba(255,255,255,0.05)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.08)] rounded-[20px] p-4 min-w-[100px] flex flex-col items-center gap-2 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
                  <span className="text-[10px] font-semibold text-white/60 uppercase tracking-widest">{w.date}</span>
                  <img src={`https://openweathermap.org/img/wn/${w.icon}@2x.png`} alt="weather" className="w-10 h-10" referrerPolicy="no-referrer" />
                  <span className="text-base font-semibold text-white">{w.temp}°C</span>
                </div>
              ))}
            </div>
          </AnimatedContainer>
        )}

        {/* Tabs */}
        <AnimatedContainer delay={0.3}>
          <div className="flex p-1 bg-[rgba(255,255,255,0.05)] backdrop-blur-[20px] rounded-full border border-[rgba(255,255,255,0.08)] overflow-x-auto scroll-hide">
            {[
              { id: 'itinerary', label: 'Roteiro', icon: <Clock className="w-4 h-4" /> },
              { id: 'flights', label: 'Voos', icon: <Plane className="w-4 h-4" /> },
              { id: 'hotels', label: 'Hotéis', icon: <Hotel className="w-4 h-4" /> },
              { id: 'packing', label: 'Mala', icon: <Briefcase className="w-4 h-4" /> },
              { id: 'journal', label: 'Diário', icon: <Bookmark className="w-4 h-4" /> },
              { id: 'expenses', label: 'Gastos', icon: <Wallet className="w-4 h-4" /> },
              { id: 'timemachine', label: 'Máquina do Tempo', icon: <Hourglass className="w-4 h-4" /> },
              { id: 'gallery', label: 'Galeria', icon: <Camera className="w-4 h-4" /> },
              { id: 'translator', label: 'Tradutor', icon: <MessageSquare className="w-4 h-4" /> },
              { id: 'gems', label: 'Segredos', icon: <Compass className="w-4 h-4" /> },
              { id: 'gastronomy', label: 'Gastronomia', icon: <Utensils className="w-4 h-4" /> },
              { id: 'etiquette', label: 'Cultura', icon: <BookHeart className="w-4 h-4" /> },
              { id: 'photo', label: 'Fotos', icon: <Aperture className="w-4 h-4" /> },
              { id: 'missions', label: 'Missões', icon: <Gamepad2 className="w-4 h-4" /> },
              { id: 'sos', label: 'SOS', icon: <ShieldAlert className="w-4 h-4" /> },
              { id: 'info', label: 'Info', icon: <Info className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 min-w-[90px] h-10 rounded-full flex items-center justify-center gap-2 font-semibold text-xs transition-all active:scale-95 ${
                  activeTab === tab.id ? 'bg-[rgba(255,255,255,0.15)] text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]' : 'text-white/60 hover:text-white'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </AnimatedContainer>

        <AnimatedContainer delay={0.4}>
          <button 
            onClick={() => navigate('/plan', { state: { destination: currentTrip.destination } })}
            className="w-full h-14 bg-primary/10 backdrop-blur-[20px] border border-primary/30 rounded-[20px] text-primary font-semibold shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] active:scale-95 transition-all mt-4 flex items-center justify-center gap-3"
          >
            <RefreshCw className="w-5 h-5" />
            <span className="text-sm uppercase tracking-widest">Ajustar Viagem</span>
          </button>
        </AnimatedContainer>

        {/* Tab Content */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {activeTab === 'itinerary' && (
              <ItineraryTab 
                currentTrip={currentTrip}
                isMapView={isMapView}
                setIsMapView={setIsMapView}
                handleAudioGuide={handleAudioGuide}
                isPlayingAudio={isPlayingAudio}
                handleReoptimizeDay={handleReoptimizeDay}
                isReoptimizingDay={isReoptimizingDay}
                canEdit={canEdit}
                heroImage={heroImage}
                setEditingActivity={setEditingActivity}
                handleDeleteActivity={handleDeleteActivity}
                handlePlayAudioTour={handlePlayAudioTour}
                playingAudioActivity={playingAudioActivity}
                isGeneratingAudio={isGeneratingAudio}
                renderPrice={renderPrice}
                navigate={navigate}
                isOwner={isOwner}
              />
            )}

            {activeTab === 'flights' && (
              <FlightsTab 
                currentTrip={currentTrip}
                getGoogleFlightsLink={getGoogleFlightsLink}
                openLink={openLink}
                renderPrice={renderPrice}
              />
            )}

            {activeTab === 'hotels' && (
              <HotelsTab 
                currentTrip={currentTrip}
                getBookingLink={getBookingLink}
                openLink={openLink}
                renderPrice={renderPrice}
              />
            )}

            {activeTab === 'packing' && (
              <PackingTab 
                currentTrip={currentTrip}
                handleGeneratePackingList={handleGeneratePackingList}
                isGeneratingPackingList={isGeneratingPackingList}
                canEdit={canEdit}
                togglePackingItem={togglePackingItem}
                handleSave={handleSave}
              />
            )}

            {activeTab === 'journal' && (
              <JournalTab 
                currentTrip={currentTrip}
                isOwner={isOwner}
                canEdit={canEdit}
                handleSave={handleSave}
                journalSummary={journalSummary}
                setJournalSummary={setJournalSummary}
                handleSummarizeJournal={handleSummarizeJournal}
                isSummarizingJournal={isSummarizingJournal}
                handleGenerateJournalInsight={handleGenerateJournalInsight}
                isGeneratingInsight={isGeneratingInsight}
              />
            )}

            {activeTab === 'expenses' && (
              <ExpensesTab 
                currentTrip={currentTrip}
                isOwner={isOwner}
                canEdit={canEdit}
                handleSave={handleSave}
                renderPrice={renderPrice}
              />
            )}

            {activeTab === 'translator' && (
              <TranslatorTab 
                translationInput={translationInput}
                setTranslationInput={setTranslationInput}
                handleTranslate={handleTranslate}
                isTranslating={isTranslating}
                translationResult={translationResult}
                language={currentTrip.info?.language || ''}
              />
            )}

            {activeTab === 'gems' && (
              <GemsTab 
                hiddenGems={currentTrip.info?.hiddenGems || hiddenGems}
                destination={currentTrip.destination}
                handleGenerateHiddenGems={handleGenerateHiddenGems}
                isGeneratingGems={isGeneratingGems}
                canEdit={canEdit}
              />
            )}

            {activeTab === 'timemachine' && (
              <TimeMachineTab 
                timeMachineEra={timeMachineEra}
                setTimeMachineEra={setTimeMachineEra}
                handleGenerateTimeMachine={handleGenerateTimeMachine}
                isGeneratingTimeMachine={isGeneratingTimeMachine}
                timeMachineResult={timeMachineResult}
                destination={currentTrip.destination}
              />
            )}

            {activeTab === 'gallery' && (
              <GalleryTab 
                galleryImages={galleryImages}
                destination={currentTrip.destination}
              />
            )}

            {activeTab === 'gastronomy' && (
              <GastronomyTab 
                gastronomyGuide={gastronomyGuide}
                handleGenerateGastronomy={handleGenerateGastronomy}
                isGeneratingGastronomy={isGeneratingGastronomy}
                destination={currentTrip.destination}
              />
            )}

            {activeTab === 'sos' && (
              <SOSTab 
                emergencyInfo={emergencyInfo}
                handleGenerateEmergencyInfo={handleGenerateEmergencyInfo}
                isGeneratingEmergency={isGeneratingEmergency}
                destination={currentTrip.destination}
              />
            )}

            {activeTab === 'etiquette' && (
              <EtiquetteTab 
                culturalEtiquette={culturalEtiquette}
                handleGenerateEtiquette={handleGenerateEtiquette}
                isGeneratingEtiquette={isGeneratingEtiquette}
                destination={currentTrip.destination}
              />
            )}

            {activeTab === 'photo' && (
              <PhotoSpotsTab 
                photoSpots={photoSpots}
                handleGeneratePhotoSpots={handleGeneratePhotoSpots}
                isGeneratingPhotoSpots={isGeneratingPhotoSpots}
                destination={currentTrip.destination}
              />
            )}

            {activeTab === 'missions' && (
              <MissionsTab 
                secretMissions={secretMissions}
                completedMissions={completedMissions}
                toggleMission={toggleMission}
                handleGenerateMissions={handleGenerateMissions}
                isGeneratingMissions={isGeneratingMissions}
              />
            )}

            {activeTab === 'info' && (
              <InfoTab 
                currentTrip={currentTrip}
                isOwner={isOwner}
                canEdit={canEdit}
                collaboratorProfiles={collaboratorProfiles}
                setIsCollaboratorsModalOpen={setIsCollaboratorsModalOpen}
                handleRemoveCollaborator={handleRemoveCollaborator}
                handleGenerateSurvivalGuide={handleGenerateSurvivalGuide}
                isGeneratingSurvivalGuide={isGeneratingSurvivalGuide}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Budget Summary */}
        <AnimatedContainer delay={0.4}>
          <section className="pb-12">
            <h2 className="text-lg font-semibold text-white mb-6">Resumo de Custos (Estimado)</h2>
            <div className="glass-card p-6 space-y-4">
              {[
                { label: 'Voos', value: currentTrip.costs?.transport || 0, icon: <Plane className="w-4 h-4" /> },
                { label: 'Hospedagem', value: currentTrip.costs?.hotel || 0, icon: <Hotel className="w-4 h-4" /> },
                { label: 'Alimentação', value: currentTrip.costs?.food || 0, icon: <DollarSign className="w-4 h-4" /> },
                { label: 'Atividades', value: currentTrip.costs?.activities || 0, icon: <Sparkles className="w-4 h-4" /> },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-white/60">
                    {item.icon}
                    <span className="font-semibold text-sm">{item.label}</span>
                  </div>
                  <span className="font-semibold text-white text-sm">{renderPrice(item.value)}</span>
                </div>
              ))}
              <div className="pt-6 mt-6 border-t border-[rgba(255,255,255,0.08)] flex items-center justify-between">
                <span className="text-sm font-semibold text-white uppercase tracking-widest">Total Estimado</span>
                <span className="text-2xl font-semibold text-secondary">{renderPrice(currentTrip.costs?.total || 0)}</span>
              </div>
              <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.08)] p-4 rounded-[16px] flex items-start gap-3 mt-6">
                <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-[10px] uppercase tracking-widest text-white/60 leading-relaxed">
                  Os valores são estimativas baseadas no seu orçamento e preferências. Preços reais podem variar.
                </p>
              </div>
            </div>
          </section>
        </AnimatedContainer>
        {/* Quick Actions */}
        {isOwner && (
          <AnimatedContainer delay={0.5}>
            <div className="grid grid-cols-2 gap-4 pb-12">
              <button 
                onClick={() => navigate('/plan')}
                className="glass-card p-6 flex flex-col items-center gap-3 hover:bg-[rgba(255,255,255,0.1)] transition-all active:scale-95 group"
              >
                <div className="w-12 h-12 bg-[rgba(255,255,255,0.1)] backdrop-blur-[20px] rounded-full flex items-center justify-center text-primary group-hover:bg-[rgba(255,255,255,0.15)] border border-[rgba(255,255,255,0.15)] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] transition-colors">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-semibold text-white uppercase tracking-widest">Refazer Roteiro</span>
              </button>
              <button 
                onClick={() => navigate('/expenses')}
                className="glass-card p-6 flex flex-col items-center gap-3 hover:bg-[rgba(255,255,255,0.1)] transition-all active:scale-95 group"
              >
                <div className="w-12 h-12 bg-[rgba(255,255,255,0.1)] backdrop-blur-[20px] rounded-full flex items-center justify-center text-secondary group-hover:bg-[rgba(255,255,255,0.15)] border border-[rgba(255,255,255,0.15)] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] transition-colors">
                  <Wallet className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-semibold text-white uppercase tracking-widest text-center">Ajustar Orçamento</span>
              </button>
              <button 
                onClick={() => navigate('/hotels')}
                className="glass-card p-6 flex flex-col items-center gap-3 hover:bg-[rgba(255,255,255,0.1)] transition-all active:scale-95 group"
              >
                <div className="w-12 h-12 bg-[rgba(255,255,255,0.1)] backdrop-blur-[20px] rounded-full flex items-center justify-center text-accent group-hover:bg-[rgba(255,255,255,0.15)] border border-[rgba(255,255,255,0.15)] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] transition-colors">
                  <Hotel className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-semibold text-white uppercase tracking-widest">Trocar Hotel</span>
              </button>
              <button 
                onClick={() => navigate('/flights')}
                className="glass-card p-6 flex flex-col items-center gap-3 hover:bg-[rgba(255,255,255,0.1)] transition-all active:scale-95 group"
              >
                <div className="w-12 h-12 bg-[rgba(255,255,255,0.1)] backdrop-blur-[20px] rounded-full flex items-center justify-center text-blue-500 group-hover:bg-[rgba(255,255,255,0.15)] border border-[rgba(255,255,255,0.15)] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] transition-colors">
                  <Plane className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-semibold text-white uppercase tracking-widest">Trocar Voo</span>
              </button>
            </div>
          </AnimatedContainer>
        )}
      </div>

      <Modal isOpen={saveStatus !== 'idle'} onClose={() => setSaveStatus('idle')} title="Salvar Viagem">
        <div className="flex flex-col items-center justify-center gap-4 py-4 text-center">
          {saveStatus === 'saving' && (
            <>
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-white font-semibold">Salvando sua viagem...</p>
            </>
          )}
          {saveStatus === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mb-2">
                <Heart className="w-8 h-8 fill-current" />
              </div>
              <p className="text-white font-semibold text-lg">Viagem salva com sucesso!</p>
              <p className="text-white/60 text-sm">Redirecionando para suas viagens...</p>
            </>
          )}
          {saveStatus === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center text-red-500 mb-2">
                <Info className="w-8 h-8" />
              </div>
              <p className="text-white font-semibold text-lg">Erro ao salvar viagem</p>
              <p className="text-white/60 text-sm mb-4">Ocorreu um problema ao tentar salvar sua viagem. Tente novamente.</p>
              <button 
                onClick={() => setSaveStatus('idle')}
                className="w-full py-3 bg-white/10 rounded-xl text-white font-semibold hover:bg-white/20 transition-all"
              >
                Tentar Novamente
              </button>
            </>
          )}
          {saveStatus === 'unauthorized' && (
            <>
              <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-500 mb-2">
                <Info className="w-8 h-8" />
              </div>
              <p className="text-white font-semibold text-lg">Login Necessário</p>
              <p className="text-white/60 text-sm mb-4">Você precisa estar logado para salvar suas viagens.</p>
              <button 
                onClick={() => setSaveStatus('idle')}
                className="w-full py-3 bg-primary rounded-xl text-[#020617] font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
              >
                Entendi
              </button>
            </>
          )}
        </div>
      </Modal>
        {/* Edit Activity Modal */}
        <Modal isOpen={!!editingActivity} onClose={() => setEditingActivity(null)} title="Editar Atividade">
          {editingActivity && (
            <div className="space-y-4 p-4">
              <input 
                type="text" 
                value={editingActivity.activity.activity} 
                onChange={(e) => setEditingActivity({ ...editingActivity, activity: { ...editingActivity.activity, activity: e.target.value } })}
                className="w-full bg-white/10 p-3 rounded-lg text-white"
                placeholder="Nome da atividade"
              />
              <input 
                type="text" 
                value={editingActivity.activity.time} 
                onChange={(e) => setEditingActivity({ ...editingActivity, activity: { ...editingActivity.activity, time: e.target.value } })}
                className="w-full bg-white/10 p-3 rounded-lg text-white"
                placeholder="Horário"
              />
              <button 
                onClick={() => handleSaveActivity(editingActivity.dayIndex, editingActivity.activityIndex, editingActivity.activity)}
                className="w-full bg-emerald-500 text-black font-bold p-3 rounded-lg"
              >
                Salvar
              </button>
            </div>
          )}
        </Modal>

      {/* Modals */}
      <Modal isOpen={saveStatus === 'unauthorized'} onClose={() => setSaveStatus('idle')} title="Login Necessário">
        <div className="flex flex-col items-center text-center p-4">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <p className="text-white/80 mb-6">Você precisa estar logado para salvar seus roteiros e acessá-los de qualquer dispositivo.</p>
          <button 
            onClick={async () => {
              try {
                const { signInWithPopup, googleProvider } = await import('../firebase');
                await signInWithPopup(auth, googleProvider);
                setSaveStatus('idle');
                handleSave(); // Try saving again after login
              } catch (error) {
                console.error("Error signing in:", error);
              }
            }}
            className="w-full h-12 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Entrar com Google
          </button>
        </div>
      </Modal>

      <TripAssistant trip={currentTrip} />

      {/* Trip Chat Button */}
      {canEdit && (
        <button 
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-24 left-6 w-14 h-14 bg-accent rounded-full flex items-center justify-center shadow-2xl z-50 hover:scale-110 active:scale-90 transition-all border-4 border-[#020617]"
        >
          <MessageSquare className="w-6 h-6 text-[#020617]" />
        </button>
      )}

      <AnimatePresence>
        {isChatOpen && currentTrip && (
          <TripChat trip={currentTrip} onClose={() => setIsChatOpen(false)} />
        )}
      </AnimatePresence>

      {/* Collaborators Modal */}
      <Modal isOpen={isCollaboratorsModalOpen} onClose={() => setIsCollaboratorsModalOpen(false)} title="Convidar Parceiros">
        <div className="space-y-6">
          <p className="text-white/60 text-sm">Convide amigos para planejar esta viagem com você. Eles poderão editar o roteiro, adicionar gastos e conversar no chat.</p>
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">E-mail do Amigo</label>
            <div className="flex gap-2">
              <input 
                type="email"
                value={collaboratorEmail}
                onChange={(e) => {
                  setCollaboratorEmail(e.target.value);
                  setCollaboratorError(null);
                }}
                placeholder="exemplo@email.com"
                className={`flex-1 h-12 bg-white/5 border rounded-xl px-4 text-sm text-white focus:outline-none ${collaboratorError ? 'border-red-500/50' : 'border-white/10 focus:border-primary/50'}`}
              />
              <GlowButton 
                onClick={handleAddCollaborator}
                disabled={isSearchingUser || !collaboratorEmail.trim()}
                className="w-12 h-12 flex items-center justify-center"
              >
                {isSearchingUser ? (
                  <div className="w-4 h-4 border-2 border-[#020617] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Plus className="w-5 h-5" />
                )}
              </GlowButton>
            </div>
            {collaboratorError && (
              <p className="text-[10px] text-red-500 font-bold">{collaboratorError}</p>
            )}
          </div>

          <div className="space-y-4">
            <h5 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Membros Atuais</h5>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-white/10 border border-white/20">
                    <SafeImage src={currentTrip.authorPhoto || ''} alt={currentTrip.authorName || ''} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{currentTrip.authorName || 'Dono'}</p>
                    <p className="text-[10px] text-white/40">Proprietário</p>
                  </div>
                </div>
              </div>

              {collaboratorProfiles.map((profile) => (
                <div key={profile.uid} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-white/10 border border-white/20">
                      <SafeImage src={profile.photoURL || ''} alt={profile.displayName || ''} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{profile.displayName}</p>
                      <p className="text-[10px] text-white/40">Parceiro</p>
                    </div>
                  </div>
                  {isOwner && (
                    <button 
                      onClick={() => handleRemoveCollaborator(profile.uid)}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
