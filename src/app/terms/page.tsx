import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldAlert } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Return Home
      </Link>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl space-y-8 text-xs sm:text-sm text-slate-300 leading-relaxed">
        <div className="border-b border-slate-800 pb-6">
          <h1 className="text-3xl font-extrabold text-white">Terms of Service & STEM Lab Safety</h1>
          <p className="text-xs text-slate-400 mt-2">
            Effective Date: October 2026 • KITE Robotics Education Private Limited
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white">1. Educational Purpose & Physical Hardware Disclaimer</h2>
          <p>
            KITE ProjectVerse provides interactive project guides, code editors, and educational assessments. While we design all projects for low-voltage (3.3V to 12V DC) educational components (e.g. Arduino Uno, ESP32, battery holders, micro-servos), physical assembly carries inherent responsibilities.
          </p>
          <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-900/60 text-xs text-amber-200">
            <strong>Hardware Safety Rule:</strong> Students must never connect educational projects to 230V AC household mains power. Always supervise young children when using hot glue guns, wire strippers, or soldering irons.
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white">2. Acceptable Use of Sandboxed Code Environment</h2>
          <p>
            The ProjectVerse code editor and simulation environment is intended solely for educational software development. Users must not attempt to execute denial-of-service scripts, exploit web sandboxes, or attempt unauthorized cross-tenant database access.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white">3. Intellectual Property of Student Creations</h2>
          <p>
            Students retain full intellectual property ownership of the original code, mechanical designs, and project reflections they author on ProjectVerse. KITE Robotics is granted a non-exclusive license to display project submissions in verified portfolios in accordance with the student&apos;s privacy settings.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white">4. Jurisdiction & Governing Law</h2>
          <p>
            These terms are governed by the laws of the Republic of India. Any disputes arising out of the platform shall be subject to the exclusive jurisdiction of the competent courts in New Delhi, India.
          </p>
        </section>
      </div>
    </div>
  );
}
