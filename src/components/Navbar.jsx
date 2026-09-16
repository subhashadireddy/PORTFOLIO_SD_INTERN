import React, { useState, useEffect, useCallback, useRef } from 'react';
import '../styles/navbar.css';
import { gsap } from '../utils/gsapConfig';

const NAV_ITEMS = [
  { label: 'About', href: '#about', number: '01' },
  { label: 'Research', href: '#research-focus', number: '02' },
  { label: 'Experience', href: '#experience', number: '03' },
  { label: 'Publications', href: '#publications', number: '04' },
  { label: 'Recognition', href: '#awards', number: '05' },
  { label: 'Contact', href: '#contact', number: '06' }
];

/**
 * Navbar — Desktop editorial navigation bar only.
 * The floating hamburger button (FloatingMenuButton) manages mobileMenuOpen externally.
 * On desktop: full nav links are shown.
 * On mobile: nav links are hidden; the overlay is controlled by the floating button.
 */
// Breakpoint matching floating-menu.css / navbar.css mobile hide
const DESKTOP_BREAKPOINT = 860;

export default function Navbar({ isLoaded = true, mobileMenuOpen, setMobileMenuOpen }) {
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);
  const navRef = useRef(null);
  const hoverZoneRef = useRef(null);

  // Close mobile menu on Escape key press
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape' && mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }, [mobileMenuOpen, setMobileMenuOpen]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Track scroll past hero for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolledPastHero(window.scrollY > 120);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── Desktop scroll-hide / reveal behavior (GSAP) ────────────────────────
  useEffect(() => {
    if (!isLoaded) return;

    const nav = navRef.current;
    const hoverZone = hoverZoneRef.current;
    if (!nav || !hoverZone) return;

    // Skip on mobile — let CSS/FloatingMenuButton handle things there
    const isDesktop = () => window.innerWidth > DESKTOP_BREAKPOINT;

    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const DURATION = prefersReduced ? 0.001 : 0.38;
    const EASE = 'power2.out';

    let lastScrollY = window.scrollY;
    let isNavHidden = false;
    let scrollTicking = false;
    // Track whether pointer is interacting with nav or hover-zone
    let pointerOverNav = false;

    const showNav = () => {
      if (!isNavHidden) return;
      isNavHidden = false;
      gsap.to(nav, {
        y: 0,
        duration: DURATION,
        ease: EASE,
        overwrite: true,
      });
      hoverZone.style.pointerEvents = 'none';
    };

    const hideNav = () => {
      if (isNavHidden) return;
      isNavHidden = true;
      gsap.to(nav, {
        y: '-100%',
        duration: DURATION,
        ease: EASE,
        overwrite: true,
      });
      hoverZone.style.pointerEvents = 'all';
    };

    const onScroll = () => {
      if (!isDesktop() || scrollTicking) return;
      scrollTicking = true;
      requestAnimationFrame(() => {
        scrollTicking = false;
        const currentY = window.scrollY;
        const delta = currentY - lastScrollY;
        lastScrollY = currentY;

        // Near the top → always show
        if (currentY < 10) {
          showNav();
          return;
        }

        if (delta > 4) {
          // Scrolling down: hide (but not if pointer is inside nav)
          if (!pointerOverNav) hideNav();
        } else if (delta < -4) {
          // Scrolling up: always reveal
          showNav();
        }
      });
    };

    // Hover-reveal zone: tiny strip at top of viewport
    const onHoverZoneEnter = () => {
      if (!isDesktop()) return;
      pointerOverNav = true;
      showNav();
    };

    const onNavPointerEnter = () => {
      pointerOverNav = true;
    };

    const onNavPointerLeave = () => {
      pointerOverNav = false;
      // Do NOT hide on leave — let scroll behavior control that
    };

    const onHoverZoneLeave = () => {
      pointerOverNav = false;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    hoverZone.addEventListener('mouseenter', onHoverZoneEnter);
    hoverZone.addEventListener('mouseleave', onHoverZoneLeave);
    nav.addEventListener('mouseenter', onNavPointerEnter);
    nav.addEventListener('mouseleave', onNavPointerLeave);

    return () => {
      window.removeEventListener('scroll', onScroll);
      hoverZone.removeEventListener('mouseenter', onHoverZoneEnter);
      hoverZone.removeEventListener('mouseleave', onHoverZoneLeave);
      nav.removeEventListener('mouseenter', onNavPointerEnter);
      nav.removeEventListener('mouseleave', onNavPointerLeave);
      // Reset transform on unmount
      gsap.set(nav, { clearProps: 'y' });
    };
  }, [isLoaded]);

  const handleLinkClick = () => {
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  return (
    <>
      {/*
        Hover-reveal zone: invisible strip at the very top of the viewport.
        Becomes pointer-interactive only when the navbar is hidden.
        Desktop only — hidden on mobile via CSS.
      */}
      <div
        ref={hoverZoneRef}
        className="navbar-hover-zone"
        aria-hidden="true"
      />

      {/* Desktop Navbar */}
      <nav
        ref={navRef}
        className={`navbar-fixed ${isLoaded ? 'is-mounted' : 'is-unmounted'} ${isScrolledPastHero ? 'is-scrolled' : ''}`}
        aria-label="Main Editorial Navigation"
      >
        <div className="container navbar-container">
          {/* Left: Minimal Wordmark ASDM */}
          <a
            href="#hero"
            className="navbar-brand"
            data-hoverable="true"
            aria-label="Dr. Achanta Sampath Dakshina Murthy Homepage"
          >
            <span className="navbar-brand-text">ASDM</span>
            <span className="navbar-brand-underline" aria-hidden="true" />
          </a>

          {/* Right: Top-level Navigation Links (desktop only) */}
          <ul className="navbar-links" role="list">
            {NAV_ITEMS.map((item) => (
              <li key={item.label} className="navbar-link-item">
                <a
                  href={item.href}
                  className="navbar-link"
                  data-hoverable="true"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Full-Screen Mobile Editorial Menu Overlay */}
      <div
        id="mobile-navigation-overlay"
        className={`mobile-overlay-menu ${mobileMenuOpen ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
      >
        <div className="mobile-overlay-header">
          <div className="navbar-brand">
            <span className="navbar-brand-text">ASDM</span>
            <span className="navbar-brand-underline" aria-hidden="true" />
          </div>

          <button
            type="button"
            className="mobile-close-button"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close mobile menu"
            data-hoverable="true"
          >
            Close &times;
          </button>
        </div>

        <nav className="mobile-overlay-nav" aria-label="Mobile Navigation Links">
          {NAV_ITEMS.map((item) => (
            <div key={item.label} className="mobile-nav-item">
              <a
                href={item.href}
                className="mobile-nav-link"
                onClick={handleLinkClick}
                data-hoverable="true"
              >
                <span className="mobile-nav-number">{item.number}</span>
                <span>{item.label}</span>
              </a>
            </div>
          ))}
        </nav>

        <div className="mobile-overlay-footer">
          <span className="font-eyebrow" style={{ color: 'var(--text-secondary)' }}>
            Dr. A. Sampath Dakshina Murthy
          </span>
          <span className="font-eyebrow" style={{ color: 'var(--text-muted)' }}>
            VCIS &middot; VIIT
          </span>
        </div>
      </div>
    </>
  );
}
