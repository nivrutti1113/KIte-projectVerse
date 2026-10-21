'use client';

import React, { useState, useEffect } from 'react';
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
  Maximize2,
  Trash2,
  RotateCcw,
  Check,
  AlertTriangle,
  Plus,
  HelpCircle
} from 'lucide-react';

interface CircuitDiagramProps {
  projectTitle: string;
  schematicType?: 'arduino_robot' | 'smart_plant' | 'solar_tracker' | 'iot_esp32' | 'ai_camera' | 'smart_home';
  activeStep?: number;
  connections: WiringConnection[];
}

interface PinCoord {
  component: string;
  pin: string;
  x: number;
  y: number;
  signal_type: 'power' | 'ground' | 'digital' | 'analog' | 'pwm' | 'i2c' | 'spi';
}

const PIN_COORDINATES: Record<string, PinCoord> = {
  // Arduino Uno R3 Pins
  'D5': { component: 'Arduino Uno', pin: 'D5', x: 115, y: 75, signal_type: 'pwm' },
  'D6': { component: 'Arduino Uno', pin: 'D6', x: 140, y: 75, signal_type: 'pwm' },
  'D7': { component: 'Arduino Uno', pin: 'D7', x: 165, y: 75, signal_type: 'digital' },
  'D8': { component: 'Arduino Uno', pin: 'D8', x: 140, y: 75, signal_type: 'digital' },
  'D9': { component: 'Arduino Uno', pin: 'D9', x: 165, y: 75, signal_type: 'pwm' },
  'D10': { component: 'Arduino Uno', pin: 'D10', x: 190, y: 75, signal_type: 'pwm' },
  'D11': { component: 'Arduino Uno', pin: 'D11', x: 215, y: 75, signal_type: 'digital' },
  '5V': { component: 'Arduino Uno', pin: '5V', x: 115, y: 325, signal_type: 'power' },
  'GND': { component: 'Arduino Uno', pin: 'GND', x: 140, y: 325, signal_type: 'ground' },
  'GND2': { component: 'Arduino Uno', pin: 'GND', x: 165, y: 325, signal_type: 'ground' },
  'VIN': { component: 'Arduino Uno', pin: 'VIN', x: 190, y: 325, signal_type: 'power' },
  'A0': { component: 'Arduino Uno', pin: 'A0', x: 220, y: 325, signal_type: 'analog' },

  // HC-SR04 Ultrasonic Sensor Pins
  'VCC': { component: 'HC-SR04 Sonar', pin: 'VCC', x: 577, y: 142, signal_type: 'power' },
  'TRIG': { component: 'HC-SR04 Sonar', pin: 'TRIG', x: 601, y: 142, signal_type: 'digital' },
  'ECHO': { component: 'HC-SR04 Sonar', pin: 'ECHO', x: 625, y: 142, signal_type: 'digital' },
  'SENSOR_GND': { component: 'HC-SR04 Sonar', pin: 'GND', x: 647, y: 142, signal_type: 'ground' },

  // L298N Motor Driver Pins
  '+12V': { component: 'L298N Driver', pin: '+12V', x: 515, y: 335, signal_type: 'power' },
  'DRIVER_GND': { component: 'L298N Driver', pin: 'GND', x: 535, y: 335, signal_type: 'ground' },
  'DRIVER_5V': { component: 'L298N Driver', pin: '+5V', x: 555, y: 335, signal_type: 'power' },
  'IN1': { component: 'L298N Driver', pin: 'IN1', x: 630, y: 335, signal_type: 'pwm' },
  'IN2': { component: 'L298N Driver', pin: 'IN2', x: 655, y: 335, signal_type: 'pwm' },
  'IN3': { component: 'L298N Driver', pin: 'IN3', x: 680, y: 335, signal_type: 'digital' },
  'IN4': { component: 'L298N Driver', pin: 'IN4', x: 705, y: 335, signal_type: 'digital' },
};

