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
    Zap: <Zap className="h-5 w-5 text-amber-400" />,
    Terminal: <Terminal className="h-5 w-5 text-indigo-400" />,
    Bot: <Bot className="h-5 w-5 text-cyan-400" />,
    Cpu: <Cpu className="h-5 w-5 text-violet-400" />
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 mb-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-900/80 text-indigo-200 text-xs font-semibold mb-2">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" /> Student Maker Studio
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome back, {user?.full_name || 'Aarav'}! 🚀
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Class 8 • {user?.school_name || 'KITE Innovation Model School'} • Ready to engineer your next build?
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href={`/portfolio/${user?.username || 'aarav_maker'}`}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Public Portfolio</span>
            </Link>
            <Link
              href="/projects"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
            >
              <span>Explore Projects</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-slate-400 text-xs">In Progress</span>
            <div className="text-2xl font-bold text-white mt-1">{activeProjects.length}</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-slate-400 text-xs">Completed Builds</span>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{completedProjects.length + 1}</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-slate-400 text-xs">Badges Earned</span>
            <div className="text-2xl font-bold text-amber-400 mt-1">{badges.length}</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-slate-400 text-xs">Active Class</span>
            <div className="text-sm font-bold text-cyan-400 mt-2 truncate">Class 8 Robotics</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: In-Progress Builds (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-cyan-400" />
              Active Projects & Workspaces
            </h2>
            <Link href="/my-projects" className="text-xs font-semibold text-cyan-400 hover:underline">
              View All
            </Link>
          </div>

          {activeProjects.length === 0 ? (
            <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl">
              <Bot className="h-10 w-10 text-slate-500 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">No Active Projects</p>
              <p className="text-xs text-slate-400 mt-1 mb-4">Start a new robotics or AI build from the library.</p>
              <Link href="/projects" className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold">
                Browse Projects
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {activeProjects.map(sp => (
                <div
                  key={sp.id}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md"
                >
                  <div className="flex items-start gap-3.5 flex-1">
                    <div className="h-12 w-12 rounded-xl bg-indigo-950 border border-indigo-800 flex items-center justify-center text-cyan-400 flex-shrink-0">
                      <Bot className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-sm sm:text-base">
                          {sp.project?.title || 'STEM Project'}
                        </h3>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 uppercase">
                          {sp.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                        {sp.project?.summary}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-400">
                        <span>Step {sp.current_step}</span>
                        <span>•</span>
                        <span>{sp.progress_percent}% complete</span>
                        <span>•</span>
                        <span>Saved {new Date(sp.last_saved_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/workspace/${sp.project_id}`}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all"
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
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-amber-400" />
              Teacher Assignments
            </h2>

            <div className="space-y-3">
              {assignments.map(asg => (
                <div
                  key={asg.id}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-bold text-[10px] uppercase">
                      Due {new Date(asg.due_date).toLocaleDateString()}
                    </span>
                    <h3 className="font-bold text-white text-sm mt-1">{asg.title}</h3>
                    <p className="text-slate-400 text-xs mt-0.5">{asg.description}</p>
                    <span className="text-slate-500 text-[11px] mt-1 block">
                      Target Project: {asg.project_title} • Points: {asg.points_possible}
                    </span>
                  </div>

                  <Link
                    href={`/workspace/${asg.project_id}`}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 whitespace-nowrap"
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
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                <Award className="h-4 w-4 text-amber-400" />
                Verified STEM Badges ({badges.length})
              </h3>
              <Link href={`/portfolio/${user?.username || 'aarav_maker'}`} className="text-xs text-cyan-400 hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {badges.map(sb => (
                <div
                  key={sb.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center gap-3"
                >
                  <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                    {badgeIconMap[sb.badge?.icon || 'Zap'] || <Award className="h-5 w-5 text-amber-400" />}
                  </div>
                  <div className="flex-1 text-xs">
                    <h4 className="font-bold text-white">{sb.badge?.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{sb.reason}</p>
                    <span className="text-[10px] text-slate-500">
                      Awarded {new Date(sb.awarded_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Support & Resources Card */}
          <div className="bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-900/60 rounded-2xl p-6 shadow-md">
            <h3 className="font-bold text-white text-sm mb-2 flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-cyan-400" /> Need Build Help?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Open the AI Mentor in any workspace to ask questions about resistor calculations, motor wiring, and syntax errors.
            </p>
            <Link
              href="/workspace/proj-001"
              className="w-full py-2.5 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Bot className="h-4 w-4" /> Try Obstacle Rover with AI Mentor
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
