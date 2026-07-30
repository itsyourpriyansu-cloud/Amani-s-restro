import React from 'react';

/**
 * Handcrafted SVG vector components for South Indian spices, herbs, aroma lines & motifs.
 * Color token references:
 * - Curry leaf: #3B6032, #4C7C40, #6E9B5F
 * - Chili: #A30F3B, #D62828, #E59E2B
 * - Coriander: #2D4A27, #3B6032
 * - Cardamom: #4C7C40, #E59E2B
 * - Star Anise: #3D1D16, #5A2D22, #D48B16
 * - Cloves: #2B140F, #4A231A
 * - Peppercorn: #1F1513, #3B2A27
 * - Garlic & Onion: #FFFDF9, #F8F0E5, #D4A373
 * - Aroma & Steam: #E59E2B (with soft blur & glow)
 */

export const CurryLeafIcon = ({ className = 'w-8 h-8', style = {} }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <defs>
      <linearGradient id="leafGrad1" x1="12" y1="12" x2="52" y2="52" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#6E9B5F" />
        <stop offset="50%" stopColor="#4C7C40" />
        <stop offset="100%" stopColor="#2A4A20" />
      </linearGradient>
      <linearGradient id="leafGrad2" x1="20" y1="20" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#88B878" />
        <stop offset="100%" stopColor="#3B6032" />
      </linearGradient>
    </defs>
    {/* Main Leaf Body */}
    <path
      d="M12 52C16 38 28 18 52 12C46 32 36 48 12 52Z"
      fill="url(#leafGrad1)"
      stroke="#203517"
      strokeWidth="1.5"
    />
    {/* Secondary overlapping leaf blade */}
    <path
      d="M18 50C24 40 32 26 50 18C42 34 30 46 18 50Z"
      fill="url(#leafGrad2)"
      opacity="0.85"
    />
    {/* Center Vein */}
    <path
      d="M12 52C26 36 38 24 52 12"
      stroke="#A3CF93"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    {/* Side Veins */}
    <path
      d="M24 40C28 36 32 35 34 34M30 32C35 29 40 28 42 27M20 46C24 44 26 43 28 42"
      stroke="#88B878"
      strokeWidth="1"
      strokeLinecap="round"
      opacity="0.7"
    />
  </svg>
);

export const RedChiliIcon = ({ className = 'w-8 h-8', style = {} }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <defs>
      <linearGradient id="chiliGrad" x1="16" y1="8" x2="48" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#E63946" />
        <stop offset="40%" stopColor="#C1121F" />
        <stop offset="100%" stopColor="#780016" />
      </linearGradient>
      <linearGradient id="stemGrad" x1="12" y1="6" x2="24" y2="18" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#6E9B5F" />
        <stop offset="100%" stopColor="#2A4A20" />
      </linearGradient>
    </defs>
    {/* Stem */}
    <path
      d="M14 8C16 10 18 13 22 15C20 18 17 19 14 17C12 15 12 11 14 8Z"
      fill="url(#stemGrad)"
    />
    {/* Curved Chili Body */}
    <path
      d="M20 16C26 16 38 20 46 28C54 36 54 48 48 54C42 60 30 54 28 44C26 34 22 24 20 16Z"
      fill="url(#chiliGrad)"
    />
    {/* Highlight Specular */}
    <path
      d="M23 19C28 20 37 25 43 32C46 35 47 41 45 46"
      stroke="#FFA3A8"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.6"
    />
  </svg>
);

export const CorianderIcon = ({ className = 'w-8 h-8', style = {} }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <defs>
      <linearGradient id="corianderGrad" x1="16" y1="12" x2="48" y2="52" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#88C070" />
        <stop offset="100%" stopColor="#2E5023" />
      </linearGradient>
    </defs>
    <path
      d="M32 54C32 40 32 30 32 16M32 38C26 32 18 28 12 30C10 38 18 42 26 40M32 32C38 24 46 20 52 24C54 32 46 38 38 36M32 20C28 14 22 10 18 12C18 18 24 22 28 22"
      stroke="url(#corianderGrad)"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="30" r="3" fill="#88C070" />
    <circle cx="52" cy="24" r="3" fill="#88C070" />
    <circle cx="18" cy="12" r="2.5" fill="#88C070" />
  </svg>
);

export const CardamomIcon = ({ className = 'w-8 h-8', style = {} }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <defs>
      <linearGradient id="cardamomGrad" x1="18" y1="12" x2="46" y2="52" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#88A050" />
        <stop offset="50%" stopColor="#557030" />
        <stop offset="100%" stopColor="#30451A" />
      </linearGradient>
    </defs>
    {/* Oval Pod Body */}
    <path
      d="M32 10C20 20 16 38 24 48C30 55 42 54 48 44C54 34 46 18 32 10Z"
      fill="url(#cardamomGrad)"
      stroke="#203010"
      strokeWidth="1.5"
    />
    {/* Ribbing lines */}
    <path
      d="M32 10C28 22 28 38 34 50M32 10C35 24 38 36 44 46M32 10C24 20 22 34 26 46"
      stroke="#B0C870"
      strokeWidth="1.2"
      strokeLinecap="round"
      opacity="0.8"
    />
    {/* Tip stem */}
    <path d="M32 6L32 10" stroke="#4A3520" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const StarAniseIcon = ({ className = 'w-8 h-8', style = {} }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <defs>
      <radialGradient id="aniseGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#6E3B29" />
        <stop offset="70%" stopColor="#3A1C12" />
        <stop offset="100%" stopColor="#1C0C07" />
      </radialGradient>
    </defs>
    {/* 8 Star Petals */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
      <g key={angle} transform={`rotate(${angle} 32 32)`}>
        <path
          d="M32 32L26 12C28 8 36 8 38 12L32 32Z"
          fill="url(#aniseGrad)"
          stroke="#52291B"
          strokeWidth="1"
        />
        {/* Seed pod inside tip */}
        <circle cx="32" cy="14" r="2.5" fill="#E59E2B" opacity="0.9" />
      </g>
    ))}
    {/* Center hub */}
    <circle cx="32" cy="32" r="6" fill="#4A2316" stroke="#E59E2B" strokeWidth="1" />
  </svg>
);

