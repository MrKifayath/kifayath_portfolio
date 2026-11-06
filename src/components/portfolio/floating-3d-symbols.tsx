"use client";

import React from "react";

export function Floating3DSymbols() {
  return (
    <div className="floating-symbols-layer" aria-hidden="true">
      {/* 1. Curly Brace { (Top Left) */}
      <div className="symbol-3d symbol-3d--brace">
        <svg
          viewBox="0 0 160 260"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_24px_48px_rgba(0,0,0,0.8)]"
        >
          <defs>
            {/* Front metallic gradient */}
            <linearGradient id="brace-front" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2e3831" />
              <stop offset="45%" stopColor="#1a221d" />
              <stop offset="100%" stopColor="#0f1612" />
            </linearGradient>
            {/* Extrusion / 3D Side depth */}
            <linearGradient id="brace-side" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#111713" />
              <stop offset="100%" stopColor="#080c09" />
            </linearGradient>
            {/* Lime Rim Glow */}
            <linearGradient id="brace-lime-rim" x1="0" y1="0" x2="0.3" y2="1">
              <stop offset="0%" stopColor="#d4f938" stopOpacity="0.85" />
              <stop offset="35%" stopColor="#7fa58a" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#d4f938" stopOpacity="0.75" />
            </linearGradient>
            <filter id="brace-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="-2" dy="2" stdDeviation="6" floodColor="#d4f938" floodOpacity="0.35" />
            </filter>
          </defs>

          {/* 3D Extruded Depth Layers */}
          <path
            d="M 120 20 C 70 20 50 50 50 90 L 50 110 C 50 125 35 130 15 130 C 35 130 50 135 50 150 L 50 170 C 50 210 70 240 120 240 L 130 240 L 130 205 L 115 205 C 85 205 78 185 78 160 L 78 145 C 78 128 65 118 45 115 C 65 112 78 102 78 85 L 78 70 C 78 45 85 25 115 25 L 130 25 L 130 20 Z"
            fill="url(#brace-side)"
            transform="translate(18, 14)"
          />
          <path
            d="M 120 20 C 70 20 50 50 50 90 L 50 110 C 50 125 35 130 15 130 C 35 130 50 135 50 150 L 50 170 C 50 210 70 240 120 240 L 130 240 L 130 205 L 115 205 C 85 205 78 185 78 160 L 78 145 C 78 128 65 118 45 115 C 65 112 78 102 78 85 L 78 70 C 78 45 85 25 115 25 L 130 25 L 130 20 Z"
            fill="url(#brace-side)"
            transform="translate(10, 8)"
          />

          {/* Front Face */}
          <path
            d="M 120 20 C 70 20 50 50 50 90 L 50 110 C 50 125 35 130 15 130 C 35 130 50 135 50 150 L 50 170 C 50 210 70 240 120 240 L 130 240 L 130 205 L 115 205 C 85 205 78 185 78 160 L 78 145 C 78 128 65 118 45 115 C 65 112 78 102 78 85 L 78 70 C 78 45 85 25 115 25 L 130 25 L 130 20 Z"
            fill="url(#brace-front)"
            stroke="url(#brace-lime-rim)"
            strokeWidth="3.5"
            filter="url(#brace-glow)"
          />

          {/* Precision Lime Edge Glint */}
          <path
            d="M 120 20 C 70 20 50 50 50 90 L 50 110 C 50 125 35 130 15 130"
            fill="none"
            stroke="#d4f938"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* 2. Hash # (Top Right) */}
      <div className="symbol-3d symbol-3d--hash">
        <svg
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)]"
        >
          <defs>
            <linearGradient id="hash-front" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#303832" />
              <stop offset="50%" stopColor="#1e2621" />
              <stop offset="100%" stopColor="#101512" />
            </linearGradient>
            <linearGradient id="hash-depth" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#111613" />
              <stop offset="100%" stopColor="#080c09" />
            </linearGradient>
            <linearGradient id="hash-edge" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4a5a4e" />
              <stop offset="100%" stopColor="#1b241e" />
            </linearGradient>
          </defs>

          {/* 3D Extrusion Behind */}
          <g transform="translate(12, 10)">
            <rect x="52" y="14" width="22" height="132" rx="4" fill="url(#hash-depth)" transform="skewX(-14)" />
            <rect x="94" y="14" width="22" height="132" rx="4" fill="url(#hash-depth)" transform="skewX(-14)" />
            <rect x="14" y="52" width="132" height="22" rx="4" fill="url(#hash-depth)" />
            <rect x="14" y="94" width="132" height="22" rx="4" fill="url(#hash-depth)" />
          </g>

          {/* Front Face of # */}
          <g>
            <rect
              x="52"
              y="14"
              width="22"
              height="132"
              rx="4"
              fill="url(#hash-front)"
              stroke="url(#hash-edge)"
              strokeWidth="2"
              transform="skewX(-14)"
            />
            <rect
              x="94"
              y="14"
              width="22"
              height="132"
              rx="4"
              fill="url(#hash-front)"
              stroke="url(#hash-edge)"
              strokeWidth="2"
              transform="skewX(-14)"
            />
            <rect
              x="14"
              y="52"
              width="132"
              height="22"
              rx="4"
              fill="url(#hash-front)"
              stroke="url(#hash-edge)"
              strokeWidth="2"
            />
            <rect
              x="14"
              y="94"
              width="132"
              height="22"
              rx="4"
              fill="url(#hash-front)"
              stroke="url(#hash-edge)"
              strokeWidth="2"
            />
          </g>
        </svg>
      </div>

      {/* 3. Slash / (Bottom Left) */}
      <div className="symbol-3d symbol-3d--slash">
        <svg
          viewBox="0 0 110 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_20px_44px_rgba(0,0,0,0.85)]"
        >
          <defs>
            <linearGradient id="slash-front" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2c352e" />
              <stop offset="50%" stopColor="#18201a" />
              <stop offset="100%" stopColor="#0c110e" />
            </linearGradient>
            <linearGradient id="slash-side" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#111612" />
              <stop offset="100%" stopColor="#060907" />
            </linearGradient>
          </defs>

          {/* 3D Extrusion Side */}
          <polygon points="56,12 84,12 38,208 10,208" fill="url(#slash-side)" transform="translate(14, 10)" />

          {/* Front Face */}
          <polygon
            points="56,12 84,12 38,208 10,208"
            fill="url(#slash-front)"
            stroke="#d4f938"
            strokeWidth="2.5"
            strokeOpacity="0.8"
          />
          {/* Neon rim edge highlight */}
          <line x1="56" y1="12" x2="10" y2="208" stroke="#d4f938" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* 4. Code Tag </> (Bottom Right) */}
      <div className="symbol-3d symbol-3d--code-tag">
        <svg
          viewBox="0 0 240 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_24px_50px_rgba(0,0,0,0.85)]"
        >
          <defs>
            <linearGradient id="tag-front" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2d3730" />
              <stop offset="50%" stopColor="#19221c" />
              <stop offset="100%" stopColor="#0e1410" />
            </linearGradient>
            <linearGradient id="tag-depth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#111613" />
              <stop offset="100%" stopColor="#070a08" />
            </linearGradient>
            <linearGradient id="tag-lime" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#d4f938" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#7fa58a" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* 3D Extrusion Depth Behind */}
          <g transform="translate(14, 12)" fill="url(#tag-depth)">
            {/* < */}
            <path d="M 66 32 L 20 90 L 66 148 L 84 134 L 48 90 L 84 46 Z" />
            {/* / */}
            <polygon points="128,24 144,24 104,156 88,156" />
            {/* > */}
            <path d="M 166 46 L 202 90 L 166 134 L 184 148 L 230 90 L 184 32 Z" />
          </g>

          {/* Front Face Elements */}
          <g fill="url(#tag-front)" stroke="url(#tag-lime)" strokeWidth="2.5">
            {/* < */}
            <path d="M 66 32 L 20 90 L 66 148 L 84 134 L 48 90 L 84 46 Z" />
            {/* / */}
            <polygon points="128,24 144,24 104,156 88,156" />
            {/* > */}
            <path d="M 166 46 L 202 90 L 166 134 L 184 148 L 230 90 L 184 32 Z" />
          </g>

          {/* Highlights on Leading Edges */}
          <path d="M 66 32 L 20 90 L 66 148" fill="none" stroke="#d4f938" strokeWidth="3" strokeLinecap="round" />
          <line x1="128" y1="24" x2="88" y2="156" stroke="#d4f938" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}
