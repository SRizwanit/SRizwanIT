import React from 'react';

// ALL icons are plain SVG paths drawn here: no emoji, no icon font, no image files.
// They stay razor-sharp at HD, 4K and in every aspect ratio.
// The five skill icons are simple geometric symbols of our own (not the official logos).
export type GlyphName =
  | 'reactnative'
  | 'flutter'
  | 'kotlin'
  | 'java'
  | 'react'
  | 'mail'
  | 'globe'
  | 'chat'
  | 'mobile'
  | 'code'
  | 'app'
  | 'web'
  | 'ai'
  | 'plus';

export const SKILLS: {icon: GlyphName; label: string}[] = [
  {icon: 'reactnative', label: 'React Native'},
  {icon: 'flutter', label: 'Flutter'},
  {icon: 'kotlin', label: 'Kotlin'},
  {icon: 'java', label: 'Java'},
  {icon: 'react', label: 'React'},
];

type GlyphProps = {name: GlyphName; size?: number; color?: string; stroke?: number};

export const Glyph: React.FC<GlyphProps> = ({name, size = 48, color = 'currentColor', stroke = 3}) => {
  const base = {
    width: size,
    height: size,
    viewBox: '0 0 64 64',
    fill: 'none',
    stroke: color,
    strokeWidth: stroke,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    style: {display: 'block'},
  };

  switch (name) {
    case 'react':
      // atom: three orbits + nucleus
      return (
        <svg {...base}>
          <ellipse cx="32" cy="32" rx="26" ry="10" />
          <ellipse cx="32" cy="32" rx="26" ry="10" transform="rotate(60 32 32)" />
          <ellipse cx="32" cy="32" rx="26" ry="10" transform="rotate(120 32 32)" />
          <circle cx="32" cy="32" r="4.2" fill={color} stroke="none" />
        </svg>
      );
    case 'reactnative':
      // phone outline with a small atom inside
      return (
        <svg {...base}>
          <rect x="14" y="3" width="36" height="58" rx="9" />
          <ellipse cx="32" cy="31" rx="13" ry="5" />
          <ellipse cx="32" cy="31" rx="13" ry="5" transform="rotate(60 32 31)" />
          <ellipse cx="32" cy="31" rx="13" ry="5" transform="rotate(120 32 31)" />
          <circle cx="32" cy="31" r="2.6" fill={color} stroke="none" />
          <path d="M26 54 H38" />
        </svg>
      );
    case 'flutter':
      // two stacked wing blades + base chevron
      return (
        <svg {...base} strokeWidth={stroke * 0.6}>
          <path d="M34 5 H55 L33 27 H12 Z" fill={color} />
          <path d="M23 37 L33 27 H55 L34 48 Z" fill={color} />
          <path d="M34 48 L45 59 H23 Z" fill={color} opacity="0.8" />
        </svg>
      );
    case 'kotlin':
      // square cut by a diagonal "K" notch
      return (
        <svg {...base} strokeWidth={stroke * 0.6}>
          <path d="M8 8 H56 L32 32 L56 56 H8 Z" fill={color} />
        </svg>
      );
    case 'java':
      // steaming cup + saucer
      return (
        <svg {...base} strokeWidth={stroke * 1.1}>
          <path d="M12 30 H44 V40 Q44 54 28 54 Q12 54 12 40 Z" />
          <path d="M44 34 H48 Q56 34 56 41 Q56 48 48 48 H43" />
          <path d="M20 24 C16 20 24 16 20 10" />
          <path d="M30 24 C26 20 34 16 30 10" />
          <path d="M8 59 H48" />
        </svg>
      );
    case 'mail':
      return (
        <svg {...base}>
          <rect x="6" y="14" width="52" height="36" rx="7" />
          <path d="M9 19 L32 38 L55 19" />
        </svg>
      );
    case 'globe':
    case 'web':
      return (
        <svg {...base}>
          <circle cx="32" cy="32" r="25" />
          <ellipse cx="32" cy="32" rx="11" ry="25" />
          <path d="M7 32 H57" />
          <path d="M12 18 Q32 26 52 18" />
          <path d="M12 46 Q32 38 52 46" />
        </svg>
      );
    case 'chat':
      return (
        <svg {...base}>
          <path d="M12 10 H52 Q58 10 58 16 V38 Q58 44 52 44 H30 L18 56 V44 H12 Q6 44 6 38 V16 Q6 10 12 10 Z" />
          <path d="M20 22 H44" />
          <path d="M20 31 H36" />
        </svg>
      );
    case 'mobile':
    case 'app':
      return (
        <svg {...base}>
          <rect x="16" y="4" width="32" height="56" rx="8" />
          <path d="M27 51 H37" />
          <circle cx="32" cy="12" r="1.8" fill={color} stroke="none" />
        </svg>
      );
    case 'code':
      return (
        <svg {...base}>
          <path d="M22 18 L8 32 L22 46" />
          <path d="M42 18 L56 32 L42 46" />
          <path d="M37 12 L27 52" />
        </svg>
      );
    case 'ai':
      // four-point sparkle
      return (
        <svg {...base} strokeWidth={stroke * 0.5}>
          <path d="M32 4 L38 26 L60 32 L38 38 L32 60 L26 38 L4 32 L26 26 Z" fill={color} />
        </svg>
      );
    case 'plus':
    default:
      return (
        <svg {...base} strokeWidth={stroke * 1.4}>
          <path d="M32 12 V52" />
          <path d="M12 32 H52" />
        </svg>
      );
  }
};
