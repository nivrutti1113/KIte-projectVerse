'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Bot, 
  Cpu, 
  Zap, 
  Code2, 
  Globe2, 
  Sparkles, 
  ArrowRight, 
  Award, 
  CheckCircle2, 
  Play, 
  Users, 
  School as SchoolIcon, 
  ShieldCheck,
  ChevronRight,
  Lightbulb,
  Terminal
} from 'lucide-react';
import { getProjects } from '@/lib/data';
import { Project } from '@/types';
import ProjectCard from '@/components/ProjectCard';
import { useAuth } from '@/lib/auth-context';

export default function HomePage() {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const { role, switchRole } = useAuth();

  useEffect(() => {
    getProjects().then(projects => {
      setFeaturedProjects(projects.slice(0, 3));
    });
  }, []);

  const categories = [
    { name: 'Robotics', icon: <Bot className="h-5 w-5 text-blue-600" />, count: '24 Projects', desc: 'Rovers, robotic arms, obstacle avoiders' },
    { name: 'Electronics', icon: <Zap className="h-5 w-5 text-amber-600" />, count: '30 Projects', desc: 'Breadboard circuits, relays, power regulation' },
    { name: 'Arduino & Microcontrollers', icon: <Cpu className="h-5 w-5 text-emerald-600" />, count: '35 Projects', desc: 'Sensors, PWM control, embedded C++' },
    { name: 'Coding & Python', icon: <Code2 className="h-5 w-5 text-indigo-600" />, count: '28 Projects', desc: 'Data analytics, automation, computational logic' },
    { name: 'Artificial Intelligence', icon: <Sparkles className="h-5 w-5 text-violet-600" />, count: '18 Projects', desc: 'Computer vision, gesture tracking, neural models' },
    { name: 'Internet of Things', icon: <Globe2 className="h-5 w-5 text-sky-600" />, count: '22 Projects', desc: 'ESP32 Wi-Fi, MQTT clouds, smart home sensors' }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      {/* Clean Modern Hero Section */}
      <section className="relative overflow-hidden pt-14 pb-20 lg:pt-24 lg:pb-28 bg-white border-b border-slate-200/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-6">
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            <span>KITE Robotics Hands-On STEM Innovation Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Learn on KITE LMS.{' '}
            <span className="text-blue-600">
              Build on ProjectVerse.
            </span>{' '}
            Showcase Your Skills.
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            The dedicated practical STEM platform for Classes 3–12 across India. Build real autonomous rovers, smart IoT switches, solar trackers, and AI systems with step-by-step guidance, browser code editing, and verified mentor reviews.
          </p>

          {/* Clean Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/projects"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>Explore STEM Projects</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/workspace/proj-001"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-300 shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Play className="h-4 w-4 text-emerald-600" />
              <span>Launch Obstacle Rover Studio</span>
            </Link>
          </div>

          {/* Clean Persona Quick Switcher Pill */}
          <div className="mt-12 p-5 rounded-2xl bg-slate-50 border border-slate-200 max-w-3xl mx-auto text-xs text-left shadow-xs">
            <div className="flex items-center justify-between mb-3 text-slate-600 font-medium">
              <span className="flex items-center gap-1.5 text-slate-900 font-semibold">
                <Users className="h-4 w-4 text-blue-600" /> Experience the platform by persona:
              </span>
              <span className="text-[11px] text-slate-500 font-medium">Current: <strong className="text-blue-600 uppercase">{role}</strong></span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                onClick={() => switchRole('student')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  role === 'student'
                    ? 'bg-white border-blue-600 ring-2 ring-blue-100 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-slate-900">🎓 Student Maker</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Aarav (Class 8)</div>
              </button>
              <button
                onClick={() => switchRole('teacher')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  role === 'teacher'
                    ? 'bg-white border-blue-600 ring-2 ring-blue-100 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-slate-900">👩‍🏫 Teacher / Mentor</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Priya Raman (Rubrics)</div>
              </button>
              <button
                onClick={() => switchRole('school_admin')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  role === 'school_admin'
                    ? 'bg-white border-blue-600 ring-2 ring-blue-100 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-slate-900">🏫 School Admin</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Vikram Seth (Principal)</div>
              </button>
              <button
                onClick={() => switchRole('admin')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  role === 'admin'
                    ? 'bg-white border-blue-600 ring-2 ring-blue-100 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-slate-900">⚡ KITE Admin</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Catalog & Platform HQ</div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works: The 4-Step Maker Journey */}
      <section className="py-16 bg-slate-50 border-b border-slate-200/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              From Classroom Theory to Physical Engineering
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              ProjectVerse bridges textbook physics, electronics, and algorithms with structured hands-on experimentation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs font-bold font-mono text-blue-600 uppercase tracking-wider block mb-3">Step 01</span>
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Pick a Real Project</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Filter by grade band, category, budget, and difficulty. Review required hardware parts and circuit schematics.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs font-bold font-mono text-cyan-600 uppercase tracking-wider block mb-3">Step 02</span>
              <div className="h-10 w-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-4">
                <Lightbulb className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Interactive Studio</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Check off parts, follow step-by-step assembly guides, and track progress with autosaved engineering notes.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs font-bold font-mono text-emerald-600 uppercase tracking-wider block mb-3">Step 03</span>
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Terminal className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Code & AI Mentor</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Edit Python or Arduino sketches directly in your browser. Consult the AI Mentor for circuit debugging and syntax hints.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs font-bold font-mono text-amber-600 uppercase tracking-wider block mb-3">Step 04</span>
              <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <Award className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Review & Portfolio</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Submit project photos and demo videos. Receive mentor rubric feedback and earn verified digital badges for your portfolio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-16 bg-white border-b border-slate-200/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="h-3.5 w-3.5" /> Featured Hands-On Projects
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Curated STEM Project Builds
              </h2>
            </div>
            <Link
              href="/projects"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
            >
              <span>Explore All Projects</span>
              <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* Explore STEM Domains Grid */}
      <section className="py-16 bg-slate-50 border-b border-slate-200/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Core Engineering Disciplines
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Fully aligned with the National Education Policy (NEP 2020) and Atal Tinkering Lab (ATL) guidelines.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat, i) => (
              <Link
                key={i}
                href={`/projects?category=${encodeURIComponent(cat.name)}`}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all group flex items-start gap-4"
              >
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 group-hover:scale-105 transition-transform">
                  {cat.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                      {cat.name}
                    </h3>
                    <span className="text-[11px] text-slate-400 font-mono">{cat.count}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Institutional School Callout */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1.5 mb-3">
              <SchoolIcon className="h-4 w-4" /> For CBSE, ICSE & ATL Partner Schools
            </span>
            <h2 className="text-3xl font-extrabold sm:text-4xl text-slate-900">
              Equip Your School STEM & Robotics Lab
            </h2>
            <p className="mt-4 text-sm text-slate-600 leading-relaxed">
              Connect teachers and classrooms. Assign capstone projects, track student completion rates, conduct structured rubric reviews, and generate automated school STEM compliance reports.
            </p>

            <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-700">
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Multi-tenant class management
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> ATL Tinkering log generation
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Digital Student Maker Portfolios
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/teacher/dashboard"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors"
              >
                Explore Teacher Portal
              </Link>
              <Link
                href="/school/dashboard"
                className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm border border-slate-200 transition-colors"
              >
                School Admin Overview
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
