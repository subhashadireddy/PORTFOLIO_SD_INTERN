import { useState, useEffect, useRef } from 'react';

export function useScrollPosition() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);

  const lastScrollYRef = useRef(0);
  const isScrolledPastHeroRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (currentScrollY / docHeight) * 100 : 0;
      
      setScrollProgress(progress);

      const pastHero = currentScrollY > 120;
      if (pastHero !== isScrolledPastHeroRef.current) {
        isScrolledPastHeroRef.current = pastHero;
        setIsScrolledPastHero(pastHero);
      }

      // Hide/reveal hysteresis
      const deltaY = currentScrollY - lastScrollYRef.current;
      const minDelta = 8; // Prevent micro jitter

      if (Math.abs(deltaY) > minDelta) {
        if (deltaY > 0 && currentScrollY > 150) {
          // Scrolling down
          setIsNavbarVisible(false);
        } else if (deltaY < 0) {
          // Scrolling up
          setIsNavbarVisible(true);
        }
        lastScrollYRef.current = currentScrollY;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { scrollProgress, isScrolledPastHero, isNavbarVisible };
}
