import React, { useState, useEffect, useRef, useCallback } from 'react';
import { profileData } from '../data/profile';

/* ────────────────────────────────────────────────────────────────────
   Contact / Footer — Closing Credits
   All styles inlined (disk conservation). Mirrors Hero scale on exit.
   ────────────────────────────────────────────────────────────────── */

/* ─── Back-to-Top floating button ─── */
function BackToTop() {
  const [visible, setVisible] = useState(false);
  const btnRef = useRef(null);

  useEffect(() => {
    // Show after user scrolls past ~100vh
    const threshold = window.innerHeight;
    const onScroll = () => setVisible(window.scrollY > threshold);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Move focus back to a logical start point
    const hero = document.getElementById('hero') || document.body;
    hero.focus?.();
  }, []);

  const handleKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={handleClick}
      onKeyDown={handleKey}
      aria-label="Back to top of page"
      data-hoverable="true"
      style={{
        position: 'fixed',
        bottom: '2.5rem',
        right: '2.5rem',
        zIndex: 80,
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        border: '1px solid var(--line)',
        backgroundColor: 'var(--bg)',
        color: 'var(--text)',
        fontFamily: 'var(--font-family)',
        fontSize: '1rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'all' : 'none',
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 350ms cubic-bezier(0.16,1,0.3,1), transform 350ms cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      ↑
    </button>
  );
}

/* ─── Individual research link row ─── */
function ResearchLink({ db }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={db.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${db.name} profile — opens in new tab`}
      data-hoverable="true"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        paddingTop: 'clamp(0.85rem, 1.8vw, 1.25rem)',
        paddingBottom: 'clamp(0.85rem, 1.8vw, 1.25rem)',
        borderBottom: '1px solid var(--line-subtle)',
        textDecoration: 'none',
        color: 'inherit',
        gap: '1rem',
        transition: 'background-color 200ms ease',
        backgroundColor: hovered ? 'rgba(10,10,10,0.02)' : 'transparent',
      }}
    >
      {/* Platform name + ID */}
      <span style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
        <span style={{
          fontFamily: 'var(--font-family)',
          fontSize: 'clamp(1.125rem, 2.2vw, 1.5rem)',
          fontWeight: 500,
          letterSpacing: '-0.02em',
          color: 'var(--text)',
          lineHeight: 1.2,
        }}>
          {db.name}
        </span>
        <span style={{
          fontFamily: 'var(--font-family)',
          fontSize: '0.75rem',
          fontWeight: 500,
          letterSpacing: '0.1em',
          color: 'var(--text-muted)',
        }}>
          {db.id}
        </span>
      </span>

      {/* Arrow: → on idle, ↗ + translate on hover */}
      <span
        aria-hidden="true"
        style={{
          fontFamily: 'var(--font-family)',
          fontSize: 'clamp(1rem, 2vw, 1.375rem)',
          color: hovered ? 'var(--text)' : 'var(--text-muted)',
          transform: hovered ? 'translate(4px, -4px)' : 'translate(0, 0)',
          transition: 'transform 280ms cubic-bezier(0.16,1,0.3,1), color 200ms ease',
          flexShrink: 0,
        }}
      >
        {hovered ? '↗' : '→'}
      </span>
    </a>
  );
}

/* ─── Main section ─── */
export default function ContactFooter() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  /* Fade-in on scroll into view */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const prefersReduced =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) { setVisible(true); return; }
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      {/* ── Back-to-Top floating btn (global — not inside section) ── */}
      <BackToTop />

      <section
        ref={sectionRef}
        id="contact"
        aria-label="Contact and Footer"
        style={{
          position: 'relative',
          width: '100%',
          backgroundColor: 'var(--bg)',
          borderTop: '1px solid var(--line)',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 700ms cubic-bezier(0.16,1,0.3,1), transform 700ms cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* ── MAIN BODY ── */}
        <div style={{
          width: '100%',
          maxWidth: 'var(--container-max-width)',
          margin: '0 auto',
          padding: 'var(--space-3xl) var(--container-padding)',
        }}>

          {/* ─── Hero-scale closing statement ─── */}
          <div style={{ marginBottom: 'var(--space-2xl)' }}>
            <span style={{
              display: 'block',
              fontFamily: 'var(--font-family)',
              fontSize: '0.6875rem',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: '1.25rem',
            }}>
              17 / Inquiries &amp; Collaborations
            </span>

            <h2 style={{
              fontFamily: 'var(--font-family)',
              fontSize: 'clamp(3.5rem, 8vw, 7.5rem)',
              fontWeight: 600,
              lineHeight: 0.95,
              letterSpacing: '-0.03em',
              color: 'var(--text)',
              margin: 0,
              marginBottom: 'var(--space-lg)',
            }}>
              Let's<br />Connect.
            </h2>

            <p style={{
              fontFamily: 'var(--font-family)',
              fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
              fontWeight: 400,
              lineHeight: 1.7,
              color: 'var(--text-secondary)',
              maxWidth: '44rem',
              margin: 0,
            }}>
              Open to doctoral advisory invitations, funded research collaborations,
              institutional incubation mentorship, and scholarly keynotes.
            </p>
          </div>

          {/* ─── Two-column layout: Contact | Research Links ─── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'clamp(3rem, 6vw, 7rem)',
            borderTop: '1px solid var(--line)',
            paddingTop: 'var(--space-xl)',
          }}>

            {/* Left: Direct contact */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>

              {/* Email */}
              <div>
                <span style={{
                  display: 'block',
                  fontFamily: 'var(--font-family)',
                  fontSize: '0.625rem',
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  marginBottom: '0.5rem',
                }}>
                  Email
                </span>
                <a
                  href={`mailto:${profileData.email}`}
                  data-hoverable="true"
                  style={{
                    fontFamily: 'var(--font-family)',
                    fontSize: 'clamp(0.9375rem, 1.4vw, 1.125rem)',
                    fontWeight: 500,
                    color: 'var(--text)',
                    textDecoration: 'none',
                    letterSpacing: '-0.01em',
                    borderBottom: '1px solid var(--line)',
                    paddingBottom: '0.2rem',
                    transition: 'border-color 200ms ease',
                  }}
                >
                  {profileData.email}
                </a>
              </div>

              {/* Phone */}
              <div>
                <span style={{
                  display: 'block',
                  fontFamily: 'var(--font-family)',
                  fontSize: '0.625rem',
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  marginBottom: '0.5rem',
                }}>
                  Phone
                </span>
                <a
                  href={`tel:${profileData.phone.replace(/\s/g, '')}`}
                  data-hoverable="true"
                  style={{
                    fontFamily: 'var(--font-family)',
                    fontSize: 'clamp(0.9375rem, 1.4vw, 1.125rem)',
                    fontWeight: 500,
                    color: 'var(--text)',
                    textDecoration: 'none',
                    letterSpacing: '-0.01em',
                    borderBottom: '1px solid var(--line)',
                    paddingBottom: '0.2rem',
                    transition: 'border-color 200ms ease',
                  }}
                >
                  {profileData.phone}
                </a>
              </div>

              {/* Address */}
              <div>
                <span style={{
                  display: 'block',
                  fontFamily: 'var(--font-family)',
                  fontSize: '0.625rem',
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  marginBottom: '0.5rem',
                }}>
                  Office
                </span>
                <p style={{
                  fontFamily: 'var(--font-family)',
                  fontSize: '0.875rem',
                  fontWeight: 400,
                  lineHeight: 1.7,
                  color: 'var(--text-secondary)',
                  margin: 0,
                }}>
                  Head, Vignan's Centre for Innovations &amp; Startups<br />
                  Vignan's Institute of Information Technology (A)<br />
                  Duvvada, Visakhapatnam – 530049<br />
                  Andhra Pradesh, India
                </p>
              </div>
            </div>

            {/* Right: Research profile links */}
            <div>
              <span style={{
                display: 'block',
                fontFamily: 'var(--font-family)',
                fontSize: '0.625rem',
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                marginBottom: 'var(--space-md)',
              }}>
                Scholarly Profiles &amp; Databases
              </span>
              <div style={{ borderTop: '1px solid var(--line-subtle)' }}>
                {profileData.databases.map((db) => (
                  <ResearchLink key={db.name} db={db} />
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ── FOOTER BAR ── */}
        <div style={{
          width: '100%',
          borderTop: '1px solid var(--line)',
          backgroundColor: 'var(--bg-subtle)',
        }}>
          <div style={{
            width: '100%',
            maxWidth: 'var(--container-max-width)',
            margin: '0 auto',
            padding: 'var(--space-md) var(--container-padding)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}>

            {/* Name */}
            <span style={{
              fontFamily: 'var(--font-family)',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.06em',
              color: 'var(--text-secondary)',
            }}>
              {profileData.name}
            </span>

            {/* Centre credit */}
            <span style={{
              fontFamily: 'var(--font-family)',
              fontSize: '0.6875rem',
              fontWeight: 400,
              letterSpacing: '0.08em',
              color: 'var(--text-muted)',
            }}>
              Portfolio designed &amp; built 2026
            </span>

            {/* Back to top inline link (complements floating btn) */}
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              data-hoverable="true"
              aria-label="Back to top"
              style={{
                background: 'transparent',
                border: '1px solid var(--line)',
                fontFamily: 'var(--font-family)',
                fontSize: '0.625rem',
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'color 200ms ease, border-color 200ms ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = 'var(--text)';
                e.currentTarget.style.borderColor = 'var(--text-secondary)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = 'var(--text-muted)';
                e.currentTarget.style.borderColor = 'var(--line)';
              }}
            >
              Back to Top ↑
            </button>

          </div>
        </div>

      </section>
    </>
  );
}
