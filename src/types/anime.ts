/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AudioLanguage = 'ja-JP' | 'en-US' | 'es-ES' | 'es-419' | 'pt-BR' | 'fr-FR' | 'de-DE';
export type SubtitleLanguage = 'en-US' | 'es-419' | 'pt-BR' | 'fr-FR' | 'de-DE' | 'ja-JP' | 'off';

export interface AudioTrack {
  id: string;
  episodeId: string;
  languageCode: AudioLanguage;
  languageName: string;
  isDefault: boolean;
  codec: string;
  sampleRate?: number;
  channels?: string;
  streamIndex?: number;
}

export interface SubtitleTrack {
  id: string;
  episodeId: string;
  languageCode: SubtitleLanguage;
  languageName: string;
  isDefault: boolean;
  type: 'FULL' | 'SIGNS_SONGS' | 'SDH';
  format: 'WEBVTT' | 'ASS';
  vttUrl?: string;
  cues?: Array<{
    start: number;
    end: number;
    text: string;
  }>;
}

export interface Episode {
  id: string;
  seasonId: string;
  animeId: string;
  episodeNumber: number;
  title: string;
  synopsis: string;
  durationSec: number;
  thumbnail: string;
  masterHlsUrl: string;
  introStartSec: number;
  introEndSec: number;
  outroStartSec?: number;
  outroEndSec?: number;
  audioTracks: AudioTrack[];
  subtitles: SubtitleTrack[];
}

export interface Season {
  id: string;
  animeId: string;
  seasonNumber: number;
  title: string;
  year: number;
  episodes: Episode[];
}

export interface Anime {
  id: string;
  slug: string;
  title: string;
  romajiTitle: string;
  description: string;
  bannerImage: string;
  posterImage: string;
  genres: string[];
  status: 'RELEASING' | 'COMPLETED' | 'UPCOMING';
  releaseYear: number;
  rating: string;
  studio: string;
  totalEpisodes: number;
  seasons: Season[];
}

export interface WatchHistoryRecord {
  userId: string;
  episodeId: string;
  progressSeconds: number;
  durationSeconds: number;
  completionRate: number;
  lastWatchedAt: string;
  isCompleted: boolean;
  preferredAudioLang?: AudioLanguage;
  preferredSubtitleLang?: SubtitleLanguage;
}

export interface QualityLevel {
  height: number;
  bitrate: number;
  label: string;
  levelIndex: number; // -1 for Auto
}

export interface SyncTelemetryEvent {
  id: string;
  timestamp: string;
  method: 'SYNC_INTERVAL' | 'SEEK_FLUSH' | 'PAUSE_FLUSH' | 'BEACON_UNLOAD' | 'OFFLINE_RETRY';
  episodeId: string;
  progressSeconds: number;
  durationSeconds: number;
  completionRate: number;
  status: 'PENDING' | 'SUCCESS' | 'THROTTLED' | 'ERROR';
  bytesSent: number;
  latencyMs: number;
  payload: Record<string, unknown>;
}
