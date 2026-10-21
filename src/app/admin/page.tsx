'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import RoleGuard from '@/components/RoleGuard';
import { useAuth } from '@/lib/auth-context';
import { getProjects, getAuditLogs } from '@/lib/data';
import { Project, AuditLog } from '@/types';
import { 
  Bot, 
  School, 
  Users, 
  ShieldAlert, 
  BookOpen, 
  ArrowRight, 
  Activity, 
  Sparkles,
  Layers,
  Settings,
  Database
} from 'lucide-react';

export default function AdminHubPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    getProjects().then(setProjects);
    getAuditLogs().then(setAuditLogs);
  }, []);

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 mb-8 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-950 text-violet-300 border border-violet-800 text-xs font-semibold mb-2">
                <Sparkles className="h-3.5 w-3.5" /> Central KITE Platform Administrator
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Platform Operations & System Hub
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                KITE Robotics Platform Headquarters • Managing Indian STEM curriculum and tenant infrastructure
              </p>
            </div>

            <div className="flex gap-2">
              <Link
                href="/admin/projects"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>Project Catalog Admin</span>
              </Link>
            </div>
          </div>

          {/* Platform Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-400 text-xs">Catalog Projects</span>
              <div className="text-2xl font-bold text-white mt-1">{projects.length}</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-400 text-xs">Partner Schools</span>
              <div className="text-2xl font-bold text-cyan-400 mt-1">45+</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-400 text-xs">Active Builders</span>
              <div className="text-2xl font-bold text-emerald-400 mt-1">2,400+</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-400 text-xs">Database Engine</span>
              <div className="text-sm font-bold text-amber-400 mt-2 truncate">Supabase RLS Active</div>
            </div>
          </div>
        </div>

        {/* Administration Modules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <Link
            href="/admin/projects"
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-xl group"
          >
            <div className="h-10 w-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <BookOpen className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-white text-base mb-1">Project Catalog Management</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Add new official STEM projects, edit step-by-step schematics, manage starter code, and set difficulty tiers.
            </p>
            <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1">
              Manage Catalog <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>

          <Link
            href="/admin/schools"
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-xl group"
          >
            <div className="h-10 w-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <School className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-white text-base mb-1">Schools & Tenants</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Enroll new partner schools, configure institutional plans, and enforce data boundaries.
            </p>
            <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1">
              Manage Schools <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>

          <Link
            href="/admin/audit-logs"
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-xl group"
          >
            <div className="h-10 w-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-white text-base mb-1">System Audit & Security Logs</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Review administrative events, project modifications, and access logs for regulatory compliance.
            </p>
            <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1">
              View Audit Trail <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        </div>
      </div>
    </RoleGuard>
  );
}
