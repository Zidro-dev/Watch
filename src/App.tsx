/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback } from 'react';
import { Navbar, ActiveView } from './components/layout/Navbar';
import { HlsPlayer } from './components/player/HlsPlayer';
import { EpisodeRail } from './components/anime/EpisodeRail';
import { SyncTelemetryPanel } from './components/sync-monitor/SyncTelemetryPanel';
import { PrismaSchemaViewer } from './components/blueprint/PrismaSchemaViewer';
import { NextjsStructureViewer } from './components/blueprint/NextjsStructureViewer';
import { ApiRouteViewer } from './components/blueprint/ApiRouteViewer';
import { ANIME_CATALOG } from './data/animeCatalog';
import { Anime, Episode, AudioLanguage, SubtitleLanguage, SyncTelemetryEvent } from './types/anime';
import { useWatchProgressSync } from './hooks/useWatchProgressSync';
import {
  Sparkles,
  Keyboard,
  CheckCircle2,
  Tv,
  Zap,
} from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('player');
  const [selectedAnime, setSelectedAnime] = useState<Anime>(ANIME_CATALOG[0]);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode>(
    ANIME_CATALOG[0].seasons[0].episodes[0]
  );

  // Playback state
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(selectedEpisode.durationSec);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isTheaterMode, setIsTheaterMode] = useState<boolean>(false);
  const [selectedAudio, setSelectedAudio] = useState<AudioLanguage>('ja-JP');
  const [selectedSubtitle, setSelectedSubtitle] = useState<SubtitleLanguage>('en-US');

  // Watch history progress map (simulating local cache + DB state)
  const [watchHistoryMap, setWatchHistoryMap] = useState<Record<string, number>>({
    'ep-sl-01': 140,
    'ep-sl-02': 0,
  });

  // Telemetry logs for inspection
  const [telemetryLogs, setTelemetryLogs] = useState<SyncTelemetryEvent[]>([]);

  const handleTelemetryLog = useCallback((event: SyncTelemetryEvent) => {
    setTelemetryLogs((prev) => [event, ...prev.slice(0, 49)]); // keep last 50
    // Update local watch history
    setWatchHistoryMap((prev) => ({
      ...prev,
      [event.episodeId]: event.progressSeconds,
    }));
  }, []);

  // Production Sync Hook in action!
  const {
    lastSyncedProgress,
    lastSyncedTimestamp,
    isSyncing,
    syncCount,
    flushSyncNow,
  } = useWatchProgressSync({
    episodeId: selectedEpisode.id,
    durationSeconds: duration,
    currentTime,
    isPlaying,
    preferredAudioLang: selectedAudio,
    preferredSubtitleLang: selectedSubtitle,
    syncIntervalMs: 10000, // 10 seconds interval
    onTelemetryLog: handleTelemetryLog,
  });

  // Episode change handler
  const handleSelectEpisode = (ep: Episode) => {
    setSelectedEpisode(ep);
    setCurrentTime(0);
    setDuration(ep.durationSec);
    setIsPlaying(false);
  };

  // Anime change handler
  const handleSelectAnime = (anime: Anime) => {
    setSelectedAnime(anime);
    const firstEp = anime.seasons[0]?.episodes[0];
    if (firstEp) {
      setSelectedEpisode(firstEp);
      setCurrentTime(0);
      setDuration(firstEp.durationSec);
      setIsPlaying(false);
    }
  };

  // Simulate beacon unload
  const handleSimulateBeacon = () => {
    const cur = Math.floor(currentTime);
    const dur = Math.max(1, Math.floor(duration));
    const now = Date.now();
    const payload = {
      episodeId: selectedEpisode.id,
      progressSeconds: cur,
      durationSeconds: dur,
      preferredAudioLang: selectedAudio,
      preferredSubtitleLang: selectedSubtitle,
    };
    handleTelemetryLog({
      id: `beacon-sim-${now}`,
      timestamp: new Date().toLocaleTimeString(),
      method: 'BEACON_UNLOAD',
      episodeId: selectedEpisode.id,
      progressSeconds: cur,
      durationSeconds: dur,
      completionRate: Number((cur / dur).toFixed(2)),
      status: 'SUCCESS',
      bytesSent: 148,
      latencyMs: 14,
      payload,
    });
  };

  return (
    <div className="min-h-screen bg-[#08090d] text-neutral-100 flex flex-col selection:bg-rose-500 selection:text-white">
      {/* Top Global Navigation Bar */}
      <Navbar
        activeView={activeView}
        onViewChange={setActiveView}
        selectedAnime={selectedAnime}
        onSelectAnime={handleSelectAnime}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* VIEW 1: Live Video Player & Streaming Interface */}
        {activeView === 'player' && (
          <div className="space-y-6">
            {/* Player Container */}
            <div className="rounded-3xl border border-neutral-800/90 bg-neutral-950 p-3 sm:p-4 shadow-2xl shadow-black/80">
              <HlsPlayer
                key={selectedEpisode.id}
                episode={selectedEpisode}
                initialTime={watchHistoryMap[selectedEpisode.id] || 0}
                autoPlay={false}
                onTimeUpdate={(cur, dur) => {
                  setCurrentTime(cur);
                  if (dur && !isNaN(dur)) setDuration(dur);
                }}
                onPlayStateChange={setIsPlaying}
                onAudioChange={setSelectedAudio}
                onSubtitleChange={setSelectedSubtitle}
                isTheaterMode={isTheaterMode}
                onToggleTheaterMode={() => setIsTheaterMode(!isTheaterMode)}
              />

              {/* Quick Status Bar below player */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 px-2 py-1 text-xs text-neutral-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 font-medium text-neutral-300">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-600'
                      }`}
                    />
                    {isPlaying ? 'Stream Active' : 'Stream Paused'}
                  </span>
                  <span className="text-neutral-600">•</span>
                  <span>
                    Sync Head:{' '}
                    <span className="font-mono text-neutral-200">
                      {Math.floor(lastSyncedProgress / 60)}:
                      {lastSyncedProgress % 60 < 10 ? '0' : ''}
                      {lastSyncedProgress % 60}
                    </span>
                  </span>
                  <span className="text-neutral-600">•</span>
                  <span>
                    Pulse Count:{' '}
                    <span className="font-mono text-rose-400 font-semibold">{syncCount}</span>
                  </span>
                  {isSyncing && (
                    <span className="text-[11px] text-amber-400 animate-pulse">Syncing...</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveView('telemetry')}
                    className="flex items-center gap-1 rounded bg-neutral-900 border border-neutral-800 px-2.5 py-1 text-[11px] text-rose-400 hover:bg-neutral-800 transition-colors"
                  >
                    <Zap className="h-3 w-3" />
                    Open Sync Telemetry Inspector
                  </button>
                </div>
              </div>
            </div>

            {/* Below Player Layout: Metadata & Episode Selector */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Anime Details & Architectural Badges */}
              <div className="lg:col-span-8 space-y-6">
                {/* Anime Title & Synopsis */}
                <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/60 p-6 backdrop-blur-md">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-rose-500 uppercase tracking-wider">
                          {selectedAnime.studio}
                        </span>
                        <span className="text-neutral-600">•</span>
                        <span className="text-xs text-neutral-400">{selectedAnime.releaseYear}</span>
                        <span className="text-neutral-600">•</span>
                        <span className="rounded bg-neutral-800 px-1.5 py-0.5 text-[10px] font-bold text-neutral-300">
                          {selectedAnime.rating}
                        </span>
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                        {selectedAnime.title}
                      </h1>
                      <p className="text-xs text-neutral-400 italic mt-0.5">
                        {selectedAnime.romajiTitle}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {selectedAnime.genres.map((g) => (
                        <span
                          key={g}
                          className="rounded-lg bg-neutral-800/90 border border-neutral-700/60 px-2.5 py-1 text-xs text-neutral-300"
                        >
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-neutral-300 leading-relaxed">
                    {selectedEpisode.synopsis}
                  </p>

                  {/* Multi-Track Matrix Architecture Callout */}
                  <div className="mt-6 rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
                    <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm mb-2">
                      <Sparkles className="h-4 w-4" />
                      <span>Single Episode • Native Multi-Track Audio Dub & Subtitles</span>
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed mb-3">
                      Notice that switching between Japanese (Original), English Dub, Spanish, French, or German does NOT jump to a separate duplicate season. All {selectedEpisode.audioTracks.length} audio tracks and {selectedEpisode.subtitles.length} subtitle tracks are linked to this single episode in PostgreSQL.
                    </p>

                    <div className="flex flex-wrap gap-2 text-xs font-mono">
                      <div className="rounded-lg bg-neutral-900 border border-neutral-800 px-3 py-1.5">
                        <span className="text-neutral-500">Audio Dubs: </span>
                        <span className="text-emerald-400 font-semibold">
                          {selectedEpisode.audioTracks.map((t) => t.languageCode).join(', ')}
                        </span>
                      </div>
                      <div className="rounded-lg bg-neutral-900 border border-neutral-800 px-3 py-1.5">
                        <span className="text-neutral-500">Subtitles: </span>
                        <span className="text-blue-400 font-semibold">
                          {selectedEpisode.subtitles.map((t) => t.languageCode).join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Keyboard Shortcuts Cheatsheet */}
                <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-5">
                  <div className="flex items-center gap-2 text-sm font-semibold text-neutral-300 mb-3">
                    <Keyboard className="h-4 w-4 text-rose-400" />
                    <span>Player Keyboard Shortcuts</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="rounded-lg bg-neutral-950 p-2 border border-neutral-800/80">
                      <kbd className="rounded bg-neutral-800 px-1.5 py-0.5 font-mono text-[11px] text-rose-400">
                        Space / K
                      </kbd>
                      <span className="block text-neutral-400 mt-1">Play / Pause</span>
                    </div>
                    <div className="rounded-lg bg-neutral-950 p-2 border border-neutral-800/80">
                      <kbd className="rounded bg-neutral-800 px-1.5 py-0.5 font-mono text-[11px] text-rose-400">
                        J / L / Arrows
                      </kbd>
                      <span className="block text-neutral-400 mt-1">Seek +/- 10s</span>
                    </div>
                    <div className="rounded-lg bg-neutral-950 p-2 border border-neutral-800/80">
                      <kbd className="rounded bg-neutral-800 px-1.5 py-0.5 font-mono text-[11px] text-rose-400">
                        S
                      </kbd>
                      <span className="block text-neutral-400 mt-1">Skip Intro (+85s)</span>
                    </div>
                    <div className="rounded-lg bg-neutral-950 p-2 border border-neutral-800/80">
                      <kbd className="rounded bg-neutral-800 px-1.5 py-0.5 font-mono text-[11px] text-rose-400">
                        F / T / M
                      </kbd>
                      <span className="block text-neutral-400 mt-1">Full / Theater / Mute</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Episode Rail */}
              <div className="lg:col-span-4 space-y-6">
                <EpisodeRail
                  episodes={selectedAnime.seasons[0].episodes}
                  activeEpisodeId={selectedEpisode.id}
                  onSelectEpisode={handleSelectEpisode}
                  watchHistoryMap={watchHistoryMap}
                />

                {/* Continue Watching Sync Guarantee Card */}
                <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 text-xs text-neutral-300">
                  <div className="flex items-center gap-2 font-semibold text-white mb-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Zero Progress Loss Guarantee</span>
                  </div>
                  <p className="text-neutral-400 leading-relaxed text-[11px]">
                    If a user abruptly closes the tab or switches apps on mobile, the hook dispatches a <code className="text-rose-400 font-mono">navigator.sendBeacon</code> payload with the exact playback timestamp.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: WatchHistory Sync Telemetry Inspector */}
        {activeView === 'telemetry' && (
          <SyncTelemetryPanel
            logs={telemetryLogs}
            lastSyncedProgress={lastSyncedProgress}
            lastSyncedTimestamp={lastSyncedTimestamp}
            isSyncing={isSyncing}
            syncCount={syncCount}
            onForceSync={flushSyncNow}
            onSimulateBeacon={handleSimulateBeacon}
            onClearLogs={() => setTelemetryLogs([])}
          />
        )}

        {/* VIEW 3: Prisma Schema Blueprint */}
        {activeView === 'prisma' && <PrismaSchemaViewer />}

        {/* VIEW 4: Next.js 14 Project Structure Tree */}
        {activeView === 'structure' && <NextjsStructureViewer />}

        {/* VIEW 5: API Route Blueprint & Sync Architecture */}
        {activeView === 'api' && <ApiRouteViewer />}
      </main>

      {/* Global Footer */}
      <footer className="mt-auto border-t border-neutral-800/80 bg-neutral-950 py-6 text-xs text-neutral-400">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">AniZone Architecture</span>
            <span>• Built for high-performance anime streaming</span>
          </div>
          <div className="flex items-center gap-4 text-neutral-400">
            <span>Next.js 14 App Router</span>
            <span>•</span>
            <span>hls.js ABR Engine</span>
            <span>•</span>
            <span>Prisma ORM + PostgreSQL</span>
            <span>•</span>
            <span>Supabase Auth</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
