import React from 'react';
import SectionHeader from '../components/SectionHeader';
import { teachingData } from '../data/teaching';
import '../styles/teaching.css';

/* ─── Subject / Lab grid column ─── */
function WordGrid({ items, label }) {
  return (
    <div>
      <p className="teaching-col-label">{label}</p>
      <ul className="teaching-word-grid" role="list">
        {items.map((item, i) => (
          <li
            key={i}
            className="teaching-word-item"
            data-hoverable="true"
          >
            <span className="teaching-word-index" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─── Project Ledger ─── */
function ProjectLedger({ projects, summary }) {
  // Sort descending by year (already sorted in data, but enforce it)
  const sorted = [...projects].sort((a, b) => Number(b.year) - Number(a.year));

  return (
    <div className="teaching-projects-section reveal-on-scroll">
      <div className="teaching-projects-header">
        <span className="teaching-projects-title">
          Student Projects Guided
        </span>
        <span className="teaching-projects-summary">
          Sorted by year — most recent first
        </span>
      </div>

      <div
        className="teaching-project-list"
        role="table"
        aria-label="Student projects guided"
      >
        {/* Column headers */}
        <div
          className="teaching-project-header-row"
          role="row"
          aria-rowindex={1}
        >
          <span className="teaching-project-col-header" role="columnheader">Year</span>
          <span className="teaching-project-col-header" role="columnheader">Project Title</span>
          <span className="teaching-project-col-header" role="columnheader">Degree</span>
        </div>

        {/* Rows */}
        {sorted.map((proj, i) => (
          <div
            key={i}
            className="teaching-project-row"
            role="row"
            aria-rowindex={i + 2}
            data-hoverable="true"
          >
            <span className="teaching-project-year" role="cell">{proj.year}</span>
            <span className="teaching-project-title" role="cell">{proj.title}</span>
            <span className="teaching-project-degree" role="cell">{proj.degree}</span>
          </div>
        ))}
      </div>

      {/* Guidance summary */}
      <div className="teaching-guidance-note" aria-label="Project guidance summary">
        <div className="teaching-guidance-item">
          <span className="teaching-guidance-value">35</span>
          <span className="teaching-guidance-label">B.Tech Batches Guided</span>
        </div>
        <div className="teaching-guidance-item">
          <span className="teaching-guidance-value">02</span>
          <span className="teaching-guidance-label">M.Tech Theses Supervised</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Section ─── */
export default function Teaching() {
  return (
    <section
      id="teaching"
      className="teaching-section-root"
      aria-label="Teaching and Student Projects"
    >
      <div className="teaching-container">
        {/* Section Header */}
        <SectionHeader
          number="15"
          eyebrow="Pedagogy"
          title="Teaching"
          subtitle={`${teachingData.subjects.length} subjects taught across UG and PG programmes · ${teachingData.labs.length} laboratories handled · 10 years of classroom teaching at Vignan's Institute of Information Technology (A).`}
        />

        {/* Two-column chalkboard grid */}
        <div className="teaching-body reveal-on-scroll">
          <WordGrid
            items={teachingData.subjects}
            label={`Subjects Taught · ${teachingData.subjects.length}`}
          />
          <WordGrid
            items={teachingData.labs}
            label={`Labs Handled · ${teachingData.labs.length}`}
          />
        </div>

        {/* Student project ledger */}
        <ProjectLedger
          projects={teachingData.featuredStudentProjects}
          summary={teachingData.guidanceSummary}
        />
      </div>
    </section>
  );
}
