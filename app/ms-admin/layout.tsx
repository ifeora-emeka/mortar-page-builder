'use client';

import { useAuth } from '../../context/auth.context';
import Login from '@/components/auth/login';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return <>{children}</>;
}

