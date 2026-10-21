'use client';

import React from 'react';
import RoleGuard from '@/components/RoleGuard';
import { useAuth } from '@/lib/auth-context';
import { School, Mail, Award, CheckCircle2 } from 'lucide-react';

const DEMO_TEACHERS = [
  { id: 'usr-teacher-1', name: 'Priya Raman', email: 'priya.raman@kiteschool.edu.in', designation: 'Lead Robotics Educator', classesCount: 3, reviewsCompleted: 42 },
  { id: 'usr-teacher-2', name: 'Siddharth Varma', email: 'siddharth.v@kiteschool.edu.in', designation: 'AI & Python Faculty', classesCount: 2, reviewsCompleted: 28 },
  { id: 'usr-teacher-3', name: 'Meera Nambiar', email: 'meera.n@kiteschool.edu.in', designation: 'ATL Innovation Lab In-charge', classesCount: 3, reviewsCompleted: 35 }
];

export default function SchoolTeachersPage() {
  const { user } = useAuth();

  return (
    <RoleGuard allowedRoles={['school_admin', 'admin']}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">STEM Faculty & Mentors</h1>
          <p className="text-slate-600 text-sm mt-1">
            {user?.school_name || 'KITE Innovation Model School'} • Teaching Staff Roster
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DEMO_TEACHERS.map(t => (
            <div
              key={t.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center text-white text-base font-bold mb-4 shadow-2xs">
                  {t.name.charAt(0)}
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-0.5">{t.name}</h3>
                <p className="text-xs text-blue-600 font-medium mb-2">{t.designation}</p>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <span className="truncate">{t.email}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-center">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-500 block text-[10px]">Active Classes</span>
                  <strong className="text-slate-900 font-mono text-sm">{t.classesCount}</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-500 block text-[10px]">Reviews Done</span>
                  <strong className="text-emerald-600 font-mono text-sm">{t.reviewsCompleted}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </RoleGuard>
  );
}
