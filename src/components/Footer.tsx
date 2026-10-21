'use client';

import React from 'react';
import Link from 'next/link';
import { Bot, ShieldCheck, Heart, Sparkles, MapPin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center text-white">
                <Bot className="h-5 w-5" />
              </div>
              <span className="font-bold text-lg text-white">
                KITE <span className="text-cyan-400">ProjectVerse</span>
              </span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed max-w-sm">
              The premier practical STEM project-building platform by KITE Robotics. Complements the KITE LMS by enabling students in Classes 3–12 across India to apply knowledge into physical robotics, electronics, IoT, and AI innovations.
            </p>
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-xs space-y-1">
              <div className="text-indigo-300 font-semibold flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" /> KITE Educational Philosophy
              </div>
              <p className="text-slate-300 italic">
                &ldquo;Learn on KITE LMS. Build on ProjectVerse. Showcase your skills.&rdquo;
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-indigo-400" /> New Delhi & Bengaluru, India
              </span>
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5 text-indigo-400" /> support@kiterobotics.in
              </span>
            </div>
          </div>

          {/* Project Domains */}
          <div>
            <h3 className="font-semibold text-white text-xs uppercase tracking-wider mb-4">
              STEM Domains
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/projects?category=Robotics" className="hover:text-cyan-400 transition-colors">
                  Autonomous Robotics
                </Link>
              </li>
              <li>
                <Link href="/projects?category=Electronics" className="hover:text-cyan-400 transition-colors">
                  Embedded Electronics
                </Link>
              </li>
              <li>
                <Link href="/projects?category=Arduino+%26+Microcontrollers" className="hover:text-cyan-400 transition-colors">
                  Arduino & Sensors
                </Link>
              </li>
              <li>
                <Link href="/projects?category=Coding+%26+Python" className="hover:text-cyan-400 transition-colors">
                  Python & Data Analytics
                </Link>
              </li>
              <li>
                <Link href="/projects?category=Artificial+Intelligence" className="hover:text-cyan-400 transition-colors">
                  AI & Computer Vision
                </Link>
              </li>
              <li>
                <Link href="/projects?category=Internet+of+Things" className="hover:text-cyan-400 transition-colors">
                  IoT & Smart Cities
                </Link>
              </li>
            </ul>
          </div>

          {/* Portals */}
          <div>
            <h3 className="font-semibold text-white text-xs uppercase tracking-wider mb-4">
              Portals & Roles
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/dashboard" className="hover:text-cyan-400 transition-colors">
                  Student Maker Hub
                </Link>
              </li>
              <li>
                <Link href="/teacher/dashboard" className="hover:text-cyan-400 transition-colors">
                  Teacher & Mentor Portal
                </Link>
              </li>
              <li>
                <Link href="/school/dashboard" className="hover:text-cyan-400 transition-colors">
                  School Admin Dashboard
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-cyan-400 transition-colors">
                  KITE Platform Admin
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-cyan-400 transition-colors">
                  School Lab Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Child Safety & Legal */}
          <div>
            <h3 className="font-semibold text-white text-xs uppercase tracking-wider mb-4">
              Safety & Governance
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/privacy" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> DPDP Act Privacy Notice
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-cyan-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <span className="text-slate-400 block">
                  Private-by-default for minors
                </span>
              </li>
              <li>
                <span className="text-slate-400 block">
                  Parental consent verified
                </span>
              </li>
              <li>
                <span className="text-slate-400 block">
                  Atal Tinkering Lab (ATL) ready
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 KITE Robotics Education Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>Built with precision for India&apos;s young innovators</span>
            <Heart className="h-3 w-3 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
}
