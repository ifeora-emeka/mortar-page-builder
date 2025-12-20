'use server';

import { headers } from 'next/headers';

export async function getDomainInfo() {
  const host = (await headers()).get('host') || '';
  const parts = host.split('.');
  let subdomain = null;
  let domain = host;
  if (parts.length > 2 && parts[0] !== 'www') {
    subdomain = parts[0];
    domain = parts.slice(1).join('.');
  } else if (parts.length === 2 && parts[0] === 'www') {
    subdomain = 'www';
    domain = parts[1];
  }
  return { subdomain, domain, host };
}