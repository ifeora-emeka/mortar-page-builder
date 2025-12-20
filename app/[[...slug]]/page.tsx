import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth.lib';
import { fetchWithCookies } from '@/lib/api.lib';
import { getDomainInfo } from '@/lib/domain.lib';
import { getPageDataByRoute } from '@/lib/page.lib';
import { OrgProjects } from '@/components/org-projects/org-projects';
import PageRenderer from '@/components/page-renderer/page-renderer';

export default async function DynamicPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ org?: string }>;
}) {
  const { subdomain, domain } = await getDomainInfo();

  const hasCustomDomain = !subdomain && domain && domain !== 'localhost:3000';
  const hasSubdomain = subdomain && subdomain !== 'www';

  if (!hasSubdomain && !hasCustomDomain) {
    const user = await getCurrentUser();

    if (!user) {
      return <OrgProjects />;
    }

    const searchParamsResolved = await searchParams;
    const orgUsers = user.organizationUsers.map(ou => ({
      ...ou,
      organization: ou.organization,
    }));

    const selectedOrgId = searchParamsResolved.org || orgUsers[0]?.organizationId;

    if (!selectedOrgId) {
      return <OrgProjects orgUsers={orgUsers} projects={[]} selectedOrgId="" />;
    }

    const orgUser = orgUsers.find(ou => ou.organizationId === selectedOrgId);

    if (!orgUser) {
      redirect('/');
    }

    let projects = [];
    try {
      const projectsData = await fetchWithCookies(
        `/api/private/projects?organizationId=${selectedOrgId}`
      );
      projects = projectsData.projects || [];
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }

    return (
      <OrgProjects
        orgUsers={orgUsers}
        projects={projects}
        selectedOrgId={selectedOrgId}
      />
    );
  }

  const resolvedParams = await params;
  const slugArray = resolvedParams.slug || [];
  const route = slugArray.length > 0 ? `/${slugArray.join('/')}` : '/';

  try {
    const pageData = await getPageDataByRoute(route);
    return (
      <PageRenderer
        page={pageData.page}
        sections={pageData.sections || []}
        sectionInstances={pageData.sectionInstances}
        widgets={pageData.widgets || []}
        editMode={false}
      />
    );
  } catch (error) {
    console.error('Failed to fetch page data:', error);
    return <div>Page not found: {error instanceof Error ? error.message : 'Unknown error'}</div>;
  }
}

