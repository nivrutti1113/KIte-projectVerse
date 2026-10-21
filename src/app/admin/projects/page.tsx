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
            <h1 className="text-3xl font-extrabold text-slate-900">Project Catalog Administration</h1>
            <p className="text-slate-600 text-sm mt-1">
              Author, publish, edit, and configure hands-on STEM project curriculum.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
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
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-2xs"
            />
          </div>
        </div>

        {/* Projects Table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[11px] border-b border-slate-200 font-semibold">
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
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm">{p.title}</div>
                      <span className="text-[11px] text-blue-600 font-medium">{p.category}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      Class {p.grade_min}–{p.grade_max}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {p.difficulty}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium">
                      {p.estimated_hours}h
                    </td>
                    <td className="py-3.5 px-4 font-mono text-emerald-600 font-semibold">
                      ₹{p.estimated_cost_inr || 0}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        p.access_tier === 'premium' ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {p.access_tier}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/projects/${p.slug}`}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                          title="View public page"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">
              <h3 className="font-bold text-base text-slate-900 mb-4">Create Official STEM Project</h3>
              <form onSubmit={handleCreate} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Project Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    required
                    placeholder="e.g. Line Follower Robot with Infrared Sensors"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Slug (URL Kebab) *</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Category *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600"
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
                    <label className="block text-slate-700 font-semibold mb-1">Difficulty *</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Short Summary *</label>
                  <textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    required
                    rows={2}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Detailed Description & Physics *</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={3}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Est. Hours</label>
                    <input
                      type="number"
                      step="0.5"
                      value={estimatedHours}
                      onChange={(e) => setEstimatedHours(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Cost (INR)</label>
                    <input
                      type="number"
                      value={estimatedCostInr}
                      onChange={(e) => setEstimatedCostInr(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Tier</label>
                    <select
                      value={accessTier}
                      onChange={(e) => setAccessTier(e.target.value as AccessTier)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="free">Free</option>
                      <option value="premium">Premium Pro</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs transition-colors"
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
