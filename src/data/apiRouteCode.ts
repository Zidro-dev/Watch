/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const API_ROUTE_CODE = `// ==============================================================================
// app/api/watch-history/sync/route.ts
// Production Next.js 14+ Route Handler for Watch History Sync
// Optimized for High Throughput, Navigator.sendBeacon & Database Protection
// ==============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth/getAuthUser";
import { rateLimiter } from "@/lib/rateLimiter";

// Zod Schema for payload validation
const syncPayloadSchema = z.object({
  episodeId: z.string().min(1, "episodeId is required"),
  progressSeconds: z.number().int().min(0, "progressSeconds must be >= 0"),
  durationSeconds: z.number().int().positive("durationSeconds must be > 0"),
  preferredAudioLang: z.string().optional(),
  preferredSubtitleLang: z.string().optional(),
});

export const runtime = "nodejs"; // or "edge" if using Prisma Accelerate or Supabase pooler

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user from Supabase session cookie / Bearer token
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in to sync watch progress." },
        { status: 401 }
      );
    }

    // 2. Parse body (supports both standard JSON and navigator.sendBeacon text/plain)
    let rawBody: unknown;
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      rawBody = await req.json();
    } else {
      // Beacon calls often send as text/plain or blob to avoid CORS preflight
      const text = await req.text();
      try {
        rawBody = JSON.parse(text);
      } catch {
        return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
      }
    }

    // 3. Strict schema validation
    const parsed = syncPayloadSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 422 }
      );
    }

    const { episodeId, progressSeconds, durationSeconds, preferredAudioLang, preferredSubtitleLang } = parsed.data;

    // 4. Rate-Limiting Protection (Prevent DB flooding)
    // Allows at most 1 sync per 5 seconds per (user:episode) pair
    const rateLimitKey = \`sync:\${user.id}:\${episodeId}\`;
    const isAllowed = await rateLimiter.check(rateLimitKey, { maxRequests: 1, windowSeconds: 5 });

    if (!isAllowed) {
      // Return 200 with THROTTLED status instead of 429 to avoid crashing beacon clients
      return NextResponse.json(
        { status: "THROTTLED", message: "Sync request throttled. Write skipped." },
        { status: 200 }
      );
    }

    // 5. Completion Calculation
    // Anime standard: If progress is >= 90% of episode duration (including credits),
    // mark as completed so it clears out of "Continue Watching" row or shows "Next Ep".
    const completionRate = Math.min(1.0, progressSeconds / durationSeconds);
    const isCompleted = completionRate >= 0.90;

    // 6. Atomic UPSERT into Database
    // Using PostgreSQL ON CONFLICT DO UPDATE via Prisma composite unique key
    const updatedHistory = await prisma.watchHistory.upsert({
      where: {
        userId_episodeId: {
          userId: user.id,
          episodeId: episodeId,
        },
      },
      create: {
        userId: user.id,
        episodeId: episodeId,
        progressSeconds: progressSeconds,
        durationSeconds: durationSeconds,
        completionRate: completionRate,
        isCompleted: isCompleted,
        preferredAudioLang: preferredAudioLang ?? null,
        preferredSubtitleLang: preferredSubtitleLang ?? null,
        lastWatchedAt: new Date(),
      },
      update: {
        progressSeconds: progressSeconds,
        durationSeconds: durationSeconds,
        completionRate: completionRate,
        isCompleted: isCompleted,
        preferredAudioLang: preferredAudioLang ?? undefined,
        preferredSubtitleLang: preferredSubtitleLang ?? undefined,
        lastWatchedAt: new Date(),
      },
      select: {
        episodeId: true,
        progressSeconds: true,
        isCompleted: true,
        lastWatchedAt: true,
      },
    });

    // 7. Fast response
    return NextResponse.json(
      {
        status: "SUCCESS",
        syncedAt: updatedHistory.lastWatchedAt,
        progressSeconds: updatedHistory.progressSeconds,
        isCompleted: updatedHistory.isCompleted,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("[WatchHistorySync API Error]:", error);
    return NextResponse.json(
      { error: "Internal server error occurred while syncing progress" },
      { status: 500 }
    );
  }
}
`;
