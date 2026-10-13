/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PlayCircle, Database, FolderTree, Activity, Server, Film } from 'lucide-react';
import { ANIME_CATALOG } from '../../data/animeCatalog';
import { Anime } from '../../types/anime';

export type ActiveView = 'player' | 'telemetry' | 'prisma' | 'structure' | 'api';

interface NavbarProps {
  activeView: ActiveView;
  onViewChange: (view: ActiveView) => void;
  selectedAnime: Anime;
  onSelectAnime: (anime: Anime) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  onViewChange,
  selectedAnime,
  onSelectAnime,
}) => {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-800/80 bg-neutral-950/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 text-white shadow-lg shadow-rose-500/25">
            <PlayCircle className="h-6 w-6 fill-white/20 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-white">
                Ani<span className="text-rose-500">Zone</span>
              </span>
              <span className="rounded-full bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-400">
                Architect Edition
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 hidden sm:block">
              Crunchyroll-Fix Architecture &amp; HLS Player Engine
            </p>
          </div>
        </div>

        {/* View Switcher Navigation */}
        <nav className="flex items-center rounded-xl bg-neutral-900/90 p-1 border border-neutral-800/80">
          <button
            onClick={() => onViewChange('player')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeView === 'player'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Film className="h-3.5 w-3.5" />
            <span>Player</span>
          </button>

          <button
            onClick={() => onViewChange('telemetry')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeView === 'telemetry'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Sync</span>
            <span>Telemetry</span>
          </button>

          <button
            onClick={() => onViewChange('prisma')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeView === 'prisma'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Database className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Prisma</span>
            <span>Schema</span>
          </button>

          <button
            onClick={() => onViewChange('structure')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeView === 'structure'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <FolderTree className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Next.js</span>
            <span>Structure</span>
          </button>

          <button
            onClick={() => onViewChange('api')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeView === 'api'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Server className="h-3.5 w-3.5" />
            <span className="hidden md:inline">API</span>
            <span>Route</span>
          </button>
        </nav>

        {/* Anime Switcher Selector */}
        <div className="hidden lg:flex items-center gap-2">
          <span className="text-xs text-neutral-400">Series:</span>
          <select
            value={selectedAnime.id}
            onChange={(e) => {
              const a = ANIME_CATALOG.find((cat) => cat.id === e.target.value);
              if (a) onSelectAnime(a);
            }}
            className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white focus:border-rose-500 focus:outline-none"
          >
            {ANIME_CATALOG.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.title}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
};
