'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { 
  getProjectById, 
  getStudentProject, 
  saveStudentWorkspace, 
  createSubmission 
} from '@/lib/data';
import { Project, StudentProject } from '@/types';
import CodeEditor from '@/components/CodeEditor';
import AIMentorModal from '@/components/AIMentorModal';
import { 
  Bot, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Save, 
  Send, 
  AlertTriangle, 
  BookOpen, 
  FileText, 
  Layers, 
  ArrowLeft,
  Video,
  Clock,
  CheckSquare,
  Square
} from 'lucide-react';

function WorkspaceInner({ id }: { id: string }) {
  const router = useRouter();
  const { user } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [studentProject, setStudentProject] = useState<StudentProject | null>(null);
  const [activeStep, setActiveStep] = useState(1);
  const [activeTab, setActiveTab] = useState<'instructions' | 'components' | 'notes'>('instructions');
  const [checkedComponents, setCheckedComponents] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState('');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Submission Form State
  const [subTitle, setSubTitle] = useState('');
  const [subExplanation, setSubExplanation] = useState('');
  const [subLearnings, setSubLearnings] = useState('');
  const [subChallenges, setSubChallenges] = useState('');
  const [subVideoUrl, setSubVideoUrl] = useState('');
  const [subError, setSubError] = useState<string | null>(null);

  useEffect(() => {
    async function loadWorkspace() {
      setLoading(true);
      const studentId = user?.id || 'usr-student-1';
      const proj = await getProjectById(id);
      if (proj) {
        setProject(proj);
        const sp = await getStudentProject(studentId, proj.id);
        if (sp) {
          setStudentProject(sp);
          setActiveStep(sp.current_step || 1);
          setNotes(sp.student_notes || '');
          setSubTitle(`Completed ${proj.title}`);
        }
      }
      setLoading(false);
    }
    loadWorkspace();
  }, [id, user?.id]);

  const totalSteps = project?.steps?.length || 1;
  const currentStepData = project?.steps?.find(s => s.step_number === activeStep);
  const progressPercent = Math.round((activeStep / totalSteps) * 100);

  const handleStepChange = async (newStep: number) => {
    if (newStep < 1 || newStep > totalSteps || !studentProject || !user?.id) return;
    setActiveStep(newStep);

    try {
      await saveStudentWorkspace({
        studentProjectId: studentProject.id,
        activeCode: studentProject.active_code,
        activeLanguage: studentProject.active_language,
        currentStep: newStep,
        progressPercent: Math.round((newStep / totalSteps) * 100),
        studentNotes: notes
      }, user.id);
      setSaveStatus(`Step ${newStep} reached`);
      setTimeout(() => setSaveStatus(null), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveCode = async (code: string, language: string) => {
    if (!studentProject || !user?.id) return;
    try {
      const updated = await saveStudentWorkspace({
        studentProjectId: studentProject.id,
        activeCode: code,
        activeLanguage: language,
        currentStep: activeStep,
        progressPercent,
        studentNotes: notes
      }, user.id);
      setStudentProject(updated);
      setSaveStatus('Code and progress autosaved');
      setTimeout(() => setSaveStatus(null), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleComponent = (compId: string) => {
    setCheckedComponents(prev => ({
      ...prev,
      [compId]: !prev[compId]
    }));
  };

  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentProject || !user?.id) return;
    setSubError(null);
    setIsSubmitting(true);

    try {
      await createSubmission({
        studentProjectId: studentProject.id,
        title: subTitle,
        explanation: subExplanation,
        learnings: subLearnings,
        challengesFaced: subChallenges,
        videoUrl: subVideoUrl,
        codeSnapshot: studentProject.active_code
      }, user.id);

      setIsSubmitModalOpen(false);
      router.push('/submissions');
    } catch (err: unknown) {
      setSubError(err instanceof Error ? err.message : 'Failed to submit project');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-slate-500">
        <div className="h-8 w-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm font-medium">Loading Student Workspace Studio...</p>
      </div>
    );
  }

  if (!project || !studentProject) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 text-center bg-white border border-slate-200 rounded-2xl shadow-sm">
        <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Project Not Found</h2>
        <p className="text-xs text-slate-500 mb-6">Could not initialize workspace for project ID &quot;{id}&quot;.</p>
        <Link href="/projects" className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors">
          Return to Project Library
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-slate-50">
      {/* Workspace Top Action Bar */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-16 z-30 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            href={`/projects/${project.slug}`}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            title="Back to project description"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-slate-900 text-sm sm:text-base truncate max-w-xs sm:max-w-md">
                {project.title}
              </h1>
              <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                {studentProject.status.replace('_', ' ')}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Class {project.grade_min}–{project.grade_max}</span>
              <span>•</span>
              <span>{project.category}</span>
              {saveStatus && (
                <>
                  <span>•</span>
                  <span className="text-emerald-600 font-medium">{saveStatus}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar & Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end text-xs mr-2">
            <span className="font-semibold text-slate-800">Step {activeStep} of {totalSteps}</span>
            <span className="text-[11px] font-semibold text-blue-600">{progressPercent}% Completed</span>
          </div>

          {/* AI Mentor Trigger Button */}
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition-all"
          >
            <Bot className="h-4 w-4 text-blue-600" />
            <span>AI Mentor</span>
          </button>

          {/* Submit Project Trigger */}
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-all"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Submit for Review</span>
          </button>
        </div>
      </div>

      {/* Main Studio Work Area: Split Left (Guide & Checklist) & Right (Code & Console) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
        {/* Left Side: Step Guide & Notes (5 cols) */}
        <div className="lg:col-span-5 border-r border-slate-200 flex flex-col bg-white overflow-y-auto max-h-[calc(100vh-8.5rem)]">
          {/* Subtabs */}
          <div className="flex items-center border-b border-slate-200 bg-slate-50 px-4 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('instructions')}
              className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'instructions'
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              Build Step {activeStep}
            </button>
            <button
              onClick={() => setActiveTab('components')}
              className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'components'
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              Components ({Object.values(checkedComponents).filter(Boolean).length}/{project.components?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'notes'
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              Student Notes
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-5 flex-1">
            {activeTab === 'instructions' && currentStepData && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs border border-blue-200">
                    Step {currentStepData.step_number} of {totalSteps}
                  </span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleStepChange(activeStep - 1)}
                      disabled={activeStep <= 1}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleStepChange(activeStep + 1)}
                      disabled={activeStep >= totalSteps}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 transition-colors"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <h2 className="text-base font-bold text-slate-900 leading-snug">
                  {currentStepData.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {currentStepData.content}
                </p>

                {currentStepData.tips && (
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                    <div className="font-semibold flex items-center gap-1.5 text-amber-800">
                      <Sparkles className="h-3.5 w-3.5 text-amber-600" /> Pro Engineer Tip
                    </div>
                    <p className="text-amber-700 leading-relaxed">{currentStepData.tips}</p>
                  </div>
                )}

                {currentStepData.code_snippet && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-slate-700">Step Code Snippet:</span>
                    <pre className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto shadow-inner">
                      {currentStepData.code_snippet}
                    </pre>
                  </div>
                )}

                {/* Step navigation bottom buttons */}
                <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
                  <button
                    onClick={() => handleStepChange(activeStep - 1)}
                    disabled={activeStep <= 1}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs disabled:opacity-40 flex items-center gap-1 transition-colors"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" /> Previous Step
                  </button>

                  {activeStep < totalSteps ? (
                    <button
                      onClick={() => handleStepChange(activeStep + 1)}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1 shadow-xs transition-colors"
                    >
                      Next Step <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsSubmitModalOpen(true)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1 shadow-xs transition-colors"
                    >
                      Complete & Submit <CheckCircle2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'components' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-200">
                  <span>Check off each part as you wire:</span>
                  <span className="text-blue-600 font-semibold font-mono">
                    {Object.values(checkedComponents).filter(Boolean).length}/{project.components?.length || 0} Ready
                  </span>
                </div>

                <div className="space-y-2">
                  {project.components?.map(c => {
                    const isChecked = Boolean(checkedComponents[c.id]);
                    return (
                      <div
                        key={c.id}
                        onClick={() => toggleComponent(c.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                          isChecked
                            ? 'bg-emerald-50/70 border-emerald-300 text-slate-900 shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 shadow-2xs'
                        }`}
                      >
                        <button className="mt-0.5 text-blue-600">
                          {isChecked ? <CheckSquare className="h-4 w-4 text-emerald-600" /> : <Square className="h-4 w-4 text-slate-400" />}
                        </button>
                        <div className="flex-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span className={`font-semibold ${isChecked ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                              {c.name}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-mono text-slate-700 font-semibold">
                              x{c.quantity}
                            </span>
                          </div>
                          {c.description && <p className="text-[11px] text-slate-500 mt-0.5">{c.description}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-3 flex flex-col h-full">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Personal Project Lab Notes:</span>
                  <button
                    onClick={() => handleSaveCode(studentProject.active_code, studentProject.active_language)}
                    className="text-blue-600 font-medium hover:underline flex items-center gap-1"
                  >
                    <Save className="h-3.5 w-3.5" /> Save Notes
                  </button>
                </div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record your observations, sensor calibration readings, speed adjustments, and wiring notes here..."
                  className="w-full flex-1 min-h-[300px] p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent leading-relaxed"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Code Editor & Sandboxed Diagnostics (7 cols) */}
        <div className="lg:col-span-7 flex flex-col p-4 bg-slate-100/70 overflow-y-auto">
          <CodeEditor
            initialCode={studentProject.active_code}
            language={studentProject.active_language}
            starterCode={project.starter_code}
            onSave={handleSaveCode}
          />
        </div>
      </div>

      {/* AI Mentor Dialog */}
      <AIMentorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        projectTitle={project.title}
        currentStep={activeStep}
        currentCode={studentProject.active_code}
        language={studentProject.active_language}
      />

      {/* Submission Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Send className="h-4 w-4" />
                </div>
                <h3 className="font-bold text-base text-slate-900">Submit Project for Review</h3>
              </div>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitProject} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Submission Title
                </label>
                <input
                  type="text"
                  value={subTitle}
                  onChange={(e) => setSubTitle(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  How does your project work? (Project Explanation) *
                </label>
                <textarea
                  value={subExplanation}
                  onChange={(e) => setSubExplanation(e.target.value)}
                  required
                  rows={3}
                  placeholder="Explain your wiring, sensors, and how code commands movement..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Key Learnings *
                </label>
                <textarea
                  value={subLearnings}
                  onChange={(e) => setSubLearnings(e.target.value)}
                  required
                  rows={2}
                  placeholder="What STEM, electronics, or coding concepts did you master?"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Challenges Faced & How You Solved Them *
                </label>
                <textarea
                  value={subChallenges}
                  onChange={(e) => setSubChallenges(e.target.value)}
                  required
                  rows={2}
                  placeholder="Did you encounter motor jitter, inverted directions, or power bugs?"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Video className="h-3.5 w-3.5 text-blue-600" /> Demonstration Video / Drive Link (Optional)
                </label>
                <input
                  type="url"
                  value={subVideoUrl}
                  onChange={(e) => setSubVideoUrl(e.target.value)}
                  placeholder="https://youtu.be/... or Google Drive video link"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {subError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                  {subError}
                </div>
              )}

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {isSubmitting ? 'Submitting...' : 'Submit to Mentor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function PageContent({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string>('');

  useEffect(() => {
    params.then(p => setId(p.id));
  }, [params]);

  if (!id) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-slate-400 text-sm">
        Loading workspace...
      </div>
    );
  }

  return <WorkspaceInner id={id} />;
}

export default function WorkspacePage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<div className="p-10 text-center text-slate-400">Loading workspace...</div>}>
      <PageContent params={params} />
    </Suspense>
  );
}
