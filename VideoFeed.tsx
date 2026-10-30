import React from 'react';
import {AbsoluteFill} from 'remotion';
import {TransitionSeries} from '@remotion/transitions';
import {SCENE} from './theme';
import {SceneHookF, SceneIntroF, SceneAppsF, SceneWebF, SceneSkillsF, SceneOutroF} from './ScenesFeed';
import {AudioTrack} from './AudioTrack';
import {Camera, ColorGrade} from './Components';
import {PRESENTATIONS, TRANSITION_TIMING} from './Transitions';
import {SfxTrack} from './SfxTrack';
import './fonts';

// 4:5 FEED version (1080x1350). SAME timeline (DURATION frames) => same music + same SFX frames as the 16:9 video.
export const VideoFeed: React.FC = () => {
  return (
    <AbsoluteFill style={{background: '#fff'}}>
      <AbsoluteFill style={{filter: 'saturate(1.06) contrast(1.03)'}}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={SCENE.hook}>
          <Camera duration={SCENE.hook} push={0.035}>
            <SceneHookF />
          </Camera>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={PRESENTATIONS[0]} timing={TRANSITION_TIMING} />
        <TransitionSeries.Sequence durationInFrames={SCENE.intro}>
          <Camera duration={SCENE.intro} push={0.03}>
            <SceneIntroF />
          </Camera>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={PRESENTATIONS[1]} timing={TRANSITION_TIMING} />
        <TransitionSeries.Sequence durationInFrames={SCENE.apps}>
          <Camera duration={SCENE.apps} push={0.035}>
            <SceneAppsF />
          </Camera>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={PRESENTATIONS[2]} timing={TRANSITION_TIMING} />
        <TransitionSeries.Sequence durationInFrames={SCENE.web}>
          <Camera duration={SCENE.web} push={0.035}>
            <SceneWebF />
          </Camera>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={PRESENTATIONS[3]} timing={TRANSITION_TIMING} />
        <TransitionSeries.Sequence durationInFrames={SCENE.skills}>
          <Camera duration={SCENE.skills} push={0.035}>
            <SceneSkillsF />
          </Camera>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={PRESENTATIONS[4]} timing={TRANSITION_TIMING} />
        <TransitionSeries.Sequence durationInFrames={SCENE.outro}>
          <Camera duration={SCENE.outro} push={0.035}>
            <SceneOutroF />
          </Camera>
        </TransitionSeries.Sequence>
      </TransitionSeries>
      </AbsoluteFill>
      <ColorGrade />
      <AudioTrack />
      <SfxTrack />
    </AbsoluteFill>
  );
};
