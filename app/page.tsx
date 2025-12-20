'use client';

import { useAuth } from './context/auth.context';
import Login from '@/components/auth/login';

export default function Home() {
  const { user, subdomain } = useAuth();

  if (subdomain) {
    return <div>Page renderer for {subdomain}</div>;
  }

  if (user) {
    return <div>Org projects</div>;
  }

  return <Login />;
}
