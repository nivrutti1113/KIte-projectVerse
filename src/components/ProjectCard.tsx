'use client';

import React from 'react';
import Link from 'next/link';
import { Project } from '@/types';
import { 
  Clock, 
  IndianRupee, 
  GraduationCap, 
  ArrowRight, 
  Sparkles, 
  Bot, 
  Cpu, 
  Zap, 
  Code2, 
  Globe2 
} from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const categoryIcons: Record<string, React.ReactNode> = {
    'Robotics': <Bot className="h-3.5 w-3.5 text-cyan-400" />,
    'Electronics': <Zap className="h-3.5 w-3.5 text-amber-400" />,
    'Arduino & Microcontrollers': <Cpu className="h-3.5 w-3.5 text-emerald-400" />,
    'Coding & Python': <Code2 className="h-3.5 w-3.5 text-indigo-400" />,
    'Artificial Intelligence': <Sparkles className="h-3.5 w-3.5 text-violet-400" />,
    'Internet of Things': <Globe2 className="h-3.5 w-3.5 text-sky-400" />
  };

  const difficultyColors: Record<string, string> = {
    'Beginner': 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60',
    'Intermediate': 'bg-amber-950/80 text-amber-300 border-amber-800/60',
    'Advanced': 'bg-rose-950/80 text-rose-300 border-rose-800/60'
  };

  return (
    <div className="group flex flex-col bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300">
      {/* Cover Image Container */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-950">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.cover_image}
          alt={project.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/30" />

        {/* Badges on Image */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-900/90 backdrop-blur-md text-slate-200 border border-slate-700/80">
            {categoryIcons[project.category] || <Cpu className="h-3.5 w-3.5 text-cyan-400" />}
            {project.category}
          </span>
        </div>

        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${difficultyColors[project.difficulty] || 'bg-slate-800 text-slate-300'}`}>
            {project.difficulty}
          </span>
          {project.access_tier === 'premium' ? (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/90 text-slate-950 flex items-center gap-1 shadow-sm">
              <Sparkles className="h-3 w-3 fill-slate-950" /> Pro
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/90 text-slate-950">
              Free
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-bold text-base text-white group-hover:text-cyan-400 transition-colors line-clamp-2 mb-2">
          {project.title}
        </h3>
        <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 mb-4">
          {project.summary}
        </p>

        {/* Quick Meta Stats */}
        <div className="grid grid-cols-3 gap-2 py-2.5 px-3 mb-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-300">
          <div className="flex items-center gap-1.5">
            <GraduationCap className="h-3.5 w-3.5 text-indigo-400" />
            <span>Class {project.grade_min}-{project.grade_max}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-cyan-400" />
            <span>{project.estimated_hours} hrs</span>
          </div>
          <div className="flex items-center gap-1.5">
            <IndianRupee className="h-3.5 w-3.5 text-emerald-400" />
            <span>{project.estimated_cost_inr ? `₹${project.estimated_cost_inr}` : 'Free'}</span>
          </div>
        </div>

        {/* Learning Objectives Preview */}
        {project.learning_objectives && project.learning_objectives.length > 0 && (
          <div className="text-[11px] text-slate-400 mb-4 flex-1">
            <span className="font-semibold text-slate-300">Key takeaway: </span>
            <span className="line-clamp-1">{project.learning_objectives[0]}</span>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 mt-auto border-t border-slate-800/80 flex items-center justify-between">
          <Link
            href={`/projects/${project.slug}`}
            className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Read Overview
          </Link>
          <Link
            href={`/workspace/${project.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 group-hover:scale-102 transition-all"
          >
            <span>Start Building</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
