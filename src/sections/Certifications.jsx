import React, {
  useState, useEffect, useRef, useCallback, useMemo
} from 'react';
import { createPortal } from 'react-dom';
import SectionHeader from '../components/SectionHeader';
import { certificationsData } from '../data/certifications';
import '../styles/certifications.css';

/* ────────────────────────────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────────────────────────────── */

// Abbreviate org name to 3–4 char acronym for the stamp centre
function makeAcronym(str) {
  const words = str.split(/[\s/,&]+/).filter(Boolean);
  if (words.length === 1) return str.slice(0, 4).toUpperCase();
  return words
    .filter(w => !['and','of','for','the','&','a','an','on'].includes(w.toLowerCase()))
    .slice(0, 3)
    .map(w => w[0].toUpperCase())
    .join('');
}

// Drawer filter tabs
const DRAWER_TABS = [
  { id: 'all',         label: 'All' },
  { id: 'Online Certification', label: 'Certifications' },
  { id: 'FDP',         label: 'FDPs' },
  { id: 'Workshop',    label: 'Workshops' },
];

/* ────────────────────────────────────────────────────────────────────
   Passport Stamp
   ──────────────────────────────────────────────────────────────────── */
function CertStamp({ cert }) {
  const acronym = makeAcronym(cert.issuer);
  // Circle radius 32, circumference ≈ 201
  return (
    <div
      className="cert-stamp"
      tabIndex={0}
      role="article"
      aria-label={`${cert.issuer} — ${cert.title} (${cert.year})`}
      data-hoverable="true"
    >
      <div className="cert-stamp-graphic" aria-hidden="true">
        <svg className="cert-stamp-svg" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
          <circle
            className="cert-stamp-seal-path"
            cx="36" cy="36" r="32"
          />
        </svg>
        <span className="cert-stamp-acronym">{acronym}</span>
      </div>
      <div className="cert-stamp-info">
        <span className="cert-stamp-org">{cert.issuer}</span>
        <span className="cert-stamp-year">{cert.year}</span>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
   Drawer — focus trap + scroll lock + keyboard close
   ──────────────────────────────────────────────────────────────────── */
function CertDrawer({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('all');
  const drawerRef  = useRef(null);
  const closeRef   = useRef(null);
  const firstFocusRef = useRef(null);
  const prevFocusRef  = useRef(null);

  // Filter items
  const filtered = useMemo(() => {
    if (activeTab === 'all') return certificationsData.allItems;
    return certificationsData.allItems.filter(i => i.type === activeTab);
  }, [activeTab]);

  // Counts for tab labels
  const counts = useMemo(() => {
    const result = { all: certificationsData.allItems.length };
    DRAWER_TABS.slice(1).forEach(t => {
      result[t.id] = certificationsData.allItems.filter(i => i.type === t.id).length;
    });
    return result;
  }, []);

  /* ── Body scroll lock ── */
  useEffect(() => {
    if (isOpen) {
      // Save scroll position & lock
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      return () => {
        document.body.style.overflow = '';
        document.body.style.position = '';
        const savedY = parseInt(document.body.style.top || '0') * -1;
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, savedY);
      };
    }
  }, [isOpen]);

  /* ── Focus management ── */
  useEffect(() => {
    if (isOpen) {
      prevFocusRef.current = document.activeElement;
      // Short delay so the drawer has slid in
      const id = setTimeout(() => closeRef.current?.focus(), 50);
      return () => clearTimeout(id);
    } else {
      prevFocusRef.current?.focus();
    }
  }, [isOpen]);

  /* ── Focus trap ── */
  const handleDrawerKeyDown = useCallback((e) => {
    if (!drawerRef.current) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      return;
    }

    if (e.key !== 'Tab') return;

    const focusable = Array.from(
      drawerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter(el => !el.disabled && el.offsetParent !== null);

    if (focusable.length === 0) return;

    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, [onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <>
      {/* Overlay */}
      <div
        className={`cert-drawer-overlay${isOpen ? ' is-open' : ''}`}
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="All Certifications, FDPs and Workshops"
        className={`cert-drawer${isOpen ? ' is-open' : ''}`}
        onKeyDown={handleDrawerKeyDown}
      >
        {/* Drag handle */}
        <div className="cert-drawer-handle" aria-hidden="true">
          <div className="cert-drawer-handle-bar" />
        </div>

        {/* Header */}
        <div className="cert-drawer-header">
          <div>
            <h2 className="cert-drawer-title">
              Certifications, FDPs & Workshops
            </h2>
            <p className="cert-drawer-subtitle">
              {certificationsData.allItems.length} records · Continuous learning 2017 – 2026
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            className="cert-drawer-close"
            onClick={onClose}
            aria-label="Close drawer"
            data-hoverable="true"
          >
            ✕
          </button>
        </div>

        {/* Filter tabs */}
        <div
          className="cert-drawer-tabs"
          role="tablist"
          aria-label="Filter by type"
        >
          {DRAWER_TABS.map(tab => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`cert-drawer-tab${activeTab === tab.id ? ' is-active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              data-hoverable="true"
            >
              {tab.label}
              {' '}({counts[tab.id] ?? counts.all})
            </button>
          ))}
        </div>

        {/* Scrollable item list */}
        <div className="cert-drawer-body" role="tabpanel">
          <div
            className="cert-drawer-list"
            role="list"
            aria-label={`${activeTab === 'all' ? 'All' : activeTab} records`}
          >
            {filtered.length === 0 ? (
              <p className="cert-drawer-empty">No records in this category.</p>
            ) : (
              filtered.map(item => (
                <div
                  key={item.id}
                  className="cert-drawer-row"
                  role="listitem"
                >
                  <div className="cert-drawer-row-left">
                    <span className="cert-drawer-row-title">{item.title}</span>
                    <span className="cert-drawer-row-issuer">{item.issuer}</span>
                  </div>
                  <span className="cert-drawer-row-date">{item.date}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}

/* ────────────────────────────────────────────────────────────────────
   Horizontal Stamp Strip (drag-to-scroll)
   ──────────────────────────────────────────────────────────────────── */
function PassportStrip() {
  const trackRef = useRef(null);
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0 });

  const onMouseDown = e => {
    drag.current = { active: true, startX: e.pageX - trackRef.current.offsetLeft, scrollLeft: trackRef.current.scrollLeft };
  };
  const onMouseUp   = () => { drag.current.active = false; };
  const onMouseLeave = () => { drag.current.active = false; };
  const onMouseMove  = e => {
    if (!drag.current.active) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    trackRef.current.scrollLeft = drag.current.scrollLeft - (x - drag.current.startX) * 1.2;
  };

  // Wheel → horizontal scroll
  const onWheel = e => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      trackRef.current.scrollLeft += e.deltaY;
    }
  };

  return (
    <div className="cert-strip-wrapper" aria-hidden="true">
      <div
        ref={trackRef}
        className="cert-strip-track"
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
        onWheel={onWheel}
      >
        {certificationsData.keyCertifications.map(cert => (
          <CertStamp key={cert.id} cert={cert} />
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
   Main Section
   ──────────────────────────────────────────────────────────────────── */
export default function Certifications() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const openDrawer  = useCallback(() => setDrawerOpen(true),  []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const { stats } = certificationsData;
  const total = stats.onlineCertifications + stats.fdpsAttended + stats.workshops;

  return (
    <section
      id="certifications"
      className="cert-section-root"
      aria-label="Certifications, FDPs and Workshops"
    >
      <div className="cert-container">
        {/* Section Header */}
        <SectionHeader
          number="16"
          eyebrow="Continuous Learning"
          title="Certifications & FDPs"
          subtitle={`${total}+ credentials across online certifications, faculty development programmes, and technical workshops — Coursera, NPTEL, AICTE-ATAL, IEEE, and MathWorks.`}
        />

        {/* Stats bar */}
        <div className="cert-stats-bar reveal-on-scroll reveal-stagger" aria-label="Credential summary">
          <div className="cert-stat-item">
            <span className="cert-stat-value">{stats.onlineCertifications}</span>
            <span className="cert-stat-label">Online Certifications</span>
          </div>
          <div className="cert-stat-item">
            <span className="cert-stat-value">{stats.fdpsAttended}</span>
            <span className="cert-stat-label">FDPs Attended</span>
          </div>
          <div className="cert-stat-item">
            <span className="cert-stat-value">{stats.workshops}</span>
            <span className="cert-stat-label">Workshops</span>
          </div>
          <div className="cert-stat-item">
            <span className="cert-stat-value">{stats.eventsOrganized}</span>
            <span className="cert-stat-label">Events Organised</span>
          </div>
        </div>

        {/* Passport stamp strip */}
        <div className="reveal-on-scroll">
          <PassportStrip />
        </div>

        {/* "View all" CTA */}
        <div className="cert-view-all-wrapper reveal-on-scroll">
          <button
            type="button"
            className="cert-view-all-btn"
            onClick={openDrawer}
            aria-haspopup="dialog"
            aria-expanded={drawerOpen}
            data-hoverable="true"
          >
            View All Certifications
            <span className="cert-view-all-count">
              ({certificationsData.allItems.length} records)
            </span>
          </button>
        </div>
      </div>

      {/* Bottom-sheet drawer (rendered into document.body via portal) */}
      <CertDrawer isOpen={drawerOpen} onClose={closeDrawer} />
    </section>
  );
}
