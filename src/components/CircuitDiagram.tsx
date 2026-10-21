'use client';

import React, { useState } from 'react';
import { WiringConnection } from '@/types';
import { 
  Cpu, 
  Zap, 
  Layers, 
  Info, 
  CheckCircle2, 
  Eye, 
  Filter, 
  Sparkles,
  Maximize2
} from 'lucide-react';

interface CircuitDiagramProps {
  projectTitle: string;
  schematicType?: 'arduino_robot' | 'smart_plant' | 'solar_tracker' | 'iot_esp32' | 'ai_camera' | 'smart_home';
  activeStep?: number;
  connections: WiringConnection[];
}

export default function CircuitDiagram({
  projectTitle,
  schematicType = 'arduino_robot',
  activeStep = 1,
  connections
}: CircuitDiagramProps) {
  const [selectedWire, setSelectedWire] = useState<WiringConnection | null>(null);
  const [filterComponent, setFilterComponent] = useState<string>('All');
  const [isZoomed, setIsZoomed] = useState(false);

  const colorHexMap: Record<string, string> = {
    red: '#ef4444',
    black: '#0f172a',
    blue: '#2563eb',
    green: '#10b981',
    yellow: '#eab308',
    orange: '#f97316',
    purple: '#a855f7',
    white: '#94a3b8'
  };

  const componentsList = ['All', ...Array.from(new Set(connections.map(c => c.to_component)))];

  const filteredConnections = filterComponent === 'All'
    ? connections
    : connections.filter(c => c.to_component === filterComponent || c.from_component === filterComponent);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
      {/* Top Controls Bar */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
              <span>Interactive Circuit Schematic & Wiring Guide</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Verified Pinout
              </span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Hover or click any wire to inspect exact terminal connection and voltage.
            </p>
          </div>
        </div>

        {/* Filter by target component */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">Highlight:</span>
          <select
            value={filterComponent}
            onChange={(e) => setFilterComponent(e.target.value)}
            className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
          >
            {componentsList.map(comp => (
              <option key={comp} value={comp}>{comp}</option>
            ))}
          </select>

          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-200 transition-colors"
            title="Toggle Detailed View"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* SVG Circuit Canvas */}
      <div className={`relative bg-slate-900 p-4 sm:p-6 transition-all duration-300 ${isZoomed ? 'min-h-[520px]' : 'min-h-[380px]'} flex items-center justify-center overflow-x-auto`}>
        {/* Background Grid Accent */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        {schematicType === 'arduino_robot' && (
          <svg viewBox="0 0 840 440" className="w-full max-w-4xl h-auto select-none">
            {/* Defs for gradients & filters */}
            <defs>
              <filter id="wire-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* 1. ARDUINO UNO R3 BOARD (Left-Center) */}
            <g transform="translate(60, 60)">
              {/* PCB Base */}
              <rect x="0" y="0" width="220" height="280" rx="12" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
              <rect x="10" y="10" width="200" height="260" rx="8" fill="#0369a1" />
              
              {/* USB Connector */}
              <rect x="-15" y="20" width="30" height="40" rx="3" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.5" />
              <text x="5" y="45" fill="#334155" fontSize="9" fontWeight="bold" transform="rotate(-90 5 45)">USB</text>

              {/* DC Barrel Jack */}
              <rect x="-10" y="190" width="25" height="50" rx="4" fill="#1e293b" />
              <rect x="15" y="205" width="8" height="20" fill="#cbd5e1" />

              {/* ATmega328P DIP IC */}
              <rect x="65" y="110" width="90" height="32" rx="4" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
              <circle cx="75" cy="126" r="3" fill="#64748b" />
              <text x="86" y="130" fill="#94a3b8" fontSize="10" fontFamily="monospace" fontWeight="bold">ATmega328P</text>

              {/* Arduino Title */}
              <text x="110" y="55" fill="#ffffff" fontSize="14" fontWeight="800" textAnchor="middle">ARDUINO</text>
              <text x="110" y="70" fill="#bae6fd" fontSize="10" fontWeight="bold" textAnchor="middle">UNO R3</text>

              {/* Digital Pins Header (Top) */}
              <rect x="30" y="8" width="160" height="14" rx="2" fill="#0f172a" />
              <text x="110" y="4" fill="#bae6fd" fontSize="8" fontWeight="bold" textAnchor="middle">DIGITAL (PWM ~)</text>
              {/* Pins D8, D9, D10, D11, D12, D13 */}
              <circle cx="80" cy="15" r="3.5" fill="#e2e8f0" />
              <text x="80" y="32" fill="#ffffff" fontSize="8" textAnchor="middle" fontWeight="bold">D8</text>

              <circle cx="105" cy="15" r="4" fill={selectedWire?.from_pin === 'D9' ? '#38bdf8' : '#e2e8f0'} />
              <text x="105" y="32" fill="#38bdf8" fontSize="8" textAnchor="middle" fontWeight="bold">~D9</text>

              <circle cx="130" cy="15" r="4" fill={selectedWire?.from_pin === 'D10' ? '#38bdf8' : '#e2e8f0'} />
              <text x="130" y="32" fill="#38bdf8" fontSize="8" textAnchor="middle" fontWeight="bold">~D10</text>

              <circle cx="155" cy="15" r="3.5" fill="#e2e8f0" />
              <text x="155" y="32" fill="#ffffff" fontSize="8" textAnchor="middle">D11</text>

              <circle cx="175" cy="15" r="3.5" fill="#e2e8f0" />
              <text x="175" y="32" fill="#ffffff" fontSize="8" textAnchor="middle">GND</text>

              {/* Power Header (Bottom) */}
              <rect x="30" y="258" width="160" height="14" rx="2" fill="#0f172a" />
              <text x="110" y="286" fill="#bae6fd" fontSize="8" fontWeight="bold" textAnchor="middle">POWER & GROUND</text>
              
              <circle cx="55" cy="265" r="3.5" fill="#ef4444" />
              <text x="55" y="252" fill="#fca5a5" fontSize="8" textAnchor="middle" fontWeight="bold">5V</text>

              <circle cx="80" cy="265" r="3.5" fill="#94a3b8" />
              <text x="80" y="252" fill="#e2e8f0" fontSize="8" textAnchor="middle" fontWeight="bold">GND</text>

              <circle cx="105" cy="265" r="3.5" fill="#94a3b8" />
              <text x="105" y="252" fill="#e2e8f0" fontSize="8" textAnchor="middle" fontWeight="bold">GND</text>

              <circle cx="130" cy="265" r="3.5" fill="#f59e0b" />
              <text x="130" y="252" fill="#fde68a" fontSize="8" textAnchor="middle">VIN</text>

              {/* Analog In Header */}
              <circle cx="160" cy="265" r="3.5" fill="#10b981" />
              <text x="160" y="252" fill="#a7f3d0" fontSize="8" textAnchor="middle">A0</text>
            </g>

            {/* 2. HC-SR04 ULTRASONIC SENSOR (Top-Right) */}
            <g transform="translate(480, 40)">
              {/* Blue PCB */}
              <rect x="0" y="0" width="260" height="110" rx="10" fill="#1d4ed8" stroke="#60a5fa" strokeWidth="1.5" />
              
              {/* Transmitter Transducer "T" */}
              <circle cx="65" cy="55" r="32" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="4" />
              <circle cx="65" cy="55" r="22" fill="#475569" />
              <text x="65" y="60" fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="middle">T</text>

              {/* Receiver Transducer "R" */}
              <circle cx="195" cy="55" r="32" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="4" />
              <circle cx="195" cy="55" r="22" fill="#475569" />
              <text x="195" y="60" fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="middle">R</text>

              {/* Header Label */}
              <text x="130" y="25" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">HC-SR04 ULTRASONIC</text>

              {/* 4 Header Pins at Bottom */}
              <g transform="translate(85, 95)">
                <rect x="0" y="0" width="90" height="15" rx="3" fill="#0f172a" />
                
                {/* VCC */}
                <circle cx="12" cy="7" r="3.5" fill="#ef4444" />
                <text x="12" y="24" fill="#fca5a5" fontSize="8" textAnchor="middle" fontWeight="bold">VCC</text>

                {/* TRIG */}
                <circle cx="36" cy="7" r="4" fill="#38bdf8" />
                <text x="36" y="24" fill="#7dd3fc" fontSize="8" textAnchor="middle" fontWeight="bold">TRIG</text>

                {/* ECHO */}
                <circle cx="60" cy="7" r="4" fill="#34d399" />
                <text x="60" y="24" fill="#6ee7b7" fontSize="8" textAnchor="middle" fontWeight="bold">ECHO</text>

                {/* GND */}
                <circle cx="82" cy="7" r="3.5" fill="#94a3b8" />
                <text x="82" y="24" fill="#cbd5e1" fontSize="8" textAnchor="middle" fontWeight="bold">GND</text>
              </g>
            </g>

            {/* 3. L298N DUAL H-BRIDGE MOTOR DRIVER (Bottom-Right) */}
            <g transform="translate(480, 200)">
              {/* Red Heatsink & Board */}
              <rect x="0" y="0" width="260" height="180" rx="10" fill="#b91c1c" stroke="#f87171" strokeWidth="1.5" />
              
              {/* Black Aluminum Heatsink Fins */}
              <rect x="80" y="20" width="100" height="45" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="1" />
              <line x1="100" y1="20" x2="100" y2="65" stroke="#334155" strokeWidth="2" />
              <line x1="120" y1="20" x2="120" y2="65" stroke="#334155" strokeWidth="2" />
              <line x1="140" y1="20" x2="140" y2="65" stroke="#334155" strokeWidth="2" />
              <line x1="160" y1="20" x2="160" y2="65" stroke="#334155" strokeWidth="2" />

              <text x="130" y="80" fill="#fecaca" fontSize="11" fontWeight="bold" textAnchor="middle">L298N DRIVER</text>

              {/* Screw Terminals Power (+12V, GND, +5V) */}
              <g transform="translate(20, 120)">
                <rect x="0" y="0" width="70" height="30" rx="4" fill="#15803d" stroke="#22c55e" strokeWidth="1" />
                <circle cx="15" cy="15" r="5" fill="#f87171" />
                <text x="15" y="42" fill="#fca5a5" fontSize="8" textAnchor="middle" fontWeight="bold">+12V</text>

                <circle cx="35" cy="15" r="5" fill="#475569" />
                <text x="35" y="42" fill="#cbd5e1" fontSize="8" textAnchor="middle" fontWeight="bold">GND</text>

                <circle cx="55" cy="15" r="5" fill="#ef4444" />
                <text x="55" y="42" fill="#fca5a5" fontSize="8" textAnchor="middle" fontWeight="bold">+5V</text>
              </g>

              {/* Logic Input Header IN1, IN2, IN3, IN4 */}
              <g transform="translate(130, 125)">
                <rect x="0" y="0" width="110" height="20" rx="3" fill="#0f172a" />
                <circle cx="20" cy="10" r="3.5" fill="#fbbf24" />
                <text x="20" y="32" fill="#fef08a" fontSize="7" textAnchor="middle">IN1</text>

                <circle cx="45" cy="10" r="3.5" fill="#fbbf24" />
                <text x="45" y="32" fill="#fef08a" fontSize="7" textAnchor="middle">IN2</text>

                <circle cx="70" cy="10" r="3.5" fill="#f97316" />
                <text x="70" y="32" fill="#fed7aa" fontSize="7" textAnchor="middle">IN3</text>

                <circle cx="95" cy="10" r="3.5" fill="#f97316" />
                <text x="95" y="32" fill="#fed7aa" fontSize="7" textAnchor="middle">IN4</text>
              </g>
            </g>

            {/* 4. REALISTIC COLOR-CODED WIRES WITH CURVED BEZIER PATHS */}
            
            {/* Wire 1: Arduino Pin 9 -> HC-SR04 TRIG (Blue Wire) */}
            <path
              d="M 165 75 C 220 20, 420 30, 516 142"
              fill="none"
              stroke={colorHexMap.blue}
              strokeWidth={selectedWire?.from_pin === 'D9' ? 5 : 3}
              filter={selectedWire?.from_pin === 'D9' ? 'url(#wire-glow)' : undefined}
              className="cursor-pointer transition-all hover:stroke-width-5 opacity-90 hover:opacity-100"
              onClick={() => setSelectedWire(connections.find(c => c.from_pin === 'D9') || null)}
            />

            {/* Wire 2: Arduino Pin 10 -> HC-SR04 ECHO (Green Wire) */}
            <path
              d="M 190 75 C 240 40, 430 60, 540 142"
              fill="none"
              stroke={colorHexMap.green}
              strokeWidth={selectedWire?.from_pin === 'D10' ? 5 : 3}
              filter={selectedWire?.from_pin === 'D10' ? 'url(#wire-glow)' : undefined}
              className="cursor-pointer transition-all hover:stroke-width-5 opacity-90 hover:opacity-100"
              onClick={() => setSelectedWire(connections.find(c => c.from_pin === 'D10') || null)}
            />

            {/* Wire 3: Arduino 5V -> HC-SR04 VCC (Red Wire) */}
            <path
              d="M 115 325 C 130 380, 440 220, 497 142"
              fill="none"
              stroke={colorHexMap.red}
              strokeWidth={selectedWire?.from_pin === '5V' ? 5 : 3}
              filter={selectedWire?.from_pin === '5V' ? 'url(#wire-glow)' : undefined}
              className="cursor-pointer transition-all hover:stroke-width-5 opacity-90 hover:opacity-100"
              onClick={() => setSelectedWire(connections.find(c => c.from_pin === '5V') || null)}
            />

            {/* Wire 4: Arduino GND -> Common Ground (Black Wire) */}
            <path
              d="M 140 325 C 170 390, 400 370, 515 335"
              fill="none"
              stroke={colorHexMap.black}
              strokeWidth={selectedWire?.from_pin === 'GND' ? 5 : 3}
              filter={selectedWire?.from_pin === 'GND' ? 'url(#wire-glow)' : undefined}
              className="cursor-pointer transition-all hover:stroke-width-5 opacity-90 hover:opacity-100"
              onClick={() => setSelectedWire(connections.find(c => c.from_pin === 'GND') || null)}
            />

            {/* Wire 5: Arduino Pin 5 -> L298N IN1 (Yellow Wire) */}
            <path
              d="M 160 85 C 220 180, 400 280, 500 335"
              fill="none"
              stroke={colorHexMap.yellow}
              strokeWidth={selectedWire?.from_pin === 'D5' ? 5 : 2.5}
              filter={selectedWire?.from_pin === 'D5' ? 'url(#wire-glow)' : undefined}
              className="cursor-pointer transition-all hover:stroke-width-5 opacity-80 hover:opacity-100"
              onClick={() => setSelectedWire(connections.find(c => c.from_pin === 'D5') || null)}
            />

            {/* Wire 6: Arduino Pin 6 -> L298N IN2 (Orange Wire) */}
            <path
              d="M 180 85 C 230 190, 410 290, 525 335"
              fill="none"
              stroke={colorHexMap.orange}
              strokeWidth={selectedWire?.from_pin === 'D6' ? 5 : 2.5}
              filter={selectedWire?.from_pin === 'D6' ? 'url(#wire-glow)' : undefined}
              className="cursor-pointer transition-all hover:stroke-width-5 opacity-80 hover:opacity-100"
              onClick={() => setSelectedWire(connections.find(c => c.from_pin === 'D6') || null)}
            />

            {/* Wire Callout Labels */}
            <g transform="translate(290, 30)">
              <rect x="0" y="0" width="140" height="24" rx="12" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
              <circle cx="12" cy="12" r="4" fill="#38bdf8" />
              <text x="24" y="16" fill="#f8fafc" fontSize="10" fontWeight="bold">D9 ➔ TRIG (Sonar)</text>
            </g>

            <g transform="translate(290, 65)">
              <rect x="0" y="0" width="140" height="24" rx="12" fill="#1e293b" stroke="#34d399" strokeWidth="1" />
              <circle cx="12" cy="12" r="4" fill="#34d399" />
              <text x="24" y="16" fill="#f8fafc" fontSize="10" fontWeight="bold">D10 ➔ ECHO (Sonar)</text>
            </g>

            <g transform="translate(270, 375)">
              <rect x="0" y="0" width="180" height="24" rx="12" fill="#1e293b" stroke="#64748b" strokeWidth="1" />
              <circle cx="12" cy="12" r="4" fill="#f87171" />
              <text x="24" y="16" fill="#f8fafc" fontSize="10" fontWeight="bold">GND ➔ Shared Ground Bus</text>
            </g>
          </svg>
        )}

        {schematicType !== 'arduino_robot' && (
          <div className="text-center py-12 text-slate-400">
            <Cpu className="h-12 w-12 text-blue-500 mx-auto mb-3 animate-pulse" />
            <h4 className="text-sm font-bold text-white mb-1">Standard Hardware Wiring Matrix</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Follow the pinout map below to wire the microcontroller board, sensors, relays, and power bus safely.
            </p>
          </div>
        )}
      </div>

      {/* Selected Wire Inspector Bar */}
      {selectedWire && (
        <div className="p-3.5 bg-blue-50/90 border-t border-b border-blue-200 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span 
              className="h-3 w-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: colorHexMap[selectedWire.wire_color] || '#3b82f6' }}
            />
            <span className="font-bold text-slate-900">
              {selectedWire.from_component} ({selectedWire.from_pin}) ➔ {selectedWire.to_component} ({selectedWire.to_pin})
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-700">{selectedWire.description}</span>
          </div>
          <button
            onClick={() => setSelectedWire(null)}
            className="text-xs text-blue-600 font-bold hover:underline"
          >
            Clear Selection
          </button>
        </div>
      )}

      {/* Detailed Pin Connection Matrix Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-4">Wire</th>
              <th className="py-2.5 px-4">From Board</th>
              <th className="py-2.5 px-4">From Pin</th>
              <th className="py-2.5 px-4">To Component</th>
              <th className="py-2.5 px-4">Target Pin</th>
              <th className="py-2.5 px-4">Signal Type</th>
              <th className="py-2.5 px-4">Engineering Purpose</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filteredConnections.map((conn, idx) => {
              const isSelected = selectedWire?.from_pin === conn.from_pin && selectedWire?.to_pin === conn.to_pin;
              return (
                <tr
                  key={idx}
                  onClick={() => setSelectedWire(conn)}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? 'bg-blue-50/70 font-semibold text-blue-900' : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="py-2.5 px-4">
                    <span 
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase text-white shadow-2xs"
                      style={{ backgroundColor: colorHexMap[conn.wire_color] || '#475569' }}
                    >
                      {conn.wire_color}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 font-medium text-slate-900">{conn.from_component}</td>
                  <td className="py-2.5 px-4 font-mono font-bold text-blue-600">{conn.from_pin}</td>
                  <td className="py-2.5 px-4 text-slate-800">{conn.to_component}</td>
                  <td className="py-2.5 px-4 font-mono font-bold text-emerald-600">{conn.to_pin}</td>
                  <td className="py-2.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[10px] uppercase font-bold">
                      {conn.signal_type}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-slate-600">{conn.description}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
