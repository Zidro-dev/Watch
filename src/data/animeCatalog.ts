/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Anime } from '../types/anime';

export const SAMPLE_SUBTITLES_CUES = [
  { start: 0, end: 5, text: "[Narrator] In a world where hunters awakened with magical powers..." },
  { start: 5, end: 12, text: "They ventured into ominous gates connecting to dangerous dungeons." },
  { start: 12, end: 16, text: "Sung Jin-woo: 'I was known as the weakest hunter of all mankind.'" },
  { start: 16, end: 22, text: "Sung Jin-woo: 'An E-Rank hunter with no future, risking death every raid.'" },
  { start: 23, end: 28, text: "[OP Theme: 'LEveL' by SawanoHiroyuki[nZk]:TOMORROW X TOGETHER begins]" },
  { start: 85, end: 92, text: "Sung Jin-woo: 'Until that day in the Double Dungeon... when the System chose me.'" },
  { start: 93, end: 98, text: "[System Notification: 'Quest info updated: Daily Training Complete']" },
  { start: 99, end: 106, text: "Sung Jin-woo: 'From that moment on, only I can level up.'" },
  { start: 107, end: 115, text: "Igris: 'Your command, my Liege...'" },
  { start: 116, end: 125, text: "Sung Jin-woo: 'Arise.'" },
  { start: 126, end: 140, text: "[Epic orchestral choir swells as the Shadow Army rises from the darkness]" }
];

