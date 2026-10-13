/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Play, CheckCircle2, Clock } from 'lucide-react';
import { Episode } from '../../types/anime';

interface EpisodeRailProps {
  episodes: Episode[];
  activeEpisodeId: string;
  onSelectEpisode: (episode: Episode) => void;
  watchHistoryMap: Record<string, number>; // episodeId -> progressSeconds
}

export const EpisodeRail: React.FC<EpisodeRailProps> = ({
  episodes,
  activeEpisodeId,
  onSelectEpisode,
  watchHistoryMap,
}) => {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    return `${m}m`;
  };

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
        <div>
          <h3 className="text-base font-semibold text-white">Season Episodes</h3>
          <p className="text-xs text-neutral-400">{episodes.length} Episodes available</p>
        </div>
        <span className="rounded-full bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-rose-400">
          Single Season • Multi-Dub
        </span>
      </div>

      <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
        {episodes.map((ep) => {
          const isActive = ep.id === activeEpisodeId;
          const progress = watchHistoryMap[ep.id] || 0;
          const percent = Math.min(100, Math.round((progress / ep.durationSec) * 100));
          const isDone = percent >= 90;

          return (
            <div
              key={ep.id}
              onClick={() => onSelectEpisode(ep)}
              className={`group flex items-start gap-3.5 rounded-xl p-2.5 transition-all cursor-pointer border ${
                isActive
                  ? 'border-rose-500/60 bg-rose-500/10'
                  : 'border-neutral-800/60 bg-neutral-950/40 hover:bg-neutral-800/40'
              }`}
            >
              {/* Thumbnail with overlay & progress bar */}
              <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg bg-neutral-900">
                <img
                  src={ep.thumbnail}
                  alt={ep.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Progress bar along bottom of thumbnail */}
                {percent > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/60">
                    <div
                      className={`h-full ${isDone ? 'bg-emerald-500' : 'bg-rose-500'}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                )}

                {/* Play hover badge */}
                <div
                  className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity ${
                    isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg">
                    <Play className="h-4 w-4 ml-0.5 fill-white" />
                  </div>
                </div>

                {isDone && (
                  <div className="absolute top-1.5 left-1.5 rounded-full bg-black/70 p-0.5 text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                )}

                <div className="absolute bottom-1.5 right-1.5 rounded bg-black/80 px-1 py-0.5 text-[10px] font-mono text-neutral-300 flex items-center gap-0.5">
                  <Clock className="h-2.5 w-2.5" />
                  {formatTime(ep.durationSec)}
                </div>
              </div>

              {/* Text Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold ${
                      isActive ? 'text-rose-400' : 'text-neutral-400'
                    }`}
                  >
                    EP {ep.episodeNumber}
                  </span>
                  <span className="text-xs font-semibold text-white truncate">{ep.title}</span>
                </div>

                <p className="mt-1 text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                  {ep.synopsis}
                </p>

                {/* Dub availability flags */}
                <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px]">
                  <span className="rounded bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 text-neutral-300">
                    {ep.audioTracks.length} Audio Dubs
                  </span>
                  <span className="rounded bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 text-neutral-300">
                    {ep.subtitles.length} Subtitles
                  </span>
                  {ep.introStartSec !== undefined && (
                    <span className="rounded bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 text-amber-300">
                      Skip Intro
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
