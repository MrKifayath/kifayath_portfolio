"use client";

import { useId, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  Layers,
  Play,
  RotateCw,
  Server,
  ShieldCheck,
  Zap,
} from "lucide-react";

type ArchitectureNode = {
  id: string;
  label: string;
  role: string;
  tech: string;
  detail: string;
  metric: string;
};

const ARCHITECTURE_NODES: ArchitectureNode[] = [
  {
    id: "client",
    label: "Merchant & Client UI",
    role: "Next.js 15 App Router",
    tech: "React 19 · Tailwind · TypeScript",
    detail: "High-throughput merchant dashboard with optimistic UI updates and server components.",
    metric: "0.2s FCP",
  },
  {
    id: "gateway",
    label: "API Gateway & Auth",
    role: "NestJS Edge Layer",
    tech: "JWT · Redis Rate Limiter · Helmet",
    detail: "Reverse proxy routing with cryptographic signature validation and DDoS rate-limiting.",
    metric: "< 12ms Edge",
  },
  {
    id: "ledger",
    label: "Transaction Engine",
    role: "Core Payment Engine",
    tech: "ACID Transactions · Double-Entry Ledger",
    detail: "Strict idempotency key enforcement and distributed locks to prevent double-spending.",
    metric: "99.99% Uptime",
  },
  {
    id: "db",
    label: "PostgreSQL & Cache",
    role: "Persistence & Audit",
    tech: "PostgreSQL 16 · Redis Cluster",
    detail: "Multi-tenant partitioned database with immutable ledger logs and encrypted storage.",
    metric: "1.4k txn/sec",
  },
  {
    id: "settlement",
    label: "Webhook & Bank Rail",
    role: "Settlement Dispatcher",
    tech: "HMAC-SHA256 · Retry Queue",
    detail: "Exponential backoff event dispatching to 30+ merchants with bank reconciliation.",
    metric: "Zero Dropped",
  },
];

