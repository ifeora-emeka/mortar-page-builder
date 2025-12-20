'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, OrganizationUser, Organization } from '@prisma/client';

export type OrganizationUserWithOrg = OrganizationUser & { organization: Organization };

export type AuthState = {
  user: User | null;
  orgUsers: OrganizationUserWithOrg[];
  subdomain: string | null;
};

const AuthContext = createContext<AuthState>({ user: null, orgUsers: [], subdomain: null });

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children, initialData }: { children: ReactNode, initialData: AuthState }) => {
  const [state, setState] = useState<AuthState>(initialData);

  useEffect(() => {
    const host = window.location.host;
    const parts = host.split('.');
    const subdomain = parts.length > 2 && parts[0] !== 'www' ? parts[0] : null;
    setState(prev => ({ ...prev, subdomain }));
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};