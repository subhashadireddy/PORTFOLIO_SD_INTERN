import React, { useState, useRef, useEffect, useCallback } from 'react';
import SectionHeader from '../components/SectionHeader';
import { booksData } from '../data/books';
import '../styles/books.css';

/* ─────────────────────────── Idle drift config ─────────────────────────── */
// Each book gets a slightly different idle drift speed so they don't all
// move in perfect lockstep — creating a natural "breathing" effect.
const DRIFT_DURATIONS = [3.8, 4.4, 3.2, 5.1, 4.7, 3.6, 4.2, 5.5, 3.9];
const DRIFT_DELAYS    = [0,   0.6, 1.2, 0.3, 1.7, 0.9, 2.1, 0.4, 1.5];

/* ─────────────────────────── Individual Book ─────────────────────────── */
function BookSpine({ book, index, isOpen, onOpen, onClose, paused }) {
  const spineRef = useRef(null);

  // When this book opens, scroll it into view smoothly
  useEffect(() => {
    if (isOpen && spineRef.current) {
      spineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [isOpen]);

  const handleClick = () => {
    if (isOpen) {
      onClose();
    } else {
      onOpen(book.id);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
    if (e.key === 'Escape' && isOpen) {
      onClose();
    }
  };

  const idleStyle = isOpen ? {} : {
    animationDuration: `${DRIFT_DURATIONS[index % DRIFT_DURATIONS.length]}s`,
    animationDelay: `${DRIFT_DELAYS[index % DRIFT_DELAYS.length]}s`,
    animationPlayState: paused ? 'paused' : 'running',
  };

  return (
    <div
      ref={spineRef}
      role="button"
      tabIndex={0}
      aria-expanded={isOpen}
      aria-label={`Book: ${book.title}${isOpen ? ' — press Escape or click to close' : ' — click to open'}`}
      className={`book-spine${isOpen ? ' is-open' : ''}`}
      style={idleStyle}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      data-hoverable={!isOpen ? 'true' : undefined}
    >
      {/* ── Closed State: vertical spine ── */}
      {!isOpen && (
        <>
          <span className="book-spine-label" aria-hidden="true">{book.title}</span>
          <span className="book-spine-year" aria-hidden="true">{book.year}</span>
        </>
      )}

      {/* ── Open State: informational panel ── */}
      {isOpen && (
        <>
          {/* Close button */}
          <button
            type="button"
            className="book-panel-close"
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            aria-label="Close book panel"
            data-hoverable="true"
          >
            ✕
          </button>

          <div className="book-panel-content">
            <span className="book-panel-number">
              {String(index + 1).padStart(2, '0')} / {String(booksData.length).padStart(2, '0')}
            </span>
            <h3 className="book-panel-title">{book.title}</h3>

            <div className="book-panel-meta">
              <p className="book-panel-meta-line">
                <span className="book-panel-meta-key">Publisher</span>
                {book.publisher}
              </p>
              {book.isbn && (
                <p className="book-panel-meta-line">
                  <span className="book-panel-meta-key">ISBN</span>
                  {book.isbn}
                </p>
              )}
              <p className="book-panel-meta-line">
                <span className="book-panel-meta-key">Year</span>
                {book.year}
              </p>
            </div>

            {book.url && (
              <a
                href={book.url}
                target="_blank"
                rel="noopener noreferrer"
                className="book-panel-link"
                onClick={(e) => e.stopPropagation()}
                data-hoverable="true"
                aria-label={`View ${book.title} — opens in new tab`}
              >
                View Publication ↗
              </a>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/* ─────────────────────────── Main Component ─────────────────────────── */
export default function Books() {
  const [openId, setOpenId] = useState(null);
  const [paused, setPaused] = useState(false);
  const trackRef = useRef(null);

  // Drag-to-scroll state
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0 });

  /* ── Pause idle animation on any interaction ── */
  const pause = useCallback(() => setPaused(true), []);
  const resume = useCallback(() => {
    // Only resume if no book is open
    if (openId === null) setPaused(false);
  }, [openId]);

  // Keep paused while a book is open
  useEffect(() => {
    if (openId !== null) setPaused(true);
    else setPaused(false);
  }, [openId]);

  /* ── Drag-to-scroll ── */
  const onMouseDown = (e) => {
    drag.current.active = true;
    drag.current.startX = e.pageX - trackRef.current.offsetLeft;
    drag.current.scrollLeft = trackRef.current.scrollLeft;
    pause();
  };

  const onMouseLeave = () => {
    drag.current.active = false;
    resume();
  };

  const onMouseUp = () => {
    drag.current.active = false;
  };

  const onMouseMove = (e) => {
    if (!drag.current.active) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - drag.current.startX) * 1.2;
    trackRef.current.scrollLeft = drag.current.scrollLeft - walk;
  };

  /* ── Touch scroll: native, just pause on touch ── */
  const onTouchStart = () => pause();
  const onTouchEnd   = () => resume();

  /* ── Wheel: horizontal scroll on trackpad/mouse wheel ── */
  const onWheel = (e) => {
    // If the user scrolls vertically over the shelf, convert to horizontal
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      trackRef.current.scrollLeft += e.deltaY;
    }
    pause();
  };

  /* ── Keyboard: arrow key navigation on the track ── */
  const openIndex = booksData.findIndex((b) => b.id === openId);

  const handleTrackKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = openIndex < booksData.length - 1 ? openIndex + 1 : 0;
      setOpenId(booksData[next].id);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = openIndex > 0 ? openIndex - 1 : booksData.length - 1;
      setOpenId(booksData[prev].id);
    } else if (e.key === 'Escape') {
      setOpenId(null);
    }
  };

  const openBook  = useCallback((id) => setOpenId(id), []);
  const closeBook = useCallback(() => setOpenId(null), []);

  return (
    <section
      id="books"
      className="books-section-root"
      aria-label="Books Published"
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      <div className="books-container">
        {/* Section Header */}
        <SectionHeader
          number="12"
          eyebrow="Authored Volumes"
          title="Books Published"
          subtitle={`${booksData.length} books published across image processing, gait analysis, IoT, data security, and VLSI — through international and national publishers.`}
        />

        {/* Shelf Stage */}
        <div className="books-shelf-stage reveal-on-scroll" aria-label="Bookshelf">
          {/* Horizontal scrollable track */}
          <div
            ref={trackRef}
            className={`books-shelf-track${paused ? ' is-paused' : ''}`}
            aria-label="Scroll to browse books"
            onMouseDown={onMouseDown}
            onMouseLeave={onMouseLeave}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onWheel={onWheel}
            onKeyDown={handleTrackKeyDown}
            tabIndex={openId !== null ? 0 : -1}
          >
            {booksData.map((book, i) => (
              <BookSpine
                key={book.id}
                book={book}
                index={i}
                isOpen={book.id === openId}
                onOpen={openBook}
                onClose={closeBook}
                paused={paused}
              />
            ))}
          </div>

          {/* Shelf shadow line */}
          <div className="books-shelf-shadow" aria-hidden="true" />
        </div>

        {/* Scroll hint */}
        <p className="books-scroll-hint" aria-hidden="true">
          <span className="books-scroll-hint-line" />
          Drag, swipe, or use arrow keys to browse — click a spine to open
          <span className="books-scroll-hint-line" />
        </p>

        {/* Progress dots (one per book) */}
        <nav className="books-progress reveal-on-scroll" aria-label="Book navigation">
          {booksData.map((book, i) => (
            <button
              key={book.id}
              type="button"
              className={`books-progress-dot${book.id === openId ? ' is-active' : ''}`}
              aria-label={`Go to book ${i + 1}: ${book.title}`}
              aria-pressed={book.id === openId}
              onClick={() => {
                if (book.id === openId) {
                  closeBook();
                } else {
                  openBook(book.id);
                }
              }}
              data-hoverable="true"
            />
          ))}
        </nav>
      </div>
    </section>
  );
}
