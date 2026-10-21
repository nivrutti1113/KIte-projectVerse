'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { 
  getStudentProjects, 
  getAssignments, 
  getStudentBadges, 
  getNotifications 
} from '@/lib/data';
import { StudentProject, Assignment, StudentBadge, InAppNotification } from '@/types';
import { formatDate } from '@/lib/format';
import { 
  Play, 
  Award, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  BookOpen, 
  Zap, 
  Terminal, 
  Bot, 
  Cpu, 
  Calendar,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [studentProjects, setStudentProjects] = useState<StudentProject[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [badges, setBadges] = useState<StudentBadge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const studentId = user?.id || 'usr-student-1';
      const [spList, asgList, badgeList] = await Promise.all([
        getStudentProjects(studentId),
        getAssignments(),
        getStudentBadges(studentId)
      ]);
      setStudentProjects(spList);
      setAssignments(asgList);
      setBadges(badgeList);
      setLoading(false);
    }
    loadData();
  }, [user?.id]);

  const activeProjects = studentProjects.filter(sp => sp.status !== 'completed');
  const completedProjects = studentProjects.filter(sp => sp.status === 'completed');

  const badgeIconMap: Record<string, React.ReactNode> = {
    Zap: <Zap className="h-5 w-5 text-amber-500" />,
    Terminal: <Terminal className="h-5 w-5 text-blue-600" />,
    Bot: <Bot className="h-5 w-5 text-indigo-600" />,
    Cpu: <Cpu className="h-5 w-5 text-violet-600" />
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Welcome Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 mb-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2 border border-blue-200">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" /> Student Maker Studio
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Welcome back, {user?.full_name || 'Aarav'}! 🚀
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Class 8 • {user?.school_name || 'KITE Innovation Model School'} • Ready to engineer your next build?
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href={`/portfolio/${user?.username || 'aarav_maker'}`}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Public Portfolio</span>
            </Link>
            <Link
              href="/projects"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <span>Explore Projects</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-200">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-slate-500 text-xs font-medium">In Progress</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">{activeProjects.length}</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-slate-500 text-xs font-medium">Completed Builds</span>
            <div className="text-2xl font-bold text-emerald-600 mt-1">{completedProjects.length + 1}</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-slate-500 text-xs font-medium">Badges Earned</span>
            <div className="text-2xl font-bold text-amber-600 mt-1">{badges.length}</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-slate-500 text-xs font-medium">Active Class</span>
            <div className="text-sm font-bold text-blue-600 mt-2 truncate">Class 8 Robotics</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: In-Progress Builds (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Active Projects & Workspaces
            </h2>
            <Link href="/my-projects" className="text-xs font-semibold text-blue-600 hover:underline">
              View All
            </Link>
          </div>

          {activeProjects.length === 0 ? (
            <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl shadow-xs">
              <Bot className="h-10 w-10 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-900">No Active Projects</p>
              <p className="text-xs text-slate-500 mt-1 mb-4">Start a new robotics or AI build from the library.</p>
              <Link href="/projects" className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors">
                Browse Projects
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {activeProjects.map(sp => (
                <div
                  key={sp.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
                >
                  <div className="flex items-start gap-3.5 flex-1">
                    <div className="h-12 w-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 flex-shrink-0">
                      <Bot className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                          {sp.project?.title || 'STEM Project'}
                        </h3>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                          {sp.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-1">
                        {sp.project?.summary}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-500">
                        <span>Step {sp.current_step}</span>
                        <span>•</span>
                        <span>{sp.progress_percent}% complete</span>
                        <span>•</span>
                        <span>Saved {formatDate(sp.last_saved_at)}</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/workspace/${sp.project_id}`}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Play className="h-3.5 w-3.5" />
                    <span>Resume Workspace</span>
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* School Assignments Section */}
          <div className="pt-4">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-amber-500" />
              Teacher Assignments
            </h2>

            <div className="space-y-3">
              {assignments.map(asg => (
                <div
                  key={asg.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-xs"
                >
                  <div>
                    <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-bold text-[10px] uppercase">
                      Due {formatDate(asg.due_date)}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm mt-1">{asg.title}</h3>
                    <p className="text-slate-600 text-xs mt-0.5">{asg.description}</p>
                    <span className="text-slate-500 text-[11px] mt-1 block">
                      Target Project: {asg.project_title} • Points: {asg.points_possible}
                    </span>
                  </div>

                  <Link
                    href={`/workspace/${asg.project_id}`}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 whitespace-nowrap transition-colors"
                  >
                    Open Assignment Build
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Badges & Quick Links */}
        <div className="space-y-6">
          {/* Unlocked Badges Showcase */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Award className="h-4 w-4 text-amber-500" />
                Verified STEM Badges ({badges.length})
              </h3>
              <Link href={`/portfolio/${user?.username || 'aarav_maker'}`} className="text-xs text-blue-600 hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {badges.map(sb => (
                <div
                  key={sb.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3"
                >
                  <div className="h-10 w-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0">
                    {badgeIconMap[sb.badge?.icon || 'Zap'] || <Award className="h-5 w-5 text-amber-500" />}
                  </div>
                  <div className="flex-1 text-xs">
                    <h4 className="font-bold text-slate-900">{sb.badge?.title}</h4>
                    <p className="text-[11px] text-slate-600 line-clamp-1">{sb.reason}</p>
                    <span className="text-[10px] text-slate-400">
                      Awarded {formatDate(sb.awarded_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Support & Resources Card */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-6 shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-blue-600" /> Need Build Help?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Open the AI Mentor in any workspace to ask questions about resistor calculations, motor wiring, and syntax errors.
            </p>
            <Link
              href="/workspace/proj-001"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <Bot className="h-4 w-4" /> Try Obstacle Rover with AI Mentor
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
