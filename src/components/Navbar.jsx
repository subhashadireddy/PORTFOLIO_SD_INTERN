import React, { useState, useEffect, useCallback } from 'react';
import '../styles/navbar.css';
import { useScrollPosition } from '../hooks/useScrollPosition';

const NAV_ITEMS = [
  { label: 'About', href: '#about', number: '01' },
  { label: 'Research', href: '#research-focus', number: '02' },
  { label: 'Experience', href: '#experience', number: '03' },
  { label: 'Publications', href: '#publications', number: '04' },
  { label: 'Recognition', href: '#awards', number: '05' },
  { label: 'Contact', href: '#contact', number: '06' }
];

export default function Navbar({ isLoaded = true }) {
  const { isScrolledPastHero, isNavbarVisible } = useScrollPosition();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on Escape key press
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape' && mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }, [mobileMenuOpen]);

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

  const handleLinkClick = () => {
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`navbar-fixed ${isLoaded ? 'is-mounted' : 'is-unmounted'} ${isScrolledPastHero ? 'is-scrolled' : ''} ${
          !isNavbarVisible && !mobileMenuOpen ? 'is-hidden' : ''
        }`}
        aria-label="Main Editorial Navigation"
      >
        <div className="container navbar-container">
          {/* Left: Minimal Wordmark ASDM with custom underline */}
          <a href="#hero" className="navbar-brand" data-hoverable="true" aria-label="Dr. Achanta Sampath Dakshina Murthy Homepage">
            <span className="navbar-brand-text">ASDM</span>
            <span className="navbar-brand-underline" aria-hidden="true" />
          </a>

          {/* Right: Top-level Navigation Links */}
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

          {/* Mobile Toggle Trigger */}
          <button
            type="button"
            className="navbar-mobile-toggle"
            onClick={() => setMobileMenuOpen(true)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-overlay"
            aria-label="Open mobile menu"
            data-hoverable="true"
          >
            Menu
          </button>
        </div>
      </nav>

      {/* Mobile Full-Screen Editorial Menu Overlay */}
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
