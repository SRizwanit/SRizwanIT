import {Config} from '@remotion/cli/config';

// NOTE: no public dir / no sub-folders. Images + mp3 are imported directly
// from the repo root (e.g. `import me from './mypicture.jpg'`).
Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setCodec('h264');
