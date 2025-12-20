import { PrismaClient, WidgetType, Flow, User, Organization, OrganizationUser } from '@prisma/client';

export async function seedDev(prisma: PrismaClient, user: User, org: Organization, orgUser: OrganizationUser) {
    console.log("Seeding Dev Data...");

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
            subdomain: 'demo'
        }
    });

    if (!website) {
        website = await prisma.website.create({
            data: {
                title: websiteTitle,
                description: 'A comprehensive demo website',
                subdomain: 'demo',
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

    const existingInstances = await prisma.pageSectionInstance.findMany({
        where: { projectId: project.id }
    });

    if (existingInstances.length > 0) {
        await prisma.pageSectionInstance.deleteMany({
            where: { projectId: project.id }
        });
    }

    const existingSections = await prisma.pageSection.findMany({
        where: { projectId: project.id }
    });

    if (existingSections.length > 0) {
        const sectionIds = existingSections.map(s => s.id);
        await prisma.pageSectionWidget.deleteMany({
            where: { sectionId: { in: sectionIds } }
        });
        await prisma.pageSection.deleteMany({
            where: { projectId: project.id }
        });
    }

    const heroSection = await prisma.pageSection.create({
        data: {
            name: 'Hero Section',
            description: 'Welcome visitors with an impactful hero section that showcases your brand and value proposition.',
            slug: 'hero-section',
            projectId: project.id,
            createdBy: orgUser.id,
            updatedBy: orgUser.id
        }
    });

    const heroTextWidget = await prisma.pageSectionWidget.create({
        data: {
            type: WidgetType.RICH_TEXT,
            flow: Flow.VERTICAL,
            order: 0,
            limit: 1,
            textContent: 'Welcome to our platform. We build amazing digital experiences that help businesses grow and succeed in the modern world.',
            sectionId: heroSection.id,
            createdBy: orgUser.id,
            updatedBy: orgUser.id
        }
    });

    const heroButtonStack = await prisma.pageSectionWidget.create({
        data: {
            type: WidgetType.STACK,
            flow: Flow.HORIZONTAL,
            order: 1,
            sectionId: heroSection.id,
            createdBy: orgUser.id,
            updatedBy: orgUser.id
        }
    });

    await prisma.pageSectionWidget.create({
        data: {
            type: WidgetType.BUTTON,
            flow: Flow.HORIZONTAL,
            order: 0,
            textContent: 'Get Started',
            sectionId: heroSection.id,
            parentId: heroButtonStack.id,
            createdBy: orgUser.id,
            updatedBy: orgUser.id
        }
    });

    await prisma.pageSectionWidget.create({
        data: {
            type: WidgetType.BUTTON,
            flow: Flow.HORIZONTAL,
            order: 1,
            textContent: 'Learn More',
            sectionId: heroSection.id,
            parentId: heroButtonStack.id,
            createdBy: orgUser.id,
            updatedBy: orgUser.id
        }
    });

    const featuresSection = await prisma.pageSection.create({
        data: {
            name: 'Features',
            description: 'Highlight your key features and benefits to help visitors understand what makes you unique.',
            slug: 'features',
            projectId: project.id,
            createdBy: orgUser.id,
            updatedBy: orgUser.id
        }
    });

    const featuresStack = await prisma.pageSectionWidget.create({
        data: {
            type: WidgetType.STACK,
            flow: Flow.HORIZONTAL,
            order: 0,
            limit: 3,
            textContent: 'Our platform offers powerful features including real-time collaboration, advanced analytics, and seamless integrations.',
            sectionId: featuresSection.id,
            createdBy: orgUser.id,
            updatedBy: orgUser.id
        }
    });

    await prisma.pageSectionWidget.create({
        data: {
            type: WidgetType.RICH_TEXT,
            flow: Flow.VERTICAL,
            order: 0,
            textContent: 'Real-time Collaboration',
            sectionId: featuresSection.id,
            parentId: featuresStack.id,
            createdBy: orgUser.id,
            updatedBy: orgUser.id
        }
    });

    await prisma.pageSectionWidget.create({
        data: {
            type: WidgetType.RICH_TEXT,
            flow: Flow.VERTICAL,
            order: 1,
            textContent: 'Advanced Analytics',
            sectionId: featuresSection.id,
            parentId: featuresStack.id,
            createdBy: orgUser.id,
            updatedBy: orgUser.id
        }
    });

    await prisma.pageSectionWidget.create({
        data: {
            type: WidgetType.RICH_TEXT,
            flow: Flow.VERTICAL,
            order: 2,
            textContent: 'Seamless Integrations',
            sectionId: featuresSection.id,
            parentId: featuresStack.id,
            createdBy: orgUser.id,
            updatedBy: orgUser.id
        }
    });

    const servicesSection = await prisma.pageSection.create({
        data: {
            name: 'Services',
            description: 'Showcase the services you offer to potential customers.',
            slug: 'services',
            projectId: project.id,
            createdBy: orgUser.id,
            updatedBy: orgUser.id
        }
    });

    const servicesStack = await prisma.pageSectionWidget.create({
        data: {
            type: WidgetType.STACK,
            flow: Flow.VERTICAL,
            order: 0,
            limit: 6,
            textContent: 'We provide comprehensive services including web development, mobile app creation, cloud infrastructure, and digital marketing solutions.',
            sectionId: servicesSection.id,
            createdBy: orgUser.id,
            updatedBy: orgUser.id
        }
    });

    await prisma.pageSectionWidget.create({
        data: {
            type: WidgetType.SERVICE,
            flow: Flow.VERTICAL,
            order: 0,
            textContent: 'Web Development',
            sectionId: servicesSection.id,
            parentId: servicesStack.id,
            createdBy: orgUser.id,
            updatedBy: orgUser.id
        }
    });

    await prisma.pageSectionWidget.create({
        data: {
            type: WidgetType.SERVICE,
            flow: Flow.VERTICAL,
            order: 1,
            textContent: 'Mobile App Creation',
            sectionId: servicesSection.id,
            parentId: servicesStack.id,
            createdBy: orgUser.id,
            updatedBy: orgUser.id
        }
    });

    await prisma.pageSectionWidget.create({
        data: {
            type: WidgetType.SERVICE,
            flow: Flow.VERTICAL,
            order: 2,
            textContent: 'Cloud Infrastructure',
            sectionId: servicesSection.id,
            parentId: servicesStack.id,
            createdBy: orgUser.id,
            updatedBy: orgUser.id
        }
    });

    const testimonialsSection = await prisma.pageSection.create({
        data: {
            name: 'Testimonials',
            description: 'Build trust with social proof from satisfied customers.',
            slug: 'testimonials',
            projectId: project.id,
            createdBy: orgUser.id,
            updatedBy: orgUser.id
        }
    });

    await prisma.pageSectionWidget.create({
        data: {
            type: WidgetType.TESTIMONIAL,
            flow: Flow.HORIZONTAL,
            order: 0,
            limit: 4,
            textContent: 'Our clients love working with us. Here\'s what they have to say about their experience.',
            sectionId: testimonialsSection.id,
            createdBy: orgUser.id,
            updatedBy: orgUser.id
        }
    });

    const aboutUsSection = await prisma.pageSection.create({
        data: {
            name: 'About Us',
            description: 'Tell your story and share what drives your organization.',
            slug: 'about-us',
            projectId: project.id,
            createdBy: orgUser.id,
            updatedBy: orgUser.id
        }
    });

    await prisma.pageSectionWidget.create({
        data: {
            type: WidgetType.RICH_TEXT,
            flow: Flow.VERTICAL,
            order: 0,
            limit: 1,
            textContent: 'We are a team of passionate professionals dedicated to creating innovative solutions that make a difference. Founded in 2020, we have been helping businesses transform their digital presence and achieve their goals.',
            sectionId: aboutUsSection.id,
            createdBy: orgUser.id,
            updatedBy: orgUser.id
        }
    });

    const missionSection = await prisma.pageSection.create({
        data: {
            name: 'Our Mission',
            description: 'Communicate your mission and the values that guide your work.',
            slug: 'our-mission',
            projectId: project.id,
            createdBy: orgUser.id,
            updatedBy: orgUser.id
        }
    });

    await prisma.pageSectionWidget.create({
        data: {
            type: WidgetType.RICH_TEXT,
            flow: Flow.VERTICAL,
            order: 0,
            limit: 1,
            textContent: 'Our mission is to empower businesses with cutting-edge technology and exceptional service. We believe in transparency, innovation, and building lasting relationships with our clients.',
            sectionId: missionSection.id,
            createdBy: orgUser.id,
            updatedBy: orgUser.id
        }
    });

    const teamSection = await prisma.pageSection.create({
        data: {
            name: 'Our Team',
            description: 'Introduce the people behind your organization.',
            slug: 'our-team',
            projectId: project.id,
            createdBy: orgUser.id,
            updatedBy: orgUser.id
        }
    });

    await prisma.pageSectionWidget.create({
        data: {
            type: WidgetType.PEOPLE,
            flow: Flow.HORIZONTAL,
            order: 0,
            limit: 8,
            textContent: 'Meet the talented individuals who make our company great. Our diverse team brings together expertise from various fields to deliver outstanding results.',
            sectionId: teamSection.id,
            createdBy: orgUser.id,
            updatedBy: orgUser.id
        }
    });

    const faqSection = await prisma.pageSection.create({
        data: {
            name: 'Frequently Asked Questions',
            description: 'Answer common questions visitors might have about your organization.',
            slug: 'faq',
            projectId: project.id,
            createdBy: orgUser.id,
            updatedBy: orgUser.id
        }
    });

    await prisma.pageSectionWidget.create({
        data: {
            type: WidgetType.FAQ,
            flow: Flow.VERTICAL,
            order: 0,
            limit: 10,
            textContent: 'Have questions? We\'ve compiled answers to the most commonly asked questions about our services, pricing, and how we work.',
            sectionId: faqSection.id,
            createdBy: orgUser.id,
            updatedBy: orgUser.id
        }
    });

    let homePage = await prisma.page.findUnique({
        where: {
            slug_projectId: {
                slug: 'home',
                projectId: project.id
            }
        }
    });

    if (!homePage) {
        homePage = await prisma.page.create({
            data: {
                name: 'Home',
                slug: 'home',
                projectId: project.id,
                createdBy: orgUser.id,
                updatedBy: orgUser.id
            }
        });
        console.log(`Created page: Home`);
    }

    await prisma.pageSectionInstance.create({
        data: {
            pageId: homePage.id,
            sectionId: heroSection.id,
            order: 0,
            projectId: project.id,
            createdBy: orgUser.id,
            updatedBy: orgUser.id
        }
    });

    await prisma.pageSectionInstance.create({
        data: {
            pageId: homePage.id,
            sectionId: featuresSection.id,
            order: 1,
            projectId: project.id,
            createdBy: orgUser.id,
            updatedBy: orgUser.id
        }
    });

    await prisma.pageSectionInstance.create({
        data: {
            pageId: homePage.id,
            sectionId: servicesSection.id,
            order: 2,
            projectId: project.id,
            createdBy: orgUser.id,
            updatedBy: orgUser.id
        }
    });

    await prisma.pageSectionInstance.create({
        data: {
            pageId: homePage.id,
            sectionId: testimonialsSection.id,
            order: 3,
            projectId: project.id,
            createdBy: orgUser.id,
            updatedBy: orgUser.id
        }
    });

    let aboutPage = await prisma.page.findUnique({
        where: {
            slug_projectId: {
                slug: 'about',
                projectId: project.id
            }
        }
    });

    if (!aboutPage) {
        aboutPage = await prisma.page.create({
            data: {
                name: 'About',
                slug: 'about',
                projectId: project.id,
                createdBy: orgUser.id,
                updatedBy: orgUser.id
            }
        });
        console.log(`Created page: About`);
    }

    await prisma.pageSectionInstance.create({
        data: {
            pageId: aboutPage.id,
            sectionId: heroSection.id,
            order: 0,
            projectId: project.id,
            createdBy: orgUser.id,
            updatedBy: orgUser.id
        }
    });

    await prisma.pageSectionInstance.create({
        data: {
            pageId: aboutPage.id,
            sectionId: aboutUsSection.id,
            order: 1,
            projectId: project.id,
            createdBy: orgUser.id,
            updatedBy: orgUser.id
        }
    });

    await prisma.pageSectionInstance.create({
        data: {
            pageId: aboutPage.id,
            sectionId: missionSection.id,
            order: 2,
            projectId: project.id,
            createdBy: orgUser.id,
            updatedBy: orgUser.id
        }
    });

    await prisma.pageSectionInstance.create({
        data: {
            pageId: aboutPage.id,
            sectionId: teamSection.id,
            order: 3,
            projectId: project.id,
            createdBy: orgUser.id,
            updatedBy: orgUser.id
        }
    });

    await prisma.pageSectionInstance.create({
        data: {
            pageId: aboutPage.id,
            sectionId: faqSection.id,
            order: 4,
            projectId: project.id,
            createdBy: orgUser.id,
            updatedBy: orgUser.id
        }
    });

    console.log("Seed completed successfully!");
}
