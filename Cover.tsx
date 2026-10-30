import React from 'react';
import {AbsoluteFill, Img, useVideoConfig} from 'remotion';
import {C, FILL_BG, SAFE} from './theme';
import {F} from './fonts';
import {SkillOrbit} from './Components';
import me from './mypicture.jpg';

// STATIC cover / thumbnail (one still image, no animation).
// Works at any size: 16:9 (1920x1080), 9:16 (1080x1920) and 4:5 (1080x1350).
// Upload it as the video thumbnail so Facebook does not pick a random blurry frame.
// Look = the video's intro scene frozen: portrait + skill orbit ring above the head.
export const Cover: React.FC = () => {
  const {width, height} = useVideoConfig();
  const wide = width > height;
  const compact = !wide && height < 1500; // 4:5
  const u = Math.min(width, height) / 1080; // 1.0 for every format (short side = 1080)

  const portrait = (wide ? 560 : compact ? 400 : 560) * u;
  const nameSize = (wide ? 190 : compact ? 150 : 180) * u;
  const lastSize = (wide ? 118 : compact ? 96 : 114) * u;
  const roleSize = (wide ? 58 : compact ? 46 : 54) * u;
  const pillSize = (wide ? 40 : compact ? 32 : 38) * u;
  const orbitIcon = (wide ? 100 : compact ? 76 : 96) * u;
  const orbitRoom = orbitIcon * 0.95; // free space above the photo for the orbit

  // safe area (Reels/Stories/Feed UI never covers the content)
  const safe = wide ? SAFE.wide : compact ? SAFE.feed : SAFE.vertical;

  // orbit geometry (same proportions as the video, centred on the top edge of the photo)
  const ocx = portrait / 2;
  const ocy = -portrait * 0.06;
  const orx = portrait * 0.52;
  const ory = portrait * 0.09;

  const navy = 'rgba(11,31,75,';

  const photo = (
    <div style={{position: 'relative', width: portrait, height: portrait, marginTop: orbitRoom, flex: 'none'}}>
      {/* glow behind the photo */}
      <div
        style={{
          position: 'absolute',
          left: -portrait * 0.14,
          top: -portrait * 0.14,
          width: portrait * 1.28,
          height: portrait * 1.28,
          borderRadius: '50%',
          background: 'radial-gradient(closest-side, rgba(94,234,212,0.75), transparent)',
        }}
      />
      {/* skills orbit — BACK half (behind the photo) */}
      <div style={{position: 'absolute', left: 0, top: 0}}>
        <SkillOrbit cx={ocx} cy={ocy} rx={orx} ry={ory} size={orbitIcon} layer="back" still phase={0.55} />
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: portrait * 0.12,
          overflow: 'hidden',
          background: C.white,
          border: `${10 * u}px solid ${C.teal300}`,
          boxShadow: `0 ${40 * u}px ${90 * u}px ${navy}0.38), 0 0 0 ${22 * u}px rgba(255,255,255,0.28)`,
        }}
      >
        <Img src={me} style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} />
      </div>
      {/* skills orbit — FRONT half (in front, above the head) */}
      <div style={{position: 'absolute', left: 0, top: 0}}>
        <SkillOrbit cx={ocx} cy={ocy} rx={orx} ry={ory} size={orbitIcon} layer="front" still phase={0.55} />
      </div>
    </div>
  );

  const text = (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: wide ? 'flex-start' : 'center'}}>
      {/* highlighted "Introvert" pill */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 14 * u,
          padding: `${8 * u}px ${28 * u}px`,
          borderRadius: 999,
          background: `linear-gradient(135deg, ${C.gold} 0%, #FFD97A 100%)`,
          boxShadow: `0 ${12 * u}px ${28 * u}px ${navy}0.28), 0 0 0 ${4 * u}px ${C.white}`,
          fontFamily: F.badge,
          fontWeight: 700,
          fontSize: pillSize,
          letterSpacing: 2 * u,
          color: C.teal900,
          textTransform: 'uppercase',
        }}
      >
        <span style={{width: 14 * u, height: 14 * u, borderRadius: '50%', background: C.teal900}} />
        Introvert
      </div>
      <div
        style={{
          fontFamily: F.name,
          fontWeight: 900,
          fontSize: nameSize,
          lineHeight: 1.02,
          color: C.white,
          marginTop: 12 * u,
          textShadow: `0 ${8 * u}px 0 ${C.teal700}, 0 ${22 * u}px ${46 * u}px ${navy}0.45)`,
        }}
      >
        Rizwan
      </div>
      <div style={{fontFamily: F.name, fontWeight: 700, fontSize: lastSize, lineHeight: 1.05, color: C.slate, textShadow: `0 ${3 * u}px 0 rgba(255,255,255,0.35)`}}>Chowdhury</div>
      {/* role with a gold highlight bar */}
      <div style={{position: 'relative', marginTop: 20 * u, padding: `0 ${6 * u}px`}}>
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 2 * u, height: roleSize * 0.34, background: C.gold, opacity: 0.85, borderRadius: 8 * u}} />
        <div style={{position: 'relative', fontFamily: F.role, fontWeight: 800, fontSize: roleSize, color: C.slate, whiteSpace: 'nowrap'}}>App &amp; Website Developer</div>
      </div>
    </div>
  );

  return (
    <AbsoluteFill style={{background: FILL_BG}}>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: -420 * u,
          width: 1700 * u,
          height: 800 * u,
          marginLeft: -850 * u,
          borderRadius: '50%',
          background: 'radial-gradient(closest-side, rgba(94,234,212,0.55), transparent)',
        }}
      />
      {/* soft gold light, top corner */}
      <div style={{position: 'absolute', right: -200 * u, top: -240 * u, width: 800 * u, height: 800 * u, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(245,184,61,0.38), transparent)'}} />
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: wide ? 'row' : 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: (wide ? 110 : compact ? 44 : 56) * u,
          paddingTop: safe.top * u * (wide ? 1 : 0.6),
          paddingBottom: safe.bottom * u * (wide ? 1 : 0.6),
        }}
      >
        {photo}
        {text}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
