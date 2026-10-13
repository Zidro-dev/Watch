/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const PRISMA_SCHEMA_CODE = `// ==============================================================================
// AniZone - Production Prisma Schema (PostgreSQL + Supabase)
// Solves Crunchyroll's Legacy Flaw: Native Multi-Audio & Subtitles per Episode
// ==============================================================================

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL") // Used for direct connection pooling on Supabase
}

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["fullTextSearchPostgres"]
}

// ------------------------------------------------------------------------------
// 1. User & Account Management
// ------------------------------------------------------------------------------
enum UserRole {
  USER
  PREMIUM
  MODERATOR
  ADMIN
}

model User {
  id            String         @id @default(uuid())
  email         String         @unique
  username      String         @unique
  avatarUrl     String?
  role          UserRole       @default(USER)
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  // User playback preferences & history
  preferredAudioLang    String   @default("ja-JP") // e.g. "ja-JP", "en-US"
  preferredSubtitleLang String   @default("en-US") // e.g. "en-US", "off"
  autoSkipIntro         Boolean  @default(true)
  autoPlayNext          Boolean  @default(true)

  watchHistory  WatchHistory[]
  watchlist     Watchlist[]

  @@index([email])
}

// ------------------------------------------------------------------------------
// 2. Anime Series Metadata
// ------------------------------------------------------------------------------
enum AnimeStatus {
  NOT_YET_AIRED
  RELEASING
  COMPLETED
  HIATUS
}

model Anime {
  id            String         @id @default(uuid())
  slug          String         @unique // e.g. "solo-leveling"
  title         String
  romajiTitle   String?
  englishTitle  String?
  synopsis      String         @db.Text
  bannerImage   String
  posterImage   String
  genres        String[]       // e.g. ["Action", "Fantasy", "Dark Fantasy"]
  status        AnimeStatus    @default(RELEASING)
  releaseYear   Int
  rating        String         @default("TV-14") // e.g. "TV-14", "TV-MA"
  studio        String?        // e.g. "A-1 Pictures", "MAPPA"
  totalEpisodes Int            @default(0)
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  seasons       Season[]
  episodes      Episode[]      // Denormalized relation for fast querying across all episodes
  watchlist     Watchlist[]

  @@index([slug])
  @@index([status, releaseYear])
}

// ------------------------------------------------------------------------------
// 3. Season Hierarchy
// Clean Season model: Season 1, Season 2, etc. NO DUB SEASONS!
// ------------------------------------------------------------------------------
model Season {
  id           String     @id @default(uuid())
  animeId      String
  anime        Anime      @relation(fields: [animeId], references: [id], onDelete: Cascade)
  seasonNumber Int        // 1, 2, 3...
  title        String     // e.g. "Season 1: Arise Arc"
  year         Int?
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt

  episodes     Episode[]

  @@unique([animeId, seasonNumber]) // Ensures strictly 1 season 1 per anime
  @@index([animeId])
}

// ------------------------------------------------------------------------------
// 4. Episode (The Central Playback Entity)
// ------------------------------------------------------------------------------
model Episode {
  id             String         @id @default(uuid())
  seasonId       String
  season         Season         @relation(fields: [seasonId], references: [id], onDelete: Cascade)
  animeId        String
  anime          Anime          @relation(fields: [animeId], references: [id], onDelete: Cascade)
  
  episodeNumber  Int            // 1, 2, 3...
  absoluteNumber Int?           // Absolute counter across whole anime franchise
  title          String         // e.g. "I'm Used to It"
  synopsis       String?        @db.Text
  durationSec    Int            // Total length in seconds (e.g. 1420)
  thumbnail      String
  
  // Master Adaptive Bitrate HLS Stream (.m3u8 containing multiple video renditions)
  masterHlsUrl   String
  
  // Precise intro/recap/outro markers for seamless 1-click skip
  introStartSec  Int?           // e.g. 25
  introEndSec    Int?           // e.g. 115
  recapStartSec  Int?           // e.g. 0
  recapEndSec    Int?           // e.g. 24
  outroStartSec  Int?           // e.g. 1320
  outroEndSec    Int?           // e.g. 1400

  // Native relations: Multiple audio dubs and subtitles per episode
  audioTracks    AudioTrack[]
  subtitles      Subtitle[]
  watchHistory   WatchHistory[]

  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt

  @@unique([seasonId, episodeNumber])
  @@index([animeId, episodeNumber])
  @@index([seasonId])
}

// ------------------------------------------------------------------------------
// 5. Audio Tracks (Solves Fake Dub Seasons)
// One episode can have Japanese (Original), English, Spanish, French, etc.
// ------------------------------------------------------------------------------
model AudioTrack {
  id           String   @id @default(uuid())
  episodeId    String
  episode      Episode  @relation(fields: [episodeId], references: [id], onDelete: Cascade)
  
  languageCode String   // BCP-47 standard: "ja-JP", "en-US", "es-419", "fr-FR", "de-DE"
  languageName String   // Display name: "Japanese (Original)", "English Dub"
  isDefault    Boolean  @default(false)
  codec        String   @default("aac") // "aac", "opus", "eac3"
  channels     String   @default("Stereo") // "Stereo", "5.1 Surround"
  
  // Stream routing: Either an alternate audio HLS playlist URL or in-manifest track index
  audioUrl     String?  // Can point to dedicated demuxed audio stream if not embedded
  streamIndex  Int?     // In-manifest HLS AUDIO GROUP rendition ID
  
  createdAt    DateTime @default(now())

  @@unique([episodeId, languageCode])
  @@index([episodeId])
}

// ------------------------------------------------------------------------------
// 6. Subtitles (Full Dialogue, Signs & Songs, SDH)
// ------------------------------------------------------------------------------
enum SubtitleType {
  FULL          // Complete spoken dialogue translation
  SIGNS_SONGS   // Untranslated background signs, openings, endings for dub viewers
  SDH           // Subtitles for Deaf & Hard of Hearing
}

enum SubtitleFormat {
  WEBVTT        // Standard WebVTT (.vtt)
  ASS           // Advanced SubStation Alpha (.ass) for stylized fansub styling
}

model Subtitle {
  id           String         @id @default(uuid())
  episodeId    String
  episode      Episode        @relation(fields: [episodeId], references: [id], onDelete: Cascade)
  
  languageCode String         // "en-US", "es-419", "pt-BR", "fr-FR", etc.
  languageName String         // "English", "Español (Latinoamérica)"
  type         SubtitleType   @default(FULL)
  format       SubtitleFormat @default(WEBVTT)
  url          String         // CDN link to .vtt or .ass file
  isDefault    Boolean        @default(false)

  createdAt    DateTime       @default(now())

  @@unique([episodeId, languageCode, type])
  @@index([episodeId])
}

// ------------------------------------------------------------------------------
// 7. Watch History (Optimized for High-Throughput 10s Heartbeats)
// ------------------------------------------------------------------------------
model WatchHistory {
  id                    String    @id @default(uuid())
  userId                String
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  episodeId             String
  episode               Episode   @relation(fields: [episodeId], references: [id], onDelete: Cascade)

  progressSeconds       Int       // Playback head in seconds (e.g. 742)
  durationSeconds       Int       // Total duration cached for quick completion math
  completionRate        Float     // progressSeconds / durationSeconds (0.0 to 1.0)
  isCompleted           Boolean   @default(false) // Triggered at >= 0.90 (90%)

  // Remember the user's specific audio/sub track choice for this episode
  preferredAudioLang    String?   // "ja-JP" or "en-US"
  preferredSubtitleLang String?   // "en-US" or "off"

  lastWatchedAt         DateTime  @default(now())
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  // Composite unique constraint guarantees fast atomic UPSERTs on (userId, episodeId)
  @@unique([userId, episodeId])
  // Fast query for "Continue Watching" row on homepage sorted by recent
  @@index([userId, lastWatchedAt(sort: Desc)])
  @@index([episodeId])
}

// ------------------------------------------------------------------------------
// 8. User Watchlist / Bookmarks
// ------------------------------------------------------------------------------
enum WatchlistStatus {
  PLANNING
  WATCHING
  COMPLETED
  DROPPED
}

model Watchlist {
  id        String          @id @default(uuid())
  userId    String
  user      User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  animeId   String
  anime     Anime           @relation(fields: [animeId], references: [id], onDelete: Cascade)
  status    WatchlistStatus @default(WATCHING)
  createdAt DateTime        @default(now())
  updatedAt DateTime        @updatedAt

  @@unique([userId, animeId])
  @@index([userId, status])
}
`;

