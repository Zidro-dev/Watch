/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FileCode, Copy, Check, ShieldCheck, Zap, Server } from 'lucide-react';
import { API_ROUTE_CODE } from '../../data/apiRouteCode';

export const ApiRouteViewer: React.FC = () => {
  const [activeCodeTab, setActiveCodeTab] = useState<'route' | 'explanation'>('route');
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(API_ROUTE_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const securityFeatures = [
    {
      title: "Dual Format Parsing (JSON + Beacon)",
      desc: "Standard fetch sends application/json, but browser unload beacon (navigator.sendBeacon) often sends text/plain or Blob. Route automatically handles both without 400 Bad Request errors.",
    },
    {
      title: "Token-Bucket Rate Limiter",
      desc: "Protects database connection pools by capping client syncs to 1 per 5 seconds per (user:episode) pair. Excess requests return 200 THROTTLED instead of 429 to avoid crashing beacon handlers.",
    },
    {
      title: "PostgreSQL Atomic Upsert",
      desc: "Utilizes Prisma's @@unique([userId, episodeId]) to run ON CONFLICT DO UPDATE, guaranteeing single round-trip database execution with zero race conditions.",
    },
    {
      title: "Automatic 90% Completion Trigger",
      desc: "When progress reaches 90% of duration (credits threshold), isCompleted is marked true so the episode cleanly rolls over to the next episode on the homepage.",
    },
  ];

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-6 backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <Server className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">Next.js API Route Blueprint</h2>
              <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-semibold text-emerald-300">
                app/api/watch-history/sync/route.ts
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              High-throughput Edge/Node endpoint for 10s heartbeats, Beacon unload, and database protection
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-xl bg-neutral-950/80 p-1 border border-neutral-800">
            <button
              onClick={() => setActiveCodeTab('route')}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                activeCodeTab === 'route'
                  ? 'bg-neutral-800 text-emerald-400 shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              route.ts Code
            </button>
            <button
              onClick={() => setActiveCodeTab('explanation')}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                activeCodeTab === 'explanation'
                  ? 'bg-neutral-800 text-rose-400 shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Database Protection Architecture
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-800 px-3.5 py-2 text-xs font-medium text-white hover:bg-neutral-700 transition-all shadow-sm"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy Route'}
          </button>
        </div>
      </div>

      {activeCodeTab === 'route' ? (
        <div className="mt-5 space-y-3">
          <div className="relative rounded-xl border border-neutral-800 bg-neutral-950 p-4 font-mono text-xs overflow-x-auto max-h-[540px]">
            <pre className="text-neutral-300 leading-relaxed">
              <code>{API_ROUTE_CODE}</code>
            </pre>
          </div>
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {securityFeatures.map((feat, idx) => (
              <div key={idx} className="rounded-xl border border-neutral-800 bg-neutral-950/70 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold">
                    <ShieldCheck className="h-4 w-4" />
                  </span>
                  <h4 className="font-semibold text-white text-sm">{feat.title}</h4>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed pl-9">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 text-xs font-mono text-neutral-300">
            <span className="text-emerald-400 font-semibold block mb-2 flex items-center gap-1.5">
              <Zap className="h-4 w-4" /> Client-to-Server Sync Lifecycle
            </span>
            <p className="text-neutral-400 leading-relaxed">
              1. <span className="text-white font-bold">Video Plays:</span> React hook sets 10s timer.<br />
              2. <span className="text-white font-bold">Client Throttle:</span> Only fires if head moved &gt;= 2s and at least 3s elapsed.<br />
              3. <span className="text-white font-bold">User Seeks:</span> Debounced 1.2s to wait until scrubber release.<br />
              4. <span className="text-white font-bold">User Pauses:</span> Immediate flush of exact paused timestamp.<br />
              5. <span className="text-white font-bold">User Closes Tab:</span> <code className="text-rose-400">navigator.sendBeacon</code> dispatches payload asynchronously without blocking browser close.<br />
              6. <span className="text-white font-bold">Server UPSERT:</span> Single atomic database write via composite unique key constraint.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
