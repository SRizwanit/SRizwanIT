import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from './theme';
import {F} from './fonts';

/* ------------------------------------------------------------------ */
/* C1  GridBG — soft paper background, faint teal grid, drifting glow  */
/* ------------------------------------------------------------------ */
// `offset` = absolute start frame of the scene. Using the ABSOLUTE frame keeps the grid in
// exactly the same place when one scene cross-fades into the next (no jump at the cut).
export const GridBG: React.FC<{dark?: boolean; offset?: number}> = ({dark, offset = 0}) => {
  const frame = useCurrentFrame();
  const drift = ((frame + offset) * 0.15) % 80; // slower drift = cleaner video compression
  const line = dark ? 'rgba(255,255,255,0.10)' : 'rgba(15,163,160,0.13)';
  return (
    <div style={{position: 'absolute', inset: 0, background: dark ? C.teal700 : C.paper, overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          inset: -80,
          backgroundImage: `linear-gradient(${line} 2px, transparent 2px), linear-gradient(90deg, ${line} 2px, transparent 2px)`,
          backgroundSize: '80px 80px',
          transform: `translate(${drift}px, ${drift}px)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: -420,
          width: 1700,
          height: 800,
          marginLeft: -850,
          borderRadius: '50%',
          background: `radial-gradient(closest-side, ${dark ? 'rgba(94,234,212,0.35)' : 'rgba(94,234,212,0.30)'}, transparent)`,
        }}
      />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* C2  BlurText — word-by-word blur -> sharp (Reference scene 1 look)  */
/* ------------------------------------------------------------------ */
type BlurTextProps = {
  text: string;
  fontFamily: string;
  fontSize: number;
  color?: string;
  fontWeight?: number;
  start?: number; // frame (relative to the scene)
  stagger?: number; // frames between words
  duration?: number; // frames each word takes
  style?: React.CSSProperties;
};
export const BlurText: React.FC<BlurTextProps> = ({
  text,
  fontFamily,
  fontSize,
  color = C.teal900,
  fontWeight = 700,
  start = 0,
  stagger = 5,
  duration = 20,
  style,
}) => {
  const frame = useCurrentFrame();
  const words = text.split(' ');
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        columnGap: fontSize * 0.28,
        fontFamily,
        fontSize,
        fontWeight,
        color,
        lineHeight: 1.15,
        ...style,
      }}
    >
      {words.map((w, i) => {
        const p = interpolate(frame - start - i * stagger, [0, duration], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.cubic),
        });
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: p,
              filter: `blur(${(1 - p) * 18}px)`,
              transform: `translateY(${(1 - p) * 28}px)`,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* C3  Badge — floating "+ label" glass pill                           */
/* ------------------------------------------------------------------ */
type BadgeProps = {
  text: string;
  fontFamily?: string;
  delay?: number;
  bob?: number; // px amplitude
  style?: React.CSSProperties; // use for position (left/top ...)
  variant?: 'blue' | 'light';
};
export const Badge: React.FC<BadgeProps> = ({
  text,
  fontFamily = F.badge,
  delay = 0,
  bob = 8,
  style,
  variant = 'blue',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, config: {damping: 12, stiffness: 120}});
  const y = Math.sin((frame + delay * 3) / 14) * bob;
  const light = variant === 'light';
  return (
    <div
      style={{
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '16px 28px',
        borderRadius: 999,
        fontFamily,
        fontWeight: 700,
        fontSize: 30,
        color: light ? C.teal900 : C.white,
        background: light ? 'rgba(255,255,255,0.85)' : `linear-gradient(135deg, ${C.teal500}, ${C.teal700})`,
        border: `2px solid ${light ? C.teal300 : 'rgba(255,255,255,0.35)'}`,
        boxShadow: '0 18px 40px rgba(4,48,46,0.25)',
        opacity: Math.min(1, s * 1.5),
        transform: `translateY(${y + (1 - s) * 40}px) scale(${0.6 + 0.4 * s})`,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      <span style={{fontSize: 34, lineHeight: 1}}>+</span>
      {text}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* C4  PhoneMock — rounded phone, image scrolls inside                 */
/* ------------------------------------------------------------------ */
type PhoneProps = {
  src: string;
  width: number;
  height: number;
  imgRatio?: number; // image height / width (720x1370 -> 1.903)
  delay?: number; // pop-in frame
  scrollStart?: number; // frame scroll begins
  scrollDuration?: number;
  tilt?: number; // deg
  style?: React.CSSProperties;
};
export const PhoneMock: React.FC<PhoneProps> = ({
  src,
  width,
  height,
  imgRatio = 1370 / 720,
  delay = 0,
  scrollStart = 20,
  scrollDuration = 120,
  tilt = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, config: {damping: 14, stiffness: 100}});
  const bezel = 14;
  const innerW = width - bezel * 2;
  const innerH = height - bezel * 2;
  const imgH = innerW * imgRatio;
  const maxScroll = Math.max(0, imgH - innerH);
  const p = interpolate(frame - scrollStart, [0, scrollDuration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 54,
        background: '#0b1514',
        padding: bezel,
        boxSizing: 'border-box',
        boxShadow: '0 40px 80px rgba(4,48,46,0.35), 0 0 0 2px rgba(255,255,255,0.12) inset',
        opacity: Math.min(1, s * 1.4),
        transform: `translateY(${(1 - s) * 120}px) rotate(${tilt * s}deg) scale(${0.85 + 0.15 * s})`,
        ...style,
      }}
    >
      <div style={{width: innerW, height: innerH, borderRadius: 42, overflow: 'hidden', position: 'relative', background: '#fff'}}>
        <Img
          src={src}
          style={{
            width: innerW,
            height: imgH,
            display: 'block',
            transform: `translateY(${-maxScroll * p}px)`,
          }}
        />
        <div style={{position: 'absolute', top: 10, left: '50%', width: 90, height: 8, marginLeft: -45, borderRadius: 8, background: 'rgba(4,48,46,0.55)'}} />
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* C5  AppCard — square icon card + caption (Bengali = Anek Bangla)    */
/* ------------------------------------------------------------------ */
type AppCardProps = {
  src: string;
  label: string;
  size?: number;
  delay?: number;
  bob?: number;
  fontFamily?: string;
  highlight?: boolean; // amber ring for the featured app
  labelPad?: number; // extra label width beyond the card (keep < gap between cards)
  style?: React.CSSProperties;
};
export const AppCard: React.FC<AppCardProps> = ({src, label, size = 300, delay = 0, bob = 6, fontFamily = F.bn, highlight = false, labelPad = 90, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, config: {damping: 13, stiffness: 110}});
  const y = Math.sin((frame + delay * 4) / 16) * bob;
  return (
    <div
      style={{
        width: size,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
        opacity: Math.min(1, s * 1.5),
        transform: `translateY(${y + (1 - s) * 90}px) scale(${0.7 + 0.3 * s})`,
        ...style,
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.16,
          overflow: 'hidden',
          background: C.white,
          // same teal ring + soft glow on every icon => mixed icon styles look like one set
          boxShadow: highlight
            ? `0 26px 56px rgba(4,48,46,0.22), 0 0 0 5px ${C.gold}, 0 0 64px rgba(245,184,61,0.55)`
            : '0 26px 56px rgba(4,48,46,0.22), 0 0 0 4px rgba(15,163,160,0.30), 0 0 56px rgba(94,234,212,0.45)',
          border: `3px solid ${C.white}`,
        }}
      >
        <Img src={src} style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} />
      </div>
      <div style={{fontFamily, fontWeight: 700, fontSize: 26, color: C.teal900, textAlign: 'center', lineHeight: 1.25, width: size + labelPad, margin: `0 ${-labelPad / 2}px`}}>
        {label}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* C6  CTA — gold pill button with arrow, gentle pulse                */
/* ------------------------------------------------------------------ */
export const CTA: React.FC<{text: string; delay?: number; fontFamily?: string; style?: React.CSSProperties}> = ({
  text,
  delay = 0,
  fontFamily = F.cta,
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, config: {damping: 11, stiffness: 140}});
  const pulse = 1 + Math.sin((frame - delay) / 9) * 0.02 * s;
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 18,
        padding: '24px 46px',
        borderRadius: 999,
        background: C.gold,
        color: C.teal900,
        fontFamily,
        fontWeight: 700,
        fontSize: 36,
        boxShadow: '0 22px 50px rgba(201,138,18,0.40)',
        opacity: Math.min(1, s * 1.5),
        transform: `scale(${(0.6 + 0.4 * s) * pulse})`,
        ...style,
      }}
    >
      {text}
      <span
        style={{
          width: 46,
          height: 46,
          borderRadius: '50%',
          background: C.teal900,
          color: C.white,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `translateX(${Math.sin(frame / 7) * 3}px)`,
        }}
      >
        {/* vector arrow (SVG) - no font glyph, always crisp at HD and 4K */}
        <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke={C.white} strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12H19" />
          <path d="M13 5.5L19.5 12L13 18.5" />
        </svg>
      </span>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Extras used by D-steps                                              */
/* ------------------------------------------------------------------ */

// Hand-drawn style underline that draws itself (Reference "Video Projects" underline)
export const Squiggle: React.FC<{width: number; color?: string; start?: number; duration?: number; style?: React.CSSProperties}> = ({
  width,
  color = C.teal500,
  start = 0,
  duration = 25,
  style,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - start, [0, duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return (
    <svg width={width} height={28} viewBox="0 0 300 28" style={style}>
      <path
        d="M4 20 C 60 4, 120 4, 150 14 S 250 24, 296 8"
        fill="none"
        stroke={color}
        strokeWidth={6}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - p}
      />
    </svg>
  );
};

// Smiley drawn in SVG, because the render machine may have no emoji font.
export const Smile: React.FC<{size?: number; color?: string}> = ({size = 40, color = C.teal900}) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={{verticalAlign: 'middle'}}>
    <circle cx="20" cy="20" r="17" fill="none" stroke={color} strokeWidth="3" />
    <circle cx="14" cy="16" r="2.4" fill={color} />
    <circle cx="26" cy="16" r="2.4" fill={color} />
    <path d="M12 24 Q20 32 28 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
  </svg>
);

/* ------------------------------------------------------------------ */
/* ColorGrade — one teal grade over the WHOLE video so every scene     */
/* (teal hook/outro + light scenes + photo) feels like the same film.  */
/* ------------------------------------------------------------------ */
export const ColorGrade: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(180deg, ${C.teal500} 0%, ${C.teal700} 100%)`,
        mixBlendMode: 'soft-light',
        opacity: 0.22,
      }}
    />
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 58%, rgba(4,48,46,0.20) 100%)',
      }}
    />
  </AbsoluteFill>
);
