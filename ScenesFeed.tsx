// 4:5 FEED scenes (1080x1350) = the recommended size for Facebook / Instagram FEED videos.
// Same story, same timing, same audio as the other formats. Only the LAYOUT is different.
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {APP_FIRST, APP_STAGGER, C, FILL_BG, SKILL_FIRST, SKILL_STAGGER, START, SCENE, TRANSITION} from './theme';
import {F} from './fonts';
import {AppCard, Badge, BlurText, ContactRow, CTA, GridBG, PhoneMock, SkillCard, Particles, Smile, Squiggle, TextMode, SkillOrbit} from './Components';
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

const EXIT = (k: keyof typeof SCENE) => SCENE[k] - TRANSITION - 14; // text exit starts 14 frames before the cross-fade
const fadeIn = (frame: number, start: number, dur = 18) =>
  interpolate(frame - start, [0, dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

const Portrait: React.FC<{size: number}> = ({size}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.12,
      overflow: 'hidden',
      background: C.white,
      border: `10px solid ${C.teal300}`,
      boxShadow: `0 40px 90px rgba(4,48,46,0.30), 0 0 0 22px rgba(94,234,212,0.25)`,
    }}
  >
    <Img src={me} style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} />
  </div>
);

const Title: React.FC<{text: string; font: string; weight: number; mode?: TextMode; shine?: boolean; float?: number; exitAt?: number}> = ({text, font, weight, mode, shine, float, exitAt}) => (
  <div style={{position: 'absolute', top: 70, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
    <BlurText text={text} fontFamily={font} fontSize={110} fontWeight={weight} color={C.teal700} start={0} mode={mode} shine={shine} float={float} exitAt={exitAt} />
    <Squiggle width={260} start={14} />
  </div>
);

/* ---------------- F1  Hook ---------------- */
export const SceneHookF: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: FILL_BG, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 36}}>
      <Particles offset={START.hook} tone="light" seed="hook" />
      <BlurText text="Introducing" fontFamily={F.lookingFor} fontSize={60} fontWeight={500} color={C.teal900} mode="chars" start={4} stagger={3} shine float={3} exitAt={EXIT('hook')} />
      <BlurText
        text="Introvert App & Developer" mode="flip" shine float={4} exitAt={EXIT('hook')}
        fontFamily={F.headline}
        fontSize={96}
        fontWeight={900}
        color={C.white}
        start={22}
        stagger={9}
        duration={24}
        style={{maxWidth: 940, rowGap: 12, textShadow: '0 10px 40px rgba(4,48,46,0.35)'}}
      />
    </AbsoluteFill>
  );
};

