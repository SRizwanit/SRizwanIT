import React from 'react';
import {Composition, Still} from 'remotion';
import {Video} from './Video';
import {VideoVertical} from './VideoVertical';
import {VideoFeed} from './VideoFeed';
import {Cover} from './Cover';
import {DURATION, F_HEIGHT, F_WIDTH, FPS, HEIGHT, V_HEIGHT, V_WIDTH, WIDTH} from './theme';

// "Intro"         16:9  1920x1080 (HD)  ->  4K = same composition with --scale=2
// "IntroVertical" 9:16  1080x1920 (HD only)  -> Reels / Stories / Shorts
// "IntroFeed"     4:5   1080x1350 (HD only)  -> Facebook / Instagram FEED
// "Cover*"        one still image (thumbnail) for each format
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="Intro" component={Video} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="IntroVertical" component={VideoVertical} durationInFrames={DURATION} fps={FPS} width={V_WIDTH} height={V_HEIGHT} />
      <Composition id="IntroFeed" component={VideoFeed} durationInFrames={DURATION} fps={FPS} width={F_WIDTH} height={F_HEIGHT} />
      <Still id="CoverWide" component={Cover} width={WIDTH} height={HEIGHT} />
      <Still id="CoverVertical" component={Cover} width={V_WIDTH} height={V_HEIGHT} />
      <Still id="CoverFeed" component={Cover} width={F_WIDTH} height={F_HEIGHT} />
    </>
  );
};
