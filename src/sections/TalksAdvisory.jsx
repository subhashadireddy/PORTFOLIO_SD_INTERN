import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import SectionHeader from '../components/SectionHeader';
import { talksAdvisoryData } from '../data/talksAdvisory';
import { Plus } from 'lucide-react';
import '../styles/talks.css';

/* ────────────────────────────────────────────────────────────────────
   Marquee config
   Two copies of the item list sit side-by-side in a single flex row.
   GSAP animates the track's x from 0 → -(singleWidth) in a seamless
   loop — giving infinite scroll with no JS timers or jitter.
   ──────────────────────────────────────────────────────────────────── */

// Compact labels for the marquee ticker (decorative, not exhaustive)
const MARQUEE_ITEMS = talksAdvisoryData.map((t) => ({
  role: t.role,
  event: t.event,
}));

/* ─── Separator between marquee entries ─── */
function MarqueeSep() {
  return (
    <span className="talks-marquee-sep" aria-hidden="true">
      ——
    </span>
  );
}

/* ─── One set of marquee items ─── */
function MarqueeItems({ instanceId }) {
  return (
    <span className="talks-marquee-items" aria-hidden={instanceId === 1}>
      {MARQUEE_ITEMS.map((item, i) => (
        <React.Fragment key={`${instanceId}-${i}`}>
          <span className="talks-marquee-item">
            <span className="talks-marquee-role">{item.role}</span>
            <span className="talks-marquee-event">{item.event}</span>
          </span>
          <MarqueeSep />
        </React.Fragment>
      ))}
    </span>
  );
}

/* ─── Marquee Layer ─── */
function TalksMarquee() {
  const wrapperRef = useRef(null);
  const trackRef   = useRef(null);
  const copy1Ref   = useRef(null);
  const tweenRef   = useRef(null);
  const pausedRef  = useRef(false);

  // Detect prefers-reduced-motion
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const initMarquee = useCallback(() => {
    if (prefersReducedMotion) return;
    const track = trackRef.current;
    const copy1 = copy1Ref.current;
    if (!track || !copy1) return;

    // Kill any existing tween
    if (tweenRef.current) tweenRef.current.kill();

    // Measure the width of a single copy
    const singleWidth = copy1.offsetWidth;
    if (!singleWidth) return;

    // Set starting x to 0, animate to -singleWidth, then instantly wrap
    gsap.set(track, { x: 0 });

    tweenRef.current = gsap.to(track, {
      x: -singleWidth,
      duration: singleWidth / 80, // px-per-second ≈ 80 — slow, editorial
      ease: 'none',
      repeat: -1,
      // On each repeat the x resets automatically because it's modular
      modifiers: {
        x: gsap.utils.unitize((val) => parseFloat(val) % singleWidth),
      },
    });
  }, [prefersReducedMotion]);

  useEffect(() => {
    // Wait one frame so the DOM has rendered and widths are accurate
    const raf = requestAnimationFrame(() => {
      initMarquee();
    });
    return () => {
      cancelAnimationFrame(raf);
      if (tweenRef.current) tweenRef.current.kill();
    };
  }, [initMarquee]);

  // Re-initialise on resize (debounced)
  useEffect(() => {
    let timer;
    const handleResize = () => {
      clearTimeout(timer);
      timer = setTimeout(initMarquee, 250);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [initMarquee]);

  const pause = () => {
    if (tweenRef.current && !pausedRef.current) {
      tweenRef.current.pause();
      pausedRef.current = true;
    }
    wrapperRef.current?.classList.add('is-paused');
  };

  const resume = () => {
    if (tweenRef.current && pausedRef.current) {
      tweenRef.current.resume();
      pausedRef.current = false;
    }
    wrapperRef.current?.classList.remove('is-paused');
  };

  return (
    <div
      ref={wrapperRef}
      className="talks-marquee-wrapper"
      aria-hidden="true"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
      tabIndex={-1}
    >
      <div ref={trackRef} className="talks-marquee-track">
        {/* Copy 1 — measured for loop width */}
        <span ref={copy1Ref}>
          <MarqueeItems instanceId={0} />
        </span>
        {/* Copy 2 — seamlessly follows copy 1 */}
        <span aria-hidden="true">
          <MarqueeItems instanceId={1} />
        </span>
      </div>
    </div>
  );
}

/* ─── Individual Accordion Row ─── */
function TalkRow({ talk, isOpen, onToggle }) {
  const rowId   = `talk-row-${talk.id}`;
  const descId  = `talk-desc-${talk.id}`;

  return (
    <div
      className={`talk-row${isOpen ? ' is-open' : ''}`}
      data-hoverable="true"
    >
      <button
        type="button"
        id={rowId}
        className="talk-row-header"
        onClick={() => onToggle(talk.id)}
        aria-expanded={isOpen}
        aria-controls={descId}
      >
        <div className="talk-row-left">
          <span className="talk-date">{talk.date}</span>
          <span className="talk-event-name">{talk.event}</span>
        </div>

        {/* Role tag — visible desktop, hidden mobile (shown in expanded content) */}
        <span className="talk-role-tag" aria-hidden="true">{talk.role}</span>

        {/* Plus rotates to × on open */}
        <div className="talk-toggle-icon" aria-hidden="true">
          <Plus size={18} strokeWidth={2.2} />
        </div>
      </button>

      {/* Expandable detail block */}
      <div
        id={descId}
        role="region"
        aria-labelledby={rowId}
        className="talk-details-wrapper"
      >
        <div className="talk-details-inner">
          <div className="talk-details-content">
            {/* Show role inline in expanded content (so mobile gets it) */}
            <p className="talk-host">
              <span style={{
                fontFamily: 'var(--font-family)',
                fontSize: '0.6875rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                marginRight: '0.5rem',
              }}>
                {talk.role}
              </span>
            </p>
            {talk.host && (
              <p className="talk-host" style={{ marginTop: '0.25rem' }}>
                {talk.host}
              </p>
            )}
            {talk.topic && (
              <p className="talk-topic">{talk.topic}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Section ─── */
export default function TalksAdvisory() {
  const [openIds, setOpenIds] = useState(() => new Set());

  const toggleRow = useCallback((id) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  return (
    <section
      id="talks-advisory"
      className="talks-section-root"
      aria-label="Invited Talks and Advisory Roles"
    >
      <div className="talks-container">
        {/* Section header */}
        <SectionHeader
          number="13"
          eyebrow="Keynotes & Governance"
          title="Invited Talks & Advisory Roles"
          subtitle="Keynote speaker, session chair, and advisory committee member across international and national conferences in AI, signal processing, IoT, and biomedical engineering."
        />

        {/* ── Layer 1: Decorative Marquee ── */}
        <TalksMarquee />

        {/* ── Layer 2: Accordion Ledger ── */}
        <div className="talks-ledger-header">
          <p className="talks-count-label">
            {talksAdvisoryData.length} Engagements · 2018 – Present
          </p>
        </div>

        <div
          className="talks-ledger"
          role="list"
          aria-label="Talks and advisory engagements"
        >
          {talksAdvisoryData.map((talk) => (
            <TalkRow
              key={talk.id}
              talk={talk}
              isOpen={openIds.has(talk.id)}
              onToggle={toggleRow}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
