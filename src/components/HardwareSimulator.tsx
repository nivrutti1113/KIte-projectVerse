'use client';

import React, { useState, useEffect } from 'react';
import { 
  Play, 
  RotateCcw, 
  Bot, 
  Compass, 
  Gauge, 
  Sparkles, 
  Sliders, 
  Zap, 
  Droplets,
  Sun,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface HardwareSimulatorProps {
  projectId: string;
  projectTitle: string;
}

export default function HardwareSimulator({
  projectId,
  projectTitle
}: HardwareSimulatorProps) {
  // Obstacle Rover State
  const [distance, setDistance] = useState<number>(35);
  const [isAutoRoam, setIsAutoRoam] = useState<boolean>(false);
  const [roverAngle, setRoverAngle] = useState<number>(0);

  // Plant Watering State
  const [soilMoisture, setSoilMoisture] = useState<number>(22);
  const [isPumping, setIsPumping] = useState<boolean>(false);

  // Solar Tracker State
  const [sunAngle, setSunAngle] = useState<number>(45);

  // Auto Roam loop for Obstacle Rover
  useEffect(() => {
    if (!isAutoRoam) return;

    const interval = setInterval(() => {
      setDistance(prev => {
        if (prev <= 16) {
          // Trigger turn
          setRoverAngle(a => (a + 45) % 360);
          return 42; // Reset after turn
        }
        return prev - 3; // Approach wall
      });
    }, 700);

    return () => clearInterval(interval);
  }, [isAutoRoam]);

  // Automated pump effect for Plant Watering
  useEffect(() => {
    if (soilMoisture < 30) {
      setIsPumping(true);
      const timer = setTimeout(() => {
        setSoilMoisture(prev => Math.min(prev + 15, 65));
      }, 1200);
      return () => clearTimeout(timer);
    } else {
      setIsPumping(false);
    }
  }, [soilMoisture]);

  const isObstacleDetected = distance <= 20;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
      {/* Simulator Header */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <Play className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
              <span>Interactive Hardware Behavior Simulator</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                Physics & Code Simulator
              </span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Test how your real sensors and actuators respond to physical environmental inputs before uploading code.
            </p>
          </div>
        </div>

        {projectId === 'proj-001' && (
          <button
            onClick={() => setIsAutoRoam(!isAutoRoam)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs ${
              isAutoRoam 
                ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100' 
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            <Play className="h-3.5 w-3.5" />
            <span>{isAutoRoam ? 'Stop Auto-Roam' : 'Start Auto-Roam'}</span>
          </button>
        )}
      </div>

      {/* Simulator Stage */}
      <div className="p-6 bg-slate-900 text-white min-h-[380px] flex flex-col justify-between relative overflow-hidden">
        {/* Background Grid */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(#38bdf8 1px, transparent 1px), linear-gradient(90deg, #38bdf8 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }}
        />

        {/* ========================================================
            CASE A: OBSTACLE-AVOIDING ROVER SIMULATOR (proj-001)
            ======================================================== */}
        {projectId === 'proj-001' && (
          <div className="relative z-10 flex flex-col items-center justify-center flex-1 py-4">
            {/* Real-time Status Badge */}
            <div className="mb-6 flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm ${
                isObstacleDetected 
                  ? 'bg-rose-500/90 text-white ring-2 ring-rose-400/30 animate-pulse'
                  : 'bg-emerald-500/90 text-white ring-2 ring-emerald-400/30'
              }`}>
                <span className="h-2 w-2 rounded-full bg-white" />
                {isObstacleDetected ? 'OBSTACLE DETECTED (< 20cm) — PIVOTING RIGHT' : 'CLEAR PATH — FORWARD PWM 180'}
              </span>

              <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-mono text-xs border border-slate-700">
                Distance: <strong className="text-cyan-400">{distance} cm</strong>
              </span>
            </div>

            {/* Top-Down Rover Arena */}
            <div className="relative w-full max-w-lg h-60 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-center overflow-hidden">
              {/* Virtual Wall / Obstacle */}
              <div 
                className="absolute right-6 top-8 bottom-8 w-6 bg-gradient-to-b from-amber-500 to-rose-600 rounded-lg border border-amber-300/40 shadow-lg flex items-center justify-center"
                style={{
                  transform: `translateX(-${Math.max(0, (50 - distance) * 4.5)}px)`
                }}
              >
                <span className="text-[10px] uppercase font-black text-white transform -rotate-90 whitespace-nowrap">
                  WALL / OBSTACLE
                </span>
              </div>

              {/* Ultrasonic Sonar Wave Cone */}
              <div 
                className="absolute left-1/2 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300"
                style={{
                  left: 'calc(50% + 20px)',
                  width: `${Math.max(30, distance * 5.2)}px`,
                  height: `${Math.max(40, distance * 3.5)}px`,
                  background: isObstacleDetected
                    ? 'radial-gradient(ellipse at left, rgba(239,68,68,0.4) 0%, rgba(239,68,68,0.05) 70%, transparent 100%)'
                    : 'radial-gradient(ellipse at left, rgba(56,189,248,0.4) 0%, rgba(56,189,248,0.05) 70%, transparent 100%)',
                  clipPath: 'polygon(0% 40%, 100% 0%, 100% 100%, 0% 60%)'
                }}
              />

              {/* Rover Body Graphic */}
              <div 
                className="relative z-10 w-28 h-40 bg-blue-600/90 border-2 border-cyan-400 rounded-2xl flex flex-col items-center justify-between p-2 shadow-2xl transition-transform duration-500"
                style={{
                  transform: `rotate(${roverAngle}deg)`
                }}
              >
                {/* Front Ultrasonic Eyes */}
                <div className="flex items-center gap-3 mt-1">
                  <div className="h-4 w-4 rounded-full bg-slate-200 border-2 border-slate-400 flex items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-700" />
                  </div>
                  <div className="h-4 w-4 rounded-full bg-slate-200 border-2 border-slate-400 flex items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-700" />
                  </div>
                </div>

                {/* Arduino Board Emblem */}
                <div className="w-16 h-12 bg-sky-950/90 border border-cyan-400/60 rounded-md flex flex-col items-center justify-center text-[8px] font-mono font-bold text-cyan-300">
                  <span>ARDUINO</span>
                  <span className="text-[7px] text-slate-400">UNO R3</span>
                </div>

                {/* Left & Right BO Wheels */}
                <div className="absolute -left-3 top-8 bottom-8 w-3 bg-slate-800 border border-slate-600 rounded-sm" />
                <div className="absolute -right-3 top-8 bottom-8 w-3 bg-slate-800 border border-slate-600 rounded-sm" />

                <span className="text-[9px] font-bold text-white/80">KITE ROVER</span>
              </div>
            </div>

            {/* Interactive Distance Slider Controls */}
            <div className="w-full max-w-md mt-6 bg-slate-800/80 p-4 rounded-xl border border-slate-700">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Sliders className="h-3.5 w-3.5 text-cyan-400" /> Simulate Obstacle Distance:
                </span>
                <span className="font-mono text-cyan-300 font-bold">{distance} cm</span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>5 cm (Crash Zone)</span>
                <span className="text-amber-400">20 cm (Decision Threshold)</span>
                <span>60 cm (Clear Space)</span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            CASE B: SMART PLANT WATERING SIMULATOR (proj-002)
            ======================================================== */}
        {projectId === 'proj-002' && (
          <div className="relative z-10 flex flex-col items-center justify-center flex-1 py-4">
            <div className="mb-6 flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm ${
                isPumping 
                  ? 'bg-blue-500/90 text-white ring-2 ring-blue-400/30 animate-pulse'
                  : 'bg-emerald-500/90 text-white ring-2 ring-emerald-400/30'
              }`}>
                <Droplets className="h-3.5 w-3.5" />
                {isPumping ? 'PUMP ACTIVE — WATERING SOIL' : 'SOIL MOIST — PUMP STANDBY'}
              </span>

              <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-mono text-xs border border-slate-700">
                Moisture: <strong className="text-emerald-400">{soilMoisture}%</strong>
              </span>
            </div>

            {/* Plant Pot & Water Pump Arena */}
            <div className="relative w-full max-w-lg h-60 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-around p-6">
              {/* Plant Pot */}
              <div className="flex flex-col items-center">
                <span className="text-3xl mb-1">{soilMoisture < 30 ? '🥀' : '🌿'}</span>
                <div 
                  className="w-24 h-20 rounded-b-2xl border-2 border-amber-800 flex items-center justify-center text-xs font-bold transition-colors"
                  style={{
                    backgroundColor: soilMoisture < 30 ? '#78350f' : '#3f2212'
                  }}
                >
                  <span className="text-amber-200 text-[10px]">{soilMoisture}% Soil</span>
                </div>
              </div>

              {/* Relay & 5V Water Pump */}
              <div className="flex flex-col items-center gap-2">
                <div className={`p-3 rounded-xl border flex items-center gap-2 ${
                  isPumping 
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300' 
                    : 'bg-slate-900 border-slate-700 text-slate-500'
                }`}>
                  <Zap className="h-4 w-4" />
                  <span className="text-xs font-mono font-bold">Relay: {isPumping ? 'ON' : 'OFF'}</span>
                </div>

                <div className={`p-2.5 rounded-lg border text-[11px] font-mono ${
                  isPumping 
                    ? 'bg-blue-950 border-blue-500 text-blue-300' 
                    : 'bg-slate-900 border-slate-700 text-slate-500'
                }`}>
                  5V Submersible Pump
                </div>
              </div>
            </div>

            {/* Soil Moisture Slider */}
            <div className="w-full max-w-md mt-6 bg-slate-800/80 p-4 rounded-xl border border-slate-700">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Droplets className="h-3.5 w-3.5 text-blue-400" /> Simulate Soil Hygrometry:
                </span>
                <span className="font-mono text-emerald-300 font-bold">{soilMoisture}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="85"
                value={soilMoisture}
                onChange={(e) => setSoilMoisture(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span className="text-rose-400">5% (Arid Dry)</span>
                <span className="text-amber-400">30% (Pump Trigger)</span>
                <span className="text-emerald-400">85% (Lush Saturated)</span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            CASE C: GENERAL HARDWARE SIMULATOR (proj-003, proj-004, etc.)
            ======================================================== */}
        {projectId !== 'proj-001' && projectId !== 'proj-002' && (
          <div className="relative z-10 flex flex-col items-center justify-center flex-1 py-8 text-center">
            <Sun className="h-12 w-12 text-amber-400 mb-3 animate-pulse" />
            <h4 className="text-sm font-bold text-white mb-1">Actuator & Sensor Loop Test Active</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
              Simulating continuous ADC sensor updates, digital GPIO triggers, and pulse-width modulation signals.
            </p>

            <div className="p-4 rounded-xl bg-slate-800/90 border border-slate-700 w-full max-w-md text-left text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">GPIO Pin 9 Status:</span>
                <span className="font-mono font-bold text-emerald-400">PWM ACTIVE (210/255)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Analog Pin A0 Voltage:</span>
                <span className="font-mono font-bold text-cyan-400">3.24V (ADC: 664)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Serial Baud Rate:</span>
                <span className="font-mono font-bold text-white">9600 baud</span>
              </div>
            </div>
          </div>
        )}

        {/* Telemetry Footer */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 font-mono">
          <span>Target Microcontroller: ATmega328P @ 16 MHz</span>
          <span className="text-emerald-400">● Simulation Engine Online</span>
        </div>
      </div>
    </div>
  );
}
