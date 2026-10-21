'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { getStudentPortfolio, updateStudentPortfolio } from '@/lib/data';
import { StudentPortfolio } from '@/types';
import { 
  Award, 
  Bot, 
  Cpu, 
  Zap, 
  Terminal, 
  Sparkles, 
  Share2, 
  Check, 
  Lock, 
  Globe, 
  ShieldCheck, 
  ExternalLink,
  Settings,
  Eye,
  CheckCircle2
} from 'lucide-react';

function PortfolioInner({ username }: { username: string }) {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState<StudentPortfolio | null>(null);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [customBio, setCustomBio] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [showSchool, setShowSchool] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getStudentPortfolio(username);
      if (data) {
        setPortfolio(data);
        setDisplayName(data.display_name);
        setCustomBio(data.custom_bio);
        setIsPublic(data.is_public);
        setShowSchool(data.show_school);
      }
      setLoading(false);
    }
    load();
  }, [username]);

  const isOwner = user?.username === username || user?.role === 'admin';

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    try {
      const updated = await updateStudentPortfolio(user.id, {
        displayName,
        customBio,
        isPublic,
        showSchool
      });
      setPortfolio(updated);
      setIsEditing(false);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-400">
        <div className="h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm">Loading Student STEM Portfolio...</p>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 text-center bg-slate-900 border border-slate-800 rounded-3xl">
        <h2 className="text-lg font-bold text-white mb-2">Portfolio Not Found</h2>
        <p className="text-xs text-slate-400 mb-4">No student maker portfolio exists under @{username}.</p>
        <Link href="/projects" className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold">
          Explore Projects
        </Link>
      </div>
    );
  }

  if (!portfolio.is_public && !isOwner) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 text-center bg-slate-900 border border-slate-800 rounded-3xl">
        <Lock className="h-10 w-10 text-amber-400 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-white mb-2">Private Maker Portfolio</h2>
        <p className="text-xs text-slate-400 mb-4">
          This student has chosen to keep their project portfolio private or it requires mentor authorization.
        </p>
        <Link href="/" className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Privacy Notice for Child Protection */}
      <div className="mb-6 p-3 rounded-2xl bg-indigo-950/40 border border-indigo-800/60 flex items-center justify-between text-xs text-indigo-200">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" />
          <span>
            <strong>Child Safety Protected:</strong> Real student contact information and school details are anonymized in compliance with India&apos;s DPDP framework.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="px-2.5 py-1 rounded-lg bg-indigo-900/80 hover:bg-indigo-800 text-white font-medium text-[11px] flex items-center gap-1 transition-colors"
          >
            {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Share2 className="h-3 w-3" />}
            <span>{copied ? 'Copied' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl mb-8 relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 p-1 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
              <div className="h-full w-full rounded-xl bg-slate-950 flex items-center justify-center text-2xl font-black text-cyan-400">
                {portfolio.display_name.charAt(0)}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                  {portfolio.display_name}
                </h1>
                <span className="text-xs text-slate-500 font-mono">@{portfolio.username}</span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-lg leading-relaxed">
                {portfolio.custom_bio}
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-400">
                <span className="flex items-center gap-1 text-cyan-400">
                  <Globe className="h-3.5 w-3.5" /> Verified STEM Builder
                </span>
                {portfolio.show_school && portfolio.school_name && (
                  <span>• {portfolio.school_name}</span>
                )}
                {portfolio.grade_level && <span>• {portfolio.grade_level}</span>}
              </div>
            </div>
          </div>

          {isOwner && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Settings className="h-3.5 w-3.5" />
              <span>{isEditing ? 'Close Settings' : 'Portfolio Settings'}</span>
            </button>
          )}
        </div>

        {/* Edit Settings Drawer */}
        {isEditing && (
          <form onSubmit={handleSaveSettings} className="mt-6 pt-6 border-t border-slate-800 space-y-4 text-xs">
            <h3 className="font-bold text-white text-sm">Portfolio Customization</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Display Alias / Handle</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Custom STEM Bio</label>
                <input
                  type="text"
                  value={customBio}
                  onChange={(e) => setCustomBio(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-cyan-500"
                />
                <span>Public Portfolio (allow showcase link sharing)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={showSchool}
                  onChange={(e) => setShowSchool(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-cyan-500"
                />
                <span>Show School Name on public profile</span>
              </label>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
              >
                Save Settings
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Demonstrated Skills Chips */}
      <div className="mb-8">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Demonstrated Engineering Skills
        </h3>
        <div className="flex flex-wrap gap-2">
          {portfolio.skills.map((skill, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-200 flex items-center gap-1.5"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Verified Badges Grid */}
      <div className="mb-10">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
          <Award className="h-4 w-4 text-amber-400" />
          Verified STEM Badges ({portfolio.earned_badges.length})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {portfolio.earned_badges.map((b) => (
            <div
              key={b.id}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3.5 shadow-md"
            >
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
                <Award className="h-6 w-6" />
              </div>
              <div className="text-xs">
                <h4 className="font-bold text-white text-sm">{b.title}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">{b.description}</p>
                <span className="text-[10px] text-cyan-400 font-mono mt-1 block uppercase">
                  Category: {b.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completed Builds Showcase */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-cyan-400" />
          Completed & Approved STEM Builds ({portfolio.completed_projects.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {portfolio.completed_projects.map((proj, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between"
            >
              <div className="h-44 w-full relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={proj.cover_image}
                  alt={proj.project_title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-900/90 text-slate-200 border border-slate-700">
                  {proj.category}
                </span>
                {proj.score && (
                  <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-slate-950">
                    Verified Score: {proj.score}/30
                  </span>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-white text-base mb-1">{proj.project_title}</h4>
                  <p className="text-xs text-slate-400 italic mb-3">
                    &ldquo;{proj.student_reflection}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span>Completed: {new Date(proj.completed_at).toLocaleDateString()}</span>
                  <Link
                    href={`/projects/${proj.project_slug}`}
                    className="text-cyan-400 font-semibold hover:underline flex items-center gap-1"
                  >
                    View Project <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PageContent({ params }: { params: Promise<{ username: string }> }) {
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    params.then(p => setUsername(p.username));
  }, [params]);

  if (!username) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-slate-400 text-sm">
        Loading portfolio...
      </div>
    );
  }

  return <PortfolioInner username={username} />;
}

export default function PortfolioPage({
  params
}: {
  params: Promise<{ username: string }>;
}) {
  return (
    <Suspense fallback={<div className="p-10 text-center text-slate-400">Loading portfolio...</div>}>
      <PageContent params={params} />
    </Suspense>
  );
}
