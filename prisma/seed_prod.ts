import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

export async function seedProd(prisma: PrismaClient) {
    // 1. Create Prod User
    const prodEmail = 'ideginmedia@gmail.com';
    const prodPassword = 'Superman6625*';
    const hashedPassword = await bcrypt.hash(prodPassword, 10);

    let user = await prisma.user.findUnique({
        where: { email: prodEmail }
    });

    if (!user) {
        user = await prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    email: prodEmail,
                    name: 'iDegin Media',
                },
            });

            await tx.userSecret.create({
                data: {
                    password: hashedPassword,
                    userId: newUser.id,
                },
            });

            return newUser;
        });
        console.log(`Created prod user: ${prodEmail}`);
    } else {
        console.log(`Prod user already exists: ${prodEmail}`);
    }

    // 2. Create Prod Org
    const orgName = 'iDegin Technologies';
    let org = await prisma.organization.findFirst({
        where: { name: orgName }
    });

    if (!org) {
        org = await prisma.organization.create({
            data: {
                name: orgName,
                ownerId: user.id // Set owner
            }
        });
        console.log(`Created organization: ${orgName}`);
    } else if (!org.ownerId) {
        // Fix missing owner if existing
        await prisma.organization.update({
            where: { id: org.id },
            data: { ownerId: user.id }
        });
    }

    // 3. Link User to Org
    let orgUser = await prisma.organizationUser.findUnique({
        where: {
            userId_organizationId: {
                userId: user.id,
                organizationId: org.id
            }
        }
    });

    if (!orgUser) {
        orgUser = await prisma.organizationUser.create({
            data: {
                userId: user.id,
                organizationId: org.id,
                role: Role.OWNER
            },
        });
        console.log(`Linked user to organization as OWNER`);
    }

    return { user, org, orgUser };
}
