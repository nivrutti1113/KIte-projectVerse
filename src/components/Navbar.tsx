'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { UserRole } from '@/types';
import { 
  Bot, 
  Bell, 
  Menu, 
  X, 
  ChevronDown, 
  LogOut, 
  Settings,
  Sparkles,
  School,
  CheckCircle2,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { getNotifications, markNotificationAsRead } from '@/lib/data';
import { InAppNotification } from '@/types';

export default function Navbar() {
  const { user, role, switchRole, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
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

  const rolesList: { role: UserRole; title: string; badge: string; desc: string }[] = [
    { role: 'student', title: 'Student Maker', badge: 'Class 8', desc: 'Aarav Sharma • Hands-on builder' },
    { role: 'teacher', title: 'Teacher / Mentor', badge: 'Faculty', desc: 'Priya Raman • Reviews & Rubrics' },
    { role: 'school_admin', title: 'School Administrator', badge: 'Admin', desc: 'Vikram Seth • Principal & Rosters' },
    { role: 'admin', title: 'Platform Admin', badge: 'KITE HQ', desc: 'Central Platform & Curriculum' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      {/* Sleek Top Utility Bar */}
      <div className="bg-slate-900 text-slate-300 px-4 sm:px-6 lg:px-8 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="text-slate-400 font-medium">Logged in as:</span>
          <span className="text-white font-semibold">{user?.full_name || 'Aarav Sharma'}</span>
          <span className="text-slate-400 hidden sm:inline">•</span>
          <span className="text-slate-400 hidden sm:inline">{user?.school_name || 'Independent Maker'}</span>
        </div>

        {/* Professional Segmented Persona Selector */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 hidden md:inline text-[11px]">Active Persona:</span>
          <div className="relative">
            <button
              onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white px-2.5 py-1 rounded-md text-[11px] font-medium border border-slate-700 transition-colors"
            >
              <span className="capitalize">{role.replace('_', ' ')}</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {roleSwitcherOpen && (
              <div className="absolute right-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 text-slate-900">
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-100">
                  Switch Demonstration Persona
                </div>
                {rolesList.map(r => (
                  <button
                    key={r.role}
                    onClick={() => {
                      switchRole(r.role);
                      setRoleSwitcherOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-start justify-between gap-2 hover:bg-slate-50 transition-colors ${
                      role === r.role ? 'bg-blue-50/70 text-blue-700 font-semibold' : 'text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold">{r.title}</div>
                      <div className="text-[11px] text-slate-500">{r.desc}</div>
                    </div>
                    {role === r.role && <CheckCircle2 className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
                <Bot className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 leading-none">
                  KITE <span className="text-blue-600 font-bold">ProjectVerse</span>
                </span>
                <span className="text-[10px] text-slate-500 tracking-wide font-medium mt-0.5">
                  STEM Hands-on Platform
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 ml-8">
              <Link
                href="/projects"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname.startsWith('/projects')
                    ? 'text-blue-600 bg-blue-50/80 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                Project Catalog
              </Link>

              {role === 'student' && (
                <>
                  <Link
                    href="/dashboard"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname === '/dashboard'
                        ? 'text-blue-600 bg-blue-50/80 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    My Dashboard
                  </Link>
                  <Link
                    href="/my-projects"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname === '/my-projects'
                        ? 'text-blue-600 bg-blue-50/80 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    My Projects
                  </Link>
                  <Link
                    href="/submissions"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname === '/submissions'
                        ? 'text-blue-600 bg-blue-50/80 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    Submissions
                  </Link>
                  <Link
                    href={`/portfolio/${user?.username || 'aarav_maker'}`}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname.startsWith('/portfolio')
                        ? 'text-blue-600 bg-blue-50/80 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
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
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname === '/teacher/dashboard'
                        ? 'text-blue-600 bg-blue-50/80 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    Teacher Portal
                  </Link>
                  <Link
                    href="/teacher/classes"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname === '/teacher/classes'
                        ? 'text-blue-600 bg-blue-50/80 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    Classes
                  </Link>
                  <Link
                    href="/teacher/assignments"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname === '/teacher/assignments'
                        ? 'text-blue-600 bg-blue-50/80 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    Assignments
                  </Link>
                  <Link
                    href="/teacher/reviews"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname === '/teacher/reviews'
                        ? 'text-blue-600 bg-blue-50/80 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    Rubric Reviews
                  </Link>
                </>
              )}

              {role === 'school_admin' && (
                <>
                  <Link
                    href="/school/dashboard"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname === '/school/dashboard'
                        ? 'text-blue-600 bg-blue-50/80 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    School Overview
                  </Link>
                  <Link
                    href="/school/students"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname === '/school/students'
                        ? 'text-blue-600 bg-blue-50/80 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    Students
                  </Link>
                  <Link
                    href="/school/teachers"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname === '/school/teachers'
                        ? 'text-blue-600 bg-blue-50/80 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    Faculty
                  </Link>
                  <Link
                    href="/school/reports"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname === '/school/reports'
                        ? 'text-blue-600 bg-blue-50/80 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    ATL Reports
                  </Link>
                </>
              )}

              {role === 'admin' && (
                <>
                  <Link
                    href="/admin"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname === '/admin'
                        ? 'text-blue-600 bg-blue-50/80 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    Admin Hub
                  </Link>
                  <Link
                    href="/admin/projects"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname === '/admin/projects'
                        ? 'text-blue-600 bg-blue-50/80 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    Catalog Admin
                  </Link>
                  <Link
                    href="/admin/schools"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname === '/admin/schools'
                        ? 'text-blue-600 bg-blue-50/80 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    Schools
                  </Link>
                  <Link
                    href="/admin/audit-logs"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname === '/admin/audit-logs'
                        ? 'text-blue-600 bg-blue-50/80 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    Audit Logs
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center gap-3">
            <Link
              href="/pricing"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              Plans
            </Link>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-blue-600 text-[10px] font-bold text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="font-bold text-sm text-slate-900">Notifications</span>
                    <span className="text-xs text-blue-600 font-medium">{unreadCount} unread</span>
                  </div>

                  <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto mt-2">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-6">No notifications yet.</p>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          className={`py-2.5 px-2 rounded-lg transition-colors ${
                            n.is_read ? 'opacity-70 bg-transparent' : 'bg-blue-50/50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-xs text-slate-900">{n.title}</span>
                            {!n.is_read && (
                              <button
                                onClick={() => handleMarkAsRead(n.id)}
                                className="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5"
                              >
                                Mark Read
                              </button>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 mt-1">{n.message}</p>
                          {n.link && (
                            <Link
                              href={n.link}
                              onClick={() => setNotificationsOpen(false)}
                              className="text-[11px] text-blue-600 font-semibold hover:underline inline-block mt-1"
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
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all"
              >
                <div className="h-8 w-8 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-xs">
                  {user?.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.avatar_url} alt={user.full_name} className="h-full w-full object-cover" />
                  ) : (
                    user?.full_name?.charAt(0) || 'A'
                  )}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-semibold text-slate-900 leading-tight">
                    {user?.full_name || 'Aarav Sharma'}
                  </span>
                  <span className="text-[10px] text-slate-500 capitalize">
                    {role.replace('_', ' ')}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50 text-slate-900 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{user?.full_name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                    <span className="inline-block mt-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      {role.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/settings"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      <Settings className="h-4 w-4 text-slate-500" /> Account Settings
                    </Link>
                    <Link
                      href="/privacy"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      <ShieldAlert className="h-4 w-4 text-slate-500" /> DPDP Privacy Notice
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={() => {
                        logout();
                        setProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
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
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-1.5 text-slate-900">
          <Link
            href="/projects"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-50"
          >
            Project Catalog
          </Link>

          {role === 'student' && (
            <>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-50"
              >
                My Dashboard
              </Link>
              <Link
                href="/my-projects"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-50"
              >
                My Projects
              </Link>
              <Link
                href="/submissions"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-50"
              >
                Submissions
              </Link>
              <Link
                href={`/portfolio/${user?.username || 'aarav_maker'}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-50"
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
                className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-50"
              >
                Teacher Dashboard
              </Link>
              <Link
                href="/teacher/classes"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-50"
              >
                Classes
              </Link>
              <Link
                href="/teacher/assignments"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-50"
              >
                Assignments
              </Link>
              <Link
                href="/teacher/reviews"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-50"
              >
                Rubric Reviews
              </Link>
            </>
          )}

          {role === 'school_admin' && (
            <>
              <Link
                href="/school/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-50"
              >
                School Dashboard
              </Link>
              <Link
                href="/school/students"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-50"
              >
                Students Roster
              </Link>
              <Link
                href="/school/reports"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-50"
              >
                ATL Analytics
              </Link>
            </>
          )}

          {role === 'admin' && (
            <>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-50"
              >
                Admin Hub
              </Link>
              <Link
                href="/admin/projects"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-50"
              >
                Catalog Management
              </Link>
            </>
          )}

          <div className="pt-2 border-t border-slate-100">
            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-blue-600 hover:bg-blue-50"
            >
              Plans & Pricing
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
