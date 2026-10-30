import React from 'react';
import {Audio, Sequence} from 'remotion';
import whoosh from './sfx-whoosh.wav';
import pop from './sfx-pop.wav';
import thud from './sfx-thud.wav';
import ding from './sfx-ding.wav';

// All frames are ABSOLUTE (30 fps, 900 total).
// Scene starts: S1 0 | S2 108 | S3 231 | S4 354 | S5 597 | S6 770
// Change a number here to move a sound. Volume 0..1.
type Hit = {at: number; src: string; vol: number; len: number};

const hits: Hit[] = [
  // S1 — words blur in
  {at: 22, src: pop, vol: 0.35, len: 10},
  {at: 31, src: pop, vol: 0.35, len: 10},
  {at: 40, src: pop, vol: 0.35, len: 10},
  {at: 49, src: pop, vol: 0.4, len: 10},

  // transitions (whoosh starts a few frames before the cut)
  {at: 102, src: whoosh, vol: 0.55, len: 20},
  {at: 225, src: whoosh, vol: 0.6, len: 20},
  {at: 348, src: whoosh, vol: 0.5, len: 20},
  {at: 591, src: whoosh, vol: 0.6, len: 20},
  {at: 764, src: whoosh, vol: 0.7, len: 20},

  // S2 — "Rizwan" name appears
  {at: 152, src: ding, vol: 0.5, len: 30},

  // S3 — badges + CTA
  {at: 257, src: pop, vol: 0.6, len: 10},
  {at: 269, src: pop, vol: 0.6, len: 10},
  {at: 289, src: ding, vol: 0.5, len: 30},

  // S4 — 7 app cards pop in
  {at: 368, src: pop, vol: 0.55, len: 10},
  {at: 377, src: pop, vol: 0.55, len: 10},
  {at: 386, src: pop, vol: 0.55, len: 10},
  {at: 395, src: pop, vol: 0.55, len: 10},
  {at: 404, src: pop, vol: 0.55, len: 10},
  {at: 413, src: pop, vol: 0.55, len: 10},
  {at: 422, src: pop, vol: 0.6, len: 10},

  // S5 — 3 phones rise
  {at: 597, src: pop, vol: 0.6, len: 10},
  {at: 605, src: pop, vol: 0.6, len: 10},
  {at: 613, src: pop, vol: 0.6, len: 10},

  // S6 — "Don't DM Now." stamp, reply line, name
  {at: 782, src: thud, vol: 0.95, len: 30},
  {at: 810, src: ding, vol: 0.4, len: 30},
  {at: 832, src: ding, vol: 0.5, len: 30},
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
