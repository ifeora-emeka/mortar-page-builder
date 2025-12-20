'use server';

import { headers } from 'next/headers';

export async function getDomainInfo() {
  const host = (await headers()).get('host') || '';
  const parts = host.split('.');
  let subdomain = null;
  let domain = host;
  
  if (parts.length > 1) {
    const firstPart = parts[0];
    if (firstPart === 'www') {
      subdomain = 'www';
      domain = parts.slice(1).join('.');
    } else if (!firstPart.includes('localhost') && !firstPart.includes(':')) {
      subdomain = firstPart;
      domain = parts.slice(1).join('.');
    }
  }
  
  console.log('[DEBUG] getDomainInfo:', { host, parts, subdomain, domain });
  
  return { subdomain, domain, host };
}