import React from 'react';
import SectionHeader from '../components/SectionHeader';
import { membershipsData } from '../data/memberships';
import '../styles/memberships.css';

// Reusable Stamp / Seal Card Component
function MembershipSeal({ item, isHexagon = false }) {
  // Hexagon points for 110x110 box: center (55, 55), radius ~48
  // (55, 7), (96, 31), (96, 79), (55, 103), (14, 79), (14, 31)
  const hexPoints = "55,7 96,31 96,79 55,103 14,79 14,31";

  return (
    <div
      className="membership-seal-item"
      tabIndex={0}
      role="article"
      aria-label={`${item.acronym} — ${item.fullName}, ID: ${item.membershipId}`}
      data-hoverable="true"
    >
      {/* Central Stamp Graphic with SVG Stroke-Draw Animation */}
      <div className="membership-seal-graphic" aria-hidden="true">
        <svg
          className="membership-seal-svg"
          viewBox="0 0 110 110"
          xmlns="http://www.w3.org/2000/svg"
        >
          {isHexagon ? (
            <polygon
              className="membership-seal-path"
              points={hexPoints}
            />
          ) : (
            <circle
              className="membership-seal-path"
              cx="55"
              cy="55"
              r="48"
            />
          )}
        </svg>

        {/* Acronym in large tracked-out type */}
        <span className="membership-acronym">{item.acronym}</span>
      </div>

      {/* Meta Information Beneath Seal */}
      <div className="membership-info">
        <h3 className="membership-fullname">{item.fullName}</h3>
        <span className="membership-id-badge">ID: {item.membershipId}</span>
        <span className="membership-type-tag">{item.type}</span>
        {item.branch && <span className="membership-location">{item.branch}</span>}
      </div>
    </div>
  );
}

export default function Memberships() {
  return (
    <section
      id="memberships"
      className="memberships-section-root"
      aria-label="Professional Memberships and Affiliations"
    >
      <div className="memberships-container">
        <SectionHeader
          number="10"
          eyebrow="Global &amp; National Affiliations"
          title="Professional Memberships"
          subtitle="Accredited lifetime fellowships, societies, and professional engineering councils across international and national jurisdictions."
        />

        {/* Group 1: International Professional Bodies */}
        <div className="memberships-group">
          <div className="memberships-group-header">
            <h3 className="memberships-group-title">
              <span>Professional Body — International</span>
            </h3>
            <span className="memberships-group-count">
              {membershipsData.international.length} Affiliations
            </span>
          </div>

          <div className="memberships-grid" role="list">
            {membershipsData.international.map((item, index) => (
              <MembershipSeal
                key={item.id}
                item={item}
                isHexagon={index % 2 === 1} // Alternating subtle hexagonal and circular seal geometry
              />
            ))}
          </div>
        </div>

        {/* Group 2: National Professional Bodies */}
        <div className="memberships-group">
          <div className="memberships-group-header">
            <h3 className="memberships-group-title">
              <span>Professional Body — National</span>
            </h3>
            <span className="memberships-group-count">
              {membershipsData.national.length} Affiliations
            </span>
          </div>

          <div className="memberships-grid" role="list">
            {membershipsData.national.map((item, index) => (
              <MembershipSeal
                key={item.id}
                item={item}
                isHexagon={index % 2 === 0}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
