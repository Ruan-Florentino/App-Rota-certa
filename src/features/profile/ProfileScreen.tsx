import React from 'react';
import { motion } from 'motion/react';
import ProfileHeader from './components/ProfileHeader';
import HeroCard from './components/HeroCard';
import StatsGrid from './components/StatsGrid';
import AIBadge from './components/AIBadge';
import ReferralCard from './components/ReferralCard';
import PlanCard from './components/PlanCard';
import AchievementsSection from './components/AchievementsSection';
import DashboardSection from './components/DashboardSection';
import TravelMap from './components/TravelMap';
import TravelTimeline from './components/TravelTimeline';
import DreamBoard from './components/DreamBoard';
import NetworkCard from './components/NetworkCard';
import WrappedCard from './components/WrappedCard';
import SettingsList from './components/SettingsList';
import LogoutButton from './components/LogoutButton';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
  },
};

export const ProfileScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0E1A] to-[#0F1420] text-white overflow-x-hidden font-sans pb-32">
      <motion.div 
        className="max-w-[600px] mx-auto px-[20px] pt-8 space-y-[16px]"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}><ProfileHeader /></motion.div>
        <motion.div variants={itemVariants}><HeroCard /></motion.div>
        <motion.div variants={itemVariants}><StatsGrid /></motion.div>
        <motion.div variants={itemVariants}><AIBadge /></motion.div>
        <motion.div variants={itemVariants}><ReferralCard /></motion.div>
        <motion.div variants={itemVariants}><PlanCard /></motion.div>
        <motion.div variants={itemVariants}><AchievementsSection /></motion.div>
        <motion.div variants={itemVariants}><DashboardSection /></motion.div>
        <motion.div variants={itemVariants}><TravelMap /></motion.div>
        <motion.div variants={itemVariants}><TravelTimeline /></motion.div>
        <motion.div variants={itemVariants}><DreamBoard /></motion.div>
        <motion.div variants={itemVariants}><NetworkCard /></motion.div>
        <motion.div variants={itemVariants}><WrappedCard /></motion.div>
        <motion.div variants={itemVariants}><SettingsList /></motion.div>
        <motion.div variants={itemVariants} className="mb-[120px]"><LogoutButton /></motion.div>
      </motion.div>
    </div>
  );
};
