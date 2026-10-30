import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FILL_BG, START} from './theme';
import {F} from './fonts';
import {AppCard, Badge, BlurText, CTA, GridBG, PhoneMock, Smile, Squiggle} from './Components';

import me from './mypicture.jpg';
import appS2 from './app-islami-bishwakosh-s2.jpg';
import appBishwakosh from './app-islami-bishwakosh.jpg';
import appShohid from './app-shohidullah.jpg';
import appOsman from './app-osman-goni.jpg';
import appTablig from './app-tablig.jpg';
import appUsila from './app-usila.jpg';
import appTask from './app-rizwantask.png';
import webS2 from './web-islami-bishwakosh-s2.jpg';
import webAI from './web-islamipedia-ai.jpg';
import webTask from './web-rizwantask.jpg';

const fadeIn = (frame: number, start: number, dur = 18) =>
  interpolate(frame - start, [0, dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

/* Portrait card: the cartoon keeps its own white bg + "Rizwan" signature */
const Portrait: React.FC<{size: number; style?: React.CSSProperties}> = ({size, style}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.12,
      overflow: 'hidden',
      background: C.white,
      border: `10px solid ${C.teal300}`,
      boxShadow: `0 40px 90px rgba(4,48,46,0.30), 0 0 0 22px rgba(94,234,212,0.25)`,
      ...style,
    }}
  >
    <Img src={me} style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} />
  </div>
);

/* ---------------- D1  S1 Hook ---------------- */
export const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: FILL_BG, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 34}}>
      <div style={{fontFamily: F.lookingFor, fontWeight: 500, fontSize: 64, color: C.teal900, opacity: fadeIn(frame, 4), transform: `translateY(${(1 - fadeIn(frame, 4)) * 20}px)`}}>
        Looking for
      </div>
      <BlurText
        text="Introvert App & Developer"
        fontFamily={F.headline}
        fontSize={108}
        fontWeight={900}
        color={C.white}
        start={22}
        stagger={9}
        duration={24}
        style={{maxWidth: 1600, textShadow: '0 10px 40px rgba(4,48,46,0.35)'}}
      />
    </AbsoluteFill>
  );
};

