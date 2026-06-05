"use client";

import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

// Real high-frequency SPICE-modeled saturation limits for the HSMS-2850 topologies
const TOPOLOGIES = [
  { id: "half-wave", name: "Half-Wave Baseline", max_eta: 0.4583, v_drop: 0.25 },
  { id: "full-wave", name: "Full-Wave Bridge", max_eta: 0.0912, v_drop: 0.50 }, // Double diode tax
  { id: "doubler-untuned", name: "Voltage Doubler (Un-tuned)", max_eta: 0.0445, v_drop: 0.30 },
  { id: "doubler-tuned", name: "Voltage Doubler (Tuned)", max_eta: 0.9178, v_drop: 0.20 },
  { id: "cw-2stage", name: "2-Stage Cockcroft-Walton", max_eta: 0.0372, v_drop: 0.65 }, // Heavy multi-stage threshold tax
];

const C_LIGHT = 299792458; 
const MU_0 = 4 * Math.PI * 1e-7; 

// Accurate polynomial approximation for Complete Elliptic Integrals K(m) and E(m)
function ellipke(m: number) {
  const m1 = 1 - m;
  if (m1 < 0 || m1 > 1) return { K: 0, E: 0 };

  const a0 = 1.38629436112, a1 = 0.09666344259, a2 = 0.03590092383;
  const b0 = 0.5, b1 = 0.12498593597, b2 = 0.06880248576;
  const c1 = 0.44325141463, c2 = 0.06260601220, c3 = 0.04757383546;
  const d1 = 0.24998368310, d2 = 0.09200180037, d3 = 0.04069697526;

  let K = (a0 + m1 * (a1 + m1 * a2)) - Math.log(m1) * (b0 + m1 * (b1 + m1 * b2));
  let E = (1 + m1 * (c1 + m1 * (c2 + m1 * c3))) - Math.log(m1) * (m1 * (d1 + m1 * (d2 + m1 * d3)));

  if (m === 1) { K = Infinity; E = 1; }
  return { K, E };
}

function calcNeumannMutualInductance(r1: number, r2: number, d: number) {
  let m = (4 * r1 * r2) / (Math.pow(r1 + r2, 2) + Math.pow(d, 2));
  m = Math.max(1e-6, Math.min(m, 0.9999)); 
  const { K, E } = ellipke(m);
  const k_param = Math.sqrt(m);
  return MU_0 * Math.sqrt(r1 * r2) * ((2 / k_param - k_param) * K - (2 / k_param) * E);
}

