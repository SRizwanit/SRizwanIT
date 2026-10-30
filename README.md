# Rizwan Intro Video (Remotion)

~35s, Teal. Three formats from ONE timeline (same music + SFX):

| Composition      | Size        | Use                                  |
|------------------|-------------|--------------------------------------|
| `Intro`          | 1920x1080   | 16:9 (HD, or 4K with `--scale=2`)    |
| `IntroVertical`  | 1080x1920   | 9:16 Reels / Stories / Shorts        |
| `IntroFeed`      | 1080x1350   | 4:5 Facebook / Instagram FEED        |
| `CoverWide/Vertical/Feed` | still | thumbnails (one PNG per format) |

## Render (mobile-friendly)
1. Repo -> **Actions** -> **Render Rizwan Video** -> **Run workflow**
2. `mode`: `stills` / `vertical-stills` / `feed-stills` (preview 8 frames) -> then `hd` / `4k` / `both` / `vertical` / `feed`
3. `mode = covers` renders the 3 thumbnails (PNG)
4. Download from the run's **Artifacts** (or tick `release` for a GitHub Release)

## Add your contact details (end scene)
Open `theme.ts` -> `CONTACT` and un-comment / edit the lines. They appear automatically in all 3 formats. Empty list = nothing shown.

## Notes
- All icons are SVG vectors (`Icons.tsx`): no emoji, no icon fonts.
- `theme.ts` holds scene timing; `DURATION` is computed. `SfxTrack.tsx` places sounds relative to each scene, so moving a scene keeps the sounds in sync.

## Current copy (all 3 formats)
- Hook: **Introducing** / Introvert App & Developer
- Badges: **Android & iOS Apps**, Websites, IslamiPedia AI
- Skills scene: 5 skill cards only (no "7 Apps / 3 Websites" counters)
- Outro: Please don't DM Now. (I'll reply when I'm in the mood)
- Colors: `C.teal900` only on the hook word "Introducing"; all other dark text/icons use `C.slate` (`theme.ts`)

Master plan: see `RizwanVideo.md`.
