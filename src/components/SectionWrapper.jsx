import React from 'react';

export default function SectionWrapper({
  id,
  variant = 'white', // 'white', 'subtle', 'warm'
  children,
  className = '',
  containerClassName = ''
}) {
  const bgClass =
    variant === 'subtle'
      ? 'section-subtle'
      : variant === 'warm'
      ? 'section-warm'
      : 'section-white';

  return (
    <section id={id} className={`section ${bgClass} ${className}`}>
      <div className={`container ${containerClassName}`}>
        {children}
      </div>
    </section>
  );
}
