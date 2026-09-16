import React from 'react';
import '../styles/floating-menu.css';

/**
 * FloatingMenuButton — always-fixed hamburger icon in top-right corner.
 * Shows on all viewports. Transforms to ✕ when the overlay is open.
 * Connects to the same mobile navigation overlay managed by the parent.
 */
export default function FloatingMenuButton({ isOpen, onToggle, isLoaded }) {
  return (
    <button
      type="button"
      id="floating-menu-btn"
      className={`floating-menu-btn ${isLoaded ? 'is-visible' : ''} ${isOpen ? 'is-open' : ''}`}
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-controls="mobile-navigation-overlay"
      aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
      data-hoverable="true"
    >
      <span className="floating-menu-icon" aria-hidden="true">
        <span className="floating-menu-bar bar-top" />
        <span className="floating-menu-bar bar-mid" />
        <span className="floating-menu-bar bar-bot" />
      </span>
    </button>
  );
}
