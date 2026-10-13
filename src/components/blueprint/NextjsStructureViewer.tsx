/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Folder, FolderOpen, FileCode, ChevronRight, ChevronDown, Compass, Layers, ShieldCheck } from 'lucide-react';
import { NEXTJS_PROJECT_STRUCTURE, ARCHITECTURE_RATIONALE, StructureNode } from '../../data/projectStructureData';

interface TreeNodeProps {
  node: StructureNode;
  level: number;
  onSelectFile: (node: StructureNode) => void;
  selectedNode: StructureNode | null;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, level, onSelectFile, selectedNode }) => {
  const [isOpen, setIsOpen] = useState<boolean>(level < 2);
  const isSelected = selectedNode?.name === node.name && selectedNode?.description === node.description;

  if (node.type === 'folder') {
    return (
      <div>
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-neutral-800/60 cursor-pointer text-xs font-mono text-neutral-300 transition-colors"
          style={{ paddingLeft: `${level * 16 + 8}px` }}
        >
          {isOpen ? <ChevronDown className="h-3.5 w-3.5 text-neutral-500" /> : <ChevronRight className="h-3.5 w-3.5 text-neutral-500" />}
          {isOpen ? <FolderOpen className="h-4 w-4 text-amber-400" /> : <Folder className="h-4 w-4 text-amber-400" />}
          <span className="font-semibold text-neutral-200">{node.name}</span>
        </div>
        {isOpen && node.children && (
          <div>
            {node.children.map((child, idx) => (
              <TreeNode
                key={`${child.name}-${idx}`}
                node={child}
                level={level + 1}
                onSelectFile={onSelectFile}
                selectedNode={selectedNode}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      onClick={() => onSelectFile(node)}
      className={`flex items-center justify-between py-1.5 px-2 rounded-lg cursor-pointer text-xs font-mono transition-all ${
        isSelected
          ? 'bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/40'
          : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200 border border-transparent'
      }`}
      style={{ paddingLeft: `${level * 16 + 24}px` }}
    >
      <div className="flex items-center gap-2">
        <FileCode className={`h-3.5 w-3.5 ${isSelected ? 'text-rose-400' : 'text-neutral-500'}`} />
        <span>{node.name}</span>
      </div>
      {node.badge && (
        <span
          className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
            node.badge === 'Server'
              ? 'bg-blue-500/20 text-blue-300'
              : node.badge === 'Client'
              ? 'bg-emerald-500/20 text-emerald-300'
              : node.badge === 'Edge'
              ? 'bg-amber-500/20 text-amber-300'
              : node.badge === 'Config'
              ? 'bg-purple-500/20 text-purple-300'
              : 'bg-neutral-800 text-neutral-300'
          }`}
        >
          {node.badge}
        </span>
      )}
    </div>
  );
};

export const NextjsStructureViewer: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<StructureNode | null>(
    NEXTJS_PROJECT_STRUCTURE[0].children?.[0].children?.[2].children?.[0].children?.[0].children?.[0] || null
  );

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-6 backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
            <Compass className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">Next.js 14+ App Router Architecture</h2>
              <span className="rounded-full bg-blue-500/20 border border-blue-500/30 px-2.5 py-0.5 text-xs font-semibold text-blue-300">
                Enterprise Scale
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Clean separation of Server Components, Client Video Player DOM, and Edge API sync
            </p>
          </div>
        </div>
      </div>

      {/* Explorer Grid */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Tree View */}
        <div className="lg:col-span-5 rounded-xl border border-neutral-800 bg-neutral-950 p-3 max-h-[500px] overflow-y-auto">
          <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-2 px-2">
            Repository File Hierarchy
          </div>
          {NEXTJS_PROJECT_STRUCTURE.map((rootNode, idx) => (
            <TreeNode
              key={idx}
              node={rootNode}
              level={0}
              onSelectFile={(node) => setSelectedNode(node)}
              selectedNode={selectedNode}
            />
          ))}
        </div>

        {/* Right: Selected Node Details & Rationale */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          {/* Selected File Details */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <FileCode className="h-4 w-4 text-rose-400" />
                <span className="font-mono text-sm font-bold text-white">
                  {selectedNode?.name || 'Select a file from the tree'}
                </span>
              </div>
              {selectedNode?.badge && (
                <span className="rounded-md bg-neutral-800 px-2 py-0.5 text-xs font-semibold text-rose-400">
                  {selectedNode.badge} Component
                </span>
              )}
            </div>

            <p className="mt-3 text-xs text-neutral-300 leading-relaxed">
              {selectedNode?.description ||
                'Browse through the tree on the left to inspect architectural responsibilities and runtime boundaries.'}
            </p>

            <div className="mt-4 rounded-lg bg-neutral-900 border border-neutral-800/80 p-3 text-xs text-neutral-400">
              <span className="font-semibold text-neutral-200 block mb-1">Architectural Boundary Note:</span>
              {selectedNode?.badge === 'Server' && (
                <span>
                  Rendered exclusively on the Next.js Node.js server. Has direct zero-latency access to Prisma ORM without exposing database credentials to the client. Zero client JavaScript bundle cost.
                </span>
              )}
              {selectedNode?.badge === 'Client' && (
                <span>
                  Designated with <code className="text-emerald-400">&apos;use client&apos;</code>. Manages browser state, <code className="text-emerald-400">hls.js</code> video element refs, keyboard event listeners, and media controls.
                </span>
              )}
              {selectedNode?.badge === 'Edge' && (
                <span>
                  Runs on Vercel / Cloudflare Edge network close to the end user. Handles high-frequency heartbeats in &lt;15ms latency with token bucket rate-limiting.
                </span>
              )}
              {!['Server', 'Client', 'Edge'].includes(selectedNode?.badge || '') && (
                <span>
                  Shared domain logic, type definition, or configuration file reused across client and server boundaries.
                </span>
              )}
            </div>
          </div>

          {/* Architectural Rationale Cards */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-blue-400" /> Architectural Design Principles
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {ARCHITECTURE_RATIONALE.map((item, idx) => (
                <div key={idx} className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-3 text-xs">
                  <div className="font-semibold text-white mb-1 flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{item.title}</span>
                  </div>
                  <p className="text-neutral-400 text-[11px] leading-tight line-clamp-4">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
