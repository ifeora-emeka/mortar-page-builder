'use server';

import { cookies, headers } from 'next/headers';

export async function fetchWithCookies(url: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  
  const headersList = await headers();
  const protocol = headersList.get('x-forwarded-proto') || 'http';
  const host = headersList.get('host') || 'localhost:3000';
  const absoluteUrl = url.startsWith('http') ? url : `${protocol}://${host}${url}`;

  const response = await fetch(absoluteUrl, {
    ...options,
    headers: {
      ...options.headers,
      Cookie: cookieHeader,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `Request failed with status ${response.status}`);
  }

  return response.json();
}

