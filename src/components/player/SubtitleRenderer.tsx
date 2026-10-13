/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SubtitleTrack } from '../../types/anime';

interface SubtitleRendererProps {
  currentSubtitleTrack?: SubtitleTrack;
  currentTime: number;
}

export const SubtitleRenderer: React.FC<SubtitleRendererProps> = ({
  currentSubtitleTrack,
  currentTime,
}) => {
  if (!currentSubtitleTrack || currentSubtitleTrack.languageCode === 'off') {
    return null;
  }

  // Find active cue based on current timestamp
  const activeCue = currentSubtitleTrack.cues?.find(
    (cue) => currentTime >= cue.start && currentTime <= cue.end
  );

  if (!activeCue) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute bottom-16 left-0 right-0 z-20 flex justify-center px-6">
      <div className="max-w-3xl text-center">
        <span className="anime-subtitle-text font-bold text-lg md:text-2xl text-amber-300 tracking-wide leading-relaxed px-4 py-1 rounded bg-black/30 backdrop-blur-[2px]">
          {activeCue.text}
        </span>
      </div>
    </div>
  );
};
