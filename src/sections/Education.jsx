import React, { useEffect, useRef } from 'react';
import SectionHeader from '../components/SectionHeader';
import { educationData } from '../data/education';
import { gsap, ScrollTrigger } from '../utils/gsapConfig';
import { prefersReducedMotion } from '../utils/animations';
import '../styles/education.css';

export default function Education() {
  const sectionRef = useRef(null);
  const rowsRef = useRef([]);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      rowsRef.current.forEach((rowEl) => {
        if (!rowEl) return;

        const yearEl = rowEl.querySelector('.education-year-text');
        const contentEl = rowEl.querySelector('.education-content-col');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: rowEl,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          defaults: { ease: 'power3.out' }
        });

        if (yearEl) {
          tl.fromTo(
            yearEl,
            {
              opacity: 0.04,
              filter: 'blur(8px)',
              x: -16
            },
            {
              opacity: 0.22,
              filter: 'blur(0px)',
              x: 0,
              duration: 0.9
            }
          );
        }

        if (contentEl) {
          tl.fromTo(
            contentEl,
            {
              opacity: 0,
              x: 24
            },
            {
              opacity: 1,
              x: 0,
              duration: 0.85
            },
            '-=0.65'
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="education" ref={sectionRef} className="education-section-root" aria-label="Education Qualifications">
      <div className="education-container">
        <SectionHeader
          number="03"
          eyebrow="Academic Qualifications"
          title="Education"
          subtitle="Formal academic degrees, post-doctoral research fellowship, and foundational technical credentials from accredited universities and boards."
        />

        <div className="education-ledger-wrapper" role="list">
          {/* Bookshelf spine line motif */}
          <div className="education-spine-line" aria-hidden="true" />

          {educationData.map((item, index) => (
            <article
              key={item.year + item.degree}
              ref={(el) => (rowsRef.current[index] = el)}
              className="education-row"
              role="listitem"
              data-hoverable="true"
            >
              {/* Tick mark on spine */}
              <div className="education-row-tick" aria-hidden="true" />

              {/* Left Column: Oversized Faded Grey Year */}
              <div className="education-year-col">
                <span className="education-year-text">{item.year}</span>
              </div>

              {/* Center Column: Degree, Specialization, Institution */}
              <div className="education-content-col">
                <h3 className="education-degree-title">{item.degree}</h3>
                <p className="education-specialization-text">
                  Specialization: {item.specialization}
                </p>
                <p className="education-institution-text">
                  {item.institution}
                </p>
                {item.details && (
                  <p className="education-research-note">
                    {item.details}
                  </p>
                )}
              </div>

              {/* Far Right Column: Subtle Editorial Arrow on Hover */}
              <div className="education-arrow-col" aria-hidden="true">
                <span className="education-row-arrow">&rarr;</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
