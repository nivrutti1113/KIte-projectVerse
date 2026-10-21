'use client';

import React, { useState, useEffect } from 'react';
import RoleGuard from '@/components/RoleGuard';
import { useAuth } from '@/lib/auth-context';
import { getClasses, createClass } from '@/lib/data';
import { ClassGroup } from '@/types';
import { Users, Plus, Key, GraduationCap, Calendar, CheckCircle2 } from 'lucide-react';

export default function TeacherClassesPage() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<ClassGroup[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('8');
  const [section, setSection] = useState('A');
  const [academicYear, setAcademicYear] = useState('2026-2027');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const list = await getClasses(undefined, user?.id);
      setClasses(list);
      setLoading(false);
    }
    load();
  }, [user?.id]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    const newCls = await createClass({
      schoolId: user.school_id || 's1111111-1111-1111-1111-111111111111',
      name,
      grade,
      section,
      academicYear
    }, user.id);

    setClasses(prev => [newCls, ...prev]);
    setIsModalOpen(false);
    setName('');
  };

  return (
    <RoleGuard allowedRoles={['teacher', 'school_admin', 'admin']}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Class Management</h1>
            <p className="text-slate-600 text-sm mt-1">
              Organize student batches, share invitation join codes, and monitor hands-on STEM progress.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Class Group</span>
          </button>
        </div>

        {/* Classes Grid */}
        {loading ? (
          <div className="text-center p-12 text-slate-400">Loading classes...</div>
        ) : classes.length === 0 ? (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl max-w-md mx-auto shadow-xs">
            <Users className="h-10 w-10 text-slate-400 mx-auto mb-2" />
            <h3 className="font-bold text-slate-900 text-base">No Classes Found</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">Create your first class group to invite students.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              Add Class
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map(cls => (
              <div
                key={cls.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      Class {cls.grade} • Sec {cls.section}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {cls.academic_year}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 mb-1">{cls.name}</h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Teacher: {cls.teacher_name || 'STEM Faculty'}
                  </p>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-xs text-slate-700">
                      <Key className="h-4 w-4 text-amber-500" />
                      <span>Student Join Code:</span>
                    </div>
                    <span className="font-mono font-bold text-blue-700 text-sm bg-white px-2.5 py-0.5 rounded border border-slate-200 shadow-2xs">
                      {cls.join_code}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-blue-600" />
                    {cls.student_count || 0} Students
                  </span>
                  <span className="text-emerald-600 font-semibold">Active Batch</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Class Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6">
              <h3 className="font-bold text-base text-slate-900 mb-4">Create New Class Batch</h3>
              <form onSubmit={handleCreate} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Class Title *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Class 8 - Robotics & IoT Explorers"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Grade Level *</label>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600"
                    >
                      {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(g => (
                        <option key={g} value={String(g)}>Class {g}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Section *</label>
                    <input
                      type="text"
                      value={section}
                      onChange={(e) => setSection(e.target.value)}
                      required
                      placeholder="A, B, or C"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Academic Year</label>
                  <input
                    type="text"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs transition-colors"
                  >
                    Create & Generate Code
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
