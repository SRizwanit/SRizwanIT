import React from 'react';
import {AbsoluteFill} from 'remotion';
import {TransitionSeries} from '@remotion/transitions';
import {SCENE} from './theme';
import {SceneHook, SceneIntro, SceneApps, SceneWeb, SceneSkills, SceneOutro} from './Scenes';
import {AudioTrack} from './AudioTrack';
import {Camera, ColorGrade} from './Components';
import {PRESENTATIONS, TRANSITION_TIMING} from './Transitions';
import {SfxTrack} from './SfxTrack';
import './fonts'; // make sure every font loads

export const Video: React.FC = () => {
  return (
    <AbsoluteFill style={{background: '#fff'}}>
      <AbsoluteFill style={{filter: 'saturate(1.06) contrast(1.03)'}}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={SCENE.hook}>
          <Camera duration={SCENE.hook} push={0.035}>
            <SceneHook />
          </Camera>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={PRESENTATIONS[0]} timing={TRANSITION_TIMING} />
        <TransitionSeries.Sequence durationInFrames={SCENE.intro}>
          <Camera duration={SCENE.intro} push={0.03}>
            <SceneIntro />
          </Camera>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={PRESENTATIONS[1]} timing={TRANSITION_TIMING} />
        <TransitionSeries.Sequence durationInFrames={SCENE.apps}>
          <Camera duration={SCENE.apps} push={0.035}>
            <SceneApps />
          </Camera>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={PRESENTATIONS[2]} timing={TRANSITION_TIMING} />
        <TransitionSeries.Sequence durationInFrames={SCENE.web}>
          <Camera duration={SCENE.web} push={0.035}>
            <SceneWeb />
          </Camera>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={PRESENTATIONS[3]} timing={TRANSITION_TIMING} />
        <TransitionSeries.Sequence durationInFrames={SCENE.skills}>
          <Camera duration={SCENE.skills} push={0.035}>
            <SceneSkills />
          </Camera>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={PRESENTATIONS[4]} timing={TRANSITION_TIMING} />
        <TransitionSeries.Sequence durationInFrames={SCENE.outro}>
          <Camera duration={SCENE.outro} push={0.035}>
            <SceneOutro />
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
