import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, CONTACT} from './theme';
import {F} from './fonts';
import {Glyph, GlyphName, SKILLS} from './Icons';

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
export type TextVariant = 'blur' | 'rise' | 'pop' | 'letters';
type BlurTextProps = {
  text: string;
  fontFamily: string;
  fontSize: number;
  color?: string;
  fontWeight?: number;
  start?: number; // frame (relative to the scene)
  stagger?: number; // frames between words
  duration?: number; // frames each word takes
  variant?: TextVariant; // 'blur' (default, original look) | 'rise' (masked slide-up, springy) | 'pop' (scale + tilt) | 'letters' (per character; Latin text only)
  shine?: boolean; // light sweep that glides across the text after it appears
  shineColor?: string;
  float?: number; // px amplitude of a gentle endless float after the reveal (0 = off)
  style?: React.CSSProperties;
};
export const BlurText: React.FC<BlurTextProps> = ({
  text,
  fontFamily,
  fontSize,
  color = C.slate,
  fontWeight = 700,
  start = 0,
  stagger = 5,
  duration = 20,
  variant = 'blur',
  shine = false,
  shineColor = 'rgba(255,255,255,0.95)',
  float = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = text.split(' ');
  const letters = variant === 'letters';
  // one "unit" = one word (or, for 'letters', one character). Bengali etc. must NOT be split into letters.
  let unitIndex = 0;
  const unit = (content: string, i: number, wordI: number) => {
    const f = frame - start - i * (letters ? Math.max(1.5, stagger / 3) : stagger);
    const p = interpolate(f, [0, duration], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
    const sp = spring({frame: f, fps, config: {damping: 12, stiffness: 130, mass: 0.7}});
    const bob = float ? Math.sin(frame / 20 + wordI * 0.7) * float * p : 0;
    let st: React.CSSProperties;
    if (variant === 'rise' || letters) {
      st = {opacity: Math.min(1, sp * 2), transform: `translateY(${(1 - sp) * 0.9 * fontSize + bob}px)`, filter: letters ? `blur(${(1 - p) * 8}px)` : undefined};
    } else if (variant === 'pop') {
      st = {opacity: Math.min(1, sp * 2), transform: `translateY(${bob}px) scale(${0.3 + 0.7 * sp}) rotate(${(1 - sp) * -9}deg)`};
    } else {
      st = {opacity: p, filter: `blur(${(1 - p) * 18}px)`, transform: `translateY(${(1 - p) * 28 + bob}px)`};
    }
    // shine: a soft highlight band (overlay copy, so text-shadow / colour of the real text stay untouched)
    const sweep = ((frame - start - 24 - wordI * 4) % 96) / 34; // 0..1 sweeps across, then rests
    const showShine = shine && sweep >= 0 && sweep <= 1 && frame - start > duration + 10;
    return (
      <span key={i} style={{display: 'inline-block', position: 'relative', whiteSpace: 'pre', ...st}}>
        {content}
        {showShine && (
          <span
            aria-hidden
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              color: 'transparent',
              backgroundImage: `linear-gradient(100deg, transparent 35%, ${shineColor} 50%, transparent 65%)`,
              backgroundSize: '300% 100%',
              backgroundPosition: `${100 - sweep * 100}% 0`,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
            }}
          >
            {content}
          </span>
        )}
      </span>
    );
  };
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
      {words.map((w, wi) =>
        letters ? (
          <span key={wi} style={{display: 'inline-flex'}}>
            {Array.from(w).map((ch) => unit(ch, unitIndex++, wi))}
          </span>
        ) : (
          unit(w, wi, wi)
        ),
      )}
    </div>
  );
};

/* TextReveal — wraps ANY single text block (labels, badges, bengali lines ...):
   springy rise + blur-in, then an optional gentle float. Same look in every format. */
