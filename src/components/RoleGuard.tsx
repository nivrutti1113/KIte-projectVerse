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
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-slate-500">
        <div className="h-8 w-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm font-medium">Verifying role permissions...</p>
      </div>
    );
  }

  const isAllowed = allowedRoles.includes(role);

  if (!isAllowed) {
    const targetRole = allowedRoles[0];
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-white border border-slate-200 rounded-2xl shadow-xs text-center">
        <div className="h-14 w-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Restricted Access Portal</h2>
        <p className="text-slate-600 text-sm mb-6 max-w-md mx-auto leading-relaxed">
          This section requires one of the following permissions:{' '}
          <span className="text-blue-600 font-semibold">{allowedRoles.join(', ')}</span>.
          Your current active persona is <span className="text-rose-600 font-bold uppercase">{role}</span> ({user?.full_name}).
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => switchRole(targetRole)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <UserCheck className="h-4 w-4" />
            Switch to {targetRole.replace('_', ' ').toUpperCase()} Persona
          </button>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm flex items-center justify-center gap-1.5 transition-colors"
          >
            Return to Dashboard <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
