'use server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export async function verifyToken() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) {
        return false;
    }

    try {
        jwt.verify(token.value, JWT_SECRET);
        return true;
    } catch (error) {
        return false;
    }
}

export async function getCurrentUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) {
        return null;
    }

    try {
        const decoded = jwt.verify(token.value, JWT_SECRET) as { userId: string, email: string };

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            include: {
                organizationUsers: {
                    include: {
                        organization: true
                    }
                }
            }
        });

        return user;
    } catch (error) {
        return null;
    }
}
