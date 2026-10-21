'use client';

import React, { useState, useEffect } from 'react';
import RoleGuard from '@/components/RoleGuard';
import { useAuth } from '@/lib/auth-context';
import { getSubmissions, reviewSubmission } from '@/lib/data';
import { ProjectSubmission, RubricScore } from '@/types';
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
          <h1 className="text-3xl font-extrabold text-white">Mentor Review & Rubric Evaluation Studio</h1>
          <p className="text-slate-400 text-sm mt-1">
            Grade student submissions against the KITE 6-Point STEM competency rubric.
          </p>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-950/70 border border-emerald-800 text-emerald-200 text-xs sm:text-sm flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Submissions Queue (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
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
                      ? 'bg-slate-900 border-cyan-500 shadow-xl'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      sub.status === 'approved'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : sub.status === 'changes_requested'
                        ? 'bg-rose-950 text-rose-400 border border-rose-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {sub.status.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {new Date(sub.submitted_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-white">{sub.title}</h3>
                  <p className="text-xs text-slate-300 mt-0.5">By {sub.student_name}</p>
                  <span className="text-[11px] text-cyan-400 mt-1 block truncate">
                    {sub.project_title}
                  </span>

                  {sub.review && (
                    <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                      <span>Evaluated Score:</span>
                      <span className="font-bold text-emerald-400">{sub.review.overall_score}/30</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Evaluation Workspace & Rubric Form (8 cols) */}
          <div className="lg:col-span-8">
            {selectedSub ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedSub.title}</h2>
                    <p className="text-xs text-slate-400">
                      Student: <strong className="text-white">{selectedSub.student_name}</strong> • Project: <span className="text-cyan-400">{selectedSub.project_title}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-emerald-400 font-mono">
                      {totalScore} <span className="text-sm text-slate-500">/ 30</span>
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Rubric Points</span>
                  </div>
                </div>

                {/* Student Submitted Explanations */}
                <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
                  <div>
                    <strong className="text-cyan-400 block mb-0.5">Project Working Explanation:</strong>
                    <p className="text-slate-300 leading-relaxed">{selectedSub.explanation}</p>
                  </div>
                  <div>
                    <strong className="text-cyan-400 block mb-0.5">Student Key Learnings:</strong>
                    <p className="text-slate-300 leading-relaxed">{selectedSub.learnings}</p>
                  </div>
                  <div>
                    <strong className="text-cyan-400 block mb-0.5">Challenges Solved:</strong>
                    <p className="text-slate-300 leading-relaxed">{selectedSub.challenges_faced}</p>
                  </div>

                  {selectedSub.video_url && (
                    <div className="pt-2 border-t border-slate-800">
                      <a
                        href={selectedSub.video_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-indigo-400 hover:underline font-semibold"
                      >
                        <Video className="h-4 w-4" /> Open Student Demonstration Video <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Rubric Evaluation Matrix Form */}
                <form onSubmit={handleSaveReview} className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Sliders className="h-4 w-4 text-cyan-400" />
                      6-Point KITE Rubric Scoring
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {DEFAULT_RUBRIC_CRITERIA.map(c => {
                        const currentVal = rubricScores[c.criterion] ?? c.defaultScore;
                        return (
                          <div
                            key={c.criterion}
                            className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-semibold text-slate-300">
                                {c.criterion}
                              </span>
                              <span className="font-mono font-bold text-emerald-400 text-xs bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                                {currentVal} / {c.max_points}
                              </span>
                            </div>

                            <input
                              type="range"
                              min="0"
                              max="5"
                              value={currentVal}
                              onChange={(e) => handleScoreChange(c.criterion, Number(e.target.value))}
                              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Written Feedback */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Mentor Constructive Feedback *
                    </label>
                    <textarea
                      value={writtenFeedback}
                      onChange={(e) => setWrittenFeedback(e.target.value)}
                      required
                      rows={3}
                      placeholder="Highlight what the student executed well and actionable engineering improvements..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs leading-relaxed"
                    />
                  </div>

                  {/* Status Decision & Submission */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-200">
                        <input
                          type="radio"
                          name="statusAction"
                          checked={statusAction === 'approved'}
                          onChange={() => setStatusAction('approved')}
                          className="text-emerald-500"
                        />
                        <span>Approve & Complete Build</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-200">
                        <input
                          type="radio"
                          name="statusAction"
                          checked={statusAction === 'changes_requested'}
                          onChange={() => setStatusAction('changes_requested')}
                          className="text-rose-500"
                        />
                        <span>Request Revisions</span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50"
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
