import React, { useState, useEffect, useCallback } from 'react';
import '../styles/navbar.css';

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
export default function Navbar({ isLoaded = true, mobileMenuOpen, setMobileMenuOpen }) {
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);

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

  const handleLinkClick = () => {
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navbar — always visible, never hides */}
      <nav
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
