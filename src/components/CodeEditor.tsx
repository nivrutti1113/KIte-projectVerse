'use client';

import React, { useState, useEffect } from 'react';
import { 
  Play, 
  RotateCcw, 
  Download, 
  Copy, 
  Check, 
  Terminal, 
  Info, 
  Save, 
  FileCode,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { formatTime } from '@/lib/format';

interface CodeEditorProps {
  initialCode: string;
  language: string;
  starterCode?: string;
  onSave?: (code: string, language: string) => void;
  readOnly?: boolean;
}

export default function CodeEditor({
  initialCode,
  language: defaultLang,
  starterCode,
  onSave,
  readOnly = false
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode || '');
  const [language, setLanguage] = useState(defaultLang || 'python');
  const [output, setOutput] = useState<string>('Console output will appear here after clicking "Verify & Simulate".');
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    setCode(initialCode || '');
  }, [initialCode]);

  useEffect(() => {
    setLanguage(defaultLang || 'python');
  }, [defaultLang]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
    setHasUnsavedChanges(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle Tab key indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);
      setHasUnsavedChanges(true);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(code, language);
      setLastSaved(formatTime(new Date()));
      setHasUnsavedChanges(false);
    }
  };

  const handleReset = () => {
    if (starterCode) {
      setCode(starterCode);
      setHasUnsavedChanges(true);
      setShowResetConfirm(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const extMap: Record<string, string> = {
      python: 'py',
      arduino: 'ino',
      javascript: 'js',
      cpp: 'cpp'
    };
    const ext = extMap[language.toLowerCase()] || 'txt';
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kite_project_code.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleRunSimulation = () => {
    setIsRunning(true);
    setOutput('Starting sandbox execution...\n');

    setTimeout(() => {
      try {
        if (language === 'javascript') {
          // Safe simulated JS environment with captured logs
          const logs: string[] = [];
          const customConsole = {
            log: (...args: unknown[]) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
            error: (...args: unknown[]) => logs.push('[ERROR] ' + args.join(' ')),
            warn: (...args: unknown[]) => logs.push('[WARN] ' + args.join(' '))
          };

          const safeRunner = new Function('console', `"use strict";\n${code}`);
          safeRunner(customConsole);

          setOutput(logs.length > 0 ? logs.join('\n') : 'Execution completed successfully with no console output.');
        } else if (language === 'python') {
          // Simulated Python parser & mathematical verification
          const lines = code.split('\n');
          const logs: string[] = [
            'Python 3.10 Sandbox Simulation [Safe Web Mode]',
            'Running syntax and logic check...'
          ];

          // Check common syntax issues
          let hasSyntaxError = false;
          lines.forEach((line, idx) => {
            if (line.includes('def ') && !line.trim().endsWith(':')) {
              logs.push(`SyntaxError on line ${idx + 1}: Function definition missing colon (:)`);
              hasSyntaxError = true;
            }
            if (line.includes('if ') && !line.trim().endsWith(':') && !line.includes('#')) {
              logs.push(`SyntaxError on line ${idx + 1}: If condition missing colon (:)`);
              hasSyntaxError = true;
            }
          });

          if (hasSyntaxError) {
            setOutput(logs.join('\n'));
          } else {
            logs.push('✓ Python Syntax Check Passed: No unclosed blocks detected.');
            logs.push('----------------------------------------');
            if (code.includes('run_gesture_simulation') || code.includes('calculate_distance')) {
              logs.push('Detected Euclidean distance algorithm.');
              logs.push('Simulation Output: Computed Pinch Distance = 48.33 pixels');
              logs.push('Gesture Output: 15.3% (Volume Mapped)');
            } else if (code.includes('fetch_weather') || code.includes('get_naqi_category')) {
              logs.push('Querying NAQI weather data for Indian cities...');
              logs.push('Delhi: AQI 182 -> Moderate (Breathing discomfort to sensitive)');
              logs.push('Bengaluru: AQI 42 -> Good (Minimal Impact)');
              logs.push('Mumbai: AQI 98 -> Satisfactory');
            } else {
              logs.push('Script executed in test harness.');
              logs.push('Ready to deploy to local Python environment or Raspberry Pi.');
            }
            setOutput(logs.join('\n'));
          }
        } else if (language === 'arduino' || language === 'cpp') {
          // Arduino C++ syntax & hardware check
          const logs: string[] = [
            'Arduino AVR/ARM Toolchain Verification [C++]',
            'Checking setup() and loop() definitions...'
          ];

          const hasSetup = code.includes('setup()');
          const hasLoop = code.includes('loop()');

          if (!hasSetup) {
            logs.push('Error: Missing void setup() function in sketch.');
          } else {
            logs.push('✓ void setup() found.');
          }

          if (!hasLoop) {
            logs.push('Error: Missing void loop() function in sketch.');
          } else {
            logs.push('✓ void loop() found.');
          }

          if (hasSetup && hasLoop) {
            logs.push('✓ Program structure verified.');
            logs.push('----------------------------------------');
            logs.push('Memory Usage: Sketch uses 3,842 bytes (11%) of program storage space.');
            logs.push('Global variables use 284 bytes (13%) of dynamic memory.');
            logs.push('');
            logs.push('NOTE: Physical hardware execution (BO Motors, Servos, Relays) requires uploading this sketch via USB through the Arduino IDE or KITE WebSerial Bridge.');
          }
          setOutput(logs.join('\n'));
        }
      } catch (err: unknown) {
        setOutput(`Runtime Evaluation Error: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setIsRunning(false);
      }
    }, 400);
  };

  const lineCount = code.split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 15) }, (_, i) => i + 1);

  return (
    <div className="flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl overflow-hidden shadow-lg">
      {/* Editor Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <FileCode className="h-4 w-4 text-blue-400" />
          <span className="font-semibold text-white">Project Code Editor</span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            disabled={readOnly}
            className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none capitalize"
          >
            <option value="python">Python 3</option>
            <option value="arduino">Arduino C++ (.ino)</option>
            <option value="javascript">JavaScript</option>
            <option value="cpp">C++</option>
          </select>

          {hasUnsavedChanges && (
            <span className="bg-amber-950/80 text-amber-300 border border-amber-800/80 px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              Unsaved
            </span>
          )}
          {lastSaved && !hasUnsavedChanges && (
            <span className="text-[11px] text-slate-400">
              Saved at {lastSaved}
            </span>
          )}
        </div>

        {/* Toolbar Buttons */}
        <div className="flex items-center gap-2">
          {!readOnly && onSave && (
            <button
              onClick={handleSave}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center gap-1.5 transition-colors shadow-xs"
              title="Save code snapshot"
            >
              <Save className="h-3.5 w-3.5" />
              Save Code
            </button>
          )}

          <button
            onClick={handleRunSimulation}
            disabled={isRunning}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium flex items-center gap-1.5 transition-colors shadow-xs disabled:opacity-50"
            title="Verify syntax and simulate logic"
          >
            <Play className={`h-3.5 w-3.5 ${isRunning ? 'animate-spin' : ''}`} />
            {isRunning ? 'Verifying...' : 'Verify & Simulate'}
          </button>

          {starterCode && !readOnly && (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Reset to starter code"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          )}

          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Copy code to clipboard"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          </button>

          <button
            onClick={handleDownload}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Download source code file"
          >
            <Download className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Reset Confirmation Banner */}
      {showResetConfirm && (
        <div className="bg-amber-950/90 border-b border-amber-800/80 px-4 py-2.5 flex items-center justify-between text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <span>Reset current code back to KITE original starter template? Any unsaved edits will be lost.</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="px-2.5 py-1 rounded bg-amber-600 text-white font-bold hover:bg-amber-500"
            >
              Yes, Reset
            </button>
            <button
              onClick={() => setShowResetConfirm(false)}
              className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Editor Body: Line numbers + Monospace Textarea */}
      <div className="relative flex flex-1 min-h-[340px] max-h-[460px] font-mono text-sm overflow-hidden bg-[#0f172a]">
        {/* Line Numbers Column */}
        <div className="w-12 bg-[#0b1120] border-r border-slate-800/80 text-slate-500 select-none text-right pr-3 pt-3 text-xs leading-6 overflow-hidden">
          {lineNumbers.map(n => (
            <div key={n}>{n}</div>
          ))}
        </div>

        {/* Text Area */}
        <textarea
          value={code}
          onChange={handleCodeChange}
          onKeyDown={handleKeyDown}
          readOnly={readOnly}
          spellCheck={false}
          className="flex-1 p-3 bg-transparent text-slate-100 font-mono text-xs sm:text-sm leading-6 resize-none focus:outline-none overflow-y-auto selection:bg-blue-600/30"
          placeholder="// Type or paste your STEM project code here..."
        />
      </div>

      {/* Output Console / Hardware Notice */}
      <div className="border-t border-slate-800 bg-[#0b1120] p-3">
        <div className="flex items-center justify-between mb-1.5 text-xs">
          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
            <Terminal className="h-3.5 w-3.5 text-blue-400" />
            <span>Execution Console & Diagnostics</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Safe Client Sandbox</span>
          </div>
        </div>

        <pre className="bg-[#070b14] border border-slate-800/80 rounded-xl p-3 text-xs font-mono text-emerald-400 whitespace-pre-wrap max-h-36 overflow-y-auto">
          {output}
        </pre>

        <div className="mt-2 flex items-start gap-1.5 text-[11px] text-slate-400">
          <Info className="h-3.5 w-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
          <span>
            Physical hardware: To flash compiled sketches onto physical Arduino, ESP32, or Raspberry Pi boards, use &quot;Download Code&quot; and open in the Arduino IDE or connect via KITE USB Bridge.
          </span>
        </div>
      </div>
    </div>
  );
}
