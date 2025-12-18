
import 'dotenv/config';
import { PrismaClient, Role, WidgetType, Layout, Flow } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const connectionString = `${process.env.DATABASE_URL}`;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const isProd = process.env.NODE_ENV === 'production';

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

    const orgName = 'iDegin Technologies';
    let org = await prisma.organization.findFirst({
        where: { name: orgName }
    });

    if (!org) {
        org = await prisma.organization.create({
            data: {
                name: orgName,
            }
        });
        console.log(`Created organization: ${orgName}`);
    }

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

    if (!isProd) {
        console.log("Seeding Dev Data...");

        const projectName = 'Acme Inc';
        let project = await prisma.project.findFirst({
            where: {
                organizationId: org!.id,
                name: projectName
            }
        });

        if (!project) {
            project = await prisma.project.create({
                data: {
                    name: projectName,
                    organizationId: org!.id
                }
            });
            console.log(`Created project: ${projectName}`);
        }

        const websiteTitle = 'Demo Website';
        let website = await prisma.website.findFirst({
            where: {
                projectId: project.id,
                slug: 'demo-website'
            }
        });

        if (!website) {
            website = await prisma.website.create({
                data: {
                    title: websiteTitle,
                    description: 'A comprehensive demo website',
                    slug: 'demo-website',
                    projectId: project.id,
                    createdBy: orgUser!.id,
                    updatedBy: orgUser!.id
                }
            });
            console.log(`Created website: ${websiteTitle}`);
        }

        const domainName = 'demo.mortar.com';
        const existingDomain = await prisma.domain.findFirst({ where: { domain: domainName } });
        if (!existingDomain) {
            await prisma.domain.create({
                data: {
                    domain: domainName,
                    websiteId: website.id,
                    projectId: project.id,
                    organizationId: org!.id
                }
            });
            console.log(`Created domain: ${domainName}`);
        }

        const pageName = 'Home Page';
        let page = await prisma.page.findFirst({
            where: {
                projectId: project.id,
                slug: 'home'
            }
        });

        if (!page) {
            page = await prisma.page.create({
                data: {
                    name: pageName,
                    slug: 'home',
                    projectId: project.id,
                    createdBy: orgUser!.id,
                    updatedBy: orgUser!.id
                }
            });
            console.log(`Created page: ${pageName}`);
        }

        let heroSection = await prisma.pageSection.findFirst({
            where: {
                pageId: page.id,
                slug: 'hero-section'
            }
        });

        if (!heroSection) {
            heroSection = await prisma.pageSection.create({
                data: {
                    heading: 'Welcome to Mortar',
                    subheading: 'Build amazing things',
                    slug: 'hero-section',
                    order: 0,
                    layout: Layout.ONE_COLUMN,
                    pageId: page.id,
                    projectId: project.id,
                    createdBy: orgUser!.id,
                    updatedBy: orgUser!.id
                }
            });
            console.log(`Created section: Hero`);
        }

        const existingWidget = await prisma.pageSectionWidget.findFirst({
            where: {
                sectionId: heroSection.id,
                order: 0
            }
        });

        if (!existingWidget) {
            await prisma.pageSectionWidget.create({
                data: {
                    type: WidgetType.HERO,
                    order: 0,
                    flow: Flow.VERTICAL,
                    limit: 1,
                    sectionId: heroSection.id,
                    createdBy: orgUser!.id,
                    updatedBy: orgUser!.id
                }
            });
            console.log(`Created widget: Hero Widget`);
        }
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
