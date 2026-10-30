import React from 'react';
import {AbsoluteFill} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import {SCENE, TRANSITION} from './theme';
import {SceneHookV, SceneIntroV, SceneAppsV, SceneWebV, SceneSkillsV, SceneOutroV} from './ScenesVertical';
import {AudioTrack} from './AudioTrack';
import {ColorGrade} from './Components';
import {SfxTrack} from './SfxTrack';
import './fonts';

const t = linearTiming({durationInFrames: TRANSITION});

// 9:16 version. SAME timeline (DURATION frames) => same music + same SFX frames as the 16:9 video.
export const VideoVertical: React.FC = () => {
  return (
    <AbsoluteFill style={{background: '#fff'}}>
      <AbsoluteFill style={{filter: 'saturate(1.06) contrast(1.03)'}}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={SCENE.hook}>
          <SceneHookV />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence durationInFrames={SCENE.intro}>
          <SceneIntroV />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence durationInFrames={SCENE.apps}>
          <SceneAppsV />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({direction: 'from-bottom'})} timing={t} />
        <TransitionSeries.Sequence durationInFrames={SCENE.web}>
          <SceneWebV />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({direction: 'from-bottom'})} timing={t} />
        <TransitionSeries.Sequence durationInFrames={SCENE.skills}>
          <SceneSkillsV />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence durationInFrames={SCENE.outro}>
          <SceneOutroV />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      </AbsoluteFill>
      <ColorGrade />
      <AudioTrack />
      <SfxTrack />
    </AbsoluteFill>
  );
};
