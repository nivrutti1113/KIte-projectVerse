'use client';

import React, { useState } from 'react';
import RoleGuard from '@/components/RoleGuard';
import { useAuth } from '@/lib/auth-context';
import { SEED_SCHOOLS } from '@/lib/data';
import { School } from '@/types';
import { School as SchoolIcon, Plus, MapPin, Mail, Award, CheckCircle2 } from 'lucide-react';

export default function AdminSchoolsPage() {
  const { user } = useAuth();
  const [schools, setSchools] = useState<School[]>([...SEED_SCHOOLS]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newSchool: School = {
      id: `s-${Date.now()}`,
      name,
      code,
      city,
      state,
      board: 'CBSE',
      contact_email: contactEmail,
      plan_tier: 'premium_institution',
      is_active: true,
      student_count: 50,
      teacher_count: 2,
      created_at: new Date().toISOString()
    };
    setSchools(prev => [newSchool, ...prev]);
    setIsModalOpen(false);
    setName('');
    setCode('');
  };

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Partner Schools & Institutional Tenants</h1>
            <p className="text-slate-400 text-sm mt-1">
              Multi-tenant management across Indian schools and Atal Tinkering Labs.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
          >
            <Plus className="h-4 w-4" />
            <span>Enroll Partner School</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {schools.map(sch => (
            <div
              key={sch.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                    Tenant ID: {sch.code}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800 capitalize">
                    {sch.plan_tier.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="font-bold text-lg text-white mb-1">{sch.name}</h3>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                  <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{sch.city}, {sch.state} • {sch.board}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                  <Mail className="h-3.5 w-3.5 text-indigo-400" />
                  <span>{sch.contact_email}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-3 text-xs text-center">
                <div className="p-2.5 rounded-xl bg-slate-950">
                  <span className="text-slate-400 block text-[10px]">Students</span>
                  <strong className="text-white font-mono text-base">{sch.student_count || 0}</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950">
                  <span className="text-slate-400 block text-[10px]">Faculty</span>
                  <strong className="text-cyan-400 font-mono text-base">{sch.teacher_count || 0}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6">
              <h3 className="font-bold text-base text-white mb-4">Enroll New Partner School</h3>
              <form onSubmit={handleCreate} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">School Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. St. Xavier's STEM Academy"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tenant Code *</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    placeholder="e.g. STX-MUM-01"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono uppercase"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">City *</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">State *</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Contact Email *</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    required
                    placeholder="stemlab@school.edu.in"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
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
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                  >
                    Enroll School
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
