/**
 * Attribution record for every stock photograph used in src/data/imageManifest.js.
 * Keep this in sync whenever an image in the manifest changes.
 */
import { stockImages } from './imageManifest';

export const imageCredits = Object.entries(stockImages).map(([key, img]) => ({
  key,
  sourcePage: img.sourcePage,
  alt: img.alt,
  license: 'Pexels License (free for commercial use, no attribution required)',
}));
