'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Project, ProjectCategory } from '@/types';
import { getProjects } from '@/lib/data';
import ProjectCard from '@/components/ProjectCard';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Sparkles, 
  X, 
  Bot, 
  Cpu, 
  Zap, 
  Code2, 
  Globe2 
} from 'lucide-react';

function ProjectsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedTier, setSelectedTier] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    setLoading(true);
    getProjects({
      category: selectedCategory,
      difficulty: selectedDifficulty,
      tier: selectedTier,
      search
    }).then(res => {
      let sorted = [...res];
      if (sortBy === 'duration_asc') {
        sorted.sort((a, b) => a.estimated_hours - b.estimated_hours);
      } else if (sortBy === 'duration_desc') {
        sorted.sort((a, b) => b.estimated_hours - a.estimated_hours);
      } else if (sortBy === 'cost_asc') {
        sorted.sort((a, b) => (a.estimated_cost_inr || 0) - (b.estimated_cost_inr || 0));
      }
      setProjects(sorted);
      setLoading(false);
    });
  }, [selectedCategory, selectedDifficulty, selectedTier, search, sortBy]);

  const categories = [
    'All',
    'Robotics',
    'Electronics',
    'Arduino & Microcontrollers',
    'Coding & Python',
    'Artificial Intelligence',
    'Internet of Things',
    'STEM Science'
  ];

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedDifficulty('All');
    setSelectedTier('All');
    setSortBy('default');
  };

  const hasActiveFilters = search || selectedCategory !== 'All' || selectedDifficulty !== 'All' || selectedTier !== 'All';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 text-xs font-semibold mb-2">
          <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
          <span>Curated Hands-On Projects</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          STEM Project Discovery Library
        </h1>
        <p className="text-slate-400 text-sm mt-1 max-w-2xl">
          Search and start verified robotics, embedded electronics, coding, and AI projects aligned with Indian school curricula (Classes 3–12).
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 mb-8 shadow-xl space-y-4">
        {/* Top search input & dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by robot, sensor, code..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
            />
          </div>

          <div>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <option value="All">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div>
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <option value="All">All Access Tiers</option>
              <option value="free">Free Projects</option>
              <option value="premium">Pro Projects</option>
            </select>
          </div>

          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <option value="default">Sort: Default Recommended</option>
              <option value="duration_asc">Duration: Shortest First</option>
              <option value="duration_desc">Duration: Longest First</option>
              <option value="cost_asc">Cost: Low to High</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs text-slate-400 font-medium whitespace-nowrap mr-1">
            Category:
          </span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Active Filter Indicators & Results Count */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
          <div>
            Showing <span className="font-bold text-white">{projects.length}</span> projects
          </div>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-cyan-400 hover:underline flex items-center gap-1"
            >
              <X className="h-3.5 w-3.5" /> Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-96 rounded-2xl bg-slate-900 border border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-xl mx-auto">
          <Bot className="h-12 w-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No Matching Projects Found</h3>
          <p className="text-xs text-slate-400 mt-1 mb-4">
            Try adjusting your search keywords or switching category filters.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading catalog...</div>}>
      <ProjectsContent />
    </Suspense>
  );
}
