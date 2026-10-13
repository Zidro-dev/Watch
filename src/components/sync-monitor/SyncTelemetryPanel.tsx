/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Activity, Radio, ShieldCheck, Zap, Database, ArrowDownUp, RefreshCw, AlertCircle } from 'lucide-react';
import { SyncTelemetryEvent } from '../../types/anime';

interface SyncTelemetryPanelProps {
  logs: SyncTelemetryEvent[];
  lastSyncedProgress: number;
  lastSyncedTimestamp: string | null;
  isSyncing: boolean;
  syncCount: number;
  onForceSync: () => void;
  onSimulateBeacon: () => void;
  onClearLogs: () => void;
}

export const SyncTelemetryPanel: React.FC<SyncTelemetryPanelProps> = ({
  logs,
  lastSyncedProgress,
  lastSyncedTimestamp,
  isSyncing,
  syncCount,
  onForceSync,
  onSimulateBeacon,
  onClearLogs,
}) => {
  const [selectedLog, setSelectedLog] = useState<SyncTelemetryEvent | null>(null);

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5 backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
            <Radio className="h-5 w-5" />
            {isSyncing && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-white">WatchHistory Sync Telemetry</h3>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                10s Heartbeat Active
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Live stream progress monitoring & write-reduction telemetry
            </p>
          </div>
        </div>

        {/* Action triggers */}
        <div className="flex items-center gap-2">
          <button
            onClick={onForceSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-800/80 px-3 py-1.5 text-xs font-medium text-neutral-200 hover:bg-neutral-700 hover:text-white transition-all disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            Force Sync
          </button>
          <button
            onClick={onSimulateBeacon}
            className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-300 hover:bg-amber-500/20 transition-all"
            title="Simulate page close / navigator.sendBeacon"
          >
            <Zap className="h-3.5 w-3.5" />
            Simulate Unload Beacon
          </button>
          <button
            onClick={onClearLogs}
            className="rounded-lg px-2.5 py-1.5 text-xs text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-neutral-800/80 bg-neutral-950/60 p-3">
          <span className="text-[11px] text-neutral-400 flex items-center gap-1">
            <Activity className="h-3.5 w-3.5 text-rose-400" /> Total Pulses
          </span>
          <div className="mt-1 font-mono text-xl font-bold text-white">{syncCount}</div>
          <span className="text-[10px] text-neutral-500">Every 10s playback</span>
        </div>

        <div className="rounded-xl border border-neutral-800/80 bg-neutral-950/60 p-3">
          <span className="text-[11px] text-neutral-400 flex items-center gap-1">
            <Database className="h-3.5 w-3.5 text-blue-400" /> Last Synced Head
          </span>
          <div className="mt-1 font-mono text-xl font-bold text-white">
            {Math.floor(lastSyncedProgress / 60)}:
            {lastSyncedProgress % 60 < 10 ? '0' : ''}
            {lastSyncedProgress % 60}
          </div>
          <span className="text-[10px] text-neutral-500">{lastSyncedTimestamp || 'Awaiting tick'}</span>
        </div>

        <div className="rounded-xl border border-neutral-800/80 bg-neutral-950/60 p-3">
          <span className="text-[11px] text-neutral-400 flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> DB Write Strategy
          </span>
          <div className="mt-1 font-mono text-sm font-semibold text-emerald-300">Atomic UPSERT</div>
          <span className="text-[10px] text-neutral-500">ON CONFLICT DO UPDATE</span>
        </div>

        <div className="rounded-xl border border-neutral-800/80 bg-neutral-950/60 p-3">
          <span className="text-[11px] text-neutral-400 flex items-center gap-1">
            <ArrowDownUp className="h-3.5 w-3.5 text-purple-400" /> Network Overhead
          </span>
          <div className="mt-1 font-mono text-sm font-semibold text-purple-300">~148 bytes/req</div>
          <span className="text-[10px] text-neutral-500">Zero connection strain</span>
        </div>
      </div>

      {/* Real-time Log Stream */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs font-semibold text-neutral-400 mb-2">
          <span>Real-Time Sync Stream</span>
          <span className="text-[11px] text-neutral-500">{logs.length} events logged</span>
        </div>

        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-800 py-8 text-neutral-500 text-xs">
              <Activity className="h-6 w-6 mb-2 opacity-40 animate-pulse" />
              Hit Play on the video above to trigger 10-second sync pulses...
            </div>
          ) : (
            logs.map((log) => {
              const isSelected = selectedLog?.id === log.id;
              return (
                <div
                  key={log.id}
                  onClick={() => setSelectedLog(isSelected ? null : log)}
                  className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-mono transition-all cursor-pointer border ${
                    isSelected
                      ? 'border-rose-500/50 bg-rose-500/10'
                      : 'border-neutral-800/60 bg-neutral-950/40 hover:bg-neutral-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        log.method === 'BEACON_UNLOAD'
                          ? 'bg-amber-400'
                          : log.method === 'SEEK_FLUSH'
                          ? 'bg-purple-400'
                          : 'bg-emerald-400'
                      }`}
                    />
                    <span className="text-neutral-400">{log.timestamp}</span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                        log.method === 'BEACON_UNLOAD'
                          ? 'bg-amber-500/20 text-amber-300'
                          : log.method === 'SEEK_FLUSH'
                          ? 'bg-purple-500/20 text-purple-300'
                          : log.method === 'PAUSE_FLUSH'
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {log.method}
                    </span>
                    <span className="text-neutral-300">
                      head: {log.progressSeconds}s / {log.durationSeconds}s ({Math.round(log.completionRate * 100)}%)
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-neutral-500">{log.latencyMs}ms</span>
                    <span className="rounded bg-neutral-800 px-1.5 py-0.5 text-[10px] text-neutral-300">
                      {log.status}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Log JSON Preview */}
        {selectedLog && (
          <div className="mt-3 rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-xs font-mono">
            <div className="flex items-center justify-between text-neutral-400 mb-1 border-b border-neutral-800 pb-1">
              <span>Event Details ({selectedLog.id})</span>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-neutral-500 hover:text-white"
              >
                ✕
              </button>
            </div>
            <pre className="text-neutral-300 overflow-x-auto text-[11px] leading-tight">
              {JSON.stringify(
                {
                  method: selectedLog.method,
                  status: selectedLog.status,
                  bytesSent: selectedLog.bytesSent,
                  latencyMs: selectedLog.latencyMs,
                  payload: selectedLog.payload,
                },
                null,
                2
              )}
            </pre>
          </div>
        )}
      </div>

      {/* Architecture note */}
      <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-blue-500/20 bg-blue-500/5 p-3 text-xs text-neutral-300">
        <AlertCircle className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-blue-300">Why this design avoids database crashes: </span>
          Unlike naive implementations that fire an UPDATE on every scrubber tick, this architecture uses a 10s interval timer while playing, debounces seeks by 1.2s, flushes via <code className="text-rose-300">navigator.sendBeacon</code> on tab unload, and uses PostgreSQL composite unique upsert with a 5-second token bucket rate limit.
        </div>
      </div>
    </div>
  );
};
