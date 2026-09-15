import React from 'react';
import SectionHeader from './SectionHeader';

export default function PlaceholderSection({
  id,
  number,
  eyebrow,
  title,
  metaphor,
  itemCount,
  previewData = [],
  variant = 'white'
}) {
  return (
    <div className="placeholder-section-flow">
      <SectionHeader
        number={number}
        eyebrow={eyebrow}
        title={title}
        subtitle={`Design Concept: ${metaphor}`}
      />

      <div className="hairline" style={{ marginBottom: 'var(--space-lg)' }} />

      <div className="editorial-grid">
        <div className="col-span-4 tablet-col-span-8 mobile-col-span-4">
          <div className="flex flex-col gap-xs">
            <span className="font-eyebrow" style={{ color: 'var(--text-muted)' }}>
              Dataset Architecture
            </span>
            <span className="font-stat-number" style={{ fontSize: '2.5rem' }}>
              {itemCount}
            </span>
            <p className="font-body-muted" style={{ marginTop: 'var(--space-xs)' }}>
              Authoritative CV dataset loaded from ESS.pdf. Interactive exhibition interface to be styled in next phase.
            </p>
          </div>
        </div>

        <div className="col-span-8 tablet-col-span-8 mobile-col-span-4">
          <div className="flex flex-col gap-md">
            {previewData && previewData.length > 0 ? (
              previewData.map((item, idx) => (
                <div
                  key={idx}
                  className="placeholder-preview-row"
                  style={{
                    paddingBottom: 'var(--space-sm)',
                    borderBottom: '1px solid var(--line-subtle)'
                  }}
                >
                  <div className="flex items-start justify-between gap-sm">
                    <span className="font-body" style={{ fontWeight: 500 }}>
                      {item.title || item.role || item.degree || item.name || item}
                    </span>
                    {(item.year || item.period || item.date || item.appNo) && (
                      <span className="font-eyebrow" style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                        {item.year || item.period || item.date || item.appNo}
                      </span>
                    )}
                  </div>
                  {(item.institution || item.organization || item.authority || item.details || item.specialization) && (
                    <p className="font-body-muted" style={{ marginTop: 'var(--space-2xs)' }}>
                      {item.institution || item.organization || item.authority || item.details || item.specialization}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="font-body-muted">Section structure ready for editorial presentation.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
