import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { getCurrentUser } from '@/lib/auth.lib';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function GET(req: Request) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const subdomain = searchParams.get('subdomain');

        if (!subdomain) {
            return NextResponse.json({ error: 'Subdomain parameter is required' }, { status: 400 });
        }

        const website = await prisma.website.findUnique({
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

        if (!website) {
            return NextResponse.json({ error: 'Website not found' }, { status: 404 });
        }

        const project = website.project;

        return NextResponse.json({
            project: {
                ...project,
                website: {
                    ...website,
                    domains: website.domains
                }
            }
        });
    } catch (error) {
        console.error('Project fetch error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

