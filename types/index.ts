
type Organization = {

}

type OrganizationUser = {

}

type Project = {

}

type Page = {
    id: string;
    name: string;
    slug: string;
    project: Project;

    createBy: OrganizationUser;
    updatedBy: OrganizationUser;
    created_at: Date;
    updated_at: Date;
}

type Domain = {
    id: string;
    domain: string;
    website: Website;
    project: Project;
    organization: Organization;
}

type Website = {
    id: string;
    title: string;
    description: string;
    slug: string;
    faviconURL: string | null;
    logoURL: string | null;
    keywords: string | null;

    createBy: OrganizationUser;
    updatedBy: OrganizationUser;
    created_at: Date;
    updated_at: Date;
}

type PageSection = {
    id: string;

    heading: string | null;
    subheading: string | null;
    description: string | null;
    slug: string;

    page: Page;
    order: number;
    project: Project;
    layout: 'one-column' | 'two-column' | 'three-column';

    createBy: OrganizationUser;
    updatedBy: OrganizationUser;
    created_at: Date;
    updated_at: Date;
}

type WidgetType =
    "text" |
    "button" |
    "link" |

    // --- dynamic from cms ///
    "event" |
    "people" |
    "testimonial" |
    "pricing" |
    "blog" |
    "news" |
    "resource" |
    "product" |
    "service" |

    // ---
    "file" |
    "hero" |
    "rich-text" | // HTML string output
    "form" |
    "table" |
    "faq" |
    "contact" |
    "cta" |
    "stack" | // to stack other widgets within the widget
    "coming-soon" |
    "footer" |
    "header" |
    "embedding" |
    "coming-soon";

type PageSectionWidget = {
    id: string;

    section: PageSection;
    type: WidgetType;
    order: number;
    widget: PageSectionWidget | null;

    //config
    flow: 'horizontal' | 'vertical';
    limit: number;
    orderBy: string;
    orderDirection: 'asc' | 'desc';
    height: number;


    createBy: OrganizationUser;
    updatedBy: OrganizationUser;
    created_at: Date;
    updated_at: Date;
}

type CMSEntry = {
    id: string;
    title: string;
    slug: string;
    order: number;
    images: OrganizationFile[],

    startDate: Date;
    endDate: Date;

    createBy: OrganizationUser;
    updatedBy: OrganizationUser;
    created_at: Date;
    updated_at: Date;
}

type OrganizationFile = {

}

type Category = {
    id: string;
    name: string;
    slug: string;
    color: string;
    order: number;

    createBy: OrganizationUser;
    updatedBy: OrganizationUser;
    organization: Organization;
    created_at: Date;
    updated_at: Date;
}
