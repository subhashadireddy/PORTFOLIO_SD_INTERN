import React, { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../utils/gsapConfig';
import { prefersReducedMotion } from '../utils/animations';
import '../styles/research-viz.css';

/**
 * ResearchViz — Premium Human Motion / Gait Analysis Visualization
 *
 * ONE central anatomical figure with:
 *   - Smooth bezier-curve body outline (mid-stride walking pose)
 *   - Joint sensor nodes at 14 anatomical positions
 *   - Data channel lines extending from key sensors to readout markers
 *   - Three integrated signal waveforms (acceleration, angular velocity, plantar pressure)
 *   - Very subtle ambient grid for scientific reference
 *   - Travelling data particles along sensor channels
 *
 * Animation (GSAP ScrollTrigger, scrub):
 *   Phase 1 — body outline draws itself (strokeDashoffset)
 *   Phase 2 — joint nodes appear sequentially
 *   Phase 3 — sensor data lines extend outward
 *   Phase 4 — waveforms draw in
 *   Phase 5 — label + grid appear
 *   Idle     — very subtle node pulse (repeat -1, slow, imperceptible)
 *
 * Fully cleaned up on unmount. Respects prefers-reduced-motion.
 */
export default function ResearchViz({ sectionRef }) {
  const containerRef = useRef(null);
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current || !sectionRef?.current) return;

    const svg = svgRef.current;

    // ── Gather elements by class ────────────────────────────────────────────
    const bodyPaths  = svg.querySelectorAll('.rv-body');
    const jointNodes = svg.querySelectorAll('.rv-joint');
    const dataLines  = svg.querySelectorAll('.rv-data-line');
    const waves      = svg.querySelectorAll('.rv-wave');
    const particles  = svg.querySelectorAll('.rv-particle');
    const gridLines  = svg.querySelectorAll('.rv-grid');
    const labelGroup = svg.querySelector('.rv-label');

    // ── Reduced motion: show static version, no GSAP ───────────────────────
    if (prefersReducedMotion()) {
      gsap.set([bodyPaths, jointNodes, dataLines, waves, gridLines, labelGroup], {
        opacity: 1,
        strokeDashoffset: 0,
      });
      gsap.set(particles, { opacity: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      // ── Initial hidden state ──────────────────────────────────────────────
      gsap.set(bodyPaths,  { strokeDashoffset: 900, opacity: 0 });
      gsap.set(jointNodes, { scale: 0, opacity: 0, transformOrigin: 'center center' });
      gsap.set(dataLines,  { strokeDashoffset: 160, opacity: 0 });
      gsap.set(waves,      { strokeDashoffset: 520, opacity: 0 });
      gsap.set(gridLines,  { opacity: 0 });
      gsap.set(particles,  { opacity: 0 });
      if (labelGroup) gsap.set(labelGroup, { opacity: 0, y: 6 });

      // ── Scroll-scrubbed main timeline ─────────────────────────────────────
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%',
          end: 'bottom 25%',
          scrub: 1.2,
        },
      });

      // Phase 1 (0 → 0.30): body outline draws itself
      tl.to(bodyPaths, {
        strokeDashoffset: 0,
        opacity: 1,
        stagger: 0.025,
        duration: 0.30,
        ease: 'power2.inOut',
      }, 0);

      // Phase 2 (0.20 → 0.45): joint nodes appear
      tl.to(jointNodes, {
        scale: 1,
        opacity: 1,
        stagger: 0.022,
        duration: 0.18,
        ease: 'back.out(1.8)',
      }, 0.22);

      // Phase 3 (0.35 → 0.60): data channel lines extend
      tl.to(dataLines, {
        strokeDashoffset: 0,
        opacity: 1,
        stagger: 0.03,
        duration: 0.20,
        ease: 'power1.inOut',
      }, 0.36);

      // Phase 4 (0.50 → 0.82): waveforms draw in
      tl.to(waves, {
        strokeDashoffset: 0,
        opacity: 0.7,
        stagger: 0.05,
        duration: 0.28,
        ease: 'power1.inOut',
      }, 0.50);

      // Phase 5 (0.72 → 0.88): grid + label appear
      tl.to(gridLines, {
        opacity: 0.12,
        duration: 0.12,
        ease: 'power2.out',
      }, 0.72);

      if (labelGroup) {
        tl.to(labelGroup, {
          opacity: 1,
          y: 0,
          duration: 0.14,
          ease: 'power2.out',
        }, 0.82);
      }

      // ── Very subtle idle pulse (after scroll animation mostly complete) ──
      // Only nodes 0, 4, 8 (head, wrist, knee — imperceptible)
      const pulseNodes = [jointNodes[0], jointNodes[4], jointNodes[8]].filter(Boolean);
      if (pulseNodes.length) {
        gsap.to(pulseNodes, {
          scale: 1.4,
          opacity: 0.6,
          duration: 2.8,
          yoyo: true,
          repeat: -1,
          stagger: { each: 0.9 },
          ease: 'sine.inOut',
          delay: 1.5,
        });
      }

      // ── Particles travel along data channels ──────────────────────────
      particles.forEach((dot, i) => {
        const pathId = `rv-channel-path-${i % 4}`;
        const channelPath = svg.getElementById(pathId);
        if (!channelPath) return;

        const len = channelPath.getTotalLength?.() ?? 80;
        gsap.set(dot, { opacity: 0 });

        gsap.to(dot, {
          opacity: 0.55,
          duration: 0.3,
          delay: 1.8 + i * 0.35,
          ease: 'power1.in',
          onComplete() {
            gsap.to(dot, {
              motionPath: {
                path: channelPath,
                align: channelPath,
                autoRotate: false,
                start: 0,
                end: 1,
              },
              duration: 2.4 + i * 0.4,
              repeat: -1,
              ease: 'power1.inOut',
              delay: i * 0.2,
            });
          },
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, [sectionRef]);

  return (
    <div ref={containerRef} className="research-viz-container" aria-hidden="true">
      <svg
        ref={svgRef}
        className="research-viz-svg"
        viewBox="0 0 340 520"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Human motion gait analysis AI visualization"
      >
        {/* ── BACKGROUND REFERENCE GRID ────────────────────────────────────── */}
        {/* Very faint horizontal measurement references */}
        {[80, 160, 240, 320, 400, 470].map((y, i) => (
          <line
            key={`g-${i}`}
            className="rv-grid"
            x1="10" y1={y} x2="330" y2={y}
            stroke="currentColor" strokeWidth="0.4" strokeOpacity="1"
          />
        ))}
        {/* Vertical center reference */}
        <line
          className="rv-grid"
          x1="155" y1="30" x2="155" y2="490"
          stroke="currentColor" strokeWidth="0.4" strokeOpacity="1"
        />

        {/* ── BODY OUTLINE — ONE ELEGANT MID-STRIDE WALKING FIGURE ───────── */}

        {/* Head */}
        <circle
          className="rv-body"
          cx="155" cy="52" r="19"
          fill="none" stroke="currentColor" strokeWidth="1.4"
          strokeDasharray="120" strokeDashoffset="120"
        />

        {/* Neck — left / right side */}
        <path
          className="rv-body"
          d="M 148,70 C 146,80 145,88 144,96"
          fill="none" stroke="currentColor" strokeWidth="1.2"
          strokeDasharray="30" strokeDashoffset="30"
        />
        <path
          className="rv-body"
          d="M 162,70 C 164,80 165,88 166,96"
          fill="none" stroke="currentColor" strokeWidth="1.2"
          strokeDasharray="30" strokeDashoffset="30"
        />

        {/* Clavicle / shoulders — smooth arc */}
        <path
          className="rv-body"
          d="M 106,104 C 122,96 138,96 155,98 C 172,96 188,98 204,108"
          fill="none" stroke="currentColor" strokeWidth="1.3"
          strokeDasharray="110" strokeDashoffset="110"
        />

        {/* LEFT ARM — slightly forward swing */}
        {/* Upper arm */}
        <path
          className="rv-body"
          d="M 108,106 C 98,128 88,152 82,172"
          fill="none" stroke="currentColor" strokeWidth="1.2"
          strokeDasharray="80" strokeDashoffset="80"
        />
        {/* Forearm */}
        <path
          className="rv-body"
          d="M 82,172 C 76,192 72,210 70,228"
          fill="none" stroke="currentColor" strokeWidth="1.1"
          strokeDasharray="62" strokeDashoffset="62"
        />

        {/* RIGHT ARM — slightly back */}
        {/* Upper arm */}
        <path
          className="rv-body"
          d="M 202,110 C 214,132 224,155 230,174"
          fill="none" stroke="currentColor" strokeWidth="1.2"
          strokeDasharray="80" strokeDashoffset="80"
        />
        {/* Forearm */}
        <path
          className="rv-body"
          d="M 230,174 C 236,194 240,212 242,230"
          fill="none" stroke="currentColor" strokeWidth="1.1"
          strokeDasharray="62" strokeDashoffset="62"
        />

        {/* TORSO — rib cage suggestion (twin curves) */}
        <path
          className="rv-body"
          d="M 110,110 C 104,138 106,168 114,196 C 118,208 126,216 138,220"
          fill="none" stroke="currentColor" strokeWidth="1.1"
          strokeDasharray="130" strokeDashoffset="130"
        />
        <path
          className="rv-body"
          d="M 200,114 C 206,142 204,172 196,200 C 192,212 184,218 172,222"
          fill="none" stroke="currentColor" strokeWidth="1.1"
          strokeDasharray="130" strokeDashoffset="130"
        />

        {/* SPINE */}
        <path
          className="rv-body"
          d="M 155,96 C 154,140 153,180 154,222"
          fill="none" stroke="currentColor" strokeWidth="0.9"
          strokeLinecap="round"
          strokeDasharray="130" strokeDashoffset="130"
        />

        {/* PELVIS / HIP arc */}
        <path
          className="rv-body"
          d="M 126,224 C 136,234 146,238 155,239 C 164,238 174,234 184,224"
          fill="none" stroke="currentColor" strokeWidth="1.2"
          strokeDasharray="80" strokeDashoffset="80"
        />

        {/* LEFT LEG — forward stride */}
        {/* Left thigh */}
        <path
          className="rv-body"
          d="M 132,238 C 124,272 116,306 110,336"
          fill="none" stroke="currentColor" strokeWidth="1.3"
          strokeDasharray="110" strokeDashoffset="110"
        />
        {/* Left shin */}
        <path
          className="rv-body"
          d="M 110,336 C 104,366 100,394 98,420"
          fill="none" stroke="currentColor" strokeWidth="1.2"
          strokeDasharray="100" strokeDashoffset="100"
        />
        {/* Left foot */}
        <path
          className="rv-body"
          d="M 96,420 C 88,432 76,436 64,434 C 56,432 52,428 52,424"
          fill="none" stroke="currentColor" strokeWidth="1.1"
          strokeDasharray="60" strokeDashoffset="60"
        />

        {/* RIGHT LEG — push-off stance */}
        {/* Right thigh */}
        <path
          className="rv-body"
          d="M 178,238 C 186,272 194,306 200,334"
          fill="none" stroke="currentColor" strokeWidth="1.3"
          strokeDasharray="110" strokeDashoffset="110"
        />
        {/* Right shin */}
        <path
          className="rv-body"
          d="M 200,334 C 206,364 210,392 214,418"
          fill="none" stroke="currentColor" strokeWidth="1.2"
          strokeDasharray="100" strokeDashoffset="100"
        />
        {/* Right foot (heel-off, toe-push) */}
        <path
          className="rv-body"
          d="M 216,418 C 222,428 232,434 244,432 C 252,430 256,426 256,422"
          fill="none" stroke="currentColor" strokeWidth="1.1"
          strokeDasharray="60" strokeDashoffset="60"
        />

        {/* ── JOINT / SENSOR NODES ─────────────────────────────────────────── */}

        {/* 0 — Head center (reference) */}
        <circle className="rv-joint" cx="155" cy="52" r="2.5" fill="currentColor" fillOpacity="0.5" />
        {/* 1 — Neck base */}
        <circle className="rv-joint" cx="155" cy="97" r="2" fill="none" stroke="currentColor" strokeWidth="1.2" />
        {/* 2 — Left shoulder */}
        <circle className="rv-joint" cx="108" cy="105" r="3" fill="none" stroke="currentColor" strokeWidth="1.3" />
        {/* 3 — Right shoulder */}
        <circle className="rv-joint" cx="202" cy="110" r="3" fill="none" stroke="currentColor" strokeWidth="1.3" />
        {/* 4 — Left elbow */}
        <circle className="rv-joint" cx="82" cy="172" r="2.5" fill="currentColor" fillOpacity="0.6" />
        {/* 5 — Right elbow */}
        <circle className="rv-joint" cx="230" cy="174" r="2.5" fill="currentColor" fillOpacity="0.6" />
        {/* 6 — Left wrist */}
        <circle className="rv-joint" cx="70" cy="228" r="2" fill="none" stroke="currentColor" strokeWidth="1.1" />
        {/* 7 — Right wrist */}
        <circle className="rv-joint" cx="242" cy="230" r="2" fill="none" stroke="currentColor" strokeWidth="1.1" />
        {/* 8 — Hip center */}
        <circle className="rv-joint" cx="155" cy="232" r="3" fill="none" stroke="currentColor" strokeWidth="1.3" />
        {/* 9 — Left hip */}
        <circle className="rv-joint" cx="132" cy="240" r="2.5" fill="currentColor" fillOpacity="0.5" />
        {/* 10 — Right hip */}
        <circle className="rv-joint" cx="178" cy="240" r="2.5" fill="currentColor" fillOpacity="0.5" />
        {/* 11 — Left knee */}
        <circle className="rv-joint" cx="110" cy="336" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.3" />
        {/* 12 — Right knee */}
        <circle className="rv-joint" cx="200" cy="334" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.3" />
        {/* 13 — Left ankle */}
        <circle className="rv-joint" cx="98" cy="420" r="2.5" fill="currentColor" fillOpacity="0.55" />
        {/* 14 — Right ankle */}
        <circle className="rv-joint" cx="214" cy="418" r="2.5" fill="currentColor" fillOpacity="0.55" />

        {/* ── SENSOR DATA CHANNEL LINES ────────────────────────────────────── */}
        {/* Invisible paths used as motion paths for particles */}
        <path id="rv-channel-path-0" d="M 108,105 C 65,105 28,105 14,105" fill="none" stroke="none" />
        <path id="rv-channel-path-1" d="M 110,336 C 65,336 28,320 14,310" fill="none" stroke="none" />
        <path id="rv-channel-path-2" d="M 202,110 C 255,110 295,115 325,118" fill="none" stroke="none" />
        <path id="rv-channel-path-3" d="M 200,334 C 255,334 295,330 325,328" fill="none" stroke="none" />

        {/* Visible sensor channel lines */}
        {/* Left shoulder → left edge */}
        <line
          className="rv-data-line"
          x1="108" y1="105" x2="14" y2="105"
          stroke="currentColor" strokeWidth="0.65"
          strokeDasharray="160" strokeDashoffset="160" strokeOpacity="0.45"
        />
        {/* Left knee → left edge */}
        <line
          className="rv-data-line"
          x1="110" y1="336" x2="14" y2="320"
          stroke="currentColor" strokeWidth="0.65"
          strokeDasharray="160" strokeDashoffset="160" strokeOpacity="0.45"
        />
        {/* Right shoulder → right edge */}
        <line
          className="rv-data-line"
          x1="202" y1="110" x2="325" y2="118"
          stroke="currentColor" strokeWidth="0.65"
          strokeDasharray="160" strokeDashoffset="160" strokeOpacity="0.45"
        />
        {/* Right knee → right edge */}
        <line
          className="rv-data-line"
          x1="200" y1="334" x2="325" y2="328"
          stroke="currentColor" strokeWidth="0.65"
          strokeDasharray="160" strokeDashoffset="160" strokeOpacity="0.45"
        />
        {/* Hip center → right edge (CoM trajectory reference) */}
        <line
          className="rv-data-line"
          x1="155" y1="232" x2="325" y2="232"
          stroke="currentColor" strokeWidth="0.55"
          strokeDasharray="5 3" strokeDashoffset="160" strokeOpacity="0.30"
        />

        {/* Head → left edge */}
        <line
          className="rv-data-line"
          x1="136" y1="52" x2="14" y2="52"
          stroke="currentColor" strokeWidth="0.55"
          strokeDasharray="160" strokeDashoffset="160" strokeOpacity="0.30"
        />

        {/* Edge readout ticks */}
        {[
          [14, 52], [14, 105], [14, 320],
          [325, 118], [325, 232], [325, 328],
        ].map(([x, y], i) => (
          <line
            key={`tick-${i}`}
            className="rv-data-line"
            x1={x - 4} y1={y} x2={x + 4} y2={y}
            stroke="currentColor" strokeWidth="1"
            strokeDasharray="10" strokeDashoffset="10" strokeOpacity="0.55"
          />
        ))}

        {/* ── INTEGRATED SIGNAL WAVEFORMS ──────────────────────────────────── */}

        {/* Waveform A — near left wrist (IMU / arm-swing acceleration) */}
        <path
          className="rv-wave"
          d="M 10,228 C 18,220 22,236 30,228 C 38,220 42,236 50,228 C 58,220 62,236 70,228"
          fill="none" stroke="currentColor" strokeWidth="0.85"
          strokeDasharray="520" strokeDashoffset="520" strokeOpacity="0.8"
        />

        {/* Waveform B — near right wrist (contralateral IMU) */}
        <path
          className="rv-wave"
          d="M 242,230 C 252,222 256,238 266,230 C 276,222 280,238 290,230 C 300,222 304,238 314,230 C 320,224 324,236 332,230"
          fill="none" stroke="currentColor" strokeWidth="0.85"
          strokeDasharray="520" strokeDashoffset="520" strokeOpacity="0.8"
        />

        {/* Waveform C — near left ankle (plantar pressure / foot contact) */}
        <path
          className="rv-wave"
          d="M 10,450 C 22,450 26,438 38,450 C 50,462 54,450 66,450 C 78,450 80,440 90,450 C 96,456 100,450 108,450"
          fill="none" stroke="currentColor" strokeWidth="0.85"
          strokeDasharray="520" strokeDashoffset="520" strokeOpacity="0.8"
        />

        {/* Waveform D — near right ankle (plantar pressure) */}
        <path
          className="rv-wave"
          d="M 208,450 C 220,450 224,440 234,450 C 244,460 248,450 258,450 C 268,450 272,440 282,450 C 292,460 296,450 306,450 C 314,444 318,456 326,450"
          fill="none" stroke="currentColor" strokeWidth="0.85"
          strokeDasharray="520" strokeDashoffset="520" strokeOpacity="0.8"
        />

        {/* ── TRAVELLING DATA PARTICLES ────────────────────────────────────── */}
        {[0, 1, 2, 3].map((i) => (
          <circle
            key={`part-${i}`}
            className="rv-particle"
            r="2"
            fill="currentColor"
            fillOpacity="0.55"
          />
        ))}

        {/* ── LABEL ────────────────────────────────────────────────────────── */}
        <g className="rv-label">
          <line x1="30" y1="498" x2="310" y2="498"
            stroke="currentColor" strokeWidth="0.4" strokeOpacity="0.3" />
          <text
            x="170" y="511"
            textAnchor="middle"
            fill="currentColor" fillOpacity="0.35"
            fontSize="7" letterSpacing="0.22em"
            fontFamily="monospace" fontWeight="600"
          >
            HUMAN MOTION ANALYSIS
          </text>
          <text
            x="170" y="522"
            textAnchor="middle"
            fill="currentColor" fillOpacity="0.22"
            fontSize="6" letterSpacing="0.12em"
            fontFamily="monospace"
          >
            WEARABLE IMU · AI GAIT PREDICTION · MULTI-SENSOR FUSION
          </text>
        </g>
      </svg>
    </div>
  );
}