export const ANIME_CATALOG: Anime[] = [
  {
    id: "anime-solo-leveling",
    slug: "solo-leveling",
    title: "Solo Leveling",
    romajiTitle: "Ore dake Level Up na Ken",
    description: "Ten years ago, the 'Gate' appeared, connecting the real world with the realm of magic and monsters. To combat these vile beasts, ordinary people received superhuman powers and became known as 'Hunters'. Twenty-year-old Sung Jinwoo is one such Hunter, but he is known as the 'World's Weakest', owing to his pathetic power compared to even a measly E-Rank.",
    bannerImage: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1600&q=80",
    posterImage: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80",
    genres: ["Action", "Fantasy", "Supernatural", "Adventure"],
    status: "RELEASING",
    releaseYear: 2024,
    rating: "TV-MA",
    studio: "A-1 Pictures",
    totalEpisodes: 24,
    seasons: [
      {
        id: "season-sl-1",
        animeId: "anime-solo-leveling",
        seasonNumber: 1,
        title: "Season 1: Arise",
        year: 2024,
        episodes: [
          {
            id: "ep-sl-01",
            seasonId: "season-sl-1",
            animeId: "anime-solo-leveling",
            episodeNumber: 1,
            title: "I'm Used to It",
            synopsis: "Sung Jinwoo, an E-Rank hunter branded as the weakest of all mankind, ventures into a low-rank dungeon with a strike team, unaware of the dual dungeon lurking within.",
            durationSec: 1420,
            thumbnail: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=640&q=80",
            masterHlsUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
            introStartSec: 22,
            introEndSec: 88,
            outroStartSec: 1330,
            outroEndSec: 1410,
            audioTracks: [
              { id: "aud-sl-1-ja", episodeId: "ep-sl-01", languageCode: "ja-JP", languageName: "Japanese (Original)", isDefault: true, codec: "aac", channels: "5.1 Surround" },
              { id: "aud-sl-1-en", episodeId: "ep-sl-01", languageCode: "en-US", languageName: "English Dub", isDefault: false, codec: "aac", channels: "Stereo" },
              { id: "aud-sl-1-es", episodeId: "ep-sl-01", languageCode: "es-419", languageName: "Spanish (Latin America)", isDefault: false, codec: "aac", channels: "Stereo" },
              { id: "aud-sl-1-fr", episodeId: "ep-sl-01", languageCode: "fr-FR", languageName: "French Dub", isDefault: false, codec: "aac", channels: "Stereo" },
              { id: "aud-sl-1-de", episodeId: "ep-sl-01", languageCode: "de-DE", languageName: "German Dub", isDefault: false, codec: "aac", channels: "Stereo" }
            ],
            subtitles: [
              { id: "sub-sl-1-en", episodeId: "ep-sl-01", languageCode: "en-US", languageName: "English [Full Dialogue]", isDefault: true, type: "FULL", format: "WEBVTT", cues: SAMPLE_SUBTITLES_CUES },
              { id: "sub-sl-1-es", episodeId: "ep-sl-01", languageCode: "es-419", languageName: "Español (Latinoamérica)", isDefault: false, type: "FULL", format: "WEBVTT", cues: SAMPLE_SUBTITLES_CUES },
              { id: "sub-sl-1-pt", episodeId: "ep-sl-01", languageCode: "pt-BR", languageName: "Português (Brasil)", isDefault: false, type: "FULL", format: "WEBVTT", cues: SAMPLE_SUBTITLES_CUES },
              { id: "sub-sl-1-fr", episodeId: "ep-sl-01", languageCode: "fr-FR", languageName: "Français", isDefault: false, type: "FULL", format: "WEBVTT", cues: SAMPLE_SUBTITLES_CUES },
              { id: "sub-sl-1-de", episodeId: "ep-sl-01", languageCode: "de-DE", languageName: "Deutsch", isDefault: false, type: "FULL", format: "WEBVTT", cues: SAMPLE_SUBTITLES_CUES }
            ]
          },
          {
            id: "ep-sl-02",
            seasonId: "season-sl-1",
            animeId: "anime-solo-leveling",
            episodeNumber: 2,
            title: "If I Had One More Chance",
            synopsis: "Trapped in the temple of the God Statue, Jinwoo deciphers the commandments of the Cartenon Temple while his comrades fall one by one.",
            durationSec: 1435,
            thumbnail: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=640&q=80",
            masterHlsUrl: "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8",
            introStartSec: 30,
            introEndSec: 95,
            audioTracks: [
              { id: "aud-sl-2-ja", episodeId: "ep-sl-02", languageCode: "ja-JP", languageName: "Japanese (Original)", isDefault: true, codec: "aac" },
              { id: "aud-sl-2-en", episodeId: "ep-sl-02", languageCode: "en-US", languageName: "English Dub", isDefault: false, codec: "aac" },
              { id: "aud-sl-2-es", episodeId: "ep-sl-02", languageCode: "es-419", languageName: "Spanish (Latin America)", isDefault: false, codec: "aac" }
            ],
            subtitles: [
              { id: "sub-sl-2-en", episodeId: "ep-sl-02", languageCode: "en-US", languageName: "English [Full Dialogue]", isDefault: true, type: "FULL", format: "WEBVTT", cues: SAMPLE_SUBTITLES_CUES },
              { id: "sub-sl-2-es", episodeId: "ep-sl-02", languageCode: "es-419", languageName: "Español", isDefault: false, type: "FULL", format: "WEBVTT", cues: SAMPLE_SUBTITLES_CUES }
            ]
          },
          {
            id: "ep-sl-03",
            seasonId: "season-sl-1",
            animeId: "anime-solo-leveling",
            episodeNumber: 3,
            title: "It's Like a Game",
            synopsis: "Jinwoo awakens in a hospital room alive and unharmed, greeted by a floating holographic interface only visible to his eyes.",
            durationSec: 1410,
            thumbnail: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=640&q=80",
            masterHlsUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
            introStartSec: 25,
            introEndSec: 90,
            audioTracks: [
              { id: "aud-sl-3-ja", episodeId: "ep-sl-03", languageCode: "ja-JP", languageName: "Japanese (Original)", isDefault: true, codec: "aac" },
              { id: "aud-sl-3-en", episodeId: "ep-sl-03", languageCode: "en-US", languageName: "English Dub", isDefault: false, codec: "aac" }
            ],
            subtitles: [
              { id: "sub-sl-3-en", episodeId: "ep-sl-03", languageCode: "en-US", languageName: "English [Full Dialogue]", isDefault: true, type: "FULL", format: "WEBVTT", cues: SAMPLE_SUBTITLES_CUES }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "anime-frieren",
    slug: "frieren-beyond-journeys-end",
    title: "Frieren: Beyond Journey's End",
    romajiTitle: "Sousou no Frieren",
    description: "The mage Frieren defeated the Demon King alongside the hero Himmel's party after a 10-year quest. As an elf whose lifespan exceeds a millennium, she promised to meet them again after fifty years, only to realize the brevity of human lives.",
    bannerImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80",
    posterImage: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80",
    genres: ["Fantasy", "Adventure", "Drama", "Slice of Life"],
    status: "COMPLETED",
    releaseYear: 2023,
    rating: "TV-14",
    studio: "Madhouse",
    totalEpisodes: 28,
    seasons: [
      {
        id: "season-frieren-1",
        animeId: "anime-frieren",
        seasonNumber: 1,
        title: "Season 1",
        year: 2023,
        episodes: [
          {
            id: "ep-frieren-01",
            seasonId: "season-frieren-1",
            animeId: "anime-frieren",
            episodeNumber: 1,
            title: "The Journey's End",
            synopsis: "After defeating the Demon King, the hero party disbands. Half a century later, Frieren returns to the capital to find her companions aged and mortal.",
            durationSec: 1460,
            thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=640&q=80",
            masterHlsUrl: "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8",
            introStartSec: 15,
            introEndSec: 85,
            audioTracks: [
              { id: "aud-fr-1-ja", episodeId: "ep-frieren-01", languageCode: "ja-JP", languageName: "Japanese (Original)", isDefault: true, codec: "aac" },
              { id: "aud-fr-1-en", episodeId: "ep-frieren-01", languageCode: "en-US", languageName: "English Dub", isDefault: false, codec: "aac" }
            ],
            subtitles: [
              { id: "sub-fr-1-en", episodeId: "ep-frieren-01", languageCode: "en-US", languageName: "English [Full Dialogue]", isDefault: true, type: "FULL", format: "WEBVTT", cues: SAMPLE_SUBTITLES_CUES }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "anime-jujutsu-kaisen",
    slug: "jujutsu-kaisen",
    title: "Jujutsu Kaisen",
    romajiTitle: "Sorcery Fight",
    description: "Yuji Itadori, a boy with tremendous physical strength, swallows a cursed talisman—the finger of Ryomen Sukuna—to protect a classmate, unwittingly bringing the King of Curses into his own soul.",
    bannerImage: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1600&q=80",
    posterImage: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
    genres: ["Supernatural", "Action", "Dark Fantasy"],
    status: "RELEASING",
    releaseYear: 2023,
    rating: "TV-MA",
    studio: "MAPPA",
    totalEpisodes: 47,
    seasons: [
      {
        id: "season-jjk-2",
        animeId: "anime-jujutsu-kaisen",
        seasonNumber: 2,
        title: "Season 2: Shibuya Incident",
        year: 2023,
        episodes: [
          {
            id: "ep-jjk-25",
            seasonId: "season-jjk-2",
            animeId: "anime-jujutsu-kaisen",
            episodeNumber: 1,
            title: "Hidden Inventory",
            synopsis: "In the spring of 2006, Satoru Gojo and Suguru Geto are assigned an escort mission of paramount importance: guarding the Star Plasma Vessel.",
            durationSec: 1420,
            thumbnail: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=640&q=80",
            masterHlsUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
            introStartSec: 20,
            introEndSec: 88,
            audioTracks: [
              { id: "aud-jjk-ja", episodeId: "ep-jjk-25", languageCode: "ja-JP", languageName: "Japanese (Original)", isDefault: true, codec: "aac" },
              { id: "aud-jjk-en", episodeId: "ep-jjk-25", languageCode: "en-US", languageName: "English Dub", isDefault: false, codec: "aac" }
            ],
            subtitles: [
              { id: "sub-jjk-en", episodeId: "ep-jjk-25", languageCode: "en-US", languageName: "English [Full Dialogue]", isDefault: true, type: "FULL", format: "WEBVTT", cues: SAMPLE_SUBTITLES_CUES }
            ]
          }
        ]
      }
    ]
  }
];
