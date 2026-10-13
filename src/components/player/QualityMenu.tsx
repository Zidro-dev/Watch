/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Check, Settings, X, Cpu } from 'lucide-react';
import { QualityLevel } from '../../types/anime';

interface QualityMenuProps {
  isOpen: boolean;
  onClose: () => void;
  levels: QualityLevel[];
  currentLevelIndex: number;
  autoLevelHeight?: number;
  onSelectLevel: (levelIndex: number) => void;
}

export const QualityMenu: React.FC<QualityMenuProps> = ({
  isOpen,
  onClose,
  levels,
  currentLevelIndex,
  autoLevelHeight,
  onSelectLevel,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="absolute inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 transition-opacity animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl border border-neutral-800 bg-neutral-900/95 p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400">
              <Settings className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-base font-semibold text-white">Stream Quality</h3>
              <p className="text-[11px] text-neutral-400">Adaptive Bitrate (HLS ABR)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 space-y-1.5">
          {/* Auto (ABR) Level */}
          <button
            onClick={() => {
              onSelectLevel(-1);
              onClose();
            }}
            className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left transition-all ${
              currentLevelIndex === -1
                ? 'border border-rose-500/40 bg-rose-500/10 text-white'
                : 'border border-transparent bg-neutral-950/40 text-neutral-300 hover:bg-neutral-800/60'
            }`}
          >
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-emerald-400" />
              <div>
                <span className="font-medium text-sm">Auto (Adaptive)</span>
                {autoLevelHeight && (
                  <span className="ml-2 text-xs text-neutral-400">
                    Currently: {autoLevelHeight}p
                  </span>
                )}
              </div>
            </div>
            {currentLevelIndex === -1 && <Check className="h-4 w-4 text-rose-400" />}
          </button>

          {/* Explicit Ladders */}
          {levels.map((lvl) => {
            const isSelected = currentLevelIndex === lvl.levelIndex;
            return (
              <button
                key={lvl.levelIndex}
                onClick={() => {
                  onSelectLevel(lvl.levelIndex);
                  onClose();
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left transition-all ${
                  isSelected
                    ? 'border border-rose-500/40 bg-rose-500/10 text-white'
                    : 'border border-transparent bg-neutral-950/40 text-neutral-300 hover:bg-neutral-800/60'
                }`}
              >
                <div>
                  <span className="font-medium text-sm">{lvl.label}</span>
                  {lvl.bitrate > 0 && (
                    <span className="ml-2 text-[11px] text-neutral-500">
                      ~{(lvl.bitrate / 1000000).toFixed(1)} Mbps
                    </span>
                  )}
                </div>
                {isSelected && <Check className="h-4 w-4 text-rose-400" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
