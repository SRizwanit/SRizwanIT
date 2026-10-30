import React from 'react';
import {Composition} from 'remotion';
import {Video} from './Video';
import {VideoVertical} from './VideoVertical';
import {DURATION, FPS, HEIGHT, V_HEIGHT, V_WIDTH, WIDTH} from './theme';

// "Intro"         16:9  1920x1080 (HD)  ->  4K = same composition with --scale=2
// "IntroVertical" 9:16  1080x1920 (HD only)
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="Intro" component={Video} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="IntroVertical" component={VideoVertical} durationInFrames={DURATION} fps={FPS} width={V_WIDTH} height={V_HEIGHT} />
    </>
  );
};
