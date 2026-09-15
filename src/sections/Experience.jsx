import React, { useEffect, useRef } from 'react';
import SectionHeader from '../components/SectionHeader';
import { experienceData } from '../data/experience';
import { gsap, ScrollTrigger } from '../utils/gsapConfig';
import { prefersReducedMotion } from '../utils/animations';
import '../styles/experience.css';

export default function Experience() {
  const sectionRef = useRef(null);
  const timelineRef = useRef(null);
  const lineRef = useRef(null);
  const entriesRef = useRef([]);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const timelineEl = timelineRef.current;
    const lineEl = lineRef.current;
    const entries = entriesRef.current.filter(Boolean);

    if (!timelineEl || !lineEl) return;

    const ctx = gsap.context(() => {
      // Progressive Vertical Line Draw scrubbed to timeline scroll
      gsap.fromTo(
        lineEl,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: timelineEl,
            start: 'top 75%',
            end: 'bottom 80%',
            scrub: 0.5
          }
        }
      );

      // Animate each entry dot and content card as it scrolls into view
      entries.forEach((entryEl, index) => {
        const dot = entryEl.querySelector('.experience-dot');
        const card = entryEl.querySelector('.experience-card-col');
        const isLeft = entryEl.classList.contains('is-left');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: entryEl,
            start: 'top 82%',
            toggleActions: 'play none none reverse'
          }
        });

        // Dot: scale 0 -> 1 with subtle overshoot
        if (dot) {
          tl.fromTo(
            dot,
            { scale: 0 },
            {
              scale: 1,
              duration: 0.5,
              ease: 'back.out(1.4)'
            },
            0
          );
        }

        // Content: fade and slide from its respective side
        if (card) {
          const isMobile = window.innerWidth <= 860;
          const slideOffset = isMobile ? 32 : isLeft ? -36 : 36;

          tl.fromTo(
            card,
            {
              opacity: 0,
              x: slideOffset
            },
            {
              opacity: 1,
              x: 0,
              duration: 0.75,
              ease: 'power3.out'
            },
            0.08
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" ref={sectionRef} className="experience-section-root" aria-label="Work Experience Timeline">
      <div className="experience-container">
        <SectionHeader
          number="04"
          eyebrow="Chronology &amp; Industry"
          title="Experience Timeline"
          subtitle="A progressive trajectory spanning university faculty advancements, institutional research leadership, and precision engineering practice."
        />

        {/* Experience Summary Bar */}
        <div className="experience-summary-bar">
          <div className="experience-summary-stat">
            <span className="experience-summary-stat-val">{experienceData.summary.teaching}</span>
            <span className="experience-summary-stat-lbl">Teaching Experience</span>
          </div>
          <div className="experience-summary-stat">
            <span className="experience-summary-stat-val">{experienceData.summary.industrial}</span>
            <span className="experience-summary-stat-lbl">Industrial Experience</span>
          </div>
        </div>

        {/* Vertical Timeline */}
        <div ref={timelineRef} className="experience-timeline">
          {/* Static Track Line */}
          <div className="experience-track-line" aria-hidden="true" />
          {/* Animated Progressive Draw Line */}
          <div ref={lineRef} className="experience-draw-line" aria-hidden="true" />

          {experienceData.timeline.map((item, index) => {
            const isLeft = index % 2 === 0;

            return (
              <div
                key={item.period + item.role}
                ref={(el) => (entriesRef.current[index] = el)}
                className={`experience-entry ${isLeft ? 'is-left' : 'is-right'}`}
              >
                {/* Center Solid Circle Dot */}
                <div className="experience-dot" aria-hidden="true" />

                <div className="experience-entry-grid">
                  <div className="experience-card-col">
                    <span className="experience-date-text">{item.period}</span>
                    <h3 className="experience-role-title">{item.role}</h3>
                    <p className="experience-org-text">{item.organization}</p>
                    <p className="experience-location-text">{item.location}</p>
                    <p className="experience-desc-text">{item.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
