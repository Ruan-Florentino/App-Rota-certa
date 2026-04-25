import React from 'react';
import { motion } from 'motion/react';
import { HomeHeader } from './components/HomeHeader';
import { HeroSection } from './components/HeroSection';
import { NextTripCard } from './components/NextTripCard';
import { QuickActions } from './components/QuickActions';
import { AIRecommendations } from './components/AIRecommendations';
import { TipsStories } from './components/TipsStories';
import { TrendingDestinations } from './components/TrendingDestinations';
import AchievementsSection from '../profile/components/AchievementsSection';

const containerVariants: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  },
};

const itemVariants: any = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

export const HomeScreen = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col min-h-screen bg-[#020617] pb-24"
    >
      <HomeHeader />
      
      <motion.div variants={itemVariants}><HeroSection /></motion.div>
      <motion.div variants={itemVariants} className="px-5 mt-6"><NextTripCard /></motion.div>
      <motion.div variants={itemVariants} className="px-5 mt-8"><QuickActions /></motion.div>
      <motion.div variants={itemVariants} className="mt-8"><AIRecommendations /></motion.div>
      <motion.div variants={itemVariants} className="mt-8"><TipsStories /></motion.div>
      <motion.div variants={itemVariants} className="mt-8"><TrendingDestinations /></motion.div>
      <motion.div variants={itemVariants} className="px-5 mt-8"><AchievementsSection /></motion.div>
    </motion.div>
  );
};
