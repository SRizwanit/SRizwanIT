// 9:16 VERTICAL scenes (1080x1920). Same story, same timing, same audio as the 16:9 video.
// Only the LAYOUT is different. Rendered as HD only (1080x1920).
import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {APP_FIRST, APP_STAGGER, C, FILL_BG, SKILL_FIRST, SKILL_STAGGER, START} from './theme';
import {F} from './fonts';
import {AppCard, Badge, BlurText, ContactRow, CTA, GridBG, PhoneMock, SkillCard, Smile, Squiggle} from './Components';
import {SKILLS} from './Icons';

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

/* ---------------- V1  Hook ---------------- */
export const SceneHookV: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: FILL_BG, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 44}}>
      <div style={{fontFamily: F.lookingFor, fontWeight: 500, fontSize: 64, color: C.teal900, opacity: fadeIn(frame, 4), transform: `translateY(${(1 - fadeIn(frame, 4)) * 20}px)`}}>
        Introducing
      </div>
      <BlurText
        text="Introvert App & Developer"
        fontFamily={F.headline}
        fontSize={104}
        fontWeight={900}
        color={C.white}
        start={22}
        stagger={9}
        duration={24}
        style={{maxWidth: 940, rowGap: 14, textShadow: '0 10px 40px rgba(4,48,46,0.35)'}}
      />
    </AbsoluteFill>
  );
};

