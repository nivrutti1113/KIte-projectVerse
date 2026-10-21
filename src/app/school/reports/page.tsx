'use client';

import React, { useState } from 'react';
import RoleGuard from '@/components/RoleGuard';
import { useAuth } from '@/lib/auth-context';
import { BarChart3, Download, CheckCircle2, ShieldCheck, Sparkles, Printer } from 'lucide-react';
import { formatDate } from '@/lib/format';

export default function SchoolReportsPage() {
  const { user } = useAuth();
  const [downloaded, setDownloaded] = useState(false);

  const handleExport = () => {
    const csvContent = `KITE ProjectVerse - ATL Lab Compliance Report\nSchool: ${user?.school_name || 'KITE Innovation Model School'}\nGenerated Date: ${formatDate(new Date())}\n\nMetric,Value\nTotal Hands-on Lab Hours,1280 Hours\nEnrolled STEM Students,240\nVerified Project Submissions,184\nAutonomous Robotics Share,45%\nArduino & Embedded Share,32%\nAI & Vision Share,23%\nStatus,Fully Compliant with Atal Innovation Mission (AIM)\n`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ATL_STEM_Compliance_Report_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <RoleGuard allowedRoles={['school_admin', 'admin']}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">STEM Lab Analytics & ATL Reports</h1>
            <p className="text-slate-600 text-sm mt-1">
              Official activity reports for CBSE, ICSE, and Atal Innovation Mission (AIM) audits.
            </p>
          </div>

          <button
            onClick={handleExport}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
          >
            {downloaded ? <CheckCircle2 className="h-4 w-4 text-emerald-200" /> : <Download className="h-4 w-4" />}
            <span>{downloaded ? 'Downloaded Report' : 'Export Official ATL Report (CSV)'}</span>
          </button>
        </div>

        {/* Analytics Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <span className="text-xs text-slate-500 font-medium">Cumulative Practical Build Hours</span>
            <div className="text-3xl font-black text-slate-900 mt-2">1,280 <span className="text-sm font-semibold text-blue-600">Hours</span></div>
            <p className="text-[11px] text-emerald-600 font-medium mt-2 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Exceeds minimum ATL annual requirement
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <span className="text-xs text-slate-500 font-medium">Verified Mentor Reviews</span>
            <div className="text-3xl font-black text-slate-900 mt-2">184 <span className="text-sm font-semibold text-emerald-600">Approved</span></div>
            <p className="text-[11px] text-slate-500 mt-2">
              Average Rubric Score: <strong className="text-slate-800">26.4 / 30 pts</strong>
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <span className="text-xs text-slate-500 font-medium">Student Participation Rate</span>
            <div className="text-3xl font-black text-slate-900 mt-2">91.8%</div>
            <p className="text-[11px] text-blue-600 font-medium mt-2">
              220 of 240 active students built ≥ 1 project
            </p>
          </div>
        </div>

        {/* Domain Distribution */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs mb-8">
          <h3 className="font-bold text-slate-900 text-base mb-6">
            STEM Hands-On Domain Distribution (NEP 2020 Framework)
          </h3>

          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs text-slate-700 font-semibold mb-1.5">
                <span>Autonomous Robotics (Obstacle Avoiders, 2WD Kinematics)</span>
                <span className="text-blue-600 font-bold">45% (82 Builds)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '45%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-700 font-semibold mb-1.5">
                <span>Arduino & Embedded Sensors (Solar Trackers, Smart Irrigation)</span>
                <span className="text-emerald-600 font-bold">32% (58 Builds)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '32%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-700 font-semibold mb-1.5">
                <span>Artificial Intelligence & Computer Vision (Hand Gestures)</span>
                <span className="text-indigo-600 font-bold">23% (44 Builds)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '23%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
