'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Settings, User, Mail, School, ShieldCheck, CheckCircle2, Award } from 'lucide-react';
import { UserRole } from '@/types';

export default function SettingsPage() {
  const { user, role, switchRole } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || 'Aarav Sharma');
  const [bio, setBio] = useState(user?.bio || 'Passionate about robotics, Arduino microcontrollers, and autonomous rovers.');
  const [parentEmail, setParentEmail] = useState(user?.parent_email || 'parent.sharma@example.in');
  const [gradeLevel, setGradeLevel] = useState(user?.grade_level || 'Class 8');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      user.full_name = fullName;
      user.bio = bio;
      user.parent_email = parentEmail;
      user.grade_level = gradeLevel;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2.5">
          <Settings className="h-7 w-7 text-cyan-400" /> Account Settings & Preferences
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Manage your personal profile, active persona, and notifications.
        </p>
      </div>

      {saved && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-950/70 border border-emerald-800 text-emerald-200 text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      {/* Role Switcher Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 mb-8 shadow-xl">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
          Active Demonstration Persona
        </h2>
        <p className="text-xs text-slate-400 mb-4">
          Switch roles to test Student, Teacher, School Admin, or Platform Admin capabilities:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {[
            { id: 'student', label: '🎓 Student Maker', name: 'Aarav (Class 8)' },
            { id: 'teacher', label: '👩‍🏫 Teacher', name: 'Priya Raman' },
            { id: 'school_admin', label: '🏫 School Admin', name: 'Vikram Seth' },
            { id: 'admin', label: '⚡ KITE Admin', name: 'Platform Admin' }
          ].map(r => (
            <button
              key={r.id}
              onClick={() => switchRole(r.id as UserRole)}
              className={`p-3 rounded-2xl border text-left transition-all ${
                role === r.id
                  ? 'bg-indigo-600/30 border-cyan-400 text-white shadow-md'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="font-bold">{r.label}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{r.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <h2 className="text-base font-bold text-white mb-6">Profile Details</h2>

        <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Username Handle</label>
              <input
                type="text"
                value={user?.username || 'maker'}
                disabled
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-500 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Grade / Class</label>
              <input
                type="text"
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Email</label>
            <input
              type="email"
              value={user?.email || 'student@kite.test'}
              disabled
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-500 text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Guardian / Parent Email</label>
            <input
              type="email"
              value={parentEmail}
              onChange={(e) => setParentEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs leading-relaxed"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
