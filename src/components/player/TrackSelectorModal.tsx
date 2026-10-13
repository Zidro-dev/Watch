/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Volume2, MessageSquare, Check, X } from 'lucide-react';
import { AudioTrack, SubtitleTrack, AudioLanguage, SubtitleLanguage } from '../../types/anime';

interface TrackSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  audioTracks: AudioTrack[];
  subtitleTracks: SubtitleTrack[];
  selectedAudio: AudioLanguage;
  selectedSubtitle: SubtitleLanguage;
  onSelectAudio: (code: AudioLanguage) => void;
  onSelectSubtitle: (code: SubtitleLanguage) => void;
}

export const TrackSelectorModal: React.FC<TrackSelectorModalProps> = ({
  isOpen,
  onClose,
  audioTracks,
  subtitleTracks,
  selectedAudio,
  selectedSubtitle,
  onSelectAudio,
  onSelectSubtitle,
}) => {
  const [activeTab, setActiveTab] = useState<'audio' | 'subtitles'>('audio');

  if (!isOpen) return null;

  return (
    <div
      className="absolute inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 transition-opacity animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-900/95 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
              <MessageSquare className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-white">Audio & Subtitle Settings</h3>
              <p className="text-xs text-neutral-400">Multi-language tracks on a single episode</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="mt-4 flex rounded-xl bg-neutral-950/80 p-1 border border-neutral-800/80">
          <button
            onClick={() => setActiveTab('audio')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-all ${
              activeTab === 'audio'
                ? 'bg-neutral-800 text-rose-400 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Volume2 className="h-4 w-4" />
            Audio Dub ({audioTracks.length})
          </button>
          <button
            onClick={() => setActiveTab('subtitles')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-all ${
              activeTab === 'subtitles'
                ? 'bg-neutral-800 text-rose-400 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            Subtitles ({subtitleTracks.length + 1})
          </button>
        </div>

        {/* Track Lists */}
        <div className="mt-4 max-h-72 overflow-y-auto space-y-2 pr-1">
          {activeTab === 'audio' && (
            <div className="space-y-1.5">
              {audioTracks.map((track) => {
                const isSelected = selectedAudio === track.languageCode;
                return (
                  <button
                    key={track.id}
                    onClick={() => {
                      onSelectAudio(track.languageCode);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition-all ${
                      isSelected
                        ? 'border border-rose-500/40 bg-rose-500/10 text-white'
                        : 'border border-transparent bg-neutral-950/40 text-neutral-300 hover:bg-neutral-800/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{track.languageName}</span>
                        {track.isDefault && (
                          <span className="rounded bg-neutral-800 px-1.5 py-0.5 text-[10px] font-semibold text-neutral-400">
                            Original
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 text-xs text-neutral-500">
                        {track.codec.toUpperCase()} • {track.channels || 'Stereo'}
                      </div>
                    </div>
                    {isSelected && <Check className="h-5 w-5 text-rose-400" />}
                  </button>
                );
              })}
            </div>
          )}

          {activeTab === 'subtitles' && (
            <div className="space-y-1.5">
              {/* Off Option */}
              <button
                onClick={() => onSelectSubtitle('off')}
                className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition-all ${
                  selectedSubtitle === 'off'
                    ? 'border border-rose-500/40 bg-rose-500/10 text-white'
                    : 'border border-transparent bg-neutral-950/40 text-neutral-300 hover:bg-neutral-800/60'
                }`}
              >
                <div>
                  <span className="font-medium text-sm">Off</span>
                  <div className="text-xs text-neutral-500">Disable on-screen captions</div>
                </div>
                {selectedSubtitle === 'off' && <Check className="h-5 w-5 text-rose-400" />}
              </button>

              {subtitleTracks.map((track) => {
                const isSelected = selectedSubtitle === track.languageCode;
                return (
                  <button
                    key={track.id}
                    onClick={() => onSelectSubtitle(track.languageCode)}
                    className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition-all ${
                      isSelected
                        ? 'border border-rose-500/40 bg-rose-500/10 text-white'
                        : 'border border-transparent bg-neutral-950/40 text-neutral-300 hover:bg-neutral-800/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{track.languageName}</span>
                        <span className="rounded bg-neutral-800 px-1.5 py-0.5 text-[10px] font-semibold text-neutral-400">
                          {track.type === 'FULL' ? 'Full Dialogue' : track.type}
                        </span>
                      </div>
                      <div className="mt-0.5 text-xs text-neutral-500">
                        {track.format} • In-sync styled overlay
                      </div>
                    </div>
                    {isSelected && <Check className="h-5 w-5 text-rose-400" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info note */}
        <div className="mt-5 border-t border-neutral-800/80 pt-3 text-[11px] text-neutral-400 flex items-center justify-between">
          <span>✨ No fake duplicated seasons needed</span>
          <button
            onClick={onClose}
            className="rounded-lg bg-rose-500 px-4 py-1.5 font-medium text-white hover:bg-rose-600 transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};