/* ------- D2+D3  S2 Intro -> focus on photo -> pop-ups (ONE continuous scene, like the Reference) ------- */
export const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const FOCUS = 105; // frame (inside this scene) where the "camera" focuses on the photo
  const enter = spring({frame: frame - 4, fps, config: {damping: 14, stiffness: 90}});
  const zoom = spring({frame: frame - FOCUS, fps, config: {damping: 16, stiffness: 70}});
  return (
    <AbsoluteFill>
      <GridBG offset={START.intro} />

      {/* soft glow that appears when the focus moves to the photo */}
      <div
        style={{
          position: 'absolute',
          left: 190 - 70,
          top: 250 - 70,
          width: 720,
          height: 720,
          borderRadius: '50%',
          background: 'radial-gradient(closest-side, rgba(94,234,212,0.55), transparent)',
          opacity: zoom,
          transform: `scale(${1 + 0.22 * zoom})`,
        }}
      />

      {/* portrait: slides in, then zooms in (focus) */}
      <div
        style={{
          position: 'absolute',
          left: 190,
          top: 250,
          transform: `translateX(${(1 - enter) * -600}px) rotate(${(1 - enter) * -8}deg)`,
          opacity: Math.min(1, enter * 2),
        }}
      >
        <div style={{transform: `scale(${1 + 0.22 * zoom})`}}>
          <Portrait size={580} />
        </div>
      </div>

      {/* pop-ups float up around the photo */}
      <Badge text="Android Apps" delay={FOCUS + 22} style={{left: 590, top: 205}} />
      <Badge text="Websites" delay={FOCUS + 36} variant="light" style={{left: 80, top: 815}} />
      <Badge text="IslamiPedia AI" delay={FOCUS + 50} style={{left: 640, top: 790}} />

      {/* text block: name first, then role + CTA appear under it */}
      <div style={{position: 'absolute', left: 960, top: 150, width: 900, transform: `translateY(${(1 - zoom) * 70}px)`}}>
        <div style={{opacity: fadeIn(frame, 16), transform: `translateY(${(1 - fadeIn(frame, 16)) * 20}px)`, display: 'inline-flex', alignItems: 'center', gap: 12, padding: '10px 24px', borderRadius: 999, border: `2px solid ${C.teal700}`, fontFamily: F.badge, fontWeight: 500, fontSize: 26, color: C.teal700}}>
          <span style={{width: 12, height: 12, borderRadius: 6, background: C.teal700}} />
          Introvert by choice
        </div>
        <BlurText text="Hello, I'm" fontFamily={F.hello} fontSize={92} fontWeight={800} color={C.teal900} start={26} stagger={8} style={{justifyContent: 'flex-start', marginTop: 24}} />
        <BlurText text="Rizwan" fontFamily={F.name} fontSize={165} fontWeight={900} color={C.teal500} start={44} stagger={8} style={{justifyContent: 'flex-start', marginTop: -8}} />
        <BlurText text="Chowdhury" fontFamily={F.name} fontSize={100} fontWeight={700} color={C.teal900} start={58} stagger={8} style={{justifyContent: 'flex-start', marginTop: -6}} />
        <Squiggle width={520} start={80} duration={25} style={{marginTop: 4}} />
        <BlurText text="App & Website Developer" fontFamily={F.role} fontSize={56} fontWeight={800} color={C.teal700} start={FOCUS + 30} stagger={6} style={{justifyContent: 'flex-start', marginTop: 14}} />
        <div style={{fontFamily: F.bn, fontWeight: 700, fontSize: 38, color: C.teal900, marginTop: 8, opacity: fadeIn(frame, FOCUS + 55)}}>
          অ্যাপ ও ওয়েবসাইট ডেভেলপার
        </div>
        <CTA text="See My Work" delay={FOCUS + 75} style={{marginTop: 28}} />
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- D4  S4 Apps ---------------- */
const APPS: {src: string; label: string; font?: string}[] = [
  {src: appS2, label: 'ইসলামী বিশ্বকোষ ও আল হাদিস S2'},
  {src: appBishwakosh, label: 'ইসলামী বিশ্বকোষ ও আল হাদিস'},
  {src: appShohid, label: 'শহিদুল্লাহ বাহাদুর গ্রন্থ সমগ্র'},
  {src: appOsman, label: 'হাফেয মাওলানা ওসমান গণি গ্রন্থ সমগ্র'},
  {src: appTablig, label: 'ইসলামী তাবলীগ'},
  {src: appUsila, label: 'উসীলা-ইস্তিগাসা ও আহকামুল মাযার'},
  {src: appTask, label: 'RizwanTask', font: F.role},
];
export const SceneApps: React.FC = () => {
  const row = (items: typeof APPS, offset: number) => (
    <div style={{display: 'flex', justifyContent: 'center', gap: 90}}>
      {items.map((a, i) => (
        <AppCard key={a.label + i} src={a.src} label={a.label} fontFamily={a.font} size={260} delay={14 + (offset + i) * 9} bob={5} />
      ))}
    </div>
  );
  return (
    <AbsoluteFill>
      <GridBG offset={START.apps} />
      <div style={{position: 'absolute', top: 44, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <BlurText text="Apps" fontFamily={F.titleApps} fontSize={110} fontWeight={900} color={C.teal700} start={0} />
        <Squiggle width={260} start={14} />
      </div>
      <div style={{position: 'absolute', top: 245, left: 0, right: 0, display: 'flex', flexDirection: 'column', gap: 26}}>
        {row(APPS.slice(0, 4), 0)}
        {row(APPS.slice(4), 4)}
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- D5  S5 Websites ---------------- */
export const SceneWeb: React.FC = () => {
  const cols: {src: string; ratio: number; name: string; font: string; w: number; h: number; delay: number; tilt: number}[] = [
    {src: webS2, ratio: 1367 / 720, name: 'ইসলামী বিশ্বকোষ ও আল হাদিস S2', font: F.bn, w: 360, h: 650, delay: 8, tilt: -3},
    {src: webAI, ratio: 1371 / 720, name: 'IslamiPedia AI', font: F.hello, w: 420, h: 740, delay: 0, tilt: 0},
    {src: webTask, ratio: 1373 / 720, name: 'RizwanTask', font: F.role, w: 360, h: 650, delay: 16, tilt: 3},
  ];
  return (
    <AbsoluteFill>
      <GridBG offset={START.web} />
      <div style={{position: 'absolute', top: 44, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <BlurText text="Websites" fontFamily={F.titleWeb} fontSize={110} fontWeight={800} color={C.teal700} start={0} />
        <Squiggle width={260} start={14} />
      </div>
      <div style={{position: 'absolute', top: 215, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 90}}>
        {cols.map((c) => (
          <div key={c.name} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16}}>
            <PhoneMock src={c.src} imgRatio={c.ratio} width={c.w} height={c.h} delay={c.delay} scrollStart={34 + c.delay} scrollDuration={125} tilt={c.tilt} />
            <div style={{fontFamily: c.font, fontWeight: 700, fontSize: 32, color: C.teal900}}>{c.name}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- D6  S6 Outro ---------------- */
export const SceneOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const stamp = spring({frame: frame - 6, fps, config: {damping: 9, stiffness: 160, mass: 0.8}});
  const rise = (start: number) => ({opacity: fadeIn(frame, start), transform: `translateY(${(1 - fadeIn(frame, start)) * 24}px)`});
  return (
    <AbsoluteFill style={{background: FILL_BG, justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
      <div style={{...rise(2), fontFamily: F.dm, fontSize: 150, lineHeight: 1, letterSpacing: 12, color: C.teal900}}>
        Please
      </div>
      <div style={{fontFamily: F.dm, fontSize: 330, marginTop: -6, lineHeight: 1, color: C.white, letterSpacing: 4, textShadow: '0 14px 50px rgba(4,48,46,0.4)', opacity: Math.min(1, stamp * 2), transform: `scale(${1.7 - 0.7 * stamp}) rotate(${-4 * (1 - stamp)}deg)`}}>
        Don’t DM Now.
      </div>
      <div style={{...rise(40), fontFamily: F.tagline, fontWeight: 600, fontSize: 44, color: C.teal900, marginTop: 6, display: 'flex', alignItems: 'center', gap: 12}}>
        (I’ll reply when I’m ready
        <Smile size={44} />)
      </div>
      <div style={{...rise(62), fontFamily: F.fullName, fontWeight: 700, fontSize: 96, color: C.teal900, marginTop: 56}}>
        Rizwan Chowdhury
      </div>
      <div style={{...rise(78), fontFamily: F.tagline, fontWeight: 800, fontSize: 32, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.teal900, marginTop: 8}}>
        App &amp; Website Developer
      </div>
      <Squiggle width={300} color={C.teal900} start={92} style={{marginTop: 14}} />
    </AbsoluteFill>
  );
};