export function InteractiveShowcase() {
  const [activeTab, setActiveTab] = useState<"architecture" | "cad">("architecture");
  const [selectedNodeId, setSelectedNodeId] = useState<string>("gateway");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationLog, setSimulationLog] = useState<{
    id: string;
    amount: string;
    status: "settled" | "idle";
    latency: number;
    timestamp: string;
  }>({
    id: "TXN-9042",
    amount: "₹14,500.00",
    status: "settled",
    latency: 28,
    timestamp: "Just now",
  });

  // Mechanical CAD Steering Angle (Ackermann geometry)
  const [steeringAngle, setSteeringAngle] = useState(18); // degrees
  const angleSliderId = useId();

  // Ackermann geometry calculation:
  // Wheelbase (L) = 1600mm, Track width (W) = 1200mm
  // delta_outer = atan(L / (L/tan(delta_inner) + W))
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const deg = (radVal: number) => (radVal * 180) / Math.PI;

  const innerAngle = steeringAngle;
  const outerAngle =
    Math.abs(steeringAngle) < 0.5
      ? 0
      : Math.sign(steeringAngle) *
        deg(
          Math.atan(
            1600 / (1600 / Math.tan(rad(Math.abs(steeringAngle))) + 1200),
          ),
        );
  const turnRadius =
    Math.abs(steeringAngle) < 0.5
      ? 99.9
      : Math.round((1.6 / Math.sin(rad(Math.abs(steeringAngle)))) * 10) / 10;

  function runSimulation() {
    if (isSimulating) return;
    setIsSimulating(true);
    const txnNum = Math.floor(1000 + Math.random() * 9000);
    const amount = (Math.floor(25 + Math.random() * 450) * 100).toLocaleString("en-IN");
    const latency = Math.floor(22 + Math.random() * 18);

    setTimeout(() => {
      setSimulationLog({
        id: `TXN-${txnNum}`,
        amount: `₹${amount}.00`,
        status: "settled",
        latency,
        timestamp: "Just now",
      });
      setIsSimulating(false);
    }, 600);
  }

  const selectedNode =
    ARCHITECTURE_NODES.find((node) => node.id === selectedNodeId) ?? ARCHITECTURE_NODES[1];

  return (
    <div className="system-showcase">
      {/* Console Top Toolbar */}
      <div className="system-showcase__header">
        <div className="system-showcase__tabs" role="tablist">
          <button
            aria-selected={activeTab === "architecture"}
            className={`system-tab ${activeTab === "architecture" ? "is-active" : ""}`}
            onClick={() => setActiveTab("architecture")}
            role="tab"
            type="button"
          >
            <Server aria-hidden="true" className="w-3.5 h-3.5" />
            <span>Payment System & APIs</span>
          </button>
          <button
            aria-selected={activeTab === "cad"}
            className={`system-tab ${activeTab === "cad" ? "is-active" : ""}`}
            onClick={() => setActiveTab("cad")}
            role="tab"
            type="button"
          >
            <Cpu aria-hidden="true" className="w-3.5 h-3.5" />
            <span>CAD & Mechanical Kinematics</span>
          </button>
        </div>

        <div className="system-showcase__mode-badge">
          <span className="system-showcase__pulse-light" />
          <span>{activeTab === "architecture" ? "NestJS · Next.js · PostgreSQL" : "SolidWorks · Ackermann"}</span>
        </div>
      </div>

      {/* Main Canvas Body */}
      <div className="system-showcase__body">
        {activeTab === "architecture" ? (
          <div className="architecture-panel">
            {/* Interactive Pipeline Diagram */}
            <div className="architecture-diagram">
              <div className="architecture-diagram__title-row">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground font-mono">
                    CloseXPay Architecture · End-to-End Pipeline
                  </span>
                </div>
                <button
                  className="simulate-button"
                  disabled={isSimulating}
                  onClick={runSimulation}
                  type="button"
                >
                  {isSimulating ? (
                    <RotateCw className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                  )}
                  <span>{isSimulating ? "Processing..." : "Simulate Payment"}</span>
                </button>
              </div>

              {/* Node Rail */}
              <div className="architecture-nodes">
                {ARCHITECTURE_NODES.map((node, i) => {
                  const isSelected = node.id === selectedNodeId;
                  return (
                    <div className="architecture-node-wrapper" key={node.id}>
                      <button
                        className={`architecture-node ${isSelected ? "is-selected" : ""} ${isSimulating ? "is-pulsing" : ""}`}
                        onClick={() => setSelectedNodeId(node.id)}
                        type="button"
                      >
                        <span className="architecture-node__index">0{i + 1}</span>
                        <div className="architecture-node__text">
                          <span className="architecture-node__label">{node.label}</span>
                          <span className="architecture-node__role">{node.role}</span>
                        </div>
                        <span className="architecture-node__metric">{node.metric}</span>
                      </button>
                      {i < ARCHITECTURE_NODES.length - 1 && (
                        <div className={`architecture-connector ${isSimulating ? "is-flowing" : ""}`}>
                          <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Selected Node Spec Inspector */}
              <div className="architecture-inspector">
                <div className="architecture-inspector__header">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-accent" aria-hidden="true" />
                    <span className="font-medium text-sm text-foreground">{selectedNode.label}</span>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">{selectedNode.tech}</span>
                </div>
                <p className="architecture-inspector__detail">{selectedNode.detail}</p>
              </div>

              {/* Live Transaction Ledger Strip */}
              <div className="architecture-ledger">
                <div className="architecture-ledger__item">
                  <span className="ledger-label">Recent Trace:</span>
                  <span className="ledger-value font-mono text-accent">{simulationLog.id}</span>
                </div>
                <div className="architecture-ledger__item">
                  <span className="ledger-label">Volume:</span>
                  <span className="ledger-value font-mono">{simulationLog.amount}</span>
                </div>
                <div className="architecture-ledger__item">
                  <span className="ledger-label">Latency:</span>
                  <span className="ledger-value font-mono">{simulationLog.latency} ms</span>
                </div>
                <div className="architecture-ledger__item">
                  <span className="ledger-label">Status:</span>
                  <span className="ledger-badge">
                    <CheckCircle2 className="w-3 h-3 text-accent" />
                    <span>200 Settled</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="cad-panel">
            <div className="cad-header-row">
              <div>
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-mono">
                  Kinematic Mechanism · Ackermann Steering Geometry
                </span>
                <p className="text-xs text-muted-foreground mt-0.5">
                  SAE BAJA all-terrain vehicle rack-and-pinion assembly (Vishnu Tech & Engineering Technique)
                </p>
              </div>
              <div className="cad-metric-pill font-mono text-xs">
                Turning Radius: <span className="text-accent font-semibold">{turnRadius} m</span>
              </div>
            </div>

            {/* Interactive Steering Slider */}
            <div className="cad-slider-control">
              <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                <label className="text-muted-foreground" htmlFor={angleSliderId}>
                  Steering Rack Angle (θ)
                </label>
                <span className="text-accent font-bold">{steeringAngle > 0 ? `+${steeringAngle}°` : `${steeringAngle}°`}</span>
              </div>
              <input
                className="cad-range-input"
                id={angleSliderId}
                max={30}
                min={-30}
                onChange={(e) => setSteeringAngle(Number(e.target.value))}
                step={1}
                type="range"
                value={steeringAngle}
              />
              <div className="flex justify-between text-[10px] font-mono text-muted-foreground mt-1">
                <span>-30° (Full Left)</span>
                <span>0° (Centered)</span>
                <span>+30° (Full Right)</span>
              </div>
            </div>

            {/* CAD SVG Canvas */}
            <div className="cad-canvas">
              <svg
                className="w-full h-44"
                viewBox="0 0 540 180"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Background CAD Grid */}
                <defs>
                  <pattern id="cad-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-line opacity-30" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#cad-grid)" />

                {/* Center Datum Lines */}
                <line x1="270" y1="10" x2="270" y2="170" stroke="currentColor" strokeDasharray="4 4" className="text-line opacity-60" />
                <line x1="20" y1="90" x2="520" y2="90" stroke="currentColor" strokeDasharray="4 4" className="text-line opacity-60" />

                {/* Main Front Axle Beam */}
                <rect x="110" y="86" width="320" height="8" rx="2" className="fill-surface-raised stroke-line" strokeWidth="1.5" />

                {/* Rack and Pinion Steering Box */}
                <rect x="230" y="78" width="80" height="24" rx="3" className="fill-surface stroke-line" strokeWidth="1.5" />
                <circle cx="270" cy="90" r="6" className="fill-accent opacity-80" />
                {/* Rack Displacement Indicator */}
                <line
                  x1={230 - (steeringAngle * 0.8)}
                  y1="90"
                  x2={310 - (steeringAngle * 0.8)}
                  y2="90"
                  className="stroke-accent"
                  strokeWidth="2.5"
                />

                {/* Left Wheel Assembly (Ackermann Angle: inner/outer based on sign) */}
                <g transform={`translate(110, 90) rotate(${steeringAngle >= 0 ? innerAngle : outerAngle})`}>
                  {/* Wheel Tyre */}
                  <rect x="-14" y="-36" width="28" height="72" rx="4" className="fill-surface-raised stroke-accent" strokeWidth="2" />
                  {/* Wheel Hub */}
                  <circle cx="0" cy="0" r="8" className="fill-accent" />
                  {/* Tread Lines */}
                  <line x1="-12" y1="-20" x2="12" y2="-20" stroke="currentColor" className="text-line opacity-80" />
                  <line x1="-12" y1="0" x2="12" y2="0" stroke="currentColor" className="text-line opacity-80" />
                  <line x1="-12" y1="20" x2="12" y2="20" stroke="currentColor" className="text-line opacity-80" />
                </g>

                {/* Right Wheel Assembly */}
                <g transform={`translate(430, 90) rotate(${steeringAngle >= 0 ? outerAngle : innerAngle})`}>
                  {/* Wheel Tyre */}
                  <rect x="-14" y="-36" width="28" height="72" rx="4" className="fill-surface-raised stroke-accent" strokeWidth="2" />
                  {/* Wheel Hub */}
                  <circle cx="0" cy="0" r="8" className="fill-accent" />
                  {/* Tread Lines */}
                  <line x1="-12" y1="-20" x2="12" y2="-20" stroke="currentColor" className="text-line opacity-80" />
                  <line x1="-12" y1="0" x2="12" y2="0" stroke="currentColor" className="text-line opacity-80" />
                  <line x1="-12" y1="20" x2="12" y2="20" stroke="currentColor" className="text-line opacity-80" />
                </g>

                {/* Tie Rods */}
                <line
                  x1={110}
                  y1={90}
                  x2={230 - (steeringAngle * 0.8)}
                  y2={90}
                  className="stroke-muted-foreground"
                  strokeDasharray="2 2"
                  strokeWidth="1.5"
                />
                <line
                  x1={430}
                  y1={90}
                  x2={310 - (steeringAngle * 0.8)}
                  y2={90}
                  className="stroke-muted-foreground"
                  strokeDasharray="2 2"
                  strokeWidth="1.5"
                />

                {/* CAD Callouts */}
                <text x="50" y="45" className="fill-muted-foreground text-[10px] font-mono">
                  δ_in: {steeringAngle >= 0 ? `${innerAngle.toFixed(1)}°` : `${outerAngle.toFixed(1)}°`}
                </text>
                <text x="430" y="45" className="fill-muted-foreground text-[10px] font-mono">
                  δ_out: {steeringAngle >= 0 ? `${outerAngle.toFixed(1)}°` : `${innerAngle.toFixed(1)}°`}
                </text>
                <text x="220" y="150" className="fill-accent text-[10px] font-mono">
                  cot(δ_o) - cot(δ_i) = w / l
                </text>
              </svg>
            </div>

            <div className="cad-footer-notes">
              <span className="font-mono text-xs text-muted-foreground">
                Geometry: Ackermann Corrected · ±0.025 mm Precision · Validated in SolidWorks Simulation
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
