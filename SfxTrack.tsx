import React from 'react';
import {Audio, Sequence} from 'remotion';
import whoosh from './sfx-whoosh.wav';
import pop from './sfx-pop.wav';
import thud from './sfx-thud.wav';
import ding from './sfx-ding.wav';
import {APP_FIRST, APP_STAGGER, SKILL_FIRST, SKILL_STAGGER, START} from './theme';

// Every sound is placed RELATIVE to its scene (START comes from theme.ts), so when a scene
// moves or a new scene is added the sounds follow automatically. 30 fps. Volume 0..1.
type Hit = {at: number; src: string; vol: number; len: number};

// Intro scene: the photo "focus" + everything that follows it is timed from this frame
// (same constant as FOCUS in Scenes.tsx / ScenesVertical.tsx / ScenesFeed.tsx = 105).
const INTRO_FOCUS = 105;

const hits: Hit[] = [
  // S1 — "Introducing" letters (soft tick), then the 4 headline words blur in
  {at: 4, src: pop, vol: 0.22, len: 10},
  {at: 22, src: pop, vol: 0.35, len: 10},
  {at: 31, src: pop, vol: 0.35, len: 10},
  {at: 40, src: pop, vol: 0.35, len: 10},
  {at: 49, src: pop, vol: 0.4, len: 10},

  // transitions (whoosh starts a few frames before each cut)
  {at: START.intro - 6, src: whoosh, vol: 0.55, len: 20},
  {at: START.intro + INTRO_FOCUS - 2, src: whoosh, vol: 0.6, len: 20}, // camera focus / photo zoom
  {at: START.apps - 6, src: whoosh, vol: 0.5, len: 20},
  {at: START.web - 6, src: whoosh, vol: 0.6, len: 20},
  {at: START.skills - 6, src: whoosh, vol: 0.6, len: 20},
  {at: START.outro - 6, src: whoosh, vol: 0.7, len: 20},

  // S2 — "Hello, I'm" words, then "Rizwan" appears
  {at: START.intro + 26, src: pop, vol: 0.3, len: 10},
  {at: START.intro + 44, src: ding, vol: 0.5, len: 30},

  // S3 — 5 skill icons pop onto the orbit (SkillOrbit start = FOCUS+6, 5 frames apart), soft
  ...Array.from({length: 5}, (_, i): Hit => ({at: START.intro + INTRO_FOCUS + 6 + i * 5, src: pop, vol: 0.28, len: 10})),
  // S3 — 3 badges pop (Badge delay = FOCUS+22 / +36 / +50) + CTA (delay = FOCUS+75)
  {at: START.intro + INTRO_FOCUS + 22, src: pop, vol: 0.6, len: 10},
  {at: START.intro + INTRO_FOCUS + 36, src: pop, vol: 0.6, len: 10},
  {at: START.intro + INTRO_FOCUS + 50, src: pop, vol: 0.6, len: 10},
  {at: START.intro + INTRO_FOCUS + 75, src: ding, vol: 0.5, len: 30},

  // S4 — 7 app cards pop in (same timing constants as the cards)
  ...Array.from({length: 7}, (_, i): Hit => ({at: START.apps + APP_FIRST + i * APP_STAGGER, src: pop, vol: i === 6 ? 0.6 : 0.55, len: 10})),

  // S5 — 3 phones rise
  {at: START.web, src: pop, vol: 0.6, len: 10},
  {at: START.web + 8, src: pop, vol: 0.6, len: 10},
  {at: START.web + 16, src: pop, vol: 0.6, len: 10},

  // S6 — 5 skill cards pop in
  ...Array.from({length: 5}, (_, i): Hit => ({at: START.skills + SKILL_FIRST + i * SKILL_STAGGER, src: pop, vol: 0.5, len: 10})),

  // S7 — "Please", "Don't DM Now." stamp, reply line, name, contact row
  {at: START.outro + 2, src: pop, vol: 0.3, len: 10},
  {at: START.outro + 12, src: thud, vol: 0.95, len: 30},
  {at: START.outro + 40, src: ding, vol: 0.4, len: 30},
  {at: START.outro + 62, src: ding, vol: 0.5, len: 30},
  {at: START.outro + 98, src: pop, vol: 0.3, len: 10}, // contact row
];

export const SfxTrack: React.FC = () => (
  <>
    {hits.map((h, i) => (
      <Sequence key={i} from={h.at} durationInFrames={h.len + 30} layout="none">
        <Audio src={h.src} volume={h.vol} />
      </Sequence>
    ))}
  </>
);
