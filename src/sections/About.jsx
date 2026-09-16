import React, { useRef } from 'react';
import ResearchViz from '../components/ResearchViz';
import '../styles/about.css';

/**
 * About Section
 *
 * Desktop: two-column grid
 *   Left:  Research Visualization (gait analysis SVG)
 *   Right: Biography + Statistics
 *
 * The old portrait-orbit-pinned animation has been removed.
 * Scroll reveals are handled globally by useScrollReveal (IntersectionObserver).
 */
export default function About() {
  const sectionRef = useRef(null);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="about-section reveal-on-scroll"
      aria-label="About Dr. Achanta Sampath Dakshina Murthy"
    >
      <div className="container about-grid">
        {/* ── LEFT: Research Visualization ─────────────────────────── */}
        <div className="about-viz-col">
          <ResearchViz sectionRef={sectionRef} />
        </div>

        {/* ── RIGHT: Biography & Stats ──────────────────────────────── */}
        <div className="about-content-col">
          <span className="about-eyebrow reveal-on-scroll">
            02 / PROFILE &amp; ACADEMIC VISION
          </span>

          <h2 className="about-heading reveal-on-scroll">
            Achanta Sampath<br />Dakshina Murthy
          </h2>

          <p className="about-role reveal-on-scroll">
            Senior Associate Professor &middot; Head, VCIS
          </p>

          <div className="about-bio-narrative reveal-on-scroll">
            <p className="about-bio-lead">
              Academician, research investigator, and innovation leader with over 10 years of pedagogical excellence in Electronics &amp; Communication Engineering and institutional leadership as Head, Vignan&apos;s Centre for Innovations &amp; Startups (VCIS).
            </p>
            <p className="about-bio-body">
              Conferred with a Doctor of Philosophy (Ph.D.) in Image Processing from K.L.E.F University (2023) at the 14th Convocation in the presence of Sri Ram Nath Kovind, 14th Former President of India, and currently pursuing Post-Doctoral research in Artificial Intelligence at S.R University (2026). His research pioneers wearable IoT footwear for elderly fall prediction, multi-sensor data fusion for early sciatica diagnostics, and non-invasive precision healthcare systems.
            </p>
          </div>

          {/* Typographic Statistics */}
          <div className="about-stats-row reveal-on-scroll">
            <div className="about-stat-item">
              <span className="about-stat-number">10+</span>
              <span className="about-stat-label">Yrs Teaching Experience</span>
            </div>
            <div className="about-stat-item">
              <span className="about-stat-number">103</span>
              <span className="about-stat-label">Research Papers Published</span>
            </div>
            <div className="about-stat-item">
              <span className="about-stat-number">15</span>
              <span className="about-stat-label">Scopus h-index (1,018 Cits)</span>
            </div>
            <div className="about-stat-item">
              <span className="about-stat-number">31+</span>
              <span className="about-stat-label">Patents &amp; Design Patents</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
