'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { UserRole } from '@/types';
import { 
  Bot, 
  Cpu, 
  BookOpen, 
  Briefcase, 
  Send, 
  Award, 
  ShieldAlert, 
  Bell, 
  Menu, 
  X, 
  ChevronDown, 
  LogOut, 
  Settings,
  Sparkles,
  School,
  CheckCircle2
} from 'lucide-react';
import { getNotifications, markNotificationAsRead } from '@/lib/data';
import { InAppNotification } from '@/types';

export default function Navbar() {
  const { user, role, switchRole, logout, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);

  useEffect(() => {
    if (user?.id) {
      getNotifications(user.id).then(setNotifications);
    }
  }, [user?.id, pathname]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkAsRead = async (id: string) => {
    await markNotificationAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const rolesList: { role: UserRole; label: string; icon: string; desc: string }[] = [
    { role: 'student', label: 'Student Maker', icon: '🎓', desc: 'Aarav Sharma (Class 8)' },
    { role: 'teacher', label: 'Teacher / Mentor', icon: '👩‍🏫', desc: 'Priya Raman (Robotics Faculty)' },
    { role: 'school_admin', label: 'School Admin', icon: '🏫', desc: 'Vikram Seth (Principal)' },
    { role: 'admin', label: 'KITE Admin', icon: '⚡', desc: 'Central Platform Administrator' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 text-white backdrop-blur-md bg-opacity-95 shadow-md">
      {/* Top Banner: Role switcher bar */}
      <div className="bg-indigo-950/80 border-b border-indigo-900/50 px-4 py-1.5 text-xs text-indigo-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium">Active Session:</span>
          <span className="bg-indigo-800/80 text-indigo-100 px-2 py-0.5 rounded font-mono font-semibold">
            {user?.full_name || 'Guest'} ({role.toUpperCase()})
          </span>
          <span className="hidden md:inline text-indigo-300">
            • {user?.school_name || 'Independent Maker'}
          </span>
        </div>

        {/* Quick Role Switcher Buttons */}
        <div className="flex items-center gap-1.5">
          <span className="hidden sm:inline text-indigo-300">Demo Role:</span>
          <div className="flex gap-1 bg-indigo-900/70 p-0.5 rounded-lg border border-indigo-700/50">
            {rolesList.map(r => (
              <button
                key={r.role}
                onClick={() => switchRole(r.role)}
                title={r.desc}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                  role === r.role
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-indigo-200 hover:bg-indigo-800/60'
                }`}
              >
                {r.icon} {r.label.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Bot className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                  KITE <span className="text-cyan-400 font-extrabold">ProjectVerse</span>
                </span>
                <span className="text-[10px] text-slate-400 tracking-wider uppercase font-medium">
                  STEM Hands-on Platform
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 ml-8">
              <Link
                href="/projects"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname.startsWith('/projects')
                    ? 'bg-slate-800 text-cyan-400 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                Project Catalog
              </Link>

              {role === 'student' && (
                <>
                  <Link
                    href="/dashboard"
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      pathname === '/dashboard'
                        ? 'bg-slate-800 text-cyan-400 font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    My Dashboard
                  </Link>
                  <Link
                    href="/my-projects"
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      pathname === '/my-projects'
                        ? 'bg-slate-800 text-cyan-400 font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    My Projects
                  </Link>
                  <Link
                    href="/submissions"
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      pathname === '/submissions'
                        ? 'bg-slate-800 text-cyan-400 font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    Submissions
                  </Link>
                  <Link
                    href={`/portfolio/${user?.username || 'aarav_maker'}`}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      pathname.startsWith('/portfolio')
                        ? 'bg-slate-800 text-cyan-400 font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    Portfolio
                  </Link>
                </>
              )}

              {role === 'teacher' && (
                <>
                  <Link
                    href="/teacher/dashboard"
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      pathname === '/teacher/dashboard'
                        ? 'bg-slate-800 text-cyan-400 font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    Teacher Portal
                  </Link>
                  <Link
                    href="/teacher/classes"
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      pathname === '/teacher/classes'
                        ? 'bg-slate-800 text-cyan-400 font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    Classes
                  </Link>
                  <Link
                    href="/teacher/assignments"
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      pathname === '/teacher/assignments'
                        ? 'bg-slate-800 text-cyan-400 font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    Assignments
                  </Link>
                  <Link
                    href="/teacher/reviews"
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      pathname === '/teacher/reviews'
                        ? 'bg-slate-800 text-cyan-400 font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    Submission Reviews
                  </Link>
                </>
              )}

              {role === 'school_admin' && (
                <>
                  <Link
                    href="/school/dashboard"
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      pathname === '/school/dashboard'
                        ? 'bg-slate-800 text-cyan-400 font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    School Overview
                  </Link>
                  <Link
                    href="/school/students"
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      pathname === '/school/students'
                        ? 'bg-slate-800 text-cyan-400 font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    Students
                  </Link>
                  <Link
                    href="/school/teachers"
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      pathname === '/school/teachers'
                        ? 'bg-slate-800 text-cyan-400 font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    Teachers
                  </Link>
                  <Link
                    href="/school/reports"
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      pathname === '/school/reports'
                        ? 'bg-slate-800 text-cyan-400 font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    Analytics & Reports
                  </Link>
                </>
              )}

              {role === 'admin' && (
                <>
                  <Link
                    href="/admin"
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      pathname === '/admin'
                        ? 'bg-slate-800 text-cyan-400 font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    Admin Hub
                  </Link>
                  <Link
                    href="/admin/projects"
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      pathname === '/admin/projects'
                        ? 'bg-slate-800 text-cyan-400 font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    Manage Projects
                  </Link>
                  <Link
                    href="/admin/schools"
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      pathname === '/admin/schools'
                        ? 'bg-slate-800 text-cyan-400 font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    Schools & Tenants
                  </Link>
                  <Link
                    href="/admin/audit-logs"
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      pathname === '/admin/audit-logs'
                        ? 'bg-slate-800 text-cyan-400 font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    Audit Logs
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/pricing"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition-all"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Plans & Pricing
            </Link>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-cyan-500 text-[10px] font-bold text-slate-950 flex items-center justify-center animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="font-semibold text-sm text-white">In-App Notifications</span>
                    <span className="text-xs text-cyan-400">{unreadCount} unread</span>
                  </div>

                  <div className="divide-y divide-slate-800 max-h-72 overflow-y-auto mt-2 space-y-1">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-6">No notifications yet.</p>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          className={`py-2.5 px-2 rounded-lg transition-colors ${
                            n.is_read ? 'opacity-70 bg-transparent' : 'bg-slate-800/60'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-medium text-xs text-white">{n.title}</span>
                            {!n.is_read && (
                              <button
                                onClick={() => handleMarkAsRead(n.id)}
                                className="text-[10px] text-cyan-400 hover:underline flex items-center gap-0.5"
                              >
                                <CheckCircle2 className="h-3 w-3" /> Read
                              </button>
                            )}
                          </div>
                          <p className="text-xs text-slate-300 mt-1">{n.message}</p>
                          {n.link && (
                            <Link
                              href={n.link}
                              onClick={() => setNotificationsOpen(false)}
                              className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium inline-block mt-1"
                            >
                              View details →
                            </Link>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Avatar & Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all"
              >
                <div className="h-8 w-8 rounded-full overflow-hidden bg-indigo-600 flex items-center justify-center text-xs font-bold text-white border border-indigo-400">
                  {user?.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.avatar_url} alt={user.full_name} className="h-full w-full object-cover" />
                  ) : (
                    user?.full_name?.charAt(0) || 'U'
                  )}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-semibold text-white leading-tight">
                    {user?.full_name || 'Student'}
                  </span>
                  <span className="text-[10px] text-cyan-400 font-mono capitalize">
                    {role.replace('_', ' ')}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <p className="text-xs font-bold text-white">{user?.full_name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                    <p className="text-[10px] text-cyan-400 font-mono mt-0.5 capitalize">{role} Account</p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/settings"
                      onClick={() => setRoleMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <Settings className="h-4 w-4 text-slate-400" /> Account Settings
                    </Link>
                    <Link
                      href="/privacy"
                      onClick={() => setRoleMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <ShieldAlert className="h-4 w-4 text-slate-400" /> Privacy & DPDP Notice
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-slate-800">
                    <button
                      onClick={() => {
                        logout();
                        setRoleMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
                    >
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-2">
          <Link
            href="/projects"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
          >
            Project Catalog
          </Link>

          {role === 'student' && (
            <>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
              >
                My Dashboard
              </Link>
              <Link
                href="/my-projects"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
              >
                My Projects
              </Link>
              <Link
                href="/submissions"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
              >
                Submissions
              </Link>
              <Link
                href={`/portfolio/${user?.username || 'aarav_maker'}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
              >
                Maker Portfolio
              </Link>
            </>
          )}

          {role === 'teacher' && (
            <>
              <Link
                href="/teacher/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
              >
                Teacher Dashboard
              </Link>
              <Link
                href="/teacher/classes"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
              >
                Classes
              </Link>
              <Link
                href="/teacher/assignments"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
              >
                Assignments
              </Link>
              <Link
                href="/teacher/reviews"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
              >
                Submission Reviews
              </Link>
            </>
          )}

          {role === 'school_admin' && (
            <>
              <Link
                href="/school/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
              >
                School Dashboard
              </Link>
              <Link
                href="/school/students"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
              >
                Students Directory
              </Link>
              <Link
                href="/school/reports"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
              >
                School Analytics
              </Link>
            </>
          )}

          {role === 'admin' && (
            <>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
              >
                Admin Dashboard
              </Link>
              <Link
                href="/admin/projects"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
              >
                Manage Projects
              </Link>
              <Link
                href="/admin/schools"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
              >
                Schools & Tenants
              </Link>
            </>
          )}

          <div className="pt-3 border-t border-slate-800">
            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-amber-300 hover:bg-slate-800"
            >
              Plans & Pricing
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