export const ARCHITECTURAL_ANALYSIS = [
  {
    title: "The Crunchyroll Flaw: Pseudo-Seasons",
    issue: "Crunchyroll historically treats different language dubs as separate 'Seasons' in their data model (e.g., 'Season 1', 'Season 1 (English Dub)', 'Season 1 (Spanish Dub)', 'Season 1 (German Dub)').",
    consequence: "1) Cluttered UI where an anime with 2 seasons shows 14 confusing seasons. 2) Broken watch progress tracking across languages. 3) Next episode button jumps into the wrong language dub or wrong season. 4) Ruined database indexing and API payloads.",
    solutionInAniZone: "AniZone links AudioTrack and Subtitle 1:N directly to Episode. Season strictly represents chronological storytelling (Season 1, Season 2). Audio language switching happens seamlessly inside the player with zero page reload or season jumping."
  },
  {
    title: "Signs & Songs vs Full Subtitles",
    issue: "When watching an English or Spanish dub, viewers still need on-screen translations for Japanese signs, newspapers, and opening/ending songs without full dialogue text covering the screen.",
    consequence: "Most naive streaming schemas only have a boolean 'isSubtitled' or single subtitle table without track type.",
    solutionInAniZone: "AniZone models SubtitleType (FULL, SIGNS_SONGS, SDH). Dubbed audio tracks automatically bind to the matching SIGNS_SONGS subtitle track by default, matching Netflix and Hulu's high-tier UX."
  },
  {
    title: "Atomic WatchHistory Upserts",
    issue: "Millions of concurrent streaming clients sending playback position pings can bottleneck relational databases with write lock contention.",
    consequence: "Excessive UPDATE queries, database connection pool exhaustion, and inconsistent progress bars.",
    solutionInAniZone: "Composite unique index @@unique([userId, episodeId]) enables atomic ON CONFLICT DO UPDATE (UPSERT). Client throttles heartbeats to 10s, debounces seek events, and dispatches navigator.sendBeacon on tab unload."
  }
];
