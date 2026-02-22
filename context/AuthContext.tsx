
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Role } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: Role) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple hash simulation
const mockHash = (str: string) => btoa(str + "ac_salt_2024");

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Seed test accounts if they don't exist
    const usersJson = localStorage.getItem('ac_users');
    let users: User[] = usersJson ? JSON.parse(usersJson) : [];

    const testAccounts: User[] = [
      {
        id: 'admin-seed',
        name: 'System Administrator',
        email: 'admin@admin.edu',
        role: 'ADMIN',
        passwordHash: mockHash('admin@12313'),
        createdAt: new Date().toISOString()
      },
      {
        id: 'student-seed',
        name: 'Senior Researcher',
        email: 'student@student.edu',
        role: 'RESEARCHER',
        passwordHash: mockHash('student@12313'),
        createdAt: new Date().toISOString()
      }
    ];

    let updated = false;
    testAccounts.forEach(testAcc => {
      if (!users.some(u => u.email === testAcc.email)) {
        users.push(testAcc);
        updated = true;
      }
    });

    if (updated) {
      localStorage.setItem('ac_users', JSON.stringify(users));
    }

    // 2. Check for active session
    const session = localStorage.getItem('ac_session');
    if (session) {
      setUser(JSON.parse(session));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const usersJson = localStorage.getItem('ac_users');
    const users: User[] = usersJson ? JSON.parse(usersJson) : [];
    
    const foundUser = users.find(u => u.email === email && u.passwordHash === mockHash(password));
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('ac_session', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string, role: Role): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const usersJson = localStorage.getItem('ac_users');
    const users: User[] = usersJson ? JSON.parse(usersJson) : [];
    
    if (users.some(u => u.email === email)) {
      return false; // Email exists
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role,
      passwordHash: mockHash(password),
      createdAt: new Date().toISOString()
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem('ac_users', JSON.stringify(updatedUsers));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ac_session');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
