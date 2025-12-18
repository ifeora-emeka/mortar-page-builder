
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { seedProd } from './seed_prod';
import { seedDev } from './seed_dev';

const connectionString = `${process.env.DATABASE_URL}`;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const isProd = process.env.NODE_ENV === 'production';

    // Always run prod seed to ensure basic admin user and org exist
    const { user, org, orgUser } = await seedProd(prisma);

    if (!isProd) {
        await seedDev(prisma, user, org, orgUser);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
