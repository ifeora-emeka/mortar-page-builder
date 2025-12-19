import { PrismaClient, Role, WidgetType, Flow } from '@prisma/client';
import { faker } from '@faker-js/faker';

export async function seedDev(prisma: PrismaClient, user: any, org: any, orgUser: any) {
    console.log("Seeding Dev Data with Faker...");

    const projectName = 'Mortar Builder Demo';
    let project = await prisma.project.findFirst({
        where: {
            organizationId: org.id,
            name: projectName
        }
    });

    if (!project) {
        project = await prisma.project.create({
            data: {
                name: projectName,
                organizationId: org.id
            }
        });
        console.log(`Created project: ${projectName}`);
    }

    const websiteTitle = 'Demo Website';
    let website = await prisma.website.findUnique({
        where: {
            slug_projectId: {
                slug: 'demo-website',
                projectId: project.id
            }
        }
    });

    if (!website) {
        website = await prisma.website.create({
            data: {
                title: websiteTitle,
                description: 'A comprehensive demo website',
                slug: 'demo-website',
                projectId: project.id,
                createdBy: orgUser.id,
                updatedBy: orgUser.id
            }
        });
        console.log(`Created website: ${websiteTitle}`);
    }

    const domainName = 'demo.mortar.com';
    const existingDomain = await prisma.domain.findUnique({ where: { domain: domainName } });
    if (!existingDomain) {
        await prisma.domain.create({
            data: {
                domain: domainName,
                websiteId: website.id,
                projectId: project.id,
                organizationId: org.id
            }
        });
        console.log(`Created domain: ${domainName}`);
    }

    const pagesToCreate = 3;

    for (let i = 0; i < pagesToCreate; i++) {
        const pageName = i === 0 ? 'Home Page' : faker.commerce.department();
        const pageSlug = i === 0 ? 'home' : faker.helpers.slugify(pageName).toLowerCase();

        let page = await prisma.page.findUnique({
            where: {
                slug_projectId: {
                    slug: pageSlug,
                    projectId: project.id
                }
            }
        });

        if (!page) {
            page = await prisma.page.create({
                data: {
                    name: pageName,
                    slug: pageSlug,
                    projectId: project.id,
                    createdBy: orgUser.id,
                    updatedBy: orgUser.id
                }
            });
            console.log(`Created page: ${pageName}`);
        }

        const numSections = faker.number.int({ min: 3, max: 6 });

        for (let j = 0; j < numSections; j++) {
            const sectionName = faker.company.catchPhrase();
            const sectionSlug = faker.helpers.slugify(sectionName).toLowerCase() + `-${j}`;

            const section = await prisma.pageSection.create({
                data: {
                    name: sectionName,
                    description: faker.lorem.paragraph(),
                    slug: sectionSlug,
                    order: j,
                    pageId: page.id,
                    projectId: project.id,
                    createdBy: orgUser.id,
                    updatedBy: orgUser.id
                }
            });

            const numWidgets = faker.number.int({ min: 1, max: 4 });

            for (let k = 0; k < numWidgets; k++) {
                await prisma.pageSectionWidget.create({
                    data: {
                        type: faker.helpers.arrayElement(Object.values(WidgetType)),
                        order: k,
                        flow: faker.helpers.arrayElement([Flow.VERTICAL, Flow.HORIZONTAL]),
                        limit: 5,
                        sectionId: section.id,
                        createdBy: orgUser.id,
                        updatedBy: orgUser.id
                    }
                });
            }
        }
    }
}
