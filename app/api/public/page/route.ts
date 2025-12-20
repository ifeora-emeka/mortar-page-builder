import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { getDomainInfo } from '@/lib/domain.lib';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const route = searchParams.get('route') || '/';

        if (route.startsWith('/.well-known/') || route.startsWith('/favicon.ico') || route.startsWith('/_next/')) {
            return NextResponse.json({ error: 'System route' }, { status: 404 });
        }

        const { subdomain, domain } = await getDomainInfo();

        let website = null;

        if (subdomain && subdomain !== 'www') {
            website = await prisma.website.findUnique({
                where: { subdomain },
                include: {
                    domains: true,
                    project: {
                        include: {
                            organization: true
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
                                    organization: true
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
            console.error('Website not found', { subdomain, domain });
            return NextResponse.json({ error: 'Website not found' }, { status: 404 });
        }

        const project = website.project;
        
        if (!project) {
            console.error('Project not found for website', website.id);
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        if (route.startsWith('/content/')) {
            const routeParts = route.split('/').filter(Boolean);
            
            if (routeParts.length === 2) {
                const contentType = routeParts[1];
                
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
                sections.forEach((section) => {
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

                return NextResponse.json({
                    page: null,
                    sections: [],
                    widgets: [],
                    website,
                    organization: project.organization,
                    cmsEntries
                });
            } else if (routeParts.length === 3) {
                const contentType = routeParts[1];
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
                    return NextResponse.json({ error: 'CMS entry not found' }, { status: 404 });
                }

                return NextResponse.json({
                    page: null,
                    sections,
                    widgets: sections.flatMap((s) => s.widgets),
                    website,
                    organization: project.organization,
                    cmsEntry
                });
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
            return NextResponse.json({ error: 'Page not found' }, { status: 404 });
        }

        const sections = page.sectionInstances.map(instance => instance.section);
        const widgets = sections.flatMap(section => section.widgets);

        return NextResponse.json({
            page,
            sections,
            sectionInstances: page.sectionInstances,
            widgets,
            website,
            organization: project.organization
        });
    } catch (error) {
        console.error('Page fetch error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

