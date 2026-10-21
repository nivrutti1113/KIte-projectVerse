'use client';

import React, { useState, useEffect } from 'react';
import RoleGuard from '@/components/RoleGuard';
import { useAuth } from '@/lib/auth-context';
import { getSubmissions, reviewSubmission } from '@/lib/data';
import { ProjectSubmission, RubricScore } from '@/types';
import { formatDate } from '@/lib/format';
import { 
  FileCheck2, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Video, 
  Code2, 
  MessageSquare, 
  ExternalLink,
  Sliders,
  Send
} from 'lucide-react';

const DEFAULT_RUBRIC_CRITERIA = [
  { criterion: 'Working Functionality & Evidence', max_points: 5, defaultScore: 5 },
  { criterion: 'Concept Understanding', max_points: 5, defaultScore: 5 },
  { criterion: 'Code/Build Quality', max_points: 5, defaultScore: 4 },
  { criterion: 'Creativity & Problem Solving', max_points: 5, defaultScore: 5 },
  { criterion: 'Explanation & Documentation', max_points: 5, defaultScore: 4 },
  { criterion: 'Safety & Responsible Implementation', max_points: 5, defaultScore: 5 }
];

export default function TeacherReviewsPage() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<ProjectSubmission[]>([]);
  const [selectedSub, setSelectedSub] = useState<ProjectSubmission | null>(null);
  const [rubricScores, setRubricScores] = useState<Record<string, number>>({});
  const [writtenFeedback, setWrittenFeedback] = useState('');
  const [statusAction, setStatusAction] = useState<'approved' | 'changes_requested'>('approved');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const list = await getSubmissions();
      setSubmissions(list);
      if (list.length > 0) {
        selectSubmission(list[0]);
      }
      setLoading(false);
    }
    load();
  }, []);

  const selectSubmission = (sub: ProjectSubmission) => {
    setSelectedSub(sub);
    if (sub.review) {
      const scores: Record<string, number> = {};
      sub.review.rubric_scores.forEach(r => {
        scores[r.criterion] = r.score;
      });
      setRubricScores(scores);
      setWrittenFeedback(sub.review.written_feedback);
      setStatusAction(sub.review.status);
    } else {
      const initial: Record<string, number> = {};
      DEFAULT_RUBRIC_CRITERIA.forEach(c => {
        initial[c.criterion] = c.defaultScore;
      });
      setRubricScores(initial);
      setWrittenFeedback('Great work applying your electronics and programming concepts! Clear demonstration of autonomous behavior.');
      setStatusAction('approved');
    }
  };

  const totalScore = Object.values(rubricScores).reduce((sum, v) => sum + v, 0);

  const handleScoreChange = (criterion: string, val: number) => {
    setRubricScores(prev => ({
      ...prev,
      [criterion]: Math.max(0, Math.min(5, val))
    }));
  };

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub || !user?.id) return;
    setIsSubmitting(true);

    try {
      const formattedScores: RubricScore[] = DEFAULT_RUBRIC_CRITERIA.map(c => ({
        criterion: c.criterion,
        max_points: c.max_points,
        score: rubricScores[c.criterion] ?? c.defaultScore
      }));

      const review = await reviewSubmission({
        submissionId: selectedSub.id,
        overallScore: totalScore,
        rubricScores: formattedScores,
        writtenFeedback,
        status: statusAction
      }, user.id);

      // Update local sub
      setSelectedSub(prev => prev ? { ...prev, status: statusAction, review } : null);
      setSubmissions(prev => prev.map(s => s.id === selectedSub.id ? { ...s, status: statusAction, review } : s));
      setSuccessMessage(`Review saved successfully! Student notified (${statusAction === 'approved' ? 'Approved & Badge Awarded' : 'Revisions Requested'}).`);
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RoleGuard allowedRoles={['teacher', 'admin']}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">Mentor Review & Rubric Evaluation Studio</h1>
          <p className="text-slate-600 text-sm mt-1">
            Grade student submissions against the KITE 6-Point STEM competency rubric.
          </p>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2 shadow-2xs">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Submissions Queue (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Review Queue ({submissions.length})
            </h2>

            {submissions.map(sub => {
              const isSelected = selectedSub?.id === sub.id;
              return (
                <div
                  key={sub.id}
                  onClick={() => selectSubmission(sub)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-50/60 border-blue-500 shadow-xs ring-1 ring-blue-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                      sub.status === 'approved'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : sub.status === 'changes_requested'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      {sub.status.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {formatDate(sub.submitted_at)}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900">{sub.title}</h3>
                  <p className="text-xs text-slate-600 mt-0.5">By {sub.student_name}</p>
                  <span className="text-[11px] text-blue-600 font-medium mt-1 block truncate">
                    {sub.project_title}
                  </span>

                  {sub.review && (
                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>Evaluated Score:</span>
                      <span className="font-bold text-emerald-600">{sub.review.overall_score}/30</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Evaluation Workspace & Rubric Form (8 cols) */}
          <div className="lg:col-span-8">
            {selectedSub ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{selectedSub.title}</h2>
                    <p className="text-xs text-slate-500">
                      Student: <strong className="text-slate-900">{selectedSub.student_name}</strong> • Project: <span className="text-blue-600 font-medium">{selectedSub.project_title}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-emerald-600 font-mono">
                      {totalScore} <span className="text-sm text-slate-400">/ 30</span>
                    </div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Total Rubric Points</span>
                  </div>
                </div>

                {/* Student Submitted Explanations */}
                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                  <div>
                    <strong className="text-blue-700 block mb-0.5">Project Working Explanation:</strong>
                    <p className="text-slate-700 leading-relaxed">{selectedSub.explanation}</p>
                  </div>
                  <div>
                    <strong className="text-blue-700 block mb-0.5">Student Key Learnings:</strong>
                    <p className="text-slate-700 leading-relaxed">{selectedSub.learnings}</p>
                  </div>
                  <div>
                    <strong className="text-blue-700 block mb-0.5">Challenges Solved:</strong>
                    <p className="text-slate-700 leading-relaxed">{selectedSub.challenges_faced}</p>
                  </div>

                  {selectedSub.video_url && (
                    <div className="pt-2 border-t border-slate-200">
                      <a
                        href={selectedSub.video_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-blue-600 hover:underline font-semibold"
                      >
                        <Video className="h-4 w-4" /> Open Student Demonstration Video <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Rubric Evaluation Matrix Form */}
                <form onSubmit={handleSaveReview} className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Sliders className="h-4 w-4 text-blue-600" />
                      6-Point KITE Rubric Scoring
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {DEFAULT_RUBRIC_CRITERIA.map(c => {
                        const currentVal = rubricScores[c.criterion] ?? c.defaultScore;
                        return (
                          <div
                            key={c.criterion}
                            className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-semibold text-slate-800">
                                {c.criterion}
                              </span>
                              <span className="font-mono font-bold text-emerald-700 text-xs bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
                                {currentVal} / {c.max_points}
                              </span>
                            </div>

                            <input
                              type="range"
                              min="0"
                              max="5"
                              value={currentVal}
                              onChange={(e) => handleScoreChange(c.criterion, Number(e.target.value))}
                              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Written Feedback */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mentor Constructive Feedback *
                    </label>
                    <textarea
                      value={writtenFeedback}
                      onChange={(e) => setWrittenFeedback(e.target.value)}
                      required
                      rows={3}
                      placeholder="Highlight what the student executed well and actionable engineering improvements..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs leading-relaxed focus:bg-white focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  {/* Status Decision & Submission */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                        <input
                          type="radio"
                          name="statusAction"
                          checked={statusAction === 'approved'}
                          onChange={() => setStatusAction('approved')}
                          className="text-emerald-600 focus:ring-emerald-500"
                        />
                        <span>Approve & Complete Build</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                        <input
                          type="radio"
                          name="statusAction"
                          checked={statusAction === 'changes_requested'}
                          onChange={() => setStatusAction('changes_requested')}
                          className="text-rose-600 focus:ring-rose-500"
                        />
                        <span>Request Revisions</span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 transition-colors"
                    >
                      <Send className="h-4 w-4" />
                      <span>{isSubmitting ? 'Saving Review...' : 'Publish Mentor Review'}</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400">Select a submission from the left queue.</div>
            )}
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
