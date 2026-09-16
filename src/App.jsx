import React, { useState, useEffect, useCallback } from 'react';
import Preloader from './components/Preloader';
import CustomCursor from './components/CustomCursor';
import ScrollProgressBar from './components/ScrollProgressBar';
import Navbar from './components/Navbar';
import { useScrollReveal } from './hooks/useScrollReveal';

// 18 Sections in Exact Required Order
import Hero from './sections/Hero';
import About from './sections/About';
import Education from './sections/Education';
import Experience from './sections/Experience';
import CurrentRoles from './sections/CurrentRoles';
import ResearchFocus from './sections/ResearchFocus';
import ImpactStats from './sections/ImpactStats';
import Grants from './sections/Grants';
import Awards from './sections/Awards';
import Memberships from './sections/Memberships';
import Patents from './sections/Patents';
import Books from './sections/Books';
import TalksAdvisory from './sections/TalksAdvisory';
import Publications from './sections/Publications';
import Teaching from './sections/Teaching';
import Certifications from './sections/Certifications';
import Extracurricular from './sections/Extracurricular';
import ContactFooter from './sections/ContactFooter';

export default function App() {
  const [isHeroRevealed, setIsHeroRevealed] = useState(false);

  // Initialize global smooth scroll reveals
  useScrollReveal();

  const handleRevealHero = useCallback(() => {
    setIsHeroRevealed(true);
  }, []);

  // Safety fallback: guarantee Hero is active and displayed even if preloader is skipped
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHeroRevealed(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="portfolio-app">
      {/* Global Foundations */}
      <Preloader onRevealHero={handleRevealHero} />
      <CustomCursor />
      <ScrollProgressBar />
      <Navbar isLoaded={isHeroRevealed} />

      {/* Main Exhibition Sections */}
      <main className={`portfolio-main ${isHeroRevealed ? 'is-loaded' : ''}`}>
        <Hero isLoaded={isHeroRevealed} />
        <About />
        <Education />
        <Experience />
        <CurrentRoles />
        <ResearchFocus />
        <ImpactStats />
        <Grants />
        <Awards />
        <Memberships />
        <Patents />
        <Books />
        <TalksAdvisory />
        <Publications />
        <Teaching />
        <Certifications />
        <Extracurricular />
        <ContactFooter />
      </main>
    </div>
  );
}
