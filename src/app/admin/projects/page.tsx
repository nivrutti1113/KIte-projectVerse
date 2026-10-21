'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import RoleGuard from '@/components/RoleGuard';
import { useAuth } from '@/lib/auth-context';
import { getProjects, createProject, deleteProject } from '@/lib/data';
import { Project, ProjectCategory, DifficultyLevel, AccessTier } from '@/types';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Search, 
  Sparkles, 
  ExternalLink,
  AlertTriangle
} from 'lucide-react';

export default function AdminProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('Robotics');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Beginner');
  const [gradeMin, setGradeMin] = useState(6);
  const [gradeMax, setGradeMax] = useState(10);
  const [estimatedHours, setEstimatedHours] = useState(3.0);
  const [estimatedCostInr, setEstimatedCostInr] = useState(950);
  const [starterLanguage, setStarterLanguage] = useState<'python' | 'arduino' | 'javascript' | 'cpp'>('arduino');
  const [starterCode, setStarterCode] = useState('// Enter starter code\nvoid setup() {}\nvoid loop() {}');
  const [accessTier, setAccessTier] = useState<AccessTier>('free');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=1200&q=80');

  useEffect(() => {
    async function load() {
      setLoading(true);
      const list = await getProjects();
      setProjects(list);
      setLoading(false);
    }
    load();
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    const newProj = await createProject({
      title,
      slug: slug || `project-${Date.now()}`,
      summary,
      description,
      category,
      grade_min: Number(gradeMin),
      grade_max: Number(gradeMax),
      difficulty,
      estimated_hours: Number(estimatedHours),
      estimated_cost_inr: Number(estimatedCostInr),
      tools_required: ['Screwdriver', 'Breadboard'],
      learning_objectives: ['Master circuits', 'Understand programming'],
      safety_notes: ['Disconnect power before wiring'],
      cover_image: coverImage,
      starter_code: starterCode,
      starter_language: starterLanguage,
      troubleshooting_guide: [{ problem: 'LED does not light up', solution: 'Check polarity' }],
      submission_requirements: ['Video demonstration', 'Photos of circuit'],
      access_tier: accessTier,
      is_published: true,
      is_featured: false
    }, user.id);

    setProjects(prev => [newProj, ...prev]);
    setIsModalOpen(false);
    setTitle('');
    setSummary('');
    setDescription('');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project from the official catalog?')) {
      await deleteProject(id, user?.id);
      setProjects(prev => prev.filter(p => p.id !== id));
    }
  };

  const filtered = projects.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Project Catalog Administration</h1>
            <p className="text-slate-400 text-sm mt-1">
              Author, publish, edit, and configure hands-on STEM project curriculum.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
          >
            <Plus className="h-4 w-4" />
            <span>Create STEM Project</span>
          </button>
        </div>

        {/* Search */}
        <div className="mb-6 max-w-md">
          <div className="relative">
            <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search catalog projects..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
        </div>

        {/* Projects Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Title & Category</th>
                  <th className="py-3.5 px-4 font-semibold">Grade</th>
                  <th className="py-3.5 px-4 font-semibold">Difficulty</th>
                  <th className="py-3.5 px-4 font-semibold">Duration</th>
                  <th className="py-3.5 px-4 font-semibold">Cost (INR)</th>
                  <th className="py-3.5 px-4 font-semibold">Tier</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-sm">{p.title}</div>
                      <span className="text-[11px] text-cyan-400">{p.category}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      Class {p.grade_min}–{p.grade_max}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-200">
                        {p.difficulty}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      {p.estimated_hours}h
                    </td>
                    <td className="py-3.5 px-4 font-mono text-emerald-400">
                      ₹{p.estimated_cost_inr || 0}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.access_tier === 'premium' ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}>
                        {p.access_tier}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/projects/${p.slug}`}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                          title="View public page"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300"
                          title="Delete project"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Project Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
              <h3 className="font-bold text-base text-white mb-4">Create Official STEM Project</h3>
              <form onSubmit={handleCreate} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Project Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    required
                    placeholder="e.g. Line Follower Robot with Infrared Sensors"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Slug (URL Kebab) *</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Category *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    >
                      <option value="Robotics">Robotics</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Arduino & Microcontrollers">Arduino & Microcontrollers</option>
                      <option value="Coding & Python">Coding & Python</option>
                      <option value="Artificial Intelligence">Artificial Intelligence</option>
                      <option value="Internet of Things">Internet of Things</option>
                      <option value="STEM Science">STEM Science</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Difficulty *</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Short Summary *</label>
                  <textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    required
                    rows={2}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Detailed Description & Physics *</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={3}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Est. Hours</label>
                    <input
                      type="number"
                      step="0.5"
                      value={estimatedHours}
                      onChange={(e) => setEstimatedHours(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Cost (INR)</label>
                    <input
                      type="number"
                      value={estimatedCostInr}
                      onChange={(e) => setEstimatedCostInr(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Tier</label>
                    <select
                      value={accessTier}
                      onChange={(e) => setAccessTier(e.target.value as AccessTier)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    >
                      <option value="free">Free</option>
                      <option value="premium">Premium Pro</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                  >
                    Publish to Catalog
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
