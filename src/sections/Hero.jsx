import React, { useEffect, useRef } from 'react';
import portraitImg from '../assets/sampath.jpeg';
import { profileData } from '../data/profile';
import { gsap } from '../utils/gsapConfig';
import { prefersReducedMotion } from '../utils/animations';
import '../styles/hero.css';

export default function Hero({ isLoaded = true }) {
  const sectionRef = useRef(null);
  const eyebrowRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const statementRef = useRef(null);
  const metaRef = useRef(null);
  const portraitFrameRef = useRef(null);
  const portraitImgRef = useRef(null);
  const scrollCueRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    // If reduced motion is requested, show everything immediately
    if (prefersReducedMotion()) {
      if (line1Ref.current) gsap.set(line1Ref.current.children, { y: '0%' });
      if (line2Ref.current) gsap.set(line2Ref.current.children, { y: '0%' });
      if (portraitImgRef.current) gsap.set(portraitImgRef.current, { opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0%)' });
      return;
    }

    // Wait until preloader signals site is loaded
    if (!isLoaded || hasAnimatedRef.current) return;
    hasAnimatedRef.current = true;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        delay: 0.1
      });

      // Eyebrow reveal
      if (eyebrowRef.current) {
        tl.fromTo(
          eyebrowRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.8 }
        );
      }

      // Title line 1 words reveal upward through mask
      if (line1Ref.current) {
        const wordsLine1 = line1Ref.current.querySelectorAll('.hero-title-word');
        tl.fromTo(
          wordsLine1,
          { y: '115%' },
          { y: '0%', duration: 1.0, stagger: 0.08 },
          '-=0.6'
        );
      }

      // Title line 2 words reveal upward through mask
      if (line2Ref.current) {
        const wordsLine2 = line2Ref.current.querySelectorAll('.hero-title-word');
        tl.fromTo(
          wordsLine2,
          { y: '115%' },
          { y: '0%', duration: 1.0, stagger: 0.08 },
          '-=0.75'
        );
      }

      // Positioning statement reveal
      if (statementRef.current) {
        tl.fromTo(
          statementRef.current,
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.9 },
          '-=0.6'
        );
      }

      // Meta row reveal
      if (metaRef.current) {
        tl.fromTo(
          metaRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.6'
        );
      }

      // Portrait: starts scaled up at 105%, un-clips, and settles with luxury easing
      if (portraitImgRef.current) {
        tl.fromTo(
          portraitImgRef.current,
          {
            scale: 1.05,
            opacity: 0,
            clipPath: 'inset(8% 0% 0% 0%)'
          },
          {
            scale: 1,
            opacity: 1,
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.3,
            ease: 'power3.out'
          },
          0.3
        );
      }

      // Scroll Cue fade in
      if (scrollCueRef.current) {
        tl.fromTo(
          scrollCueRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.9 },
          '-=0.4'
        );
      }

      // Subtle parallax on scroll
      if (portraitFrameRef.current && sectionRef.current) {
        gsap.to(portraitFrameRef.current, {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.6
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isLoaded]);

  return (
    <section id="hero" ref={sectionRef} className="hero-section-root" aria-label="Introduction">
      <div className="hero-main-container">
        <div className="hero-editorial-layout">
          {/* Left 58%: Typography & Academic Authority */}
          <div className="hero-text-col">
            <div className="hero-eyebrow-wrap">
              <span ref={eyebrowRef} className="hero-eyebrow">
                SENIOR ASSOCIATE PROFESSOR &middot; HEAD, VIGNAN&apos;S CENTRE FOR INNOVATIONS &amp; STARTUPS
              </span>
            </div>

            <h1 className="hero-title" aria-label="Dr. Achanta Sampath Dakshina Murthy">
              <span ref={line1Ref} className="hero-title-line">
                <span className="hero-title-word">Dr.&nbsp;</span>
                <span className="hero-title-word">Achanta&nbsp;</span>
                <span className="hero-title-word">Sampath</span>
              </span>
              <span ref={line2Ref} className="hero-title-line">
                <span className="hero-title-word">Dakshina&nbsp;</span>
                <span className="hero-title-word">Murthy</span>
              </span>
            </h1>

            <div className="hero-statement-wrap">
              <p ref={statementRef} className="hero-statement">
                Researcher in Human Motion Analysis, Biomedical Signal Processing &amp; AI-Driven Diagnostics
              </p>
            </div>

            <div ref={metaRef} className="hero-meta-row">
              <div className="hero-meta-item">
                <span className="hero-meta-label">Primary Affiliation</span>
                <span className="hero-meta-val">{profileData.institution}</span>
              </div>
              <div className="hero-meta-item">
                <span className="hero-meta-label">Campus &amp; Location</span>
                <span className="hero-meta-val">{profileData.location}</span>
              </div>
            </div>
          </div>

          {/* Right 42%: Asymmetric Monochrome Portrait with Right Edge Bleed */}
          <div className="hero-portrait-col">
            <div ref={portraitFrameRef} className="hero-portrait-frame">
              <img
                ref={portraitImgRef}
                src={portraitImg}
                alt="Dr. Achanta Sampath Dakshina Murthy at Vignan's Centre for Innovations & Startups"
                className="hero-portrait-img"
              />
              <div className="hero-portrait-caption">
                <span className="font-eyebrow" style={{ color: 'var(--text-muted)', fontSize: '0.6875rem' }}>
                  Dr. A. Sampath Dakshina Murthy
                </span>
                <span className="font-eyebrow" style={{ color: 'var(--text-muted)', fontSize: '0.6875rem' }}>
                  VCIS &middot; Visakhapatnam
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Minimal Editorial Scroll Cue */}
      <div className="hero-scroll-cue-container" ref={scrollCueRef}>
        <a href="#about" className="hero-scroll-cue" aria-label="Scroll to About section" data-hoverable="true">
          <span className="hero-scroll-label">Scroll</span>
          <div className="hero-scroll-track" aria-hidden="true">
            <div className="hero-scroll-line" />
          </div>
        </a>

        <div className="hero-scroll-cue">
          <span className="font-eyebrow" style={{ color: 'var(--text-muted)', fontSize: '0.6875rem' }}>
            Curriculum Vitae &middot; Research Portfolio
          </span>
        </div>
      </div>
    </section>
  );
}
