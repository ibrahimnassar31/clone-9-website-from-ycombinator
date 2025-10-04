import React from 'react';
import Navigation from '@/components/sections/navigation';
import HeroSection from '@/components/sections/hero';
import FacilitiesStats from '@/components/sections/facilities-stats';
import StagesDiagram from '@/components/sections/stages-diagram';
import SpacesShowcase from '@/components/sections/spaces-showcase';
import ProjectsCarousel from '@/components/sections/projects-carousel';
import DallasLocationSection from '@/components/sections/dallas-location';
import ContactCta from '@/components/sections/contact-cta';
import Footer from '@/components/sections/footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-primary-black">
      <Navigation />
      
      <main>
        <HeroSection />
        
        <FacilitiesStats />
        
        <StagesDiagram />
        
        <SpacesShowcase />
        
        <ProjectsCarousel />
        
        <DallasLocationSection />
        
        <ContactCta />
      </main>
      
      <Footer />
    </div>
  );
}