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
  Bot,
  Zap
} from 'lucide-react';
import CircuitDiagram from '@/components/CircuitDiagram';

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
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Link href="/projects" className="hover:text-slate-900 transition-colors">
            Projects
          </Link>
          <span>/</span>
          <span className="text-blue-600 font-semibold">{project.category}</span>
          <span>/</span>
          <span className="text-slate-700 truncate max-w-xs">{project.title}</span>
        </div>

        <Link
          href={`/workspace/${project.id}`}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors"
        >
          <span>Launch Student Workspace</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Hero Banner Card */}
      <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs mb-10">
        <div className="h-72 sm:h-96 w-full relative bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.cover_image}
            alt={project.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-xs">
                {project.category}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 backdrop-blur text-slate-900">
                {project.difficulty}
              </span>
              {project.access_tier === 'premium' ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white flex items-center gap-1 shadow-xs">
                  <Sparkles className="h-3 w-3 fill-white" /> Pro Project
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white">
                  Free Access
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight mb-2">
              {project.title}
            </h1>

            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {project.summary}
            </p>
          </div>
        </div>

        {/* Quick Specs Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-slate-50 border-t border-slate-200 text-xs">
          <div className="flex items-center gap-2.5 text-slate-700">
            <GraduationCap className="h-4 w-4 text-blue-600 flex-shrink-0" />
            <span>Target: Class {project.grade_min}–{project.grade_max}</span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-700">
            <Clock className="h-4 w-4 text-slate-500 flex-shrink-0" />
            <span>Est. Build Time: {project.estimated_hours} Hours</span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-700">
            <IndianRupee className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            <span>Est. Cost: {project.estimated_cost_inr ? `₹${project.estimated_cost_inr}` : '₹0'}</span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-700">
            <FileCode2 className="h-4 w-4 text-indigo-600 flex-shrink-0" />
            <span className="capitalize">{project.starter_language} Language</span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Content) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Detailed Description */}
          <section className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Layers className="h-5 w-5 text-blue-600" /> Project Description & Physics
            </h2>
            <div className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line space-y-2">
              {project.description}
            </div>
          </section>

          {/* Learning Objectives */}
          <section className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" /> Learning Objectives (NEP 2020 Aligned)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              {project.learning_objectives.map((obj, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                  <span className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Step-by-Step Build Overview */}
          <section className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Bot className="h-5 w-5 text-blue-600" /> Step-by-Step Build Roadmap
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                {project.steps?.length || 0} Steps Total
              </span>
            </div>

            <div className="space-y-4">
              {project.steps?.map((step) => (
                <div key={step.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-xs font-bold">
                      Step {step.step_number}
                    </span>
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-2">
                    {step.content}
                  </p>
                  {step.tips && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-[11px] text-amber-900 flex items-start gap-2">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <span>{step.tips}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Visual Circuit Schematic & Wiring Guide */}
          {project.wiring_connections && project.wiring_connections.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-500" /> Complete Hardware Circuit Schematic
                </h2>
                <span className="text-xs text-blue-600 font-semibold">
                  {project.wiring_connections.length} Pinout Connections
                </span>
              </div>
              <CircuitDiagram
                projectTitle={project.title}
                schematicType={project.circuit_schematic_type}
                connections={project.wiring_connections}
              />
            </section>
          )}

          {/* Troubleshooting Guide */}
          {project.troubleshooting_guide && project.troubleshooting_guide.length > 0 && (
            <section className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" /> Troubleshooting & Common Bugs
              </h2>
              <div className="space-y-3">
                {project.troubleshooting_guide.map((item, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="font-semibold text-rose-700 mb-1">
                      Problem: {item.problem}
                    </div>
                    <div className="text-slate-700">
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
          <div className="bg-blue-600 text-white rounded-2xl p-6 shadow-xs text-center">
            <h3 className="text-base font-bold mb-1">Ready to Build?</h3>
            <p className="text-xs text-blue-100 mb-5 leading-relaxed">
              Launch your personal student workspace with interactive step trackers, code editor, and AI Mentor.
            </p>
            <Link
              href={`/workspace/${project.id}`}
              className="w-full py-3 rounded-xl bg-white hover:bg-slate-50 text-blue-700 font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>Open Student Studio</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Component Checklist */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Layers className="h-4 w-4 text-blue-600" /> Required Components
            </h3>
            <ul className="divide-y divide-slate-100 text-xs">
              {project.components?.map(c => (
                <li key={c.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-medium text-slate-900">{c.name}</span>
                    {c.description && <p className="text-[10px] text-slate-500">{c.description}</p>}
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 font-mono text-slate-700 font-bold text-[11px]">
                    x{c.quantity}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools Required */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Wrench className="h-4 w-4 text-amber-600" /> Tools Required
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.tools_required.map((tool, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs">
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Safety Notes */}
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 shadow-xs">
            <h3 className="text-xs font-bold text-rose-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-rose-600" /> Safety Protocols
            </h3>
            <ul className="space-y-2 text-xs text-rose-800">
              {project.safety_notes.map((note, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Submission Requirements */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Submission Evidence Needed
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              {project.submission_requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
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
