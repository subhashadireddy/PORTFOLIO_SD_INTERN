import React, { useEffect, useRef } from 'react';
import SectionHeader from '../components/SectionHeader';
import { impactStatsData } from '../data/impactStats';
import { gsap, ScrollTrigger } from '../utils/gsapConfig';
import { prefersReducedMotion } from '../utils/animations';
import '../styles/impactStats.css';

export default function ImpactStats() {
  const sectionRef = useRef(null);
  const counterWallRef = useRef(null);
  const numRefs = useRef([]);
  const hasCountedRef = useRef(false);

  useEffect(() => {
    // If reduced motion is requested, display target numbers immediately
    if (prefersReducedMotion()) {
      impactStatsData.verifiedMetrics.forEach((metric, index) => {
        const el = numRefs.current[index];
        if (el) {
          const finalVal = metric.padZero && metric.target < 10 ? `0${metric.target}` : `${metric.target}`;
          el.textContent = `${finalVal}${metric.suffix}`;
        }
      });
      return;
    }

    const wallEl = counterWallRef.current;
    if (!wallEl) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wallEl,
        start: 'top 85%',
        once: true, // Guarantees counters run once and do not restart on micro-scrolls
        onEnter: () => {
          if (hasCountedRef.current) return;
          hasCountedRef.current = true;

          impactStatsData.verifiedMetrics.forEach((metric, index) => {
            const el = numRefs.current[index];
            if (!el) return;

            const counterObj = { value: 0 };
            const delay = index * 0.04; // Gentle stagger across counters

            gsap.to(counterObj, {
              value: metric.target,
              duration: 1.2, // ~1.2s duration as requested
              delay,
              ease: 'power2.out',
              onUpdate: () => {
                const currentVal = Math.round(counterObj.value);
                const displayVal = metric.padZero && currentVal < 10 ? `0${currentVal}` : `${currentVal}`;
                el.textContent = `${displayVal}${metric.suffix}`;
              }
            });
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="impact-stats" ref={sectionRef} className="impact-section-root" aria-label="Research Summary & Impact Statistics">
      <div className="impact-container">
        <SectionHeader
          number="07"
          eyebrow="Scholarly Impact &amp; Output"
          title="Impact Statistics"
          subtitle="Empirical indices, publication metrics, patents, and peer review leadership documented across international citation indices."
        />

        {/* Full-Width Typography Counter Wall (No Cards, No Boxes) */}
        <div ref={counterWallRef} className="impact-counter-wall" role="list">
          {impactStatsData.verifiedMetrics.map((item, index) => (
            <div
              key={item.id}
              className="impact-counter-item"
              role="listitem"
              data-hoverable="true"
            >
              <div className="impact-number-wrapper">
                <span
                  ref={(el) => (numRefs.current[index] = el)}
                  className="impact-stat-number"
                  aria-label={`${item.label}: ${item.target}${item.suffix}`}
                >
                  {item.padZero ? `00${item.suffix}` : `0${item.suffix}`}
                </span>
                {/* Thin animated hover underline */}
                <div className="impact-number-underline" aria-hidden="true" />
              </div>

              <span className="impact-stat-label">{item.label}</span>
              <span className="impact-stat-note">{item.note}</span>
            </div>
          ))}
        </div>

        {/* Minimalist Citation Database Comparison Strip */}
        <div className="impact-db-section">
          <div className="impact-db-header">
            <h3 className="impact-db-title">
              Database Comparison &amp; Citation Footprint
            </h3>
            <span className="impact-db-tagline">
              Authoritative CV Indexing &middot; ESS.pdf
            </span>
          </div>

          <table className="impact-db-table" aria-label="Database Citation Metrics">
            <thead>
              <tr>
                <th scope="col">Database / Repository</th>
                <th scope="col">h-index / Metric</th>
                <th scope="col">Total Citations</th>
                <th scope="col">Scope / Authority</th>
              </tr>
            </thead>
            <tbody>
              {impactStatsData.citationDatabases.map((db) => (
                <tr key={db.database} className="impact-db-row">
                  <td className="impact-db-name">{db.database}</td>
                  <td className="impact-db-val">
                    <span>h-{db.hIndex}</span>
                    <span className="impact-db-meta" style={{ marginLeft: '0.75rem' }}>
                      ({db.metrics})
                    </span>
                  </td>
                  <td className="impact-db-citations">{db.citations}</td>
                  <td className="impact-db-meta">{db.scope}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