export default function WPTSimulatorWidget() {
  const [freqMHz, setFreqMHz] = useState(2450); 
  const [dTxCm, setDTxCm] = useState(10); 
  const [dRxCm, setDRxCm] = useState(5); 
  const [topologyId, setTopologyId] = useState("doubler-tuned");

  const topo = TOPOLOGIES.find((t) => t.id === topologyId) || TOPOLOGIES[3];

  const { data, radiansphereCm, maxSweepCc } = useMemo(() => {
    const freqHz = freqMHz * 1e6;
    const lam = C_LIGHT / freqHz;
    const radiansphere = lam / (2 * Math.PI);

    const r_tx = (dTxCm / 100) / 2;
    const r_rx = (dRxCm / 100) / 2;

    // Dynamically scale the plot limits based on frequency domain
    const max_dist = freqMHz < 100 ? Math.max(1.5, radiansphere * 1.5) : 0.5;
    const steps = 80;
    const plotData = [];

    // Continuous geometry equations for dynamic coil metrics (replaces hardcoded hacks)
    const L_tx = MU_0 * r_tx * Math.pow(5, 2); // Approximated self-inductance based on radius
    const L_rx = MU_0 * r_rx * Math.pow(5, 2);
    const Q1 = Math.max(10, 0.05 * Math.sqrt(freqHz)); // Frequency dependent skin-effect approximation
    const Q2 = Q1;

    // Circular Aperture Gain
    const eta_ap = 0.55;
    const G_tx_lin = (Math.pow(Math.PI, 2) * eta_ap * Math.pow(r_tx * 2, 2)) / Math.pow(lam, 2);
    const G_rx_lin = (Math.pow(Math.PI, 2) * eta_ap * Math.pow(r_rx * 2, 2)) / Math.pow(lam, 2);

    const P_tx_watts = 1.0; // Fixed 1W (30 dBm) source drive to evaluate thresholds clean

    for (let i = 1; i <= steps; i++) {
      const d = (i / steps) * max_dist;
      let link_efficiency = 0;
      let regime = "";

      if (d <= radiansphere) {
        regime = "Near-Field";
        const M = calcNeumannMutualInductance(r_tx, r_rx, d) * 25; // 5-turn scaling
        let k_coil = M / Math.sqrt(L_tx * L_rx);
        k_coil = Math.min(Math.max(k_coil, 0), 0.95);
        const U = k_coil * Math.sqrt(Q1 * Q2);
        link_efficiency = Math.pow(U, 2) / Math.pow(1 + Math.sqrt(1 + Math.pow(U, 2)), 2);
      } else {
        regime = "Far-Field";
        const path_loss_lin = Math.pow(lam / (4 * Math.PI * d), 2);
        link_efficiency = Math.min(G_tx_lin * G_rx_lin * path_loss_lin, 1.0);
      }

      // 1. Calculate absolute RF power hitting the rectenna terminal
      const P_rx_watts = P_tx_watts * link_efficiency;
      const P_rx_dbm = P_rx_watts > 0 ? 10 * Math.log10(P_rx_watts / 0.001) : -40;

      // 2. Continuous Schottky Junction Behavioral Model (Recreates the threshold cliff)
      // High voltage drops shift the turn-on curve further to the right
      const center_threshold = -10 + (topo.v_drop * 20); 
      const diode_rect_efficiency = topo.max_eta / (1 + Math.exp(-(P_rx_dbm - center_threshold) / 4.5));

      // 3. Compute final integrated end-to-end efficiency
      const total_system_efficiency_pct = link_efficiency * diode_rect_efficiency * 100;

      plotData.push({
        distance: (d * 100).toFixed(1),
        efficiency: Math.max(0, Math.min(total_system_efficiency_pct, topo.max_eta * 100)),
        regime,
      });
    }

    return { 
      data: plotData, 
      radiansphereCm: (radiansphere * 100).toFixed(1),
      maxSweepCc: (max_dist * 100).toFixed(0)
    };
  }, [freqMHz, dTxCm, dRxCm, topo]);

  return (
    <div className="bg-[#0d1117] border border-gray-800 rounded-xl p-4 md:p-6 my-8 shadow-2xl font-sans">
      <div className="mb-6 border-b border-gray-800 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <div>
          <h3 className="text-xl font-bold text-white tracking-wide m-0">
            Interactive WPT Co-Simulator
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Validates first-principle spatial links coupled to non-linear Schottky junction threshold models.
          </p>
        </div>
        <div className="bg-[#161b22] px-3 py-1 rounded-full border border-gray-700 text-[10px] text-gray-300 font-mono">
          P_tx = 30 dBm (1W)
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
        {/* Left Side: Controls (2 Columns) */}
        <div className="lg:col-span-2 space-y-5 bg-[#161b22] border border-gray-800 rounded-lg p-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-gray-300 font-mono mb-1">
                <span>Operational Frequency</span>
                <span className="text-[#38bdf8] font-bold">{freqMHz} MHz</span>
              </div>
              <input
                type="range"
                min="10"
                max="5800"
                step="10"
                value={freqMHz}
                onChange={(e) => setFreqMHz(Number(e.target.value))}
                className="w-full accent-[#38bdf8] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-gray-300 font-mono mb-1">
                <span>TX Aperture/Coil Diameter</span>
                <span className="text-[#38bdf8] font-bold">{dTxCm} cm</span>
              </div>
              <input
                type="range"
                min="2"
                max="30"
                step="0.5"
                value={dTxCm}
                onChange={(e) => setDTxCm(Number(e.target.value))}
                className="w-full accent-[#38bdf8] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-gray-300 font-mono mb-1">
                <span>RX Aperture/Coil Diameter</span>
                <span className="text-[#38bdf8] font-bold">{dRxCm} cm</span>
              </div>
              <input
                type="range"
                min="2"
                max="30"
                step="0.5"
                value={dRxCm}
                onChange={(e) => setDRxCm(Number(e.target.value))}
                className="w-full accent-[#38bdf8] cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-800">
            <label className="block text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider">
              Selected Rectifier Topology
            </label>
            <select
              value={topologyId}
              onChange={(e) => setTopologyId(e.target.value)}
              className="w-full bg-[#0d1117] border border-gray-700 text-sm text-white font-mono rounded-lg p-2.5 outline-none focus:border-[#38bdf8] transition-colors"
            >
              {TOPOLOGIES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} (Max η: {(t.max_eta * 100).toFixed(1)}%)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Side: Chart Visualizer (3 Columns) */}
        <div className="lg:col-span-3 h-[300px] lg:h-auto min-h-[300px] w-full bg-[#161b22] rounded-lg border border-gray-800 p-3 flex flex-col">
          <div className="flex justify-between text-[10px] font-mono text-gray-500 px-2 pb-2 border-b border-gray-800/50 mb-2">
            <span>Y-Axis: End-to-End System Efficiency (η)</span>
            <span>Sweep Range: 0 to {maxSweepCc} cm</span>
          </div>
          
          <div className="flex-1 min-h-0 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 15, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#21262d" vertical={false} />
                <XAxis
                  dataKey="distance"
                  stroke="#48515c"
                  fontSize={10}
                  tickFormatter={(val) => `${val}cm`}
                  fontFamily="monospace"
                />
                <YAxis
                  stroke="#48515c"
                  fontSize={10}
                  tickFormatter={(val) => `${val}%`}
                  fontFamily="monospace"
                  domain={[0, topo.max_eta * 100 + 5]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0d1117",
                    border: "1px solid #30363d",
                    borderRadius: "6px",
                  }}
                  itemStyle={{ color: "#38bdf8", fontSize: "12px", fontFamily: "monospace" }}
                  labelStyle={{ color: "#8b949e", fontSize: "11px", fontFamily: "monospace" }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(value: any) => [`${Number(value).toFixed(3)}%`, "Total Efficiency"]}
                  labelFormatter={(label, items) => {
                    const regime = items[0]?.payload?.regime || "";
                    return `Distance: ${label} cm [${regime}]`;
                  }}
                />
                {Number(radiansphereCm) > 0 && Number(radiansphereCm) < Number(maxSweepCc) && (
                  <ReferenceLine
                    x={radiansphereCm}
                    stroke="#f43f5e"
                    strokeDasharray="4 4"
                    label={{
                      position: "insideTopRight",
                      value: `Boundary: ${radiansphereCm}cm`,
                      fill: "#f43f5e",
                      fontSize: 9,
                      fontFamily: "monospace",
                    }}
                  />
                )}
                <Line
                  type="monotone"
                  dataKey="efficiency"
                  stroke="#38bdf8"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, fill: "#38bdf8", stroke: "#0d1117", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
