/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface StructureNode {
  name: string;
  type: 'file' | 'folder';
  description?: string;
  badge?: 'Server' | 'Client' | 'Edge' | 'Shared' | 'Config';
  codeSnippet?: string;
  children?: StructureNode[];
}

export const NEXTJS_PROJECT_STRUCTURE: StructureNode[] = [
  {
    name: "anizone/",
    type: "folder",
    description: "Root repository for AniZone Next.js 14+ (App Router) enterprise streaming platform",
    children: [
      {
        name: "app/",
        type: "folder",
        description: "Next.js App Router root directory with nested layouts, parallel routes, and server components",
        children: [
          {
            name: "layout.tsx",
            type: "file",
            badge: "Server",
            description: "Root layout with global HTML shell, metadata, theme provider, and session context"
          },
          {
            name: "page.tsx",
            type: "file",
            badge: "Server",
            description: "Homepage featuring hero anime spotlight, 'Continue Watching' row, trending, and top seasonal releases"
          },
          {
            name: "watch/",
            type: "folder",
            description: "Dedicated high-performance streaming route with minimal layout overhead",
            children: [
              {
                name: "[animeSlug]/",
                type: "folder",
                children: [
                  {
                    name: "[episodeNumber]/",
                    type: "folder",
                    children: [
                      {
                        name: "page.tsx",
                        type: "file",
                        badge: "Server",
                        description: "Dynamic streaming page: fetches episode manifest, audio/sub tracks, and watch history server-side"
                      },
                      {
                        name: "loading.tsx",
                        type: "file",
                        badge: "Server",
                        description: "Streaming skeleton with dark player placeholder and episode rail shimmer"
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            name: "anime/",
            type: "folder",
            children: [
              {
                name: "[slug]/",
                type: "folder",
                children: [
                  {
                    name: "page.tsx",
                    type: "file",
                    badge: "Server",
                    description: "Anime details page (synopsis, cast, season accordion, related anime, reviews)"
                  }
                ]
              }
            ]
          },
          {
            name: "api/",
            type: "folder",
            description: "Backend route handlers for high-throughput sync and video stream tokens",
            children: [
              {
                name: "watch-history/",
                type: "folder",
                children: [
                  {
                    name: "sync/",
                    type: "folder",
                    children: [
                      {
                        name: "route.ts",
                        type: "file",
                        badge: "Edge",
                        description: "High-throughput 10s heartbeat endpoint with token bucket rate limiting and atomic upsert"
                      }
                    ]
                  }
                ]
              },
              {
                name: "streams/",
                type: "folder",
                children: [
                  {
                    name: "token/",
                    type: "folder",
                    children: [
                      {
                        name: "route.ts",
                        type: "file",
                        badge: "Server",
                        description: "Signs temporary HMAC-SHA256 tokens for authenticated CDN HLS manifests (DRM/anti-hotlink)"
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        name: "components/",
        type: "folder",
        description: "Modular component library organized by feature domain",
        children: [
          {
            name: "player/",
            type: "folder",
            description: "Core video playback engine components",
            children: [
              {
                name: "HlsPlayer.tsx",
                type: "file",
                badge: "Client",
                description: "Primary custom HLS player with hls.js lifecycle, ABR quality ladders, and keyboard shortcuts"
              },
              {
                name: "PlayerControls.tsx",
                type: "file",
                badge: "Client",
                description: "Overlay bar: scrubber, volume slider, timecode, play/pause, theater mode, fullscreen"
              },
              {
                name: "AudioTrackSelector.tsx",
                type: "file",
                badge: "Client",
                description: "Audio dub switching slot (Japanese Original, English, Spanish, etc.) without stream reload"
              },
              {
                name: "SubtitleTrackSelector.tsx",
                type: "file",
                badge: "Client",
                description: "Subtitle track switching slot (Full dialogue, Signs & Songs, SDH, font styling controls)"
              },
              {
                name: "QualityMenu.tsx",
                type: "file",
                badge: "Client",
                description: "Adaptive bitrate level selector (Auto, 1080p, 720p, 480p, 360p)"
              },
              {
                name: "SkipIntroButton.tsx",
                type: "file",
                badge: "Client",
                description: "Floating action button triggering animated timestamp jump when intro markers are active"
              },
              {
                name: "SubtitleRenderer.tsx",
                type: "file",
                badge: "Client",
                description: "Stylized subtitle overlay with anime font outline and auto-resizing canvas"
              }
            ]
          },
          {
            name: "anime/",
            type: "folder",
            description: "Catalog and browsing components",
            children: [
              {
                name: "AnimeCard.tsx",
                type: "file",
                badge: "Client",
                description: "Poster card with hover video preview, dub/sub badges, and bookmark toggle"
              },
              {
                name: "ContinueWatchingRow.tsx",
                type: "file",
                badge: "Server",
                description: "Carousel displaying in-progress episodes with progress percentage bars"
              },
              {
                name: "SeasonAccordion.tsx",
                type: "file",
                badge: "Client",
                description: "Chronological season selector with audio language availability indicators"
              }
            ]
          },
          {
            name: "ui/",
            type: "folder",
            description: "Atomic design primitives (Buttons, Modals, Sliders, Badges, Dropdowns)"
          }
        ]
      },
      {
        name: "hooks/",
        type: "folder",
        description: "Custom React hooks encapsulating business logic",
        children: [
          {
            name: "useWatchProgressSync.ts",
            type: "file",
            badge: "Client",
            description: "Heartbeat sync hook: throttles every 10s, beacon unload handler, offline retry queue"
          },
          {
            name: "useHlsVideo.ts",
            type: "file",
            badge: "Client",
            description: "Low-level hls.js instance lifecycle, event binding, level switching, and error recovery"
          },
          {
            name: "usePlayerHotkeys.ts",
            type: "file",
            badge: "Client",
            description: "Keyboard navigation shortcuts (Space, K, J, L, M, F, T, C, Arrows)"
          }
        ]
      },
      {
        name: "lib/",
        type: "folder",
        description: "Shared server utilities, database clients, and validation schemas",
        children: [
          {
            name: "prisma.ts",
            type: "file",
            badge: "Server",
            description: "Singleton PrismaClient instance with connection pooling configuration for serverless"
          },
          {
            name: "supabase/",
            type: "folder",
            description: "Supabase client utilities for Auth and Realtime sync",
            children: [
              {
                name: "server.ts",
                type: "file",
                badge: "Server",
                description: "Server-side Supabase client for reading JWT auth cookies in Server Components & Routes"
              },
              {
                name: "client.ts",
                type: "file",
                badge: "Client",
                description: "Browser-side Supabase client"
              }
            ]
          },
          {
            name: "validations/",
            type: "folder",
            children: [
              {
                name: "watchHistorySchema.ts",
                type: "file",
                badge: "Shared",
                description: "Zod validation schema for progress sync payloads"
              }
            ]
          },
          {
            name: "rateLimiter.ts",
            type: "file",
            badge: "Server",
            description: "In-memory / Redis sliding-window rate limiter for high-traffic sync endpoints"
          }
        ]
      },
      {
        name: "prisma/",
        type: "folder",
        description: "Prisma ORM schema definitions and migration scripts",
        children: [
          {
            name: "schema.prisma",
            type: "file",
            badge: "Config",
            description: "AniZone database schema with native multi-audio/sub track relationships"
          },
          {
            name: "migrations/",
            type: "folder",
            description: "SQL migration history"
          }
        ]
      }
    ]
  }
];

export const ARCHITECTURE_RATIONALE = [
  {
    title: "Server Components vs Client Components Boundary",
    detail: "Next.js 14 App Router renders catalog listings, SEO metadata, and episode manifest data on the server with zero client bundle overhead. The video player (HlsPlayer.tsx) and controls are isolated into Client Components ('use client'), keeping DOM video refs and MediaSource APIs strictly in the browser."
  },
  {
    title: "Edge Runtime for Sync Route",
    detail: "The /api/watch-history/sync route handler is configured for Edge/Serverless runtime. By doing minimal work (validating the JWT and dispatching a single parameterized atomic UPSERT to Supabase PostgreSQL), edge routes execute in <15ms with near-infinite horizontal scalability."
  },
  {
    title: "Tokenized CDN Stream Security",
    detail: "Instead of public static .m3u8 URLs, /api/streams/token issues signed short-lived tokens (HMAC-SHA256) valid for 2 hours, preventing hotlinking and unauthorized scraping while allowing seamless CDN caching for video segments."
  }
];
