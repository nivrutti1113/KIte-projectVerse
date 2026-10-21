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
  const categoryStyles: Record<string, { bg: string; text: string; border: string; icon: React.ReactNode }> = {
    'Robotics': {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200/80',
      icon: <Bot className="h-3.5 w-3.5 text-blue-600" />
    },
    'Electronics': {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200/80',
      icon: <Zap className="h-3.5 w-3.5 text-amber-600" />
    },
    'Arduino & Microcontrollers': {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200/80',
      icon: <Cpu className="h-3.5 w-3.5 text-emerald-600" />
    },
    'Coding & Python': {
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      border: 'border-indigo-200/80',
      icon: <Code2 className="h-3.5 w-3.5 text-indigo-600" />
    },
    'Artificial Intelligence': {
      bg: 'bg-violet-50',
      text: 'text-violet-700',
      border: 'border-violet-200/80',
      icon: <Sparkles className="h-3.5 w-3.5 text-violet-600" />
    },
    'Internet of Things': {
      bg: 'bg-sky-50',
      text: 'text-sky-700',
      border: 'border-sky-200/80',
      icon: <Globe2 className="h-3.5 w-3.5 text-sky-600" />
    }
  };

  const style = categoryStyles[project.category] || {
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200',
    icon: <Cpu className="h-3.5 w-3.5 text-slate-600" />
  };

  const difficultyBadge: Record<string, string> = {
    'Beginner': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Intermediate': 'bg-amber-50 text-amber-700 border-amber-200',
    'Advanced': 'bg-rose-50 text-rose-700 border-rose-200'
  };

  return (
    <div className="group flex flex-col bg-white border border-slate-200/90 hover:border-slate-300 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200">
      {/* Cover Image Container */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.cover_image}
          alt={project.title}
          className="h-full w-full object-cover group-hover:scale-102 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${style.bg} ${style.text} border ${style.border} backdrop-blur-md shadow-xs`}>
            {style.icon}
            {project.category}
          </span>
        </div>

        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${difficultyBadge[project.difficulty] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
            {project.difficulty}
          </span>
          {project.access_tier === 'premium' ? (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-white flex items-center gap-0.5 shadow-xs">
              <Sparkles className="h-3 w-3 fill-white" /> Pro
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-600 text-white">
              Free
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2 leading-snug">
          {project.title}
        </h3>
        <p className="text-slate-600 text-xs leading-relaxed line-clamp-2 mb-4">
          {project.summary}
        </p>

        {/* Crisp Specs Bar */}
        <div className="grid grid-cols-3 gap-2 py-2 px-3 mb-4 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600">
          <div className="flex items-center gap-1.5 truncate">
            <GraduationCap className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" />
            <span>Class {project.grade_min}-{project.grade_max}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <Clock className="h-3.5 w-3.5 text-slate-500 flex-shrink-0" />
            <span>{project.estimated_hours} hrs</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <IndianRupee className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
            <span>{project.estimated_cost_inr ? `₹${project.estimated_cost_inr}` : 'Free'}</span>
          </div>
        </div>

        {/* Learning Objectives Preview */}
        {project.learning_objectives && project.learning_objectives.length > 0 && (
          <div className="text-[11px] text-slate-500 mb-4 flex-1">
            <span className="font-semibold text-slate-700">Key takeaway: </span>
            <span className="line-clamp-1">{project.learning_objectives[0]}</span>
          </div>
        )}

        {/* Action Row */}
        <div className="pt-3 mt-auto border-t border-slate-100 flex items-center justify-between">
          <Link
            href={`/projects/${project.slug}`}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Read Overview
          </Link>
          <Link
            href={`/workspace/${project.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors"
          >
            <span>Start Building</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
