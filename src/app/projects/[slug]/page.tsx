import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProjectBySlug, getProjects } from '@/lib/data';
import { 
  Clock, 
  IndianRupee, 
  GraduationCap, 
  ArrowRight, 
  ShieldAlert, 
  CheckCircle2, 
  Wrench, 
  Layers, 
  AlertTriangle, 
  FileCode2, 
  Sparkles,
  Bot
} from 'lucide-react';

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map(p => ({ slug: p.slug }));
}

export default async function ProjectDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Link href="/projects" className="hover:text-white transition-colors">
            Projects
          </Link>
          <span>/</span>
          <span className="text-cyan-400 font-medium">{project.category}</span>
          <span>/</span>
          <span className="text-slate-300 truncate max-w-xs">{project.title}</span>
        </div>

        <Link
          href={`/workspace/${project.id}`}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-500/20 transition-all"
        >
          <span>Launch Student Workspace</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl mb-10">
        <div className="h-72 sm:h-96 w-full relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.cover_image}
            alt={project.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
              {project.category}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-200 border border-slate-700">
              {project.difficulty}
            </span>
            {project.access_tier === 'premium' ? (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-slate-950 flex items-center gap-1">
                <Sparkles className="h-3 w-3 fill-slate-950" /> Pro Project
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-slate-950">
                Free Tier
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight mb-3">
            {project.title}
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
            {project.summary}
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <GraduationCap className="h-4 w-4 text-indigo-400" />
              <span>Target: Class {project.grade_min}–{project.grade_max}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="h-4 w-4 text-cyan-400" />
              <span>Est. Build Time: {project.estimated_hours} Hours</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <IndianRupee className="h-4 w-4 text-emerald-400" />
              <span>Est. Cost: {project.estimated_cost_inr ? `₹${project.estimated_cost_inr}` : '₹0'}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <FileCode2 className="h-4 w-4 text-amber-400" />
              <span className="capitalize">{project.starter_language} Language</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Content) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Detailed Description */}
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Layers className="h-5 w-5 text-indigo-400" /> Project Description & Physics
            </h2>
            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line space-y-2">
              {project.description}
            </div>
          </section>

          {/* Learning Objectives */}
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" /> Learning Objectives (NEP Aligned)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              {project.learning_objectives.map((obj, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-300">
                  <span className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Step-by-Step Build Overview */}
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Bot className="h-5 w-5 text-cyan-400" /> Step-by-Step Build Roadmap
              </h2>
              <span className="text-xs text-slate-400">
                {project.steps?.length || 0} Steps Total
              </span>
            </div>

            <div className="space-y-4">
              {project.steps?.map((step) => (
                <div key={step.id} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-900 text-indigo-300 text-xs font-bold">
                      Step {step.step_number}
                    </span>
                    <h3 className="font-semibold text-white text-xs sm:text-sm">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-2">
                    {step.content}
                  </p>
                  {step.tips && (
                    <div className="bg-amber-950/40 border border-amber-900/60 rounded-lg p-2.5 text-[11px] text-amber-300 flex items-start gap-2">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span>{step.tips}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Troubleshooting Guide */}
          {project.troubleshooting_guide && project.troubleshooting_guide.length > 0 && (
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-400" /> Troubleshooting & Common Bugs
              </h2>
              <div className="space-y-3">
                {project.troubleshooting_guide.map((item, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
                    <div className="font-semibold text-rose-400 mb-1">
                      Problem: {item.problem}
                    </div>
                    <div className="text-slate-300">
                      Solution: {item.solution}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column (Components, Tools, Safety & CTA) */}
        <div className="space-y-6">
          {/* Action Box */}
          <div className="bg-gradient-to-b from-indigo-950 to-slate-900 border border-indigo-800/80 rounded-2xl p-6 shadow-xl text-center">
            <h3 className="text-base font-bold text-white mb-1">Ready to Build?</h3>
            <p className="text-xs text-slate-300 mb-5">
              Launch your personal student workspace with interactive step trackers, code editor, and AI Mentor.
            </p>
            <Link
              href={`/workspace/${project.id}`}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
            >
              <span>Open Student Studio</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Component Checklist */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Layers className="h-4 w-4 text-cyan-400" /> Required Components
            </h3>
            <ul className="divide-y divide-slate-800 text-xs">
              {project.components?.map(c => (
                <li key={c.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-200">{c.name}</span>
                    {c.description && <p className="text-[10px] text-slate-500">{c.description}</p>}
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 font-mono text-cyan-400 font-bold text-[11px]">
                    x{c.quantity}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools Required */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Wrench className="h-4 w-4 text-amber-400" /> Tools Required
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.tools_required.map((tool, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 text-xs">
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Safety Notes */}
          <div className="bg-rose-950/30 border border-rose-900/60 rounded-2xl p-6 shadow-md">
            <h3 className="text-sm font-bold text-rose-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-rose-400" /> Safety Protocols
            </h3>
            <ul className="space-y-2 text-xs text-rose-200">
              {project.safety_notes.map((note, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Submission Requirements */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Submission Evidence Needed
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              {project.submission_requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
