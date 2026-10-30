import React from 'react';
import {AbsoluteFill, Img, useVideoConfig} from 'remotion';
import {C, FILL_BG} from './theme';
import {F} from './fonts';
import {Glyph, SKILLS} from './Icons';
import me from './mypicture.jpg';

// STATIC cover / thumbnail (one still image, no animation).
// Works at any size: 16:9 (1920x1080), 9:16 (1080x1920) and 4:5 (1080x1350).
// Upload it as the video thumbnail so Facebook does not pick a random blurry frame.
export const Cover: React.FC = () => {
  const {width, height} = useVideoConfig();
  const wide = width > height;
  const compact = !wide && height < 1500; // 4:5
  const u = Math.min(width, height) / 1080; // 1.0 for every format (short side = 1080)
  const portrait = (wide ? 600 : compact ? 400 : 540) * u;
  const nameSize = (compact ? 140 : 170) * u;
  const lastSize = (compact ? 92 : 110) * u;
  const roleSize = (compact ? 46 : 54) * u;
  const chip = (compact ? 84 : 96) * u;
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
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: wide ? 'row' : 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: (wide ? 110 : compact ? 36 : 56) * u,
        }}
      >
        <div
          style={{
            width: portrait,
            height: portrait,
            borderRadius: portrait * 0.12,
            overflow: 'hidden',
            background: C.white,
            border: `${10 * u}px solid ${C.teal300}`,
            boxShadow: `0 ${40 * u}px ${90 * u}px rgba(4,48,46,0.30), 0 0 0 ${22 * u}px rgba(255,255,255,0.28)`,
          }}
        >
          <Img src={me} style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} />
        </div>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <div style={{fontFamily: F.name, fontWeight: 900, fontSize: nameSize, lineHeight: 1.05, color: C.white, textShadow: '0 10px 40px rgba(4,48,46,0.35)'}}>Rizwan</div>
          <div style={{fontFamily: F.name, fontWeight: 700, fontSize: lastSize, lineHeight: 1.05, color: C.teal900}}>Chowdhury</div>
          <div style={{fontFamily: F.role, fontWeight: 800, fontSize: roleSize, color: C.teal900, marginTop: 18 * u}}>App &amp; Website Developer</div>
          <div style={{display: 'flex', gap: 22 * u, marginTop: 34 * u}}>
            {SKILLS.map((k) => (
              <div key={k.label} style={{width: chip, height: chip, borderRadius: chip * 0.3, background: C.white, boxShadow: '0 14px 30px rgba(4,48,46,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Glyph name={k.icon} size={chip * 0.56} color={C.teal700} stroke={3.2} />
              </div>
            ))}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
