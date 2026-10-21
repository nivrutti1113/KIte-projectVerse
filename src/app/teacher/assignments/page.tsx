'use client';

import React, { useState, useEffect } from 'react';
import RoleGuard from '@/components/RoleGuard';
import { useAuth } from '@/lib/auth-context';
import { getAssignments, getClasses, getProjects, createAssignment } from '@/lib/data';
import { Assignment, ClassGroup, Project } from '@/types';
import { Calendar, Plus, BookOpen, Clock, Award, CheckCircle2 } from 'lucide-react';

export default function TeacherAssignmentsPage() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [classes, setClasses] = useState<ClassGroup[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const [classId, setClassId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('2026-11-20');
  const [pointsPossible, setPointsPossible] = useState(100);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [asgList, clsList, projList] = await Promise.all([
        getAssignments(undefined, user?.id),
        getClasses(undefined, user?.id),
        getProjects()
      ]);
      setAssignments(asgList);
      setClasses(clsList);
      setProjects(projList);
      if (clsList.length > 0) setClassId(clsList[0].id);
      if (projList.length > 0) setProjectId(projList[0].id);
      setLoading(false);
    }
    load();
  }, [user?.id]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !classId || !projectId) return;

    const newAsg = await createAssignment({
      classId,
      projectId,
      title,
      description,
      dueDate,
      pointsPossible: Number(pointsPossible)
    }, user.id);

    setAssignments(prev => [newAsg, ...prev]);
    setIsModalOpen(false);
    setTitle('');
    setDescription('');
  };

  return (
    <RoleGuard allowedRoles={['teacher', 'school_admin', 'admin']}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Project Assignments</h1>
            <p className="text-slate-600 text-sm mt-1">
              Assign capstone STEM and robotics builds to specific classes with due dates and rubric criteria.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Create Capstone Assignment</span>
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading assignments...</div>
        ) : assignments.length === 0 ? (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl max-w-md mx-auto shadow-xs">
            <Calendar className="h-10 w-10 text-slate-400 mx-auto mb-2" />
            <h3 className="font-bold text-slate-900 text-base">No Assignments Posted</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">Post a project assignment for your students to build.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              Post Assignment
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assignments.map(asg => (
              <div
                key={asg.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Due {new Date(asg.due_date).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-blue-600 font-semibold">
                      {asg.class_name}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 mb-1">{asg.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{asg.description}</p>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Target Project:</span>
                      <strong className="text-blue-700 truncate max-w-[200px]">{asg.project_title}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Points Possible:</span>
                      <span className="font-bold text-slate-900 font-mono">{asg.points_possible} pts</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>{asg.submissions_count || 0} Submissions Received</span>
                  <span className="text-emerald-600 font-semibold uppercase">{asg.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl p-6">
              <h3 className="font-bold text-base text-slate-900 mb-4">Post Project Assignment</h3>
              <form onSubmit={handleCreate} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Target Class *</label>
                  <select
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name} (Grade {c.grade})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">STEM Project from Catalog *</label>
                  <select
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.title} ({p.category})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Assignment Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="e.g. Term 1 Robotics Rover Capstone"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Instructions & Guidelines</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Specify any custom distance thresholds or video recording requirements..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Due Date *</label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Points Possible *</label>
                    <input
                      type="number"
                      value={pointsPossible}
                      onChange={(e) => setPointsPossible(Number(e.target.value))}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
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
                    Post to Class
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
