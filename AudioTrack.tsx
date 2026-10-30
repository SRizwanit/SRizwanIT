import React from 'react';
import {Audio, interpolate, useVideoConfig} from 'remotion';
import bgm from './background.mp3';
import {START} from './theme';

// C7: background.mp3 must be in the repo root.
// 1s fade-in, 1.5s fade-out, peak volume = MUSIC_VOLUME (quiet bed under the SFX).
// `loop`: if background.mp3 is shorter than the video it repeats automatically until the video ends.
export const MUSIC_VOLUME = 0.2; // change this one number to taste

// DUCKING: the music dips to DUCK_LEVEL (x its normal volume) around the two key moments,
// so the "Rizwan" ding and the "Don't DM Now" thud are clearly heard.
const DUCK_AT = [START.intro + 44, START.outro + 12];
const DUCK_LEVEL = 0.45;
const duck = (f: number) => {
  let d = 1;
  for (const c of DUCK_AT) {
    d = Math.min(d, interpolate(Math.abs(f - c), [0, 8, 26], [DUCK_LEVEL, DUCK_LEVEL, 1], {extrapolateRight: 'clamp'}));
  }
  return d;
};

export const AudioTrack: React.FC = () => {
  const {durationInFrames, fps} = useVideoConfig();
  return (
    <Audio
      src={bgm}
      loop
      volume={(f: number) =>
        interpolate(f, [0, fps, durationInFrames - fps * 1.5, durationInFrames], [0, MUSIC_VOLUME, MUSIC_VOLUME, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        }) * duck(f)
      }
    />
  );
};
