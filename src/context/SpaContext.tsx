import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Service, Booking, User, TimeSlot } from '../types';

interface SpaContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string, isStaff?: boolean) => Promise<boolean>;
}

const SpaContext = createContext<SpaContextType | undefined>(undefined);

export const SpaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Auth functions
  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login for demo
    if (email && password) {
      setCurrentUser({
        id: '1',
        name: 'John Doe',
        email,
        isStaff: email.includes('staff'),
        preferences: {},
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const register = async (
    name: string, 
    email: string, 
    password: string, 
    isStaff = false
  ): Promise<boolean> => {
    // Mock registration for demo
    if (name && email && password) {
      setCurrentUser({
        id: '2',
        name,
        email,
        isStaff,
        preferences: {},
      });
      return true;
    }
    return false;
  };



  const value = {
    currentUser,
    login,
    logout,
    register,
  };

  return <SpaContext.Provider value={value}>{children}</SpaContext.Provider>;
};

export const useSpa = (): SpaContextType => {
  const context = useContext(SpaContext);
  if (context === undefined) {
    throw new Error('useSpa must be used within a SpaProvider');
  }
  return context;
};