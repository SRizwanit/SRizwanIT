import React from 'react';
import {AbsoluteFill} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import {SCENE, TRANSITION} from './theme';
import {SceneHookF, SceneIntroF, SceneAppsF, SceneWebF, SceneSkillsF, SceneOutroF} from './ScenesFeed';
import {AudioTrack} from './AudioTrack';
import {ColorGrade} from './Components';
import {SfxTrack} from './SfxTrack';
import './fonts';

const t = linearTiming({durationInFrames: TRANSITION});

// 4:5 FEED version (1080x1350). SAME timeline (DURATION frames) => same music + same SFX frames as the 16:9 video.
export const VideoFeed: React.FC = () => {
  return (
    <AbsoluteFill style={{background: '#fff'}}>
      <AbsoluteFill style={{filter: 'saturate(1.06) contrast(1.03)'}}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={SCENE.hook}>
          <SceneHookF />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence durationInFrames={SCENE.intro}>
          <SceneIntroF />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence durationInFrames={SCENE.apps}>
          <SceneAppsF />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({direction: 'from-bottom'})} timing={t} />
        <TransitionSeries.Sequence durationInFrames={SCENE.web}>
          <SceneWebF />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({direction: 'from-bottom'})} timing={t} />
        <TransitionSeries.Sequence durationInFrames={SCENE.skills}>
          <SceneSkillsF />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence durationInFrames={SCENE.outro}>
          <SceneOutroF />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      </AbsoluteFill>
      <ColorGrade />
      <AudioTrack />
      <SfxTrack />
    </AbsoluteFill>
  );
};
