import React, { useState, useRef, useEffect, useCallback } from 'react';
import SectionHeader from '../components/SectionHeader';
import { grantsData } from '../data/grants';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '../styles/grants.css';

export default function Grants() {
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const rafIdRef = useRef(null);

  // Scroll to a specific item index smoothly
  const scrollToIndex = useCallback((index) => {
    const track = trackRef.current;
    if (!track) return;
    const clampedIndex = Math.max(0, Math.min(index, grantsData.length - 1));
    const items = track.querySelectorAll('.grant-item');
    if (items[clampedIndex]) {
      items[clampedIndex].scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
      setActiveIndex(clampedIndex);
    }
  }, []);

  // Update active index based on scroll position
  const handleScroll = useCallback(() => {
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);

    rafIdRef.current = requestAnimationFrame(() => {
      const track = trackRef.current;
      if (!track) return;

      const trackCenter = track.scrollLeft + track.clientWidth / 2;
      const items = track.querySelectorAll('.grant-item');
      let closestIndex = 0;
      let minDistance = Infinity;

      items.forEach((item, index) => {
        const itemCenter = item.offsetLeft + item.offsetWidth / 2;
        const distance = Math.abs(trackCenter - itemCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      setActiveIndex(closestIndex);
    });
  }, []);

  // Mouse wheel horizontal translation without trapping the user
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onWheel = (e) => {
      // Only hijack vertical scroll if user is scrolling mostly vertically
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        const maxScroll = track.scrollWidth - track.clientWidth;
        const canScrollLeft = e.deltaY < 0 && track.scrollLeft > 2;
        const canScrollRight = e.deltaY > 0 && track.scrollLeft < maxScroll - 2;

        if (canScrollLeft || canScrollRight) {
          e.preventDefault();
          track.scrollLeft += e.deltaY;
        }
      }
    };

    track.addEventListener('wheel', onWheel, { passive: false });
    return () => track.removeEventListener('wheel', onWheel);
  }, []);

  // Drag-to-scroll interaction for desktop pointer
  const handlePointerDown = (e) => {
    const track = trackRef.current;
    if (!track) return;
    isDraggingRef.current = true;
    track.classList.add('is-dragging');
    startXRef.current = e.pageX - track.offsetLeft;
    scrollLeftRef.current = track.scrollLeft;
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    e.preventDefault();
    const track = trackRef.current;
    if (!track) return;
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startXRef.current) * 1.3;
    track.scrollLeft = scrollLeftRef.current - walk;
  };

  const stopDragging = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const track = trackRef.current;
    if (track) {
      track.classList.remove('is-dragging');
    }
  };

  // Keyboard navigation (ArrowLeft, ArrowRight)
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollToIndex(activeIndex - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollToIndex(activeIndex + 1);
    }
  };

  return (
    <section
      id="grants"
      className="grants-section-root"
      aria-label="Innovation and Seed Fund Grants"
    >
      <div className="grants-container">
        <div className="grants-header-row">
          <SectionHeader
            number="08"
            eyebrow="Sponsored Research &amp; Incubation"
            title="Grants &amp; Funding"
            subtitle="National innovation project grants, government deep-tech incubation programs, and competitive institutional seed research allocations."
          />

          {/* Desktop Arrow Controls */}
          <div className="grants-nav-controls reveal-on-scroll" aria-label="Gallery Controls">
            <button
              type="button"
              className="grants-nav-btn"
              onClick={() => scrollToIndex(activeIndex - 1)}
              disabled={activeIndex === 0}
              aria-label="Previous grant"
              data-hoverable="true"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              className="grants-nav-btn"
              onClick={() => scrollToIndex(activeIndex + 1)}
              disabled={activeIndex === grantsData.length - 1}
              aria-label="Next grant"
              data-hoverable="true"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Horizontal Scroll-Snap Gallery (No Cards, No Borders) */}
        <div className="grants-gallery-wrapper reveal-on-scroll">
          <div
            ref={trackRef}
            className="grants-gallery-track"
            role="region"
            aria-label="Grants list horizontal carousel"
            tabIndex={0}
            onScroll={handleScroll}
            onKeyDown={handleKeyDown}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={stopDragging}
            onPointerLeave={stopDragging}
          >
            {grantsData.map((grant, index) => {
              const isActive = index === activeIndex;

              return (
                <article
                  key={grant.id}
                  className={`grant-item ${isActive ? 'is-active' : ''}`}
                  aria-selected={isActive}
                  role="group"
                  aria-label={`${grant.category}: ${grant.title}`}
                  onClick={() => scrollToIndex(index)}
                  data-hoverable="true"
                >
                  {/* Item Header / Eyebrow */}
                  <div className="grant-item-header">
                    <span className="grant-category-tag">{grant.category}</span>
                    <span className="grant-year-badge">{grant.year}</span>
                  </div>

                  {/* Large Grant Amount Display */}
                  <div className="grant-amount-block">
                    <span className="grant-amount-val">{grant.amount}</span>
                    <span className="grant-amount-detail">{grant.amountDetail}</span>
                  </div>

                  {/* Grant Title */}
                  <h3 className="grant-title">{grant.title}</h3>

                  {/* Funding Body & Scheme */}
                  <div className="grant-meta-block">
                    <div className="grant-agency-name">{grant.fundingBody}</div>
                    <div className="grant-scheme-name">{grant.scheme}</div>
                  </div>

                  {/* Context & Role */}
                  <div className="grant-context-block">
                    <span className="grant-role-pill">Role: {grant.role}</span>
                    <p className="grant-context-text">{grant.context}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Horizontal Progress Indicators Below */}
        <div className="grants-progress-bar">
          <div className="grants-dots-container" role="tablist" aria-label="Grant selection">
            {grantsData.map((grant, index) => (
              <button
                key={`indicator-${grant.id}`}
                type="button"
                className={`grants-dot-indicator ${index === activeIndex ? 'is-active' : ''}`}
                onClick={() => scrollToIndex(index)}
                role="tab"
                aria-selected={index === activeIndex}
                aria-label={`Go to grant ${index + 1}: ${grant.title}`}
                data-hoverable="true"
              >
                <span className="grants-dot-line" />
              </button>
            ))}
          </div>

          <div className="grants-counter-display" aria-live="polite">
            <span className="grants-counter-current">0{activeIndex + 1}</span>
            <span> / 0{grantsData.length}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
