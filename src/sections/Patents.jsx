import React, { useState, useEffect, useRef, useCallback } from 'react';
import SectionHeader from '../components/SectionHeader';
import { patentsData } from '../data/patents';
import '../styles/patents.css';

/* ─────────────────────────── Tab Config ─────────────────────────── */
const TABS = [
  {
    id: 'design',
    label: 'Design Patents',
    data: patentsData.designPatents,
    countKey: 'designPatents',
  },
  {
    id: 'granted',
    label: 'Granted',
    data: patentsData.patentsGranted,
    countKey: 'patentsGranted',
  },
  {
    id: 'published',
    label: 'Published',
    data: patentsData.patentsPublished,
    countKey: 'patentsPublished',
  },
  {
    id: 'copyrights',
    label: 'Copyrights',
    data: patentsData.copyrightsGranted,
    countKey: 'copyrightsGranted',
  },
];

/* ─────────────────────────── Single Row ─────────────────────────── */
function PatentRow({ item, type }) {
  const isPatent = type !== 'copyrights';
  const appNo = item.appNo || item.regNo || '';
  const inventors = item.inventors || item.inventor || '';
  const grantDate = item.grantDate || '';
  const pubDate = item.pubDate || '';
  const filingDate = item.filingDate || '';
  const authority = item.authority || '';
  const status = item.status || '';

  return (
    <article className="patent-row" data-hoverable="true">
      <div className="patent-row-left">
        <h3 className="patent-title">{item.title}</h3>
        <div className="patent-meta-row">
          {appNo && (
            <span className="patent-meta-tag">
              <span className="patent-meta-key">{isPatent ? 'App.' : 'Reg.'}</span>
              {appNo}
            </span>
          )}
          {inventors && (
            <span className="patent-meta-tag">
              <span className="patent-meta-key">Inventors —</span>
              {inventors}
            </span>
          )}
          {filingDate && (
            <span className="patent-meta-tag">
              <span className="patent-meta-key">Filed</span>
              {filingDate}
            </span>
          )}
          {grantDate && (
            <span className="patent-meta-tag">
              <span className="patent-meta-key">Granted</span>
              {grantDate}
            </span>
          )}
          {pubDate && !grantDate && (
            <span className="patent-meta-tag">
              <span className="patent-meta-key">Published</span>
              {pubDate}
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
        {status && (
          <span className="patent-status-badge">{status}</span>
        )}
        <span className="patent-authority-tag">{authority}</span>
      </div>
    </article>
  );
}

/* ─────────────────────────── Tab Panel ─────────────────────────── */
function PatentPanel({ tabId, items, type, visible }) {
  const panelRef = useRef(null);

  // Animate in when visible changes to true
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    if (visible) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(10px)';
      requestAnimationFrame(() => {
        el.style.transition = 'opacity 320ms cubic-bezier(0.16,1,0.3,1), transform 320ms cubic-bezier(0.16,1,0.3,1)';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      ref={panelRef}
      id={`patents-panel-${tabId}`}
      role="tabpanel"
      aria-label={`${tabId} patents`}
      className="patents-panel"
    >
      <div className="patents-list">
        {items.length === 0 ? (
          <p className="patents-empty">No entries in this category.</p>
        ) : (
          items.map((item, i) => (
            <PatentRow key={i} item={item} type={type} />
          ))
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────── Main Component ─────────────────────────── */
export default function Patents() {
  const [activeTab, setActiveTab] = useState(0);
  const tabBarRef = useRef(null);
  const tabRefs = useRef([]);
  const indicatorRef = useRef(null);

  // Position sliding underline indicator
  const updateIndicator = useCallback((idx) => {
    const btn = tabRefs.current[idx];
    const bar = tabBarRef.current;
    const indicator = indicatorRef.current;
    if (!btn || !bar || !indicator) return;
    const barRect = bar.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    indicator.style.left = `${btnRect.left - barRect.left}px`;
    indicator.style.width = `${btnRect.width}px`;
  }, []);

  useEffect(() => {
    updateIndicator(activeTab);
  }, [activeTab, updateIndicator]);

  // Re-measure on resize
  useEffect(() => {
    const obs = new ResizeObserver(() => updateIndicator(activeTab));
    if (tabBarRef.current) obs.observe(tabBarRef.current);
    return () => obs.disconnect();
  }, [activeTab, updateIndicator]);

  const handleTabClick = (idx) => {
    setActiveTab(idx);
  };

  const handleTabKeyDown = (e, idx) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = (idx + 1) % TABS.length;
      setActiveTab(next);
      tabRefs.current[next]?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = (idx - 1 + TABS.length) % TABS.length;
      setActiveTab(prev);
      tabRefs.current[prev]?.focus();
    }
  };

  return (
    <section id="patents" className="patents-section-root" aria-label="Patents and Copyrights">
      <div className="patents-container">
        {/* Section Header */}
        <SectionHeader
          number="11"
          eyebrow="Intellectual Property"
          title="Patents & Copyrights"
          subtitle={`${patentsData.summary.designPatentsGranted} Design Patents · ${patentsData.summary.patentsGranted} Granted · ${patentsData.summary.patentsPublished} Published · ${patentsData.summary.copyrightsGranted} Copyrights — across India, Australia, South Africa, United Kingdom, Canada.`}
        />

        {/* Segmented Tab Bar */}
        <div
          ref={tabBarRef}
          className="patents-tab-bar"
          role="tablist"
          aria-label="Patent categories"
        >
          {TABS.map((tab, idx) => (
            <button
              key={tab.id}
              ref={(el) => (tabRefs.current[idx] = el)}
              type="button"
              role="tab"
              id={`patents-tab-${tab.id}`}
              aria-selected={activeTab === idx}
              aria-controls={`patents-panel-${tab.id}`}
              className={`patents-tab-btn ${activeTab === idx ? 'is-active' : ''}`}
              onClick={() => handleTabClick(idx)}
              onKeyDown={(e) => handleTabKeyDown(e, idx)}
              data-hoverable="true"
            >
              {tab.label}
              <span className="patents-tab-count">({tab.data.length})</span>
            </button>
          ))}

          {/* Sliding underline */}
          <div ref={indicatorRef} className="patents-tab-indicator" aria-hidden="true" />
        </div>

        {/* Tab Panels */}
        {TABS.map((tab, idx) => (
          <PatentPanel
            key={tab.id}
            tabId={tab.id}
            items={tab.data}
            type={tab.id}
            visible={activeTab === idx}
          />
        ))}
      </div>
    </section>
  );
}
