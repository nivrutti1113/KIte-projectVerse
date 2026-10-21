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
  const { user, role, switchRole } = useAuth();

  useEffect(() => {
    getProjects().then(projects => {
      setFeaturedProjects(projects.slice(0, 3));
    });
  }, []);

  const categories = [
    { name: 'Robotics', icon: <Bot className="h-6 w-6 text-cyan-400" />, count: '24 Projects', desc: 'Rovers, robotic arms, obstacle avoiders' },
    { name: 'Electronics', icon: <Zap className="h-6 w-6 text-amber-400" />, count: '30 Projects', desc: 'Breadboard circuits, relays, power regulation' },
    { name: 'Arduino & Microcontrollers', icon: <Cpu className="h-6 w-6 text-emerald-400" />, count: '35 Projects', desc: 'Sensors, PWM control, embedded C++' },
    { name: 'Coding & Python', icon: <Code2 className="h-6 w-6 text-indigo-400" />, count: '28 Projects', desc: 'Data analytics, automation, computational logic' },
    { name: 'Artificial Intelligence', icon: <Sparkles className="h-6 w-6 text-violet-400" />, count: '18 Projects', desc: 'Computer vision, gesture tracking, neural models' },
    { name: 'Internet of Things', icon: <Globe2 className="h-6 w-6 text-sky-400" />, count: '22 Projects', desc: 'ESP32 Wi-Fi, MQTT clouds, smart home sensors' }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.25),rgba(255,255,255,0))]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-700/60 text-xs font-semibold text-indigo-300 mb-6 shadow-inner">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>KITE Robotics Practical STEM Innovation Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight max-w-4xl mx-auto leading-tight">
            Learn on KITE LMS.{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent">
              Build on ProjectVerse.
            </span>{' '}
            Showcase Your Skills.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            The hands-on engineering platform for Classes 3–12 across India. Build real autonomous rovers, smart IoT switches, solar trackers, and AI vision systems with step-by-step guidance, browser code editing, and verified mentor reviews.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/projects"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
            >
              <span>Explore STEM Projects</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/workspace/proj-001"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-sm border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <Play className="h-4 w-4 text-emerald-400" />
              <span>Launch Obstacle Rover Workspace</span>
            </Link>
          </div>

          {/* Role Persona Quick Switcher Pills */}
          <div className="mt-12 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 max-w-3xl mx-auto text-xs text-left">
            <div className="flex items-center justify-between mb-3 text-slate-400 font-medium">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Users className="h-4 w-4 text-cyan-400" /> Choose Persona to Test Experience:
              </span>
              <span className="text-[11px] text-indigo-400">Current Role: {role.toUpperCase()}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => switchRole('student')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  role === 'student'
                    ? 'bg-indigo-600/30 border-cyan-400 text-white'
                    : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="font-bold">🎓 Student Maker</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Aarav Sharma (Class 8)</div>
              </button>
              <button
                onClick={() => switchRole('teacher')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  role === 'teacher'
                    ? 'bg-indigo-600/30 border-cyan-400 text-white'
                    : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="font-bold">👩‍🏫 Teacher / Mentor</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Priya Raman (Reviews & Rubrics)</div>
              </button>
              <button
                onClick={() => switchRole('school_admin')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  role === 'school_admin'
                    ? 'bg-indigo-600/30 border-cyan-400 text-white'
                    : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="font-bold">🏫 School Admin</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Vikram Seth (Classes & Rosters)</div>
              </button>
              <button
                onClick={() => switchRole('admin')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  role === 'admin'
                    ? 'bg-indigo-600/30 border-cyan-400 text-white'
                    : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="font-bold">⚡ KITE Admin</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Catalog & Platform Control</div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works: The 4-Step Maker Journey */}
      <section className="py-16 bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              From Theory to Tangible Engineering
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              ProjectVerse bridges classroom physics and coding concepts with structured hands-on experimentation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 relative">
              <span className="text-3xl font-black text-indigo-500/30 absolute top-4 right-4">01</span>
              <div className="h-10 w-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-white text-base mb-1">Pick a Real Project</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Filter by grade, category, budget, and difficulty. Review required components, circuit schematics, and safety rules.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 relative">
              <span className="text-3xl font-black text-cyan-500/30 absolute top-4 right-4">02</span>
              <div className="h-10 w-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
                <Lightbulb className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-white text-base mb-1">Interactive Workspace</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Check off parts, follow step-by-step assembly guides, and track your progress in real time with auto-saving notes.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 relative">
              <span className="text-3xl font-black text-emerald-500/30 absolute top-4 right-4">03</span>
              <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                <Terminal className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-white text-base mb-1">Code & AI Mentor</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Write Python or Arduino sketches directly in your browser. Consult the AI Mentor for circuit debugging and syntax hints.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 relative">
              <span className="text-3xl font-black text-amber-500/30 absolute top-4 right-4">04</span>
              <div className="h-10 w-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                <Award className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-white text-base mb-1">Review & Portfolio</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Submit project photos and demo videos. Receive mentor rubric feedback and earn verified digital badges for your portfolio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-16 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
                <Sparkles className="h-3.5 w-3.5" /> Featured Maker Projects
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Start Building Today
              </h2>
            </div>
            <Link
              href="/projects"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group"
            >
              <span>View All 100+ Projects</span>
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
      <section className="py-16 bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Comprehensive STEM Disciplines
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Covering the National Education Policy (NEP 2020) and Atal Tinkering Lab (ATL) mandates for practical STEM skills.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat, i) => (
              <Link
                key={i}
                href={`/projects?category=${encodeURIComponent(cat.name)}`}
                className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 hover:bg-slate-950 transition-all group flex items-start gap-4"
              >
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 group-hover:scale-105 transition-transform">
                  {cat.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm text-white group-hover:text-cyan-400 transition-colors">
                      {cat.name}
                    </h3>
                    <span className="text-[10px] text-slate-500 font-mono">{cat.count}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Institutional School Callout */}
      <section className="py-16 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900/90 border border-indigo-900/60 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 mb-3">
                <SchoolIcon className="h-4 w-4" /> For CBSE, ICSE & ATL Partner Schools
              </span>
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Equip Your School STEM & Robotics Lab
              </h2>
              <p className="mt-4 text-sm text-slate-300 leading-relaxed">
                Connect your teachers and classrooms. Assign capstone projects, track student completion rates, conduct structured rubric reviews, and generate automated school STEM compliance reports.
              </p>

              <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-200">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Multi-tenant class management
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> ATL Tinkering log generation
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Digital Student Maker Portfolios
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <Link
                  href="/teacher/dashboard"
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all"
                >
                  Explore Teacher Portal
                </Link>
                <Link
                  href="/school/dashboard"
                  className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm border border-slate-700 transition-all"
                >
                  School Admin Overview
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
