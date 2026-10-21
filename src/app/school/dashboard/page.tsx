'use client';

import React from 'react';
import Link from 'next/link';
import RoleGuard from '@/components/RoleGuard';
import { useAuth } from '@/lib/auth-context';
import { 
  School, 
  Users, 
  BookOpen, 
  Award, 
  BarChart3, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';

export default function SchoolDashboard() {
  const { user } = useAuth();

  return (
    <RoleGuard allowedRoles={['school_admin', 'admin']}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Banner */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 mb-8 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-semibold mb-2">
                <School className="h-3.5 w-3.5" /> Institutional School Administration
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {user?.school_name || 'KITE Innovation Model School'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                CBSE Affiliation • Atal Tinkering Lab (ATL) Registered • Tenant ID: KITE-DL-01
              </p>
            </div>

            <div className="flex gap-2">
              <Link
                href="/school/reports"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
              >
                <BarChart3 className="h-3.5 w-3.5" />
                <span>Lab Reports</span>
              </Link>
            </div>
          </div>

          {/* School Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-400 text-xs">Total Students</span>
              <div className="text-2xl font-bold text-white mt-1">240</div>
              <span className="text-[10px] text-emerald-400">Classes 6 to 10</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-400 text-xs">Faculty Mentors</span>
              <div className="text-2xl font-bold text-cyan-400 mt-1">8</div>
              <span className="text-[10px] text-slate-400">Robotics & Coding</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-400 text-xs">Completed Builds</span>
              <div className="text-2xl font-bold text-emerald-400 mt-1">184</div>
              <span className="text-[10px] text-emerald-400">Verified by Rubric</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-400 text-xs">Lab Plan Tier</span>
              <div className="text-sm font-bold text-amber-400 mt-2 truncate">Premium Institutional</div>
              <span className="text-[10px] text-slate-400">Active until Mar 2027</span>
            </div>
          </div>
        </div>

        {/* Modules Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/school/students"
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-lg group"
          >
            <div className="h-10 w-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-white text-base mb-1">Student Roster & Progress</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Inspect student enrollment, completed builds, and verified digital portfolios across all sections.
            </p>
            <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1">
              View Students <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>

          <Link
            href="/school/teachers"
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-lg group"
          >
            <div className="h-10 w-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <School className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-white text-base mb-1">Teacher & Faculty Directory</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Manage teacher assignments, class sections, and review performance for STEM educators.
            </p>
            <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1">
              View Faculty <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>

          <Link
            href="/school/reports"
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-lg group"
          >
            <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-white text-base mb-1">Analytics & ATL Compliance</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Generate comprehensive reports on hands-on project hours, kit usage, and learning benchmarks.
            </p>
            <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1">
              Generate Reports <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        </div>

        {/* Multi-Tenant Isolation Security Note */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-emerald-400 flex-shrink-0" />
          <span>
            <strong>Tenant Isolation Enforced:</strong> All student rosters, assignment submissions, and review notes are isolated to &quot;{user?.school_name}&quot; via Supabase Row-Level Security (RLS) policies.
          </span>
        </div>
      </div>
    </RoleGuard>
  );
}