/* ---------------- F2  Intro -> focus on photo -> pop-ups ---------------- */
export const SceneIntroF: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const FOCUS = 105;
  const enter = spring({frame: frame - 4, fps, config: {damping: 14, stiffness: 90}});
  const zoom = spring({frame: frame - FOCUS, fps, config: {damping: 16, stiffness: 70}});
  const SIZE = 430;
  const LEFT = (1080 - SIZE) / 2;
  const TOP = 85;
  return (
    <AbsoluteFill>
      <GridBG offset={START.intro} />

      <div
        style={{
          position: 'absolute',
          left: LEFT - 60,
          top: TOP - 60,
          width: SIZE + 120,
          height: SIZE + 120,
          borderRadius: '50%',
          background: 'radial-gradient(closest-side, rgba(94,234,212,0.55), transparent)',
          opacity: zoom,
          transform: `scale(${1 + 0.18 * zoom})`,
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: LEFT,
          top: TOP,
          transform: `translateY(${(1 - enter) * -500}px) rotate(${(1 - enter) * -8}deg)`,
          opacity: Math.min(1, enter * 2),
          zIndex: 10,
        }}
      >
        <div style={{transform: `scale(${1 + 0.16 * zoom})`}}>
          <Portrait size={SIZE} />
        </div>
      </div>

      {/* skills orbit around the head: back half passes behind the portrait, front half in front */}
      <SkillOrbit items={SKILLS} cx={540} cy={TOP + 75 - 18 * zoom} rx={330 + 50 * zoom} ry={42} chip={78} start={34} speed={1.2} />

      <Badge icon="app" text="Android & iOS Apps" delay={FOCUS + 22} style={{zIndex: 30, left: 30, top: 300}} />
      <Badge icon="web" text="Websites" delay={FOCUS + 36} variant="light" style={{zIndex: 30, left: 30, top: 430}} />
      <Badge icon="ai" text="IslamiPedia AI" delay={FOCUS + 50} style={{zIndex: 30, left: 640, top: 455}} />

      <div
        style={{
          position: 'absolute',
          left: 90,
          top: 590,
          width: 900,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transform: `translateY(${(1 - zoom) * 60}px)`,
        }}
      >
        <div style={{opacity: fadeIn(frame, 16), transform: `translateY(${(1 - fadeIn(frame, 16)) * 20}px)`, display: 'inline-flex', alignItems: 'center', gap: 12, padding: '8px 22px', borderRadius: 999, border: `2px solid ${C.teal700}`, fontFamily: F.badge, fontWeight: 500, fontSize: 24, color: C.teal700}}>
          <span style={{width: 11, height: 11, borderRadius: 6, background: C.teal700}} />
          Introvert by choice
        </div>
        <BlurText text="Hello, I'm" mode="mask" fontFamily={F.hello} fontSize={82} fontWeight={800} color={C.slate} start={26} stagger={8} style={{marginTop: 18}} />
        <BlurText text="Rizwan" mode="chars" shine float={3} gradient={[C.teal500, C.teal700]} fontFamily={F.name} fontSize={145} fontWeight={900} color={C.teal500} start={44} stagger={8} style={{marginTop: -10}} />
        <BlurText text="Chowdhury" mode="mask" fontFamily={F.name} fontSize={94} fontWeight={700} color={C.slate} start={58} stagger={8} style={{marginTop: -6}} />
        <Squiggle width={400} start={80} duration={25} style={{marginTop: 2}} />
        <BlurText text="App & Website Developer" mode="flip" fontFamily={F.role} fontSize={44} fontWeight={800} color={C.teal700} start={FOCUS + 30} stagger={6} style={{marginTop: 12}} />
        <BlurText text="অ্যাপ ও ওয়েবসাইট ডেভেলপার" mode="blur" fontFamily={F.bn} fontSize={32} fontWeight={700} color={C.slate} start={FOCUS + 55} stagger={6} style={{marginTop: 6}} />
        <CTA text="See My Work" delay={FOCUS + 75} style={{marginTop: 22}} />
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- F3  Apps (4 + 3) ---------------- */
const APPS: {src: string; label: string; font?: string}[] = [
  {src: appS2, label: 'ইসলামী বিশ্বকোষ ও আল হাদিস S2'},
  {src: appBishwakosh, label: 'ইসলামী বিশ্বকোষ ও আল হাদিস'},
  {src: appShohid, label: 'শহিদুল্লাহ বাহাদুর গ্রন্থ সমগ্র'},
  {src: appOsman, label: 'হাফেয মাওলানা ওসমান গণি গ্রন্থ সমগ্র'},
  {src: appTablig, label: 'ইসলামী তাবলীগ'},
  {src: appUsila, label: 'উসীলা-ইস্তিগাসা ও আহকামুল মাযার'},
  {src: appTask, label: 'RizwanTask', font: F.role},
];
export const SceneAppsF: React.FC = () => {
  const SIZE = 220;
  const GAP = 40;
  const row = (items: typeof APPS, offset: number) => (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: GAP}}>
      {items.map((a, i) => (
        <AppCard
          key={a.label + i}
          src={a.src}
          label={a.label}
          fontFamily={a.font}
          size={SIZE}
          labelPad={20}
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
      <Title text="Apps" mode="chars" shine float={3} exitAt={EXIT('apps')} font={F.titleApps} weight={900} />
      <div style={{position: 'absolute', top: 290, bottom: 70, left: 0, right: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 44}}>
        {row(APPS.slice(0, 4), 0)}
        {row(APPS.slice(4), 4)}
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- F4  Websites (three phones in one row, no overlap) ---------------- */
export const SceneWebF: React.FC = () => {
  const side = {w: 292, h: 523};
  const mid = {w: 380, h: 681};
  const cap = (txt: string, font: string, size: number, width: number): React.ReactNode => (
    <div style={{width, textAlign: 'center', fontFamily: font, fontWeight: 700, fontSize: size, color: C.slate, lineHeight: 1.25, marginTop: 16}}>
      <BlurText text={txt} mode="blur" fontFamily={font} fontSize={size} fontWeight={700} color={C.slate} start={40} stagger={5} />
    </div>
  );
  const col: React.CSSProperties = {display: 'flex', flexDirection: 'column', alignItems: 'center'};
  return (
    <AbsoluteFill>
      <GridBG offset={START.web} />
      <Title text="Websites" mode="chars" shine float={3} exitAt={EXIT('web')} font={F.titleWeb} weight={800} />
      <div style={{position: 'absolute', top: 340, bottom: 70, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 24}}>
        <div style={col}>
          <PhoneMock src={webS2} imgRatio={1367 / 720} width={side.w} height={side.h} delay={8} scrollStart={42} scrollDuration={125} tilt={-3} statusBg="#02736f" statusFg="#FFFFFF" />
          {cap('ইসলামী বিশ্বকোষ ও আল হাদিস S2', F.bn, 26, side.w + 20)}
        </div>
        <div style={col}>
          <PhoneMock src={webAI} imgRatio={1371 / 720} width={mid.w} height={mid.h} delay={0} scrollStart={34} scrollDuration={125} tilt={0} statusBg="#f7f7f7" statusFg={C.slate} zoomTo={1.3} focusY={0.5} />
          {cap('IslamiPedia AI', F.hello, 38, mid.w)}
        </div>
        <div style={col}>
          <PhoneMock src={webTask} imgRatio={1373 / 720} width={side.w} height={side.h} delay={16} scrollStart={50} scrollDuration={125} tilt={3} statusBg="#02110e" statusFg="#CFEEE8" />
          {cap('RizwanTask', F.role, 30, side.w + 20)}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- F5  Skills (3 + 2 vector cards, counters) ---------------- */
export const SceneSkillsF: React.FC = () => (
  <AbsoluteFill>
    <GridBG offset={START.skills} />
    <Title text="Skills" mode="chars" shine float={3} exitAt={EXIT('skills')} font={F.cta} weight={700} />
    <div style={{position: 'absolute', top: 290, bottom: 70, left: 0, right: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 44}}>
      <div style={{display: 'flex', justifyContent: 'center', gap: 50}}>
        {SKILLS.slice(0, 3).map((k, i) => (
          <SkillCard key={k.label} icon={k.icon} label={k.label} size={220} labelSize={32} delay={SKILL_FIRST + i * SKILL_STAGGER} />
        ))}
      </div>
      <div style={{display: 'flex', justifyContent: 'center', gap: 50}}>
        {SKILLS.slice(3).map((k, i) => (
          <SkillCard key={k.label} icon={k.icon} label={k.label} size={220} labelSize={32} delay={SKILL_FIRST + (i + 3) * SKILL_STAGGER} />
        ))}
      </div>
    </div>
  </AbsoluteFill>
);

/* ---------------- F6  Outro ---------------- */
export const SceneOutroF: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const stamp = spring({frame: frame - 6, fps, config: {damping: 9, stiffness: 160, mass: 0.8}});
  const rise = (start: number) => ({opacity: fadeIn(frame, start), transform: `translateY(${(1 - fadeIn(frame, start)) * 24}px)`});
  return (
    <AbsoluteFill style={{background: FILL_BG, justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
      <Particles offset={START.outro} tone="light" seed="outro" />
      <BlurText text="Please" mode="mask" fontFamily={F.dm} fontSize={120} fontWeight={400} color={C.slate} start={2} stagger={5} style={{lineHeight: 1, letterSpacing: 10}} />
      <div
        style={{
          fontFamily: F.dm,
          fontSize: 220,
          lineHeight: 0.95,
          marginTop: -2,
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
      <div style={{...rise(40), fontFamily: F.tagline, fontWeight: 600, fontSize: 34, color: C.slate, marginTop: 30, display: 'flex', alignItems: 'center', gap: 10}}>
        (I’ll reply when I’m in the mood
        <Smile size={34} />)
      </div>
      <BlurText text="Rizwan Chowdhury" mode="chars" fontFamily={F.fullName} fontSize={80} fontWeight={700} color={C.slate} start={62} stagger={2} duration={18} style={{marginTop: 44}} />
      <BlurText text="App & Website Developer" mode="mask" fontFamily={F.tagline} fontSize={24} fontWeight={800} color={C.slate} start={78} stagger={6} style={{letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 8}} />
      <Squiggle width={280} color={C.slate} start={92} style={{marginTop: 12}} />
      <ContactRow start={98} size={30} direction="column" style={{marginTop: 24}} />
    </AbsoluteFill>
  );
};
