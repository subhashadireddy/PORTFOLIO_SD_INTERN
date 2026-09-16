import React, { useState, useMemo } from 'react';
import SectionHeader from '../components/SectionHeader';
import { awardsData } from '../data/awards';
import { Plus } from 'lucide-react';
import '../styles/awards.css';

export default function Awards() {
  const [filter, setFilter] = useState('recent'); // 'recent' | 'all'
  const [openIds, setOpenIds] = useState(() => new Set([1])); // First award open by default for immediate discoverability

  // Toggle single row accordion state
  const toggleAward = (id) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Filter awards: Recent (2024–2025) vs All (2017–2025), sorted recent years first
  const filteredAwards = useMemo(() => {
    if (filter === 'recent') {
      // Recent honors (2023–2025)
      return awardsData.filter((a) => {
        const yr = parseInt(a.year.substring(0, 4), 10);
        return yr >= 2023;
      });
    }
    return awardsData;
  }, [filter]);

  const recentCount = useMemo(() => {
    return awardsData.filter((a) => parseInt(a.year.substring(0, 4), 10) >= 2023).length;
  }, []);

  return (
    <section id="awards" className="awards-section-root" aria-label="Research Awards & Honors">
      <div className="awards-container">
        {/* Header & Filter Controls Bar */}
        <div className="awards-header-bar">
          <SectionHeader
            number="09"
            eyebrow="Recognition &amp; Honors"
            title="Research Awards"
            subtitle="National commendations, institutional research citations, young scientist awards, and academician distinctions."
          />

          {/* Minimalist Filter Tabs (Typography + Animated Underline) */}
          <div className="awards-filter-group reveal-on-scroll" role="tablist" aria-label="Filter awards by period">
            <button
              type="button"
              className={`awards-filter-btn ${filter === 'recent' ? 'is-active' : ''}`}
              onClick={() => setFilter('recent')}
              role="tab"
              aria-selected={filter === 'recent'}
              aria-controls="awards-ledger-list"
              data-hoverable="true"
            >
              <span>Most Recent</span>
              <span className="awards-filter-count">({recentCount})</span>
              <div className="awards-filter-underline" aria-hidden="true" />
            </button>

            <button
              type="button"
              className={`awards-filter-btn ${filter === 'all' ? 'is-active' : ''}`}
              onClick={() => setFilter('all')}
              role="tab"
              aria-selected={filter === 'all'}
              aria-controls="awards-ledger-list"
              data-hoverable="true"
            >
              <span>All Awards</span>
              <span className="awards-filter-count">({awardsData.length})</span>
              <div className="awards-filter-underline" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Accordion Ledger (Rows with hairline separators) */}
        <div id="awards-ledger-list" className="awards-ledger reveal-on-scroll" role="region" aria-label="Awards ledger">
          {filteredAwards.map((award) => {
            const isOpen = openIds.has(award.id);

            return (
              <div
                key={award.id}
                className={`award-row ${isOpen ? 'is-open' : ''}`}
                data-hoverable="true"
              >
                {/* Row Header Button */}
                <button
                  type="button"
                  className="award-row-header"
                  onClick={() => toggleAward(award.id)}
                  aria-expanded={isOpen}
                  aria-controls={`award-desc-${award.id}`}
                  id={`award-header-${award.id}`}
                >
                  <div className="award-row-left">
                    <span className="award-year">{award.year}</span>
                    <span className="award-title-summary">{award.title}</span>
                  </div>

                  {/* Plus icon that rotates 45deg to form an × on expansion */}
                  <div className="award-toggle-icon" aria-hidden="true">
                    <Plus size={18} strokeWidth={2.2} />
                  </div>
                </button>

                {/* Expandable Content Container (Smooth Height Animation via CSS Grid) */}
                <div
                  id={`award-desc-${award.id}`}
                  role="region"
                  aria-labelledby={`award-header-${award.id}`}
                  className="award-details-wrapper"
                >
                  <div className="award-details-inner">
                    <div className="award-details-content">
                      <div className="award-org-venue">
                        <span className="award-organization">{award.organization}</span>
                        {award.venue && <span className="award-venue">{award.venue}</span>}
                      </div>
                      <p className="award-description">{award.description}</p>
                    </div>
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