export const TextReveal: React.FC<{start?: number; float?: number; from?: 'up' | 'down' | 'left' | 'right'; children: React.ReactNode; style?: React.CSSProperties}> = ({
  start = 0,
  float = 0,
  from = 'up',
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sp = spring({frame: frame - start, fps, config: {damping: 14, stiffness: 120, mass: 0.7}});
  const p = Math.min(1, Math.max(0, sp));
  const d = (1 - sp) * 34;
  const dx = from === 'left' ? -d : from === 'right' ? d : 0;
  const dy = from === 'up' ? d : from === 'down' ? -d : 0;
  const bob = float ? Math.sin((frame - start) / 22) * float * p : 0;
  return (
    <div style={{opacity: Math.min(1, p * 1.6), filter: `blur(${(1 - p) * 10}px)`, transform: `translate(${dx}px, ${dy + bob}px)`, ...style}}>{children}</div>
  );
};

/* ------------------------------------------------------------------ */
/* C3  Badge — floating "icon + label" glass pill (vector icon)                           */
/* ------------------------------------------------------------------ */
type BadgeProps = {
  text: string;
  fontFamily?: string;
  delay?: number;
  bob?: number; // px amplitude
  style?: React.CSSProperties; // use for position (left/top ...)
  variant?: 'blue' | 'light';
  icon?: GlyphName; // vector icon shown before the label (default: plus)
};
export const Badge: React.FC<BadgeProps> = ({
  text,
  fontFamily = F.badge,
  delay = 0,
  bob = 8,
  style,
  variant = 'blue',
  icon = 'plus',
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
        color: light ? C.slate : C.white,
        background: light ? 'rgba(255,255,255,0.85)' : `linear-gradient(135deg, ${C.teal500}, ${C.teal700})`,
        border: `2px solid ${light ? C.teal300 : 'rgba(255,255,255,0.35)'}`,
        boxShadow: '0 18px 40px rgba(4,48,46,0.25)',
        opacity: Math.min(1, s * 1.5),
        transform: `translateY(${y + (1 - s) * 40}px) scale(${0.6 + 0.4 * s})`,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      <Glyph name={icon} size={32} color={light ? C.teal700 : C.white} stroke={3.6} />
      <TextReveal start={delay + 6} from="left">{text}</TextReveal>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* C4  PhoneMock — rounded phone with a real status bar; the screenshot */
/* sits BELOW the status bar so the app header is never covered.        */
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
  statusBg?: string; // status-bar colour = the colour at the top of the screenshot (seamless)
  statusFg?: string; // colour of the status-bar icons
  zoomTo?: number; // optional slow push-in (1 = off) while scrolling, so small text becomes readable
  focusY?: number; // 0..1 of the image height the push-in zooms towards
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
  statusBg = '#FFFFFF',
  statusFg = C.slate,
  zoomTo = 1,
  focusY = 0.5,
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, config: {damping: 14, stiffness: 100}});
  const bezel = 14;
  const innerW = width - bezel * 2;
  const innerH = height - bezel * 2;
  const SB = Math.max(26, Math.round(width * 0.085)); // status-bar height
  const viewH = innerH - SB; // area where the screenshot is visible
  const imgH = innerW * imgRatio;
  const maxScroll = Math.max(0, imgH - viewH);
  const p = interpolate(frame - scrollStart, [0, scrollDuration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const z = 1 + (zoomTo - 1) * p;
  const dot = SB * 0.17;
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 54,
        background: `linear-gradient(160deg, #2C4A6B 0%, ${C.slate} 100%)`,
        padding: bezel,
        boxSizing: 'border-box',
        boxShadow: '0 40px 80px rgba(4,48,46,0.35), 0 0 0 2px rgba(255,255,255,0.18) inset',
        opacity: Math.min(1, s * 1.4),
        transform: `translateY(${(1 - s) * 120}px) rotate(${tilt * s}deg) scale(${0.85 + 0.15 * s})`,
        ...style,
      }}
    >
      <div style={{width: innerW, height: innerH, borderRadius: 40, overflow: 'hidden', position: 'relative', background: statusBg}}>
        {/* status bar (vector): signal - camera dot - battery */}
        <div
          style={{
            position: 'relative',
            height: SB,
            background: statusBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: `0 ${Math.round(SB * 0.95)}px`,
            boxSizing: 'border-box',
          }}
        >
          <svg width={SB * 0.62} height={SB * 0.4} viewBox="0 0 20 13">
            <rect x="0" y="8" width="3.4" height="5" rx="1" fill={statusFg} />
            <rect x="5.4" y="5" width="3.4" height="8" rx="1" fill={statusFg} />
            <rect x="10.8" y="2.5" width="3.4" height="10.5" rx="1" fill={statusFg} />
            <rect x="16.2" y="0" width="3.4" height="13" rx="1" fill={statusFg} />
          </svg>
          <div style={{position: 'absolute', left: '50%', top: '50%', width: dot * 2, height: dot * 2, marginLeft: -dot, marginTop: -dot, borderRadius: '50%', background: statusFg, opacity: 0.8}} />
          <svg width={SB * 0.8} height={SB * 0.4} viewBox="0 0 26 13">
            <rect x="0.8" y="0.8" width="21" height="11.4" rx="3.2" fill="none" stroke={statusFg} strokeWidth="1.5" />
            <rect x="3" y="3" width="14" height="7" rx="1.6" fill={statusFg} />
            <rect x="23.2" y="4" width="2.4" height="5" rx="1.1" fill={statusFg} />
          </svg>
        </div>
        {/* screenshot: scrolls (and slowly pushes in) under the status bar */}
        <div style={{position: 'relative', height: viewH, overflow: 'hidden', background: '#fff'}}>
          <Img
            src={src}
            style={{
              width: innerW,
              height: imgH,
              display: 'block',
              transformOrigin: `50% ${focusY * 100}%`,
              transform: `translateY(${-maxScroll * p}px) scale(${z})`,
            }}
          />
        </div>
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
      <TextReveal start={delay + 8} style={{fontFamily, fontWeight: 700, fontSize: 26, color: C.slate, textAlign: 'center', lineHeight: 1.25, width: size + labelPad, margin: `0 ${-labelPad / 2}px`}}>
        {label}
      </TextReveal>
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
        color: C.slate,
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
          background: C.slate,
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
export const Smile: React.FC<{size?: number; color?: string}> = ({size = 40, color = C.slate}) => (
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

/* ------------------------------------------------------------------ */
/* SkillCard — vector icon tile + name (same look as AppCard)          */
/* ------------------------------------------------------------------ */
export const SkillCard: React.FC<{icon: GlyphName; label: string; size?: number; delay?: number; bob?: number; labelSize?: number}> = ({
  icon,
  label,
  size = 270,
  delay = 0,
  bob = 5,
  labelSize = 34,
}) => {
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
        gap: 18,
        opacity: Math.min(1, s * 1.5),
        transform: `translateY(${y + (1 - s) * 90}px) scale(${0.7 + 0.3 * s})`,
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.16,
          background: `linear-gradient(145deg, ${C.white} 0%, ${C.teal100} 100%)`,
          boxShadow: '0 26px 56px rgba(4,48,46,0.22), 0 0 0 4px rgba(15,163,160,0.30), 0 0 56px rgba(94,234,212,0.45)',
          border: `3px solid ${C.white}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Glyph name={icon} size={size * 0.5} color={C.teal700} stroke={3.2} />
      </div>
      <TextReveal start={delay + 8} style={{fontFamily: F.role, fontWeight: 800, fontSize: labelSize, color: C.slate, textAlign: 'center', whiteSpace: 'nowrap', lineHeight: 1.2}}>{label}</TextReveal>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* SkillOrbit — the 5 skill icons circle (ellipse orbit) above the head */
/* 3D feel: far side = smaller + dimmer + soft blur, near side = bigger + bright.  */
/* Render it TWICE around the portrait so icons pass BEHIND and IN FRONT of the photo:  */
/*   <SkillOrbit {...o} layer="back" />  <Portrait/>  <SkillOrbit {...o} layer="front" />  */
/* Everything is frame-based (no CSS animation) => smooth, deterministic, no jitter.    */
/* ------------------------------------------------------------------ */
export const portraitOrbit = (left: number, top: number, size: number, k = 1) => ({
  cx: left + size / 2,
  cy: top - (size * (k - 1)) / 2 - size * 0.06 * k, // k = current zoom scale of the portrait
  rx: size * 0.52 * k,
  ry: size * 0.09 * k,
});

type OrbitProps = {
  cx: number; // centre x (px)
  cy: number; // centre y (px)
  rx: number; // horizontal radius
  ry: number; // vertical radius (small = flat, "halo" look)
  size?: number; // icon chip size at full depth
  start?: number; // frame (inside the scene) where the pop-in starts
  period?: number; // frames for one full turn (bigger = slower)
  layer?: 'back' | 'front' | 'all';
  ring?: boolean; // faint glow ring along the path
  tilt?: number; // degrees; tiny tilt makes the orbit feel less flat
  still?: boolean; // true = frozen, fully-opened pose (for the static Cover/thumbnail)
  phase?: number; // still only: rotation angle (radians) of the frozen pose
};
export const SkillOrbit: React.FC<OrbitProps> = ({cx, cy, rx, ry, size = 84, start = 0, period = 300, layer = 'all', ring = true, tilt = -4, still = false, phase = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const n = SKILLS.length;
  const f = still ? 9999 : frame - start; // still => skip all pop-in timing (fully open)
  if (f < 0) return null;
  const draw = interpolate(f, [0, 28], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const TAU = Math.PI * 2;
  const want = (depth: number) => layer === 'all' || (layer === 'front' ? depth >= 0 : depth < 0);

  const items: React.ReactNode[] = [];
  SKILLS.forEach((k, i) => {
    const sp = spring({frame: f - i * 5, fps, config: {damping: 12, stiffness: 110, mass: 0.8}});
    const pop = Math.max(0, sp);
    const grow = 0.55 + 0.45 * Math.min(1, pop); // orbit opens up while the icons pop in
    const ang = (i / n) * TAU + (still ? phase : (f / period) * TAU) + (1 - Math.min(1, pop)) * 1.6; // spin-in, then steady loop
    const place = (a: number) => {
      const depth = Math.sin(a); // +1 = nearest (front, lower arc), -1 = farthest (back, upper arc)
      return {x: Math.cos(a) * rx * grow, y: depth * ry * grow, depth, t: (depth + 1) / 2};
    };
    const m = place(ang);
    // glow trail: 4 soft dots behind each icon
    for (let j = 4; j >= 1; j--) {
      const d = place(ang - j * 0.17);
      if (!want(d.depth)) continue;
      const dot = (7 - j) * (0.6 + 0.4 * d.t);
      items.push(
        <div key={`t${i}-${j}`} style={{position: 'absolute', left: d.x - dot / 2, top: d.y - dot / 2, width: dot, height: dot, borderRadius: '50%', background: C.teal300, opacity: Math.min(1, pop) * (0.55 - j * 0.1) * (0.4 + 0.6 * d.t), boxShadow: `0 0 ${10 + j * 2}px rgba(94,234,212,0.9)`}} />,
      );
    }
    if (!want(m.depth)) return;
    const sc = (0.62 + 0.38 * m.t) * (0.3 + 0.7 * pop);
    items.push(
      <div
        key={k.label}
        style={{
          position: 'absolute',
          left: m.x - size / 2,
          top: m.y - size / 2,
          width: size,
          height: size,
          borderRadius: '50%',
          background: `linear-gradient(145deg, ${C.white} 0%, ${C.teal100} 100%)`,
          border: `3px solid ${C.white}`,
          boxShadow: `0 ${10 + 14 * m.t}px ${24 + 18 * m.t}px rgba(4,48,46,${0.14 + 0.14 * m.t}), 0 0 0 3px rgba(15,163,160,${0.18 + 0.2 * m.t}), 0 0 ${20 + 26 * m.t}px rgba(94,234,212,${0.25 + 0.4 * m.t})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: Math.min(1, pop * 1.5) * (0.5 + 0.5 * m.t),
          filter: `blur(${((1 - m.t) * 2.2).toFixed(2)}px)`,
          transform: `scale(${sc})`,
        }}
      >
        <Glyph name={k.icon} size={size * 0.54} color={C.teal700} stroke={3.4} />
      </div>,
    );
  });

  const W = rx * 2 + 40;
  const H = ry * 2 + 40;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 0, height: 0, pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: cx, top: cy, width: 0, height: 0, transform: `rotate(${tilt}deg)`}}>
        {ring && (
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', left: -W / 2, top: -H / 2, overflow: 'visible', filter: 'drop-shadow(0 0 8px rgba(94,234,212,0.8))'}}>
            {(layer === 'all' || layer === 'back') && (
              <ellipse cx={W / 2} cy={H / 2} rx={rx} ry={ry} fill="none" stroke={C.teal300} strokeWidth={3} strokeLinecap="round" pathLength={100} strokeDasharray={`${draw * 100} 100`} opacity={0.4} />
            )}
            {(layer === 'all' || layer === 'front') && (
              <path d={`M ${W / 2 - rx} ${H / 2} A ${rx} ${ry} 0 0 0 ${W / 2 + rx} ${H / 2}`} fill="none" stroke={C.teal300} strokeWidth={4} strokeLinecap="round" pathLength={100} strokeDasharray={`${draw * 100} 100`} opacity={0.85} />
            )}
          </svg>
        )}
        {items}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* ContactRow — icons + text from CONTACT in theme.ts (empty = hidden) */
/* ------------------------------------------------------------------ */
export const ContactRow: React.FC<{start: number; size?: number; direction?: 'row' | 'column'; style?: React.CSSProperties}> = ({
  start,
  size = 34,
  direction = 'column',
  style,
}) => {
  const frame = useCurrentFrame();
  if (CONTACT.length === 0) return null;
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: direction,
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        columnGap: size * 1.4,
        rowGap: size * 0.45,
        ...style,
      }}
    >
      {CONTACT.map((c, i) => {
        const p = interpolate(frame - start - i * 8, [0, 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        return (
          <div key={c.text + i} style={{display: 'flex', alignItems: 'center', gap: size * 0.4, opacity: p, transform: `translateY(${(1 - p) * 16}px)`}}>
            <div style={{width: size * 1.6, height: size * 1.6, borderRadius: '50%', background: C.slate, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Glyph name={c.icon} size={size * 0.95} color={C.white} stroke={3.4} />
            </div>
            <div style={{fontFamily: F.tagline, fontWeight: 800, fontSize: size, color: C.slate}}>{c.text}</div>
          </div>
        );
      })}
    </div>
  );
};