/* ---------------- V2  Intro -> focus on photo -> pop-ups (one continuous scene) ---------------- */
export const SceneIntroV: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const FOCUS = 105; // frame (inside this scene) where the "camera" focuses on the photo
  const enter = spring({frame: frame - 4, fps, config: {damping: 14, stiffness: 90}});
  const zoom = spring({frame: frame - FOCUS, fps, config: {damping: 16, stiffness: 70}});
  const SIZE = 620;
  const LEFT = (1080 - SIZE) / 2;
  const TOP = 220;
  return (
    <AbsoluteFill>
      <GridBG offset={START.intro} />

      {/* soft glow when focus moves to the photo */}
      <div
        style={{
          position: 'absolute',
          left: LEFT - 70,
          top: TOP - 70,
          width: SIZE + 140,
          height: SIZE + 140,
          borderRadius: '50%',
          background: 'radial-gradient(closest-side, rgba(94,234,212,0.55), transparent)',
          opacity: zoom,
          transform: `scale(${1 + 0.18 * zoom})`,
        }}
      />

      {/* portrait: slides in (from the top), then zooms in (focus) */}
      <div
        style={{
          position: 'absolute',
          left: LEFT,
          top: TOP,
          transform: `translateY(${(1 - enter) * -700}px) rotate(${(1 - enter) * -8}deg)`,
          opacity: Math.min(1, enter * 2),
        }}
      >
        <div style={{transform: `scale(${1 + 0.18 * zoom})`}}>
          <Portrait size={SIZE} />
        </div>
      </div>

      {/* pop-ups float up around the photo */}
      <Badge icon="app" text="Android & iOS Apps" delay={FOCUS + 22} style={{left: 560, top: 170}} />
      <Badge icon="web" text="Websites" delay={FOCUS + 36} variant="light" style={{left: 40, top: 820}} />
      <Badge icon="ai" text="IslamiPedia AI" delay={FOCUS + 50} style={{left: 600, top: 850}} />

      {/* text block (centered): name first, then role + CTA appear under it */}
      <div
        style={{
          position: 'absolute',
          left: 90,
          top: 930,
          width: 900,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transform: `translateY(${(1 - zoom) * 70}px)`,
        }}
      >
        <div style={{opacity: fadeIn(frame, 16), transform: `translateY(${(1 - fadeIn(frame, 16)) * 20}px)`, display: 'inline-flex', alignItems: 'center', gap: 12, padding: '10px 24px', borderRadius: 999, border: `2px solid ${C.teal700}`, fontFamily: F.badge, fontWeight: 500, fontSize: 26, color: C.teal700}}>
          <span style={{width: 12, height: 12, borderRadius: 6, background: C.teal700}} />
          Introvert by choice
        </div>
        <BlurText text="Hello, I'm" fontFamily={F.hello} fontSize={100} fontWeight={800} color={C.slate} start={26} stagger={8} style={{marginTop: 24}} />
        <BlurText text="Rizwan" fontFamily={F.name} fontSize={170} fontWeight={900} color={C.teal500} start={44} stagger={8} style={{marginTop: -10}} />
        <BlurText text="Chowdhury" fontFamily={F.name} fontSize={110} fontWeight={700} color={C.slate} start={58} stagger={8} style={{marginTop: -6}} />
        <Squiggle width={460} start={80} duration={25} style={{marginTop: 4}} />
        <BlurText text="App & Website Developer" fontFamily={F.role} fontSize={52} fontWeight={800} color={C.teal700} start={FOCUS + 30} stagger={6} style={{marginTop: 18}} />
        <div style={{fontFamily: F.bn, fontWeight: 700, fontSize: 36, color: C.slate, marginTop: 8, opacity: fadeIn(frame, FOCUS + 55)}}>
          অ্যাপ ও ওয়েবসাইট ডেভেলপার
        </div>
        <CTA text="See My Work" delay={FOCUS + 75} style={{marginTop: 30}} />
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- V3  Apps (2 + 2 + 3 balanced grid) ---------------- */
const APPS: {src: string; label: string; font?: string}[] = [
  {src: appS2, label: 'ইসলামী বিশ্বকোষ ও আল হাদিস S2'},
  {src: appBishwakosh, label: 'ইসলামী বিশ্বকোষ ও আল হাদিস'},
  {src: appShohid, label: 'শহিদুল্লাহ বাহাদুর গ্রন্থ সমগ্র'},
  {src: appOsman, label: 'হাফেয মাওলানা ওসমান গণি গ্রন্থ সমগ্র'},
  {src: appTablig, label: 'ইসলামী তাবলীগ'},
  {src: appUsila, label: 'উসীলা-ইস্তিগাসা ও আহকামুল মাযার'},
  {src: appTask, label: 'RizwanTask', font: F.role},
];
export const SceneAppsV: React.FC = () => {
  // 7 apps => 2 + 2 + 3 (no lonely last card). Equal card size, centred block, no label overlap.
  const SIZE = 280;
  const GAP = 90; // > label overhang (labelPad/2 per side) so neighbouring captions never touch
  const row = (items: typeof APPS, offset: number) => (
    <div style={{display: 'flex', justifyContent: 'center', gap: GAP}}>
      {items.map((a, i) => (
        <AppCard
          key={a.label + i}
          src={a.src}
          label={a.label}
          fontFamily={a.font}
          size={SIZE}
          labelPad={60}
          highlight={a.label === 'RizwanTask'}
          delay={APP_FIRST + (offset + i) * APP_STAGGER}
          bob={5}
        />
      ))}
    </div>
  );
  return (
    <AbsoluteFill>
      <GridBG offset={START.apps} />
      <div style={{position: 'absolute', top: 150, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <BlurText text="Apps" fontFamily={F.titleApps} fontSize={130} fontWeight={900} color={C.teal700} start={0} />
        <Squiggle width={300} start={14} />
      </div>
      <div style={{position: 'absolute', top: 400, bottom: 220, left: 0, right: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 70}}>
        {row(APPS.slice(0, 2), 0)}
        {row(APPS.slice(2, 4), 2)}
        {row(APPS.slice(4), 4)}
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- V4  Websites (big centre phone + 2 phones below) ---------------- */
// Every phone is fully visible: nothing overlaps, nothing touches the screen edge,
// the app header sits BELOW the status bar, and the last caption stays above the Reels bottom UI.
export const SceneWebV: React.FC = () => {
  const side = {w: 262, h: 470};
  const mid = {w: 370, h: 663};
  const cap = (txt: string, font: string, size: number, width: number): React.ReactNode => (
    <div style={{width, textAlign: 'center', fontFamily: font, fontWeight: 700, fontSize: size, color: C.slate, lineHeight: 1.25, marginTop: 16}}>
      {txt}
    </div>
  );
  const col: React.CSSProperties = {display: 'flex', flexDirection: 'column', alignItems: 'center'};
  return (
    <AbsoluteFill>
      <GridBG offset={START.web} />
      <div style={{position: 'absolute', top: 150, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <BlurText text="Websites" fontFamily={F.titleWeb} fontSize={130} fontWeight={800} color={C.teal700} start={0} />
        <Squiggle width={300} start={14} />
      </div>

      <div style={{position: 'absolute', top: 395, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20}}>
        {/* centre (main) phone: slow push-in so the small text becomes readable */}
        <div style={col}>
          <PhoneMock src={webAI} imgRatio={1371 / 720} width={mid.w} height={mid.h} delay={0} scrollStart={34} scrollDuration={125} tilt={0} statusBg="#f7f7f7" statusFg={C.slate} zoomTo={1.3} focusY={0.5} />
          {cap('IslamiPedia AI', F.hello, 38, mid.w)}
        </div>
        {/* two supporting phones, side by side below it */}
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: 80}}>
          <div style={col}>
            <PhoneMock src={webS2} imgRatio={1367 / 720} width={side.w} height={side.h} delay={8} scrollStart={42} scrollDuration={125} tilt={-3} statusBg="#02736f" statusFg="#FFFFFF" />
            {cap('ইসলামী বিশ্বকোষ ও আল হাদিস S2', F.bn, 26, side.w + 40)}
          </div>
          <div style={col}>
            <PhoneMock src={webTask} imgRatio={1373 / 720} width={side.w} height={side.h} delay={16} scrollStart={50} scrollDuration={125} tilt={3} statusBg="#02110e" statusFg="#CFEEE8" />
            {cap('RizwanTask', F.role, 30, side.w + 40)}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- V4b  Skills (3 + 2 vector cards, counters) ---------------- */
export const SceneSkillsV: React.FC = () => (
  <AbsoluteFill>
    <GridBG offset={START.skills} />
    <div style={{position: 'absolute', top: 150, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <BlurText text="Skills" fontFamily={F.cta} fontSize={130} fontWeight={700} color={C.teal700} start={0} />
      <Squiggle width={300} start={14} />
    </div>
    <div style={{position: 'absolute', top: 430, bottom: 220, left: 0, right: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 70}}>
      <div style={{display: 'flex', justifyContent: 'center', gap: 60}}>
        {SKILLS.slice(0, 3).map((k, i) => (
          <SkillCard key={k.label} icon={k.icon} label={k.label} size={270} labelSize={36} delay={SKILL_FIRST + i * SKILL_STAGGER} />
        ))}
      </div>
      <div style={{display: 'flex', justifyContent: 'center', gap: 60}}>
        {SKILLS.slice(3).map((k, i) => (
          <SkillCard key={k.label} icon={k.icon} label={k.label} size={270} labelSize={36} delay={SKILL_FIRST + (i + 3) * SKILL_STAGGER} />
        ))}
      </div>
    </div>
  </AbsoluteFill>
);

/* ---------------- V5  Outro: Please / Don't DM / Now. ---------------- */
export const SceneOutroV: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const stamp = spring({frame: frame - 6, fps, config: {damping: 9, stiffness: 160, mass: 0.8}});
  const rise = (start: number) => ({opacity: fadeIn(frame, start), transform: `translateY(${(1 - fadeIn(frame, start)) * 24}px)`});
  return (
    <AbsoluteFill style={{background: FILL_BG, justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
      <div style={{...rise(2), fontFamily: F.dm, fontSize: 140, lineHeight: 1, letterSpacing: 12, color: C.slate}}>
        Please
      </div>
      <div
        style={{
          fontFamily: F.dm,
          fontSize: 270,
          lineHeight: 0.95,
          marginTop: -4,
          textAlign: 'center',
          color: C.white,
          letterSpacing: 4,
          textShadow: '0 14px 50px rgba(4,48,46,0.4)',
          opacity: Math.min(1, stamp * 2),
          transform: `scale(${1.7 - 0.7 * stamp}) rotate(${-4 * (1 - stamp)}deg)`,
        }}
      >
        Don’t DM
        <br />
        Now.
      </div>
      <div style={{...rise(40), fontFamily: F.tagline, fontWeight: 600, fontSize: 38, color: C.slate, marginTop: 40, display: 'flex', alignItems: 'center', gap: 10}}>
        (I’ll reply when I’m in the mood
        <Smile size={38} />)
      </div>
      <div style={{...rise(62), fontFamily: F.fullName, fontWeight: 700, fontSize: 92, color: C.slate, marginTop: 70}}>
        Rizwan Chowdhury
      </div>
      <div style={{...rise(78), fontFamily: F.tagline, fontWeight: 800, fontSize: 28, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.slate, marginTop: 10}}>
        App &amp; Website Developer
      </div>
      <Squiggle width={300} color={C.slate} start={92} style={{marginTop: 14}} />
      <ContactRow start={98} size={34} direction="column" style={{marginTop: 30}} />
    </AbsoluteFill>
  );
};
