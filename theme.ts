// Design canvas is ALWAYS 1920x1080.
// HD  render: scale 1  -> 1920x1080
// 4K  render: --scale=2 -> 3840x2160
export const WIDTH = 1920;
export const HEIGHT = 1080;
// 9:16 vertical (HD only): 1080x1920
export const V_WIDTH = 1080;
export const V_HEIGHT = 1920;
export const FPS = 30;
export const DURATION = 900; // 30s

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
// sum(durations) - (scenes-1)*TRANSITION = 900.
export const TRANSITION = 12;
export const SCENE = {
  hook: 120, //  S1  Looking for introvert App & Developer
  intro: 258, // S2+S3 ONE continuous scene: Hello I'm Rizwan -> focus on photo -> pop-ups, role, CTA
  apps: 255, //  S4  7 apps
  web: 185, //   S5  3 websites
  outro: 130, // S6  Don't DM Now.
} as const;

export const SCENE_SUM = Object.values(SCENE).reduce((a, b) => a + b, 0);
const TOTAL = SCENE_SUM - (Object.keys(SCENE).length - 1) * TRANSITION;
if (TOTAL !== DURATION) {
  throw new Error(`Timeline mismatch: ${TOTAL} frames, expected ${DURATION}`);
}

export const FILL_BG = `linear-gradient(180deg, ${C.teal500} 0%, ${C.teal500} 70%, ${C.teal300} 130%)`;

// Absolute start frame of each scene (used so backgrounds stay in sync across scene cuts).
export const START = {
  intro: SCENE.hook - TRANSITION, //                      108
  apps: SCENE.hook - TRANSITION + SCENE.intro - TRANSITION, // 354
  web: SCENE.hook + SCENE.intro + SCENE.apps - 3 * TRANSITION, // 597
} as const;
