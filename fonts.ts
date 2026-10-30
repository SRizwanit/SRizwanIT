// Every English text gets its own font. All Bengali text uses Anek Bangla.
// Loaded from the Google Fonts CDN via @remotion/google-fonts.
import {loadFont as anek} from '@remotion/google-fonts/AnekBangla';
import {loadFont as spaceGrotesk} from '@remotion/google-fonts/SpaceGrotesk';
import {loadFont as unbounded} from '@remotion/google-fonts/Unbounded';
import {loadFont as syne} from '@remotion/google-fonts/Syne';
import {loadFont as fraunces} from '@remotion/google-fonts/Fraunces';
import {loadFont as bricolage} from '@remotion/google-fonts/BricolageGrotesque';
import {loadFont as jetbrains} from '@remotion/google-fonts/JetBrainsMono';
import {loadFont as outfit} from '@remotion/google-fonts/Outfit';
import {loadFont as playfair} from '@remotion/google-fonts/PlayfairDisplay';
import {loadFont as sora} from '@remotion/google-fonts/Sora';
import {loadFont as bebas} from '@remotion/google-fonts/BebasNeue';
import {loadFont as cormorant} from '@remotion/google-fonts/CormorantGaramond';
import {loadFont as manrope} from '@remotion/google-fonts/Manrope';

export const F = {
  bn: anek('normal', {weights: ['500', '700', '800'], subsets: ['bengali', 'latin']}).fontFamily,
  lookingFor: spaceGrotesk('normal', {weights: ['500', '700']}).fontFamily,
  headline: unbounded('normal', {weights: ['700', '900']}).fontFamily,
  hello: syne('normal', {weights: ['700', '800']}).fontFamily,
  name: fraunces('italic', {weights: ['700', '900']}).fontFamily,
  role: bricolage('normal', {weights: ['600', '800']}).fontFamily,
  badge: jetbrains('normal', {weights: ['500', '700']}).fontFamily,
  cta: outfit('normal', {weights: ['600', '700']}).fontFamily,
  titleApps: playfair('normal', {weights: ['700', '900']}).fontFamily,
  titleWeb: sora('normal', {weights: ['700', '800']}).fontFamily,
  dm: bebas('normal', {weights: ['400']}).fontFamily,
  fullName: cormorant('normal', {weights: ['600', '700']}).fontFamily,
  tagline: manrope('normal', {weights: ['600', '800']}).fontFamily,
} as const;