type WireColor = 'red' | 'black' | 'blue' | 'green' | 'yellow' | 'orange' | 'purple';

export default function CircuitDiagram({
  projectTitle,
  schematicType = 'arduino_robot',
  activeStep = 1,
  connections: officialConnections
}: CircuitDiagramProps) {
  // Active Wires (Editable by student)
  const [wires, setWires] = useState<WiringConnection[]>(officialConnections);
  const [selectedWireIndex, setSelectedWireIndex] = useState<number | null>(null);
  
  // Interactive Wiring Tool State
  const [isEditMode, setIsEditMode] = useState<boolean>(true);
  const [selectedPinKey, setSelectedPinKey] = useState<string | null>(null);
  const [activeWireColor, setActiveWireColor] = useState<WireColor>('blue');
  const [validationReport, setValidationReport] = useState<{
    correctCount: number;
    totalExpected: number;
    issues: string[];
    isVerified: boolean;
  } | null>(null);

  const [filterComponent, setFilterComponent] = useState<string>('All');
  const [isZoomed, setIsZoomed] = useState(false);
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);

  const colorHexMap: Record<WireColor, string> = {
    red: '#ef4444',
    black: '#0f172a',
    blue: '#2563eb',
    green: '#10b981',
    yellow: '#eab308',
    orange: '#f97316',
    purple: '#a855f7'
  };

  // Sync official connections if project changes
  useEffect(() => {
    setWires(officialConnections);
  }, [officialConnections]);

  // Handle clicking on a pin for Interactive Wiring
  const handlePinClick = (pinKey: string) => {
    const pin = PIN_COORDINATES[pinKey];
    if (!pin) return;

    if (!selectedPinKey) {
      // First Pin Clicked (Source)
      setSelectedPinKey(pinKey);
      setSelectedWireIndex(null);
    } else {
      // Second Pin Clicked (Destination)
      if (selectedPinKey === pinKey) {
        // Cancel if same pin clicked
        setSelectedPinKey(null);
        return;
      }

      const sourcePin = PIN_COORDINATES[selectedPinKey];
      const targetPin = pin;

      // Prevent connecting pins on the same component
      if (sourcePin.component === targetPin.component) {
        alert(`Cannot connect ${sourcePin.pin} to ${targetPin.pin} on the same ${sourcePin.component}! Connect between board and sensor/driver.`);
        setSelectedPinKey(null);
        return;
      }

      // Check if wire already exists
      const existing = wires.some(w => 
        (w.from_pin === sourcePin.pin && w.to_pin === targetPin.pin) ||
        (w.from_pin === targetPin.pin && w.to_pin === sourcePin.pin)
      );

      if (existing) {
        alert(`A wire between ${sourcePin.pin} and ${targetPin.pin} already exists!`);
        setSelectedPinKey(null);
        return;
      }

      // Create new wire
      const newWire: WiringConnection = {
        from_component: sourcePin.component,
        from_pin: sourcePin.pin,
        to_component: targetPin.component,
        to_pin: targetPin.pin,
        wire_color: activeWireColor,
        signal_type: targetPin.signal_type || sourcePin.signal_type || 'digital',
        description: `Custom jumper connection between ${sourcePin.component} (${sourcePin.pin}) and ${targetPin.component} (${targetPin.pin})`
      };

      setWires(prev => [...prev, newWire]);
      setSelectedPinKey(null);
      setValidationReport(null);
    }
  };

  // Delete selected wire
  const handleDeleteWire = (index: number) => {
    setWires(prev => prev.filter((_, i) => i !== index));
    setSelectedWireIndex(null);
    setValidationReport(null);
  };

  // Clear all wires for student hands-on practice
  const handleClearAllWires = () => {
    setWires([]);
    setSelectedWireIndex(null);
    setSelectedPinKey(null);
    setValidationReport(null);
  };

  // Load official verified solution
  const handleLoadSolution = () => {
    setWires(officialConnections);
    setSelectedWireIndex(null);
    setSelectedPinKey(null);
    setValidationReport(null);
  };

  // Run Circuit Verification against Official Pinout
  const handleVerifyCircuit = () => {
    const issues: string[] = [];
    let correctCount = 0;

    // Check each official connection
    officialConnections.forEach(official => {
      const match = wires.find(w => 
        (w.from_pin.toUpperCase() === official.from_pin.toUpperCase() && w.to_pin.toUpperCase() === official.to_pin.toUpperCase()) ||
        (w.from_pin.toUpperCase() === official.to_pin.toUpperCase() && w.to_pin.toUpperCase() === official.from_pin.toUpperCase())
      );

      if (match) {
        correctCount++;
      } else {
        issues.push(`Missing connection: ${official.from_component} [${official.from_pin}] ➔ ${official.to_component} [${official.to_pin}]`);
      }
    });

    // Check for short circuits (e.g. 5V connected to GND)
    wires.forEach(w => {
      if ((w.from_pin === '5V' && w.to_pin === 'GND') || (w.from_pin === 'GND' && w.to_pin === '5V')) {
        issues.unshift('CRITICAL SAFETY ALERT: Short circuit detected between 5V and GND! This will damage the Arduino regulator.');
      }
    });

    const isVerified = correctCount === officialConnections.length && issues.length === 0;

    setValidationReport({
      correctCount,
      totalExpected: officialConnections.length,
      issues,
      isVerified
    });
  };

  // Calculate Bezier curve between 2 pins
  const getWirePath = (fromPin: string, toPin: string) => {
    let p1 = PIN_COORDINATES[fromPin];
    let p2 = PIN_COORDINATES[toPin];

    if (!p1 && fromPin === 'GND') p1 = PIN_COORDINATES['GND'];
    if (!p2 && toPin === 'GND') p2 = PIN_COORDINATES['SENSOR_GND'] || PIN_COORDINATES['DRIVER_GND'];
    if (!p2 && toPin === '+12V') p2 = PIN_COORDINATES['+12V'];

    // Fallbacks
    if (!p1) p1 = { component: 'Arduino', pin: fromPin, x: 165, y: 75, signal_type: 'digital' };
    if (!p2) p2 = { component: 'Target', pin: toPin, x: 601, y: 142, signal_type: 'digital' };

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;

    // Curved control points for natural droop
    const cx1 = p1.x + dx * 0.3;
    const cy1 = p1.y - Math.abs(dx) * 0.15;
    const cx2 = p1.x + dx * 0.7;
    const cy2 = p2.y - Math.abs(dx) * 0.15;

    return `M ${p1.x} ${p1.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p2.x} ${p2.y}`;
  };

  const componentsList = ['All', ...Array.from(new Set(wires.map(c => c.to_component)))];

  const filteredWires = filterComponent === 'All'
    ? wires
    : wires.filter(c => c.to_component === filterComponent || c.from_component === filterComponent);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
      {/* Top Interactive Toolbar */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
              <span>Interactive Hardware Wiring Studio</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                Live Wiring Editor
              </span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Click any pin on Arduino and then a target sensor/driver pin to draw wires interactively.
            </p>
          </div>
        </div>

        {/* Action Buttons: Wire Tools & Verification */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Wire Color Selector Palette */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 px-1">Color:</span>
            {(['red', 'black', 'blue', 'green', 'yellow', 'orange'] as WireColor[]).map(c => (
              <button
                key={c}
                onClick={() => setActiveWireColor(c)}
                className={`h-5 w-5 rounded-full transition-transform ${
                  activeWireColor === c ? 'scale-120 ring-2 ring-slate-900 ring-offset-1' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: colorHexMap[c] }}
                title={`Select ${c} Wire`}
              />
            ))}
          </div>

          {/* Verification Trigger */}
          <button
            onClick={handleVerifyCircuit}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Verify Wiring</span>
          </button>

          {/* Reset / Solution Controls */}
          <button
            onClick={handleClearAllWires}
            className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-medium text-xs flex items-center gap-1 transition-colors"
            title="Remove all wires to practice wiring from scratch"
          >
            <Trash2 className="h-3.5 w-3.5 text-rose-500" />
            <span>Clear</span>
          </button>

          <button
            onClick={handleLoadSolution}
            className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-blue-700 border border-blue-200 font-semibold text-xs flex items-center gap-1 transition-colors"
            title="Restore official verified schematic wiring"
          >
            <RotateCcw className="h-3.5 w-3.5 text-blue-600" />
            <span>Auto-Wire Solution</span>
          </button>

          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-200 transition-colors"
            title="Toggle Detailed View"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Interactive Helper Prompt Banner */}
      {selectedPinKey && (
        <div className="bg-cyan-50 border-b border-cyan-200 px-4 py-2 flex items-center justify-between text-xs text-cyan-900 animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-500 animate-ping" />
            <span>
              <strong>Step 1 Selected:</strong> {PIN_COORDINATES[selectedPinKey].component} [{PIN_COORDINATES[selectedPinKey].pin}]. 
              Now <strong>click a destination pin</strong> on HC-SR04 or L298N to complete wire connection.
            </span>
          </div>
          <button 
            onClick={() => setSelectedPinKey(null)}
            className="text-xs font-bold text-cyan-700 hover:underline"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Circuit Verification Result Modal/Banner */}
      {validationReport && (
        <div className={`p-4 border-b text-xs ${
          validationReport.isVerified 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
            : 'bg-amber-50 border-amber-200 text-amber-900'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 font-bold text-sm">
              {validationReport.isVerified ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <span>100% Circuit Verification Passed! ({validationReport.correctCount}/{validationReport.totalExpected} Wires Verified)</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  <span>Circuit Needs Attention: {validationReport.correctCount} of {validationReport.totalExpected} verified</span>
                </>
              )}
            </div>
            <button 
              onClick={() => setValidationReport(null)}
              className="font-bold text-slate-500 hover:text-slate-900"
            >
              ✕
            </button>
          </div>

          {validationReport.issues.length > 0 && (
            <ul className="list-disc list-inside space-y-1 text-[11px] text-amber-800">
              {validationReport.issues.map((issue, idx) => (
                <li key={idx}>{issue}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* SVG Interactive Circuit Canvas */}
      <div className={`relative bg-slate-900 p-4 sm:p-6 transition-all duration-300 ${isZoomed ? 'min-h-[520px]' : 'min-h-[400px]'} flex items-center justify-center overflow-x-auto select-none`}>
        {/* Background Grid Accent */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        <svg viewBox="0 0 840 440" className="w-full max-w-4xl h-auto">
          <defs>
            <filter id="wire-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="pin-glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. ARDUINO UNO R3 BOARD (Left-Center) */}
          <g transform="translate(60, 60)">
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
            <text x="110" y="4" fill="#bae6fd" fontSize="8" fontWeight="bold" textAnchor="middle">DIGITAL (CLICK PIN TO WIRE)</text>

            {/* CLICKABLE DIGITAL PINS */}
            {/* D5 */}
            <g 
              className="cursor-pointer" 
              onClick={() => handlePinClick('D5')}
              onMouseEnter={() => setHoveredPin('Arduino Uno: D5 (PWM)')}
              onMouseLeave={() => setHoveredPin(null)}
            >
              <circle cx="55" cy="15" r="5" fill={selectedPinKey === 'D5' ? '#38bdf8' : '#e2e8f0'} filter={selectedPinKey === 'D5' ? 'url(#pin-glow)' : undefined} />
              <text x="55" y="32" fill="#ffffff" fontSize="8" textAnchor="middle">~D5</text>
            </g>

            {/* D6 */}
            <g 
              className="cursor-pointer" 
              onClick={() => handlePinClick('D6')}
              onMouseEnter={() => setHoveredPin('Arduino Uno: D6 (PWM)')}
              onMouseLeave={() => setHoveredPin(null)}
            >
              <circle cx="80" cy="15" r="5" fill={selectedPinKey === 'D6' ? '#38bdf8' : '#e2e8f0'} filter={selectedPinKey === 'D6' ? 'url(#pin-glow)' : undefined} />
              <text x="80" y="32" fill="#ffffff" fontSize="8" textAnchor="middle">~D6</text>
            </g>

            {/* D9 */}
            <g 
              className="cursor-pointer" 
              onClick={() => handlePinClick('D9')}
              onMouseEnter={() => setHoveredPin('Arduino Uno: D9 (PWM - Trig)')}
              onMouseLeave={() => setHoveredPin(null)}
            >
              <circle cx="105" cy="15" r="6" fill={selectedPinKey === 'D9' ? '#38bdf8' : '#38bdf8'} filter="url(#pin-glow)" />
              <text x="105" y="32" fill="#38bdf8" fontSize="8" textAnchor="middle" fontWeight="bold">~D9</text>
            </g>

            {/* D10 */}
            <g 
              className="cursor-pointer" 
              onClick={() => handlePinClick('D10')}
              onMouseEnter={() => setHoveredPin('Arduino Uno: D10 (PWM - Echo)')}
              onMouseLeave={() => setHoveredPin(null)}
            >
              <circle cx="130" cy="15" r="6" fill={selectedPinKey === 'D10' ? '#38bdf8' : '#34d399'} filter="url(#pin-glow)" />
              <text x="130" y="32" fill="#34d399" fontSize="8" textAnchor="middle" fontWeight="bold">~D10</text>
            </g>

            {/* Power Header (Bottom) */}
            <rect x="30" y="258" width="160" height="14" rx="2" fill="#0f172a" />
            <text x="110" y="286" fill="#bae6fd" fontSize="8" fontWeight="bold" textAnchor="middle">POWER & GROUND</text>
            
            {/* 5V Pin */}
            <g 
              className="cursor-pointer" 
              onClick={() => handlePinClick('5V')}
              onMouseEnter={() => setHoveredPin('Arduino Uno: 5V Regulated Power Output')}
              onMouseLeave={() => setHoveredPin(null)}
            >
              <circle cx="55" cy="265" r="6" fill={selectedPinKey === '5V' ? '#f87171' : '#ef4444'} filter="url(#pin-glow)" />
              <text x="55" y="252" fill="#fca5a5" fontSize="8" textAnchor="middle" fontWeight="bold">5V</text>
            </g>

            {/* GND Pin */}
            <g 
              className="cursor-pointer" 
              onClick={() => handlePinClick('GND')}
              onMouseEnter={() => setHoveredPin('Arduino Uno: Ground Terminal')}
              onMouseLeave={() => setHoveredPin(null)}
            >
              <circle cx="80" cy="265" r="6" fill={selectedPinKey === 'GND' ? '#cbd5e1' : '#94a3b8'} filter={selectedPinKey === 'GND' ? 'url(#pin-glow)' : undefined} />
              <text x="80" y="252" fill="#e2e8f0" fontSize="8" textAnchor="middle" fontWeight="bold">GND</text>
            </g>

            {/* VIN Pin */}
            <g 
              className="cursor-pointer" 
              onClick={() => handlePinClick('VIN')}
              onMouseEnter={() => setHoveredPin('Arduino Uno: VIN Voltage In')}
              onMouseLeave={() => setHoveredPin(null)}
            >
              <circle cx="130" cy="265" r="5" fill={selectedPinKey === 'VIN' ? '#f59e0b' : '#f59e0b'} />
              <text x="130" y="252" fill="#fde68a" fontSize="8" textAnchor="middle">VIN</text>
            </g>

            {/* A0 Pin */}
            <g 
              className="cursor-pointer" 
              onClick={() => handlePinClick('A0')}
              onMouseEnter={() => setHoveredPin('Arduino Uno: A0 Analog In')}
              onMouseLeave={() => setHoveredPin(null)}
            >
              <circle cx="160" cy="265" r="5" fill={selectedPinKey === 'A0' ? '#10b981' : '#10b981'} />
              <text x="160" y="252" fill="#a7f3d0" fontSize="8" textAnchor="middle">A0</text>
            </g>
          </g>

          {/* 2. HC-SR04 ULTRASONIC SENSOR (Top-Right) */}
          <g transform="translate(480, 40)">
            <rect x="0" y="0" width="260" height="110" rx="10" fill="#1d4ed8" stroke="#60a5fa" strokeWidth="1.5" />
            
            {/* Transmitters */}
            <circle cx="65" cy="55" r="32" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="4" />
            <circle cx="65" cy="55" r="22" fill="#475569" />
            <text x="65" y="60" fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="middle">T</text>

            <circle cx="195" cy="55" r="32" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="4" />
            <circle cx="195" cy="55" r="22" fill="#475569" />
            <text x="195" y="60" fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="middle">R</text>

            <text x="130" y="25" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">HC-SR04 ULTRASONIC</text>

            {/* 4 Header Pins at Bottom (Clickable) */}
            <g transform="translate(85, 95)">
              <rect x="0" y="0" width="90" height="15" rx="3" fill="#0f172a" />
              
              {/* VCC */}
              <g 
                className="cursor-pointer" 
                onClick={() => handlePinClick('VCC')}
                onMouseEnter={() => setHoveredPin('HC-SR04: VCC (5V Power Input)')}
                onMouseLeave={() => setHoveredPin(null)}
              >
                <circle cx="12" cy="7" r="5.5" fill={selectedPinKey === 'VCC' ? '#f87171' : '#ef4444'} filter="url(#pin-glow)" />
                <text x="12" y="24" fill="#fca5a5" fontSize="8" textAnchor="middle" fontWeight="bold">VCC</text>
              </g>

              {/* TRIG */}
              <g 
                className="cursor-pointer" 
                onClick={() => handlePinClick('TRIG')}
                onMouseEnter={() => setHoveredPin('HC-SR04: TRIG (Ultrasonic Transmitter Trigger)')}
                onMouseLeave={() => setHoveredPin(null)}
              >
                <circle cx="36" cy="7" r="6" fill={selectedPinKey === 'TRIG' ? '#38bdf8' : '#38bdf8'} filter="url(#pin-glow)" />
                <text x="36" y="24" fill="#7dd3fc" fontSize="8" textAnchor="middle" fontWeight="bold">TRIG</text>
              </g>

              {/* ECHO */}
              <g 
                className="cursor-pointer" 
                onClick={() => handlePinClick('ECHO')}
                onMouseEnter={() => setHoveredPin('HC-SR04: ECHO (Soundwave Return Duration)')}
                onMouseLeave={() => setHoveredPin(null)}
              >
                <circle cx="60" cy="7" r="6" fill={selectedPinKey === 'ECHO' ? '#34d399' : '#34d399'} filter="url(#pin-glow)" />
                <text x="60" y="24" fill="#6ee7b7" fontSize="8" textAnchor="middle" fontWeight="bold">ECHO</text>
              </g>

              {/* GND */}
              <g 
                className="cursor-pointer" 
                onClick={() => handlePinClick('SENSOR_GND')}
                onMouseEnter={() => setHoveredPin('HC-SR04: Ground Terminal')}
                onMouseLeave={() => setHoveredPin(null)}
              >
                <circle cx="82" cy="7" r="5.5" fill={selectedPinKey === 'SENSOR_GND' ? '#cbd5e1' : '#94a3b8'} filter={selectedPinKey === 'SENSOR_GND' ? 'url(#pin-glow)' : undefined} />
                <text x="82" y="24" fill="#cbd5e1" fontSize="8" textAnchor="middle" fontWeight="bold">GND</text>
              </g>
            </g>
          </g>

          {/* 3. L298N DUAL MOTOR DRIVER (Bottom-Right) */}
          <g transform="translate(480, 200)">
            <rect x="0" y="0" width="260" height="180" rx="10" fill="#b91c1c" stroke="#f87171" strokeWidth="1.5" />
            
            {/* Heatsink Fins */}
            <rect x="80" y="20" width="100" height="45" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="1" />
            <line x1="100" y1="20" x2="100" y2="65" stroke="#334155" strokeWidth="2" />
            <line x1="120" y1="20" x2="120" y2="65" stroke="#334155" strokeWidth="2" />
            <line x1="140" y1="20" x2="140" y2="65" stroke="#334155" strokeWidth="2" />
            <line x1="160" y1="20" x2="160" y2="65" stroke="#334155" strokeWidth="2" />

            <text x="130" y="80" fill="#fecaca" fontSize="11" fontWeight="bold" textAnchor="middle">L298N DRIVER</text>

            {/* Screw Terminals Power (+12V, GND, +5V) */}
            <g transform="translate(20, 120)">
              <rect x="0" y="0" width="70" height="30" rx="4" fill="#15803d" stroke="#22c55e" strokeWidth="1" />
              
              <g 
                className="cursor-pointer" 
                onClick={() => handlePinClick('+12V')}
                onMouseEnter={() => setHoveredPin('L298N: +12V Motor Battery Input')}
                onMouseLeave={() => setHoveredPin(null)}
              >
                <circle cx="15" cy="15" r="6" fill={selectedPinKey === '+12V' ? '#f87171' : '#f87171'} filter="url(#pin-glow)" />
                <text x="15" y="42" fill="#fca5a5" fontSize="8" textAnchor="middle" fontWeight="bold">+12V</text>
              </g>

              <g 
                className="cursor-pointer" 
                onClick={() => handlePinClick('DRIVER_GND')}
                onMouseEnter={() => setHoveredPin('L298N: Common Ground Terminal')}
                onMouseLeave={() => setHoveredPin(null)}
              >
                <circle cx="35" cy="15" r="6" fill={selectedPinKey === 'DRIVER_GND' ? '#cbd5e1' : '#475569'} filter={selectedPinKey === 'DRIVER_GND' ? 'url(#pin-glow)' : undefined} />
                <text x="35" y="42" fill="#cbd5e1" fontSize="8" textAnchor="middle" fontWeight="bold">GND</text>
              </g>

              <circle cx="55" cy="15" r="5" fill="#ef4444" />
              <text x="55" y="42" fill="#fca5a5" fontSize="8" textAnchor="middle" fontWeight="bold">+5V</text>
            </g>

            {/* Logic Input Header IN1, IN2, IN3, IN4 */}
            <g transform="translate(130, 125)">
              <rect x="0" y="0" width="110" height="20" rx="3" fill="#0f172a" />
              
              <g 
                className="cursor-pointer" 
                onClick={() => handlePinClick('IN1')}
                onMouseEnter={() => setHoveredPin('L298N: IN1 (Left Motor Forward)')}
                onMouseLeave={() => setHoveredPin(null)}
              >
                <circle cx="20" cy="10" r="5" fill={selectedPinKey === 'IN1' ? '#38bdf8' : '#fbbf24'} />
                <text x="20" y="32" fill="#fef08a" fontSize="7" textAnchor="middle">IN1</text>
              </g>

              <g 
                className="cursor-pointer" 
                onClick={() => handlePinClick('IN2')}
                onMouseEnter={() => setHoveredPin('L298N: IN2 (Left Motor Reverse)')}
                onMouseLeave={() => setHoveredPin(null)}
              >
                <circle cx="45" cy="10" r="5" fill={selectedPinKey === 'IN2' ? '#38bdf8' : '#fbbf24'} />
                <text x="45" y="32" fill="#fef08a" fontSize="7" textAnchor="middle">IN2</text>
              </g>

              <circle cx="70" cy="10" r="3.5" fill="#f97316" />
              <text x="70" y="32" fill="#fed7aa" fontSize="7" textAnchor="middle">IN3</text>

              <circle cx="95" cy="10" r="3.5" fill="#f97316" />
              <text x="95" y="32" fill="#fed7aa" fontSize="7" textAnchor="middle">IN4</text>
            </g>
          </g>

          {/* 4. DYNAMIC INTERACTIVE STUDENT WIRES */}
          {filteredWires.map((wire, idx) => {
            const pathD = getWirePath(wire.from_pin, wire.to_pin);
            const isSelected = selectedWireIndex === idx;

            return (
              <g key={idx}>
                {/* Invisible wide hit area for easy clicking */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="16"
                  className="cursor-pointer"
                  onClick={() => setSelectedWireIndex(isSelected ? null : idx)}
                />
                
                {/* Visible colored wire */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={colorHexMap[wire.wire_color as WireColor] || '#3b82f6'}
                  strokeWidth={isSelected ? 6 : 3.5}
                  filter={isSelected ? 'url(#wire-glow)' : undefined}
                  className="cursor-pointer transition-all duration-150 hover:stroke-width-6 opacity-90 hover:opacity-100"
                  onClick={() => setSelectedWireIndex(isSelected ? null : idx)}
                />
              </g>
            );
          })}

          {/* Hover Pin Indicator */}
          {hoveredPin && (
            <g transform="translate(420, 20)">
              <rect x="-140" y="0" width="280" height="24" rx="12" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
              <text x="0" y="16" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">
                {hoveredPin}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Selected Wire Inspector & Deletion Bar */}
      {selectedWireIndex !== null && wires[selectedWireIndex] && (
        <div className="p-3.5 bg-rose-50/90 border-t border-b border-rose-200 flex items-center justify-between gap-3 text-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <span 
              className="h-3 w-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: colorHexMap[wires[selectedWireIndex].wire_color as WireColor] || '#3b82f6' }}
            />
            <span className="font-bold text-slate-900">
              Selected: {wires[selectedWireIndex].from_component} [{wires[selectedWireIndex].from_pin}] ➔ {wires[selectedWireIndex].to_component} [{wires[selectedWireIndex].to_pin}]
            </span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className="text-slate-600 hidden sm:inline">{wires[selectedWireIndex].description}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDeleteWire(selectedWireIndex)}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete Wire</span>
            </button>
            <button
              onClick={() => setSelectedWireIndex(null)}
              className="text-xs text-slate-500 hover:underline"
            >
              Deselect
            </button>
          </div>
        </div>
      )}

      {/* Pin Connection Matrix Table (with Delete & Status) */}
      <div className="overflow-x-auto">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-900 flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-blue-600" /> Current Circuit Wires ({wires.length} Active Connections)
          </span>
          <span className="text-slate-500 text-[11px]">Click any wire row to highlight on schematic or remove.</span>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-4">Color</th>
              <th className="py-2.5 px-4">From Board</th>
              <th className="py-2.5 px-4">From Pin</th>
              <th className="py-2.5 px-4">To Component</th>
              <th className="py-2.5 px-4">Target Pin</th>
              <th className="py-2.5 px-4">Type</th>
              <th className="py-2.5 px-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {wires.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  No wires connected yet. Click pins on the board above to start wiring your circuit!
                </td>
              </tr>
            ) : (
              wires.map((conn, idx) => {
                const isSelected = selectedWireIndex === idx;
                return (
                  <tr
                    key={idx}
                    onClick={() => setSelectedWireIndex(isSelected ? null : idx)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-50/70 font-semibold text-blue-900' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-2.5 px-4">
                      <span 
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase text-white shadow-2xs"
                        style={{ backgroundColor: colorHexMap[conn.wire_color as WireColor] || '#475569' }}
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
                    <td className="py-2.5 px-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteWire(idx);
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                        title="Remove Wire"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
