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
        const organizationId = searchParams.get('organizationId');

        
        if (!organizationId) {
            return NextResponse.json({ error: 'organizationId parameter is required' }, { status: 400 });
        }
        
        const orgUser = user.organizationUsers.find(
            ou => ou.organizationId === organizationId
        );

        if (!orgUser) {
            return NextResponse.json({ error: 'Access denied to this organization' }, { status: 403 });
        }

        const projects = await prisma.project.findMany({
            where: {
                organizationId
            },
            include: {
                websites: {
                    select: {
                        id: true,
                        subdomain: true
                    }
                }
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });

        return NextResponse.json({ projects });
    } catch (error) {
        console.error('Projects fetch error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

