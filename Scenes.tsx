import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {APP_FIRST, APP_STAGGER, C, FILL_BG, SKILL_FIRST, SKILL_STAGGER, START, SCENE, TRANSITION} from './theme';
import {F} from './fonts';
import {AppCard, Badge, BlurText, ContactRow, CTA, GridBG, PhoneMock, SkillCard, Particles, Smile, Squiggle, SkillOrbit} from './Components';
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
      <Particles offset={START.hook} tone="light" seed="hook" />
      <BlurText text="Introducing" fontFamily={F.lookingFor} fontSize={64} fontWeight={500} color={C.teal900} mode="chars" start={4} stagger={3} shine float={3} exitAt={EXIT('hook')} />
      <BlurText
        text="Introvert App & Developer" mode="flip" shine float={4} exitAt={EXIT('hook')}
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
          zIndex: 10,
        }}
      >
        <div style={{transform: `scale(${1 + 0.22 * zoom})`}}>
          <Portrait size={580} />
        </div>
      </div>

      {/* skills orbit around the head: back half passes behind the portrait, front half in front */}
      <SkillOrbit items={SKILLS} cx={480} cy={250 + 12 - 64 * zoom} rx={330 + 70 * zoom} ry={62} chip={90} start={34} speed={1.2} />

      {/* pop-ups float up around the photo */}
      <Badge icon="app" text="Android & iOS Apps" delay={FOCUS + 22} style={{zIndex: 30, left: 640, top: 520}} />
      <Badge icon="web" text="Websites" delay={FOCUS + 36} variant="light" style={{zIndex: 30, left: 80, top: 815}} />
      <Badge icon="ai" text="IslamiPedia AI" delay={FOCUS + 50} style={{zIndex: 30, left: 640, top: 790}} />

      {/* text block: name first, then role + CTA appear under it */}
      <div style={{position: 'absolute', left: 960, top: 150, width: 900, transform: `translateY(${(1 - zoom) * 70}px)`}}>
        <div style={{opacity: fadeIn(frame, 16), transform: `translateY(${(1 - fadeIn(frame, 16)) * 20}px)`, display: 'inline-flex', alignItems: 'center', gap: 12, padding: '10px 24px', borderRadius: 999, border: `2px solid ${C.teal700}`, fontFamily: F.badge, fontWeight: 500, fontSize: 26, color: C.teal700}}>
          <span style={{width: 12, height: 12, borderRadius: 6, background: C.teal700}} />
          Introvert by choice
        </div>
        <BlurText text="Hello, I'm" mode="mask" fontFamily={F.hello} fontSize={92} fontWeight={800} color={C.slate} start={26} stagger={8} style={{justifyContent: 'flex-start', marginTop: 24}} />
        <BlurText text="Rizwan" mode="chars" shine float={3} gradient={[C.teal500, C.teal700]} fontFamily={F.name} fontSize={165} fontWeight={900} color={C.teal500} start={44} stagger={8} style={{justifyContent: 'flex-start', marginTop: -8}} />
        <BlurText text="Chowdhury" mode="mask" fontFamily={F.name} fontSize={100} fontWeight={700} color={C.slate} start={58} stagger={8} style={{justifyContent: 'flex-start', marginTop: -6}} />
        <Squiggle width={520} start={80} duration={25} style={{marginTop: 4}} />
        <BlurText text="App & Website Developer" mode="flip" fontFamily={F.role} fontSize={56} fontWeight={800} color={C.teal700} start={FOCUS + 30} stagger={6} style={{justifyContent: 'flex-start', marginTop: 14}} />
        <BlurText text="অ্যাপ ও ওয়েবসাইট ডেভেলপার" mode="blur" fontFamily={F.bn} fontSize={38} fontWeight={700} color={C.slate} start={FOCUS + 55} stagger={6} style={{justifyContent: 'flex-start', marginTop: 8}} />
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
        <AppCard key={a.label + i} src={a.src} label={a.label} fontFamily={a.font} size={260} delay={APP_FIRST + (offset + i) * APP_STAGGER} bob={5} />
      ))}
    </div>
  );
  return (
    <AbsoluteFill>
      <GridBG offset={START.apps} />
      <div style={{position: 'absolute', top: 44, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <BlurText text="Apps" mode="chars" shine float={3} exitAt={EXIT('apps')} fontFamily={F.titleApps} fontSize={110} fontWeight={900} color={C.teal700} start={0} />
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
  const cols: {src: string; ratio: number; name: string; font: string; w: number; h: number; delay: number; tilt: number; sb: string; fg: string; zoom?: number}[] = [
    {src: webS2, ratio: 1367 / 720, name: 'ইসলামী বিশ্বকোষ ও আল হাদিস S2', font: F.bn, w: 360, h: 650, delay: 8, tilt: -3, sb: '#02736f', fg: '#FFFFFF'},
    {src: webAI, ratio: 1371 / 720, name: 'IslamiPedia AI', font: F.hello, w: 420, h: 740, delay: 0, tilt: 0, sb: '#f7f7f7', fg: C.slate, zoom: 1.3},
    {src: webTask, ratio: 1373 / 720, name: 'RizwanTask', font: F.role, w: 360, h: 650, delay: 16, tilt: 3, sb: '#02110e', fg: '#CFEEE8'},
  ];
  return (
    <AbsoluteFill>
      <GridBG offset={START.web} />
      <div style={{position: 'absolute', top: 44, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <BlurText text="Websites" mode="chars" shine float={3} exitAt={EXIT('web')} fontFamily={F.titleWeb} fontSize={110} fontWeight={800} color={C.teal700} start={0} />
        <Squiggle width={260} start={14} />
      </div>
      <div style={{position: 'absolute', top: 215, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 90}}>
        {cols.map((c) => (
          <div key={c.name} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16}}>
            <PhoneMock src={c.src} imgRatio={c.ratio} width={c.w} height={c.h} delay={c.delay} scrollStart={34 + c.delay} scrollDuration={125} tilt={c.tilt} statusBg={c.sb} statusFg={c.fg} zoomTo={c.zoom} focusY={0.5} />
            <BlurText text={c.name} mode="blur" fontFamily={c.font} fontSize={32} fontWeight={700} color={C.slate} start={c.delay + 40} stagger={5} />
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- D5b  S6 Skills (5 vector cards + counters) ---------------- */
export const SceneSkills: React.FC = () => (
  <AbsoluteFill>
    <GridBG offset={START.skills} />
    <div style={{position: 'absolute', top: 44, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <BlurText text="Skills" mode="chars" shine float={3} exitAt={EXIT('skills')} fontFamily={F.cta} fontSize={110} fontWeight={700} color={C.teal700} start={0} />
      <Squiggle width={260} start={14} />
    </div>
    <div style={{position: 'absolute', top: 230, bottom: 40, left: 0, right: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 70}}>
      <div style={{display: 'flex', justifyContent: 'center', gap: 70}}>
        {SKILLS.map((k, i) => (
          <SkillCard key={k.label} icon={k.icon} label={k.label} size={270} labelSize={36} delay={SKILL_FIRST + i * SKILL_STAGGER} />
        ))}
      </div>
    </div>
  </AbsoluteFill>
);

/* ---------------- D6  S6 Outro ---------------- */
export const SceneOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const stamp = spring({frame: frame - 6, fps, config: {damping: 9, stiffness: 160, mass: 0.8}});
  const rise = (start: number) => ({opacity: fadeIn(frame, start), transform: `translateY(${(1 - fadeIn(frame, start)) * 24}px)`});
  return (
    <AbsoluteFill style={{background: FILL_BG, justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
      <Particles offset={START.outro} tone="light" seed="outro" />
      <BlurText text="Please" mode="mask" fontFamily={F.dm} fontSize={150} fontWeight={400} color={C.slate} start={2} stagger={5} style={{lineHeight: 1, letterSpacing: 12}} />
      <div style={{fontFamily: F.dm, fontSize: 330, marginTop: -6, lineHeight: 1, color: C.white, letterSpacing: 4, textShadow: '0 14px 50px rgba(4,48,46,0.4)', opacity: Math.min(1, stamp * 2), transform: `scale(${1.7 - 0.7 * stamp}) rotate(${-4 * (1 - stamp)}deg)`}}>
        Don’t DM Now.
      </div>
      <div style={{...rise(40), fontFamily: F.tagline, fontWeight: 600, fontSize: 44, color: C.slate, marginTop: 6, display: 'flex', alignItems: 'center', gap: 12}}>
        (I’ll reply when I’m in the mood
        <Smile size={44} />)
      </div>
      <BlurText text="Rizwan Chowdhury" mode="chars" fontFamily={F.fullName} fontSize={96} fontWeight={700} color={C.slate} start={62} stagger={2} duration={18} style={{marginTop: 56}} />
      <BlurText text="App & Website Developer" mode="mask" fontFamily={F.tagline} fontSize={32} fontWeight={800} color={C.slate} start={78} stagger={6} style={{letterSpacing: '0.22em', textTransform: 'uppercase', marginTop: 8}} />
      <Squiggle width={300} color={C.slate} start={92} style={{marginTop: 14}} />
      <ContactRow start={98} size={32} direction="row" style={{marginTop: 26}} />
    </AbsoluteFill>
  );
};
