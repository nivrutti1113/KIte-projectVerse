import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, EyeOff, UserCheck, FileText, ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-semibold mb-3">
            <ShieldCheck className="h-4 w-4" /> Indian DPDP Act (2023) Aligned
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            Child Privacy & Student Data Protection Policy
          </h1>
          <p className="text-xs text-slate-400 mt-2">
            Last Updated: October 2026 • KITE Robotics Education Private Limited
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Lock className="h-4 w-4 text-cyan-400" /> 1. Commitment to Protecting Minor Students
          </h2>
          <p>
            KITE ProjectVerse serves school students from Classes 3 through 12 across India. Because the vast majority of our builders are minors under the age of 18, data privacy, minimization, and safety are non-negotiable architectural principles.
          </p>
          <p>
            We comply with the principles of the <strong>Digital Personal Data Protection Act (DPDP), 2023 (India)</strong>, as well as global standards including COPPA (Children’s Online Privacy Protection Act) and FERPA.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <EyeOff className="h-4 w-4 text-cyan-400" /> 2. Private by Default Architecture
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-slate-300">
            <li>
              <strong>No Mandatory Real Names:</strong> Students may use pseudonym maker handles (e.g. &ldquo;aarav_maker&rdquo;).
            </li>
            <li>
              <strong>No Geolocation Tracking:</strong> We never collect, track, or share GPS coordinates or physical addresses of student makers.
            </li>
            <li>
              <strong>No Targeted Advertising:</strong> ProjectVerse is 100% free of third-party ad networks, tracking beacons, and behavioural profiling.
            </li>
            <li>
              <strong>Opt-In Public Portfolios:</strong> Student project portfolios are strictly private by default. Portfolios can only be made publicly viewable with affirmative toggle by the student/guardian.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-cyan-400" /> 3. Verifiable Parental & School Consent
          </h2>
          <p>
            For independent students enrolling outside a partner school agreement, verifiable guardian consent is recorded via guardian email confirmation. For students enrolled via CBSE/ICSE school partnerships or Atal Tinkering Labs (ATL), the institutional tenant contract acts as educational agency authorization under applicable Indian educational law.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="h-4 w-4 text-cyan-400" /> 4. AI Mentor Safety Safeguards
          </h2>
          <p>
            Queries sent to the KITE AI Mentor are strictly sanitized:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-300">
            <li>No personal identification data or student profile info is sent to AI model providers.</li>
            <li>Prompts are bound to project instructions, circuit components, and code context.</li>
            <li>Per-hour rate limits prevent excessive model querying and enforce deliberate thinking.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white">
            5. Right to Erasure and Data Portability
          </h2>
          <p>
            Parents, students, and schools may request full export or permanent deletion of their account, code revisions, and submissions at any time by contacting our Data Protection Officer at:
          </p>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300">
            Email: privacy@kiterobotics.in<br />
            Attention: Data Protection Officer, KITE Robotics Education Pvt. Ltd., New Delhi, India
          </div>
        </section>
      </div>
    </div>
  );
}
