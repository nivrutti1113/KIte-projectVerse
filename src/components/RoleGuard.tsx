'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { UserRole } from '@/types';
import { ShieldAlert, ArrowRight, UserCheck } from 'lucide-react';
import Link from 'next/link';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export default function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { user, role, switchRole, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-slate-400">
        <div className="h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm">Verifying role permissions...</p>
      </div>
    );
  }

  const isAllowed = allowedRoles.includes(role);

  if (!isAllowed) {
    const targetRole = allowedRoles[0];
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl text-center">
        <div className="h-14 w-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Restricted Access Portal</h2>
        <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
          This section requires one of the following permissions:{' '}
          <span className="text-cyan-400 font-semibold">{allowedRoles.join(', ')}</span>.
          Your current active persona is <span className="text-rose-400 font-bold uppercase">{role}</span> ({user?.full_name}).
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => switchRole(targetRole)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition-all"
          >
            <UserCheck className="h-4 w-4" />
            Switch to {targetRole.replace('_', ' ').toUpperCase()} Persona
          </button>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm flex items-center justify-center gap-1.5 transition-colors"
          >
            Return to Dashboard <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
