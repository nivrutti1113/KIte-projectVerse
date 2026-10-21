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
            <h1 className="text-3xl font-extrabold text-white">Student Roster & Lab Progress</h1>
            <p className="text-slate-400 text-sm mt-1">
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
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Student Name</th>
                  <th className="py-3.5 px-4 font-semibold">Class & Sec</th>
                  <th className="py-3.5 px-4 font-semibold">Completed Builds</th>
                  <th className="py-3.5 px-4 font-semibold">Badges Earned</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Portfolio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {filtered.map(s => (
                  <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-white flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                        {s.name.charAt(0)}
                      </div>
                      <span>{s.name}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      Class {s.grade} - {s.section}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-cyan-400">
                      {s.projectsCompleted}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 font-semibold text-amber-400">
                        <Award className="h-3.5 w-3.5" /> {s.badgesCount}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 uppercase">
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/portfolio/${s.username}`}
                        className="inline-flex items-center gap-1 text-cyan-400 hover:underline font-semibold"
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