export const CloveIcon = ({ className = 'w-8 h-8', style = {} }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <defs>
      <linearGradient id="cloveGrad" x1="24" y1="12" x2="40" y2="54" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#5E3023" />
        <stop offset="100%" stopColor="#1E0A05" />
      </linearGradient>
    </defs>
    {/* Lower stem shaft */}
    <path d="M28 28L26 54C26 56 38 56 38 54L36 28Z" fill="url(#cloveGrad)" />
    {/* Upper calyx & rounded head */}
    <circle cx="32" cy="20" r="8" fill="#7E4231" stroke="#3A1A12" strokeWidth="1" />
    <path d="M22 24C26 22 38 22 42 24" stroke="#D48B16" strokeWidth="2" strokeLinecap="round" />
    {/* Small crown points */}
    <path d="M24 16L28 20M40 16L36 20M32 12L32 18" stroke="#D48B16" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const PeppercornIcon = ({ className = 'w-6 h-6', style = {} }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <defs>
      <radialGradient id="pepperGrad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#4A3B37" />
        <stop offset="40%" stopColor="#251A18" />
        <stop offset="100%" stopColor="#0F0908" />
      </radialGradient>
    </defs>
    <circle cx="24" cy="24" r="20" fill="url(#pepperGrad)" stroke="#170F0E" strokeWidth="1.5" />
    {/* Craggy texture dots */}
    <circle cx="18" cy="18" r="2" fill="#705C57" opacity="0.6" />
    <circle cx="28" cy="22" r="1.5" fill="#705C57" opacity="0.5" />
    <circle cx="22" cy="30" r="2.2" fill="#705C57" opacity="0.4" />
    <circle cx="30" cy="16" r="1.2" fill="#A8948F" opacity="0.7" />
  </svg>
);

export const GarlicIcon = ({ className = 'w-8 h-8', style = {} }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <defs>
      <linearGradient id="garlicGrad" x1="16" y1="12" x2="48" y2="52" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFDF9" />
        <stop offset="60%" stopColor="#F4E9D8" />
        <stop offset="100%" stopColor="#D4C5B0" />
      </linearGradient>
    </defs>
    {/* Clove Crescent */}
    <path
      d="M32 10C24 16 16 28 18 42C20 54 36 56 46 46C52 38 48 20 32 10Z"
      fill="url(#garlicGrad)"
      stroke="#B8A894"
      strokeWidth="1.2"
    />
    <path d="M32 10C30 24 34 38 42 48" stroke="#E2D4C0" strokeWidth="1.5" strokeLinecap="round" />
    {/* Root tail */}
    <path d="M30 54L28 58M34 55L35 59" stroke="#8C7A65" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const OnionPetalIcon = ({ className = 'w-8 h-8', style = {} }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <defs>
      <linearGradient id="onionGrad" x1="12" y1="12" x2="52" y2="52" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F9E2EE" />
        <stop offset="50%" stopColor="#C96B93" />
        <stop offset="100%" stopColor="#7E244E" />
      </linearGradient>
    </defs>
    <path
      d="M14 48C12 30 26 14 48 12C46 34 34 50 14 48Z"
      fill="url(#onionGrad)"
      opacity="0.85"
      stroke="#641A3D"
      strokeWidth="1"
    />
    <path d="M18 46C20 34 30 22 46 16" stroke="#F4C2D7" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
  </svg>
);

export const AromaStreamIcon = ({ className = 'w-24 h-48', style = {} }) => (
  <svg
    viewBox="0 0 100 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <defs>
      <linearGradient id="steamGrad" x1="50" y1="200" x2="50" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#E59E2B" stopOpacity="0" />
        <stop offset="40%" stopColor="#E59E2B" stopOpacity="0.4" />
        <stop offset="80%" stopColor="#F4A261" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#FFFDF9" stopOpacity="0" />
      </linearGradient>
    </defs>

    <path
      d="M45 190 C 20 140, 80 110, 50 60 C 30 30, 60 10, 50 0"
      stroke="url(#steamGrad)"
      strokeWidth="6"
      strokeLinecap="round"
    />
    <path
      d="M55 195 C 75 145, 25 115, 55 65 C 70 35, 40 15, 52 2"
      stroke="url(#steamGrad)"
      strokeWidth="3"
      strokeLinecap="round"
      opacity="0.7"
    />
  </svg>
);

export const BrassMotifIcon = ({ className = 'w-32 h-32', style = {} }) => (
  <svg
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <circle cx="60" cy="60" r="54" stroke="#E59E2B" strokeWidth="1" strokeDasharray="4 4" opacity="0.35" />
    <circle cx="60" cy="60" r="42" stroke="#E59E2B" strokeWidth="0.8" opacity="0.25" />
    <circle cx="60" cy="60" r="30" stroke="#E59E2B" strokeWidth="1.2" opacity="0.4" />
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
      <line
        key={deg}
        x1="60"
        y1="60"
        x2={60 + 54 * Math.cos((deg * Math.PI) / 180)}
        y2={60 + 54 * Math.sin((deg * Math.PI) / 180)}
        stroke="#E59E2B"
        strokeWidth="0.6"
        opacity="0.2"
      />
    ))}
  </svg>
);
