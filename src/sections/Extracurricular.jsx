import React, { useEffect, useRef } from 'react';
import { extracurricularData } from '../data/extracurricular';

/* ──────────────────────────────────────────────────────────────────
   EXTRACURRICULAR / ADDITIONAL QUALIFICATIONS — Footnote Strip
   Intentionally low visual weight: small grey typography only.
   All styles inlined to conserve disk space.
   ────────────────────────────────────────────────────────────────── */

const S = {
  root: {
    position: 'relative',
    width: '100%',
    backgroundColor: 'var(--bg-subtle)',
    paddingTop: 'var(--space-2xl)',
    paddingBottom: 'var(--space-2xl)',
    opacity: 0,
    transition: 'opacity 700ms cubic-bezier(0.16, 1, 0.3, 1)',
  },
  container: {
    width: '100%',
    maxWidth: 'var(--container-max-width)',
    margin: '0 auto',
    paddingLeft: 'var(--container-padding)',
    paddingRight: 'var(--container-padding)',
  },
  eyebrowRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '2rem',
  },
  eyebrowText: {
    fontFamily: 'var(--font-family)',
    fontSize: '0.625rem',
    fontWeight: 700,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    whiteSpace: 'nowrap',
  },
  rule: {
    flex: 1,
    height: 1,
    backgroundColor: 'var(--line-subtle)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 'clamp(1.5rem, 4vw, 4rem)',
    borderTop: '1px solid var(--line-subtle)',
    paddingTop: 'var(--space-lg)',
  },
  colLabel: {
    fontFamily: 'var(--font-family)',
    fontSize: '0.625rem',
    fontWeight: 700,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    marginBottom: '1rem',
    opacity: 0.7,
  },
  listReset: { listStyle: 'none', padding: 0, margin: 0 },
  row: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.75rem',
    marginBottom: '0.85rem',
  },
  yearMini: {
    fontFamily: 'var(--font-family)',
    fontSize: '0.75rem',
    fontWeight: 600,
    fontVariantNumeric: 'tabular-nums',
    color: 'var(--text-muted)',
    minWidth: '3.25rem',
    flexShrink: 0,
  },
  yearWide: {
    fontFamily: 'var(--font-family)',
    fontSize: '0.75rem',
    fontWeight: 600,
    fontVariantNumeric: 'tabular-nums',
    color: 'var(--text-muted)',
    minWidth: '5.5rem',
    flexShrink: 0,
  },
  primaryText: {
    fontFamily: 'var(--font-family)',
    fontSize: '0.8125rem',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    lineHeight: 1.45,
    display: 'block',
  },
  subText: {
    fontFamily: 'var(--font-family)',
    fontSize: '0.6875rem',
    fontWeight: 400,
    color: 'var(--text-muted)',
    lineHeight: 1.4,
    display: 'block',
  },
  categoryTag: {
    fontFamily: 'var(--font-family)',
    fontSize: '0.625rem',
    fontWeight: 700,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    display: 'block',
    marginTop: '0.1rem',
    opacity: 0.65,
  },
};

export default function Extracurricular() {
  const rootRef = useRef(null);

  /* Gentle section fade-in — respects prefers-reduced-motion */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const prefersReduced =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      el.style.opacity = '1';
      el.style.transition = 'none';
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1';
          obs.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const { nccQualifications, honorsAndService } = extracurricularData;

  return (
    <section
      ref={rootRef}
      id="extracurricular"
      style={S.root}
      aria-label="Extracurricular Activities and Additional Qualifications"
    >
      <div style={S.container}>

        {/* Centred eyebrow rule */}
        <div style={S.eyebrowRow} aria-hidden="true">
          <span style={S.rule} />
          <span style={S.eyebrowText}>
            Extracurricular &amp; Additional Qualifications
          </span>
          <span style={S.rule} />
        </div>

        {/* Two-column footnote grid */}
        <div style={S.grid}>

          {/* ── NCC column ── */}
          <div>
            <p style={S.colLabel}>NCC Qualifications</p>
            <ul role="list" style={S.listReset}>
              {nccQualifications.map((item, i) => (
                <li key={i} style={S.row}>
                  <span style={S.yearMini}>{item.year}</span>
                  <span>
                    <span style={S.primaryText}>
                      {item.level} &middot; {item.rank}
                    </span>
                    <span style={S.subText}>{item.details}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Honors & Service column ── */}
          <div>
            <p style={S.colLabel}>Honors, Arts &amp; Service</p>
            <ul role="list" style={S.listReset}>
              {honorsAndService.map((item, i) => (
                <li key={i} style={S.row}>
                  <span style={S.yearWide}>{item.year}</span>
                  <span>
                    <span style={S.primaryText}>{item.title}</span>
                    <span style={S.categoryTag}>{item.category}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
