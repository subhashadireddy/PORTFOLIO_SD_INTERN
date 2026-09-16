import React, { useEffect, useState, useRef } from 'react';
import '../styles/preloader.css';
import { prefersReducedMotion } from '../utils/animations';

const NAME_WORDS = ['Dr.', 'Achanta', 'Sampath', 'Dakshina', 'Murthy'];

export default function Preloader({ onRevealHero }) {
  const [stage, setStage] = useState('entering'); // 'entering' -> 'active' -> 'fading' -> 'wiping' -> 'done'
  const onRevealHeroRef = useRef(onRevealHero);
  onRevealHeroRef.current = onRevealHero;

  useEffect(() => {
    // Accessibility: instantly bypass on reduced-motion preference
    if (prefersReducedMotion()) {
      setStage('done');
      if (onRevealHeroRef.current) onRevealHeroRef.current();
      return;
    }

    // Stage 1: Reveal words upward through mask shortly after mounting
    const tActive = setTimeout(() => {
      setStage('active');
    }, 80);

    // Stage 2: Gently fade out preloader content before the veil lifts
    const tFade = setTimeout(() => {
      setStage('fading');
    }, 2300);

    // Stage 3: Smooth curtain wipe upward with simultaneous soft fade, signal Hero reveal
    const tWipe = setTimeout(() => {
      setStage('wiping');
      if (onRevealHeroRef.current) onRevealHeroRef.current();
    }, 2700);

    // Stage 4: After wipe & fade transitions settle, completely unmount from DOM
    const tDone = setTimeout(() => {
      setStage('done');
    }, 3650);

    return () => {
      clearTimeout(tActive);
      clearTimeout(tFade);
      clearTimeout(tWipe);
      clearTimeout(tDone);
    };
  }, []);

  if (stage === 'done') return null;

  return (
    <aside
      className={`preloader-overlay ${
        stage === 'active' || stage === 'fading' || stage === 'wiping' ? 'is-active' : ''
      } ${stage === 'fading' ? 'is-fading' : ''} ${stage === 'wiping' ? 'is-wiping' : ''}`}
      aria-label="Loading Dr. Achanta Sampath Dakshina Murthy Portfolio"
      aria-live="polite"
    >
      <div className="preloader-content">
        <div className="preloader-eyebrow-wrapper">
          <span className="preloader-eyebrow">
            Academic &amp; Research Portfolio
          </span>
        </div>

        <h1 className="preloader-name-container" aria-label="Dr. Achanta Sampath Dakshina Murthy">
          {NAME_WORDS.map((word, idx) => (
            <span key={idx} className="preloader-word-mask">
              <span className="preloader-word">{word}</span>
            </span>
          ))}
        </h1>

        <div className="preloader-divider-wrapper" aria-hidden="true">
          <div className="preloader-divider-line" />
        </div>
      </div>
    </aside>
  );
}
