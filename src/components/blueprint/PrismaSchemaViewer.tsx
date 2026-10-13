/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Database, Copy, Check, ShieldAlert, Sparkles, Layers } from 'lucide-react';
import { PRISMA_SCHEMA_CODE, ARCHITECTURAL_ANALYSIS } from '../../data/prismaSchemaCode';

export const PrismaSchemaViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'schema' | 'comparison' | 'er-relations'>('schema');
  const [copied, setCopied] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<string>('ALL');

  const handleCopy = () => {
    navigator.clipboard.writeText(PRISMA_SCHEMA_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const modelsList = ['ALL', 'Episode', 'AudioTrack', 'Subtitle', 'WatchHistory', 'Season', 'Anime', 'User'];

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-6 backdrop-blur-md">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
            <Database className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">Prisma Schema Blueprint</h2>
              <span className="rounded-full bg-purple-500/20 border border-purple-500/30 px-2.5 py-0.5 text-xs font-semibold text-purple-300">
                PostgreSQL + Supabase
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Eliminating pseudo-seasons via 1:N Episode AudioTrack & Subtitle relationships
            </p>
          </div>
        </div>

        {/* Tab switcher & Copy button */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl bg-neutral-950/80 p-1 border border-neutral-800">
            <button
              onClick={() => setActiveTab('schema')}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                activeTab === 'schema'
                  ? 'bg-neutral-800 text-purple-400 shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              schema.prisma
            </button>
            <button
              onClick={() => setActiveTab('comparison')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                activeTab === 'comparison'
                  ? 'bg-neutral-800 text-rose-400 shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              Vs Crunchyroll Flaws
            </button>
            <button
              onClick={() => setActiveTab('er-relations')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                activeTab === 'er-relations'
                  ? 'bg-neutral-800 text-blue-400 shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              ER Relations
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-800 px-3.5 py-2 text-xs font-medium text-white hover:bg-neutral-700 transition-all shadow-sm"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy Schema'}
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'schema' && (
        <div className="mt-5 space-y-4">
          {/* Model quick navigation filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-neutral-500 font-medium">Focus Model:</span>
            {modelsList.map((m) => (
              <button
                key={m}
                onClick={() => setSelectedModel(m)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                  selectedModel === m
                    ? 'bg-purple-500 text-white'
                    : 'bg-neutral-800/80 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Code Viewer */}
          <div className="relative rounded-xl border border-neutral-800 bg-neutral-950 p-4 font-mono text-xs overflow-x-auto max-h-[560px]">
            <pre className="text-neutral-300 leading-relaxed">
              <code>{PRISMA_SCHEMA_CODE}</code>
            </pre>
          </div>
        </div>
      )}

      {activeTab === 'comparison' && (
        <div className="mt-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ARCHITECTURAL_ANALYSIS.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-neutral-800 bg-neutral-950/70 p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-rose-500/20 text-rose-400 text-xs font-bold">
                      {idx + 1}
                    </span>
                    <h3 className="font-semibold text-white text-sm">{item.title}</h3>
                  </div>

                  <div className="space-y-3 text-xs leading-relaxed">
                    <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-2.5 text-neutral-300">
                      <span className="font-semibold text-rose-400 block mb-1">Legacy Pitfall:</span>
                      {item.issue}
                    </div>

                    <div className="rounded-lg bg-neutral-900 border border-neutral-800 p-2.5 text-neutral-400">
                      <span className="font-semibold text-neutral-300 block mb-1">User/System Impact:</span>
                      {item.consequence}
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-2.5 text-xs text-neutral-200">
                  <span className="font-semibold text-emerald-400 flex items-center gap-1 mb-1">
                    <Sparkles className="h-3.5 w-3.5" /> AniZone Solution:
                  </span>
                  {item.solutionInAniZone}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 text-xs font-mono text-neutral-300">
            <span className="text-rose-400 font-semibold block mb-2">
              Crunchyroll Schema Legacy Pattern (ANTI-PATTERN):
            </span>
            <p className="text-neutral-500 mb-2">
              // Bad: Duplicating seasons just to change audio dub language:
            </p>
            <p className="text-rose-300">
              Season &#123; id: &quot;s1-jp&quot;, title: &quot;Season 1&quot; &#125;<br />
              Season &#123; id: &quot;s1-en&quot;, title: &quot;Season 1 (English Dub)&quot; &#125;<br />
              Season &#123; id: &quot;s1-es&quot;, title: &quot;Season 1 (Spanish Dub)&quot; &#125;
            </p>
            <div className="my-3 border-t border-neutral-800" />
            <span className="text-emerald-400 font-semibold block mb-2">
              AniZone Normalized Pattern (PRODUCTION ARCHITECTURE):
            </span>
            <p className="text-neutral-500 mb-2">
              // Good: Season represents narrative arcs. Episodes have 1:N AudioTracks &amp; Subtitles:
            </p>
            <p className="text-emerald-300">
              Season &#123; seasonNumber: 1, title: &quot;Season 1: Arise&quot; &#125;<br />
              &nbsp;&nbsp;└── Episode &#123; episodeNumber: 1, title: &quot;I&apos;m Used to It&quot; &#125;<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── AudioTrack &#123; languageCode: &quot;ja-JP&quot;, label: &quot;Japanese (Original)&quot;, isDefault: true &#125;<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── AudioTrack &#123; languageCode: &quot;en-US&quot;, label: &quot;English Dub&quot; &#125;<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── Subtitle &#123; languageCode: &quot;en-US&quot;, type: &quot;FULL&quot;, vttUrl: &quot;...&quot; &#125;<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── Subtitle &#123; languageCode: &quot;en-US&quot;, type: &quot;SIGNS_SONGS&quot;, vttUrl: &quot;...&quot; &#125;
            </p>
          </div>
        </div>
      )}

      {activeTab === 'er-relations' && (
        <div className="mt-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
              <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-purple-400" />
                Relational Model Hierarchy
              </h4>
              <ul className="space-y-2 text-xs text-neutral-300 font-mono">
                <li className="p-2 rounded bg-neutral-900 border border-neutral-800">
                  <span className="text-purple-300">User</span> 1 : N <span className="text-blue-300">WatchHistory</span> (Composite key: userId + episodeId)
                </li>
                <li className="p-2 rounded bg-neutral-900 border border-neutral-800">
                  <span className="text-amber-300">Anime</span> 1 : N <span className="text-yellow-300">Season</span> (Unique constraint: animeId + seasonNumber)
                </li>
                <li className="p-2 rounded bg-neutral-900 border border-neutral-800">
                  <span className="text-yellow-300">Season</span> 1 : N <span className="text-rose-300">Episode</span> (Unique constraint: seasonId + episodeNumber)
                </li>
                <li className="p-2 rounded bg-neutral-900 border border-neutral-800">
                  <span className="text-rose-300">Episode</span> 1 : N <span className="text-emerald-300">AudioTrack</span> (Unique constraint: episodeId + languageCode)
                </li>
                <li className="p-2 rounded bg-neutral-900 border border-neutral-800">
                  <span className="text-rose-300">Episode</span> 1 : N <span className="text-teal-300">Subtitle</span> (Unique constraint: episodeId + languageCode + type)
                </li>
                <li className="p-2 rounded bg-neutral-900 border border-neutral-800">
                  <span className="text-rose-300">Episode</span> 1 : N <span className="text-blue-300">WatchHistory</span> (Atomic upsert head)
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
              <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                High-Performance Indexing Strategy
              </h4>
              <div className="space-y-2 text-xs text-neutral-300 leading-relaxed">
                <div className="p-2.5 rounded bg-neutral-900 border border-neutral-800">
                  <code className="text-emerald-400 font-mono">@@index([userId, lastWatchedAt(sort: Desc)])</code>
                  <p className="mt-1 text-neutral-400">
                    Powers the homepage &quot;Continue Watching&quot; carousel in sub-5ms with index-only scan on PostgreSQL.
                  </p>
                </div>
                <div className="p-2.5 rounded bg-neutral-900 border border-neutral-800">
                  <code className="text-emerald-400 font-mono">@@unique([userId, episodeId])</code>
                  <p className="mt-1 text-neutral-400">
                    Eliminates race conditions during concurrent playback heartbeats and allows atomic <code className="text-neutral-200">ON CONFLICT DO UPDATE</code>.
                  </p>
                </div>
                <div className="p-2.5 rounded bg-neutral-900 border border-neutral-800">
                  <code className="text-emerald-400 font-mono">@@index([status, releaseYear])</code>
                  <p className="mt-1 text-neutral-400">
                    Enables ultra-fast seasonal anime catalog filters (e.g. &quot;Top Fall 2024 Releasing&quot;).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
