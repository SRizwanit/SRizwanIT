// Design canvas is ALWAYS 1920x1080 for the 16:9 version.
// HD  render: scale 1  -> 1920x1080
// 4K  render: --scale=2 -> 3840x2160
export const WIDTH = 1920;
export const HEIGHT = 1080;
// 9:16 vertical (HD only): 1080x1920  -> Reels / Stories / Shorts
export const V_WIDTH = 1080;
export const V_HEIGHT = 1920;
// 4:5 feed (HD only): 1080x1350  -> Facebook / Instagram FEED (recommended feed ratio)
export const F_WIDTH = 1080;
export const F_HEIGHT = 1350;
export const FPS = 30;

export const C = {
  teal900: '#04302E',
  teal700: '#0B6E6A',
  teal500: '#0FA3A0',
  teal300: '#5EEAD4',
  teal100: '#D7F5F1',
  ink: '#0A1F1E',
  paper: '#F4FFFD',
  white: '#FFFFFF',
  gold: '#F5B83D', // warm accent (replaces black on CTA)
  goldDeep: '#C98A12',
} as const;

// Scene timing. Scenes overlap by TRANSITION frames, so
// DURATION = sum(durations) - (scenes-1)*TRANSITION  (computed, no magic number).
export const TRANSITION = 12;
export const SCENE = {
  hook: 120, //   S1  Looking for introvert App & Developer
  intro: 258, //  S2+S3 ONE continuous scene: Hello I'm Rizwan -> focus on photo -> pop-ups, role, CTA
  apps: 255, //   S4  7 apps
  web: 185, //    S5  3 websites
  skills: 150, // S6  React Native / Flutter / Kotlin / Java / React + counters
  outro: 130, //  S7  Don't DM Now. (+ contact row)
} as const;

const ORDER = ['hook', 'intro', 'apps', 'web', 'skills', 'outro'] as const;
export const SCENE_SUM = ORDER.reduce((a, k) => a + SCENE[k], 0);
export const DURATION = SCENE_SUM - (ORDER.length - 1) * TRANSITION; // 1038 frames (~34.6 s)

// Absolute start frame of each scene (used so backgrounds / SFX stay in sync across scene cuts).
export const START = (() => {
  const out = {} as Record<(typeof ORDER)[number], number>;
  let t = 0;
  for (const k of ORDER) {
    out[k] = t;
    t += SCENE[k] - TRANSITION;
  }
  return out;
})();

// Pop-in timing shared by every format AND by SfxTrack (so the "pop" sounds always match the cards).
export const APP_FIRST = 14; //   frame (inside the Apps scene) where the first card pops
export const APP_STAGGER = 6; //  frames between cards
export const SKILL_FIRST = 10;
export const SKILL_STAGGER = 8;

export const FILL_BG = `linear-gradient(180deg, ${C.teal500} 0%, ${C.teal500} 70%, ${C.teal300} 130%)`;

// Facts used by the counters in the Skills scene.
export const STATS = {apps: 7, websites: 3} as const;

// Safe areas (px) for each format: keep important content inside these margins so the
// Reels / Stories / Feed UI (profile name, caption, buttons) never covers it.
export const SAFE = {
  vertical: {top: 220, bottom: 260},
  feed: {top: 60, bottom: 90},
  wide: {top: 40, bottom: 40},
} as const;

// CONTACT ROW (end scene). Add your real details here and they appear automatically in
// the last scene of ALL formats (16:9, 9:16, 4:5). Leave it empty and nothing is shown.
// icon: 'mail' | 'globe' | 'chat' | 'mobile' | 'code'
export type ContactItem = {icon: 'mail' | 'globe' | 'chat' | 'mobile' | 'code'; text: string};
export const CONTACT: ContactItem[] = [
  {icon: 'mail', text: 'rizwanit0102@gmail.com'},
  // {icon: 'globe', text: 'yourwebsite.com'},
  // {icon: 'code', text: 'github.com/yourname'},
];
