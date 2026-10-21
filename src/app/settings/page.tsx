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
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
          <Settings className="h-7 w-7 text-blue-600" /> Account Settings & Preferences
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          Manage your personal profile, active persona, and notifications.
        </p>
      </div>

      {saved && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      {/* Role Switcher Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
          Active Demonstration Persona
        </h2>
        <p className="text-xs text-slate-600 mb-4">
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
              className={`p-3 rounded-xl border text-left transition-all ${
                role === r.id
                  ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-2xs ring-1 ring-blue-500/20'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="font-bold">{r.label}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{r.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-6">Profile Details</h2>

        <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Username Handle</label>
              <input
                type="text"
                value={user?.username || 'maker'}
                disabled
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Grade / Class</label>
              <input
                type="text"
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Email</label>
            <input
              type="email"
              value={user?.email || 'student@kite.test'}
              disabled
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Guardian / Parent Email</label>
            <input
              type="email"
              value={parentEmail}
              onChange={(e) => setParentEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs leading-relaxed focus:bg-white focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
