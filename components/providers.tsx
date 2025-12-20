'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/lib/query-client';
import { AuthProvider, AuthState } from '@/app/context/auth.context';

export function Providers({ children, initialAuthData }: { children: React.ReactNode, initialAuthData: AuthState }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider initialData={initialAuthData}>
        {children}
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}