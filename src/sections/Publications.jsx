import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import SectionHeader from '../components/SectionHeader';
import { publicationsData } from '../data/publications';
import '../styles/publications.css';

/* ────────────────────────────────────────────────────────────────────
   Constants
   ──────────────────────────────────────────────────────────────────── */
const PAGE_SIZE = 10;

/* ────────────────────────────────────────────────────────────────────
   Category Tabs
   ──────────────────────────────────────────────────────────────────── */
function CategoryTabs({ active, categories, counts, onSelect }) {
  const tabBarRef  = useRef(null);
  const tabRefs    = useRef([]);
  const indicatorRef = useRef(null);

  const updateIndicator = useCallback(() => {
    const idx = categories.findIndex((c) => c.id === active);
    const btn = tabRefs.current[idx];
    const bar = tabBarRef.current;
    const ind = indicatorRef.current;
    if (!btn || !bar || !ind) return;
    const barRect = bar.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    ind.style.left  = `${btnRect.left - barRect.left}px`;
    ind.style.width = `${btnRect.width}px`;
  }, [active, categories]);

  useEffect(() => {
    // Tiny delay so layout has settled
    const id = requestAnimationFrame(updateIndicator);
    return () => cancelAnimationFrame(id);
  }, [updateIndicator]);

  useEffect(() => {
    const obs = new ResizeObserver(updateIndicator);
    if (tabBarRef.current) obs.observe(tabBarRef.current);
    return () => obs.disconnect();
  }, [updateIndicator]);

  const handleKeyDown = (e, idx) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = (idx + 1) % categories.length;
      onSelect(categories[next].id);
      tabRefs.current[next]?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = (idx - 1 + categories.length) % categories.length;
      onSelect(categories[prev].id);
      tabRefs.current[prev]?.focus();
    }
  };

  return (
    <div
      ref={tabBarRef}
      className="pub-tabs"
      role="tablist"
      aria-label="Filter publications by category"
    >
      {categories.map((cat, idx) => (
        <button
          key={cat.id}
          ref={(el) => (tabRefs.current[idx] = el)}
          type="button"
          role="tab"
          aria-selected={active === cat.id}
          aria-controls="pub-list-region"
          className={`pub-tab-btn${active === cat.id ? ' is-active' : ''}`}
          onClick={() => onSelect(cat.id)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          data-hoverable="true"
        >
          {cat.label}
          <span className="pub-tab-count">({counts[cat.id] ?? 0})</span>
        </button>
      ))}
      <div ref={indicatorRef} className="pub-tab-indicator" aria-hidden="true" />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
   Individual Publication Row
   ──────────────────────────────────────────────────────────────────── */
function PubRow({ pub, showCategory, visible }) {
  const hasDoi = !!pub.doi;
  const doiUrl = hasDoi ? `https://doi.org/${pub.doi}` : null;

  return (
    <article
      className={`pub-row${visible ? ' pub-visible' : ' pub-entering'}`}
      data-hoverable="true"
    >
      <div className="pub-row-body">
        {/* Authors */}
        <p className="pub-authors">{pub.authors}</p>

        {/* Title */}
        <h3 className="pub-title">{pub.title}</h3>

        {/* Journal / venue — italic */}
        <p className="pub-venue">
          {pub.journal}
          {pub.volume && (
            <span className="pub-volume"> · {pub.volume}</span>
          )}
        </p>

        {/* Year + optional category chip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span className="pub-year-tag">{pub.year}</span>
          {showCategory && (
            <span className="pub-category-chip">
              {pub.category === 'sci'        ? 'SCI'
               : pub.category === 'esci'     ? 'ESCI/WoS'
               : pub.category === 'conference' ? 'Conf.'
               : 'UGC'}
            </span>
          )}
        </div>
      </div>

      {/* DOI link arrow */}
      <div className="pub-link-col">
        {doiUrl ? (
          <a
            href={doiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="pub-doi-link"
            aria-label={`DOI: ${pub.doi} — opens in new tab`}
            data-hoverable="true"
          >
            <span>DOI</span>
            <span className="pub-doi-arrow" aria-hidden="true">↗</span>
          </a>
        ) : null}
      </div>
    </article>
  );
}

/* ────────────────────────────────────────────────────────────────────
   Main Section
   ──────────────────────────────────────────────────────────────────── */
export default function Publications() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [query, setQuery]                   = useState('');
  const [visibleCount, setVisibleCount]     = useState(PAGE_SIZE);
  // Track which row indices have already animated in
  const [animatedSet, setAnimatedSet]       = useState(() => new Set());
  const listRef = useRef(null);
  const searchRef = useRef(null);
  const prevFilterKey = useRef('');

  /* ── Filtered + searched dataset ── */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return publicationsData.papers.filter((p) => {
      const catMatch =
        activeCategory === 'all' || p.category === activeCategory;
      if (!q) return catMatch;
      const haystack = [p.title, p.authors, p.journal, String(p.year)]
        .join(' ')
        .toLowerCase();
      return catMatch && haystack.includes(q);
    });
  }, [activeCategory, query]);

  /* ── Category counts ── */
  const counts = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q
      ? publicationsData.papers.filter((p) => {
          const h = [p.title, p.authors, p.journal, String(p.year)]
            .join(' ')
            .toLowerCase();
          return h.includes(q);
        })
      : publicationsData.papers;
    const result = { all: base.length };
    ['sci', 'esci', 'conference', 'ugc'].forEach((cat) => {
      result[cat] = base.filter((p) => p.category === cat).length;
    });
    return result;
  }, [query]);

  /* ── Reset pagination & animations when filter/query changes ── */
  useEffect(() => {
    const key = `${activeCategory}::${query}`;
    if (key !== prevFilterKey.current) {
      prevFilterKey.current = key;
      setVisibleCount(PAGE_SIZE);
      setAnimatedSet(new Set());
    }
  }, [activeCategory, query]);

  /* ── Stagger entrance animation for visible slice ── */
  const visible = filtered.slice(0, visibleCount);

  useEffect(() => {
    // Mark newly added rows as visible with staggered delay
    const newSet = new Set(animatedSet);
    let changed = false;
    visible.forEach((p, i) => {
      if (!newSet.has(p.id)) {
        changed = true;
        setTimeout(() => {
          setAnimatedSet((prev) => {
            const next = new Set(prev);
            next.add(p.id);
            return next;
          });
        }, i * 35); // 35ms stagger — "catalogue printing" feel
      }
    });
    // Suppress lint: we intentionally don't include animatedSet to avoid re-trigger
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible.length, activeCategory, query]);

  /* ── Load More ── */
  const handleLoadMore = () => {
    setVisibleCount((n) => n + PAGE_SIZE);
  };

  const allShown = visibleCount >= filtered.length;

  /* ── Category change resets ── */
  const handleCategorySelect = (id) => {
    setActiveCategory(id);
    setQuery('');
    searchRef.current?.focus();
  };

  return (
    <section
      id="publications"
      className="pub-section-root"
      aria-label="Publications"
    >
      <div className="pub-container">
        {/* Section Header */}
        <SectionHeader
          number="14"
          eyebrow="Scholarly Output"
          title="Publications"
          subtitle="103 research papers across SCI journals, ESCI / Web of Science, international conferences, book chapters, and UGC CARE journals — spanning gait analysis, AI diagnostics, biomedical imaging, IoT, and signal processing."
        />

        {/* ── Controls ── */}
        <div className="pub-controls">
          {/* Search */}
          <div className="pub-search-wrapper">
            <span className="pub-search-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              ref={searchRef}
              type="search"
              id="pub-search"
              className="pub-search-input"
              placeholder="Search by title, author, journal, year…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search publications"
              aria-controls="pub-list-region"
              autoComplete="off"
              spellCheck="false"
            />
            <button
              type="button"
              className={`pub-search-clear${query ? ' is-visible' : ''}`}
              onClick={() => {
                setQuery('');
                searchRef.current?.focus();
              }}
              aria-label="Clear search"
              tabIndex={query ? 0 : -1}
            >
              ✕
            </button>
          </div>

          {/* Category Tabs */}
          <CategoryTabs
            active={activeCategory}
            categories={publicationsData.categories}
            counts={counts}
            onSelect={handleCategorySelect}
          />
        </div>

        {/* ── Results Meta ── */}
        <div className="pub-meta-row" aria-live="polite" aria-atomic="true">
          <span className="pub-result-count">
            {filtered.length === 0
              ? 'No results'
              : `Showing ${Math.min(visibleCount, filtered.length)} of ${filtered.length} publication${filtered.length !== 1 ? 's' : ''}`}
          </span>
        </div>

        {/* ── Publication List ── */}
        <div
          id="pub-list-region"
          ref={listRef}
          className="pub-list"
          role="feed"
          aria-label="Publication list"
          aria-busy={false}
        >
          {filtered.length === 0 ? (
            <p className="pub-empty">
              No publications match your search.{' '}
              <button
                type="button"
                onClick={() => { setQuery(''); setActiveCategory('all'); }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontFamily: 'var(--font-family)',
                  fontSize: '1rem',
                  color: 'var(--text)',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
              >
                Clear filters
              </button>
            </p>
          ) : (
            visible.map((pub) => (
              <PubRow
                key={pub.id}
                pub={pub}
                showCategory={activeCategory === 'all'}
                visible={animatedSet.has(pub.id)}
              />
            ))
          )}
        </div>

        {/* ── Load More ── */}
        {!allShown && filtered.length > 0 && (
          <div className="pub-load-more-wrapper">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <button
                type="button"
                className="pub-load-more-btn"
                onClick={handleLoadMore}
                aria-label={`Load more publications — ${filtered.length - visibleCount} remaining`}
                data-hoverable="true"
              >
                Load More
              </button>
              <p className="pub-load-more-hint">
                {filtered.length - visibleCount} more publication{filtered.length - visibleCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
