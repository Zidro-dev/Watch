/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Settings,
  MessageSquare,
  FastForward,
  Tv,
  Check,
} from 'lucide-react';
import { Episode, AudioLanguage, SubtitleLanguage, QualityLevel } from '../../types/anime';
import { SubtitleRenderer } from './SubtitleRenderer';
import { TrackSelectorModal } from './TrackSelectorModal';
import { QualityMenu } from './QualityMenu';

interface HlsPlayerProps {
  episode: Episode;
  initialTime?: number;
  autoPlay?: boolean;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
  onAudioChange?: (audioLang: AudioLanguage) => void;
  onSubtitleChange?: (subLang: SubtitleLanguage) => void;
  isTheaterMode?: boolean;
  onToggleTheaterMode?: () => void;
  onEpisodeEnded?: () => void;
}

export const HlsPlayer: React.FC<HlsPlayerProps> = ({
  episode,
  initialTime = 0,
  autoPlay = false,
  onTimeUpdate,
  onPlayStateChange,
  onAudioChange,
  onSubtitleChange,
  isTheaterMode = false,
  onToggleTheaterMode,
  onEpisodeEnded,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  // Playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(episode.durationSec || 1420);
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [bufferedEnd, setBufferedEnd] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isControlsVisible, setIsControlsVisible] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Quality levels & ABR
  const [qualityLevels, setQualityLevels] = useState<QualityLevel[]>([]);
  const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(-1); // -1 = Auto
  const [autoResolutionHeight, setAutoResolutionHeight] = useState<number>(1080);

  // Tracks state
  const [selectedAudio, setSelectedAudio] = useState<AudioLanguage>('ja-JP');
  const [selectedSubtitle, setSelectedSubtitle] = useState<SubtitleLanguage>('en-US');

  // Modal open states
  const [isTracksModalOpen, setIsTracksModalOpen] = useState<boolean>(false);
  const [isQualityModalOpen, setIsQualityModalOpen] = useState<boolean>(false);
  const [isSpeedMenuOpen, setIsSpeedMenuOpen] = useState<boolean>(false);

  // Intro skip detection
  const isInsideIntro =
    episode.introStartSec !== undefined &&
    episode.introEndSec !== undefined &&
    currentTime >= episode.introStartSec &&
    currentTime <= episode.introEndSec;

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Initialize HLS Stream
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setIsLoading(true);
    setCurrentTime(0);

    // Destroy existing HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 90,
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
      });

      hlsRef.current = hls;
      hls.loadSource(episode.masterHlsUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        setIsLoading(false);
        const levels: QualityLevel[] = data.levels.map((lvl, index) => ({
          height: lvl.height || 720,
          bitrate: lvl.bitrate || 2500000,
          label: `${lvl.height || 720}p`,
          levelIndex: index,
        }));

        // Sort descending by height
        levels.sort((a, b) => b.height - a.height);
        setQualityLevels(levels);

        if (initialTime > 0) {
          video.currentTime = initialTime;
        }

        if (autoPlay) {
          video.play().catch(() => setIsPlaying(false));
        }
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
        const lvl = hls.levels[data.level];
        if (lvl) {
          setAutoResolutionHeight(lvl.height);
        }
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.warn('[HlsPlayer] Network error encountered, attempting recovery...');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.warn('[HlsPlayer] Media error encountered, recovering media...');
              hls.recoverMediaError();
              break;
            default:
              console.error('[HlsPlayer] Fatal unrecoverable error:', data);
              hls.destroy();
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native Safari / iOS HLS fallback
      video.src = episode.masterHlsUrl;
      video.addEventListener('loadedmetadata', () => {
        setIsLoading(false);
        if (initialTime > 0) video.currentTime = initialTime;
        if (autoPlay) video.play().catch(() => setIsPlaying(false));
      });
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [episode.masterHlsUrl, initialTime, autoPlay]);

  // Sync Video Events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const cur = video.currentTime;
      setCurrentTime(cur);

      // Duration update
      if (video.duration && !isNaN(video.duration)) {
        setDuration(video.duration);
      }

      // Buffer progress
      if (video.buffered.length > 0) {
        const end = video.buffered.end(video.buffered.length - 1);
        setBufferedEnd(end);
      }

      onTimeUpdate?.(cur, video.duration || episode.durationSec);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      setIsLoading(false);
      onPlayStateChange?.(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
      onPlayStateChange?.(false);
    };

    const handleWaiting = () => setIsLoading(true);
    const handlePlaying = () => setIsLoading(false);

    const handleEnded = () => {
      setIsPlaying(false);
      onPlayStateChange?.(false);
      onEpisodeEnded?.();
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('ended', handleEnded);
    };
  }, [episode.durationSec, onTimeUpdate, onPlayStateChange, onEpisodeEnded]);

  // Auto-hide controls
  const handleMouseMove = useCallback(() => {
    setIsControlsVisible(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlayingRef.current) {
        setIsControlsVisible(false);
        setIsTracksModalOpen(false);
        setIsQualityModalOpen(false);
        setIsSpeedMenuOpen(false);
      }
    }, 3200);
  }, []);

  const isPlayingRef = useRef(isPlaying);
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Controls Handlers
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, []);

  const seekRelative = useCallback((seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(video.duration || 1420, video.currentTime + seconds));
  }, []);

  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const targetTime = parseFloat(e.target.value);
    video.currentTime = targetTime;
    setCurrentTime(targetTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    if (video) {
      video.volume = val;
      video.muted = val === 0;
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isMuted) {
      video.muted = false;
      video.volume = volume > 0 ? volume : 0.5;
      setIsMuted(false);
    } else {
      video.muted = true;
      setIsMuted(true);
    }
  };

  const handleSpeedSelect = (rate: number) => {
    const video = videoRef.current;
    if (video) {
      video.playbackRate = rate;
      setPlaybackRate(rate);
    }
    setIsSpeedMenuOpen(false);
  };

  const toggleFullscreen = async () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      await container.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleSkipIntro = () => {
    const video = videoRef.current;
    if (!video || episode.introEndSec === undefined) return;
    video.currentTime = episode.introEndSec;
    setCurrentTime(episode.introEndSec);
  };

  // Quality Level switcher
  const handleQualityLevelSelect = (levelIdx: number) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = levelIdx; // -1 for Auto
      setCurrentLevelIndex(levelIdx);
    }
  };

  // Audio switcher
  const handleAudioSelect = (code: AudioLanguage) => {
    setSelectedAudio(code);
    onAudioChange?.(code);

    // If HLS manifest has embedded audio tracks, switch audioTrack index
    if (hlsRef.current && hlsRef.current.audioTracks.length > 0) {
      const idx = hlsRef.current.audioTracks.findIndex((t) =>
        t.lang?.toLowerCase().startsWith(code.slice(0, 2))
      );
      if (idx !== -1) {
        hlsRef.current.audioTrack = idx;
      }
    }
  };

  // Subtitle switcher
  const handleSubtitleSelect = (code: SubtitleLanguage) => {
    setSelectedSubtitle(code);
    onSubtitleChange?.(code);
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      switch (e.code) {
        case 'Space':
        case 'KeyK':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
        case 'KeyJ':
          e.preventDefault();
          seekRelative(-10);
          break;
        case 'ArrowRight':
        case 'KeyL':
          e.preventDefault();
          seekRelative(10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume((v) => {
            const next = Math.min(1, v + 0.1);
            if (videoRef.current) videoRef.current.volume = next;
            return next;
          });
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume((v) => {
            const next = Math.max(0, v - 0.1);
            if (videoRef.current) videoRef.current.volume = next;
            return next;
          });
          break;
        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;
        case 'KeyF':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'KeyT':
          e.preventDefault();
          onToggleTheaterMode?.();
          break;
        case 'KeyS':
          if (isInsideIntro) {
            e.preventDefault();
            handleSkipIntro();
          }
          break;
        case 'KeyC':
          e.preventDefault();
          setSelectedSubtitle((s) => (s === 'off' ? 'en-US' : 'off'));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, seekRelative, toggleMute, toggleFullscreen, onToggleTheaterMode, isInsideIntro]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const activeSubtitleTrack = episode.subtitles.find(
    (s) => s.languageCode === selectedSubtitle
  );

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setIsControlsVisible(false)}
      className={`group relative overflow-hidden bg-black select-none transition-all duration-300 ${
        isTheaterMode ? 'w-full max-w-7xl mx-auto shadow-2xl rounded-2xl' : 'w-full rounded-2xl'
      } aspect-video`}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        onClick={togglePlay}
        playsInline
        className="h-full w-full object-contain cursor-pointer"
      />

      {/* Styled Anime Subtitle Renderer */}
      <SubtitleRenderer
        currentSubtitleTrack={activeSubtitleTrack}
        currentTime={currentTime}
      />

      {/* Loading Buffering Spinner */}
      {isLoading && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
          <div className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-rose-500/30 border-t-rose-500" />
            <span className="text-xs font-medium uppercase tracking-widest text-white/80">
              Buffering HLS Stream
            </span>
          </div>
        </div>
      )}

      {/* Floating Skip Intro / Opening Button */}
      {isInsideIntro && (
        <div className="absolute bottom-24 right-8 z-30 animate-in fade-in slide-in-from-right-4 duration-300">
          <button
            onClick={handleSkipIntro}
            className="flex items-center gap-2 rounded-xl border border-amber-400/50 bg-neutral-900/90 px-5 py-2.5 font-semibold text-amber-300 shadow-xl shadow-amber-500/10 backdrop-blur-md hover:bg-neutral-800 hover:border-amber-300 hover:scale-105 active:scale-95 transition-all"
          >
            <FastForward className="h-4 w-4" />
            <span>Skip Opening (+85s)</span>
            <span className="rounded bg-amber-400/20 px-1.5 py-0.5 text-[10px] text-amber-200">
              Press S
            </span>
          </button>
        </div>
      )}

      {/* Modals */}
      <TrackSelectorModal
        isOpen={isTracksModalOpen}
        onClose={() => setIsTracksModalOpen(false)}
        audioTracks={episode.audioTracks}
        subtitleTracks={episode.subtitles}
        selectedAudio={selectedAudio}
        selectedSubtitle={selectedSubtitle}
        onSelectAudio={handleAudioSelect}
        onSelectSubtitle={handleSubtitleSelect}
      />

      <QualityMenu
        isOpen={isQualityModalOpen}
        onClose={() => setIsQualityModalOpen(false)}
        levels={qualityLevels}
        currentLevelIndex={currentLevelIndex}
        autoLevelHeight={autoResolutionHeight}
        onSelectLevel={handleQualityLevelSelect}
      />

      {/* Controls Overlay */}
      <div
        className={`absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/95 via-transparent to-black/60 p-4 md:p-6 transition-opacity duration-300 ${
          isControlsVisible || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Top Header info */}
        <div className="flex items-center justify-between text-white drop-shadow">
          <div className="flex items-center gap-3">
            <span className="rounded bg-rose-500 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
              EP {episode.episodeNumber}
            </span>
            <h2 className="text-sm md:text-base font-semibold truncate max-w-md">
              {episode.title}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex rounded-lg bg-neutral-900/80 border border-neutral-700/60 px-3 py-1 text-xs font-medium text-neutral-300">
              Dub: {selectedAudio.slice(0, 2).toUpperCase()} • Sub: {selectedSubtitle === 'off' ? 'OFF' : selectedSubtitle.slice(0, 2).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Center Big Play Button (when paused) */}
        {!isPlaying && !isLoading && (
          <div className="self-center">
            <button
              onClick={togglePlay}
              className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full bg-rose-500 text-white shadow-2xl shadow-rose-500/40 hover:bg-rose-600 hover:scale-110 active:scale-95 transition-all"
            >
              <Play className="h-8 w-8 md:h-10 md:w-10 ml-1 fill-white" />
            </button>
          </div>
        )}

        {/* Bottom Control Bar */}
        <div className="space-y-3">
          {/* Scrubber Timeline */}
          <div className="relative group/scrubber flex items-center">
            {/* Buffered progress track */}
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-neutral-600/60 pointer-events-none"
              style={{ width: `${Math.min(100, (bufferedEnd / duration) * 100)}%` }}
            />
            {/* Played progress track */}
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-rose-500 pointer-events-none shadow-sm shadow-rose-500/80"
              style={{ width: `${Math.min(100, (currentTime / duration) * 100)}%` }}
            />
            <input
              type="range"
              min={0}
              max={duration}
              step={0.5}
              value={currentTime}
              onChange={handleScrubberChange}
              className="relative z-10 w-full appearance-none bg-transparent h-4 cursor-pointer accent-rose-500 opacity-90 hover:opacity-100"
            />
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center justify-between text-white">
            {/* Left controls */}
            <div className="flex items-center gap-2 md:gap-4">
              <button
                onClick={togglePlay}
                className="rounded-lg p-2 hover:bg-white/10 transition-colors"
                title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-current" />}
              </button>

              <button
                onClick={() => seekRelative(-10)}
                className="rounded-lg p-2 hover:bg-white/10 transition-colors"
                title="Rewind 10s (J / Left Arrow)"
              >
                <RotateCcw className="h-5 w-5" />
              </button>

              <button
                onClick={() => seekRelative(10)}
                className="rounded-lg p-2 hover:bg-white/10 transition-colors"
                title="Forward 10s (L / Right Arrow)"
              >
                <RotateCw className="h-5 w-5" />
              </button>

              {/* Volume */}
              <div className="flex items-center gap-2 group/vol">
                <button
                  onClick={toggleMute}
                  className="rounded-lg p-2 hover:bg-white/10 transition-colors"
                  title="Mute (M)"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="h-5 w-5 text-neutral-400" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 md:w-20 appearance-none bg-neutral-700 h-1.5 rounded-full cursor-pointer accent-rose-500"
                />
              </div>

              {/* Timecode */}
              <span className="text-xs font-mono text-neutral-300 ml-1">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-1.5 md:gap-3">
              {/* Audio & Subtitles Slot */}
              <button
                onClick={() => setIsTracksModalOpen(true)}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium bg-neutral-900/80 border border-neutral-700/60 hover:bg-neutral-800 transition-colors"
                title="Audio Dub & Subtitles"
              >
                <MessageSquare className="h-4 w-4 text-rose-400" />
                <span className="hidden sm:inline">Audio & Subs</span>
              </button>

              {/* Quality ABR Menu */}
              <button
                onClick={() => setIsQualityModalOpen(true)}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium bg-neutral-900/80 border border-neutral-700/60 hover:bg-neutral-800 transition-colors"
                title="Quality"
              >
                <Settings className="h-4 w-4 text-neutral-300" />
                <span className="hidden sm:inline">
                  {currentLevelIndex === -1 ? `Auto (${autoResolutionHeight}p)` : `${qualityLevels[currentLevelIndex]?.label || 'Quality'}`}
                </span>
              </button>

              {/* Speed Menu Toggle */}
              <div className="relative">
                <button
                  onClick={() => setIsSpeedMenuOpen(!isSpeedMenuOpen)}
                  className="rounded-lg px-2 py-1.5 text-xs font-mono font-medium hover:bg-white/10 transition-colors"
                  title="Playback Speed"
                >
                  {playbackRate}x
                </button>
                {isSpeedMenuOpen && (
                  <div className="absolute bottom-full mb-2 right-0 rounded-xl border border-neutral-800 bg-neutral-900/95 p-1 shadow-2xl backdrop-blur-md flex flex-col gap-1 w-24">
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => handleSpeedSelect(rate)}
                        className={`flex items-center justify-between rounded-lg px-2 py-1 text-xs font-medium transition-colors ${
                          playbackRate === rate
                            ? 'bg-rose-500/20 text-rose-400'
                            : 'text-neutral-300 hover:bg-neutral-800'
                        }`}
                      >
                        <span>{rate}x</span>
                        {playbackRate === rate && <Check className="h-3 w-3" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Theater Mode */}
              {onToggleTheaterMode && (
                <button
                  onClick={onToggleTheaterMode}
                  className="rounded-lg p-2 hover:bg-white/10 transition-colors"
                  title="Theater Mode (T)"
                >
                  <Tv className={`h-5 w-5 ${isTheaterMode ? 'text-rose-400' : 'text-neutral-300'}`} />
                </button>
              )}

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="rounded-lg p-2 hover:bg-white/10 transition-colors"
                title="Fullscreen (F)"
              >
                {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
