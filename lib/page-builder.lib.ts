'use server';

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { getDomainInfo } from './domain.lib';
import { getCurrentUser } from './auth.lib';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function getPageBuilderData() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const { subdomain, domain } = await getDomainInfo();
  const hasCustomDomain = !subdomain && domain && domain !== 'localhost:3000';
  const hasSubdomain = subdomain && subdomain !== 'www';

  if (!hasSubdomain && !hasCustomDomain) {
    throw new Error('Subdomain or custom domain required');
  }

  let website = null;

  if (subdomain && subdomain !== 'www') {
    website = await prisma.website.findUnique({
      where: { subdomain },
      include: {
        domains: true,
        project: {
          include: {
            organization: true,
            pages: {
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
            }
          }
        }
      }
    });
  }

  if (!website && domain) {
    const domainRecord = await prisma.domain.findUnique({
      where: { domain },
      include: {
        website: {
          include: {
            domains: true,
            project: {
              include: {
                organization: true,
                pages: {
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
                }
              }
            }
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

  const project = website.project;
  const organizationId = project.organizationId;

  const orgUser = user.organizationUsers.find(
    ou => ou.organizationId === organizationId
  );

  if (!orgUser) {
    throw new Error('Access denied: You do not have access to this organization');
  }

  const pages = project.pages || [];
  
  const allSections = await prisma.pageSection.findMany({
    where: {
      projectId: project.id
    },
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
  });

  const allWidgets = allSections.flatMap(section => section.widgets);

  const colorVariables = await prisma.colorVariable.findMany({
    where: {
      websiteId: website.id
    },
    orderBy: [
      { slug: 'asc' },
      { strength: 'asc' }
    ]
  });

  return {
    website: {
      ...website,
      domains: website.domains
    },
    project: {
      ...project,
      organization: project.organization
    },
    pages,
    sections: allSections,
    widgets: allWidgets,
    colorVariables
  };
}

