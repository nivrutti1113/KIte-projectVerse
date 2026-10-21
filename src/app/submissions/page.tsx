'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { getSubmissions } from '@/lib/data';
import { ProjectSubmission } from '@/types';
import { 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Video, 
  Award, 
  ChevronDown, 
  ExternalLink,
  MessageSquare,
  FileCode2,
  Sparkles
} from 'lucide-react';

export default function SubmissionsPage() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<ProjectSubmission[]>([]);
  const [selectedSub, setSelectedSub] = useState<ProjectSubmission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const studentId = user?.id || 'usr-student-1';
      const list = await getSubmissions({ studentId });
      setSubmissions(list);
      if (list.length > 0) {
        setSelectedSub(list[0]);
      }
      setLoading(false);
    }
    load();
  }, [user?.id]);

  const statusColors: Record<string, string> = {
    submitted: 'bg-blue-50 text-blue-700 border-blue-200',
    under_review: 'bg-amber-50 text-amber-800 border-amber-200',
    changes_requested: 'bg-rose-50 text-rose-700 border-rose-200',
    approved: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Project Submissions & Mentor Reviews</h1>
        <p className="text-slate-600 text-sm mt-1">
          Review feedback, rubric scores, and mentor recommendations for your STEM builds.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading submissions...</div>
      ) : submissions.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl max-w-lg mx-auto shadow-xs">
          <Send className="h-12 w-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No Project Submissions Yet</h3>
          <p className="text-xs text-slate-500 mt-1 mb-5">
            When you complete a build in your workspace, submit your project reflection and photos for review.
          </p>
          <Link href="/workspace/proj-001" className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors">
            Open Obstacle Rover Workspace
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Submissions List (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              All Submissions ({submissions.length})
            </h2>

            {submissions.map(sub => {
              const isSelected = selectedSub?.id === sub.id;
              return (
                <div
                  key={sub.id}
                  onClick={() => setSelectedSub(sub)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-50/60 border-blue-500 shadow-xs ring-1 ring-blue-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${statusColors[sub.status] || 'bg-slate-100 text-slate-700'}`}>
                      {sub.status.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {new Date(sub.submitted_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{sub.title}</h3>
                  <p className="text-xs text-blue-600 font-medium mt-0.5">{sub.project_title}</p>

                  {sub.review && (
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Score:</span>
                      <span className="font-bold text-emerald-600">
                        {sub.review.overall_score} / {sub.review.max_score} pts
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submission Details & Rubric Score (7 cols) */}
          <div className="lg:col-span-7">
            {selectedSub ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
                  <div>
                    <span className={`text-xs font-bold uppercase px-2.5 py-0.5 rounded-full border ${statusColors[selectedSub.status]}`}>
                      {selectedSub.status.replace('_', ' ')}
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 mt-2">{selectedSub.title}</h2>
                    <p className="text-xs text-slate-500">{selectedSub.project_title}</p>
                  </div>

                  <Link
                    href={`/workspace/${selectedSub.project_id}`}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200"
                  >
                    <FileCode2 className="h-4 w-4" /> Open Workspace
                  </Link>
                </div>

                {/* Student's Written Reflection */}
                <div className="space-y-4 text-xs sm:text-sm">
                  <div>
                    <h3 className="font-semibold text-slate-500 uppercase text-[11px] tracking-wider mb-1">
                      Project Explanation
                    </h3>
                    <p className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 leading-relaxed">
                      {selectedSub.explanation}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-500 uppercase text-[11px] tracking-wider mb-1">
                      Key STEM Learnings
                    </h3>
                    <p className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 leading-relaxed">
                      {selectedSub.learnings}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-500 uppercase text-[11px] tracking-wider mb-1">
                      Challenges Overcome
                    </h3>
                    <p className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 leading-relaxed">
                      {selectedSub.challenges_faced}
                    </p>
                  </div>

                  {selectedSub.video_url && (
                    <div>
                      <h3 className="font-semibold text-slate-500 uppercase text-[11px] tracking-wider mb-1">
                        Demonstration Video
                      </h3>
                      <a
                        href={selectedSub.video_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 hover:underline text-xs"
                      >
                        <Video className="h-4 w-4" />
                        <span>Watch Demo: {selectedSub.video_url}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Mentor Review & Rubric Scores Card */}
                {selectedSub.review ? (
                  <div className="mt-8 pt-6 border-t border-slate-200 space-y-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                          <Award className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-base">Mentor Rubric Review</h3>
                          <p className="text-xs text-slate-500">
                            Evaluated by {selectedSub.review.reviewer_name}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-black text-emerald-600">
                          {selectedSub.review.overall_score} / {selectedSub.review.max_score}
                        </div>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                          Total Score
                        </span>
                      </div>
                    </div>

                    {/* Written Feedback Quote */}
                    <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs sm:text-sm text-slate-800 italic space-y-1">
                      <div className="font-semibold text-blue-700 not-italic flex items-center gap-1.5 mb-1">
                        <MessageSquare className="h-4 w-4" /> Mentor Written Evaluation:
                      </div>
                      &ldquo;{selectedSub.review.written_feedback}&rdquo;
                    </div>

                    {/* 6-Point Rubric Breakdown */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Criteria Breakdown
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {selectedSub.review.rubric_scores.map((rubric, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-slate-800">{rubric.criterion}</span>
                              <span className="font-bold text-emerald-600 font-mono">
                                {rubric.score}/{rubric.max_points}
                              </span>
                            </div>
                            {rubric.feedback && (
                              <p className="text-[11px] text-slate-500">{rubric.feedback}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                    <Clock className="h-6 w-6 text-amber-500 mx-auto mb-2 animate-spin" />
                    <p className="font-semibold text-slate-900">Awaiting Mentor Review</p>
                    <p className="mt-1">
                      Your STEM mentor has been notified and will evaluate your build against the KITE 6-point rubric.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400">Select a submission to inspect.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
