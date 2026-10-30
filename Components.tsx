import React, {createContext, useContext} from 'react';
import {AbsoluteFill, Easing, Img, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, CONTACT} from './theme';
import {F} from './fonts';
import {Glyph, GlyphName} from './Icons';

/* ------------------------------------------------------------------ */
/* CamCtx / Camera — slow cinematic push-in for a whole scene.         */
/* The foreground scales by `push`; GridBG (background layer) reads    */
/* the same value and scales LESS => simple parallax depth.            */
/* ------------------------------------------------------------------ */
const CamCtx = createContext(0); // current push amount (0 = none, 0.035 = +3.5%)
export const Camera: React.FC<{duration: number; push?: number; drift?: number; children: React.ReactNode}> = ({duration, push = 0.035, drift = 0, children}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, duration], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)});
  const cam = push * p;
  return (
    <CamCtx.Provider value={cam}>
      <AbsoluteFill style={{transform: `translateX(${-drift * p}px) scale(${1 + cam})`, transformOrigin: '50% 50%'}}>{children}</AbsoluteFill>
    </CamCtx.Provider>
  );
};

/* ------------------------------------------------------------------ */
/* Particles — soft floating dots (3 depth layers, deterministic).     */
/* Uses the ABSOLUTE frame (offset) so the dots never jump at a cut.   */
/* tone 'dark' = for light paper scenes, 'light' = for teal scenes.    */
/* ------------------------------------------------------------------ */
export const Particles: React.FC<{offset?: number; count?: number; tone?: 'dark' | 'light'; seed?: string}> = ({offset = 0, count = 22, tone = 'dark', seed = 'p'}) => {
  const frame = useCurrentFrame() + offset;
  const palette = tone === 'light' ? ['#FFFFFF', C.teal100, C.teal300, C.gold] : [C.teal300, C.teal500, C.indigoLight, C.gold];
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none'}}>
      {Array.from({length: count}, (_, i) => {
        const depth = 0.4 + random(`${seed}-d-${i}`) * 0.9; // 0.4 (far) .. 1.3 (near)
        const size = 8 + depth * 18;
        const x0 = random(`${seed}-x-${i}`) * 100;
        const y0 = random(`${seed}-y-${i}`) * 120;
        const rise = 0.016 * depth; // % of the height per frame (slow)
        const y = (((y0 - frame * rise) % 120) + 120) % 120 - 10; // wraps -10..110
        const x = x0 + Math.sin((frame + i * 23) / (60 + i * 3)) * 2.2 * depth;
        const tw = 0.55 + 0.45 * Math.sin((frame + i * 17) / 24);
        const col = palette[i % palette.length];
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
              borderRadius: '50%',
              background: `radial-gradient(closest-side, ${col}, transparent)`,
              opacity: (tone === 'light' ? 0.55 : 0.42) * tw * Math.min(1, depth),
            }}
          />
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* C1  GridBG — soft paper background, faint teal grid, drifting glow  */
/* ------------------------------------------------------------------ */
// `offset` = absolute start frame of the scene. Using the ABSOLUTE frame keeps the grid in
// exactly the same place when one scene cross-fades into the next (no jump at the cut).
export const GridBG: React.FC<{dark?: boolean; offset?: number; particles?: boolean}> = ({dark, offset = 0, particles = true}) => {
  const frame = useCurrentFrame();
  const cam = useContext(CamCtx);
  const abs = frame + offset;
  const drift = (abs * 0.15) % 80; // slower drift = cleaner video compression
  const line = dark ? 'rgba(255,255,255,0.10)' : 'rgba(15,163,160,0.13)';
  const bgScale = (1 + cam * 0.4) / (1 + cam); // background pushes in only 40% as much as the foreground (parallax)
  return (
    <div style={{position: 'absolute', inset: 0, background: dark ? C.teal700 : C.paper, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${bgScale})`}}>
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
            opacity: 0.9 + 0.1 * Math.sin(abs / 40),
          }}
        />
        {/* two soft breathing glows (teal top-left, coral top-right) */}
        <div style={{position: 'absolute', left: '-8%', top: '-12%', width: '52%', height: '48%', borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(94,234,212,0.28), transparent)', transform: `translate(${Math.sin(abs / 70) * 40}px, ${Math.cos(abs / 90) * 26}px)`}} />
        <div style={{position: 'absolute', right: '-10%', top: '-8%', width: '44%', height: '40%', borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(255,106,92,0.12), transparent)', transform: `translate(${Math.cos(abs / 80) * 36}px, ${Math.sin(abs / 100) * 24}px)`}} />
        {particles && <Particles offset={offset} tone={dark ? 'light' : 'dark'} />}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* C2  BlurText / AnimText — professional text animations               */
/*  mode: 'blur' (default) | 'chars' | 'mask' | 'flip' | 'zoom' | 'drop' */
/*  shine: a light sweep glides across the finished text (loops)         */
/*  float: letters/words keep gently bobbing after they appear           */
/*  NOTE: 'chars' splits letters, so use it for English only (Bengali    */
/*  conjuncts would break) — Bengali text should use blur/mask/flip.     */
/* ------------------------------------------------------------------ */
export type TextMode = 'blur' | 'chars' | 'mask' | 'flip' | 'zoom' | 'drop';
type BlurTextProps = {
  text: string;
  fontFamily: string;
  fontSize: number;
  color?: string;
  fontWeight?: number;
  start?: number; // frame (relative to the scene)
  stagger?: number; // frames between words (or letters in 'chars' mode)
  duration?: number; // frames each word takes
  mode?: TextMode;
  shine?: boolean;
  float?: number; // px amplitude of the idle bob (0 = off)
  exitAt?: number; // frame (relative to the scene) where the text fades/blurs/slides out (14 frames)
  gradient?: [string, string]; // optional 2-colour gradient fill (text-shadow is replaced by a drop-shadow)
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
  mode = 'blur',
  shine = false,
  float = 0,
  exitAt,
  gradient,
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const units = mode === 'chars' ? Array.from(text) : text.split(' ');
  const gap = mode === 'chars' ? 0 : fontSize * 0.28;
  const total = start + (units.length - 1) * stagger + duration;
  const {textShadow, ...rest} = style ?? {};
  const fancy = shine || !!gradient;
  // shine sweep position (loops every 70 frames, only after the text is fully in)
  const sweep = frame > total ? ((frame - total) % 70) / 70 : -1;
  const fill = gradient ? gradient : [color, color];
  const bg = fancy
    ? `linear-gradient(100deg, ${fill[0]} 0%, ${fill[1]} 100%)`
    : undefined;
  const shineLayer = shine && sweep >= 0
    ? `linear-gradient(105deg, transparent ${sweep * 160 - 40}%, rgba(255,255,255,0.95) ${sweep * 160 - 20}%, transparent ${sweep * 160}%), `
    : '';
  const ex = exitAt === undefined ? 0 : interpolate(frame - exitAt, [0, 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic)});
  const exitStyle: React.CSSProperties = exitAt === undefined ? {} : {opacity: 1 - ex, transform: `translateY(${-ex * 34}px) scale(${1 - ex * 0.04})`};
  const wrapStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    columnGap: gap,
    fontFamily,
    fontSize,
    fontWeight,
    color,
    lineHeight: 1.15,
    ...(fancy
      ? {
          backgroundImage: shineLayer + bg,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          color: 'transparent',
          filter: textShadow ? `drop-shadow(${String(textShadow).split(' ').slice(0, 3).join(' ')} rgba(42,10,30,0.35))` : undefined,
        }
      : {textShadow, ...(ex > 0 ? {filter: `blur(${ex * 10}px)`} : {})}),
    ...exitStyle,
    ...rest,
  };
  return (
    <div style={wrapStyle}>
      {units.map((w, i) => {
        const local = frame - start - i * stagger;
        const p = interpolate(local, [0, duration], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.cubic),
        });
        const sp = spring({frame: local, fps, config: {damping: 11, stiffness: 140, mass: 0.7}});
        const idle = float ? Math.sin((frame + i * 6) / 12) * float * Math.min(1, p) : 0;
        const unit = w === ' ' ? '\u00A0' : w;
        let inner: React.CSSProperties = {};
        let outer: React.CSSProperties = {display: 'inline-block'};
        if (mode === 'blur') {
          inner = {opacity: p, filter: `blur(${(1 - p) * 18}px)`, transform: `translateY(${(1 - p) * 28 + idle}px)`};
        } else if (mode === 'chars') {
          inner = {opacity: Math.min(1, sp * 2), transform: `translateY(${(1 - sp) * 70 + idle}px) rotate(${(1 - sp) * 14}deg) scale(${0.5 + 0.5 * sp})`, filter: `blur(${(1 - p) * 8}px)`};
        } else if (mode === 'mask') {
          outer = {display: 'inline-block', overflow: 'hidden', paddingBottom: fontSize * 0.14, marginBottom: -fontSize * 0.14, paddingTop: fontSize * 0.08, marginTop: -fontSize * 0.08};
          inner = {transform: `translateY(${(1 - p) * 115 + idle}%)`};
        } else if (mode === 'flip') {
          outer = {display: 'inline-block', perspective: 900};
          inner = {opacity: Math.min(1, p * 2), transform: `rotateX(${(1 - sp) * -90}deg) translateY(${idle}px)`, transformOrigin: '50% 100%'};
        } else if (mode === 'zoom') {
          inner = {opacity: p, filter: `blur(${(1 - p) * 14}px)`, transform: `scale(${2.4 - 1.4 * sp + idle * 0.004})`};
        } else if (mode === 'drop') {
          inner = {opacity: Math.min(1, sp * 2), transform: `translateY(${(1 - sp) * -120 + idle}px) scaleY(${0.7 + 0.3 * sp})`};
        }
        return (
          <span key={i} style={outer}>
            <span style={{display: 'inline-block', ...inner}}>{unit}</span>
          </span>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* C2b SkillOrbit — skills circle around the head like a halo          */
/*  Place it INSIDE the same parent as the portrait. Items on the back  */
/*  half of the ring pass BEHIND the portrait (zIndex 1), items on the  */
/*  front half pass in FRONT of it (zIndex 20). Give the portrait       */
/*  wrapper zIndex: 10.                                                 */
/* ------------------------------------------------------------------ */
export const SkillOrbit: React.FC<{
  items: {icon: GlyphName; label: string}[];
  cx: number; // centre of the ring (px, parent coordinates) — put it at the top of the head
  cy: number;
  rx: number; // horizontal radius
  ry: number; // vertical radius (small = flat halo seen from the front)
  chip?: number; // chip size px
  start?: number; // frame the orbit fades in
  speed?: number; // degrees per frame
  showLabel?: boolean;
  ring?: boolean;
}> = ({items, cx, cy, rx, ry, chip = 96, start = 0, speed = 1.5, showLabel = true, ring = true}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const appear = spring({frame: frame - start, fps, config: {damping: 18, stiffness: 70}});
  if (appear <= 0.001) return null;
  const n = items.length;
  // speed curve: starts slow (35%), eases up to full speed over RAMP frames, then stays constant.
  // closed-form integral of  w(t) = speed * (A + (1-A) * smoothstep(t / RAMP))
  const t = Math.max(0, frame - start);
  const A = 0.35;
  const RAMP = 48;
  const u = Math.min(1, t / RAMP);
  const I = t <= RAMP ? RAMP * (u * u * u - (u * u * u * u) / 2) : RAMP / 2 + (t - RAMP);
  const base = speed * (A * t + (1 - A) * I);
  return (
    <>
      {ring && (
        <svg
          width={rx * 2 + 60}
          height={ry * 2 + 60}
          style={{position: 'absolute', left: cx - rx - 30, top: cy - ry - 30, zIndex: 0, opacity: 0.55 * appear, overflow: 'visible'}}
        >
          <ellipse cx={rx + 30} cy={ry + 30} rx={rx * appear} ry={ry * appear} fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth={3} strokeDasharray="4 14" strokeLinecap="round" />
          <ellipse cx={rx + 30} cy={ry + 30} rx={rx * appear} ry={ry * appear} fill="none" stroke={C.teal300} strokeWidth={1.5} opacity={0.6} />
        </svg>
      )}
      {items.map((it, i) => {
        // each chip flies in one after another (from the head centre, rising up) and settles on the orbit
        const e = spring({frame: frame - start - 4 - i * 6, fps, config: {damping: 13, stiffness: 80}});
        if (e <= 0.001) return null;
        const a = ((base + (360 / n) * i) * Math.PI) / 180;
        const x = Math.cos(a) * rx * e;
        const depth = Math.sin(a); // +1 = front (near viewer), -1 = back
        const y = depth * ry * e - (1 - e) * 50;
        const sc = (0.78 + 0.22 * ((depth + 1) / 2)) * (0.45 + 0.55 * Math.min(1, e)); // nearer = bigger
        const op = (0.55 + 0.45 * ((depth + 1) / 2)) * Math.min(1, e * 1.8);
        return (
          <div
            key={it.label}
            style={{
              position: 'absolute',
              left: cx + x - chip / 2,
              top: cy + y - chip / 2,
              width: chip,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              zIndex: depth > 0 ? 20 : 1,
              opacity: op,
              transform: `scale(${sc})`,
              filter: depth > 0 ? undefined : 'blur(0.6px)',
            }}
          >
            <div
              style={{
                width: chip,
                height: chip,
                borderRadius: chip * 0.3,
                background: `linear-gradient(145deg, ${C.white}, ${C.teal100})`,
                border: `3px solid ${C.white}`,
                boxShadow: `0 14px 30px rgba(42,10,30,0.28), 0 0 0 3px rgba(15,163,160,0.35), 0 0 ${depth > 0 ? 34 : 18}px rgba(94,234,212,0.6)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `rotate(${Math.sin(a * 2) * 6}deg)`,
              }}
            >
              <Glyph name={it.icon} size={chip * 0.56} color={C.teal700} stroke={3.2} />
            </div>
            {showLabel && (
              <div style={{fontFamily: F.role, fontWeight: 800, fontSize: chip * 0.26, color: C.slate, whiteSpace: 'nowrap', textShadow: '0 2px 10px rgba(255,255,255,0.9)'}}>
                {it.label}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

/* ------------------------------------------------------------------ */
/* Card3D helpers — gentle 3D tilt, moving shadow and a light sweep.    */
/* Used by AppCard and SkillCard so every card feels like one family.   */
/* ------------------------------------------------------------------ */
const cardTilt = (frame: number, delay: number, s: number) => {
  const ry = Math.sin((frame + delay * 5) / 38) * 7 * s + (1 - s) * -38; // enters turned, then sways
  const rx = Math.cos((frame + delay * 3) / 46) * 4 * s;
  return {ry, rx, transform: `perspective(900px) rotateY(${ry}deg) rotateX(${rx}deg)`, shadowX: -ry * 1.8, shadowY: 26 + rx * 1.5};
};
const CardShine: React.FC<{frame: number; delay: number}> = ({frame, delay}) => {
  const t = frame - delay - 26;
  const x = t < 0 ? -100 : (((t % 110) / 110) * 170) - 35; // sweeps every ~3.7 s
  return (
    <>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(145deg, rgba(255,255,255,0.22), rgba(255,255,255,0) 42%)', pointerEvents: 'none'}} />
      <div style={{position: 'absolute', inset: 0, background: `linear-gradient(110deg, transparent ${x - 16}%, rgba(255,255,255,0.55) ${x}%, transparent ${x + 16}%)`, pointerEvents: 'none'}} />
    </>
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
      {text}
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
  float?: number; // px amplitude of the gentle floating motion (0 = off)
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
  float = 6,
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, config: {damping: 14, stiffness: 100}});
  const fy = Math.sin((frame + delay * 5) / 22) * float * Math.min(1, s); // float up/down
  const sway = Math.sin((frame + delay * 3) / 55) * 3.5 * Math.min(1, s); // slow 3D sway
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
        background: `linear-gradient(160deg, ${C.slateSoft} 0%, ${C.slate} 100%)`,
        padding: bezel,
        boxSizing: 'border-box',
        boxShadow: '0 40px 80px rgba(4,48,46,0.35), 0 0 0 2px rgba(255,255,255,0.18) inset',
        opacity: Math.min(1, s * 1.4),
        transform: `perspective(1400px) translateY(${(1 - s) * 120 + fy}px) rotate(${tilt * s}deg) rotateY(${sway}deg) scale(${0.85 + 0.15 * s})`,
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
  const tl = cardTilt(frame, delay, s);
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
          position: 'relative',
          width: size,
          height: size,
          borderRadius: size * 0.16,
          overflow: 'hidden',
          background: C.white,
          transform: tl.transform,
          // same teal ring + soft glow on every icon => mixed icon styles look like one set (shadow follows the tilt)
          boxShadow: highlight
            ? `${tl.shadowX}px ${tl.shadowY}px 56px rgba(4,48,46,0.22), 0 0 0 5px ${C.gold}, 0 0 64px rgba(245,184,61,0.55)`
            : `${tl.shadowX}px ${tl.shadowY}px 56px rgba(4,48,46,0.22), 0 0 0 4px rgba(15,163,160,0.30), 0 0 56px rgba(94,234,212,0.45)`,
          border: `3px solid ${C.white}`,
        }}
      >
        <Img src={src} style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} />
        <CardShine frame={frame} delay={delay} />
      </div>
      <div style={{fontFamily, fontWeight: 700, fontSize: 26, color: C.slate, textAlign: 'center', lineHeight: 1.25, width: size + labelPad, margin: `0 ${-labelPad / 2}px`}}>
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
  const tl = cardTilt(frame, delay, s);
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
          position: 'relative',
          overflow: 'hidden',
          width: size,
          height: size,
          borderRadius: size * 0.16,
          background: `linear-gradient(145deg, ${C.white} 0%, ${C.teal100} 100%)`,
          transform: tl.transform,
          boxShadow: `${tl.shadowX}px ${tl.shadowY}px 56px rgba(4,48,46,0.22), 0 0 0 4px rgba(15,163,160,0.30), 0 0 56px rgba(94,234,212,0.45)`,
          border: `3px solid ${C.white}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Glyph name={icon} size={size * 0.5} color={C.teal700} stroke={3.2} />
        <CardShine frame={frame} delay={delay} />
      </div>
      <div style={{fontFamily: F.role, fontWeight: 800, fontSize: labelSize, color: C.slate, textAlign: 'center', whiteSpace: 'nowrap', lineHeight: 1.2}}>{label}</div>
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
        const p = interpolate(frame - start - i * 8, [0, 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
        return (
          <div key={c.text + i} style={{display: 'flex', alignItems: 'center', gap: size * 0.4, opacity: p, transform: `translateY(${(1 - p) * 16}px)`}}>
            <div style={{width: size * 1.6, height: size * 1.6, borderRadius: '50%', background: C.slate, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${1 + 0.06 * Math.sin((frame - start - i * 8) / 9) * p})`, boxShadow: `0 0 ${12 + 10 * Math.sin((frame - start) / 9) * p}px rgba(255,106,92,0.55)`}}>
              <Glyph name={c.icon} size={size * 0.95} color={C.white} stroke={3.4} />
            </div>
            <div style={{fontFamily: F.tagline, fontWeight: 800, fontSize: size, color: C.slate}}>{c.text}</div>
          </div>
        );
      })}
    </div>
  );
};
