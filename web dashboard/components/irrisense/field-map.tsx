"use client"

import { Radio, Signal } from "lucide-react"

export function FieldMap() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-[#e5e7eb] bg-gradient-to-br from-[#1a3a2a] to-[#0f2218]">
      {/* SVG Map Background */}
      <svg
        viewBox="0 0 400 420"
        className="h-[420px] w-full"
        role="region"
        aria-label="Sfax olive farm map with master and slave node locations"
      >
        {/* Field background */}
        <defs>
          <pattern id="olive-grid" x="20" y="20" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="2" fill="#4CAF50" opacity="0.3" />
          </pattern>
        </defs>

        {/* Farm area background */}
        <rect width="400" height="420" fill="#0d1f15" />
        <rect width="400" height="420" fill="url(#olive-grid)" />

        {/* Master node coverage zone (circle) */}
        <circle
          cx="200"
          cy="160"
          r="120"
          fill="none"
          stroke="#4CAF50"
          strokeWidth="1.5"
          strokeDasharray="5,5"
          opacity="0.3"
        />

        {/* LoRa connection line */}
        <line
          x1="200"
          y1="160"
          x2="320"
          y2="280"
          stroke="#4CAF50"
          strokeWidth="2"
          strokeDasharray="8,4"
          opacity="0.6"
        />

        {/* Master Node - Farm */}
        <g transform="translate(200, 160)">
          {/* Pulse ring */}
          <circle
            cx="0"
            cy="0"
            r="18"
            fill="none"
            stroke="#4CAF50"
            strokeWidth="1"
            opacity="0.2"
          />
          {/* Main circle */}
          <circle cx="0" cy="0" r="12" fill="#4CAF50" stroke="#2d7a3a" strokeWidth="2.5" />
          {/* Center dot */}
          <circle cx="0" cy="0" r="5" fill="#fff" opacity="0.9" />
        </g>

        {/* Slave Node - Control Room */}
        <g transform="translate(320, 280)">
          {/* Pulse ring */}
          <circle
            cx="0"
            cy="0"
            r="18"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="1"
            opacity="0.2"
          />
          {/* Main circle */}
          <circle cx="0" cy="0" r="12" fill="#3b82f6" stroke="#1e40af" strokeWidth="2.5" />
          {/* Center dot */}
          <circle cx="0" cy="0" r="5" fill="#fff" opacity="0.9" />
        </g>

        {/* Labels */}
        <text
          x="200"
          y="200"
          textAnchor="middle"
          fill="#4CAF50"
          fontSize="12"
          fontWeight="600"
          fontFamily="system-ui"
        >
          Master Node
        </text>
        <text
          x="200"
          y="215"
          textAnchor="middle"
          fill="#9ca3af"
          fontSize="10"
          fontFamily="system-ui"
        >
          Field Unit (Sensors)
        </text>

        <text
          x="320"
          y="320"
          textAnchor="middle"
          fill="#3b82f6"
          fontSize="12"
          fontWeight="600"
          fontFamily="system-ui"
        >
          Slave Node
        </text>
        <text
          x="320"
          y="335"
          textAnchor="middle"
          fill="#9ca3af"
          fontSize="10"
          fontFamily="system-ui"
        >
          Control Room
        </text>
      </svg>

      {/* LoRa Signal badge */}
      <div className="absolute right-4 top-4 flex items-center gap-2 rounded-md border border-white/10 bg-[#0f1320]/80 px-3 py-1.5 backdrop-blur-sm">
        <Signal className="h-3.5 w-3.5 text-[#4CAF50]" />
        <span className="text-[11px] font-medium text-slate-200">LoRa Signal:</span>
        <span className="font-mono text-[11px] font-bold text-[#4CAF50]">●●●○</span>
        <span className="text-[11px] font-semibold text-[#4CAF50]">Strong</span>
      </div>

      {/* Node legend */}
      <div className="absolute left-4 top-4 space-y-1.5">
        <div className="flex items-center gap-2 rounded-md border border-white/10 bg-[#0f1320]/80 px-2.5 py-1 backdrop-blur-sm">
          <div className="h-3 w-3 rounded-full bg-[#4CAF50]" />
          <span className="text-[11px] font-semibold text-slate-200">Master — Farm Field</span>
        </div>
        <div className="flex items-center gap-2 rounded-md border border-white/10 bg-[#0f1320]/80 px-2.5 py-1 backdrop-blur-sm">
          <div className="h-3 w-3 rounded-full bg-[#3b82f6]" />
          <span className="text-[11px] font-semibold text-slate-200">Slave — Control Room</span>
        </div>
      </div>

      {/* Coords info */}
      <div className="absolute bottom-4 left-4 rounded-md border border-white/10 bg-[#0f1320]/80 px-2.5 py-1 font-mono text-[10.5px] text-slate-300 backdrop-blur-sm">
        <span className="text-[#4CAF50]">◎</span> Sfax, Tunisia · 35.2883°N, 10.7597°E
      </div>
    </div>
  )
}
