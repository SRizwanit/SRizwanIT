import React from 'react';
import {AbsoluteFill, Easing} from 'remotion';
import {linearTiming} from '@remotion/transitions';
import type {TransitionPresentation, TransitionPresentationComponentProps} from '@remotion/transitions';
import {slide} from '@remotion/transitions/slide';
import {wipe} from '@remotion/transitions/wipe';
import {TRANSITION} from './theme';

/* zoomBlur: the old scene zooms OUT-of-frame while blurring, the new scene settles in from a soft blur. */
type ZoomBlurProps = {maxBlur?: number; zoom?: number};
const ZoomBlurView: React.FC<TransitionPresentationComponentProps<ZoomBlurProps>> = ({children, presentationDirection, presentationProgress, passedProps}) => {
  const {maxBlur = 14, zoom = 0.18} = passedProps;
  const p = presentationProgress; // already eased by the timing below
  const entering = presentationDirection === 'entering';
  const scale = entering ? 1 - zoom * 0.6 * (1 - p) : 1 + zoom * p;
  const blur = entering ? maxBlur * (1 - p) : maxBlur * p;
  const opacity = entering ? Math.min(1, p * 1.8) : 1; // the old scene stays solid underneath (no white dip)
  return (
    <AbsoluteFill style={{opacity, transform: `scale(${scale})`, filter: blur > 0.1 ? `blur(${blur}px)` : undefined}}>{children}</AbsoluteFill>
  );
};
export const zoomBlur = (props: ZoomBlurProps = {}): TransitionPresentation<ZoomBlurProps> => ({component: ZoomBlurView, props});

// Same length as before (TRANSITION = 12 frames), but with a smooth bezier curve instead of linear.
export const TRANSITION_TIMING = linearTiming({durationInFrames: TRANSITION, easing: Easing.inOut(Easing.cubic)});

// One list, used by all 3 formats (16:9, 9:16, 4:5): [hook>intro, intro>apps, apps>web, web>skills, skills>outro]
export const PRESENTATIONS = [
  zoomBlur(),
  wipe({direction: 'from-left'}),
  slide({direction: 'from-bottom'}),
  slide({direction: 'from-right'}),
  zoomBlur({zoom: 0.25, maxBlur: 18}),
] as const;
