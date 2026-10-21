'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import RoleGuard from '@/components/RoleGuard';
import { useAuth } from '@/lib/auth-context';
import { getClasses, getAssignments, getSubmissions } from '@/lib/data';
import { ClassGroup, Assignment, ProjectSubmission } from '@/types';
import { formatDate } from '@/lib/format';
import { 
  Users, 
  BookOpen, 
  Award, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Plus, 
  Sparkles,
  School,
  FileCheck2
} from 'lucide-react';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<ClassGroup[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<ProjectSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [clsList, asgList, subList] = await Promise.all([
        getClasses(undefined, user?.id),
        getAssignments(undefined, user?.id),
        getSubmissions()
      ]);
      setClasses(clsList);
      setAssignments(asgList);
      setSubmissions(subList);
      setLoading(false);
    }
    load();
  }, [user?.id]);

  const pendingReviews = submissions.filter(s => s.status === 'submitted' || s.status === 'under_review');
  const approvedReviews = submissions.filter(s => s.status === 'approved');

  return (
    <RoleGuard allowedRoles={['teacher', 'admin']}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Welcome Banner */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 mb-8 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2 border border-blue-200">
                <School className="h-3.5 w-3.5 text-blue-600" /> KITE Teacher & Mentor Hub
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Faculty Workspace: {user?.full_name || 'Priya Raman'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                {user?.school_name || 'KITE Innovation Model School'} • Atal Tinkering Lab & Robotics Mentor
              </p>
            </div>

            <div className="flex gap-2">
              <Link
                href="/teacher/assignments"
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
              >
                Create Assignment
              </Link>
              <Link
                href="/teacher/reviews"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <FileCheck2 className="h-3.5 w-3.5" />
                <span>Review Queue ({pendingReviews.length})</span>
              </Link>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-200">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-slate-500 text-xs font-medium">Active Classes</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">{classes.length}</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-slate-500 text-xs font-medium">Enrolled Students</span>
              <div className="text-2xl font-bold text-blue-600 mt-1">
                {classes.reduce((sum, c) => sum + (c.student_count || 0), 0)}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-slate-500 text-xs font-medium">Pending Reviews</span>
              <div className="text-2xl font-bold text-amber-600 mt-1">{pendingReviews.length}</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-slate-500 text-xs font-medium">Verified Completions</span>
              <div className="text-2xl font-bold text-emerald-600 mt-1">{approvedReviews.length}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Submissions Awaiting Evaluation (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileCheck2 className="h-5 w-5 text-amber-500" />
                Submissions Awaiting Rubric Review
              </h2>
              <Link href="/teacher/reviews" className="text-xs font-semibold text-blue-600 hover:underline">
                Open Review Studio →
              </Link>
            </div>

            {pendingReviews.length === 0 ? (
              <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl text-xs text-slate-500 shadow-xs">
                <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
                <p className="font-semibold text-slate-900">All Submissions Graded!</p>
                <p className="mt-1">No pending student project submissions in your queue.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingReviews.map(sub => (
                  <div
                    key={sub.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                          Needs Review
                        </span>
                        <span className="text-xs text-slate-500">
                          Student: <strong className="text-slate-900">{sub.student_name}</strong>
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-base">{sub.title}</h3>
                      <p className="text-xs text-blue-600 font-medium">{sub.project_title}</p>
                      <span className="text-[11px] text-slate-500 mt-1 block">
                        Submitted: {formatDate(sub.submitted_at)}
                      </span>
                    </div>

                    <Link
                      href="/teacher/reviews"
                      className="w-full sm:w-auto px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                    >
                      <span>Grade Rubric</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {/* Managed Classes Grid */}
            <div className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Your Classes & Join Codes
                </h2>
                <Link href="/teacher/classes" className="text-xs font-semibold text-blue-600 hover:underline">
                  Manage Classes →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {classes.map(cls => (
                  <div
                    key={cls.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-blue-600">Grade {cls.grade} - Section {cls.section}</span>
                      <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-mono font-bold text-xs border border-blue-200">
                        Code: {cls.join_code}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm mb-1">{cls.name}</h3>
                    <p className="text-xs text-slate-500 mb-3">{cls.student_count || 0} Students Enrolled</p>
                    <Link
                      href="/teacher/assignments"
                      className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                    >
                      Assign Project <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Quick Shortcuts */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <h3 className="font-bold text-slate-900 text-sm mb-3">Teacher Quick Tools</h3>
              <div className="space-y-2 text-xs">
                <Link
                  href="/teacher/classes"
                  className="block p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
                >
                  <strong className="text-slate-900 block mb-0.5">Add Class Section</strong>
                  <span className="text-slate-500">Generate join code for new STEM batch</span>
                </Link>
                <Link
                  href="/teacher/assignments"
                  className="block p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
                >
                  <strong className="text-slate-900 block mb-0.5">Create Capstone Assignment</strong>
                  <span className="text-slate-500">Target a project to Class 8 or 9</span>
                </Link>
                <Link
                  href="/teacher/reviews"
                  className="block p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
                >
                  <strong className="text-slate-900 block mb-0.5">Evaluation Rubric Matrix</strong>
                  <span className="text-slate-500">Grade against 6 KITE STEM criteria</span>
                </Link>
              </div>
            </div>

            <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-6 shadow-xs text-xs text-slate-700 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-blue-600" /> KITE STEM Rubric Standard
              </h4>
              <p className="leading-relaxed">
                When grading projects, scores are structured into 6 core engineering competencies (Functionality, Conceptual Understanding, Code Quality, Creativity, Documentation, and Safety) for a total of 30 points.
              </p>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
