'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import RoleGuard from '@/components/RoleGuard';
import { useAuth } from '@/lib/auth-context';
import { Users, Search, GraduationCap, Award, ExternalLink, ShieldCheck } from 'lucide-react';

interface SchoolStudent {
  id: string;
  name: string;
  username: string;
  grade: string;
  section: string;
  projectsCompleted: number;
  badgesCount: number;
  status: 'active' | 'graduated';
}

const DEMO_STUDENTS: SchoolStudent[] = [
  { id: 'usr-student-1', name: 'Aarav Sharma', username: 'aarav_maker', grade: '8', section: 'A', projectsCompleted: 2, badgesCount: 2, status: 'active' },
  { id: 'usr-student-2', name: 'Diya Patel', username: 'diya_stem', grade: '8', section: 'A', projectsCompleted: 3, badgesCount: 3, status: 'active' },
  { id: 'usr-student-3', name: 'Rohan Iyer', username: 'rohan_code', grade: '9', section: 'B', projectsCompleted: 4, badgesCount: 4, status: 'active' },
  { id: 'usr-student-4', name: 'Ananya Gupta', username: 'ananya_ai', grade: '9', section: 'B', projectsCompleted: 2, badgesCount: 2, status: 'active' },
  { id: 'usr-student-5', name: 'Kabir Khan', username: 'kabir_robotics', grade: '7', section: 'C', projectsCompleted: 1, badgesCount: 1, status: 'active' }
];

export default function SchoolStudentsPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');

  const filtered = DEMO_STUDENTS.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.grade.includes(search) ||
    s.section.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <RoleGuard allowedRoles={['school_admin', 'admin']}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Student Roster & Lab Progress</h1>
            <p className="text-slate-600 text-sm mt-1">
              {user?.school_name || 'KITE Innovation Model School'} • Enrolled Student Directory
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6 max-w-md">
          <div className="relative">
            <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name or class..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-2xs"
            />
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Student Name</th>
                  <th className="py-3.5 px-4 font-semibold">Class & Sec</th>
                  <th className="py-3.5 px-4 font-semibold">Completed Builds</th>
                  <th className="py-3.5 px-4 font-semibold">Badges Earned</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Portfolio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-slate-900 flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-2xs">
                        {s.name.charAt(0)}
                      </div>
                      <span>{s.name}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      Class {s.grade} - {s.section}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-blue-600">
                      {s.projectsCompleted}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
                        <Award className="h-3.5 w-3.5" /> {s.badgesCount}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/portfolio/${s.username}`}
                        className="inline-flex items-center gap-1 text-blue-600 hover:underline font-semibold"
                      >
                        <span>View</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
