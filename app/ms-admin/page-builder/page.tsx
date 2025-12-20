import { getDomainInfo } from '@/lib/domain.lib';
import { getPageDataByRoute } from '@/lib/page.lib';
import PageRenderer from '@/components/page-renderer/page-renderer';

export default async function PageBuilder() {
  const { subdomain, domain } = await getDomainInfo();
  const hasCustomDomain = !subdomain && domain && domain !== 'localhost:3000';
  const hasSubdomain = subdomain && subdomain !== 'www';

  if (!hasSubdomain && !hasCustomDomain) {
    return <div>Please access this page from a project subdomain</div>;
  }

  const route = '/';

  try {
    const pageData = await getPageDataByRoute(route);
    return (
      <div className="min-h-screen p-8">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Page Builder</h1>
          <p className="text-muted-foreground">Edit mode enabled</p>
        </div>
        <PageRenderer
          page={pageData.page}
          sections={pageData.sections || []}
          sectionInstances={pageData.sectionInstances}
          widgets={pageData.widgets || []}
          editMode={true}
        />
      </div>
    );
  } catch (error) {
    console.error('Failed to fetch page data:', error);
    return <div>Page not found: {error instanceof Error ? error.message : 'Unknown error'}</div>;
  }
}

