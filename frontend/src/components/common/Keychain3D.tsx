import React, { useState } from 'react';

export interface Keychain3DProps {
  category: 'Spotify' | 'Instagram' | 'WhatsApp' | 'YouTube' | 'Telegram' | 'X' | 'Portfolio' | 'Website' | 'Facebook' | string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  colorOverride?: string;
  className?: string;
  interactive?: boolean;
  withChain?: boolean;
}

export const Keychain3D: React.FC<Keychain3DProps> = ({
  category,
  size = 'md',
  colorOverride,
  className = '',
  interactive = true,
  withChain = true,
}) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Platform palette matching genuine dual-extrusion PLA 3D prints
  const getTheme = () => {
    switch (category.toLowerCase()) {
      case 'spotify':
        return {
          baseColor: colorOverride || '#009775', // Exact teal green PLA from user's photo
          gradLight: '#18B790',
          gradDark: '#00785c',
          emblemColor: '#FFFFFF',
          shadowGlow: 'rgba(0, 151, 117, 0.45)',
          name: 'Spotify',
        };
      case 'instagram':
        return {
          baseColor: colorOverride || '#F472B6', // Baby pink PLA as in user's photo
          gradLight: '#F9A8D4',
          gradDark: '#DB2777',
          emblemColor: '#FFFFFF',
          shadowGlow: 'rgba(236, 72, 153, 0.45)',
          name: 'Instagram',
        };
      case 'whatsapp':
        return {
          baseColor: colorOverride || '#25D366',
          gradLight: '#4ade80',
          gradDark: '#16a34a',
          emblemColor: '#FFFFFF',
          shadowGlow: 'rgba(37, 211, 102, 0.45)',
          name: 'WhatsApp',
        };
      case 'youtube':
        return {
          baseColor: colorOverride || '#E50914',
          gradLight: '#FF3B30',
          gradDark: '#B91C1C',
          emblemColor: '#FFFFFF',
          shadowGlow: 'rgba(229, 9, 20, 0.45)',
          name: 'YouTube',
        };
      case 'telegram':
        return {
          baseColor: colorOverride || '#2AABEE',
          gradLight: '#60A5FA',
          gradDark: '#1D4ED8',
          emblemColor: '#FFFFFF',
          shadowGlow: 'rgba(42, 171, 238, 0.45)',
          name: 'Telegram',
        };
      case 'x':
      case 'twitter':
        return {
          baseColor: colorOverride || '#18181B',
          gradLight: '#27272A',
          gradDark: '#09090B',
          emblemColor: '#FFFFFF',
          shadowGlow: 'rgba(24, 24, 27, 0.55)',
          name: 'X',
        };
      case 'portfolio':
        return {
          baseColor: colorOverride || '#1E293B',
          gradLight: '#334155',
          gradDark: '#0F172A',
          emblemColor: '#FFFFFF',
          shadowGlow: 'rgba(30, 41, 59, 0.45)',
          name: 'Portfolio',
        };
      case 'website':
        return {
          baseColor: colorOverride || '#2563EB',
          gradLight: '#3B82F6',
          gradDark: '#1D4ED8',
          emblemColor: '#FFFFFF',
          shadowGlow: 'rgba(37, 99, 235, 0.45)',
          name: 'Website',
        };
      case 'facebook':
        return {
          baseColor: colorOverride || '#1877F2',
          gradLight: '#3B82F6',
          gradDark: '#1E40AF',
          emblemColor: '#FFFFFF',
          shadowGlow: 'rgba(24, 119, 242, 0.45)',
          name: 'Facebook',
        };
      default:
        return {
          baseColor: colorOverride || '#0D9488',
          gradLight: '#14B8A6',
          gradDark: '#0F766E',
          emblemColor: '#FFFFFF',
          shadowGlow: 'rgba(13, 148, 136, 0.45)',
          name: 'NFC Tag',
        };
    }
  };

  const theme = getTheme();

  // Size scaling matching exact 108:165 aspect ratio
  const sizeMap = {
    sm: { width: 52, height: 80, scale: 0.5 },
    md: { width: 75, height: 115, scale: 0.72 },
    lg: { width: 105, height: 160, scale: 1.0 },
    xl: { width: 135, height: 206, scale: 1.3 },
    hero: { width: 165, height: 252, scale: 1.55 },
  }[size];

  // Mouse tilt handlers for tactile physical 3D effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
    setTilt({ x, y });
  };

  const handleMouseEnter = () => {
    if (interactive) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setIsHovered(false);
      setTilt({ x: 0, y: 0 });
    }
  };

  // Raised 3D embossed emblems
  const renderEmblem = () => {
    switch (category.toLowerCase()) {
      case 'spotify':
        return (
          <g filter="url(#emboss-shadow)">
            {/* 3 Raised White Soundwave bars */}
            <path
              d="M74 48 C63 41 45 40 33 44 C30 45 28 43 27 40 C26 37 28 35 31 34 C46 29 67 31 80 39 C83 41 84 44 82 47 C80 49 77 50 74 48 Z"
              fill={theme.emblemColor}
            />
            <path
              d="M71 62 C62 56 47 54 36 57 C33 58 31 56 30 53 C29 50 31 48 34 47 C48 43 65 45 76 52 C79 54 80 57 78 60 C76 62 73 63 71 62 Z"
              fill={theme.emblemColor}
            />
            <path
              d="M67 76 C59 71 49 70 39 73 C37 74 34 72 33 69 C32 66 34 64 37 63 C49 60 62 61 71 67 C73 68 74 71 73 74 C71 76 69 77 67 76 Z"
              fill={theme.emblemColor}
            />
          </g>
        );

      case 'instagram':
        return (
          <g filter="url(#emboss-shadow)">
            {/* Camera outer squircle */}
            <rect
              x="30"
              y="32"
              width="48"
              height="48"
              rx="14"
              fill="none"
              stroke={theme.emblemColor}
              strokeWidth="6.5"
              strokeLinecap="round"
            />
            {/* Center lens circle */}
            <circle
              cx="54"
              cy="56"
              r="12.5"
              fill="none"
              stroke={theme.emblemColor}
              strokeWidth="6.5"
            />
            {/* Top-right flash dot */}
            <circle cx="68" cy="42" r="3.5" fill={theme.emblemColor} />
          </g>
        );

      case 'whatsapp':
        return (
          <g filter="url(#emboss-shadow)">
            {/* Speech bubble */}
            <path
              d="M54 32 C41 32 30 42 30 55 C30 60 32 64.5 35 68.5 L32 79 L43 76 C46.5 78 50 79 54 79 C67 79 78 68.5 78 55 C78 42 67 32 54 32 Z"
              fill="none"
              stroke={theme.emblemColor}
              strokeWidth="5.5"
              strokeLinejoin="round"
            />
            {/* Handset */}
            <path
              d="M44 45 C43 45 42 45.5 41.5 46.5 C39.5 49 39.5 53.5 46.5 60.5 C53.5 67.5 58 67 60.5 65 C61.5 64.5 62 63.5 62 62.5 C62 61.5 59.5 60 58 59 C56.5 58 55.5 58.5 54.5 59.5 C53.5 60.5 52.5 60.5 51 59 C49.5 57.5 49.5 56.5 50.5 55.5 C51.5 54.5 52 53.5 51 52 C50 50.5 48.5 48 47.5 48 C46.5 48 45.5 45 44 45 Z"
              fill={theme.emblemColor}
            />
          </g>
        );

      case 'youtube':
        return (
          <g filter="url(#emboss-shadow)">
            {/* YouTube TV container */}
            <rect
              x="28"
              y="38"
              width="52"
              height="38"
              rx="11"
              fill={theme.emblemColor}
            />
            {/* Red play triangle inset */}
            <polygon points="49,47 49,67 64,57" fill={theme.baseColor} />
          </g>
        );

      case 'telegram':
        return (
          <g filter="url(#emboss-shadow)">
            {/* Paper Airplane */}
            <path
              d="M32 55 L74 36 L66 75 L53 62 L45 69 L46.5 58.5 L67.5 42.5 L42.5 56.5 Z"
              fill={theme.emblemColor}
              stroke={theme.emblemColor}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </g>
        );

      case 'x':
      case 'twitter':
        return (
          <g filter="url(#emboss-shadow)">
            {/* The distinct stylized X from user's photo */}
            <path
              d="M36 36 L50 55 L34 76 H41 L53 59 L65 76 H73 L58 54 L72 36 H65 L54 50 L43 36 Z"
              fill={theme.emblemColor}
            />
          </g>
        );

      case 'portfolio':
        return (
          <g filter="url(#emboss-shadow)">
            {/* < / > Developer Brackets */}
            <path
              d="M44 44 L32 56 L44 68"
              fill="none"
              stroke={theme.emblemColor}
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M64 44 L76 56 L64 68"
              fill="none"
              stroke={theme.emblemColor}
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line
              x1="57"
              y1="40"
              x2="51"
              y2="72"
              stroke={theme.emblemColor}
              strokeWidth="5.5"
              strokeLinecap="round"
            />
          </g>
        );

      case 'website':
        return (
          <g filter="url(#emboss-shadow)">
            {/* World Globe */}
            <circle
              cx="54"
              cy="56"
              r="24"
              fill="none"
              stroke={theme.emblemColor}
              strokeWidth="5"
            />
            <ellipse
              cx="54"
              cy="56"
              rx="11"
              ry="24"
              fill="none"
              stroke={theme.emblemColor}
              strokeWidth="5"
            />
            <line
              x1="30"
              y1="56"
              x2="78"
              y2="56"
              stroke={theme.emblemColor}
              strokeWidth="5"
            />
            <line
              x1="35"
              y1="44"
              x2="73"
              y2="44"
              stroke={theme.emblemColor}
              strokeWidth="4"
            />
            <line
              x1="35"
              y1="68"
              x2="73"
              y2="68"
              stroke={theme.emblemColor}
              strokeWidth="4"
            />
          </g>
        );

      case 'facebook':
        return (
          <g filter="url(#emboss-shadow)">
            {/* Lowercase 'f' */}
            <path
              d="M60 76 V54 H67 L68.5 45 H60 V39 C60 36.5 61 35 64.5 35 H68.5 V27 C67.5 26.8 64.2 26.5 60.5 26.5 C52.5 26.5 47.5 31.5 47.5 40.5 V45 H40 V54 H47.5 V76 Z"
              fill={theme.emblemColor}
            />
          </g>
        );

      default:
        return (
          <g filter="url(#emboss-shadow)">
            <circle cx="54" cy="56" r="8" fill={theme.emblemColor} />
            <path
              d="M40 42 A20 20 0 0 1 68 42"
              fill="none"
              stroke={theme.emblemColor}
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M33 35 A30 30 0 0 1 75 35"
              fill="none"
              stroke={theme.emblemColor}
              strokeWidth="5"
              strokeLinecap="round"
            />
          </g>
        );
    }
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative inline-flex flex-col items-center justify-start select-none ${className} ${
        interactive ? 'cursor-pointer' : ''
      }`}
      style={{
        width: sizeMap.width,
        height: sizeMap.height,
        perspective: '800px',
      }}
    >
      <div
        className="w-full h-full flex flex-col items-center transition-transform duration-300 ease-out"
        style={{
          transform: interactive
            ? `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) scale(${isHovered ? 1.05 : 1})`
            : undefined,
          transformStyle: 'preserve-3d',
        }}
      >
        <svg
          viewBox="0 0 108 165"
          className="w-full h-full overflow-visible"
          style={{
            filter: `drop-shadow(0 14px 22px ${theme.shadowGlow}) drop-shadow(0 4px 8px rgba(0,0,0,0.28))`,
          }}
        >
          <defs>
            {/* Metallic key ring linear gradients */}
            <linearGradient id="metal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#94A3B8" />
              <stop offset="25%" stopColor="#E2E8F0" />
              <stop offset="50%" stopColor="#F8FAFC" />
              <stop offset="75%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#64748B" />
            </linearGradient>

            <linearGradient id="chain-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#64748B" />
              <stop offset="40%" stopColor="#F1F5F9" />
              <stop offset="70%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>

            {/* PLA Keychain Body Gradients */}
            <radialGradient id={`pla-face-${category}`} cx="45%" cy="40%" r="65%">
              <stop offset="0%" stopColor={theme.gradLight} />
              <stop offset="70%" stopColor={theme.baseColor} />
              <stop offset="100%" stopColor={theme.gradDark} />
            </radialGradient>

            {/* Dual extrusion 3D layer emboss drop-shadow */}
            <filter id="emboss-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2.2" stdDeviation="1.2" floodColor="#000000" floodOpacity="0.45" />
              <feDropShadow dx="0" dy="0.6" stdDeviation="0.4" floodColor="#FFFFFF" floodOpacity="0.3" />
            </filter>

            {/* Authentic 3D Printer toolpath texture (concentric PLA lines) */}
            <pattern id="pla-texture" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="3" stroke="#FFFFFF" strokeWidth="0.35" opacity="0.18" />
            </pattern>
          </defs>

          {/* ─────────────────────────────────────────────────────────────
              1. SILVER KEYRING & METALLIC CHAIN (Matching User's Photo)
          ───────────────────────────────────────────────────────────── */}
          {withChain && (
            <g id="keychain-hardware">
              {/* Top Split Ring */}
              <circle
                cx="54"
                cy="14"
                r="11"
                fill="none"
                stroke="url(#metal-grad)"
                strokeWidth="2.8"
                filter="drop-shadow(0 2px 2px rgba(0,0,0,0.3))"
              />
              <circle
                cx="54"
                cy="14"
                r="9.6"
                fill="none"
                stroke="#475569"
                strokeWidth="0.5"
                opacity="0.6"
              />
              {/* Split ring coil cut gap */}
              <line x1="57" y1="5" x2="59" y2="3" stroke="#334155" strokeWidth="1.2" />

              {/* Twisted Curb Chain Links */}
              <g id="chain-links" stroke="url(#chain-grad)" fill="none" strokeWidth="2.2">
                {/* Link 1 */}
                <ellipse cx="54" cy="27" rx="3.2" ry="4.5" />
                {/* Link 2 */}
                <ellipse cx="54" cy="34" rx="2.8" ry="4.5" />
                {/* Link 3 */}
                <ellipse cx="54" cy="41" rx="3.2" ry="4.5" />
                {/* Small Jump Ring connecting to the keychain top lug */}
                <circle cx="54" cy="48" r="3.2" strokeWidth="2" stroke="url(#metal-grad)" />
              </g>
            </g>
          )}

          {/* ─────────────────────────────────────────────────────────────
              2. SIGNATURE 45° ROTATED DIAMOND / RHOMBUS BODY
                 (With Integrated Top Corner Lug matching User's Photo)
          ───────────────────────────────────────────────────────────── */}
          <g id="diamond-keychain-body">
            {/* Top Mounting Lug Tab (extruded directly from top corner of the diamond) */}
            <path
              d="M 47 52 C 47 46 61 46 61 52 Z"
              fill={`url(#pla-face-${category})`}
              stroke={theme.gradDark}
              strokeWidth="0.8"
            />
            {/* Small through-hole for jump ring */}
            <circle cx="54" cy="50" r="2.4" fill="#1E293B" opacity="0.85" />
            <circle cx="54" cy="50" r="1.8" fill="#0B1320" />

            {/* Rotated Diamond Tile Body centered at (54, 98) */}
            <g transform="translate(54, 98) rotate(45)">
              {/* Outer PLA chamfer base */}
              <rect
                x="-32"
                y="-32"
                width="64"
                height="64"
                rx="14"
                fill={theme.gradDark}
              />

              {/* Main PLA Face with gradient & bevel border */}
              <rect
                x="-31"
                y="-31"
                width="62"
                height="62"
                rx="13"
                fill={`url(#pla-face-${category})`}
                stroke="rgba(255,255,255,0.28)"
                strokeWidth="1.2"
              />

              {/* Realistic PLA Toolpath Texture overlay */}
              <rect
                x="-30"
                y="-30"
                width="60"
                height="60"
                rx="12"
                fill="url(#pla-texture)"
                opacity="0.85"
              />

              {/* Subtle inner chamfer highlight line */}
              <rect
                x="-28.5"
                y="-28.5"
                width="57"
                height="57"
                rx="10.5"
                fill="none"
                stroke="rgba(255,255,255,0.18)"
                strokeWidth="1"
              />
            </g>

            {/* ─────────────────────────────────────────────────────────
                3. RAISED EMBOSSED DUAL-EXTRUDED LOGO EMBLEM
                   (Rendered upright & centered at x=54, y=98)
            ───────────────────────────────────────────────────────── */}
            <g transform="translate(0, 42)">
              {renderEmblem()}
            </g>

            {/* Subtle Specular Surface Sheen across the diamond */}
            <ellipse
              cx="54"
              cy="80"
              rx="24"
              ry="10"
              fill="rgba(255,255,255,0.12)"
              transform="rotate(-20 54 80)"
              pointerEvents="none"
            />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default Keychain3D;
