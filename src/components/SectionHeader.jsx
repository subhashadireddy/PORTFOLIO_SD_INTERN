import React from 'react';

export default function SectionHeader({
  number,
  eyebrow,
  title,
  subtitle,
  className = ''
}) {
  return (
    <header className={`section-header-block ${className}`} style={{ marginBottom: 'var(--space-xl)' }}>
      <div className="flex items-center gap-xs" style={{ marginBottom: 'var(--space-xs)' }}>
        {number && (
          <span className="font-eyebrow" style={{ color: 'var(--text-muted)' }}>
            {number}
          </span>
        )}
        {number && eyebrow && (
          <span className="font-eyebrow" style={{ color: 'var(--text-muted)' }}>
            /
          </span>
        )}
        {eyebrow && <span className="font-eyebrow">{eyebrow}</span>}
      </div>

      <h2 className="font-section-title">{title}</h2>

      {subtitle && (
        <p
          className="font-subheading"
          style={{
            marginTop: 'var(--space-sm)',
            maxWidth: '48rem',
            color: 'var(--text-secondary)'
          }}
        >
          {subtitle}
        </p>
      )}
    </header>
  );
}
