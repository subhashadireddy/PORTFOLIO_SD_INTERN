import React, { useEffect, useRef } from 'react';
import SectionHeader from '../components/SectionHeader';
import { currentRolesData } from '../data/currentRoles';
import { gsap, ScrollTrigger } from '../utils/gsapConfig';
import { prefersReducedMotion } from '../utils/animations';
import '../styles/currentRoles.css';

export default function CurrentRoles() {
  const outerRef = useRef(null);
  const pageRef = useRef(null);
  const rowsRef = useRef([]);

  // Primary 3 roles specifically emphasized in CV Page 2
  const primaryRoles = currentRolesData.slice(0, 3);
  // Complementary institutional portfolios from CV Page 15
  const secondaryRoles = currentRolesData.slice(3);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const pageEl = pageRef.current;
    if (!pageEl) return;

    const ctx = gsap.context(() => {
      // Desktop "Another Page" full-viewport slide-up transition
      if (window.innerWidth > 960) {
        gsap.fromTo(
          pageEl,
          {
            yPercent: 24,
            opacity: 0.7
          },
          {
            yPercent: 0,
            opacity: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: outerRef.current,
              start: 'top 92%',
              end: 'top 20%',
              scrub: 0.6
            }
          }
        );
      } else {
        // Mobile subtle fade & slide
        gsap.fromTo(
          pageEl,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: outerRef.current,
              start: 'top 85%'
            }
          }
        );
      }

      // Stagger reveal on ledger rows
      rowsRef.current.forEach((row) => {
        if (!row) return;
        gsap.fromTo(
          row,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: row,
              start: 'top 88%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });
    }, outerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="current-roles" ref={outerRef} className="current-roles-outer" aria-label="Current Working Roles">
      <div ref={pageRef} className="current-roles-page">
        <div className="current-roles-container">
          {/* Folio Header signifying turning to another publication page */}
          <div className="current-roles-folio-header">
            <span className="current-roles-folio-tag">
              Section 05 &middot; Institutional Governance &amp; Administration
            </span>
            <span className="current-roles-folio-num">
              Folio &mdash; VIIT / VCIS
            </span>
          </div>

          <SectionHeader
            number="05"
            eyebrow="Administrative Leadership"
            title="Current Working Roles"
            subtitle="Executive responsibilities overseeing campus innovation incubation, research administration, and university quality metrics."
          />

          {/* Clean Two-Column Academic Ledger Grid */}
          <div className="current-roles-grid">
            {/* Left Column: Principal Executive Appointments */}
            <div className="current-roles-col">
              <h3 className="current-roles-col-title">
                Executive &amp; Dean Portfolios
              </h3>

              {primaryRoles.map((role, idx) => (
                <div
                  key={role.role}
                  ref={(el) => (rowsRef.current[idx] = el)}
                  className="current-role-row"
                  data-hoverable="true"
                >
                  <div className="current-role-meta">
                    <span className="current-role-period">{role.period}</span>
                    <span className="current-role-scope">{role.scope}</span>
                  </div>

                  <h4 className="current-role-title">{role.role}</h4>
                  <p className="current-role-institution">
                    Vignan&apos;s Institute of Information Technology (A), Duvvada, Visakhapatnam
                  </p>
                  <p className="current-role-desc">{role.highlights}</p>
                </div>
              ))}
            </div>

            {/* Right Column: Institutional Leadership & Quality Frameworks */}
            <div className="current-roles-col">
              <h3 className="current-roles-col-title">
                Institutional Policy &amp; Coordination
              </h3>

              {secondaryRoles.map((role, idx) => (
                <div
                  key={role.role}
                  ref={(el) => (rowsRef.current[primaryRoles.length + idx] = el)}
                  className="current-role-row"
                  data-hoverable="true"
                >
                  <div className="current-role-meta">
                    <span className="current-role-period">{role.period}</span>
                    <span className="current-role-scope">{role.scope}</span>
                  </div>

                  <h4 className="current-role-title">{role.role}</h4>
                  <p className="current-role-institution">
                    Vignan&apos;s Institute of Information Technology (A), Duvvada, Visakhapatnam
                  </p>
                  <p className="current-role-desc">{role.highlights}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
