import React from 'react';

interface DraftingTriangleIconProps {
  className?: string;
  style?: React.CSSProperties;
}

export const DraftingTriangleIcon: React.FC<DraftingTriangleIconProps> = ({ className, style }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      {/* Top-left crosshair circle */}
      <circle cx="4" cy="4" r="1.2" strokeWidth="1.5" />
      <line x1="1" y1="4" x2="3.2" y2="4" strokeWidth="1.5" />
      <line x1="4.8" y1="4" x2="7" y2="4" strokeWidth="1.5" />
      <line x1="4" y1="1" x2="4" y2="3.2" strokeWidth="1.5" />
      <line x1="4" y1="4.8" x2="4" y2="7" strokeWidth="1.5" />

      {/* Dashed auxiliary guide lines */}
      <line
        x1="8"
        y1="4"
        x2="17.5"
        y2="4"
        strokeWidth="1.5"
        strokeDasharray="2 2"
      />
      <line
        x1="4"
        y1="8"
        x2="4"
        y2="17.5"
        strokeWidth="1.5"
        strokeDasharray="2 2"
      />

      {/* Right-angled set square (drafting triangle) */}
      {/* Outer triangle path */}
      <path d="M 2.5 21.5 L 21.5 21.5 L 21.5 2.5 Z" strokeWidth="1.8" />

      {/* Inner cutout triangle */}
      <path d="M 10 18.5 L 18.5 18.5 L 18.5 10 Z" strokeWidth="1.8" />

      {/* Ruler markings (ticks) along the bottom edge of the triangle */}
      <line x1="5.5" y1="21.5" x2="5.5" y2="19.5" strokeWidth="1.5" />
      <line x1="8.5" y1="21.5" x2="8.5" y2="19.5" strokeWidth="1.5" />
      <line x1="11.5" y1="21.5" x2="11.5" y2="19.5" strokeWidth="1.5" />
      <line x1="14.5" y1="21.5" x2="14.5" y2="19.5" strokeWidth="1.5" />
      <line x1="17.5" y1="21.5" x2="17.5" y2="19.5" strokeWidth="1.5" />
      <line x1="20.5" y1="21.5" x2="20.5" y2="19.5" strokeWidth="1.5" />
    </svg>
  );
};
