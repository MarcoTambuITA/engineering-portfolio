"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
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

// Simulate a simplified JSON representation of the telemetry.db spatial & speed data
const generateTelemetry = () => {
  const data = [];
  const totalPoints = 200;
  
  for (let i = 0; i < totalPoints; i++) {
    const t = (i / totalPoints) * 2 * Math.PI;
    
    // Generate a figure-8 (lemniscate) track shape
    const scale = 110;
    const denominator = 1 + Math.sin(t) * Math.sin(t);
    const xOffset = 150;
    const yOffset = 100;
    
    const x = (scale * Math.cos(t)) / denominator + xOffset;
    const y = (scale * Math.sin(t) * Math.cos(t)) / denominator + yOffset;
    
    // Speed dynamic calculation: slow down in curves (when sin(t) is large)
    const curveFactor = Math.abs(Math.sin(t));
    let baseSpeed = 140 - (80 * curveFactor); 
    
    // Add realistic sensor noise
    baseSpeed += (Math.random() * 4 - 2);
    
    data.push({
      time: (i * 0.1).toFixed(1),
      x,
      y,
      speed: Math.max(30, Number(baseSpeed.toFixed(1))),
      throttle: baseSpeed > 100 ? 100 : (baseSpeed < 70 ? 0 : 50),
      brake: baseSpeed < 70 ? 100 : 0,
      distance: i,
    });
  }
  return data;
};

const TELEMETRY_DATA = generateTelemetry();

export default function RacingSimulationWidget() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Ghost car index (optimal lap, slightly ahead)
  const ghostIndex = (currentIndex + 5) % TELEMETRY_DATA.length;

  // Playback loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % TELEMETRY_DATA.length);
      }, 50); // 50ms per tick
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Canvas drawing for 2D track path
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Draw base track line (dark gray)
    ctx.beginPath();
    ctx.strokeStyle = "#21262d";
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    TELEMETRY_DATA.forEach((pt, i) => {
      if (i === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.closePath();
    ctx.stroke();

    // 2. Draw driven path (blue)
    ctx.beginPath();
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 4;
    for (let i = 0; i <= currentIndex; i++) {
      const pt = TELEMETRY_DATA[i];
      if (i === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    }
    ctx.stroke();

    // 3. Draw Ghost Car (gray dot)
    const ghostPt = TELEMETRY_DATA[ghostIndex];
    ctx.beginPath();
    ctx.arc(ghostPt.x, ghostPt.y, 4, 0, 2 * Math.PI);
    ctx.fillStyle = "#8b949e";
    ctx.fill();

    // 4. Draw Current Car (red dot)
    const currentPt = TELEMETRY_DATA[currentIndex];
    ctx.beginPath();
    ctx.arc(currentPt.x, currentPt.y, 6, 0, 2 * Math.PI);
    ctx.fillStyle = "#f43f5e";
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();

  }, [currentIndex, ghostIndex]);

  const currentData = TELEMETRY_DATA[currentIndex];

  return (
    <div className="bg-[#0d1117] border border-gray-800 rounded-xl p-4 md:p-6 my-8 shadow-2xl font-sans">
      <div className="mb-6 border-b border-gray-800 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-white tracking-wide m-0">
            Live Telemetry Engine (Lite)
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Browser-based ingestion and spatial mapping of multi-dimensional racing data.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-[#238636] hover:bg-[#2ea043] text-white px-4 py-1.5 rounded-md text-xs font-bold transition-colors border border-[rgba(240,246,252,0.1)]"
          >
            {isPlaying ? "Pause Session" : "Play Session"}
          </button>
          <button
            onClick={() => setCurrentIndex(0)}
            className="bg-[#21262d] hover:bg-[#30363d] text-white px-4 py-1.5 rounded-md text-xs font-bold transition-colors border border-gray-700"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Left Side: Canvas Track Visualization */}
        <div className="lg:col-span-1 bg-[#161b22] border border-gray-800 rounded-lg p-4 flex flex-col items-center justify-center min-h-[250px]">
          <div className="w-full flex justify-between text-[10px] font-mono text-gray-500 mb-2">
            <span>Spatial Mapping (X/Y)</span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-[#f43f5e]"></div> Current 
              <div className="w-2 h-2 rounded-full bg-[#8b949e] ml-2"></div> Ghost
            </span>
          </div>
          <canvas
            ref={canvasRef}
            width={300}
            height={200}
            className="bg-[#0d1117] border border-gray-800 rounded-md shadow-inner w-full max-w-[300px]"
          />
          <div className="grid grid-cols-3 gap-2 w-full mt-4 text-center font-mono">
            <div className="bg-[#0d1117] border border-gray-800 rounded p-2">
              <div className="text-[9px] text-gray-500 uppercase">Speed</div>
              <div className="text-[#38bdf8] font-bold text-sm">{currentData.speed} mph</div>
            </div>
            <div className="bg-[#0d1117] border border-gray-800 rounded p-2">
              <div className="text-[9px] text-gray-500 uppercase">Throttle</div>
              <div className="text-green-400 font-bold text-sm">{currentData.throttle}%</div>
            </div>
            <div className="bg-[#0d1117] border border-gray-800 rounded p-2">
              <div className="text-[9px] text-gray-500 uppercase">Brake</div>
              <div className="text-red-400 font-bold text-sm">{currentData.brake}%</div>
            </div>
          </div>
        </div>

        {/* Right Side: Telemetry Graphs */}
        <div className="lg:col-span-2 h-[250px] lg:h-auto min-h-[300px] w-full bg-[#161b22] rounded-lg border border-gray-800 p-3 flex flex-col">
          <div className="flex justify-between text-[10px] font-mono text-gray-500 px-2 pb-2 border-b border-gray-800/50 mb-2">
            <span>Y-Axis: Speed (mph)</span>
            <span>X-Axis: Track Distance</span>
          </div>
          <div className="flex-1 min-h-0 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={TELEMETRY_DATA} margin={{ top: 10, right: 15, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#21262d" vertical={false} />
                <XAxis dataKey="distance" hide />
                <YAxis
                  stroke="#48515c"
                  fontSize={10}
                  tickFormatter={(val) => `${val}`}
                  fontFamily="monospace"
                  domain={[20, 150]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0d1117",
                    border: "1px solid #30363d",
                    borderRadius: "6px",
                  }}
                  itemStyle={{ color: "#38bdf8", fontSize: "12px", fontFamily: "monospace" }}
                  labelStyle={{ display: "none" }}
                  formatter={(value: number) => [`${value} mph`, "Speed"]}
                />
                {/* Full Track Speed Profile (Grayed out) */}
                <Line
                  type="monotone"
                  dataKey="speed"
                  stroke="#30363d"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
                {/* Active Tracker Line */}
                <ReferenceLine
                  x={currentData.distance}
                  stroke="#f43f5e"
                  strokeWidth={2}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
