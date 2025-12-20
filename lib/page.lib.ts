'use server';

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { getDomainInfo } from './domain.lib';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function getPageDataByRoute(route: string) {
  const { subdomain, domain, host } = await getDomainInfo();

  console.log('[DEBUG] getPageDataByRoute:', { subdomain, domain, host, route });

  if (route.startsWith('/.well-known/') || route.startsWith('/favicon.ico') || route.startsWith('/_next/')) {
    throw new Error('System route');
  }

  let website = null;

  if (subdomain && subdomain !== 'www') {
    console.log('[DEBUG] Looking for website with subdomain:', subdomain);
    const websiteRecord = await (prisma.website.findUnique as any)({
      where: { subdomain },
      include: {
        domains: true
      }
    });
    console.log('[DEBUG] Found website:', websiteRecord ? websiteRecord.id : 'NOT FOUND');
    if (websiteRecord) {
      website = websiteRecord;
    } else {
      const allWebsites = await (prisma.website.findMany as any)({
        select: { id: true, subdomain: true, title: true }
      });
      console.log('[DEBUG] All websites in DB:', allWebsites);
    }
  }

  if (!website && domain) {
    const domainRecord = await prisma.domain.findFirst({
      where: { domain },
      include: {
        website: {
          include: {
            domains: true
          }
        }
      }
    });

    if (domainRecord) {
      website = domainRecord.website;
    }
  }

  if (!website) {
    throw new Error('Website not found');
  }

  const project = await prisma.project.findUnique({
    where: { id: (website as any).projectId },
    include: {
      organization: true
    }
  });

  if (!project) {
    throw new Error('Project not found');
  }

  if (route.startsWith('/content/')) {
    const routeParts = route.split('/').filter(Boolean);
    
    if (routeParts.length === 2) {
      const sections = await prisma.pageSection.findMany({
        where: {
          projectId: project.id,
          cmsEntryId: { not: null }
        },
        include: {
          cmsEntry: {
            include: {
              images: true
            }
          },
          widgets: {
            include: {
              children: true
            },
            orderBy: {
              order: 'asc'
            }
          }
        }
      });

      const cmsEntriesMap = new Map();
      sections.forEach(section => {
        if (section.cmsEntryId && section.cmsEntry) {
          if (!cmsEntriesMap.has(section.cmsEntryId)) {
            cmsEntriesMap.set(section.cmsEntryId, {
              ...section.cmsEntry,
              sections: []
            });
          }
          cmsEntriesMap.get(section.cmsEntryId).sections.push(section);
        }
      });

      const cmsEntries = Array.from(cmsEntriesMap.values());

      return {
        page: null,
        sections: [],
        widgets: [],
        website,
        organization: project.organization,
        cmsEntries
      };
    } else if (routeParts.length === 3) {
      const slug = routeParts[2];

      const sections = await prisma.pageSection.findMany({
        where: {
          projectId: project.id,
          cmsEntry: {
            slug
          }
        },
        include: {
          cmsEntry: {
            include: {
              images: true
            }
          },
          widgets: {
            include: {
              children: true
            },
            orderBy: {
              order: 'asc'
            }
          }
        }
      });

      const cmsEntry = sections[0]?.cmsEntry;

      if (!cmsEntry) {
        throw new Error('CMS entry not found');
      }

      const widgets = sections.flatMap(s => s.widgets);

      return {
        page: null,
        sections,
        widgets,
        website,
        organization: project.organization,
        cmsEntry
      };
    }
  }

  const pageSlug = route === '/' || route === '' ? 'home' : route.replace(/^\//, '');

  const page = await prisma.page.findUnique({
    where: {
      slug_projectId: {
        slug: pageSlug,
        projectId: project.id
      }
    },
    include: {
      sectionInstances: {
        include: {
          section: {
            include: {
              widgets: {
                include: {
                  children: {
                    orderBy: {
                      order: 'asc'
                    }
                  }
                },
                orderBy: {
                  order: 'asc'
                }
              }
            }
          }
        },
        orderBy: {
          order: 'asc'
        }
      }
    }
  });

  if (!page) {
    throw new Error('Page not found');
  }

  const sections = page.sectionInstances.map(instance => instance.section);
  const widgets = sections.flatMap(section => section.widgets);

  return {
    page,
    sections,
    sectionInstances: page.sectionInstances,
    widgets,
    website,
    organization: project.organization
  };
}

