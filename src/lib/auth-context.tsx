'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '@/types';
import { SEED_USERS } from './data';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, role?: UserRole) => Promise<boolean>;
  signup: (userData: Partial<UserProfile>) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ROLE_USER_MAP: Record<UserRole, string> = {
  student: 'usr-student-1',
  teacher: 'usr-teacher-1',
  school_admin: 'usr-school-admin-1',
  admin: 'usr-admin-1'
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check saved session in localStorage
    const savedUserId = typeof window !== 'undefined' ? localStorage.getItem('kite_user_id') : null;
    if (savedUserId && SEED_USERS[savedUserId]) {
      setUser(SEED_USERS[savedUserId]);
    } else {
      // Default to student for realistic STEM maker exploration
      setUser(SEED_USERS['usr-student-1']);
      if (typeof window !== 'undefined') {
        localStorage.setItem('kite_user_id', 'usr-student-1');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, targetRole?: UserRole): Promise<boolean> => {
    setIsLoading(true);
    let matchedUser = Object.values(SEED_USERS).find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!matchedUser && targetRole && ROLE_USER_MAP[targetRole]) {
      matchedUser = SEED_USERS[ROLE_USER_MAP[targetRole]];
    }

    if (!matchedUser) {
      // If user isn't in seed list, create a virtual active student profile
      const newId = `usr-${Date.now()}`;
      const virtualUser: UserProfile = {
        id: newId,
        email,
        full_name: email.split('@')[0],
        username: email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '_'),
        role: targetRole || 'student',
        is_active: true,
        created_at: new Date().toISOString()
      };
      SEED_USERS[newId] = virtualUser;
      matchedUser = virtualUser;
    }

    setUser(matchedUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kite_user_id', matchedUser.id);
    }
    setIsLoading(false);
    return true;
  };

  const signup = async (userData: Partial<UserProfile>): Promise<boolean> => {
    setIsLoading(true);
    const newId = `usr-${Date.now()}`;
    const newUser: UserProfile = {
      id: newId,
      email: userData.email || 'user@kite.test',
      full_name: userData.full_name || 'Maker Student',
      username: userData.username || `maker_${Date.now()}`,
      role: userData.role || 'student',
      grade_level: userData.grade_level,
      school_id: userData.school_id,
      parent_email: userData.parent_email,
      is_active: true,
      created_at: new Date().toISOString()
    };

    SEED_USERS[newId] = newUser;
    setUser(newUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kite_user_id', newId);
    }
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('kite_user_id');
    }
  };

  const switchRole = (newRole: UserRole) => {
    const targetUserId = ROLE_USER_MAP[newRole];
    if (targetUserId && SEED_USERS[targetUserId]) {
      setUser(SEED_USERS[targetUserId]);
      if (typeof window !== 'undefined') {
        localStorage.setItem('kite_user_id', targetUserId);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'student',
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        switchRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
