import React, { useEffect, useRef } from 'react';
import SectionHeader from '../components/SectionHeader';
import { researchData } from '../data/research';
import { gsap, ScrollTrigger } from '../utils/gsapConfig';
import { prefersReducedMotion } from '../utils/animations';
import '../styles/research.css';

export default function ResearchFocus() {
  const sectionRef = useRef(null);
  const dividerRef = useRef(null);
  const block1Ref = useRef(null);
  const block2Ref = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const blocks = [block1Ref.current, block2Ref.current].filter(Boolean);

      blocks.forEach((block) => {
        const col1 = block.querySelector('.col-left');
        const col2 = block.querySelector('.col-right');
        const title = block.querySelector('.research-project-title');
        const watermark = block.querySelector('.research-watermark-num');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: block,
            start: 'top 82%',
            toggleActions: 'play none none reverse'
          },
          defaults: { ease: 'power3.out' }
        });

        if (watermark) {
          tl.fromTo(watermark, { opacity: 0, y: -20 }, { opacity: 0.05, y: 0, duration: 1.1 }, 0);
        }

        if (title) {
          tl.fromTo(title, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, 0.1);
        }

        // Manuscript unfolding effect: Column 1 rises from below, Column 2 rises at a slightly different speed (subtle parallax offset)
        if (col1) {
          tl.fromTo(col1, { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 0.85 }, 0.2);
        }

        if (col2) {
          tl.fromTo(col2, { opacity: 0, y: 52 }, { opacity: 1, y: 0, duration: 0.95 }, 0.28);
        }
      });

      // Divider draws from left to right
      if (dividerRef.current) {
        gsap.to(dividerRef.current, {
          scaleX: 1,
          ease: 'power3.out',
          duration: 1.2,
          scrollTrigger: {
            trigger: dividerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="research-focus" ref={sectionRef} className="research-section-root" aria-label="Research Focus Areas">
      <div className="research-container">
        <SectionHeader
          number="06"
          eyebrow="Flagship Investigations"
          title="Research Focus"
          subtitle="Pioneering non-invasive biomedical gait diagnostics, wearable IoT sensor frameworks, and clinical machine intelligence."
        />

        {/* Core Research Domains */}
        <div className="research-domains-bar" aria-label="Primary Research Areas">
          {researchData.domains.map((domain) => (
            <span key={domain} className="research-domain-tag">
              {domain}
            </span>
          ))}
        </div>

        {/* Flagship Project 01: Post-Doctoral Fellowship */}
        <article ref={block1Ref} className="research-manuscript-block" aria-label="Post-Doctoral Fellowship Research">
          {/* Faint Oversized Watermark Numeral */}
          <span className="research-watermark-num" aria-hidden="true">
            {researchData.postDoc.number}
          </span>

          <div className="research-manuscript-content">
            <div className="research-meta-line">
              <span className="research-project-label">
                {researchData.postDoc.label}
              </span>
              <span className="research-institution-badge">
                {researchData.postDoc.institution} &middot; {researchData.postDoc.year}
              </span>
            </div>

            <h3 className="research-project-title">
              {researchData.postDoc.title}
            </h3>

            {/* Two-Column Abstract Spread */}
            <div className="research-abstract-spread">
              <div className="research-abstract-col col-left">
                <span className="research-col-label">Clinical Background &amp; Problem Formulation</span>
                <p className="research-abstract-text">
                  {researchData.postDoc.col1}
                </p>
              </div>

              <div className="research-abstract-col col-right">
                <span className="research-col-label">Methodology, Data Fusion &amp; Clinical Impact</span>
                <p className="research-abstract-text-secondary">
                  {researchData.postDoc.col2}
                </p>
              </div>
            </div>
          </div>
        </article>

        {/* Dynamic Self-Drawing Divider */}
        <div ref={dividerRef} className="research-section-divider" aria-hidden="true" />

        {/* Flagship Project 02: Ph.D. Dissertation */}
        <article ref={block2Ref} className="research-manuscript-block" aria-label="Ph.D. Dissertation Research">
          {/* Faint Oversized Watermark Numeral */}
          <span className="research-watermark-num" aria-hidden="true">
            {researchData.phd.number}
          </span>

          <div className="research-manuscript-content">
            <div className="research-meta-line">
              <span className="research-project-label">
                {researchData.phd.label}
              </span>
              <span className="research-institution-badge">
                {researchData.phd.institution} &middot; {researchData.phd.year}
              </span>
            </div>

            <h3 className="research-project-title">
              {researchData.phd.title}
            </h3>

            {/* Two-Column Abstract Spread */}
            <div className="research-abstract-spread">
              <div className="research-abstract-col col-left">
                <span className="research-col-label">Biomechanical Modeling &amp; IoT Sensing</span>
                <p className="research-abstract-text">
                  {researchData.phd.col1}
                </p>
              </div>

              <div className="research-abstract-col col-right">
                <span className="research-col-label">Algorithms, Cloud Analytics &amp; Intervention</span>
                <p className="research-abstract-text-secondary">
                  {researchData.phd.col2}
                </p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
