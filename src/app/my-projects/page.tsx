'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { getStudentProjects } from '@/lib/data';
import { StudentProject } from '@/types';
import { 
  Bot, 
  Play, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Download, 
  Eye, 
  Sparkles,
  Layers
} from 'lucide-react';

export default function MyProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<StudentProject[]>([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const studentId = user?.id || 'usr-student-1';
      const list = await getStudentProjects(studentId);
      setProjects(list);
      setLoading(false);
    }
    load();
  }, [user?.id]);

  const filtered = statusFilter === 'All' 
    ? projects 
    : projects.filter(p => p.status === statusFilter);

  const handleDownloadCode = (sp: StudentProject) => {
    const ext = sp.active_language === 'arduino' ? 'ino' : sp.active_language === 'python' ? 'py' : 'js';
    const blob = new Blob([sp.active_code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${sp.project?.slug || 'project'}_code.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">My STEM Projects</h1>
          <p className="text-slate-600 text-sm mt-1">
            Track, resume, and manage all your physical and coding project workspaces.
          </p>
        </div>

        <Link
          href="/projects"
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <span>Find New Project</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-4 mb-6 overflow-x-auto text-xs font-semibold">
        {['All', 'in_progress', 'submitted', 'completed'].map(st => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3.5 py-1.5 rounded-xl capitalize transition-all ${
              statusFilter === st
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            {st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map(i => (
            <div key={i} className="h-48 rounded-2xl bg-white border border-slate-200 animate-pulse shadow-xs" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl max-w-lg mx-auto shadow-xs">
          <Layers className="h-12 w-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No Projects in this category</h3>
          <p className="text-xs text-slate-500 mt-1 mb-5">
            You don&apos;t have any projects with status &quot;{statusFilter.replace('_', ' ')}&quot;.
          </p>
          <Link href="/projects" className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors">
            Browse Project Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map(sp => (
            <div
              key={sp.id}
              className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {sp.project?.category}
                  </span>
                  <span className="text-[11px] font-medium capitalize px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                    Status: {sp.status.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="font-bold text-lg text-slate-900 mb-2">
                  {sp.project?.title || 'STEM Project'}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                  {sp.project?.summary}
                </p>

                {/* Progress bar */}
                <div className="space-y-1 mb-4">
                  <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                    <span>Build Progress: Step {sp.current_step}</span>
                    <span className="text-blue-600 font-bold">{sp.progress_percent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all"
                      style={{ width: `${sp.progress_percent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                <button
                  onClick={() => handleDownloadCode(sp)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium flex items-center gap-1.5 transition-colors"
                  title="Download saved code file"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Code</span>
                </button>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/projects/${sp.project?.slug}`}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium flex items-center gap-1 transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5" /> Details
                  </Link>
                  <Link
                    href={`/workspace/${sp.project_id}`}
                    className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Play className="h-3.5 w-3.5" /> Resume
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
