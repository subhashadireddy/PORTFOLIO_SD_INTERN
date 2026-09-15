import React, { useEffect, useRef } from 'react';
import portraitImg from '../assets/sampath.jpeg';
import { gsap, ScrollTrigger } from '../utils/gsapConfig';
import { prefersReducedMotion } from '../utils/animations';
import '../styles/about.css';

const ORBIT_WORDS = ['Achanta', 'Sampath', 'Dakshina', 'Murthy'];

export default function About() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const portraitRef = useRef(null);
  const wordsContainerRef = useRef(null);
  const wordRefs = useRef([]);
  const settledGridRef = useRef(null);
  const bioRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    // If user prefers reduced motion or on mobile viewports, disable complex pinned scrub
    if (prefersReducedMotion() || window.innerWidth <= 960) {
      return;
    }

    const stageEl = stageRef.current;
    const portraitEl = portraitRef.current;
    const wordsEl = wordsContainerRef.current;
    const settledGridEl = settledGridRef.current;
    const bioEl = bioRef.current;
    const statsEl = statsRef.current;

    if (!stageEl || !portraitEl || !wordsEl) return;

    // Orbit parameters
    const rx = 240; // horizontal radius in px
    const ry = 170; // vertical radius in px
    const wordElements = wordRefs.current.filter(Boolean);

    // Initial positioning of words around ellipse
    const baseAngles = [
      0,                       // Achanta (Right)
      Math.PI / 2,             // Sampath (Bottom)
      Math.PI,                 // Dakshina (Left)
      (3 * Math.PI) / 2        // Murthy (Top)
    ];

    const orbitState = { progress: 0 };

    const updateOrbit = () => {
      const angleOffset = orbitState.progress * (Math.PI * 1.6); // ~290 degree rotation
      wordElements.forEach((el, index) => {
        const currentAngle = baseAngles[index] + angleOffset;
        const x = Math.cos(currentAngle) * rx;
        const y = Math.sin(currentAngle) * ry;
        // Subtle tilt following tangent, dampened for clean readability
        const tilt = Math.sin(currentAngle) * 12;
        el.style.transform = `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), 0) rotate(${tilt}deg)`;
      });
    };

    updateOrbit();

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stageEl,
          start: 'top top',
          end: '+=180%',
          pin: true,
          scrub: 0.7,
          anticipatePin: 1
        }
      });

      // STAGE 1: Arrival (0.00 -> 0.18)
      // Portrait fades in and scales from 90% to 100%
      tl.fromTo(
        portraitEl,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.18, ease: 'power2.out' },
        0
      );

      // Orbit words fade in
      tl.fromTo(
        wordsEl,
        { opacity: 0 },
        { opacity: 1, duration: 0.12, ease: 'power2.out' },
        0.06
      );

      // STAGE 2: Name Orbit (0.18 -> 0.52)
      // Scroll-scrubbed elliptical rotation around portrait
      tl.to(
        orbitState,
        {
          progress: 1,
          duration: 0.34,
          ease: 'none',
          onUpdate: updateOrbit
        },
        0.18
      );

      // STAGE 3: Settle & Dock (0.52 -> 0.72)
      // Words dissolve and reassemble, while portrait moves toward left (~30% position)
      tl.to(
        wordsEl,
        {
          opacity: 0,
          scale: 0.95,
          duration: 0.15,
          ease: 'power2.in'
        },
        0.52
      );

      // Portrait shrinks slightly and translates left into docked position
      tl.to(
        portraitEl,
        {
          left: '20%',
          top: '52%',
          scale: 0.76,
          duration: 0.20,
          ease: 'power3.inOut'
        },
        0.52
      );

      // Docked layout fades in simultaneously
      tl.fromTo(
        settledGridEl,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.20,
          ease: 'power3.out',
          onComplete: () => {
            if (settledGridEl) settledGridEl.classList.add('is-interactive');
          },
          onReverseComplete: () => {
            if (settledGridEl) settledGridEl.classList.remove('is-interactive');
          }
        },
        0.54
      );

      // STAGE 4: Biography & Typographic Stats (0.72 -> 0.94)
      if (bioEl) {
        tl.fromTo(
          bioEl,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.16, ease: 'power2.out' },
          0.70
        );
      }

      if (statsRef.current) {
        tl.fromTo(
          statsRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.16, ease: 'power2.out' },
          0.78
        );
      }

      // STAGE 5: Small buffer before unpinning smoothly into Education
      tl.to({}, { duration: 0.06 }, 0.94);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="about-pinned-outer" aria-label="About Dr. Achanta Sampath Dakshina Murthy">
      {/* DESKTOP PINNED STAGE */}
      <div ref={stageRef} className="about-pinned-stage">
        <span className="about-bg-counter" aria-hidden="true">
          02 / PROFILE &amp; ACADEMIC VISION
        </span>

        <div className="about-arena">
          {/* Centered Organic Portrait (Transitions smoothly to Docked Left) */}
          <div ref={portraitRef} className="about-portrait-anchor" aria-hidden="true">
            <img
              src={portraitImg}
              alt="Dr. Achanta Sampath Dakshina Murthy"
              className="about-portrait-image"
            />
          </div>

          {/* Orbiting Words around Portrait */}
          <div ref={wordsContainerRef} className="about-orbit-wrapper" aria-hidden="true">
            {ORBIT_WORDS.map((word, i) => (
              <span
                key={word}
                ref={(el) => (wordRefs.current[i] = el)}
                className="about-orbit-word"
              >
                {word}
              </span>
            ))}
          </div>

          {/* Docked Content Layout (Settled Heading, Biography, Typographic Statistics) */}
          <div ref={settledGridRef} className="about-settled-grid">
            <div className="about-settled-left" aria-hidden="true">
              {/* Spacer matching docked portrait coordinate */}
            </div>

            <div className="about-settled-right">
              <div className="about-settled-heading-wrap">
                <span className="about-settled-eyebrow">
                  Senior Associate Professor &middot; Head, VCIS
                </span>
                <h2 className="about-settled-heading">
                  Achanta Sampath<br />Dakshina Murthy
                </h2>
              </div>

              <div ref={bioRef} className="about-bio-narrative">
                <p className="about-bio-lead">
                  Academician, research investigator, and innovation leader with over 10 years of pedagogical excellence in Electronics &amp; Communication Engineering and institutional leadership as Head, Vignan&apos;s Centre for Innovations &amp; Startups (VCIS).
                </p>
                <p className="about-bio-body">
                  Conferred with a Doctor of Philosophy (Ph.D.) in Image Processing from K.L.E.F University (2023) at the 14th Convocation in the presence of Sri Ram Nath Kovind, 14th Former President of India, and currently pursuing Post-Doctoral research in Artificial Intelligence at S.R University (2026). His research pioneers wearable IoT footwear for elderly fall prediction, multi-sensor data fusion for early sciatica diagnostics, and non-invasive precision healthcare systems.
                </p>
              </div>

              {/* Typographic Statistics (Strictly No Boxed Cards) */}
              <div ref={statsRef} className="about-stats-row">
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
        </div>
      </div>

      {/* MOBILE FLOW (Simplified Sequential Hierarchy, Pinning Disabled) */}
      <div className="about-mobile-flow">
        <div>
          <span className="font-eyebrow" style={{ color: 'var(--text-secondary)' }}>
            02 / PROFILE &amp; ACADEMIC VISION
          </span>
          <h2 className="font-section-title about-mobile-heading">
            Achanta Sampath<br />Dakshina Murthy
          </h2>
        </div>

        <div className="about-mobile-portrait-wrap">
          <img
            src={portraitImg}
            alt="Dr. Achanta Sampath Dakshina Murthy"
            className="about-mobile-portrait"
          />
        </div>

        <div className="about-bio-narrative">
          <p className="about-bio-lead">
            Senior Associate Professor and Head, Vignan&apos;s Centre for Innovations &amp; Startups (VCIS) with over 10 years of teaching and institutional leadership experience.
          </p>
          <p className="about-bio-body">
            Doctor of Philosophy (Ph.D.) in Image Processing from K.L.E.F University (2023) and Post-Doctoral Fellow in CSE - AI at S.R University (2026). Specialized in human gait fall prediction, wearable multi-sensor fusion, and clinical decision support systems.
          </p>
        </div>

        <div className="about-stats-row">
          <div className="about-stat-item">
            <span className="about-stat-number">10+</span>
            <span className="about-stat-label">Yrs Teaching</span>
          </div>
          <div className="about-stat-item">
            <span className="about-stat-number">103</span>
            <span className="about-stat-label">Papers Published</span>
          </div>
          <div className="about-stat-item">
            <span className="about-stat-number">15</span>
            <span className="about-stat-label">Scopus h-index</span>
          </div>
          <div className="about-stat-item">
            <span className="about-stat-number">31+</span>
            <span className="about-stat-label">Patents &amp; Designs</span>
          </div>
        </div>
      </div>
    </section>
  );
}
