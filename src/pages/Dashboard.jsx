import React from 'react';
import HeroCarousel from '../sections/HeroCarousel';
import DashboardQuickStats from '../sections/DashboardQuickStats';
import DestinationMarquee from '../sections/DestinationMarquee';
import ClothSimulation from '../sections/ClothSimulation';
import DestinationShowcase from '../sections/DestinationShowcase';
import HeritageDivider from '../sections/HeritageDivider';
import FestivalGallery from '../sections/FestivalGallery';
import ExperienceShowcase from '../sections/ExperienceShowcase';
import PlanningCTA from '../sections/PlanningCTA';
import Footer from '../sections/Footer';

export default function Dashboard() {
  return (
    <div className="w-full relative bg-[#F5F0EB]">
      <HeroCarousel />
      <DashboardQuickStats />
      <DestinationMarquee />
      <ClothSimulation />
      <DestinationShowcase />
      <HeritageDivider />
      <FestivalGallery />
      <ExperienceShowcase />
      <PlanningCTA />
      <Footer />
    </div>
  );
}
